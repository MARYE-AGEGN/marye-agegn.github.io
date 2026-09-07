import React from 'react';
import { siteData } from '../data/siteData';

/**
 * Experience Section Component
 *
 * Professional editorial presentation illustrating the progression from
 * frontline hospital clinical engineering to zonal health administration,
 * strategic technical leadership, and ultimately biomedical research.
 *
 * Avoids generic vertical timelines, using a structured progression track,
 * functional responsibility cards, and a clinical-to-research bridge callout.
 */
export function Experience({ experience }) {
  const experienceList = experience || siteData.experience || [];
  const progressionNote =
    siteData.experienceProgressionNote ||
    'From frontline hospital maintenance to zonal technology planning and strategic technical management, this clinical grounding directly motivated Marye\'s transition into graduate computational biomedical research.';

  if (experienceList.length === 0) return null;

  return (
    <section id="experience" className="section-wrapper" aria-labelledby="experience-title">
      <div className="container">
        {/* ==================================================================
            1. SECTION HEADER
            ================================================================== */}
        <header className="section-header">
          <span className="section-status-badge">Clinical Engineering &amp; Healthcare Technology</span>
          <h2 id="experience-title" className="section-title">Experience</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)', maxWidth: '820px', margin: 0 }}>
            Demonstrated progression across hospital clinical engineering, zonal healthcare asset oversight,
            and technical operations management—grounding computational research in real-world clinical realities.
          </p>
        </header>

        {/* ==================================================================
            2. PROGRESSION TRACK (Visualizing Career Trajectory)
            ================================================================== */}
        <div className="experience-progression-track" role="region" aria-label="Professional Progression Overview">
          <div className="progression-step">
            <span className="progression-step-label">01 // Frontline Engineering</span>
            <div className="progression-step-title">Biomedical Engineer</div>
            <div className="progression-step-org">Amhara Regional Health Bureau (2022–2023)</div>
          </div>
          <div className="progression-step">
            <span className="progression-step-label">02 // Zonal Administration</span>
            <div className="progression-step-title">Biomedical Officer</div>
            <div className="progression-step-org">Central Gondar Health Dept (2023–2024)</div>
          </div>
          <div className="progression-step">
            <span className="progression-step-label">03 // Technical Leadership</span>
            <div className="progression-step-title">Technical Manager</div>
            <div className="progression-step-org">Shine Business PLC (2024–2025)</div>
          </div>
          <div className="progression-step" style={{ borderLeft: '1px dashed var(--color-accent-border)', paddingLeft: 'var(--space-2)' }}>
            <span className="progression-step-label" style={{ color: 'var(--color-accent-light)' }}>
              04 // Graduate Research
            </span>
            <div className="progression-step-title" style={{ color: 'var(--color-accent-light)' }}>
              Graduate Researcher
            </div>
            <div className="progression-step-org">Anna University (2025–Present)</div>
          </div>
        </div>

        {/* ==================================================================
            3. EDITORIAL EXPERIENCE CARDS
            ================================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {experienceList.map((entry) => (
            <article
              key={entry.id}
              id={`experience-${entry.id}`}
              className="experience-card"
              aria-labelledby={`exp-title-${entry.id}`}
            >
              {/* Header Row */}
              <div className="experience-header-row">
                <div>
                  <h3 id={`exp-title-${entry.id}`} className="experience-title">
                    {entry.position}
                  </h3>
                  <div className="experience-org">
                    {entry.organization} <span>&bull; {entry.location}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-1)' }}>
                  <span
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      fontFamily: 'var(--font-family-mono)',
                      color: 'var(--color-text-muted)',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    {entry.period}
                  </span>
                  {entry.tier && (
                    <span className="badge-tag" style={{ color: 'var(--color-accent-light)', borderColor: 'var(--color-accent-border)' }}>
                      {entry.tier}
                    </span>
                  )}
                </div>
              </div>

              {/* High-Level Scope Summary */}
              {entry.summary && (
                <p className="experience-summary">
                  {entry.summary}
                </p>
              )}

              {/* Structured Responsibilities Grid */}
              {entry.responsibilities && entry.responsibilities.length > 0 && (
                <div className="experience-resp-grid" role="list" aria-label="Key Responsibility Domains">
                  {entry.responsibilities.map((resp, idx) => (
                    <div key={idx} className="experience-resp-card" role="listitem">
                      <span className="experience-resp-focus">
                        {typeof resp === 'object' ? resp.focus : `Responsibility 0${idx + 1}`}
                      </span>
                      <p className="experience-resp-detail">
                        {typeof resp === 'object' ? resp.detail : resp}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Functional Competency & Themes Bar */}
              {entry.themes && entry.themes.length > 0 && (
                <div className="experience-themes-bar">
                  <span
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      fontFamily: 'var(--font-family-mono)',
                      color: 'var(--color-text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Functional Themes:
                  </span>
                  {entry.themes.map((theme, tIdx) => (
                    <span key={tIdx} className="badge-tag">
                      {theme}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        {/* ==================================================================
            4. THE CLINICAL PRACTICE TO RESEARCH BRIDGE
            ================================================================== */}
        <aside className="experience-bridge-card" aria-label="Clinical Practice to Research Bridge">
          <div className="experience-bridge-label">
            The Clinical Grounding &rarr; Computational Research Bridge
          </div>
          <p className="experience-bridge-text">
            {progressionNote}
          </p>
        </aside>
      </div>
    </section>
  );
}

export default Experience;
