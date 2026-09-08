const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function createAcademicCV() {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle('Academic Curriculum Vitae — Marye Agegn');
  pdfDoc.setAuthor('Marye Agegn');
  pdfDoc.setSubject('Biomedical Engineering, Healthcare Technology & Applied Research');
  pdfDoc.setKeywords(['Biomedical Engineering', 'Healthcare Technology Management', 'Biosignal Processing', 'Medical Devices', 'Anna University']);
  pdfDoc.setProducer('Marye Agegn Academic Publishing');
  pdfDoc.setCreator('Marye Agegn Official Portfolio Platform');

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Page 1
  let page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  const margin = 48;
  let y = height - margin;

  const primaryColor = rgb(0.01, 0.45, 0.70); // Deep clinical blue
  const textColor = rgb(0.10, 0.14, 0.20);
  const mutedColor = rgb(0.35, 0.40, 0.48);
  const ruleColor = rgb(0.85, 0.88, 0.92);

  // Header
  page.drawText('MARYE AGEGN', { x: margin, y, size: 22, font: helveticaBold, color: primaryColor });
  y -= 16;
  page.drawText('Biomedical Engineer | Scalable Medical Devices & Digital Health | Healthcare Technology Specialist', {
    x: margin,
    y,
    size: 9.5,
    font: helveticaBold,
    color: textColor,
  });
  y -= 14;

  const contactLine = 'Anna University, Chennai, India  |  Email: 2025254026@student.annauniv.edu  |  maryeagegn2022@gmail.com';
  page.drawText(contactLine, { x: margin, y, size: 8.5, font: helvetica, color: mutedColor });
  y -= 12;
  const linkLine = 'ORCID: 0009-0000-3831-7618  |  GitHub: github.com/MARYE-AGEGN  |  LinkedIn: linkedin.com/in/marye-agegn-88267a212';
  page.drawText(linkLine, { x: margin, y, size: 8.5, font: helvetica, color: mutedColor });
  y -= 14;

  // Divider
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1, color: primaryColor });
  y -= 20;

  function drawSectionHeading(title) {
    if (y < 90) {
      page = pdfDoc.addPage([595.28, 841.89]);
      y = height - margin;
    }
    page.drawText(title.toUpperCase(), { x: margin, y, size: 11, font: helveticaBold, color: primaryColor });
    y -= 5;
    page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.75, color: ruleColor });
    y -= 14;
  }

  // 1. Executive Profile
  drawSectionHeading('Professional & Academic Summary');
  const summaryText = [
    'Biomedical engineer with over three years of frontline healthcare technology management and clinical engineering experience',
    'across public hospitals and healthcare systems in Ethiopia, advancing into graduate engineering research at Anna University.',
    'Specialized in building scalable medical devices, pre-procurement technical specification formulation, equipment commissioning,',
    'and preventive maintenance. Academic research focus encompasses biosignal processing, gait analysis, rehabilitation engineering,',
    'neuroimaging, and explainable AI in healthcare.'
  ];
  for (const line of summaryText) {
    page.drawText(line, { x: margin, y, size: 8.5, font: helvetica, color: textColor });
    y -= 12;
  }
  y -= 10;

  // 2. Education
  drawSectionHeading('Education');

  page.drawText('Master of Engineering (M.Eng.) in Biomedical Engineering', { x: margin, y, size: 10, font: helveticaBold, color: textColor });
  page.drawText('July 2025 – Present', { x: width - margin - 90, y, size: 9, font: helveticaOblique, color: mutedColor });
  y -= 13;
  page.drawText('Anna University, Chennai, India', { x: margin, y, size: 9, font: helveticaBold, color: primaryColor });
  y -= 12;
  page.drawText('• Graduate research focus: Lower-back inertial sensing, mobility assessment, gait analysis, and biosignal processing.', { x: margin + 10, y, size: 8.5, font: helvetica, color: textColor });
  y -= 11;
  page.drawText('• Coursework: Advanced Biosignal Analysis, Medical Device Standards, Healthcare AI, and Rehabilitation Systems.', { x: margin + 10, y, size: 8.5, font: helvetica, color: textColor });
  y -= 16;

  page.drawText('Bachelor of Science (B.Sc.) in Biomedical Engineering', { x: margin, y, size: 10, font: helveticaBold, color: textColor });
  page.drawText('2016 – 2021', { x: width - margin - 55, y, size: 9, font: helveticaOblique, color: mutedColor });
  y -= 13;
  page.drawText('University of Gondar, Ethiopia — Cumulative GPA: 3.78 / 4.00 (Distinction)', { x: margin, y, size: 9, font: helveticaBold, color: primaryColor });
  y -= 12;
  page.drawText('• Capstone Thesis: Design of a Simple Low-Cost Repetitive Transcranial Magnetic Stimulation (rTMS) System', { x: margin + 10, y, size: 8.5, font: helvetica, color: textColor });
  y -= 11;
  page.drawText('  for Major Depressive Disorder in Low-Resource Settings (Evaluated Grade: A).', { x: margin + 10, y, size: 8.5, font: helvetica, color: textColor });
  y -= 11;
  page.drawText('• Core studies: Medical Instrumentation, Biomechanics, Physiology, Electronics, Biomaterials & Clinical Engineering.', { x: margin + 10, y, size: 8.5, font: helvetica, color: textColor });
  y -= 18;

  // 3. Professional Experience
  drawSectionHeading('Professional Experience');

  page.drawText('Technical Manager', { x: margin, y, size: 10, font: helveticaBold, color: textColor });
  page.drawText('Nov 2024 – July 2025', { x: width - margin - 100, y, size: 9, font: helveticaOblique, color: mutedColor });
  y -= 13;
  page.drawText('Shine Business PLC, Addis Ababa, Ethiopia', { x: margin, y, size: 9, font: helveticaBold, color: primaryColor });
  y -= 12;
  page.drawText('• Directed biomedical engineering technical operations, managing client healthcare technology portfolios and service contracts.', { x: margin + 10, y, size: 8.5, font: helvetica, color: textColor });
  y -= 11;
  page.drawText('• Formulated pre-procurement technical specifications and conducted comprehensive technical and clinical feasibility assessments.', { x: margin + 10, y, size: 8.5, font: helvetica, color: textColor });
  y -= 11;
  page.drawText('• Supervised clinical equipment installation, acceptance testing, calibration quality assurance, and technical staff training.', { x: margin + 10, y, size: 8.5, font: helvetica, color: textColor });
  y -= 16;

  page.drawText('Biomedical Officer', { x: margin, y, size: 10, font: helveticaBold, color: textColor });
  page.drawText('Dec 2023 – Oct 2024', { x: width - margin - 100, y, size: 9, font: helveticaOblique, color: mutedColor });
  y -= 13;
  page.drawText('Central Gondar Zone Health Department, Gondar, Ethiopia', { x: margin, y, size: 9, font: helveticaBold, color: primaryColor });
  y -= 12;
  page.drawText('• Led zonal healthcare technology planning and medical equipment management across primary and secondary health facilities.', { x: margin + 10, y, size: 8.5, font: helvetica, color: textColor });
  y -= 11;
  page.drawText('• Performed comprehensive hospital equipment audits, safety compliance checks, and scheduled preventive maintenance.', { x: margin + 10, y, size: 8.5, font: helvetica, color: textColor });
  y -= 11;
  page.drawText('• Prepared technical advisories for regional health authorities regarding medical technology procurement and decommissioning.', { x: margin + 10, y, size: 8.5, font: helvetica, color: textColor });
  y -= 16;

  page.drawText('Biomedical Engineer', { x: margin, y, size: 10, font: helveticaBold, color: textColor });
  page.drawText('Apr 2022 – Dec 2023', { x: width - margin - 100, y, size: 9, font: helveticaOblique, color: mutedColor });
  y -= 13;
  page.drawText('Amhara Regional Health Bureau (Debre Birhan & Debark Hospitals), Ethiopia', { x: margin, y, size: 9, font: helveticaBold, color: primaryColor });
  y -= 12;
  page.drawText('• Delivered hands-on clinical engineering: corrective maintenance, emergency repairs, and calibration of clinical diagnostic systems.', { x: margin + 10, y, size: 8.5, font: helvetica, color: textColor });
  y -= 11;
  page.drawText('• Executed electrical safety inspections (IEC 60601 protocols), performance validation, and hospital technician training.', { x: margin + 10, y, size: 8.5, font: helvetica, color: textColor });
  y -= 11;
  page.drawText('• Reduced critical device downtime by streamlining technical service logs and spare-parts inventory tracking.', { x: margin + 10, y, size: 8.5, font: helvetica, color: textColor });
  y -= 18;

  // 4. Academic & Research Interests
  drawSectionHeading('Academic & Research Interests');
  const interests = [
    '• Biosignal Processing & Physiological Filtering (ECG, EMG, EEG, Kinematics)',
    '• Ambulatory Gait Analysis & Lower-Back Inertial Sensing (Single-Task & Dual-Task Walking)',
    '• Rehabilitation Engineering & Adaptive Assistive Devices',
    '• Computational Neuroimaging & Non-Invasive Neuromodulation (rTMS)',
    '• Healthcare AI & Explainable Deep Learning for Clinical Decision Support',
    '• Healthcare System Digitalization & Digital Health Telemetry Architectures',
    '• Medical Device Electrical Safety (IEC 60601) & Regulatory Standards Guidance'
  ];
  for (const item of interests) {
    page.drawText(item, { x: margin, y, size: 8.5, font: helvetica, color: textColor });
    y -= 11.5;
  }
  y -= 10;

  // 5. Developing Initiative
  drawSectionHeading('Professional Initiatives & Leadership');
  page.drawText('Biomedical Horizon Network (BHN) — Founder & Lead Coordinator', { x: margin, y, size: 9.5, font: helveticaBold, color: textColor });
  y -= 12;
  page.drawText('A developing professional and academic network focused on biomedical engineering, healthcare technology, and interdisciplinary collaboration.', {
    x: margin,
    y,
    size: 8.5,
    font: helveticaOblique,
    color: mutedColor
  });
  y -= 11;
  page.drawText('Fostering partnerships in medical technology assessment, digital health adoption, and technical capacity building for emerging healthcare systems.', {
    x: margin,
    y,
    size: 8.5,
    font: helvetica,
    color: textColor
  });
  y -= 25;

  // Footer note
  page.drawText('Official Academic Curriculum Vitae | Marye Agegn | Verified Document | Anna University, Chennai', {
    x: margin,
    y: margin - 15,
    size: 7.5,
    font: helvetica,
    color: mutedColor
  });

  const pdfBytes = await pdfDoc.save();
  const destDir = path.join(__dirname, '..', 'public', 'assets', 'documents');
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const destPath = path.join(destDir, 'Marye_Agegn_Academic_CV.pdf');
  fs.writeFileSync(destPath, pdfBytes);
  console.log('Saved Marye_Agegn_Academic_CV.pdf, bytes:', pdfBytes.length);
}

async function createCapstoneSummary() {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle('Undergraduate Capstone Summary — Low-Cost rTMS System');
  pdfDoc.setAuthor('Marye Agegn');
  pdfDoc.setSubject('Repetitive Transcranial Magnetic Stimulation Capstone Thesis');

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  const margin = 48;
  let y = height - margin;

  const primaryColor = rgb(0.01, 0.45, 0.70);
  const textColor = rgb(0.10, 0.14, 0.20);
  const mutedColor = rgb(0.35, 0.40, 0.48);

  page.drawText('CAPSTONE THESIS TECHNICAL SUMMARY', { x: margin, y, size: 10, font: helveticaBold, color: primaryColor });
  y -= 18;
  page.drawText('Design of a Simple Low-Cost Repetitive Transcranial Magnetic', { x: margin, y, size: 16, font: helveticaBold, color: textColor });
  y -= 16;
  page.drawText('Stimulation (rTMS) System for Low-Resource Settings', { x: margin, y, size: 16, font: helveticaBold, color: textColor });
  y -= 16;
  page.drawText('Author: Marye Agegn  |  Department of Biomedical Engineering, University of Gondar, Ethiopia  |  Evaluated Grade: A', {
    x: margin,
    y,
    size: 8.5,
    font: helveticaOblique,
    color: mutedColor
  });
  y -= 14;
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1, color: primaryColor });
  y -= 20;

  const paragraphs = [
    { title: 'Project Overview', text: 'This undergraduate capstone project designed and modeled the power electronics, capacitor-discharge circuit topology, and magnetic stimulation coil geometry for an affordable repetitive Transcranial Magnetic Stimulation (rTMS) device tailored for major depressive disorder in resource-limited clinics.' },
    { title: 'The Problem Statement', text: 'Commercial clinical rTMS machines represent major capital investments ($40,000–$100,000+) requiring specialized power conditioning and liquid chiller infrastructure. This forms an insurmountable barrier for psychiatric facilities across decentralized and developing healthcare environments.' },
    { title: 'Engineering Methodology', text: 'The investigation evaluated high-voltage pulse generation using capacitor discharge topology coupled with solid-state SCR switching. Magnetic coil winding geometries (planar circular vs. figure-of-eight) were analytically modeled to evaluate cortical penetration depth against focal field concentration. Passive thermal dissipation was prioritized to eliminate costly liquid cooling loops.' },
    { title: 'Safety & Isolation Architecture', text: 'Galvanic optocoupler isolation was incorporated between control timing circuitry and high-voltage discharge stages. Passive bleeder safety resistors and manual discharge interlocks ensured user and patient electrical safety according to IEC 60601 medical electrical principles.' },
    { title: 'Academic Evaluation & Outcome', text: 'The design documentation and circuit models were successfully defended before the academic jury of the Department of Biomedical Engineering at the University of Gondar, earning Grade A distinction.' }
  ];

  for (const p of paragraphs) {
    page.drawText(p.title.toUpperCase(), { x: margin, y, size: 10, font: helveticaBold, color: primaryColor });
    y -= 12;
    page.drawText(p.text, { x: margin, y, size: 8.5, font: helvetica, color: textColor, maxWidth: width - margin * 2, lineHeight: 12 });
    y -= 38;
  }

  const destDir = path.join(__dirname, '..', 'public', 'assets', 'documents');
  const destPath = path.join(destDir, 'rTMS_Capstone_Summary_Marye_Agegn.pdf');
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(destPath, pdfBytes);
  console.log('Saved rTMS_Capstone_Summary_Marye_Agegn.pdf, bytes:', pdfBytes.length);
}

async function main() {
  await createAcademicCV();
  await createCapstoneSummary();
}

main().catch(console.error);
