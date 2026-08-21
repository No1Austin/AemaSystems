// server/services/profileStateEngine.js

import {
  detectExpectedFieldFromAssistant,
} from "./conversation/questionDetector.js";

import {
  buildConversationTurn,
} from "./conversationCoach.js";

import {
  EMPTY_BUSINESS_PROFILE,
  REQUIRED_BLUEPRINT_FIELDS,
} from "./businessProfileSchema.js";


import {
  extractSemanticBusinessFacts,
} from "./semanticProfileExtractor.js";
/**
 * ============================================================
 * AEMA PROFILE STATE ENGINE
 * ============================================================
 *
 * Responsibilities:
 *
 * 1. Rebuild business profile from conversation history.
 * 2. Prefer explicit expectedField metadata.
 * 3. Fall back to questionDetector only when metadata is absent.
 * 4. Accept unexpected/free-text answers.
 * 5. Prevent accidental field corruption.
 * 6. Track which fields were asked.
 * 7. Prevent infinite question loops.
 * 8. Preserve raw user answers.
 * 9. Detect useful information globally when safe.
 * 10. Return structured next-turn metadata.
 *
 * IMPORTANT:
 *
 * questionDetector is now a FALLBACK.
 *
 * Preferred:
 *
 * assistant.metadata.expectedField
 *
 * Fallback:
 *
 * detectExpectedFieldFromAssistant(...)
 */

// ============================================================
// CONFIGURATION
// ============================================================

const MAX_FIELD_ATTEMPTS = 2;

const VALID_PROFILE_FIELDS = new Set([
  ...Object.keys(EMPTY_BUSINESS_PROFILE),
  ...REQUIRED_BLUEPRINT_FIELDS,

  // Conditional / compatibility fields
  "websiteUrl",
  "websiteGoal",
  "businessAge",
]);

// ============================================================
// BASIC HELPERS
// ============================================================

const normalize = (value = "") =>
  String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const hasAny = (
  value = "",
  words = []
) => {
  const clean = normalize(value);

  return words.some((word) =>
    clean.includes(
      normalize(word)
    )
  );
};

const isEmpty = (value) =>
  value === null ||
  value === undefined ||
  value === "" ||
  (
    Array.isArray(value) &&
    value.length === 0
  );

const hasValue = (value) =>
  !isEmpty(value);

const safeString = (value = "") =>
  String(value ?? "").trim();

const titleCase = (value = "") => {
  const clean =
    safeString(value);

  if (!clean) {
    return null;
  }

  return clean
    .split(/\s+/)
    .map((word) => {
      if (word.length <= 2) {
        return word;
      }

      return (
        word.charAt(0).toUpperCase() +
        word.slice(1)
      );
    })
    .join(" ");
};

// ============================================================
// USER ANSWER CLASSIFICATION
// ============================================================

const NON_ANSWER_VALUES = new Set([
  "",
  "?",
  "??",
  "...",
]);

const DEFERRED_ANSWER_VALUES = new Set([
  "i don't know",
  "i dont know",
  "don't know",
  "dont know",
  "not sure",
  "unsure",
  "skip",
  "skip this",
  "skip it",
  "prefer not to say",
  "rather not say",
]);

const NOT_APPLICABLE_VALUES = new Set([
  "n/a",
  "na",
  "not applicable",
  "does not apply",
  "doesn't apply",
  "doesnt apply",
]);

const isUsableAnswer = (
  value = ""
) => {
  const clean =
    normalize(value);

  if (!clean) {
    return false;
  }

  if (
    NON_ANSWER_VALUES.has(clean)
  ) {
    return false;
  }

  return true;
};

const classifySpecialAnswer = (
  value = ""
) => {
  const clean =
    normalize(value);

  if (
    DEFERRED_ANSWER_VALUES.has(clean)
  ) {
    return "deferred";
  }

  if (
    NOT_APPLICABLE_VALUES.has(clean)
  ) {
    return "not_applicable";
  }

  return null;
};

// ============================================================
// BUSINESS NAME
// ============================================================

const cleanBusinessName = (
  value = ""
) => {
  const clean =
    safeString(value)
      .replace(/[?.!,;:]+$/g, "")
      .replace(/\s+/g, " ")
      .trim();

  if (!clean) {
    return null;
  }

  const lower =
    normalize(clean);

  const badValues = [
    "yes",
    "no",
    "none",
    "not yet",
    "i don't know",
    "i dont know",
    "not applicable",
    "i need more customers",
    "i need more customers for my business",
    "get more customers",
    "more customers",
  ];

  if (
    badValues.includes(lower)
  ) {
    return null;
  }

  if (
    lower.includes(
      "need more customers"
    )
  ) {
    return null;
  }

  if (
    lower.length < 2 ||
    lower.length > 100
  ) {
    return null;
  }

  return titleCase(clean);
};

const detectBusinessName = (
  rawText = ""
) => {
  const value =
    safeString(rawText);

  if (!value) {
    return null;
  }

  const patterns = [
    /(?:business|company|brand|organization)\s+(?:name\s+is|is\s+called|is\s+named|called)\s+([a-zA-Z0-9&.'’\- ]{2,100})/i,

    /(?:my|our)\s+(?:business|company|brand|organization)\s+(?:is\s+called|is\s+named|is)\s+([a-zA-Z0-9&.'’\- ]{2,100})/i,

    /(?:it\s+is\s+called|it's\s+called|called)\s+([a-zA-Z0-9&.'’\- ]{2,100})/i,

    /(?:i\s+run|i\s+own|we\s+run|we\s+own)\s+([a-zA-Z0-9&.'’\- ]{2,100})/i,
  ];

  for (const pattern of patterns) {
    const match =
      value.match(pattern);

    if (match?.[1]) {
      const name =
        match[1]
          .replace(
            /\b(it is|and|that|where|which|because)\b.*$/i,
            ""
          )
          .trim();

      const cleaned =
        cleanBusinessName(name);

      if (cleaned) {
        return cleaned;
      }
    }
  }

  return null;
};

// ============================================================
// WEBSITE URL
// ============================================================

const extractWebsiteUrl = (
  value = ""
) => {
  const match =
    safeString(value).match(
      /(https?:\/\/[^\s]+|www\.[^\s]+|[a-z0-9-]+\.(com|ca|net|org|co|io|app|dev|ai|site|online|store|biz|info|inc)(?:\/[^\s]*)?)/i
    );

  if (!match) {
    return null;
  }

  const url =
    match[0].replace(
      /[.,;!?]+$/,
      ""
    );

  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  return `https://${url}`;
};

// ============================================================
// NUMBER EXTRACTION
// ============================================================

const extractNumber = (
  value = ""
) => {
  const match =
    safeString(value).match(
      /\d[\d,]*/
    );

  if (!match) {
    return null;
  }

  const number =
    Number(
      match[0].replace(/,/g, "")
    );

  return Number.isFinite(number)
    ? number
    : null;
};

// ============================================================
// BUSINESS TYPE
// ============================================================

const detectBusinessType = (
  value = ""
) => {
  if (
    hasAny(value, [
      "childcare",
      "daycare",
      "child care",
      "elder care",
      "senior care",
      "care service",
    ])
  ) {
    return "Childcare / Care Service Business";
  }

  if (
    hasAny(value, [
      "clothing",
      "fashion",
      "boutique",
      "apparel",
      "wear",
      "tailor",
      "tailoring",
    ])
  ) {
    return "Clothing / Fashion Business";
  }

  if (
    hasAny(value, [
      "cleaning",
      "cleaner",
      "janitorial",
      "maid",
      "housekeeping",
    ])
  ) {
    return "Cleaning Business";
  }

  if (
    hasAny(value, [
      "restaurant",
      "food",
      "catering",
      "bakery",
      "kitchen",
      "chef",
    ])
  ) {
    return "Food / Restaurant Business";
  }

  if (
    hasAny(value, [
      "barber",
      "barbing",
      "salon",
      "haircut",
      "hair salon",
      "beauty",
      "spa",
      "lashes",
      "nails",
    ])
  ) {
    return "Barbering / Salon Business";
  }

  if (
    hasAny(value, [
      "real estate",
      "realtor",
      "property",
      "rental",
      "airbnb",
    ])
  ) {
    return "Real Estate / Property Business";
  }

  if (
    hasAny(value, [
      "software",
      "app",
      "seo",
      "automation",
      "digital",
      "ai",
      "saas",
      "dashboard",
      "tech",
      "technology",
    ])
  ) {
    return "Digital / Technology Service Business";
  }

  if (
    hasAny(value, [
      "consulting",
      "consultant",
      "coach",
      "training",
      "advisor",
      "agency",
    ])
  ) {
    return "Consulting / Professional Service Business";
  }

  if (
    hasAny(value, [
      "health",
      "clinic",
      "home care",
      "therapy",
      "wellness",
      "fitness",
      "gym",
    ])
  ) {
    return "Health / Wellness Business";
  }

  if (
    hasAny(value, [
      "construction",
      "contractor",
      "renovation",
      "plumbing",
      "painting",
      "roofing",
      "landscaping",
    ])
  ) {
    return "Construction / Home Service Business";
  }

  if (
    hasAny(value, [
      "school",
      "education",
      "tutor",
      "course",
      "academy",
      "lesson",
    ])
  ) {
    return "Education / Training Business";
  }

  if (
    hasAny(value, [
      "event",
      "wedding",
      "dj",
      "entertainment",
      "decor",
      "photography",
    ])
  ) {
    return "Events / Entertainment Business";
  }

  if (
    hasAny(value, [
      "logistics",
      "delivery",
      "courier",
      "transport",
      "moving",
    ])
  ) {
    return "Transportation / Delivery Business";
  }

  if (
    hasAny(value, [
      "nonprofit",
      "non profit",
      "ngo",
      "charity",
      "community",
      "social service",
    ])
  ) {
    return "Nonprofit / Community Service";
  }

  /**
   * Additional broad real-world categories.
   * Raw free text remains the fallback, so this list
   * does NOT need to know every business on Earth.
   */

  if (
    hasAny(value, [
      "car repair",
      "auto repair",
      "automotive repair",
      "mechanic",
      "garage",
      "vehicle repair",
      "auto shop",
      "body shop",
    ])
  ) {
    return "Automotive Service Business";
  }

  if (
    hasAny(value, [
      "accounting",
      "accountant",
      "bookkeeping",
      "tax preparation",
    ])
  ) {
    return "Accounting / Financial Service Business";
  }

  if (
    hasAny(value, [
      "law firm",
      "lawyer",
      "legal service",
      "attorney",
      "paralegal",
    ])
  ) {
    return "Legal / Professional Service Business";
  }

  if (
    hasAny(value, [
      "retail",
      "store",
      "shop",
      "ecommerce",
      "e-commerce",
    ])
  ) {
    return "Retail / E-commerce Business";
  }

  return null;
};

// ============================================================
// GOAL
// ============================================================

const detectGoal = (
  value = ""
) => {
  if (
    hasAny(value, [
      "more customers",
      "more clients",
      "get customers",
      "get clients",
      "leads",
      "buyers",
      "traffic",
      "grow my customer",
    ])
  ) {
    return "Get More Customers";
  }

  if (
    hasAny(value, [
      "sales",
      "sell",
      "revenue",
      "income",
      "profit",
      "consistent buyers",
      "more orders",
    ])
  ) {
    return "Increase Sales";
  }

  if (
    hasAny(value, [
      "seo",
      "google ranking",
      "rank on google",
    ])
  ) {
    return "Improve SEO";
  }

  if (
    hasAny(value, [
      "website",
      "site",
      "redesign",
    ])
  ) {
    return "Improve Website";
  }

  if (
    hasAny(value, [
      "automation",
      "automate",
      "manual time",
      "save time",
    ])
  ) {
    return "Automate Business";
  }

  if (
    hasAny(value, [
      "systems",
      "operations",
      "workflow",
      "process",
    ])
  ) {
    return "Improve Business Systems";
  }

  if (
    hasAny(value, [
      "marketing",
      "advertising",
      "promotion",
    ])
  ) {
    return "Improve Marketing";
  }

  if (
    hasAny(value, [
      "brand",
      "branding",
    ])
  ) {
    return "Improve Branding";
  }

  if (
    hasAny(value, [
      "grow",
      "scale",
      "expand",
    ])
  ) {
    return "Grow the Business";
  }

  return null;
};

// ============================================================
// LEAD SOURCE
// ============================================================

const detectLeadSource = (
  value = ""
) => {
  if (
    hasAny(value, [
      "google ads",
      "facebook ads",
      "instagram ads",
      "paid ads",
    ])
  ) {
    return "Paid Ads";
  }

  if (
    hasAny(value, [
      "agencies",
      "agency referral",
      "referral agency",
    ])
  ) {
    return "Agencies";
  }

  if (
    hasAny(value, [
      "referral",
      "referrals",
      "word of mouth",
      "recommendation",
    ])
  ) {
    return "Referrals";
  }

  if (
    hasAny(value, [
      "instagram",
      "facebook",
      "tiktok",
      "linkedin",
      "social media",
    ])
  ) {
    return "Social Media";
  }

  if (
    hasAny(value, [
      "walk-in",
      "walk ins",
      "walkins",
      "walk in",
    ])
  ) {
    return "Walk-ins";
  }

  if (
    hasAny(value, [
      "google search",
      "google",
    ])
  ) {
    return "Google";
  }

  if (
    hasAny(value, [
      "website",
    ])
  ) {
    return "Website";
  }

  if (
    hasAny(value, [
      "whatsapp",
    ])
  ) {
    return "WhatsApp";
  }

  if (
    hasAny(value, [
      "none",
      "not getting customers",
      "no customers",
    ])
  ) {
    return "No Clear Lead Source";
  }

  return null;
};

// ============================================================
// WEBSITE STATUS
// ============================================================

const detectWebsiteStatus = (
  value = ""
) => {
  const url =
    extractWebsiteUrl(value);

  if (url) {
    return "Has Website";
  }

  if (
    hasAny(value, [
      "i have a website",
      "we have a website",
      "has website",
      "yes website",
      "yes i do",
      "yes we do",
    ])
  ) {
    return "Has Website";
  }

  if (
    hasAny(value, [
      "no website",
      "don't have a website",
      "dont have a website",
      "do not have a website",
      "without a website",
      "not yet",
    ])
  ) {
    return "No Website";
  }

  return null;
};

// ============================================================
// MARKETING CHANNELS
// ============================================================

const detectMarketingChannels = (
  value = ""
) => {
  const channels = [];

  if (
    hasAny(value, ["instagram"])
  ) {
    channels.push("Instagram");
  }

  if (
    hasAny(value, ["facebook"])
  ) {
    channels.push("Facebook");
  }

  if (
    hasAny(value, ["tiktok"])
  ) {
    channels.push("TikTok");
  }

  if (
    hasAny(value, ["linkedin"])
  ) {
    channels.push("LinkedIn");
  }

  if (
    hasAny(value, ["google"])
  ) {
    channels.push("Google");
  }

  if (
    hasAny(value, ["email"])
  ) {
    channels.push("Email");
  }

  if (
    hasAny(value, ["whatsapp"])
  ) {
    channels.push("WhatsApp");
  }

  if (
    hasAny(value, ["agencies"])
  ) {
    channels.push("Agencies");
  }

  if (
    hasAny(value, [
      "referral",
      "referrals",
    ])
  ) {
    channels.push("Referrals");
  }

  if (
    hasAny(value, [
      "paid ads",
      "advertising",
    ])
  ) {
    channels.push("Paid Ads");
  }

  if (
    hasAny(value, [
      "flyer",
      "flyers",
    ])
  ) {
    channels.push("Flyers");
  }

  if (
    hasAny(value, [
      "none",
      "no marketing",
    ])
  ) {
    return ["None"];
  }

  return channels.length
    ? [...new Set(channels)]
    : null;
};

// ============================================================
// SALES PROCESS
// ============================================================

const detectSalesProcess = (
  value = ""
) => {
  if (
    hasAny(value, ["whatsapp"])
  ) {
    return "WhatsApp";
  }

  if (
    hasAny(value, [
      "dm",
      "direct message",
      "inbox",
    ])
  ) {
    return "DM / Inbox";
  }

  if (
    hasAny(value, [
      "phone",
      "call",
    ])
  ) {
    return "Phone Call";
  }

  if (
    hasAny(value, [
      "booking form",
      "booking link",
      "book online",
    ])
  ) {
    return "Booking Form";
  }

  if (
    hasAny(value, [
      "website checkout",
      "checkout",
      "online store",
    ])
  ) {
    return "Website Checkout";
  }

  if (
    hasAny(value, [
      "walk-in",
      "walk in",
    ])
  ) {
    return "Walk-in";
  }

  if (
    hasAny(value, ["invoice"])
  ) {
    return "Invoice";
  }

  if (
    hasAny(value, ["manual"])
  ) {
    return "Manual Follow-up";
  }

  if (
    hasAny(value, [
      "agency",
      "agencies",
    ])
  ) {
    return "Agency Referral";
  }

  return null;
};

// ============================================================
// AUTOMATION / TIME CONSUMPTION
// ============================================================

const detectAutomationNeed = (
  value = ""
) => {
  if (
    hasAny(value, [
      "booking",
      "bookings",
      "appointments",
      "scheduling",
    ])
  ) {
    return "Bookings";
  }

  if (
    hasAny(value, [
      "follow up",
      "follow-up",
      "followups",
      "reminder",
      "reminders",
    ])
  ) {
    return "Follow-ups";
  }

  if (
    hasAny(value, [
      "payment",
      "payments",
      "invoice",
      "invoicing",
    ])
  ) {
    return "Payments";
  }

  if (
    hasAny(value, [
      "email",
      "emails",
    ])
  ) {
    return "Emails";
  }

  if (
    hasAny(value, [
      "report",
      "reports",
      "reporting",
    ])
  ) {
    return "Reports";
  }

  if (
    hasAny(value, [
      "lead",
      "leads",
      "crm",
      "contacts",
      "customer management",
    ])
  ) {
    return "Lead Management";
  }

  if (
    hasAny(value, [
      "customer messages",
      "messages",
      "inquiries",
    ])
  ) {
    return "Customer Messages";
  }

  if (
    hasAny(value, [
      "task",
      "tasks",
      "to do",
    ])
  ) {
    return "Task Management";
  }

  if (
    hasAny(value, [
      "spreadsheet",
      "excel",
      "workflow",
    ])
  ) {
    return "Workflow Automation";
  }

  /**
   * Real-world operational work.
   */

  if (
    hasAny(value, [
      "repairing cars",
      "repair cars",
      "fixing cars",
      "fix cars",
      "vehicle repairs",
      "mechanical work",
    ])
  ) {
    return "Core Service Delivery";
  }

  return null;
};

// ============================================================
// MONTHLY CUSTOMERS
// ============================================================

const detectMonthlyCustomers = (
  value = ""
) => {
  if (
    hasAny(value, [
      "under 20",
      "less than 20",
      "below 20",
    ])
  ) {
    return "Under 20";
  }

  if (
    hasAny(value, [
      "20-100",
      "20 to 100",
      "between 20 and 100",
    ])
  ) {
    return "20-100";
  }

  if (
    hasAny(value, [
      "100-500",
      "100 to 500",
      "between 100 and 500",
    ])
  ) {
    return "100-500";
  }

  if (
    hasAny(value, [
      "500+",
      "over 500",
      "more than 500",
    ])
  ) {
    return "500+";
  }

  const number =
    extractNumber(value);

  if (number === null) {
    return null;
  }

  if (number < 20) {
    return "Under 20";
  }

  if (number <= 100) {
    return "20-100";
  }

  if (number <= 500) {
    return "100-500";
  }

  return "500+";
};

// ============================================================
// MONTHLY REVENUE
// ============================================================

const detectMonthlyRevenue = (
  value = ""
) => {
  if (
    hasAny(value, [
      "under $2k",
      "under 2k",
      "less than 2000",
      "below 2000",
    ])
  ) {
    return "Under $2k";
  }

  if (
    hasAny(value, [
      "$2k-$10k",
      "2k-10k",
      "2k to 10k",
      "2000 to 10000",
    ])
  ) {
    return "$2k-$10k";
  }

  if (
    hasAny(value, [
      "$10k-$50k",
      "10k-50k",
      "10k to 50k",
      "10000 to 50000",
    ])
  ) {
    return "$10k-$50k";
  }

  if (
    hasAny(value, [
      "$50k+",
      "over 50k",
      "above 50k",
      "more than 50000",
    ])
  ) {
    return "$50k+";
  }

  return null;
};

// ============================================================
// TEAM SIZE
// ============================================================

const detectTeamSize = (
  value = ""
) => {
  if (
    hasAny(value, [
      "just me",
      "only me",
      "solo",
      "myself",
    ])
  ) {
    return "Just me";
  }

  const number =
    extractNumber(value);

  if (
    number !== null &&
    hasAny(value, [
      "people",
      "staff",
      "employee",
      "employees",
      "team",
      "workers",
    ])
  ) {
    if (number <= 1) {
      return "Just me";
    }

    if (number <= 5) {
      return "2-5";
    }

    if (number <= 20) {
      return "6-20";
    }

    return "20+";
  }

  if (
    hasAny(value, [
      "2-5",
      "2 to 5",
      "two to five",
    ])
  ) {
    return "2-5";
  }

  if (
    hasAny(value, [
      "6-20",
      "6 to 20",
      "six to twenty",
    ])
  ) {
    return "6-20";
  }

  if (
    hasAny(value, [
      "20+",
      "over 20",
      "more than 20",
    ])
  ) {
    return "20+";
  }

  return null;
};

// ============================================================
// BUSINESS STAGE
// ============================================================

const detectBusinessStage = (
  value = ""
) => {
  if (
    hasAny(value, [
      "idea stage",
      "just an idea",
      "not started",
      "pre-launch",
      "pre launch",
    ])
  ) {
    return "Idea Stage";
  }

  if (
    hasAny(value, [
      "less than 1 year",
      "under 1 year",
      "few months",
      "new business",
    ])
  ) {
    return "Less than 1 year";
  }

  const monthMatch =
    safeString(value).match(
      /\b(\d+)\s*months?\b/i
    );

  if (monthMatch) {
    const months =
      Number(monthMatch[1]);

    if (
      Number.isFinite(months) &&
      months < 12
    ) {
      return "Less than 1 year";
    }
  }

  const yearMatch =
    safeString(value).match(
      /\b(\d+)\s*years?\b/i
    );

  if (yearMatch) {
    const years =
      Number(yearMatch[1]);

    if (
      Number.isFinite(years)
    ) {
      if (years < 1) {
        return "Less than 1 year";
      }

      if (years <= 3) {
        return "1-3 years";
      }

      if (years <= 5) {
        return "3-5 years";
      }

      return "Over 5 years";
    }
  }

  if (
    hasAny(value, [
      "1-3 years",
      "1 to 3 years",
      "one year",
    ])
  ) {
    return "1-3 years";
  }

  if (
    hasAny(value, [
      "3-5 years",
      "3 to 5 years",
    ])
  ) {
    return "3-5 years";
  }

  if (
    hasAny(value, [
      "over 5 years",
      "more than 5 years",
      "5+ years",
    ])
  ) {
    return "Over 5 years";
  }

  return null;
};

// ============================================================
// WEBSITE GOAL
// ============================================================

const detectWebsiteGoal = (
  value = ""
) => {
  if (
    hasAny(value, [
      "request a quote",
      "get a quote",
      "quote",
      "estimate",
    ])
  ) {
    return "Request a Quote";
  }

  if (
    hasAny(value, [
      "book",
      "booking",
      "appointment",
    ])
  ) {
    return "Book";
  }

  if (
    hasAny(value, [
      "buy",
      "purchase",
      "shop",
      "checkout",
    ])
  ) {
    return "Buy";
  }

  if (
    hasAny(value, [
      "call",
      "phone",
    ])
  ) {
    return "Call";
  }

  if (
    hasAny(value, [
      "contact",
      "message",
      "inquiry",
    ])
  ) {
    return "Contact";
  }

  if (
    hasAny(value, [
      "subscribe",
      "join",
      "mailing list",
      "newsletter",
    ])
  ) {
    return "Join List";
  }

  return null;
};

// ============================================================
// LOCATION
// ============================================================

const detectLocation = (
  rawText = ""
) => {
  const value =
    safeString(rawText);

  if (!value) {
    return null;
  }

  if (
    hasAny(value, [
      "online worldwide",
      "worldwide",
      "global",
      "internationally",
    ])
  ) {
    return "Online / Worldwide";
  }

  const patterns = [
    /\bbased\s+in\s+([A-Z][a-zA-Z]+(?:[-\s][A-Z][a-zA-Z]+){0,3})/,
    /\blocated\s+in\s+([A-Z][a-zA-Z]+(?:[-\s][A-Z][a-zA-Z]+){0,3})/,
    /\bserve\s+([A-Z][a-zA-Z]+(?:[-\s][A-Z][a-zA-Z]+){0,3})/,
    /\bmarket\s+is\s+([A-Z][a-zA-Z]+(?:[-\s][A-Z][a-zA-Z]+){0,3})/,
    /\bin\s+([A-Z][a-zA-Z]+(?:[-\s][A-Z][a-zA-Z]+){0,3})/,
  ];

  for (const pattern of patterns) {
    const match =
      value.match(pattern);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  if (
    normalize(value) === "online"
  ) {
    return "Online";
  }

  return null;
};

// ============================================================
// FIELD NORMALIZATION
// ============================================================

const normalizeExpectedAnswer = (
  expectedField,
  rawValue
) => {
  const value =
    safeString(rawValue);

  if (!value) {
    return null;
  }

  switch (expectedField) {
    case "businessName":
      return (
        cleanBusinessName(value) ||
        null
      );

    case "businessType":
      return (
        detectBusinessType(value) ||
        value
      );

    case "serviceLocation":
      return (
        detectLocation(value) ||
        value
      );

    case "goal":
      return (
        detectGoal(value) ||
        value
      );

    case "leadSource":
      return (
        detectLeadSource(value) ||
        value
      );

    case "websiteStatus":
      return (
        detectWebsiteStatus(value) ||
        (
          hasAny(value, ["yes"])
            ? "Has Website"
            : hasAny(value, ["no"])
              ? "No Website"
              : value
        )
      );

    case "websiteUrl":
      return (
        extractWebsiteUrl(value) ||
        value
      );

    case "marketingChannels":
      return (
        detectMarketingChannels(value) ||
        value
      );

    case "salesProcess":
      return (
        detectSalesProcess(value) ||
        value
      );

    case "targetCustomers":
      return value;

    case "mainOffer":
      return value;

    case "automationNeed":
      return (
        detectAutomationNeed(value) ||
        value
      );

    case "biggestChallenge":
      return value;

    case "monthlyCustomers":
      return (
        detectMonthlyCustomers(value) ||
        value
      );

    case "monthlyRevenue":
      return (
        detectMonthlyRevenue(value) ||
        value
      );

    case "teamSize":
      return (
        detectTeamSize(value) ||
        value
      );

    case "businessStage":
      return (
        detectBusinessStage(value) ||
        value
      );

    case "websiteGoal":
      return (
        detectWebsiteGoal(value) ||
        value
      );

    default:
      return value;
  }
};

// ============================================================
// APPLY EXPECTED ANSWER
// ============================================================

const applyAnswerToExpectedField = (
  profile,
  rawText,
  expectedField
) => {
  if (
    !expectedField ||
    !VALID_PROFILE_FIELDS.has(
      expectedField
    )
  ) {
    return {
      profile,
      applied: false,
      field: null,
      rawValue: null,
      normalizedValue: null,
      reason: "NO_VALID_EXPECTED_FIELD",
    };
  }

  const rawValue =
    safeString(rawText);

  if (
    !isUsableAnswer(rawValue)
  ) {
    return {
      profile,
      applied: false,
      field: expectedField,
      rawValue,
      normalizedValue: null,
      reason: "EMPTY_OR_INVALID_ANSWER",
    };
  }

  const specialAnswer =
    classifySpecialAnswer(rawValue);

  if (specialAnswer) {
    return {
      profile,
      applied: false,
      field: expectedField,
      rawValue,
      normalizedValue: null,
      reason:
        specialAnswer === "deferred"
          ? "DEFERRED"
          : "NOT_APPLICABLE",
    };
  }

  /**
   * Do not overwrite an already-populated field merely
   * because an old question appears in conversation history.
   */
  if (
    hasValue(
      profile[expectedField]
    )
  ) {
    return {
      profile,
      applied: false,
      field: expectedField,
      rawValue,
      normalizedValue:
        profile[expectedField],
      reason: "FIELD_ALREADY_ANSWERED",
    };
  }

  const normalizedValue =
    normalizeExpectedAnswer(
      expectedField,
      rawValue
    );

  if (
    isEmpty(normalizedValue)
  ) {
    return {
      profile,
      applied: false,
      field: expectedField,
      rawValue,
      normalizedValue: null,
      reason: "NORMALIZATION_FAILED",
    };
  }

  const next = {
    ...profile,

    [expectedField]:
      normalizedValue,
  };

  if (
    expectedField ===
    "websiteUrl"
  ) {
    next.websiteStatus =
      "Has Website";
  }

  if (
    expectedField ===
    "businessStage"
  ) {
    next.businessAge =
      normalizedValue;
  }

  return {
    profile: next,
    applied: true,
    field: expectedField,
    rawValue,
    normalizedValue,
    reason: "ANSWER_APPLIED",
  };
};

// ============================================================
// SAFE GLOBAL EXTRACTION
// ============================================================

const updateProfileFromText = (
  profile,
  rawText
) => {
  const next = {
    ...profile,
  };

  const raw =
    safeString(rawText);

  if (!raw) {
    return next;
  }

  const businessName =
    detectBusinessName(raw);

  const url =
    extractWebsiteUrl(raw);

  const businessType =
    detectBusinessType(raw);

  const goal =
    detectGoal(raw);

  const leadSource =
    detectLeadSource(raw);

  const websiteStatus =
    detectWebsiteStatus(raw);

  const marketingChannels =
    detectMarketingChannels(raw);

  const salesProcess =
    detectSalesProcess(raw);

  const automationNeed =
    detectAutomationNeed(raw);

  const monthlyRevenue =
    detectMonthlyRevenue(raw);

  const businessStage =
    detectBusinessStage(raw);

  const location =
    detectLocation(raw);

  /**
   * IMPORTANT:
   *
   * Only globally extract fields where false positives
   * are reasonably controllable.
   *
   * monthlyCustomers / teamSize / websiteGoal are NOT
   * globally extracted because numbers and words such
   * as "call" can easily belong to another answer.
   */

  if (
    !next.businessName &&
    businessName
  ) {
    next.businessName =
      businessName;
  }

  if (
    !next.businessType &&
    businessType
  ) {
    next.businessType =
      businessType;
  }

  if (
    !next.goal &&
    goal
  ) {
    next.goal =
      goal;
  }

  if (
    !next.leadSource &&
    leadSource
  ) {
    next.leadSource =
      leadSource;
  }

  if (
    !next.serviceLocation &&
    location
  ) {
    next.serviceLocation =
      location;
  }

  if (
    !next.websiteStatus &&
    websiteStatus
  ) {
    next.websiteStatus =
      websiteStatus;
  }

  if (
    !next.websiteUrl &&
    url
  ) {
    next.websiteUrl =
      url;

    next.websiteStatus =
      "Has Website";
  }

  if (
    !next.marketingChannels &&
    marketingChannels
  ) {
    next.marketingChannels =
      marketingChannels;
  }

  if (
    !next.salesProcess &&
    salesProcess
  ) {
    next.salesProcess =
      salesProcess;
  }

  if (
    !next.automationNeed &&
    automationNeed
  ) {
    next.automationNeed =
      automationNeed;
  }

  if (
    !next.monthlyRevenue &&
    monthlyRevenue
  ) {
    next.monthlyRevenue =
      monthlyRevenue;
  }

  if (
    !next.businessStage &&
    businessStage
  ) {
    next.businessStage =
      businessStage;
  }

  if (
    !next.businessAge &&
    businessStage
  ) {
    next.businessAge =
      businessStage;
  }

  return next;
};

// ============================================================
// MISSING FIELD ENGINE
// ============================================================

const getMissingFields = (
  profile = {},
  deferredFields = new Set()
) => {
  const missing =
    REQUIRED_BLUEPRINT_FIELDS.filter(
      (field) =>
        isEmpty(profile[field]) &&
        !deferredFields.has(field)
    );

  /**
   * Website URL only matters when the user says
   * a website exists.
   */

  if (
    profile.websiteStatus ===
      "Has Website" &&
    isEmpty(profile.websiteUrl) &&
    !deferredFields.has(
      "websiteUrl"
    )
  ) {
    missing.unshift(
      "websiteUrl"
    );
  }

  /**
   * Website goal is also conditional.
   */

  if (
    profile.websiteStatus ===
      "Has Website" &&
    isEmpty(profile.websiteGoal) &&
    !deferredFields.has(
      "websiteGoal"
    )
  ) {
    missing.push(
      "websiteGoal"
    );
  }

  return [
    ...new Set(missing),
  ];
};

// ============================================================
// MESSAGE METADATA
// ============================================================

const getExpectedFieldFromAssistantMessage = (
  msg = {}
) => {
  /**
   * PRIMARY:
   * explicit metadata.
   */

  const metadataField =
    msg?.metadata?.expectedField ||
    msg?.expectedField ||
    null;

  if (
    metadataField &&
    VALID_PROFILE_FIELDS.has(
      metadataField
    )
  ) {
    return {
      field: metadataField,
      source: "metadata",
    };
  }

  /**
   * FALLBACK:
   * reverse-detect the English question.
   */

  const detected =
    detectExpectedFieldFromAssistant(
      msg.content || ""
    );

  if (
    detected &&
    VALID_PROFILE_FIELDS.has(
      detected
    )
  ) {
    return {
      field: detected,
      source: "question_detector",
    };
  }

  return {
    field: null,
    source: "none",
  };
};

// ============================================================
// ATTEMPT TRACKING
// ============================================================

const incrementAttempt = (
  attempts,
  field
) => {
  if (!field) {
    return;
  }

  attempts[field] =
    (attempts[field] || 0) + 1;
};

const shouldDeferField = (
  attempts,
  field
) =>
  Boolean(
    field &&
    (attempts[field] || 0) >=
      MAX_FIELD_ATTEMPTS
  );

// ============================================================
// MAIN CONVERSATION PROCESSOR
// ============================================================

export const processBusinessConversation = (
  messages = []
) => {
  let profile = {
    ...EMPTY_BUSINESS_PROFILE,
  };

  let expectedField = null;

  let expectedFieldSource =
    "none";

  const fieldAttempts = {};

  const deferredFields =
    new Set();

  const answerHistory = [];

  /**
   * Rebuild state from conversation history.
   */

  for (
    let index = 0;
    index < messages.length;
    index += 1
  ) {
    const msg =
      messages[index] || {};

    // --------------------------------------------------------
    // ASSISTANT MESSAGE
    // --------------------------------------------------------

    if (
      msg.role === "assistant"
    ) {
      const detected =
        getExpectedFieldFromAssistantMessage(
          msg
        );

      expectedField =
        detected.field;

      expectedFieldSource =
        detected.source;

      if (expectedField) {
        incrementAttempt(
          fieldAttempts,
          expectedField
        );
      }

      continue;
    }

    // --------------------------------------------------------
    // USER MESSAGE
    // --------------------------------------------------------

    if (
      msg.role === "user"
    ) {
      const rawAnswer =
        safeString(
          msg.content || ""
        );

      /**
       * First apply the answer to the exact field AEMA
       * was expecting.
       */

      const result =
        applyAnswerToExpectedField(
          profile,
          rawAnswer,
          expectedField
        );

      profile =
        result.profile;

      answerHistory.push({
        messageIndex: index,
        field:
          result.field,
        expectedFieldSource,
        rawValue:
          result.rawValue,
        normalizedValue:
          result.normalizedValue,
        applied:
          result.applied,
        reason:
          result.reason,
      });

      /**
       * Handle explicit skip / unknown answers.
       */

      if (
        expectedField &&
        (
          result.reason ===
            "DEFERRED" ||
          result.reason ===
            "NOT_APPLICABLE"
        )
      ) {
        deferredFields.add(
          expectedField
        );
      }

      /**
       * If the same field has already been asked too many
       * times and still has no answer, stop looping.
       */

      if (
        expectedField &&
        isEmpty(
          profile[expectedField]
        ) &&
        shouldDeferField(
          fieldAttempts,
          expectedField
        )
      ) {
        deferredFields.add(
          expectedField
        );
      }

      /**
       * Secondly, safely extract any additional obvious
       * information from the user's answer.
       *
       * Example:
       *
       * "We are a car repair shop in Toronto."
       *
       * may provide both:
       *
       * businessType
       * serviceLocation
       */

      profile =
        updateProfileFromText(
          profile,
          rawAnswer
        );

      /**
       * The expected field applies only to the next
       * user answer.
       */

      expectedField = null;
      expectedFieldSource =
        "none";
    }
  }

  // ==========================================================
  // DETERMINE NEXT FIELD
  // ==========================================================

  let missingFields =
    getMissingFields(
      profile,
      deferredFields
    );

  /**
   * Additional loop protection.
   *
   * If a field somehow reached its attempt limit while
   * rebuilding history, remove it from the next-question
   * queue.
   */

  missingFields =
    missingFields.filter(
      (field) =>
        !shouldDeferField(
          fieldAttempts,
          field
        )
    );

  const readyForBlueprint =
    missingFields.length === 0;

  // ==========================================================
  // COMPLETE
  // ==========================================================

  if (
    readyForBlueprint
  ) {
    return {
      profile,

      readyForBlueprint: true,

      missingFields: [],

      reply:
        "Excellent. I have enough information to create your AEMA Growth Blueprint.",

      expectedField: null,

      conversationState: {
        fieldAttempts,
        deferredFields:
          [...deferredFields],
        answerHistory,
      },
    };
  }

  // ==========================================================
  // BUILD NEXT STRUCTURED TURN
  // ==========================================================

  const turn =
    buildConversationTurn({
      profile,
      missingFields,
    });

  return {
    profile,

    readyForBlueprint: false,

    missingFields,

    reply:
      turn.reply,

    /**
     * CRITICAL:
     *
     * Send this to the frontend and preserve it with the
     * assistant message.
     */
    expectedField:
      turn.expectedField,

    conversationState: {
      fieldAttempts,

      deferredFields:
        [...deferredFields],

      answerHistory,
    },
  };
};

export default processBusinessConversation;