import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../data/supabaseClient';
import { ConsultationStore, AdminResearchAssistant } from '../../services/ai';

export function ConsultationWorkspace() {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [investigationReport, setInvestigationReport] = useState(null);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [adminResponseText, setAdminResponseText] = useState('');
  const [isSendingResponse, setIsSendingResponse] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  // Load threads
  const loadThreads = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('consultation_threads')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          setThreads(data);
          if (data.length > 0 && !selectedThread) {
            handleSelectThread(data[0]);
          }
          return;
        }
      } catch (e) {
        console.warn('Supabase fetch error, using local fallback:', e);
      }
    }

    const localThreads = ConsultationStore.getLocalThreads();
    setThreads(localThreads);
    if (localThreads.length > 0 && !selectedThread) {
      handleSelectThread(localThreads[0]);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  const handleSelectThread = async (thread) => {
    setSelectedThread(thread);
    setInvestigationReport(null);
    setAdminResponseText(thread.admin_response || '');
    const msgs = await ConsultationStore.getThreadMessages(thread.id);
    setMessages(msgs);
  };

  // Perform Deep Technical Investigation (Requirement 15)
  const handleInvestigate = async () => {
    if (!selectedThread) return;
    setIsInvestigating(true);
    setActionNotice(null);

    try {
      const report = await AdminResearchAssistant.investigateRequest(selectedThread, messages);
      setInvestigationReport(report);
      if (!adminResponseText) {
        setAdminResponseText(report.suggestedResponse);
      }
      setActionNotice('Technical investigation complete. Review standards, potential risks, and draft response below.');
    } catch (e) {
      console.error(e);
      setActionNotice('Investigation failed to complete.');
    } finally {
      setIsInvestigating(false);
    }
  };

  // Dispatch Approved Admin Response (Requirement 16)
  const handleSendResponse = async (e) => {
    e.preventDefault();
    if (!selectedThread || !adminResponseText.trim()) return;
    setIsSendingResponse(true);

    try {
      await AdminResearchAssistant.sendAdminResponse(selectedThread.id, adminResponseText.trim());
      setActionNotice('Official response dispatched successfully. The visitor will see your response in their live consultation window.');
      await loadThreads();
      // Reload selected thread
      const updatedThread = { ...selectedThread, status: 'Admin Responded', admin_response: adminResponseText.trim() };
      setSelectedThread(updatedThread);
      const msgs = await ConsultationStore.getThreadMessages(selectedThread.id);
      setMessages(msgs);
    } catch (e) {
      console.error(e);
      setActionNotice('Failed to dispatch response.');
    } finally {
      setIsSendingResponse(false);
    }
  };

  const filteredThreads = threads.filter((t) => {
    if (statusFilter === 'All') return true;
    return t.status === statusFilter;
  });

  return (
    <div className="consultation-workspace" style={{ display: 'flex', gap: '20px', minHeight: '680px' }}>
      {/* Left Sidebar: Threads List */}
      <div
        style={{
          width: '320px',
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '14px', borderBottom: '1px solid var(--color-border)', background: '#f8fafc' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', fontWeight: 700 }}>
            Technical Inquiries ({threads.length})
          </h4>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 8px',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
            }}
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Awaiting Admin Review">Awaiting Admin Review</option>
            <option value="Admin Responded">Admin Responded</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredThreads.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', fontSize: '0.78rem', color: '#64748b' }}>
              No consultation inquiries found.
            </div>
          ) : (
            filteredThreads.map((t) => {
              const isSelected = selectedThread?.id === t.id;
              const isAwaiting = t.status === 'Awaiting Admin Review';
              return (
                <div
                  key={t.id}
                  onClick={() => handleSelectThread(t)}
                  style={{
                    padding: '12px',
                    borderBottom: '1px solid #f1f5f9',
                    background: isSelected ? 'rgba(2, 132, 199, 0.08)' : '#ffffff',
                    borderLeft: isSelected ? '4px solid var(--color-primary)' : '4px solid transparent',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.78rem', color: '#0f172a' }}>
                      {t.user_name || 'Anonymous Visitor'}
                    </strong>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        fontWeight: 600,
                        background: isAwaiting ? '#fef3c7' : t.status === 'Admin Responded' ? '#dcfce7' : '#e0f2fe',
                        color: isAwaiting ? '#92400e' : t.status === 'Admin Responded' ? '#166534' : '#0369a1',
                      }}
                    >
                      {t.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#475569', marginBottom: '4px' }}>
                    {t.organization || t.email || 'No organization provided'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.conversation_summary || t.user_objective}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Area: Selected Thread Detail & Investigation Workspace */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {selectedThread ? (
          <>
            {/* Header & Meta Bar */}
            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#0f172a' }}>
                    {selectedThread.user_name || 'Anonymous Visitor'} &bull; {selectedThread.organization || 'Individual'}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                    <strong>Email:</strong> {selectedThread.email || 'Not provided'} &bull; <strong>Domain:</strong> {selectedThread.technical_domain}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleInvestigate}
                  disabled={isInvestigating}
                  style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: isInvestigating ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>🔍</span>
                  <span>{isInvestigating ? 'Investigating...' : 'Investigate This Request'}</span>
                </button>
              </div>

              {actionNotice && (
                <div style={{ padding: '8px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', fontSize: '0.75rem', color: '#166534', marginBottom: '10px' }}>
                  {actionNotice}
                </div>
              )}

              {/* AI Understanding Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.72rem' }}>
                <span style={{ padding: '4px 10px', background: '#f1f5f9', borderRadius: '4px', color: '#334155' }}>
                  <strong>Intent:</strong> {selectedThread.detected_intent}
                </span>
                {selectedThread.requested_equipment && (
                  <span style={{ padding: '4px 10px', background: '#e0f2fe', borderRadius: '4px', color: '#0369a1' }}>
                    <strong>Target Equipment:</strong> {selectedThread.requested_equipment}
                  </span>
                )}
                <span style={{ padding: '4px 10px', background: '#fef3c7', borderRadius: '4px', color: '#92400e' }}>
                  <strong>Evidence Status:</strong> {selectedThread.evidence_status || 'UNVERIFIED'}
                </span>
              </div>
            </div>

            {/* Investigation Dossier (if run) */}
            {investigationReport && (
              <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #0284c7', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.08)' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🔬</span>
                  <span>AI Investigation &amp; Standards Review</span>
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.75rem', marginBottom: '14px' }}>
                  <div>
                    <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>Applicable International Standards:</strong>
                    <ul style={{ margin: 0, paddingLeft: '16px', color: '#475569' }}>
                      {investigationReport.applicableStandards.map((s, idx) => (
                        <li key={idx} style={{ marginBottom: '2px' }}>
                          <strong>{s.code}:</strong> {s.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>Potential Clinical &amp; Operational Risks:</strong>
                    <ul style={{ margin: 0, paddingLeft: '16px', color: '#dc2626' }}>
                      {investigationReport.potentialRisks.map((r, idx) => (
                        <li key={idx} style={{ marginBottom: '2px' }}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', marginBottom: '10px' }}>
                  <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>Recommended Service Routing:</strong>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {investigationReport.recommendedServices.map((rec, idx) => (
                      <span key={idx} style={{ padding: '3px 8px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                        {rec.service.title} ({Math.round(rec.confidence * 100)}%)
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Conversation History */}
            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)', flex: 1 }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#0f172a' }}>
                Conversation History
              </h4>
              <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px' }}>
                {messages.length === 0 ? (
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>No archived messages in this thread.</div>
                ) : (
                  messages.map((m, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        background: m.sender_type === 'user' ? '#f1f5f9' : m.sender_type === 'admin' ? '#dcfce7' : '#f8fafc',
                        borderLeft: m.sender_type === 'user' ? '3px solid #0284c7' : m.sender_type === 'admin' ? '3px solid #16a34a' : '3px solid #94a3b8',
                      }}
                    >
                      <strong style={{ textTransform: 'capitalize', color: '#334155' }}>
                        {m.sender_type === 'admin' ? 'Marye (Admin)' : m.sender_type}:
                      </strong>{' '}
                      <span style={{ color: '#1e293b', whiteSpace: 'pre-line' }}>{m.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Admin Response Composer (Requirement 16) */}
            <form onSubmit={handleSendResponse} style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#0f172a' }}>
                  Compose / Approve Professional Response
                </h4>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  Response will be posted directly to visitor's active consultation session
                </span>
              </div>
              <textarea
                rows={6}
                required
                value={adminResponseText}
                onChange={(e) => setAdminResponseText(e.target.value)}
                placeholder="Draft your professional response, recommended service, or technical clarification..."
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '0.78rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="submit"
                  disabled={isSendingResponse || !adminResponseText.trim()}
                  style={{
                    padding: '8px 20px',
                    background: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: isSendingResponse ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSendingResponse ? 'Dispatching...' : 'Send Response to Visitor'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div style={{ background: '#ffffff', padding: '40px', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--color-border)', color: '#64748b' }}>
            Select a consultation inquiry from the left panel to inspect requirements and conduct an investigation.
          </div>
        )}
      </div>
    </div>
  );
}

export default ConsultationWorkspace;
