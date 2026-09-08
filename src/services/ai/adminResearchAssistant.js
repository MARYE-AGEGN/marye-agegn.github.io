/**
 * Admin Research Assistant & Investigation Engine
 *
 * Implements Requirements 14, 15, 28, and 29:
 * - Empowers Marye to "Investigate this request" inside the Admin Workspace.
 * - Cross-references requests against knowledge bases, standards, and technical documents.
 * - Generates structured investigation reports and unbinding draft responses.
 * - Dispatches Marye's approved responses back to the user thread.
 */

import { supabase, isSupabaseConfigured } from '../../data/supabaseClient.js';
import { defaultKnowledgeRetriever } from './knowledgeRetriever.js';
import { defaultServiceRouter } from './serviceRouter.js';
import { TechnicalSourceRetriever } from './technicalSourceRetriever.js';
import { ConsultationStore } from './consultationStore.js';

export class AdminResearchAssistant {
  /**
   * Conducts deep technical investigation on an escalated consultation thread (Requirement 15)
   */
  static async investigateRequest(thread, conversationMessages = []) {
    const query = `${thread.requested_equipment || ''} ${thread.user_objective || ''} ${thread.conversation_summary || ''} ${thread.user_name || ''}`;

    // 1. First-Party Knowledge Search
    const knowledgeMatch = defaultKnowledgeRetriever.searchKnowledge(query);

    // 2. Technical Documents & Catalog Retrieval
    const techSources = await TechnicalSourceRetriever.searchTechnicalDocuments(query);

    // 3. Recommended Services Analysis
    const services = defaultServiceRouter.routeRequest({
      detectedIntent: thread.detected_intent || 'general_technical_inquiry',
      technicalDomain: thread.technical_domain || 'Medical Devices',
      requestedEquipment: thread.requested_equipment,
      rawQuery: query,
    });

    // 4. Standards & Regulatory Mapping
    const applicableStandards = this.mapApplicableStandards(thread.technical_domain, thread.requested_equipment);

    // 5. Clinical & Operational Risks Identification
    const identifiedRisks = this.identifyTechnicalRisks(thread.technical_domain, thread.requested_equipment);

    // 6. Unanswered Questions / Information Gaps
    const missingInformation = this.identifyInformationGaps(thread);

    // 7. Draft Suggested Response for Marye
    const draftResponse = this.generateDraftResponse({
      thread,
      services,
      applicableStandards,
      missingInformation,
    });

    return {
      userIntent: thread.detected_intent || 'Technical Consultation',
      technicalDomain: thread.technical_domain || 'Biomedical Engineering',
      technicalProblem: thread.user_objective || 'Equipment specification and technical planning',
      relevantEvidence: techSources.catalogMatches.length > 0 ? 'Verified manufacturer catalog matches available' : 'Secondary or unverified specifications',
      applicableStandards,
      potentialRisks: identifiedRisks,
      unansweredQuestions: missingInformation,
      recommendedServices: services,
      suggestedResponse: draftResponse,
      sourcesConsulted: [
        { title: 'Marye Agegn Portfolio Knowledge Base (SSOT)', tier: 'Tier 1' },
        ...techSources.catalogMatches.map((m) => ({ title: `${m.manufacturer} ${m.model} Datasheet`, tier: 'Tier 1' })),
      ],
      investigatedAt: new Date().toISOString(),
    };
  }

  /**
   * Maps international engineering and medical device standards
   */
  static mapApplicableStandards(domain = '', equipment = '') {
    const standards = [
      { code: 'IEC 60601-1', name: 'Medical electrical equipment - General requirements for basic safety and essential performance' },
      { code: 'IEC 60601-1-2', name: 'Electromagnetic disturbances - Requirements and tests' },
    ];

    const lower = `${domain} ${equipment}`.toLowerCase();
    if (lower.includes('monitor') || lower.includes('vital signs')) {
      standards.push({ code: 'IEC 60601-2-49', name: 'Particular requirements for the basic safety and essential performance of multifunction patient monitoring equipment' });
      standards.push({ code: 'ISO 80601-2-61', name: 'Particular requirements for basic safety and essential performance of pulse oximeter equipment' });
    }
    if (lower.includes('pump') || lower.includes('infusion')) {
      standards.push({ code: 'IEC 60601-2-24', name: 'Particular requirements for the basic safety and essential performance of infusion pumps and controllers' });
    }
    if (lower.includes('procurement') || lower.includes('hospital') || lower.includes('management')) {
      standards.push({ code: 'ISO 13485', name: 'Medical devices - Quality management systems' });
      standards.push({ code: 'ISO 14971', name: 'Application of risk management to medical devices' });
    }

    return standards;
  }

  /**
   * Identifies potential clinical, environmental, or operational risks
   */
  static identifyTechnicalRisks(domain = '', equipment = '') {
    const risks = [
      'Site electrical safety: Grounding resistance and power fluctuation tolerance in clinical facilities.',
      'Equipment downtime risk: Local availability of OEM consumable supplies and authorized calibration tools.',
    ];

    const lower = `${domain} ${equipment}`.toLowerCase();
    if (lower.includes('monitor')) {
      risks.push('Telemetry interoperability: Compatibility between bedside patient monitors and central monitoring network protocol.');
      risks.push('Sensor durability: High clinical turnover of SpO₂ and NIBP cuffs requiring robust strain relief.');
    }
    if (lower.includes('pump')) {
      risks.push('Free-flow risk: Verification of dedicated anti-free-flow clamp mechanisms on IV administration sets.');
      risks.push('Dose error reduction: Implementation and clinical validation of drug library limits.');
    }
    return risks;
  }

  /**
   * Identifies missing parameters needed for a complete engineering decision
   */
  static identifyInformationGaps(thread) {
    const gaps = [];
    if (!thread.organization) gaps.push('Institutional context (Hospital name, public vs. private facility).');
    if (!thread.requested_equipment) gaps.push('Specific manufacturer models or target parameter suite.');
    gaps.push('Target clinical environment (ICU, Emergency, Outpatient, Inpatient Ward).');
    gaps.push('Infrastructure readiness (uninterruptible power supply, wall-rail mounts, network infrastructure).');
    return gaps;
  }

  /**
   * Prepares a draft response for Marye to edit and approve (Requirement 14)
   */
  static generateDraftResponse({ thread, services = [], applicableStandards = [], missingInformation = [] }) {
    const userName = thread.user_name ? `${thread.user_name}` : 'Colleague';
    const topService = services[0]?.service?.title || 'Technical Medical Technology Consultation';

    return `Dear ${userName},

Thank you for reaching out regarding your technical inquiry on ${thread.requested_equipment || 'biomedical equipment planning'}.

I have conducted an initial technical review of your requirements. For projects of this nature, technical specification definition and procurement evaluation are critical to ensure long-term equipment uptime and full compliance with electrical safety standards (${applicableStandards.slice(0, 2).map((s) => s.code).join(', ')}).

To provide you with a tailored technical advisory or tender evaluation, it would be helpful to clarify:
${missingInformation.slice(0, 2).map((g) => `• ${g}`).join('\n')}

I can provide formal support through my ${topService} service. Please let me know if you would like to schedule a direct technical discussion.

Best regards,

Marye Agegn
Biomedical Engineer & Graduate Researcher
Anna University, Chennai, India`;
  }

  /**
   * Dispatches Marye's approved response to the visitor's thread (Requirement 16)
   */
  static async sendAdminResponse(threadId, responseText) {
    if (!threadId || !responseText) throw new Error('Thread ID and response text are required');

    const updatePayload = {
      admin_response: responseText,
      admin_responded_at: new Date().toISOString(),
      status: 'Admin Responded',
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('consultation_threads').update(updatePayload).eq('id', threadId);
        // Also append as an admin message in consultation_messages
        await supabase.from('consultation_messages').insert([
          {
            thread_id: threadId,
            sender_type: 'admin',
            message: responseText,
            created_at: new Date().toISOString(),
          },
        ]);
        // Log action
        await supabase.from('consultation_actions').insert([
          {
            thread_id: threadId,
            action_type: 'send_admin_response',
            performed_by: 'admin',
            payload: { messageLength: responseText.length },
            created_at: new Date().toISOString(),
          },
        ]);
        return { success: true };
      } catch (err) {
        console.warn('Supabase sendAdminResponse error:', err);
      }
    }

    // Local fallback update
    const threads = ConsultationStore.getLocalThreads();
    const updated = threads.map((t) => (t.id === threadId ? { ...t, ...updatePayload } : t));
    ConsultationStore.saveLocalThreads(updated);
    await ConsultationStore.appendMessage(threadId, 'admin', responseText);
    return { success: true, localStored: true };
  }
}

export default AdminResearchAssistant;
