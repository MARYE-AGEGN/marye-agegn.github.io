import React, { useState } from 'react';
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
  const [selectedBscYear, setSelectedBscYear] = useState('Year III');
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
            and physiological systems to biosignal processing, gait analysis, medical imaging, and rehabilitation engineering.
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

                {/* Active Laboratory Work Spotlight (e.g. Gait Analysis Lab) */}
                {item.labAffiliation && (
                  <div
                    style={{
                      background: 'rgba(2, 132, 199, 0.05)',
                      border: '1px solid rgba(2, 132, 199, 0.25)',
                      borderLeft: '4px solid var(--color-primary)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-4)',
                      marginBottom: 'var(--space-4)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                      <span
                        className="badge"
                        style={{
                          background: 'var(--color-primary)',
                          color: '#ffffff',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Current Research Focus
                      </span>
                      <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                        {item.labAffiliation}
                      </strong>
                    </div>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
                      {item.labWorkDetail}
                    </p>
                  </div>
                )}

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

                {/* M.E. Core Courses List (Anna University Regulations 2023) */}
                {item.coreCourses && item.coreCourses.length > 0 && (
                  <div style={{ marginTop: 'var(--space-5)', marginBottom: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-family-mono)',
                          color: 'var(--color-text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          fontWeight: 700,
                        }}
                      >
                        M.E. Core Curriculum (Anna Univ Regulations 2023):
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 'var(--space-2)',
                      }}
                    >
                      {item.coreCourses.map((c, cIdx) => (
                        <div
                          key={cIdx}
                          style={{
                            padding: 'var(--space-3)',
                            background: '#f8fafc',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', marginBottom: '2px' }}>
                            <strong style={{ fontSize: '0.82rem', color: 'var(--color-text-primary)' }}>
                              <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-family-mono)', marginRight: '6px' }}>
                                {c.code}
                              </span>
                              {c.name}
                            </strong>
                            <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                              {c.credits}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                            {c.highlights}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Official University of Gondar BSc Curriculum Explorer */}
                {item.curriculum && item.curriculum.courses && (
                  <div style={{ marginTop: 'var(--space-5)', marginBottom: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: 'var(--space-2)' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-family-mono)',
                          color: 'var(--color-text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          fontWeight: 700,
                        }}
                      >
                        Official 5-Year Curriculum (University of Gondar IoT):
                      </span>
                      <a
                        href={item.curriculum.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--color-primary)',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: 600,
                        }}
                      >
                        Official Curriculum Source &rarr;
                      </a>
                    </div>

                    {/* Graduation Requirements Banner */}
                    <div
                      style={{
                        background: '#f8fafc',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: 'var(--space-3)',
                        marginBottom: 'var(--space-3)',
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                        <div>
                          <strong style={{ color: 'var(--color-text-primary)' }}>Requirements: </strong>
                          177 CrHr / 318 ECTS
                        </div>
                        <span style={{ color: 'var(--color-border)' }}>|</span>
                        <div>General Ed: 55 CrHr (91 ECTS)</div>
                        <span style={{ color: 'var(--color-border)' }}>|</span>
                        <div>Supportive: 53 CrHr (88 ECTS)</div>
                        <span style={{ color: 'var(--color-border)' }}>|</span>
                        <div>Core/Major: 65 CrHr (134 ECTS)</div>
                        <span style={{ color: 'var(--color-border)' }}>|</span>
                        <div>Electives: 3 CrHr (5 ECTS)</div>
                      </div>
                      <div style={{ marginTop: '4px', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                        Includes Industry Attachment / Internship (BMED-4254) and Independent B.Sc. Thesis (BMED-5281).
                      </div>
                    </div>

                    {/* Year Filter Buttons */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 'var(--space-3)' }}>
                      {['Year I', 'Year II', 'Year III', 'Year IV', 'Year V', 'All 62 Courses'].map((yr) => {
                        const isSelected = selectedBscYear === yr;
                        return (
                          <button
                            key={yr}
                            type="button"
                            onClick={() => setSelectedBscYear(yr)}
                            style={{
                              background: isSelected ? 'var(--color-primary)' : '#ffffff',
                              color: isSelected ? '#ffffff' : 'var(--color-text-secondary)',
                              border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                              borderRadius: 'var(--radius-full)',
                              padding: '2px 10px',
                              fontSize: '0.72rem',
                              fontWeight: isSelected ? 600 : 500,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {yr}
                          </button>
                        );
                      })}
                    </div>

                    {/* Courses List */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 'var(--space-2)',
                        maxHeight: selectedBscYear === 'All 62 Courses' ? '360px' : 'none',
                        overflowY: selectedBscYear === 'All 62 Courses' ? 'auto' : 'visible',
                        paddingRight: selectedBscYear === 'All 62 Courses' ? '4px' : '0',
                      }}
                    >
                      {(selectedBscYear === 'All 62 Courses'
                        ? item.curriculum.courses
                        : item.curriculum.courses.filter((c) => c.year === selectedBscYear)
                      ).map((c, cIdx) => (
                        <div
                          key={cIdx}
                          style={{
                            padding: 'var(--space-2) var(--space-3)',
                            background: '#f8fafc',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '2px' }}>
                            <strong style={{ fontSize: '0.8rem', color: 'var(--color-text-primary)' }}>
                              <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-family-mono)', marginRight: '6px' }}>
                                {c.code}
                              </span>
                              {c.title}
                            </strong>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>
                            <span>{c.year} &bull; {c.semester}</span>
                            <span
                              style={{
                                background: c.category.includes('Core') ? 'rgba(2, 132, 199, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                                color: c.category.includes('Core') ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                fontWeight: 500,
                              }}
                            >
                              {c.category}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
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
                      Core Competencies &amp; Research Focus:
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
