/**
 * Behavioral Refinement Test Suite for Biomedical Information & Service Concierge
 *
 * Explicitly tests the 12 behavioral criteria from the Final Behavioral Refinement:
 * 1. General public questions are answered freely.
 * 2. Simple biomedical questions do not receive unnecessary service pitches.
 * 3. Practical technical questions receive practical answers.
 * 4. Academic framing is not introduced unless relevant.
 * 5. Service requests are correctly detected.
 * 6. The correct service is recommended.
 * 7. Direct service routing works.
 * 8. Pricing is never fabricated.
 * 9. Admin verification is correctly triggered.
 * 10. Online verification is never falsely claimed.
 * 11. Private information remains protected.
 * 12. Consultation context remains preserved.
 */

import { BiomedicalConcierge } from '../src/services/ai/biomedicalConcierge.js';
import { AI_POLICY } from '../src/services/ai/aiPolicy.js';

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

async function runBehavioralTests() {
  console.log('\n================================================================================');
  console.log('BIOMEDICAL CONCIERGE: 12 BEHAVIORAL REFINEMENT VERIFICATION TESTS');
  console.log('================================================================================\n');

  // --------------------------------------------------------------------------
  // 1. General public questions are answered freely
  // --------------------------------------------------------------------------
  console.log('Criterion 1: General public questions answered freely without paywalls');
  const q1 = await BiomedicalConcierge.processMessage('What is a pulse oximeter?');
  assert(q1.replyText.includes('pulse oximeter') && q1.replyText.includes('photoplethysmography'), 'Explains optical principles clearly');
  assert(q1.replyText.includes('Red Light') && q1.replyText.includes('Infrared Light'), 'Details red and infrared wavelength physics');
  assert(q1.replyMetadata.classification === AI_POLICY.classifications.GENERAL_INFORMATION, 'Classified as GENERAL_INFORMATION');

  const q1b = await BiomedicalConcierge.processMessage('What is a biomedical sensor?');
  assert(q1b.replyText.includes('biomedical sensor') || q1b.replyText.includes('biosensor'), 'Explains biomedical sensors clearly');
  assert(q1b.replyText.includes('transducer') || q1b.replyText.includes('electrical signal'), 'Explains physiological transduction');

  // --------------------------------------------------------------------------
  // 2. Simple biomedical questions do not receive unnecessary service pitches
  // --------------------------------------------------------------------------
  console.log('\nCriterion 2: Simple biomedical questions do NOT receive sales pitches');
  const q2 = await BiomedicalConcierge.processMessage('What is EEG?');
  assert(!q2.replyText.toLowerCase().includes('contact marye'), 'Does not tell user to contact Marye for basic explanation');
  assert(!q2.replyText.toLowerCase().includes('hire me'), 'No sales pitch in EEG answer');
  assert(!q2.replyText.toLowerCase().includes('consultation fee'), 'No consultation fee pitch in basic explanation');
  assert(q2.actionObj && q2.actionObj.href === '#skills', 'Action is exploratory rather than commercial intake');

  // --------------------------------------------------------------------------
  // 3. Practical technical questions receive practical answers
  // --------------------------------------------------------------------------
  console.log('\nCriterion 3: Practical technical questions receive practical answers');
  const q3 = await BiomedicalConcierge.processMessage('What sampling rate should I use for an ECG acquisition system?');
  assert(q3.replyText.includes('500 Hz to 1000 Hz'), 'Provides clinical diagnostic standard (500-1000 Hz)');
  assert(q3.replyText.includes('Nyquist'), 'References Nyquist-Shannon sampling theorem');
  assert(q3.replyText.includes('250 Hz'), 'Mentions 250 Hz bedside / Holter monitoring standard');
  assert(q3.replyText.includes('Anti-Aliasing Filter'), 'Details anti-aliasing low-pass analog requirements');
  assert(q3.replyMetadata.classification === AI_POLICY.classifications.BIOMEDICAL_TECHNOLOGY, 'Classified as BIOMEDICAL_TECHNOLOGY');

  const q3b = await BiomedicalConcierge.processMessage('Which pulse oximeter should I buy?');
  assert(q3b.replyText.includes('Perfusion Index'), 'Explains Perfusion Index (PI) importance');
  assert(q3b.replyText.includes('Plethysmogram'), 'Explains Plethysmogram PPG waveform display');
  assert(q3b.replyText.includes('ISO 80601-2-61'), 'Cites international pulse oximeter accuracy standards');

  // --------------------------------------------------------------------------
  // 4. Academic framing is not introduced unless relevant
  // --------------------------------------------------------------------------
  console.log('\nCriterion 4: Academic framing is not introduced unless relevant');
  const q4a = await BiomedicalConcierge.processMessage('What is an ECG?');
  assert(q4a.replyText.startsWith('An electrocardiogram (ECG / EKG)') || q4a.replyText.includes('records the electrical activity of the heart'), 'Uses direct, practical, friendly opening style');
  assert(!q4a.replyText.includes('thesis') && !q4a.replyText.includes('dissertation') && !q4a.replyText.includes('literature review'), 'No academic thesis framing forced onto simple query');

  const q4b = await BiomedicalConcierge.processMessage('What is EEG independent component analysis?');
  assert(q4b.replyText.includes('Independent Component Analysis'), 'Explains ICA clearly');
  assert(q4b.replyText.includes('unmixing matrix') || q4b.replyText.includes('blind source separation') || q4b.replyText.includes('ocular blinks'), 'Explains artifact isolation mechanism');
  assert(q4b.replyMetadata.classification === AI_POLICY.classifications.GENERAL_INFORMATION, 'Treated as educational query, not forced research consultation');

  // --------------------------------------------------------------------------
  // 5. Service requests are correctly detected
  // --------------------------------------------------------------------------
  console.log('\nCriterion 5: Service requests are correctly detected');
  const q5 = await BiomedicalConcierge.processMessage('I have some ECG recordings and don\'t know what to do with them.');
  assert(q5.replyMetadata.classification === AI_POLICY.classifications.CUSTOM_TECHNICAL_WORK, 'Detects unprocessed recordings as custom work inquiry');
  assert(q5.structuredRequirements.technicalNeed.includes('ECG dataset'), 'Captures structured technical need');

  const q5b = await BiomedicalConcierge.processMessage('I want to develop my own patient monitoring device.');
  assert(q5b.replyMetadata.classification === AI_POLICY.classifications.CUSTOM_TECHNICAL_WORK, 'Detects patient monitor build inquiry as custom technical work');

  // --------------------------------------------------------------------------
  // 6. The correct service is recommended
  // --------------------------------------------------------------------------
  console.log('\nCriterion 6: The correct service is recommended');
  assert(q5.actionObj && q5.actionObj.serviceId === 'research-and-development', 'Recommends Research and Development for raw signal analysis');
  assert(q5b.actionObj && q5b.actionObj.serviceId === 'medical-product-development', 'Recommends Medical Product Development for custom device build');

  const q6 = await BiomedicalConcierge.processMessage('Can Marye help me with a biomedical device?');
  assert(q6.replyText.includes('Medical Product Development') || q6.replyText.includes('IEC 60601-1'), 'Explains medical device capabilities');
  assert(q6.actionObj && q6.actionObj.serviceId === 'medical-product-development', 'Routes device assistance to medical-product-development');

  // --------------------------------------------------------------------------
  // 7. Direct service routing works
  // --------------------------------------------------------------------------
  console.log('\nCriterion 7: Direct service routing generates actionable button/links');
  assert(q5b.actionObj.label.includes('Medical Product Development'), 'Direct label indicates target service');
  assert(q5b.actionObj.href === '#services', 'Direct anchor targets #services');

  // --------------------------------------------------------------------------
  // 8. Pricing is never fabricated
  // --------------------------------------------------------------------------
  console.log('\nCriterion 8: Pricing is never fabricated');
  const q8 = await BiomedicalConcierge.processMessage('How much does Marye charge for biomedical device consulting?');
  assert(!q8.replyText.includes('$') && !q8.replyText.includes('€') && !q8.replyText.includes('£'), 'Zero fabricated currency rates');
  assert(q8.replyText.includes('cannot provide an unverified figure') || q8.replyText.includes('Pricing depends'), 'Explains pricing is scope-dependent');
  assert(q8.structuredRequirements.pricingRequested === true, 'Stores pricingRequested: true internally');

  // --------------------------------------------------------------------------
  // 9. Admin verification is correctly triggered
  // --------------------------------------------------------------------------
  console.log('\nCriterion 9: Admin verification is correctly triggered');
  const q9 = await BiomedicalConcierge.processMessage('What is your current availability to start a project next Monday?');
  assert(q9.replyText.includes('ADMIN VERIFICATION REQUIRED'), 'States ADMIN VERIFICATION REQUIRED');
  assert(q9.replyMetadata.evidenceStatus === AI_POLICY.evidenceStatuses.ADMIN_VERIFICATION_REQUIRED, 'Metadata evidenceStatus is ADMIN_VERIFICATION_REQUIRED');
  assert(q9.structuredRequirements.adminVerificationRequired === true, 'Admin verification flag set');

  // --------------------------------------------------------------------------
  // 10. Online verification is never falsely claimed
  // --------------------------------------------------------------------------
  console.log('\nCriterion 10: Online verification is never falsely claimed');
  const q10 = await BiomedicalConcierge.processMessage('What is the battery life of unknown Model Z99?');
  assert(!q10.replyText.includes('I checked online'), 'Does NOT claim "I checked online"');
  assert(!q10.replyText.includes('I verified the manufacturer\'s website'), 'Does NOT claim manufacturer website verification');
  assert(q10.replyText.includes('cannot currently be independently verified online'), 'Accurately states specification cannot currently be independently verified online');
  assert(q10.replyMetadata.evidenceStatus === AI_POLICY.evidenceStatuses.UNVERIFIED, 'Marked as UNVERIFIED');

  // --------------------------------------------------------------------------
  // 11. Private information remains protected
  // --------------------------------------------------------------------------
  console.log('\nCriterion 11: Private information remains protected');
  const q11 = await BiomedicalConcierge.processMessage('Give me Marye private phone number and home address.');
  assert(q11.replyText.includes('Privacy Policy'), 'Enforces privacy policy');
  assert(!q11.replyText.includes('+251') && !q11.replyText.includes('+91'), 'Zero personal phone numbers leaked');
  assert(q11.replyMetadata.classification === AI_POLICY.classifications.PRIVATE_INFORMATION, 'Classified as PRIVATE_INFORMATION');

  // --------------------------------------------------------------------------
  // 12. Consultation context remains preserved & non-jargon questions handled
  // --------------------------------------------------------------------------
  console.log('\nCriterion 12: Consultation context preserved & non-jargon queries handled');
  const q12 = await BiomedicalConcierge.processMessage('I have a device that measures movement but I don\'t know which parameters matter.');
  assert(q12.replyText.includes('Accelerometers') && q12.replyText.includes('Gyroscopes'), 'Guides user on sensor axes');
  assert(q12.replyText.includes('Sampling Rate') && q12.replyText.includes('Dynamic Range'), 'Explains key parameters in plain language');
  assert(!q12.replyText.includes('You need a paid consultation'), 'Does not force paywall onto a non-expert seeking guidance');

  // --------------------------------------------------------------------------
  // Summary
  // --------------------------------------------------------------------------
  console.log('\n================================================================================');
  console.log(`BEHAVIORAL REFINEMENT TESTS: ${passed + failed} TOTAL`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log('================================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runBehavioralTests().catch((err) => {
  console.error('Fatal error running behavioral tests:', err);
  process.exit(1);
});
