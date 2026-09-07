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
                      <iframe
                        src={item.embed_url}
                        title={item.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        className="embed-iframe"
                      />
                    </div>
                  ) : item.media_type === 'audio' ? (
                    <div className="audio-embed-wrapper">
                      <iframe
                        src={item.embed_url}
                        title={item.title}
                        scrolling="no"
                        frameBorder="no"
                        allow="autoplay"
                        loading="lazy"
                        className="embed-audio-iframe"
                      />
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
            💡 <em>Notice: Video and audio assets are hosted through secure high-bandwidth content delivery networks and embedded without bloating local repository files.</em>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Media;
