import React, { useState, useEffect, useRef } from 'react';

export function Navbar({ navigation, personal, onOpenSearch, onOpenCollaboration, currentRoute = '' }) {
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleBtnRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const isMainPage = !currentRoute || currentRoute === 'home';

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    if (!isMainPage) return;

    const sectionIds = navigation.map((item) => item.id);
    const observedElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (observedElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort((a, b) => {
            return Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top);
          });
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: '-15% 0px -65% 0px',
        threshold: [0, 0.25, 0.5, 0.75],
      }
    );

    observedElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [navigation, isMainPage]);

  // Handle body scroll locking when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Handle keyboard events (Escape key to close mobile menu)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        if (toggleBtnRef.current) {
          toggleBtnRef.current.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const handleNavClick = (e, targetId) => {
    setIsMobileMenuOpen(false);

    if (!isMainPage) {
      // If we are on /admin or another route, navigate back to main with hash
      window.location.hash = `#${targetId}`;
      return;
    }

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({ behavior: 'smooth' });
      if (window.history.pushState) {
        window.history.pushState(null, '', `#${targetId}`);
      }
      targetElement.setAttribute('tabindex', '-1');
      targetElement.focus({ preventScroll: true });
    }
  };

  return (
    <header className="site-header">
      <div className="container nav-container">
        {/* Brand Anchor */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, 'home')}
          className="brand-link"
          aria-label={`${personal.name} - Return to top of page`}
        >
          <span className="brand-name">{personal.name}</span>
          <span className="brand-title">Biomedical Engineer &amp; Researcher</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="nav-desktop" aria-label="Main Desktop Navigation">
          {navigation.map((item) => {
            const isActive = isMainPage && activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`nav-item-link ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Action Controls: Search & Collaboration Modal */}
        <div className="nav-actions-desktop flex items-center gap-3">
          <button
            type="button"
            className="nav-search-btn"
            onClick={onOpenSearch}
            title="Global Search (Ctrl+K)"
            aria-label="Open search dialog"
          >
            <span>🔍</span>
            <span className="search-hotkey">Ctrl K</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-xs nav-collab-btn"
            onClick={onOpenCollaboration}
          >
            Collaborate 🤝
          </button>
        </div>

        {/* Mobile Navigation Toggle Button */}
        <button
          ref={toggleBtnRef}
          type="button"
          className="mobile-nav-toggle"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          ref={mobileMenuRef}
          className="mobile-menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          <div className="mobile-drawer-top flex justify-between items-center p-4 border-b border-slate">
            <button
              type="button"
              className="btn btn-secondary btn-sm w-full flex items-center justify-center gap-2"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenSearch();
              }}
            >
              <span>🔍 Search Everything (Ctrl+K)</span>
            </button>
          </div>

          <ul className="mobile-nav-list">
            {navigation.map((item) => {
              const isActive = isMainPage && activeSection === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`mobile-nav-item-link ${isActive ? 'active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span
                        style={{
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--color-accent-light)',
                          fontFamily: 'var(--font-family-mono)',
                        }}
                      >
                        Current
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="mobile-drawer-footer p-4 border-t border-slate space-y-3">
            <button
              type="button"
              className="btn btn-primary btn-sm w-full"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenCollaboration();
              }}
            >
              Initiate Collaboration Proposal 🤝
            </button>

            <div className="flex justify-between items-center text-xs text-muted pt-2">
              <span>{personal.name}</span>
              <a
                href="#admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-cyan underline"
              >
                Admin CMS ⚙️
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

