import React, { useState, useEffect } from 'react';
import {
  MEDIA_TYPES,
  getMediaLibrary,
  saveMediaLibraryItem,
  deleteMediaLibraryItem,
  verifyProjectAssetPresence,
} from '../../data/mediaStore';
import { UniversalFileUploader } from '../common/UniversalFileUploader';

/**
 * MediaLibrary Component
 *
 * Comprehensive admin media manager for local development and static deployment.
 * Supports image, document, and video management, direct file uploads, metadata inspection,
 * project asset deployment guidance, and a reusable picker mode.
 */
export function MediaLibrary({
  isPickerMode = false,
  pickerFilter = 'all', // 'all' | 'image' | 'document' | 'video'
  onSelectMedia = null,
  onClosePicker = null,
}) {
  const [items, setItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState(pickerFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewingItem, setPreviewingItem] = useState(null);
  const [deployGuideItem, setDeployGuideItem] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // New upload form state
  const [newUploadFileMeta, setNewUploadFileMeta] = useState(null);
  const [newUploadTitle, setNewUploadTitle] = useState('');
  const [newUploadCategory, setNewUploadCategory] = useState('General');
  const [newUploadAltText, setNewUploadAltText] = useState('');
  const [newUploadDesc, setNewUploadDesc] = useState('');

  // Load items on mount
  useEffect(() => {
    loadLibrary();
  }, []);

  function loadLibrary() {
    const library = getMediaLibrary();
    setItems(library);
  }

  // Handle new upload submission
  function handleSaveNewAsset(e) {
    e.preventDefault();
    if (!newUploadFileMeta) return;

    const itemToSave = {
      filename: newUploadFileMeta.filename,
      title: newUploadTitle.trim() || newUploadFileMeta.filename,
      type: newUploadFileMeta.type,
      mimeType: newUploadFileMeta.mimeType,
      category: newUploadCategory,
      size: newUploadFileMeta.size,
      fileSizeFormatted: newUploadFileMeta.fileSizeFormatted,
      path: newUploadFileMeta.path,
      localPreviewUrl: newUploadFileMeta.localPreviewUrl,
      dimensions: newUploadFileMeta.dimensions,
      duration: newUploadFileMeta.duration,
      altText: newUploadAltText.trim(),
      description: newUploadDesc.trim(),
      isProjectAsset: false,
    };

    saveMediaLibraryItem(itemToSave);
    loadLibrary();

    // Reset upload form
    setNewUploadFileMeta(null);
    setNewUploadTitle('');
    setNewUploadCategory('General');
    setNewUploadAltText('');
    setNewUploadDesc('');
    setShowUploadModal(false);
  }

  function handleDelete(id) {
    if (window.confirm('Remove this asset from the Media Library?')) {
      deleteMediaLibraryItem(id);
      loadLibrary();
    }
  }

  function handleCopyPath(item) {
    if (item?.path) {
      navigator.clipboard.writeText(item.path).then(() => {
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 2000);
      });
    }
  }

  async function handleVerifyPresence(item) {
    setVerifying(true);
    setVerificationResult(null);
    const exists = await verifyProjectAssetPresence(item.path);
    setVerificationResult(exists ? 'verified' : 'not_found');
    setVerifying(false);
  }

  // Trigger download of blob so user can save directly to project folder
  function handleDownloadAsset(item) {
    if (!item?.localPreviewUrl) return;
    const a = document.createElement('a');
    a.href = item.localPreviewUrl;
    a.download = item.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Filter items
  const filteredItems = items.filter((item) => {
    // Type filter
    if (activeFilter !== 'all' && item.type !== activeFilter) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.filename?.toLowerCase().includes(q);
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchCat = item.category?.toLowerCase().includes(q);
      return matchName || matchTitle || matchCat;
    }
    return true;
  });

  const imageCount = items.filter((i) => i.type === MEDIA_TYPES.IMAGE).length;
  const docCount = items.filter((i) => i.type === MEDIA_TYPES.DOCUMENT).length;
  const videoCount = items.filter((i) => i.type === MEDIA_TYPES.VIDEO).length;

  return (
    <div className={`media-library-wrapper ${isPickerMode ? 'picker-mode' : ''}`}>
      {/* Header Controls */}
      <div
        className="card p-4 mb-6"
        style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)', margin: 0 }}>
              {isPickerMode ? 'Select Asset from Media Library' : 'Project Media & Document Library'}
            </h2>
            <p className="text-xs text-muted mt-1">
              Manage local assets, inspect metadata, and prepare files for static deployment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setShowUploadModal(true)}
            >
              + Upload Local File
            </button>
            {isPickerMode && onClosePicker && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onClosePicker}
              >
                Close ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: `All (${items.length})` },
              { id: MEDIA_TYPES.IMAGE, label: `🖼️ Images (${imageCount})` },
              { id: MEDIA_TYPES.DOCUMENT, label: `📄 Documents (${docCount})` },
              { id: MEDIA_TYPES.VIDEO, label: `🎥 Videos (${videoCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`admin-tab-btn ${activeFilter === tab.id ? 'active' : ''}`}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                onClick={() => setActiveFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by filename or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                fontSize: '0.85rem',
                padding: '0.4rem 0.75rem',
                height: '36px',
                width: '240px',
                borderRadius: 'var(--radius-md)',
              }}
            />
            <button
              type="button"
              className="btn btn-secondary btn-xs"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              title="Toggle View Mode"
            >
              {viewMode === 'grid' ? '☰ List' : '⊞ Grid'}
            </button>
          </div>
        </div>
      </div>

      {/* Asset Grid / List */}
      {filteredItems.length === 0 ? (
        <div
          className="card p-12 text-center text-muted"
          style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📂</div>
          <h3 className="font-semibold text-base" style={{ color: 'var(--color-text)' }}>No matching media found</h3>
          <p className="text-xs text-muted mt-1 mb-4">
            {searchQuery ? `No assets match your search "${searchQuery}".` : 'Select and upload local files to populate your project library.'}
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowUploadModal(true)}
          >
            Upload First Asset
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          }}
        >
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="media-card card flex flex-col justify-between"
              style={{
                background: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                transition: 'box-shadow 0.15s ease',
              }}
            >
              {/* Thumbnail / Preview Header */}
              <div
                className="media-card-preview flex items-center justify-center p-3 relative cursor-pointer"
                style={{
                  background: 'var(--color-surface-subtle)',
                  height: '160px',
                  borderBottom: '1px solid var(--color-border)',
                }}
                onClick={() => {
                  if (isPickerMode && onSelectMedia) {
                    onSelectMedia(item);
                  } else {
                    setPreviewingItem(item);
                  }
                }}
              >
                {item.type === MEDIA_TYPES.IMAGE ? (
                  <img
                    src={item.localPreviewUrl || item.path}
                    alt={item.title}
                    style={{
                      maxHeight: '140px',
                      maxWidth: '100%',
                      objectFit: 'contain',
                    }}
                  />
                ) : item.type === MEDIA_TYPES.VIDEO ? (
                  <div className="text-center">
                    <span style={{ fontSize: '2.5rem' }}>🎥</span>
                    <div className="text-xs font-semibold mt-1" style={{ color: 'var(--color-text)' }}>
                      Video Stream
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <span style={{ fontSize: '2.5rem' }}>
                      {item.filename?.endsWith('.pdf') ? '📕' : '📄'}
                    </span>
                    <div className="text-xs font-semibold mt-1" style={{ color: 'var(--color-text)' }}>
                      {item.filename?.split('.').pop()?.toUpperCase() || 'DOCUMENT'}
                    </div>
                  </div>
                )}

                {/* Type Badge */}
                <span
                  className="badge absolute top-2 left-2 text-xs"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid var(--color-border)',
                    fontWeight: 600,
                  }}
                >
                  {item.type?.toUpperCase()}
                </span>
              </div>

              {/* Card Meta Body */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }} title={item.title}>
                    {item.title}
                  </div>
                  <div className="text-xs text-muted truncate mt-0.5" title={item.filename}>
                    {item.filename}
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-muted mt-2">
                    <span>{item.fileSizeFormatted}</span>
                    {item.dimensions && (
                      <span>• {item.dimensions.width}×{item.dimensions.height}</span>
                    )}
                    {item.duration && (
                      <span>• {item.duration}</span>
                    )}
                    <span className="badge category-badge" style={{ fontSize: '0.65rem' }}>
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--color-border)' }}>
                  {isPickerMode ? (
                    <button
                      type="button"
                      className="btn btn-primary btn-xs w-full"
                      onClick={() => onSelectMedia && onSelectMedia(item)}
                    >
                      Select Asset ↵
                    </button>
                  ) : (
                    <>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-secondary btn-xs"
                          onClick={() => handleCopyPath(item)}
                          title="Copy canonical asset path"
                        >
                          {copiedId === item.id ? '✓ Copied' : 'Copy Path'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-xs"
                          onClick={() => setDeployGuideItem(item)}
                          title="Deployment assistant & save guide"
                        >
                          Deploy Guide ↗
                        </button>
                      </div>

                      <button
                        type="button"
                        className="btn btn-outline-danger btn-xs"
                        onClick={() => handleDelete(item.id)}
                        title="Remove asset"
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Title &amp; Filename</th>
                <th>Type</th>
                <th>Size</th>
                <th>Project Path</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td style={{ width: '60px' }}>
                    <div
                      className="flex items-center justify-center rounded"
                      style={{ width: '48px', height: '36px', background: 'var(--color-surface-subtle)' }}
                    >
                      {item.type === MEDIA_TYPES.IMAGE ? (
                        <img
                          src={item.localPreviewUrl || item.path}
                          alt=""
                          style={{ maxWidth: '44px', maxHeight: '32px', objectFit: 'contain' }}
                        />
                      ) : item.type === MEDIA_TYPES.VIDEO ? (
                        '🎥'
                      ) : (
                        '📄'
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                      {item.title}
                    </div>
                    <div className="text-xs text-muted">{item.filename}</div>
                  </td>
                  <td>
                    <span className="badge category-badge">{item.type}</span>
                  </td>
                  <td className="text-xs">{item.fileSizeFormatted}</td>
                  <td className="text-xs font-mono text-muted">{item.path}</td>
                  <td>
                    {isPickerMode ? (
                      <button
                        type="button"
                        className="btn btn-primary btn-xs"
                        onClick={() => onSelectMedia && onSelectMedia(item)}
                      >
                        Select ↵
                      </button>
                    ) : (
                      <div className="btn-group">
                        <button
                          type="button"
                          className="btn btn-secondary btn-xs"
                          onClick={() => handleCopyPath(item)}
                        >
                          {copiedId === item.id ? '✓ Copied' : 'Copy'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-xs"
                          onClick={() => setDeployGuideItem(item)}
                        >
                          Guide
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-xs"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: UPLOAD LOCAL FILE DIALOG                             */}
      {/* ------------------------------------------------------------- */}
      {showUploadModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div
            className="modal-dialog card p-6 max-w-xl shadow-lg"
            style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)' }}
          >
            <div className="flex items-center justify-between pb-3 mb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)', margin: 0 }}>
                Upload Local Computer Asset
              </h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setShowUploadModal(false);
                  setNewUploadFileMeta(null);
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewAsset} className="space-y-4">
              <UniversalFileUploader
                acceptedType={activeFilter === 'all' ? 'all' : activeFilter}
                onFileSelected={(meta) => {
                  setNewUploadFileMeta(meta);
                  if (!newUploadTitle) {
                    setNewUploadTitle(meta.filename.replace(/\.[^/.]+$/, ''));
                  }
                }}
                onFileRemoved={() => setNewUploadFileMeta(null)}
                label="Select File from Local Computer"
                required
              />

              {newUploadFileMeta && (
                <>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Asset Title *</label>
                      <input
                        type="text"
                        required
                        value={newUploadTitle}
                        onChange={(e) => setNewUploadTitle(e.target.value)}
                        placeholder="Descriptive title..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Portfolio Category</label>
                      <select
                        value={newUploadCategory}
                        onChange={(e) => setNewUploadCategory(e.target.value)}
                      >
                        <option value="General">General Portfolio</option>
                        <option value="Research">Research &amp; Analysis</option>
                        <option value="Clinical">Clinical Engineering</option>
                        <option value="Project">Engineering Project</option>
                        <option value="CV">CV &amp; Qualifications</option>
                      </select>
                    </div>
                  </div>

                  {newUploadFileMeta.type === MEDIA_TYPES.IMAGE && (
                    <div className="form-group">
                      <label>Alt Text (Accessibility &amp; SEO)</label>
                      <input
                        type="text"
                        value={newUploadAltText}
                        onChange={(e) => setNewUploadAltText(e.target.value)}
                        placeholder="Describe the image content..."
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Description / Technical Context</label>
                    <textarea
                      rows="2"
                      value={newUploadDesc}
                      onChange={(e) => setNewUploadDesc(e.target.value)}
                      placeholder="Optional notes or context about this asset..."
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowUploadModal(false);
                    setNewUploadFileMeta(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!newUploadFileMeta}
                >
                  Save to Media Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: ASSET DEPLOYMENT ASSISTANT & STATIC PERSISTENCE GUIDE */}
      {/* ------------------------------------------------------------- */}
      {deployGuideItem && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div
            className="modal-dialog card p-6 max-w-lg shadow-lg"
            style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)' }}
          >
            <div className="flex items-center justify-between pb-3 mb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <span className="badge badge-success">Static Deployment Guide</span>
                <h3 className="text-md font-bold" style={{ color: 'var(--color-text)', margin: 0 }}>
                  Project Asset Workflow
                </h3>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setDeployGuideItem(null);
                  setVerificationResult(null);
                }}
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-muted">
              Because this website is a static React application deployed to GitHub Pages / Vercel, client-side browsers cannot modify your disk. Follow this 1-step workflow to bundle this asset permanently:
            </p>

            <div
              className="p-4 rounded-md my-4 space-y-2"
              style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)' }}
            >
              <div className="text-xs text-muted font-semibold uppercase">Target File Location in Codebase:</div>
              <div className="font-mono text-sm p-2 bg-white rounded border border-border select-all font-bold" style={{ color: 'var(--color-primary)' }}>
                {deployGuideItem.path}
              </div>
              <p className="text-xs text-muted mt-2">
                Place <strong>{deployGuideItem.filename}</strong> into your project at:
                <br />
                <code>public{deployGuideItem.path}</code>
              </p>
            </div>

            <div className="flex items-center justify-between p-3 rounded mb-4" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
              <div className="text-xs" style={{ color: '#0369a1' }}>
                Need a copy of the file?
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-xs"
                onClick={() => handleDownloadAsset(deployGuideItem)}
              >
                Download File 💾
              </button>
            </div>

            {/* Live Verification */}
            <div className="pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
                  Verify Deployment in Build:
                </span>
                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  disabled={verifying}
                  onClick={() => handleVerifyPresence(deployGuideItem)}
                >
                  {verifying ? 'Checking...' : 'Check Project File 🔍'}
                </button>
              </div>

              {verificationResult === 'verified' && (
                <div className="p-2 mt-2 rounded text-xs" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)', border: '1px solid var(--color-success-border)' }}>
                  ✓ <strong>Found in Project:</strong> File is present in <code>public/</code> and will deploy permanently with <code>npm run build</code>!
                </div>
              )}

              {verificationResult === 'not_found' && (
                <div className="p-2 mt-2 rounded text-xs" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)', border: '1px solid var(--color-warning-border)' }}>
                  ℹ️ <strong>Pending Copy:</strong> File is active in this browser session. To make it permanent on GitHub Pages, copy it to <code>public{deployGuideItem.path}</code>.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setDeployGuideItem(null);
                  setVerificationResult(null);
                }}
              >
                Understood ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: FULL HIGH-RES PREVIEW MODAL                         */}
      {/* ------------------------------------------------------------- */}
      {previewingItem && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setPreviewingItem(null)}>
          <div
            className="modal-dialog card p-6 max-w-2xl shadow-lg"
            style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <h3 className="text-md font-bold" style={{ color: 'var(--color-text)', margin: 0 }}>
                  {previewingItem.title}
                </h3>
                <span className="text-xs text-muted font-mono">{previewingItem.filename}</span>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setPreviewingItem(null)}
              >
                ✕
              </button>
            </div>

            <div className="preview-container my-4 flex items-center justify-center p-2 rounded" style={{ background: 'var(--color-surface-subtle)', minHeight: '240px' }}>
              {previewingItem.type === MEDIA_TYPES.IMAGE ? (
                <img
                  src={previewingItem.localPreviewUrl || previewingItem.path}
                  alt={previewingItem.title}
                  style={{ maxHeight: '420px', maxWidth: '100%', objectFit: 'contain' }}
                />
              ) : previewingItem.type === MEDIA_TYPES.VIDEO ? (
                <video
                  src={previewingItem.localPreviewUrl || previewingItem.path}
                  controls
                  style={{ maxHeight: '420px', maxWidth: '100%' }}
                >
                  Your browser does not support the video element.
                </video>
              ) : (
                <div className="text-center p-6">
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📕</div>
                  <div className="font-semibold text-sm mb-2">{previewingItem.filename}</div>
                  <p className="text-xs text-muted mb-4">{previewingItem.description || 'Document Asset'}</p>
                  <a
                    href={previewingItem.localPreviewUrl || previewingItem.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm inline-block"
                  >
                    Open Document in New Tab ↗
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-muted pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
              <div>
                <strong>Size:</strong> {previewingItem.fileSizeFormatted}
                {previewingItem.dimensions && ` • ${previewingItem.dimensions.width}×${previewingItem.dimensions.height}px`}
                {previewingItem.duration && ` • ${previewingItem.duration}`}
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-xs"
                onClick={() => handleCopyPath(previewingItem)}
              >
                {copiedId === previewingItem.id ? '✓ Copied' : 'Copy Project Path'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaLibrary;
