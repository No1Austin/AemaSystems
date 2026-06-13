export const generateGrowthProjection = (growthScore = 60, recommendations = []) => {
  const highImpactCount = recommendations.filter((item) =>
    String(item.impact || "").toLowerCase().includes("high")
  ).length;

  const improvement = highImpactCount >= 3 ? 12 : highImpactCount >= 2 ? 9 : 6;

  const low = Math.min(growthScore + improvement - 2, 96);
  const high = Math.min(growthScore + improvement + 2, 96);

  return {
    currentScore: growthScore,
    projectedRange: `${low}–${high}`,
    timeframe: "90 Days",
    statement: `If the highest-priority recommendations are implemented consistently, AEMA estimates the Growth Health Score could realistically improve from ${growthScore} to ${low}–${high} within 90 days.`,
    expectedOutcomes: [
      "Improved lead capture and follow-up consistency.",
      "Stronger trust and conversion systems.",
      "Better visibility into marketing and sales performance.",
      "Reduced operational friction through clearer task management.",
    ],
  };
};