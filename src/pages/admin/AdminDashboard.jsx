import React, { useState, useEffect } from 'react';
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
} from '../../data/contentStore';

export function AdminDashboard() {
  // Authentication state
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [localAdminAuthenticated, setLocalAdminAuthenticated] = useState(false);

  // Dashboard active tab
  const [activeTab, setActiveTab] = useState('overview'); // overview, posts, research, docs, media, messages, settings

  // Content collections
  const [posts, setPosts] = useState([]);
  const [researchUpdates, setResearchUpdates] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [messages, setMessages] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Form states
  const [editingPost, setEditingPost] = useState(null);
  const [editingResearch, setEditingResearch] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [editingMedia, setEditingMedia] = useState(null);

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
    // Check local session storage first
    const localSession = sessionStorage.getItem('marye_admin_authenticated');
    if (localSession === 'true') {
      setLocalAdminAuthenticated(true);
    }

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

  // Fetch all content
  useEffect(() => {
    async function loadAll() {
      const [allPosts, allResearch, allDocs, allMedia, allMsgs, allCollabs] = await Promise.all([
        getPosts(true),
        getResearchUpdates(true),
        getDocuments(),
        getMediaItems(),
        getInboundMessages(),
        getInboundCollaborations(),
      ]);
      setPosts(allPosts);
      setResearchUpdates(allResearch);
      setDocuments(allDocs);
      setMediaItems(allMedia);
      setMessages(allMsgs);
      setCollaborations(allCollabs);
    }
    loadAll();
  }, [refreshTrigger]);

  const isAuthenticated = Boolean(session || localAdminAuthenticated);

  // Handle Login
  async function handleLogin(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message);
        setAuthLoading(false);
        return;
      }
    } else {
      // Local development / fallback passkey
      if (password === 'admin' || password === 'marye2025') {
        sessionStorage.setItem('marye_admin_authenticated', 'true');
        setLocalAdminAuthenticated(true);
      } else {
        setAuthError('Invalid password. (Tip: Use "marye2025" or configure Supabase credentials in settings).');
      }
    }
    setAuthLoading(false);
  }

  function handleLogout() {
    if (supabase && isSupabaseConfigured) {
      supabase.auth.signOut();
    }
    sessionStorage.removeItem('marye_admin_authenticated');
    setSession(null);
    setLocalAdminAuthenticated(false);
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
      // Trigger IP Checkpoint
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

  // If NOT authenticated, show Login View
  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper py-16">
        <div className="container">
          <div className="admin-login-card card max-w-md mx-auto p-8">
            <div className="admin-login-header text-center mb-6">
              <span className="section-badge">Platform Management</span>
              <h2 className="text-2xl font-bold mt-2">Administrator Access</h2>
              <p className="text-muted text-sm mt-1">Private control panel for Marye Agegn</p>
            </div>

            {authError && <div className="alert-error-banner p-3 mb-4 text-sm">{authError}</div>}

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

            <div className="admin-login-footer mt-6 pt-4 border-t border-slate text-center text-xs text-muted">
              <p>🔒 Authenticated via PostgreSQL Row Level Security (RLS).</p>
              <a href="#/" className="inline-block mt-2 text-cyan">
                ← Return to Public Portfolio
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="admin-dashboard-page py-10">
      <div className="container">
        {/* Top Bar */}
        <div className="admin-top-bar card p-4 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="badge badge-success">Admin Session Active</span>
            <h1 className="admin-brand-title text-xl font-bold">Marye Agegn • Platform CMS</h1>
            <span className="text-xs text-muted">
              {isSupabaseConfigured ? '🟢 Connected to Supabase' : '🟡 Offline / Local Store Mode'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#/" className="btn btn-secondary btn-sm" target="_blank" rel="noopener noreferrer">
              View Live Website ↗
            </a>
            <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
              Sign Out ⎋
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="admin-tabs-bar mb-8" role="tablist">
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'posts', label: `📝 Articles (${posts.length})` },
            { id: 'research', label: `🔬 Research Updates (${researchUpdates.length})` },
            { id: 'docs', label: `📄 Documents & CV (${documents.length})` },
            { id: 'media', label: `🎥 Media Items (${mediaItems.length})` },
            { id: 'messages', label: `📬 Inbound (${messages.length + collaborations.length})` },
            { id: 'settings', label: '⚙️ Database Settings' },
          ].map((tab) => (
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

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="overview-tab-view space-y-8">
            <div className="stats-grid grid grid-cols-4 gap-4">
              <div className="stat-card card p-6">
                <span className="text-muted text-sm">Total Articles</span>
                <div className="text-3xl font-bold text-cyan mt-1">{posts.length}</div>
                <span className="text-xs text-muted">{posts.filter((p) => p.status === 'published').length} Published</span>
              </div>
              <div className="stat-card card p-6">
                <span className="text-muted text-sm">Research Milestones</span>
                <div className="text-3xl font-bold text-cyan mt-1">{researchUpdates.length}</div>
                <span className="text-xs text-muted">Protected under IP Policy</span>
              </div>
              <div className="stat-card card p-6">
                <span className="text-muted text-sm">Verified Documents</span>
                <div className="text-3xl font-bold text-cyan mt-1">{documents.length}</div>
                <span className="text-xs text-muted">Active CV: {documents.find((d) => d.is_current_cv)?.version || 'v2.1'}</span>
              </div>
              <div className="stat-card card p-6">
                <span className="text-muted text-sm">Inbound Requests</span>
                <div className="text-3xl font-bold text-cyan mt-1">{messages.length + collaborations.length}</div>
                <span className="text-xs text-muted">{collaborations.length} Research Proposals</span>
              </div>
            </div>

            <div className="quick-actions-card card p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Content Actions</h3>
              <div className="flex gap-4">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
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
                  + Write New Article
                </button>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
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
                      description: 'Updated academic CV detailing recent appointments and research.',
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

        {/* TAB 2: POSTS MANAGER */}
        {activeTab === 'posts' && (
          <div className="posts-tab-view space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Articles &amp; Technical Notes</h2>
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

            {/* Post Editor Drawer */}
            {editingPost && (
              <div className="editor-modal card p-6 border-cyan">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">{editingPost.id ? 'Edit Article' : 'Draft New Article'}</h3>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingPost(null)}>
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSavePost} className="space-y-4">
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Title *</label>
                      <input
                        type="text"
                        required
                        value={editingPost.title}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                        placeholder="Article Headline..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Slug URL *</label>
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
                        <option value="Clinical Engineering">Clinical Engineering</option>
                        <option value="Wearable Sensors">Wearable Sensors</option>
                        <option value="Explainable AI">Explainable AI</option>
                        <option value="Healthcare Technology">Healthcare Technology</option>
                        <option value="Biomedical Research">Biomedical Research</option>
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
                      <label>Publication Status</label>
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

                  <div className="form-group">
                    <label>Short Excerpt (Lead summary for search &amp; cards)</label>
                    <textarea
                      rows="2"
                      value={editingPost.excerpt}
                      onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                      placeholder="Brief synopsis..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Article Content (Markdown supported)</label>
                    <textarea
                      rows="8"
                      required
                      value={editingPost.content}
                      onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                      placeholder="### Subheading&#10;&#10;Write technical analysis here..."
                    />
                  </div>

                  <div className="flex justify-end gap-3">
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
            <div className="card overflow-hidden">
              <table className="admin-table w-full">
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
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td className="font-medium">{post.title}</td>
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: RESEARCH UPDATES WITH IP PROTECTION CHECKPOINT */}
        {activeTab === 'research' && (
          <div className="research-tab-view space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Research Milestones &amp; Updates</h2>
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
              <div className="editor-modal card p-6 border-cyan">
                <h3 className="text-lg font-bold mb-4">
                  {editingResearch.id ? 'Edit Research Milestone' : 'Add Research Milestone'}
                </h3>
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
                        placeholder="e.g., DUO Gait Baseline Benchmarking Initiated"
                      />
                    </div>
                    <div className="form-group">
                      <label>Milestone Type</label>
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

                  <div className="form-group">
                    <label>High-Level Public Summary *</label>
                    <textarea
                      rows="3"
                      required
                      value={editingResearch.summary}
                      onChange={(e) => setEditingResearch({ ...editingResearch, summary: e.target.value })}
                      placeholder="Broad, non-confidential description of progress..."
                    />
                    <span className="text-xs text-muted block mt-1">
                      ⚠️ Remember: Do NOT include raw hyperparameters, unpublished equations, or novel architecture secrets.
                    </span>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Status</label>
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

                  <div className="flex justify-end gap-3 mt-4">
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
            <div className="card overflow-hidden">
              <table className="admin-table w-full">
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
                  {researchUpdates.map((ru) => (
                    <tr key={ru.id}>
                      <td className="font-medium">{ru.title}</td>
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: DOCUMENTS & CV MANAGER */}
        {activeTab === 'docs' && (
          <div className="docs-tab-view space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Documents &amp; CV Management</h2>
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

            {/* Document Editor Form */}
            {editingDoc && (
              <div className="editor-modal card p-6 border-cyan">
                <h3 className="text-lg font-bold mb-4">
                  {editingDoc.id ? 'Edit Document Entry' : 'Add New Document / CV'}
                </h3>
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
                      <label>File URL or Path *</label>
                      <input
                        type="text"
                        required
                        value={editingDoc.file_url}
                        onChange={(e) => setEditingDoc({ ...editingDoc, file_url: e.target.value })}
                        placeholder="./assets/documents/Marye_Agegn_CV.pdf or Supabase URL"
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
                    <label>Description</label>
                    <textarea
                      rows="2"
                      value={editingDoc.description}
                      onChange={(e) => setEditingDoc({ ...editingDoc, description: e.target.value })}
                    />
                  </div>

                  <div className="form-group checkbox-group">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingDoc.is_current_cv}
                        onChange={(e) => setEditingDoc({ ...editingDoc, is_current_cv: e.target.checked })}
                      />
                      <span>Set as Current Active Public CV (Replaces previous active version)</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
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
            <div className="card overflow-hidden">
              <table className="admin-table w-full">
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Category</th>
                    <th>Version</th>
                    <th>Current Active CV</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="font-medium">{doc.title}</td>
                      <td>
                        <span className="badge category-badge">{doc.category}</span>
                      </td>
                      <td>{doc.version}</td>
                      <td>{doc.is_current_cv ? <span className="badge badge-success">Active CV ★</span> : '—'}</td>
                      <td>
                        <div className="btn-group">
                          <button type="button" className="btn btn-secondary btn-xs" onClick={() => setEditingDoc(doc)}>
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: MEDIA ITEMS */}
        {activeTab === 'media' && (
          <div className="media-tab-view space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Media Stream Management</h2>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() =>
                  setEditingMedia({
                    title: '',
                    description: '',
                    media_type: 'video',
                    embed_url: 'https://www.youtube-nocookie.com/embed/',
                    category: 'Presentation',
                    status: 'published',
                  })
                }
              >
                + Embed New Media
              </button>
            </div>

            {editingMedia && (
              <div className="editor-modal card p-6 border-cyan">
                <h3 className="text-lg font-bold mb-4">{editingMedia.id ? 'Edit Media' : 'Embed New Media'}</h3>
                <form onSubmit={handleSaveMedia} className="space-y-4">
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Title *</label>
                      <input
                        type="text"
                        required
                        value={editingMedia.title}
                        onChange={(e) => setEditingMedia({ ...editingMedia, title: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Media Type</label>
                      <select
                        value={editingMedia.media_type}
                        onChange={(e) => setEditingMedia({ ...editingMedia, media_type: e.target.value })}
                      >
                        <option value="video">Video (YouTube / Vimeo embed)</option>
                        <option value="audio">Audio (SoundCloud / Stream embed)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Embed URL *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://www.youtube-nocookie.com/embed/VIDEO_ID"
                      value={editingMedia.embed_url}
                      onChange={(e) => setEditingMedia({ ...editingMedia, embed_url: e.target.value })}
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

                  <div className="flex justify-end gap-3 mt-4">
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

            <div className="card overflow-hidden">
              <table className="admin-table w-full">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Embed URL</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mediaItems.map((item) => (
                    <tr key={item.id}>
                      <td className="font-medium">{item.title}</td>
                      <td>
                        <span className="badge category-badge">{item.media_type}</span>
                      </td>
                      <td className="text-xs text-muted truncate max-w-xs">{item.embed_url}</td>
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: INBOUND MESSAGES & COLLABORATIONS */}
        {activeTab === 'messages' && (
          <div className="messages-tab-view space-y-8">
            {/* Collaborations Section */}
            <div>
              <h2 className="text-xl font-bold mb-4">Research &amp; Industry Collaboration Proposals ({collaborations.length})</h2>
              {collaborations.length === 0 ? (
                <div className="card p-6 text-center text-muted">No collaboration proposals received yet.</div>
              ) : (
                <div className="space-y-4">
                  {collaborations.map((collab) => (
                    <div key={collab.id} className="card p-6 border-l-4 border-cyan">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{collab.name}</h3>
                          <span className="text-sm text-cyan">{collab.organization}</span>
                          <span className="text-muted text-sm ml-3">✉️ {collab.email}</span>
                        </div>
                        <span className="badge category-badge">{collab.collaboration_type}</span>
                      </div>
                      <div className="mt-2 text-sm">
                        <strong>Area of Interest:</strong> {collab.area_of_interest}
                      </div>
                      <p className="mt-3 p-3 bg-slate-900 rounded text-sm whitespace-pre-wrap">{collab.message}</p>
                      <div className="mt-2 text-xs text-muted">
                        Submitted: {new Date(collab.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* General Inbound Messages */}
            <div className="pt-6 border-t border-slate">
              <h2 className="text-xl font-bold mb-4">Direct Contact Messages ({messages.length})</h2>
              {messages.length === 0 ? (
                <div className="card p-6 text-center text-muted">No direct contact messages recorded.</div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="card p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold">{msg.name}</h3>
                          <span className="text-muted text-sm">{msg.email}</span>
                        </div>
                        <span className="badge category-badge">{msg.category || 'General'}</span>
                      </div>
                      <h4 className="font-semibold text-cyan mt-2">{msg.subject}</h4>
                      <p className="mt-2 p-3 bg-slate-900 rounded text-sm">{msg.message}</p>
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

        {/* TAB 7: SETTINGS & SUPABASE CONFIG */}
        {activeTab === 'settings' && (
          <div className="settings-tab-view max-w-2xl mx-auto space-y-6">
            <div className="card p-8">
              <h2 className="text-xl font-bold mb-2">Backend Connection (Supabase)</h2>
              <p className="text-sm text-muted mb-6">
                Configure your free Supabase credentials to enable multi-device sync, database persistence, and file storage.
              </p>

              {settingsNotice && <div className="alert-success-banner p-3 mb-4 text-sm">{settingsNotice}</div>}

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
                    🔒 The <code>anon</code> public key is safe for client-side use because data access is strictly governed by PostgreSQL Row Level Security (RLS). Never paste your <code>service_role</code> key here.
                  </span>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan text-sm underline"
                  >
                    Open Supabase Dashboard ↗
                  </a>
                  <button type="submit" className="btn btn-primary">
                    Save Configuration
                  </button>
                </div>
              </form>
            </div>

            <div className="card p-6">
              <h3 className="text-md font-bold mb-2">Database Initialization SQL Script</h3>
              <p className="text-sm text-muted mb-3">
                Need to set up the tables in a new Supabase project? Copy the complete migration script from{' '}
                <code>src/data/supabaseSchema.sql</code> and execute it in your Supabase SQL Editor.
              </p>
            </div>
          </div>
        )}

        {/* MANDATORY RESEARCH INTELLECTUAL PROPERTY CHECKPOINT MODAL */}
        {ipModalData && (
          <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal-dialog ip-checkpoint-dialog card p-8 max-w-lg border-warning">
              <div className="checkpoint-badge-row flex items-center gap-2 mb-3">
                <span className="badge badge-warning">⚠️ Research Confidentiality Checkpoint</span>
              </div>

              <h3 className="text-xl font-bold text-white">Pre-Publication IP Verification</h3>
              <p className="mt-2 text-sm text-muted">
                You are about to publish a research milestone titled: <strong>"{ipModalData.title}"</strong>.
              </p>

              <div className="ip-guideline-box p-4 bg-slate-900 rounded mt-4 text-xs text-muted space-y-2">
                <p className="font-semibold text-white">Academic Integrity &amp; Novelty Guardrails:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Does this text disclose unpublished mathematical formulas or novel feature engineering?</li>
                  <li>Does it reveal specific, unreleased hyperparameters or exact ablation tables?</li>
                  <li>Could this compromise the patentability or primary journal novelty of your Master's thesis?</li>
                </ul>
              </div>

              <div className="checkpoint-checkbox mt-6">
                <label className="flex items-start gap-3 cursor-pointer text-sm">
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

              <div className="modal-actions flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    // Save as draft instead
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
      </div>
    </div>
  );
}

export default AdminDashboard;
