/**
 * Biomedical Information & Service Concierge Engine
 *
 * Implements Requirements 1 to 32:
 * - Public-First Biomedical Knowledge Provider (signals, sensors, devices, biomechanics, AI)
 * - Authoritative representation of Marye Agegn's background, capabilities, and 11 services
 * - Adapts explanation level: accessible for public, rigorous for technical inquiries
 * - Service Protection: separates public concepts from custom professional execution
 * - Pricing Protection: never fabricates prices, routes to structured review
 * - Admin Verification: flags schedule, availability, and quotes for Marye's confirmation
 * - Contextual Consultation Memory & Direct Service Routing
 */

import { siteData } from '../../data/siteData.js';
import { AI_POLICY } from './aiPolicy.js';
import { IntentEngine, INTENTS, DOMAINS } from './intentEngine.js';
import { defaultKnowledgeRetriever } from './knowledgeRetriever.js';
import { defaultServiceRouter } from './serviceRouter.js';
import { TechnicalSourceRetriever } from './technicalSourceRetriever.js';
import { ConsultationStore } from './consultationStore.js';
import { searchWebinarsAndVideos } from '../../data/contentStore.js';
import { generateDynamicResponse } from './geminiService.js';

export class BiomedicalConcierge {
  /**
   * Main entry point: Evaluates query, classifies intent, generates tailored response,
   * structures consultation context, and routes to appropriate service.
   */
  static async processMessage(rawQuery = '', sessionContext = {}) {
    const staticResult = await this._processMessageStatic(rawQuery, sessionContext);
    
    // Attempt dynamic generation using Gemini
    let prevMessages = [];
    if (sessionContext.activeThreadId) {
      prevMessages = await ConsultationStore.getThreadMessages(sessionContext.activeThreadId);
    }
    
    const context = {
      detectedIntent: IntentEngine.analyzeMessage(rawQuery).detectedIntent,
      technicalDomain: IntentEngine.analyzeMessage(rawQuery).technicalDomain,
      requirements: staticResult.structuredRequirements,
      staticFallbackText: staticResult.replyText,
    };
    
    const dynamicText = await generateDynamicResponse(rawQuery, context, prevMessages);
    
    if (dynamicText) {
      staticResult.replyText = dynamicText;
    }
    
    return staticResult;
  }

  static async _processMessageStatic(rawQuery = '', sessionContext = {}) {
    const analysis = IntentEngine.analyzeMessage(rawQuery);
    const { detectedIntent, classification, technicalDomain, actionType, rawQuery: query } = analysis;
    const lower = query.toLowerCase();

    let replyText = '';
    let replyMetadata = {
      classification,
      technicalDomain,
      actionType,
      evidenceStatus: AI_POLICY.evidenceStatuses.VERIFIED_PRIMARY,
      sources: [],
    };
    let actionObj = null;
    let structuredRequirements = {
      identified: [],
      missing: [],
      technicalNeed: analysis.userObjective || '',
      pricingRequested: analysis.pricingRequested || false,
      adminVerificationRequired: analysis.adminVerificationRequired || false,
      recommendedService: null,
    };

    // =========================================================================
    // 1. SECURITY & PRIVACY GATES (Requirements 15 & 29)
    // =========================================================================
    if (analysis.isPromptInjection) {
      return {
        replyText: 'Security Policy: System instructions, architectural prompts, and server credentials remain private and protected. I am ready to assist with verified biomedical engineering inquiries.',
        replyMetadata: { classification: AI_POLICY.classifications.SENSITIVE_INFORMATION, isSecurityAlert: true },
        actionObj: null,
        structuredRequirements,
      };
    }

    if (analysis.isCredentialRequest) {
      return {
        replyText: 'Access Restricted: Secret keys, database credentials, API tokens, and administrative credentials cannot be disclosed. All privileged operations remain server-side and protected by Row Level Security.',
        replyMetadata: { classification: AI_POLICY.classifications.SENSITIVE_INFORMATION, isSecurityAlert: true },
        actionObj: null,
        structuredRequirements,
      };
    }

    if (analysis.userSuppliedSecret) {
      return {
        replyText: 'Security Warning: You appear to have submitted a sensitive API key or token. Please do not submit confidential credentials or private keys into the chat interface. I have discarded the sensitive token and can assist with your general biomedical inquiry safely.',
        replyMetadata: { classification: AI_POLICY.classifications.SENSITIVE_INFORMATION, isSecurityAlert: true },
        actionObj: null,
        structuredRequirements,
      };
    }

    if (classification === AI_POLICY.classifications.PRIVATE_INFORMATION) {
      return {
        replyText: 'Privacy Policy: Private personal phone numbers, residential addresses, confidential client records, and unreleased patient data are strictly protected and cannot be disclosed. For legitimate professional inquiries, please connect through the official Collaboration Desk.',
        replyMetadata: { classification: AI_POLICY.classifications.PRIVATE_INFORMATION },
        actionObj: { label: 'Open Collaboration Desk', href: '#contact' },
        structuredRequirements,
      };
    }

    if (classification === AI_POLICY.classifications.UNSUPPORTED_REQUEST) {
      return {
        replyText: 'Scope Notice: This request falls outside the scope of biomedical engineering advisory. As an engineering concierge, I assist with biomedical technology, medical device specifications, physiological signal processing, and clinical engineering services. I do not provide clinical medical diagnoses, prescribe medications, or develop non-biomedical software (such as financial trading systems).',
        replyMetadata: { classification: AI_POLICY.classifications.UNSUPPORTED_REQUEST },
        actionObj: { label: 'Explore Biomedical Services', href: '#services' },
        structuredRequirements,
      };
    }

    // =========================================================================
    // 2. CONSULTATION CONTINUATION & MEMORY (Requirement 16)
    // =========================================================================
    if (analysis.isContinueConsultation) {
      const activeThreadId = sessionContext.activeThreadId;
      const prevThread = await ConsultationStore.getLatestThread(activeThreadId);

      if (prevThread) {
        const reqs = prevThread.important_requirements || {};
        const identified = Array.isArray(reqs.identified) ? reqs.identified.join(', ') : 'Biomedical engineering consultation';
        const missing = Array.isArray(reqs.missing) && reqs.missing.length > 0 ? reqs.missing.join(', ') : 'None currently flagged';

        replyText = `**Resuming Previous Consultation Session:**\n\n` +
          `• **Domain:** ${prevThread.technical_domain || 'Biomedical Technology'}\n` +
          `• **Initial Objective:** ${prevThread.user_objective || prevThread.conversation_summary || 'General exploration'}\n` +
          `• **Requirements Established:** ${identified}\n` +
          `• **Pending Information:** ${missing}\n` +
          `• **Recommended Pathway:** ${prevThread.recommended_service || 'Technical Medical Technology Consultation'}\n\n` +
          `We have preserved your technical context. What would you like to refine, add, or advance in this consultation?`;
        
        replyMetadata = {
          classification: AI_POLICY.classifications.CONSULTATION,
          isResume: true,
          threadId: prevThread.id,
        };
        actionObj = { label: 'Refine Technical Inquiry', href: '#contact' };
        return { replyText, replyMetadata, actionObj, structuredRequirements: reqs };
      } else {
        replyText = `Welcome back. I did not detect an archived consultation thread for this browser session. Let me know what biomedical project, technology question, or service you would like to explore today.`;
        return {
          replyText,
          replyMetadata: { classification: AI_POLICY.classifications.CONSULTATION },
          actionObj: { label: 'Explore Services', href: '#services' },
          structuredRequirements,
        };
      }
    }

    // =========================================================================
    // 3. PRICING INQUIRIES (Requirement 13)
    // =========================================================================
    if (classification === AI_POLICY.classifications.PRICING) {
      structuredRequirements.pricingRequested = true;
      structuredRequirements.technicalNeed = 'Service pricing / rate estimation inquiry';
      structuredRequirements.recommendedService = 'Technical Medical Technology Consultation';
      structuredRequirements.missing = ['project scope', 'deliverables schedule', 'institutional requirements'];

      replyText = `Pricing depends on the specific scope, technical deliverables, and regulatory requirements of the request, so I cannot provide an unverified figure. Marye does not apply generic or automated fee schedules without understanding project parameters.\n\nThe appropriate next step is a consultation or service inquiry where you outline your requirements, timeline, and deliverables. This ensures an accurate, transparent technical proposal.\n\nWould you like to outline your project requirements through a consultation request?`;

      replyMetadata = {
        classification: AI_POLICY.classifications.PRICING,
        evidenceStatus: AI_POLICY.evidenceStatuses.ADMIN_VERIFICATION_REQUIRED,
        pricingRequested: true,
      };
      actionObj = { label: 'Request Consultation / Quotation', href: '#contact' };
      return { replyText, replyMetadata, actionObj, structuredRequirements };
    }

    // =========================================================================
    // 4. SERVICE AVAILABILITY & ADMIN VERIFICATION (Requirement 14)
    // =========================================================================
    if (classification === AI_POLICY.classifications.AVAILABILITY || analysis.adminVerificationRequired) {
      structuredRequirements.adminVerificationRequired = true;
      structuredRequirements.technicalNeed = 'Availability and project intake timeline verification';
      structuredRequirements.recommendedService = 'Technical Medical Technology Consultation';

      replyText = `**ADMIN VERIFICATION REQUIRED:**\n\n` +
        `Marye's current project intake capacity and scheduling require direct confirmation. Publicly, Marye is currently advancing graduate engineering research at Anna University while advising on selected healthcare technology and clinical engineering initiatives.\n\n` +
        `I have flagged this availability check for direct review. To confirm whether your project timeline aligns with current capacity, you can submit an inquiry through the Collaboration Desk or initiate a formal consultation thread.`;

      replyMetadata = {
        classification: AI_POLICY.classifications.AVAILABILITY,
        evidenceStatus: AI_POLICY.evidenceStatuses.ADMIN_VERIFICATION_REQUIRED,
        adminVerificationRequired: true,
      };
      actionObj = { label: 'Check Availability with Marye', href: '#contact' };
      return { replyText, replyMetadata, actionObj, structuredRequirements };
    }

    // =========================================================================
    // 5. UNDERSTANDING MARYE AGEGN (Requirement 2)
    // =========================================================================
    if (analysis.isProfileQuery) {
      const p = siteData.personal;
      replyText = `**Marye Agegn — Biomedical Engineer & Graduate Researcher**\n\n` +
        `${p.summary}\n\n` +
        `**Key Technical Capabilities & Scope:**\n` +
        `• **Scalable Medical Devices & Hardware:** Designing accessible, cost-effective therapeutic devices (such as her Grade-A rTMS capstone design at the University of Gondar), circuit topology, and IEC 60601 electrical safety compliance.\n` +
        `• **Healthcare Technology Management (HTM):** Over 3 years of frontline clinical engineering in Ethiopia—serving as Technical Manager at Shine Business PLC (Addis Ababa), Biomedical Officer for the Central Gondar Zone Health Department, and Hospital Biomedical Engineer with the Amhara Regional Health Bureau.\n` +
        `• **Graduate Research in Gait Analysis & Mobility:** Currently at Anna University, Chennai, developing ambulatory movement monitoring frameworks using lower-back inertial sensors, single/dual-task walking protocols, and explainable machine learning.\n` +
        `• **Applied Healthcare AI & Biosignals:** Digital filtering, feature extraction, and deep learning across ECG, EEG, EMG, and kinematic movement time-series.\n\n` +
        `You can bring technical equipment challenges, sensor selection needs, dataset analysis tasks, or medical device development inquiries to her attention.`;

      replyMetadata = {
        classification: AI_POLICY.classifications.GENERAL_INFORMATION,
        evidenceStatus: AI_POLICY.evidenceStatuses.VERIFIED_PRIMARY,
        sources: ['Official Curriculum Vitae', 'Anna University CEG Academic Dossier', 'Site Profile'],
      };
      actionObj = { label: 'View Professional Experience', href: '#experience' };
      return { replyText, replyMetadata, actionObj, structuredRequirements };
    }

    // =========================================================================
    // 6. SERVICE DISCOVERY & "WHAT SERVICES DO YOU OFFER?" (Requirement 12)
    // =========================================================================
    if (analysis.isServicesQuery) {
      const services = defaultKnowledgeRetriever.getServices();
      replyText = `**Biomedical Engineering Services Offered by Marye Agegn:**\n\n` +
        `Marye provides 11 structured engineering services across medical devices, clinical operations, and applied research:\n\n` +
        `1. **Technical Specification:** Structuring clinical workflows into rigorous engineering parameters and tender benchmarks.\n` +
        `2. **Procurement and Purchasing:** Pre-procurement technical assessment, vendor compliance, and total cost of ownership evaluation.\n` +
        `3. **Commissioning & Acceptance Testing:** Pre-clinical electrical safety testing, baseline calibration, and protocol sign-off.\n` +
        `4. **Installation Support:** Environmental readiness, spatial layout, system interconnects, and functional verification.\n` +
        `5. **Decommissioning:** Structured medical equipment retirement, hazard isolation, and inventory deregistration.\n` +
        `6. **Technical Medical Technology Consultation:** Independent advisory on hospital equipment management, failure root-cause analysis, and planning.\n` +
        `7. **Market Study and Product Design:** Translating unmet clinical needs into practical medical product architectures and low-resource designs.\n` +
        `8. **Medical Device Regulations & Standards:** IEC 60601 safety review, ISO 13485 concepts, and ISO 14971 risk management guidance.\n` +
        `9. **Research & Development:** Biosignal processing, gait analysis modeling, and explainable AI for healthcare telemetry.\n` +
        `10. **Healthcare System Digitalization:** Digital equipment uptime logging, asset tracking workflows, and patient telemetry systems.\n` +
        `11. **Medical Product Development:** Early-stage device prototyping, sensor integration, microcontroller firmware, and benchtop testing.\n\n` +
        `If you are unsure which service fits your project, tell me what problem you are solving and I will analyze your requirements.`;

      replyMetadata = {
        classification: AI_POLICY.classifications.SERVICE_DISCOVERY,
        evidenceStatus: AI_POLICY.evidenceStatuses.VERIFIED_PRIMARY,
        sources: ['Authoritative Service Catalog (siteData.js)'],
      };
      actionObj = { label: 'Explore Full Service Scope', href: '#services' };
      return { replyText, replyMetadata, actionObj, structuredRequirements };
    }

    if (lower.includes("i don't know which service i need") || (analysis.isServicesQuery && actionType === 'consult')) {
      replyText = `I can help you determine the most appropriate pathway. To identify the right service, let me know:\n\n` +
        `1. **What is your core objective?** (e.g., evaluating hospital equipment, selecting a sensor, processing physiological data, or prototyping a medical device)\n` +
        `2. **What is your current phase?** (e.g., initial concept exploration, pre-procurement tender, or active engineering problem)\n` +
        `3. **What data or hardware do you currently have?**\n\n` +
        `Based on these details, I will guide you directly to the relevant service or prepare a preliminary consultation outline.`;

      replyMetadata = {
        classification: AI_POLICY.classifications.SERVICE_DISCOVERY,
      };
      actionObj = { label: 'Start Technical Consultation', href: '#contact' };
      return { replyText, replyMetadata, actionObj, structuredRequirements };
    }

    // =========================================================================
    // 7. CUSTOM TECHNICAL WORK / SERVICE REQUESTS (Requirements 9, 10, 11, 27)
    // "Can you analyze my dataset?", "Can you build this device?"
    // =========================================================================
    if (classification === AI_POLICY.classifications.CUSTOM_TECHNICAL_WORK || analysis.needsProfessionalService) {
      // 7A. Unprocessed ECG Recordings Guidance (Section 6)
      if (
        lower.includes('have some ecg recordings') ||
        (lower.includes('recordings') && (lower.includes("don't know what to do") || lower.includes("dont know what to do")))
      ) {
        structuredRequirements.identified = ['recorded ECG dataset', 'initial data assessment'];
        structuredRequirements.missing = ['file format (.edf, .csv, .dat)', 'sampling frequency', 'number of leads/channels', 'analytical objective'];
        structuredRequirements.technicalNeed = 'Signal quality assessment, artifact filtering, and workflow scoping for ECG dataset';
        structuredRequirements.recommendedService = 'Research & Development (Biosignals)';

        replyText = `When you have raw ECG recordings, the best first step is to clarify what information you want to extract and evaluate the quality of the data. A standard evaluation workflow involves:\n\n` +
          `1. **Signal Quality Inspection:** Checking whether the recording has baseline drift (from patient breathing), 50/60 Hz powerline interference, or motion artifacts from loose electrodes.\n` +
          `2. **File Format & Technical Metadata:** Confirming the file format (e.g. European Data Format .edf, CSV, text, or MATLAB .mat), the sampling rate (e.g. 250 Hz, 500 Hz), and how many leads/channels were recorded.\n` +
          `3. **Defining the Analytical Output:** Deciding whether you need:\n` +
          `   - Heart Rate Variability (HRV) metrics in the time and frequency domains\n` +
          `   - Automated QRS complex and arrhythmia detection\n` +
          `   - Measurement of specific waveform intervals (PR, QRS, QT intervals)\n` +
          `   - Clean, publication-ready filtered signals\n\n` +
          `I can freely explain any of these signal processing steps. If you need someone to inspect your actual data files, clean the recordings, or build an automated analysis pipeline, that is handled as a structured project under:\n\n` +
          `**Research and Development (Biosignals & Applied Engineering)**\n` +
          `*Includes signal quality audits, digital filtering, and feature extraction tailored to your dataset.*`;

        replyMetadata = {
          classification: AI_POLICY.classifications.CUSTOM_TECHNICAL_WORK,
          serviceId: 'research-and-development',
          requirements: structuredRequirements,
        };
        actionObj = { label: 'Route to Biosignal Analysis Service', href: '#services', serviceId: 'research-and-development' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // 7B. Custom Patient Monitor Prototyping (Section 20)
      if (
        lower.includes('patient monitor') ||
        lower.includes('patient monitoring') ||
        lower.includes('develop my own patient') ||
        lower.includes('develop our own patient')
      ) {
        structuredRequirements.identified = ['patient monitoring device', 'multi-parameter sensing', 'custom hardware development'];
        structuredRequirements.missing = ['target physiological parameters (ECG, SpO2, NIBP, Temp)', 'form factor (wearable vs bedside)', 'power source (battery vs mains)', 'communication protocol (BLE, Wi-Fi, USB)', 'IEC 60601-1 safety requirements'];
        structuredRequirements.technicalNeed = 'Medical device system architecture, AFE design, safety isolation, and prototype development';
        structuredRequirements.recommendedService = 'Medical Product Development';

        replyText = `Developing a custom patient monitoring device involves integrating sensing, signal conditioning, electrical safety, and embedded software. The core engineering architecture consists of:\n\n` +
          `1. **Analog Front-End (AFE) Subsystems:** Dedicated biopotential amplifiers (for ECG), optical transimpedance circuits (for PPG/SpO₂), and pressure transducer bridges (for NIBP).\n` +
          `2. **Patient Isolation & Electrical Safety:** Patient-connected leads must incorporate galvanic isolation barriers (optocouplers, digital isolators, isolated DC-DC converters) complying with **IEC 60601-1** (Type BF or Type CF cardiac floating).\n` +
          `3. **Microcontroller & Embedded Firmware:** Processing units (such as ARM Cortex-M or dual-core microcontrollers) for real-time ADC sampling, digital filtering, alarm logic, and display rendering.\n` +
          `4. **Enclosure & User Interface:** Touchscreen or display interface, battery management, and wireless telemetry (BLE/Wi-Fi).\n\n` +
          `Because this requires customized schematic design, component selection, PCB layout, and benchtop testing, Marye provides this through:\n\n` +
          `**Medical Product Development & Prototyping**\n` +
          `*Covers clinical specification formulation, circuit architecture, firmware, and safety-compliant benchtop validation.*`;

        replyMetadata = {
          classification: AI_POLICY.classifications.CUSTOM_TECHNICAL_WORK,
          serviceId: 'medical-product-development',
          requirements: structuredRequirements,
        };
        actionObj = { label: 'Route to Medical Product Development', href: '#services', serviceId: 'medical-product-development' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // 7C. Can Marye Help With a Biomedical Device? (Section 20)
      if (
        lower.includes('can marye help me with a biomedical device') ||
        lower.includes('can marye help with a biomedical device') ||
        lower.includes('help me with a biomedical device')
      ) {
        structuredRequirements.identified = ['biomedical device inquiry', 'engineering assistance'];
        structuredRequirements.technicalNeed = 'Device design, prototyping, regulatory safety, or clinical evaluation';
        structuredRequirements.recommendedService = 'Medical Product Development / Technical Consultation';

        replyText = `Yes. Marye provides engineering support across the medical device lifecycle—combining hardware design, physiological signal conditioning, clinical safety compliance, and hospital deployment experience:\n\n` +
          `• **Concept & Specifications:** Structuring clinical requirements into technical parameters, bill of materials (BOM), and architecture.\n` +
          `• **Hardware & Prototyping:** Designing analog front-end circuits, sensor integration, microcontroller firmware, and benchtop prototypes.\n` +
          `• **Safety & Standards Compliance:** Aligning designs with **IEC 60601-1** electrical safety, Type BF/CF isolation, and **ISO 14971** risk management.\n` +
          `• **Clinical & Hospital Integration:** Leveraging over 3 years of frontline clinical engineering and equipment management experience in Ethiopian hospitals.\n\n` +
          `To help guide you directly, what type of biomedical device are you developing or working with (for example, a wearable motion/vital sensor, a patient monitor, a therapeutic device, or an assistive system)?\n\n` +
          `The most relevant service pathways are:\n` +
          `• **Medical Product Development** (for prototyping and hardware engineering)\n` +
          `• **Technical Medical Technology Consultation** (for independent advisory and specification review)`;

        replyMetadata = {
          classification: AI_POLICY.classifications.SERVICE_DISCOVERY,
          serviceId: 'medical-product-development',
          requirements: structuredRequirements,
        };
        actionObj = { label: 'Explore Medical Product Development', href: '#services', serviceId: 'medical-product-development' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      if (actionType === 'analyze' && (lower.includes('gait') || technicalDomain === DOMAINS.GAIT_ANALYSIS)) {
        structuredRequirements.identified = ['gait analysis', 'kinematic movement assessment', 'custom dataset'];
        structuredRequirements.missing = ['sensor configuration / model', 'sampling frequency', 'recording protocol (single vs dual-task)', 'desired output parameters'];
        structuredRequirements.technicalNeed = 'Custom gait dataset processing and kinematic analysis';
        structuredRequirements.recommendedService = 'Research & Development (Gait Analysis & Biomechanics)';

        replyText = `Analyzing a custom gait dataset requires an evaluation of your specific recordings—including sensor orientation, coordinate frame alignment, sampling frequency, and whether walking bouts were captured under single-task or dual-task conditions. The typical engineering workflow involves:\n\n` +
          `1. **Sensor Calibration & Drift Compensation:** Correcting inertial integration drift and gravity vectors.\n` +
          `2. **Temporal-Spatial Segmentation:** Extracting initial contacts (heel strikes), toe-offs, step time, stride regularity, and gait symmetry.\n` +
          `3. **Feature Modeling & Clinical Biomarkers:** Quantifying dynamic stability indices and cadence variations.\n\n` +
          `Because dataset-specific processing depends on your hardware configuration and research/clinical goals, this is handled through a structured engineering consultation.\n\n` +
          `The most relevant service for your project is:\n` +
          `**Research and Development (Applied Biomedical R&D)**\n` +
          `*Covers biosignal conditioning, kinematic sensor modeling, and explainable computational analysis.*`;

        replyMetadata = {
          classification: AI_POLICY.classifications.CUSTOM_TECHNICAL_WORK,
          serviceId: 'research-and-development',
          requirements: structuredRequirements,
        };
        actionObj = { label: 'Route to Research & Development Service', href: '#services', serviceId: 'research-and-development' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      if (actionType === 'analyze' && (lower.includes('ecg') || lower.includes('eeg') || lower.includes('signal') || lower.includes('dataset'))) {
        structuredRequirements.identified = ['physiological signal dataset', 'artifact handling & filtering', 'custom analysis'];
        structuredRequirements.missing = ['file format (.edf, .csv, .mat)', 'number of channels & lead configuration', 'sampling frequency', 'intended diagnostic / analytical metrics'];
        const signalLabel = lower.includes('ecg') ? 'ECG dataset' : lower.includes('eeg') ? 'EEG dataset' : 'biosignal';
        structuredRequirements.technicalNeed = `Custom ${signalLabel} conditioning, filtering, and feature extraction`;
        structuredRequirements.recommendedService = 'Research & Development / Technical Specification';

        const ackPrefix = (lower.includes('webinar') || lower.includes('watched') || lower.includes('video'))
          ? 'Thank you for following our educational webinar! '
          : '';

        replyText = `${ackPrefix}Processing raw physiological data is an active engineering task rather than general information. The standard pipeline includes:\n\n` +
          `1. **Quality Audit & Artifact Removal:** Baseline wander filtering (high-pass ~0.5Hz for ECG), notch filtering for powerline interference (50/60Hz), and motion artifact attenuation.\n` +
          `2. **Morphological Segmentation:** Detecting QRS complexes (Pan-Tompkins algorithm), fiducial points, or EEG frequency-band power decomposition.\n` +
          `3. **Feature Extraction & Output:** Spectral power density, Heart Rate Variability (HRV) metrics, or classification vectors.\n\n` +
          `Because execution depends on your exact file format, lead montage, sampling frequency, and target deliverables, this dataset-specific work is handled through a consultation.\n\n` +
          `The most relevant service for your request is:\n` +
          `**Research and Development (Biosignals & Applied Engineering)**`;

        replyMetadata = {
          classification: AI_POLICY.classifications.CUSTOM_TECHNICAL_WORK,
          serviceId: 'research-and-development',
          requirements: structuredRequirements,
        };
        actionObj = { label: 'Route to Biosignal Analysis Service', href: '#services', serviceId: 'research-and-development' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      if (actionType === 'build' || lower.includes('build') || lower.includes('develop')) {
        structuredRequirements.identified = ['medical device concept', 'hardware / embedded prototyping', 'custom system design'];
        structuredRequirements.missing = ['sensing modality', 'wearable vs benchtop constraints', 'power budget & battery life', 'communication protocol (BLE, WiFi, USB)', 'IEC 60601 safety class'];
        structuredRequirements.technicalNeed = 'Medical product development, circuit architecture, and prototype engineering';
        structuredRequirements.recommendedService = 'Medical Product Development';

        replyText = `Developing a custom biomedical device transitions from conceptual design to hardware engineering and clinical safety. The standard development pathway involves:\n\n` +
          `1. **Requirements Formulation:** Defining clinical sensing parameters, sensor dynamic range, resolution, and sampling bandwidth.\n` +
          `2. **Hardware Architecture:** Analog front-end (AFE) conditioning, microcontroller selection, power management, and safety-critical electrical isolation (IEC 60601-1 Type BF/CF).\n` +
          `3. **Firmware & Prototyping:** Real-time data acquisition, digital filtering on embedded targets, and benchtop functional validation.\n\n` +
          `To build or specify this complete system, Marye provides structured engineering through:\n` +
          `**Medical Product Development & Early-Stage Engineering**\n` +
          `*Translating clinical problems into engineering requirements, circuit topology, and prototype validation.*`;

        replyMetadata = {
          classification: AI_POLICY.classifications.CUSTOM_TECHNICAL_WORK,
          serviceId: 'medical-product-development',
          requirements: structuredRequirements,
        };
        actionObj = { label: 'Route to Medical Product Development', href: '#services', serviceId: 'medical-product-development' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      if (
        actionType === 'consult' ||
        lower.includes('equipment') ||
        lower.includes('hospital') ||
        lower.includes('management') ||
        lower.includes('htm') ||
        serviceTarget === 'procurement-and-purchasing'
      ) {
        structuredRequirements.identified = ['hospital medical equipment management', 'healthcare technology infrastructure', 'operational planning'];
        structuredRequirements.missing = ['facility scale / bed count', 'target equipment modalities (imaging, critical care, surgical)', 'existing CMMS software', 'procurement / replacement budget cycle'];
        structuredRequirements.technicalNeed = 'Healthcare Technology Management (HTM) and equipment lifecycle consultancy';
        structuredRequirements.recommendedService = 'Procurement, Purchasing & Equipment Lifecycle Management';

        const ackPrefix = (lower.includes('webinar') || lower.includes('watched') || lower.includes('video') || lower.includes('lecture'))
          ? 'Thank you for following our educational session! '
          : '';

        replyText = `${ackPrefix}Managing healthcare technology and hospital medical equipment across its operational lifecycle requires structured clinical engineering governance. Key phases include:\n\n` +
          `1. **Needs Assessment & Technical Specification:** Defining clinical workflows, infrastructure prerequisites (HVAC, power isolation, radiation shielding), and comprehensive tender specifications.\n` +
          `2. **Procurement & Commissioning:** Rigorous vendor evaluation, acceptance testing against IEC 60601 electrical safety standards, and CMMS asset onboarding.\n` +
          `3. **Maintenance & Replacement Governance:** Scheduling preventive maintenance, tracking Mean Time Between Failures (MTBF), calculating Cost of Service Ratios (COSR), and retirement planning.\n\n` +
          `To assist your facility with tailored equipment management protocols, technology audit, or procurement advisory, Marye provides professional consultancy through:\n\n` +
          `**Procurement, Purchasing & Equipment Lifecycle Management**\n` +
          `*Delivering independent technical specifications, acceptance testing protocols, and hospital asset governance.*`;

        replyMetadata = {
          classification: AI_POLICY.classifications.CUSTOM_TECHNICAL_WORK,
          serviceId: 'procurement-and-purchasing',
          requirements: structuredRequirements,
        };
        actionObj = { label: 'Route to Equipment Management Consultancy', href: '#services', serviceId: 'procurement-and-purchasing' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }
    }

    // =========================================================================
    // 7.5 WEBINAR, LECTURE & PROFESSIONAL CONTENT DISCOVERY
    // Evaluated before static topic explanations so media inquiries link to the hub
    // =========================================================================
    if (detectedIntent === INTENTS.WEBINAR_DISCOVERY || detectedIntent === INTENTS.VIDEO_DISCOVERY) {
      const { webinars: matchedWebinars, videos: matchedVideos } = searchWebinarsAndVideos(analysis.biomedicalTopic || query);

      if (matchedWebinars.length === 0 && matchedVideos.length === 0) {
        replyText = `Currently, there is no scheduled or published recorded session specifically matching "${query}" in our public registry.\n\n` +
          `• **Available Focus Areas:** Our platform regularly features content across Healthcare Technology Management, Medical Equipment Lifecycles, Medical Device Commercialization, Regulatory Standards (ISO 13485 / IEC 60601), and Biomedical Data Science.\n` +
          `• **Explore the Hub:** You can browse all upcoming and recorded sessions in the Webinars & Events hub, or suggest a collaborative topic via the Contact Desk.`;

        replyMetadata = {
          classification: AI_POLICY.classifications.GENERAL_INFORMATION,
          evidenceStatus: AI_POLICY.evidenceStatuses.VERIFIED_PRIMARY,
          sources: ['Public Event Registry & Video Library'],
        };
        actionObj = { label: 'Browse Webinars & Events', href: '#webinars' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      let text = `**Biomedical & Healthcare Technology Knowledge Sessions Found:**\n\n`;
      if (matchedWebinars.length > 0) {
        text += `**Webinars, Lectures & Events:**\n`;
        matchedWebinars.slice(0, 3).forEach((w) => {
          const timingLabel = w.status === 'Upcoming' ? `Scheduled: ${w.date} (${w.time || 'TBA'})` : w.status === 'Live' ? '🔴 LIVE NOW' : 'Recorded Archive';
          text += `• **[${w.contentType || 'Event'}] ${w.title}** (${w.duration})\n  *Status: ${timingLabel} | Category: ${w.category}*\n  *${w.description.substring(0, 140)}...*\n  *Speaker: ${w.speaker} (${w.organization || 'Clinical Technology Hub'})*\n`;
        });
        text += `\n`;
      }
      if (matchedVideos.length > 0) {
        text += `**Video Demonstrations & Tutorials:**\n`;
        matchedVideos.slice(0, 2).forEach((v) => {
          text += `• **[${v.contentType || 'Video'}] ${v.title}** (${v.duration})\n  *Category: ${v.category} | ${v.description.substring(0, 120)}...*\n`;
        });
        text += `\n`;
      }
      text += `You can watch on-demand recordings, join live discussions, or download presentation slides and reference materials directly in the Webinars & Events hub.`;

      replyText = text;
      replyMetadata = {
        classification: AI_POLICY.classifications.GENERAL_INFORMATION,
        evidenceStatus: AI_POLICY.evidenceStatuses.VERIFIED_PRIMARY,
        sources: ['Public Webinar Registry & Video Library'],
        webinarCount: matchedWebinars.length,
        videoCount: matchedVideos.length,
      };
      actionObj = { label: 'Explore Webinars & Video Library', href: '#webinars' };
      return { replyText, replyMetadata, actionObj, structuredRequirements };
    }

    // =========================================================================
    // 8. PUBLIC BIOMEDICAL KNOWLEDGE PROVIDER (Requirements 3 & 5)
    // Clear, practical, natural answers to general questions without pushing services!
    // =========================================================================
    if (
      classification === AI_POLICY.classifications.GENERAL_INFORMATION ||
      classification === AI_POLICY.classifications.BIOMEDICAL_TECHNOLOGY ||
      classification === AI_POLICY.classifications.PRODUCT_OR_EQUIPMENT
    ) {
      // Topic: EEG Independent Component Analysis (ICA) (Section 20)
      if (
        analysis.biomedicalTopic === 'eeg_ica' ||
        lower.includes('independent component analysis') ||
        (lower.includes('ica') && lower.includes('eeg'))
      ) {
        replyText = `**Independent Component Analysis (ICA) in EEG** is a computational technique used to separate multi-channel scalp EEG recordings into statistically independent neural and artifactual source signals.\n\n` +
          `• **The Practical Problem:** Electrodes placed on the scalp record a linear mixture of true cerebral activity along with much larger physiological noise—most notably ocular blinks (EOG), cardiac electrical pulses (ECG), and jaw/scalp muscle tension (EMG).\n` +
          `• **How ICA Works:**\n` +
          `  - ICA assumes that the underlying neural and artifactual sources are non-Gaussian and statistically independent from one another.\n` +
          `  - Algorithms (such as Infomax or FastICA) estimate an "unmixing matrix" that decomposes the mixed scalp channels into distinct spatial Independent Components (ICs).\n` +
          `• **Clinical & Practical Value:**\n` +
          `  - Once an artifact component (such as a characteristic frontal eye blink) is identified, it can be mathematically zeroed out.\n` +
          `  - Reconstructing the EEG without that component leaves a clean cerebral recording without altering the underlying brain wave frequencies or having to discard valuable epochs of patient data.\n` +
          `• **Operational Requirements:** ICA requires multiple recording channels (typically 16 to 64+ channels), consistent electrode contact impedance, and sufficient recording duration to ensure reliable matrix convergence.`;

        replyMetadata = {
          classification: AI_POLICY.classifications.GENERAL_INFORMATION,
          evidenceStatus: AI_POLICY.evidenceStatuses.SUPPORTED_SCIENTIFIC,
          sources: ['Biomedical Signal Processing & Clinical Neurophysiology Principles'],
        };
        actionObj = { label: 'Explore Biosignal Topics', href: '#skills' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // Topic: EEG
      if (analysis.biomedicalTopic === 'eeg' || (lower.includes('what is eeg') || lower === 'eeg')) {
        replyText = `**Electroencephalography (EEG)** is a non-invasive biomedical technique used to record the brain's spontaneous electrical activity from the surface of the scalp.\n\n` +
          `• **Physiological Source:** It measures the summation of post-synaptic potentials generated synchronously by large populations of cortical pyramidal neurons perpendicular to the cerebral cortex.\n` +
          `• **Signal Characteristics:** EEG signals are very small—typically between 10 to 100 microvolts (µV)—making them sensitive to environmental noise, muscle movement (EMG artifacts), and ocular movement (EOG artifacts).\n` +
          `• **Standard Frequency Bands:**\n` +
          `  - **Delta (0.5 – 4 Hz):** Deep, dreamless sleep and pathological encephalopathy.\n` +
          `  - **Theta (4 – 8 Hz):** Drowsiness, meditation, and memory encoding.\n` +
          `  - **Alpha (8 – 13 Hz):** Relaxed, awake state with eyes closed (prominent over the occipital lobe).\n` +
          `  - **Beta (13 – 30 Hz):** Active thinking, focus, problem-solving, and alertness.\n` +
          `  - **Gamma (> 30 Hz):** High-level cognitive processing, attention, and sensory binding.\n` +
          `• **Clinical Applications:** Diagnosing epilepsy and seizure disorders, monitoring sleep architecture, assessing depth of anesthesia, and brain-computer interface (BCI) research.`;

        replyMetadata = {
          classification: AI_POLICY.classifications.GENERAL_INFORMATION,
          evidenceStatus: AI_POLICY.evidenceStatuses.SUPPORTED_SCIENTIFIC,
          sources: ['Standard Clinical Neurophysiology & Biomedical Instrumentation Principles'],
        };
        actionObj = { label: 'Explore Biosignal Capabilities', href: '#skills' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // Topic: ECG Sampling Rate & Acquisition Engineering (Section 4)
      if (
        analysis.biomedicalTopic === 'ecg_sampling_rate' ||
        (lower.includes('sampling rate') && (lower.includes('ecg') || lower.includes('ekg') || lower.includes('acquisition')))
      ) {
        replyText = `**Recommended Sampling Rates for ECG Acquisition:**\n\n` +
          `The appropriate sampling rate for an ECG acquisition system depends on whether you are designing for clinical diagnostics, continuous bedside monitoring, or basic heart rate tracking:\n\n` +
          `• **Diagnostic 12-Lead ECG (Clinical Grade): 500 Hz to 1000 Hz**\n` +
          `  - Clinical standards (such as IEC 60601-2-25 and AHA guidelines) mandate an analog diagnostic bandwidth of **0.05 Hz to 150 Hz** for adults (up to 250 Hz for pediatric diagnostics).\n` +
          `  - According to the Nyquist-Shannon sampling theorem, the absolute minimum rate is 300 Hz ($2 \\times 150\\text{ Hz}$). In practice, **500 Hz to 1000 Hz** is standard to accurately resolve high-frequency QRS notches, pacemaker spikes, and late potentials without signal distortion.\n\n` +
          `• **Continuous Bedside & Ambulatory Holter Monitoring: 250 Hz to 500 Hz**\n` +
          `  - Monitoring bandwidth is typically restricted to **0.5 Hz to 40 Hz** to prioritize rhythm tracking while filtering respiratory baseline wander and muscle tremor.\n` +
          `  - A sampling rate of **250 Hz** (or 360 Hz, as in the standard MIT-BIH Arrhythmia Database) provides an optimal trade-off between waveform fidelity, memory storage, and battery consumption.\n\n` +
          `• **Basic Heart Rate Tracking & Consumer Wearables: 125 Hz to 250 Hz**\n` +
          `  - For R-peak timing and Heart Rate Variability (HRV) metrics, **125 Hz to 200 Hz** can suffice with peak interpolation.\n\n` +
          `• **Critical Hardware Considerations:**\n` +
          `  - **Anti-Aliasing Filter:** An analog low-pass filter must precede the ADC with a cutoff below the Nyquist limit.\n` +
          `  - **ADC Resolution:** Use a 16-bit to 24-bit delta-sigma ADC (such as the TI ADS129x family) to capture microvolt cardiac potentials in the presence of DC half-cell electrode offset voltages (which can reach ±300 mV).`;

        replyMetadata = {
          classification: AI_POLICY.classifications.BIOMEDICAL_TECHNOLOGY,
          evidenceStatus: AI_POLICY.evidenceStatuses.SUPPORTED_SCIENTIFIC,
          sources: ['IEC 60601-2-25 Diagnostic ECG Standards & AHA Recommendations for ECG Recording'],
        };
        actionObj = { label: 'Explore Medical Device Engineering', href: '#skills' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // Topic: ECG
      if (analysis.biomedicalTopic === 'ecg' || (lower.includes('what is ecg') || lower.includes('what is an ecg') || lower === 'ecg')) {
        replyText = `An electrocardiogram (ECG / EKG), or **Electrocardiography**, records the electrical activity of the heart using electrodes placed on the body. It is commonly used to observe heart rhythm and electrical patterns.\n\n` +
          `• **How It Works:** As the heart beats, electrical currents spread through the atria and ventricles, creating minute potential differences detectable across the skin surface.\n` +
          `• **The Classic Waveform Components:**\n` +
          `  - **P Wave:** Atrial depolarization (activation).\n` +
          `  - **QRS Complex:** Ventricular depolarization (the large sharp deflection, typically ~1 mV in amplitude).\n` +
          `  - **T Wave:** Ventricular repolarization (recovery of the ventricular myocardium).\n` +
          `  - **PR and QT Intervals:** Measure critical electrical conduction times across the atrioventricular (AV) node and ventricular myocardium.\n` +
          `• **Instrumental Specifications:** Clinical diagnostic ECGs monitor from 0.05 Hz to 150 Hz to preserve wave morphology, whereas bedside monitoring filters typically operate from 0.5 Hz to 40 Hz to minimize baseline wander and muscle noise.\n` +
          `• **Clinical Applications:** Detecting arrhythmias (atrial fibrillation, ventricular tachycardia), myocardial infarction (ST-elevation / depression), ischemia, and conduction blocks.`;

        replyMetadata = {
          classification: AI_POLICY.classifications.GENERAL_INFORMATION,
          evidenceStatus: AI_POLICY.evidenceStatuses.SUPPORTED_SCIENTIFIC,
          sources: ['Clinical Electrophysiology & IEC 60601-2-27 ECG Monitoring Standards'],
        };
        actionObj = { label: 'Explore Medical Device Projects', href: '#projects' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // Topic: Which pulse oximeter should I buy? / Buying Guidance (Section 20)
      if (
        analysis.biomedicalTopic === 'pulse_oximeter_selection' ||
        lower.includes('pulse oximeter should i buy') ||
        lower.includes('which pulse oximeter') ||
        lower.includes('recommend a pulse oximeter')
      ) {
        replyText = `**Practical Guidance for Choosing a Pulse Oximeter:**\n\n` +
          `When selecting a pulse oximeter, the right choice depends on whether you need it for personal home spot-checking, sports/wellness, or clinical patient monitoring:\n\n` +
          `• **1. Personal / Home Health Spot-Checking (Fingertip Units):**\n` +
          `  - **Form Factor:** Compact all-in-one clip that clamps onto the finger.\n` +
          `  - **Key Features to Look For:**\n` +
          `    - **Perfusion Index (PI):** Displays pulse signal strength (0.02% to 20%). This indicates whether blood flow in your finger is strong enough for an accurate reading.\n` +
          `    - **Plethysmogram (PPG Waveform) Display:** An OLED/TFT display showing the rhythmic pulsatile wave. An erratic or flat wave signals motion or cold fingers.\n` +
          `    - **Accuracy Standards:** Look for compliance with ISO 80601-2-61 (typically ±2% in the 70%–100% SpO₂ range).\n\n` +
          `• **2. Clinical / Continuous Monitoring (Handheld or Tabletop):**\n` +
          `  - **Form Factor:** Dedicated display unit with interchangeable reusable or disposable finger/earlobe sensor probes.\n` +
          `  - **Key Features:** Configurable audio/visual alarms (for hypoxia or bradycardia/tachycardia), extended battery runtime, and multi-patient memory.\n` +
          `  - **Sensors:** Compatibility with pediatric, neonatal, and adult probes.\n\n` +
          `• **Important Considerations:**\n` +
          `  - Dark nail polish, cold extremities, and severe movement can cause temporary false readings.\n` +
          `  - For clinical diagnosis or patient management, ensure the unit carries FDA 510(k) clearance or CE medical device certification.\n\n` +
          `If you are evaluating hospital equipment (such as patient monitors with integrated Masimo or Nellcor SpO₂), I can provide verified manufacturer specifications.`;

        replyMetadata = {
          classification: AI_POLICY.classifications.PRODUCT_OR_EQUIPMENT,
          evidenceStatus: AI_POLICY.evidenceStatuses.SUPPORTED_SCIENTIFIC,
          sources: ['ISO 80601-2-61 Pulse Oximeter Standards & Clinical Equipment Guides'],
        };
        actionObj = { label: 'Explore Medical Equipment', href: '#projects' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // Topic: Movement Measurement Parameters for Non-Experts (Section 21)
      if (
        analysis.biomedicalTopic === 'movement_parameters' ||
        (lower.includes('measures movement') && (lower.includes('parameters matter') || lower.includes("don't know") || lower.includes('dont know'))) ||
        lower.includes('which parameters matter for movement')
      ) {
        replyText = `When you are measuring movement with a biomedical or sensor device, you don't need to know all the technical terminology in advance. To evaluate what parameters matter for your application, consider these practical factors:\n\n` +
          `• **1. What Type of Movement Are You Measuring?**\n` +
          `  - **Daily Walking & Posture:** Tracking steps, walking cadence, and body balance involves moderate speeds and smooth movement.\n` +
          `  - **Tremor or Shaking:** Rapid, small oscillations (e.g. 4 Hz to 12 Hz in neurological conditions) require high frequency sensitivity and low sensor noise.\n` +
          `  - **Impacts & High Speed:** Sudden jumps, foot strikes, or falls require a wide dynamic range so the sensor does not saturate.\n\n` +
          `• **2. Key Sensor Parameters That Matter:**\n` +
          `  - **Axes (Degrees of Freedom):** Accelerometers measure linear movement (forward/back, up/down, side-to-side) and tilt against gravity. Gyroscopes measure rotational speed (turning or twisting). A 6-axis unit (accelerometer + gyroscope) is standard for human motion.\n` +
          `  - **Dynamic Range:** ±2g to ±4g is ideal for normal walking. For running or athletic impacts, ±8g to ±16g is necessary to prevent peak clipping.\n` +
          `  - **Sampling Rate:** 50 Hz to 100 Hz (samples per second) is plenty for everyday walking; 200 Hz or higher is needed for rapid sports kinematics or impact analysis.\n` +
          `  - **Placement:** Attaching the sensor firmly against the lower back (lumbar L4–L5) captures overall body center-of-mass, while placing it on the ankle or foot captures step strikes.\n\n` +
          `• **3. Desired Output:**\n` +
          `  - Do you want raw acceleration numbers, orientation angles (degrees of tilt), or clinical summaries (step count, walking symmetry, sway score)?\n\n` +
          `These parameters will help you evaluate what you have. If you need assistance selecting or integrating a sensor system for a specific project, Marye can assist through a technical consultation.`;

        replyMetadata = {
          classification: AI_POLICY.classifications.BIOMEDICAL_TECHNOLOGY,
          evidenceStatus: AI_POLICY.evidenceStatuses.SUPPORTED_SCIENTIFIC,
          sources: ['Biomechanical Kinematics & Ambulatory Motion Tracking Guides'],
        };
        actionObj = { label: 'Discuss Sensor Requirements', href: '#contact' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // Topic: Biomedical Sensor Definition (Section 3)
      if (
        analysis.biomedicalTopic === 'biomedical_sensor' ||
        lower === 'what is a biomedical sensor?' ||
        lower === 'what is a biomedical sensor' ||
        lower.includes('what is a biosensor') ||
        lower.includes('what does a biomedical sensor measure')
      ) {
        replyText = `A **biomedical sensor** (or biosensor) is a specialized transducer that detects a physical, chemical, or biological event from the human body and converts it into a measurable electrical signal.\n\n` +
          `• **Common Types of Biomedical Sensors:**\n` +
          `  - **Biopotential Electrodes:** Measure ionic currents from muscle and neural tissue (ECG for the heart, EEG for the brain, EMG for skeletal muscles).\n` +
          `  - **Optical Sensors (Photoplethysmography - PPG):** Use red and infrared light absorption to measure blood volume pulses, heart rate, and oxygen saturation (SpO₂).\n` +
          `  - **Inertial Sensors (Accelerometers & Gyroscopes):** Measure body acceleration, tilt, angular velocity, and posture.\n` +
          `  - **Pressure & Force Sensors:** Measure blood pressure (oscillometric/invasive) or ground-reaction foot forces in gait analysis.\n` +
          `  - **Thermal Sensors (Thermistors & IR Sensors):** Measure core or surface body temperature.\n` +
          `  - **Electrochemical Sensors:** Measure chemical concentrations, such as enzymatic glucose test strips.\n\n` +
          `• **Core Engineering Requirement:** A biomedical sensor must be biocompatible (safe for skin contact per ISO 10993), electrically isolated from mains voltages (compliant with IEC 60601-1), and designed to minimize motion artifacts.`;

        replyMetadata = {
          classification: AI_POLICY.classifications.GENERAL_INFORMATION,
          evidenceStatus: AI_POLICY.evidenceStatuses.SUPPORTED_SCIENTIFIC,
          sources: ['Biomedical Sensors and Measurement Principles'],
        };
        actionObj = { label: 'Explore Sensor Technologies', href: '#skills' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // Topic: Wearable Health Monitor Definition (Section 3)
      if (
        analysis.biomedicalTopic === 'wearable_health_monitor' ||
        lower.includes('what is a wearable health monitor') ||
        lower.includes('what is a wearable monitor') ||
        lower.includes('what is a wearable device')
      ) {
        replyText = `A **wearable health monitor** is an autonomous, non-invasive electronic device designed to be worn directly on the body—or integrated into clothing—to continuously track physiological vitals and physical activity during daily life.\n\n` +
          `• **Common Parameters Tracked:** Heart rate and rhythm (optical PPG or dry-electrode ECG), blood oxygenation (SpO₂), skin temperature, respiratory rate, and physical movement (via 3-axis accelerometers for steps, active bouts, and sleep tracking).\n` +
          `• **Core System Components:**\n` +
          `  - **Miniaturized Sensors:** Low-profile transducers that maintain continuous contact with the body.\n` +
          `  - **Low-Power Microcontroller:** Embedded processors that filter signals and execute algorithms while conserving battery.\n` +
          `  - **Wireless Telemetry:** Bluetooth Low Energy (BLE) or cellular IoT to synchronize data securely with a smartphone or cloud health platform.\n` +
          `  - **Power Management:** Rechargeable lithium-polymer batteries designed for multi-day runtime.\n\n` +
          `• **Key Applications:** Chronic disease management (cardiac arrhythmia monitoring, hypertension tracking), post-operative recovery, elderly fall detection, and athletic performance analysis.`;

        replyMetadata = {
          classification: AI_POLICY.classifications.GENERAL_INFORMATION,
          evidenceStatus: AI_POLICY.evidenceStatuses.SUPPORTED_SCIENTIFIC,
          sources: ['Wearable Health Monitoring Systems Literature & ISO Standards'],
        };
        actionObj = { label: 'Explore Wearable Projects', href: '#projects' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // Topic: Prosthetic Device Definition (Section 3)
      if (
        analysis.biomedicalTopic === 'prosthetic_device' ||
        analysis.biomedicalTopic === 'prosthetics' ||
        lower.includes('what is a prosthetic device') ||
        lower.includes('what is a prosthesis')
      ) {
        replyText = `A **prosthetic device** (or prosthesis) is an artificial appliance designed to replace the function, appearance, or anatomy of a missing body part lost due to trauma, surgery, or congenital conditions.\n\n` +
          `• **Major Categories of Prosthetics:**\n` +
          `  - **Upper-Limb Prostheses:** Replacing hands, wrists, or full arms. These range from passive cosmetic limbs and body-powered cable systems to **myoelectric bionic arms** that detect Electromyography (EMG) signals from residual muscles to control motorized finger grip.\n` +
          `  - **Lower-Limb Prostheses:** Replacing feet, shanks (transtibial), or full knees and thighs (transfemoral). Modern lower-limb prostheses use dynamic energy-storing carbon fiber blades or microprocessor-controlled knees (MPKs) that adapt resistance in real-time for stable walking on ramps and stairs.\n` +
          `  - **Internal Prostheses:** Implants such as artificial joint replacements (hip, knee), heart valves, and vascular grafts.\n\n` +
          `• **Engineering Disciplines Involved:** Biomechanics, biocompatible materials (titanium, carbon composite, silicone), sensor integration, and rehabilitation engineering.`;

        replyMetadata = {
          classification: AI_POLICY.classifications.GENERAL_INFORMATION,
          evidenceStatus: AI_POLICY.evidenceStatuses.SUPPORTED_SCIENTIFIC,
          sources: ['Prosthetics and Orthotics Engineering Principles'],
        };
        actionObj = { label: 'Explore Biomechanics Focus', href: '#skills' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // Topic: Difference between ECG and EEG
      if (lower.includes('difference between ecg and eeg') || lower.includes('difference between eeg and ecg')) {
        replyText = `**Key Differences Between ECG and EEG:**\n\n` +
          `| Parameter | Electrocardiogram (ECG) | Electroencephalogram (EEG) |\n` +
          `| :--- | :--- | :--- |\n` +
          `| **Organ Measured** | Heart (Cardiac muscle) | Brain (Cerebral cortical neurons) |\n` +
          `| **Signal Amplitude** | ~0.5 to 4.0 millivolts (mV) | ~10 to 100 microvolts (µV) — *100x to 1000x smaller* |\n` +
          `| **Frequency Range** | 0.05 Hz – 150 Hz | 0.5 Hz – 50+ Hz (Delta, Theta, Alpha, Beta, Gamma) |\n` +
          `| **Electrode Placement** | Chest and limbs (3, 5, or 12 leads) | Scalp surface (International 10–20 System) |\n` +
          `| **Key Waveforms** | P-QRS-T complex | Continuous oscillatory rhythmic bands |\n` +
          `| **Noise Vulnerability** | Motion artifacts, baseline drift | Highly sensitive to blink (EOG), muscle (EMG), and RF noise |\n` +
          `| **Primary Purpose** | Arrhythmia, ischemia, heart health | Epilepsy, sleep staging, cognitive state, coma |`;

        replyMetadata = {
          classification: AI_POLICY.classifications.GENERAL_INFORMATION,
          evidenceStatus: AI_POLICY.evidenceStatuses.SUPPORTED_SCIENTIFIC,
          sources: ['Biomedical Instrumentation & Physiological Measurements Reference'],
        };
        actionObj = { label: 'View Biomedical Skills', href: '#skills' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // Topic: Accelerometer & Inertial Measurement Unit (IMU)
      if (
        analysis.biomedicalTopic === 'imu' ||
        analysis.biomedicalTopic === 'imu_selection' ||
        lower.includes('accelerometer') ||
        lower.includes('which sensor can measure movement') ||
        lower.includes('sensor should i use to measure gait') ||
        lower.includes('measure gait')
      ) {
        replyText = `For measuring human movement and gait, an **Inertial Measurement Unit (IMU)** is the primary practical choice.\n\n` +
          `• **How It Works:** An IMU combines a 3-axis **accelerometer** (which measures linear acceleration in m/s² or g, including gravity) and a 3-axis **gyroscope** (which measures angular velocity in degrees/s or rad/s). Many also include a 3-axis **magnetometer** for heading reference (a 9-DoF unit).\n` +
          `• **Why IMUs are Used for Gait:** Placed on the lower back (lumbar L4/L5) or shank/foot, an IMU provides continuous kinematic time-series data outside the laboratory. With sensor fusion algorithms (such as Madgwick or Kalman filtering), orientation and acceleration vectors yield initial contact (heel strike), toe-off, stride regularity, cadence, and step symmetry.\n` +
          `• **Key Selection Considerations:**\n` +
          `  - **Sampling Rate:** 50 Hz to 100 Hz is generally sufficient for normal walking; 200 Hz+ is recommended for running or rapid impacts.\n` +
          `  - **Dynamic Range:** ±2g to ±4g for slow walking; ±8g to ±16g if measuring high-impact foot strikes.\n` +
          `  - **Gyroscope Bias Stability:** Low bias drift is critical to avoid cumulative angle integration error.\n` +
          `  - **Form Factor & Battery:** Small footprint and low-power BLE wireless telemetry ensure natural patient movement without altered gait mechanics.`;

        replyMetadata = {
          classification: AI_POLICY.classifications.BIOMEDICAL_TECHNOLOGY,
          evidenceStatus: AI_POLICY.evidenceStatuses.SUPPORTED_SCIENTIFIC,
          sources: ['Biomechanical Kinematics & Wearable Sensor Literature'],
        };
        actionObj = { label: 'Explore Gait Research', href: '#research' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // Topic: Pulse Oximeter & PPG
      if (analysis.biomedicalTopic === 'ppg' || lower.includes('pulse oximeter') || lower.includes('how does a pulse oximeter work')) {
        replyText = `A **pulse oximeter** non-invasively measures functional arterial oxygen saturation (SpO₂) and pulse rate using **photoplethysmography (PPG)**.\n\n` +
          `• **The Optical Principle:** The device shines two specific wavelengths of light through a translucent vascular tissue bed (such as a fingertip or earlobe):\n` +
          `  1. **Red Light (~660 nm):** Deoxygenated hemoglobin (Hb) absorbs more red light than oxygenated hemoglobin.\n` +
          `  2. **Infrared Light (~940 nm):** Oxygenated hemoglobin (HbO₂) absorbs more infrared light than deoxygenated hemoglobin.\n` +
          `• **Calculation (The Ratio of Ratios):** A photodetector measures the transmitted light. The signal has a constant baseline (DC component from skin, bone, and venous blood) and a pulsatile component (AC component from arterial cardiac pulsation). By comparing the ratio of AC/DC at red and infrared wavelengths, the device calculates SpO₂ based on calibration curves.\n` +
          `• **Operational Limitations:** Readings can be impaired by low peripheral perfusion (hypothermia, shock), severe motion artifacts, dark nail polish, and abnormal hemoglobins (carboxyhemoglobin).`;

        replyMetadata = {
          classification: AI_POLICY.classifications.GENERAL_INFORMATION,
          evidenceStatus: AI_POLICY.evidenceStatuses.SUPPORTED_SCIENTIFIC,
          sources: ['ISO 80601-2-61 Pulse Oximeter Equipment Standards'],
        };
        actionObj = { label: 'Explore Medical Devices', href: '#projects' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // Topic: Sensor Selection Principles
      if (lower.includes('what should i consider before choosing a biomedical sensor') || lower.includes('choosing a biomedical sensor')) {
        replyText = `**Key Criteria Before Selecting a Biomedical Sensor:**\n\n` +
          `1. **Target Physiological Bandwidth:** Ensure your sampling frequency satisfies the Nyquist theorem (fs >= 2 * fmax, practically 4–5x the maximum signal frequency). For example, ECG requires ~250–500 Hz, while body temperature requires < 1 Hz.\n` +
          `2. **Sensitivity & Dynamic Range:** The sensor must resolve the smallest clinically meaningful variation without saturating during maximum physiological peaks or movement.\n` +
          `3. **Motion Artifact Susceptibility:** Evaluate mechanical coupling, electrode-skin interface impedance, and whether active shielding or differential sensing is required.\n` +
          `4. **Electrical Safety & Isolation:** Any patient-connected sensor must comply with **IEC 60601-1** electrical isolation standards (Type BF for body-conductive connection, Type CF for direct cardiac contact).\n` +
          `5. **Biocompatibility & Ergonomics:** Skin-contact materials must conform to **ISO 10993** (cytotoxicity, irritation, and sensitization standards).\n` +
          `6. **Power Budget & Telemetry:** For wearable devices, evaluate supply voltage, current consumption during active sampling vs sleep mode, and data transmission protocol (BLE, ANT+, or onboard logging).`;

        replyMetadata = {
          classification: AI_POLICY.classifications.BIOMEDICAL_TECHNOLOGY,
          evidenceStatus: AI_POLICY.evidenceStatuses.SUPPORTED_SCIENTIFIC,
          sources: ['IEC 60601-1 Medical Electrical Safety & ISO 10993 Biocompatibility Standards'],
        };
        actionObj = { label: 'Consult on Sensor Selection', href: '#contact' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // Topic: Gait Analysis
      if (analysis.biomedicalTopic === 'gait' || lower.includes('what is gait analysis')) {
        replyText = `**Gait analysis** is the systematic study and measurement of human locomotion—how a person walks, runs, and maintains dynamic balance.\n\n` +
          `• **The Gait Cycle:** A full cycle begins when one foot contacts the ground (initial contact) and ends when that same foot touches the ground again. It consists of:\n` +
          `  - **Stance Phase (~60%):** Foot is in contact with the ground (initial contact, loading response, mid-stance, terminal stance, pre-swing).\n` +
          `  - **Swing Phase (~40%):** Foot is in the air advancing forward (initial swing, mid-swing, terminal swing).\n` +
          `• **Key Measurable Parameters:**\n` +
          `  - **Temporal-Spatial:** Walking speed, cadence (steps/min), stride length, step width, and step-time variability.\n` +
          `  - **Kinematics:** Joint angles and angular velocities of the hip, knee, ankle, and pelvis.\n` +
          `  - **Kinetics:** Ground reaction forces (GRF) and joint moments.\n` +
          `• **Measurement Technologies:** Traditionally conducted in motion capture laboratories with optical infrared cameras and force plates. Increasingly conducted via **wearable inertial sensors (IMUs)** for ambulatory, real-world continuous monitoring.\n` +
          `• **Applications:** Post-stroke rehabilitation, Parkinson's disease mobility tracking, fall risk assessment in older adults, sports performance, and orthopedic surgery recovery.`;

        replyMetadata = {
          classification: AI_POLICY.classifications.GENERAL_INFORMATION,
          evidenceStatus: AI_POLICY.evidenceStatuses.SUPPORTED_SCIENTIFIC,
          sources: ['Clinical Biomechanics & Gait Analysis Principles'],
        };
        actionObj = { label: 'Explore Research Directions', href: '#research' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // Topic: AI in Healthcare
      if (analysis.biomedicalTopic === 'ai_healthcare' || lower.includes('artificial intelligence in healthcare') || lower.includes('ai in healthcare')) {
        replyText = `**Artificial Intelligence (AI) in Healthcare** involves applying machine learning, deep neural networks, and computer vision to improve medical diagnostics, patient monitoring, and clinical workflows.\n\n` +
          `• **Primary Biomedical Domains:**\n` +
          `  - **Biosignal Telemetry:** Automated arrhythmia detection in continuous ECG, epileptic spike detection in EEG, and sleep staging.\n` +
          `  - **Medical Imaging:** Automated lesion detection in chest X-rays, brain MRI segmentation, and CT reconstruction.\n` +
          `  - **Ambulatory Movement Monitoring:** Wearable IMU time-series modeling for gait pathology detection and fall risk prediction.\n` +
          `• **The Explainability Imperative (XAI):** In healthcare, "black-box" models pose safety risks. Explainable AI frameworks (such as SHAP, Integrated Gradients, and attention mechanisms) reveal *which* physiological features or wave segments drove the model's decision, enabling clinical trust and regulatory validation under FDA and EU MDR software as a medical device (SaMD) guidance.`;

        replyMetadata = {
          classification: AI_POLICY.classifications.GENERAL_INFORMATION,
          evidenceStatus: AI_POLICY.evidenceStatuses.SUPPORTED_SCIENTIFIC,
          sources: ['FDA Digital Health Center of Excellence & AI/ML SaMD Frameworks'],
        };
        actionObj = { label: 'View Applied AI Focus', href: '#research' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // Topic: Medical Device Definition
      if (analysis.biomedicalTopic === 'medical_device' || lower.includes('what is a medical device')) {
        replyText = `A **medical device** is an instrument, apparatus, appliance, software, implant, reagent, or material intended by the manufacturer to be used for human beings for specific medical purposes—including diagnosis, prevention, monitoring, treatment, or alleviation of disease or injury.\n\n` +
          `• **Key Distinction:** Unlike pharmaceuticals, a medical device achieves its principal intended action primarily through physical, mechanical, electrical, or software means, rather than pharmacological, immunological, or metabolic mechanisms.\n` +
          `• **Regulatory Classification (Risk-Based):**\n` +
          `  - **Class I (Low Risk):** Basic hospital beds, stethoscopes, manual wheelchairs (subject to general controls).\n` +
          `  - **Class II (Moderate Risk):** Multi-parameter patient monitors, infusion pumps, ECG machines, powered wheelchairs.\n` +
          `  - **Class III (High Risk / Life-Sustaining):** Implantable pacemakers, heart valves, deep brain stimulators (requires rigorous premarket clinical trials).\n` +
          `• **Governing Standards:** **IEC 60601-1** (electrical safety), **ISO 13485** (quality management), and **ISO 14971** (risk management).`;

        replyMetadata = {
          classification: AI_POLICY.classifications.GENERAL_INFORMATION,
          evidenceStatus: AI_POLICY.evidenceStatuses.SUPPORTED_SCIENTIFIC,
          sources: ['FDA 21 CFR 860 & EU Medical Device Regulation (EU 2017/745)'],
        };
        actionObj = { label: 'Explore Regulations & Standards', href: '#services' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // Topic: Ventilator & Medical Equipment Replacement Planning (Section 14)
      if (
        analysis.biomedicalTopic === 'ventilator_replacement' ||
        (lower.includes('ventilator') && (lower.includes('replace') || lower.includes('decommission') || lower.includes('old'))) ||
        (lower.includes('replacement planning') || lower.includes('replace an old ventilator'))
      ) {
        replyText = `**Medical Equipment Replacement Planning: Criteria for Ventilators & Critical Care Assets:**\n\n` +
          `Hospitals do not retire life-support equipment based on device age alone. Healthcare Technology Management (HTM) and Clinical Engineering teams use a multi-factor risk and economic model:\n\n` +
          `1. **Cost of Service Ratio (COSR):**\n` +
          `   - If cumulative annual maintenance and repair costs exceed **50% to 60%** of the replacement purchase price, the device enters the active replacement queue.\n\n` +
          `2. **Reliability & Mean Time Between Failures (MTBF):**\n` +
          `   - Frequent pneumatic valve degradation, turbine wear, or recurring flow-sensor drift increases unscheduled downtime. For life-support ventilators, unpredictable uptime directly compromises patient safety.\n\n` +
          `3. **OEM End-of-Support (EOS) & Parts Availability:**\n` +
          `   - When original equipment manufacturers discontinue proprietary replacement parts, battery assemblies, or software updates, continued operation exposes the facility to severe liability and unserviceability.\n\n` +
          `4. **Technological & Clinical Obsolescence:**\n` +
          `   - Older mechanical ventilators may lack modern lung-protective ventilation modes (e.g., adaptive pressure control, esophageal pressure monitoring, integrated non-invasive high-flow oxygen) and cannot interface with modern hospital electronic medical record (EMR) systems via HL7/FHIR protocols.\n\n` +
          `5. **Safety Alerts & Regulatory Recalls:**\n` +
          `   - Devices subject to repeated Class I recalls or unresolvable design issues (such as sound-abatement foam degradation or software calculation errors) are prioritized for immediate decommissioning.\n\n` +
          `• **Related Session:** You can view our recorded lecture **"Medical Technology Replacement Planning: Clinical, Economic, and Risk Models"** in the Webinars & Events hub.`;

        replyMetadata = {
          classification: AI_POLICY.classifications.GENERAL_INFORMATION,
          evidenceStatus: AI_POLICY.evidenceStatuses.SUPPORTED_SCIENTIFIC,
          sources: ['WHO Healthcare Technology Management Guidelines & Clinical Engineering Asset Assessment Frameworks'],
        };
        actionObj = { label: 'View Replacement Planning Lecture', href: '#webinars' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // Topic: Medical Equipment Management Lifecycle (Section 4)
      if (
        analysis.biomedicalTopic === 'equipment_lifecycle' ||
        lower.includes('equipment lifecycle') ||
        (lower.includes('procurement') && lower.includes('decommission')) ||
        lower.includes('from specification to decommissioning')
      ) {
        replyText = `**The Medical Equipment Management Lifecycle:**\n\n` +
          `Healthcare Technology Management (HTM) encompasses the complete operational journey of clinical assets across 15 interconnected stages:\n\n` +
          `1. **Need Identification:** Identifying clinical service gaps, patient volume requirements, and facility priorities.\n` +
          `2. **Technology Assessment (HTA):** Evaluating clinical efficacy, safety evidence, and cost-effectiveness.\n` +
          `3. **Technical Specification:** Defining detailed engineering parameters, power prerequisites, and environmental tolerances.\n` +
          `4. **Procurement & Tendering:** Issuing formal requests for proposals (RFP) and managing competitive vendor bidding.\n` +
          `5. **Evaluation & Selection:** Scoring technical compliance, total cost of ownership (TCO), and warranty terms.\n` +
          `6. **Installation & Commissioning:** Facility pre-installation inspection (HVAC, electrical isolation) and vendor installation.\n` +
          `7. **Acceptance Testing:** Rigorous verification against IEC 60601 electrical safety standards and manufacturer calibration benchmarks before clinical release.\n` +
          `8. **Clinical & Technical Training:** Instructing nursing and clinical staff on safe operation, and training biomedical technicians on routine maintenance.\n` +
          `9. **Operation & Monitoring:** Active clinical utilization and logging operational utilization.\n` +
          `10. **Preventive Maintenance (PM):** Scheduled inspections, electrical safety testing, and parts replacements.\n` +
          `11. **Corrective Maintenance (Repair):** Systematic troubleshooting, component repair, and functional re-testing after failure.\n` +
          `12. **Calibration & Performance Verification:** Metrological validation using certified test equipment.\n` +
          `13. **Asset Management (CMMS):** Maintaining digital service histories, inventory tracking, and lifecycle cost records.\n` +
          `14. **Replacement Planning:** Calculating obsolescence scores and determining retirement schedules.\n` +
          `15. **Decommissioning & Safe Disposal:** Decontamination, data wiping, asset retirement, and environmental/e-waste disposal.\n\n` +
          `• **Educational Masterclass:** A comprehensive 90-minute recorded session **"Medical Equipment Lifecycle Management: From Specification to Decommissioning"** is available in the Webinars & Events hub.`;

        replyMetadata = {
          classification: AI_POLICY.classifications.GENERAL_INFORMATION,
          evidenceStatus: AI_POLICY.evidenceStatuses.SUPPORTED_SCIENTIFIC,
          sources: ['WHO Medical Device Technical Series & Healthcare Technology Management Frameworks'],
        };
        actionObj = { label: 'Explore Equipment Lifecycle Session', href: '#webinars' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // Topic: Medical Device Commercialization & Regulatory Pathways (Section 8 & 9)
      if (
        analysis.biomedicalTopic === 'device_commercialization' ||
        lower.includes('commercialization') ||
        lower.includes('commercialize') ||
        (lower.includes('device') && lower.includes('business'))
      ) {
        replyText = `**Medical Device Commercialization & Regulatory Translation:**\n\n` +
          `Translating a biomedical prototype into a commercially viable, clinically approved medical device follows a rigorous stage-gate pathway:\n\n` +
          `1. **Concept & Clinical Need Definition:** Validating intended use, clinical workflow, and target user population.\n` +
          `2. **Design Controls (ISO 13485):** Formulating documented Design Inputs (user needs), Design Outputs (engineering specs), and Design Verification (bench testing).\n` +
          `3. **Risk Management (ISO 14971):** Conducting Failure Mode and Effects Analysis (FMEA) across biological, electrical, and operational hazards to ensure risks are As Low As Reasonably Practicable (ALARP).\n` +
          `4. **Safety & Standards Compliance:** Testing for electrical safety (IEC 60601-1), electromagnetic compatibility (IEC 60601-1-2), and biological biocompatibility (ISO 10993).\n` +
          `5. **Regulatory Submission Strategy:**\n` +
          `   - **US Market (FDA):** Determining classification (Class I 510(k) exempt, Class II 510(k) Premarket Notification establishing Substantial Equivalence, or Class III Premarket Approval PMA).\n` +
          `   - **European Union (EU MDR 2017/745):** Compiling Technical Documentation, establishing Clinical Evaluation Reports (CER), and Notified Body audit for CE Marking.\n` +
          `6. **Post-Market Surveillance (PMS):** Establishing complaint handling, vigilance reporting, and continuous clinical follow-up.\n\n` +
          `*Note: Regulatory frameworks evolve across jurisdictions; this overview provides general educational principles rather than formal legal or regulatory advice.*\n\n` +
          `• **Featured Webinar:** You can join our scheduled webinar **"Medical Device Commercialization & Regulatory Pathways: From Prototype to CE/FDA Clearance"** in the Webinars hub.`;

        replyMetadata = {
          classification: AI_POLICY.classifications.GENERAL_INFORMATION,
          evidenceStatus: AI_POLICY.evidenceStatuses.SUPPORTED_SCIENTIFIC,
          sources: ['FDA Premarket Guidance & EU Medical Device Regulation (EU 2017/745) Principles'],
        };
        actionObj = { label: 'Explore Commercialization Webinar', href: '#webinars' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // Topic: Biomedical Engineering Careers & Professional Pathways (Section 5)
      if (
        analysis.biomedicalTopic === 'bme_careers' ||
        lower.includes('career') ||
        lower.includes('careers') ||
        lower.includes('professional development')
      ) {
        replyText = `**Biomedical Engineering Career Pathways & Professional Development:**\n\n` +
          `Biomedical engineering bridges engineering sciences and healthcare systems, offering distinct professional career tracks:\n\n` +
          `1. **Clinical Engineering & Healthcare Technology Management (HTM):**\n` +
          `   - Working within hospital health systems managing equipment lifecycles, evaluating technology tenders, ensuring electrical safety, and directing maintenance operations.\n` +
          `2. **Medical Device R&D & Product Engineering:**\n` +
          `   - Designing analog front-ends, embedded firmware, wearable biosensors, diagnostic instrumentation, and biomechanical orthopedic implants.\n` +
          `3. **Regulatory Affairs & Quality Assurance (RA/QA):**\n` +
          `   - Ensuring medical devices comply with ISO 13485, FDA regulations, and international safety standards, navigating premarket submissions and clinical audits.\n` +
          `4. **Biomedical Data Science & AI Engineering:**\n` +
          `   - Developing physiological signal processing algorithms, computer vision for diagnostic radiology, and explainable predictive models.\n` +
          `5. **Academic & Translational Research:**\n` +
          `   - Advancing cutting-edge research in neuroengineering, neural interfaces, biomaterials, and rehabilitative biomechanics.\n\n` +
          `• **Featured Panel:** Explore our recorded panel discussion **"Biomedical Engineering Career Pathways & Professional Skills"** in the Webinars hub.`;

        replyMetadata = {
          classification: AI_POLICY.classifications.GENERAL_INFORMATION,
          evidenceStatus: AI_POLICY.evidenceStatuses.SUPPORTED_SCIENTIFIC,
          sources: ['Biomedical Engineering Educational Society Guidelines & Healthcare Technology Professional Competency Frameworks'],
        };
        actionObj = { label: 'View Career Development Panel', href: '#webinars' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }

      // Topic: Research & Collaboration Opportunities (Section 6)
      if (
        analysis.biomedicalTopic === 'research_collaboration' ||
        lower.includes('collaboration') ||
        lower.includes('collaborating on healthcare technology')
      ) {
        replyText = `**Healthcare Technology Research & Collaboration Opportunities:**\n\n` +
          `Marye actively engages in interdisciplinary research and clinical-engineering collaboration across key biomedical domains:\n\n` +
          `• **Wearable Sensor Telemetry:** Real-time ambulatory vital signs monitoring and low-power embedded biomedical signal acquisition.\n` +
          `• **Biomechanics & Gait Kinematics:** Inertial measurement sensor fusion, gait stability quantification, and mobility impairment assessment.\n` +
          `• **Hospital Technology Infrastructure:** Medical equipment reliability models, electrical safety verification, and healthcare technology planning.\n` +
          `• **Explainable AI in Medicine:** Interpretable machine learning models for physiological waveform classification and clinical decision support.\n\n` +
          `**How to Collaborate:**\n` +
          `1. **Join Open Round Tables:** Attend our virtual research round tables announced in the Webinars & Events hub.\n` +
          `2. **Joint Research Projects:** Contact Marye directly with a project abstract or grant concept through the Collaboration Desk.`;

        replyMetadata = {
          classification: AI_POLICY.classifications.GENERAL_INFORMATION,
          evidenceStatus: AI_POLICY.evidenceStatuses.SUPPORTED_SCIENTIFIC,
          sources: ['Biomedical Research Collaboration Framework'],
        };
        actionObj = { label: 'Explore Research Collaboration', href: '#contact' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }
    }

    // =========================================================================
    // (Section 8.5 evaluated above at 7.5)

    // =========================================================================
    // 9. TECHNICAL SPECIFICATION LOOKUP (Requirement 8 & 14)
    // =========================================================================
    if (classification === AI_POLICY.classifications.TECHNICAL_SPECIFICATION) {
      const specResult = TechnicalSourceRetriever.retrieveTechnicalEvidence({
        deviceQuery: analysis.requestedEquipment || query,
        parameterQuery: query,
        allowLiveSearch: false,
      });

      if (specResult.found) {
        if (specResult.hasConflict) {
          replyText = `**Technical Specification Discrepancy Detected:**\n\n` +
            `• **Device:** ${specResult.device} — ${specResult.model} (${specResult.manufacturer})\n` +
            `• **Parameter:** ${specResult.parameter}\n` +
            `• **Documented Values:** ${specResult.value}\n` +
            `• **Evidence Status:** [${specResult.evidenceStatus}]\n` +
            `• **Conflict Summary:** ${specResult.conflictDetails}\n` +
            `• **Primary Sources:** ${specResult.source}\n` +
            `• **Technical Recommendation:** When authoritative manufacturer documents disagree across revisions or operating manuals, specifications should be formally clarified with the manufacturer before clinical deployment.`;

          replyMetadata = {
            classification: AI_POLICY.classifications.TECHNICAL_SPECIFICATION,
            type: 'specification_conflict',
            evidenceStatus: AI_POLICY.evidenceStatuses.CONFLICTING,
            hasConflict: true,
            sources: [specResult.source],
          };
          actionObj = { label: 'Request Technical Clarification', href: '#contact' };
          return { replyText, replyMetadata, actionObj, structuredRequirements };
        }

        replyText = `**Verified Technical Specification Retrieved:**\n\n` +
          `• **Device:** ${specResult.device} — ${specResult.model} (${specResult.manufacturer})\n` +
          `• **Parameter:** ${specResult.parameter}\n` +
          `• **Value:** ${specResult.value}\n` +
          `• **Evidence Status:** [${specResult.evidenceStatus}]\n` +
          `• **Primary Source:** ${specResult.source}\n` +
          `• **Documentation Reference:** ${specResult.document || 'Official Manual / Technical Datasheet'}\n` +
          `• **Engineering Note:** ${specResult.notes || 'Specification applies to specified clinical configuration and revision.'}`;

        replyMetadata = {
          classification: AI_POLICY.classifications.TECHNICAL_SPECIFICATION,
          type: 'specification',
          spec: {
            device: specResult.device,
            manufacturer: specResult.manufacturer,
            model: specResult.model,
            parameter: specResult.parameter,
            value: specResult.value,
            evidenceStatus: specResult.evidenceStatus,
            source: specResult.source,
            document: specResult.document,
            url: specResult.url,
            retrievalDate: specResult.retrievalTimestamp,
          },
          evidenceStatus: specResult.evidenceStatus,
          sources: [specResult.source],
        };
        actionObj = { label: 'Explore Technical Services', href: '#services' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      } else {
        replyText = `Based on available documentation in our verified technical catalog, authoritative primary datasheets for "${query}" were not found in the verified baseline. Because live online retrieval was not conducted for this query, this specification cannot currently be independently verified online. Under strict truth-in-content principles, unconfirmed estimates are not presented as verified.\n\n` +
          `• **Evidence Status:** [${AI_POLICY.evidenceStatuses.UNVERIFIED}]\n` +
          `• **Recommendation:** If you require verified parameters for procurement, tenders, or facility planning, Marye can conduct an official manufacturer specification review.`;

        replyMetadata = {
          classification: AI_POLICY.classifications.TECHNICAL_SPECIFICATION,
          evidenceStatus: AI_POLICY.evidenceStatuses.UNVERIFIED,
          canEscalate: true,
        };
        actionObj = { label: 'Request Specification Review', href: '#contact' };
        return { replyText, replyMetadata, actionObj, structuredRequirements };
      }
    }

    // =========================================================================
    // 10. PROCUREMENT COMPARISON
    // =========================================================================
    if (detectedIntent === INTENTS.PROCUREMENT_COMPARISON) {
      const comparison = TechnicalSourceRetriever.compareDevices([
        'GE B450',
        'Philips MX450',
        'Mindray N12',
      ]);
      replyText = `**Medical Equipment Specification Comparison:**\n\n` +
        `| Parameter | GE B450 | Philips MX450 | Mindray N12 |\n` +
        `| :--- | :--- | :--- | :--- |\n` +
        comparison.matrix.map((row) => `| **${row.parameter}** | ${row['B450 Patient Monitor (CARESCAPE Platform)']?.value.substring(0, 32)}... | ${row['IntelliVue MX450']?.value.substring(0, 32)}... | ${row['BeneVision N12']?.value.substring(0, 32)}... |`).join('\n') +
        `\n\n**Engineering Interpretation:**\n${comparison.engineeringInterpretation}\n\n*${comparison.caveat}*`;

      replyMetadata = {
        classification: AI_POLICY.classifications.PRODUCT_OR_EQUIPMENT,
        type: 'comparison_matrix',
        sources: ['GE Healthcare Reference Manual', 'Philips Service Guide', 'Mindray Datasheet'],
        evidenceStatus: AI_POLICY.evidenceStatuses.VERIFIED_PRIMARY,
      };
      actionObj = { label: 'Procurement & Purchasing Advisory', href: '#services', serviceId: 'procurement-and-purchasing' };
      return { replyText, replyMetadata, actionObj, structuredRequirements };
    }

    // =========================================================================
    // 11. ACADEMIC & RESEARCH INQUIRIES (Explicit only)
    // =========================================================================
    if (detectedIntent === INTENTS.RESEARCH_QUESTION || detectedIntent === INTENTS.RESEARCH_COLLABORATION) {
      const r = defaultKnowledgeRetriever.getResearch();
      replyText = `**Current Graduate Research (Anna University, Chennai):**\n\n` +
        `Marye is conducting graduate engineering research in gait analysis and mobility assessment using lower-back inertial sensing, with an emphasis on single-task and dual-task walking and explainable machine learning.\n\n` +
        `• **High-Level Focus:** Ambulatory kinematic time-series telemetry, sensor drift compensation, and clinically meaningful movement biomarkers.\n` +
        `• **Academic Integrity:** Research is actively in progress under Anna University faculty supervision. Detailed experimental protocols are archived in academic repositories.\n\n` +
        `For academic dataset exchange, joint benchmarking, or research collaboration, you can initiate a formal inquiry directly with Marye.`;

      replyMetadata = {
        classification: AI_POLICY.classifications.GENERAL_INFORMATION,
        evidenceStatus: AI_POLICY.evidenceStatuses.VERIFIED_PRIMARY,
        sources: ['Anna University CEG Academic Trajectory', 'Verified Research Dossier'],
      };
      actionObj = { label: 'Discuss Research Collaboration', href: '#contact' };
      return { replyText, replyMetadata, actionObj, structuredRequirements };
    }

    // =========================================================================
    // 12. FALLBACK: BROAD REASONING & ROUTING
    // =========================================================================
    const recs = defaultServiceRouter.routeRequest(analysis);
    replyText = defaultServiceRouter.formatRecommendationMessage(recs);
    replyMetadata = {
      classification: AI_POLICY.classifications.SERVICE_DISCOVERY,
      evidenceStatus: AI_POLICY.evidenceStatuses.VERIFIED_PRIMARY,
    };
    actionObj = { label: 'View Recommended Services', href: '#services' };

    return {
      replyText,
      replyMetadata,
      actionObj,
      structuredRequirements,
    };
  }
}

export default BiomedicalConcierge;
