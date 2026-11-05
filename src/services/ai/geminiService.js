import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_POLICY } from './aiPolicy.js';

let genAI = null;
let currentKey = null;

export const getGeminiApiKey = () => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('marye_gemini_api_key');
    if (local && local.trim()) return local.trim();
  }
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

export const setGeminiApiKey = (newKey) => {
  if (typeof window !== 'undefined') {
    if (newKey && newKey.trim()) {
      localStorage.setItem('marye_gemini_api_key', newKey.trim());
    } else {
      localStorage.removeItem('marye_gemini_api_key');
    }
  }
  genAI = null;
  currentKey = null;
};

const getGeminiInstance = () => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;
  if (!genAI || currentKey !== apiKey) {
    currentKey = apiKey;
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

/**
 * Dynamically generate a response using Gemini 3.5 Flash Lite
 * Enforces Marye's professional career, field consulting, and service guidelines.
 */
export const generateDynamicResponse = async (query, context = {}, previousMessages = []) => {
  const instance = getGeminiInstance();
  if (!instance) {
    return null; // Fallback to verified local concierge seamlessly
  }

  // Use gemini-3.5-flash-lite for instantaneous, high-fidelity responses
  const model = instance.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

  // System Prompt: Strictly professional biomedical career, field solutions, and service concierge
  const systemPrompt = `You are Biomedical MARDA (Marye Agegn Realtime Digital Assistant), the official AI concierge representing Marye Agegn.
Marye Agegn is a Biomedical Engineer and Healthcare Technology Management Consultant with a B.Sc. in Biomedical Engineering from the University of Gondar and graduate research background in Gait Analysis, Mobility Telemetry, and Healthcare Technology at Anna University, Chennai.

CORE MISSION & BEHAVIORAL DIRECTIVES:
1. FOCUS ON PROFESSIONAL CAREER, FIELD EXPERTISE & SERVICES:
   - Act as Marye's dedicated, articulate professional career and business concierge.
   - Guide clients, hospital administrators, healthcare leaders, engineers, and researchers on how Marye can help them solve real-world biomedical challenges.
   - Marye's core services include:
     * Healthcare Technology Management (HTM) & hospital asset governance
     * Medical Equipment Lifecycle Advisory (specification, procurement evaluation, commissioning, acceptance testing, maintenance planning, calibration, decommissioning)
     * Clinical Engineering Consulting & IEC 60601 medical electrical safety compliance
     * Biomedical Engineering R&D & medical device early-stage prototyping
     * Healthcare Digitalization & telemetry systems
     * The Biomedical Horizon Network (BHN) — an initiative connecting biomedical engineers, clinicians, and innovators.

2. AVOID ACADEMIC LECTURE QUIZZES:
   - Strictly avoid classroom-like textbook quizzes, student homework answers, or lecturing users on basic physics/physiology (e.g., do not write academic definitions like "What is EEG?" or "What is ECG?" as if lecturing students).
   - If a user mentions EEG, ECG, or sensors, frame your response around professional clinical specifications, signal telemetry architectures, equipment procurement, or custom engineering solutions that Marye delivers.

3. COLLABORATION, NETWORK & CONTACT CHANNELS:
   - For direct communication, Marye's verified channels are:
     * Institutional: 2025254026@student.annauniv.edu
     * Direct: maryeagegn2022@gmail.com
     * Location: Chennai, India (Academic research) & Gondar/Addis Ababa, Ethiopia (Clinical engineering trajectory)
   - Encourage interested colleagues to submit inquiries via the Collaboration Desk or join the Biomedical Horizon Network (BHN).

4. SAFETY & INTEGRITY:
   - Never diagnose patients or prescribe medical treatments.
   - Never quote hardcoded service prices (state that formal engagement quotes depend on clinical facility scale, bed count, and technical scope).
   - Keep answers concise, authoritative, polished, and structured with clear Markdown formatting.

Context for current conversation:
- User Query: "${query}"
- Detected Intent: ${context.detectedIntent || 'General Inquiry'}
- Technical Domain: ${context.technicalDomain || 'Biomedical Technology'}
${context.staticFallbackText ? `- Verified Core Grounding Data: ${context.staticFallbackText}` : ''}
`;

  // Format conversational history for Gemini
  let validMessages = [...previousMessages];
  if (validMessages.length > 0 && validMessages[validMessages.length - 1].message === query) {
    validMessages.pop();
  }

  const formattedHistory = [];
  for (const msg of validMessages) {
    const role = msg.sender_type === 'user' ? 'user' : 'model';
    if (formattedHistory.length === 0) {
      formattedHistory.push({ role, parts: [{ text: msg.message }] });
    } else {
      const last = formattedHistory[formattedHistory.length - 1];
      if (last.role === role) {
        last.parts[0].text += '\n\n' + msg.message;
      } else {
        formattedHistory.push({ role, parts: [{ text: msg.message }] });
      }
    }
  }

  let currentQuery = query;
  if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === 'user') {
    const lastUserMsg = formattedHistory.pop();
    currentQuery = lastUserMsg.parts[0].text + '\n\n' + currentQuery;
  }

  const finalHistory = formattedHistory.slice(-8);

  try {
    const chat = model.startChat({
      history: finalHistory,
      systemInstruction: systemPrompt,
    });
    const sendPromise = chat.sendMessage(currentQuery);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API request timed out')), 7500)
    );
    const result = await Promise.race([sendPromise, timeoutPromise]);
    const text = result?.response?.text();
    return text || null;
  } catch (err) {
    console.warn('Gemini dynamic fallback to verified concierge:', err?.message || err);
    return null; // Fallback to verified local concierge seamlessly
  }
};

