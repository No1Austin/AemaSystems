const normalize = (value = "") =>
  String(value || "").toLowerCase().trim();

const hasAny = (text = "", keywords = []) => {
  const cleanText = normalize(text);
  return keywords.some((word) => cleanText.includes(word));
};

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;

  const match = String(value).match(/\d+/);
  return match ? Number(match[0]) : null;
};

const isMissing = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  return false;
};

const clamp = (value, min = 35, max = 96) => {
  return Math.max(min, Math.min(value, max));
};

const scoreWebsite = (profile) => {
  let score = 20;
  const notes = [];

  const websiteStatus = normalize(profile.websiteStatus);
  const websiteUrl = profile.websiteUrl;

  if (websiteStatus.includes("no website")) {
    score -= 14;
    notes.push("No business website reduces trust, search visibility, and lead capture.");
  } else if (websiteStatus.includes("has website")) {
    if (!websiteUrl) {
      score -= 6;
      notes.push("Website exists but no URL was provided for review.");
    }

    if (
      profile.goal === "Improve Website" ||
      profile.goal === "Improve SEO" ||
      hasAny(profile.businessType, ["audit", "seo", "website"])
    ) {
      score -= 4;
      notes.push("The business already knows the website or SEO needs improvement.");
    }

    if (hasAny(profile.websiteGoal, ["buy", "book", "call", "quote", "contact"])) {
      score += 2;
    } else if (isMissing(profile.websiteGoal)) {
      score -= 3;
      notes.push("Website goal is unclear.");
    }
  } else {
    score -= 8;
    notes.push("Website status is unclear.");
  }

  return {
    score: clamp(score, 0, 22),
    notes,
  };
};

const scoreMarketing = (profile) => {
  let score = 20;
  const notes = [];

  const leadSource = normalize(profile.leadSource);
  const marketingChannels = normalize(profile.marketingChannels);

  if (isMissing(profile.leadSource)) {
    score -= 8;
    notes.push("Main customer source is not clear.");
  }

  if (leadSource.includes("social media")) {
    score -= 4;
    notes.push("Social media can generate attention, but conversion may be inconsistent without a funnel.");
  }

  if (leadSource.includes("referral")) {
    score -= 3;
    notes.push("Referral-based growth is valuable but can limit predictable scaling.");
  }

  if (leadSource.includes("google")) {
    score += 2;
  }

  if (leadSource.includes("paid ads")) {
    score += 1;
  }

  if (isMissing(profile.marketingChannels)) {
    score -= 5;
    notes.push("Marketing channels were not clearly defined.");
  } else {
    const channelCount = [
      "instagram",
      "facebook",
      "tiktok",
      "google",
      "seo",
      "email",
      "whatsapp",
      "linkedin",
      "youtube",
      "flyer",
      "referral",
      "ads",
    ].filter((channel) => marketingChannels.includes(channel)).length;

    if (channelCount >= 3) {
      score += 3;
    } else if (channelCount === 1) {
      score -= 2;
      notes.push("Business may be relying on only one main marketing channel.");
    }
  }

  return {
    score: clamp(score, 0, 23),
    notes,
  };
};

const scoreSales = (profile) => {
  let score = 20;
  const notes = [];

  const salesProcess = normalize(profile.salesProcess);
  const biggestChallenge = normalize(profile.biggestChallenge);

  if (isMissing(profile.salesProcess)) {
    score -= 7;
    notes.push("Sales process is not clearly defined.");
  }

  if (
    hasAny(salesProcess, [
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
    hasAny(salesProcess, [
      "website checkout",
      "checkout",
      "booking form",
      "crm",
      "invoice",
      "calendar",
      "online booking",
    ])
  ) {
    score += 3;
  }

  if (
    hasAny(biggestChallenge, [
      "not buying",
      "dont buy",
      "don't buy",
      "no sales",
      "low sales",
      "conversion",
      "customers",
      "leads",
      "traffic",
    ])
  ) {
    score -= 6;
    notes.push("Main challenge suggests a conversion or customer acquisition issue.");
  }

  if (isMissing(profile.mainOffer)) {
    score -= 3;
    notes.push("Main product or service offer is not clearly defined.");
  }

  if (isMissing(profile.targetCustomers)) {
    score -= 3;
    notes.push("Target customers are not clearly defined.");
  }

  return {
    score: clamp(score, 0, 23),
    notes,
  };
};

const scoreOperations = (profile) => {
  let score = 20;
  const notes = [];

  const automationNeed = normalize(profile.automationNeed);

  if (isMissing(profile.automationNeed)) {
    score -= 5;
    notes.push("Manual operational bottlenecks were not clearly identified.");
  }

  if (
    hasAny(automationNeed, [
      "manual",
      "booking",
      "bookings",
      "follow",
      "follow-up",
      "message",
      "messages",
      "email",
      "emails",
      "payment",
      "payments",
      "report",
      "reports",
      "lead",
      "lead management",
      "customer messages",
    ])
  ) {
    score -= 7;
    notes.push("Business has clear automation opportunities.");
  }

  if (
    hasAny(automationNeed, [
      "automated",
      "crm",
      "system",
      "dashboard",
      "software",
      "booking form",
    ])
  ) {
    score += 3;
  }

  const teamSize = toNumber(profile.teamSize);

  if (teamSize === null) {
    score -= 3;
    notes.push("Team size was not provided.");
  } else if (teamSize <= 1) {
    score -= 4;
    notes.push("Small team size may limit capacity without strong systems.");
  } else if (teamSize >= 5) {
    score += 2;
  }

  return {
    score: clamp(score, 0, 23),
    notes,
  };
};

const scoreBusinessMaturity = (profile) => {
  let score = 20;
  const notes = [];

  const customers = toNumber(profile.monthlyCustomers);
  const businessAge = normalize(profile.businessAge);

  if (customers === null) {
    score -= 5;
    notes.push("Monthly customer volume was not provided.");
  } else if (customers < 10) {
    score -= 8;
    notes.push("Very low monthly customer volume indicates early-stage growth needs.");
  } else if (customers < 25) {
    score -= 5;
    notes.push("Customer volume is still developing.");
  } else if (customers >= 100) {
    score += 4;
  } else if (customers >= 50) {
    score += 2;
  }

  if (isMissing(profile.businessAge)) {
    score -= 4;
    notes.push("Business age was not provided.");
  } else if (businessAge.includes("month")) {
    score -= 4;
    notes.push("New business may still be building market trust and systems.");
  } else if (
    hasAny(businessAge, ["3 year", "4 year", "5 year", "6 year", "7 year", "8 year", "9 year", "10 year"])
  ) {
    score += 3;
  }

  if (isMissing(profile.biggestChallenge)) {
    score -= 4;
    notes.push("Biggest growth challenge was not clearly provided.");
  }

  return {
    score: clamp(score, 0, 23),
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

  const rawScore =
    categories.website.score +
    categories.marketing.score +
    categories.sales.score +
    categories.operations.score +
    categories.maturity.score;

  const completenessPenalty = [
    "businessType",
  "goal",
  "leadSource",
  "serviceLocation",
  "websiteStatus",
  "marketingChannels",
  "salesProcess",
  "targetCustomers",
  "mainOffer",
  "automationNeed",
  "biggestChallenge",
  "monthlyCustomers",
  "teamSize",
  "businessAge",
    
  ].filter((field) => isMissing(profile[field])).length;

  const finalScore = clamp(rawScore - completenessPenalty, 35, 96);

  const scoringNotes = Object.values(categories)
    .flatMap((category) => category.notes)
    .slice(0, 8);

  return {
    growthScore: finalScore,
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

export const calculateGrowthScore = (profile = {}) => {
  return calculateGrowthScoreDetails(profile).growthScore;
};

export const getGrowthPotential = (score) => {
  if (score >= 88) return "High";
  if (score >= 75) return "Medium-High";
  if (score >= 60) return "Medium";
  if (score >= 45) return "Needs Foundation";
  return "Critical Growth Gaps";
};

export const calculateBlueprintScore = calculateGrowthScore;