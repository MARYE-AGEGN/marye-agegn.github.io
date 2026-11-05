import React, { useState, useEffect } from 'react';
import { getWebinars } from '../data/contentStore';
import {
  SEED_VIDEOS,
  WEBINAR_STATUSES,
  CONTENT_TYPES,
  PROFESSIONAL_CATEGORIES,
} from '../data/webinarRegistry';

export function Webinars() {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, UPCOMING, LIVE, RECORDED, ARCHIVED, VIDEOS
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedContentType, setSelectedContentType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWebinar, setSelectedWebinar] = useState(null); // For detail/playback modal

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getWebinars({ includeDrafts: false, includePrivate: false });
      setWebinars(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const statusTabs = [
    { id: 'ALL', label: 'All Events & Sessions' },
    { id: WEBINAR_STATUSES.UPCOMING, label: 'Upcoming' },
    { id: WEBINAR_STATUSES.LIVE, label: 'Live Broadcasts' },
    { id: WEBINAR_STATUSES.RECORDED, label: 'Recorded Masterclasses' },
    { id: WEBINAR_STATUSES.ARCHIVED, label: 'Archived' },
    { id: 'VIDEOS', label: 'Video Tutorials & Demos' },
  ];

  const categoryOptions = [
    { id: 'ALL', label: 'All Professional Domains' },
    { id: PROFESSIONAL_CATEGORIES.HEALTHCARE_TECH_MGMT, label: 'Healthcare Technology Management' },
    { id: PROFESSIONAL_CATEGORIES.EQUIPMENT_LIFECYCLE, label: 'Medical Equipment Lifecycle' },
    { id: PROFESSIONAL_CATEGORIES.STANDARDS_REGULATIONS_QUALITY, label: 'Standards, Regulations & Quality' },
    { id: PROFESSIONAL_CATEGORIES.HEALTHCARE_DIGITALIZATION, label: 'Healthcare Digitalization & Digital Health' },
    { id: PROFESSIONAL_CATEGORIES.HEALTHCARE_BUSINESS_COMMERCIALIZATION, label: 'Business & Commercialization' },
    { id: PROFESSIONAL_CATEGORIES.PROFESSIONAL_DEVELOPMENT, label: 'Professional Development' },
    { id: PROFESSIONAL_CATEGORIES.RESEARCH_COLLABORATION, label: 'Research & Collaboration' },
    { id: PROFESSIONAL_CATEGORIES.BIOMEDICAL_ENGINEERING, label: 'Biomedical Engineering' },
    { id: PROFESSIONAL_CATEGORIES.BIOSIGNALS_DATA, label: 'Biosignals & Medical Data' },
  ];

  const contentTypeOptions = [
    { id: 'ALL', label: 'All Content Formats' },
    { id: CONTENT_TYPES.WORKSHOP, label: 'Workshops' },
    { id: CONTENT_TYPES.LECTURE, label: 'Lectures' },
    { id: CONTENT_TYPES.MASTERCLASS, label: 'Masterclasses' },
    { id: CONTENT_TYPES.PANEL_DISCUSSION, label: 'Panel Discussions' },
    { id: CONTENT_TYPES.NETWORKING_SESSION, label: 'Networking Sessions' },
    { id: CONTENT_TYPES.ROUND_TABLE, label: 'Round Tables' },
    { id: CONTENT_TYPES.TUTORIAL, label: 'Tutorials' },
    { id: CONTENT_TYPES.TECH_DEMO, label: 'Technology Demos' },
    { id: CONTENT_TYPES.CASE_STUDY, label: 'Case Studies' },
  ];

  // Filtering Logic
  const filteredWebinars = webinars.filter((w) => {
    // Status filter
    if (activeTab !== 'ALL' && activeTab !== 'VIDEOS' && w.status !== activeTab) return false;

    // Category filter
    if (selectedCategory !== 'ALL') {
      const cats = w.categories || [w.category];
      const matchCat = cats.some(
        (c) => String(c).toLowerCase() === String(selectedCategory).toLowerCase()
      );
      if (!matchCat) return false;
    }

    // Content Type filter
    if (selectedContentType !== 'ALL' && w.contentType !== selectedContentType) {
      return false;
    }

    // Search query filter across all fields
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const searchable = [
      w.title,
      w.subtitle,
      w.description,
      w.topic,
      w.category,
      (w.categories || []).join(' '),
      w.contentType,
      (w.tags || []).join(' '),
      (w.targetAudience || []).join(' '),
      (w.lifecycleStages || []).join(' '),
      (w.relatedTopics || []).join(' '),
      w.speaker,
      w.organization,
    ].join(' ').toLowerCase();

    return searchable.includes(q);
  });

  const filteredVideos = SEED_VIDEOS.filter((v) => {
    if (!v.isPublished || v.visibility === 'private') return false;

    if (selectedCategory !== 'ALL') {
      const cats = v.categories || [v.category];
      const matchCat = cats.some(
        (c) => String(c).toLowerCase() === String(selectedCategory).toLowerCase()
      );
      if (!matchCat) return false;
    }

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const searchable = [
      v.title,
      v.description,
      v.category,
      (v.categories || []).join(' '),
      v.contentType,
    ].join(' ').toLowerCase();

    return searchable.includes(q);
  });

  const isVideosTab = activeTab === 'VIDEOS';

  return (
    <section id="webinars" className="section webinars-section" aria-labelledby="webinars-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="section-badge">Healthcare Technology &amp; Biomedical Engineering Hub</span>
          <h2 id="webinars-heading" className="section-title">
            Webinars, Lectures &amp; Professional Knowledge
          </h2>
          <p className="section-subtitle">
            Explore masterclasses, technical lectures, healthcare technology management workshops, regulatory forums, and professional development sessions across the medical equipment lifecycle.
          </p>
        </div>

        {/* Status Tab Filter Bar */}
        <div className="webinars-filter-bar flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="category-pill-group flex-wrap justify-center" role="tablist">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`category-pill ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                {tab.label}
                {tab.id === WEBINAR_STATUSES.LIVE && (
                  <span className="live-dot-pulse ml-1" title="Live streaming broadcast" />
                )}
              </button>
            ))}
          </div>

          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search by topic, lifecycle, speaker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ maxWidth: '300px' }}
              aria-label="Filter events and webinars"
            />
          </div>
        </div>

        {/* Secondary Filters: Domain & Content Format */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Domain:</span>
              <select
                className="form-control text-xs py-1 px-2"
                style={{ width: 'auto' }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by Domain"
              >
                {categoryOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {!isVideosTab && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Format:</span>
                <select
                  className="form-control text-xs py-1 px-2"
                  style={{ width: 'auto' }}
                  value={selectedContentType}
                  onChange={(e) => setSelectedContentType(e.target.value)}
                  aria-label="Filter by Content Format"
                >
                  {contentTypeOptions.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {(selectedCategory !== 'ALL' || selectedContentType !== 'ALL' || searchQuery) && (
            <button
              type="button"
              className="text-primary hover:underline font-medium"
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedContentType('ALL');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Content View */}
        {loading ? (
          <div className="loading-state text-center py-12">
            <div className="spinner mb-3" />
            <p className="text-muted">Loading verified events &amp; educational resources...</p>
          </div>
        ) : isVideosTab ? (
          /* Video Library Grid */
          <div className="videos-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div key={video.id} className="webinar-card card p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge" style={{ background: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}>
                      {video.contentType || 'Video Tutorial'}
                    </span>
                    <span className="text-xs text-muted font-mono">{video.duration}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1 text-slate-900 leading-snug">{video.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">{video.category}</p>
                  <p className="text-sm text-muted mb-4">{video.description}</p>
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm w-full"
                    onClick={() =>
                      setSelectedWebinar({
                        title: video.title,
                        description: video.description,
                        speaker: 'Marye Agegn',
                        category: video.category,
                        recordingUrl: video.videoUrl,
                        resources: [],
                        transcript: 'Video demonstration and clinical engineering walkthrough.',
                      })
                    }
                  >
                    ▶ Watch Video Session
                  </button>
                </div>
              </div>
            ))}
            {filteredVideos.length === 0 && (
              <div className="col-span-full text-center py-12 card p-8">
                <p className="text-muted">No video tutorials found matching your filter criteria.</p>
              </div>
            )}
          </div>
        ) : (
          /* Webinars & Events Grid */
          <div className="webinars-grid">
            {filteredWebinars.map((webinar) => {
              const isLive = webinar.status === WEBINAR_STATUSES.LIVE;
              const isUpcoming = webinar.status === WEBINAR_STATUSES.UPCOMING;
              const isRecorded = webinar.status === WEBINAR_STATUSES.RECORDED;

              const formatTimestamp = (isoStr) => {
                if (!isoStr) return null;
                try {
                  const d = new Date(isoStr);
                  return d.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });
                } catch {
                  return isoStr;
                }
              };

              return (
                <div
                  key={webinar.id}
                  className={`webinar-card ${isLive ? 'border-primary' : ''}`}
                  style={{
                    borderTop: isLive
                      ? '3px solid #dc2626'
                      : isUpcoming
                      ? '3px solid var(--color-primary)'
                      : '3px solid #16a34a',
                  }}
                >
                  <div>
                    {/* Header Badges with explicit spacing */}
                    <div className="webinar-card-header">
                      <div className="webinar-badges-wrap">
                        {/* Content Type Badge */}
                        <span className="badge webinar-badge-type">
                          {webinar.contentType || 'Webinar'}
                        </span>

                        {/* Status Badge */}
                        {isLive ? (
                          <span className="badge webinar-badge-live">
                            <span className="live-dot-pulse" style={{ marginRight: '4px' }} /> LIVE NOW
                          </span>
                        ) : isUpcoming ? (
                          <span className="badge webinar-badge-upcoming">
                            UPCOMING
                          </span>
                        ) : isRecorded ? (
                          <span className="badge webinar-badge-recorded">
                            RECORDED
                          </span>
                        ) : (
                          <span className="badge webinar-badge-archived">ARCHIVED</span>
                        )}
                      </div>
                      <span className="webinar-duration">{webinar.duration}</span>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="webinar-title">
                      {webinar.title}
                    </h3>
                    {webinar.subtitle && (
                      <p className="webinar-subtitle">
                        {webinar.subtitle}
                      </p>
                    )}
                    <p className="webinar-description">{webinar.description}</p>

                    {/* Category Tag & Lifecycle */}
                    <div className="webinar-tags-wrap">
                      <span className="webinar-category-badge">
                        {webinar.category}
                      </span>
                      {webinar.lifecycleStages && webinar.lifecycleStages.length > 0 && (
                        <span className="webinar-lifecycle-badge">
                          Lifecycle: {webinar.lifecycleStages[0]} → {webinar.lifecycleStages[webinar.lifecycleStages.length - 1]}
                        </span>
                      )}
                    </div>

                    {/* Metadata Specs & Automatic System Timestamps */}
                    <div className="webinar-meta-block">
                      <div className="webinar-meta-row">
                        <span className="webinar-meta-label">Speaker:</span>
                        <span className="webinar-meta-val">{webinar.speaker}</span>
                      </div>
                      <div className="webinar-meta-row">
                        <span className="webinar-meta-label">Event Schedule:</span>
                        <span className="webinar-meta-val">{webinar.date} • {webinar.startTime}</span>
                      </div>
                      {webinar.networking?.enabled && (
                        <div style={{ fontSize: '0.725rem', color: '#047857', fontWeight: 600, paddingTop: '0.2rem' }}>
                          🤝 Interactive Q&amp;A / Networking Enabled
                        </div>
                      )}

                      {/* Automatically Tracked Activity Timestamps */}
                      <div className="webinar-timestamps-block">
                        {isUpcoming && (webinar.announcedAt || webinar.createdAt) && (
                          <div>
                            📢 <strong>Announced:</strong> {formatTimestamp(webinar.announcedAt || webinar.createdAt)}
                          </div>
                        )}
                        {isRecorded && (webinar.uploadedAt || webinar.recordedAt) && (
                          <div>
                            🎬 <strong>Recording Uploaded:</strong> {formatTimestamp(webinar.uploadedAt || webinar.recordedAt)}
                          </div>
                        )}
                        {webinar.updatedAt && (
                          <div>
                            ⏱️ <strong>Last Verified:</strong> {formatTimestamp(webinar.updatedAt)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Target Audience Pills */}
                    {webinar.targetAudience && webinar.targetAudience.length > 0 && (
                      <div className="webinar-audience-wrap">
                        <span className="webinar-audience-title">Target Audience:</span>
                        <div className="webinar-audience-chips">
                          {webinar.targetAudience.slice(0, 3).map((aud, i) => (
                            <span key={i} className="webinar-audience-chip">
                              {aud}
                            </span>
                          ))}
                          {webinar.targetAudience.length > 3 && (
                            <span style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)', alignSelf: 'center' }}>
                              +{webinar.targetAudience.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="webinar-actions-footer pt-3 border-t border-slate-100 flex items-center gap-2">
                    {isUpcoming && webinar.registrationUrl && (
                      <a
                        href={webinar.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm flex-1 text-center"
                      >
                        Register for Event ↗
                      </a>
                    )}
                    {isLive && webinar.liveEventUrl && (
                      <button
                        type="button"
                        onClick={() => setSelectedWebinar(webinar)}
                        className="btn btn-sm flex-1 text-center font-bold"
                        style={{ background: '#dc2626', color: '#ffffff' }}
                      >
                        🔴 Join Broadcast
                      </button>
                    )}
                    {(isRecorded || !isUpcoming) && (
                      <button
                        type="button"
                        onClick={() => setSelectedWebinar(webinar)}
                        className="btn btn-secondary btn-sm flex-1"
                      >
                        {webinar.recordingUrl ? '▶ Watch Masterclass' : 'View Session Info'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedWebinar(webinar)}
                      className="btn btn-outline btn-sm"
                      title="Session Details, Slides & Resources"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredWebinars.length === 0 && (
              <div className="col-span-full text-center py-12 card p-8">
                <p className="text-muted mb-2">No events or webinars found for this filter combination.</p>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setActiveTab('ALL');
                    setSelectedCategory('ALL');
                    setSelectedContentType('ALL');
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal: Event Playback, Slides, Networking & Transcript */}
        {selectedWebinar && (
          <div
            className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-webinar-title"
          >
            <div
              className="modal-card card p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)' }}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="badge" style={{ background: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}>
                      {selectedWebinar.category || 'Biomedical & Healthcare Technology'}
                    </span>
                    {selectedWebinar.contentType && (
                      <span className="badge bg-slate-100 text-slate-700">
                        {selectedWebinar.contentType}
                      </span>
                    )}
                  </div>
                  <h3 id="modal-webinar-title" className="text-xl font-bold text-slate-900">
                    {selectedWebinar.title}
                  </h3>
                  {selectedWebinar.subtitle && (
                    <p className="text-xs text-slate-600 italic mt-0.5">{selectedWebinar.subtitle}</p>
                  )}
                  <p className="text-xs text-muted mt-2">
                    Speaker: <strong>{selectedWebinar.speaker}</strong>
                    {selectedWebinar.organization ? ` (${selectedWebinar.organization})` : ''}
                    {selectedWebinar.date ? ` • ${selectedWebinar.date} (${selectedWebinar.duration || '60 min'})` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-700 text-2xl leading-none p-1"
                  onClick={() => setSelectedWebinar(null)}
                  aria-label="Close dialog"
                >
                  &times;
                </button>
              </div>

              {/* Embedded Video Player */}
              {(selectedWebinar.recordingUrl || selectedWebinar.liveEventUrl) && (
                <div className="webinar-embed-container mb-6 rounded-lg overflow-hidden bg-black aspect-video relative">
                  <iframe
                    src={selectedWebinar.recordingUrl || selectedWebinar.liveEventUrl}
                    title={selectedWebinar.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-900 mb-2">About This Session</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{selectedWebinar.description}</p>
              </div>

              {/* Medical Equipment Lifecycle Stages */}
              {selectedWebinar.lifecycleStages && selectedWebinar.lifecycleStages.length > 0 && (
                <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-2">
                    Covered Medical Equipment Lifecycle Stages
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedWebinar.lifecycleStages.map((stage, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white text-amber-900 border border-amber-200 text-xs font-medium">
                        {stage}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Networking & Collaboration Pathway */}
              {selectedWebinar.networking?.enabled && (
                <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wide mb-1">
                    🤝 Interactive Networking &amp; Professional Pathway
                  </h4>
                  <p className="text-xs text-emerald-800 mb-2">
                    This session includes moderated discussion and direct connection pathways for attendees.
                  </p>
                  {selectedWebinar.networking.collaborationPathway && (
                    <div className="text-xs font-semibold text-emerald-900">
                      Follow-up Gateway: {selectedWebinar.networking.collaborationPathway}
                    </div>
                  )}
                </div>
              )}

              {/* Downloadable Slides & Resources */}
              {((selectedWebinar.resources && selectedWebinar.resources.length > 0) || selectedWebinar.slidesUrl) && (
                <div className="mb-6 p-4 rounded-lg" style={{ background: 'var(--color-surface-subtle)' }}>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Downloadable Presentation &amp; Materials</h4>
                  <ul className="space-y-2 text-sm">
                    {selectedWebinar.slidesUrl && (
                      <li className="flex items-center justify-between">
                        <span className="text-slate-700 font-medium">📄 Presentation Slides Deck</span>
                        <a
                          href={selectedWebinar.slidesUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm text-xs py-1"
                        >
                          Download Slides ↗
                        </a>
                      </li>
                    )}
                    {(selectedWebinar.resources || []).map((res, idx) => (
                      <li key={idx} className="flex items-center justify-between">
                        <span className="text-slate-700">{res.title}</span>
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm text-xs py-1"
                        >
                          Download {res.type} ↗
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Transcript */}
              {selectedWebinar.transcript && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Session Transcript &amp; Timestamps</h4>
                  <div
                    className="p-3 rounded text-xs font-mono text-slate-700 max-h-48 overflow-y-auto whitespace-pre-wrap"
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                  >
                    {selectedWebinar.transcript}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <a href="#contact" className="text-xs font-semibold text-primary hover:underline">
                  Initiate Professional Consultation Regarding This Topic ↗
                </a>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedWebinar(null)}
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Webinars;
