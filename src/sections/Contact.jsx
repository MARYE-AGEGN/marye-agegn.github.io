import React, { useState } from 'react';
import { siteData } from '../data/siteData';

const inquiryCategories = [
  { id: 'Research Collaboration', label: 'Research Collaboration', icon: '🔬' },
  { id: 'Professional service', label: 'Biomedical Engineering Services', icon: '⚙️' },
  { id: 'Biomedical engineering consultation', label: 'Medical Technology Consultation', icon: '🩺' },
  { id: 'Product development', label: 'Medical Product Development', icon: '💡' },
  { id: 'Healthcare digitalization', label: 'Healthcare Digitalization', icon: '📊' },
  { id: 'BHN collaboration', label: 'BHN Collaboration', icon: '🌐' },
  { id: 'BHN membership', label: 'BHN Membership', icon: '✨' },
  { id: 'Professional development', label: 'Professional Development', icon: '🎓' },
  { id: 'General inquiry', label: 'General Inquiry', icon: '✉️' },
];

export function Contact({ onOpenCollaboration }) {
  const contactData = siteData.contact || {};
  const { title = 'Contact & Collaboration Desk', subtitle = 'Direct Inquiries • Research Partnerships • Technical Consultations', channels = {}, privacyNotice } = contactData;

  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (key, text) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2200);
      });
    }
  };

  const handleCategorySelect = (categoryId) => {
    if (typeof onOpenCollaboration === 'function') {
      onOpenCollaboration(categoryId);
    }
  };

  return (
    <section id="contact" className="section-wrapper contact-section" aria-labelledby="contact-title">
      <div className="container">
        {/* ==================================================================
            1. SECTION HEADER
            ================================================================== */}
        <header className="section-header">
          <span className="section-status-badge">Direct Communication Desk</span>
          <h2 id="contact-title" className="section-title">{title}</h2>
          {subtitle && (
            <p style={{ color: 'var(--color-accent-light)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', margin: 0 }}>
              {subtitle}
            </p>
          )}
        </header>

        {/* Lead Narrative */}
        <div style={{ maxWidth: '820px', marginBottom: 'var(--space-8)' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)', lineHeight: '1.75', margin: 0 }}>
            Whether you are an academic researcher interested in joint biosignal studies, a healthcare institution seeking clinical engineering consultation, or a professional looking to connect with the Biomedical Horizon Network (BHN), please select a topic below to send a direct message through the website:
          </p>
        </div>

        {/* ==================================================================
            2. INTERACTIVE COLLABORATION DESK (CATEGORY SELECTORS)
            ================================================================== */}
        <div
          className="card"
          style={{
            padding: 'var(--space-6)',
            background: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: 'var(--space-8)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 4px' }}>
              Select Inquiry Category to Send a Message
            </h3>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
              Click any area to open the direct messaging form with your context pre-selected:
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-6)',
            }}
          >
            {inquiryCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className="category-pill-btn"
                onClick={() => handleCategorySelect(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  background: 'rgba(248, 250, 252, 0.8)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  transition: 'border-color 0.2s ease, background 0.2s ease, transform 0.1s ease',
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>
                <span style={{ flex: 1 }}>{cat.label}</span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>→</span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-4)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Prefer to write a general message?
            </span>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleCategorySelect('General inquiry')}
            >
              Open Direct Contact Form ✉️
            </button>
          </div>
        </div>

        {/* ==================================================================
            3. DIRECT VERIFIED CHANNELS (SECONDARY OPTIONS)
            ================================================================== */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
            Direct Institutional &amp; Verified Channels (Secondary)
          </h3>
          <div className="contact-channels-grid" role="region" aria-label="Contact Channels">
            {Object.entries(channels).map(([key, item]) => {
              const isEmail = item.type === 'email';

              return (
                <article
                  key={key}
                  id={`contact-channel-${key}`}
                  className="contact-channel-card"
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-4) var(--space-5)',
                  }}
                  aria-labelledby={`contact-label-${key}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <span className="badge-tag" style={{ color: 'var(--color-accent-light)', fontSize: '0.65rem' }}>
                      {item.type ? item.type.toUpperCase() : 'COMMUNICATION'}
                    </span>
                    {isEmail && (
                      <button
                        type="button"
                        className={`contact-copy-btn ${copiedKey === key ? 'copied' : ''}`}
                        onClick={() => handleCopy(key, item.value)}
                        aria-label={`Copy ${item.value} to clipboard`}
                        style={{ fontSize: '0.7rem' }}
                      >
                        {copiedKey === key ? 'Copied ✓' : 'Copy Address'}
                      </button>
                    )}
                  </div>

                  <h4 id={`contact-label-${key}`} className="contact-channel-label" style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, margin: '0 0 2px' }}>
                    {item.label}
                  </h4>
                  {item.institution && (
                    <div className="contact-channel-inst" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                      {item.institution}
                    </div>
                  )}

                  <div className="contact-channel-action">
                    {item.url ? (
                      <a
                        href={item.url}
                        target={isEmail ? '_self' : '_blank'}
                        rel={isEmail ? undefined : 'noopener noreferrer'}
                        className="contact-action-link"
                        style={{ fontSize: 'var(--font-size-xs)', wordBreak: 'break-all' }}
                      >
                        <span>{item.value}</span>
                        <span aria-hidden="true">{isEmail ? '✉' : '↗'}</span>
                      </a>
                    ) : (
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                        {item.value}
                      </span>
                    )}
                  </div>

                  {item.note && (
                    <p className="contact-channel-note" style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                      {item.note}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* ==================================================================
            4. PRIVACY & COMMUNICATION NOTICE
            ================================================================== */}
        <aside
          style={{
            borderTop: '1px solid var(--color-border-subtle)',
            paddingTop: 'var(--space-4)',
          }}
          aria-label="Privacy Standards"
        >
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontStyle: 'italic', margin: 0, lineHeight: '1.5' }}>
            {privacyNotice}
          </p>
        </aside>
      </div>
    </section>
  );
}

export default Contact;
