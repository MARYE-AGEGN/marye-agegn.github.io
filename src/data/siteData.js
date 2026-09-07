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
    headline: 'Biomedical Engineer & Graduate Researcher',
    currentRole: 'Master of Engineering Candidate in Biomedical Engineering',
    currentInstitution: 'Anna University, Chennai, India',
    startDate: '18 July 2025',
    status: 'Graduate Student & Biomedical Researcher',
    summary:
      'Biomedical engineer with extensive hands-on clinical engineering and healthcare technology management experience in Ethiopia, currently pursuing a Master of Engineering in Biomedical Engineering at Anna University. Research focuses on explainable deep learning frameworks for mobility and gait assessment using inertial sensor data.',
  },

  home: {
    hero: {
      statusBadge: 'M.Eng. Candidate in Biomedical Engineering • Anna University',
      name: 'Marye Agegn',
      headline: 'Biomedical Engineer & Graduate Researcher',
      positioning:
        'Bridging three years of frontline hospital clinical engineering, medical device management, and procurement leadership in Ethiopia with computational biomedical research, currently developing explainable deep learning frameworks for dual-task mobility assessment from inertial sensor data.',
      actions: [
        { label: "Explore Master's Research →", href: '#research', isPrimary: true },
        { label: 'Clinical Engineering Practice', href: '#experience', isPrimary: false },
        { label: 'Get in Touch', href: '#contact', isPrimary: false },
      ],
    },
    pillars: [
      {
        number: '01',
        title: 'Clinical Engineering Practice',
        tagline: '3+ Years of Public Health Operations',
        description:
          'Led medical equipment procurement assessments, technical specification drafting, preventive maintenance schedules, and calibration protocols across hospitals and health bureaus in Ethiopia.',
        link: { label: 'Explore Clinical Experience →', href: '#experience' },
      },
      {
        number: '02',
        title: 'Medical Device Engineering',
        tagline: 'Capstone Neuromodulation Design (Grade A)',
        description:
          'Engineered power electronics, capacitor discharge circuits, and magnetic stimulation coils for a low-cost repetitive Transcranial Magnetic Stimulation (rTMS) system tailored for low-resource psychiatric care.',
        link: { label: 'View rTMS Project →', href: '#projects' },
      },
      {
        number: '03',
        title: 'Explainable AI & Sensor Research',
        tagline: "Active Master's Thesis Direction (In Progress)",
        description:
          'Investigating explainable deep learning frameworks for dual-task mobility assessment using tri-axial accelerometer and gyroscope data from a single lower-back IMU at Anna University.',
        link: { label: 'Examine Research Framework →', href: '#research' },
      },
    ],
    spotlight: {
      badge: "Flagship Academic Research Direction",
      status: 'In Progress • Master\'s Thesis',
      title: 'Development of an Explainable Deep Learning Framework for Dual-Task Mobility Assessment Using a Single Lower-Back Inertial Measurement Unit',
      summary:
        'Addressing the gap between black-box deep learning models and clinical utility by capturing latent gait dynamics from wearable inertial sensor signals and grounding feature importance in established clinical biomechanics.',
      sensorModality: 'Single lower-back Inertial Measurement Unit (IMU)',
      evaluationProtocol: 'Single-task and cognitive-motor dual-task walking protocols',
      disclaimer:
        'Notice: Ongoing graduate thesis project under active computational development. It does not claim clinical validation, diagnostic deployment, or clinical certification at this stage.',
      link: { label: 'View 11-Stage Methodological Pipeline →', href: '#research' },
    },
    trajectory: [
      {
        phase: 'Phase 1',
        title: 'Foundations & Capstone',
        institution: 'University of Gondar, Ethiopia',
        highlight: 'B.Sc. in Biomedical Engineering (3.78/4.00 GPA) & Grade-A rTMS Capstone Thesis',
      },
      {
        phase: 'Phase 2',
        title: 'Clinical Leadership',
        institution: 'Ethiopian Healthcare Sector',
        highlight: 'Technical Manager (Shine Business PLC), Biomedical Officer (Central Gondar), Biomedical Engineer (Amhara Health Bureau)',
      },
      {
        phase: 'Phase 3',
        title: 'Graduate Research',
        institution: 'Anna University, India',
        highlight: 'Master of Engineering Candidate specializing in biomedical signal processing and deep learning',
      },
      {
        phase: 'Phase 4',
        title: 'Future Horizons',
        institution: 'Translational Health Technology',
        highlight: 'Bridging explainable machine learning models and assistive neurotechnology for evidence-based clinical decision support',
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
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ],

  about: {
    title: 'About',
    subtitle: 'Evolution of Professional Identity',
    leadParagraph:
      'My trajectory as a biomedical engineer is defined by the deliberate convergence of frontline healthcare technology practice and data-driven computational research. Rather than viewing engineering as an abstract theoretical exercise, my work is grounded in years of direct experience with clinical operations, medical device management, and hospital technology lifecycles in Ethiopia, informing my current graduate research in explainable deep learning at Anna University.',
    
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
        title: "The Computational Shift & Master's Research Direction",
        period: 'July 2025 – Present',
        institution: 'Anna University, Chennai, India',
        narrative:
          'Recognizing that the future of diagnostic and therapeutic medicine depends on intelligent, objective, and interpretable clinical decision support, I transitioned into full-time graduate research, commencing my Master of Engineering in Biomedical Engineering at Anna University in July 2025. My current research direction focuses on developing an explainable deep learning framework for dual-task mobility assessment using wearable inertial measurement units (IMUs). By extracting latent gait dynamics and grounding neural network feature attributions in biomechanical principles, the goal is to create algorithmic assessments that clinicians can understand, verify, and trust.',
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
    title: 'Research',
    subtitle: 'Explainable Deep Learning & Wearable Sensor Biomechanics',
    currentMasterResearch: {
      title: 'Development of an Explainable Deep Learning Framework for Dual-Task Mobility Assessment Using a Single Lower-Back Inertial Measurement Unit',
      status: 'In Progress (Master\'s Thesis Research)',
      institution: 'Anna University, Chennai, India',
      commenced: 'July 2025',
      researchDirections: [
        'Biomedical Engineering',
        'Biomedical Signal Processing',
        'Biomechanics',
        'Deep Learning',
        'Explainable Artificial Intelligence (XAI)',
        'Mobility & Gait Assessment',
      ],
      centralResearchQuestion:
        'How can raw lower-back inertial measurement unit signals be transformed into clinically meaningful, explainable mobility assessment?',
      conceptualFocus:
        'This research focuses on transforming wearable sensor signals into interpretable mobility representations rather than treating deep learning as an end-to-end black-box classifier. In this framework, classification across single-task and dual-task walking protocols functions primarily as an intermediate validation mechanism. The overarching objective is to derive objective latent movement parameters and ground neural network feature attributions in established clinical biomechanics to provide trustworthy decision support for clinicians.',
      dataModality: {
        sensor: 'Single Lower-Back Inertial Measurement Unit (IMU)',
        placement: 'Lumbar / Lower-back anatomical placement (L4–L5 position)',
        signals: 'Tri-axial Accelerometer (linear kinematics) and Tri-axial Gyroscope (angular kinematics)',
        protocols: 'Single-task walking and cognitive-motor dual-task walking protocols',
      },
      pipelinePhases: [
        {
          phaseNum: 'Phase I',
          phaseTitle: 'Signal Acquisition & Conditioning',
          stages: [
            {
              step: 1,
              name: 'Raw Lower-Back IMU',
              summary: 'Continuous 3D acceleration and angular velocity acquisition.',
              technicalDetail:
                'Acquires tri-axial linear acceleration and angular velocity signals during structured walking trials from a single lumbar-positioned IMU.',
            },
            {
              step: 2,
              name: 'Preprocessing',
              summary: 'Digital filtering, coordinate alignment, and drift correction.',
              technicalDetail:
                'Applies digital bandpass filtering to remove low-frequency baseline drift and high-frequency noise, calibrating orientation to standard anatomical coordinates.',
            },
            {
              step: 3,
              name: 'Window Segmentation',
              summary: 'Partitioning time-series into stride-wise and temporal epochs.',
              technicalDetail:
                'Divides continuous multi-channel kinematic data into overlapping fixed-duration and stride-correlated temporal windows for sequential model ingestion.',
            },
          ],
        },
        {
          phaseNum: 'Phase II',
          phaseTitle: 'Representation Learning',
          stages: [
            {
              step: 4,
              name: 'Deep Learning',
              summary: 'Neural architectures capturing hierarchical spatio-temporal dynamics.',
              technicalDetail:
                'Leverages deep neural network architectures designed to extract non-linear temporal features across multi-channel inertial sensor inputs.',
            },
            {
              step: 5,
              name: 'Latent Features',
              summary: 'Low-dimensional kinematic embeddings of walking dynamics.',
              technicalDetail:
                'Forms dense latent feature representations that capture intrinsic motor patterns, step variability, and gait asymmetry under varying cognitive loads.',
            },
            {
              step: 6,
              name: 'Mobility Parameter Estimation',
              summary: 'Quantitative gait metrics and dual-task interference computation.',
              technicalDetail:
                'Derives objective kinematic indicators including cadence regularity, temporal variability, balance indices, and dual-task cost metrics.',
            },
          ],
        },
        {
          phaseNum: 'Phase III',
          phaseTitle: 'Interpretability & Biomechanics',
          stages: [
            {
              step: 7,
              name: 'Explainability',
              summary: 'Mathematical feature attribution across temporal epochs.',
              technicalDetail:
                'Implements attribution and saliency mechanisms to explain which sensor axes, frequency components, and gait phases drive model representations.',
            },
            {
              step: 8,
              name: 'Feature Importance',
              summary: 'Ranking critical kinematic variables distinguishing motor performance.',
              technicalDetail:
                'Quantifies and ranks the relative significance of acceleration and angular rate features across single-task and dual-task conditions.',
            },
            {
              step: 9,
              name: 'Biomechanics Knowledge Base',
              summary: 'Grounding identified feature patterns in validated clinical biomechanics.',
              technicalDetail:
                'Maps model-identified salient features to established clinical gait literature, ensuring consistency with physiological movement mechanics.',
            },
          ],
        },
        {
          phaseNum: 'Phase IV',
          phaseTitle: 'Clinical Translation',
          stages: [
            {
              step: 10,
              name: 'Functional Interpretation',
              summary: 'Translating algorithmic scores into clinical functional indicators.',
              technicalDetail:
                'Synthesizes algorithmic outputs into meaningful functional indicators reflecting motor-cognitive interference and mobility degradation.',
            },
            {
              step: 11,
              name: 'Clinician-Oriented Presentation',
              summary: 'Transparent, interpretable visual reports for clinical support.',
              technicalDetail:
                'Delivers transparent decision-support visualization detailing raw signal trajectories, highlighted critical intervals, and summary mobility parameters.',
            },
          ],
        },
      ],
      disclaimer:
        'Academic Research Notice: This work is an ongoing master\'s thesis in biomedical engineering under active computational development at Anna University. It does not claim clinical validation, automated disease diagnosis, or clinical deployment.',
    },
    broaderInterests: [
      {
        category: 'Core Engineering & Modeling',
        topics: [
          'Medical device design, modeling and simulation',
          'Biomaterials',
          'Biomechanics',
          'Tissue engineering',
        ],
      },
      {
        category: 'Signal, Imaging & AI',
        topics: [
          'Biomedical signal processing and analysis',
          'Medical image processing',
          'Explainable AI for clinical decision support',
          'Inertial sensor-based gait & mobility analysis',
        ],
      },
      {
        category: 'Healthcare Systems & Clinical Translation',
        topics: [
          'Assistive technologies for rehabilitation',
          'Healthcare technology management (HTM)',
          'Quality control and quality assurance in medical devices',
        ],
      },
    ],
    thematicExplorations: [
      {
        theme: 'Maternal Health Technologies',
        description: 'Interest in accessible monitoring systems and medical technologies tailored for maternal care in resource-constrained environments.',
      },
      {
        theme: 'Brain Tumors & Neuroimaging',
        description: 'Interest in quantitative imaging analysis and machine learning methods for neuro-oncology assessment.',
      },
      {
        theme: 'Mental Health & Neuromodulation',
        description: 'Interest in therapeutic neurotechnology, non-invasive stimulation (e.g., rTMS), and objective digital biomarkers for mental health conditions.',
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
      title: 'Design of a Simple Low-Cost Repetitive Transcranial Magnetic Stimulation System for Major Depression Disorder Treatment in Low-Resource Settings',
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
        title: 'Development of an Explainable Deep Learning Framework for Dual-Task Mobility Assessment Using a Single Lower-Back Inertial Measurement Unit',
        status: 'In Progress (Master\'s Thesis Research)',
        institution: 'Anna University, Chennai',
      },
      researchConnection:
        'Connects foundational biomedical engineering with computational intelligence—investigating deep learning architectures and explainable AI methods to transform wearable inertial sensor data into clinically interpretable mobility indices.',
      keyFocus: [
        'Biomedical Signal Processing',
        'Deep Learning in Healthcare',
        'Explainable Artificial Intelligence (XAI)',
        'Gait & Mobility Biomechanics',
        'Wearable Inertial Sensing',
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
        title: 'Design of a simple low-cost repetitive Transcranial Magnetic Stimulation system for Major Depression Disorder treatment in low-resource settings',
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
    'Academic trajectory spans from rigorous undergraduate engineering fundamentals and neuromodulation hardware design at the University of Gondar to advanced computational biomedical signal processing, machine learning, and biomechanics at Anna University.',

  // Publications data model: explicitly empty per strict truth-in-content principle
  publications: {
    statusNote: 'Formal publications and peer-reviewed conference manuscripts are currently in active preparation.',
    editorialContext:
      'In accordance with strict academic integrity, this section does not list simulated citations or provisional papers. Forthcoming manuscripts resulting from ongoing master\'s thesis research at Anna University in explainable AI for wearable mobility assessment will appear here upon completion of peer review.',
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
        topic: 'Explainable Deep Learning for IMU Gait & Mobility Assessment',
        institution: 'Anna University',
        status: 'Active computational research & validation',
      },
      {
        topic: 'Wearable Sensor Biomechanics & Dual-Task Interference Modeling',
        institution: 'Anna University',
        status: 'Kinematic feature attribution framework in progress',
      },
      {
        topic: 'Low-Cost Repetitive Transcranial Magnetic Stimulation Hardware',
        institution: 'University of Gondar',
        status: 'Undergraduate thesis design model archived',
      },
    ],
  },

  skills: {
    categories: [
      {
        id: 'biomedical-devices',
        name: 'Biomedical Engineering & Medical Devices',
        description: 'Hands-on clinical engineering, equipment life-cycle management, and safety protocols.',
        skills: [
          'Medical Device Installation & Commissioning',
          'Preventive & Corrective Maintenance',
          'Equipment Calibration & Safety Verification',
          'Medical Equipment Technical Assessment',
          'Healthcare Technology Management (HTM)',
          'Electrical Safety Standards (IEC 60601)',
        ],
      },
      {
        id: 'signals-biomechanics',
        name: 'Signals, Biomechanics & Imaging',
        description: 'Quantitative kinematic analysis, sensor time-series processing, and physiological modeling.',
        skills: [
          'Biomedical Signal Processing & Filtering',
          'Biomechanics Principles & Gait Analysis',
          'Medical Image Processing Concepts',
          'Inertial Measurement Unit (IMU) Kinematics',
          'Single-Task & Dual-Task Protocol Analysis',
        ],
      },
      {
        id: 'computational-tools',
        name: 'Computational Tools & Languages',
        description: 'Programming environments, scientific computing platforms, and CAD modeling software.',
        skills: [
          'Python (Scientific Computing, NumPy, SciPy)',
          'MATLAB (Signal Processing Toolbox)',
          'SQL / MS SQL Server (Database Management)',
          'C',
          'C++',
          'Java',
          'HTML',
          'SolidWorks (3D Mechanical Modeling)',
        ],
      },
      {
        id: 'professional-operations',
        name: 'Professional & Healthcare Operations',
        description: 'Technical administration, quality assurance, procurement governance, and staff development.',
        skills: [
          'Medical Device Procurement Governance',
          'Technical Specifications Formulation',
          'Technical Project Planning & Execution',
          'Facility Equipment Auditing & Asset Planning',
          'Quality Control & Assurance (QC/QA)',
          'Technical Evaluation Reports & Advisories',
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
};

export default siteData;
