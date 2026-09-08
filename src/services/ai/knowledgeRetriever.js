/**
 * First-Party Website Knowledge Retrieval Abstraction
 *
 * Implements Requirement 5:
 * Structured, programmatic access to Marye Agegn's Single Source of Truth (SSOT)
 * defined in siteData.js and verified documents.
 */

import { siteData } from '../../data/siteData.js';
import {
  GONDAR_BSC_CURRICULUM_METADATA,
  GONDAR_BSC_COURSES,
  searchGondarBscCurriculum,
  findBscCourseByCode,
} from '../../data/gondarBscCurriculum.js';

export class KnowledgeRetriever {
  constructor(data = siteData) {
    this.data = data;
  }

  /**
   * Retrieves high-level personal, bio, and verified identity data
   */
  getProfile() {
    return {
      name: this.data.personal.name,
      headline: this.data.personal.headline,
      currentRole: this.data.personal.currentRole,
      currentInstitution: this.data.personal.currentInstitution,
      currentFocus: this.data.personal.currentFocus,
      summary: this.data.personal.summary,
      status: this.data.personal.status,
    };
  }

  /**
   * Retrieves verified graduate research data at Anna University
   */
  getResearch() {
    const r = this.data.research || {};
    return {
      title: r.title,
      currentResearch: r.currentResearch,
      academicInterests: r.academicInterests?.items || [],
      futureDirections: r.futureDirections || [],
      scopeNote: r.scopeNote,
    };
  }

  /**
   * Retrieves the 11 structured biomedical engineering services
   */
  getServices() {
    return (this.data.services || []).map((s) => ({
      id: s.id,
      title: s.title,
      category: s.category,
      brief: s.brief,
      scope: s.scope || [],
    }));
  }

  /**
   * Searches for specific services matching a set of keywords or domain concepts
   */
  findServicesByKeywords(keywords = []) {
    const services = this.getServices();
    if (!keywords || keywords.length === 0) return services;

    const normalized = keywords.map((k) => k.toLowerCase());
    return services.filter((s) => {
      const text = `${s.title} ${s.category} ${s.brief} ${(s.scope || []).join(' ')}`.toLowerCase();
      return normalized.some((k) => text.includes(k));
    });
  }

  /**
   * Retrieves verified educational milestones including Anna University M.E. core curriculum
   */
  getEducation() {
    return (this.data.education || []).map((edu) => ({
      id: edu.id,
      degree: edu.degree,
      field: edu.field,
      institution: edu.institution,
      curriculum: edu.curriculum || null,
      period: edu.period,
      status: edu.status,
      grade: edu.grade || null,
      labAffiliation: edu.labAffiliation || null,
      labWorkDetail: edu.labWorkDetail || null,
      thesis: edu.thesis || null,
      coreCourses: edu.coreCourses || [],
      keyFocus: edu.keyFocus || [],
    }));
  }

  /**
   * Retrieves official University of Gondar BSc Biomedical Engineering curriculum
   */
  getBscCurriculum() {
    return {
      metadata: GONDAR_BSC_CURRICULUM_METADATA,
      courses: GONDAR_BSC_COURSES,
      sourceUrl: GONDAR_BSC_CURRICULUM_METADATA.source_url,
      graduationRequirements: GONDAR_BSC_CURRICULUM_METADATA.graduationRequirements,
    };
  }

  /**
   * Searches the official University of Gondar BSc curriculum by query string
   */
  searchBscCourses(query) {
    return searchGondarBscCurriculum(query);
  }

  /**
   * Looks up a specific BSc course by code (e.g. BMED-3231, BMED-3221)
   */
  findBscCourseByCode(code) {
    return findBscCourseByCode(code);
  }

  /**
   * Cross-references academic background across both undergraduate (Gondar BSc)
   * and graduate (Anna University M.E.) programs with strict degree distinction.
   */
  getAcademicCurriculaSummary() {
    return {
      undergraduate: {
        degree: 'Bachelor of Science (B.Sc.) in Biomedical Engineering',
        institution: 'University of Gondar, Institute of Technology',
        duration: '5 Years',
        graduationRequirements: '177 CrHr / 318 ECTS overall',
        sourceUrl: 'https://iot.uog.edu.et/biomedical-engineering-bsc-program/',
        keyCourses: [
          'BMED-3140 — Signals and Systems (Year III, Sem I)',
          'BMED-3221 — Biomechanics (Year III, Sem I)',
          'BMED-3231 — Biomedical Signal Processing (Year III, Sem II)',
          'BMED-4243 — Medical Imaging Systems (Year IV, Sem I)',
          'BMED-4241 — Biomedical Instrumentation-I (Year IV, Sem I)',
          'BMED-5152 — Embedded Systems and Interfacing (Year V, Sem I)',
          'BMED-5232 — Digital Image Processing (Year V, Sem I)',
          'BMED-5272 — Medical Device Regulation and Standards (Year V, Sem II)',
          'BMED-4254 — Internship (Year IV, Sem II)',
          'BMED-5281 — B.Sc. Thesis (Year V, Sem II)',
        ],
      },
      graduate: {
        degree: 'Master of Engineering (M.E.) in Biomedical Engineering',
        institution: 'Anna University, Chennai, India',
        duration: '2 Years',
        regulations: 'Anna University Regulations 2023 (CBCS)',
        status: 'In Progress (Commenced July 2025)',
        coreCourses: [
          'BO3107 — Biosignal Processing (5 Credits)',
          'BO3203 — Medical Image Processing (5 Credits)',
          'BO3106 — Medical Imaging Systems and Radio Therapy (3 Credits)',
          'BO3251 — Rehabilitation Engineering and Assistive Technology (3 Credits)',
          'BO3204 — Medical Embedded Systems (5 Credits)',
          'BO3102 — Diagnostic and Therapeutic Equipment (3 Credits)',
          'BO3201 — Hospital Administration and Equipment Management (3 Credits)',
          'BO3112 — Advanced Biomedical Instrumentation Laboratory (2 Credits)',
          'RM3151 — Research Methodology and IPR (3 Credits)',
        ],
      },
    };
  }

  /**
   * Retrieves verified clinical engineering and healthcare technology management experience
   */
  getExperience() {
    return (this.data.experience || []).map((exp) => ({
      id: exp.id,
      position: exp.position,
      organization: exp.organization,
      location: exp.location,
      period: exp.period,
      tier: exp.tier,
      summary: exp.summary,
      themes: exp.themes || [],
      responsibilities: exp.responsibilities || [],
    }));
  }

  /**
   * Retrieves verified capstone and hardware engineering projects
   */
  getProjects() {
    return (this.data.projects || []).map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      subCategory: p.subCategory,
      status: p.status,
      academicLevel: p.academicLevel,
      date: p.date,
      shortDescription: p.shortDescription,
      problem: p.problem,
      approach: p.approach,
      outcome: p.outcome,
      technologies: p.technologies || [],
      technicalSpecs: p.technicalSpecs || [],
      artifactStatus: p.artifactStatus || {},
    }));
  }

  /**
   * Retrieves verified Biomedical Horizon Network (BHN) initiative details
   */
  getBhnInfo() {
    const bhn = this.data.vision?.bhnInitiative || {};
    return {
      name: bhn.name,
      status: bhn.status,
      badge: bhn.badge,
      summary: bhn.summary,
      areas: bhn.areas || [],
      coreProblem: bhn.coreProblem,
      pillars: bhn.pillars || [],
      disclaimer: bhn.disclaimer,
    };
  }

  /**
   * Searches across all website knowledge sections using multi-keyword semantic relevance
   */
  searchKnowledge(query = '') {
    const q = query.toLowerCase().trim();
    if (!q) return { results: [], matchesFound: false };

    const terms = q.split(/\s+/).filter((t) => t.length > 2);
    const results = [];

    // Search profile & bio
    const profile = this.getProfile();
    const profileText = `${profile.name} ${profile.headline} ${profile.summary}`.toLowerCase();
    if (terms.some((t) => profileText.includes(t))) {
      results.push({ section: 'Profile & Background', data: profile, relevance: 'high' });
    }

    // Search Research
    const research = this.getResearch();
    const researchText = `${research.currentResearch?.title} ${research.currentResearch?.highLevelSummary} ${(research.academicInterests || []).map((i) => i.name).join(' ')}`.toLowerCase();
    if (terms.some((t) => researchText.includes(t))) {
      results.push({ section: 'Graduate Research', data: research.currentResearch, relevance: 'high' });
    }

    // Search Services
    const matchedServices = this.findServicesByKeywords(terms);
    if (matchedServices.length > 0) {
      results.push({ section: 'Biomedical Services', data: matchedServices, relevance: 'high' });
    }

    // Search Projects
    const projects = this.getProjects();
    const matchedProjects = projects.filter((p) => {
      const pText = `${p.title} ${p.shortDescription} ${(p.technologies || []).join(' ')}`.toLowerCase();
      return terms.some((t) => pText.includes(t));
    });
    if (matchedProjects.length > 0) {
      results.push({ section: 'Projects & Capstone', data: matchedProjects, relevance: 'high' });
    }

    // Search Education & Graduate Curriculum (Anna University M.E.)
    const eduList = this.getEducation();
    const matchedMeCourses = [];
    eduList.forEach((e) => {
      (e.coreCourses || []).forEach((c) => {
        const cText = `${c.code} ${c.name} ${c.highlights}`.toLowerCase();
        if (terms.some((t) => cText.includes(t))) {
          matchedMeCourses.push({
            ...c,
            degreeLevel: 'Graduate (M.E.)',
            institution: 'Anna University',
          });
        }
      });
    });
    if (matchedMeCourses.length > 0) {
      results.push({
        section: 'Anna University M.E. Biomedical Engineering Curriculum (Graduate)',
        degree: 'Master of Engineering (M.E.)',
        institution: 'Anna University, Chennai',
        data: matchedMeCourses,
        relevance: 'high',
      });
    }

    // Search Undergraduate Curriculum (University of Gondar B.Sc.)
    const matchedBscCourses = searchGondarBscCurriculum(q);
    if (matchedBscCourses.length > 0) {
      results.push({
        section: 'University of Gondar BSc Biomedical Engineering Curriculum (Undergraduate)',
        degree: 'Bachelor of Science (B.Sc.)',
        institution: 'University of Gondar, Institute of Technology',
        sourceUrl: GONDAR_BSC_CURRICULUM_METADATA.source_url,
        data: matchedBscCourses.map((c) => ({
          ...c,
          degreeLevel: 'Undergraduate (B.Sc.)',
          institution: 'University of Gondar',
        })),
        relevance: 'high',
      });
    }

    // Search BHN
    const bhn = this.getBhnInfo();
    const bhnText = `${bhn.name} ${bhn.summary} ${(bhn.areas || []).join(' ')}`.toLowerCase();
    if (terms.some((t) => bhnText.includes(t))) {
      results.push({ section: 'Biomedical Horizon Network', data: bhn, relevance: 'medium' });
    }

    return {
      results,
      matchesFound: results.length > 0,
      query: q,
    };
  }

  /**
   * Generates authoritative, citation-backed answers to natural-language questions
   * regarding Marye Agegn's undergraduate (University of Gondar B.Sc.) and graduate (Anna University M.E.) curricula.
   */
  formatCurriculumQueryResponse(query = '') {
    const q = (query || '').toLowerCase().trim();
    const officialSourceCitation = `\n\n*Official Source: [University of Gondar Institute of Technology — Biomedical Engineering BSc Program](https://iot.uog.edu.et/biomedical-engineering-bsc-program/)*`;

    // 1. Undergraduate Degree / Institution
    if (
      q.includes('undergraduate degree') ||
      q.includes("what is mary's undergraduate degree") ||
      q.includes("what is marye's undergraduate degree") ||
      q.includes('bachelor degree') ||
      q.includes('undergraduate engineering background') ||
      q.includes('undergraduate background')
    ) {
      return (
        `Bachelor of Science in Biomedical Engineering from the University of Gondar Institute of Technology.` +
        `\n\nThe official 5-year curriculum requires 177 CrHr / 318 ECTS overall (55 CrHr General Education and Engineering, 53 CrHr Supportive, 65 CrHr Core/Major, 3 CrHr Electives, an industry internship, and an independent B.Sc. thesis).` +
        officialSourceCitation
      );
    }

    // 2. Connections between BSc curriculum and current Master's research
    if (
      (q.includes('connect') || q.includes('connection') || q.includes('bridge') || q.includes('relevance')) &&
      (q.includes('bsc') || q.includes('undergraduate') || q.includes('gondar'))
    ) {
      return (
        `Marye's undergraduate curriculum at the University of Gondar provided foundational engineering grounding that directly connects to her current Master's research in gait analysis and mobility assessment at Anna University:\n\n` +
        `• **Signals & Time-Series Foundations:** *BMED-3140 — Signals and Systems* (Year III, Sem I), *BMED-3231 — Biomedical Signal Processing* (Year III, Sem II), and *Stat-3160 — Probability and Statistics* (Year III, Sem I) provide foundational principles for lower-back inertial sensor signal conditioning and time-series feature extraction.\n` +
        `• **Biomechanics & Kinematics:** *BMED-3221 — Biomechanics* (Year III, Sem I) coupled with supportive *CEng-2061 — Engineering Mechanics I (Statics)* and *MEng-2062 — Dynamics* provide theoretical basis for gait phases, joint kinetics, and human mobility modeling.\n` +
        `• **Sensors & Hardware Interfacing:** *BMED-5152 — Embedded Systems and Interfacing* (Year V, Sem I) and *BMED-4241/5242 — Biomedical Instrumentation I & II* provide practical hardware grounding relevant to wearable telemetry.\n` +
        `• **Computational Processing:** *BMED-5232 — Digital Image Processing* (Year V, Sem I) and *BMED-2082 — Computational Methods* (Year II, Sem II) support current machine learning workflows.\n\n` +
        `*Academic Context:* Undergraduate coursework provides theoretical and conceptual foundations; it does not constitute independent clinical certification, regulatory authorization, or commercial device clearance.` +
        officialSourceCitation
      );
    }

    // 3. Biomedical Signal Processing
    if (
      q.includes('biomedical signal processing') ||
      q.includes('signal processing') ||
      q.includes('bmed-3231')
    ) {
      const isBscSpecific = q.includes('bsc') || q.includes('undergraduate') || q.includes('gondar');
      if (isBscSpecific) {
        return (
          `Yes. BMED-3231 — Biomedical Signal Processing, Year III Semester II, according to the University of Gondar BSc Biomedical Engineering curriculum.` +
          `\n\n(It builds upon BMED-3140 — Signals and Systems completed in Year III Semester I).` +
          officialSourceCitation
        );
      }
      return (
        `Yes. Marye studied **BMED-3231 — Biomedical Signal Processing** during her undergraduate degree at the University of Gondar (Year III, Semester II).\n\n` +
        `In addition, at the graduate level, Marye is currently studying advanced **BO3107 — Biosignal Processing** (5 Credits, PCC Theory & Lab) in her Master of Engineering program at Anna University (Regulations 2023).\n\n` +
        `*Note: Academic coursework provides theoretical and laboratory grounding and does not imply independent clinical diagnostic certification.*` +
        officialSourceCitation
      );
    }

    // 4. Biomechanics
    if (q.includes('biomechanics') || q.includes('bmed-3221') || q.includes('biofluid')) {
      return (
        `Yes. BMED-3221 — Biomechanics, Year III Semester I.` +
        `\n\nThe University of Gondar BSc Biomedical Engineering curriculum also includes **BMED-3222 — Biofluid Mechanics** in Year III Semester II, as well as foundational supportive mechanics in **CEng-2061 — Engineering Mechanics I (Statics)** and **MEng-2062 — Engineering Mechanics II (Dynamics)**.` +
        officialSourceCitation
      );
    }

    // 5. Embedded Systems
    if (q.includes('embedded system') || q.includes('bmed-5152')) {
      return (
        `Yes. BMED-5152 — Embedded Systems and Interfacing, Year V Semester I.` +
        `\n\nAt the graduate level, Marye also studies **BO3204 — Medical Embedded Systems** (5 Credits) in her Master's program at Anna University.` +
        officialSourceCitation
      );
    }

    // 6. Medical Imaging / Digital Image Processing
    if (
      q.includes('medical imaging') ||
      q.includes('image processing') ||
      q.includes('bmed-4243') ||
      q.includes('bmed-5232')
    ) {
      return (
        `Yes. Marye has a verified academic foundation in medical imaging and image processing across both undergraduate and graduate curricula:\n\n` +
        `• **Undergraduate (University of Gondar B.Sc.):**\n` +
        `  - **BMED-4243 — Medical Imaging Systems** (Year IV, Semester I)\n` +
        `  - **BMED-5232 — Digital Image Processing** (Year V, Semester I)\n` +
        `  - **BMED-3212 — Biomedical Optics** (Year III, Semester II)\n\n` +
        `• **Graduate (Anna University M.E., Regulations 2023):**\n` +
        `  - **BO3106 — Medical Imaging Systems and Radio Therapy** (3 Credits)\n` +
        `  - **BO3203 — Medical Image Processing** (5 Credits Theory & Practical Lab)` +
        officialSourceCitation
      );
    }

    // 7. Biomedical Instrumentation
    if (q.includes('instrumentation') || q.includes('bmed-4241') || q.includes('bmed-5242')) {
      return (
        `Yes. Marye completed extensive biomedical instrumentation coursework and practical laboratory training at the University of Gondar:\n\n` +
        `• **BMED-4241 — Biomedical Instrumentation-I** (Year IV, Semester I)\n` +
        `• **BMED-4252 — Biomedical Instrumentation Lab I** (Year IV, Semester I)\n` +
        `• **BMED-5242 — Biomedical Instrumentation-II** (Year V, Semester I)\n` +
        `• **BMED-5253 — Biomedical Instrumentation Lab II** (Year V, Semester I)\n\n` +
        `This is complemented at the graduate level at Anna University by **BO3102 — Diagnostic and Therapeutic Equipment** and **BO3112 — Advanced Biomedical Instrumentation Laboratory**.` +
        officialSourceCitation
      );
    }

    // 8. Medical Device Regulation & Standards
    if (q.includes('regulation') || q.includes('standard') || q.includes('bmed-5272') || q.includes('ethics')) {
      return (
        `Yes. Marye studied **BMED-5272 — Medical Device Regulation and Standards** during her undergraduate degree at the University of Gondar (Year V, Semester II), alongside **BMED-5192 — Engineering and Medical Ethics**.\n\n` +
        `Her graduate curriculum at Anna University reinforces this via **BO3022 — Medical Device Regulations and Standards** (IEC 60601, ISO 13485, ISO/IEC 17025). Note: Academic course completion represents theoretical grounding and does not constitute official regulatory authority appointment.` +
        officialSourceCitation
      );
    }

    // 9. Rehabilitation Engineering
    if (q.includes('rehabilitation') || q.includes('bmed-5223')) {
      return (
        `Yes. Marye studied **BMED-5223 — Rehabilitation Engineering** in Year V Semester II of her University of Gondar BSc curriculum, as well as **BO3251 — Rehabilitation Engineering and Assistive Technology** (covering gait analysis, mobility assessment, and bionic devices) at Anna University.` +
        officialSourceCitation
      );
    }

    // 10. Industry Internship & Thesis
    if (q.includes('internship') || q.includes('industry attachment') || q.includes('bmed-4254')) {
      return (
        `Yes. The University of Gondar BSc curriculum includes **BMED-4254 — Internship** in Year IV Semester II for practical industrial attachment in healthcare technology settings.` +
        officialSourceCitation
      );
    }
    if (q.includes('b.sc. thesis') || q.includes('bsc thesis') || q.includes('bmed-5281')) {
      return (
        `Yes. The University of Gondar curriculum concludes with **BMED-5281 — B.Sc. Thesis** in Year V Semester II (independent research capstone, completed with Distinction on an accessible rTMS circuit design).` +
        officialSourceCitation
      );
    }

    // 11. Search for specific course code (e.g. Anat-2201, ECEG-3101, etc.)
    const codeMatch = q.match(/[a-z]{3,4}[-\s]?\d{4}/i);
    if (codeMatch) {
      const course = findBscCourseByCode(codeMatch[0]);
      if (course) {
        return (
          `Yes. **${course.code} — ${course.title}** is an official course in Marye's B.Sc. in Biomedical Engineering curriculum at the University of Gondar.\n\n` +
          `• **Academic Timeline:** ${course.year}, ${course.semester}\n` +
          `• **Category:** ${course.category}` +
          officialSourceCitation
        );
      }
    }

    // 12. Search course by keyword
    const titleMatches = searchGondarBscCurriculum(q);
    if (titleMatches.length > 0) {
      const courseList = titleMatches
        .slice(0, 5)
        .map((c) => `• **${c.code}** — ${c.title} (${c.year}, ${c.semester} [${c.category}])`)
        .join('\n');
      return (
        `The University of Gondar BSc Biomedical Engineering curriculum contains the following matching courses:\n\n${courseList}` +
        (titleMatches.length > 5 ? `\n\n*(and ${titleMatches.length - 5} additional matches)*` : '') +
        officialSourceCitation
      );
    }

    // 13. General overview of BSc or Education
    if (
      q.includes('what did marye study') ||
      q.includes('courses did marye take') ||
      q.includes('curriculum') ||
      q.includes('gondar') ||
      q.includes('bsc')
    ) {
      return (
        `Marye Agegn's academic trajectory encompasses two distinct, unmerged biomedical engineering degree programs:\n\n` +
        `### 1. Undergraduate: Bachelor of Science (B.Sc.) in Biomedical Engineering (2016–2021)\n` +
        `*University of Gondar, Institute of Technology, Ethiopia*\n` +
        `• **Program Structure:** 5 Years, 177 CrHr / 318 ECTS overall (55 CrHr General Education/Engineering, 53 CrHr Supportive, 65 CrHr Core/Major, 3 CrHr Electives).\n` +
        `• **Key Core Coursework:**\n` +
        `  - *Year III:* Signals and Systems (BMED-3140), Biomechanics (BMED-3221), Biomedical Signal Processing (BMED-3231), Biofluid Mechanics (BMED-3222), Healthcare Technology Management (BMED-3271), Biomaterials (BMED-3213)\n` +
        `  - *Year IV:* Medical Imaging Systems (BMED-4243), Hospital Engineering (BMED-4261), Biomedical Instrumentation I & Lab (BMED-4241/4252), Research Methods (BMED-4180), Internship (BMED-4254)\n` +
        `  - *Year V:* Biomedical Instrumentation II & Lab (BMED-5242/5253), Embedded Systems & Interfacing (BMED-5152), Digital Image Processing (BMED-5232), Biomedical Design (BMED-5262), Medical Device Regulation & Standards (BMED-5272), Rehabilitation Engineering (BMED-5223), B.Sc. Thesis (BMED-5281)\n\n` +
        `### 2. Graduate: Master of Engineering (M.E.) in Biomedical Engineering (July 2025–Present)\n` +
        `*Anna University, Chennai, India (Regulations 2023, CBCS)*\n` +
        `• **Core Courses:** Biosignal Processing (BO3107), Medical Image Processing (BO3203), Medical Imaging Systems & Radio Therapy (BO3106), Rehabilitation Engineering & Assistive Technology (BO3251), Medical Embedded Systems (BO3204), Diagnostic & Therapeutic Equipment (BO3102), Hospital Administration & Equipment Management (BO3201), Advanced Biomedical Instrumentation Lab (BO3112), Research Methodology & IPR (RM3151).\n` +
        `• **Graduate Research Focus:** Gait analysis and mobility assessment using lower-back inertial sensing and explainable machine learning.` +
        officialSourceCitation
      );
    }

    // 14. Unknown course / not in curriculum
    return (
      `That subject or course is not listed in Marye's verified University of Gondar BSc Biomedical Engineering curriculum or Anna University M.E. curriculum.` +
      `\n\nPlease check the course name or consult the official University of Gondar curriculum catalog.` +
      officialSourceCitation
    );
  }
}

export const defaultKnowledgeRetriever = new KnowledgeRetriever(siteData);
export default KnowledgeRetriever;
