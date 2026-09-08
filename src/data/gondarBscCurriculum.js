/**
 * Official University of Gondar — Institute of Technology
 * Bachelor of Science (B.Sc.) in Biomedical Engineering Curriculum
 *
 * Authoritative Official Source:
 * https://iot.uog.edu.et/biomedical-engineering-bsc-program/
 *
 * Program Duration: 5 Years
 * Graduation Requirements:
 * - 177 CrHr / 318 ECTS overall
 * - 55 CrHr / 91 ECTS General Education and Engineering
 * - 53 CrHr / 88 ECTS Supportive
 * - 65 CrHr / 134 ECTS Core/Major
 * - 3 CrHr / 5 ECTS Electives
 * - Industry Attachment / Internship (BMED-4254)
 * - Independent Research Work / B.Sc. Thesis (BMED-5281)
 */

export const GONDAR_BSC_CURRICULUM_METADATA = {
  institution: 'University of Gondar, Institute of Technology',
  program: 'Bachelor of Science in Biomedical Engineering',
  degree: 'Bachelor of Science (B.Sc.)',
  field: 'Biomedical Engineering',
  duration: '5 Years',
  graduationRequirements: {
    totalCreditHours: 177,
    totalECTS: 318,
    categories: {
      generalEducationAndEngineering: { creditHours: 55, ects: 91, label: 'General Education and Engineering' },
      supportive: { creditHours: 53, ects: 88, label: 'Supportive Courses' },
      coreMajor: { creditHours: 65, ects: 134, label: 'Core / Major Biomedical Engineering Courses' },
      electives: { creditHours: 3, ects: 5, label: 'Elective Courses' },
    },
    practicalRequirements: [
      'Industry Attachment / Internship (BMED-4254)',
      'Independent Research Work / B.Sc. Thesis (BMED-5281)',
    ],
  },
  source_type: 'official_university_curriculum',
  source_url: 'https://iot.uog.edu.et/biomedical-engineering-bsc-program/',
  verifiedDate: 'September 2026',
  retrievalCategories: [
    'bsc_curriculum',
    'biomedical_engineering_education',
    'university_of_gondar',
    'undergraduate_courses',
    'biomedical_engineering_foundation',
    'academic_background',
  ],
};

export const GONDAR_BSC_COURSES = [
  // YEAR I — SEMESTER I
  {
    code: 'FLEn 1011',
    title: 'Communicative English Language Skill I',
    year: 'Year I',
    yearNumber: 1,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'General Education and Engineering',
  },
  {
    code: 'Math 1011',
    title: 'Mathematics for Natural Sciences',
    year: 'Year I',
    yearNumber: 1,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'General Education and Engineering',
  },
  {
    code: 'LoCT 1011',
    title: 'Critical Thinking',
    year: 'Year I',
    yearNumber: 1,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'General Education and Engineering',
  },
  {
    code: 'Psch 1011',
    title: 'General Psychology',
    year: 'Year I',
    yearNumber: 1,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'General Education and Engineering',
  },
  {
    code: 'Phys 1011',
    title: 'General Physics',
    year: 'Year I',
    yearNumber: 1,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'General Education and Engineering',
  },
  {
    code: 'SpSc 1011',
    title: 'Physical Fitness',
    year: 'Year I',
    yearNumber: 1,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'General Education and Engineering',
  },
  {
    code: 'GeES 1011',
    title: 'Geography of Ethiopia and the Horn',
    year: 'Year I',
    yearNumber: 1,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'General Education and Engineering',
  },

  // YEAR I — SEMESTER II
  {
    code: 'FLEn 1012',
    title: 'Communicative English Language Skills II',
    year: 'Year I',
    yearNumber: 1,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'General Education and Engineering',
  },
  {
    code: 'Anth 1012',
    title: 'Social Anthropology',
    year: 'Year I',
    yearNumber: 1,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'General Education and Engineering',
  },
  {
    code: 'Math 1041',
    title: 'Applied Mathematics I',
    year: 'Year I',
    yearNumber: 1,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'General Education and Engineering',
  },
  {
    code: 'MGMT 1012',
    title: 'Entrepreneurship',
    year: 'Year I',
    yearNumber: 1,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'General Education and Engineering',
  },
  {
    code: 'EmTe 1012',
    title: 'Introduction to Emerging Technologies',
    year: 'Year I',
    yearNumber: 1,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'General Education and Engineering',
  },
  {
    code: 'MCiE 1012',
    title: 'Moral and Civic Education',
    year: 'Year I',
    yearNumber: 1,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'General Education and Engineering',
  },
  {
    code: 'SECT 1082',
    title: 'Computer Programming',
    year: 'Year I',
    yearNumber: 1,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'General Education and Engineering',
  },

  // YEAR II — SEMESTER I
  {
    code: 'Math-2052',
    title: 'Applied Mathematics II',
    year: 'Year II',
    yearNumber: 2,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Supportive',
  },
  {
    code: 'Anat-2201',
    title: 'Human Anatomy',
    year: 'Year II',
    yearNumber: 2,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Supportive',
  },
  {
    code: 'CEng-2061',
    title: 'Engineering Mechanics I (Statics)',
    year: 'Year II',
    yearNumber: 2,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Supportive',
  },
  {
    code: 'GlTr 1012',
    title: 'Global Trends',
    year: 'Year II',
    yearNumber: 2,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'General Education and Engineering',
  },
  {
    code: 'MEng-2070',
    title: 'Engineering Drawing',
    year: 'Year II',
    yearNumber: 2,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Supportive',
  },
  {
    code: 'Phy-2203',
    title: 'Human Physiology',
    year: 'Year II',
    yearNumber: 2,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Supportive',
  },
  {
    code: 'Chem-2202',
    title: 'Fundamentals of Biochemistry',
    year: 'Year II',
    yearNumber: 2,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Supportive',
  },

  // YEAR II — SEMESTER II
  {
    code: 'ECEG-2090',
    title: 'Fundamentals of Electrical Engineering',
    year: 'Year II',
    yearNumber: 2,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'Supportive',
  },
  {
    code: 'SNIE-1012',
    title: 'Inclusiveness',
    year: 'Year II',
    yearNumber: 2,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'General Education and Engineering',
  },
  {
    code: 'Math-2053',
    title: 'Applied Mathematics III',
    year: 'Year II',
    yearNumber: 2,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'Supportive',
  },
  {
    code: 'MEng-2062',
    title: 'Engineering Mechanics II (Dynamics)',
    year: 'Year II',
    yearNumber: 2,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'Supportive',
  },
  {
    code: 'BMED-2211',
    title: 'Biophysics',
    year: 'Year II',
    yearNumber: 2,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'Core/Major',
  },
  {
    code: 'BMED-2082',
    title: 'Computational Methods',
    year: 'Year II',
    yearNumber: 2,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'Core/Major',
  },
  {
    code: 'BMED-2251',
    title: 'General Workshop',
    year: 'Year II',
    yearNumber: 2,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'Core/Major',
  },

  // YEAR III — SEMESTER I
  {
    code: 'BMED-3140',
    title: 'Signals and Systems',
    year: 'Year III',
    yearNumber: 3,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Core/Major',
  },
  {
    code: 'ECEG-3101',
    title: 'Applied Electronics I',
    year: 'Year III',
    yearNumber: 3,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Supportive',
  },
  {
    code: 'BMED-3221',
    title: 'Biomechanics',
    year: 'Year III',
    yearNumber: 3,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Core/Major',
  },
  {
    code: 'ECEG-3111',
    title: 'Object Oriented Programming',
    year: 'Year III',
    yearNumber: 3,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Supportive',
  },
  {
    code: 'Stat-3160',
    title: 'Probability and Statistics',
    year: 'Year III',
    yearNumber: 3,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Supportive',
  },
  {
    code: 'MEng-3130',
    title: 'Engineering Thermodynamics',
    year: 'Year III',
    yearNumber: 3,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Supportive',
  },
  {
    code: 'ECEG-3120',
    title: 'Electromagnetic Devices and Electrical Machines',
    year: 'Year III',
    yearNumber: 3,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Supportive',
  },

  // YEAR III — SEMESTER II
  {
    code: 'ECEG-3102',
    title: 'Applied Electronics II',
    year: 'Year III',
    yearNumber: 3,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'Supportive',
  },
  {
    code: 'BMED-3222',
    title: 'Biofluid Mechanics',
    year: 'Year III',
    yearNumber: 3,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'Core/Major',
  },
  {
    code: 'ECEG-3112',
    title: 'Data Structure and Algorithm',
    year: 'Year III',
    yearNumber: 3,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'Supportive',
  },
  {
    code: 'BMED-3231',
    title: 'Biomedical Signal Processing',
    year: 'Year III',
    yearNumber: 3,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'Core/Major',
  },
  {
    code: 'BMED-3212',
    title: 'Biomedical Optics',
    year: 'Year III',
    yearNumber: 3,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'Core/Major',
  },
  {
    code: 'BMED-3271',
    title: 'Healthcare Technology Management',
    year: 'Year III',
    yearNumber: 3,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'Core/Major',
  },
  {
    code: 'BMED-3213',
    title: 'Biomaterials and Implants',
    year: 'Year III',
    yearNumber: 3,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'Core/Major',
  },

  // YEAR IV — SEMESTER I
  {
    code: 'ECEG-4170',
    title: 'Introduction to Control Systems',
    year: 'Year IV',
    yearNumber: 4,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Supportive',
  },
  {
    code: 'ECEG-4151',
    title: 'Digital Logic Design',
    year: 'Year IV',
    yearNumber: 4,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Supportive',
  },
  {
    code: 'BMED-4243',
    title: 'Medical Imaging Systems',
    year: 'Year IV',
    yearNumber: 4,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Core/Major',
  },
  {
    code: 'BMED-4261',
    title: 'Hospital Engineering',
    year: 'Year IV',
    yearNumber: 4,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Core/Major',
  },
  {
    code: 'BMED-4241',
    title: 'Biomedical Instrumentation-I',
    year: 'Year IV',
    yearNumber: 4,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Core/Major',
  },
  {
    code: 'BMED-4252',
    title: 'Biomedical Instrumentation Lab I',
    year: 'Year IV',
    yearNumber: 4,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Core/Major',
  },
  {
    code: 'BMED-4180',
    title: 'Research Methods and Presentation',
    year: 'Year IV',
    yearNumber: 4,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Core/Major',
  },

  // YEAR IV — SEMESTER II
  {
    code: 'BMED-4254',
    title: 'Internship',
    year: 'Year IV',
    yearNumber: 4,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'Practical / Internship',
    isInternship: true,
  },

  // YEAR V — SEMESTER I
  {
    code: 'BMED-5242',
    title: 'Biomedical Instrumentation-II',
    year: 'Year V',
    yearNumber: 5,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Core/Major',
  },
  {
    code: 'BMED-5152',
    title: 'Embedded Systems and Interfacing',
    year: 'Year V',
    yearNumber: 5,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Core/Major',
  },
  {
    code: 'BMED-5232',
    title: 'Digital Image Processing',
    year: 'Year V',
    yearNumber: 5,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Core/Major',
  },
  {
    code: 'BMED-5253',
    title: 'Biomedical Instrumentation Lab II',
    year: 'Year V',
    yearNumber: 5,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Core/Major',
  },
  {
    code: 'BMED-5262',
    title: 'Biomedical Design',
    year: 'Year V',
    yearNumber: 5,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Core/Major',
  },
  {
    code: 'BMED-5113',
    title: 'Database Systems and Health Informatics',
    year: 'Year V',
    yearNumber: 5,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'Core/Major',
  },
  {
    code: 'Econ 1011',
    title: 'Economics',
    year: 'Year V',
    yearNumber: 5,
    semester: 'Semester I',
    semesterNumber: 1,
    category: 'General Education and Engineering',
  },

  // YEAR V — SEMESTER II
  {
    code: 'BMED-5272',
    title: 'Medical Device Regulation and Standards',
    year: 'Year V',
    yearNumber: 5,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'Core/Major',
  },
  {
    code: 'BMED-5192',
    title: 'Engineering and Medical Ethics',
    year: 'Year V',
    yearNumber: 5,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'Core/Major',
  },
  {
    code: 'BMED-529_',
    title: 'Elective I',
    year: 'Year V',
    yearNumber: 5,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'Electives',
  },
  {
    code: 'BMED-5223',
    title: 'Rehabilitation Engineering',
    year: 'Year V',
    yearNumber: 5,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'Core/Major',
  },
  {
    code: 'BMED-5281',
    title: 'B.Sc. Thesis',
    year: 'Year V',
    yearNumber: 5,
    semester: 'Semester II',
    semesterNumber: 2,
    category: 'Research / Thesis',
    isThesis: true,
  },
];

/**
 * Searches the University of Gondar BSc curriculum by query string (code or title keywords)
 */
export function searchGondarBscCurriculum(query = '') {
  if (!query || typeof query !== 'string') return [];
  const q = query.toLowerCase().trim();
  const tokens = q.split(/\s+/).filter(Boolean);

  return GONDAR_BSC_COURSES.filter((course) => {
    const codeNorm = course.code.toLowerCase().replace(/[^a-z0-9]/g, '');
    const titleNorm = course.title.toLowerCase();
    const qNorm = q.replace(/[^a-z0-9]/g, '');

    // Exact code match or normalized code match
    if (codeNorm.includes(qNorm) || course.code.toLowerCase().includes(q)) {
      return true;
    }

    // Title match
    if (titleNorm.includes(q)) return true;

    // Multi-token match across title and code
    const fullText = `${course.code} ${course.title} ${course.year} ${course.semester} ${course.category}`.toLowerCase();
    return tokens.every((tok) => fullText.includes(tok));
  });
}

/**
 * Finds a specific course by exact or normalized course code
 */
export function findBscCourseByCode(code = '') {
  if (!code) return null;
  const target = code.toLowerCase().replace(/[^a-z0-9]/g, '');
  return (
    GONDAR_BSC_COURSES.find(
      (c) => c.code.toLowerCase() === code.toLowerCase() || c.code.toLowerCase().replace(/[^a-z0-9]/g, '') === target
    ) || null
  );
}

/**
 * Retrieves curriculum courses grouped by academic year and semester
 */
export function getBscCurriculumByYear() {
  const years = ['Year I', 'Year II', 'Year III', 'Year IV', 'Year V'];
  return years.map((y) => ({
    year: y,
    semester1: GONDAR_BSC_COURSES.filter((c) => c.year === y && c.semester === 'Semester I'),
    semester2: GONDAR_BSC_COURSES.filter((c) => c.year === y && c.semester === 'Semester II'),
  }));
}
