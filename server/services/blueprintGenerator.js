// server/services/blueprintGenerator.js

import { calculateGrowthScoreDetails } from "./blueprintScoringService.js";
import { generateActionPlan } from "./actionPlanService.js";
import { generateAdvisorNotes } from "./advisorNotesService.js";
import { deriveBusinessIdentity } from "./businessIdentityService.js";
import { generateBusinessReasoning } from "./businessReasoningService.js";
import { generateRecommendations } from "./recommendationEngine.js";
import { generateIndustryInsights } from "./industryInsightsService.js";
import { generateServiceRecommendations } from "./serviceRecommendationService.js";

const uniqueArray = (items = []) => [...new Set(items.filter(Boolean))];

export const generateBlueprint = (profile = {}) => {
  const identity = deriveBusinessIdentity(profile);
  const enrichedProfile = {
    ...profile,
    ...identity,
  };

  const scoring = calculateGrowthScoreDetails(enrichedProfile);
  const industryInsights = generateIndustryInsights(enrichedProfile, identity);

  const reasoning = generateBusinessReasoning({
    profile: enrichedProfile,
    industryInsights,
    businessPatterns: industryInsights?.patterns || [],
    scoring,
  });

  const recommendations = uniqueArray(
    generateRecommendations(enrichedProfile, identity)
  );

  const actionPlan = generateActionPlan(enrichedProfile, identity);

  const advisorNotes = uniqueArray(
    generateAdvisorNotes(enrichedProfile, identity)
  );

  const recommendedServices = uniqueArray(
    generateServiceRecommendations(enrichedProfile, identity)
  );

  return {
    ...enrichedProfile,

    goal: enrichedProfile.goal,
    leadSource: enrichedProfile.leadSource,
    websiteStatus: enrichedProfile.websiteStatus,
    websiteUrl: enrichedProfile.websiteUrl,
    automationNeed: enrichedProfile.automationNeed,
    biggestChallenge: enrichedProfile.biggestChallenge,
    monthlyCustomers: enrichedProfile.monthlyCustomers,
    monthlyRevenue: enrichedProfile.monthlyRevenue,
    teamSize: enrichedProfile.teamSize,
    businessStage: enrichedProfile.businessStage,
    businessAge: enrichedProfile.businessAge,
    websiteGoal: enrichedProfile.websiteGoal,
    marketingChannels: enrichedProfile.marketingChannels,
    salesProcess: enrichedProfile.salesProcess,
    techComfort: enrichedProfile.techComfort,

    growthScore: scoring.growthScore,
    growthPotential: scoring.growthPotential,
    scoreBreakdown: scoring.scoreBreakdown,
    scoringNotes: scoring.scoringNotes,

    executiveSummary: reasoning.businessPosition || [],

    strengths: reasoning.strengths || [],
    weaknesses: reasoning.weaknesses || [],
    opportunities:
      industryInsights?.opportunities ||
      reasoning.growthOpportunities?.map((item) => item.title) ||
      [],
    risks: reasoning.risks || [],

    marketingAnalysis: reasoning.marketingAnalysis || [],
    automationAnalysis: reasoning.automationAnalysis || [],
    businessSystemsAnalysis: reasoning.businessSystemsAnalysis || [],

    growthConstraints: reasoning.growthConstraints || [],
    growthOpportunities: reasoning.growthOpportunities || [],
    executiveRecommendation: reasoning.executiveRecommendation || null,

    recommendations,
    priorityActions: recommendations.slice(0, 5),
    actionPlan,
    advisorNotes,
    industryInsights,
    recommendedServices,

    nextSteps: [
      "Implement priority recommendations.",
      "Track business KPIs.",
      "Review growth progress monthly.",
      "Use AEMA TaskFlow to organize recommendations, assign tasks, track deadlines, and manage implementation progress.",
    ],
  };
};