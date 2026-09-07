import React from 'react';
import { siteData } from '../data/siteData';

/**
 * Publications Section Component
 *
 * Implements a dignified, professional empty state adhering strictly to
 * academic integrity: zero fabricated papers, journals, DOIs, or citations.
 *
 * Clearly communicates that publications resulting from ongoing master's thesis
 * research at Anna University are in preparation, while showcasing the ready-to-ingest
 * metadata schema and planned research dissemination directions.
 */
export function Publications({ publications }) {
  const pubData = publications || siteData.publications || {};
  const items = pubData.items || [];
  const statusNote = pubData.statusNote || 'Publications are currently in active preparation.';
  const editorialContext =
    pubData.editorialContext ||
    'In accordance with academic integrity standards, this section does not list simulated citations or placeholder papers. Forthcoming manuscripts resulting from ongoing graduate research at Anna University will appear here upon peer-review completion.';
  const plannedDirections = pubData.plannedDirections || [];
  const schemaFields = pubData.schemaFields || [];

  return (
    <section id="publications" className="section-wrapper" aria-labelledby="publications-title">
      <div className="container">
        {/* ==================================================================
            1. SECTION HEADER
            ================================================================== */}
        <header className="section-header">
          <span className="section-status-badge">Scholarly Output &amp; Manuscripts</span>
          <h2 id="publications-title" className="section-title">Publications</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)', maxWidth: '820px', margin: 0 }}>
            Peer-reviewed journal articles, conference proceedings, and academic manuscripts documenting
            biomedical engineering and computational healthcare research.
          </p>
        </header>

        {/* ==================================================================
            2. SCHOLARLY STATE: INTEGRITY & FUTURE DISSEMINATION
            ================================================================== */}
        {items.length === 0 ? (
          <div className="publications-empty-card" role="region" aria-label="Publications Status Notice">
            {/* Header Badge Row */}
            <div className="publications-header-row">
              <span className="status-pill status-pill-progress">
                Active Research Phase &bull; Manuscripts in Preparation
              </span>
              <span className="badge-tag" style={{ color: 'var(--color-accent-light)', borderColor: 'var(--color-accent-border)' }}>
                Academic Integrity Policy
              </span>
            </div>

            {/* Editorial Context */}
            <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
              {statusNote}
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: '1.65', maxWidth: '820px', margin: 0 }}>
              {editorialContext}
            </p>

            {/* Planned Directions In Preparation */}
            {plannedDirections.length > 0 && (
              <div style={{ marginTop: 'var(--space-6)' }}>
                <span
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    fontFamily: 'var(--font-family-mono)',
                    color: 'var(--color-accent-light)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 'var(--font-weight-bold)',
                  }}
                >
                  Research Topics in Preparation for Peer Review:
                </span>

                <div className="publications-directions-grid">
                  {plannedDirections.map((dir, idx) => (
                    <div key={idx} className="publications-direction-item">
                      <div className="publications-direction-topic">{dir.topic}</div>
                      <div className="publications-direction-inst">{dir.institution}</div>
                      <div className="publications-direction-status">{dir.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Schema Ingest Readiness Disclosure */}
            <div className="publications-schema-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-family-mono)', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  Metadata Ingest Schema Prepared:
                </span>
                <span className="badge-tag" style={{ fontSize: '0.65rem' }}>Automated Indexing Ready</span>
              </div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.5' }}>
                The application schema is configured to ingest verified publication entries supporting:&nbsp;
                <code style={{ color: 'var(--color-accent-light)', fontFamily: 'var(--font-family-mono)' }}>
                  title &bull; authors &bull; year &bull; venue &bull; publicationType &bull; DOI &bull; URL &bull; abstract &bull; researchArea
                </code>
              </p>
            </div>
          </div>
        ) : (
          /* Future Scalable Publication Cards (if items populated) */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {items.map((pub) => (
              <article key={pub.id} className="card-base" aria-labelledby={`pub-title-${pub.id}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  <span className="badge-tag" style={{ color: 'var(--color-accent-light)' }}>
                    {pub.publicationType || 'Journal Article'}
                  </span>
                  <span style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-family-mono)', color: 'var(--color-text-muted)' }}>
                    {pub.year}
                  </span>
                </div>
                <h3 id={`pub-title-${pub.id}`} style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                  {pub.title}
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                  {pub.authors?.join(', ')} &bull; <em>{pub.venue}</em>
                </p>
                {pub.abstract && (
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', lineHeight: '1.5', marginBottom: 'var(--space-3)' }}>
                    {pub.abstract}
                  </p>
                )}
                {pub.doi && (
                  <a
                    href={pub.url || `https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-family-mono)', color: 'var(--color-accent-light)' }}
                  >
                    DOI: {pub.doi} &rarr;
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Publications;
