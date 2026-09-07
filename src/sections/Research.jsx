import React, { useState } from 'react';

export function Research({ research }) {
  if (!research) return null;

  const {
    title = 'Research',
    subtitle = 'Explainable Deep Learning & Wearable Sensor Biomechanics',
    currentMasterResearch,
    broaderInterests = [],
    thematicExplorations = [],
    scopeNote,
  } = research;

  // Flatten all 11 stages for easy lookup and interactive selection
  const allStages = currentMasterResearch?.pipelinePhases?.flatMap((phase) => phase.stages) || [];
  const [selectedStage, setSelectedStage] = useState(allStages[0] || null);

  return (
    <section id="research" className="section-wrapper" aria-labelledby="research-title">
      <div className="container">
        {/* ==================================================================
            1. SECTION HEADER
            ================================================================== */}
        <header className="section-header">
          <span className="section-status-badge">Primary Academic Anchor</span>
          <h2 id="research-title" className="section-title">{title}</h2>
          {subtitle && (
            <p style={{ color: 'var(--color-accent-light)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', margin: 0 }}>
              {subtitle}
            </p>
          )}
        </header>

        {/* ==================================================================
            2. CENTRAL RESEARCH QUESTION
            ================================================================== */}
        {currentMasterResearch?.centralResearchQuestion && (
          <aside className="research-question-box" aria-label="Central Research Question">
            <div className="research-question-label">
              Central Research Question
            </div>
            <p className="research-question-text">
              &ldquo;{currentMasterResearch.centralResearchQuestion}&rdquo;
            </p>
          </aside>
        )}

        {/* ==================================================================
            3. MASTER'S THESIS RESEARCH DOSSIER
            ================================================================== */}
        {currentMasterResearch && (
          <article className="research-dossier" aria-labelledby="thesis-title">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span className="badge-tag" style={{ color: 'var(--color-accent-light)' }}>
                  Active Master&apos;s Thesis Direction
                </span>
                <span className="status-pill status-pill-progress">
                  {currentMasterResearch.status}
                </span>
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-family-mono)', color: 'var(--color-text-muted)' }}>
                {currentMasterResearch.institution} &bull; Commenced {currentMasterResearch.commenced}
              </div>
            </div>

            <h3 id="thesis-title" style={{ fontSize: 'clamp(1.3rem, 2.5vw, var(--font-size-2xl))', color: 'var(--color-text-primary)', lineHeight: 1.35, marginBottom: 'var(--space-4)' }}>
              {currentMasterResearch.title}
            </h3>

            {/* Research Direction Chips */}
            {currentMasterResearch.researchDirections && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }} aria-label="Research fields">
                {currentMasterResearch.researchDirections.map((dir, idx) => (
                  <span key={idx} className="badge-tag">
                    {dir}
                  </span>
                ))}
              </div>
            )}

            {/* Conceptual Framework Text */}
            <div className="content-reading-width" style={{ marginBottom: 'var(--space-6)' }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: '1.7', margin: 0 }}>
                {currentMasterResearch.conceptualFocus}
              </p>
            </div>

            {/* Data Modality & Protocols Grid */}
            {currentMasterResearch.dataModality && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
                <div style={{ padding: 'var(--space-4)', backgroundColor: 'rgba(11, 15, 23, 0.6)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-family-mono)', color: 'var(--color-accent-light)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Sensor &amp; Placement
                  </span>
                  <strong style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                    {currentMasterResearch.dataModality.sensor}
                  </strong>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
                    {currentMasterResearch.dataModality.placement}
                  </p>
                </div>

                <div style={{ padding: 'var(--space-4)', backgroundColor: 'rgba(11, 15, 23, 0.6)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-family-mono)', color: 'var(--color-accent-light)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Signal Channels
                  </span>
                  <strong style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                    Kinematic Time-Series
                  </strong>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
                    {currentMasterResearch.dataModality.signals}
                  </p>
                </div>

                <div style={{ padding: 'var(--space-4)', backgroundColor: 'rgba(11, 15, 23, 0.6)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-family-mono)', color: 'var(--color-accent-light)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Walking Protocols
                  </span>
                  <strong style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                    Single vs. Dual-Task
                  </strong>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
                    {currentMasterResearch.dataModality.protocols}
                  </p>
                </div>
              </div>
            )}

            {/* ==============================================================
                4. THE 11-STAGE METHODOLOGICAL PIPELINE EXPLORER
                ============================================================== */}
            <div className="pipeline-explorer">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-4)' }}>
                <div>
                  <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', margin: 0 }}>
                    11-Stage Methodological Framework
                  </h4>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                    Select any stage below to inspect inputs, algorithmic processing, and clinical translation intent.
                  </p>
                </div>
                <span className="badge-tag" style={{ fontSize: '0.7rem' }}>
                  Interactive Inspector
                </span>
              </div>

              {/* 4-Phase Grid */}
              <div className="pipeline-phases-wrapper">
                {currentMasterResearch.pipelinePhases?.map((phase, pIdx) => (
                  <div key={pIdx} className="pipeline-phase-col">
                    <div className="pipeline-phase-header">
                      {phase.phaseNum}: {phase.phaseTitle}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {phase.stages.map((stage) => {
                        const isSelected = selectedStage?.step === stage.step;
                        return (
                          <button
                            key={stage.step}
                            type="button"
                            onClick={() => setSelectedStage(stage)}
                            className={`pipeline-stage-btn ${isSelected ? 'selected' : ''}`}
                            aria-pressed={isSelected}
                          >
                            <span className="pipeline-stage-num">Stage 0{stage.step}</span>
                            <span className="pipeline-stage-name">{stage.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Active Stage Detail Inspection Card */}
              {selectedStage && (
                <div className="pipeline-detail-card" role="region" aria-live="polite" aria-label="Pipeline Stage Details">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span className="status-pill status-pill-progress" style={{ fontSize: '0.7rem' }}>
                        Selected Stage 0{selectedStage.step}
                      </span>
                      <strong style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-primary)' }}>
                        {selectedStage.name}
                      </strong>
                    </div>
                    <span style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-family-mono)', color: 'var(--color-accent-light)' }}>
                      Step {selectedStage.step} of 11
                    </span>
                  </div>

                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)', fontWeight: 'var(--font-weight-medium)' }}>
                    {selectedStage.summary}
                  </p>

                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
                    {selectedStage.technicalDetail}
                  </p>
                </div>
              )}
            </div>

            {/* ==============================================================
                5. TECHNICAL FIGURE / DIAGRAM CONTAINER PLACEHOLDER
                ============================================================== */}
            <div className="figure-placeholder-box">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-family-mono)', color: 'var(--color-accent-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Technical Visualizations &amp; Signal Waveforms
                </span>
                <span className="badge-tag" style={{ fontSize: '0.65rem' }}>
                  Architecture Ready
                </span>
              </div>
              <h5 style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                Tri-Axial Kinematic Signals &amp; Latent Feature Attribution Diagrams
              </h5>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', maxWidth: '650px', margin: '0 auto', lineHeight: '1.5' }}>
                Dedicated container prepared for raw acceleration/gyroscope time-series figures, stride window segmentation plots, and explainable feature attribution heatmaps as experimental master&apos;s thesis data is formalized.
              </p>
            </div>

            {/* Academic Guardrail Notice */}
            <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-4)' }}>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontStyle: 'italic', margin: 0 }}>
                {currentMasterResearch.disclaimer}
              </p>
            </div>
          </article>
        )}

        {/* ==================================================================
            6. BROADER RESEARCH INTERESTS & THEMATIC HORIZONS
            ================================================================== */}
        <div style={{ marginTop: 'var(--space-12)' }}>
          <div className="section-header" style={{ marginBottom: 'var(--space-6)' }}>
            <span className="section-status-badge">Exploratory Horizons</span>
            <h3 style={{ fontSize: 'var(--font-size-xl)' }}>
              Broader Research Interests &amp; Collaborative Areas
            </h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
              Areas of active scientific curiosity and future inquiry, clearly distinguished from the active graduate thesis.
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
                Thematic Areas of Clinical Interest
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

          {/* Explicit Scope Note */}
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontStyle: 'italic', borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-4)' }}>
            {scopeNote}
          </p>
        </div>
      </div>
    </section>
  );
}

export default Research;
