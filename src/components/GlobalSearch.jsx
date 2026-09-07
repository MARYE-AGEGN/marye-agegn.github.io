import React, { useState, useEffect, useRef } from 'react';
import { siteData } from '../data/siteData';
import { getPosts, getDocuments, getMediaItems } from '../data/contentStore';

export function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allIndex, setAllIndex] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    async function buildSearchIndex() {
      const [posts, docs, media] = await Promise.all([getPosts(), getDocuments(), getMediaItems()]);

      const index = [];

      // 1. Posts / Articles
      posts.forEach((p) => {
        index.push({
          type: 'Article',
          title: p.title,
          snippet: p.excerpt || '',
          url: '#blog',
          category: p.category,
        });
      });

      // 2. Projects
      (siteData.projects || []).forEach((proj) => {
        index.push({
          type: 'Project',
          title: proj.title,
          snippet: proj.shortDescription || proj.problem || '',
          url: `#projects`,
          category: proj.category,
        });
      });

      // 3. Research
      if (siteData.research?.currentMasterResearch) {
        index.push({
          type: 'Research',
          title: siteData.research.currentMasterResearch.title,
          snippet: siteData.research.currentMasterResearch.conceptualFocus || '',
          url: '#research',
          category: 'Master Thesis',
        });
      }

      // 4. Documents & CV
      docs.forEach((d) => {
        index.push({
          type: 'Document',
          title: d.title,
          snippet: d.description || '',
          url: '#documents',
          category: d.category,
        });
      });

      // 5. Media
      media.forEach((m) => {
        index.push({
          type: 'Media',
          title: m.title,
          snippet: m.description || '',
          url: '#media',
          category: m.category,
        });
      });

      // 6. Experience
      (siteData.experience || []).forEach((exp) => {
        index.push({
          type: 'Experience',
          title: `${exp.position} — ${exp.organization}`,
          snippet: exp.summary || '',
          url: '#experience',
          category: 'Clinical Engineering',
        });
      });

      setAllIndex(index);
    }

    if (isOpen) {
      buildSearchIndex();
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const matches = allIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.snippet.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
    );
    setResults(matches.slice(0, 8)); // Top 8 results
  }, [query, allIndex]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="search-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="search-modal-container card" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-header">
          <span className="search-icon-symbol">🔍</span>
          <input
            ref={inputRef}
            type="search"
            className="global-search-field"
            placeholder="Search all research, projects, articles, documents, media (ESC to close)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Global platform search"
          />
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close search">
            ✕
          </button>
        </div>

        <div className="search-results-list">
          {query.trim() === '' ? (
            <div className="search-hint-box text-center py-6 text-muted">
              <p>Type keywords like <em>"IMU"</em>, <em>"rTMS"</em>, <em>"gait"</em>, <em>"CV"</em>, <em>"clinical"</em>, or <em>"maintenance"</em>.</p>
              <p className="text-xs mt-2">Shortcut: Press <code>Ctrl+K</code> or <code>Cmd+K</code> anytime.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="search-no-results text-center py-6 text-muted">
              <p>No results found for "<strong>{query}</strong>".</p>
              <p className="text-xs mt-1">Try broader terms or browse the sections directly.</p>
            </div>
          ) : (
            results.map((res, idx) => (
              <a
                key={idx}
                href={res.url}
                className="search-result-item"
                onClick={onClose}
              >
                <div className="search-result-badge-col">
                  <span className={`search-badge badge-${res.type.toLowerCase()}`}>
                    {res.type}
                  </span>
                </div>
                <div className="search-result-content-col">
                  <div className="search-result-title">{res.title}</div>
                  <div className="search-result-snippet">{res.snippet}</div>
                </div>
                <div className="search-result-arrow">→</div>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default GlobalSearch;
