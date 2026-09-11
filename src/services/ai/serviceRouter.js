/**
 * Service Recommendation and Multi-Service Routing Engine
 *
 * Implements Requirements 4 and 11:
 * - Maps natural language requests and technical needs to Marye's 11 biomedical engineering services.
 * - Supports multi-service recommendation pathways.
 * - Prevents artificial rejection ("I only do gait analysis" or "outside my services").
 */

import { siteData } from '../../data/siteData.js';

export class ServiceRouter {
  constructor(services = siteData.services || []) {
    this.services = services;
  }

  /**
   * Evaluates user query and intent, returning prioritized recommendations with rationale
   */
  routeRequest(intentResult) {
    const { detectedIntent, technicalDomain, requestedEquipment, rawQuery = '' } = intentResult;
    const lower = rawQuery.toLowerCase();
    const recommendations = [];

    // Rule 1: Equipment Procurement, Purchasing, or Tender preparation
    if (
      detectedIntent === 'procurement_comparison' ||
      lower.includes('purchase') ||
      lower.includes('procure') ||
      lower.includes('buy') ||
      lower.includes('tender') ||
      lower.includes('quotation') ||
      lower.includes('infusion pump')
    ) {
      this.addRecommendation(recommendations, 'technical-specification', 0.95, 'Structuring clinical workflow requirements into precise engineering specifications and IEC safety standards.');
      this.addRecommendation(recommendations, 'procurement-and-purchasing', 0.92, 'Evaluating total cost of ownership, vendor compliance, spare-parts viability, and technical comparisons.');
      this.addRecommendation(recommendations, 'commissioning-and-acceptance-testing', 0.85, 'Pre-clinical electrical safety verification, calibration baseline, and acceptance sign-off upon delivery.');
    }

    // Rule 2: Technical Specifications & Planning
    else if (
      detectedIntent === 'technical_specification' ||
      lower.includes('specification') ||
      lower.includes('spec') ||
      lower.includes('parameter')
    ) {
      this.addRecommendation(recommendations, 'technical-specification', 0.98, 'Translating clinical needs into rigorous technical parameters and manufacturer comparative benchmarks.');
      this.addRecommendation(recommendations, 'technical-medical-technology-consultation', 0.85, 'Evaluating clinical fit, hospital infrastructure readiness, and lifecycle maintenance expectations.');
    }

    // Rule 3: Requirements Engineering for Hospital or Department
    else if (
      detectedIntent === 'requirements_engineering' ||
      lower.includes('bed hospital') ||
      lower.includes('ward') ||
      lower.includes('icu') ||
      lower.includes('equip')
    ) {
      this.addRecommendation(recommendations, 'technical-specification', 0.95, 'Formulating structured equipment schedules, electrical safety frameworks, and installation parameters.');
      this.addRecommendation(recommendations, 'procurement-and-purchasing', 0.90, 'Vendor evaluation and technical appraisal for capital medical equipment packages.');
      this.addRecommendation(recommendations, 'technical-medical-technology-consultation', 0.88, 'Comprehensive hospital equipment inventory planning and facility readiness assessments.');
    }

    // Rule 4: Device Development, Prototyping, or Hardware Engineering
    else if (
      detectedIntent === 'medical_product_development' ||
      detectedIntent === 'custom_technical_work' && (lower.includes('build') || lower.includes('develop') || lower.includes('device')) ||
      lower.includes('develop') ||
      lower.includes('prototype') ||
      lower.includes('design a device') ||
      lower.includes('hardware design') ||
      lower.includes('low-cost')
    ) {
      this.addRecommendation(recommendations, 'medical-product-development', 0.96, 'Early-stage hardware architecture, microcontroller interfacing, and safety-critical circuit topology.');
      this.addRecommendation(recommendations, 'research-and-development', 0.92, 'Biosignal conditioning, kinematic modeling, and translational experimental validation.');
      this.addRecommendation(recommendations, 'medical-device-regulations-and-standards', 0.88, 'IEC 60601 safety standard compliance guidance and ISO 14971 risk management review.');
    }

    // Rule 5: Research Collaboration & Data Analysis (Gait, Biosignals, Neuroimaging, AI, Datasets)
    else if (
      detectedIntent === 'research_collaboration' ||
      lower.includes('dataset') ||
      lower.includes('data analysis') ||
      lower.includes('clean my data') ||
      lower.includes('analyze my') ||
      lower.includes('research') ||
      lower.includes('collaborat') ||
      lower.includes('gait') ||
      lower.includes('biosignal') ||
      lower.includes('ecg') ||
      lower.includes('eeg') ||
      lower.includes('study')
    ) {
      this.addRecommendation(recommendations, 'research-and-development', 0.96, 'Applied engineering collaboration in wearable inertial telemetry, biosignal filtering, and explainable deep learning.');
      this.addRecommendation(recommendations, 'technical-specification', 0.85, 'Data capture protocols, signal filtering parameters, and standardized feature pipelines.');
      this.addRecommendation(recommendations, 'technical-medical-technology-consultation', 0.80, 'Interdisciplinary research methodology and clinical protocol formulation.');
    }

    // Rule 6: Digital Health, Telemetry & Digitalization
    else if (
      lower.includes('digital health') ||
      lower.includes('telemetry') ||
      lower.includes('digitalization') ||
      lower.includes('software') ||
      lower.includes('uptime tracking')
    ) {
      this.addRecommendation(recommendations, 'healthcare-system-digitalization', 0.95, 'Developing digital workflows for equipment uptime logging, asset tracking, and ambulatory patient telemetry.');
      this.addRecommendation(recommendations, 'technical-medical-technology-consultation', 0.82, 'Hospital-wide healthcare technology management and digital infrastructure optimization.');
    }

    // Default / Broad Consultation Rule
    else {
      this.addRecommendation(recommendations, 'technical-medical-technology-consultation', 0.85, 'Independent biomedical engineering advisory on medical technology planning, troubleshooting, and management decisions.');
      this.addRecommendation(recommendations, 'technical-specification', 0.75, 'Technical specification review and standards verification.');
    }

    return recommendations;
  }

  addRecommendation(list, serviceId, confidence, rationale) {
    const service = this.services.find((s) => s.id === serviceId);
    if (!service) return;

    if (!list.some((r) => r.service.id === serviceId)) {
      list.push({
        service,
        confidence,
        rationale,
      });
    }
  }

  /**
   * Generates a direct actionable link/button object for a specific service
   */
  getServiceLink(serviceId) {
    const service = this.services.find((s) => s.id === serviceId);
    if (!service) {
      return { label: 'Explore Services', href: '#services', serviceId: null };
    }
    return {
      label: `Route to ${service.title}`,
      href: `#services`,
      serviceId: service.id,
      category: service.category,
    };
  }

  /**
   * Generates formatted response text detailing the recommended service pathway
   */
  formatRecommendationMessage(recommendations = []) {
    if (recommendations.length === 0) return '';

    const primary = recommendations[0];
    let msg = `This inquiry involves several areas where structured biomedical engineering support will ensure clinical safety and optimal procurement. Based on your technical requirements, I recommend:\n\n`;

    recommendations.forEach((rec, idx) => {
      msg += `**${idx + 1}. ${rec.service.title}** (${Math.round(rec.confidence * 100)}% Match)\n`;
      msg += `*${rec.rationale}*\n\n`;
    });

    msg += `Would you like me to prepare this technical inquiry for Marye's direct consultation, or would you like to refine the specifications together first?`;
    return msg;
  }
}

export const defaultServiceRouter = new ServiceRouter();
export default ServiceRouter;
