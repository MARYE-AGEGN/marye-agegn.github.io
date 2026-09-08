import React from 'react';

export function Footer({ personal, contact }) {
  const currentYear = new Date().getFullYear();
  const channels = contact?.channels || {};

  const handleBackToTop = (e) => {
    e.preventDefault();
    const homeElement = document.getElementById('home');
    if (homeElement) {
      homeElement.scrollIntoView({ behavior: 'smooth' });
      if (window.history.pushState) {
        window.history.pushState(null, '', '#home');
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-inner">
          {/* Brand & Identity */}
          <div className="footer-brand flex items-start gap-4">
            <img
              src="./assets/images/marye-agegn-brand-banner.jpg"
              alt="Marye Agegn Gebrie"
              className="footer-brand-emblem"
              style={{
                width: '64px',
                height: '64px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-xs)',
                flexShrink: 0,
              }}
            />
            <div>
              <div className="footer-brand-name">{personal.name}</div>
              <p className="footer-brand-desc">
                {personal.headline} &bull; {personal.currentRole} at {personal.currentInstitution}.
              </p>
            </div>
          </div>

          {/* Approved Professional Links */}
          <ul className="footer-links" aria-label="Professional and academic profile links">
            {channels.linkedin?.isConfigured && channels.linkedin.url && (
              <li className="footer-link-item">
                <a
                  href={channels.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile (opens in new tab)"
                >
                  LinkedIn &rarr;
                </a>
              </li>
            )}
            {channels.orcid?.isConfigured && channels.orcid.url && (
              <li className="footer-link-item">
                <a
                  href={channels.orcid.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ORCID Record (opens in new tab)"
                >
                  ORCID &rarr;
                </a>
              </li>
            )}
            {channels.github?.isConfigured && channels.github.url && (
              <li className="footer-link-item">
                <a
                  href={channels.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Repository (opens in new tab)"
                >
                  GitHub &rarr;
                </a>
              </li>
            )}
            {channels.studentEmail?.isConfigured && channels.studentEmail.url && (
              <li className="footer-link-item">
                <a
                  href={channels.studentEmail.url}
                  aria-label="Send email to institutional address"
                >
                  Email &rarr;
                </a>
              </li>
            )}
            <li className="footer-link-item">
              <a href="#home" onClick={handleBackToTop} aria-label="Return to top of page">
                Back to Top &uarr;
              </a>
            </li>
          </ul>
        </div>

        {/* Legal & Hosting Baseline */}
        <div className="footer-bottom">
          <p>
            &copy; {currentYear} {personal.name}. All rights reserved.
          </p>
          <div className="footer-meta-links flex items-center gap-3 text-xs">
            <a
              href="#admin"
              className="badge"
              style={{
                textDecoration: 'none',
                background: 'var(--color-primary-light, #e0f2fe)',
                color: 'var(--color-primary, #0284c7)',
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(2, 132, 199, 0.3)',
              }}
            >
              🔒 Admin Sign In
            </a>
            <span>•</span>
            <span>Dynamic Healthcare Platform</span>
            <span>•</span>
            <span>Hosted via GitHub Pages</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
