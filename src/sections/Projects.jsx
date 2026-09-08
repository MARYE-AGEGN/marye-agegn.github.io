import React, { useState } from 'react';

/**
 * Projects Section Component
 *
 * Implements an engineering case-study presentation rather than a generic card grid.
 * Designed for scalable technical depth, supporting category expansion dynamically
 * without creating categories for projects that do not yet exist.
 *
 * Features:
 * - Direct data-binding from siteData.js (zero fabricated content)
 * - 3-column engineering triptych (Problem, Approach, Outcome)
 * - In-place accessible detail drawer for circuit topology, coil modeling, and safety specifications
 * - Research relevance bridge explaining trajectory into graduate signal/neuro research
 * - Academic disclosures affirming zero clinical trials, patents, or commercialization claims
 * - Scalable placeholder card establishing future integration of graduate research dossiers
 */
export function Projects({ projects }) {
  if (!projects || projects.length === 0) return null;

  // Dynamically extract categories solely from verified existing projects
  const availableCategories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  // By default, expand the first verified project to immediately establish technical depth
  const [expandedProjectId, setExpandedProjectId] = useState(projects[0]?.id || null);

  const toggleExpand = (projectId) => {
    setExpandedProjectId((prev) => (prev === projectId ? null : projectId));
  };

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <section id="projects" className="section-wrapper" aria-labelledby="projects-title">
      <div className="container">
        {/* ==================================================================
            1. SECTION HEADER
            ================================================================== */}
        <header className="section-header">
          <span className="section-status-badge">Engineering &amp; Design Case Studies</span>
          <h2 id="projects-title" className="section-title">Projects</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)', maxWidth: '780px', margin: 0 }}>
            Structured engineering dossiers detailing medical hardware architecture, electromagnetic modeling,
            and safety-critical design for low-resource healthcare settings.
          </p>
        </header>

        {/* ==================================================================
            2. DYNAMIC CATEGORY FILTER (Strictly reflects verified data)
            ================================================================== */}
        {availableCategories.length > 2 ? (
          <nav className="project-category-tabs" aria-label="Project category filters">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`project-category-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
              >
                {cat}
              </button>
            ))}
          </nav>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-family-mono)', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Active Category:
            </span>
            <span className="badge-tag" style={{ color: 'var(--color-accent-light)', borderColor: 'var(--color-accent-border)' }}>
              {projects[0]?.category}
            </span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              (1 Verified Case Study)
            </span>
          </div>
        )}

        {/* ==================================================================
            3. PROJECT DOSSIER LIST
            ================================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {filteredProjects.map((project) => {
            const isExpanded = expandedProjectId === project.id;
            const drawerId = `project-drawer-${project.id}`;

            return (
              <article
                key={project.id}
                id={`project-${project.id}`}
                className="project-case-study"
                aria-labelledby={`project-heading-${project.id}`}
              >
                {/* Metadata Row */}
                <div className="project-meta-row">
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span className="badge-tag" style={{ color: 'var(--color-accent-light)' }}>
                      {project.category}
                    </span>
                    {project.subCategory && (
                      <span className="badge-tag" style={{ color: 'var(--color-text-secondary)' }}>
                        {project.subCategory}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span className="status-pill status-pill-active">
                      {project.status}
                    </span>
                    {project.grade && (
                      <span
                        className="badge-tag"
                        style={{
                          backgroundColor: 'rgba(56, 189, 248, 0.12)',
                          color: 'var(--color-accent-light)',
                          fontWeight: 'var(--font-weight-bold)',
                          borderColor: 'var(--color-accent-border)',
                        }}
                      >
                        {project.grade}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Institutional Attribution */}
                <h3 id={`project-heading-${project.id}`} className="project-title">
                  {project.title}
                </h3>
                <p className="project-institution">
                  {project.institution} &bull; {project.period || project.date} &bull; {project.academicLevel || 'Capstone Project'}
                </p>

                {/* Brief Executive Summary */}
                <p className="project-brief">
                  {project.shortDescription}
                </p>

                {/* 3-Column Engineering Triptych */}
                <div className="project-triptych" role="region" aria-label="Project Problem, Approach, and Outcome">
                  <div className="project-triptych-item">
                    <span className="project-triptych-label">01 // Problem Formulation</span>
                    <p className="project-triptych-text">
                      {project.problem}
                    </p>
                  </div>
                  <div className="project-triptych-item">
                    <span className="project-triptych-label">02 // Engineering Approach</span>
                    <p className="project-triptych-text">
                      {project.approach}
                    </p>
                  </div>
                  <div className="project-triptych-item">
                    <span className="project-triptych-label" style={{ color: 'var(--color-accent-light)' }}>
                      03 // Academic Outcome
                    </span>
                    <p className="project-triptych-text">
                      {project.outcome}
                    </p>
                  </div>
                </div>

                {/* Technologies & Competencies Bar */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="project-technologies-bar">
                    <span style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-family-mono)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Core Competencies:
                    </span>
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="badge-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Expand / Collapse Action Trigger */}
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <button
                    type="button"
                    className="project-toggle-btn"
                    onClick={() => toggleExpand(project.id)}
                    aria-expanded={isExpanded}
                    aria-controls={drawerId}
                    id={`toggle-btn-${project.id}`}
                  >
                    <span>
                      {isExpanded
                        ? 'Hide Technical Specifications & Architecture'
                        : 'Explore Detailed Technical Architecture & Specifications'}
                    </span>
                    <span className={`project-toggle-icon ${isExpanded ? 'expanded' : ''}`} aria-hidden="true">
                      &#9662;
                    </span>
                  </button>
                </div>

                {/* ==========================================================
                    4. EXPANDABLE TECHNICAL DETAIL DRAWER
                    ========================================================== */}
                {isExpanded && (
                  <section
                    id={drawerId}
                    className="project-expandable-drawer"
                    aria-labelledby={`drawer-title-${project.id}`}
                  >
                    <h4
                      id={`drawer-title-${project.id}`}
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        fontFamily: 'var(--font-family-mono)',
                        color: 'var(--color-accent-light)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: 'var(--space-4)',
                        borderBottom: '1px solid var(--color-border-subtle)',
                        paddingBottom: 'var(--space-2)',
                      }}
                    >
                      System Architecture &amp; Engineering Specifications
                    </h4>

                    {/* Structured Specs Grid */}
                    {project.technicalSpecs && project.technicalSpecs.length > 0 && (
                      <div className="project-specs-grid">
                        {project.technicalSpecs.map((spec, sIdx) => (
                          <div key={sIdx} className="project-spec-item">
                            <div className="project-spec-label">{spec.label}</div>
                            <div className="project-spec-val">{spec.value}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Research Relevance Bridge */}
                    {project.researchRelevance && (
                      <div className="project-relevance-card">
                        <div className="project-relevance-label">
                          Academic &amp; Research Trajectory Relevance
                        </div>
                        <p className="project-relevance-text">
                          {project.researchRelevance}
                        </p>
                      </div>
                    )}

                    {/* Academic Disclosures & Repository / Artifact Status */}
                    <div className="project-artifacts-grid">
                      <div className="project-artifact-item">
                        <div className="project-artifact-label">Institutional Thesis Archive</div>
                        <div className="project-artifact-val">
                          {project.artifactStatus?.institutionalArchive || 'University of Gondar Academic Repository'}
                        </div>
                      </div>
                      <div className="project-artifact-item">
                        <div className="project-artifact-label">Technical Schematics Access</div>
                        <div className="project-artifact-val">
                          {project.artifactStatus?.schematicsAccess || 'Available upon formal academic inquiry'}
                        </div>
                      </div>
                      <div className="project-artifact-item">
                        <div className="project-artifact-label">Rigor &amp; Integrity Notice</div>
                        <div className="project-artifact-val">
                          {project.artifactStatus?.clinicalNotice || 'Design capstone — zero claimed patient trials or commercialization'}
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </article>
            );
          })}
        </div>

        {/* ==================================================================
            5. SCALABLE ARCHITECTURE NOTICE (Future Expansion)
            ================================================================== */}
        <aside className="project-future-card" aria-label="Future Project Dossiers">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-family-mono)', color: 'var(--color-accent-light)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'var(--font-weight-bold)' }}>
              Architecture Scalability Notice
            </span>
            <span className="badge-tag" style={{ fontSize: '0.65rem' }}>Schema Prepared</span>
          </div>
          <h4 style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
            Future Research &amp; Engineering Dossiers
          </h4>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0, maxWidth: '820px' }}>
            As current engineering and applied research milestones at Anna University (including Scalable Medical Devices, Digital Health Telemetry, and Biosignal Processing frameworks)
            and collaborative initiatives reach formal milestones, dedicated engineering case studies
            will populate this section across <span style={{ color: 'var(--color-accent-light)' }}>Scalable Medical Devices</span>, <span style={{ color: 'var(--color-accent-light)' }}>Digital Health</span>, <span style={{ color: 'var(--color-accent-light)' }}>Biosignal Processing</span>, <span style={{ color: 'var(--color-accent-light)' }}>Generative AI &amp; Rehabilitation</span>, and <span style={{ color: 'var(--color-accent-light)' }}>Computer Vision</span> following this exact technical schema.
          </p>
        </aside>
      </div>
    </section>
  );
}

export default Projects;
