// server/services/businessProfileSchema.js

export const BUSINESS_PROFILE_FIELDS = [
  "businessName",
  "businessDescription",
  "industry",
  "businessType",
  "mainOffer",

  "goal",
  "biggestChallenge",

  "targetCustomers",
  "serviceLocation",

  "leadSource",
  "marketingChannels",

  "websiteStatus",
  "websiteUrl",
  "websiteGoal",
  "websiteAudit",

  "salesProcess",

  "automationNeed",
  "techComfort",

  "businessStage",
  "businessAge",
  "monthlyCustomers",
  "monthlyRevenue",
  "teamSize",

  "competitors",
  "businessModel",
  "pricingModel",
  "uniqueSellingPoint",

  "googleBusinessProfile",
  "marketIntelligence",
];

export const EMPTY_BUSINESS_PROFILE = BUSINESS_PROFILE_FIELDS.reduce(
  (profile, field) => {
    profile[field] = null;
    return profile;
  },
  {}
);

export const REQUIRED_BLUEPRINT_FIELDS = [
  "businessName",
  "businessType",
  "serviceLocation",
  "goal",
  "leadSource",
  "websiteStatus",
  "marketingChannels",
  "salesProcess",
  "targetCustomers",
  "mainOffer",
  "automationNeed",
  "biggestChallenge",
  "monthlyCustomers",
  "monthlyRevenue",
  "teamSize",
  "businessStage",
];

export const WEBSITE_EXTRA_FIELDS = ["websiteUrl", "websiteGoal"];

export const GOOGLE_BUSINESS_FIELDS = [
  "businessName",
  "businessType",
  "serviceLocation",
];
