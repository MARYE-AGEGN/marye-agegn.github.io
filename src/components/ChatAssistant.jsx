import React, { useState, useRef, useEffect } from 'react';
import {
  IntentEngine,
  INTENTS,
  DOMAINS,
  AI_POLICY,
  defaultKnowledgeRetriever,
  TechnicalSourceRetriever,
  defaultServiceRouter,
  RequirementsEngine,
  ConsultationStore,
  BiomedicalConcierge,
} from '../services/ai';

export function ChatAssistant({ onOpenCollaboration, onOpenServiceRequest, onOpenBhnApplication }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [activeMode, setActiveMode] = useState('chat'); // 'chat' | 'requirements' | 'escalate'
  const [requirementsData, setRequirementsData] = useState({
    bedCount: 20,
    department: 'Intensive Care Unit (ICU)',
    requiredParameters: ['ECG', 'SpO₂', 'NIBP'],
  });
  const [escalationForm, setEscalationForm] = useState({
    userName: '',
    email: '',
    organization: '',
    notes: '',
  });
  const [adminResponseAlert, setAdminResponseAlert] = useState(null);
  const [rateLimitCounter, setRateLimitCounter] = useState(0);

  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: "Welcome. I am Marye Agegn's Biomedical Information & Service Concierge. I can answer biomedical technology and sensor questions, explain physiological signals, help identify medical equipment specifications, and guide you to the right technical service or consultation.",
      metadata: {},
      action: null,
    },
  ]);

  const messagesEndRef = useRef(null);

  // Initialize consultation thread & check for existing admin responses
  useEffect(() => {
    async function initSession() {
      const storedThreadId = sessionStorage.getItem('marye_active_thread_id');
      if (storedThreadId) {
        setActiveThreadId(storedThreadId);
        const adminResp = await ConsultationStore.checkAdminResponse(storedThreadId);
        if (adminResp?.hasResponded) {
          setAdminResponseAlert(adminResp);
        }
      }
    }
    initSession();
  }, []);

  // Poll for admin responses periodically when thread is active
  useEffect(() => {
    if (!activeThreadId) return;
    const interval = setInterval(async () => {
      const adminResp = await ConsultationStore.checkAdminResponse(activeThreadId);
      if (adminResp?.hasResponded && !adminResponseAlert) {
        setAdminResponseAlert(adminResp);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'admin',
            text: `Marye has reviewed your inquiry:\n\n"${adminResp.adminResponse}"`,
            metadata: {
              isDirectResponse: true,
              respondedAt: adminResp.respondedAt,
            },
            action: { label: 'Connect via Collaboration Desk', href: '#contact' },
          },
        ]);
      }
    }, 12000);
    return () => clearInterval(interval);
  }, [activeThreadId, adminResponseAlert]);

  // Scroll on message updates
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isThinking]);

  // Rate Limiting reset timer
  useEffect(() => {
    const timer = setInterval(() => setRateLimitCounter(0), 60000);
    return () => clearInterval(timer);
  }, []);

  /**
   * Main Intent-Driven Reasoning & Generation Engine
   */
  const handleSend = async (textToSend = null) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    // Rate Limiting Guard (max 10 queries per minute)
    if (rateLimitCounter > 10) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Rate limit reached for this session. Please pause for a moment before submitting additional technical queries.',
        },
      ]);
      return;
    }
    setRateLimitCounter((c) => c + 1);

    // Append user message immediately
    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsThinking(true);

    // Step 1: Intent Understanding & Entity Extraction
    const intentResult = IntentEngine.analyzeMessage(query);

    // Defensive check: Prompt Injection
    if (intentResult.isPromptInjection) {
      setTimeout(() => {
        setIsThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: 'Security Policy: System instructions, architectural prompts, and credentials remain private and protected. I am ready to assist with verified biomedical engineering inquiries.',
          },
        ]);
      }, 400);
      return;
    }

    // Step 2: Ensure an active consultation thread exists in Supabase
    let currentThreadId = activeThreadId;
    if (!currentThreadId) {
      const threadRes = await ConsultationStore.createThread({
        detectedIntent: intentResult.detectedIntent,
        technicalDomain: intentResult.technicalDomain,
        requestedEquipment: intentResult.requestedEquipment,
        userObjective: intentResult.userObjective,
        conversationSummary: query,
      });
      if (threadRes.thread?.id) {
        currentThreadId = threadRes.thread.id;
        setActiveThreadId(currentThreadId);
      }
    }

    // Record user message in thread
    if (currentThreadId) {
      ConsultationStore.appendMessage(currentThreadId, 'user', query);
    }

    // Step 3: Information Retrieval & Multi-Domain Reasoning via BiomedicalConcierge
    setTimeout(async () => {
      // Requirements Engineering interactive mode check
      if (intentResult.detectedIntent === INTENTS.REQUIREMENTS_ENGINEERING) {
        const analysis = RequirementsEngine.analyzeFacilityRequirements(query);
        const replyText = `**Clinical Requirements Engineering Mode Activated:**\n\n` +
          `I have identified the following initial parameters for your facility:\n` +
          `• **Department:** ${analysis.currentRequirements.department || 'Under assessment'}\n` +
          `• **Capacity:** ${analysis.currentRequirements.bedCount ? `${analysis.currentRequirements.bedCount} Beds` : 'To be specified'}\n` +
          `• **Parameters:** ${analysis.currentRequirements.requiredParameters.length > 0 ? analysis.currentRequirements.requiredParameters.join(', ') : 'Standard Vital Signs'}\n\n` +
          `To formulate a rigorous Preliminary Technical Requirement Specification, please consider:\n` +
          analysis.followUpQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n') +
          `\n\nWould you like me to generate a preliminary specification document or escalate this to Marye for formal institutional planning?`;

        setIsThinking(false);
        const assistantMsg = {
          sender: 'assistant',
          text: replyText,
          metadata: { type: 'requirements_mode', requirements: analysis.currentRequirements },
          action: { label: 'Open Requirements Formulator', actionType: 'mode_requirements' },
        };
        setMessages((prev) => [...prev, assistantMsg]);

        if (currentThreadId) {
          ConsultationStore.appendMessage(currentThreadId, 'ai', replyText, { type: 'requirements_mode' });
          ConsultationStore.updateThreadRequirements(currentThreadId, {
            importantRequirements: {
              identified: ['hospital equipment requirements', `${analysis.currentRequirements.bedCount || 20} beds`],
              missing: analysis.followUpQuestions,
              technicalNeed: 'Hospital clinical equipment specification schedule',
            },
            recommendedService: 'Technical Specification',
          });
        }
        return;
      }

      // Academic curriculum query response check
      if (intentResult.detectedIntent === INTENTS.ACADEMIC_BACKGROUND) {
        const replyText = defaultKnowledgeRetriever.formatCurriculumQueryResponse(query);
        const replyMetadata = {
          evidenceStatus: 'VERIFIED — PRIMARY SOURCE',
          sources: [
            'University of Gondar Institute of Technology (https://iot.uog.edu.et/biomedical-engineering-bsc-program/)',
            'Anna University Regulations 2023 (CBCS)',
          ],
        };
        const actionObj = { label: 'Inspect Education Section', href: '#education' };
        setIsThinking(false);
        setMessages((prev) => [...prev, { sender: 'assistant', text: replyText, metadata: replyMetadata, action: actionObj }]);
        if (currentThreadId) {
          ConsultationStore.appendMessage(currentThreadId, 'ai', replyText, replyMetadata);
        }
        return;
      }

      // Primary: Biomedical Information & Service Concierge Engine
      const conciergeRes = await BiomedicalConcierge.processMessage(query, {
        activeThreadId: currentThreadId,
      });

      setIsThinking(false);
      const assistantMsg = {
        sender: 'assistant',
        text: conciergeRes.replyText,
        metadata: conciergeRes.replyMetadata,
        action: conciergeRes.actionObj,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (currentThreadId) {
        ConsultationStore.appendMessage(
          currentThreadId,
          'ai',
          conciergeRes.replyText,
          conciergeRes.replyMetadata
        );
        if (conciergeRes.structuredRequirements) {
          ConsultationStore.updateThreadRequirements(
            currentThreadId,
            conciergeRes.structuredRequirements
          );
        }
      }
    }, 400);
  };

  /**
   * Submits structured escalation to Marye (Requirement 12 & 13)
   */
  const handleConfirmEscalation = async (e) => {
    e.preventDefault();
    if (!escalationForm.email) return;

    setIsThinking(true);
    const summary = messages
      .filter((m) => m.sender === 'user')
      .map((m) => m.text)
      .join(' | ');

    await ConsultationStore.escalateToMarye(activeThreadId, {
      userName: escalationForm.userName,
      email: escalationForm.email,
      organization: escalationForm.organization,
      conversationSummary: `${summary} -- User note: ${escalationForm.notes}`,
      importantRequirements: requirementsData,
      status: 'Awaiting Admin Review',
    });

    setIsThinking(false);
    setActiveMode('chat');
    setMessages((prev) => [
      ...prev,
      {
        sender: 'assistant',
        text: `Thank you, ${escalationForm.userName || 'colleague'}. Your consultation request has been prepared and sent to Marye with full conversation context.\n\nStatus: Awaiting Admin Review. Once Marye reviews your request, his response will appear directly in this window.`,
        metadata: { status: 'Awaiting Admin Review' },
      },
    ]);
  };

  return (
    <div className="chat-assistant-wrapper" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 990 }}>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          className="chat-toggle-btn"
          onClick={() => setIsOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 600,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          aria-label="Open AI Technical Assistant"
        >
          <span style={{ fontSize: '1rem' }}>🩺</span>
          <span>Technical Consultation AI</span>
          {adminResponseAlert && (
            <span
              style={{
                width: '8px',
                height: '8px',
                background: '#22c55e',
                borderRadius: '50%',
                display: 'inline-block',
              }}
            />
          )}
        </button>
      )}

      {/* Assistant Window */}
      {isOpen && (
        <div
          className="chat-assistant-window card"
          style={{
            width: '420px',
            maxWidth: 'calc(100vw - 32px)',
            height: '560px',
            maxHeight: 'calc(100vh - 75px)',
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>🩺</span>
              <div>
                <h3 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                  AI Technical Consultation
                </h3>
                <span style={{ fontSize: '0.65rem', opacity: 0.9 }}>
                  Biomedical Engineering &bull; Specifications &bull; Research
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {activeMode !== 'chat' && (
                <button
                  type="button"
                  onClick={() => setActiveMode('chat')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Back to Chat
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
                aria-label="Close assistant"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Admin Response Alert Banner */}
          {adminResponseAlert && (
            <div
              style={{
                background: '#f0fdf4',
                borderBottom: '1px solid #bbf7d0',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 600 }}>
                ✓ Marye reviewed this consultation thread
              </div>
              <span style={{ fontSize: '0.65rem', color: '#15803d' }}>
                {new Date(adminResponseAlert.respondedAt).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Main Content Area */}
          <div
            style={{
              flex: 1,
              padding: '14px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              background: '#f8fafc',
            }}
          >
            {activeMode === 'chat' && (
              <>
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '90%',
                      background:
                        m.sender === 'user'
                          ? 'var(--color-primary, #0284c7)'
                          : m.sender === 'admin'
                          ? '#f0fdf4'
                          : '#ffffff',
                      color:
                        m.sender === 'user'
                          ? '#ffffff'
                          : m.sender === 'admin'
                          ? '#14532d'
                          : 'var(--color-text-primary, #1e293b)',
                      padding: '10px 14px',
                      borderRadius:
                        m.sender === 'user'
                          ? '14px 14px 2px 14px'
                          : '14px 14px 14px 2px',
                      fontSize: '0.78rem',
                      lineHeight: '1.55',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
                      border:
                        m.sender === 'user'
                          ? 'none'
                          : m.sender === 'admin'
                          ? '1px solid #86efac'
                          : '1px solid var(--color-border)',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {m.sender === 'admin' && (
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '0.68rem',
                          color: '#15803d',
                          marginBottom: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        Official Response from Marye Agegn
                      </div>
                    )}
                    <div>{m.text}</div>

                    {/* Action link if available */}
                    {m.action && (
                      <div style={{ marginTop: '8px', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '6px' }}>
                        {m.action.actionType === 'mode_requirements' ? (
                          <button
                            type="button"
                            onClick={() => setActiveMode('requirements')}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              padding: 0,
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: 'var(--color-primary)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span>Open Requirements Tool</span>
                            <span>⚙ →</span>
                          </button>
                        ) : m.action.actionType === 'mode_escalate' ? (
                          <button
                            type="button"
                            onClick={() => setActiveMode('escalate')}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              padding: 0,
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: 'var(--color-primary)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span>Send to Marye for Direct Review</span>
                            <span>✉ →</span>
                          </button>
                        ) : m.action.serviceId && onOpenServiceRequest ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsOpen(false);
                              onOpenServiceRequest(m.action.serviceId);
                            }}
                            style={{
                              background: 'rgba(2, 132, 199, 0.08)',
                              border: '1px solid var(--color-primary)',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: 'var(--color-primary)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span>{m.action.label}</span>
                            <span>⚡ →</span>
                          </button>
                        ) : (
                          <a
                            href={m.action.href}
                            onClick={() => {
                              if (m.action.href === '#contact' && onOpenCollaboration) {
                                onOpenCollaboration();
                              }
                              setIsOpen(false);
                            }}
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              color: 'var(--color-primary)',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span>{m.action.label}</span>
                            <span>→</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {isThinking && (
                  <div
                    style={{
                      alignSelf: 'flex-start',
                      background: '#ffffff',
                      padding: '8px 14px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    Reasoning &amp; checking technical knowledge base...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}

            {/* Mode: Requirements Engineering */}
            {activeMode === 'requirements' && (
              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 10px 0', color: 'var(--color-primary)' }}>
                  Preliminary Technical Requirement Generator
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '2px' }}>Department / Clinical Unit:</label>
                    <select
                      value={requirementsData.department}
                      onChange={(e) => setRequirementsData({ ...requirementsData, department: e.target.value })}
                      style={{ width: '100%', padding: '6px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    >
                      <option>Intensive Care Unit (ICU)</option>
                      <option>Neonatal ICU (NICU)</option>
                      <option>Emergency Ward</option>
                      <option>Operating Room (OR)</option>
                      <option>General Inpatient Ward</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '2px' }}>Capacity / Bed Count:</label>
                    <input
                      type="number"
                      value={requirementsData.bedCount}
                      onChange={(e) => setRequirementsData({ ...requirementsData, bedCount: parseInt(e.target.value, 10) || 10 })}
                      style={{ width: '100%', padding: '6px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const spec = RequirementsEngine.generatePreliminarySpecification(requirementsData);
                      setMessages((prev) => [
                        ...prev,
                        {
                          sender: 'assistant',
                          text: spec,
                          metadata: { type: 'generated_spec' },
                          action: { label: 'Send to Marye for Procurement Review', actionType: 'mode_escalate' },
                        },
                      ]);
                      setActiveMode('chat');
                    }}
                    style={{
                      marginTop: '6px',
                      padding: '8px',
                      background: 'var(--color-primary)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Synthesize Specification Draft
                  </button>
                </div>
              </div>
            )}

            {/* Mode: Escalation to Marye */}
            {activeMode === 'escalate' && (
              <form onSubmit={handleConfirmEscalation} style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--color-primary)' }}>
                  Send Consultation to Marye Agegn
                </h4>
                <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: '0 0 10px 0' }}>
                  Your entire dialogue history will be preserved so Marye can provide an informed technical evaluation.
                </p>
                <div style={{ padding: '6px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '0.68rem', color: '#64748b', marginBottom: '8px' }}>
                  🔒 <strong>Privacy Notice:</strong> Please do not submit patient identifiers, medical records, passwords, or confidential institutional information. This consultation platform is for academic and technical engineering discussion only.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={escalationForm.userName}
                    onChange={(e) => setEscalationForm({ ...escalationForm, userName: e.target.value })}
                    style={{ padding: '6px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address (Required for reply)"
                    value={escalationForm.email}
                    onChange={(e) => setEscalationForm({ ...escalationForm, email: e.target.value })}
                    style={{ padding: '6px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                  <input
                    type="text"
                    placeholder="Organization / Hospital / University"
                    value={escalationForm.organization}
                    onChange={(e) => setEscalationForm({ ...escalationForm, organization: e.target.value })}
                    style={{ padding: '6px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                  <textarea
                    rows={3}
                    placeholder="Specific questions or context for Marye..."
                    value={escalationForm.notes}
                    onChange={(e) => setEscalationForm({ ...escalationForm, notes: e.target.value })}
                    style={{ padding: '6px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', resize: 'vertical' }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '8px',
                      background: 'var(--color-primary)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Confirm &amp; Send to Marye
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Quick Technical Exploration Shortcuts */}
          {activeMode === 'chat' && (
            <div
              style={{
                padding: '6px 10px',
                background: '#ffffff',
                borderTop: '1px solid var(--color-border-subtle)',
                display: 'flex',
                overflowX: 'auto',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              {[
                { label: 'What is EEG?', q: 'What is EEG?' },
                { label: 'Measure Movement', q: 'Which sensor can measure movement?' },
                { label: 'Services Offered', q: 'What services do you offer?' },
                { label: 'What is ECG?', q: 'What is an ECG?' },
                { label: 'Sensor Selection', q: 'What should I consider before choosing a biomedical sensor?' },
                { label: 'Compare Monitors', q: 'Can you compare available patient monitor models?' },
                { label: 'Consultation', q: 'I would like to request a technical consultation.' },
              ].map((pill, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(pill.q)}
                  style={{
                    padding: '3px 8px',
                    fontSize: '0.67rem',
                    background: 'rgba(2, 132, 199, 0.06)',
                    color: 'var(--color-primary)',
                    border: '1px solid rgba(2, 132, 199, 0.2)',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          )}

          {/* Natural Language Input Bar */}
          {activeMode === 'chat' && (
            <div
              style={{
                padding: '8px 12px',
                background: '#ffffff',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                gap: '6px',
              }}
            >
              <input
                type="text"
                placeholder="Ask a biomedical question, sensor guidance, or service consultation..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  fontSize: '0.78rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => handleSend()}
                style={{
                  padding: '7px 14px',
                  background: 'var(--color-primary, #0284c7)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatAssistant;
