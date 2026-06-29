// server/services/ai/responseMerger.js

const uniqueArray = (items = []) => {
  return [...new Set(items.filter(Boolean))];
};

const safeArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
};

const safeString = (value = "") => {
  return typeof value === "string" ? value.trim() : "";
};

export const mergeAIEnhancement = ({
  analysis = {},
  aiData = {},
} = {}) => {
  const baseReport = analysis.report || {};

  const enhancedExecutiveSummary =
    safeArray(aiData.enhancedExecutiveSummary).length > 0
      ? safeArray(aiData.enhancedExecutiveSummary)
      : baseReport.executiveSummary || [];

  const strategicDiagnosis = safeArray(aiData.strategicDiagnosis);

  const highestPriorityOpportunities = uniqueArray([
    ...safeArray(baseReport.opportunities),
    ...safeArray(aiData.highestPriorityOpportunities),
  ]);

  const recommendedNextActions = uniqueArray([
    ...safeArray(baseReport.actionPlan30Days),
    ...safeArray(aiData.recommendedNextActions),
  ]);

  const consultantClosingNote = safeString(aiData.consultantClosingNote);

  return {
    ...analysis,

    aiEnhanced: true,
    aiStatus: "success",
    aiEnhancement: aiData,

    report: {
      ...baseReport,

      aiEnhanced: true,

      executiveSummary: enhancedExecutiveSummary,

      strategicDiagnosis,

      highestPriorityOpportunities,

      recommendedNextActions,

      consultantClosingNote,

      growthScore: baseReport.growthScore,
      growthPotential: baseReport.growthPotential,
      scoreBreakdown: baseReport.scoreBreakdown,
      scoringNotes: baseReport.scoringNotes,

      recommendedServices: baseReport.recommendedServices,
      actionPlan30Days: baseReport.actionPlan30Days,
      websiteAnalysis: baseReport.websiteAnalysis,
      businessSnapshot: baseReport.businessSnapshot,
    },
  };
};