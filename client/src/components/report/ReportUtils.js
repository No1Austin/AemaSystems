export const money = (amount, currency) => {
  const safeAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0;
  return `${(safeAmount / 100).toFixed(2)} ${currency?.toUpperCase() || "CAD"}`;
};

export const asArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

export const safeText = (value, fallback = "Not provided") => {
  if (value === null || value === undefined || value === "") return fallback;

  if (Array.isArray(value)) {
    return value.filter(Boolean).join(", ") || fallback;
  }

  if (typeof value === "object") {
    return (
      value.title ||
      value.reason ||
      value.rationale ||
      value.description ||
      value.summary ||
      value.opportunity ||
      value.action ||
      JSON.stringify(value)
    );
  }

  return String(value);
};

export const getItemText = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item;

  return (
    item.title ||
    item.reason ||
    item.rationale ||
    item.description ||
    item.summary ||
    item.opportunity ||
    item.action ||
    JSON.stringify(item)
  );
};

export const getDisplayBusinessName = (snapshot = {}) => {
  const badNames = [
    "i need more customers for my business",
    "i want more customers",
    "get more customers",
    "more customers",
  ];

  const raw =
    snapshot.businessName ||
    snapshot.businessType ||
    snapshot.industry ||
    "This Business";

  const normalizedRaw = String(raw).toLowerCase().trim();

  return badNames.includes(normalizedRaw) ||
    normalizedRaw.includes("need more customers")
    ? snapshot.industry || snapshot.mainOffer || "This Business"
    : raw;
};

export const getWebsiteScore = (report = {}) => {
  const items = asArray(report.websiteAnalysis);

  const scoreItem = items.find((item) =>
    String(item).toLowerCase().includes("website audit score")
  );

  const match = String(scoreItem || "").match(/(\d+)\/100/);

  return match ? `${match[1]}/100` : "N/A";
};

export const getWebsiteScoreNumber = (report = {}) => {
  const score = getWebsiteScore(report);
  const match = String(score).match(/(\d+)/);
  return match ? Number(match[1]) : 0;
};

export const getPrimaryGoogleBusiness = (market = {}) => {
  return (
    market.googleBusinessProfile ||
    market.businessProfile ||
    market.ownBusiness ||
    market.matchedBusiness ||
    null
  );
};

export const clamp = (num, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Number(num) || 0));

export const formatCurrency = (value) =>
  `$${Number(value || 0).toLocaleString()}`;

export const deriveHealthScores = (report = {}) => {
  const growthScore = Number(report.growthScore) || 0;
  const websiteScore = getWebsiteScoreNumber(report);
  const market = report.marketIntelligence || {};
  const stats = market.competitorStats || {};
  const googleBusiness = getPrimaryGoogleBusiness(market);

  const trustScore = googleBusiness?.rating
    ? Math.round((Number(googleBusiness.rating) / 5) * 100)
    : stats.averageRating
    ? Math.round((Number(stats.averageRating) / 5) * 100)
    : 60;

  const automationScore = asArray(report.automationAnalysis).length ? 38 : 30;
  const marketingScore = stats.websitePresencePercent
    ? Math.round(Number(stats.websitePresencePercent) * 0.7)
    : 58;

  return {
    growthScore: clamp(growthScore),
    websiteScore: clamp(websiteScore),
    trustScore: clamp(trustScore),
    marketingScore: clamp(marketingScore),
    automationScore: clamp(automationScore),
    salesScore: clamp(report.businessSystemsAnalysis ? 58 : 50),
    operationsScore: clamp(report.scoringNotes ? 65 : 55),
  };
};
