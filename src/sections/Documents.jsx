import React, { useState, useEffect } from 'react';
import { getDocuments, getCurrentCV } from '../data/contentStore';

export function Documents() {
  const [documents, setDocuments] = useState([]);
  const [currentCv, setCurrentCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);

  useEffect(() => {
    async function loadDocs() {
      setLoading(true);
      const [docs, cv] = await Promise.all([getDocuments(), getCurrentCV()]);
      setDocuments(docs);
      setCurrentCv(cv);
      setLoading(false);
    }
    loadDocs();
  }, []);

  const categories = ['All', 'CV', 'Report', 'Presentation', 'Certificate'];

  const filteredDocs = documents.filter((doc) => {
    if (selectedCategory === 'All') return true;
    return doc.category === selectedCategory;
  });

  return (
    <section id="documents" className="section documents-section" aria-labelledby="documents-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="section-badge">Verified Resources</span>
          <h2 id="documents-heading" className="section-title">
            Document Library &amp; Academic CV
          </h2>
          <p className="section-subtitle">
            Authoritative documents, verified academic curriculum vitae, capstone technical summaries, and public research reports.
          </p>
        </div>

        {/* Highlighted CV Banner Card */}
        {currentCv && (
          <div className="cv-spotlight-card card">
            <div className="cv-spotlight-content">
              <div className="cv-spotlight-header">
                <span className="badge badge-success">Official Approved Document</span>
                <span className="cv-version-pill">{currentCv.version || 'v2.1'}</span>
              </div>
              <h3 className="cv-title">{currentCv.title}</h3>
              <p className="cv-desc">{currentCv.description}</p>
              <div className="cv-meta-row">
                <span className="cv-meta-item">
                  <strong>Format:</strong> {currentCv.file_type || 'PDF'}
                </span>
                <span className="cv-meta-item">
                  <strong>Size:</strong> {currentCv.file_size || '240 KB'}
                </span>
                <span className="cv-meta-item">
                  <strong>Last Updated:</strong> {currentCv.last_updated || 'August 2025'}
                </span>
              </div>
            </div>

            <div className="cv-actions-group">
              <a
                href={currentCv.file_url}
                download
                className="btn btn-primary download-cv-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Official CV (PDF) ↓
              </a>
              <button
                type="button"
                className="btn btn-secondary preview-cv-btn"
                onClick={() => setPreviewPdfUrl(previewPdfUrl ? null : currentCv.file_url)}
              >
                {previewPdfUrl ? 'Close Preview' : 'In-Browser Preview ↗'}
              </button>
            </div>
          </div>
        )}

        {/* Embedded PDF Preview Frame if triggered */}
        {previewPdfUrl && (
          <div className="pdf-preview-container card mt-6">
            <div className="pdf-preview-header">
              <span>Document Viewer: {currentCv?.title}</span>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setPreviewPdfUrl(null)}
                aria-label="Close PDF preview"
              >
                ✕
              </button>
            </div>
            <iframe
              src={previewPdfUrl}
              title="Academic CV PDF Preview"
              className="pdf-preview-iframe"
              width="100%"
              height="600px"
            />
          </div>
        )}

        {/* Category Filters for general document library */}
        <div className="documents-filter-bar mt-8">
          <div className="category-pill-group" role="tablist">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                role="tab"
                aria-selected={selectedCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Document Grid */}
        {loading ? (
          <div className="loading-state text-center py-8">
            <div className="spinner"></div>
            <p>Loading document records...</p>
          </div>
        ) : (
          <div className="documents-grid mt-6">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="document-card card">
                <div className="document-card-top">
                  <span className="badge category-badge">{doc.category}</span>
                  <span className="doc-version-tag">{doc.version}</span>
                </div>
                <h4 className="document-card-title">{doc.title}</h4>
                <p className="document-card-desc">{doc.description}</p>

                <div className="document-card-meta">
                  <span>{doc.file_type}</span>
                  <span>•</span>
                  <span>{doc.file_size}</span>
                  {doc.last_updated && (
                    <>
                      <span>•</span>
                      <span>{doc.last_updated}</span>
                    </>
                  )}
                </div>

                <div className="document-card-actions">
                  <a
                    href={doc.file_url}
                    download
                    className="btn btn-secondary btn-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download ({doc.file_type}) ↓
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security / Privacy Guarantee Notice */}
        <div className="security-notice-callout card mt-8">
          <div className="notice-icon">🔒</div>
          <div className="notice-text">
            <strong>Document Distribution Policy:</strong> All documents published here are verified, non-confidential public versions. Unpublished graduate research thesis chapters, proprietary hospital technical schematics, and private clinical trial protocols are strictly withheld to preserve academic originality and patient confidentiality.
          </div>
        </div>
      </div>
    </section>
  );
}

export default Documents;
