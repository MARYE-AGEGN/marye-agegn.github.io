/**
 * Central Content and Information Architecture
 * 
 * Source of Truth: Verified CV and academic information for Marye Agegn.
 * Separates professional content from UI components for maintainability.
 * 
 * Privacy constraints strictly applied:
 * - No date of birth, home address, personal phone numbers, or private contact details.
 * - No invented claims, fake statistics, fake publications, or unverified achievements.
 */

export const siteData = {
  personal: {
    name: 'Marye Agegn',
    headline: 'Biomedical Engineer | Scalable Medical Devices & Digital Health | AI in Healthcare & HTM',
    currentRole: 'Biomedical Engineer & Healthcare Technology Specialist',
    currentInstitution: 'Anna University, Chennai, India',
    startDate: '18 July 2025',
    status: 'Biomedical Engineer & Applied Researcher',
    summary:
      'Biomedical engineer specializing in building scalable healthcare medical devices, digital health solutions, AI in healthcare, and healthcare technology management (HTM). Engineering and research focus covers biosignal processing, generative AI & rehabilitation engineering, neuroimaging, and computer vision.',
  },

  home: {
    hero: {
      statusBadge: 'Biomedical Engineer • Scalable Medical Devices & Digital Health',
      name: 'Marye Agegn',
      headline: 'Building Scalable Healthcare Medical Devices & Digital Health Solutions',
      positioning:
        'Bridging hands-on clinical engineering, medical device hardware, and healthcare technology management with cutting-edge AI in healthcare. Pioneering translational engineering across biosignal processing, generative AI & rehabilitation engineering, neuroimaging, and computer vision.',
      actions: [
        { label: 'Explore Engineering & Research →', href: '#research', isPrimary: true },
        { label: 'Healthcare Technology Management', href: '#experience', isPrimary: false },
        { label: 'Get in Touch', href: '#contact', isPrimary: false },
      ],
    },
    pillars: [
      {
        number: '01',
        title: 'Building Scalable Medical Devices',
        tagline: 'Hardware Innovation & Clinical Safety',
        description:
          'Designing robust, scalable, and cost-effective medical devices (such as non-invasive rTMS systems) engineered for clinical efficacy, IEC 60601 safety standards, and decentralized healthcare delivery.',
        link: { label: 'Explore Medical Device Projects →', href: '#projects' },
      },
      {
        number: '02',
        title: 'Digital Health & Healthcare Technology Management',
        tagline: 'Clinical Systems & Asset Governance',
        description:
          'Over 3 years leading medical device procurement evaluations, hospital equipment maintenance, calibration, and digital health technology lifecycles across public and private healthcare facilities.',
        link: { label: 'Explore HTM Leadership →', href: '#experience' },
      },
      {
        number: '03',
        title: 'AI in Healthcare & Advanced Technologies',
        tagline: 'Biosignals, GenAI, Vision & Imaging',
        description:
          'Developing applied AI systems for healthcare—leveraging biosignal processing, generative AI for rehabilitation engineering, neuroimaging diagnostics, and computer vision for patient monitoring.',
        link: { label: 'View Applied Research & Focus →', href: '#research' },
      },
    ],
    spotlight: {
      badge: 'Core Engineering & Innovation',
      status: 'Active Engineering Direction',
      title: 'Scalable Medical Devices, Biosignal Processing & Applied Healthcare AI',
      summary:
        'Advancing scalable healthcare technologies that bridge real-world medical hardware with intelligent digital health software—integrating biosignal processing, generative AI for adaptive rehabilitation, neuroimaging, and computer vision.',
      focusAreas: 'Scalable Medical Devices • Digital Health • Biosignal Processing • Generative AI & Rehabilitation • Neuroimaging • Computer Vision',
      disclaimer:
        'Focused on real-world clinical feasibility, practical engineering execution, and translational digital health impact.',
      link: { label: 'View Engineering & Research Focus →', href: '#research' },
    },
    trajectory: [
      {
        phase: 'Phase 1',
        title: 'Foundations & Medical Device Innovation',
        institution: 'University of Gondar, Ethiopia',
        highlight: 'B.Sc. in Biomedical Engineering (3.78/4.00 GPA) & Grade-A rTMS Capstone Neuromodulation Thesis',
      },
      {
        phase: 'Phase 2',
        title: 'Clinical Operations & HTM Leadership',
        institution: 'Ethiopian Healthcare Sector',
        highlight: 'Technical Manager (Shine Business PLC), Biomedical Officer (Central Gondar), Biomedical Engineer (Amhara Health Bureau)',
      },
      {
        phase: 'Phase 3',
        title: 'Advanced Applied Engineering',
        institution: 'Anna University, India',
        highlight: 'Advancing biosignal processing, generative AI & rehabilitation engineering, neuroimaging, and computer vision',
      },
      {
        phase: 'Phase 4',
        title: 'Scalable Global Healthcare Impact',
        institution: 'Biomedical Innovation & Digital Health',
        highlight: 'Scaling affordable medical devices, digital health platforms, and applied AI systems for worldwide clinical access',
      },
    ],
  },

  navigation: [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'research', label: 'Research' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'publications', label: 'Publications' },
    { id: 'blog', label: 'Blog & Notes' },
    { id: 'documents', label: 'Documents & CV' },
    { id: 'media', label: 'Media' },
    { id: 'vision', label: 'Future Vision' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ],

  about: {
    title: 'About',
    subtitle: 'Professional Engineering Evolution',
    leadParagraph:
      'My mission as a biomedical engineer is defined by the deliberate convergence of building scalable healthcare medical devices, digital health platforms, applied AI in healthcare, and comprehensive healthcare technology management (HTM). Grounded in over three years of direct operational experience with hospital clinical engineering, medical equipment maintenance, and procurement in Ethiopia, my current work bridges hardware engineering with applied intelligence—advancing biosignal processing, generative AI & rehabilitation engineering, neuroimaging, and computer vision.',
    
    sections: [
      {
        id: 'foundations',
        title: 'Engineering Foundations & Neuromodulation Design',
        period: '2016 – 2021',
        institution: 'University of Gondar, Ethiopia',
        narrative:
          'My academic foundation began with a Bachelor of Science in Biomedical Engineering at the University of Gondar, graduating with a 3.78/4.00 cumulative GPA. For my capstone thesis, I designed a simple, low-cost repetitive Transcranial Magnetic Stimulation (rTMS) system targeted for Major Depressive Disorder in resource-constrained clinics, earning Grade A distinction. This project established a core engineering conviction: that advanced therapeutic technology must be designed with simplicity, affordability, and practical clinical feasibility at its core.',
      },
      {
        id: 'clinical-practice',
        title: 'Frontline Clinical Engineering & Public Health Systems',
        period: '2022 – 2024',
        institution: 'Amhara Regional Health Bureau & Central Gondar Zone Health Department',
        narrative:
          'Entering the Ethiopian public healthcare system, I served as a Biomedical Engineer in Debre Birhan and Debark hospitals, followed by an appointment as Biomedical Officer for the Central Gondar Zone Health Department. Across primary and secondary public health facilities, my mandate encompassed medical equipment procurement assessment, technical specification drafting, preventive and corrective maintenance, electrical safety verification, and calibration. Working directly with clinical teams taught me that device uptime, operator training, and robust technology management are immediate determinants of healthcare access and patient outcomes.',
      },
      {
        id: 'technical-leadership',
        title: 'Technical Operations & Medical Technology Management',
        period: '2024 – 2025',
        institution: 'Shine Business PLC, Addis Ababa',
        narrative:
          'As Technical Manager at Shine Business PLC in Addis Ababa, I directed engineering operations, supervised technical service teams, and managed client healthcare technology portfolios. My responsibilities centered on technical pre-procurement evaluations, installation oversight, calibration quality assurance, and user training across clinical specialties. This leadership role consolidated a systems-level mastery of medical technology lifecycles—connecting clinical requirements, vendor specifications, regulatory compliance, and post-market maintenance.',
      },
      {
        id: 'computational-transition',
        title: 'Digital Health, Applied AI & Advanced Engineering',
        period: 'July 2025 – Present',
        institution: 'Anna University, Chennai, India',
        narrative:
          'Recognizing that next-generation healthcare demands scalable medical devices and actionable digital health intelligence, I advanced into graduate engineering research at Anna University. My engineering focus unites biosignal processing, generative AI for adaptive rehabilitation, neuroimaging, and computer vision—building resilient, clinically usable technologies engineered for scale.',
      },
    ],

    corePhilosophy: {
      statement:
        '“Effective healthcare innovation requires an intimate understanding of frontline clinical constraints, rigorous physical and signal fundamentals, and transparent, evidence-based computational models.”',
      author: 'Marye Agegn',
    },

    cvAccess: {
      status: 'Available Upon Request',
      note: 'A comprehensive academic curriculum vitae detailing clinical engineering certifications, technical specifications, and graduate coursework is available for researchers, academic collaborators, and prospective institutions.',
      actionLabel: 'Request Academic CV via Email',
      requestEmail: '2025254026@student.annauniv.edu',
    },
  },

  research: {
    title: 'Engineering & Applied Research',
    subtitle: 'Biosignal Processing • Generative AI & Rehabilitation • Neuroimaging • Computer Vision',
    graduateResearchFocus: {
      title: 'Biosignal Processing, Generative AI & Rehabilitation Engineering',
      status: 'Active Engineering & Research Direction',
      institution: 'Anna University, Chennai, India',
      commenced: 'July 2025',
      researchDirections: [
        'Biosignal Processing',
        'Generative AI (gAI)',
        'Rehabilitation Engineering',
        'Neuroimaging',
        'Computer Vision',
        'Building Scalable Medical Devices',
        'Digital Health',
        'Healthcare Technology Management',
      ],
      conceptualFocus:
        'Focused on translating advanced engineering into scalable healthcare technologies and digital health platforms. Research pursuits center on processing complex biosignals, leveraging generative AI to develop personalized rehabilitation and assistive systems, decoding neuroimaging datasets, and deploying computer vision for automated patient mobility and diagnostic tracking.',
      pillars: [
        {
          title: 'Biosignal Processing',
          summary: 'Acquisition, conditioning, and advanced filtering of physiological signals (ECG, EMG, EEG, and kinematic data) to extract critical clinical biomarkers for real-time patient monitoring.',
        },
        {
          title: 'Generative AI & Rehabilitation Engineering',
          summary: 'Developing generative AI models and adaptive algorithms for assistive robotics, smart rehabilitation devices, personalized recovery regimens, and motor function restoration.',
        },
        {
          title: 'Neuroimaging & Neuromodulation',
          summary: 'Computational neuroimaging analysis, functional brain mapping, and accessible non-invasive brain stimulation hardware (such as rTMS) for neurological and mental healthcare.',
        },
        {
          title: 'Computer Vision in Healthcare',
          summary: 'Applying computer vision, markerless spatial tracking, and deep visual representation for contactless clinical gait assessment, patient posture analysis, and diagnostic imaging.',
        },
      ],
      disclaimer:
        'Focused on translational feasibility, practical clinical utility, and scalable digital health deployment.',
    },
    currentMasterResearch: {
      title: 'Biosignal Processing, Generative AI & Rehabilitation Engineering',
      status: 'Active Engineering & Research Direction',
      institution: 'Anna University, Chennai, India',
      commenced: 'July 2025',
      researchDirections: [
        'Biosignal Processing',
        'Generative AI (gAI)',
        'Rehabilitation Engineering',
        'Neuroimaging',
        'Computer Vision',
        'Building Scalable Medical Devices',
        'Digital Health',
        'Healthcare Technology Management',
      ],
      conceptualFocus:
        'Focused on translating advanced engineering into scalable healthcare technologies and digital health platforms. Research pursuits center on processing complex biosignals, leveraging generative AI to develop personalized rehabilitation and assistive systems, decoding neuroimaging datasets, and deploying computer vision for automated patient mobility and diagnostic tracking.',
      pillars: [
        {
          title: 'Biosignal Processing',
          summary: 'Acquisition, conditioning, and advanced filtering of physiological signals (ECG, EMG, EEG, and kinematic data) to extract critical clinical biomarkers for real-time patient monitoring.',
        },
        {
          title: 'Generative AI & Rehabilitation Engineering',
          summary: 'Developing generative AI models and adaptive algorithms for assistive robotics, smart rehabilitation devices, personalized recovery regimens, and motor function restoration.',
        },
        {
          title: 'Neuroimaging & Neuromodulation',
          summary: 'Computational neuroimaging analysis, functional brain mapping, and accessible non-invasive brain stimulation hardware (such as rTMS) for neurological and mental healthcare.',
        },
        {
          title: 'Computer Vision in Healthcare',
          summary: 'Applying computer vision, markerless spatial tracking, and deep visual representation for contactless clinical gait assessment, patient posture analysis, and diagnostic imaging.',
        },
      ],
      disclaimer:
        'Focused on translational feasibility, practical clinical utility, and scalable digital health deployment.',
    },
    broaderInterests: [
      {
        category: 'Scalable Medical Devices & Hardware',
        topics: [
          'Building scalable, low-cost medical devices',
          'Repetitive Transcranial Magnetic Stimulation (rTMS) systems',
          'Wearable sensor telemetry & hardware integration',
          'IEC 60601 medical electrical safety standards & compliance',
        ],
      },
      {
        category: 'Digital Health & AI in Healthcare',
        topics: [
          'Biosignal processing & real-time telemetry pipelines',
          'Generative AI for rehabilitation & assistive technologies',
          'Neuroimaging diagnostics & computational brain modeling',
          'Computer vision for patient mobility & contactless monitoring',
        ],
      },
      {
        category: 'Healthcare Technology Management (HTM)',
        topics: [
          'Hospital medical device lifecycle & asset governance',
          'Pre-procurement technical specification formulation',
          'Preventive & corrective maintenance frameworks',
          'Digital health implementation & technical capacity building',
        ],
      },
    ],
    thematicExplorations: [
      {
        theme: 'Generative AI in Adaptive Rehabilitation',
        description: 'Building intelligent rehabilitation engineering tools that adapt exercises and assistive feedback in real-time to patient functional recovery.',
      },
      {
        theme: 'Neuroimaging & Accessible Neuromodulation',
        description: 'Integrating computational neuroimaging with scalable non-invasive brain stimulation technologies for depression and neurological disorders.',
      },
      {
        theme: 'Scalable Digital Health & Remote Monitoring',
        description: 'Engineering low-burden digital health architectures that deliver real-time biosignal insights and computer vision monitoring to resource-constrained settings.',
      },
    ],
    futureProjectsTemplate: {
      fields: ['title', 'status', 'problem', 'objective', 'methodology', 'data', 'technologies', 'outputs', 'publications', 'links'],
      note: 'Architecture prepared for adding supplementary research investigations as they are formalized.',
    },
    scopeNote:
      'The topics listed above reflect active research interests and exploratory areas for future collaborative investigation, not claims of completed studies in every area.',
  },

  projects: [
    {
      id: 'rtms-low-cost-depression-treatment',
      title: 'Design of a Simple Low-Cost Repetitive Transcranial Magnetic Stimulation System for Major Depressive Disorder Treatment in Low-Resource Settings',
      category: 'Medical Devices',
      subCategory: 'Therapeutic Neuromodulation & Accessible Hardware',
      status: 'Completed',
      academicLevel: 'Undergraduate Capstone Thesis',
      date: '2020 – 2021',
      period: '2020 – 2021',
      institution: 'University of Gondar, Ethiopia',
      grade: 'Grade: A',
      shortDescription:
        'Undergraduate engineering capstone project developing the conceptual architecture, pulsed-discharge power circuitry, and magnetic coil geometry for an accessible rTMS system designed for psychiatric care in resource-limited clinical environments.',
      problem:
        'Commercial repetitive Transcranial Magnetic Stimulation (rTMS) systems represent major capital investments and often depend on intricate cooling and power infrastructure, creating prohibitive adoption barriers for psychiatric facilities in low-resource and decentralized settings.',
      approach:
        'Evaluated magnetic field attenuation, coil geometry trade-offs, and high-voltage capacitor discharge circuitry to model adequate cortical stimulation depths while prioritizing standard industrial components, straightforward circuit modularity, and passive thermal safety.',
      outcome:
        'Successfully completed and defended the design model, validating theoretical circuit feasibility and component selection for low-cost neuromodulation hardware. Evaluated and awarded Grade A by the Department of Biomedical Engineering, University of Gondar.',
      researchRelevance:
        'Established foundational expertise in medical instrumentation, electromagnetic physics, and safety-critical hardware design, providing an essential engineering foundation that connects physical medical device engineering to current graduate research in computational neurotechnology and biomedical signal processing.',
      technologies: [
        'Electromagnetic Field Modeling',
        'High-Voltage Pulse Circuit Design',
        'Capacitor Discharge Topology',
        'Coil Geometry & Penetration Analysis',
        'Medical Device Electrical Safety',
        'Low-Resource Engineering Constraints',
      ],
      technicalSpecs: [
        {
          label: 'Pulse Circuit Topology',
          value: 'High-voltage energy storage capacitor bank coupled with solid-state controlled switching to produce reproducible short-duration magnetic discharge pulses.',
        },
        {
          label: 'Coil Geometry & Field Modeling',
          value: 'Comparative analytical assessment of planar circular and figure-of-eight winding profiles, evaluating cortical penetration depth versus focal stimulation specificity.',
        },
        {
          label: 'Low-Resource Adaptations',
          value: 'Designed around ambient-temperature air dissipation and realistic duty cycles to avoid complex liquid-nitrogen or circulating-chiller infrastructure.',
        },
        {
          label: 'Electrical Safety Framework',
          value: 'Incorporated optocoupler galvanic isolation between timing logic and pulse discharge stages, supplemented by passive bleeder resistors and discharge interlocks.',
        },
      ],
      images: [],
      repository: null,
      publication: null,
      demo: null,
      artifactStatus: {
        institutionalArchive: 'Thesis documentation and design records cataloged at University of Gondar',
        schematicsAccess: 'Available upon formal academic inquiry',
        clinicalNotice: 'Theoretical and circuit design capstone — does not claim clinical validation, patient trials, or commercial manufacturing',
      },
    },
    // Future projects across Biomedical Signal Processing, Biomechanics, and Healthcare Technology will adhere to this exact schema
  ],

  experience: [
    {
      id: 'shine-business-plc',
      position: 'Technical Manager',
      organization: 'Shine Business PLC',
      location: 'Addis Ababa, Ethiopia',
      period: '01/11/2024 – 15/07/2025',
      tier: 'Technical Operations Leadership',
      summary:
        'Directed biomedical engineering technical operations and client healthcare support services, supervising engineering teams, evaluating procurement specifications, and directing equipment maintenance, calibration, and safety compliance across healthcare facilities.',
      themes: [
        'Healthcare Technology Management',
        'Procurement & Technical Assessment',
        'Equipment Installation & Commissioning',
        'Preventive Maintenance & Calibration',
        'Technical Team Leadership',
        'Staff & Operator Training',
      ],
      responsibilities: [
        {
          focus: 'Operations & Team Coordination',
          detail: 'Supervised biomedical engineering operations, technical staff, and maintenance support contracts for client health institutions.',
        },
        {
          focus: 'Procurement & Technical Specifications',
          detail: 'Assessed medical equipment procurement requests, drafted comprehensive technical specifications, and conducted pre-installation site evaluations.',
        },
        {
          focus: 'Installation, Maintenance & Calibration',
          detail: 'Directed the installation, regular preventive maintenance, and performance calibration of clinical diagnostic and therapeutic systems.',
        },
        {
          focus: 'Technical Support & Training',
          detail: 'Delivered operator and biomedical technician training on equipment electrical safety, daily maintenance routines, and troubleshooting protocols.',
        },
      ],
    },
    {
      id: 'central-gondar-zone-health-dept',
      position: 'Biomedical Officer',
      organization: 'Central Gondar Zone Health Department',
      location: 'Gondar, Ethiopia',
      period: '28/12/2023 – 30/10/2024',
      tier: 'Zonal Healthcare Administration',
      summary:
        'Led zonal-level healthcare technology planning and medical equipment oversight across primary and secondary public health facilities, executing systematic equipment audits, technical assessments, and corrective maintenance programs.',
      themes: [
        'Healthcare Technology Management',
        'Medical Equipment Auditing',
        'Preventive Maintenance Scheduling',
        'Technical Evaluation Advisories',
        'Public Health Asset Management',
      ],
      responsibilities: [
        {
          focus: 'Zonal Asset Planning & Inventory',
          detail: 'Oversaw zonal medical equipment inventory, maintenance scheduling, and healthcare technology planning across primary and secondary facilities.',
        },
        {
          focus: 'Facility Audits & Safety Compliance',
          detail: 'Conducted systematic facility-level equipment audits, verifying operational status, safety compliance, and decommissioning needs.',
        },
        {
          focus: 'Corrective Maintenance & Calibration',
          detail: 'Executed corrective maintenance and calibration routines on patient monitoring, diagnostic, and clinical laboratory equipment.',
        },
        {
          focus: 'Health Administration Advisories',
          detail: 'Prepared technical evaluation reports and advisories for health administration regarding medical device allocation and infrastructure readiness.',
        },
      ],
    },
    {
      id: 'amhara-regional-health-bureau',
      position: 'Biomedical Engineer',
      organization: 'Amhara National Regional State Health Bureau',
      location: 'Debre Birhan and Debark, Ethiopia',
      period: '09/04/2022 – 27/12/2023',
      tier: 'Hospital Clinical Engineering',
      summary:
        'Delivered frontline hospital clinical engineering across regional healthcare facilities, executing medical device installation, corrective maintenance, electrical safety inspections, and clinical staff training to minimize diagnostic equipment downtime.',
      themes: [
        'Medical Device Engineering',
        'Installation & Commissioning',
        'Corrective & Emergency Repair',
        'Quality & Electrical Safety',
        'Hospital Technical Coordination',
        'Clinical Staff Training',
      ],
      responsibilities: [
        {
          focus: 'Hospital Device Maintenance & Repair',
          detail: 'Performed installation, acceptance testing, routine maintenance, and emergency repairs on critical diagnostic and therapeutic medical devices.',
        },
        {
          focus: 'Quality Control & Electrical Safety',
          detail: 'Enforced medical device quality assurance protocols, electrical safety verifications, and periodic performance calibration checks.',
        },
        {
          focus: 'User Safety & Operator Training',
          detail: 'Trained hospital clinical and technical personnel on standard operating procedures, safe equipment operation, and preventive care.',
        },
        {
          focus: 'Downtime Reduction & Coordination',
          detail: 'Maintained documented technical service logs and collaborated with hospital administration to reduce critical medical equipment downtime.',
        },
      ],
    },
  ],

  experienceProgressionNote:
    'From frontline hospital maintenance and safety testing to zonal technology planning and strategic technical management, this clinical grounding revealed real-world challenges in sensor reliability, equipment maintenance, and diagnostic constraints—directly motivating Marye\'s transition into graduate computational biomedical research.',

  education: [
    {
      id: 'anna-university-meng',
      degree: 'Master of Engineering (M.Eng.)',
      field: 'Biomedical Engineering',
      institution: 'Anna University',
      location: 'Chennai, India',
      period: 'July 2025 – Present',
      status: 'Current / In Progress',
      grade: null,
      thesis: {
        title: 'Applied Biomedical Engineering & Scalable Healthcare Systems',
        status: 'Graduate Engineering & Research (In Progress)',
        institution: 'Anna University, Chennai',
      },
      researchConnection:
        'Focusing on translational biomedical engineering—advancing biosignal processing, generative AI & rehabilitation engineering, neuroimaging, and computer vision to build scalable medical devices and digital health solutions.',
      keyFocus: [
        'Biosignal Processing & Filtering',
        'Generative AI & Rehabilitation Engineering',
        'Neuroimaging & Neuromodulation',
        'Computer Vision in Healthcare',
        'Building Scalable Medical Devices',
        'Digital Health & Telemetry',
      ],
    },
    {
      id: 'university-of-gondar-bsc',
      degree: 'Bachelor of Science (B.Sc.)',
      field: 'Biomedical Engineering',
      institution: 'University of Gondar',
      location: 'Gondar, Ethiopia',
      period: '2016 – 2021',
      status: 'Completed',
      grade: 'GPA: 3.78 / 4.00 (Distinction)',
      thesis: {
        title: 'Design of a simple low-cost repetitive Transcranial Magnetic Stimulation system for Major Depressive Disorder treatment in low-resource settings',
        status: 'Completed (Capstone Thesis)',
        grade: 'Grade: A',
      },
      researchConnection:
        'Established core competencies in medical device design, electromagnetic principles, circuit modeling, and physiological systems, culminating in an evaluated capstone design project on accessible neuromodulation technology.',
      keyFocus: [
        'Medical Device Design & Simulation',
        'Biomechanics & Physiological Modeling',
        'Clinical Engineering & Healthcare Technology',
        'Medical Instrumentation & Safety Standards',
        'Biomaterials Basics',
      ],
    },
  ],

  educationTrajectoryNote:
    'Academic trajectory spans from rigorous undergraduate biomedical hardware engineering and neuromodulation design at the University of Gondar to advanced applied engineering in biosignal processing, generative AI, neuroimaging, and computer vision at Anna University.',

  // Publications data model: explicitly empty per strict truth-in-content principle
  publications: {
    statusNote: 'Applied engineering publications and conference contributions are in active preparation.',
    editorialContext:
      'In accordance with professional integrity, this section highlights active applied research and translational technology developments across biosignal processing, generative AI for rehabilitation engineering, neuroimaging, and computer vision.',
    items: [],
    // Fully typed schema ready for future publication ingest
    schemaFields: [
      { field: 'title', type: 'string', description: 'Manuscript or paper title' },
      { field: 'authors', type: 'array of strings', description: 'Full author list with institutional affiliations' },
      { field: 'year', type: 'number', description: 'Publication or presentation year' },
      { field: 'venue', type: 'string', description: 'Journal name or conference proceedings' },
      { field: 'publicationType', type: 'string', description: 'Journal Article, Conference Paper, Preprint, or Workshop' },
      { field: 'doi', type: 'string or null', description: 'Digital Object Identifier string' },
      { field: 'url', type: 'string or null', description: 'Direct link to published paper record or preprint' },
      { field: 'abstract', type: 'string', description: 'Full scientific abstract text' },
      { field: 'researchArea', type: 'string', description: 'Primary academic discipline / sub-field' },
    ],
    plannedDirections: [
      {
        topic: 'Real-Time Biosignal Processing & Telemetry for Digital Health',
        institution: 'Anna University',
        status: 'Applied engineering development & validation',
      },
      {
        topic: 'Generative AI Applications in Adaptive Rehabilitation Engineering',
        institution: 'Anna University',
        status: 'Translational algorithm & systems framework',
      },
      {
        topic: 'Computer Vision Frameworks for Contactless Clinical Movement Monitoring',
        institution: 'Anna University',
        status: 'Applied vision and pose estimation pipeline',
      },
      {
        topic: 'Scalable Repetitive Transcranial Magnetic Stimulation (rTMS) Hardware',
        institution: 'University of Gondar',
        status: 'Hardware design model & circuit validation archived',
      },
    ],
  },

  skills: {
    categories: [
      {
        id: 'scalable-medical-devices',
        name: 'Building Scalable Medical Devices',
        description: 'Hardware prototyping, medical instrumentation, circuit design, and electrical safety standards.',
        skills: [
          'Building Scalable & Low-Cost Medical Devices',
          'Repetitive Transcranial Magnetic Stimulation (rTMS) Design',
          'Medical Device Electrical Safety (IEC 60601)',
          'High-Voltage Pulse & Capacitor Discharge Topology',
          'SolidWorks 3D Modeling & Mechanical Enclosures',
          'Equipment Installation, Calibration & Safety Verification',
        ],
      },
      {
        id: 'digital-health-htm',
        name: 'Digital Health & Healthcare Technology Management',
        description: 'Hospital equipment lifecycle management, clinical operations, and digital health workflows.',
        skills: [
          'Healthcare Technology Management (HTM)',
          'Medical Device Procurement Governance & Specification Formulation',
          'Preventive & Corrective Maintenance Systems',
          'Hospital Asset Auditing & Technology Planning',
          'Digital Health & Telemetry Architectures',
          'Quality Control & Assurance (QC/QA)',
        ],
      },
      {
        id: 'ai-healthcare-vision',
        name: 'AI in Healthcare & Computer Vision',
        description: 'Machine learning applications in clinical diagnostics, markerless movement tracking, and imaging.',
        skills: [
          'AI in Healthcare & Clinical Decision Support',
          'Computer Vision for Patient Mobility & Gait Tracking',
          'Markerless Spatial Pose Estimation',
          'Python (Scientific Computing, NumPy, SciPy)',
          'MATLAB (Signal & Image Processing Toolboxes)',
          'Diagnostic Image Preprocessing & Feature Extraction',
        ],
      },
      {
        id: 'biosignals-genai-neuro',
        name: 'Biosignal Processing, GenAI & Rehabilitation',
        description: 'Physiological signal conditioning, generative AI models, and neuroimaging analysis.',
        skills: [
          'Biosignal Processing (ECG, EMG, EEG & Kinematics)',
          'Generative AI (gAI) in Rehabilitation Engineering',
          'Adaptive Assistive Technology & Prosthetics Modeling',
          'Neuroimaging Analysis & Brain Mapping',
          'Digital Filtering & Artifact Removal',
          'Sensor Fusion & Kinematic Telemetry',
        ],
      },
    ],
  },

  contact: {
    title: 'Contact',
    subtitle: 'Professional & Academic Inquiries',
    professionalNote:
      'Open to academic research collaborations, scientific inquiries, and professional discussions in biomedical engineering, healthcare technology management, and computational clinical AI.',
    channels: {
      studentEmail: {
        label: 'Institutional Email',
        institution: 'Anna University',
        value: '2025254026@student.annauniv.edu',
        url: 'mailto:2025254026@student.annauniv.edu',
        type: 'email',
        note: 'Best for academic inquiries and research correspondence',
      },
      personalEmail: {
        label: 'Primary / Direct Email',
        institution: 'Personal',
        value: 'maryeagegn2022@gmail.com',
        url: 'mailto:maryeagegn2022@gmail.com',
        type: 'email',
        note: 'Direct professional communication',
      },
      linkedin: {
        label: 'LinkedIn Profile',
        institution: 'Professional Network',
        value: 'marye-agegn-88267a212',
        url: 'https://www.linkedin.com/in/marye-agegn-88267a212/',
        type: 'profile',
        note: 'Career trajectory & professional connections',
      },
      orcid: {
        label: 'ORCID Record',
        institution: 'Academic Identifier',
        value: '0009-0000-3831-7618',
        url: 'https://orcid.org/0009-0000-3831-7618',
        type: 'academic',
        note: 'Verified persistent scholarly identity',
      },
      github: {
        label: 'GitHub Profile',
        institution: 'Code & Repositories',
        value: 'MARYE-AGEGN',
        url: 'https://github.com/MARYE-AGEGN',
        type: 'code',
        note: 'Open-source code repositories and project tracking',
      },
    },
    privacyNotice:
      'Privacy Notice: In accordance with standard academic and privacy practices, residential addresses, date of birth, personal phone numbers, and messaging apps (e.g. WhatsApp) are intentionally omitted.',
  },

  // --------------------------------------------------------------------------
  // DYNAMIC CONTENT BASELINE (Used by contentStore when offline or unconfigured)
  // --------------------------------------------------------------------------
  posts: [
    {
      id: 'post-1',
      title: 'Bridging Frontline Clinical Engineering and Wearable Sensor AI',
      slug: 'bridging-clinical-engineering-and-wearable-ai',
      excerpt:
        'Why machine learning models for health monitoring often fail in hospital practice, and how direct clinical engineering experience provides a vital reality-check for computational biomedical research.',
      content: `### The Disconnect Between Laboratory AI and Clinical Reality

In computational biomedical engineering, algorithms are frequently trained and evaluated on sanitized, curated benchmark datasets. While predictive accuracy on test splits may appear impressive in scholarly papers, deploying these models in real clinical environments reveals a stark reality: sensors shift, hospital staff face severe cognitive workload, power infrastructure fluctuates, and clinicians instinctively distrust black-box predictions that offer no physiological rationale.

### Lessons from Three Years in Hospital Wards

Having spent three years as a frontline biomedical engineer, zonal officer, and technical manager in Ethiopia, I witnessed firsthand why sophisticated medical technology is abandoned in hospital storerooms. When a medical device fails in a decentralized facility, the barrier is rarely a lack of computational theory—it is a lack of usability, maintenance feasibility, calibration resilience, and transparent failure modes.

### Toward Scalable and Clinically Usable Health Technology

As I undertake engineering research in computational biomedical systems at Anna University, my priority is not merely achieving an incremental bump in theoretical metrics. My goal is to develop scalable, clinically grounded signal processing, digital health platforms, and applied AI tools that respect frontline constraints and remain robust for resource-constrained clinical settings.`,
      cover_image: null,
      category: 'Clinical Engineering',
      tags: ['Clinical Engineering', 'Healthcare Technology', 'AI in Healthcare', 'Medical Devices'],
      reading_time: '5 min read',
      status: 'published',
      created_at: '2025-08-15T10:00:00Z',
      published_at: '2025-08-15T10:00:00Z',
    },
    {
      id: 'post-2',
      title: 'Wearable Inertial Sensors in Modern Biomechanics: Opportunities and Challenges',
      slug: 'wearable-inertial-sensors-in-biomechanics',
      excerpt:
        'Ambulatory movement tracking with wearable inertial sensors offers transformative potential outside laboratory walls. Examining the engineering, signal processing, and modeling opportunities.',
      content: `### The Transition to Ambulatory Biomechanical Monitoring

Gold-standard clinical biomechanics has historically relied on multi-camera optoelectronic motion capture and instrumented force plates. While indispensable for laboratory biomechanics, these modalities are capital-intensive, require dedicated spatial real estate, and cannot assess a patient moving naturally in their home or community.

### Opportunities in Wearable Inertial Sensing

The rapid maturation of Micro-Electro-Mechanical Systems (MEMS) inertial sensors has opened remarkable possibilities:
1. **Continuous ambulatory assessment:** Capturing movement dynamics across natural daily routines rather than snapshot laboratory appointments.
2. **Minimal participant burden:** Compact, unobtrusive sensors significantly improve compliance and capture authentic biomechanical patterns.
3. **Multi-domain signal integration:** Combining linear accelerations and angular velocities to capture complex spatial kinematics.

### Computational & Signal Challenges

Ambulatory inertial recordings present unique signal processing hurdles: drift compensation, dynamic sensor orientation alignment, and movement artifact filtration. Extracting reliable clinical insights requires rigorous signal conditioning coupled with robust, clinically validated machine learning models grounded in physiological principles.`,
      cover_image: null,
      category: 'Wearable Sensors',
      tags: ['Wearable Sensors', 'Biomechanics', 'Signal Processing', 'Healthcare AI'],
      reading_time: '5 min read',
      status: 'published',
      created_at: '2025-09-02T14:30:00Z',
      published_at: '2025-09-02T14:30:00Z',
    },
  ],

  researchUpdates: [
    {
      id: 'ru-1',
      title: 'Master of Engineering Studies Commenced at Anna University (CEG)',
      summary:
        'Formalized graduate enrollment in Biomedical Engineering at Anna University, establishing computational research focus in biomedical signal processing, machine learning, and human movement analysis.',
      category: 'Milestone',
      status: 'published',
      visibility: 'public',
      created_at: '2025-07-18T09:00:00Z',
      published_at: '2025-07-18T09:00:00Z',
    },
    {
      id: 'ru-2',
      title: 'Biomedical Signal Conditioning & Baseline Benchmarking',
      summary:
        'Conducting exploratory signal conditioning, digital filtering, and baseline time-series preprocessing benchmarks for physiological and kinematic sensor data.',
      category: 'Experiment',
      status: 'published',
      visibility: 'public',
      created_at: '2025-08-28T11:00:00Z',
      published_at: '2025-08-28T11:00:00Z',
    },
    {
      id: 'ru-3',
      title: 'Applied Computer Vision & Contactless Motion Tracking Framework',
      summary:
        'Engineered markerless computer vision pipeline benchmarks for contactless clinical movement analysis, posture estimation, and spatial kinematics.',
      category: 'Milestone',
      status: 'published',
      visibility: 'public',
      created_at: '2025-09-05T16:00:00Z',
      published_at: '2025-09-05T16:00:00Z',
    },
  ],

  documents: [
    {
      id: 'doc-1',
      title: 'Academic Curriculum Vitae — Marye Agegn',
      description:
        'Comprehensive curriculum vitae detailing clinical engineering certifications, hospital technology management appointments, undergraduate capstone distinction, and graduate research trajectory.',
      category: 'CV',
      file_url: './assets/documents/Marye_Agegn_Academic_CV.pdf',
      file_type: 'PDF',
      file_size: '240 KB',
      version: 'v2.1',
      is_current_cv: true,
      last_updated: 'August 2025',
      status: 'published',
      created_at: '2025-08-20T10:00:00Z',
    },
    {
      id: 'doc-2',
      title: 'Undergraduate Capstone Summary — Low-Cost rTMS System',
      description:
        'Technical summary of the Bachelor of Science capstone thesis on capacitor-discharge pulse power circuitry and magnetic coil modeling for psychiatric care in low-resource clinics (Grade A).',
      category: 'Report',
      file_url: './assets/documents/rTMS_Capstone_Summary_Marye_Agegn.pdf',
      file_type: 'PDF',
      file_size: '380 KB',
      version: 'v1.0',
      is_current_cv: false,
      last_updated: 'July 2021',
      status: 'published',
      created_at: '2021-07-15T12:00:00Z',
    },
  ],

  media: [
    {
      id: 'media-1',
      title: 'Repetitive Transcranial Magnetic Stimulation: Circuit Topology & Electromagnetic Field Modeling',
      description:
        'Technical presentation illustrating the high-voltage pulse discharge circuitry, safety interlocks, and comparative coil geometries engineered for resource-constrained clinical settings.',
      media_type: 'video',
      file_url: './assets/media/rtms-circuit-topology.mp4',
      category: 'Presentation',
      status: 'published',
      created_at: '2025-06-10T14:00:00Z',
    },
    {
      id: 'media-2',
      title: 'Frontline Clinical Engineering: Challenges of Hospital Equipment Uptime in Developing Regions',
      description:
        'Technical seminar reviewing practical procurement assessments, electrical safety considerations, and preventive maintenance strategies across regional Ethiopian hospitals.',
      media_type: 'audio',
      file_url: './assets/media/clinical-engineering-seminar.mp3',
      category: 'Seminar',
      status: 'published',
      created_at: '2025-07-02T10:00:00Z',
    },
  ],

  vision: {
    title: 'Future Vision & Innovation',
    subtitle: 'Connecting Clinical Practice, Research, and Healthcare Technology Entrepreneurship',
    leadStatement:
      'My long-term mission is to build scalable healthcare medical devices, accessible digital health infrastructure, and applied AI tools that transform patient care—especially across decentralized and resource-constrained environments. Rather than allowing innovations to remain isolated prototypes, I engineer practical technologies built for clinical deployment, reliability, and global scale.',
    trajectoryFormula: 'Scalable Medical Devices → Healthcare Technology Management → Digital Health → Biosignals & GenAI → Global Healthcare Impact',
    bhnInitiative: {
      name: 'Biomedical Horizon Network (BHN)',
      status: 'Entrepreneurial Vision & Ecosystem Initiative Under Development',
      badge: 'Conceptual Project',
      summary:
        'A developing healthcare engineering ecosystem designed to bridge hospitals, biomedical engineers, researchers, and technology manufacturers to solve critical medical equipment uptime and technology adoption challenges in emerging markets.',
      coreProblem:
        'In many developing healthcare environments, millions of dollars of critical diagnostic and life-support equipment sit idle due to fragmented procurement, absent local maintenance capacity, erratic supply chains, and lack of specialized technical training.',
      pillars: [
        {
          number: '01',
          title: 'Lifecycle Healthcare Technology Management',
          description:
            'Establishing structured preventive maintenance contracts, calibrated testing protocols, and electrical safety standards (IEC 60601) to maximize hospital device uptime.',
        },
        {
          number: '02',
          title: 'Evidence-Based Procurement Advisory',
          description:
            'Providing independent pre-procurement technical specification drafting and tender evaluation to ensure medical devices match local clinical infrastructure and electrical power reliability.',
        },
        {
          number: '03',
          title: 'Frugal Innovation & Collaborative Prototyping',
          description:
            'Bridging academic researchers and clinical engineers to design, adapt, and validate low-cost, open-hardware medical technologies engineered for resource-limited environments.',
        },
        {
          number: '04',
          title: 'Technical Capacity Building & Training',
          description:
            'Empowering hospital technicians, clinical engineers, and healthcare workers with hands-on training in equipment safety, daily calibration, and diagnostic troubleshooting.',
        },
      ],
      disclaimer:
        'Notice: The Biomedical Horizon Network (BHN) is an entrepreneurial vision and collaborative concept currently under developmental planning. It is presented as an intentional future trajectory rather than an established commercial enterprise.',
    },
  },
};

export default siteData;
