/**
 * Evidence Evaluation and Verification Status Engine
 *
 * Implements Requirements 7, 8, and 9:
 * - Strict evidence status assignment.
 * - Separation of factual specifications from engineering interpretations.
 * - Structured specification result generation.
 */

import { AI_POLICY } from './aiPolicy.js';

export class EvidenceEvaluator {
  /**
   * Determines the evidence level based on the source metadata and tier
   */
  static evaluateEvidence(sourceInfo = {}) {
    const { sourceTier, isOfficialDoc, isManufacturer, isPeerReviewed, hasDirectPageRef, hasConflict } = sourceInfo;

    if (hasConflict) {
      return AI_POLICY.evidenceStatuses.CONFLICTING;
    }

    if (!sourceInfo || (!sourceTier && !isOfficialDoc && !isManufacturer)) {
      return AI_POLICY.evidenceStatuses.UNVERIFIED;
    }

    if (sourceTier === 'TIER_1' || isOfficialDoc || isManufacturer) {
      return AI_POLICY.evidenceStatuses.VERIFIED_PRIMARY;
    }

    if (sourceTier === 'TIER_2' || isPeerReviewed) {
      return AI_POLICY.evidenceStatuses.SUPPORTED_SECONDARY;
    }

    if (sourceTier === 'TIER_3' && hasDirectPageRef) {
      return AI_POLICY.evidenceStatuses.SUPPORTED_SECONDARY;
    }

    return AI_POLICY.evidenceStatuses.UNVERIFIED;
  }

  /**
   * Formats a structured Technical Specification entry according to Requirement 8
   */
  static formatSpecification({
    device,
    manufacturer,
    model,
    parameter,
    value,
    evidenceStatus,
    source,
    document,
    url,
    retrievalDate = new Date().toLocaleDateString('en-US'),
    notes,
  }) {
    return {
      device: device || 'Medical Device',
      manufacturer: manufacturer || 'Manufacturer',
      model: model || 'Standard Model',
      parameter,
      value,
      evidenceStatus: evidenceStatus || AI_POLICY.evidenceStatuses.UNVERIFIED,
      source: source || 'Technical Documentation',
      document: document || 'Official Manual / Datasheet',
      url: url || null,
      retrievalDate,
      notes: notes || 'Specification applies to specified configuration and revision.',
    };
  }

  /**
   * Generates a comparative table between multiple models (Requirement 9)
   * Separating strictly documented FACTS from ENGINEERING INTERPRETATION.
   */
  static buildComparisonTable(models = [], parameters = [], interpretation = '') {
    const rows = parameters.map((param) => {
      const rowData = { parameter: param.name };
      models.forEach((m) => {
        const spec = m.specs?.[param.id] || m.specs?.[param.name];
        rowData[m.model] = spec
          ? { value: spec.value, evidence: spec.evidence || AI_POLICY.evidenceStatuses.SUPPORTED_SECONDARY }
          : { value: 'Not specified', evidence: AI_POLICY.evidenceStatuses.NOT_FOUND };
      });
      return rowData;
    });

    return {
      models: models.map((m) => ({ name: m.name, manufacturer: m.manufacturer, model: m.model })),
      parameters: parameters.map((p) => p.name),
      matrix: rows,
      engineeringInterpretation: interpretation,
      caveat:
        'Biomechanical and clinical suitability depends on facility infrastructure, user workflows, and local regulatory standards. Formal selection should follow a structured procurement assessment.',
    };
  }
}

export default EvidenceEvaluator;
