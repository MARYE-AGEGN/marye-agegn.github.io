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
            1b. EXECUTIVE IDENTITY & BRAND BANNER
            ================================================================== */}
        <div
          className="about-brand-banner-card card mb-8 overflow-hidden"
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            maxHeight: '260px',
            position: 'relative',
          }}
        >
          <img
            src="./assets/images/marye-agegn-brand-banner.jpg"
            alt="Marye Agegn Gebrie — Innovator & Professional"
            style={{
              width: '100%',
              height: '240px',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
            loading="lazy"
          />
        </div>

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
            3b. CLINICAL ENGINEERING PRACTICE IN ACTION
            ================================================================== */}
        <div
          className="about-clinical-spotlight card p-6 my-8"
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="about-clinical-grid">
            <div className="about-clinical-img-col">
              <img
                src="./assets/images/marye-agegn-clinical.jpg"
                alt="Marye Agegn during hospital clinical engineering and healthcare technology management practice in Ethiopia"
                className="about-clinical-img"
                loading="lazy"
              />
            </div>
            <div className="about-clinical-text-col">
              <span className="section-status-badge">Frontline Practice</span>
              <h3 className="text-xl font-bold mt-2" style={{ color: 'var(--color-text)' }}>
                Clinical Grounding &amp; Hospital Operations
              </h3>
              <p className="text-muted text-sm mt-2" style={{ lineHeight: '1.7' }}>
                With over three years managing hospital diagnostic systems, intensive care equipment, and medical technology lifecycles across healthcare facilities in Ethiopia, Marye's engineering perspective is anchored in frontline healthcare delivery. This hands-on operational foundation directly informs his work in building scalable medical devices, digital health platforms, biosignal processing, and applied AI in healthcare.
              </p>
              <div className="flex flex-wrap gap-2 mt-4 text-xs">
                <span className="badge" style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)' }}>
                  🏥 Hospital Equipment Uptime &amp; Safety
                </span>
                <span className="badge" style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)' }}>
                  ⚡ Medical Device Maintenance &amp; Calibration
                </span>
                <span className="badge" style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)' }}>
                  🩺 Translational Clinical Engineering
                </span>
              </div>
            </div>
          </div>
        </div>

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
                href={cvAccess.fileUrl || './assets/documents/Marye_Agegn_Academic_CV.pdf'}
                download="Marye_Agegn_Academic_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ whiteSpace: 'nowrap', fontSize: 'var(--font-size-sm)' }}
              >
                {cvAccess.actionLabel || 'Download Verified Academic CV (PDF)'} ↓
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default About;
