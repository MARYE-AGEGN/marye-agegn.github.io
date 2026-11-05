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
  submitBhnApplication,
  updateBhnApplicationStatus,
  uploadCvPdf,
  getWebinars,
  saveWebinar,
  deleteWebinar,
} from '../../data/contentStore';
import { getMediaLibrary } from '../../data/mediaStore';
import { UniversalFileUploader } from '../../components/common/UniversalFileUploader';
import { MediaLibrary } from '../../components/admin/MediaLibrary';
import { ConsultationWorkspace } from '../../components/admin/ConsultationWorkspace';
import { getGeminiApiKey, setGeminiApiKey } from '../../services/ai/geminiService';

export function AdminDashboard() {
  // Authentication & Admin Authorization state
  const [session, setSession] = useState(null);
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);
  const [checkingAdminRole, setCheckingAdminRole] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot' | 'magic'
  const [showPassword, setShowPassword] = useState(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');
  const [newAdminName, setNewAdminName] = useState('');

  // Dashboard active tab & navigation layout
  const [activeTab, setActiveTab] = useState('overview'); // overview, inquiries, bhn, docs, media_library, posts, research, media, settings
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
  const [isAddingBhnMember, setIsAddingBhnMember] = useState(false);
  const [newBhnForm, setNewBhnForm] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    country: 'Ethiopia',
    background: '',
    statement_of_interest: '',
  });
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
  const [webinarList, setWebinarList] = useState([]);
  const [editingWebinar, setEditingWebinar] = useState(null);

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
  const [geminiKeyInput, setGeminiKeyInput] = useState(() => getGeminiApiKey());
  const [geminiNotice, setGeminiNotice] = useState('');

  // Check auth session
  useEffect(() => {
    // Local development verification mode for automated testing on localhost only
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.sessionStorage.getItem('__dev_admin_bypass__') === 'true') {
      setSession({ user: { id: 'dev-admin-id', email: 'maryeagegn2022@gmail.com' } });
      setIsAdminAuthorized(true);
      setCheckingAdminRole(false);
      return;
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

  // Strict backend admin authorization check
  useEffect(() => {
    let isMounted = true;
    async function checkAdmin(currentSession) {
      if (!currentSession?.user) {
        if (isMounted) {
          setIsAdminAuthorized(false);
          setCheckingAdminRole(false);
        }
        return;
      }

      setCheckingAdminRole(true);
      try {
        const userEmail = (currentSession.user.email || '').toLowerCase();
        // Check public.admin_users table for explicit admin grant
        const { data, error } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', currentSession.user.id)
          .maybeSingle();

        if (!error && data && (data.role === 'admin' || data.role === 'superadmin')) {
          if (isMounted) setIsAdminAuthorized(true);
        } else if (userEmail === 'maryeagegn2022@gmail.com' || userEmail === '2025254026@student.annauniv.edu') {
          if (isMounted) setIsAdminAuthorized(true);
        } else {
          if (isMounted) setIsAdminAuthorized(false);
        }
      } catch {
        if (isMounted) setIsAdminAuthorized(false);
      } finally {
        if (isMounted) setCheckingAdminRole(false);
      }
    }

    if (session) {
      checkAdmin(session);
    } else {
      setIsAdminAuthorized(false);
      setCheckingAdminRole(false);
    }

    return () => {
      isMounted = false;
    };
  }, [session]);

  const isAuthenticated = Boolean(session) && isAdminAuthorized;

  // Fetch all content & media library ONLY if verified administrator
  useEffect(() => {
    if (!isAuthenticated) return;
    async function loadAll() {
      const [allPosts, allResearch, allDocs, allMedia, allMsgs, allCollabs, allInq, allBhn, allWebinars] = await Promise.all([
        getPosts(true),
        getResearchUpdates(true),
        getDocuments(),
        getMediaItems(),
        getInboundMessages(),
        getInboundCollaborations(),
        getInquiries(),
        getBhnApplications(),
        getWebinars({ includeDrafts: true, includePrivate: true }),
      ]);
      setPosts(allPosts);
      setResearchUpdates(allResearch);
      setDocuments(allDocs);
      setMediaItems(allMedia);
      setMessages(allMsgs);
      setCollaborations(allCollabs);
      setInquiries(allInq);
      setBhnApplications(allBhn);
      setWebinarList(allWebinars || []);
      setMediaLibraryItems(getMediaLibrary());
    }
    loadAll();
  }, [isAuthenticated, refreshTrigger]);

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

  // Direct BHN Member Onboarding Handler (Auto-stamps joined_at = current time)
  async function handleCreateDirectBhnMember(e) {
    e.preventDefault();
    if (!newBhnForm.name || !newBhnForm.email) return;
    await submitBhnApplication({
      ...newBhnForm,
      status: 'Active', // Direct addition as an active member
    });
    setIsAddingBhnMember(false);
    setNewBhnForm({
      name: '',
      email: '',
      organization: '',
      role: '',
      country: 'Ethiopia',
      background: '',
      statement_of_interest: '',
    });
    const updated = await getBhnApplications();
    setBhnApplications(updated);
  }

  // Handle Login (Strict Supabase Auth without hardcoded credentials)
  async function handleLogin(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccessMsg('');

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
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

  // Request Admin Access (Multi-Admin Onboarding)
  async function handleRequestAdminAccess(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccessMsg('');

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: newAdminName.trim(),
            requested_role: 'admin',
          },
        },
      });
      if (error) {
        setAuthError(error.message || 'Failed to submit registration. Please check credentials.');
      } else {
        setAuthSuccessMsg(
          `Registration submitted for ${email}. Your access is pending approval by Marye Agegn in Supabase.`
        );
      }
    } else {
      setAuthError('Supabase is not configured. Please ensure your project URL and keys are configured.');
    }
    setAuthLoading(false);
  }

  // Forgot Password Recovery Handler
  async function handleForgotPassword(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccessMsg('');

    if (isSupabaseConfigured && supabase) {
      const redirectUrl = typeof window !== 'undefined'
        ? window.location.origin + window.location.pathname + '#admin'
        : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });
      if (error) {
        setAuthError(error.message || 'Unable to send password reset email.');
      } else {
        setAuthSuccessMsg(`Password reset instructions sent to ${email}. Please check your inbox.`);
      }
    } else {
      setAuthError('Supabase is not configured.');
    }
    setAuthLoading(false);
  }

  // Magic Link Handler
  async function handleMagicLink(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccessMsg('');

    if (isSupabaseConfigured && supabase) {
      const redirectUrl = typeof window !== 'undefined'
        ? window.location.origin + window.location.pathname + '#admin'
        : undefined;
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: redirectUrl },
      });
      if (error) {
        setAuthError(error.message || 'Unable to send magic sign-in link.');
      } else {
        setAuthSuccessMsg(`Magic sign-in link sent to ${email}. Click the link in your email to authenticate.`);
      }
    } else {
      setAuthError('Supabase is not configured.');
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

  // Webinar & Educational Session Actions
  async function handleSaveWebinar(e) {
    e.preventDefault();
    await saveWebinar(editingWebinar);
    setEditingWebinar(null);
    setRefreshTrigger((prev) => prev + 1);
  }

  async function handleDeleteWebinar(id) {
    if (window.confirm('Are you sure you want to delete this webinar record?')) {
      await deleteWebinar(id);
      setRefreshTrigger((prev) => prev + 1);
    }
  }

  // Settings save
  function handleSaveSettings(e) {
    e.preventDefault();
    updateSupabaseConfig(supabaseUrlInput.trim(), supabaseAnonKeyInput.trim());
    setSettingsNotice('Supabase configuration updated. Please refresh the page to apply.');
  }

  function handleSaveGeminiKey(e) {
    e.preventDefault();
    setGeminiApiKey(geminiKeyInput.trim());
    setGeminiNotice('Gemini AI API Key saved successfully. Live AI chat with Gemini 3.5 Flash Lite is now active for all visitors!');
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
  // If session active, check role authorization status
  // -------------------------------------------------------------
  if (session && checkingAdminRole) {
    return (
      <div className="admin-main-container flex items-center justify-center min-h-screen py-16" style={{ background: 'var(--color-surface-subtle)' }}>
        <div className="card p-8 text-center" style={{ maxWidth: '440px', background: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
          <span className="badge mb-3" style={{ background: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}>Authenticating</span>
          <h2 className="text-xl font-bold text-slate-900 mt-2">Verifying Privileges</h2>
          <p className="text-muted text-sm mt-2">Checking database administrator authorization for {session.user?.email}...</p>
        </div>
      </div>
    );
  }

  if (session && !isAdminAuthorized) {
    return (
      <div className="admin-main-container flex items-center justify-center min-h-screen py-16" style={{ background: 'var(--color-surface-subtle)' }}>
        <div className="card p-8 text-center shadow-lg" style={{ maxWidth: '460px', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-error-border)' }}>
          <span className="badge" style={{ background: 'var(--color-error-bg)', color: 'var(--color-error)', border: '1px solid var(--color-error-border)', fontWeight: 600 }}>
            ⛔ Access Denied
          </span>
          <h2 className="text-xl font-bold mt-4" style={{ color: 'var(--color-text)' }}>Administrative Privileges Required</h2>
          <p className="text-muted text-sm mt-2">
            The account <strong>{session.user?.email}</strong> is authenticated, but is not designated in the administrator allowlist.
          </p>
          <div className="p-3 my-4 rounded text-xs text-left" style={{ background: 'var(--color-surface-subtle)', color: 'var(--color-text-muted)' }}>
            🔒 <strong>Defense-in-Depth Enforcement:</strong> Standard Supabase accounts are strictly isolated from CMS operations and private visitor submissions.
          </div>
          <button onClick={handleLogout} className="btn btn-secondary w-full">
            Sign Out of This Account
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // If NOT authenticated, show Enhanced Professional Authentication View
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="admin-main-container flex items-center justify-center min-h-screen py-16" style={{ background: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: '460px' }}>
          <div className="card p-8 shadow-lg" style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0' }}>
            {/* Header Badge & Title */}
            <div className="text-center mb-6">
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', marginBottom: '0.75rem', border: '1px solid #bfdbfe' }}>
                <span style={{ fontSize: '1.5rem' }}>🛡️</span>
              </div>
              <h2 className="text-2xl font-bold" style={{ color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                {authMode === 'login' && 'Administrator Access'}
                {authMode === 'register' && 'Request Admin Access'}
                {authMode === 'forgot' && 'Reset Password'}
                {authMode === 'magic' && 'Passwordless Sign In'}
              </h2>
              <p className="text-muted text-sm mt-1">
                {authMode === 'login' && 'Authorized control console for Marye Agegn'}
                {authMode === 'register' && 'Register credentials for Marye Agegn’s authorization'}
                {authMode === 'forgot' && 'Receive a password recovery email from Supabase'}
                {authMode === 'magic' && 'Receive an instant 1-click login link via email'}
              </p>
            </div>

            {/* Segmented Auth Mode Switcher (Login vs Request Access) */}
            {(authMode === 'login' || authMode === 'register') && (
              <div className="admin-auth-tabs">
                <button
                  type="button"
                  className={`admin-auth-tab ${authMode === 'login' ? 'active' : ''}`}
                  onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccessMsg(''); }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`admin-auth-tab ${authMode === 'register' ? 'active' : ''}`}
                  onClick={() => { setAuthMode('register'); setAuthError(''); setAuthSuccessMsg(''); }}
                >
                  Request Admin Access
                </button>
              </div>
            )}

            {/* Error Message Alert */}
            {authError && (
              <div
                className="p-3 mb-4 text-sm rounded flex items-start gap-2"
                style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }}
              >
                <span>⚠️</span>
                <span>{authError}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {authSuccessMsg && (
              <div
                className="p-3 mb-4 text-sm rounded flex items-start gap-2"
                style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' }}
              >
                <span>✓</span>
                <span>{authSuccessMsg}</span>
              </div>
            )}

            {/* Form 1: Password Sign In */}
            {authMode === 'login' && (
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
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="admin-password" style={{ margin: 0 }}>Password / Admin Key</label>
                    <button
                      type="button"
                      className="admin-auth-switch-link"
                      onClick={() => { setAuthMode('forgot'); setAuthError(''); setAuthSuccessMsg(''); }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="password-input-wrap">
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full mt-4" disabled={authLoading}>
                  {authLoading ? 'Authenticating...' : 'Sign In to Dashboard →'}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    className="admin-auth-switch-link"
                    onClick={() => { setAuthMode('magic'); setAuthError(''); setAuthSuccessMsg(''); }}
                  >
                    ✉️ Sign in with email Magic Link instead
                  </button>
                </div>
              </form>
            )}

            {/* Form 2: Request Administrator Access (Multi-Admin Onboarding) */}
            {authMode === 'register' && (
              <form onSubmit={handleRequestAdminAccess} className="space-y-4">
                <div className="p-3 rounded text-xs" style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }}>
                  🛡️ <strong>Authorization Required:</strong> Secondary accounts registered here remain strictly locked until explicitly authorized with admin privileges by Marye Agegn in Supabase.
                </div>

                <div className="form-group">
                  <label htmlFor="reg-name">Full Name &amp; Professional Role</label>
                  <input
                    id="reg-name"
                    type="text"
                    placeholder="e.g. Dr. Alex Vance / Co-Researcher"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reg-email">Administrator Email</label>
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="colleague@institution.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reg-password">Create Password</label>
                  <div className="password-input-wrap">
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full mt-4" disabled={authLoading}>
                  {authLoading ? 'Submitting Registration...' : 'Submit Access Request →'}
                </button>
              </form>
            )}

            {/* Form 3: Forgot Password Recovery */}
            {authMode === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="form-group">
                  <label htmlFor="forgot-email">Administrator Email</label>
                  <input
                    id="forgot-email"
                    type="email"
                    placeholder="maryeagegn2022@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <span className="text-xs text-muted mt-1 block">
                    We will send a password reset link to this email address via Supabase Authentication.
                  </span>
                </div>

                <button type="submit" className="btn btn-primary w-full mt-4" disabled={authLoading}>
                  {authLoading ? 'Sending Recovery Email...' : 'Send Password Reset Link →'}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    className="admin-auth-switch-link"
                    onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccessMsg(''); }}
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* Form 4: Magic Link Sign In */}
            {authMode === 'magic' && (
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div className="form-group">
                  <label htmlFor="magic-email">Administrator Email</label>
                  <input
                    id="magic-email"
                    type="email"
                    placeholder="maryeagegn2022@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <span className="text-xs text-muted mt-1 block">
                    We will email you a secure 1-click login link. No password required.
                  </span>
                </div>

                <button type="submit" className="btn btn-primary w-full mt-4" disabled={authLoading}>
                  {authLoading ? 'Sending Magic Link...' : 'Send Magic Sign-In Link →'}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    className="admin-auth-switch-link"
                    onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccessMsg(''); }}
                  >
                    ← Sign In with Password instead
                  </button>
                </div>
              </form>
            )}

            {/* Return to Public Website (Vibrant Blue Styled Button) */}
            <div
              className="mt-6 pt-4 text-center text-xs text-muted"
              style={{ borderTop: '1px solid #e2e8f0' }}
            >
              <p style={{ margin: '0 0 0.5rem 0', color: '#64748b' }}>
                🔒 Secured by PostgreSQL Row Level Security (RLS)
              </p>
              <a href="./#home" className="admin-return-btn">
                ← Return to Public Website
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Authenticated Dashboard (Executive Sidebar & Dynamic Canvas)
  // -------------------------------------------------------------
  const newInqCount = inquiries.filter((i) => i.status === 'New').length;
  const pendingBhnCount = bhnApplications.filter((b) => b.status === 'Pending').length;

  const navCategories = [
    {
      title: 'Workflows & Operations',
      items: [
        { id: 'overview', icon: '📊', label: 'Executive Overview', badge: null },
        { id: 'ai_consultations', icon: '🤖', label: 'AI Consultations', badge: 'Live', badgeType: 'live' },
        {
          id: 'inquiries',
          icon: '📬',
          label: 'Client Inquiries',
          badge: newInqCount > 0 ? `${newInqCount} New` : inquiries.length,
          badgeType: newInqCount > 0 ? 'danger' : 'neutral',
        },
        {
          id: 'bhn',
          icon: '🌐',
          label: 'BHN Network',
          badge: pendingBhnCount > 0 ? `${pendingBhnCount} Pending` : bhnApplications.length,
          badgeType: pendingBhnCount > 0 ? 'warning' : 'neutral',
        },
      ],
    },
    {
      title: 'Content & Repository',
      items: [
        { id: 'docs', icon: '📄', label: 'Documents & CV', badge: documents.length },
        { id: 'media_library', icon: '📁', label: 'Media Library', badge: mediaLibraryItems.length },
        { id: 'posts', icon: '📝', label: 'Articles & Posts', badge: posts.length },
        { id: 'research', icon: '🔬', label: 'Research Updates', badge: researchUpdates.length },
        { id: 'media', icon: '🎥', label: 'Media Items', badge: mediaItems.length },
        { id: 'webinars', icon: '🎙️', label: 'Webinars & Events', badge: webinarList.length },
      ],
    },
    {
      title: 'System & Controls',
      items: [
        { id: 'messages', icon: '📨', label: 'Collab Archive', badge: collaborations.length },
        { id: 'settings', icon: '⚙️', label: 'Platform Settings', badge: null },
      ],
    },
  ];

  const getActiveTabTitle = (tabId) => {
    switch (tabId) {
      case 'overview':
        return 'Executive Overview';
      case 'ai_consultations':
        return 'AI Consultations';
      case 'inquiries':
        return 'Client Inquiries';
      case 'bhn':
        return 'BHN Network Members';
      case 'docs':
        return 'Documents & Academic CV';
      case 'media_library':
        return 'Media Asset Library';
      case 'posts':
        return 'Articles & Publications';
      case 'research':
        return 'Research Updates';
      case 'media':
        return 'Media Features & Press';
      case 'webinars':
        return 'Webinars & Masterclasses';
      case 'messages':
        return 'Archived Messages';
      case 'settings':
        return 'Platform & Database Settings';
      default:
        return 'Platform CMS';
    }
  };

  return (
    <div className="admin-layout">
      {/* Mobile Backdrop Overlay */}
      <div
        className={`admin-mobile-backdrop ${mobileSidebarOpen ? 'open' : ''}`}
        onClick={() => setMobileSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Left Dedicated Navigation Sidebar */}
      <aside className={`admin-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">
            <div className="admin-brand-avatar-wrap">
              <img
                src="./assets/images/marye-agegn-brand-banner.jpg"
                alt="Marye Agegn"
                className="admin-brand-avatar"
              />
              <span className="admin-online-indicator" title="Admin Session Online" />
            </div>
            <div className="admin-brand-meta">
              <span className="admin-brand-name">Marye Agegn</span>
              <span className="admin-brand-role">Platform CMS</span>
            </div>
          </div>
        </div>

        {/* Categorized Navigation Menu */}
        <nav className="admin-sidebar-nav" role="tablist">
          {navCategories.map((group) => (
            <div key={group.title} className="admin-nav-group">
              <span className="admin-nav-group-title">{group.title}</span>
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`admin-nav-btn ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    role="tab"
                    aria-selected={isActive}
                  >
                    <div className="admin-nav-left">
                      <span className="admin-nav-icon">{item.icon}</span>
                      <span className="admin-nav-label">{item.label}</span>
                    </div>
                    {item.badge !== null && item.badge !== undefined && (
                      <span className={`admin-nav-badge ${item.badgeType || ''}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user-card">
            <div className="admin-user-avatar">MA</div>
            <div className="admin-user-info">
              <span className="admin-user-email" title={session?.user?.email || 'Administrator'}>
                {session?.user?.email || 'maryeagegn2022@gmail.com'}
              </span>
              <span className="admin-user-role">Super Administrator</span>
            </div>
          </div>
          <a
            href="./#home"
            className="btn btn-secondary btn-sm w-full"
            style={{ textAlign: 'center', justifyContent: 'center' }}
          >
            View Live Website ↗
          </a>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm w-full"
            onClick={handleLogout}
          >
            Sign Out ⎋
          </button>
        </div>
      </aside>

      {/* Main Content Dynamic Canvas */}
      <div className="admin-canvas">
        {/* Sticky Topbar */}
        <header className="admin-canvas-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-mobile-menu-btn"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              aria-label="Toggle navigation menu"
            >
              ☰
            </button>
            <div className="admin-topbar-breadcrumb">
              <span className="admin-topbar-parent">Platform CMS</span>
              <span className="admin-topbar-sep">/</span>
              <h1 className="admin-topbar-title">{getActiveTabTitle(activeTab)}</h1>
            </div>
          </div>

          <div className="admin-topbar-actions">
            <span className={`admin-status-pill ${isSupabaseConfigured ? 'online' : 'local'}`}>
              <span className="status-dot" />
              {isSupabaseConfigured ? 'Cloud Connected' : 'Local Storage'}
            </span>
          </div>
        </header>

        {/* Dynamic Content Canvas Body */}
        <main className="admin-canvas-body">

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
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                  Biomedical Horizon Network (BHN) Member Registry &amp; Applications ({bhnApplications.length})
                </h2>
                <p className="text-sm text-muted">
                  Membership network connecting healthcare engineers, clinicians, and researchers.
                  When a member joins or is approved, the system automatically tracks and preserves the exact join timestamp.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ background: '#0f766e', borderColor: '#0f766e' }}
                  onClick={() => setIsAddingBhnMember(!isAddingBhnMember)}
                >
                  {isAddingBhnMember ? '✕ Cancel' : '+ Directly Onboard BHN Member'}
                </button>

                {/* Status Filter Buttons */}
                <div className="flex gap-1 flex-wrap">
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
            </div>

            {/* Direct Member Onboarding Drawer */}
            {isAddingBhnMember && (
              <div className="card p-6 border-2 border-emerald-600" style={{ background: '#f0fdf4', borderRadius: 'var(--radius-md)' }}>
                <h3 className="font-bold text-lg text-emerald-950 mb-2">Direct BHN Member Onboarding</h3>
                <p className="text-xs text-emerald-800 mb-4">
                  Register a verified biomedical colleague or partner directly into BHN. The current exact date and time will be automatically recorded as their joined timestamp.
                </p>
                <form onSubmit={handleCreateDirectBhnMember} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Abebe Bikila"
                        value={newBhnForm.name}
                        onChange={(e) => setNewBhnForm({ ...newBhnForm, name: e.target.value })}
                        className="form-control text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="colleague@institution.org"
                        value={newBhnForm.email}
                        onChange={(e) => setNewBhnForm({ ...newBhnForm, email: e.target.value })}
                        className="form-control text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Institution / Organization</label>
                      <input
                        type="text"
                        placeholder="e.g. Tikur Anbessa Hospital"
                        value={newBhnForm.organization}
                        onChange={(e) => setNewBhnForm({ ...newBhnForm, organization: e.target.value })}
                        className="form-control text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Professional Role / Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Lead Clinical Engineer"
                        value={newBhnForm.role}
                        onChange={(e) => setNewBhnForm({ ...newBhnForm, role: e.target.value })}
                        className="form-control text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Country</label>
                      <input
                        type="text"
                        value={newBhnForm.country}
                        onChange={(e) => setNewBhnForm({ ...newBhnForm, country: e.target.value })}
                        className="form-control text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Specialization &amp; Background</label>
                    <textarea
                      rows="2"
                      placeholder="Specialization area, equipment expertise, or clinical focus..."
                      value={newBhnForm.background}
                      onChange={(e) => setNewBhnForm({ ...newBhnForm, background: e.target.value })}
                      className="form-control text-sm"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsAddingBhnMember(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm" style={{ background: '#16a34a', borderColor: '#16a34a' }}>
                      ✓ Save &amp; Auto-Stamp Member Join Date
                    </button>
                  </div>
                </form>
              </div>
            )}

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
                  {filteredBhn.map((bhn) => {
                    const applicantName = bhn.full_name || bhn.name || 'Anonymous Applicant';
                    const organization = bhn.institution || bhn.organization || 'Independent Professional';
                    const specialization = bhn.specialization || bhn.role || bhn.background || 'Biomedical Engineering';
                    const background = bhn.professional_background || bhn.background;
                    const statement = bhn.statement_of_interest || bhn.message;
                    const focusArea = bhn.focus_area || (Array.isArray(bhn.areas_of_interest) && bhn.areas_of_interest.length > 0 ? bhn.areas_of_interest.join(', ') : 'Biomedical Innovation');
                    const isJoined = bhn.status === 'Active' || bhn.status === 'Approved' || Boolean(bhn.joined_at);
                    const joinDate = bhn.joined_at || bhn.approved_at || (bhn.status === 'Active' ? bhn.created_at : null);

                    return (
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
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-lg" style={{ color: 'var(--color-text)', margin: 0 }}>
                                {applicantName}
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

                              {/* Prominent Joined Timestamp */}
                              {isJoined && joinDate && (
                                <span className="badge badge-success" style={{ fontWeight: 700, background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}>
                                  🎉 Joined BHN: {new Date(joinDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                </span>
                              )}
                            </div>
                            <div className="text-sm mt-1 flex items-center gap-2 flex-wrap">
                              <span className="font-medium" style={{ color: 'var(--color-primary)' }}>
                                {organization}
                              </span>
                              <span className="text-muted">•</span>
                              <span className="text-muted">Role / Specialization: <strong>{specialization}</strong></span>
                              <span className="text-muted">•</span>
                              <span className="text-muted">✉️ <a href={`mailto:${bhn.email}`} style={{ color: 'inherit' }}>{bhn.email}</a></span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="badge category-badge">{focusArea}</span>
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
                          {background && (
                            <div className="p-3 rounded" style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)' }}>
                              <strong className="block text-xs text-muted mb-1">Professional Background:</strong>
                              <p style={{ margin: 0 }}>{background}</p>
                            </div>
                          )}
                          {statement && (
                            <div className="p-3 rounded" style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)' }}>
                              <strong className="block text-xs text-muted mb-1">Statement of Interest &amp; Collaborative Goals:</strong>
                              <p style={{ margin: 0 }}>{statement}</p>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-muted gap-2 pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span>📅 <strong>Submitted:</strong> {new Date(bhn.created_at || bhn.submitted_at || Date.now()).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                            {bhn.status_updated_at && (
                              <span>⏱️ <strong>Last Status Update:</strong> {new Date(bhn.status_updated_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                            )}
                          </div>

                          <div className="flex gap-2">
                            {bhn.status !== 'Active' && (
                              <button
                                type="button"
                                className="btn btn-primary btn-xs"
                                style={{ background: '#16a34a', borderColor: '#16a34a' }}
                                onClick={() => handleUpdateBhn(bhn.id, 'Active')}
                              >
                                ✓ Approve &amp; Stamp Join Date
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
                    );
                  })}
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
                  <div className="cv-status-card-grid mt-4">
                    <div className="cv-status-item">
                      <span className="cv-status-label">Active Document</span>
                      <strong className="cv-status-val text-primary">{activeCv.title}</strong>
                    </div>
                    <div className="cv-status-item">
                      <span className="cv-status-label">Version Tag</span>
                      <strong className="cv-status-val font-mono">{activeCv.version || 'v2.2'}</strong>
                    </div>
                    <div className="cv-status-item">
                      <span className="cv-status-label">Binary File Size</span>
                      <strong className="cv-status-val">{activeCv.file_size || 'Verified Binary'}</strong>
                    </div>
                    <div className="cv-status-item">
                      <span className="cv-status-label">MIME &amp; Magic Bytes</span>
                      <span className="badge badge-sm" style={{ background: '#ecfdf5', color: '#047857', fontWeight: 600, display: 'inline-flex', alignItems: 'center', width: 'fit-content' }}>
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
        {/* TAB: WEBINARS & EDUCATIONAL SESSIONS MANAGEMENT */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'webinars' && (
          <div className="webinars-tab-view space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                  Webinars &amp; Video Registry ({webinarList.length})
                </h2>
                <p className="text-sm text-muted">
                  Schedule live masterclasses, publish recorded workshops, and manage video tutorial registries.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  setEditingWebinar({
                    title: '',
                    slug: '',
                    description: '',
                    speaker: 'Marye Agegn',
                    speakerTitle: 'Biomedical Engineer & Researcher',
                    topic: 'Biosignal Processing',
                    category: 'Biosignals',
                    date: new Date().toISOString().split('T')[0],
                    startTime: '14:00 UTC',
                    duration: '60 min',
                    status: 'UPCOMING',
                    isPublished: true,
                    visibility: 'public',
                    registrationUrl: '',
                    liveEventUrl: '',
                    recordingUrl: '',
                    transcript: '',
                  })
                }
              >
                ➕ Schedule / Create Webinar
              </button>
            </div>

            {/* Webinar Edit Form */}
            {editingWebinar && (
              <div
                className="card p-6 border border-primary"
                style={{ background: '#ffffff', borderRadius: 'var(--radius-md)' }}
              >
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                    {editingWebinar.id ? 'Edit Webinar / Video Session' : 'Schedule New Webinar'}
                  </h3>
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-600 text-lg"
                    onClick={() => setEditingWebinar(null)}
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleSaveWebinar} className="space-y-4">
                  {/* Automated Timestamps Indicator */}
                  <div className="p-3 rounded" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div className="font-semibold text-slate-800 text-xs mb-1">⏱️ Automatic Event Timestamps &amp; Activity Tracking Active</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-muted">
                      <div>
                        <strong>Announced:</strong> {editingWebinar.announcedAt ? new Date(editingWebinar.announcedAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) : 'Will auto-record on publish/schedule'}
                      </div>
                      <div>
                        <strong>Recorded / Uploaded:</strong> {editingWebinar.uploadedAt ? new Date(editingWebinar.uploadedAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) : 'Will auto-record when recording URL entered'}
                      </div>
                      <div>
                        <strong>Last Modified:</strong> {editingWebinar.updatedAt ? new Date(editingWebinar.updatedAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) : 'Will auto-update on save'}
                      </div>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Webinar Title *</label>
                      <input
                        type="text"
                        required
                        value={editingWebinar.title}
                        onChange={(e) =>
                          setEditingWebinar({
                            ...editingWebinar,
                            title: e.target.value,
                            slug: editingWebinar.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                          })
                        }
                        placeholder="e.g. Real-Time Biosignal Conditioning"
                      />
                    </div>
                    <div className="form-group">
                      <label>URL Slug</label>
                      <input
                        type="text"
                        value={editingWebinar.slug || ''}
                        onChange={(e) => setEditingWebinar({ ...editingWebinar, slug: e.target.value })}
                        placeholder="e.g. real-time-biosignal-conditioning"
                      />
                    </div>
                  </div>

                  <div className="form-grid-3">
                    <div className="form-group">
                      <label>Category / Topic *</label>
                      <select
                        value={editingWebinar.category || 'Biosignals'}
                        onChange={(e) =>
                          setEditingWebinar({ ...editingWebinar, category: e.target.value, topic: e.target.value })
                        }
                      >
                        <option value="Biosignals">Biosignals &amp; Physiological Filtering</option>
                        <option value="Biomechanics">Biomechanics &amp; Wearable Sensors</option>
                        <option value="Medical Devices">Medical Device Electrical Safety &amp; Standards</option>
                        <option value="Healthcare Infrastructure">Healthcare Infrastructure &amp; Telemetry</option>
                        <option value="Neuroengineering">Neuroengineering &amp; EEG</option>
                        <option value="Consultation">Clinical Specification &amp; Procurement</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Lifecycle Status *</label>
                      <select
                        value={editingWebinar.status}
                        onChange={(e) => setEditingWebinar({ ...editingWebinar, status: e.target.value })}
                      >
                        <option value="UPCOMING">UPCOMING (Scheduled for Future)</option>
                        <option value="LIVE">LIVE NOW (Active Broadcast)</option>
                        <option value="RECORDED">RECORDED (Available on Demand)</option>
                        <option value="ARCHIVED">ARCHIVED (Historical Reference)</option>
                        <option value="DRAFT">DRAFT (Unpublished / In Planning)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Visibility *</label>
                      <select
                        value={editingWebinar.visibility || 'public'}
                        onChange={(e) => setEditingWebinar({ ...editingWebinar, visibility: e.target.value })}
                      >
                        <option value="public">Public (Visible to All Visitors)</option>
                        <option value="private">Private (Admin / Partner Gated)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-3">
                    <div className="form-group">
                      <label>Speaker Name *</label>
                      <input
                        type="text"
                        required
                        value={editingWebinar.speaker}
                        onChange={(e) => setEditingWebinar({ ...editingWebinar, speaker: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Event Date *</label>
                      <input
                        type="date"
                        required
                        value={editingWebinar.date}
                        onChange={(e) => setEditingWebinar({ ...editingWebinar, date: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Start Time &amp; Duration</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. 14:00 UTC"
                          value={editingWebinar.startTime || ''}
                          onChange={(e) => setEditingWebinar({ ...editingWebinar, startTime: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="e.g. 60 min"
                          value={editingWebinar.duration || ''}
                          onChange={(e) => setEditingWebinar({ ...editingWebinar, duration: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Live Stream / Event URL</label>
                      <input
                        type="text"
                        placeholder="https://youtube.com/live/... or stream embed"
                        value={editingWebinar.liveEventUrl || ''}
                        onChange={(e) => setEditingWebinar({ ...editingWebinar, liveEventUrl: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Recording Embed URL (YouTube/Vimeo)</label>
                      <input
                        type="text"
                        placeholder="https://www.youtube.com/embed/..."
                        value={editingWebinar.recordingUrl || ''}
                        onChange={(e) => setEditingWebinar({ ...editingWebinar, recordingUrl: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Registration URL (For Upcoming Sessions)</label>
                    <input
                      type="text"
                      placeholder="https://forms.gle/... or registration page"
                      value={editingWebinar.registrationUrl || ''}
                      onChange={(e) => setEditingWebinar({ ...editingWebinar, registrationUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Description &amp; Abstract *</label>
                    <textarea
                      rows="3"
                      required
                      value={editingWebinar.description}
                      onChange={(e) => setEditingWebinar({ ...editingWebinar, description: e.target.value })}
                      placeholder="Detailed technical session outline..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Session Transcript &amp; Timestamps</label>
                    <textarea
                      rows="3"
                      value={editingWebinar.transcript || ''}
                      onChange={(e) => setEditingWebinar({ ...editingWebinar, transcript: e.target.value })}
                      placeholder="00:00 - Introduction&#10;15:30 - Digital Filter Pipeline..."
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="webinar-is-published"
                      checked={editingWebinar.isPublished}
                      onChange={(e) => setEditingWebinar({ ...editingWebinar, isPublished: e.target.checked })}
                    />
                    <label htmlFor="webinar-is-published" className="text-sm font-semibold">
                      Published to Public Website (Uncheck for Draft status)
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button type="button" className="btn btn-secondary" onClick={() => setEditingWebinar(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Webinar Event
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Webinars Table */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title &amp; Speaker</th>
                    <th>Date / Time</th>
                    <th>Auto-Tracked Timestamps</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Visibility</th>
                    <th>Published</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {webinarList.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-6 text-muted">
                        No webinars recorded yet. Click "Schedule / Create Webinar" to add an event.
                      </td>
                    </tr>
                  ) : (
                    webinarList.map((webinar) => (
                      <tr key={webinar.id}>
                        <td>
                          <div className="font-bold text-slate-900">{webinar.title}</div>
                          <div className="text-xs text-muted">{webinar.speaker}</div>
                        </td>
                        <td className="text-xs font-mono">
                          {webinar.date}
                          {webinar.startTime ? ` • ${webinar.startTime}` : ''}
                        </td>
                        <td className="text-xs">
                          {webinar.announcedAt && (
                            <div style={{ color: '#1d4ed8', fontWeight: 600 }}>
                              📢 Announced: {new Date(webinar.announcedAt).toLocaleDateString()}
                            </div>
                          )}
                          {webinar.uploadedAt && (
                            <div style={{ color: '#15803d', fontWeight: 600 }}>
                              🎬 Uploaded: {new Date(webinar.uploadedAt).toLocaleDateString()}
                            </div>
                          )}
                          {webinar.updatedAt && (
                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                              ⏱️ Modified: {new Date(webinar.updatedAt).toLocaleDateString()}
                            </div>
                          )}
                          {!webinar.announcedAt && !webinar.uploadedAt && (
                            <span className="text-muted">Draft / Untracked</span>
                          )}
                        </td>
                        <td>
                          <span className="badge category-badge">{webinar.category}</span>
                        </td>
                        <td>
                          <span
                            className="badge font-bold text-xs"
                            style={{
                              background:
                                webinar.status === 'LIVE'
                                  ? '#fee2e2'
                                  : webinar.status === 'UPCOMING'
                                  ? '#eff6ff'
                                  : webinar.status === 'RECORDED'
                                  ? '#f0fdf4'
                                  : '#f1f5f9',
                              color:
                                webinar.status === 'LIVE'
                                  ? '#dc2626'
                                  : webinar.status === 'UPCOMING'
                                  ? '#1d4ed8'
                                  : webinar.status === 'RECORDED'
                                  ? '#15803d'
                                  : '#475569',
                            }}
                          >
                            {webinar.status}
                          </span>
                        </td>
                        <td>
                          <span
                            className="badge text-xs"
                            style={{
                              background: webinar.visibility === 'private' ? '#fef3c7' : '#e0e7ff',
                              color: webinar.visibility === 'private' ? '#b45309' : '#3730a3',
                            }}
                          >
                            {webinar.visibility || 'public'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${webinar.isPublished ? 'badge-success' : 'badge-warning'}`}>
                            {webinar.isPublished ? '✓ Published' : 'Draft'}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button
                              type="button"
                              className="btn btn-secondary btn-xs"
                              onClick={() => setEditingWebinar(webinar)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-xs"
                              onClick={() => handleDeleteWebinar(webinar.id)}
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
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Database Cloud Synchronization</h2>
              <p className="text-sm text-muted mb-6">
                Connect your PostgreSQL project to enable persistent cloud storage, multi-device management, and file storage buckets.
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
                    placeholder="sb_publishable_..."
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

            {/* Google Gemini AI Configuration Card */}
            <div className="card p-8 shadow-sm" style={{ background: '#ffffff', borderRadius: 'var(--radius-md)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ fontSize: '1.4rem' }}>🤖</span>
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)', margin: 0 }}>
                  AI Concierge Configuration
                </h2>
              </div>
              <p className="text-sm text-muted mb-4">
                Biomedical MARDA uses <strong>Gemini 3.5 Flash Lite</strong> to dynamically browse and intelligently respond to visitor requests regarding your biomedical engineering career, hospital consulting, equipment lifecycle advisory, and BHN collaboration.
              </p>

              {geminiNotice && (
                <div
                  className="p-3 mb-4 text-sm rounded"
                  style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}
                >
                  ✓ {geminiNotice}
                </div>
              )}

              <form onSubmit={handleSaveGeminiKey} className="space-y-4">
                <div className="form-group">
                  <label htmlFor="gemini-key">Google AI Studio API Key</label>
                  <input
                    id="gemini-key"
                    type="password"
                    placeholder="AQ... or AIzaSy..."
                    value={geminiKeyInput}
                    onChange={(e) => setGeminiKeyInput(e.target.value)}
                  />
                  <span className="text-xs text-muted mt-1 block">
                    ⚡ Engine: <code>gemini-3.5-flash-lite</code> (Live). Fallback: verified local knowledge base.
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Get API Key in Google AI Studio ↗
                  </a>
                  <button type="submit" className="btn btn-primary" style={{ background: '#0284c7', borderColor: '#0284c7' }}>
                    Save AI Key
                  </button>
                </div>
              </form>
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
        </main>

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
