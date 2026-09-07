/**
 * Professional Website Concept, Information Hierarchy & Visual Specification
 * 
 * Target Persona: Marye Agegn
 * Role: Biomedical Engineer & Graduate Researcher (M.Eng., Anna University)
 * Domain: Clinical Engineering Practice -> Biomedical Signal Processing -> Explainable AI in Healthcare
 */

export const designSpec = {
  version: '1.0.0',
  stage: 'Stage 3: Professional Website Concept & Visual Direction',

  // 1. Design Personality & Ethos
  personality: {
    primaryArchetype: 'Scientific-Clinical Hybrid',
    descriptors: [
      'Scientific',
      'Technically Competent',
      'Modern',
      'Precise',
      'Intelligent',
      'Calm',
      'Credible',
      'Human-Centered',
      'Research-Oriented',
    ],
    prohibitedTones: [
      'Corporate SaaS / Startup marketing hype',
      'Flashy generic software developer portfolio',
      'Academic CV plain HTML dump',
      'Futuristic sci-fi / neon cyberpunk aesthetics',
      'Arbitrary decorative animations and buzzword fluff',
    ],
    visualMetaphor:
      'A peer-reviewed scientific monograph combined with the precision instrumentation of a biomedical engineering laboratory. High data density with immaculate clarity and structural breathing room.',
  },

  // 2. Three-Tier Content Hierarchy
  contentHierarchy: {
    level1: {
      name: 'Current Professional Identity',
      definition: 'Immediate, unmistakable communication of who Marye is today and the core computational direction.',
      elements: [
        'Full name & professional title (Biomedical Engineer & Graduate Researcher)',
        'Affiliation: Master of Engineering Candidate at Anna University, Chennai',
        'Concise positioning statement on explainable deep learning for mobility assessment',
        'Primary action paths: Explore Master\'s Research, View Clinical Experience, Contact',
      ],
    },
    level2: {
      name: 'Grounded Evidence Base',
      definition: 'Documented, verified technical competencies and accomplishments across practice and academia.',
      elements: [
        'Master\'s thesis research framework (lower-back IMU, dual-task gait, 11-step pipeline)',
        'Three years of clinical engineering practice in Ethiopia (Shine Business PLC, Central Gondar Health Dept, Amhara Health Bureau)',
        'Undergraduate thesis capstone (Low-cost rTMS design for MDD treatment in low-resource settings, Grade A)',
        'Verified academic degrees (Anna University M.Eng. & University of Gondar B.Sc. 3.78/4.00)',
      ],
    },
    level3: {
      name: 'Future Trajectory & Intellectual Horizons',
      definition: 'Explicitly labeled areas of exploratory inquiry and scholarly intent (distinguished from past claims).',
      elements: [
        'Categorized research interests (Signals/AI, Devices/Biomechanics, Health Systems)',
        'Thematic clinical focus areas (Maternal Health, Brain Tumors, Mental Health)',
        'Forthcoming scholarly manuscripts and publications schema',
      ],
    },
  },

  // 3. Recommended Vertical Narrative Hierarchy
  pageFlow: [
    {
      id: 'home',
      name: 'Hero / Executive Positioning',
      role: 'Quickly answers: Who is Marye? What does he work on? Where is he heading?',
      emphasis: 'High',
    },
    {
      id: 'research',
      name: 'Current Master\'s Research',
      role: 'Immediately establishes research caliber: explainable deep learning, sensor modalities, and methodology pipeline.',
      emphasis: 'Highest (Flagship Academic Anchor)',
    },
    {
      id: 'about',
      name: 'Professional Trajectory & About',
      role: 'Frames the coherent 4-stage evolution from engineering foundations to clinical practice to AI-driven healthcare.',
      emphasis: 'Medium-High',
    },
    {
      id: 'experience',
      name: 'Clinical Engineering Practice',
      role: 'Proves operational competence in medical device procurement, calibration, electrical safety, and hospital operations.',
      emphasis: 'High',
    },
    {
      id: 'projects',
      name: 'Technical Case Studies',
      role: 'Undergraduate rTMS capstone presented with problem, electromagnetic modeling approach, safety constraints, and outcome.',
      emphasis: 'High',
    },
    {
      id: 'education',
      name: 'Academic Credentials',
      role: 'Anna University graduate study and University of Gondar distinction.',
      emphasis: 'Medium',
    },
    {
      id: 'skills',
      name: 'Structured Competency Matrix',
      role: 'Categorized technical domains without arbitrary skill bars or percentages.',
      emphasis: 'Medium',
    },
    {
      id: 'interests',
      name: 'Research Horizons & Themes',
      role: 'Signals future collaborative interests (Maternal Health, Neuro-oncology, Neuromodulation).',
      emphasis: 'Medium',
    },
    {
      id: 'publications',
      name: 'Scholarly Work / In Preparation',
      role: 'Transparent, dignified empty state awaiting peer-reviewed manuscripts.',
      emphasis: 'Subdued',
    },
    {
      id: 'contact',
      name: 'Professional Channels',
      role: 'Direct, privacy-compliant communication pathways for research and professional inquiries.',
      emphasis: 'Medium',
    },
  ],

  // 4. Proposed Visual System
  visualSystem: {
    typography: {
      primaryFamily:
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      monoFamily:
        '"JetBrains Mono", "SF Mono", Menlo, Consolas, Monaco, "Courier New", monospace',
      scale: {
        h1: { size: 'clamp(2.25rem, 4vw, 3.25rem)', lineHeight: 1.15, weight: 700, letterSpacing: '-0.03em' },
        h2: { size: 'clamp(1.5rem, 2.5vw, 2rem)', lineHeight: 1.25, weight: 700, letterSpacing: '-0.02em' },
        h3: { size: '1.25rem', lineHeight: 1.35, weight: 600, letterSpacing: '-0.01em' },
        bodyLg: { size: '1.125rem', lineHeight: 1.65, weight: 400 },
        bodyBase: { size: '1rem', lineHeight: 1.6, weight: 400 },
        bodySm: { size: '0.875rem', lineHeight: 1.5, weight: 400 },
        technicalLabel: { size: '0.75rem', lineHeight: 1.4, weight: 600, letterSpacing: '0.05em', uppercase: true },
      },
    },

    colorPalette: {
      mode: 'Technical Darkroom / Muted Clinical Slate',
      tokens: {
        backgroundBase: '#0b0f17',       // Deep scientific charcoal
        backgroundSurface: '#131b2a',    // Neutral clinical container surface
        backgroundElevated: '#1a2436',   // Card background on hover or highlight
        borderSubtle: '#222f44',         // Clean, non-distracting architectural dividers
        borderFocus: '#38bdf8',          // Accessible focus ring
        textPrimary: '#f8fafc',          // 95% luminance for maximum legibility
        textSecondary: '#94a3b8',        // WCAG AAA compliant body text
        textMuted: '#64748b',            // Metadata, captions, technical labels
        accentClinical: '#0ea5e9',       // Precision technical cyan (interactive links, badges)
        accentHighlight: '#38bdf8',      // Active states, pipeline indicator
        accentWarm: '#38bdf8',           // Avoid neon glow; functional highlighting only
        statusInProgress: 'rgba(56, 189, 248, 0.15)',
        statusCompleted: 'rgba(52, 211, 153, 0.15)',
      },
    },

    spacingAndGrid: {
      baseUnit: '8px',
      containerMaxWidth: '1120px',
      sectionVerticalPadding: 'clamp(3.5rem, 6vw, 5.5rem)',
      cardPadding: '1.5rem',
      cardRadius: '8px',                // Crisp, architectural radius (not bubble-like)
      gridGap: '1.25rem',
    },

    cardPhilosophy: {
      type: 'Structured Research Cards',
      rules: [
        'Every card must have a clear metadata header (category, status, dates).',
        'Body content must follow clear information ordering (Problem -> Approach -> Outcome for projects; Responsibilities -> Domains for experience).',
        'No decorative drop shadows; use precise 1px borders and distinct surface tones.',
      ],
    },
  },

  // 5. Navigation Strategy
  navigation: {
    model: 'Sticky Header with Contextual Section Tracking',
    structure: {
      desktop: [
        { label: 'Research', target: '#research' },
        { label: 'About', target: '#about' },
        { label: 'Experience', target: '#experience' },
        { label: 'Projects', target: '#projects' },
        { label: 'Education', target: '#education' },
        { label: 'Skills', target: '#skills' },
        { label: 'Contact', target: '#contact' },
      ],
      brand: {
        name: 'Marye Agegn',
        subtitle: 'BME & Research',
        statusPill: 'Anna University • M.Eng.',
      },
      mobile: 'Collapsible semantic menu with touch targets >= 44px',
    },
  },

  // 6. Interaction & Motion Strategy
  interactionStrategy: {
    interactiveComponents: [
      {
        component: 'Methodological Pipeline Explorer (Research Section)',
        purpose: 'Allows researchers to click/step through the 11 stages of the IMU deep learning pipeline to examine signal inputs, feature representations, and explainability mechanisms without visual clutter.',
        interactionType: 'Tabbed / Sequential Stage Stepper',
      },
      {
        component: 'Technical Case Study Accordion/Modal (Projects Section)',
        purpose: 'Enables visitors to expand deeper technical specs on the rTMS project (coil geometry, capacitor bank parameters, safety criteria).',
        interactionType: 'Progressive Disclosure',
      },
      {
        component: 'Quick Filter for Skills & Interests',
        purpose: 'Allows viewers to toggle between Clinical Engineering, Signal/AI, and Device Design.',
        interactionType: 'Categorical Filtering',
      },
    ],
    motionRules: [
      'Transition durations strictly capped between 150ms and 250ms.',
      'Easing curves: cubic-bezier(0.16, 1, 0.3, 1) for natural deceleration.',
      'No auto-rotating carousels, bouncing elements, or scroll-jacking.',
      'Full compliance with prefers-reduced-motion: reduce media query.',
    ],
  },

  // 7. Accessibility & Integrity Standards
  accessibilityAndIntegrity: {
    colorContrast: 'All text combinations exceed WCAG 2.1 AA (4.5:1) and target AAA (7:1) for body text.',
    keyboardNavigation: 'All interactive elements (buttons, links, pipeline steps) have prominent outline-offset focus rings.',
    semanticStructure: 'Single h1, sequential h2/h3 hierarchy, native section, nav, article, header, and footer tags.',
    privacyEnforcement: 'Strict exclusion of residential address, birth date, and private phone numbers.',
    truthInContent: 'Explicit separation of verified past work vs. ongoing research vs. future exploratory interests.',
  },
};

export default designSpec;
