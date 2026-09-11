import { supabase, isSupabaseConfigured } from './supabaseClient.js';
import { siteData } from './siteData.js';
import {
  getWebinars as getRegistryWebinars,
  getWebinarBySlug as getRegistryWebinarBySlug,
  saveWebinar as saveRegistryWebinar,
  deleteWebinar as deleteRegistryWebinar,
  searchPublicWebinarsAndVideos as searchRegistryWebinarsAndVideos,
  SEED_WEBINARS,
} from './webinarRegistry.js';

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
  const safeCollabData = {
    name: collabData.name,
    email: collabData.email,
    organization: collabData.organization,
    title: collabData.title || '',
    phone: collabData.phone || '',
    area_of_interest: collabData.area_of_interest,
    collaboration_type: collabData.collaboration_type,
    urgency_level: collabData.urgency_level || '',
    website: collabData.website || '',
    linkedin: collabData.linkedin || '',
    orcid: collabData.orcid || '',
    message: collabData.message,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      let attachmentStoragePath = null;

      if (collabData.proposal_file && collabData.proposal_file.data) {
        const fileName = `${Date.now()}_${collabData.proposal_file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('collaboration-attachments')
          .upload(fileName, collabData.proposal_file.data, {
            contentType: collabData.proposal_file.type,
          });

        if (uploadError) {
          console.error('Supabase file upload error:', uploadError);
        } else {
          attachmentStoragePath = uploadData?.path || fileName;
        }
      }

      const { error } = await supabase.from('collaboration_requests').insert([
        {
          ...safeCollabData,
          proposal_file_name: collabData.proposal_file?.name || null,
          proposal_file_size: collabData.proposal_file?.size || null,
          proposal_file_path: attachmentStoragePath,
          created_at: new Date().toISOString(),
        },
      ]);
      if (!error) return { success: true, attachmentPath: attachmentStoragePath };
    } catch (err) {
      console.error('Supabase collaboration submission error:', err);
    }
  }

  const existing = JSON.parse(localStorage.getItem('marye_inbound_collabs') || '[]');
  existing.unshift({
    id: `collab-${Date.now()}`,
    ...safeCollabData,
    proposal_file_name: collabData.proposal_file?.name || null,
    proposal_file_size: collabData.proposal_file?.size || null,
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

// ------------------------------------------------------------------------------
// 6. UNIFIED INQUIRIES & SERVICE REQUESTS (SUPABASE + FALLBACK)
// ------------------------------------------------------------------------------
const LOCAL_STORAGE_INQUIRIES_KEY = 'marye_inbound_inquiries';

export async function submitInquiry(inquiryData) {
  let attachmentUrl = null;
  let attachmentName = inquiryData.attachment_name || null;

  if (isSupabaseConfigured && supabase) {
    try {
      if (inquiryData.attachment_file && inquiryData.attachment_file.data) {
        const cleanName = inquiryData.attachment_file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const fileName = `${Date.now()}_${cleanName}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('collaboration-attachments')
          .upload(fileName, inquiryData.attachment_file.data, {
            contentType: inquiryData.attachment_file.type || 'application/octet-stream',
          });

        if (!uploadError && uploadData) {
          attachmentUrl = uploadData.path || fileName;
          attachmentName = cleanName;
        }
      }

      const insertPayload = {
        name: inquiryData.name,
        email: inquiryData.email,
        organization: inquiryData.organization || '',
        role: inquiryData.role || '',
        country: inquiryData.country || '',
        request_type: inquiryData.request_type || 'Professional service',
        selected_service: inquiryData.selected_service || null,
        subject: inquiryData.subject || `Inquiry: ${inquiryData.request_type}`,
        message: inquiryData.message,
        attachment_url: attachmentUrl,
        attachment_name: attachmentName,
        status: 'New',
        priority: 'Normal',
        source: 'Website Contact',
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from('inquiries').insert([insertPayload]).select().single();

      if (!error) {
        // Trigger server-side notification without exposing any client API key
        try {
          await supabase.functions.invoke('notify-inquiry', {
            body: {
              ...insertPayload,
              submitted_at: new Date().toISOString(),
            },
          });
        } catch {
          // Edge function optional; inquiry is securely persisted in PostgreSQL
        }
        return { success: true, inquiry: data };
      }
    } catch (err) {
      console.warn('Supabase inquiry submission warning, storing locally:', err);
    }
  }

  // Fallback storage
  const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_INQUIRIES_KEY) || '[]');
  const localRecord = {
    id: `inq-${Date.now()}`,
    ...inquiryData,
    attachment_url: attachmentUrl,
    attachment_name: attachmentName,
    status: 'New',
    priority: 'Normal',
    source: 'Website Contact',
    created_at: new Date().toISOString(),
  };
  existing.unshift(localRecord);
  localStorage.setItem(LOCAL_STORAGE_INQUIRIES_KEY, JSON.stringify(existing));
  return { success: true, localStored: true, inquiry: localRecord };
}

export async function getInquiries() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase getInquiries error:', err);
    }
  }
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_INQUIRIES_KEY) || '[]');
}

export async function updateInquiryStatus(id, newStatus, adminNotes = null) {
  if (isSupabaseConfigured && supabase) {
    try {
      const updatePayload = { status: newStatus };
      if (adminNotes !== null) updatePayload.admin_notes = adminNotes;
      if (newStatus === 'Contacted' || newStatus === 'Completed') {
        updatePayload.replied_at = new Date().toISOString();
      }
      const { data, error } = await supabase.from('inquiries').update(updatePayload).eq('id', id).select().single();
      if (!error && data) return { success: true, inquiry: data };
    } catch (err) {
      console.error(err);
    }
  }

  const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_INQUIRIES_KEY) || '[]');
  const updated = existing.map((item) =>
    item.id === id ? { ...item, status: newStatus, admin_notes: adminNotes !== null ? adminNotes : item.admin_notes } : item
  );
  localStorage.setItem(LOCAL_STORAGE_INQUIRIES_KEY, JSON.stringify(updated));
  return { success: true };
}

// ------------------------------------------------------------------------------
// 7. BHN MEMBERSHIP APPLICATIONS (SUPABASE + FALLBACK)
// ------------------------------------------------------------------------------
const LOCAL_STORAGE_BHN_KEY = 'marye_bhn_applications';

export async function submitBhnApplication(applicationData) {
  const payload = {
    name: applicationData.name,
    email: applicationData.email,
    organization: applicationData.organization || '',
    role: applicationData.role || '',
    country: applicationData.country || '',
    background: applicationData.background || '',
    areas_of_interest: Array.isArray(applicationData.areas_of_interest) ? applicationData.areas_of_interest : [],
    statement_of_interest: applicationData.statement_of_interest || applicationData.message || '',
    profile_url: applicationData.profile_url || applicationData.linkedin || '',
    message: applicationData.message || '',
    status: 'Pending',
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('bhn_applications').insert([payload]).select().single();
      if (!error) return { success: true, application: data };
    } catch (err) {
      console.warn('Supabase BHN submission error, falling back locally:', err);
    }
  }

  const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_BHN_KEY) || '[]');
  const localRecord = { id: `bhn-${Date.now()}`, ...payload };
  existing.unshift(localRecord);
  localStorage.setItem(LOCAL_STORAGE_BHN_KEY, JSON.stringify(existing));
  return { success: true, localStored: true, application: localRecord };
}

export async function getBhnApplications() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('bhn_applications').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase getBhnApplications error:', err);
    }
  }
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_BHN_KEY) || '[]');
}

export async function updateBhnApplicationStatus(id, newStatus, adminNotes = null) {
  if (isSupabaseConfigured && supabase) {
    try {
      const updatePayload = { status: newStatus };
      if (adminNotes !== null) updatePayload.admin_notes = adminNotes;
      if (newStatus === 'Active' || newStatus === 'Approved') {
        updatePayload.approved_at = new Date().toISOString();
      }
      const { data, error } = await supabase.from('bhn_applications').update(updatePayload).eq('id', id).select().single();
      if (!error && data) return { success: true, application: data };
    } catch (err) {
      console.error(err);
    }
  }

  const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_BHN_KEY) || '[]');
  const updated = existing.map((item) =>
    item.id === id ? { ...item, status: newStatus, admin_notes: adminNotes !== null ? adminNotes : item.admin_notes } : item
  );
  localStorage.setItem(LOCAL_STORAGE_BHN_KEY, JSON.stringify(updated));
  return { success: true };
}

// ------------------------------------------------------------------------------
// 8. CV PDF VALIDATION & UPLOAD (REAL BINARY PDF)
// ------------------------------------------------------------------------------
export async function uploadCvPdf(file, metadata = {}) {
  if (!file) throw new Error('No file provided for CV upload');

  // Strict MIME check
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error('Invalid file format. Only true binary PDF files (application/pdf) are accepted.');
  }

  // Validate PDF magic bytes (%PDF-)
  const arrayBuffer = await file.slice(0, 5).arrayBuffer();
  const headerText = new TextDecoder('utf-8').decode(arrayBuffer);
  if (!headerText.startsWith('%PDF-')) {
    throw new Error('Corrupted or invalid PDF header. The file does not begin with standard %PDF- binary signature.');
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `cv/${Date.now()}_${cleanName}`;
  let publicUrl = null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(storagePath, file, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from('documents').getPublicUrl(storagePath);
        publicUrl = urlData?.publicUrl || null;
      }
    } catch (err) {
      console.warn('Supabase storage upload error:', err);
    }
  }

  // If Supabase storage is unconfigured or failed, create an object URL
  if (!publicUrl) {
    publicUrl = URL.createObjectURL(file);
  }

  const docRecord = {
    title: metadata.title || 'Official Academic Curriculum Vitae — Marye Agegn',
    description: metadata.description || 'Verified academic curriculum vitae detailing clinical engineering experience, technical specifications, and graduate research trajectory.',
    category: 'CV',
    file_url: publicUrl,
    file_type: 'PDF',
    file_size: `${(file.size / 1024).toFixed(1)} KB`,
    version: metadata.version || `v${new Date().getFullYear()}.${new Date().getMonth() + 1}`,
    is_current_cv: true,
    last_updated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    status: 'published',
  };

  const result = await saveDocument(docRecord);
  return { success: true, document: result.document || docRecord, publicUrl };
}

// ------------------------------------------------------------------------------
// 9. WEBINARS & EDUCATIONAL SESSIONS
// ------------------------------------------------------------------------------
export async function getWebinars(options = {}) {
  const { status, category, includeDrafts = false, includePrivate = false } = options;

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('webinars').select('*').order('date', { ascending: true });
      if (!includeDrafts) {
        query = query.eq('is_published', true);
      }
      if (!includePrivate) {
        query = query.eq('visibility', 'public');
      }
      if (status && status !== 'ALL') {
        query = query.eq('status', status);
      }
      if (category && category !== 'All') {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase getWebinars error, falling back to registry:', err);
    }
  }

  // Fallback to registry with strict privacy and status rules
  return getRegistryWebinars(options);
}

export async function getWebinarBySlug(slugOrId, options = {}) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('webinars')
        .select('*')
        .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
        .single();
      if (!error && data) {
        if (!options.includeDrafts && !data.is_published) return null;
        if (!options.includePrivate && data.visibility === 'private') return null;
        return data;
      }
    } catch (err) {
      console.warn('Supabase getWebinarBySlug error, using registry:', err);
    }
  }
  return getRegistryWebinarBySlug(slugOrId, options);
}

export async function saveWebinar(webinarData) {
  if (isSupabaseConfigured && supabase) {
    try {
      if (webinarData.id && !webinarData.id.startsWith('webinar-')) {
        const { data, error } = await supabase
          .from('webinars')
          .update(webinarData)
          .eq('id', webinarData.id)
          .select()
          .single();
        if (!error && data) return { success: true, webinar: data };
      } else {
        const insertPayload = { ...webinarData };
        delete insertPayload.id;
        const { data, error } = await supabase.from('webinars').insert([insertPayload]).select().single();
        if (!error && data) return { success: true, webinar: data };
      }
    } catch (err) {
      console.error('Supabase saveWebinar error:', err);
    }
  }
  return saveRegistryWebinar(webinarData);
}

export async function deleteWebinar(id) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('webinars').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase deleteWebinar error:', err);
    }
  }
  return deleteRegistryWebinar(id);
}

export { searchRegistryWebinarsAndVideos as searchWebinarsAndVideos };

