// server/services/blueprintScoringService.js

const normalize = (value = "") =>
  Array.isArray(value)
    ? value.map((item) => String(item || "").toLowerCase().trim()).join(" ")
    : String(value || "").toLowerCase().trim();

const hasAny = (value = "", keywords = []) => {
  const clean = normalize(value);
  return keywords.some((word) => clean.includes(normalize(word)));
};

const isMissing = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
};

const clamp = (value, min = 0, max = 100) =>
  Math.max(min, Math.min(value, max));

const scoreFromRange = (value = "", ranges = {}) => {
  const clean = normalize(value);

  for (const [key, score] of Object.entries(ranges)) {
    if (clean.includes(normalize(key))) return score;
  }

  return null;
};

const getWebsiteAuditIssueCount = (profile = {}) => {
  if (!profile.websiteAudit) return 0;

  const recommendations = profile.websiteAudit.recommendations || [];
  const issues = profile.websiteAudit.issues || [];
  const findings = profile.websiteAudit.findings || [];

  return [
    ...recommendations,
    ...issues,
    ...findings,
  ].filter(Boolean).length;
};

const scoreWebsite = (profile = {}) => {
  let score = 20;
  const notes = [];

  const hasWebsite = profile.websiteStatus === "Has Website";
  const noWebsite = profile.websiteStatus === "No Website";
  const auditIssues = getWebsiteAuditIssueCount(profile);

  if (noWebsite) {
    score -= 12;
    notes.push("No business website reduces trust, search visibility, and lead capture.");
  } else if (hasWebsite) {
    if (!profile.websiteUrl) {
      score -= 5;
      notes.push("Website exists but no URL was provided for review.");
    }

    if (isMissing(profile.websiteGoal)) {
      score -= 3;
      notes.push("Website goal is unclear.");
    } else {
      score += 2;
    }

    if (auditIssues >= 5) {
      score -= 5;
      notes.push("Website audit found several issues that may affect SEO, trust, or conversion.");
    } else if (auditIssues > 0) {
      score -= 3;
      notes.push("Website audit found issues that may affect performance or conversion.");
    }
  } else {
    score -= 7;
    notes.push("Website status is unclear.");
  }

  if (hasAny(profile.goal, ["seo", "website"])) {
    score -= 2;
    notes.push("The stated goal suggests the website or SEO needs improvement.");
  }

  return {
    score: clamp(score, 0, 22),
    notes,
  };
};

const scoreMarketing = (profile = {}) => {
  let score = 20;
  const notes = [];

  if (isMissing(profile.leadSource)) {
    score -= 7;
    notes.push("Main customer source is not clear.");
  }

  if (profile.leadSource === "Referrals") {
    score -= 3;
    notes.push("Referral-based growth is valuable but can limit predictable scaling.");
  }

  if (profile.leadSource === "Social Media") {
    score -= 3;
    notes.push("Social media can generate attention, but conversion may be inconsistent without a funnel.");
  }

  if (profile.leadSource === "Walk-ins") {
    score -= 2;
    notes.push("Walk-in traffic can limit growth if digital acquisition is not developed.");
  }

  if (profile.leadSource === "No Clear Lead Source") {
    score -= 6;
    notes.push("The business does not have a clear repeatable lead source yet.");
  }

  if (profile.leadSource === "Google") score += 2;
  if (profile.leadSource === "Paid Ads") score += 1;

  const channels = Array.isArray(profile.marketingChannels)
    ? profile.marketingChannels
    : profile.marketingChannels
    ? [profile.marketingChannels]
    : [];

  if (!channels.length) {
    score -= 4;
    notes.push("Marketing channels were not clearly defined.");
  } else {
    const strongChannelCount = channels.filter((channel) =>
      hasAny(channel, [
        "instagram",
        "facebook",
        "tiktok",
        "google",
        "seo",
        "email",
        "whatsapp",
        "linkedin",
        "youtube",
        "referral",
        "ads",
      ])
    ).length;

    if (strongChannelCount >= 3) score += 3;

    if (strongChannelCount === 1) {
      score -= 2;
      notes.push("Business may be relying on only one main marketing channel.");
    }

    if (hasAny(channels, ["none", "no marketing"])) {
      score -= 6;
      notes.push("No active marketing channel was identified.");
    }
  }

  return {
    score: clamp(score, 0, 23),
    notes,
  };
};

const scoreSales = (profile = {}) => {
  let score = 20;
  const notes = [];

  if (isMissing(profile.salesProcess)) {
    score -= 6;
    notes.push("Sales process is not clearly defined.");
  }

  if (
    hasAny(profile.salesProcess, [
      "whatsapp",
      "dm",
      "direct message",
      "manual",
      "phone",
      "call",
      "inbox",
      "text",
    ])
  ) {
    score -= 5;
    notes.push("Sales process appears manual and may need structure or automation.");
  }

  if (
    hasAny(profile.salesProcess, [
      "website",
      "checkout",
      "booking form",
      "crm",
      "invoice",
      "calendar",
      "online booking",
      "marketplace",
    ])
  ) {
    score += 3;
  }

  if (
    hasAny(profile.biggestChallenge, [
      "no sales",
      "low sales",
      "conversion",
      "customers",
      "leads",
      "traffic",
      "not enough",
    ])
  ) {
    score -= 5;
    notes.push("Main challenge suggests a conversion or customer acquisition issue.");
  }

  if (isMissing(profile.mainOffer)) {
    score -= 2;
    notes.push("Main product or service offer is not clearly defined.");
  }

  if (isMissing(profile.targetCustomers)) {
    score -= 2;
    notes.push("Target customers are not clearly defined.");
  }

  return {
    score: clamp(score, 0, 23),
    notes,
  };
};

const scoreOperations = (profile = {}) => {
  let score = 20;
  const notes = [];

  if (isMissing(profile.automationNeed)) {
    score -= 5;
    notes.push("Manual operational bottlenecks were not clearly identified.");
  }

  if (
    hasAny(profile.automationNeed, [
      "booking",
      "bookings",
      "follow",
      "follow-up",
      "message",
      "email",
      "payment",
      "report",
      "lead",
      "customer",
      "task",
      "workflow",
      "manual",
    ])
  ) {
    score -= 5;
    notes.push("Business has clear automation opportunities.");
  }

  if (
    hasAny(profile.automationNeed, [
      "crm",
      "system",
      "dashboard",
      "software",
      "booking form",
      "automated",
    ])
  ) {
    score += 3;
  }

  if (isMissing(profile.teamSize)) {
    score -= 3;
    notes.push("Team size was not provided.");
  } else if (hasAny(profile.teamSize, ["just me", "solo", "only me"])) {
    score -= 3;
    notes.push("Small team size may limit capacity without strong systems.");
  } else if (hasAny(profile.teamSize, ["2-5"])) {
    score += 1;
  } else if (hasAny(profile.teamSize, ["6-20", "20+"])) {
    score += 2;
  }

  return {
    score: clamp(score, 0, 23),
    notes,
  };
};

const scoreBusinessMaturity = (profile = {}) => {
  let score = 20;
  const notes = [];

  const customerScore = scoreFromRange(profile.monthlyCustomers, {
    "under 20": -6,
    "20-100": 1,
    "100-500": 4,
    "500+": 6,
  });

  if (customerScore === null) {
    score -= 5;
    notes.push("Monthly customer volume was not provided.");
  } else {
    score += customerScore;

    if (customerScore < 0) {
      notes.push("Customer volume appears early-stage or still developing.");
    }
  }

  const revenueScore = scoreFromRange(profile.monthlyRevenue, {
    "under $2k": -4,
    "$2k-$10k": 1,
    "$10k-$50k": 4,
    "$50k+": 6,
  });

  if (revenueScore === null) {
    score -= 3;
    notes.push("Monthly revenue range was not provided.");
  } else {
    score += revenueScore;
  }

  const businessStage = profile.businessStage || profile.businessAge;

  if (isMissing(businessStage)) {
    score -= 3;
    notes.push("Business stage was not provided.");
  }

  if (hasAny(businessStage, ["idea", "less than 1 year"])) {
    score -= 3;
    notes.push("Newer businesses may still be building market trust and systems.");
  }

  if (hasAny(businessStage, ["1-3 years"])) {
    score += 1;
  }

  if (hasAny(businessStage, ["3-5 years", "over 5 years"])) {
    score += 3;
  }

  if (isMissing(profile.biggestChallenge)) {
    score -= 3;
    notes.push("Biggest growth challenge was not clearly provided.");
  }

  return {
    score: clamp(score, 0, 24),
    notes,
  };
};

export const calculateGrowthScoreDetails = (profile = {}) => {
  const categories = {
    website: scoreWebsite(profile),
    marketing: scoreMarketing(profile),
    sales: scoreSales(profile),
    operations: scoreOperations(profile),
    maturity: scoreBusinessMaturity(profile),
  };

  const rawScore = Object.values(categories).reduce(
    (sum, category) => sum + category.score,
    0
  );

  const requiredFields = [
    "businessType",
    "businessStage",
    "goal",
    "leadSource",
    "websiteStatus",
    "marketingChannels",
    "salesProcess",
    "automationNeed",
    "biggestChallenge",
    "monthlyCustomers",
    "monthlyRevenue",
    "teamSize",
  ];

  const completenessPenalty = requiredFields.filter((field) =>
    isMissing(profile[field])
  ).length;

  const finalScore = clamp(rawScore - completenessPenalty, 35, 96);

  const scoringNotes = Object.values(categories)
    .flatMap((category) => category.notes)
    .slice(0, 10);

  return {
    growthScore: Math.round(finalScore),
    growthPotential: getGrowthPotential(finalScore),
    scoreBreakdown: {
      website: categories.website.score,
      marketing: categories.marketing.score,
      sales: categories.sales.score,
      operations: categories.operations.score,
      maturity: categories.maturity.score,
      completenessPenalty,
    },
    scoringNotes,
  };
};

export const calculateGrowthScore = (profile = {}) =>
  calculateGrowthScoreDetails(profile).growthScore;

export const getGrowthPotential = (score) => {
  if (score >= 88) return "High";
  if (score >= 75) return "Medium-High";
  if (score >= 60) return "Medium";
  if (score >= 45) return "Needs Foundation";
  return "Critical Growth Gaps";
};

export const calculateBlueprintScore = calculateGrowthScore;