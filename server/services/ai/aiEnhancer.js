// server/services/ai/aiEnhancer.js

import { analyzeBusiness } from "./businessAnalyzer.js";
import { buildBusinessAnalysisPrompt } from "./promptBuilder.js";
import { generateAIEnhancement } from "./openaiService.js";
import { mergeAIEnhancement } from "./responseMerger.js";

const canUseAI = (useAI = false) => {
  return Boolean(
    useAI &&
      process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY.startsWith("sk-")
  );
};

const normalizeAIData = (data = {}) => {
  return {
    enhancedExecutiveSummary: Array.isArray(data.enhancedExecutiveSummary)
      ? data.enhancedExecutiveSummary
      : [],

    strategicDiagnosis: Array.isArray(data.strategicDiagnosis)
      ? data.strategicDiagnosis
      : [],

    highestPriorityOpportunities: Array.isArray(
      data.highestPriorityOpportunities
    )
      ? data.highestPriorityOpportunities
      : [],

    recommendedNextActions: Array.isArray(data.recommendedNextActions)
      ? data.recommendedNextActions
      : [],

    consultantClosingNote:
      typeof data.consultantClosingNote === "string"
        ? data.consultantClosingNote
        : "",
  };
};

export const enhanceBusinessAnalysis = async ({
  profile = {},
  includeExpertAnalysis = false,
  includePreparationNotes = false,
  planInfo = {},
  useAI = false,
} = {}) => {
  const analysis = await analyzeBusiness({
    profile,
    includeExpertAnalysis,
    includePreparationNotes,
    planInfo,
  });

  const baseResponse = {
    ...analysis,
    aiEnhanced: false,
    aiEnhancement: null,
    aiStatus: "disabled",
  };

  if (!canUseAI(useAI)) {
    return baseResponse;
  }

  try {
    const prompt = buildBusinessAnalysisPrompt(analysis);
    const aiResult = await generateAIEnhancement(prompt);

    if (!aiResult.success) {
      console.error("AI enhancement failed:", aiResult.error);

      return {
        ...baseResponse,
        aiStatus: "failed",
      };
    }

    const aiData = normalizeAIData(aiResult.data);

    return mergeAIEnhancement({
      analysis,
      aiData,
    });
  } catch (error) {
    console.error("AI enhancement error:", error);

    return {
      ...baseResponse,
      aiStatus: "failed",
    };
  }
};