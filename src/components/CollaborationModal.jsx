import React, { useState, useEffect } from 'react';
import { submitCollaborationRequest } from '../data/contentStore';

const collaborationTypes = [
  {
    value: 'Research & Academic Collaboration',
    description: 'Joint research projects, co-authored publications, or academic knowledge exchange.',
  },
  {
    value: 'Medical Device / Industry R&D',
    description: 'Commercial partnerships, technology transfer, product development, or hardware-software integration.',
  },
  {
    value: 'Hospital Technology Consulting',
    description: 'Clinical engineering advisory, equipment lifecycle strategy, or healthcare technology optimization.',
  },
  {
    value: 'Healthcare Technology Management',
    description: 'Asset management frameworks, maintenance protocols, or technology adoption strategies.',
  },
  {
    value: 'Joint Scientific Publication',
    description: 'Co-authorship opportunities, conference proceedings, or journal article contributions.',
  },
  {
    value: 'Entrepreneurship & Health Tech Innovation',
    description: 'Accessible technology commercialization, innovation incubation, or funding partnerships.',
  },
  {
    value: 'General Professional Inquiry',
    description: 'Conference speaking invitations, advisory discussion, or scholarly correspondence.',
  },
];

const areasOfInterest = [
  'Building Scalable Medical Devices',
  'Digital Health & Telemetry Solutions',
  'AI in Healthcare & Computer Vision',
  'Biosignal Processing (ECG/EMG/EEG)',
  'Generative AI & Rehabilitation Engineering',
  'Neuroimaging & Neuromodulation (rTMS)',
  'Healthcare Technology Management (HTM)',
  'Biomedical Horizon Network (BHN) Initiative',
];

const urgencyLevels = [
  { value: 'exploratory', label: 'Exploratory (Information Gathering)' },
  { value: 'short-term', label: 'Short-Term (1–3 months)' },
  { value: 'medium-term', label: 'Medium-Term (3–6 months)' },
  { value: 'long-term', label: 'Long-Term (6+ months)' },
];

export function CollaborationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    title: '',
    phone: '',
    area_of_interest: 'Building Scalable Medical Devices',
    collaboration_type: 'Research & Academic Collaboration',
    urgency_level: 'short-term',
    website: '',
    linkedin_or_orcid: '',
    message: '',
    proposal_file: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [dragOver, setDragOver] = useState(false);

  // Keyboard accessibility and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFile = (file) => {
    if (!file) return;
    setFormData((prev) => ({ ...prev, proposal_file: file }));
    setFileName(file.name);
    if (file.size < 1024 * 1024) {
      setFileSize(`${(file.size / 1024).toFixed(1)} KB`);
    } else {
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, proposal_file: null }));
    setFileName('');
    setFileSize('');
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    let attachmentData = null;
    if (formData.proposal_file) {
      attachmentData = {
        name: formData.proposal_file.name,
        size: formData.proposal_file.size,
        type: formData.proposal_file.type,
        data: await formData.proposal_file.text().catch(() => null),
      };
    }

    await submitCollaborationRequest({ ...formData, proposal_file: attachmentData });
    setSubmitting(false);
    setSubmitted(true);
  }

  function handleResetAndClose() {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      organization: '',
      title: '',
      phone: '',
      area_of_interest: 'Building Scalable Medical Devices',
      collaboration_type: 'Research & Academic Collaboration',
      urgency_level: 'short-term',
      website: '',
      linkedin_or_orcid: '',
      message: '',
      proposal_file: null,
    });
    setFileName('');
    setFileSize('');
    onClose();
  }

  const selectedType = collaborationTypes.find((t) => t.value === formData.collaboration_type);

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="collab-modal-title"
    >
      <div
        className="modal-dialog collab-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', width: '95%' }}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ borderBottom: '1px solid var(--color-border)', padding: 'var(--space-6)' }}>
          <div>
            <span className="section-status-badge" style={{ marginBottom: 'var(--space-2)' }}>
              Partnership &amp; Research Inquiries
            </span>
            <h3 id="collab-modal-title" className="modal-title" style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text)', margin: '4px 0 6px 0' }}>
              Initiate a Collaboration Proposal
            </h3>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.45' }}>
              Direct inquiry channel for academic researchers, clinicians, biomedical engineers, and institutional collaborators.
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            style={{ marginTop: '-4px' }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        {submitted ? (
          <div style={{ padding: 'var(--space-8) var(--space-6)', textAlign: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-success-bg)',
                color: 'var(--color-success)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: 'var(--space-4)',
                border: '1px solid var(--color-success-border)',
              }}
            >
              ✓
            </div>
            <h4 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
              Collaboration Proposal Received
            </h4>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto var(--space-4) auto', lineHeight: '1.6' }}>
              Thank you, <strong>{formData.name || 'Collaborator'}</strong>. Your inquiry regarding <em>{formData.area_of_interest}</em> has been securely recorded. Marye Agegn will review your details and respond via <strong>{formData.email || 'your email'}</strong>.
            </p>
            {fileName && (
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)', marginBottom: 'var(--space-6)' }}>
                Attached proposal file: <strong>{fileName}</strong> ({fileSize})
              </p>
            )}
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleResetAndClose}
              style={{ minWidth: '180px' }}
            >
              Return to Portfolio
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="modal-body" style={{ padding: 'var(--space-6)', maxHeight: 'calc(80vh - 150px)', overflowY: 'auto' }}>
              {/* Fieldset 1: Contact Information */}
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <h4 style={{ fontSize: 'var(--font-size-sm)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 'var(--space-3)', paddingBottom: '4px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                  1. Contact Information
                </h4>

                <div className="form-grid-2" style={{ marginBottom: 'var(--space-3)' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="collab-name">
                      Full Name <span style={{ color: 'var(--color-error)' }}>*</span>
                    </label>
                    <input
                      id="collab-name"
                      type="text"
                      required
                      placeholder="e.g., Dr. Eleanor Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="collab-email">
                      Professional Email <span style={{ color: 'var(--color-error)' }}>*</span>
                    </label>
                    <input
                      id="collab-email"
                      type="email"
                      required
                      placeholder="e.g., e.vance@university.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2" style={{ marginBottom: 'var(--space-3)' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="collab-org">
                      Institution / Organization <span style={{ color: 'var(--color-error)' }}>*</span>
                    </label>
                    <input
                      id="collab-org"
                      type="text"
                      required
                      placeholder="e.g., Dept of Bioengineering, Hospital, Lab"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="collab-title">Professional Role / Title</label>
                    <input
                      id="collab-title"
                      type="text"
                      placeholder="e.g., Principal Investigator, Postdoc, Clinical Director"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="collab-website">Website or Lab Link (Optional)</label>
                    <input
                      id="collab-website"
                      type="url"
                      placeholder="https://lab.university.edu"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="collab-linkedin">LinkedIn or ORCID Profile (Optional)</label>
                    <input
                      id="collab-linkedin"
                      type="text"
                      placeholder="e.g., linkedin.com/in/... or 0000-0000-..."
                      value={formData.linkedin_or_orcid}
                      onChange={(e) => setFormData({ ...formData, linkedin_or_orcid: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Fieldset 2: Collaboration Details */}
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <h4 style={{ fontSize: 'var(--font-size-sm)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 'var(--space-3)', paddingBottom: '4px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                  2. Collaboration Scope
                </h4>

                <div className="form-grid-2" style={{ marginBottom: 'var(--space-3)' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="collab-type">
                      Collaboration Format <span style={{ color: 'var(--color-error)' }}>*</span>
                    </label>
                    <select
                      id="collab-type"
                      required
                      value={formData.collaboration_type}
                      onChange={(e) => setFormData({ ...formData, collaboration_type: e.target.value })}
                    >
                      {collaborationTypes.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.value}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="collab-area">
                      Primary Area of Interest <span style={{ color: 'var(--color-error)' }}>*</span>
                    </label>
                    <select
                      id="collab-area"
                      required
                      value={formData.area_of_interest}
                      onChange={(e) => setFormData({ ...formData, area_of_interest: e.target.value })}
                    >
                      {areasOfInterest.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedType && (
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)', fontStyle: 'italic' }}>
                    {selectedType.description}
                  </p>
                )}

                <div className="form-group" style={{ marginBottom: 'var(--space-3)' }}>
                  <label htmlFor="collab-urgency">Estimated Timeline</label>
                  <select
                    id="collab-urgency"
                    value={formData.urgency_level}
                    onChange={(e) => setFormData({ ...formData, urgency_level: e.target.value })}
                  >
                    {urgencyLevels.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="collab-message">
                    Proposal Summary &amp; Objectives <span style={{ color: 'var(--color-error)' }}>*</span>
                  </label>
                  <textarea
                    id="collab-message"
                    rows={4}
                    required
                    placeholder="Briefly describe the research question, clinical problem, or mutual technical opportunity. Outline anticipated objectives, prospective timelines, or resource considerations..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
              </div>

              {/* Fieldset 3: Optional Proposal Document Upload */}
              <div>
                <h4 style={{ fontSize: 'var(--font-size-sm)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 'var(--space-3)', paddingBottom: '4px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                  3. Proposal Document (Optional)
                </h4>

                {!fileName ? (
                  <div
                    className={`file-upload-dropzone ${dragOver ? 'dragover' : ''}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('collab-file-input')?.click()}
                  >
                    <input
                      id="collab-file-input"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileInputChange}
                      style={{ display: 'none' }}
                    />
                    <div className="file-upload-icon">📄</div>
                    <div className="file-upload-title">
                      Click to browse or drag &amp; drop document
                    </div>
                    <div className="file-upload-hint">
                      Supported formats: PDF, DOCX, TXT (Maximum file size: 5 MB)
                    </div>
                  </div>
                ) : (
                  <div className="file-preview-chip">
                    <div className="file-preview-name">
                      <span>📄</span>
                      <div>
                        <strong>{fileName}</strong>
                        <span style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          {fileSize}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-outline-danger btn-xs"
                      onClick={handleRemoveFile}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="modal-footer"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-4) var(--space-6)',
                borderTop: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface-subtle)',
                gap: 'var(--space-3)',
              }}
            >
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                🔒 Secure correspondence. Handled confidentially.
              </span>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting Proposal...' : 'Send Proposal →'}
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
