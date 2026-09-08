/**
 * Persistent Consultation Thread & Session Management Store
 *
 * Implements Requirements 12, 13, 16, 17, and 31:
 * - Maintains conversation threads across user visits.
 * - Stores structured escalation records in Supabase (with resilient local fallback).
 * - Enables two-way communication between Visitor and Administrator (Marye).
 */

import { supabase, isSupabaseConfigured } from '../../data/supabaseClient.js';

const SESSION_TOKEN_KEY = 'marye_consultation_session_token';
const ACTIVE_THREAD_ID_KEY = 'marye_active_thread_id';
const LOCAL_THREADS_KEY = 'marye_local_consultation_threads';
const LOCAL_MESSAGES_KEY = 'marye_local_consultation_messages';

let inMemoryThreads = [];
let inMemoryMessages = [];
let inMemoryActiveThreadId = null;

export class ConsultationStore {
  /**
   * Retrieves or initializes a unique session token for anonymous visitors
   */
  static getSessionToken() {
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      return `sess_${Date.now()}_node_env`;
    }
    let token = sessionStorage.getItem(SESSION_TOKEN_KEY);
    if (!token) {
      token = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      sessionStorage.setItem(SESSION_TOKEN_KEY, token);
    }
    return token;
  }

  /**
   * Creates a new consultation thread in Supabase or local fallback
   */
  static async createThread(initialData = {}) {
    const sessionToken = this.getSessionToken();
    const threadPayload = {
      session_token: sessionToken,
      user_name: initialData.userName || null,
      email: initialData.email || null,
      organization: initialData.organization || null,
      request_category: initialData.requestCategory || 'Biomedical Engineering Consultation',
      detected_intent: initialData.detectedIntent || 'general_technical_inquiry',
      technical_domain: initialData.technicalDomain || 'Medical Devices',
      requested_equipment: initialData.requestedEquipment || null,
      user_objective: initialData.userObjective || 'General exploration',
      conversation_summary: initialData.conversationSummary || '',
      important_requirements: initialData.importantRequirements || [],
      questions_raised: initialData.questionsRaised || [],
      relevant_services: initialData.relevantServices || [],
      recommended_service: initialData.recommendedService || null,
      retrieved_sources: initialData.retrievedSources || [],
      evidence_status: initialData.evidenceStatus || 'UNVERIFIED',
      status: initialData.status || 'New',
      priority: initialData.priority || 'Normal',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('consultation_threads')
          .insert([threadPayload])
          .select()
          .single();

        if (!error && data) {
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(ACTIVE_THREAD_ID_KEY, data.id);
          }
          inMemoryActiveThreadId = data.id;
          return { success: true, thread: data };
        }
      } catch (err) {
        console.warn('Supabase createThread warning, using local fallback:', err);
      }
    }

    // Local fallback
    const localId = `thread_${Date.now()}`;
    const localThread = { id: localId, ...threadPayload };
    const threads = this.getLocalThreads();
    threads.unshift(localThread);
    this.saveLocalThreads(threads);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(ACTIVE_THREAD_ID_KEY, localId);
    }
    inMemoryActiveThreadId = localId;
    return { success: true, thread: localThread, isLocal: true };
  }

  /**
   * Appends a message to an existing consultation thread
   */
  static async appendMessage(threadId, senderType, messageText, metadata = {}) {
    if (!threadId) return { success: false, error: 'No threadId provided' };

    const messagePayload = {
      thread_id: threadId,
      sender_type: senderType, // 'user', 'ai', 'admin', 'system'
      message: messageText,
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    };

    const sessionToken = this.getSessionToken();

    if (isSupabaseConfigured && supabase) {
      try {
        const query = supabase
          .from('consultation_messages')
          .insert([messagePayload])
          .select();
        if (typeof query.setHeader === 'function') query.setHeader('x-session-token', sessionToken);
        const { data, error } = await query.single();

        if (!error && data) return { success: true, message: data };
      } catch (err) {
        console.warn('Supabase appendMessage warning:', err);
      }
    }

    // Local fallback
    const localMsgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const localMsg = { id: localMsgId, ...messagePayload };
    const allMsgs = this.getLocalMessages();
    allMsgs.push(localMsg);
    this.saveLocalMessages(allMsgs);
    return { success: true, message: localMsg, isLocal: true };
  }

  /**
   * Retrieves messages for a consultation thread
   */
  static async getThreadMessages(threadId) {
    if (!threadId) return [];
    const sessionToken = this.getSessionToken();

    if (isSupabaseConfigured && supabase) {
      try {
        const query = supabase
          .from('consultation_messages')
          .select('*')
          .eq('thread_id', threadId)
          .order('created_at', { ascending: true });
        if (typeof query.setHeader === 'function') query.setHeader('x-session-token', sessionToken);
        const { data, error } = await query;

        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getThreadMessages warning:', err);
      }
    }

    const allMsgs = this.getLocalMessages();
    return allMsgs.filter((m) => m.thread_id === threadId);
  }

  /**
   * Escalates an active conversation to Marye with full structured context (Requirement 13)
   */
  static async escalateToMarye(threadId, escalationData = {}) {
    const sessionToken = this.getSessionToken();
    let currentThreadId = threadId || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(ACTIVE_THREAD_ID_KEY) : inMemoryActiveThreadId);

    const updatePayload = {
      user_name: escalationData.userName || null,
      email: escalationData.email || null,
      organization: escalationData.organization || null,
      status: 'Awaiting Admin Review',
      conversation_summary: escalationData.conversationSummary || '',
      important_requirements: escalationData.importantRequirements || [],
      relevant_services: escalationData.relevantServices || [],
      recommended_service: escalationData.recommendedService || null,
      retrieved_sources: escalationData.retrievedSources || [],
      evidence_status: escalationData.evidenceStatus || 'UNVERIFIED',
      updated_at: new Date().toISOString(),
    };

    if (!currentThreadId) {
      const created = await this.createThread({
        ...updatePayload,
        status: 'Awaiting Admin Review',
      });
      currentThreadId = created.thread?.id;
    } else if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('consultation_threads')
          .update(updatePayload)
          .eq('id', currentThreadId);
      } catch (err) {
        console.warn('Supabase escalateToMarye update error:', err);
      }
    }

    // Also record an audit action
    if (isSupabaseConfigured && supabase && currentThreadId) {
      try {
        await supabase.from('consultation_actions').insert([
          {
            thread_id: currentThreadId,
            action_type: 'escalation_to_admin',
            performed_by: 'ai_assistant',
            payload: updatePayload,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (e) {
        // Optional audit
      }
    }

    return { success: true, threadId: currentThreadId };
  }

  /**
   * Polls or checks if Marye has reviewed and responded to this thread (Requirement 16)
   */
  static async checkAdminResponse(threadId) {
    if (!threadId) return null;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('consultation_threads')
          .select('id, status, admin_response, admin_responded_at')
          .eq('id', threadId)
          .single();

        if (!error && data && data.admin_response) {
          return {
            hasResponded: true,
            status: data.status,
            adminResponse: data.admin_response,
            respondedAt: data.admin_responded_at,
          };
        }
      } catch (err) {
        console.warn('Supabase checkAdminResponse warning:', err);
      }
    }

    const threads = this.getLocalThreads();
    const t = threads.find((item) => item.id === threadId);
    if (t && t.admin_response) {
      return {
        hasResponded: true,
        status: t.status,
        adminResponse: t.admin_response,
        respondedAt: t.admin_responded_at,
      };
    }

    return { hasResponded: false };
  }

  // Local Storage & Memory Store Helpers
  static getLocalThreads() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return inMemoryThreads;
    try {
      const parsed = JSON.parse(localStorage.getItem(LOCAL_THREADS_KEY) || '[]');
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : inMemoryThreads;
    } catch {
      return inMemoryThreads;
    }
  }

  static saveLocalThreads(threads) {
    inMemoryThreads = threads;
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_THREADS_KEY, JSON.stringify(threads));
    } catch (e) {
      console.warn(e);
    }
  }

  static getLocalMessages() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return inMemoryMessages;
    try {
      const parsed = JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '[]');
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : inMemoryMessages;
    } catch {
      return inMemoryMessages;
    }
  }

  static saveLocalMessages(messages) {
    inMemoryMessages = messages;
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn(e);
    }
  }
}

export default ConsultationStore;
