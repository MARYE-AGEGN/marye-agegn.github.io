/**
 * Intent Understanding, Entity Extraction & Request Classification Engine
 *
 * Implements Requirements 1, 2, 3, 4, 6, 7, and 24:
 * Transforms user natural language inquiries into deep conceptual classifications:
 * - General information vs Actionable service request
 * - Plain public explanation vs Technical design specification
 * - Pricing protection and Administrative verification detection
 * - Absolute avoidance of automatic academic assumptions
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
  CUSTOM_TECHNICAL_WORK: 'custom_technical_work',
  WEBINAR_DISCOVERY: 'webinar_discovery',
  VIDEO_DISCOVERY: 'video_discovery',
  PRICING_INQUIRY: 'pricing_inquiry',
  AVAILABILITY_INQUIRY: 'availability_inquiry',
  CONTINUE_CONSULTATION: 'continue_consultation',
  SECURITY_ALERT: 'SECURITY_ALERT',
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
  MARYE_PROFILE: 'Marye Agegn Professional Capabilities & Profile',
};

export class IntentEngine {
  /**
   * Evaluates natural language user message and returns structured, deep conceptual analysis
   */
  static analyzeMessage(rawMessage = '') {
    const sanitized = AI_POLICY.sanitizeUserInput(rawMessage);
    const lower = sanitized.toLowerCase().trim();

    // 1. Direct prompt injection detection
    if (AI_POLICY.isPromptInjectionAttempt(sanitized)) {
      return {
        detectedIntent: INTENTS.SECURITY_ALERT,
        classification: AI_POLICY.classifications.SENSITIVE_INFORMATION,
        technicalDomain: 'Application Security',
        userObjective: 'Prompt inspection / injection attempt',
        isPromptInjection: true,
        actionType: 'protect',
        isInformationOnly: false,
        requiresHumanConsultation: false,
        rawQuery: sanitized,
      };
    }

    // 2. Sensitive credential / API key / Secret extraction detection (Requirement 15)
    if (AI_POLICY.isSensitiveCredentialRequest(sanitized)) {
      return {
        detectedIntent: INTENTS.SECURITY_ALERT,
        classification: AI_POLICY.classifications.SENSITIVE_INFORMATION,
        technicalDomain: 'Security & Access Control',
        userObjective: 'Sensitive credential or secret key query',
        isCredentialRequest: true,
        actionType: 'protect',
        isInformationOnly: false,
        requiresHumanConsultation: false,
        rawQuery: sanitized,
      };
    }

    // 3. User pasted a raw secret or token by mistake (Requirement 15)
    if (AI_POLICY.containsUserProvidedSecret(sanitized)) {
      return {
        detectedIntent: INTENTS.SECURITY_ALERT,
        classification: AI_POLICY.classifications.SENSITIVE_INFORMATION,
        technicalDomain: 'Data Privacy & Secret Protection',
        userObjective: 'User inadvertently supplied potential credentials',
        userSuppliedSecret: true,
        actionType: 'protect',
        isInformationOnly: false,
        requiresHumanConsultation: false,
        rawQuery: sanitized,
      };
    }

    // Default analysis state
    let classification = AI_POLICY.classifications.GENERAL_INFORMATION;
    let detectedIntent = INTENTS.GENERAL_TECHNICAL_INQUIRY;
    let technicalDomain = DOMAINS.MEDICAL_DEVICES;
    let requestedEquipment = null;
    let userObjective = 'General biomedical information inquiry';
    let actionType = 'explain'; // 'explain' | 'select' | 'build' | 'analyze' | 'quote' | 'verify' | 'consult' | 'protect'
    let isInformationOnly = true;
    let needsProfessionalService = false;
    let serviceTarget = null;
    let pricingRequested = false;
    let adminVerificationRequired = false;
    let isContinueConsultation = false;
    let isProfileQuery = false;
    let isServicesQuery = false;
    let biomedicalTopic = null;
    let urgency = 'Normal';

    // Check urgency signals
    if (lower.includes('urgent') || lower.includes('immediately') || lower.includes('asap') || lower.includes('critical emergency')) {
      urgency = 'Urgent';
    }

    // =========================================================================
    // DETECTION PASS: Specific Intent Patterns
    // =========================================================================

    // A. Continue Previous Consultation (Requirement 16)
    if (
      lower.includes('continue my previous consultation') ||
      lower.includes('continue consultation') ||
      lower.includes('continue our previous discussion') ||
      lower.includes('continue from where we left off') ||
      lower.includes('resume consultation') ||
      (lower.includes('continue') && (lower.includes('thread') || lower.includes('previous')))
    ) {
      classification = AI_POLICY.classifications.CONSULTATION;
      detectedIntent = INTENTS.CONTINUE_CONSULTATION;
      actionType = 'consult';
      isContinueConsultation = true;
      isInformationOnly = false;
      userObjective = 'Continue existing consultation session';
      return {
        detectedIntent,
        classification,
        technicalDomain: DOMAINS.CLINICAL_ENGINEERING,
        userObjective,
        actionType,
        isInformationOnly,
        isContinueConsultation: true,
        needsProfessionalService: false,
        pricingRequested: false,
        adminVerificationRequired: false,
        urgency,
        rawQuery: sanitized,
      };
    }

    // B. Pricing Inquiry (Requirement 13)
    if (
      lower.includes('how much do you charge') ||
      lower.includes('how much does it cost') ||
      lower.includes('what are your rates') ||
      lower.includes('what is the price') ||
      lower.includes('pricing') ||
      lower.includes('consultation fee') ||
      lower.includes('quotation cost') ||
      lower.includes('charge for')
    ) {
      classification = AI_POLICY.classifications.PRICING;
      detectedIntent = INTENTS.PRICING_INQUIRY;
      actionType = 'quote';
      isInformationOnly = false;
      pricingRequested = true;
      userObjective = 'Inquire about service pricing or technical consultation rates';
      serviceTarget = 'technical-medical-technology-consultation';
      return {
        detectedIntent,
        classification,
        technicalDomain: DOMAINS.CLINICAL_ENGINEERING,
        userObjective,
        actionType,
        isInformationOnly,
        pricingRequested: true,
        adminVerificationRequired: false,
        needsProfessionalService: true,
        serviceTarget,
        urgency,
        rawQuery: sanitized,
      };
    }

    // C. Service Availability & Project Acceptance (Requirement 14)
    if (
      lower.includes('is your service available') ||
      lower.includes('are you available') ||
      lower.includes('are your services available') ||
      lower.includes('when can you start') ||
      lower.includes('can you accept my project') ||
      lower.includes('current availability') ||
      lower.includes('project acceptance') ||
      lower.includes('timeline for delivery')
    ) {
      classification = AI_POLICY.classifications.AVAILABILITY;
      detectedIntent = INTENTS.AVAILABILITY_INQUIRY;
      actionType = 'verify';
      isInformationOnly = false;
      adminVerificationRequired = true;
      userObjective = 'Check professional service availability and project intake status';
      serviceTarget = 'technical-medical-technology-consultation';
      return {
        detectedIntent,
        classification,
        technicalDomain: DOMAINS.CLINICAL_ENGINEERING,
        userObjective,
        actionType,
        isInformationOnly,
        pricingRequested: false,
        adminVerificationRequired: true,
        needsProfessionalService: true,
        serviceTarget,
        urgency,
        rawQuery: sanitized,
      };
    }

    // D. Private / Sensitive / Confidential Information Request (Requirement 15)
    if (
      lower.includes('private client') ||
      lower.includes('confidential data') ||
      lower.includes('patient records') ||
      lower.includes('personal phone') ||
      lower.includes('home address') ||
      lower.includes('internal password')
    ) {
      classification = AI_POLICY.classifications.PRIVATE_INFORMATION;
      detectedIntent = INTENTS.SECURITY_ALERT;
      actionType = 'protect';
      isInformationOnly = false;
      userObjective = 'Request for private or confidential information';
      return {
        detectedIntent,
        classification,
        technicalDomain: 'Data Privacy & Ethics',
        userObjective,
        actionType,
        isInformationOnly: false,
        rawQuery: sanitized,
      };
    }

    // E. Unsupported / Out-of-Scope Requests (e.g. clinical diagnosis/prescription, non-biomedical software)
    if (
      lower.includes('diagnose my') ||
      lower.includes('prescribe medicine') ||
      lower.includes('prescribe drugs') ||
      lower.includes('am i having a heart attack') ||
      lower.includes('crypto trading bot') ||
      lower.includes('bitcoin bot')
    ) {
      classification = AI_POLICY.classifications.UNSUPPORTED_REQUEST;
      detectedIntent = INTENTS.GENERAL_TECHNICAL_INQUIRY;
      actionType = 'protect';
      isInformationOnly = false;
      userObjective = 'Request falling outside biomedical engineering advisory scope';
      return {
        detectedIntent,
        classification,
        technicalDomain: 'Scope Boundaries & Clinical Ethics',
        userObjective,
        actionType,
        isInformationOnly: false,
        rawQuery: sanitized,
      };
    }

    // F. Understanding Marye: "Who are you?", "Who is Marye?", "What do you do?", "What are her skills?"
    if (
      lower === 'who are you?' ||
      lower === 'who are you' ||
      lower.includes('who is marye') ||
      lower.includes('tell me about marye') ||
      lower.includes('what does marye do') ||
      lower.includes('what are your skills') ||
      lower.includes('what are her skills') ||
      lower.includes('what biomedical areas') ||
      lower.includes('what technologies does she work with') ||
      lower.includes('what can she help me with') ||
      lower.includes('can she help with my biomedical project') ||
      lower.includes('what kind of technical problems can i bring') ||
      lower.includes('about marye') ||
      (lower.includes('who') && lower.includes('you'))
    ) {
      classification = AI_POLICY.classifications.GENERAL_INFORMATION;
      detectedIntent = INTENTS.GENERAL_TECHNICAL_INQUIRY;
      technicalDomain = DOMAINS.MARYE_PROFILE;
      isProfileQuery = true;
      actionType = 'explain';
      isInformationOnly = true;
      userObjective = 'Understand Marye Agegn\'s professional capabilities, background, and engineering scope';
      return {
        detectedIntent,
        classification,
        technicalDomain,
        userObjective,
        actionType,
        isInformationOnly,
        isProfileQuery: true,
        rawQuery: sanitized,
      };
    }

    // G. Service Discovery & "What services do you offer?", "I don't know which service I need"
    if (
      lower.includes('what services do you offer') ||
      lower.includes('what services do you provide') ||
      lower.includes('what services are offered') ||
      lower.includes('tell me about your services') ||
      lower.includes('list of services')
    ) {
      classification = AI_POLICY.classifications.SERVICE_DISCOVERY;
      detectedIntent = INTENTS.SERVICE_INQUIRY;
      technicalDomain = DOMAINS.CLINICAL_ENGINEERING;
      isServicesQuery = true;
      actionType = 'explain';
      isInformationOnly = true;
      userObjective = 'Discover available professional biomedical engineering services';
      serviceTarget = 'technical-medical-technology-consultation';
      return {
        detectedIntent,
        classification,
        technicalDomain,
        userObjective,
        actionType,
        isInformationOnly,
        isServicesQuery: true,
        serviceTarget,
        rawQuery: sanitized,
      };
    }

    if (
      lower.includes("i don't know which service i need") ||
      lower.includes('dont know which service') ||
      lower.includes('which service should i choose') ||
      lower.includes('help me choose a service') ||
      lower.includes('not sure which service')
    ) {
      classification = AI_POLICY.classifications.SERVICE_DISCOVERY;
      detectedIntent = INTENTS.SERVICE_INQUIRY;
      technicalDomain = DOMAINS.CLINICAL_ENGINEERING;
      actionType = 'consult';
      isInformationOnly = false;
      needsProfessionalService = true;
      userObjective = 'Seek guidance in selecting appropriate biomedical engineering service';
      serviceTarget = 'technical-medical-technology-consultation';
      return {
        detectedIntent,
        classification,
        technicalDomain,
        userObjective,
        actionType,
        isInformationOnly: false,
        needsProfessionalService: true,
        serviceTarget,
        rawQuery: sanitized,
      };
    }

    // H. Custom Technical Work / Service Requests:
    // e.g. "Can you analyze my dataset?", "Can you analyze my ECG?", "Can you analyze my gait data?", "Can you build this device?", "I need consultancy for hospital equipment"
    const hasCustomActionWord =
      lower.includes('can you analyze my') ||
      lower.includes('analyze my') ||
      lower.includes('analyzing my') ||
      lower.includes('need my') ||
      lower.includes('need help analyzing') ||
      lower.includes('clean my data') ||
      lower.includes('can you build') ||
      lower.includes('can you develop') ||
      lower.includes('i want to develop') ||
      lower.includes('want to develop') ||
      lower.includes('build this biomedical device') ||
      lower.includes('develop the complete system') ||
      lower.includes('design a custom') ||
      lower.includes('hire you to') ||
      lower.includes('i want to hire you') ||
      lower.includes('process our dataset') ||
      (lower.includes('i have') && (lower.includes('recordings') || lower.includes('dataset') || lower.includes('data')) && (lower.includes("don't know") || lower.includes('dont know') || lower.includes('analyze') || lower.includes('help'))) ||
      ((lower.includes('dataset') || lower.includes('recordings') || lower.includes('signals')) && (lower.includes('analyze') || lower.includes('analyzed') || lower.includes('process'))) ||
      (lower.includes('consultancy for') && (lower.includes('hospital') || lower.includes('equipment') || lower.includes('management') || lower.includes('htm'))) ||
      (lower.includes('need consultancy') || lower.includes('require consultancy')) ||
      (lower.includes('need help') && (lower.includes('equipment management system') || lower.includes('system for our hospital') || lower.includes('hospital medical equipment')));

    if (hasCustomActionWord) {
      classification = AI_POLICY.classifications.CUSTOM_TECHNICAL_WORK;
      detectedIntent = INTENTS.CUSTOM_TECHNICAL_WORK;
      isInformationOnly = false;
      needsProfessionalService = true;

      if (lower.includes('dataset') || lower.includes('data') || lower.includes('ecg') || lower.includes('eeg') || lower.includes('signal') || lower.includes('emg') || lower.includes('recording')) {
        technicalDomain = DOMAINS.BIOSIGNALS;
        actionType = 'analyze';
        const targetType = lower.includes('ecg') ? 'ECG dataset' : lower.includes('eeg') ? 'EEG dataset' : 'biomedical dataset';
        userObjective = `Request custom biomedical data analysis and signal processing for ${targetType}`;
        serviceTarget = 'research-and-development';
      } else if (lower.includes('gait') || lower.includes('biomechanic') || lower.includes('motion') || lower.includes('walking')) {
        technicalDomain = DOMAINS.GAIT_ANALYSIS;
        actionType = 'analyze';
        userObjective = 'Request custom gait analysis and kinematic movement evaluation';
        serviceTarget = 'research-and-development';
      } else if (lower.includes('build') || lower.includes('device') || lower.includes('hardware') || lower.includes('prototype') || lower.includes('develop')) {
        technicalDomain = DOMAINS.MEDICAL_DEVICES;
        actionType = 'build';
        userObjective = 'Request custom medical product design, prototyping, or hardware development';
        serviceTarget = 'medical-product-development';
      } else if (lower.includes('equipment') || lower.includes('hospital') || lower.includes('management') || lower.includes('procurement') || lower.includes('lifecycle')) {
        technicalDomain = DOMAINS.HTM;
        actionType = 'consult';
        userObjective = 'Request professional healthcare technology management and hospital equipment consultancy';
        serviceTarget = 'procurement-and-purchasing';
      } else {
        technicalDomain = DOMAINS.CLINICAL_ENGINEERING;
        actionType = 'consult';
        userObjective = 'Request custom technical engineering service';
        serviceTarget = 'technical-medical-technology-consultation';
      }

      return {
        detectedIntent,
        classification,
        technicalDomain,
        userObjective,
        actionType,
        isInformationOnly: false,
        needsProfessionalService: true,
        serviceTarget,
        urgency,
        rawQuery: sanitized,
      };
    }

    // Webinar, Lecture, Workshop & Professional Content Discovery
    const isWebinarQuery =
      lower.includes('webinar') ||
      lower.includes('webinars') ||
      lower.includes('seminar') ||
      lower.includes('seminars') ||
      lower.includes('lecture') ||
      lower.includes('lectures') ||
      lower.includes('workshop') ||
      lower.includes('workshops') ||
      lower.includes('masterclass') ||
      lower.includes('panel discussion') ||
      lower.includes('guest talk') ||
      lower.includes('round table') ||
      lower.includes('networking session') ||
      lower.includes('networking event') ||
      lower.includes('live stream') ||
      lower.includes('online session') ||
      ((lower.includes('do you have') || lower.includes('is there') || lower.includes('show me')) &&
        (lower.includes('anything about') || lower.includes('session') || lower.includes('talk') || lower.includes('lecture') || lower.includes('workshop') || lower.includes('webinar')));

    const isVideoQuery =
      lower.includes('video') ||
      lower.includes('videos') ||
      lower.includes('tutorial') ||
      lower.includes('tutorials') ||
      lower.includes('teach me') ||
      lower.includes('video recording') ||
      lower.includes('webinar recording') ||
      lower.includes('session recording') ||
      lower.includes('recorded webinar') ||
      lower.includes('recorded session') ||
      (lower.includes('watch') && (lower.includes('session') || lower.includes('talk') || lower.includes('video') || lower.includes('lecture')));

    if ((isWebinarQuery || isVideoQuery) && !hasCustomActionWord) {
      classification = AI_POLICY.classifications.GENERAL_INFORMATION;
      detectedIntent = isWebinarQuery ? INTENTS.WEBINAR_DISCOVERY : INTENTS.VIDEO_DISCOVERY;
      technicalDomain = DOMAINS.HTM;
      actionType = 'explain';
      isInformationOnly = true;
      userObjective = 'Discover public professional events, webinars, lectures, and educational video content';

      let mediaTopic = null;
      if (lower.includes('eeg')) mediaTopic = 'eeg';
      else if (lower.includes('ecg')) mediaTopic = 'ecg';
      else if (lower.includes('imu') || lower.includes('gait') || lower.includes('kinematic')) mediaTopic = 'imu';
      else if (lower.includes('equipment management') || lower.includes('medical equipment management') || lower.includes('lifecycle') || lower.includes('decommissioning')) mediaTopic = 'equipment lifecycle';
      else if (lower.includes('commercialization') || lower.includes('entrepreneurship') || lower.includes('business')) mediaTopic = 'commercialization';
      else if (lower.includes('standards') || lower.includes('regulations') || lower.includes('iso 13485') || lower.includes('iec') || lower.includes('safety')) mediaTopic = 'standards';
      else if (lower.includes('digital health') || lower.includes('digitalization') || lower.includes('telemetry')) mediaTopic = 'digital health';
      else if (lower.includes('career') || lower.includes('professional development') || lower.includes('pathways')) mediaTopic = 'professional development';
      else if (lower.includes('collaboration') || lower.includes('partner') || lower.includes('round table') || lower.includes('industry-academia')) mediaTopic = 'research collaboration';
      else if (lower.includes('replacement') || lower.includes('planning') || lower.includes('ventilator')) mediaTopic = 'replacement planning';
      else if (lower.includes('acceptance testing') || lower.includes('commissioning')) mediaTopic = 'acceptance testing';
      else if (lower.includes('device') || lower.includes('hardware') || lower.includes('prototype') || lower.includes('product development')) mediaTopic = 'medical devices';
      else if (lower.includes('biosignal') || lower.includes('signal processing')) mediaTopic = 'biosignals';

      return {
        detectedIntent,
        classification,
        technicalDomain,
        biomedicalTopic: mediaTopic,
        mediaTopic,
        userObjective,
        actionType,
        isInformationOnly: true,
        needsProfessionalService: false,
        rawQuery: sanitized,
      };
    }

    // Explicit Graduate Research Inquiries (Only when user explicitly asks about research or thesis)
    if (
      lower.includes('your research') ||
      lower.includes('what is your research') ||
      lower.includes('what is your research about') ||
      lower.includes('graduate research')
    ) {
      classification = AI_POLICY.classifications.GENERAL_INFORMATION;
      detectedIntent = INTENTS.RESEARCH_QUESTION;
      technicalDomain = DOMAINS.GAIT_ANALYSIS;
      actionType = 'explain';
      isInformationOnly = true;
      userObjective = 'Understand graduate research directions in gait analysis and biomechanics';

      return {
        detectedIntent,
        classification,
        technicalDomain,
        userObjective,
        actionType,
        isInformationOnly: true,
        requiresHumanConsultation: false,
        needsProfessionalService: false,
        rawQuery: sanitized,
      };
    }

    // Technical Specifications & Datasheet Queries
    if (
      lower.includes('specification') ||
      lower.includes('spec sheet') ||
      lower.includes('specs of') ||
      lower.includes('specs for') ||
      lower.includes('datasheet') ||
      lower.includes('battery life') ||
      lower.includes('b450') ||
      lower.includes('mx450') ||
      lower.includes('n12') ||
      lower.includes('mac 5500') ||
      lower.includes('mpu-6050') ||
      lower.includes('mpu6050') ||
      lower.includes('rad-97') ||
      lower.includes('invasive blood pressure') ||
      lower.includes('invasive pressure') ||
      lower.includes('does this patient monitor support')
    ) {
      classification = AI_POLICY.classifications.TECHNICAL_SPECIFICATION;
      detectedIntent = INTENTS.TECHNICAL_SPECIFICATION;
      technicalDomain = DOMAINS.MEDICAL_DEVICES;
      actionType = 'verify';
      isInformationOnly = true;
      userObjective = 'Retrieve verified manufacturer technical specifications';

      if (lower.includes('b450')) requestedEquipment = 'GE B450';
      else if (lower.includes('mx450')) requestedEquipment = 'Philips MX450';
      else if (lower.includes('n12')) requestedEquipment = 'Mindray N12';
      else if (lower.includes('mac 5500')) requestedEquipment = 'GE MAC 5500';
      else if (lower.includes('mpu-6050') || lower.includes('mpu6050')) requestedEquipment = 'MPU-6050';
      else if (lower.includes('rad-97')) requestedEquipment = 'Masimo Rad-97';
      else if (lower.includes('patient monitor')) requestedEquipment = 'GE B450';

      return {
        detectedIntent,
        classification,
        technicalDomain,
        requestedEquipment,
        userObjective,
        actionType,
        isInformationOnly: true,
        needsProfessionalService: false,
        rawQuery: sanitized,
      };
    }

    // Specialized Engineering & Practical Guidance Scenarios
    // 1. ECG Sampling Rate (Section 4)
    if (lower.includes('sampling rate') && (lower.includes('ecg') || lower.includes('ekg') || lower.includes('acquisition'))) {
      classification = AI_POLICY.classifications.BIOMEDICAL_TECHNOLOGY;
      detectedIntent = INTENTS.GENERAL_TECHNICAL_INQUIRY;
      technicalDomain = DOMAINS.BIOSIGNALS;
      actionType = 'explain';
      isInformationOnly = true;
      biomedicalTopic = 'ecg_sampling_rate';
      userObjective = 'Evaluate practical sampling rate and analog front-end bandwidth for ECG acquisition systems';
      return {
        detectedIntent,
        classification,
        technicalDomain,
        biomedicalTopic,
        userObjective,
        actionType,
        isInformationOnly: true,
        needsProfessionalService: false,
        rawQuery: sanitized,
      };
    }

    // 2. EEG Independent Component Analysis (Section 20)
    if (lower.includes('independent component analysis') || (lower.includes('ica') && lower.includes('eeg'))) {
      classification = AI_POLICY.classifications.GENERAL_INFORMATION;
      detectedIntent = INTENTS.GENERAL_TECHNICAL_INQUIRY;
      technicalDomain = DOMAINS.BIOSIGNALS;
      actionType = 'explain';
      isInformationOnly = true;
      biomedicalTopic = 'eeg_ica';
      userObjective = 'Understand Independent Component Analysis for EEG artifact decontamination';
      return {
        detectedIntent,
        classification,
        technicalDomain,
        biomedicalTopic,
        userObjective,
        actionType,
        isInformationOnly: true,
        needsProfessionalService: false,
        rawQuery: sanitized,
      };
    }

    // 3. Pulse Oximeter Purchasing Guidance (Section 20)
    if (lower.includes('pulse oximeter should i buy') || lower.includes('which pulse oximeter') || lower.includes('recommend a pulse oximeter')) {
      classification = AI_POLICY.classifications.PRODUCT_OR_EQUIPMENT;
      detectedIntent = INTENTS.GENERAL_TECHNICAL_INQUIRY;
      technicalDomain = DOMAINS.MEDICAL_DEVICES;
      actionType = 'select';
      isInformationOnly = true;
      biomedicalTopic = 'pulse_oximeter_selection';
      userObjective = 'Practical consumer and clinical guidance for pulse oximeter selection and specifications';
      return {
        detectedIntent,
        classification,
        technicalDomain,
        biomedicalTopic,
        userObjective,
        actionType,
        isInformationOnly: true,
        needsProfessionalService: false,
        rawQuery: sanitized,
      };
    }

    // 4. Movement Measurement Parameters for Non-Experts (Section 21)
    if (
      (lower.includes('measures movement') && (lower.includes('parameters matter') || lower.includes("don't know") || lower.includes('dont know'))) ||
      lower.includes('which parameters matter for movement')
    ) {
      classification = AI_POLICY.classifications.BIOMEDICAL_TECHNOLOGY;
      detectedIntent = INTENTS.GENERAL_TECHNICAL_INQUIRY;
      technicalDomain = DOMAINS.GAIT_ANALYSIS;
      actionType = 'explain';
      isInformationOnly = true;
      biomedicalTopic = 'movement_parameters';
      userObjective = 'Identify key motion measurement parameters and sensor specifications';
      return {
        detectedIntent,
        classification,
        technicalDomain,
        biomedicalTopic,
        userObjective,
        actionType,
        isInformationOnly: true,
        needsProfessionalService: false,
        rawQuery: sanitized,
      };
    }

    // 5. Unprocessed ECG Recordings Guidance (Section 6)
    if (
      lower.includes('have some ecg recordings') ||
      (lower.includes('recordings') && (lower.includes("don't know what to do") || lower.includes("dont know what to do")))
    ) {
      classification = AI_POLICY.classifications.CUSTOM_TECHNICAL_WORK;
      detectedIntent = INTENTS.CUSTOM_TECHNICAL_WORK;
      technicalDomain = DOMAINS.BIOSIGNALS;
      actionType = 'analyze';
      isInformationOnly = false;
      needsProfessionalService = true;
      serviceTarget = 'research-and-development';
      userObjective = 'Signal quality assessment, artifact filtering, and workflow scoping for ECG dataset';
      return {
        detectedIntent,
        classification,
        technicalDomain,
        userObjective,
        actionType,
        isInformationOnly: false,
        needsProfessionalService: true,
        serviceTarget,
        rawQuery: sanitized,
      };
    }

    // 6. Developing Custom Patient Monitor (Section 20)
    if (
      lower.includes('develop my own patient monitoring') ||
      lower.includes('develop our own patient monitoring') ||
      (lower.includes('patient monitor') && (lower.includes('develop') || lower.includes('build')))
    ) {
      classification = AI_POLICY.classifications.CUSTOM_TECHNICAL_WORK;
      detectedIntent = INTENTS.CUSTOM_TECHNICAL_WORK;
      technicalDomain = DOMAINS.MEDICAL_DEVICES;
      actionType = 'build';
      isInformationOnly = false;
      needsProfessionalService = true;
      serviceTarget = 'medical-product-development';
      userObjective = 'Medical device system architecture, AFE design, safety isolation, and prototype development';
      return {
        detectedIntent,
        classification,
        technicalDomain,
        userObjective,
        actionType,
        isInformationOnly: false,
        needsProfessionalService: true,
        serviceTarget,
        rawQuery: sanitized,
      };
    }

    // 7. Can Marye Help With a Biomedical Device? (Section 20)
    if (
      lower.includes('can marye help me with a biomedical device') ||
      lower.includes('can marye help with a biomedical device') ||
      lower.includes('help me with a biomedical device')
    ) {
      classification = AI_POLICY.classifications.SERVICE_DISCOVERY;
      detectedIntent = INTENTS.SERVICE_INQUIRY;
      technicalDomain = DOMAINS.MEDICAL_DEVICES;
      actionType = 'consult';
      isInformationOnly = false;
      needsProfessionalService = true;
      serviceTarget = 'medical-product-development';
      userObjective = 'Inquire about Marye\'s capabilities and advisory for biomedical device development';
      return {
        detectedIntent,
        classification,
        technicalDomain,
        userObjective,
        actionType,
        isInformationOnly: false,
        needsProfessionalService: true,
        serviceTarget,
        rawQuery: sanitized,
      };
    }

    // 8. Ventilator & Medical Equipment Replacement Planning (Section 14 & HTM)
    if (
      (lower.includes('ventilator') || lower.includes('equipment')) &&
      (lower.includes('replace') || lower.includes('replacement') || lower.includes('decommission') || lower.includes('obsolescen'))
    ) {
      classification = AI_POLICY.classifications.GENERAL_INFORMATION;
      detectedIntent = INTENTS.GENERAL_TECHNICAL_INQUIRY;
      technicalDomain = 'Healthcare Technology Management';
      actionType = 'explain';
      isInformationOnly = true;
      biomedicalTopic = 'ventilator_replacement';
      userObjective = 'Evaluate clinical equipment replacement planning, lifecycle cost analysis, MTBF, and obsolescence';
      return {
        detectedIntent,
        classification,
        technicalDomain,
        biomedicalTopic,
        userObjective,
        actionType,
        isInformationOnly: true,
        needsProfessionalService: false,
        rawQuery: sanitized,
      };
    }

    // 9. Medical Equipment Management Lifecycle (Specification to Decommissioning)
    if (
      lower.includes('equipment management') ||
      lower.includes('equipment lifecycle') ||
      (lower.includes('procurement') && lower.includes('decommission')) ||
      lower.includes('lifecycle management') ||
      lower.includes('from procurement to decommissioning') ||
      lower.includes('from specification to decommissioning')
    ) {
      classification = AI_POLICY.classifications.GENERAL_INFORMATION;
      detectedIntent = INTENTS.GENERAL_TECHNICAL_INQUIRY;
      technicalDomain = 'Healthcare Technology Management';
      actionType = 'explain';
      isInformationOnly = true;
      biomedicalTopic = 'equipment_lifecycle';
      userObjective = 'Understand the complete healthcare technology and medical equipment management lifecycle';
      return {
        detectedIntent,
        classification,
        technicalDomain,
        biomedicalTopic,
        userObjective,
        actionType,
        isInformationOnly: true,
        needsProfessionalService: false,
        rawQuery: sanitized,
      };
    }

    // 10. Medical Device Commercialization & Regulatory Pathways
    if (
      lower.includes('commercialization') ||
      lower.includes('commercialize') ||
      lower.includes('market readiness') ||
      (lower.includes('device') && lower.includes('business'))
    ) {
      classification = AI_POLICY.classifications.GENERAL_INFORMATION;
      detectedIntent = INTENTS.GENERAL_TECHNICAL_INQUIRY;
      technicalDomain = 'Standards, Regulations & Quality';
      actionType = 'explain';
      isInformationOnly = true;
      biomedicalTopic = 'device_commercialization';
      userObjective = 'Understand medical device translation, regulatory readiness (ISO 13485, CE/FDA), and commercialization';
      return {
        detectedIntent,
        classification,
        technicalDomain,
        biomedicalTopic,
        userObjective,
        actionType,
        isInformationOnly: true,
        needsProfessionalService: false,
        rawQuery: sanitized,
      };
    }

    // 11. Biomedical Engineering Careers & Professional Pathways
    if (
      lower.includes('career') ||
      lower.includes('careers') ||
      lower.includes('professional development') ||
      lower.includes('industry readiness')
    ) {
      classification = AI_POLICY.classifications.GENERAL_INFORMATION;
      detectedIntent = INTENTS.GENERAL_TECHNICAL_INQUIRY;
      technicalDomain = 'Professional Development';
      actionType = 'explain';
      isInformationOnly = true;
      biomedicalTopic = 'bme_careers';
      userObjective = 'Explore professional pathways, clinical engineering, R&D, and regulatory career development in BME';
      return {
        detectedIntent,
        classification,
        technicalDomain,
        biomedicalTopic,
        userObjective,
        actionType,
        isInformationOnly: true,
        needsProfessionalService: false,
        rawQuery: sanitized,
      };
    }

    // 12. Research & Collaboration Intent
    if (
      lower.includes('collaborat') ||
      lower.includes('research partner') ||
      lower.includes('industry-academia') ||
      lower.includes('industry–academia')
    ) {
      const isDirectCollab = lower.includes('i want to collaborate') || lower.includes('interested in collaborating') || lower.includes('looking for collaborator');
      classification = isDirectCollab ? AI_POLICY.classifications.SERVICE_DISCOVERY : AI_POLICY.classifications.GENERAL_INFORMATION;
      detectedIntent = isDirectCollab ? INTENTS.SERVICE_INQUIRY : INTENTS.GENERAL_TECHNICAL_INQUIRY;
      technicalDomain = 'Research & Collaboration';
      actionType = isDirectCollab ? 'collaborate' : 'explain';
      isInformationOnly = !isDirectCollab;
      needsProfessionalService = isDirectCollab;
      serviceTarget = 'research-and-development';
      biomedicalTopic = 'research_collaboration';
      userObjective = 'Explore interdisciplinary biomedical research partnerships and academic-industry collaboration';
      return {
        detectedIntent,
        classification,
        technicalDomain,
        biomedicalTopic,
        userObjective,
        actionType,
        isInformationOnly: !isDirectCollab,
        needsProfessionalService: isDirectCollab,
        serviceTarget: isDirectCollab ? serviceTarget : null,
        rawQuery: sanitized,
      };
    }

    // I. Public Biomedical Education Questions (What is X? How does X work? What does X measure?)
    // Must NOT assume research/thesis!
    if (
      lower.startsWith('what is') ||
      lower.startsWith('what are') ||
      lower.startsWith('how does') ||
      lower.startsWith('how do') ||
      lower.startsWith('what does') ||
      lower.includes('difference between') ||
      lower.includes('what should i consider before choosing')
    ) {
      classification = AI_POLICY.classifications.GENERAL_INFORMATION;
      detectedIntent = INTENTS.GENERAL_TECHNICAL_INQUIRY;
      actionType = 'explain';
      isInformationOnly = true;

      if (lower.includes('eeg')) {
        biomedicalTopic = 'eeg';
        technicalDomain = DOMAINS.BIOSIGNALS;
        userObjective = 'Understand Electroencephalography (EEG) signal principles and physiological basis';
      } else if (lower.includes('ecg')) {
        biomedicalTopic = 'ecg';
        technicalDomain = DOMAINS.BIOSIGNALS;
        userObjective = 'Understand Electrocardiography (ECG) cardiac signal principles';
      } else if (lower.includes('emg')) {
        biomedicalTopic = 'emg';
        technicalDomain = DOMAINS.BIOSIGNALS;
        userObjective = 'Understand Electromyography (EMG) muscle signal acquisition';
      } else if (lower.includes('ppg') || lower.includes('pulse oximet')) {
        biomedicalTopic = 'ppg';
        technicalDomain = DOMAINS.BIOSIGNALS;
        userObjective = 'Understand Photoplethysmography (PPG) and optical pulse oximetry principles';
      } else if (lower.includes('accelerometer') || lower.includes('gyroscope') || lower.includes('imu') || lower.includes('inertial')) {
        biomedicalTopic = 'imu';
        technicalDomain = DOMAINS.MEDICAL_DEVICES;
        userObjective = 'Understand inertial sensors, accelerometers, and motion sensing';
      } else if (lower.includes('gait analysis') || lower.includes('gait')) {
        biomedicalTopic = 'gait';
        technicalDomain = DOMAINS.GAIT_ANALYSIS;
        userObjective = 'Understand clinical and biomechanical gait analysis concepts';
      } else if (lower.includes('prosthetic') || lower.includes('assistive') || lower.includes('prosthesis')) {
        biomedicalTopic = 'prosthetics';
        technicalDomain = DOMAINS.REHABILITATION;
        userObjective = 'Understand prosthetic and assistive rehabilitation technologies';
      } else if (lower.includes('wearable health monitor') || lower.includes('wearable monitor') || (lower.includes('wearable') && lower.includes('monitor'))) {
        biomedicalTopic = 'wearable_health_monitor';
        technicalDomain = DOMAINS.MEDICAL_DEVICES;
        userObjective = 'Understand wearable health monitoring devices and sensors';
      } else if (lower.includes('wearable')) {
        biomedicalTopic = 'wearables';
        technicalDomain = DOMAINS.MEDICAL_DEVICES;
        userObjective = 'Understand wearable health monitoring devices and sensors';
      } else if (lower.includes('signal processing')) {
        biomedicalTopic = 'signal_processing';
        technicalDomain = DOMAINS.BIOSIGNALS;
        userObjective = 'Understand biomedical signal filtering, conditioning, and processing';
      } else if (lower.includes('artificial intelligence') || lower.includes('ai in healthcare')) {
        biomedicalTopic = 'ai_healthcare';
        technicalDomain = DOMAINS.AI_HEALTHCARE;
        userObjective = 'Understand applied AI and machine learning in healthcare';
      } else if (lower.includes('medical device')) {
        biomedicalTopic = 'medical_device';
        technicalDomain = DOMAINS.MEDICAL_DEVICES;
        userObjective = 'Understand medical device definitions, categories, and safety';
      } else if (lower.includes('what is a biomedical sensor') || lower.includes('what does a biomedical sensor measure') || lower === 'biomedical sensor') {
        biomedicalTopic = 'biomedical_sensor';
        technicalDomain = DOMAINS.MEDICAL_DEVICES;
        userObjective = 'Understand biomedical sensor definitions, transducers, and physiological transduction';
      } else if (lower.includes('biomedical sensor') || lower.includes('sensor')) {
        biomedicalTopic = 'sensor_selection';
        technicalDomain = DOMAINS.MEDICAL_DEVICES;
        userObjective = 'Understand biomedical sensor principles and selection considerations';
      }

      return {
        detectedIntent,
        classification,
        technicalDomain,
        biomedicalTopic,
        userObjective,
        actionType,
        isInformationOnly: true,
        needsProfessionalService: false,
        rawQuery: sanitized,
      };
    }

    // J. Technology Selection Guidance ("Which sensor can measure movement?", "Which sensor should I use?")
    if (
      lower.includes('which sensor') ||
      lower.includes('what sensor') ||
      lower.includes('sensor should i use') ||
      lower.includes('sensor can measure') ||
      lower.includes('recommend a sensor') ||
      lower.includes('choose a sensor')
    ) {
      classification = AI_POLICY.classifications.BIOMEDICAL_TECHNOLOGY;
      detectedIntent = INTENTS.GENERAL_TECHNICAL_INQUIRY;
      actionType = 'select';
      isInformationOnly = true;

      if (lower.includes('movement') || lower.includes('gait') || lower.includes('walking') || lower.includes('motion')) {
        biomedicalTopic = 'imu_selection';
        technicalDomain = DOMAINS.GAIT_ANALYSIS;
        userObjective = 'Identify suitable sensor technology for movement and gait telemetry';
      } else if (lower.includes('heart') || lower.includes('pulse')) {
        biomedicalTopic = 'cardiac_sensor';
        technicalDomain = DOMAINS.BIOSIGNALS;
        userObjective = 'Identify suitable cardiac or optical pulse sensor technology';
      } else {
        biomedicalTopic = 'sensor_selection';
        technicalDomain = DOMAINS.MEDICAL_DEVICES;
        userObjective = 'Evaluate sensor technologies for biomedical application';
      }

      return {
        detectedIntent,
        classification,
        technicalDomain,
        biomedicalTopic,
        userObjective,
        actionType,
        isInformationOnly: true,
        needsProfessionalService: false,
        rawQuery: sanitized,
      };
    }

    // L. Equipment Comparison / Procurement Assessment
    if (
      (lower.includes('compare') || lower.includes('vs') || lower.includes('difference between')) &&
      (lower.includes('monitor') || lower.includes('pump') || lower.includes('device') || lower.includes('model') || lower.includes('infusion'))
    ) {
      classification = AI_POLICY.classifications.PRODUCT_OR_EQUIPMENT;
      detectedIntent = INTENTS.PROCUREMENT_COMPARISON;
      technicalDomain = DOMAINS.HTM;
      actionType = 'analyze';
      isInformationOnly = false;
      needsProfessionalService = true;
      serviceTarget = 'procurement-and-purchasing';
      userObjective = 'Compare medical equipment specifications for procurement decision';

      return {
        detectedIntent,
        classification,
        technicalDomain,
        userObjective,
        actionType,
        isInformationOnly: false,
        needsProfessionalService: true,
        serviceTarget,
        rawQuery: sanitized,
      };
    }

    // M. Facility Requirements Engineering (e.g. 20-bed hospital, ICU ward)
    if (
      lower.includes('bed hospital') ||
      lower.includes('equipping a ward') ||
      lower.includes('icu equipment') ||
      lower.includes('need equipment for') ||
      lower.includes('planning to purchase')
    ) {
      classification = AI_POLICY.classifications.CONSULTATION;
      detectedIntent = INTENTS.REQUIREMENTS_ENGINEERING;
      technicalDomain = DOMAINS.HTM;
      actionType = 'consult';
      isInformationOnly = false;
      needsProfessionalService = true;
      serviceTarget = 'technical-specification';
      userObjective = 'Define clinical equipment specifications and hospital procurement framework';

      return {
        detectedIntent,
        classification,
        technicalDomain,
        userObjective,
        actionType,
        isInformationOnly: false,
        needsProfessionalService: true,
        serviceTarget,
        rawQuery: sanitized,
      };
    }

    // N. Explicit Academic Research Inquiries (Only when user explicitly mentions research, collaboration, or graduate study)
    if (
      (lower.includes('collaborat') || lower.includes('joint study') || lower.includes('phd') || lower.includes('co-author')) &&
      (lower.includes('research') || lower.includes('gait') || lower.includes('biosignal') || lower.includes('lab'))
    ) {
      classification = AI_POLICY.classifications.CONSULTATION;
      detectedIntent = INTENTS.RESEARCH_COLLABORATION;
      technicalDomain = DOMAINS.ACADEMIC;
      actionType = 'consult';
      isInformationOnly = false;
      needsProfessionalService = true;
      serviceTarget = 'research-and-development';
      userObjective = 'Propose or discuss academic research collaboration';

      return {
        detectedIntent,
        classification,
        technicalDomain,
        userObjective,
        actionType,
        isInformationOnly: false,
        needsProfessionalService: true,
        requiresHumanConsultation: true,
        serviceTarget,
        rawQuery: sanitized,
      };
    }

    // P. Academic Background & Curriculum (Gondar / Anna University)
    if (
      lower.includes('curriculum') ||
      lower.includes('anna university') ||
      lower.includes('gondar') ||
      lower.includes('education') ||
      lower.includes('degree') ||
      lower.includes('bachelor') ||
      lower.includes('bsc') ||
      lower.includes('b.sc') ||
      lower.includes('undergraduate') ||
      lower.includes('coursework') ||
      lower.includes('academic background')
    ) {
      classification = AI_POLICY.classifications.GENERAL_INFORMATION;
      detectedIntent = INTENTS.ACADEMIC_BACKGROUND;
      technicalDomain = DOMAINS.ACADEMIC;
      actionType = 'explain';
      isInformationOnly = true;
      userObjective = 'Review academic background and university curricula';

      return {
        detectedIntent,
        classification,
        technicalDomain,
        userObjective,
        actionType,
        isInformationOnly: true,
        rawQuery: sanitized,
      };
    }

    // Q. Clinical Experience in Ethiopia
    if (
      lower.includes('hospital') ||
      lower.includes('shine business') ||
      lower.includes('amhara') ||
      lower.includes('central gondar') ||
      lower.includes('clinical experience')
    ) {
      classification = AI_POLICY.classifications.GENERAL_INFORMATION;
      detectedIntent = INTENTS.CLINICAL_EXPERIENCE;
      technicalDomain = DOMAINS.CLINICAL_ENGINEERING;
      actionType = 'explain';
      isInformationOnly = true;
      userObjective = 'Review clinical engineering leadership and HTM history';

      return {
        detectedIntent,
        classification,
        technicalDomain,
        userObjective,
        actionType,
        isInformationOnly: true,
        rawQuery: sanitized,
      };
    }

    // R. Document & CV Download
    if (lower.includes('cv') || lower.includes('resume') || lower.includes('download pdf')) {
      classification = AI_POLICY.classifications.GENERAL_INFORMATION;
      detectedIntent = INTENTS.DOCUMENT_CV_REQUEST;
      technicalDomain = DOMAINS.ACADEMIC;
      actionType = 'explain';
      isInformationOnly = true;
      userObjective = 'Access verified academic CV or technical publications';

      return {
        detectedIntent,
        classification,
        technicalDomain,
        userObjective,
        actionType,
        isInformationOnly: true,
        rawQuery: sanitized,
      };
    }

    // Fallback General Analysis
    return {
      detectedIntent,
      classification,
      technicalDomain,
      requestedEquipment,
      userObjective,
      actionType,
      isInformationOnly,
      needsProfessionalService,
      serviceTarget: 'technical-medical-technology-consultation',
      pricingRequested,
      adminVerificationRequired,
      urgency,
      rawQuery: sanitized,
    };
  }
}

export default IntentEngine;
