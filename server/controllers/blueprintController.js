import { analyzeBusiness } from "../services/ai/businessAnalyzer.js";

export const submitBlueprintAssessment = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Assessment answers are required.",
      });
    }

    const analysis = await analyzeBusiness({
      profile: answers,
    });

    return res.status(200).json({
      success: true,
      data: {
        growthScore: analysis.blueprint.growthScore,
        growthPotential: analysis.blueprint.growthPotential,

        profile: analysis.profile,

        blueprint: analysis.blueprint,

        report: analysis.report,

        expertAnalysis: analysis.expertAnalysis,

        preparationNotes: analysis.preparationNotes,
      },
    });
  } catch (error) {
    console.error("Blueprint assessment error:", error);

    return res.status(500).json({
      success: false,
      message: "Assessment failed.",
      error: error.message,
    });
  }
};