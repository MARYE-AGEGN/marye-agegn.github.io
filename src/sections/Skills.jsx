import React from 'react';
import { siteData } from '../data/siteData';

/**
 * Skills & Competencies Section Component
 *
 * Structured domain architecture organizing technical proficiencies around
 * verified professional practices:
 * - Biomedical Engineering & Medical Devices
 * - Signals, Biomechanics & Imaging
 * - Computational Tools & Languages
 * - Professional & Healthcare Operations
 *
 * Strict Design Principles:
 * - Zero arbitrary percentage bars
 * - Zero unverified beginner/expert ratings
 * - Zero chaotic word clouds
 * - Distinct, domain-specific competencies with accessible focus and hover states
 */
export function Skills({ skills }) {
  const skillCategories = skills?.categories || siteData.skills?.categories || [];

  if (skillCategories.length === 0) return null;

  return (
    <section id="skills" className="section-wrapper" aria-labelledby="skills-title">
      <div className="container">
        {/* ==================================================================
            1. SECTION HEADER
            ================================================================== */}
        <header className="section-header">
          <span className="section-status-badge">Technical &amp; Clinical Competencies</span>
          <h2 id="skills-title" className="section-title">Skills &amp; Domain Expertise</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)', maxWidth: '820px', margin: 0 }}>
            Structured domain competencies spanning physical medical device lifecycle management,
            kinematic signal processing, scientific programming, and clinical operations.
          </p>
        </header>

        {/* ==================================================================
            2. DOMAIN GRID (2x2 Modular Architecture)
            ================================================================== */}
        <div className="skills-domain-grid" role="region" aria-label="Skills by Professional Domain">
          {skillCategories.map((category) => (
            <article
              key={category.id}
              id={`skill-domain-${category.id}`}
              className="skills-domain-card"
              aria-labelledby={`skill-cat-${category.id}`}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  <span className="badge-tag" style={{ color: 'var(--color-accent-light)' }}>
                    Core Domain
                  </span>
                </div>
                <h3 id={`skill-cat-${category.id}`} className="skills-domain-title">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="skills-domain-desc">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Skill Pills List */}
              <div className="skills-pills-list" role="list" aria-label={`${category.name} Skills`}>
                {category.skills.map((skill, sIdx) => (
                  <div key={sIdx} className="skill-pill" role="listitem">
                    {skill}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
