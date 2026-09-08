import React from 'react';

export function Home({ home, personal }) {
  // Graceful fallback to personal data if home data is loading
  const heroData = home?.hero || {
    name: personal?.name || 'Marye Agegn',
    headline: personal?.headline || 'Biomedical Engineer & Graduate Researcher',
    statusBadge: `${personal?.currentRole || 'Graduate Researcher'} • ${personal?.currentInstitution || 'Anna University'}`,
    positioning: personal?.summary || '',
    actions: [
      { label: "Explore Master's Research →", href: '#research', isPrimary: true },
      { label: 'Clinical Engineering Practice', href: '#experience', isPrimary: false },
      { label: 'Get in Touch', href: '#contact', isPrimary: false },
    ],
  };

  const pillars = home?.pillars || [];
  const spotlight = home?.spotlight;
  const trajectory = home?.trajectory || [];

  const handleSmoothScroll = (e, href) => {
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        if (window.history.pushState) {
          window.history.pushState(null, '', href);
        }
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    }
  };

  return (
    <section id="home" className="section-wrapper hero-wrapper" aria-labelledby="hero-title">
      <div className="container">
        {/* ==================================================================
            1. HERO / EXECUTIVE POSITIONING
            ================================================================== */}
        <header className="hero-header">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-status-pill">
                <span className="hero-status-dot" aria-hidden="true" />
                <span>{heroData.statusBadge}</span>
              </div>

              <h1 id="hero-title" className="hero-name">
                {heroData.name}
              </h1>

              <p className="hero-headline">
                {heroData.headline}
              </p>

              <p className="hero-positioning">
                {heroData.positioning}
              </p>

              <div className="hero-actions" role="group" aria-label="Primary actions">
                {heroData.actions.map((action, idx) => {
                  const isContactAction = action.href === '#contact';
                  return (
                    <a
                      key={idx}
                      href={action.href}
                      onClick={(e) => {
                        if (isContactAction && typeof onOpenContact === 'function') {
                          e.preventDefault();
                          onOpenContact();
                        } else {
                          handleSmoothScroll(e, action.href);
                        }
                      }}
                      className={`btn ${action.isPrimary ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {action.label}
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="hero-portrait-col">
              <div className="hero-portrait-frame">
                <img
                  src="./assets/images/marye-agegn-profile.jpg"
                  alt="Marye Agegn — Biomedical Engineer & Graduate Researcher"
                  className="hero-portrait-img"
                  loading="eager"
                />
                <div className="hero-portrait-badge">
                  <span className="hero-badge-icon" aria-hidden="true">🎓</span>
                  <div>
                    <div className="hero-badge-title">Marye Agegn</div>
                    <div className="hero-badge-sub">M.Eng. Biomedical Engineering • Anna University</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ==================================================================
            2. THREE CORE PILLARS: PRACTICE, DEVICE DESIGN, RESEARCH
            ================================================================== */}
        {pillars.length > 0 && (
          <div className="pillars-section" aria-labelledby="pillars-title">
            <div className="section-header" style={{ marginBottom: 'var(--space-6)' }}>
              <span className="section-status-badge">Core Domains</span>
              <h2 id="pillars-title" style={{ fontSize: 'var(--font-size-xl)' }}>
                Professional &amp; Technical Foundation
              </h2>
            </div>

            <div className="pillars-grid">
              {pillars.map((pillar) => (
                <article key={pillar.number} className="pillar-card">
                  <span className="pillar-number">{pillar.number}</span>
                  <h3 className="pillar-title">{pillar.title}</h3>
                  <div className="pillar-tagline">{pillar.tagline}</div>
                  <p className="pillar-desc">{pillar.description}</p>
                  <a
                    href={pillar.link.href}
                    onClick={(e) => handleSmoothScroll(e, pillar.link.href)}
                    className="pillar-link"
                  >
                    {pillar.link.label}
                  </a>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            3. CURRENT MASTER'S RESEARCH SPOTLIGHT (FLAGSHIP ANCHOR)
            ================================================================== */}
        {spotlight && (
          <div className="spotlight-section" aria-labelledby="spotlight-title">
            <div className="section-header" style={{ marginBottom: 'var(--space-6)' }}>
              <span className="section-status-badge">Graduate Research</span>
              <h2 id="spotlight-title" style={{ fontSize: 'var(--font-size-xl)' }}>
                Graduate Academic Focus
              </h2>
            </div>

            <article className="spotlight-card">
              <div className="spotlight-header">
                <span className="badge-tag" style={{ color: 'var(--color-accent-light)' }}>
                  {spotlight.badge}
                </span>
                <span className="status-pill status-pill-progress">
                  {spotlight.status}
                </span>
              </div>

              <h3 className="spotlight-title">
                {spotlight.title}
              </h3>

              <p className="spotlight-summary">
                {spotlight.summary}
              </p>

              {spotlight.focusAreas ? (
                <div className="spotlight-specs" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="spotlight-spec-item">
                    <span className="spotlight-spec-label">Core Research Domains</span>
                    <span className="spotlight-spec-val">{spotlight.focusAreas}</span>
                  </div>
                </div>
              ) : spotlight.sensorModality ? (
                <div className="spotlight-specs">
                  <div className="spotlight-spec-item">
                    <span className="spotlight-spec-label">Sensor Modality</span>
                    <span className="spotlight-spec-val">{spotlight.sensorModality}</span>
                  </div>
                  <div className="spotlight-spec-item">
                    <span className="spotlight-spec-label">Evaluation Protocol</span>
                    <span className="spotlight-spec-val">{spotlight.protocol || spotlight.evaluationProtocol}</span>
                  </div>
                </div>
              ) : null}

              <footer className="spotlight-footer">
                <p className="spotlight-disclaimer">
                  {spotlight.disclaimer}
                </p>
                <a
                  href={spotlight.link.href}
                  onClick={(e) => handleSmoothScroll(e, spotlight.link.href)}
                  className="btn btn-secondary"
                  style={{ fontSize: 'var(--font-size-xs)', whiteSpace: 'nowrap' }}
                >
                  {spotlight.link.label}
                </a>
              </footer>
            </article>
          </div>
        )}

        {/* ==================================================================
            4. PROFESSIONAL TRAJECTORY OVERVIEW
            ================================================================== */}
        {trajectory.length > 0 && (
          <div className="trajectory-section" aria-labelledby="trajectory-title">
            <div className="section-header" style={{ marginBottom: 'var(--space-6)' }}>
              <span className="section-status-badge">Academic &amp; Clinical Evolution</span>
              <h2 id="trajectory-title" style={{ fontSize: 'var(--font-size-xl)' }}>
                Trajectory at a Glance
              </h2>
            </div>

            <div className="trajectory-roadmap-grid">
              {trajectory.map((node) => (
                <div key={node.phase} className="trajectory-node">
                  <span className="trajectory-phase">{node.phase}</span>
                  <div className="trajectory-node-title">{node.title}</div>
                  <div className="trajectory-institution">{node.institution}</div>
                  <p className="trajectory-highlight">{node.highlight}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Home;
