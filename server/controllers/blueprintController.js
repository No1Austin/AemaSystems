import {
  calculateGrowthScore,
  getGrowthPotential,
} from "../services/blueprintScoringService.js";

export const submitBlueprintAssessment = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Assessment answers are required.",
      });
    }

    const growthScore = calculateGrowthScore(answers);
    const growthPotential = getGrowthPotential(growthScore);

    return res.status(200).json({
      success: true,
      data: {
        growthScore,
        growthPotential,
      },
    });
  } catch (error) {
    console.error("Blueprint assessment error:", error);

    return res.status(500).json({
      success: false,
      message: "Assessment failed.",
    });
  }
};