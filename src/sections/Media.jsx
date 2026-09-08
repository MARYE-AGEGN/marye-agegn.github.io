import React, { useState, useEffect } from 'react';
import { getMediaItems } from '../data/contentStore';

export function Media() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    async function loadMedia() {
      setLoading(true);
      const items = await getMediaItems();
      setMediaItems(items);
      setLoading(false);
    }
    loadMedia();
  }, []);

  const types = ['All', 'video', 'audio'];

  const filteredMedia = mediaItems.filter((item) => {
    if (selectedType === 'All') return true;
    return item.media_type === selectedType;
  });

  return (
    <section id="media" className="section media-section" aria-labelledby="media-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="section-badge">Presentations &amp; Recordings</span>
          <h2 id="media-heading" className="section-title">
            Media Hub &amp; Technical Talks
          </h2>
          <p className="section-subtitle">
            Video presentations, recorded seminars, and audio discussions on medical equipment engineering, wearable sensing, and healthcare systems.
          </p>
        </div>

        {/* Media Type Filter */}
        <div className="media-filter-bar text-center mb-8">
          <div className="category-pill-group" role="tablist">
            {types.map((type) => (
              <button
                key={type}
                type="button"
                className={`category-pill ${selectedType === type ? 'active' : ''}`}
                onClick={() => setSelectedType(type)}
                role="tab"
                aria-selected={selectedType === type}
              >
                {type === 'All' ? 'All Media' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="loading-state text-center py-8">
            <div className="spinner"></div>
            <p>Loading media streams...</p>
          </div>
        ) : (
          <div className="media-grid">
            {filteredMedia.map((item) => (
              <div key={item.id} className="media-card card">
                <div className="media-player-container">
                  {item.media_type === 'video' ? (
                    <div className="video-embed-wrapper">
                      <video
                        controls
                        src={item.file_url}
                        poster={item.poster_url || undefined}
                        className="embed-video"
                        preload="metadata"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const wrapper = e.target.parentElement;
                          if (!wrapper.querySelector('.media-fallback')) {
                            const fallback = document.createElement('div');
                            fallback.className = 'media-fallback';
                            fallback.innerHTML = '<span class="text-muted">Media file unavailable</span>';
                            wrapper.appendChild(fallback);
                          }
                        }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : item.media_type === 'audio' ? (
                    <div className="audio-embed-wrapper">
                      <audio
                        controls
                        src={item.file_url}
                        className="embed-audio"
                        preload="metadata"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const wrapper = e.target.parentElement;
                          if (!wrapper.querySelector('.media-fallback')) {
                            const fallback = document.createElement('div');
                            fallback.className = 'media-fallback';
                            fallback.innerHTML = '<span class="text-muted">Media file unavailable</span>';
                            wrapper.appendChild(fallback);
                          }
                        }}
                      >
                        Your browser does not support the audio tag.
                      </audio>
                    </div>
                  ) : null}
                </div>

                <div className="media-card-content p-4">
                  <div className="media-meta-row">
                    <span className="badge category-badge">{item.category || item.media_type.toUpperCase()}</span>
                    <span className="media-date">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                    </span>
                  </div>
                  <h3 className="media-card-title">{item.title}</h3>
                  <p className="media-card-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Media Storage Policy Notice */}
        <div className="media-policy-footer text-center mt-8">
          <p className="text-muted text-sm">
            💡 <em>All media assets are streamed directly from the site's own static hosting infrastructure. No third-party tracking scripts or external embeds are used.</em>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Media;
