// server/services/businessIdentityService.js

const text = (value = "") => String(value || "").toLowerCase().trim();

const normalizeText = (value = "") =>
  text(value)
    .replace(/[^\w\s/+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const hasAny = (value = "", words = []) => {
  const clean = Array.isArray(value)
    ? value.map((item) => normalizeText(item)).join(" ")
    : normalizeText(value);

  return words.some((word) => {
    const keyword = normalizeText(word);
    if (!keyword) return false;

    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|\\s)${escaped}(\\s|$)`, "i");

    return regex.test(clean);
  });
};

const buildDescription = (profile = {}) =>
  normalizeText(`
    ${profile.businessName || ""}
    ${profile.businessDescription || ""}
    ${profile.businessType || ""}
    ${profile.industry || ""}
    ${profile.mainOffer || ""}
    ${profile.websiteUrl || ""}
  `);

const isGeneral = (value = "") => {
  const clean = normalizeText(value);
  return !clean || clean === "general business" || clean === "unknown";
};

const INDUSTRY_RULES = [
  {
    industry: "Pharmacy / Retail Health",
    businessType: "Pharmacy / Retail Health Business",
    mainOffer:
      "Medications, prescriptions, health products, cosmetics, and beauty retail products",
    priority: 100,
    keywords: [
      "pharmacy",
      "drug mart",
      "drugstore",
      "drug store",
      "medication",
      "medications",
      "medicine",
      "prescription",
      "prescriptions",
      "pharmacist",
      "health products",
      "beauty products",
      "cosmetics",
      "vitamins",
      "shoppers drug mart",
    ],
  },
  {
    industry: "Barbering / Grooming",
    businessType: "Barbering / Salon Business",
    mainOffer: "Haircuts, grooming, and salon services",
    priority: 90,
    keywords: [
      "barber",
      "barbing",
      "haircut",
      "hair cut",
      "hair salon",
      "grooming",
      "braids",
      "beard trim",
    ],
  },
  {
    industry: "Beauty / Spa Services",
    businessType: "Beauty / Spa Business",
    mainOffer: "Beauty, spa, skincare, nails, lashes, and personal care services",
    priority: 88,
    keywords: [
      "makeup",
      "spa",
      "lashes",
      "nails",
      "skincare",
      "facial",
      "beauty salon",
    ],
  },
  {
    industry: "Cleaning Services",
    businessType: "Cleaning Business",
    mainOffer: "Residential and commercial cleaning services",
    priority: 80,
    keywords: [
      "cleaning",
      "cleaner",
      "janitorial",
      "maid",
      "housekeeping",
      "deep clean",
      "office cleaning",
      "commercial cleaning",
    ],
  },
  {
    industry: "Food / Restaurant",
    businessType: "Food / Restaurant Business",
    mainOffer: "Food, catering, or restaurant services",
    priority: 80,
    keywords: [
      "restaurant",
      "food",
      "catering",
      "meal",
      "kitchen",
      "chef",
      "bakery",
      "baking",
      "snacks",
      "drinks",
      "bar",
      "grill",
    ],
  },
  {
    industry: "Clothing / Fashion",
    businessType: "Clothing / Fashion Business",
    mainOffer: "Clothing and fashion products",
    priority: 80,
    keywords: [
      "clothing",
      "fashion",
      "wear",
      "boutique",
      "apparel",
      "outfit",
      "dress",
      "shoes",
      "jewelry",
      "accessories",
      "streetwear",
      "native wear",
      "tailor",
      "tailoring",
    ],
  },
  {
    industry: "Digital Services",
    businessType: "Digital / Technology Service Business",
    mainOffer: "Digital services, websites, SEO, software, or automation solutions",
    priority: 80,
    keywords: [
      "website",
      "software",
      "app",
      "seo",
      "automation",
      "digital",
      "ai",
      "crm",
      "dashboard",
      "web design",
      "web development",
      "marketing automation",
      "saas",
    ],
  },
  {
    industry: "Professional Services",
    businessType: "Consulting / Professional Service Business",
    mainOffer: "Consulting, coaching, training, or advisory services",
    priority: 80,
    keywords: [
      "consult",
      "consulting",
      "coach",
      "coaching",
      "training",
      "advisor",
      "advisory",
      "business analyst",
      "project management",
      "agency",
    ],
  },
  {
    industry: "Health / Wellness",
    businessType: "Health / Wellness Service Business",
    mainOffer: "Health, wellness, fitness, or personal care services",
    priority: 75,
    keywords: [
      "health",
      "wellness",
      "fitness",
      "gym",
      "therapy",
      "therapist",
      "massage",
      "clinic",
      "care",
      "home care",
      "support worker",
      "nursing",
    ],
  },
  {
    industry: "Real Estate / Property",
    businessType: "Real Estate / Property Business",
    mainOffer: "Real estate, property, rental, or housing services",
    priority: 80,
    keywords: [
      "real estate",
      "realtor",
      "property",
      "rental",
      "rentals",
      "landlord",
      "housing",
      "apartment",
      "mortgage",
      "short term rental",
      "airbnb",
    ],
  },
  {
    industry: "Construction / Home Services",
    businessType: "Construction / Home Service Business",
    mainOffer: "Construction, renovation, repair, or home improvement services",
    priority: 80,
    keywords: [
      "construction",
      "contractor",
      "renovation",
      "repair",
      "plumbing",
      "electrician",
      "roofing",
      "painting",
      "flooring",
      "landscaping",
      "hvac",
    ],
  },
  {
    industry: "Education / Training",
    businessType: "Education / Training Business",
    mainOffer: "Education, tutoring, courses, or training services",
    priority: 80,
    keywords: [
      "school",
      "education",
      "tutor",
      "tutoring",
      "course",
      "academy",
      "lesson",
      "teacher",
      "learning",
      "class",
      "workshop",
    ],
  },
  {
    industry: "Events / Entertainment",
    businessType: "Events / Entertainment Business",
    mainOffer: "Event planning, entertainment, or celebration services",
    priority: 80,
    keywords: [
      "event",
      "events",
      "wedding",
      "party",
      "dj",
      "mc",
      "entertainment",
      "decor",
      "decoration",
      "planner",
      "photobooth",
    ],
  },
  {
    industry: "Transportation / Delivery",
    businessType: "Transportation / Delivery Business",
    mainOffer: "Transportation, delivery, logistics, or courier services",
    priority: 80,
    keywords: [
      "delivery",
      "transport",
      "transportation",
      "logistics",
      "courier",
      "trucking",
      "dispatch",
      "moving",
      "movers",
    ],
  },
  {
    industry: "Automotive Services",
    businessType: "Automotive Service Business",
    mainOffer: "Automotive repair, detailing, car wash, or vehicle services",
    priority: 80,
    keywords: [
      "auto",
      "automotive",
      "mechanic",
      "car wash",
      "detailing",
      "garage",
      "tire",
      "oil change",
      "vehicle repair",
    ],
  },
  {
    industry: "Nonprofit / Community Services",
    businessType: "Nonprofit / Community Organization",
    mainOffer: "Community, nonprofit, charity, or social impact services",
    priority: 80,
    keywords: [
      "nonprofit",
      "non profit",
      "ngo",
      "charity",
      "community",
      "social service",
      "support program",
      "foundation",
    ],
  },
  {
    industry: "Financial / Tax Services",
    businessType: "Financial / Tax Service Business",
    mainOffer: "Tax, accounting, bookkeeping, payroll, or financial services",
    priority: 80,
    keywords: [
      "tax",
      "accounting",
      "bookkeeping",
      "payroll",
      "finance",
      "financial",
      "accountant",
      "tax filing",
    ],
  },
];

const findBestIndustryRule = (description = "") => {
  const matches = INDUSTRY_RULES.map((rule) => {
    const score = rule.keywords.reduce((total, keyword) => {
      return hasAny(description, [keyword]) ? total + 1 : total;
    }, 0);

    return {
      rule,
      score,
      weightedScore: score * (rule.priority || 1),
    };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.weightedScore - a.weightedScore);

  return matches[0]?.rule || null;
};

export const deriveBusinessIdentity = (profile = {}) => {
  const safeProfile =
    profile && typeof profile === "object" && !Array.isArray(profile)
      ? profile
      : {};

  const description = buildDescription(safeProfile);
  const matchedRule = findBestIndustryRule(description);

  const businessName = safeProfile.businessName || null;
  const existingIndustry = safeProfile.industry || null;
  const existingBusinessType = safeProfile.businessType || null;
  const existingMainOffer = safeProfile.mainOffer || null;

  if (!matchedRule) {
    return {
      businessName,
      businessDescription:
        safeProfile.businessDescription || existingBusinessType || null,
      industry: existingIndustry || "General Business",
      businessType: existingBusinessType || "General Business",
      mainOffer:
        existingMainOffer || "Products or services offered by the business",
    };
  }

  return {
    businessName,
    businessDescription:
      safeProfile.businessDescription || matchedRule.businessType,
    industry:
      isGeneral(existingIndustry) || hasAny(existingIndustry, ["barbering"]) 
        ? matchedRule.industry
        : existingIndustry,
    businessType:
      isGeneral(existingBusinessType) || hasAny(existingBusinessType, ["barbing", "barbering"])
        ? matchedRule.businessType
        : existingBusinessType,
    mainOffer: existingMainOffer || matchedRule.mainOffer,
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

export const getIndustryRules = () => [...INDUSTRY_RULES];