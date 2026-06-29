// server/services/businessIdentityService.js

const text = (value = "") => String(value || "").toLowerCase().trim();

const normalizeText = (value = "") =>
  text(value)
    .replace(/[^\w\s/+-]/g, " ")
    .replace(/\s+/g, " ");

const hasAny = (value = "", words = []) => {
  const clean = Array.isArray(value)
    ? value.map((item) => normalizeText(item)).join(" ")
    : normalizeText(value);

  return words.some((word) => clean.includes(normalizeText(word)));
};

const buildDescription = (profile = {}) =>
  normalizeText(`
    ${profile.businessName || ""}
    ${profile.businessDescription || ""}
    ${profile.businessType || ""}
    ${profile.industry || ""}
    ${profile.mainOffer || ""}
  `);

const INDUSTRY_RULES = [
  {
    industry: "Barbering / Grooming",
    businessType: "Barbering / Salon Business",
    mainOffer: "Haircuts, grooming, and beauty services",
    keywords: ["barber", "barbing", "haircut", "hair cut", "salon", "grooming", "braids", "makeup", "beauty", "spa", "lashes", "nails"],
  },
  {
    industry: "Cleaning Services",
    businessType: "Cleaning Business",
    mainOffer: "Residential and commercial cleaning services",
    keywords: ["cleaning", "cleaner", "janitorial", "maid", "housekeeping", "deep clean", "office cleaning", "commercial cleaning"],
  },
  {
    industry: "Food / Restaurant",
    businessType: "Food / Restaurant Business",
    mainOffer: "Food, catering, or restaurant services",
    keywords: ["restaurant", "food", "catering", "meal", "kitchen", "chef", "bakery", "baking", "snacks", "drinks", "bar", "grill"],
  },
  {
    industry: "Clothing / Fashion",
    businessType: "Clothing / Fashion Business",
    mainOffer: "Clothing and fashion products",
    keywords: ["clothing", "fashion", "wear", "boutique", "apparel", "outfit", "dress", "shoes", "jewelry", "accessories", "streetwear", "native wear", "tailor", "tailoring"],
  },
  {
    industry: "Digital Services",
    businessType: "Digital / Technology Service Business",
    mainOffer: "Digital services, websites, SEO, software, or automation solutions",
    keywords: ["website", "software", "app", "seo", "automation", "digital", "ai", "crm", "dashboard", "web design", "web development", "marketing automation", "saas"],
  },
  {
    industry: "Professional Services",
    businessType: "Consulting / Professional Service Business",
    mainOffer: "Consulting, coaching, training, or advisory services",
    keywords: ["consult", "consulting", "coach", "coaching", "training", "advisor", "advisory", "business analyst", "project management", "agency"],
  },
  {
    industry: "Health / Wellness",
    businessType: "Health / Wellness Service Business",
    mainOffer: "Health, wellness, fitness, or personal care services",
    keywords: ["health", "wellness", "fitness", "gym", "therapy", "therapist", "massage", "clinic", "care", "home care", "support worker", "nursing"],
  },
  {
    industry: "Real Estate / Property",
    businessType: "Real Estate / Property Business",
    mainOffer: "Real estate, property, rental, or housing services",
    keywords: ["real estate", "realtor", "property", "rental", "rentals", "landlord", "housing", "apartment", "mortgage", "short term rental", "airbnb"],
  },
  {
    industry: "Construction / Home Services",
    businessType: "Construction / Home Service Business",
    mainOffer: "Construction, renovation, repair, or home improvement services",
    keywords: ["construction", "contractor", "renovation", "repair", "plumbing", "electrician", "roofing", "painting", "flooring", "landscaping", "hvac"],
  },
  {
    industry: "Education / Training",
    businessType: "Education / Training Business",
    mainOffer: "Education, tutoring, courses, or training services",
    keywords: ["school", "education", "tutor", "tutoring", "course", "academy", "lesson", "teacher", "learning", "class", "workshop"],
  },
  {
    industry: "Events / Entertainment",
    businessType: "Events / Entertainment Business",
    mainOffer: "Event planning, entertainment, or celebration services",
    keywords: ["event", "events", "wedding", "party", "dj", "mc", "entertainment", "decor", "decoration", "planner", "photobooth"],
  },
  {
    industry: "Transportation / Delivery",
    businessType: "Transportation / Delivery Business",
    mainOffer: "Transportation, delivery, logistics, or courier services",
    keywords: ["delivery", "transport", "transportation", "logistics", "courier", "trucking", "dispatch", "moving", "movers"],
  },
  {
    industry: "Automotive Services",
    businessType: "Automotive Service Business",
    mainOffer: "Automotive repair, detailing, car wash, or vehicle services",
    keywords: ["auto", "automotive", "mechanic", "car wash", "detailing", "garage", "tire", "oil change", "vehicle repair"],
  },
  {
    industry: "Nonprofit / Community Services",
    businessType: "Nonprofit / Community Organization",
    mainOffer: "Community, nonprofit, charity, or social impact services",
    keywords: ["nonprofit", "non profit", "ngo", "charity", "community", "social service", "support program", "foundation"],
  },
  {
    industry: "Financial / Tax Services",
    businessType: "Financial / Tax Service Business",
    mainOffer: "Tax, accounting, bookkeeping, payroll, or financial services",
    keywords: ["tax", "accounting", "bookkeeping", "payroll", "finance", "financial", "accountant", "tax filing"],
  },
];

export const deriveBusinessIdentity = (profile = {}) => {
  const description = buildDescription(profile);

  const baseIdentity = {
    businessName: profile.businessName || null,
    businessDescription: profile.businessDescription || profile.businessType || null,
    industry: profile.industry || "General Business",
    businessType: profile.businessType || "General Business",
    mainOffer: profile.mainOffer || null,
  };

  const matchedRule = INDUSTRY_RULES.find((rule) =>
    hasAny(description, rule.keywords)
  );

  if (!matchedRule) {
    return {
      ...baseIdentity,
      businessType: profile.businessType || "General Business",
      mainOffer: profile.mainOffer || "Products or services offered by the business",
    };
  }

  return {
    ...baseIdentity,
    industry: matchedRule.industry,
    businessType:
      profile.businessType && profile.businessType !== "General Business"
        ? profile.businessType
        : matchedRule.businessType,
    mainOffer: profile.mainOffer || matchedRule.mainOffer,
  };
};

export const getBusinessDisplayName = (profile = {}) => {
  const identity = deriveBusinessIdentity(profile);

  return (
    identity.businessName ||
    identity.businessDescription ||
    identity.businessType ||
    identity.industry ||
    "This business"
  );
};

export const getIndustryRules = () => INDUSTRY_RULES;