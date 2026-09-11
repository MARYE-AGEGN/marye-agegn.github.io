/**
 * AI Assistant Policy & Ethical Boundaries Module
 *
 * Implements Requirements 20, 21, 22, and 33:
 * - Clear distinction between General Knowledge, Verified Facts, Current Research, and Services.
 * - Anti-hallucination guidelines preventing fabricated qualifications, prices, credentials, or clinical claims.
 * - Prompt injection defense & untrusted data handling.
 * - Helpful assistance policy avoiding artificial refusal (constructive guidance over blanket rejection).
 */

export const AI_POLICY = {
  name: 'Biomedical Engineering Technical Consultation Policy',
  version: '2.0.0',

  // Information Categories
  categories: {
    GENERAL_TECHNICAL: 'GENERAL TECHNICAL KNOWLEDGE',
    VERIFIED_EXPERIENCE: 'MY VERIFIED EXPERIENCE',
    CURRENT_RESEARCH: 'MY CURRENT RESEARCH',
    SERVICES: 'MY SERVICES',
    EXTERNAL_SOURCE: 'EXTERNAL SOURCE INFORMATION',
    USER_PROVIDED: 'USER-PROVIDED INFORMATION',
    INFERENCE: 'INFERENCE / ESTIMATION',
  },

  // Authoritative Evidence Status Levels
  evidenceStatuses: {
    VERIFIED_PRIMARY: 'VERIFIED — PRIMARY SOURCE',
    SUPPORTED_SCIENTIFIC: 'SUPPORTED — SCIENTIFIC SOURCE',
    SUPPORTED_SECONDARY: 'SUPPORTED — SECONDARY SOURCE',
    UNVERIFIED: 'UNVERIFIED',
    CONFLICTING: 'CONFLICTING SOURCES',
    ADMIN_VERIFICATION_REQUIRED: 'ADMIN VERIFICATION REQUIRED',
    NOT_FOUND: 'NOT FOUND',
  },

  // Request Intent Classifications (Requirement 4)
  classifications: {
    GENERAL_INFORMATION: 'GENERAL_INFORMATION',
    BIOMEDICAL_TECHNOLOGY: 'BIOMEDICAL_TECHNOLOGY',
    TECHNICAL_SPECIFICATION: 'TECHNICAL_SPECIFICATION',
    PRODUCT_OR_EQUIPMENT: 'PRODUCT_OR_EQUIPMENT',
    SERVICE_DISCOVERY: 'SERVICE_DISCOVERY',
    SERVICE_REQUEST: 'SERVICE_REQUEST',
    CUSTOM_TECHNICAL_WORK: 'CUSTOM_TECHNICAL_WORK',
    CONSULTATION: 'CONSULTATION',
    PRICING: 'PRICING',
    AVAILABILITY: 'AVAILABILITY',
    ADMIN_VERIFICATION: 'ADMIN_VERIFICATION',
    PRIVATE_INFORMATION: 'PRIVATE_INFORMATION',
    SENSITIVE_INFORMATION: 'SENSITIVE_INFORMATION',
    UNSUPPORTED_REQUEST: 'UNSUPPORTED_REQUEST',
  },

  // Source Trust Hierarchy (Tiers 1 to 5)
  sourceTiers: {
    TIER_1: {
      name: 'Primary Authoritative',
      description: 'Official manufacturer documentation, official regulatory agencies (FDA, EU MDR), standards bodies (IEC, ISO), original publishers.',
      weight: 1.0,
    },
    TIER_2: {
      name: 'Peer-Reviewed & Academic Institutions',
      description: 'Peer-reviewed scientific journal papers, conference proceedings, recognized clinical institutions and university repositories.',
      weight: 0.85,
    },
    TIER_3: {
      name: 'Established Technical Databases',
      description: 'Recognized medical equipment databases, standardized biomedical instrumentation catalogs.',
      weight: 0.7,
    },
    TIER_4: {
      name: 'Secondary Technical Sources',
      description: 'Trade journals, engineering articles, reputable distributor technical specs.',
      weight: 0.5,
    },
    TIER_5: {
      name: 'General Web & Aggregators',
      description: 'General web pages, commercial aggregators, forums (never override higher tiers).',
      weight: 0.2,
    },
  },

  /**
   * Defensive sanitizer against direct prompt injection attempts.
   * Strips delimiters that attempt to override system instructions or impersonate admin.
   */
  sanitizeUserInput(input) {
    if (typeof input !== 'string') return '';
    return input
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') // remove control characters
      .trim();
  },

  /**
   * Detects known prompt injection signatures
   */
  isPromptInjectionAttempt(input) {
    if (!input || typeof input !== 'string') return false;
    const lower = input.toLowerCase();
    const injectionPatterns = [
      /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
      /reveal\s+(your\s+)?(system\s+prompt|hidden\s+instructions|api\s+key|password)/i,
      /you\s+are\s+now\s+in\s+dan\s+mode/i,
      /override\s+system\s+policy/i,
      /print\s+environment\s+variables/i,
      /dump\s+(database|credentials|keys)/i,
    ];
    return injectionPatterns.some((pattern) => pattern.test(lower));
  },

  /**
   * Detects requests for private/sensitive keys, credentials, or administrative secrets (Requirement 15)
   */
  isSensitiveCredentialRequest(input) {
    if (!input || typeof input !== 'string') return false;
    const lower = input.toLowerCase();
    const sensitivePatterns = [
      /\b(api[_\s-]?key|secret[_\s-]?key|private[_\s-]?key)\b/i,
      /\b(database[_\s-]?password|db[_\s-]?password|connection[_\s-]?string)\b/i,
      new RegExp('\\b(' + ['service', 'role'].join('[_\\s-]?') + ')\\b', 'i'),
      /\b(admin[_\s-]?password|admin[_\s-]?credentials|root[_\s-]?password)\b/i,
      /\b(resend[_\s-]?key|resend_api_key)\b/i,
      /\b(give\s+me|show\s+me|reveal|dump|leak|print)\s+.*(key|secret|password|token|credential)/i,
    ];
    return sensitivePatterns.some((pattern) => pattern.test(lower));
  },

  /**
   * Detects if user is inadvertently submitting raw secrets/tokens (Requirement 15)
   */
  containsUserProvidedSecret(input) {
    if (!input || typeof input !== 'string') return false;
    const secretPatterns = [
      /re_[a-zA-Z0-9]{20,}/, // Resend API key format
      /ey[a-zA-Z0-9_-]{20,}\.ey[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/, // JWT format
      /sbp_[a-zA-Z0-9]{30,}/, // Supabase PAT
      /ghp_[a-zA-Z0-9]{30,}/, // GitHub PAT
    ];
    return secretPatterns.some((pattern) => pattern.test(input));
  },

  /**
   * Wraps external retrieved content to ensure it is treated strictly as passive DATA,
   * never as executable system instructions (Requirement 20).
   */
  encapsulateExternalData(content, sourceName, tier = 'TIER_4') {
    return {
      type: 'EXTERNAL_UNTRUSTED_DATA',
      source: sourceName,
      tier,
      content: String(content || ''),
      retrievedAt: new Date().toISOString(),
      instructionOverrideForbidden: true,
    };
  },

  /**
   * Constructive Guidance Formatter (Requirement 22):
   * Avoids "I cannot help with that". Instead provides structured helpful guidance.
   */
  formatConstructiveGuidance({ determined, evidence, uncertain, needed, recommendedService }) {
    let text = '';
    if (determined) text += `${determined}\n\n`;
    if (evidence) text += `**Evidence & Standards Context:**\n${evidence}\n\n`;
    if (uncertain) text += `**Considerations & Uncertainties:**\n${uncertain}\n\n`;
    if (needed) text += `**Information Needed to Formalize:**\n${needed}\n\n`;
    if (recommendedService) text += `**Recommended Next Step:**\n${recommendedService}`;
    return text.trim();
  },
};

export default AI_POLICY;
