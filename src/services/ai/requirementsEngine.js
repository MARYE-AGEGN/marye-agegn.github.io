/**
 * Requirements Engineering & Clinical Specification Synthesizer
 *
 * Implements Requirement 10:
 * Guides users through defining technical requirements for medical devices and hospital facilities.
 * Formulates structured "Preliminary Technical Requirement Specifications".
 */

export class RequirementsEngine {
  /**
   * Evaluates requirements input and determines missing critical parameters
   */
  static analyzeFacilityRequirements(userPrompt = '', existingContext = {}) {
    const lower = userPrompt.toLowerCase();

    // Key Parameters to track
    const requirements = {
      facilityType: existingContext.facilityType || null,
      bedCount: existingContext.bedCount || null,
      department: existingContext.department || null,
      patientPopulation: existingContext.patientPopulation || null,
      requiredParameters: existingContext.requiredParameters || [],
      connectivity: existingContext.connectivity || null,
      environmentalConstraints: existingContext.environmentalConstraints || null,
    };

    // Extract bed count if mentioned
    const bedMatch = lower.match(/(\d+)[ -]bed/);
    if (bedMatch) requirements.bedCount = parseInt(bedMatch[1], 10);

    // Extract department/ward
    if (lower.includes('icu') || lower.includes('intensive care')) requirements.department = 'Intensive Care Unit (ICU)';
    else if (lower.includes('or') || lower.includes('operating room') || lower.includes('theatre')) requirements.department = 'Operating Room (OR)';
    else if (lower.includes('er') || lower.includes('emergency')) requirements.department = 'Emergency Department (ED)';
    else if (lower.includes('general ward') || lower.includes('ward')) requirements.department = 'General Inpatient Ward';
    else if (lower.includes('neonatal') || lower.includes('nicu')) requirements.department = 'Neonatal ICU (NICU)';

    // Extract target parameters
    if (lower.includes('ecg') && !requirements.requiredParameters.includes('ECG')) requirements.requiredParameters.push('ECG');
    if (lower.includes('spo2') && !requirements.requiredParameters.includes('SpO₂')) requirements.requiredParameters.push('SpO₂');
    if (lower.includes('nibp') && !requirements.requiredParameters.includes('NIBP')) requirements.requiredParameters.push('NIBP');
    if (lower.includes('temp') && !requirements.requiredParameters.includes('Temperature')) requirements.requiredParameters.push('Temperature');
    if (lower.includes('co2') || lower.includes('capnography')) requirements.requiredParameters.push('EtCO₂ (Capnography)');

    // Missing crucial questions (max 2-3 focused questions to avoid overwhelming user)
    const followUpQuestions = [];
    if (!requirements.department) {
      followUpQuestions.push('Which clinical area or acuity level will this equipment support (e.g. General Ward, High-Dependency Unit, ICU, or Emergency)?');
    }
    if (requirements.requiredParameters.length === 0) {
      followUpQuestions.push('What primary physiological parameters or measurements are mandatory (e.g., standard ECG/SpO₂/NIBP/Temp, or advanced invasive arterial pressure/EtCO₂)?');
    }
    if (!requirements.connectivity) {
      followUpQuestions.push('Do you require central nursing station telemetry or electronic health record (EHR/HL7) networking?');
    }

    return {
      currentRequirements: requirements,
      followUpQuestions,
      isComplete: followUpQuestions.length === 0,
    };
  }

  /**
   * Builds the Preliminary Technical Requirement Specification
   */
  static generatePreliminarySpecification(requirements = {}, deviceType = 'Patient Monitoring System') {
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const beds = requirements.bedCount ? `${requirements.bedCount} Beds` : 'Specified Capacity';
    const dept = requirements.department || 'Clinical Facility';
    const params = requirements.requiredParameters?.length > 0
      ? requirements.requiredParameters.join(', ')
      : 'Standard Vital Signs (ECG, SpO₂, NIBP, Respiration, Temp)';

    const doc = `### Preliminary Technical Requirement Specification (Draft)
**Target Category:** ${deviceType}  
**Clinical Facility:** ${dept} (${beds})  
**Date of Formulation:** ${date}  
**Engineering Standards Context:** IEC 60601-1 (Electrical Safety), IEC 60601-1-2 (EMC), IEC 60601-2-49 (Multi-Parameter Monitoring)

---

#### 1. Clinical Operational Scope
* **Application:** Continuous and periodic bedside physiological monitoring in ${dept}.
* **Patient Population:** Adult and Pediatric (neonatal optional via dedicated sensor modules).
* **Physical Mounting:** Bedside rail mount / articulating wall arm with quick-release release mechanism.

#### 2. Mandatory Parameter Suite
* **Acquisition:** ${params}.
* **Alarms:** Visual 360° indicator beacon and audible multi-tier alarms compliant with IEC 60601-1-8.
* **Display Requirement:** High-contrast minimum 10.4-inch color touchscreen with multi-waveform vectors.

#### 3. Infrastructure & Electrical Requirements
* **Power Source:** 100–240 V AC, 50/60 Hz with internal rechargeable backup battery runtime $\\ge$ 3.5 hours.
* **Safety Isolation:** Class I or II, Type CF defibrillator-proof patient connections.
* **Environmental Tolerance:** Operational temperature 10°C to 40°C, relative humidity 15% to 85%.

#### 4. Procurement & Commissioning Verification
* **Acceptance Protocol:** Mandatory electrical safety inspection (ground continuity, chassis leakage) prior to clinical commissioning.
* **Documentation Required:** Manufacturer Service Manual, Operator Instructions, CE/FDA Certificate of Conformity, 2-year warranty and spare-parts availability guarantee.

---
*Notice: This preliminary specification is structured for technical planning. Marye can provide formal procurement advisory, tender document formulation, and acceptance testing for your institution.*`;

    return doc;
  }
}

export default RequirementsEngine;
