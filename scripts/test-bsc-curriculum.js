/**
 * Automated Test Suite for University of Gondar BSc Biomedical Engineering Curriculum
 * 
 * Verifies official curriculum data integrity, AI knowledge retrieval layer,
 * exact QA test cases, course code lookups, academic boundaries (BSc vs Master's),
 * anti-hallucination, and source attribution.
 */

import {
  GONDAR_BSC_CURRICULUM_METADATA,
  GONDAR_BSC_COURSES,
  searchGondarBscCurriculum,
  findBscCourseByCode,
  getBscCurriculumByYear,
} from '../src/data/gondarBscCurriculum.js';

import { defaultKnowledgeRetriever } from '../src/services/ai/knowledgeRetriever.js';
import { IntentEngine, INTENTS } from '../src/services/ai/intentEngine.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runBscCurriculumTests() {
  console.log('\n===============================================================');
  console.log('UNIVERSITY OF GONDAR BSC BIOMEDICAL ENGINEERING CURRICULUM TESTS');
  console.log('Authoritative Source: https://iot.uog.edu.et/biomedical-engineering-bsc-program/');
  console.log('===============================================================\n');

  // --------------------------------------------------------------------------
  // Group 1: Metadata & Graduation Requirements Verification
  // --------------------------------------------------------------------------
  console.log('Group 1: Official Institutional Metadata & Graduation Requirements');
  assert(
    GONDAR_BSC_CURRICULUM_METADATA.institution === 'University of Gondar, Institute of Technology',
    'Institution matches official name: University of Gondar, Institute of Technology'
  );
  assert(
    GONDAR_BSC_CURRICULUM_METADATA.program === 'Bachelor of Science in Biomedical Engineering',
    'Program matches: Bachelor of Science in Biomedical Engineering'
  );
  assert(
    GONDAR_BSC_CURRICULUM_METADATA.duration === '5 Years',
    'Program duration is exactly 5 Years'
  );
  assert(
    GONDAR_BSC_CURRICULUM_METADATA.graduationRequirements.totalCreditHours === 177,
    'Total credit hours required: 177 CrHr'
  );
  assert(
    GONDAR_BSC_CURRICULUM_METADATA.graduationRequirements.totalECTS === 318,
    'Total ECTS required: 318 ECTS'
  );
  assert(
    GONDAR_BSC_CURRICULUM_METADATA.graduationRequirements.categories.generalEducationAndEngineering.creditHours === 55 &&
      GONDAR_BSC_CURRICULUM_METADATA.graduationRequirements.categories.generalEducationAndEngineering.ects === 91,
    'General Education and Engineering: 55 CrHr / 91 ECTS'
  );
  assert(
    GONDAR_BSC_CURRICULUM_METADATA.graduationRequirements.categories.supportive.creditHours === 53 &&
      GONDAR_BSC_CURRICULUM_METADATA.graduationRequirements.categories.supportive.ects === 88,
    'Supportive courses: 53 CrHr / 88 ECTS'
  );
  assert(
    GONDAR_BSC_CURRICULUM_METADATA.graduationRequirements.categories.coreMajor.creditHours === 65 &&
      GONDAR_BSC_CURRICULUM_METADATA.graduationRequirements.categories.coreMajor.ects === 134,
    'Core / Major courses: 65 CrHr / 134 ECTS'
  );
  assert(
    GONDAR_BSC_CURRICULUM_METADATA.graduationRequirements.categories.electives.creditHours === 3 &&
      GONDAR_BSC_CURRICULUM_METADATA.graduationRequirements.categories.electives.ects === 5,
    'Electives: 3 CrHr / 5 ECTS'
  );
  assert(
    GONDAR_BSC_CURRICULUM_METADATA.source_url === 'https://iot.uog.edu.et/biomedical-engineering-bsc-program/',
    'Official Source URL is preserved exactly'
  );

  // --------------------------------------------------------------------------
  // Group 2: Course Catalog Completeness & Chronology (Years I to V)
  // --------------------------------------------------------------------------
  console.log('\nGroup 2: Course Catalog Structure (62 Courses across 5 Years)');
  assert(GONDAR_BSC_COURSES.length === 62, `Total courses cataloged is 62 (found: ${GONDAR_BSC_COURSES.length})`);

  const internship = findBscCourseByCode('BMED-4254');
  assert(
    internship && internship.title === 'Internship' && internship.year === 'Year IV' && internship.semester === 'Semester II',
    'Internship course verified: BMED-4254 — Internship (Year IV, Semester II)'
  );

  const thesis = findBscCourseByCode('BMED-5281');
  assert(
    thesis && thesis.title === 'B.Sc. Thesis' && thesis.year === 'Year V' && thesis.semester === 'Semester II',
    'Independent Capstone Thesis verified: BMED-5281 — B.Sc. Thesis (Year V, Semester II)'
  );

  const byYear = getBscCurriculumByYear();
  assert(byYear.length === 5, 'Curriculum correctly partitioned into 5 academic years');
  assert(byYear[0].semester1.length === 7, 'Year I Semester I has exactly 7 courses');
  assert(byYear[0].semester2.length === 7, 'Year I Semester II has exactly 7 courses');

  // --------------------------------------------------------------------------
  // Group 3: Specific QA Test Cases Required by User
  // --------------------------------------------------------------------------
  console.log('\nGroup 3: User Required QA Test Scenarios');

  // Test Case A: "Did Marye study biomedical signal processing during her BSc?"
  const testAInput = 'Did Marye study biomedical signal processing during her BSc?';
  const testAResponse = defaultKnowledgeRetriever.formatCurriculumQueryResponse(testAInput);
  const expectedA = 'Yes. BMED-3231 — Biomedical Signal Processing, Year III Semester II, according to the University of Gondar BSc Biomedical Engineering curriculum.';
  assert(
    testAResponse.includes(expectedA),
    `Test A: "${testAInput}"\n    Expected prefix: "${expectedA}"\n    Matches: ${testAResponse.includes(expectedA)}`
  );

  // Test Case B: "Did Marye study biomechanics?"
  const testBInput = 'Did Marye study biomechanics?';
  const testBResponse = defaultKnowledgeRetriever.formatCurriculumQueryResponse(testBInput);
  const expectedB = 'Yes. BMED-3221 — Biomechanics, Year III Semester I.';
  assert(
    testBResponse.includes(expectedB),
    `Test B: "${testBInput}"\n    Expected prefix: "${expectedB}"\n    Matches: ${testBResponse.includes(expectedB)}`
  );

  // Test Case C: "Did Marye study embedded systems?"
  const testCInput = 'Did Marye study embedded systems?';
  const testCResponse = defaultKnowledgeRetriever.formatCurriculumQueryResponse(testCInput);
  const expectedC = 'Yes. BMED-5152 — Embedded Systems and Interfacing, Year V Semester I.';
  assert(
    testCResponse.includes(expectedC),
    `Test C: "${testCInput}"\n    Expected prefix: "${expectedC}"\n    Matches: ${testCResponse.includes(expectedC)}`
  );

  // Test Case D: "What is Mary's undergraduate degree?"
  const testDInput = "What is Mary's undergraduate degree?";
  const testDResponse = defaultKnowledgeRetriever.formatCurriculumQueryResponse(testDInput);
  const expectedD = 'Bachelor of Science in Biomedical Engineering from the University of Gondar Institute of Technology.';
  assert(
    testDResponse.includes(expectedD),
    `Test D: "${testDInput}"\n    Expected prefix: "${expectedD}"\n    Matches: ${testDResponse.includes(expectedD)}`
  );

  // --------------------------------------------------------------------------
  // Group 4: Additional Curriculum Queries from Requirements
  // --------------------------------------------------------------------------
  console.log('\nGroup 4: Additional Curriculum & Technical Queries');

  // Medical imaging background
  const imgResp = defaultKnowledgeRetriever.formatCurriculumQueryResponse('Does Marye have a background in medical imaging?');
  assert(
    imgResp.includes('BMED-4243 — Medical Imaging Systems') && imgResp.includes('BO3106'),
    'Medical imaging query returns both B.Sc. (BMED-4243) and M.E. (BO3106) with clear separation'
  );

  // Biomedical instrumentation
  const instResp = defaultKnowledgeRetriever.formatCurriculumQueryResponse('Did Marye study biomedical instrumentation?');
  assert(
    instResp.includes('BMED-4241 — Biomedical Instrumentation-I') && instResp.includes('BMED-5242 — Biomedical Instrumentation-II'),
    'Biomedical instrumentation query details both I & II and their labs'
  );

  // Digital image processing
  const dipResp = defaultKnowledgeRetriever.formatCurriculumQueryResponse('Did Marye study digital image processing?');
  assert(
    dipResp.includes('BMED-5232 — Digital Image Processing'),
    'Digital image processing query retrieves BMED-5232 (Year V, Sem I)'
  );

  // Medical device regulation
  const regResp = defaultKnowledgeRetriever.formatCurriculumQueryResponse('Did Marye study medical device regulation?');
  assert(
    regResp.includes('BMED-5272 — Medical Device Regulation and Standards'),
    'Medical device regulation query retrieves BMED-5272 (Year V, Sem II)'
  );

  // Connections to Master's research
  const connResp = defaultKnowledgeRetriever.formatCurriculumQueryResponse(
    "What courses connect Mary's BSc background to her current master's research?"
  );
  assert(
    connResp.includes('BMED-3140 — Signals and Systems') &&
      connResp.includes('BMED-3221 — Biomechanics') &&
      connResp.includes('does not constitute independent clinical certification'),
    'Research connections identified accurately without claiming clinical competency or regulatory authorization'
  );

  // --------------------------------------------------------------------------
  // Group 5: Course Code & Title Retrieval
  // --------------------------------------------------------------------------
  console.log('\nGroup 5: Course Code & Title Lookup');
  const anatLookup = defaultKnowledgeRetriever.formatCurriculumQueryResponse('What is course Anat-2201?');
  assert(
    anatLookup.includes('Anat-2201 — Human Anatomy') && anatLookup.includes('Year II, Semester I'),
    'Course Anat-2201 accurately resolved to Human Anatomy (Year II, Sem I)'
  );

  const opticsLookup = searchGondarBscCurriculum('biomedical optics');
  assert(
    opticsLookup.length > 0 && opticsLookup[0].code === 'BMED-3212',
    'Keyword "biomedical optics" finds BMED-3212'
  );

  // --------------------------------------------------------------------------
  // Group 6: Strict BSc vs Master's Curriculum Separation
  // --------------------------------------------------------------------------
  console.log('\nGroup 6: Strict Distinction Between BSc and Master Curricula');
  const compareResp = defaultKnowledgeRetriever.formatCurriculumQueryResponse('Compare Marye BSc and Masters degrees');
  assert(
    compareResp.includes('Undergraduate: Bachelor of Science (B.Sc.) in Biomedical Engineering (2016–2021)') &&
      compareResp.includes('University of Gondar, Institute of Technology') &&
      compareResp.includes('Graduate: Master of Engineering (M.E.) in Biomedical Engineering (July 2025–Present)') &&
      compareResp.includes('Anna University, Chennai'),
    'BSc and M.E. programs are presented as two distinct, unmerged curricula with proper institutional attribution'
  );

  // --------------------------------------------------------------------------
  // Group 7: Anti-Hallucination & Unknown Course Rejection
  // --------------------------------------------------------------------------
  console.log('\nGroup 7: Anti-Hallucination & Unknown Course Handling');
  const unknownResp = defaultKnowledgeRetriever.formatCurriculumQueryResponse('Did Marye study Advanced Rocket Propulsion Dynamics?');
  assert(
    unknownResp.includes('is not listed in Marye\'s verified University of Gondar BSc Biomedical Engineering curriculum'),
    'Unknown/hallucinated course correctly rejected'
  );

  // --------------------------------------------------------------------------
  // Group 8: Intent Classification Integration
  // --------------------------------------------------------------------------
  console.log('\nGroup 8: Intent Classification via IntentEngine');
  const intent1 = IntentEngine.analyzeMessage('Did Marye take biomechanics at Gondar?');
  assert(
    intent1.detectedIntent === INTENTS.ACADEMIC_BACKGROUND,
    'Query about coursework routed to INTENTS.ACADEMIC_BACKGROUND'
  );

  const intent2 = IntentEngine.analyzeMessage('What was Marye undergraduate engineering background?');
  assert(
    intent2.detectedIntent === INTENTS.ACADEMIC_BACKGROUND,
    'Query about undergraduate background routed to INTENTS.ACADEMIC_BACKGROUND'
  );

  // --------------------------------------------------------------------------
  // Summary
  // --------------------------------------------------------------------------
  console.log('\n===============================================================');
  console.log(`TOTAL CURRICULUM TESTS: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runBscCurriculumTests().catch((err) => {
  console.error('Fatal error running curriculum tests:', err);
  process.exit(1);
});
