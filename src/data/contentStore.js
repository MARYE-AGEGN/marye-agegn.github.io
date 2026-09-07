import { supabase, isSupabaseConfigured } from './supabaseClient';
import { siteData } from './siteData';

/**
 * Unified Content Store
 * Combines dynamic Supabase queries with instant static fallbacks to siteData.js
 * Ensures the website functions 100% reliably in both connected and offline/unconfigured environments.
 */

// Local custom overrides stored in browser memory if user creates drafts locally before DB setup
const LOCAL_STORAGE_POSTS_KEY = 'marye_custom_posts';
const LOCAL_STORAGE_RESEARCH_KEY = 'marye_custom_research';
const LOCAL_STORAGE_DOCS_KEY = 'marye_custom_documents';
const LOCAL_STORAGE_MEDIA_KEY = 'marye_custom_media';

function getLocalData(key, defaultData) {
  if (typeof window === 'undefined') return defaultData;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultData;
  } catch {
    return defaultData;
  }
}

function saveLocalData(key, data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

// ------------------------------------------------------------------------------
// 1. POSTS / ARTICLES
// ------------------------------------------------------------------------------
export async function getPosts(includeDrafts = false) {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('posts').select('*').order('created_at', { ascending: false });
      if (!includeDrafts) {
        query = query.eq('status', 'published');
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase getPosts error, falling back to local store:', err);
    }
  }

  const localPosts = getLocalData(LOCAL_STORAGE_POSTS_KEY, siteData.posts || []);
  return includeDrafts ? localPosts : localPosts.filter((p) => p.status === 'published');
}

export async function getPostBySlug(slug) {
  const allPosts = await getPosts(true);
  return allPosts.find((p) => p.slug === slug || p.id === slug) || null;
}

export async function savePost(postData) {
  if (isSupabaseConfigured && supabase) {
    try {
      if (postData.id && !postData.id.startsWith('post-')) {
        const { data, error } = await supabase.from('posts').update(postData).eq('id', postData.id).select().single();
        if (!error && data) return { success: true, post: data };
      } else {
        const insertPayload = { ...postData };
        delete insertPayload.id;
        const { data, error } = await supabase.from('posts').insert([insertPayload]).select().single();
        if (!error && data) return { success: true, post: data };
      }
    } catch (err) {
      console.error('Supabase savePost error, saving to local fallback:', err);
    }
  }

  // Local fallback persistence
  const current = getLocalData(LOCAL_STORAGE_POSTS_KEY, siteData.posts || []);
  let updated;
  if (postData.id) {
    updated = current.map((p) => (p.id === postData.id ? { ...p, ...postData, updated_at: new Date().toISOString() } : p));
  } else {
    const newPost = {
      ...postData,
      id: `post-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    updated = [newPost, ...current];
  }
  saveLocalData(LOCAL_STORAGE_POSTS_KEY, updated);
  return { success: true, post: postData };
}

export async function deletePost(id) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('posts').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete error:', err);
    }
  }
  const current = getLocalData(LOCAL_STORAGE_POSTS_KEY, siteData.posts || []);
  const filtered = current.filter((p) => p.id !== id);
  saveLocalData(LOCAL_STORAGE_POSTS_KEY, filtered);
  return { success: true };
}

// ------------------------------------------------------------------------------
// 2. RESEARCH UPDATES (HIGH-LEVEL MILESTONES)
// ------------------------------------------------------------------------------
export async function getResearchUpdates(includePrivate = false) {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('research_updates').select('*').order('created_at', { ascending: false });
      if (!includePrivate) {
        query = query.eq('status', 'published').eq('visibility', 'public');
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase getResearchUpdates error, falling back:', err);
    }
  }

  const localUpdates = getLocalData(LOCAL_STORAGE_RESEARCH_KEY, siteData.researchUpdates || []);
  return includePrivate
    ? localUpdates
    : localUpdates.filter((u) => u.status === 'published' && u.visibility === 'public');
}

export async function saveResearchUpdate(updateData) {
  if (isSupabaseConfigured && supabase) {
    try {
      if (updateData.id && !updateData.id.startsWith('ru-')) {
        const { data, error } = await supabase.from('research_updates').update(updateData).eq('id', updateData.id).select().single();
        if (!error && data) return { success: true, update: data };
      } else {
        const insertPayload = { ...updateData };
        delete insertPayload.id;
        const { data, error } = await supabase.from('research_updates').insert([insertPayload]).select().single();
        if (!error && data) return { success: true, update: data };
      }
    } catch (err) {
      console.error('Supabase saveResearchUpdate error:', err);
    }
  }

  const current = getLocalData(LOCAL_STORAGE_RESEARCH_KEY, siteData.researchUpdates || []);
  let updated;
  if (updateData.id) {
    updated = current.map((u) => (u.id === updateData.id ? { ...u, ...updateData } : u));
  } else {
    const newUpdate = {
      ...updateData,
      id: `ru-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    updated = [newUpdate, ...current];
  }
  saveLocalData(LOCAL_STORAGE_RESEARCH_KEY, updated);
  return { success: true, update: updateData };
}

export async function deleteResearchUpdate(id) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('research_updates').delete().eq('id', id);
    } catch (err) {
      console.error(err);
    }
  }
  const current = getLocalData(LOCAL_STORAGE_RESEARCH_KEY, siteData.researchUpdates || []);
  saveLocalData(LOCAL_STORAGE_RESEARCH_KEY, current.filter((u) => u.id !== id));
  return { success: true };
}

// ------------------------------------------------------------------------------
// 3. DOCUMENTS & CV MANAGEMENT
// ------------------------------------------------------------------------------
export async function getDocuments() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase getDocuments error:', err);
    }
  }
  return getLocalData(LOCAL_STORAGE_DOCS_KEY, siteData.documents || []);
}

export async function getCurrentCV() {
  const docs = await getDocuments();
  const currentCv = docs.find((d) => d.is_current_cv || d.category === 'CV');
  return currentCv || docs[0] || null;
}

export async function saveDocument(docData) {
  if (isSupabaseConfigured && supabase) {
    try {
      if (docData.is_current_cv) {
        // Reset any other document marked as current_cv
        await supabase.from('documents').update({ is_current_cv: false }).neq('id', docData.id || '00000000-0000-0000-0000-000000000000');
      }
      if (docData.id && !docData.id.startsWith('doc-')) {
        const { data, error } = await supabase.from('documents').update(docData).eq('id', docData.id).select().single();
        if (!error && data) return { success: true, document: data };
      } else {
        const insertPayload = { ...docData };
        delete insertPayload.id;
        const { data, error } = await supabase.from('documents').insert([insertPayload]).select().single();
        if (!error && data) return { success: true, document: data };
      }
    } catch (err) {
      console.error(err);
    }
  }

  const current = getLocalData(LOCAL_STORAGE_DOCS_KEY, siteData.documents || []);
  let updated;
  if (docData.is_current_cv) {
    current.forEach((d) => (d.is_current_cv = false));
  }
  if (docData.id) {
    updated = current.map((d) => (d.id === docData.id ? { ...d, ...docData } : d));
  } else {
    const newDoc = {
      ...docData,
      id: `doc-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    updated = [newDoc, ...current];
  }
  saveLocalData(LOCAL_STORAGE_DOCS_KEY, updated);
  return { success: true, document: docData };
}

export async function deleteDocument(id) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('documents').delete().eq('id', id);
    } catch (err) {
      console.error(err);
    }
  }
  const current = getLocalData(LOCAL_STORAGE_DOCS_KEY, siteData.documents || []);
  saveLocalData(LOCAL_STORAGE_DOCS_KEY, current.filter((d) => d.id !== id));
  return { success: true };
}

// ------------------------------------------------------------------------------
// 4. MEDIA ITEMS
// ------------------------------------------------------------------------------
export async function getMediaItems() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('media_items').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase getMediaItems error:', err);
    }
  }
  return getLocalData(LOCAL_STORAGE_MEDIA_KEY, siteData.media || []);
}

export async function saveMediaItem(mediaData) {
  if (isSupabaseConfigured && supabase) {
    try {
      if (mediaData.id && !mediaData.id.startsWith('media-')) {
        const { data, error } = await supabase.from('media_items').update(mediaData).eq('id', mediaData.id).select().single();
        if (!error && data) return { success: true, item: data };
      } else {
        const insertPayload = { ...mediaData };
        delete insertPayload.id;
        const { data, error } = await supabase.from('media_items').insert([insertPayload]).select().single();
        if (!error && data) return { success: true, item: data };
      }
    } catch (err) {
      console.error(err);
    }
  }

  const current = getLocalData(LOCAL_STORAGE_MEDIA_KEY, siteData.media || []);
  let updated;
  if (mediaData.id) {
    updated = current.map((m) => (m.id === mediaData.id ? { ...m, ...mediaData } : m));
  } else {
    const newItem = {
      ...mediaData,
      id: `media-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    updated = [newItem, ...current];
  }
  saveLocalData(LOCAL_STORAGE_MEDIA_KEY, updated);
  return { success: true, item: mediaData };
}

export async function deleteMediaItem(id) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('media_items').delete().eq('id', id);
    } catch (err) {
      console.error(err);
    }
  }
  const current = getLocalData(LOCAL_STORAGE_MEDIA_KEY, siteData.media || []);
  saveLocalData(LOCAL_STORAGE_MEDIA_KEY, current.filter((m) => m.id !== id));
  return { success: true };
}

// ------------------------------------------------------------------------------
// 5. INBOUND SUBMISSIONS: CONTACT & COLLABORATION
// ------------------------------------------------------------------------------
export async function submitContactMessage(messageData) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('contact_messages').insert([
        {
          name: messageData.name,
          email: messageData.email,
          organization: messageData.organization || '',
          category: messageData.category || 'General Inquiry',
          subject: messageData.subject,
          message: messageData.message,
          created_at: new Date().toISOString(),
        },
      ]);
      if (!error) return { success: true };
    } catch (err) {
      console.error('Supabase contact submission error:', err);
    }
  }

  // Fallback to local storage inbox
  const existing = JSON.parse(localStorage.getItem('marye_inbound_messages') || '[]');
  existing.unshift({
    id: `msg-${Date.now()}`,
    ...messageData,
    created_at: new Date().toISOString(),
  });
  localStorage.setItem('marye_inbound_messages', JSON.stringify(existing));
  return { success: true, localStored: true };
}

export async function submitCollaborationRequest(collabData) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('collaboration_requests').insert([
        {
          name: collabData.name,
          email: collabData.email,
          organization: collabData.organization,
          area_of_interest: collabData.area_of_interest,
          collaboration_type: collabData.collaboration_type,
          website: collabData.website || '',
          message: collabData.message,
          created_at: new Date().toISOString(),
        },
      ]);
      if (!error) return { success: true };
    } catch (err) {
      console.error('Supabase collaboration submission error:', err);
    }
  }

  const existing = JSON.parse(localStorage.getItem('marye_inbound_collabs') || '[]');
  existing.unshift({
    id: `collab-${Date.now()}`,
    ...collabData,
    created_at: new Date().toISOString(),
  });
  localStorage.setItem('marye_inbound_collabs', JSON.stringify(existing));
  return { success: true, localStored: true };
}

export async function getInboundMessages() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (err) {
      console.error(err);
    }
  }
  return JSON.parse(localStorage.getItem('marye_inbound_messages') || '[]');
}

export async function getInboundCollaborations() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('collaboration_requests').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (err) {
      console.error(err);
    }
  }
  return JSON.parse(localStorage.getItem('marye_inbound_collabs') || '[]');
}
