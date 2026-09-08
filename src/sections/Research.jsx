import React from 'react';

export function Research({ research }) {
  if (!research) return null;

  const {
    title = 'Engineering & Applied Research',
    subtitle = 'Biosignal Processing • Generative AI & Rehabilitation • Neuroimaging • Computer Vision',
    graduateResearchFocus,
    currentMasterResearch,
    broaderInterests = [],
    thematicExplorations = [],
    scopeNote,
  } = research;

  const activeFocus = graduateResearchFocus || currentMasterResearch;

  return (
    <section id="research" className="section-wrapper" aria-labelledby="research-title">
      <div className="container">
        {/* ==================================================================
            1. SECTION HEADER
            ================================================================== */}
        <header className="section-header">
          <span className="section-status-badge">Engineering &amp; Applied Innovation</span>
          <h2 id="research-title" className="section-title">{title}</h2>
          {subtitle && (
            <p style={{ color: 'var(--color-accent-light)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', margin: 0 }}>
              {subtitle}
            </p>
          )}
        </header>

        {/* ==================================================================
            2. CORE RESEARCH & ENGINEERING FOCUS
            ================================================================== */}
        {activeFocus && (
          <article className="research-dossier" aria-labelledby="research-focus-title">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span className="badge-tag" style={{ color: 'var(--color-accent-light)' }}>
                  Active Engineering Focus
                </span>
                <span className="status-pill status-pill-progress">
                  {activeFocus.status}
                </span>
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-family-mono)', color: 'var(--color-text-muted)' }}>
                {activeFocus.institution} &bull; Commenced {activeFocus.commenced}
              </div>
            </div>

            <h3 id="research-focus-title" style={{ fontSize: 'clamp(1.3rem, 2.5vw, var(--font-size-2xl))', color: 'var(--color-text-primary)', lineHeight: 1.35, marginBottom: 'var(--space-4)' }}>
              {activeFocus.title}
            </h3>

            {/* Research Direction Chips */}
            {activeFocus.researchDirections && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }} aria-label="Research fields">
                {activeFocus.researchDirections.map((dir, idx) => (
                  <span key={idx} className="badge-tag">
                    {dir}
                  </span>
                ))}
              </div>
            )}

            {/* Conceptual Framework Overview */}
            <div className="content-reading-width" style={{ marginBottom: 'var(--space-8)' }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: '1.75', margin: 0 }}>
                {activeFocus.conceptualFocus}
              </p>
            </div>

            {/* Core Applied Engineering Pillars */}
            {(activeFocus.pillars || activeFocus.corePillars) && (
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                  Core Applied Research Pillars
                </h4>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
                  Translational engineering pillars bridging physical biosensors, generative intelligence, neuro-diagnostics, and vision systems.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
                  {(activeFocus.pillars || activeFocus.corePillars).map((pillar, idx) => (
                    <div key={idx} className="card-base" style={{ padding: 'var(--space-5)' }}>
                      <span style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-family-mono)', color: 'var(--color-accent-light)', marginBottom: 'var(--space-1)' }}>
                        Pillar 0{idx + 1}
                      </span>
                      <strong style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
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

            {/* Translational Mission Notice */}
            <div
              style={{
                backgroundColor: 'rgba(2, 132, 199, 0.05)',
                border: '1px solid rgba(2, 132, 199, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4) var(--space-5)',
                marginTop: 'var(--space-4)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                <span style={{ fontSize: '1rem', color: 'var(--color-accent-light)' }}>⚙️</span>
                <strong style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-primary)' }}>
                  Translational Engineering &amp; Clinical Impact
                </strong>
              </div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
                Committed to scalable healthcare delivery: bridging physiological signal hardware with generative AI and computer vision to deliver reliable, clinically usable tools for hospitals, clinics, and decentralized communities.
              </p>
            </div>
          </article>
        )}

        {/* ==================================================================
            3. BROADER APPLIED INTERESTS & CLINICAL DOMAINS
            ================================================================== */}
        <div style={{ marginTop: 'var(--space-12)' }}>
          <div className="section-header" style={{ marginBottom: 'var(--space-6)' }}>
            <span className="section-status-badge">Innovation Ecosystem</span>
            <h3 style={{ fontSize: 'var(--font-size-xl)' }}>
              Applied Engineering Domains &amp; Collaborative Horizons
            </h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
              Connecting medical device hardware, digital health platforms, and advanced intelligence.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
            {broaderInterests.map((group, idx) => (
              <div key={idx} className="card-base" style={{ padding: 'var(--space-6)' }}>
                <h4 style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-accent-light)', marginBottom: 'var(--space-3)' }}>
                  {group.category}
                </h4>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
                  {group.topics.map((topic, tIdx) => (
                    <li key={tIdx} style={{ marginBottom: 'var(--space-2)' }}>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Thematic Clinical Focus Areas */}
          {thematicExplorations.length > 0 && (
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <h4 style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
                Target Healthcare Innovations
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
                {thematicExplorations.map((theme, idx) => (
                  <div key={idx} className="card-base" style={{ padding: 'var(--space-5)' }}>
                    <strong style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>
                      {theme.theme}
                    </strong>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: '1.5', margin: 0 }}>
                      {theme.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scope Note */}
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontStyle: 'italic', borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-4)' }}>
            {scopeNote}
          </p>
        </div>
      </div>
    </section>
  );
}

export default Research;
