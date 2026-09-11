import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_POLICY } from './aiPolicy.js';

let genAI = null;

const getGeminiInstance = () => {
  if (!genAI) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      genAI = new GoogleGenerativeAI(apiKey);
    }
  }
  return genAI;
};

/**
 * Dynamically generate a response based on policy and provided context.
 */
export const generateDynamicResponse = async (query, context = {}, previousMessages = []) => {
  const instance = getGeminiInstance();
  if (!instance) {
    return null; // Fallback to static text
  }

  // Use gemini-1.5-flash for fast chat responses
  const model = instance.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Construct system prompt enforcing strict AI_POLICY
  let systemPrompt = `You are a highly professional Biomedical Engineering Concierge representing Marye Agegn.
Your strict policies:
1. NEVER hallucinate prices, availability, or credentials.
2. If asked about prices, respond that pricing depends on specific requirements and scope.
3. Only offer services from the official catalog (Medical Product Development, Research & Development, Procurement & Purchasing, etc.).
4. Do not provide medical diagnoses or prescribe medications.
5. Provide clear, concise, and structured engineering responses.

Current Context:
- Detected Intent: ${context.detectedIntent || 'Unknown'}
- Technical Domain: ${context.technicalDomain || 'General'}
- Previous Analysis Requirements: ${JSON.stringify(context.requirements || {})}
`;

  if (context.staticFallbackText) {
    systemPrompt += `\nGuidelines for response: The user asked something that maps to a known answer. Enhance and naturally deliver this core information: ${context.staticFallbackText}`;
  } else {
    systemPrompt += `\nPlease answer the following user query professionally and in accordance with the policies.`;
  }

  // Format history for Gemini
  // previousMessages are from Supabase/ConsultationStore. Sender type is 'user', 'ai', 'admin', 'system'
  const history = previousMessages.slice(-5).map((msg) => ({
    role: msg.sender_type === 'user' ? 'user' : 'model',
    parts: [{ text: msg.message }]
  }));

  try {
    const chat = model.startChat({
      history: history,
      systemInstruction: systemPrompt,
    });
    const result = await chat.sendMessage(query);
    return result.response.text();
  } catch (err) {
    console.error('Gemini Generation Error:', err);
    return null; // fallback
  }
};
