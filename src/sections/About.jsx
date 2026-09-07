import React from 'react';

export function About({ about }) {
  if (!about) return null;

  const {
    title = 'About',
    subtitle = 'Evolution of Professional Identity',
    leadParagraph,
    sections = [],
    corePhilosophy,
    cvAccess,
  } = about;

  return (
    <section id="about" className="section-wrapper" aria-labelledby="about-title">
      <div className="container">
        {/* ==================================================================
            1. SECTION HEADER
            ================================================================== */}
        <header className="section-header">
          <span className="section-status-badge">Professional Trajectory</span>
          <h2 id="about-title" className="section-title">{title}</h2>
          {subtitle && (
            <p style={{ color: 'var(--color-accent-light)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', margin: 0 }}>
              {subtitle}
            </p>
          )}
        </header>

        {/* ==================================================================
            2. LEAD EDITORIAL NARRATIVE
            ================================================================== */}
        {leadParagraph && (
          <div className="content-reading-width">
            <p className="about-narrative-lead">
              {leadParagraph}
            </p>
          </div>
        )}

        {/* ==================================================================
            3. CORE ENGINEERING PHILOSOPHY
            ================================================================== */}
        {corePhilosophy && (
          <aside className="about-quote-block" aria-label="Core Engineering Philosophy">
            <p className="about-quote-text">
              {corePhilosophy.statement}
            </p>
            <div className="about-quote-author">
              &mdash; {corePhilosophy.author} &bull; Clinical Engineer &amp; Graduate Researcher
            </div>
          </aside>
        )}

        {/* ==================================================================
            4. THE FOUR PROGRESSION CHAPTERS
            ================================================================== */}
        <div className="about-chapters-grid" role="feed" aria-label="Professional evolution chapters">
          {sections.map((chapter, idx) => (
            <article
              key={chapter.id || idx}
              className="about-chapter-card"
              aria-labelledby={`chapter-title-${idx}`}
            >
              <div className="about-chapter-meta">
                <span className="about-chapter-number">
                  Chapter 0{idx + 1}
                </span>
                <span className="about-chapter-period">
                  {chapter.period}
                </span>
              </div>

              <h3 id={`chapter-title-${idx}`} className="about-chapter-title">
                {chapter.title}
              </h3>

              <div className="about-chapter-institution">
                {chapter.institution}
              </div>

              <p className="about-chapter-narrative">
                {chapter.narrative}
              </p>
            </article>
          ))}
        </div>

        {/* ==================================================================
            5. FORMAL CURRICULUM VITAE ACCESS
            ================================================================== */}
        {cvAccess && (
          <div className="cv-access-card" aria-labelledby="cv-access-title">
            <div style={{ maxWidth: '650px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                <h4 id="cv-access-title" style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', margin: 0 }}>
                  Academic &amp; Clinical Curriculum Vitae
                </h4>
                <span className="status-pill status-pill-progress" style={{ fontSize: '0.7rem' }}>
                  {cvAccess.status}
                </span>
              </div>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
                {cvAccess.note}
              </p>
            </div>

            <div>
              <a
                href={`mailto:${cvAccess.requestEmail}?subject=Academic%20CV%20Request%20-%20Marye%20Agegn`}
                className="btn btn-secondary"
                style={{ whiteSpace: 'nowrap', fontSize: 'var(--font-size-sm)' }}
              >
                {cvAccess.actionLabel} &rarr;
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default About;
