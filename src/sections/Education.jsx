import React from 'react';
import { siteData } from '../data/siteData';

/**
 * Education Section Component
 *
 * Editorial presentation connecting academic training directly to ongoing
 * graduate research directions in biosignal processing, generative AI, neuroimaging, and computer vision.
 *
 * Adheres strictly to verified data:
 * - Master of Engineering (Anna University, started July 2025, current)
 * - Bachelor of Science (University of Gondar, 2016–2021, GPA: 3.78/4.00, Thesis Grade: A)
 * - Zero exposure of sensitive personal details (no DOB, high school, or student IDs)
 */
export function Education({ education }) {
  const educationList = education || siteData.education || [];
  const trajectoryNote =
    siteData.educationTrajectoryNote ||
    'Academic trajectory spans from rigorous undergraduate engineering fundamentals and neuromodulation hardware design at the University of Gondar to advanced computational biomedical signal processing, machine learning, and biomechanics at Anna University.';

  if (educationList.length === 0) return null;

  return (
    <section id="education" className="section-wrapper" aria-labelledby="education-title">
      <div className="container">
        {/* ==================================================================
            1. SECTION HEADER
            ================================================================== */}
        <header className="section-header">
          <span className="section-status-badge">Academic Foundations &amp; Research Directions</span>
          <h2 id="education-title" className="section-title">Education</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)', maxWidth: '820px', margin: 0 }}>
            Formal engineering education establishing the continuum from physical medical device instrumentation
            and physiological systems to biosignal processing, generative AI, neuroimaging, and computer vision.
          </p>
        </header>

        {/* ==================================================================
            2. EDITORIAL EDUCATION CARDS (2-Column Grid)
            ================================================================== */}
        <div className="education-grid">
          {educationList.map((item) => {
            const isGraduate = item.id.includes('anna-university');

            return (
              <article
                key={item.id}
                id={`education-${item.id}`}
                className="education-card"
                aria-labelledby={`edu-heading-${item.id}`}
              >
                <div className="education-card-header">
                  {/* Metadata Row */}
                  <div className="education-meta-row">
                    <span
                      className={`status-pill ${isGraduate ? 'status-pill-progress' : 'status-pill-complete'}`}
                    >
                      {item.status}
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        fontFamily: 'var(--font-family-mono)',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {item.period}
                    </span>
                  </div>

                  {/* Degree & Field */}
                  <h3 id={`edu-heading-${item.id}`} className="education-degree">
                    {item.degree} in {item.field}
                  </h3>

                  {/* Institution & Location */}
                  <div className="education-institution">
                    {item.institution} <span>&bull; {item.location}</span>
                  </div>

                  {/* Academic Evaluation / Distinction Badge */}
                  {item.grade && (
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                      <span
                        className="badge-tag"
                        style={{
                          backgroundColor: 'rgba(56, 189, 248, 0.1)',
                          color: 'var(--color-accent-light)',
                          borderColor: 'var(--color-accent-border)',
                          fontWeight: 'var(--font-weight-semibold)',
                        }}
                      >
                        {item.grade}
                      </span>
                    </div>
                  )}
                </div>

                {/* Thesis / Capstone Research Box */}
                {item.thesis && (
                  <div className="education-thesis-box" role="region" aria-label="Thesis or Capstone Focus">
                    <div className="education-thesis-label">
                      {item.thesis.status || item.thesis.grade || 'Thesis Focus'}
                    </div>
                    <div className="education-thesis-title">
                      &ldquo;{item.thesis.title}&rdquo;
                    </div>
                    {item.researchConnection && (
                      <p className="education-connection-text">
                        <strong style={{ color: 'var(--color-accent-light)' }}>Research Grounding: </strong>
                        {item.researchConnection}
                      </p>
                    )}
                  </div>
                )}

                {/* Core Academic Focus & Competencies */}
                {item.keyFocus && item.keyFocus.length > 0 && (
                  <div className="education-focus-wrapper">
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-family-mono)',
                        color: 'var(--color-text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Core Curricular &amp; Research Focus:
                    </span>
                    <div className="education-focus-list">
                      {item.keyFocus.map((focus, fIdx) => (
                        <span key={fIdx} className="badge-tag">
                          {focus}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* ==================================================================
            3. ACADEMIC TRAJECTORY SYNTHESIS
            ================================================================== */}
        <aside className="education-trajectory-summary" aria-label="Academic Trajectory Synthesis">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
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
              Academic Continuum
            </span>
            <span className="badge-tag" style={{ fontSize: '0.65rem' }}>Hardware &rarr; AI Synthesis</span>
          </div>
          <h4 style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
            Connecting Biomedical Hardware Grounding to Computational Research
          </h4>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.65', margin: 0, maxWidth: '820px' }}>
            {trajectoryNote}
          </p>
        </aside>
      </div>
    </section>
  );
}

export default Education;
