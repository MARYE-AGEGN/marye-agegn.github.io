import React, { useState, useEffect } from 'react';
import { submitInquiry, submitBhnApplication } from '../data/contentStore';
import { siteData } from '../data/siteData';

const requestTypeOptions = [
  'Professional service',
  'Academic research collaboration',
  'Biomedical engineering consultation',
  'Medical technology project',
  'Product development',
  'Healthcare digitalization',
  'BHN collaboration',
  'BHN membership',
  'Professional development',
  'General inquiry',
];

const bhnInterestAreas = [
  'Biomedical Engineering Practice',
  'Healthcare Technology Management (HTM)',
  'Academic Research Collaboration',
  'Medical Device Innovation',
  'Digital Health & Telemetry',
  'Biosignal Processing & Healthcare AI',
  'Clinical Engineering Training',
  'Regulatory Standards & Compliance',
];

export function CollaborationModal({
  isOpen,
  onClose,
  initialRequestType = null,
  initialService = null,
  initialProject = null,
}) {
  const [requestType, setRequestType] = useState('Professional service');
  const [selectedService, setSelectedService] = useState('');
  const [projectTitle, setProjectTitle] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    country: '',
    subject: '',
    message: '',
    // BHN specific fields
    background: '',
    areas_of_interest: [],
    statement_of_interest: '',
    profile_url: '',
    attachment_file: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [dragOver, setDragOver] = useState(false);

  // Sync props when modal opens
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setSubmitError(null);
      if (initialService) {
        setRequestType('Professional service');
        setSelectedService(initialService);
        setFormData((prev) => ({
          ...prev,
          subject: `Service Request: ${initialService}`,
          message: `I am interested in discussing your technical capabilities in "${initialService}".`,
        }));
      } else if (initialRequestType === 'BHN membership' || initialRequestType === 'bhn') {
        setRequestType('BHN membership');
        setFormData((prev) => ({
          ...prev,
          subject: 'BHN Membership Application',
          message: 'I would like to apply to join the Biomedical Horizon Network (BHN).',
        }));
      } else if (initialProject) {
        setRequestType('Academic research collaboration');
        setProjectTitle(initialProject);
        setFormData((prev) => ({
          ...prev,
          subject: `Research Collaboration: ${initialProject}`,
          message: `I am interested in discussing research collaboration regarding "${initialProject}".`,
        }));
      } else if (initialRequestType) {
        setRequestType(initialRequestType);
      }
    }
  }, [isOpen, initialService, initialProject, initialRequestType]);

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

  const isBhnMode = requestType === 'BHN membership';

  const handleFile = (file) => {
    if (!file) return;
    // 15MB size limit
    if (file.size > 15 * 1024 * 1024) {
      alert('File exceeds the 15MB size limit. Please upload a smaller file.');
      return;
    }
    setFormData((prev) => ({ ...prev, attachment_file: file }));
    setFileName(file.name);
    setFileSize(file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(1)} KB` : `${(file.size / (1024 * 1024)).toFixed(2)} MB`);
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, attachment_file: null }));
    setFileName('');
    setFileSize('');
  };

  const handleBhnAreaToggle = (area) => {
    setFormData((prev) => {
      const current = prev.areas_of_interest || [];
      const updated = current.includes(area) ? current.filter((a) => a !== area) : [...current, area];
      return { ...prev, areas_of_interest: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      if (isBhnMode) {
        const appPayload = {
          name: formData.name,
          email: formData.email,
          organization: formData.organization,
          role: formData.role,
          country: formData.country,
          background: formData.background,
          areas_of_interest: formData.areas_of_interest,
          statement_of_interest: formData.statement_of_interest || formData.message,
          profile_url: formData.profile_url,
          message: formData.message,
        };
        await submitBhnApplication(appPayload);
      } else {
        const inquiryPayload = {
          name: formData.name,
          email: formData.email,
          organization: formData.organization,
          role: formData.role,
          country: formData.country,
          request_type: requestType,
          selected_service: requestType === 'Professional service' || requestType === 'Biomedical engineering consultation' ? selectedService : null,
          subject: formData.subject || `Inquiry: ${requestType}`,
          message: formData.message,
          attachment_name: fileName || null,
          attachment_file: formData.attachment_file ? {
            name: formData.attachment_file.name,
            type: formData.attachment_file.type,
            size: formData.attachment_file.size,
            data: formData.attachment_file,
          } : null,
        };
        await submitInquiry(inquiryPayload);
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Submission failed:', err);
      setSubmitError('An error occurred while transmitting your submission. Please check your connection or contact via direct email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="collab-modal-title">
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '720px',
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-lg)',
          background: '#ffffff',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: 'var(--space-6) var(--space-6) var(--space-4)',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
          }}
        >
          <div>
            <span
              className="badge"
              style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: isBhnMode ? 'rgba(15, 118, 110, 0.1)' : 'rgba(2, 132, 199, 0.1)',
                color: isBhnMode ? 'var(--color-secondary, #0f766e)' : 'var(--color-primary, #0284c7)',
                fontWeight: 700,
                marginBottom: '6px',
                display: 'inline-block',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {isBhnMode ? 'BHN Network Application' : 'Professional Collaboration Desk'}
            </span>
            <h2 id="collab-modal-title" style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
              {isBhnMode ? 'Become a BHN Member' : 'Direct Inquiry & Collaboration'}
            </h2>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>
              {isBhnMode
                ? 'Join the developing Biomedical Horizon Network (BHN) connecting healthcare engineers and researchers.'
                : 'Direct communication desk for technical biomedical services, academic research, and healthcare technology.'}
            </p>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              lineHeight: 1,
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: 'var(--space-6)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(15, 118, 110, 0.12)',
                  color: '#0f766e',
                  fontSize: '28px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-4)',
                }}
              >
                ✓
              </div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
                {isBhnMode ? 'Application Received' : 'Message Transmitted Successfully'}
              </h3>
              <p
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.7',
                  maxWidth: '520px',
                  margin: '0 auto var(--space-6)',
                }}
              >
                Thank you. Your request has been received successfully. I will review your message and respond through the email address you provided.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)' }}>
                <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {submitError && (
                <div
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 'var(--radius-sm)',
                    color: '#991b1b',
                    fontSize: 'var(--font-size-xs)',
                  }}
                >
                  {submitError}
                </div>
              )}

              <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', color: '#64748b' }}>
                🔒 <strong>Privacy Notice:</strong> Please do not submit patient identifiers, medical records, or confidential institutional credentials. Submissions are stored securely for technical review and professional collaboration only.
              </div>

              {/* Request Type Selector */}
              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                  Nature of Request / Collaboration <span style={{ color: '#e11d48' }}>*</span>
                </label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: 'var(--font-size-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                  required
                >
                  {requestTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Service Selector if Professional Service */}
              {(requestType === 'Professional service' || requestType === 'Biomedical engineering consultation') && (
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                    Selected Biomedical Service
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', padding: '8px 12px', fontSize: 'var(--font-size-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                  >
                    <option value="">-- Select a Service (Optional) --</option>
                    {(siteData.services || []).map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Name & Email Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                    Full Name <span style={{ color: '#e11d48' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Jane Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    style={{ width: '100%', padding: '8px 12px', fontSize: 'var(--font-size-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                    Email Address <span style={{ color: '#e11d48' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. jsmith@institution.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    style={{ width: '100%', padding: '8px 12px', fontSize: 'var(--font-size-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>

              {/* Organization, Role & Country */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                    Organization / Institution
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hospital or University"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="form-input"
                    style={{ width: '100%', padding: '8px 12px', fontSize: 'var(--font-size-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                    Professional Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Clinical Engineer, Researcher"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="form-input"
                    style={{ width: '100%', padding: '8px 12px', fontSize: 'var(--font-size-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                    Country / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ethiopia, India, USA"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="form-input"
                    style={{ width: '100%', padding: '8px 12px', fontSize: 'var(--font-size-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>

              {/* BHN Specific Questions */}
              {isBhnMode && (
                <div
                  style={{
                    padding: 'var(--space-4)',
                    background: 'rgba(15, 118, 110, 0.04)',
                    border: '1px solid rgba(15, 118, 110, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-3)',
                  }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '4px' }}>
                      Academic &amp; Professional Background
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. B.Sc. in Biomedical Engineering, 3 years hospital experience"
                      value={formData.background}
                      onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                      className="form-input"
                      style={{ width: '100%', padding: '8px 12px', fontSize: 'var(--font-size-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '4px' }}>
                      Areas of Interest in BHN (Select all that apply)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '6px' }}>
                      {bhnInterestAreas.map((area) => (
                        <label key={area} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={formData.areas_of_interest?.includes(area) || false}
                            onChange={() => handleBhnAreaToggle(area)}
                          />
                          <span>{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '4px' }}>
                      LinkedIn / Academic Profile URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={formData.profile_url}
                      onChange={(e) => setFormData({ ...formData, profile_url: e.target.value })}
                      className="form-input"
                      style={{ width: '100%', padding: '8px 12px', fontSize: 'var(--font-size-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                    />
                  </div>
                </div>
              )}

              {/* Subject Line */}
              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                  Subject Line <span style={{ color: '#e11d48' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Summary of inquiry or project title"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="form-input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: 'var(--font-size-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                />
              </div>

              {/* Message */}
              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                  {isBhnMode ? 'Why do you want to join BHN? / Message' : 'Detailed Message / Project Scope'} <span style={{ color: '#e11d48' }}>*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder={
                    isBhnMode
                      ? 'Describe your motivations for joining the Biomedical Horizon Network and how you wish to participate...'
                      : 'Please provide context regarding your project timeline, technical specifications, or collaborative goals...'
                  }
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="form-input"
                  style={{ width: '100%', padding: '10px 12px', fontSize: 'var(--font-size-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', resize: 'vertical' }}
                />
              </div>

              {/* Optional Attachment */}
              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                  Optional Proposal / Specification Document (PDF, DOCX, ZIP, Max 15MB)
                </label>
                {fileName ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: 'rgba(2, 132, 199, 0.06)',
                      border: '1px solid var(--color-primary)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-size-xs)' }}>
                      <span>📎</span>
                      <strong>{fileName}</strong>
                      <span style={{ color: 'var(--color-text-muted)' }}>({fileSize})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#e11d48',
                        fontSize: 'var(--font-size-xs)',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      handleFile(e.dataTransfer.files?.[0]);
                    }}
                    style={{
                      border: dragOver ? '2px dashed var(--color-primary)' : '1px dashed var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: 'var(--space-4)',
                      textAlign: 'center',
                      background: dragOver ? 'rgba(2, 132, 199, 0.05)' : '#fafafa',
                      cursor: 'pointer',
                    }}
                  >
                    <label style={{ cursor: 'pointer', display: 'block' }}>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                        Drag and drop a file here, or <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Browse Files</span>
                      </span>
                      <input
                        type="file"
                        onChange={(e) => handleFile(e.target.files?.[0])}
                        style={{ display: 'none' }}
                        accept=".pdf,.doc,.docx,.zip,.txt"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-3)',
                  borderTop: '1px solid var(--color-border-subtle)',
                  paddingTop: 'var(--space-4)',
                  marginTop: 'var(--space-2)',
                }}
              >
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                  🔒 Transmitted securely to verified database
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} disabled={submitting}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                    {submitting ? 'Transmitting...' : isBhnMode ? 'Submit BHN Application →' : 'Send Message →'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default CollaborationModal;
