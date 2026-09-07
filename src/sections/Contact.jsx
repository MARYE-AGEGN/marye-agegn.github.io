import React, { useState } from 'react';
import { siteData } from '../data/siteData';

/**
 * Contact Section Component
 *
 * Provides legitimate, reliable direct contact channels for academic collaborations,
 * scientific inquiries, and professional consultations.
 *
 * Adheres strictly to design requirements:
 * - Zero fake contact forms that send nowhere
 * - 1-click clipboard copy utility for email addresses
 * - Direct external links for verified profiles (LinkedIn, ORCID, GitHub)
 * - Strict privacy: zero exposure of date of birth, phone numbers, or residential address
 */
export function Contact({ contact }) {
  const contactData = contact || siteData.contact || {};
  const { title = 'Contact', subtitle = 'Professional & Academic Inquiries', professionalNote, channels = {}, privacyNotice } = contactData;

  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (key, text) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2200);
      });
    }
  };

  return (
    <section id="contact" className="section-wrapper" aria-labelledby="contact-title">
      <div className="container">
        {/* ==================================================================
            1. SECTION HEADER
            ================================================================== */}
        <header className="section-header">
          <span className="section-status-badge">Direct Communication Channels</span>
          <h2 id="contact-title" className="section-title">{title}</h2>
          {subtitle && (
            <p style={{ color: 'var(--color-accent-light)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', margin: 0 }}>
              {subtitle}
            </p>
          )}
        </header>

        {/* Lead Narrative */}
        <div style={{ maxWidth: '820px', marginBottom: 'var(--space-8)' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)', lineHeight: '1.7', margin: 0 }}>
            {professionalNote}
          </p>
        </div>

        {/* ==================================================================
            2. DIRECT CONTACT CHANNELS (Verified Links & Actions)
            ================================================================== */}
        <div className="contact-channels-grid" role="region" aria-label="Contact Channels">
          {Object.entries(channels).map(([key, item]) => {
            const isEmail = item.type === 'email';

            return (
              <article
                key={key}
                id={`contact-channel-${key}`}
                className="contact-channel-card"
                aria-labelledby={`contact-label-${key}`}
              >
                <div>
                  <div className="contact-channel-header">
                    <span className="badge-tag" style={{ color: 'var(--color-accent-light)' }}>
                      {item.type ? item.type.toUpperCase() : 'COMMUNICATION'}
                    </span>
                    {isEmail && (
                      <button
                        type="button"
                        className={`contact-copy-btn ${copiedKey === key ? 'copied' : ''}`}
                        onClick={() => handleCopy(key, item.value)}
                        aria-label={`Copy ${item.value} to clipboard`}
                      >
                        {copiedKey === key ? 'Copied ✓' : 'Copy Address'}
                      </button>
                    )}
                  </div>

                  <h3 id={`contact-label-${key}`} className="contact-channel-label">
                    {item.label}
                  </h3>
                  {item.institution && (
                    <div className="contact-channel-inst">
                      {item.institution}
                    </div>
                  )}
                </div>

                <div>
                  <div className="contact-channel-action">
                    {item.url ? (
                      <a
                        href={item.url}
                        target={isEmail ? '_self' : '_blank'}
                        rel={isEmail ? undefined : 'noopener noreferrer'}
                        className="contact-action-link"
                      >
                        <span>{item.value}</span>
                        <span aria-hidden="true">{isEmail ? '✉' : '↗'}</span>
                      </a>
                    ) : (
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                        {item.value}
                      </span>
                    )}
                  </div>

                  {item.note && (
                    <p className="contact-channel-note">
                      {item.note}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* ==================================================================
            3. PRIVACY & COMMUNICATION NOTICE
            ================================================================== */}
        <aside
          style={{
            borderTop: '1px solid var(--color-border-subtle)',
            paddingTop: 'var(--space-4)',
            marginTop: 'var(--space-6)',
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
