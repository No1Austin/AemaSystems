// server/services/ai/businessAnalyzer.js

import { generateMarketIntelligence } from "../market-intelligence/marketIntelligenceService.js";
import { auditWebsite } from "../websiteAuditService.js";
import { generateBlueprint } from "../blueprintGenerator.js";
import { generateFullReport } from "../fullReportGenerator.js";
import { generateExpertAnalysis } from "../expertAnalysisService.js";
import { generatePreparationNotes } from "../preparationNotesService.js";

const shouldAuditWebsite = (profile = {}) => {
  return (
    profile.websiteStatus === "Has Website" &&
    profile.websiteUrl &&
    typeof profile.websiteUrl === "string"
  );
};

export const analyzeBusiness = async ({
  profile = {},
  includeExpertAnalysis = false,
  includePreparationNotes = false,
  planInfo = {},
} = {}) => {
  let websiteAudit = null;

  if (shouldAuditWebsite(profile)) {
    websiteAudit = await auditWebsite(profile.websiteUrl);
  }

  const enrichedProfile = {
    ...profile,
    websiteAudit,
  };

  const blueprint = generateBlueprint(enrichedProfile);

  let report = generateFullReport(enrichedProfile, blueprint);

  const marketIntelligence = await generateMarketIntelligence(enrichedProfile);

  report = {
    ...report,
    marketIntelligence,
  };

  const expertAnalysis = includeExpertAnalysis
    ? generateExpertAnalysis({
        profile: enrichedProfile,
        blueprint,
        websiteAudit,
        industryInsights: blueprint.industryInsights,
        scoring: {
          growthScore: blueprint.growthScore,
          growthPotential: blueprint.growthPotential,
          scoreBreakdown: blueprint.scoreBreakdown,
          scoringNotes: blueprint.scoringNotes,
        },
      })
    : null;

  const preparationNotes = includePreparationNotes
    ? generatePreparationNotes(enrichedProfile, report, planInfo)
    : null;

  return {
    success: true,
    profile: enrichedProfile,
    blueprint,
    report,
    expertAnalysis,
    preparationNotes,
    marketIntelligence,
  };
};