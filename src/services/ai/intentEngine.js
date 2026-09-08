/**
 * Intent Understanding & Parameter Extraction Engine
 *
 * Implements Requirements 1, 2, and 3:
 * Replaces hardcoded string matches with intent classification,
 * domain identification, and human intervention detection.
 */

import { AI_POLICY } from './aiPolicy.js';

export const INTENTS = {
  TECHNICAL_SPECIFICATION: 'technical_specification',
  PROCUREMENT_COMPARISON: 'procurement_comparison',
  REQUIREMENTS_ENGINEERING: 'requirements_engineering',
  SERVICE_INQUIRY: 'service_inquiry',
  RESEARCH_COLLABORATION: 'research_collaboration',
  RESEARCH_QUESTION: 'research_question',
  ACADEMIC_BACKGROUND: 'academic_background',
  CLINICAL_EXPERIENCE: 'clinical_experience',
  BHN_INQUIRY: 'bhn_inquiry',
  DOCUMENT_CV_REQUEST: 'document_cv_request',
  HUMAN_ESCALATION_REQUEST: 'human_escalation_request',
  GENERAL_TECHNICAL_INQUIRY: 'general_technical_inquiry',
};

export const DOMAINS = {
  MEDICAL_DEVICES: 'Medical Devices & Hardware Instrumentation',
  HTM: 'Healthcare Technology Management (HTM)',
  CLINICAL_ENGINEERING: 'Hospital Clinical Engineering',
  BIOSIGNALS: 'Biosignal Processing & Filtering',
  GAIT_ANALYSIS: 'Gait Analysis & Biomechanics',
  REHABILITATION: 'Rehabilitation Engineering & Assistive Technology',
  AI_HEALTHCARE: 'AI in Healthcare & Clinical Decision Support',
  REGULATORY: 'Medical Device Regulations & Standards',
  ACADEMIC: 'Academic Engineering Research & Collaboration',
};

export class IntentEngine {
  /**
   * Evaluates natural language user message and returns structured intent analysis
   */
  static analyzeMessage(rawMessage = '') {
    const sanitized = AI_POLICY.sanitizeUserInput(rawMessage);
    const lower = sanitized.toLowerCase();

    // Check for prompt injection attempts first (Requirement 20)
    if (AI_POLICY.isPromptInjectionAttempt(sanitized)) {
      return {
        detectedIntent: 'SECURITY_ALERT',
        technicalDomain: 'Application Security',
        userObjective: 'Prompt inspection / injection attempt',
        isPromptInjection: true,
        requiresHumanConsultation: false,
        rawQuery: sanitized,
      };
    }

    let detectedIntent = INTENTS.GENERAL_TECHNICAL_INQUIRY;
    let technicalDomain = DOMAINS.MEDICAL_DEVICES;
    let requestedEquipment = null;
    let userObjective = 'General technical exploration';
    let requiresHumanConsultation = false;
    let urgency = 'Normal';

    // 1. Explicit Human Escalation / Contact
    if (
      lower.includes('contact marye') ||
      lower.includes('speak to marye') ||
      lower.includes('send to marye') ||
      lower.includes('hire') ||
      lower.includes('schedule a call') ||
      lower.includes('direct consultation')
    ) {
      detectedIntent = INTENTS.HUMAN_ESCALATION_REQUEST;
      requiresHumanConsultation = true;
      userObjective = 'Request direct technical consultation with Marye';
    }

    // 2. Equipment Comparison / Procurement
    else if (
      (lower.includes('compare') || lower.includes('vs') || lower.includes('difference between')) &&
      (lower.includes('monitor') || lower.includes('pump') || lower.includes('device') || lower.includes('model'))
    ) {
      detectedIntent = INTENTS.PROCUREMENT_COMPARISON;
      technicalDomain = DOMAINS.HTM;
      userObjective = 'Compare medical equipment specifications for procurement decision';
      requiresHumanConsultation = lower.includes('hospital') || lower.includes('budget') || lower.includes('recommend');
    }

    // 3. Facility Requirements Engineering (e.g. 20-bed hospital, equipping ward)
    else if (
      lower.includes('bed hospital') ||
      lower.includes('equipping a ward') ||
      lower.includes('icu equipment') ||
      lower.includes('need equipment for') ||
      lower.includes('planning to purchase')
    ) {
      detectedIntent = INTENTS.REQUIREMENTS_ENGINEERING;
      technicalDomain = DOMAINS.HTM;
      userObjective = 'Define clinical equipment specifications and procurement framework';
      requiresHumanConsultation = true;
    }

    // 4. Technical Specifications
    else if (
      lower.includes('specification') ||
      lower.includes('spec sheet') ||
      lower.includes('specs') ||
      lower.includes('datasheet') ||
      lower.includes('parameter') ||
      lower.includes('battery life') ||
      lower.includes('accuracy')
    ) {
      detectedIntent = INTENTS.TECHNICAL_SPECIFICATION;
      technicalDomain = DOMAINS.MEDICAL_DEVICES;
      userObjective = 'Retrieve technical specifications for target medical equipment';
    }

    // 5. Research Collaboration
    else if (
      (lower.includes('collaborat') || lower.includes('partner') || lower.includes('joint study') || lower.includes('phd')) &&
      (lower.includes('research') || lower.includes('gait') || lower.includes('biosignal') || lower.includes('lab'))
    ) {
      detectedIntent = INTENTS.RESEARCH_COLLABORATION;
      technicalDomain = DOMAINS.ACADEMIC;
      userObjective = 'Propose or discuss academic research collaboration';
      requiresHumanConsultation = true;
    }

    // 6. Graduate Research Inquiry
    else if (
      lower.includes('gait') ||
      lower.includes('mobility') ||
      lower.includes('inertial') ||
      lower.includes('dual-task') ||
      lower.includes('research')
    ) {
      detectedIntent = INTENTS.RESEARCH_QUESTION;
      technicalDomain = DOMAINS.GAIT_ANALYSIS;
      userObjective = 'Understand graduate research directions in gait analysis and biomechanics';
    }

    // 7. Services Exploration
    else if (
      lower.includes('service') ||
      lower.includes('procurement') ||
      lower.includes('commissioning') ||
      lower.includes('acceptance testing') ||
      lower.includes('decommissioning') ||
      lower.includes('consultation') ||
      lower.includes('product development')
    ) {
      detectedIntent = INTENTS.SERVICE_INQUIRY;
      technicalDomain = DOMAINS.CLINICAL_ENGINEERING;
      userObjective = 'Explore professional biomedical engineering services';
    }

    // 8. Academic Background & Curriculum (B.Sc. & M.E.)
    else if (
      lower.includes('curriculum') ||
      lower.includes('anna university') ||
      lower.includes('gondar') ||
      lower.includes('education') ||
      lower.includes('course') ||
      lower.includes('capstone') ||
      lower.includes('rtms') ||
      lower.includes('degree') ||
      lower.includes('bachelor') ||
      lower.includes('undergraduate') ||
      lower.includes('bsc') ||
      lower.includes('b.sc') ||
      lower.includes('study') ||
      lower.includes('studied') ||
      lower.includes('biomechanics') ||
      (lower.includes('background') && (lower.includes('academic') || lower.includes('engineering') || lower.includes('imaging'))) ||
      (lower.includes('did marye') && (lower.includes('signal') || lower.includes('imaging') || lower.includes('embedded') || lower.includes('instrumentation') || lower.includes('regulation')))
    ) {
      detectedIntent = INTENTS.ACADEMIC_BACKGROUND;
      technicalDomain = DOMAINS.ACADEMIC;
      userObjective = 'Review academic background, University of Gondar BSc curriculum, Anna University M.E. curriculum, or specific course inquiries';
    }

    // 9. Clinical Experience in Ethiopia
    else if (
      lower.includes('hospital') ||
      lower.includes('shine business') ||
      lower.includes('amhara') ||
      lower.includes('central gondar') ||
      lower.includes('clinical experience') ||
      lower.includes('experience')
    ) {
      detectedIntent = INTENTS.CLINICAL_EXPERIENCE;
      technicalDomain = DOMAINS.CLINICAL_ENGINEERING;
      userObjective = 'Review clinical engineering leadership and HTM history';
    }

    // 10. BHN Membership / Network
    else if (lower.includes('bhn') || lower.includes('biomedical horizon') || lower.includes('membership')) {
      detectedIntent = INTENTS.BHN_INQUIRY;
      technicalDomain = DOMAINS.HTM;
      userObjective = 'Learn about or join the Biomedical Horizon Network (BHN)';
    }

    // 11. Document & CV Download
    else if (lower.includes('cv') || lower.includes('resume') || lower.includes('download pdf')) {
      detectedIntent = INTENTS.DOCUMENT_CV_REQUEST;
      technicalDomain = DOMAINS.ACADEMIC;
      userObjective = 'Access verified academic CV or technical publications';
    }

    // Extract device mentions if present
    if (lower.includes('patient monitor') || lower.includes('b450') || lower.includes('mx450') || lower.includes('n12')) {
      requestedEquipment = 'Multi-Parameter Patient Monitor';
    } else if (lower.includes('infusion pump') || lower.includes('infusomat') || lower.includes('syringe pump')) {
      requestedEquipment = 'Infusion Pump / Drug Delivery';
    } else if (lower.includes('rtms') || lower.includes('magnetic stimulation') || lower.includes('neuromodulation')) {
      requestedEquipment = 'Repetitive Transcranial Magnetic Stimulation (rTMS)';
    } else if (lower.includes('imu') || lower.includes('inertial sensor') || lower.includes('wearable')) {
      requestedEquipment = 'Lower-Back Wearable Inertial Sensor';
    }

    // Check urgency signals
    if (lower.includes('urgent') || lower.includes('immediately') || lower.includes('asap') || lower.includes('critical')) {
      urgency = 'Urgent';
    }

    return {
      detectedIntent,
      technicalDomain,
      requestedEquipment,
      userObjective,
      requiresHumanConsultation,
      urgency,
      rawQuery: sanitized,
    };
  }
}

export default IntentEngine;
