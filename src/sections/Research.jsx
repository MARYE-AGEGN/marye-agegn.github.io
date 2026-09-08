import React from 'react';
import { siteData } from '../data/siteData';

/**
 * Research Section Component
 *
 * Clearly distinguishes:
 * 1. Current Research (In Progress at Anna University)
 * 2. Academic & Research Interests
 * 3. Future Research Directions
 *
 * Adheres strictly to scientific integrity and privacy:
 * - High-level conceptual overview only
 * - Zero disclosure of unpublished thesis methodology or proprietary data
 * - Avoids exaggerated claims of completed expertise
 */
export function Research({ onSelectCollaboration }) {
  const research = siteData.research || {};
  const {
    title = 'Research & Academic Focus',
    subtitle = 'Current Research • Academic & Research Interests • Future Directions',
    currentResearch,
    academicInterests,
    futureDirections = [],
    scopeNote,
  } = research;

  const handleCollab = () => {
    if (typeof onSelectCollaboration === 'function') {
      onSelectCollaboration('Academic research collaboration', currentResearch?.title || 'Mobility Assessment & Wearable Biosensors');
    } else {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="research" className="section-wrapper research-section" aria-labelledby="research-title">
      <div className="container">
        {/* ==================================================================
            1. SECTION HEADER
            ================================================================== */}
        <header className="section-header">
          <span className="section-status-badge">Scholarly &amp; Applied Trajectory</span>
          <h2 id="research-title" className="section-title">{title}</h2>
          {subtitle && (
            <p style={{ color: 'var(--color-accent-light)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', margin: 0 }}>
              {subtitle}
            </p>
          )}
        </header>

        {/* ==================================================================
            2. CURRENT RESEARCH (ACTIVE GRADUATE INVESTIGATION)
            ================================================================== */}
        {currentResearch && (
          <article
            className="research-dossier card"
            style={{
              padding: 'var(--space-8)',
              background: '#ffffff',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: 'var(--space-12)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}
            aria-labelledby="current-research-title"
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span
                  className="badge"
                  style={{
                    background: 'var(--color-primary-light, #e0f2fe)',
                    color: 'var(--color-primary, #0284c7)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  CURRENT RESEARCH
                </span>
                <span className="status-pill status-pill-progress">
                  {currentResearch.status}
                </span>
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-family-mono)', color: 'var(--color-text-muted)' }}>
                {currentResearch.laboratory ? (
                  <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{currentResearch.laboratory} &bull; </span>
                ) : null}
                {currentResearch.institution} &bull; Commenced {currentResearch.commenced}
              </div>
            </div>

            <h3
              id="current-research-title"
              style={{
                fontSize: 'clamp(1.25rem, 2.2vw, var(--font-size-2xl))',
                color: 'var(--color-text-primary)',
                lineHeight: 1.35,
                marginBottom: 'var(--space-4)',
                fontWeight: 700,
              }}
            >
              {currentResearch.title}
            </h3>

            <div style={{ maxWidth: '880px', marginBottom: 'var(--space-8)' }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: '1.75', margin: 0 }}>
                {currentResearch.highLevelSummary}
              </p>
            </div>

            {/* 4 Core Pillars of Current Research */}
            {currentResearch.pillars && (
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <h4
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-bold)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--color-text-muted)',
                    marginBottom: 'var(--space-3)',
                  }}
                >
                  Investigative Dimensions &amp; Applied Methodology:
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
                  {currentResearch.pillars.map((pillar, idx) => (
                    <div
                      key={idx}
                      className="card-base"
                      style={{
                        padding: 'var(--space-5)',
                        background: 'rgba(248, 250, 252, 0.7)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <span
                        style={{
                          display: 'block',
                          fontSize: 'var(--font-size-xs)',
                          fontFamily: 'var(--font-family-mono)',
                          color: 'var(--color-primary)',
                          fontWeight: 700,
                          marginBottom: 'var(--space-1)',
                        }}
                      >
                        0{idx + 1}
                      </span>
                      <strong
                        style={{
                          display: 'block',
                          fontSize: 'var(--font-size-sm)',
                          color: 'var(--color-text-primary)',
                          marginBottom: 'var(--space-2)',
                        }}
                      >
                        {pillar.title}
                      </strong>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
                        {pillar.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Academic Notice and CTA */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
                borderTop: '1px solid var(--color-border-subtle)',
                paddingTop: 'var(--space-4)',
                marginTop: 'var(--space-4)',
              }}
            >
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontStyle: 'italic', margin: 0, flex: 1 }}>
                {currentResearch.notice}
              </p>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={handleCollab}
                style={{ whiteSpace: 'nowrap' }}
              >
                Discuss Research Collaboration →
              </button>
            </div>
          </article>
        )}

        {/* ==================================================================
            3. ACADEMIC & RESEARCH INTERESTS
            ================================================================== */}
        {academicInterests && (
          <div style={{ marginBottom: 'var(--space-12)' }}>
            <div className="section-header" style={{ marginBottom: 'var(--space-4)' }}>
              <span className="section-status-badge">Core Disciplines</span>
              <h3 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text-primary)' }}>
                Academic &amp; Research Interests
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                {academicInterests.intro}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 'var(--space-3)',
                marginTop: 'var(--space-6)',
              }}
              role="list"
              aria-label="Academic and Research Interests"
            >
              {academicInterests.items?.map((item, idx) => (
                <div
                  key={idx}
                  role="listitem"
                  className="card-base"
                  style={{
                    padding: 'var(--space-4) var(--space-5)',
                    background: '#ffffff',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 'var(--space-2)',
                  }}
                >
                  <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', lineHeight: 1.35 }}>
                    {item.name}
                  </strong>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-family-mono)',
                      color: 'var(--color-primary)',
                      background: 'rgba(2, 132, 199, 0.08)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      alignSelf: 'flex-start',
                    }}
                  >
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            4. FUTURE RESEARCH DIRECTIONS
            ================================================================== */}
        {futureDirections.length > 0 && (
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <div className="section-header" style={{ marginBottom: 'var(--space-4)' }}>
              <span className="section-status-badge">Future Horizons</span>
              <h3 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text-primary)' }}>
                Future Research Directions
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
              {futureDirections.map((future, idx) => (
                <div
                  key={idx}
                  className="card-base"
                  style={{
                    padding: 'var(--space-5)',
                    background: 'rgba(248, 250, 252, 0.7)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <strong style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', marginBottom: 'var(--space-1)' }}>
                    {future.theme}
                  </strong>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
                    {future.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scope Note */}
        {scopeNote && (
          <aside
            style={{
              borderTop: '1px solid var(--color-border-subtle)',
              paddingTop: 'var(--space-4)',
              marginTop: 'var(--space-8)',
            }}
          >
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
              {scopeNote}
            </p>
          </aside>
        )}
      </div>
    </section>
  );
}

export default Research;
