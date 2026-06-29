// server/services/profileStateEngine.js

import { detectExpectedFieldFromAssistant } from "./conversation/questionDetector.js";
import { buildConversationalReply } from "./conversationCoach.js";
import {
  EMPTY_BUSINESS_PROFILE,
  REQUIRED_BLUEPRINT_FIELDS,
} from "./businessProfileSchema.js";

const normalize = (value = "") => String(value || "").toLowerCase().trim();

const hasAny = (value = "", words = []) => {
  const clean = normalize(value);
  return words.some((word) => clean.includes(normalize(word)));
};

const isEmpty = (value) =>
  value === null ||
  value === undefined ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

const titleCase = (value = "") => {
  const clean = String(value || "").trim();
  if (!clean) return null;

  return clean
    .split(/\s+/)
    .map((word) => {
      if (word.length <= 2) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

const cleanBusinessName = (value = "") => {
  const clean = String(value || "")
    .replace(/[?.!,;:]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) return null;

  const lower = normalize(clean);
  const badValues = [
    "yes",
    "no",
    "none",
    "not yet",
    "i need more customers",
    "i need more customers for my business",
    "get more customers",
    "more customers",
  ];

  if (badValues.includes(lower)) return null;
  if (lower.includes("need more customers")) return null;
  if (lower.length < 2 || lower.length > 80) return null;

  return titleCase(clean);
};

const detectBusinessName = (rawText = "") => {
  const value = String(rawText || "").trim();
  if (!value) return null;

  const patterns = [
    /(?:business|company|brand|organization)\s+(?:name\s+is|is\s+called|is\s+named|called)\s+([a-zA-Z0-9&.'’\- ]{2,80})/i,
    /(?:my|our)\s+(?:business|company|brand|organization)\s+(?:is\s+called|is\s+named|is)\s+([a-zA-Z0-9&.'’\- ]{2,80})/i,
    /(?:it\s+is\s+called|it's\s+called|called)\s+([a-zA-Z0-9&.'’\- ]{2,80})/i,
    /(?:i\s+run|i\s+own|we\s+run|we\s+own)\s+([a-zA-Z0-9&.'’\- ]{2,80})/i,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[1]) {
      const name = match[1]
        .replace(/\b(it is|and|that|where|which|because)\b.*$/i, "")
        .trim();

      const cleaned = cleanBusinessName(name);
      if (cleaned) return cleaned;
    }
  }

  return null;
};

const extractWebsiteUrl = (text = "") => {
  const match = String(text).match(
    /(https?:\/\/[^\s]+|www\.[^\s]+|[a-z0-9-]+\.(com|ca|net|org|co|io|app|dev|ai|site|online|store|biz|info|inc)[^\s]*)/i
  );

  if (!match) return null;

  const url = match[0].replace(/[.,;!?]+$/, "");
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
};

const extractNumber = (text = "") => {
  const match = String(text).match(/\d+/);
  return match ? Number(match[0]) : null;
};

const detectBusinessType = (text = "") => {
  if (hasAny(text, ["childcare", "daycare", "child care", "elder care", "senior care", "care service"])) return "Childcare / Care Service Business";
  if (hasAny(text, ["clothing", "fashion", "boutique", "apparel", "wear", "tailor", "tailoring"])) return "Clothing / Fashion Business";
  if (hasAny(text, ["cleaning", "cleaner", "janitorial", "maid", "housekeeping"])) return "Cleaning Business";
  if (hasAny(text, ["restaurant", "food", "catering", "bakery", "kitchen", "chef"])) return "Food / Restaurant Business";
  if (hasAny(text, ["barber", "barbing", "salon", "haircut", "hair salon", "beauty", "spa", "lashes", "nails"])) return "Barbering / Salon Business";
  if (hasAny(text, ["real estate", "realtor", "property", "rental", "airbnb"])) return "Real Estate / Property Business";
  if (hasAny(text, ["software", "app", "seo", "automation", "digital", "ai", "saas", "dashboard", "tech", "technology"])) return "Digital / Technology Service Business";
  if (hasAny(text, ["consulting", "consultant", "coach", "training", "advisor", "agency"])) return "Consulting / Professional Service Business";
  if (hasAny(text, ["health", "clinic", "home care", "therapy", "wellness", "fitness", "gym"])) return "Health / Wellness Business";
  if (hasAny(text, ["construction", "contractor", "renovation", "plumbing", "painting", "roofing", "landscaping"])) return "Construction / Home Service Business";
  if (hasAny(text, ["school", "education", "tutor", "course", "academy", "lesson"])) return "Education / Training Business";
  if (hasAny(text, ["event", "wedding", "dj", "entertainment", "decor", "photography"])) return "Events / Entertainment Business";
  if (hasAny(text, ["logistics", "delivery", "courier", "transport", "moving"])) return "Transportation / Delivery Business";
  if (hasAny(text, ["nonprofit", "non profit", "ngo", "charity", "community", "social service"])) return "Nonprofit / Community Service";

  return null;
};

const detectGoal = (text = "") => {
  if (hasAny(text, ["more customers", "more clients", "get customers", "get clients", "leads", "buyers", "traffic", "grow my customer"])) return "Get More Customers";
  if (hasAny(text, ["sales", "sell", "revenue", "income", "profit", "consistent buyers", "more orders"])) return "Increase Sales";
  if (hasAny(text, ["seo", "google ranking", "rank on google"])) return "Improve SEO";
  if (hasAny(text, ["website", "site", "redesign"])) return "Improve Website";
  if (hasAny(text, ["automation", "automate", "manual time", "save time"])) return "Automate Business";
  if (hasAny(text, ["systems", "operations", "workflow", "process"])) return "Improve Business Systems";
  if (hasAny(text, ["marketing", "advertising", "promotion"])) return "Improve Marketing";
  if (hasAny(text, ["brand", "branding"])) return "Improve Branding";
  if (hasAny(text, ["grow", "scale", "expand"])) return "Grow the Business";

  return null;
};

const detectLeadSource = (text = "") => {
  if (hasAny(text, ["google ads", "facebook ads", "instagram ads", "paid ads", "ads"])) return "Paid Ads";
  if (hasAny(text, ["agencies", "agency referral", "referral agency"])) return "Agencies";
  if (hasAny(text, ["referral", "referrals", "word of mouth", "recommendation"])) return "Referrals";
  if (hasAny(text, ["instagram", "facebook", "tiktok", "linkedin", "social media"])) return "Social Media";
  if (hasAny(text, ["walk-in", "walk ins", "walkins", "walk in"])) return "Walk-ins";
  if (hasAny(text, ["google search", "google"])) return "Google";
  if (hasAny(text, ["website"])) return "Website";
  if (hasAny(text, ["whatsapp"])) return "WhatsApp";
  if (hasAny(text, ["none", "not getting customers", "no customers"])) return "No Clear Lead Source";

  return null;
};

const detectWebsiteStatus = (text = "") => {
  const url = extractWebsiteUrl(text);
  if (url) return "Has Website";
  if (hasAny(text, ["i have a website", "we have a website", "has website", "yes website", "yes i do", "yes we do"])) return "Has Website";
  if (hasAny(text, ["no website", "don't have a website", "dont have a website", "do not have a website", "without a website", "not yet"])) return "No Website";

  return null;
};

const detectMarketingChannels = (text = "") => {
  const channels = [];
  if (hasAny(text, ["instagram"])) channels.push("Instagram");
  if (hasAny(text, ["facebook"])) channels.push("Facebook");
  if (hasAny(text, ["tiktok"])) channels.push("TikTok");
  if (hasAny(text, ["linkedin"])) channels.push("LinkedIn");
  if (hasAny(text, ["google"])) channels.push("Google");
  if (hasAny(text, ["email"])) channels.push("Email");
  if (hasAny(text, ["whatsapp"])) channels.push("WhatsApp");
  if (hasAny(text, ["agencies"])) channels.push("Agencies");
  if (hasAny(text, ["referral", "referrals"])) channels.push("Referrals");
  if (hasAny(text, ["paid ads", "ads"])) channels.push("Paid Ads");
  if (hasAny(text, ["flyer", "flyers"])) channels.push("Flyers");
  if (hasAny(text, ["none", "no marketing"])) return ["None"];
  return channels.length ? channels : null;
};

const detectSalesProcess = (text = "") => {
  if (hasAny(text, ["whatsapp"])) return "WhatsApp";
  if (hasAny(text, ["dm", "direct message", "inbox"])) return "DM / Inbox";
  if (hasAny(text, ["phone", "call"])) return "Phone Call";
  if (hasAny(text, ["booking form", "booking link", "book online"])) return "Booking Form";
  if (hasAny(text, ["website checkout", "checkout", "online store"])) return "Website Checkout";
  if (hasAny(text, ["walk-in", "walk in"])) return "Walk-in";
  if (hasAny(text, ["invoice"])) return "Invoice";
  if (hasAny(text, ["manual"])) return "Manual Follow-up";
  if (hasAny(text, ["agency", "agencies"])) return "Agency Referral";

  return null;
};

const detectAutomationNeed = (text = "") => {
  if (hasAny(text, ["booking", "bookings", "appointments", "scheduling"])) return "Bookings";
  if (hasAny(text, ["follow up", "follow-up", "followups", "reminder", "reminders"])) return "Follow-ups";
  if (hasAny(text, ["payment", "payments", "invoice", "invoicing"])) return "Payments";
  if (hasAny(text, ["email", "emails"])) return "Emails";
  if (hasAny(text, ["report", "reports", "reporting"])) return "Reports";
  if (hasAny(text, ["lead", "leads", "crm", "contacts", "customer management"])) return "Lead Management";
  if (hasAny(text, ["customer messages", "messages", "inquiries"])) return "Customer Messages";
  if (hasAny(text, ["task", "tasks", "to do"])) return "Task Management";
  if (hasAny(text, ["manual", "spreadsheet", "excel", "workflow"])) return "Workflow Automation";

  return null;
};

const detectMonthlyCustomers = (text = "") => {
  if (hasAny(text, ["under 20", "less than 20", "below 20"])) return "Under 20";
  if (hasAny(text, ["20-100", "20 to 100", "between 20 and 100"])) return "20-100";
  if (hasAny(text, ["100-500", "100 to 500", "between 100 and 500"])) return "100-500";
  if (hasAny(text, ["500+", "over 500", "more than 500"])) return "500+";
  const number = extractNumber(text);
  if (number === null) return null;
  if (number < 20) return "Under 20";
  if (number <= 100) return "20-100";
  if (number <= 500) return "100-500";
  return "500+";
};

const detectMonthlyRevenue = (text = "") => {
  if (hasAny(text, ["under $2k", "under 2k", "less than 2000", "below 2000"])) return "Under $2k";
  if (hasAny(text, ["$2k-$10k", "2k-10k", "2k to 10k", "2000 to 10000"])) return "$2k-$10k";
  if (hasAny(text, ["$10k-$50k", "10k-50k", "10k to 50k"])) return "$10k-$50k";
  if (hasAny(text, ["$50k+", "over 50k", "above 50k", "more than 50000"])) return "$50k+";
  return null;
};

const detectTeamSize = (text = "") => {
  if (hasAny(text, ["just me", "only me", "solo", "myself"])) return "Just me";
  if (hasAny(text, ["2-5", "2 to 5", "two to five", "2 staff", "3 staff", "4 staff", "5 staff", "2 employees", "3 employees", "4 employees", "5 employees"])) return "2-5";
  if (hasAny(text, ["6-20", "6 to 20", "six to twenty", "6 staff", "10 staff", "15 staff", "20 staff", "6 employees", "10 employees", "15 employees", "20 employees"])) return "6-20";
  if (hasAny(text, ["20+ staff", "20+ employees", "over 20 staff", "over 20 employees", "more than 20 staff", "more than 20 employees"])) return "20+";
  return null;
};

const detectBusinessStage = (text = "") => {
  if (hasAny(text, ["idea stage", "just an idea", "not started"])) return "Idea Stage";
  if (hasAny(text, ["less than 1 year", "under 1 year", "few months", "new business", "3 months", "4 months", "5 months", "6 months", "7 months", "8 months", "9 months", "10 months", "11 months"])) return "Less than 1 year";
  if (hasAny(text, ["1-3 years", "1 to 3 years", "one year", "1 year", "2 years", "3 years"])) return "1-3 years";
  if (hasAny(text, ["3-5 years", "3 to 5 years", "4 years", "5 years"])) return "3-5 years";
  if (hasAny(text, ["over 5 years", "more than 5 years", "5+ years", "6 years", "7 years", "8 years", "9 years", "10 years"])) return "Over 5 years";
  return null;
};

const detectWebsiteGoal = (text = "") => {
  if (hasAny(text, ["call"])) return "Call";
  if (hasAny(text, ["book", "booking"])) return "Book";
  if (hasAny(text, ["buy", "purchase", "shop"])) return "Buy";
  if (hasAny(text, ["quote", "estimate"])) return "Request a Quote";
  if (hasAny(text, ["contact", "message"])) return "Contact";
  if (hasAny(text, ["subscribe", "join"])) return "Join List";
  return null;
};

const detectLocation = (rawText = "") => {
  const text = String(rawText || "");
  const patterns = [
    /\bin\s+([A-Z][a-zA-Z]+(?:[-\s][A-Z][a-zA-Z]+){0,3})/,
    /\bserve\s+([A-Z][a-zA-Z]+(?:[-\s][A-Z][a-zA-Z]+){0,3})/,
    /\bbased\s+in\s+([A-Z][a-zA-Z]+(?:[-\s][A-Z][a-zA-Z]+){0,3})/,
    /\bmarket\s+is\s+([A-Z][a-zA-Z]+(?:[-\s][A-Z][a-zA-Z]+){0,3})/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
  }

  if (hasAny(text, ["online worldwide", "worldwide", "online"])) return "Online / Worldwide";
  return null;
};

const applyAnswerToExpectedField = (profile, rawText, expectedField) => {
  if (!expectedField) return profile;
  const value = String(rawText || "").trim();
  if (!value) return profile;
  const next = { ...profile };

  if (expectedField === "businessName" && !next.businessName) next.businessName = cleanBusinessName(value);
  if (expectedField === "businessType" && !next.businessType) next.businessType = detectBusinessType(value) || value;
  if (expectedField === "serviceLocation" && !next.serviceLocation) next.serviceLocation = detectLocation(value) || value;
  if (expectedField === "goal" && !next.goal) next.goal = detectGoal(value) || value;
  if (expectedField === "leadSource" && !next.leadSource) next.leadSource = detectLeadSource(value) || value;
  if (expectedField === "websiteStatus" && !next.websiteStatus) next.websiteStatus = detectWebsiteStatus(value) || (hasAny(value, ["yes"]) ? "Has Website" : hasAny(value, ["no"]) ? "No Website" : value);
  if (expectedField === "websiteUrl" && !next.websiteUrl) {
    next.websiteUrl = extractWebsiteUrl(value) || value;
    next.websiteStatus = "Has Website";
  }
  if (expectedField === "marketingChannels" && !next.marketingChannels) next.marketingChannels = detectMarketingChannels(value) || value;
  if (expectedField === "salesProcess" && !next.salesProcess) next.salesProcess = detectSalesProcess(value) || value;
  if (expectedField === "targetCustomers" && !next.targetCustomers) next.targetCustomers = value;
  if (expectedField === "mainOffer" && !next.mainOffer) next.mainOffer = value;
  if (expectedField === "automationNeed" && !next.automationNeed) next.automationNeed = detectAutomationNeed(value) || value;
  if (expectedField === "biggestChallenge" && !next.biggestChallenge) next.biggestChallenge = value;
  if (expectedField === "monthlyCustomers" && !next.monthlyCustomers) next.monthlyCustomers = detectMonthlyCustomers(value) || value;
  if (expectedField === "monthlyRevenue" && !next.monthlyRevenue) next.monthlyRevenue = detectMonthlyRevenue(value) || value;
  if (expectedField === "teamSize" && !next.teamSize) next.teamSize = detectTeamSize(value) || value;
  if (expectedField === "businessStage" && !next.businessStage) {
    next.businessStage = detectBusinessStage(value) || value;
    next.businessAge = next.businessStage;
  }
  if (expectedField === "websiteGoal" && !next.websiteGoal) next.websiteGoal = detectWebsiteGoal(value) || value;

  return next;
};

const updateProfileFromText = (profile, rawText) => {
  const next = { ...profile };
  const text = normalize(rawText);
  const businessName = detectBusinessName(rawText);
  const url = extractWebsiteUrl(rawText);
  const businessType = detectBusinessType(text);
  const goal = detectGoal(text);
  const leadSource = detectLeadSource(text);
  const websiteStatus = detectWebsiteStatus(text);
  const marketingChannels = detectMarketingChannels(text);
  const salesProcess = detectSalesProcess(text);
  const automationNeed = detectAutomationNeed(text);
  const monthlyRevenue = detectMonthlyRevenue(text);
  const businessStage = detectBusinessStage(text);
  const websiteGoal = detectWebsiteGoal(text);
  const location = detectLocation(rawText);

  if (!next.businessName && businessName) next.businessName = businessName;
  if (!next.businessType && businessType) next.businessType = businessType;
  if (!next.goal && goal) next.goal = goal;
  if (!next.leadSource && leadSource) next.leadSource = leadSource;
  if (!next.serviceLocation && location) next.serviceLocation = location;
  if (!next.websiteStatus && websiteStatus) next.websiteStatus = websiteStatus;
  if (!next.websiteUrl && url) next.websiteUrl = url;
  if (!next.marketingChannels && marketingChannels) next.marketingChannels = marketingChannels;
  if (!next.salesProcess && salesProcess) next.salesProcess = salesProcess;
  if (!next.automationNeed && automationNeed) next.automationNeed = automationNeed;
  if (!next.monthlyRevenue && monthlyRevenue) next.monthlyRevenue = monthlyRevenue;
  if (!next.businessStage && businessStage) next.businessStage = businessStage;
  if (!next.businessAge && businessStage) next.businessAge = businessStage;
  if (!next.websiteGoal && websiteGoal) next.websiteGoal = websiteGoal;

  // Do not globally detect monthlyCustomers or teamSize from every answer.
  // This prevents values like "under 20 customers" from becoming "20+ team size".
  return next;
};

const getMissingFields = (profile = {}) => {
  const missing = REQUIRED_BLUEPRINT_FIELDS.filter((field) => isEmpty(profile[field]));

  if (profile.websiteStatus === "Has Website" && isEmpty(profile.websiteUrl)) {
    missing.unshift("websiteUrl");
  }

  if (profile.websiteStatus === "Has Website" && isEmpty(profile.websiteGoal)) {
    missing.push("websiteGoal");
  }

  return [...new Set(missing)];
};

export const processBusinessConversation = (messages = []) => {
  let profile = { ...EMPTY_BUSINESS_PROFILE };
  let expectedField = null;

  for (const msg of messages) {
    if (msg.role === "assistant") {
      expectedField = detectExpectedFieldFromAssistant(msg.content || "");
      continue;
    }

    if (msg.role === "user") {
      profile = applyAnswerToExpectedField(profile, msg.content || "", expectedField);
      profile = updateProfileFromText(profile, msg.content || "");
    }
  }

  const missingFields = getMissingFields(profile);
  const readyForBlueprint = missingFields.length === 0;

  if (readyForBlueprint) {
    return {
      profile,
      readyForBlueprint: true,
      missingFields,
      reply: "Excellent. I have enough information to create your AEMA Growth Blueprint.",
    };
  }

  return {
    profile,
    readyForBlueprint: false,
    missingFields,
    reply: buildConversationalReply({ profile, missingFields }),
  };
};
