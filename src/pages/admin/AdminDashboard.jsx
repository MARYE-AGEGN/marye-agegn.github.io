import React, { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured, updateSupabaseConfig, getSupabaseConfig } from '../../data/supabaseClient';
import {
  getPosts,
  savePost,
  deletePost,
  getResearchUpdates,
  saveResearchUpdate,
  deleteResearchUpdate,
  getDocuments,
  saveDocument,
  deleteDocument,
  getMediaItems,
  saveMediaItem,
  deleteMediaItem,
  getInboundMessages,
  getInboundCollaborations,
  getInquiries,
  updateInquiryStatus,
  getBhnApplications,
  updateBhnApplicationStatus,
  uploadCvPdf,
} from '../../data/contentStore';
import { getMediaLibrary } from '../../data/mediaStore';
import { UniversalFileUploader } from '../../components/common/UniversalFileUploader';
import { MediaLibrary } from '../../components/admin/MediaLibrary';
import { ConsultationWorkspace } from '../../components/admin/ConsultationWorkspace';

export function AdminDashboard() {
  // Authentication state
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard active tab
  const [activeTab, setActiveTab] = useState('overview'); // overview, inquiries, bhn, docs, media_library, posts, research, media, settings

  // Content collections
  const [posts, setPosts] = useState([]);
  const [researchUpdates, setResearchUpdates] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [mediaLibraryItems, setMediaLibraryItems] = useState([]);
  const [messages, setMessages] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [bhnApplications, setBhnApplications] = useState([]);
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('All');
  const [bhnStatusFilter, setBhnStatusFilter] = useState('All');
  const [cvUploading, setCvUploading] = useState(false);
  const [cvUploadMsg, setCvUploadMsg] = useState(null);
  const [cvVersionInput, setCvVersionInput] = useState('v2.2');
  const cvFileInputRef = useRef(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Form states
  const [editingPost, setEditingPost] = useState(null);
  const [editingResearch, setEditingResearch] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [editingMedia, setEditingMedia] = useState(null);

  // Media picker modal state for content editors
  const [pickerConfig, setPickerConfig] = useState(null); // { target: 'doc'|'media'|'postImage'|'researchFigure', filter: 'all'|'image'|'document'|'video' }

  // Research IP Protection Checkpoint Modal
  const [ipModalData, setIpModalData] = useState(null);
  const [ipConfirmed, setIpConfirmed] = useState(false);

  // Settings form
  const currentConfig = getSupabaseConfig();
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(currentConfig.url);
  const [supabaseAnonKeyInput, setSupabaseAnonKeyInput] = useState(currentConfig.anonKey);
  const [settingsNotice, setSettingsNotice] = useState('');

  // Check auth session
  useEffect(() => {
    if (supabase && isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  // Fetch all content & media library
  useEffect(() => {
    async function loadAll() {
      const [allPosts, allResearch, allDocs, allMedia, allMsgs, allCollabs, allInq, allBhn] = await Promise.all([
        getPosts(true),
        getResearchUpdates(true),
        getDocuments(),
        getMediaItems(),
        getInboundMessages(),
        getInboundCollaborations(),
        getInquiries(),
        getBhnApplications(),
      ]);
      setPosts(allPosts);
      setResearchUpdates(allResearch);
      setDocuments(allDocs);
      setMediaItems(allMedia);
      setMessages(allMsgs);
      setCollaborations(allCollabs);
      setInquiries(allInq);
      setBhnApplications(allBhn);
      setMediaLibraryItems(getMediaLibrary());
    }
    loadAll();
  }, [refreshTrigger]);

  // CV Upload Handler (Strict %PDF- Validation & Binary Storage)
  async function handleCvFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCvUploading(true);
    setCvUploadMsg(null);

    try {
      const result = await uploadCvPdf(file, {
        version: cvVersionInput || 'v2.2',
        title: 'Official Academic Curriculum Vitae — Marye Agegn',
        description: 'Verified academic curriculum vitae detailing clinical engineering experience, technical specifications, and graduate research trajectory.',
      });

      setCvUploadMsg({
        type: 'success',
        text: `CV binary successfully stored and activated (${result.document.file_size}). The public "Download CV" button now serves this exact file.`,
      });

      const updatedDocs = await getDocuments();
      setDocuments(updatedDocs);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('CV upload error:', err);
      setCvUploadMsg({ type: 'error', text: err.message || 'Failed to upload CV. Only genuine binary PDF files are accepted.' });
    } finally {
      setCvUploading(false);
      if (cvFileInputRef.current) cvFileInputRef.current.value = '';
    }
  }

  // Inquiry Status Handler
  async function handleUpdateInquiry(id, status, notes = null) {
    await updateInquiryStatus(id, status, notes);
    const updated = await getInquiries();
    setInquiries(updated);
  }

  // BHN Application Status Handler
  async function handleUpdateBhn(id, status, notes = null) {
    await updateBhnApplicationStatus(id, status, notes);
    const updated = await getBhnApplications();
    setBhnApplications(updated);
  }

  const isAuthenticated = Boolean(session);

  // Handle Login (Strict Supabase Auth without hardcoded credentials)
  async function handleLogin(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message || 'Invalid credentials. Please verify your email and password.');
        setAuthLoading(false);
        return;
      }
    } else {
      setAuthError('Supabase is not configured. Please ensure your project URL and keys are configured.');
    }
    setAuthLoading(false);
  }

  function handleLogout() {
    if (supabase && isSupabaseConfigured) {
      supabase.auth.signOut();
    }
    setSession(null);
  }

  // Post Actions
  async function handleSavePost(e) {
    e.preventDefault();
    await savePost(editingPost);
    setEditingPost(null);
    setRefreshTrigger((prev) => prev + 1);
  }

  async function handleDeletePost(id) {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(id);
      setRefreshTrigger((prev) => prev + 1);
    }
  }

  // Research Update Actions with IP Checkpoint
  function triggerResearchSave(updateData) {
    if (updateData.status === 'published') {
      setIpModalData(updateData);
      setIpConfirmed(false);
    } else {
      proceedSaveResearch(updateData);
    }
  }

  async function proceedSaveResearch(updateData) {
    await saveResearchUpdate(updateData);
    setEditingResearch(null);
    setIpModalData(null);
    setRefreshTrigger((prev) => prev + 1);
  }

  async function handleDeleteResearch(id) {
    if (window.confirm('Delete this research update?')) {
      await deleteResearchUpdate(id);
      setRefreshTrigger((prev) => prev + 1);
    }
  }

  // Document Actions
  async function handleSaveDoc(e) {
    e.preventDefault();
    await saveDocument(editingDoc);
    setEditingDoc(null);
    setRefreshTrigger((prev) => prev + 1);
  }

  async function handleDeleteDoc(id) {
    if (window.confirm('Delete this document entry?')) {
      await deleteDocument(id);
      setRefreshTrigger((prev) => prev + 1);
    }
  }

  // Media Actions
  async function handleSaveMedia(e) {
    e.preventDefault();
    await saveMediaItem(editingMedia);
    setEditingMedia(null);
    setRefreshTrigger((prev) => prev + 1);
  }

  async function handleDeleteMedia(id) {
    if (window.confirm('Delete this media item?')) {
      await deleteMediaItem(id);
      setRefreshTrigger((prev) => prev + 1);
    }
  }

  // Settings save
  function handleSaveSettings(e) {
    e.preventDefault();
    updateSupabaseConfig(supabaseUrlInput.trim(), supabaseAnonKeyInput.trim());
    setSettingsNotice('Supabase configuration updated. Please refresh the page to apply.');
  }

  // Handle asset chosen from Media Library Picker Modal
  function handlePickerSelect(selected) {
    if (!pickerConfig) return;

    if (pickerConfig.target === 'doc' && editingDoc) {
      setEditingDoc({
        ...editingDoc,
        file_url: selected.path,
        file_name: selected.filename,
        file_size: selected.fileSizeFormatted,
        file_type: selected.filename.split('.').pop().toUpperCase(),
      });
    } else if (pickerConfig.target === 'media' && editingMedia) {
      setEditingMedia({
        ...editingMedia,
        file_url: selected.path,
        file_name: selected.filename,
        file_size: selected.fileSizeFormatted,
        media_type: selected.type || 'video',
      });
    } else if (pickerConfig.target === 'postImage' && editingPost) {
      setEditingPost({
        ...editingPost,
        featured_image: selected.path,
        featured_image_alt: selected.altText || selected.title,
      });
    } else if (pickerConfig.target === 'researchFigure' && editingResearch) {
      setEditingResearch({
        ...editingResearch,
        figure_url: selected.path,
        figure_caption: selected.title,
      });
    }

    setPickerConfig(null);
  }

  // -------------------------------------------------------------
  // If NOT authenticated, show Professional Light Login View
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="admin-main-container flex items-center justify-center min-h-screen py-16" style={{ background: 'var(--color-surface-subtle)' }}>
        <div className="container" style={{ maxWidth: '440px' }}>
          <div className="card p-8 shadow-md" style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
            <div className="text-center mb-6">
              <span className="section-badge mb-2">Platform Administration</span>
              <h2 className="text-2xl font-bold mt-2" style={{ color: 'var(--color-text)' }}>Administrator Access</h2>
              <p className="text-muted text-sm mt-1">Authorized control console for Marye Agegn</p>
            </div>

            {authError && (
              <div
                className="p-3 mb-4 text-sm rounded"
                style={{ background: 'var(--color-error-bg)', color: 'var(--color-error)', border: '1px solid var(--color-error-border)' }}
              >
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="form-group">
                <label htmlFor="admin-email">Administrator Email</label>
                <input
                  id="admin-email"
                  type="email"
                  placeholder="2025254026@student.annauniv.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="admin-password">Password / Admin Key</label>
                <input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-full mt-4" disabled={authLoading}>
                {authLoading ? 'Authenticating...' : 'Sign In to Dashboard →'}
              </button>
            </form>

            <div
              className="mt-6 pt-4 text-center text-xs text-muted"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <p>🔒 Authenticated via PostgreSQL Row Level Security (RLS).</p>
              <a href="#home" className="inline-block mt-2 font-medium" style={{ color: 'var(--color-primary)' }}>
                ← Return to Public Website
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Authenticated Dashboard (Light UI)
  // -------------------------------------------------------------
  return (
    <div className="admin-main-container">
      <div className="container">
        {/* Top Navigation Bar */}
        <div
          className="admin-top-bar card p-4 flex items-center justify-between mb-6"
          style={{ background: '#ffffff', borderRadius: 'var(--radius-md)' }}
        >
          <div className="flex items-center gap-3">
            <span
              className="badge"
              style={{
                background: 'var(--color-success-bg)',
                color: 'var(--color-success)',
                border: '1px solid var(--color-success-border)',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            >
              Session Active
            </span>
            <img
              src="./assets/images/marye-agegn-brand-banner.jpg"
              alt="Marye Agegn Brand"
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'cover',
                borderRadius: '4px',
                border: '1px solid var(--color-border)',
                flexShrink: 0,
              }}
            />
            <h1 className="text-lg font-bold" style={{ color: 'var(--color-text)', margin: 0 }}>
              Marye Agegn • Platform CMS
            </h1>
            <span className="text-xs text-muted">
              {isSupabaseConfigured ? '🟢 Connected to Supabase' : '🟡 Local Store Mode'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a href="#/" className="btn btn-secondary btn-sm" target="_blank" rel="noopener noreferrer">
              View Live Website ↗
            </a>
            <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
              Sign Out ⎋
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        {(() => {
          const newInqCount = inquiries.filter((i) => i.status === 'New').length;
          const pendingBhnCount = bhnApplications.filter((b) => b.status === 'Pending').length;

          const adminTabs = [
            { id: 'overview', label: '📊 Overview' },
            { id: 'ai_consultations', label: '🤖 AI Consultations & Inquiries' },
            {
              id: 'inquiries',
              label: newInqCount > 0 ? `📬 Inquiries (${newInqCount} New)` : `📬 Inquiries (${inquiries.length})`,
            },
            {
              id: 'bhn',
              label: pendingBhnCount > 0 ? `🌐 BHN (${pendingBhnCount} Pending)` : `🌐 BHN (${bhnApplications.length})`,
            },
            { id: 'docs', label: `📄 Documents & CV (${documents.length})` },
            { id: 'media_library', label: `📁 Media Library (${mediaLibraryItems.length})` },
            { id: 'posts', label: `📝 Articles (${posts.length})` },
            { id: 'research', label: `🔬 Research Updates (${researchUpdates.length})` },
            { id: 'media', label: `🎥 Media Items (${mediaItems.length})` },
            { id: 'messages', label: `📨 Collab Archive (${collaborations.length})` },
            { id: 'settings', label: '⚙️ Database Settings' },
          ];

          return (
            <div className="admin-tabs-bar mb-6" role="tablist">
              {adminTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`admin-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          );
        })()}

        {/* ------------------------------------------------------- */}
        {/* TAB 1: OVERVIEW */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="overview-tab-view space-y-6">
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-card-label">New Inquiries &amp; Requests</span>
                <div className="stat-card-val" style={{ color: inquiries.filter((i) => i.status === 'New').length > 0 ? '#0284c7' : 'var(--color-text)' }}>
                  {inquiries.filter((i) => i.status === 'New').length > 0
                    ? `${inquiries.filter((i) => i.status === 'New').length} New`
                    : 'No new requests'}
                </div>
                <span className="text-xs text-muted">
                  {inquiries.length} Total Website Submissions
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-card-label">BHN Membership Applications</span>
                <div className="stat-card-val" style={{ color: bhnApplications.filter((b) => b.status === 'Pending').length > 0 ? '#0f766e' : 'var(--color-text)' }}>
                  {bhnApplications.filter((b) => b.status === 'Pending').length > 0
                    ? `${bhnApplications.filter((b) => b.status === 'Pending').length} Pending`
                    : 'No new requests'}
                </div>
                <span className="text-xs text-muted">
                  {bhnApplications.length} Total Applications
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-card-label">Active Curriculum Vitae</span>
                <div className="stat-card-val" style={{ color: 'var(--color-primary)' }}>
                  {documents.find((d) => d.is_current_cv)?.version || 'v2.1'}
                </div>
                <span className="text-xs text-muted">
                  Verified Binary PDF ({documents.find((d) => d.is_current_cv)?.file_size || '240 KB'})
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-card-label">Media &amp; Articles Published</span>
                <div className="stat-card-val" style={{ color: 'var(--color-primary)' }}>
                  {posts.length + mediaLibraryItems.length}
                </div>
                <span className="text-xs text-muted">
                  {posts.length} Live Articles • {mediaLibraryItems.length} Media Assets
                </span>
              </div>
            </div>

            <div className="card p-6" style={{ background: '#ffffff', borderRadius: 'var(--radius-md)' }}>
              <h3 className="text-md font-bold mb-3" style={{ color: 'var(--color-text)' }}>Quick Content Operations</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setActiveTab('media_library')}
                >
                  📁 Open Media Library
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setEditingPost({
                      title: '',
                      slug: `article-${Date.now()}`,
                      excerpt: '',
                      content: '',
                      category: 'Clinical Engineering',
                      tags: [],
                      reading_time: '5 min read',
                      status: 'draft',
                    });
                    setActiveTab('posts');
                  }}
                >
                  + Draft New Article
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setEditingResearch({
                      title: '',
                      summary: '',
                      category: 'Milestone',
                      status: 'draft',
                      visibility: 'public',
                    });
                    setActiveTab('research');
                  }}
                >
                  + Post Research Milestone
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setEditingDoc({
                      title: 'Academic Curriculum Vitae',
                      description: 'Updated academic CV detailing recent appointments, publications, and clinical research.',
                      category: 'CV',
                      file_url: './assets/documents/Marye_Agegn_Academic_CV.pdf',
                      file_type: 'PDF',
                      file_size: '240 KB',
                      version: 'v2.2',
                      is_current_cv: true,
                      status: 'published',
                    });
                    setActiveTab('docs');
                  }}
                >
                  + Upload New CV Version
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB: AI CONSULTATIONS & TECHNICAL REQUESTS              */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'ai_consultations' && (
          <div className="ai-consultations-tab-view space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)', margin: '0 0 4px 0' }}>
                  AI Technical Consultations &amp; Escalations
                </h2>
                <p className="text-sm text-muted" style={{ margin: 0 }}>
                  Intelligent investigation workspace: Review visitor technical inquiries, inspect international standards, and dispatch direct responses.
                </p>
              </div>
            </div>
            <ConsultationWorkspace />
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB: INBOUND INQUIRIES & SERVICE REQUESTS               */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'inquiries' && (
          <div className="inquiries-tab-view space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                  Website Inquiries &amp; Service Requests ({inquiries.length})
                </h2>
                <p className="text-sm text-muted">
                  Formal inquiries, project proposals, and service discussions submitted through the unified contact desk.
                </p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex gap-2">
                {['All', 'New', 'Reviewed', 'Responded', 'Archived'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`btn btn-xs ${inquiryStatusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setInquiryStatusFilter(status)}
                  >
                    {status}
                    {status === 'New' && inquiries.filter((i) => i.status === 'New').length > 0 && (
                      <span className="ml-1 badge badge-sm" style={{ background: '#ef4444', color: '#fff' }}>
                        {inquiries.filter((i) => i.status === 'New').length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {(() => {
              const filteredInquiries = inquiries.filter((inq) =>
                inquiryStatusFilter === 'All' ? true : inq.status === inquiryStatusFilter
              );

              if (filteredInquiries.length === 0) {
                return (
                  <div className="card p-8 text-center text-muted" style={{ background: '#ffffff', borderRadius: 'var(--radius-md)' }}>
                    No inquiries found for status: <strong>{inquiryStatusFilter}</strong>.
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {filteredInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="card p-6"
                      style={{
                        background: '#ffffff',
                        borderRadius: 'var(--radius-md)',
                        borderLeft: inq.status === 'New' ? '4px solid #0284c7' : '4px solid var(--color-border)',
                      }}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg" style={{ color: 'var(--color-text)', margin: 0 }}>
                              {inq.name}
                            </h3>
                            {inq.status === 'New' && (
                              <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', fontWeight: 600 }}>
                                New Submission
                              </span>
                            )}
                          </div>
                          <div className="text-sm mt-1">
                            <span className="font-medium" style={{ color: 'var(--color-primary)' }}>
                              {inq.organization || 'Independent Professional'}
                            </span>
                            <span className="text-muted ml-3">✉️ <a href={`mailto:${inq.email}`} style={{ color: 'inherit' }}>{inq.email}</a></span>
                            {inq.phone && <span className="text-muted ml-3">📞 {inq.phone}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="badge category-badge">{inq.category}</span>
                          <select
                            value={inq.status}
                            onChange={(e) => handleUpdateInquiry(inq.id, e.target.value)}
                            className="text-xs p-1 rounded border"
                            style={{ borderColor: 'var(--color-border)' }}
                          >
                            <option value="New">New</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Responded">Responded</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </div>
                      </div>

                      {inq.selected_service && (
                        <div className="mt-2 p-2 rounded text-xs font-semibold" style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
                          🎯 Service Requested: {inq.selected_service}
                        </div>
                      )}

                      <div
                        className="mt-3 p-4 rounded text-sm whitespace-pre-wrap"
                        style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                      >
                        {inq.message}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-muted gap-2">
                        <span>Submitted: {new Date(inq.created_at).toLocaleString()}</span>

                        <div className="flex gap-2">
                          {inq.status !== 'Reviewed' && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-xs"
                              onClick={() => handleUpdateInquiry(inq.id, 'Reviewed')}
                            >
                              Mark Reviewed
                            </button>
                          )}
                          {inq.status !== 'Responded' && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-xs"
                              onClick={() => handleUpdateInquiry(inq.id, 'Responded')}
                            >
                              Mark Responded
                            </button>
                          )}
                          {inq.status !== 'Archived' && (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-xs"
                              onClick={() => handleUpdateInquiry(inq.id, 'Archived')}
                            >
                              Archive
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB: BHN MEMBERSHIP APPLICATIONS                        */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'bhn' && (
          <div className="bhn-tab-view space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                  Biomedical Horizon Network (BHN) Applications ({bhnApplications.length})
                </h2>
                <p className="text-sm text-muted">
                  Membership and collaboration applications for the developing Biomedical Horizon Network initiative.
                  A visitor is <strong>NOT</strong> publicly considered a BHN member until an administrator formally approves and activates their application.
                </p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex gap-2">
                {['All', 'Pending', 'Approved', 'Active', 'Declined', 'Archived'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`btn btn-xs ${bhnStatusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setBhnStatusFilter(status)}
                  >
                    {status}
                    {status === 'Pending' && bhnApplications.filter((b) => b.status === 'Pending').length > 0 && (
                      <span className="ml-1 badge badge-sm" style={{ background: '#0f766e', color: '#fff' }}>
                        {bhnApplications.filter((b) => b.status === 'Pending').length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {(() => {
              const filteredBhn = bhnApplications.filter((b) =>
                bhnStatusFilter === 'All' ? true : b.status === bhnStatusFilter
              );

              if (filteredBhn.length === 0) {
                return (
                  <div className="card p-8 text-center text-muted" style={{ background: '#ffffff', borderRadius: 'var(--radius-md)' }}>
                    No BHN applications found for status: <strong>{bhnStatusFilter}</strong>.
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {filteredBhn.map((bhn) => (
                    <div
                      key={bhn.id}
                      className="card p-6"
                      style={{
                        background: '#ffffff',
                        borderRadius: 'var(--radius-md)',
                        borderLeft:
                          bhn.status === 'Active'
                            ? '4px solid #16a34a'
                            : bhn.status === 'Approved'
                            ? '4px solid #0284c7'
                            : bhn.status === 'Pending'
                            ? '4px solid #0f766e'
                            : '4px solid var(--color-border)',
                      }}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg" style={{ color: 'var(--color-text)', margin: 0 }}>
                              {bhn.full_name}
                            </h3>
                            <span
                              className="badge"
                              style={{
                                background:
                                  bhn.status === 'Active'
                                    ? '#dcfce7'
                                    : bhn.status === 'Approved'
                                    ? '#e0f2fe'
                                    : bhn.status === 'Pending'
                                    ? '#ccfbf1'
                                    : '#f3f4f6',
                                color:
                                  bhn.status === 'Active'
                                    ? '#15803d'
                                    : bhn.status === 'Approved'
                                    ? '#0369a1'
                                    : bhn.status === 'Pending'
                                    ? '#0f766e'
                                    : '#4b5563',
                                fontWeight: 700,
                              }}
                            >
                              Status: {bhn.status}
                            </span>
                          </div>
                          <div className="text-sm mt-1">
                            <span className="font-medium" style={{ color: 'var(--color-primary)' }}>
                              {bhn.institution}
                            </span>
                            <span className="text-muted ml-3">Specialization: <strong>{bhn.specialization}</strong></span>
                            <span className="text-muted ml-3">✉️ <a href={`mailto:${bhn.email}`} style={{ color: 'inherit' }}>{bhn.email}</a></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="badge category-badge">{bhn.focus_area || 'Biomedical Innovation'}</span>
                          <select
                            value={bhn.status}
                            onChange={(e) => handleUpdateBhn(bhn.id, e.target.value)}
                            className="text-xs p-1 rounded border"
                            style={{ borderColor: 'var(--color-border)' }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Active">Active (Official Member)</option>
                            <option value="Declined">Declined</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm">
                        {bhn.professional_background && (
                          <div className="p-3 rounded" style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)' }}>
                            <strong className="block text-xs text-muted mb-1">Professional Background:</strong>
                            <p style={{ margin: 0 }}>{bhn.professional_background}</p>
                          </div>
                        )}
                        {bhn.statement_of_interest && (
                          <div className="p-3 rounded" style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)' }}>
                            <strong className="block text-xs text-muted mb-1">Statement of Interest &amp; Collaborative Goals:</strong>
                            <p style={{ margin: 0 }}>{bhn.statement_of_interest}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-muted gap-2">
                        <span>Applied: {new Date(bhn.created_at).toLocaleString()}</span>

                        <div className="flex gap-2">
                          {bhn.status !== 'Active' && (
                            <button
                              type="button"
                              className="btn btn-primary btn-xs"
                              style={{ background: '#16a34a', borderColor: '#16a34a' }}
                              onClick={() => handleUpdateBhn(bhn.id, 'Active')}
                            >
                              ✓ Approve &amp; Activate Member
                            </button>
                          )}
                          {bhn.status !== 'Approved' && bhn.status !== 'Active' && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-xs"
                              onClick={() => handleUpdateBhn(bhn.id, 'Approved')}
                            >
                              Approve
                            </button>
                          )}
                          {bhn.status !== 'Declined' && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-xs"
                              onClick={() => handleUpdateBhn(bhn.id, 'Declined')}
                            >
                              Decline
                            </button>
                          )}
                          {bhn.status !== 'Archived' && (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-xs"
                              onClick={() => handleUpdateBhn(bhn.id, 'Archived')}
                            >
                              Archive
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB: MEDIA LIBRARY (NEW)                                 */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'media_library' && (
          <div className="media-library-tab-view">
            <MediaLibrary />
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB 2: ARTICLES & TECHNICAL POSTS */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'posts' && (
          <div className="posts-tab-view space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Articles &amp; Technical Notes</h2>
                <p className="text-sm text-muted">Manage peer-facing articles, engineering breakdowns, and clinical workflows.</p>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() =>
                  setEditingPost({
                    title: '',
                    slug: `post-${Date.now()}`,
                    excerpt: '',
                    content: '',
                    category: 'Clinical Engineering',
                    tags: [],
                    reading_time: '5 min read',
                    status: 'draft',
                  })
                }
              >
                + New Article
              </button>
            </div>

            {/* Post Editor */}
            {editingPost && (
              <div className="card p-6 shadow-sm" style={{ background: '#ffffff', borderRadius: 'var(--radius-md)' }}>
                <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                    {editingPost.id ? 'Edit Article' : 'Draft New Article'}
                  </h3>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingPost(null)}>
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSavePost} className="space-y-4">
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Article Title *</label>
                      <input
                        type="text"
                        required
                        value={editingPost.title}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                        placeholder="Article Headline..."
                      />
                    </div>
                    <div className="form-group">
                      <label>URL Slug *</label>
                      <input
                        type="text"
                        required
                        value={editingPost.slug}
                        onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-grid-3">
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={editingPost.category}
                        onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                      >
                        <option value="Medical Devices">Medical Devices</option>
                        <option value="Digital Health">Digital Health</option>
                        <option value="AI in Healthcare">AI in Healthcare</option>
                        <option value="Biosignal Processing">Biosignal Processing</option>
                        <option value="Clinical Engineering">Clinical Engineering</option>
                        <option value="Healthcare Technology">Healthcare Technology</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Reading Time</label>
                      <input
                        type="text"
                        value={editingPost.reading_time || '5 min read'}
                        onChange={(e) => setEditingPost({ ...editingPost, reading_time: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        value={editingPost.status}
                        onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value })}
                      >
                        <option value="draft">Draft (Private)</option>
                        <option value="review">Under Review</option>
                        <option value="published">Published (Public)</option>
                      </select>
                    </div>
                  </div>

                  {/* Featured Image with Local Uploader & Library Picker */}
                  <div className="form-group">
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-sm">Featured Article Image</label>
                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        onClick={() => setPickerConfig({ target: 'postImage', filter: 'image' })}
                      >
                        📁 Choose from Media Library
                      </button>
                    </div>
                    <UniversalFileUploader
                      acceptedType="image"
                      initialValue={
                        editingPost.featured_image
                          ? { filename: editingPost.featured_image.split('/').pop(), path: editingPost.featured_image }
                          : null
                      }
                      onFileSelected={(meta) => {
                        setEditingPost((prev) => ({
                          ...prev,
                          featured_image: meta.localPreviewUrl || meta.path,
                          featured_image_path: meta.path,
                        }));
                      }}
                      onFileRemoved={() => {
                        setEditingPost((prev) => ({ ...prev, featured_image: '', featured_image_path: '' }));
                      }}
                      helpText="Upload an article cover image or pick from the media library."
                    />
                  </div>

                  <div className="form-group">
                    <label>Lead Excerpt</label>
                    <textarea
                      rows="2"
                      value={editingPost.excerpt}
                      onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                      placeholder="Brief summary displayed on cards and search results..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Full Content (Markdown Supported)</label>
                    <textarea
                      rows="8"
                      required
                      value={editingPost.content}
                      onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                      placeholder="### Overview&#10;&#10;Write comprehensive article text here..."
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" className="btn btn-secondary" onClick={() => setEditingPost(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save &amp; Update Article
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Posts Table */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-6 text-muted">No articles found.</td>
                    </tr>
                  ) : (
                    posts.map((post) => (
                      <tr key={post.id}>
                        <td className="font-medium" style={{ color: 'var(--color-text)' }}>{post.title}</td>
                        <td>
                          <span className="badge category-badge">{post.category}</span>
                        </td>
                        <td>
                          <span className={`status-badge ${post.status}`}>{post.status}</span>
                        </td>
                        <td className="text-sm text-muted">
                          {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td>
                          <div className="btn-group">
                            <button
                              type="button"
                              className="btn btn-secondary btn-xs"
                              onClick={() => setEditingPost(post)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-xs"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB 3: RESEARCH UPDATES & IP CHECKPOINT */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'research' && (
          <div className="research-tab-view space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Research Milestones &amp; Updates</h2>
                <p className="text-sm text-muted">
                  High-level public progress announcements protected by the Research IP &amp; Confidentiality Policy.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() =>
                  setEditingResearch({
                    title: '',
                    summary: '',
                    category: 'Milestone',
                    status: 'draft',
                    visibility: 'public',
                  })
                }
              >
                + Post Research Milestone
              </button>
            </div>

            {/* Research Editor */}
            {editingResearch && (
              <div className="card p-6 shadow-sm" style={{ background: '#ffffff', borderRadius: 'var(--radius-md)' }}>
                <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                    {editingResearch.id ? 'Edit Research Milestone' : 'Add Research Milestone'}
                  </h3>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingResearch(null)}>
                    Cancel
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    triggerResearchSave(editingResearch);
                  }}
                  className="space-y-4"
                >
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Milestone Title *</label>
                      <input
                        type="text"
                        required
                        value={editingResearch.title}
                        onChange={(e) => setEditingResearch({ ...editingResearch, title: e.target.value })}
                        placeholder="e.g. Multi-Sensor Data Validation Completed"
                      />
                    </div>
                    <div className="form-group">
                      <label>Milestone Category</label>
                      <select
                        value={editingResearch.category}
                        onChange={(e) => setEditingResearch({ ...editingResearch, category: e.target.value })}
                      >
                        <option value="Milestone">General Research Milestone</option>
                        <option value="Experiment">Experimental Progress</option>
                        <option value="Presentation">Conference / Seminar Presentation</option>
                        <option value="Publication">Paper Submission / Acceptance</option>
                      </select>
                    </div>
                  </div>

                  {/* Milestone Figure / Diagram with Local Uploader & Library Picker */}
                  <div className="form-group">
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-sm">Research Figure / Plot (Optional)</label>
                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        onClick={() => setPickerConfig({ target: 'researchFigure', filter: 'image' })}
                      >
                        📁 Choose from Media Library
                      </button>
                    </div>
                    <UniversalFileUploader
                      acceptedType="image"
                      initialValue={
                        editingResearch.figure_url
                          ? { filename: editingResearch.figure_url.split('/').pop(), path: editingResearch.figure_url }
                          : null
                      }
                      onFileSelected={(meta) => {
                        setEditingResearch((prev) => ({
                          ...prev,
                          figure_url: meta.localPreviewUrl || meta.path,
                          figure_path: meta.path,
                        }));
                      }}
                      onFileRemoved={() => {
                        setEditingResearch((prev) => ({ ...prev, figure_url: '', figure_path: '' }));
                      }}
                      helpText="Attach a sensor diagram, setup photo, or public-safe architecture chart."
                    />
                  </div>

                  <div className="form-group">
                    <label>High-Level Public Summary *</label>
                    <textarea
                      rows="3"
                      required
                      value={editingResearch.summary}
                      onChange={(e) => setEditingResearch({ ...editingResearch, summary: e.target.value })}
                      placeholder="Broad, non-confidential description of milestone progress..."
                    />
                    <span className="text-xs text-muted block mt-1">
                      ⚠️ Confidentiality Note: Do not disclose unpublished mathematical formulations, confidential step-by-step pipeline architectures, or raw experimental weights.
                    </span>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Publication Status</label>
                      <select
                        value={editingResearch.status}
                        onChange={(e) => setEditingResearch({ ...editingResearch, status: e.target.value })}
                      >
                        <option value="draft">Draft (Private)</option>
                        <option value="published">Published (Public)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Visibility</label>
                      <select
                        value={editingResearch.visibility}
                        onChange={(e) => setEditingResearch({ ...editingResearch, visibility: e.target.value })}
                      >
                        <option value="public">Public</option>
                        <option value="private">Private (Admin only)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" className="btn btn-secondary" onClick={() => setEditingResearch(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Milestone
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Research Updates Table */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Milestone Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Visibility</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {researchUpdates.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-6 text-muted">No research milestones recorded yet.</td>
                    </tr>
                  ) : (
                    researchUpdates.map((ru) => (
                      <tr key={ru.id}>
                        <td className="font-medium" style={{ color: 'var(--color-text)' }}>{ru.title}</td>
                        <td>
                          <span className="badge category-badge">{ru.category}</span>
                        </td>
                        <td>
                          <span className={`status-badge ${ru.status}`}>{ru.status}</span>
                        </td>
                        <td>
                          <span className="text-xs">{ru.visibility === 'public' ? '🌐 Public' : '🔒 Private'}</span>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button
                              type="button"
                              className="btn btn-secondary btn-xs"
                              onClick={() => setEditingResearch(ru)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-xs"
                              onClick={() => handleDeleteResearch(ru.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB 4: DOCUMENTS & CV MANAGER */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'docs' && (
          <div className="docs-tab-view space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Documents &amp; CV Management</h2>
                <p className="text-sm text-muted">Upload and publish verified academic CVs, official certifications, and technical reports.</p>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() =>
                  setEditingDoc({
                    title: '',
                    description: '',
                    category: 'CV',
                    file_url: './assets/documents/',
                    file_type: 'PDF',
                    file_size: '200 KB',
                    version: 'v2.2',
                    is_current_cv: false,
                    status: 'published',
                  })
                }
              >
                + Add Document / New CV
              </button>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* PRIMARY WORKFLOW: ACTUAL CV BINARY UPLOAD & VERIFICATION      */}
            {/* ------------------------------------------------------------- */}
            {(() => {
              const activeCv = documents.find((d) => d.is_current_cv) || {
                title: 'Official Academic Curriculum Vitae — Marye Agegn',
                version: 'v2.2',
                file_size: '240 KB',
                file_url: './assets/documents/Marye_Agegn_Academic_CV.pdf',
              };

              return (
                <div
                  className="card p-6"
                  style={{
                    background: '#f8fafc',
                    border: '2px solid #0284c7',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="badge" style={{ background: '#0284c7', color: '#ffffff', fontWeight: 700 }}>
                          PRIMARY CV WORKFLOW
                        </span>
                        <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)', margin: 0 }}>
                          Upload &amp; Activate Actual Academic CV (Binary PDF)
                        </h3>
                      </div>
                      <p className="text-sm text-muted mt-1 max-w-2xl">
                        Upload your real binary PDF document. The engine cryptographically verifies the <code>%PDF-</code> magic byte signature and stores the authentic binary file in Supabase Storage. The public website "Download CV" buttons immediately serve this exact file without source-code edits.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={activeCv.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <span>Test Active PDF In Viewer</span> ↗
                      </a>
                    </div>
                  </div>

                  {/* Current Active CV Status Card */}
                  <div
                    className="mt-4 p-4 rounded-md grid grid-cols-1 md:grid-cols-4 gap-4"
                    style={{ background: '#ffffff', border: '1px solid #cbd5e1' }}
                  >
                    <div>
                      <span className="text-xs text-muted block">Active Document</span>
                      <strong className="text-sm" style={{ color: 'var(--color-text)' }}>{activeCv.title}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-muted block">Version Tag</span>
                      <strong className="text-sm font-mono text-primary">{activeCv.version || 'v2.2'}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-muted block">Binary File Size</span>
                      <strong className="text-sm">{activeCv.file_size || 'Verified Binary'}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-muted block">MIME &amp; Magic Bytes</span>
                      <span className="badge badge-sm" style={{ background: '#ecfdf5', color: '#047857', fontWeight: 600 }}>
                        application/pdf (%PDF-)
                      </span>
                    </div>
                  </div>

                  {/* Upload Notification Alert */}
                  {cvUploadMsg && (
                    <div
                      className="mt-4 p-3 rounded text-sm"
                      style={{
                        background: cvUploadMsg.type === 'success' ? '#ecfdf5' : '#fef2f2',
                        color: cvUploadMsg.type === 'success' ? '#065f46' : '#991b1b',
                        border: `1px solid ${cvUploadMsg.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
                      }}
                    >
                      {cvUploadMsg.type === 'success' ? '✓ ' : '⚠️ '}
                      {cvUploadMsg.text}
                    </div>
                  )}

                  {/* Upload Controls */}
                  <div className="mt-4 flex flex-wrap items-end gap-4">
                    <div style={{ minWidth: '130px' }}>
                      <label className="text-xs font-semibold block mb-1">New Version Tag</label>
                      <input
                        type="text"
                        value={cvVersionInput}
                        onChange={(e) => setCvVersionInput(e.target.value)}
                        placeholder="e.g. v2.3"
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div className="flex-1" style={{ minWidth: '240px' }}>
                      <label className="text-xs font-semibold block mb-1">Select Genuine PDF File</label>
                      <input
                        ref={cvFileInputRef}
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={handleCvFileUpload}
                        disabled={cvUploading}
                        style={{
                          padding: '0.4rem',
                          fontSize: '0.85rem',
                          border: '1px dashed #94a3b8',
                          borderRadius: 'var(--radius-sm)',
                          width: '100%',
                          background: '#ffffff',
                        }}
                      />
                    </div>

                    <div>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={cvUploading}
                        onClick={() => cvFileInputRef.current?.click()}
                      >
                        {cvUploading ? 'Validating Magic Bytes & Uploading...' : 'Upload & Activate CV PDF'}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-muted mt-3 mb-0">
                    🛡️ <strong>Integrity Safeguard:</strong> Renaming an HTML or text file to <code>.pdf</code> will be strictly rejected. The file must begin with byte sequence <code>0x25 0x50 0x44 0x46 0x2D</code>.
                  </p>
                </div>
              );
            })()}

            {/* Document Editor */}
            {editingDoc && (
              <div className="card p-6 shadow-sm" style={{ background: '#ffffff', borderRadius: 'var(--radius-md)' }}>
                <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                    {editingDoc.id ? 'Edit Document Entry' : 'Add New Document / CV'}
                  </h3>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingDoc(null)}>
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSaveDoc} className="space-y-4">
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Document Title *</label>
                      <input
                        type="text"
                        required
                        value={editingDoc.title}
                        onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                        placeholder="e.g. Academic Curriculum Vitae"
                      />
                    </div>
                    <div className="form-group">
                      <label>File URL or Canonical Path *</label>
                      <input
                        type="text"
                        required
                        value={editingDoc.file_url}
                        onChange={(e) => setEditingDoc({ ...editingDoc, file_url: e.target.value })}
                        placeholder="./assets/documents/Marye_Agegn_CV.pdf"
                      />
                    </div>
                  </div>

                  <div className="form-grid-3">
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={editingDoc.category}
                        onChange={(e) => setEditingDoc({ ...editingDoc, category: e.target.value })}
                      >
                        <option value="CV">CV / Resume</option>
                        <option value="Report">Report / Thesis Summary</option>
                        <option value="Presentation">Presentation Slides</option>
                        <option value="Certificate">Certificate / Award</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Version Tag</label>
                      <input
                        type="text"
                        value={editingDoc.version}
                        onChange={(e) => setEditingDoc({ ...editingDoc, version: e.target.value })}
                        placeholder="v2.2"
                      />
                    </div>
                    <div className="form-group">
                      <label>File Size</label>
                      <input
                        type="text"
                        value={editingDoc.file_size}
                        onChange={(e) => setEditingDoc({ ...editingDoc, file_size: e.target.value })}
                        placeholder="240 KB"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description &amp; Purpose</label>
                    <textarea
                      rows="2"
                      value={editingDoc.description}
                      onChange={(e) => setEditingDoc({ ...editingDoc, description: e.target.value })}
                    />
                  </div>

                  {/* Universal Local Document Upload Component with Media Library Picker */}
                  <div className="form-group">
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-sm">Upload Local Document File</label>
                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        onClick={() => setPickerConfig({ target: 'doc', filter: 'document' })}
                      >
                        📁 Choose from Media Library
                      </button>
                    </div>
                    <UniversalFileUploader
                      acceptedType="document"
                      initialValue={
                        editingDoc.file_name
                          ? { filename: editingDoc.file_name, path: editingDoc.file_url, file_size: editingDoc.file_size }
                          : null
                      }
                      onFileSelected={(meta) => {
                        setEditingDoc((prev) => ({
                          ...prev,
                          file_url: meta.localPreviewUrl || meta.path,
                          file_name: meta.filename,
                          file_size: meta.fileSizeFormatted,
                          file_type: meta.filename.split('.').pop().toUpperCase(),
                        }));
                      }}
                      onFileRemoved={() => {
                        setEditingDoc((prev) => ({ ...prev, file_url: '', file_name: '', file_size: '' }));
                      }}
                    />
                  </div>

                  <div className="form-group checkbox-group">
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={editingDoc.is_current_cv}
                        onChange={(e) => setEditingDoc({ ...editingDoc, is_current_cv: e.target.checked })}
                      />
                      <span>Set as Current Active Public CV (replaces previous version as default download)</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" className="btn btn-secondary" onClick={() => setEditingDoc(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Document Entry
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Documents Table */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Category</th>
                    <th>Version</th>
                    <th>Active CV Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-6 text-muted">No documents registered.</td>
                    </tr>
                  ) : (
                    documents.map((doc) => (
                      <tr key={doc.id}>
                        <td className="font-medium" style={{ color: 'var(--color-text)' }}>{doc.title}</td>
                        <td>
                          <span className="badge category-badge">{doc.category}</span>
                        </td>
                        <td>{doc.version}</td>
                        <td>
                          {doc.is_current_cv ? (
                            <span
                              className="badge"
                              style={{
                                background: 'var(--color-success-bg)',
                                color: 'var(--color-success)',
                                border: '1px solid var(--color-success-border)',
                                fontWeight: 600,
                              }}
                            >
                              Active CV ★
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td>
                          <div className="btn-group">
                            <button
                              type="button"
                              className="btn btn-secondary btn-xs"
                              onClick={() => setEditingDoc(doc)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-xs"
                              onClick={() => handleDeleteDoc(doc.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB 5: MEDIA ITEMS */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'media' && (
          <div className="media-tab-view space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Media Stream Management</h2>
                <p className="text-sm text-muted">Manage conference recordings, clinical demonstration clips, and audio discussions.</p>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() =>
                  setEditingMedia({
                    title: '',
                    description: '',
                    media_type: 'video',
                    file_url: './assets/media/',
                    category: 'Presentation',
                    status: 'published',
                  })
                }
              >
                + Add New Media
              </button>
            </div>

            {/* Media Editor */}
            {editingMedia && (
              <div className="card p-6 shadow-sm" style={{ background: '#ffffff', borderRadius: 'var(--radius-md)' }}>
                <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                    {editingMedia.id ? 'Edit Media Item' : 'Add New Media Item'}
                  </h3>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingMedia(null)}>
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSaveMedia} className="space-y-4">
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Title *</label>
                      <input
                        type="text"
                        required
                        value={editingMedia.title}
                        onChange={(e) => setEditingMedia({ ...editingMedia, title: e.target.value })}
                        placeholder="e.g. Gait Analysis Hardware Demo"
                      />
                    </div>
                    <div className="form-group">
                      <label>Media Type</label>
                      <select
                        value={editingMedia.media_type}
                        onChange={(e) => setEditingMedia({ ...editingMedia, media_type: e.target.value })}
                      >
                        <option value="video">Video (MP4 or Embedded Stream)</option>
                        <option value="audio">Audio (MP3 or Podcast Recording)</option>
                      </select>
                    </div>
                  </div>

                  {/* Universal Local Media Uploader with Media Library Picker */}
                  <div className="form-group">
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-sm">Upload Local Video / Audio File</label>
                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        onClick={() => setPickerConfig({ target: 'media', filter: 'video' })}
                      >
                        📁 Choose from Media Library
                      </button>
                    </div>
                    <UniversalFileUploader
                      acceptedType={editingMedia.media_type === 'audio' ? 'all' : 'video'}
                      initialValue={
                        editingMedia.file_name
                          ? { filename: editingMedia.file_name, path: editingMedia.file_url, file_size: editingMedia.file_size, media_type: editingMedia.media_type }
                          : null
                      }
                      onFileSelected={(meta) => {
                        setEditingMedia((prev) => ({
                          ...prev,
                          file_url: meta.localPreviewUrl || meta.path,
                          file_name: meta.filename,
                          file_size: meta.fileSizeFormatted,
                          media_type: meta.type || 'video',
                        }));
                      }}
                      onFileRemoved={() => {
                        setEditingMedia((prev) => ({ ...prev, file_url: '', file_name: '', file_size: '' }));
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Or enter Direct Video / Audio URL</label>
                    <input
                      type="text"
                      required
                      placeholder="./assets/media/video.mp4 or Supabase Storage URL"
                      value={editingMedia.file_url || ''}
                      onChange={(e) => setEditingMedia({ ...editingMedia, file_url: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Description &amp; Academic Context</label>
                    <textarea
                      rows="2"
                      value={editingMedia.description}
                      onChange={(e) => setEditingMedia({ ...editingMedia, description: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" className="btn btn-secondary" onClick={() => setEditingMedia(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Media Item
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Media Table */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>File Source</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mediaItems.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-muted">No media items recorded yet.</td>
                    </tr>
                  ) : (
                    mediaItems.map((item) => (
                      <tr key={item.id}>
                        <td className="font-medium" style={{ color: 'var(--color-text)' }}>{item.title}</td>
                        <td>
                          <span className="badge category-badge">{item.media_type}</span>
                        </td>
                        <td className="text-xs text-muted truncate max-w-xs">{item.file_url || item.embed_url}</td>
                        <td>
                          <div className="btn-group">
                            <button
                              type="button"
                              className="btn btn-secondary btn-xs"
                              onClick={() => setEditingMedia(item)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-xs"
                              onClick={() => handleDeleteMedia(item.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB 6: INBOUND MESSAGES & COLLABORATIONS */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'messages' && (
          <div className="messages-tab-view space-y-8">
            {/* Collaborations Section */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                  Research &amp; Industry Collaboration Proposals ({collaborations.length})
                </h2>
                <p className="text-sm text-muted">Inbound proposals submitted through the Collaboration Gateway modal.</p>
              </div>

              {collaborations.length === 0 ? (
                <div className="card p-8 text-center text-muted" style={{ background: '#ffffff', borderRadius: 'var(--radius-md)' }}>
                  No collaboration proposals received yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {collaborations.map((collab) => (
                    <div
                      key={collab.id}
                      className="card p-6"
                      style={{
                        background: '#ffffff',
                        borderRadius: 'var(--radius-md)',
                        borderLeft: '4px solid var(--color-primary)',
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>{collab.name}</h3>
                          <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                            {collab.organization}
                          </span>
                          <span className="text-muted text-sm ml-3">✉️ {collab.email}</span>
                        </div>
                        <span className="badge category-badge">{collab.collaboration_type}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                        <div><strong>Research Domain:</strong> {collab.area_of_interest}</div>
                        <div><strong>Target Timeline:</strong> {collab.urgency_level || 'Flexible'}</div>
                        {collab.phone && <div><strong>Phone:</strong> {collab.phone}</div>}
                        {collab.linkedin && <div><strong>LinkedIn:</strong> {collab.linkedin}</div>}
                        {collab.orcid && <div><strong>ORCID:</strong> {collab.orcid}</div>}
                        {collab.website && <div><strong>Website:</strong> {collab.website}</div>}
                      </div>

                      {collab.proposal_file_name && (
                        <div className="mt-3 p-2 rounded text-sm flex items-center gap-2" style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)' }}>
                          <span>📎 Attached Proposal:</span>
                          <strong>{collab.proposal_file_name}</strong>
                          {collab.proposal_file_size && <span className="text-xs text-muted">({(collab.proposal_file_size / 1024 / 1024).toFixed(2)} MB)</span>}
                        </div>
                      )}

                      <div className="mt-3 p-4 rounded text-sm whitespace-pre-wrap" style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                        {collab.message}
                      </div>

                      <div className="mt-3 text-xs text-muted">
                        Submitted: {new Date(collab.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* General Inbound Messages */}
            <div className="pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
              <div className="mb-4">
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                  Direct Contact Messages ({messages.length})
                </h2>
                <p className="text-sm text-muted">Messages received through the general contact form.</p>
              </div>

              {messages.length === 0 ? (
                <div className="card p-8 text-center text-muted" style={{ background: '#ffffff', borderRadius: 'var(--radius-md)' }}>
                  No direct contact messages recorded.
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="card p-6" style={{ background: '#ffffff', borderRadius: 'var(--radius-md)' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold" style={{ color: 'var(--color-text)' }}>{msg.name}</h3>
                          <span className="text-muted text-sm">{msg.email}</span>
                        </div>
                        <span className="badge category-badge">{msg.category || 'General'}</span>
                      </div>
                      <h4 className="font-semibold mt-2" style={{ color: 'var(--color-primary)' }}>{msg.subject}</h4>
                      <p className="mt-2 p-3 rounded text-sm" style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                        {msg.message}
                      </p>
                      <div className="mt-2 text-xs text-muted">
                        Received: {new Date(msg.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB 7: SETTINGS & SUPABASE CONFIG */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div className="settings-tab-view max-w-2xl mx-auto space-y-6">
            <div className="card p-8 shadow-sm" style={{ background: '#ffffff', borderRadius: 'var(--radius-md)' }}>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Backend Synchronization (Supabase)</h2>
              <p className="text-sm text-muted mb-6">
                Connect your Supabase project to enable persistent PostgreSQL cloud storage, multi-device management, and file storage buckets.
              </p>

              {settingsNotice && (
                <div
                  className="p-3 mb-4 text-sm rounded"
                  style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)', border: '1px solid var(--color-success-border)' }}
                >
                  {settingsNotice}
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="form-group">
                  <label htmlFor="supa-url">Supabase Project URL</label>
                  <input
                    id="supa-url"
                    type="url"
                    placeholder="https://your-project.supabase.co"
                    value={supabaseUrlInput}
                    onChange={(e) => setSupabaseUrlInput(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="supa-key">Supabase Public Anon Key</label>
                  <input
                    id="supa-key"
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={supabaseAnonKeyInput}
                    onChange={(e) => setSupabaseAnonKeyInput(e.target.value)}
                  />
                  <span className="text-xs text-muted mt-1 block">
                    🔒 The <code>anon</code> public key is safe for client-side use because data access is strictly governed by PostgreSQL Row Level Security (RLS). Never enter privileged backend secret keys in client forms.
                  </span>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Open Supabase Dashboard ↗
                  </a>
                  <button type="submit" className="btn btn-primary">
                    Save Configuration
                  </button>
                </div>
              </form>
            </div>

            <div className="card p-6" style={{ background: '#ffffff', borderRadius: 'var(--radius-md)' }}>
              <h3 className="text-md font-bold mb-2" style={{ color: 'var(--color-text)' }}>Database Initialization Schema</h3>
              <p className="text-sm text-muted">
                To initialize or verify your PostgreSQL tables, copy the migration script from <code>src/data/supabaseSchema.sql</code> and execute it in your Supabase SQL Editor.
              </p>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* MANDATORY RESEARCH IP CHECKPOINT MODAL */}
        {/* ------------------------------------------------------- */}
        {ipModalData && (
          <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div
              className="modal-dialog card p-8 max-w-lg shadow-lg"
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                border: '2px solid var(--color-warning)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="badge"
                  style={{
                    background: 'var(--color-warning-bg)',
                    color: 'var(--color-warning)',
                    border: '1px solid var(--color-warning-border)',
                    fontWeight: 600,
                  }}
                >
                  ⚠️ Research Confidentiality Checkpoint
                </span>
              </div>

              <h3 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                Pre-Publication IP Verification
              </h3>
              <p className="mt-2 text-sm text-muted">
                You are about to publish a research milestone titled: <strong>"{ipModalData.title}"</strong>.
              </p>

              <div
                className="p-4 rounded mt-4 text-xs space-y-2"
                style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
              >
                <p className="font-semibold">Academic Integrity &amp; Novelty Guardrails:</p>
                <ul className="list-disc pl-4 space-y-1 text-muted">
                  <li>Does this text disclose unpublished mathematical formulas or novel feature engineering?</li>
                  <li>Does it reveal specific, unreleased hyperparameters or exact ablation tables?</li>
                  <li>Could this compromise the patentability or primary journal novelty of your Master's thesis?</li>
                </ul>
              </div>

              <div className="checkpoint-checkbox mt-6">
                <label className="flex items-start gap-3 cursor-pointer text-sm" style={{ color: 'var(--color-text)' }}>
                  <input
                    type="checkbox"
                    checked={ipConfirmed}
                    onChange={(e) => setIpConfirmed(e.target.checked)}
                    className="mt-1"
                  />
                  <span>
                    <strong>I confirm:</strong> This update contains only high-level, public-safe information and does not disclose confidential research novelty or unpublished data.
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    proceedSaveResearch({ ...ipModalData, status: 'draft' });
                  }}
                >
                  Keep as Private Draft
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!ipConfirmed}
                  onClick={() => proceedSaveResearch(ipModalData)}
                >
                  Confirm &amp; Publish Publicly →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* REUSABLE MEDIA PICKER MODAL FOR EDITORS                 */}
        {/* ------------------------------------------------------- */}
        {pickerConfig && (
          <div className="modal-backdrop" role="dialog" aria-modal="true" style={{ zIndex: 9999 }}>
            <div
              className="modal-dialog card p-6 max-w-4xl shadow-xl"
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                maxHeight: '90vh',
                overflowY: 'auto',
                width: '95%',
              }}
            >
              <MediaLibrary
                isPickerMode={true}
                pickerFilter={pickerConfig.filter || 'all'}
                onSelectMedia={handlePickerSelect}
                onClosePicker={() => setPickerConfig(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
