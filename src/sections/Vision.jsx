import React from 'react';
import { siteData } from '../data/siteData';

export function Vision() {
  const { vision } = siteData;

  if (!vision) return null;

  return (
    <section id="vision" className="section vision-section" aria-labelledby="vision-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="section-badge">Long-Term Ambition</span>
          <h2 id="vision-heading" className="section-title">
            {vision.title}
          </h2>
          <p className="section-subtitle">{vision.subtitle}</p>
        </div>

        {/* Lead Statement & Trajectory Formula */}
        <div className="vision-lead-box card text-center p-8 mb-10">
          <p className="vision-lead-text">{vision.leadStatement}</p>
          <div className="trajectory-equation-pill mt-6">
            <span className="equation-label">Strategic Trajectory:</span>
            <span className="equation-formula">{vision.trajectoryFormula}</span>
          </div>
        </div>

        {/* Entrepreneurial Initiative: Biomedical Horizon Network (BHN) */}
        {vision.bhnInitiative && (
          <div className="bhn-container card p-8">
            <div className="bhn-header">
              <div className="bhn-header-flex">
                <div className="bhn-logo-wrapper">
                  <img
                    src="./assets/images/bhn-logo.jpg"
                    alt="Biomedical Horizon Network (BHN) — Enabling Impossible"
                    className="bhn-logo-img"
                    loading="lazy"
                  />
                </div>
                <div className="bhn-header-text flex-1">
                  <div className="bhn-badge-row">
                    <span className="badge badge-accent">{vision.bhnInitiative.badge}</span>
                    <span className="bhn-status-text">{vision.bhnInitiative.status}</span>
                  </div>
                  <h3 className="bhn-title mt-2">{vision.bhnInitiative.name}</h3>
                  <div className="bhn-motto-tagline">“Enabling Impossible”</div>
                  <p className="bhn-summary mt-2">{vision.bhnInitiative.summary}</p>
                </div>
              </div>
            </div>

            {/* Core Problem Callout */}
            <div className="bhn-problem-card card mt-6 p-6">
              <h4 className="bhn-subheading text-cyan">The Systemic Problem in Emerging Healthcare</h4>
              <p className="mt-2 text-muted-contrast">{vision.bhnInitiative.coreProblem}</p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="bhn-pillars-grid mt-8">
              {vision.bhnInitiative.pillars.map((pillar) => (
                <div key={pillar.number} className="bhn-pillar-card card p-6">
                  <span className="pillar-num">{pillar.number}</span>
                  <h4 className="pillar-title mt-2">{pillar.title}</h4>
                  <p className="pillar-desc mt-2">{pillar.description}</p>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="bhn-disclaimer mt-8 p-4 text-center">
              <p className="text-muted text-sm italic">{vision.bhnInitiative.disclaimer}</p>
            </div>

            <div className="bhn-cta-row text-center mt-6">
              <a href="#contact" className="btn btn-primary">
                Discuss Collaborative Opportunities in Health Tech →
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Vision;
