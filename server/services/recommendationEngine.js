const text = (value = "") => String(value || "").toLowerCase();

const hasAny = (value = "", words = []) =>
  words.some((word) => text(value).includes(word));

export const generatePrioritizedRecommendations = (profile = {}) => {
  const recommendations = [];

  if (profile.websiteStatus === "No Website") {
    recommendations.push({
      title: "Build a conversion-focused website",
      impact: "High",
      effort: "Medium",
      timeframe: "30–60 Days",
      reason:
        "The business currently lacks a dedicated digital hub for trust-building, SEO visibility, and structured lead capture.",
    });
  }

  if (profile.websiteStatus === "Has Website") {
    recommendations.push({
      title: "Improve website conversion",
      impact: "High",
      effort: "Medium",
      timeframe: "30 Days",
      reason:
        "The website should become a measurable conversion asset, not just an online presence.",
    });
  }

  if (profile.websiteAudit?.recommendations?.length) {
    recommendations.push({
      title: "Resolve website audit issues",
      impact: "High",
      effort: "Low–Medium",
      timeframe: "Quick Win",
      reason:
        "The website audit found issues that may affect SEO, trust, accessibility, or conversion performance.",
    });
  }

  if (profile.leadSource === "Google") {
    recommendations.push({
      title: "Strengthen local SEO and review strategy",
      impact: "High",
      effort: "Medium",
      timeframe: "30–60 Days",
      reason:
        "Google is already part of the customer acquisition journey, so improving visibility and trust signals may produce faster gains.",
    });
  }

  if (
    profile.leadSource === "Social Media" ||
    hasAny(profile.marketingChannels, ["instagram", "facebook", "tiktok"])
  ) {
    recommendations.push({
      title: "Turn social attention into a sales funnel",
      impact: "Medium–High",
      effort: "Medium",
      timeframe: "30–60 Days",
      reason:
        "Social activity should connect to a clear lead capture, follow-up, and conversion system.",
    });
  }

  if (
    hasAny(profile.salesProcess, ["whatsapp", "dm", "message", "manual"]) ||
    hasAny(profile.automationNeed, ["follow", "lead", "message", "booking"])
  ) {
    recommendations.push({
      title: "Implement lead tracking and follow-up automation",
      impact: "High",
      effort: "Low–Medium",
      timeframe: "Quick Win",
      reason:
        "Manual inquiry handling can create missed follow-ups, poor visibility, and inconsistent conversion.",
    });
  }

  recommendations.push({
    title: "Use AEMA Task Manager for implementation tracking",
    impact: "Medium",
    effort: "Low",
    timeframe: "Quick Win",
    reason:
      "Recommendations only create value when they are converted into tasks, owners, deadlines, and measurable progress.",
  });

  return recommendations.slice(0, 6);
};