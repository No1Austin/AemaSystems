// server/services/fullReportGenerator.js

import { generateBlueprint } from "./blueprintGenerator.js";
import { sanitizeProfile } from "./profileSanitizer.js";
import { getBusinessDisplayName } from "./businessIdentityService.js";

const uniqueArray = (items = []) => [...new Set(items.filter(Boolean))];

const formatList = (value) => {
  if (Array.isArray(value)) return value.join(", ");
  return value || null;
};

export const generateFullReport = (profile = {}, existingBlueprint = null) => {
  const cleanProfile = sanitizeProfile(profile);

  const blueprint = existingBlueprint || generateBlueprint(cleanProfile);

  const businessDisplayName =
    getBusinessDisplayName(blueprint) || "This business";

  const executiveSummary = uniqueArray([
    `${businessDisplayName} is currently operating with a Growth Health Score of ${blueprint.growthScore}, indicating ${String(
      blueprint.growthPotential || "medium"
    ).toLowerCase()} growth readiness.`,

    blueprint.goal
      ? `The primary strategic objective identified during the assessment is ${String(
          blueprint.goal
        ).toLowerCase()}.`
      : null,

    blueprint.leadSource
      ? `Customer acquisition currently relies primarily on ${String(
          blueprint.leadSource
        ).toLowerCase()}, creating opportunities to improve conversion efficiency and reduce dependence on a single channel.`
      : null,

    blueprint.websiteStatus === "Has Website"
      ? "The existing website provides a foundation for growth, although optimization opportunities remain."
      : "The absence of a website represents a significant opportunity to improve credibility, discoverability, and lead capture.",

    ...(blueprint.executiveSummary || []),
  ]);

  const websiteAnalysis = uniqueArray([
    blueprint.websiteUrl
      ? `Website reviewed: ${blueprint.websiteUrl}`
      : "No website URL was provided.",
    blueprint.websiteAudit?.score !== undefined
      ? `Website audit score: ${blueprint.websiteAudit.score}/100.`
      : null,
    blueprint.websiteAudit?.health
      ? `Website health: ${blueprint.websiteAudit.health}.`
      : null,
    ...(blueprint.websiteAudit?.findings || []),
    ...(blueprint.websiteAudit?.recommendations || []),
  ]);

  const opportunities = uniqueArray([
    ...(blueprint.opportunities || []),
    ...(blueprint.industryInsights?.insights || []),
    ...(blueprint.industryInsights?.opportunities || []),
    ...(blueprint.growthOpportunities?.map((item) =>
      typeof item === "string" ? item : item.title
    ) || []),
  ]);

  const risks = uniqueArray([
    ...(blueprint.risks || []),
    ...(blueprint.industryInsights?.risks || []),
  ]);

  return {
    title: "AEMA Growth Blueprint Report",

    executiveSummary,

    businessSnapshot: {
      businessName: blueprint.businessName || null,
      businessType: blueprint.businessType,
      industry: blueprint.industry,
      mainOffer: blueprint.mainOffer,
      goal: blueprint.goal,
      leadSource: blueprint.leadSource,
      websiteStatus: blueprint.websiteStatus,
      websiteUrl: blueprint.websiteUrl,
      automationNeed: blueprint.automationNeed,
      biggestChallenge: blueprint.biggestChallenge,
      monthlyCustomers: blueprint.monthlyCustomers,
      monthlyRevenue: blueprint.monthlyRevenue,
      teamSize: blueprint.teamSize,
      businessStage: blueprint.businessStage || blueprint.businessAge,
      websiteGoal: blueprint.websiteGoal,
      salesProcess: blueprint.salesProcess,
      marketingChannels: formatList(blueprint.marketingChannels),
      techComfort: blueprint.techComfort,
      serviceLocation: blueprint.serviceLocation,
      websiteAuditStatus: blueprint.websiteAudit?.available
        ? "Website audit completed"
        : "Website audit unavailable",
    },

    growthScore: blueprint.growthScore,
    growthPotential: blueprint.growthPotential,
    scoreBreakdown: blueprint.scoreBreakdown,
    scoringNotes: blueprint.scoringNotes,

    strengths: blueprint.strengths || [],
    weaknesses: blueprint.weaknesses || [],
    opportunities,
    risks,

    websiteAnalysis,
    marketingAnalysis: blueprint.marketingAnalysis || [],
    automationAnalysis: blueprint.automationAnalysis || [],
    businessSystemsAnalysis: blueprint.businessSystemsAnalysis || [],

    actionPlan30Days: blueprint.actionPlan || [],

    recommendedServices: uniqueArray([
      ...(blueprint.recommendedServices || []),
      "AEMA TaskFlow",
    ]),

    nextSteps: blueprint.nextSteps || [
      "Implement priority recommendations.",
      "Track business KPIs.",
      "Review growth progress monthly.",
      "Use AEMA TaskFlow to organize recommendations, assign tasks, track deadlines, and manage implementation progress.",
    ],

    advancedAnalysis: {
      growthConstraints: blueprint.growthConstraints || [],
      growthOpportunities: blueprint.growthOpportunities || [],
      executiveRecommendation: blueprint.executiveRecommendation || null,
      industryInsights: blueprint.industryInsights || null,
      recommendations: blueprint.recommendations || [],
      priorityActions: blueprint.priorityActions || [],
    },
  };
};