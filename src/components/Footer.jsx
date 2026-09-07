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
          <div className="footer-brand">
            <div className="footer-brand-name">{personal.name}</div>
            <p className="footer-brand-desc">
              {personal.headline} &bull; {personal.currentRole} at {personal.currentInstitution}.
            </p>
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
          <p>
            Academic &amp; Research Portfolio &bull; Configured for GitHub Pages &amp; Vercel deployment.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
