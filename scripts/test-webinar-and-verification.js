/**
 * Comprehensive Verification & Webinar Architecture Test Suite
 *
 * Validates:
 * 1. AI Technical Verification & Genuine Evidence Lifecycle
 *    - Parameter-level verification
 *    - Distinguishes Local Baseline vs Scientific Standard vs Unavailable vs Conflicting
 *    - Zero fabricated "Verified online" claims
 *    - Conflicting sources handling
 *    - Fabricated source prevention
 * 2. Webinar & Video System
 *    - Full lifecycle: DRAFT, UPCOMING, LIVE, RECORDED, ARCHIVED
 *    - Public vs Private isolation
 *    - Unpublished exclusion
 *    - Video library association & embedding metadata
 * 3. AI Integration
 *    - Webinar discovery
 *    - Video discovery
 *    - Escalation from educational/webinar query to custom technical service
 * 4. Security & Isolation
 *    - Anonymous write prohibition
 *    - Private content protection
 *    - Frontend bundle secret scan
 */

import assert from 'assert';
import { BiomedicalConcierge } from '../src/services/ai/biomedicalConcierge.js';
import { AI_POLICY } from '../src/services/ai/aiPolicy.js';
import { IntentEngine, INTENTS } from '../src/services/ai/intentEngine.js';
import { TechnicalSourceRetriever } from '../src/services/ai/technicalSourceRetriever.js';
import {
  WebinarRegistry,
  WEBINAR_LIFECYCLE,
  CONTENT_VISIBILITY,
} from '../src/data/webinarRegistry.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runVerificationSuite() {
  console.log('===============================================================');
  console.log('STARTING WEBINAR, VIDEO & TECHNICAL VERIFICATION AUDIT');
  console.log('===============================================================');

  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ FAIL: ${name}`);
      console.error(`    ${err.message}`);
    }
  }

  async function asyncTest(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ FAIL: ${name}`);
      console.error(`    ${err.message}`);
    }
  }

  // =========================================================================
  // GROUP 1: AI TECHNICAL VERIFICATION & EVIDENCE LIFECYCLE
  // =========================================================================
  console.log('\n--- Group 1: AI Technical Verification & Evidence Lifecycle ---');

  await asyncTest('General biomedical question answered freely (EEG)', async () => {
    const res = await BiomedicalConcierge.processMessage('What is EEG?');
    assert(res.replyText.includes('Electroencephalography') || res.replyText.includes('electrical activity'), 'Explains EEG');
    assert(res.replyMetadata.classification === AI_POLICY.classifications.GENERAL_INFORMATION, 'Classified as GENERAL_INFORMATION');
    assert(!res.replyText.includes('$') && !res.replyText.includes('consultation fee'), 'Free educational answer');
  });

  test('Parameter-level retrieval success (GE B450 Invasive Blood Pressure)', () => {
    const evidence = TechnicalSourceRetriever.retrieveTechnicalEvidence({
      deviceQuery: 'GE B450',
      parameterQuery: 'invasive blood pressure',
    });
    assert(evidence.found === true, 'Device and parameter found');
    assert(evidence.manufacturer === 'GE Healthcare', 'Manufacturer confirmed');
    assert(evidence.parameter.includes('Invasive Blood Pressure'), 'Parameter identified');
    assert(evidence.value.includes('Dual-channel') || evidence.value.includes('IBP'), 'Extracted verified specification');
    assert(evidence.evidenceStatus === AI_POLICY.evidenceStatuses.VERIFIED_PRIMARY, 'Evidence status verified primary');
    assert(evidence.sourceTier === 'TIER_1', 'Tier 1 primary manufacturer manual');
    assert(evidence.isLiveRetrieval === false, 'Explicitly marked local catalog verified, not fake online');
  });

  test('Parameter-level retrieval success (MPU-6050 Accelerometer / Gyroscope)', () => {
    const evidence = TechnicalSourceRetriever.retrieveTechnicalEvidence({
      deviceQuery: 'MPU-6050',
      parameterQuery: 'dynamic range',
    });
    assert(evidence.found === true, 'MPU-6050 found');
    assert(evidence.value.includes('±2g') || evidence.value.includes('250'), 'Verified dynamic range values');
    assert(evidence.source.includes('InvenSense') || evidence.source.includes('TDK'), 'Source authority documented');
  });

  test('Retrieval unavailable: truthful UNVERIFIED status, zero fake "Verified online"', () => {
    const evidence = TechnicalSourceRetriever.retrieveTechnicalEvidence({
      deviceQuery: 'NonExistent Model Q9000',
      parameterQuery: 'sampling frequency',
      allowLiveSearch: false,
    });
    assert(evidence.found === false, 'Not found in catalog');
    assert(evidence.evidenceStatus === AI_POLICY.evidenceStatuses.UNVERIFIED, 'Marked as UNVERIFIED');
    assert(!evidence.message.includes('Verified online'), 'Never claims "Verified online"');
    assert(evidence.message.includes('cannot currently be independently verified online'), 'Accurately explains live retrieval was not run');
  });

  test('Conflicting sources: returns CONFLICTING SOURCES instead of picking one silently', () => {
    const evidence = TechnicalSourceRetriever.retrieveTechnicalEvidence({
      deviceQuery: 'conflicting-device-sample',
      parameterQuery: 'battery life',
    });
    assert(evidence.found === true, 'Device identified');
    assert(evidence.hasConflict === true, 'Conflict flag detected');
    assert(evidence.evidenceStatus === AI_POLICY.evidenceStatuses.CONFLICTING, 'Evidence status is CONFLICTING SOURCES');
    assert((evidence.conflictDetails.includes('Operator Manual') || evidence.conflictDetails.includes('Operating Manual')) && evidence.conflictDetails.includes('Service Manual'), 'Details both conflicting sources');
  });

  test('Fabricated-source prevention: unknown device returns NOT_FOUND / truth refusal in getDeviceSpecification', () => {
    const spec = TechnicalSourceRetriever.getDeviceSpecification('Unknown X-Ray 2030');
    assert(spec.found === false, 'Refuses unknown device');
    assert(spec.evidenceStatus === AI_POLICY.evidenceStatuses.NOT_FOUND, 'Marked NOT FOUND');
    assert(spec.message.includes('not treat any estimated values as confirmed'), 'Anti-hallucination refusal message active');
  });

  // =========================================================================
  // GROUP 2: WEBINAR REGISTRY & DATA LIFECYCLE
  // =========================================================================
  console.log('\n--- Group 2: Webinar Registry & Data Lifecycle ---');

  test('Registry lists webinars with valid lifecycle statuses', () => {
    const all = WebinarRegistry.getAll();
    assert(all.length >= 4, 'Minimum 4 seeded webinars exist');
    const validStatuses = Object.values(WEBINAR_LIFECYCLE);
    all.forEach((w) => {
      assert(validStatuses.includes(w.status), `Webinar ${w.id} has valid status: ${w.status}`);
      assert(w.title && w.speaker && w.topic, `Webinar ${w.id} has required metadata`);
    });
  });

  test('Status filtering: UPCOMING, LIVE, RECORDED, ARCHIVED', () => {
    const upcoming = WebinarRegistry.getByStatus(WEBINAR_LIFECYCLE.UPCOMING);
    assert(upcoming.length > 0, 'Upcoming webinars found');
    assert(upcoming.every((w) => w.status === WEBINAR_LIFECYCLE.UPCOMING), 'All filtered are UPCOMING');

    const recorded = WebinarRegistry.getByStatus(WEBINAR_LIFECYCLE.RECORDED);
    assert(recorded.length > 0, 'Recorded webinars found');
    assert(recorded.every((w) => w.status === WEBINAR_LIFECYCLE.RECORDED), 'All filtered are RECORDED');

    const archived = WebinarRegistry.getByStatus(WEBINAR_LIFECYCLE.ARCHIVED);
    assert(archived.length > 0, 'Archived webinars found');
  });

  test('Public vs Private isolation: Draft/Private content excluded from public queries', () => {
    const publicList = WebinarRegistry.getPublicWebinars();
    const hasDraft = publicList.some((w) => w.status === WEBINAR_LIFECYCLE.DRAFT || w.visibility === CONTENT_VISIBILITY.PRIVATE);
    assert(hasDraft === false, 'Public listing never includes draft or private webinars');

    const all = WebinarRegistry.getAll();
    const draft = all.find((w) => w.status === WEBINAR_LIFECYCLE.DRAFT);
    assert(draft !== undefined, 'Draft webinar exists in store');
    assert(draft.visibility === CONTENT_VISIBILITY.PRIVATE, 'Draft webinar marked private');

    const publicFound = WebinarRegistry.getById(draft.id, { allowPrivate: false });
    assert(publicFound === null, 'getById with allowPrivate:false rejects private draft');

    const adminFound = WebinarRegistry.getById(draft.id, { allowPrivate: true });
    assert(adminFound !== null, 'getById with allowPrivate:true returns draft for admin');
  });

  test('Registration, live-stream, recording URL, slides and transcripts exist on structured model', () => {
    const recorded = WebinarRegistry.getPublicWebinars().find((w) => w.status === WEBINAR_LIFECYCLE.RECORDED);
    assert(recorded, 'Recorded webinar exists');
    assert(recorded.recordingUrl && recorded.recordingUrl.startsWith('http'), 'Valid recording URL present');
    assert(recorded.slidesUrl, 'Slides resource available');
    assert(recorded.transcriptSnippet, 'Transcript snippet available');
    assert(Array.isArray(recorded.relatedTopics), 'Related topics array present');
  });

  // =========================================================================
  // GROUP 3: VIDEO ARCHITECTURE & LIBRARY
  // =========================================================================
  console.log('\n--- Group 3: Video Architecture & Video Library ---');

  test('Videos use external embedding providers rather than raw MP4 files in repo', () => {
    const videos = WebinarRegistry.getPublicVideos();
    assert(videos.length >= 3, 'Public videos available');
    videos.forEach((v) => {
      assert(
        v.videoProvider === 'youtube' || v.videoProvider === 'vimeo' || v.videoProvider === 'external_embed',
        `Video ${v.id} uses supported external embedding provider`
      );
      assert(!v.videoUrl.endsWith('.mp4') || v.videoUrl.startsWith('http'), 'External streaming URL or embed link');
    });
  });

  test('Video associated with webinar maintains foreign reference', () => {
    const videos = WebinarRegistry.getPublicVideos();
    const associated = videos.find((v) => v.webinarId || v.relatedWebinarId);
    assert(associated, 'Video associated with webinar exists');
    const linkedWebinar = WebinarRegistry.getById(associated.webinarId || associated.relatedWebinarId);
    assert(linkedWebinar !== null, 'Referenced webinar resolves in registry');
  });

  test('Private/Unpublished video isolation', () => {
    const publicVideos = WebinarRegistry.getPublicVideos();
    const hasPrivate = publicVideos.some((v) => v.visibility === CONTENT_VISIBILITY.PRIVATE || v.published === false);
    assert(hasPrivate === false, 'Private or unpublished videos excluded from public view');
  });

  // =========================================================================
  // GROUP 4: ADMIN CONTENT MANAGEMENT & WRITE CONTROLS
  // =========================================================================
  console.log('\n--- Group 4: Admin Content Management & Security ---');

  test('Anonymous visitor cannot perform admin operations on webinar registry', () => {
    const unauthorizedSave = () => {
      WebinarRegistry.saveWebinar({
        title: 'Hacked Webinar',
        status: WEBINAR_LIFECYCLE.UPCOMING,
      }, { isAuthenticatedAdmin: false });
    };
    assert.throws(unauthorizedSave, /Unauthorized/i, 'Rejects unauthenticated webinar save');

    const unauthorizedDelete = () => {
      WebinarRegistry.deleteWebinar('webinar-eeg-clinical-2025', { isAuthenticatedAdmin: false });
    };
    assert.throws(unauthorizedDelete, /Unauthorized/i, 'Rejects unauthenticated webinar delete');
  });

  test('Authenticated admin can create, update and delete webinar records in registry', () => {
    const newRecord = {
      id: 'test-admin-webinar',
      slug: 'test-admin-webinar',
      title: 'Automated Test Webinar',
      description: 'Test description for admin validation',
      speaker: 'Marye Agegn',
      topic: 'Test Topic',
      category: 'Clinical Engineering',
      date: '2026-10-15',
      duration: '45 mins',
      status: WEBINAR_LIFECYCLE.UPCOMING,
      visibility: CONTENT_VISIBILITY.PUBLIC,
      published: true,
      videoProvider: 'youtube',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      relatedTopics: ['testing'],
    };

    const saved = WebinarRegistry.saveWebinar(newRecord, { isAuthenticatedAdmin: true });
    assert(saved.id === 'test-admin-webinar', 'Admin created webinar successfully');

    // Update
    saved.title = 'Updated Automated Test Webinar';
    const updated = WebinarRegistry.saveWebinar(saved, { isAuthenticatedAdmin: true });
    assert(updated.title === 'Updated Automated Test Webinar', 'Admin updated webinar');

    // Delete
    const deleted = WebinarRegistry.deleteWebinar('test-admin-webinar', { isAuthenticatedAdmin: true });
    assert(deleted === true, 'Admin deleted webinar record');
  });

  // =========================================================================
  // GROUP 5: AI INTEGRATION & DISCOVERY
  // =========================================================================
  console.log('\n--- Group 5: AI Concierge Webinar & Video Integration ---');

  await asyncTest('AI discovers webinars: "Do you have a webinar about EEG?"', async () => {
    const res = await BiomedicalConcierge.processMessage('Do you have a webinar about EEG?');
    assert(res.replyMetadata.classification === AI_POLICY.classifications.GENERAL_INFORMATION, 'Classified correctly');
    assert(res.replyText.toLowerCase().includes('webinar') || res.replyText.toLowerCase().includes('eeg'), 'Mentions EEG webinar');
    assert(res.actionObj && res.actionObj.href === '#webinars', 'Generates direct action link to #webinars');
  });

  await asyncTest('AI discovers videos: "Do you have videos explaining ECG?"', async () => {
    const res = await BiomedicalConcierge.processMessage('Do you have videos explaining ECG?');
    assert(res.replyText.toLowerCase().includes('video') || res.replyText.toLowerCase().includes('ecg'), 'Mentions ECG video');
    assert(res.actionObj && res.actionObj.href === '#webinars', 'Directs to Webinars/Media hub');
  });

  await asyncTest('Educational -> Custom Service: "I watched your ECG webinar and now I need my ECG dataset analyzed."', async () => {
    const res = await BiomedicalConcierge.processMessage('I watched your ECG webinar and now I need my ECG dataset analyzed.');
    assert(res.replyMetadata.classification === AI_POLICY.classifications.CUSTOM_TECHNICAL_WORK, 'Identified custom technical work');
    assert(res.structuredRequirements.technicalNeed.includes('ECG dataset'), 'Captured structured technical need');
    assert(res.actionObj && res.actionObj.serviceId === 'research-and-development', 'Routed to research-and-development service');
    assert(res.replyText.includes('signal processing') || res.replyText.includes('analysis pipeline') || res.replyText.includes('filter'), 'Explains general analysis steps');
  });

  // =========================================================================
  // GROUP 6: SECURITY & CREDENTIAL LEAK AUDIT
  // =========================================================================
  console.log('\n--- Group 6: Security & Frontend Bundle Secret Scan ---');

  test('Frontend bundles & source files do NOT contain service_role keys or secrets', () => {
    const distDir = path.resolve(__dirname, '../dist/assets');
    assert(fs.existsSync(distDir), 'Dist assets directory exists');
    const files = fs.readdirSync(distDir);
    const jsFiles = files.filter((f) => f.endsWith('.js'));
    assert(jsFiles.length > 0, 'Production JS bundles exist');

    for (const file of jsFiles) {
      const content = fs.readFileSync(path.join(distDir, file), 'utf8');
      assert(!content.includes('service_role'), `Zero service_role in bundle ${file}`);
      assert(!content.includes('SUPABASE_SERVICE_ROLE_KEY'), `Zero SUPABASE_SERVICE_ROLE_KEY in bundle ${file}`);
      assert(!/sbp_[a-zA-Z0-9]{35,}/.test(content), `Zero active Supabase personal access tokens in bundle ${file}`);
      assert(!content.includes('admin_secret'), `Zero admin secrets in bundle ${file}`);
    }
  });

  console.log('\n===============================================================');
  console.log(`WEBINAR & VERIFICATION AUDIT SUMMARY: ${passed}/${total} PASSED`);
  console.log('===============================================================');

  if (passed !== total) {
    process.exit(1);
  }
}

runVerificationSuite().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
