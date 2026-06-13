import { getIndustryInsights } from "./industryInsightsService.js";
import { detectBusinessPatterns } from "./patternEngine.js";
import { generateActionPlan } from "./actionPlanService.js";
import { generateBusinessReasoning } from "./businessReasoningService.js";
import { calculateGrowthScoreDetails } from "./blueprintScoringService.js";
import { sanitizeProfile } from "./profileSanitizer.js";
import { generatePrioritizedRecommendations } from "./recommendationEngine.js";
import { generateAdvisorNotes } from "./advisorNotesService.js";
import { generateGrowthProjection } from "./growthProjectionService.js";
import {
  deriveBusinessIdentity,
  getBusinessDisplayName,
} from "./businessIdentityService.js";


export const generateFullReport = (profile, blueprint) => {
  const cleanProfile = sanitizeProfile(profile);

  const industryInsights = getIndustryInsights(cleanProfile);
  const businessPatterns = detectBusinessPatterns(cleanProfile);
  const dynamicActionPlan = generateActionPlan(cleanProfile);
  const scoring = calculateGrowthScoreDetails(cleanProfile);
  const identity = deriveBusinessIdentity(profile);
const businessDisplayName = getBusinessDisplayName(profile);

  const reasoning = generateBusinessReasoning({
    profile: cleanProfile,
    industryInsights,
    businessPatterns,
    scoring,
  });

  const prioritizedRecommendations =
    generatePrioritizedRecommendations(cleanProfile);

  const advisorNotes = generateAdvisorNotes(cleanProfile);

  const growthProjection = generateGrowthProjection(
    scoring.growthScore,
    prioritizedRecommendations
  );

  const executiveSummary = [];

  executiveSummary.push(
    `${cleanProfile.businessType || "This business"} is currently operating with a Growth Health Score of ${scoring.growthScore}, indicating ${scoring.growthPotential.toLowerCase()} growth readiness.`
  );

  if (cleanProfile.goal) {
    executiveSummary.push(
      `The primary strategic objective identified during the assessment is ${cleanProfile.goal.toLowerCase()}.`
    );
  }

  if (cleanProfile.leadSource) {
    executiveSummary.push(
      `Customer acquisition currently relies primarily on ${cleanProfile.leadSource.toLowerCase()}, creating opportunities to improve conversion efficiency and reduce dependence on a single channel.`
    );
  }

  if (cleanProfile.websiteStatus === "Has Website") {
    executiveSummary.push(
      "The existing website provides a foundation for growth, although optimization opportunities remain."
    );
  } else {
    executiveSummary.push(
      "The absence of a website represents a significant opportunity to improve credibility, discoverability, and lead capture."
    );
  }

  if (businessPatterns.length) {
    executiveSummary.push(businessPatterns[0]);
  }

  return {
    title: "AEMA Growth Blueprint Report",

    executiveSummary,

    growthScore: scoring.growthScore,
    growthPotential: scoring.growthPotential,
    scoreBreakdown: scoring.scoreBreakdown,
    scoringNotes: scoring.scoringNotes,

    businessSnapshot: {
      businessType: cleanProfile.businessType,
      goal: cleanProfile.goal,
      leadSource: cleanProfile.leadSource,
      websiteStatus: cleanProfile.websiteStatus,
      websiteUrl: cleanProfile.websiteUrl,
      automationNeed: cleanProfile.automationNeed,
      biggestChallenge: cleanProfile.biggestChallenge,
      monthlyCustomers: cleanProfile.monthlyCustomers,
      teamSize: cleanProfile.teamSize,
      businessAge: cleanProfile.businessAge,
      websiteGoal: cleanProfile.websiteGoal,
      serviceLocation: cleanProfile.serviceLocation,
      websiteAuditStatus: cleanProfile.websiteAudit?.available
        ? "Website audit completed"
        : "Website audit unavailable",
    },

    strengths: reasoning.strengths,
    weaknesses: reasoning.weaknesses,
    prioritizedRecommendations,
    advisorNotes,
    growthProjection,

    opportunities: [
      ...(blueprint.opportunities || []),
      ...(industryInsights.insights || []),
      ...(businessPatterns || []),
    ],

    risks: reasoning.risks,

    websiteAnalysis: [
      ...(cleanProfile.websiteUrl
        ? [`Website reviewed: ${cleanProfile.websiteUrl}`]
        : ["No website URL was provided."]),
      ...(cleanProfile.websiteAudit?.findings || []),
      ...(cleanProfile.websiteAudit?.recommendations || []),
    ],

    marketingAnalysis: reasoning.marketingAnalysis,
    automationAnalysis: reasoning.automationAnalysis,
    businessSystemsAnalysis: reasoning.businessSystemsAnalysis,

    actionPlan30Days: dynamicActionPlan,

    recommendedServices: [
      ...(blueprint.recommendedServices || []),
      "AEMA Task Manager",
    ],

    nextSteps: [
      "Implement priority recommendations.",
      "Track business KPIs.",
      "Review growth progress monthly.",
      "Use AEMA Task Manager to organize recommendations, assign tasks, track deadlines, and manage implementation progress.",
    ],
  };
};