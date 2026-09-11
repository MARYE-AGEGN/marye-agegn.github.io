/**
 * Flexible Professional Content & Event Registry
 *
 * Implements architectural requirements:
 * - Broad professional ecosystem (Healthcare Technology Management, Equipment Lifecycle,
 *   Digital Health, Biomedical Engineering, Product Development, Regulations, Commercialization,
 *   Research, Academic & Professional Consultancy, Professional Development, Networking).
 * - Multi-category, metadata-driven content classification (Webinars, Lectures, Tutorials,
 *   Workshops, Seminars, Masterclasses, Panel Discussions, Networking Sessions, Round Tables).
 * - Complete Medical Equipment Lifecycle support from Need Identification to Decommissioning.
 * - External video/streaming integration (YouTube, Vimeo, Custom Embed).
 * - Downloadable slides, transcripts, captions, resources, and networking pathways.
 * - Strict public vs private access segregation.
 */

export const WEBINAR_STATUSES = {
  DRAFT: 'DRAFT',
  UPCOMING: 'UPCOMING',
  LIVE: 'LIVE',
  RECORDED: 'RECORDED',
  ARCHIVED: 'ARCHIVED',
};

export const WEBINAR_LIFECYCLE = WEBINAR_STATUSES;

export const CONTENT_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
};

export const VIDEO_PROVIDERS = {
  YOUTUBE: 'youtube',
  VIMEO: 'vimeo',
  EMBED: 'embed',
  CUSTOM: 'custom',
};

// Flexible Content Types
export const CONTENT_TYPES = {
  WEBINAR: 'Webinar',
  LECTURE: 'Lecture',
  TUTORIAL: 'Tutorial',
  WORKSHOP: 'Workshop',
  SEMINAR: 'Seminar',
  MASTERCLASS: 'Masterclass',
  PANEL_DISCUSSION: 'Panel Discussion',
  GUEST_TALK: 'Guest Talk',
  PROFESSIONAL_TALK: 'Professional Talk',
  INDUSTRY_TALK: 'Industry Talk',
  NETWORKING_SESSION: 'Networking Session',
  ROUND_TABLE: 'Round Table',
  TECH_DEMO: 'Technology Demonstration',
  PRODUCT_DEMO: 'Product Demonstration',
  CASE_STUDY: 'Case Study',
  INTERVIEW: 'Interview',
  COURSE_SESSION: 'Course Session',
  RECORDED_VIDEO: 'Recorded Video',
  EDUCATIONAL_VIDEO: 'Educational Video',
};

// Top-Level Professional Categories
export const PROFESSIONAL_CATEGORIES = {
  HEALTHCARE_TECH_MGMT: 'Healthcare Technology Management',
  EQUIPMENT_LIFECYCLE: 'Medical Equipment Lifecycle',
  BIOMEDICAL_ENGINEERING: 'Biomedical Engineering',
  MEDICAL_DEVICES_PRODUCT_DEV: 'Medical Devices & Product Development',
  HEALTHCARE_DIGITALIZATION: 'Healthcare Digitalization',
  DIGITAL_HEALTH: 'Digital Health',
  RESEARCH_COLLABORATION: 'Research & Collaboration',
  ACADEMIC_PROFESSIONAL_CONSULTANCY: 'Academic & Professional Consultancy',
  PROFESSIONAL_DEVELOPMENT: 'Professional Development',
  STANDARDS_REGULATIONS_QUALITY: 'Standards, Regulations & Quality',
  HEALTHCARE_BUSINESS_COMMERCIALIZATION: 'Healthcare Business & Commercialization',
  SYSTEMS_ENGINEERING_FUNCTIONALITY: 'Systems Engineering & Functionality',
  CLINICAL_TECH_HOSPITAL_SYSTEMS: 'Clinical Technology & Hospital Systems',
  AI_DATA: 'Artificial Intelligence & Data',
  BIOSIGNALS_DATA: 'Biosignals & Biomedical Data',
  EDUCATION_TUTORIALS: 'Education & Tutorials',
  INDUSTRY_INNOVATION: 'Industry & Innovation',
  NETWORKING_COMMUNITY: 'Networking & Community',
};

// Medical Equipment Management Complete Lifecycle Stages
export const EQUIPMENT_LIFECYCLE_STAGES = [
  'Need Identification',
  'Technology Assessment',
  'Specification',
  'Procurement',
  'Evaluation & Selection',
  'Installation',
  'Commissioning & Acceptance Testing',
  'Staff & Clinical Training',
  'Operation & Quality Assurance',
  'Preventive Maintenance',
  'Corrective Maintenance',
  'Calibration & Performance Verification',
  'Asset Management & CMMS',
  'Replacement Planning',
  'Decommissioning & Safe Disposal',
];

// Target Audiences
export const TARGET_AUDIENCES = [
  'General Public',
  'Students',
  'Biomedical Engineers',
  'Healthcare Professionals',
  'Clinical Engineers',
  'Healthcare Technology Managers',
  'Researchers',
  'Academics',
  'Industry Professionals',
  'Entrepreneurs',
  'Product Developers',
  'Organizations',
  'Hospital Administrators',
];

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  INTRODUCTORY: 'Introductory',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  EXECUTIVE: 'Executive / Strategic',
};

// Seed dataset representing a broad professional biomedical & healthcare technology ecosystem
export const SEED_WEBINARS = [
  // 1. Medical Equipment Management & Lifecycle
  {
    id: 'event-htm-lifecycle-recorded',
    slug: 'medical-equipment-lifecycle-specification-to-decommissioning',
    title: 'Medical Equipment Management: From Specification to Decommissioning',
    subtitle: 'Strategic and Operational Framework for Hospital Healthcare Technology Management',
    description: 'A comprehensive technical workshop detailing the complete medical equipment lifecycle: formulating clinical engineering specifications, evaluating vendor tenders, executing commissioning and acceptance testing, setting up preventive maintenance protocols, and calculating equipment replacement and safe decommissioning timelines.',
    contentType: CONTENT_TYPES.WORKSHOP,
    category: PROFESSIONAL_CATEGORIES.HEALTHCARE_TECH_MGMT,
    categories: [
      PROFESSIONAL_CATEGORIES.HEALTHCARE_TECH_MGMT,
      PROFESSIONAL_CATEGORIES.EQUIPMENT_LIFECYCLE,
      PROFESSIONAL_CATEGORIES.CLINICAL_TECH_HOSPITAL_SYSTEMS,
    ],
    lifecycleStages: [
      'Specification',
      'Procurement',
      'Installation',
      'Commissioning & Acceptance Testing',
      'Preventive Maintenance',
      'Calibration & Performance Verification',
      'Asset Management & CMMS',
      'Replacement Planning',
      'Decommissioning & Safe Disposal',
    ],
    speaker: 'Marye Agegn',
    speakerTitle: 'Biomedical Engineer & Clinical Technology Consultant',
    speakerBio: 'B.Sc. in Biomedical Engineering (University of Gondar), researcher in healthcare technology and mobility telemetry (Anna University), with specialized experience in hospital instrumentation and procurement specifications.',
    organization: 'Clinical Engineering Advisory',
    topic: 'Medical Equipment Lifecycle Management',
    date: '2026-08-14',
    startTime: '13:00 UTC',
    duration: '90 min',
    timezone: 'UTC',
    status: WEBINAR_STATUSES.RECORDED,
    isPublished: true,
    visibility: CONTENT_VISIBILITY.PUBLIC,
    thumbnail: './assets/images/webinar-iec60601-cover.jpg',
    registrationUrl: null,
    liveEventUrl: null,
    recordingUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoProvider: VIDEO_PROVIDERS.YOUTUBE,
    transcript: `00:00 - Introduction to Healthcare Technology Management (HTM) and equipment life cycles.
12:30 - Step 1: Formulating functional and technical equipment specifications.
28:45 - Step 2: Procurement assessment, tender scoring, and total cost of ownership (TCO).
44:10 - Step 3: Commissioning protocols, electrical safety baseline, and acceptance testing.
61:00 - Step 4: Maintenance strategies: CMMS tracking, PPM frequency, and calibration.
75:20 - Step 5: Equipment replacement indices, obsolescence criteria, and decommissioning.
84:00 - Interactive Q&A on hospital asset management.`,
    transcriptSnippet: '00:00 - Introduction to Healthcare Technology Management (HTM) and equipment life cycles.',
    captionsInfo: 'English (Verified Manual Subtitles)',
    slidesUrl: './assets/documents/IEC_60601_Checklist.pdf',
    resources: [
      { title: 'Equipment Lifecycle Checklist (PDF)', url: './assets/documents/IEC_60601_Checklist.pdf', type: 'PDF' },
      { title: 'Tender Technical Evaluation Template', url: 'https://github.com/MARYE-AGEGN', type: 'Template' },
    ],
    tags: ['htm', 'equipment lifecycle', 'procurement', 'maintenance', 'decommissioning', 'acceptance testing', 'cmms'],
    targetAudience: ['Clinical Engineers', 'Healthcare Technology Managers', 'Hospital Administrators', 'Biomedical Engineers'],
    difficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
    networking: {
      enabled: true,
      registrationRequired: false,
      speakerInteraction: true,
      qna: true,
      discussion: true,
      collaborationPathway: 'Hospital HTM Advisory',
    },
    relatedServices: ['technical-specification', 'procurement-and-purchasing', 'commissioning', 'decommissioning'],
    relatedTopics: ['medical equipment management', 'equipment lifecycle', 'procurement', 'acceptance testing', 'replacement planning'],
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-15T12:00:00Z',
  },

  // 2. Healthcare Technology Planning & Replacement Strategy
  {
    id: 'event-planning-replacement-upcoming',
    slug: 'healthcare-technology-planning-replacement-strategy',
    title: 'Healthcare Technology Planning & Replacement Strategy for Hospitals',
    subtitle: 'Capital Budgeting, Equipment Scoring Indices, and Obsolescence Forecasting',
    description: 'An executive lecture and interactive planning session covering how healthcare facilities systematically evaluate when medical equipment (ventilators, patient monitors, imaging suites) should be overhauled vs. decommissioned. Includes Mean Time Between Failures (MTBF), cumulative repair cost ratios, and clinical risk scoring.',
    contentType: CONTENT_TYPES.LECTURE,
    category: PROFESSIONAL_CATEGORIES.HEALTHCARE_TECH_MGMT,
    categories: [
      PROFESSIONAL_CATEGORIES.HEALTHCARE_TECH_MGMT,
      PROFESSIONAL_CATEGORIES.EQUIPMENT_LIFECYCLE,
      PROFESSIONAL_CATEGORIES.HEALTHCARE_BUSINESS_COMMERCIALIZATION,
    ],
    lifecycleStages: [
      'Technology Assessment',
      'Replacement Planning',
      'Need Identification',
      'Decommissioning & Safe Disposal',
    ],
    speaker: 'Marye Agegn',
    speakerTitle: 'Healthcare Technology Planning Specialist',
    organization: 'Biomedical Engineering Consultancy',
    topic: 'Equipment Replacement Planning & Hospital Capital Budgeting',
    date: '2026-10-28',
    startTime: '14:00 UTC',
    duration: '60 min',
    timezone: 'UTC',
    status: WEBINAR_STATUSES.UPCOMING,
    isPublished: true,
    visibility: CONTENT_VISIBILITY.PUBLIC,
    thumbnail: './assets/images/webinar-telemetry-cover.jpg',
    registrationUrl: 'https://forms.gle/sample-htm-planning-registration',
    liveEventUrl: 'https://youtube.com/live/sample-htm-planning-stream',
    recordingUrl: null,
    videoProvider: VIDEO_PROVIDERS.YOUTUBE,
    transcript: null,
    captionsInfo: 'Live automated captions available.',
    slidesUrl: './assets/documents/Hospital_Telemetry_Case_Study.pdf',
    resources: [
      { title: 'Medical Equipment Replacement Scoring Matrix (PDF)', url: './assets/documents/Hospital_Telemetry_Case_Study.pdf', type: 'PDF' },
    ],
    tags: ['replacement planning', 'hospital technology', 'capital planning', 'obsolescence', 'ventilator replacement', 'budgeting'],
    targetAudience: ['Hospital Administrators', 'Healthcare Technology Managers', 'Clinical Engineers'],
    difficultyLevel: DIFFICULTY_LEVELS.EXECUTIVE,
    networking: {
      enabled: true,
      registrationRequired: true,
      speakerInteraction: true,
      qna: true,
      discussion: true,
      collaborationPathway: 'Hospital Planning Consultation',
    },
    relatedServices: ['technical-specification', 'procurement-and-purchasing'],
    relatedTopics: ['replacement planning', 'equipment management', 'technology assessment', 'hospital budgeting'],
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
  },

  // 3. Standards, Regulations & Commercialization
  {
    id: 'event-device-commercialization-recorded',
    slug: 'medical-device-commercialization-standards-regulatory-pathways',
    title: 'Navigating Medical Device Commercialization: ISO 13485, CE Marking & Regulatory Pathways',
    subtitle: 'Translating Medical Prototypes into Market-Ready Cleared Medical Devices',
    description: 'A panel discussion and masterclass exploring the bridge between engineering benchtop prototyping and commercial market entry: establishing an ISO 13485 Quality Management System, risk management under ISO 14971, technical documentation for FDA 510(k) clearances and EU MDR CE marking.',
    contentType: CONTENT_TYPES.PANEL_DISCUSSION,
    category: PROFESSIONAL_CATEGORIES.STANDARDS_REGULATIONS_QUALITY,
    categories: [
      PROFESSIONAL_CATEGORIES.STANDARDS_REGULATIONS_QUALITY,
      PROFESSIONAL_CATEGORIES.HEALTHCARE_BUSINESS_COMMERCIALIZATION,
      PROFESSIONAL_CATEGORIES.MEDICAL_DEVICES_PRODUCT_DEV,
    ],
    lifecycleStages: [
      'Technology Assessment',
      'Specification',
      'Operation & Quality Assurance',
    ],
    speaker: 'Marye Agegn with Guest MedTech Founders',
    speakerTitle: 'Biomedical Engineer & Medical Product Consultant',
    organization: 'MedTech Innovation Network',
    topic: 'Medical Device Commercialization & Regulatory Strategy',
    date: '2026-06-18',
    startTime: '15:00 UTC',
    duration: '85 min',
    timezone: 'UTC',
    status: WEBINAR_STATUSES.RECORDED,
    isPublished: true,
    visibility: CONTENT_VISIBILITY.PUBLIC,
    thumbnail: './assets/images/webinar-ecg-cover.jpg',
    registrationUrl: null,
    liveEventUrl: null,
    recordingUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoProvider: VIDEO_PROVIDERS.YOUTUBE,
    transcript: `00:00 - Introduction: The Valley of Death in Medical Device Commercialization.
18:20 - Establishing an ISO 13485 Quality Management System early in R&D.
36:40 - Risk Management according to ISO 14971: Hazard identification and mitigation.
52:10 - Regulatory submission roadmaps: FDA 510(k) vs EU MDR CE Mark.
70:00 - Panel discussion on funding, clinical trials, and reimbursement codes.`,
    transcriptSnippet: '00:00 - Introduction: The Valley of Death in Medical Device Commercialization.',
    captionsInfo: 'English (Subtitled)',
    slidesUrl: './assets/documents/IEC_60601_Checklist.pdf',
    resources: [
      { title: 'Commercialization Regulatory Roadmap (PDF)', url: './assets/documents/IEC_60601_Checklist.pdf', type: 'PDF' },
    ],
    tags: ['commercialization', 'iso 13485', 'regulatory pathways', 'fda 510k', 'eu mdr', 'medical device business', 'entrepreneurship'],
    targetAudience: ['Entrepreneurs', 'Product Developers', 'Biomedical Engineers', 'Industry Professionals'],
    difficultyLevel: DIFFICULTY_LEVELS.ADVANCED,
    networking: {
      enabled: true,
      registrationRequired: false,
      speakerInteraction: true,
      qna: true,
      discussion: true,
      collaborationPathway: 'Product Development & Regulatory Advisory',
    },
    relatedServices: ['medical-product-development', 'technical-specification'],
    relatedTopics: ['commercialization', 'standards', 'regulations', 'quality management', 'iso 13485'],
    createdAt: '2026-06-01T08:00:00Z',
    updatedAt: '2026-06-19T10:00:00Z',
  },

  // 4. Healthcare Digitalization & Digital Health
  {
    id: 'event-digital-health-telemetry-recorded',
    slug: 'healthcare-digitalization-hospital-telemetry-networks',
    title: 'Healthcare Digitalization: Integrating Hospital Telemetry, HL7/FHIR & Clinical Workflows',
    subtitle: 'Overcoming Interoperability Gaps and Network Bandwidth Constraints in Low-Resource Settings',
    description: 'An in-depth technical seminar analyzing wireless patient monitoring topologies, HL7 and FHIR interface integration, medical telemetry frequency bands, and electronic medical record (EMR) gateway deployment in regional hospitals.',
    contentType: CONTENT_TYPES.SEMINAR,
    category: PROFESSIONAL_CATEGORIES.HEALTHCARE_DIGITALIZATION,
    categories: [
      PROFESSIONAL_CATEGORIES.HEALTHCARE_DIGITALIZATION,
      PROFESSIONAL_CATEGORIES.DIGITAL_HEALTH,
      PROFESSIONAL_CATEGORIES.SYSTEMS_ENGINEERING_FUNCTIONALITY,
    ],
    lifecycleStages: [
      'Installation',
      'Commissioning & Acceptance Testing',
      'Operation & Quality Assurance',
    ],
    speaker: 'Marye Agegn',
    speakerTitle: 'Biomedical Technology Specialist',
    organization: 'Hospital Telemetry & Digitalization Initiative',
    topic: 'Healthcare Digitalization & Digital Health',
    date: '2026-05-18',
    startTime: '11:00 UTC',
    duration: '60 min',
    timezone: 'UTC',
    status: WEBINAR_STATUSES.ARCHIVED,
    isPublished: true,
    visibility: CONTENT_VISIBILITY.PUBLIC,
    thumbnail: './assets/images/webinar-telemetry-cover.jpg',
    registrationUrl: null,
    liveEventUrl: null,
    recordingUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoProvider: VIDEO_PROVIDERS.YOUTUBE,
    transcript: 'Archived technical seminar analyzing wireless patient monitoring topologies and HL7/FHIR clinical interoperability.',
    transcriptSnippet: 'Archived summary notes and slide archive available for technical reference.',
    captionsInfo: 'English captions',
    slidesUrl: './assets/documents/Hospital_Telemetry_Case_Study.pdf',
    resources: [
      { title: 'Hospital Telemetry Architecture Case Study (PDF)', url: './assets/documents/Hospital_Telemetry_Case_Study.pdf', type: 'PDF' },
    ],
    tags: ['healthcare digitalization', 'digital health', 'telemetry', 'hl7', 'fhir', 'hospital networks', 'emr'],
    targetAudience: ['Clinical Engineers', 'Healthcare Professionals', 'Hospital Administrators', 'Biomedical Engineers'],
    difficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
    networking: {
      enabled: true,
      registrationRequired: false,
      speakerInteraction: false,
      qna: true,
      discussion: true,
      collaborationPathway: 'Digital Health Infrastructure Consultation',
    },
    relatedServices: ['technical-specification', 'commissioning'],
    relatedTopics: ['healthcare digitalization', 'digital health', 'telemetry', 'hospital infrastructure'],
    createdAt: '2026-05-10T08:00:00Z',
    updatedAt: '2026-05-19T12:00:00Z',
  },

  // 5. Professional Development & Career Pathways
  {
    id: 'event-bme-career-pathways-upcoming',
    slug: 'career-pathways-professional-development-biomedical-engineering',
    title: 'Career Pathways & Professional Development in Biomedical Engineering',
    subtitle: 'Bridging Academic Training, Hospital Clinical Engineering, and Industry Innovation',
    description: 'An interactive professional development session designed for students, early-career engineers, and transitioning professionals. Explores core career trajectories: Hospital Healthcare Technology Management (HTM), Medical Device R&D, Clinical Affairs, Regulatory Compliance, and Academic Research.',
    contentType: CONTENT_TYPES.NETWORKING_SESSION,
    category: PROFESSIONAL_CATEGORIES.PROFESSIONAL_DEVELOPMENT,
    categories: [
      PROFESSIONAL_CATEGORIES.PROFESSIONAL_DEVELOPMENT,
      PROFESSIONAL_CATEGORIES.BIOMEDICAL_ENGINEERING,
      PROFESSIONAL_CATEGORIES.NETWORKING_COMMUNITY,
    ],
    speaker: 'Marye Agegn',
    speakerTitle: 'Biomedical Engineer & Academic Mentor',
    organization: 'Biomedical Engineering Network',
    topic: 'Biomedical Engineering Careers & Professional Skills',
    date: '2026-11-05',
    startTime: '16:00 UTC',
    duration: '75 min',
    timezone: 'UTC',
    status: WEBINAR_STATUSES.UPCOMING,
    isPublished: true,
    visibility: CONTENT_VISIBILITY.PUBLIC,
    thumbnail: './assets/images/webinar-imu-cover.jpg',
    registrationUrl: '#registration',
    liveEventUrl: 'https://youtube.com/live/sample-bme-career-stream',
    recordingUrl: null,
    videoProvider: VIDEO_PROVIDERS.YOUTUBE,
    transcript: null,
    captionsInfo: 'English (Live automated captions)',
    slidesUrl: null,
    resources: [
      { title: 'BME Career Pathways Roadmap (PDF)', url: './assets/documents/Biosignal_Processing_Webinar_Slides.pdf', type: 'PDF' },
    ],
    tags: ['professional development', 'career pathways', 'clinical engineering careers', 'biomedical engineering', 'networking', 'mentorship'],
    targetAudience: ['Students', 'Biomedical Engineers', 'Academics', 'Industry Professionals'],
    difficultyLevel: DIFFICULTY_LEVELS.INTRODUCTORY,
    networking: {
      enabled: true,
      registrationRequired: true,
      speakerInteraction: true,
      qna: true,
      discussion: true,
      collaborationPathway: 'Mentorship & Professional Exchange',
    },
    relatedServices: ['technical-medical-technology-consultation'],
    relatedTopics: ['professional development', 'career', 'biomedical engineering', 'clinical engineering'],
    createdAt: '2026-09-02T11:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
  },

  // 6. Research & Industry-Academia Collaboration
  {
    id: 'event-research-collaboration-roundtable',
    slug: 'interdisciplinary-research-collaboration-biomechanics-sensing',
    title: 'Interdisciplinary Research Collaboration: Translating Biomechanics & Sensing into Clinical Practice',
    subtitle: 'Fostering Industry–Academia Partnerships for Gait Telemetry & Mobility Biomarkers',
    description: 'A collaborative round table bringing together clinical researchers, data scientists, and sensor engineers to discuss benchmark protocols, open-access clinical dataset sharing, and translational pathways from academic labs to clinical trials.',
    contentType: CONTENT_TYPES.ROUND_TABLE,
    category: PROFESSIONAL_CATEGORIES.RESEARCH_COLLABORATION,
    categories: [
      PROFESSIONAL_CATEGORIES.RESEARCH_COLLABORATION,
      PROFESSIONAL_CATEGORIES.ACADEMIC_PROFESSIONAL_CONSULTANCY,
      PROFESSIONAL_CATEGORIES.INDUSTRY_INNOVATION,
    ],
    speaker: 'Marye Agegn with Academic Co-Investigators',
    speakerTitle: 'Mobility Assessment Researcher (Anna University)',
    organization: 'Centre for Medical Electronics & Biomechanics Research Group',
    topic: 'Academic & Industry Research Collaboration',
    date: '2026-07-30',
    startTime: '14:30 UTC',
    duration: '90 min',
    timezone: 'UTC',
    status: WEBINAR_STATUSES.RECORDED,
    isPublished: true,
    visibility: CONTENT_VISIBILITY.PUBLIC,
    thumbnail: './assets/images/webinar-imu-cover.jpg',
    registrationUrl: null,
    liveEventUrl: null,
    recordingUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoProvider: VIDEO_PROVIDERS.YOUTUBE,
    transcript: 'Roundtable discussion on industry-academia joint benchmarking and clinical movement telemetry validation.',
    transcriptSnippet: 'Discussion on open dataset standards and translational clinical pipelines.',
    captionsInfo: 'English (Subtitled)',
    slidesUrl: './assets/documents/IMU_Kinematics_Guide.pdf',
    resources: [
      { title: 'Research Collaboration Framework (PDF)', url: './assets/documents/IMU_Kinematics_Guide.pdf', type: 'PDF' },
    ],
    tags: ['research collaboration', 'industry academia', 'biomechanics', 'gait analysis', 'data sharing', 'clinical trials'],
    targetAudience: ['Researchers', 'Academics', 'Industry Professionals', 'Clinical Engineers'],
    difficultyLevel: DIFFICULTY_LEVELS.ADVANCED,
    networking: {
      enabled: true,
      registrationRequired: false,
      speakerInteraction: true,
      qna: true,
      discussion: true,
      collaborationPathway: 'Joint Research Grant & Benchmarking Inquiry',
    },
    relatedServices: ['research-and-development'],
    relatedTopics: ['research collaboration', 'industry academia', 'biomechanics', 'academic consultancy'],
    createdAt: '2026-07-10T10:00:00Z',
    updatedAt: '2026-07-31T11:00:00Z',
  },

  // 7. Standards & Medical Electrical Safety
  {
    id: 'webinar-iec60601-safety-recorded',
    slug: 'iec-60601-1-medical-device-electrical-safety',
    title: 'IEC 60601-1 Medical Device Electrical Safety: Principles, Leakage Currents & Isolation',
    subtitle: 'Core Safety Engineering and Compliance Testing for Healthcare Facilities and Manufacturers',
    description: 'A comprehensive technical recorded seminar on electrical safety testing, patient auxiliary leakage, Type B, BF, and CF applied parts classification, and protective earth impedance testing for hospital biomedical engineers and medical product developers.',
    contentType: CONTENT_TYPES.MASTERCLASS,
    category: PROFESSIONAL_CATEGORIES.STANDARDS_REGULATIONS_QUALITY,
    categories: [
      PROFESSIONAL_CATEGORIES.STANDARDS_REGULATIONS_QUALITY,
      PROFESSIONAL_CATEGORIES.MEDICAL_DEVICES_PRODUCT_DEV,
      PROFESSIONAL_CATEGORIES.CLINICAL_TECH_HOSPITAL_SYSTEMS,
    ],
    lifecycleStages: [
      'Commissioning & Acceptance Testing',
      'Preventive Maintenance',
      'Operation & Quality Assurance',
    ],
    speaker: 'Marye Agegn',
    speakerTitle: 'Clinical Engineering & Technical Specifications Consultant',
    organization: 'Biomedical Safety Consultancy',
    topic: 'Medical Device Electrical Safety',
    date: '2026-07-22',
    startTime: '13:00 UTC',
    duration: '90 min',
    timezone: 'UTC',
    status: WEBINAR_STATUSES.RECORDED,
    isPublished: true,
    visibility: CONTENT_VISIBILITY.PUBLIC,
    thumbnail: './assets/images/webinar-iec60601-cover.jpg',
    registrationUrl: null,
    liveEventUrl: null,
    recordingUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoProvider: VIDEO_PROVIDERS.YOUTUBE,
    transcript: `00:00 - Introduction to Medical Electrical Safety and IEC 60601-1 Third Edition.
08:15 - Understanding Means of Operator Protection (MOOP) vs Means of Patient Protection (MOPP).
22:40 - Applied Parts Classification: Differences between Type B, Type BF, and Type CF (Cardiac Floating).
41:10 - Maximum allowable earth leakage, touch leakage, and patient leakage currents under normal and single fault conditions.
63:00 - Practical bench testing with medical safety analyzers (Fluke Biomedical ESA series).
81:30 - Q&A on hospital electrical safety audits.`,
    transcriptSnippet: '00:00 - Introduction to Medical Electrical Safety and IEC 60601-1 Third Edition.',
    captionsInfo: 'English (Verified Manual Subtitles Available)',
    slidesUrl: './assets/documents/IEC_60601_Checklist.pdf',
    resources: [
      { title: 'IEC 60601-1 3rd Ed Checklist (Summary PDF)', url: './assets/documents/IEC_60601_Checklist.pdf', type: 'PDF' },
      { title: 'Leakage Current Limit Reference Chart', url: './assets/documents/Leakage_Current_Limits.pdf', type: 'PDF' },
    ],
    tags: ['iec 60601', 'electrical safety', 'leakage current', 'medical devices', 'type cf', 'standards', 'quality'],
    targetAudience: ['Biomedical Engineers', 'Clinical Engineers', 'Product Developers', 'Healthcare Technology Managers'],
    difficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
    networking: {
      enabled: true,
      registrationRequired: false,
      speakerInteraction: true,
      qna: true,
      discussion: true,
      collaborationPathway: 'Safety & Compliance Audit Consultation',
    },
    relatedServices: ['medical-product-development', 'commissioning'],
    relatedTopics: ['iec 60601', 'electrical safety', 'standards', 'regulations', 'type cf'],
    createdAt: '2026-07-15T09:00:00Z',
    updatedAt: '2026-07-23T10:00:00Z',
  },

  // 8. Live Wearable Kinematics Demo
  {
    id: 'webinar-imu-gait-live',
    slug: 'wearable-inertial-sensors-gait-biomarkers',
    title: 'Wearable Inertial Sensors for Ambulatory Gait Biomarkers & Kinematic Analysis',
    subtitle: 'Real-Time Telemetry and Signal Fusion for Quantitative Mobility Assessment',
    description: 'Live interactive technical session detailing lower-back tri-axial accelerometry and rate gyroscope sensor fusion for quantifying stride variability, cadence, and balance metrics outside laboratory settings.',
    contentType: CONTENT_TYPES.TECH_DEMO,
    category: PROFESSIONAL_CATEGORIES.BIOSIGNALS_DATA,
    categories: [
      PROFESSIONAL_CATEGORIES.BIOSIGNALS_DATA,
      PROFESSIONAL_CATEGORIES.RESEARCH_COLLABORATION,
      PROFESSIONAL_CATEGORIES.BIOMEDICAL_ENGINEERING,
    ],
    speaker: 'Marye Agegn',
    speakerTitle: 'Biomedical Engineer & Mobility Assessment Researcher',
    organization: 'Anna University Biomedical Engineering Research',
    topic: 'Biomechanics & Wearable Sensors',
    date: '2026-09-08',
    startTime: '15:30 UTC',
    duration: '60 min',
    timezone: 'UTC',
    status: WEBINAR_STATUSES.LIVE,
    isPublished: true,
    visibility: CONTENT_VISIBILITY.PUBLIC,
    thumbnail: './assets/images/webinar-imu-cover.jpg',
    registrationUrl: null,
    liveEventUrl: 'https://youtube.com/live/sample-gait-live-stream',
    recordingUrl: 'https://www.youtube.com/embed/live_stream?channel=SAMPLE_CHANNEL',
    videoProvider: VIDEO_PROVIDERS.YOUTUBE,
    transcript: 'Session transcript will be processed and indexed within 24 hours of live conclusion.',
    captionsInfo: 'English (Auto-generated)',
    slidesUrl: './assets/documents/IMU_Kinematics_Guide.pdf',
    resources: [
      { title: 'Inertial Sensing Coordinate Frame Guide', url: './assets/documents/IMU_Kinematics_Guide.pdf', type: 'PDF' },
    ],
    tags: ['imu', 'gait', 'accelerometer', 'gyroscope', 'biomechanics', 'mobility', 'wearable sensors'],
    targetAudience: ['Researchers', 'Biomedical Engineers', 'Students', 'Healthcare Professionals'],
    difficultyLevel: DIFFICULTY_LEVELS.ADVANCED,
    networking: {
      enabled: true,
      registrationRequired: false,
      speakerInteraction: true,
      qna: true,
      discussion: true,
      collaborationPathway: 'Mobility Research Collaboration',
    },
    relatedServices: ['research-and-development'],
    relatedTopics: ['imu', 'gait', 'biomechanics', 'wearables', 'signals'],
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-09-08T15:30:00Z',
  },

  // 9. Biosignal Processing Tutorial
  {
    id: 'webinar-ecg-biosignals-2026',
    slug: 'biosignal-processing-in-real-time',
    title: 'Biosignal Processing in Real Time: Filtering, Artifact Rejection & QRS Detection',
    subtitle: 'From Analog Front-End Telemetry to Digital Signal Processing Algorithms',
    description: 'An in-depth technical masterclass exploring digital filter topologies (Butterworth vs Chebyshev), 50/60Hz notch filtering, baseline wander removal, and Pan-Tompkins QRS morphological segmentation on clinical ECG telemetry.',
    contentType: CONTENT_TYPES.TUTORIAL,
    category: PROFESSIONAL_CATEGORIES.BIOSIGNALS_DATA,
    categories: [
      PROFESSIONAL_CATEGORIES.BIOSIGNALS_DATA,
      PROFESSIONAL_CATEGORIES.EDUCATION_TUTORIALS,
    ],
    speaker: 'Marye Agegn',
    speakerTitle: 'Biomedical Engineer & Graduate Researcher (Anna University)',
    organization: 'Biomedical Signal Processing Group',
    topic: 'Physiological Biosignal Processing',
    date: '2026-10-15',
    startTime: '14:00 UTC',
    duration: '75 min',
    timezone: 'UTC',
    status: WEBINAR_STATUSES.UPCOMING,
    isPublished: true,
    visibility: CONTENT_VISIBILITY.PUBLIC,
    thumbnail: './assets/images/webinar-ecg-cover.jpg',
    registrationUrl: 'https://forms.gle/sample-webinar-registration',
    liveEventUrl: 'https://youtube.com/live/sample-biosignal-stream',
    recordingUrl: null,
    videoProvider: VIDEO_PROVIDERS.YOUTUBE,
    transcript: null,
    captionsInfo: 'Live automated captions available via streaming platform.',
    slidesUrl: './assets/documents/Biosignal_Processing_Webinar_Slides.pdf',
    resources: [
      { title: 'Session Slides (PDF)', url: './assets/documents/Biosignal_Processing_Webinar_Slides.pdf', type: 'PDF' },
      { title: 'Pan-Tompkins Algorithm Python Benchmark', url: 'https://github.com/MARYE-AGEGN', type: 'Code' },
    ],
    tags: ['ecg', 'qrs detection', 'filtering', 'biosignals', 'sampling rate', 'tutorial'],
    targetAudience: ['Students', 'Biomedical Engineers', 'Researchers'],
    difficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
    networking: {
      enabled: true,
      registrationRequired: true,
      speakerInteraction: true,
      qna: true,
      discussion: true,
      collaborationPathway: 'Custom Dataset Analysis Consultation',
    },
    relatedServices: ['research-and-development'],
    relatedTopics: ['ecg', 'qrs detection', 'filtering', 'biosignals', 'sampling rate'],
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
  },

  // 10. Private Draft Event (Protected from Public Discovery)
  {
    id: 'webinar-eeg-ica-draft',
    slug: 'eeg-ica-artifact-removal-workshop',
    title: 'Advanced Workshop: Independent Component Analysis (ICA) for Multi-Channel Scalp EEG',
    subtitle: 'Infomax Decomposition & Dipole Localization',
    description: 'Draft workshop covering infomax decomposition, dipole source localization, and artifact rejection in clinical 64-channel EEG.',
    contentType: CONTENT_TYPES.WORKSHOP,
    category: PROFESSIONAL_CATEGORIES.BIOSIGNALS_DATA,
    categories: [PROFESSIONAL_CATEGORIES.BIOSIGNALS_DATA],
    speaker: 'Marye Agegn',
    speakerTitle: 'Biomedical Engineer',
    organization: 'Neuroengineering Lab',
    topic: 'Neuroengineering & Biosignals',
    date: '2026-11-20',
    startTime: '14:00 UTC',
    duration: '90 min',
    timezone: 'UTC',
    status: WEBINAR_STATUSES.DRAFT,
    isPublished: false, // DRAFT: Must NOT be visible to public visitors
    visibility: CONTENT_VISIBILITY.PRIVATE,
    thumbnail: './assets/images/webinar-eeg-cover.jpg',
    registrationUrl: null,
    liveEventUrl: null,
    recordingUrl: null,
    videoProvider: VIDEO_PROVIDERS.YOUTUBE,
    transcript: null,
    captionsInfo: null,
    slidesUrl: null,
    resources: [],
    tags: ['eeg', 'ica', 'draft', 'neuroscience'],
    targetAudience: ['Researchers', 'Biomedical Engineers'],
    difficultyLevel: DIFFICULTY_LEVELS.ADVANCED,
    networking: { enabled: false },
    relatedServices: ['research-and-development'],
    relatedTopics: ['eeg', 'ica', 'artifact removal'],
    createdAt: '2026-09-05T09:00:00Z',
    updatedAt: '2026-09-08T10:00:00Z',
  },
];

// Seed video library demonstrating video tutorials, case studies, and educational content
export const SEED_VIDEOS = [
  {
    id: 'video-acceptance-testing-steps',
    title: 'Medical Equipment Acceptance Testing: 7 Essential Inspection Steps',
    description: 'Practical clinical engineering walkthrough on verifying electrical safety, calibrating transducers, and signing off equipment before clinical handover.',
    category: PROFESSIONAL_CATEGORIES.HEALTHCARE_TECH_MGMT,
    categories: [PROFESSIONAL_CATEGORIES.HEALTHCARE_TECH_MGMT, PROFESSIONAL_CATEGORIES.EQUIPMENT_LIFECYCLE],
    contentType: CONTENT_TYPES.TUTORIAL,
    duration: '14 min',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoProvider: VIDEO_PROVIDERS.YOUTUBE,
    thumbnail: './assets/images/webinar-iec60601-cover.jpg',
    webinarId: 'event-htm-lifecycle-recorded',
    relatedWebinarId: 'event-htm-lifecycle-recorded',
    isPublished: true,
    visibility: CONTENT_VISIBILITY.PUBLIC,
  },
  {
    id: 'video-ventilator-replacement',
    title: 'How Hospitals Decide When to Replace Medical Equipment (Scoring Models)',
    description: 'Explaining MTBF, cumulative repair cost thresholds, clinical risk scoring, and manufacturer end-of-life notices for critical care equipment.',
    category: PROFESSIONAL_CATEGORIES.EQUIPMENT_LIFECYCLE,
    categories: [PROFESSIONAL_CATEGORIES.HEALTHCARE_TECH_MGMT, PROFESSIONAL_CATEGORIES.EQUIPMENT_LIFECYCLE],
    contentType: CONTENT_TYPES.CASE_STUDY,
    duration: '16 min',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoProvider: VIDEO_PROVIDERS.YOUTUBE,
    thumbnail: './assets/images/webinar-telemetry-cover.jpg',
    webinarId: 'event-planning-replacement-upcoming',
    relatedWebinarId: 'event-planning-replacement-upcoming',
    isPublished: true,
    visibility: CONTENT_VISIBILITY.PUBLIC,
  },
  {
    id: 'video-commercialization-pathway',
    title: 'Medical Device Commercialization: Concept to Regulatory Clearance',
    description: 'Executive breakdown of design controls, ISO 13485 QMS implementation, and FDA 510(k) vs EU MDR CE clearance timelines.',
    category: PROFESSIONAL_CATEGORIES.HEALTHCARE_BUSINESS_COMMERCIALIZATION,
    categories: [PROFESSIONAL_CATEGORIES.HEALTHCARE_BUSINESS_COMMERCIALIZATION, PROFESSIONAL_CATEGORIES.STANDARDS_REGULATIONS_QUALITY],
    contentType: CONTENT_TYPES.LECTURE,
    duration: '22 min',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoProvider: VIDEO_PROVIDERS.YOUTUBE,
    thumbnail: './assets/images/webinar-ecg-cover.jpg',
    webinarId: 'event-device-commercialization-recorded',
    relatedWebinarId: 'event-device-commercialization-recorded',
    isPublished: true,
    visibility: CONTENT_VISIBILITY.PUBLIC,
  },
  {
    id: 'video-imu-drift-compensation',
    title: 'Sensor Fusion & Drift Compensation in Inertial Measurement Units',
    description: 'Hands-on explanation of Madgwick and Kalman filters combining accelerometer gravity vectors with gyroscope angular rates.',
    category: PROFESSIONAL_CATEGORIES.BIOMEDICAL_ENGINEERING,
    categories: [PROFESSIONAL_CATEGORIES.BIOMEDICAL_ENGINEERING, PROFESSIONAL_CATEGORIES.BIOSIGNALS_DATA],
    contentType: CONTENT_TYPES.EDUCATIONAL_VIDEO,
    duration: '18 min',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoProvider: VIDEO_PROVIDERS.YOUTUBE,
    thumbnail: './assets/images/video-imu-drift.jpg',
    webinarId: 'webinar-imu-gait-live',
    relatedWebinarId: 'webinar-imu-gait-live',
    isPublished: true,
    visibility: CONTENT_VISIBILITY.PUBLIC,
  },
  {
    id: 'video-pulse-ox',
    title: 'Pulse Oximetry Optical Physics & Masimo SET Signal Extraction',
    description: 'Understanding Red/IR photoplethysmography, Perfusion Index (PI), and motion-artifact compensation algorithms.',
    category: PROFESSIONAL_CATEGORIES.MEDICAL_DEVICES_PRODUCT_DEV,
    categories: [PROFESSIONAL_CATEGORIES.MEDICAL_DEVICES_PRODUCT_DEV, PROFESSIONAL_CATEGORIES.BIOSIGNALS_DATA],
    contentType: CONTENT_TYPES.RECORDED_VIDEO,
    duration: '15 min',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoProvider: VIDEO_PROVIDERS.YOUTUBE,
    thumbnail: './assets/images/video-pulse-ox.jpg',
    webinarId: null,
    relatedWebinarId: null,
    isPublished: true,
    visibility: CONTENT_VISIBILITY.PUBLIC,
  },
  {
    id: 'video-private-draft-testing',
    title: 'Internal Bench Calibration Demo (Unpublished)',
    description: 'Internal lab video for calibration validation.',
    category: PROFESSIONAL_CATEGORIES.STANDARDS_REGULATIONS_QUALITY,
    categories: [PROFESSIONAL_CATEGORIES.STANDARDS_REGULATIONS_QUALITY],
    contentType: CONTENT_TYPES.TECH_DEMO,
    duration: '8 min',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoProvider: VIDEO_PROVIDERS.YOUTUBE,
    thumbnail: './assets/images/video-internal.jpg',
    webinarId: null,
    relatedWebinarId: null,
    isPublished: false, // DRAFT
    visibility: CONTENT_VISIBILITY.PRIVATE,
  },
];

const LOCAL_STORAGE_WEBINARS_KEY = 'marye_custom_webinars';

function getStoredWebinars() {
  if (typeof window === 'undefined') return SEED_WEBINARS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_WEBINARS_KEY);
    if (!raw) return SEED_WEBINARS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_WEBINARS;
  } catch {
    return SEED_WEBINARS;
  }
}

function saveStoredWebinars(items) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_WEBINARS_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Failed to save webinars to localStorage:', e);
  }
}

/**
 * Retrieves webinars/events with multi-parameter filtering and strict privacy controls
 */
export function getWebinars({
  status = null,
  category = null,
  contentType = null,
  audience = null,
  includeDrafts = false,
  includePrivate = false,
} = {}) {
  const all = getStoredWebinars();
  return all.filter((item) => {
    // Draft protection
    if (!includeDrafts && !item.isPublished) return false;
    // Private protection
    if (!includePrivate && item.visibility === CONTENT_VISIBILITY.PRIVATE) return false;
    // Status filter
    if (status && status !== 'ALL' && item.status !== status) return false;
    // Content type filter
    if (contentType && contentType !== 'ALL' && item.contentType !== contentType) return false;
    // Audience filter
    if (audience && audience !== 'ALL') {
      const auds = item.targetAudience || [];
      if (!auds.includes(audience)) return false;
    }
    // Category filter (checks primary category and categories array)
    if (category && category !== 'All' && category !== 'ALL') {
      const cats = item.categories || [item.category];
      const match = cats.some((c) => String(c).toLowerCase() === String(category).toLowerCase());
      if (!match) return false;
    }
    return true;
  });
}

/**
 * Retrieves a single webinar by slug or ID with privacy check
 */
export function getWebinarBySlug(slugOrId, { includeDrafts = false, includePrivate = false } = {}) {
  const all = getStoredWebinars();
  const match = all.find((w) => w.slug === slugOrId || w.id === slugOrId);
  if (!match) return null;
  if (!includeDrafts && !match.isPublished) return null;
  if (!includePrivate && match.visibility === CONTENT_VISIBILITY.PRIVATE) return null;
  return match;
}

/**
 * Searches public events and videos across broad taxonomy
 */
export function searchPublicWebinarsAndVideos(query = '') {
  const q = String(query).toLowerCase().trim();
  if (!q) return { webinars: [], videos: [] };

  const terms = q.split(/\s+/).filter((t) => t.length > 2);
  const publicWebinars = getWebinars({ includeDrafts: false, includePrivate: false });
  const publicVideos = SEED_VIDEOS.filter((v) => v.isPublished && v.visibility === CONTENT_VISIBILITY.PUBLIC);

  const matchedWebinars = publicWebinars.filter((w) => {
    const text = [
      w.title,
      w.subtitle,
      w.description,
      w.topic,
      w.category,
      (w.categories || []).join(' '),
      w.contentType,
      (w.tags || []).join(' '),
      (w.targetAudience || []).join(' '),
      (w.lifecycleStages || []).join(' '),
      (w.relatedTopics || []).join(' '),
      w.speaker,
      w.organization,
    ].join(' ').toLowerCase();

    return text.includes(q) || terms.some((term) => text.includes(term));
  });

  const matchedVideos = publicVideos.filter((v) => {
    const text = [
      v.title,
      v.description,
      v.category,
      (v.categories || []).join(' '),
      v.contentType,
    ].join(' ').toLowerCase();

    return text.includes(q) || terms.some((term) => text.includes(term));
  });

  return {
    webinars: matchedWebinars,
    videos: matchedVideos,
  };
}

/**
 * Saves or updates an event in the registry (admin action)
 */
export function saveWebinar(webinarData) {
  const current = getStoredWebinars();
  let updated;
  if (webinarData.id) {
    updated = current.map((w) =>
      w.id === webinarData.id ? { ...w, ...webinarData, updatedAt: new Date().toISOString() } : w
    );
  } else {
    const newWebinar = {
      ...webinarData,
      id: `event-${Date.now()}`,
      slug: webinarData.slug || (webinarData.title || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    updated = [newWebinar, ...current];
  }
  saveStoredWebinars(updated);
  return { success: true, webinar: webinarData };
}

/**
 * Deletes an event by ID (admin action)
 */
export function deleteWebinar(id) {
  const current = getStoredWebinars();
  const updated = current.filter((w) => w.id !== id);
  saveStoredWebinars(updated);
  return { success: true };
}

export const WebinarRegistry = {
  getAll: () => getWebinars({ includeDrafts: true, includePrivate: true }),
  getPublicWebinars: (opts = {}) => getWebinars({ ...opts, includeDrafts: false, includePrivate: false }),
  getByStatus: (status) => getWebinars({ status, includeDrafts: true, includePrivate: true }),
  getByCategory: (category) => getWebinars({ category, includeDrafts: false, includePrivate: false }),
  getByContentType: (contentType) => getWebinars({ contentType, includeDrafts: false, includePrivate: false }),
  getById: (id, { allowPrivate = false } = {}) => getWebinarBySlug(id, { includeDrafts: allowPrivate, includePrivate: allowPrivate }),
  getPublicVideos: () => SEED_VIDEOS.filter((v) => v.isPublished && v.visibility === CONTENT_VISIBILITY.PUBLIC),
  saveWebinar: (data, { isAuthenticatedAdmin = false } = {}) => {
    if (!isAuthenticatedAdmin) throw new Error('Unauthorized: Admin authentication required to modify events.');
    saveWebinar(data);
    return data;
  },
  deleteWebinar: (id, { isAuthenticatedAdmin = false } = {}) => {
    if (!isAuthenticatedAdmin) throw new Error('Unauthorized: Admin authentication required to delete events.');
    deleteWebinar(id);
    return true;
  },
  searchPublic: (query) => searchPublicWebinarsAndVideos(query),
};

export default WebinarRegistry;
