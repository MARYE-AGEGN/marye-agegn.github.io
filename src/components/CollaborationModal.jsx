import React, { useState } from 'react';
import { submitCollaborationRequest } from '../data/contentStore';

export function CollaborationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    area_of_interest: 'Wearable Sensing & Gait Analysis',
    collaboration_type: 'Research & Academic Collaboration',
    website: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const areas = [
    'Wearable Sensing & Gait Analysis',
    'Explainable AI & Biomedical Signals',
    'Clinical Engineering & Hospital Operations',
    'Medical Device Design & Accessible Hardware',
    'Healthcare Technology Management (HTM)',
    'Biomedical Horizon Network (BHN) Initiative',
  ];

  const types = [
    'Research & Academic Collaboration',
    'Medical Device / Industry R&D',
    'Hospital Technology Consulting',
    'Joint Scientific Publication',
    'Entrepreneurship & Health Tech Innovation',
    'General Professional Partnership',
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await submitCollaborationRequest(formData);
    setSubmitting(false);
    setSubmitted(true);
  }

  function handleReset() {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      organization: '',
      area_of_interest: 'Wearable Sensing & Gait Analysis',
      collaboration_type: 'Research & Academic Collaboration',
      website: '',
      message: '',
    });
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog collab-dialog card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="section-badge">Partnership &amp; Research Inquiries</span>
            <h3 className="modal-title">Initiate a Collaboration Proposal</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="collab-success-body p-8 text-center">
            <div className="success-icon-badge">✓</div>
            <h4 className="mt-4 text-xl font-semibold">Collaboration Proposal Received</h4>
            <p className="mt-2 text-muted">
              Thank you, <strong>{formData.name}</strong>. Your proposal regarding <em>{formData.area_of_interest}</em> has been securely recorded. Marye Agegn will review your submission and respond promptly via <strong>{formData.email}</strong>.
            </p>
            <button type="button" className="btn btn-primary mt-6" onClick={handleReset}>
              Close &amp; Return to Platform
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="collab-form p-6">
            <p className="form-intro-note text-sm text-muted mb-4">
              Designed for university researchers, clinicians, biomedical engineers, medical device manufacturers, and health technology entrepreneurs seeking evidence-based partnership.
            </p>

            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="collab-name">Your Full Name *</label>
                <input
                  id="collab-name"
                  type="text"
                  required
                  placeholder="e.g., Dr. Eleanor Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="collab-email">Professional Email *</label>
                <input
                  id="collab-email"
                  type="email"
                  required
                  placeholder="e.g., name@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="collab-org">Institution / Organization *</label>
                <input
                  id="collab-org"
                  type="text"
                  required
                  placeholder="e.g., Research Lab, Hospital, or Tech Company"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="collab-website">Website / Portfolio (Optional)</label>
                <input
                  id="collab-website"
                  type="url"
                  placeholder="https://..."
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="collab-area">Primary Area of Interest</label>
                <select
                  id="collab-area"
                  value={formData.area_of_interest}
                  onChange={(e) => setFormData({ ...formData, area_of_interest: e.target.value })}
                >
                  {areas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="collab-type">Type of Collaboration</label>
                <select
                  id="collab-type"
                  value={formData.collaboration_type}
                  onChange={(e) => setFormData({ ...formData, collaboration_type: e.target.value })}
                >
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="collab-message">Proposal Summary &amp; Scope *</label>
              <textarea
                id="collab-message"
                rows="4"
                required
                placeholder="Briefly describe the research problem, clinical opportunity, or collaborative goal..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <div className="form-actions-row flex items-center justify-between mt-6">
              <span className="privacy-hint text-xs text-muted">
                🔒 Data is transmitted securely and never shared with third parties.
              </span>
              <div className="btn-group">
                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Send Proposal →'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CollaborationModal;
