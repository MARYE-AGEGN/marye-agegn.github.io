import React, { useState } from 'react';
import { siteData } from '../data/siteData';

/**
 * Services Section Component
 *
 * Highlights Marye Agegn's professional biomedical engineering, healthcare
 * technology management, and applied technical consultation capabilities.
 *
 * Implements expandable accordion cards with direct action to open the
 * unified contact/request flow with the selected service pre-populated.
 */
export function Services({ onSelectService }) {
  const services = siteData.services || [];
  const [expandedId, setExpandedId] = useState(null);

  const toggleAccordion = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleDiscuss = (serviceTitle) => {
    if (typeof onSelectService === 'function') {
      onSelectService(serviceTitle);
    } else {
      // Fallback scroll to contact if modal handler not passed
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="services" className="section-wrapper services-section" aria-labelledby="services-title">
      <div className="container">
        {/* ==================================================================
            1. SECTION HEADER
            ================================================================== */}
        <header className="section-header">
          <span className="section-status-badge">Professional Capabilities</span>
          <h2 id="services-title" className="section-title">
            Technical &amp; Biomedical Services
          </h2>
          <p style={{ color: 'var(--color-accent-light)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', margin: 0 }}>
            Biomedical Engineering Consultation • Healthcare Technology Management • Applied Systems Support
          </p>
        </header>

        {/* Framing narrative */}
        <div style={{ maxWidth: '840px', marginBottom: 'var(--space-8)' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)', lineHeight: '1.75', margin: 0 }}>
            Drawing upon frontline clinical engineering practice, medical device technical operations, and graduate computational engineering, I provide independent technical support, engineering consultation, and collaborative development across the following core healthcare technology domains:
          </p>
        </div>

        {/* ==================================================================
            2. SERVICES ACCORDION GRID
            ================================================================== */}
        <div className="services-accordion-list" role="region" aria-label="Biomedical Engineering Services">
          {services.map((service, index) => {
            const isExpanded = expandedId === service.id;
            const number = String(index + 1).padStart(2, '0');

            return (
              <article
                key={service.id}
                id={`service-${service.id}`}
                className={`service-card card ${isExpanded ? 'expanded' : ''}`}
                style={{
                  border: isExpanded ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-4)',
                  background: '#ffffff',
                  boxShadow: isExpanded ? '0 4px 12px rgba(2, 132, 199, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.04)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  overflow: 'hidden',
                }}
              >
                {/* Accordion Header / Trigger */}
                <button
                  type="button"
                  className="service-accordion-header"
                  onClick={() => toggleAccordion(service.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`service-content-${service.id}`}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-5) var(--space-6)',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    gap: 'var(--space-4)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flex: 1 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-family-mono)',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 700,
                        color: isExpanded ? 'var(--color-primary)' : 'var(--color-accent-light)',
                        minWidth: '24px',
                      }}
                    >
                      {number}
                    </span>
                    <div>
                      <span
                        className="badge"
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: 'rgba(2, 132, 199, 0.08)',
                          color: 'var(--color-primary)',
                          fontWeight: 600,
                          marginBottom: '4px',
                          display: 'inline-block',
                        }}
                      >
                        {service.category}
                      </span>
                      <h3
                        style={{
                          fontSize: 'var(--font-size-md)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: 'var(--color-text-primary)',
                          margin: 0,
                          lineHeight: 1.35,
                        }}
                      >
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isExpanded ? 'var(--color-primary)' : 'var(--color-surface)',
                        color: isExpanded ? '#ffffff' : 'var(--color-text-muted)',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        transition: 'transform 0.2s ease, background 0.2s ease',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                      aria-hidden="true"
                    >
                      ▼
                    </span>
                  </div>
                </button>

                {/* Brief description always visible */}
                <div style={{ padding: '0 var(--space-6) var(--space-4) calc(var(--space-6) + 38px)' }}>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {service.brief}
                  </p>
                </div>

                {/* Expanded Scope & Discuss Action */}
                {isExpanded && (
                  <div
                    id={`service-content-${service.id}`}
                    style={{
                      borderTop: '1px solid var(--color-border-subtle)',
                      padding: 'var(--space-5) var(--space-6)',
                      background: 'rgba(248, 250, 252, 0.7)',
                    }}
                  >
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                      <strong
                        style={{
                          display: 'block',
                          fontSize: 'var(--font-size-xs)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: 'var(--color-text-muted)',
                          marginBottom: 'var(--space-2)',
                        }}
                      >
                        Technical Scope &amp; Support Areas:
                      </strong>
                      <ul
                        style={{
                          listStyleType: 'disc',
                          paddingLeft: '1.25rem',
                          margin: 0,
                          color: 'var(--color-text-secondary)',
                          fontSize: 'var(--font-size-sm)',
                          lineHeight: '1.7',
                        }}
                      >
                        {service.scope.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: '3px' }}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px dashed var(--color-border)' }}>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                        Independent technical guidance &amp; consultation
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => handleDiscuss(service.title)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontWeight: 600,
                        }}
                      >
                        <span>Discuss this Service</span>
                        <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Advisory Context Notice */}
        <aside
          style={{
            marginTop: 'var(--space-6)',
            padding: 'var(--space-4) var(--space-5)',
            borderLeft: '3px solid var(--color-primary)',
            background: 'rgba(2, 132, 199, 0.04)',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
          }}
          aria-label="Professional Service Scope Disclaimer"
        >
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6 }}>
            <strong>Advisory Scope Notice:</strong> Services are offered as technical engineering consultation, clinical specification drafting, equipment evaluation, and applied biomedical research collaboration. Services do not constitute legal regulatory representation, commercial warranty issuance, or formal statutory inspection authority.
          </p>
        </aside>
      </div>
    </section>
  );
}

export default Services;
