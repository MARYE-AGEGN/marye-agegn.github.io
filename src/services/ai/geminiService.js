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
    console.error('Gemini API Key missing!');
    return null; // Fallback to static mode seamlessly
  }

  // Use gemini-1.5-flash for fast chat responses
  const model = instance.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Construct system prompt enforcing strict AI_POLICY
  let systemPrompt = `You are Biomedical MARDA (Marye Agegn Realtime Digital Assistant), representing Marye Agegn.
You are a visionary assistant focused on Biomedical Services, Medical Technology, Healthcare Solutions, Career Growth, and Business Development.
Your purpose is to help people, support business growth in healthcare, provide professional guidance on medical technology, and offer comprehensive biomedical solutions.

Policies:
1. Speak dynamically about Marye's professional services, healthcare business, and medical technology expertise. Do not limit yourself to academic topics.
2. NEVER hallucinate prices, availability, or credentials.
3. If asked about prices, respond that pricing depends on specific requirements and scope.
4. Do not provide medical diagnoses or prescribe medications.
5. Provide engaging, professional, and business-oriented responses that help clients grow and solve their problems.

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
  // previousMessages are from Supabase/ConsultationStore.
  let validMessages = [...previousMessages];

  // 1. Remove the current query from the history if it was just appended
  if (validMessages.length > 0 && validMessages[validMessages.length - 1].message === query) {
    validMessages.pop();
  }

  // 2. Group consecutive messages by the same role
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

  // 3. Gemini requires the last message in history to be from 'model' before sendMessage()
  let currentQuery = query;
  if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === 'user') {
    const lastUserMsg = formattedHistory.pop();
    currentQuery = lastUserMsg.parts[0].text + '\n\n' + currentQuery;
  }

  // Limit history size
  const finalHistory = formattedHistory.slice(-6);

  try {
    const chat = model.startChat({
      history: finalHistory,
      systemInstruction: systemPrompt,
    });
    const result = await chat.sendMessage(currentQuery);
    return result.response.text();
  } catch (err) {
    console.error('Gemini Generation Error:', err);
    return null; // Fallback to static mode seamlessly without throwing ugly errors
  }
};
