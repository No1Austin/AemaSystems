const cleanText = (value = "") =>
  String(value || "").toLowerCase().trim();

const normalizeText = (value = "") =>
  cleanText(value)
    .replace(/[^\w\s.$/+:-]/g, " ")
    .replace(/\s+/g, " ");

const hasAny = (value = "", words = []) => {
  const clean = normalizeText(value);
  return words.some((word) => clean.includes(cleanText(word)));
};

const titleCase = (value = "") => {
  const clean = String(value || "").trim();
  if (!clean) return null;

  return clean
    .split(" ")
    .map((word) =>
      word.length > 2
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word
    )
    .join(" ");
};

const extractNumber = (value = "") => {
  const match = String(value).match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

const extractWebsiteUrl = (value = "") => {
  const match = String(value).match(
    /(https?:\/\/[^\s]+|www\.[^\s]+|[a-z0-9-]+\.(com|ca|net|org|co|io|app|dev|ai|site|online|store|biz|info|inc)[^\s]*)/i
  );

  if (!match) return null;

  const url = match[0].replace(/[.,;!?]+$/, "");

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `https://${url}`;
};

const extractBusinessName = (rawText = "") => {
  const text = String(rawText || "").trim();

  const patterns = [
    /(?:business|company|brand|organization)\s+(?:is called|name is|called)\s+([a-zA-Z0-9&.'\- ]{2,60})/i,
    /(?:my|our)\s+(?:business|company|brand|organization)\s+(?:is|is called|is named)\s+([a-zA-Z0-9&.'\- ]{2,60})/i,
    /(?:i run|i own|we run|we own)\s+([a-zA-Z0-9&.'\- ]{2,60})\s+(?:called|named)\s+/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      const name = match[1]
        .replace(/\bthat\b.*$/i, "")
        .replace(/\band\b.*$/i, "")
        .trim();

      if (name.length >= 2) return titleCase(name);
    }
  }

  return null;
};

const normalizeRevenue = (value = "") => {
  const clean = normalizeText(value);

  if (hasAny(clean, ["under $2k", "under 2k", "less than 2000", "below 2000"])) {
    return "Under $2k";
  }

  if (hasAny(clean, ["$2k-$10k", "2k-10k", "2k to 10k", "2000 to 10000"])) {
    return "$2k-$10k";
  }

  if (hasAny(clean, ["$10k-$50k", "10k-50k", "10k to 50k", "10000 to 50000"])) {
    return "$10k-$50k";
  }

  if (hasAny(clean, ["$50k+", "over 50k", "more than 50000", "above 50k"])) {
    return "$50k+";
  }

  const moneyMatch = clean.match(/\$?\s?(\d{3,7})/);
  if (moneyMatch) {
    const amount = Number(moneyMatch[1]);

    if (amount < 2000) return "Under $2k";
    if (amount <= 10000) return "$2k-$10k";
    if (amount <= 50000) return "$10k-$50k";
    return "$50k+";
  }

  return null;
};

const normalizeBusinessStage = (value = "") => {
  const clean = normalizeText(value);

  if (hasAny(clean, ["idea stage", "just an idea", "not started"])) {
    return "Idea Stage";
  }

  if (
    hasAny(clean, [
      "less than 1 year",
      "under 1 year",
      "few months",
      "new business",
      "3 months",
      "4 months",
      "5 months",
      "6 months",
      "7 months",
      "8 months",
      "9 months",
      "10 months",
      "11 months",
    ])
  ) {
    return "Less than 1 year";
  }

  if (hasAny(clean, ["1-3 years", "1 to 3 years", "one to three years", "1 year", "2 years", "3 years"])) {
    return "1-3 years";
  }

  if (hasAny(clean, ["3-5 years", "3 to 5 years", "three to five years", "4 years", "5 years"])) {
    return "3-5 years";
  }

  if (hasAny(clean, ["over 5 years", "more than 5 years", "5+ years", "6 years", "7 years", "8 years", "9 years", "10 years"])) {
    return "Over 5 years";
  }

  return null;
};

const BUSINESS_TYPES = [
  {
    label: "Cleaning Business",
    keywords: ["cleaning", "cleaner", "janitorial", "housekeeping", "maid"],
  },
  {
    label: "Barbing / Salon Business",
    keywords: ["barber", "barbing", "salon", "haircut", "hair salon", "braids", "grooming"],
  },
  {
    label: "Restaurant / Food Business",
    keywords: ["restaurant", "food", "catering", "bakery", "kitchen", "meal", "chef"],
  },
  {
    label: "E-commerce Business",
    keywords: ["ecommerce", "e commerce", "online store", "shopify", "dropshipping"],
  },
  {
    label: "Clothing / Fashion Business",
    keywords: ["clothing", "fashion", "apparel", "boutique", "wears", "clothes", "dress", "native wear", "tailoring"],
  },
  {
    label: "Childcare / Care Service Business",
    keywords: ["childcare", "daycare", "child care", "elder care", "senior care", "care service"],
  },
  {
    label: "Real Estate Business",
    keywords: ["real estate", "realtor", "property", "housing", "mortgage", "rental"],
  },
  {
    label: "Beauty Business",
    keywords: ["beauty", "makeup", "lashes", "nails", "spa", "skincare"],
  },
  {
    label: "Fitness Business",
    keywords: ["fitness", "gym", "trainer", "personal training", "workout"],
  },
  {
    label: "Photography / Creative Business",
    keywords: ["photography", "photographer", "photo", "video", "videography", "creative"],
  },
  {
    label: "Tax / Accounting Business",
    keywords: ["tax", "accounting", "bookkeeping", "payroll", "finance"],
  },
  {
    label: "Construction / Contracting Business",
    keywords: ["construction", "contractor", "renovation", "painting", "drywall", "plumbing", "electrical"],
  },
  {
    label: "Consulting Business",
    keywords: ["consulting", "consultant", "coach", "coaching", "advisor", "training"],
  },
  {
    label: "Healthcare / Care Service Business",
    keywords: ["healthcare", "clinic", "home care", "nursing", "therapy", "support worker"],
  },
  {
    label: "Education / Training Business",
    keywords: ["school", "education", "training", "tutoring", "course", "academy"],
  },
  {
    label: "Transportation / Delivery Business",
    keywords: ["delivery", "transport", "logistics", "courier", "trucking"],
  },
  {
    label: "Automotive Business",
    keywords: ["auto", "car wash", "mechanic", "detailing", "garage"],
  },
  {
    label: "Tech / Software Business",
    keywords: ["software", "saas", "tech", "app", "web app", "technology", "ai", "automation"],
  },
  {
    label: "Event / Entertainment Business",
    keywords: ["event", "dj", "party", "wedding", "entertainment"],
  },
  {
    label: "Nonprofit / Community Organization",
    keywords: ["nonprofit", "ngo", "charity", "community organization", "social service"],
  },
];

const detectBusinessType = (text = "") => {
  const matchedBusiness = BUSINESS_TYPES.find((business) =>
    hasAny(text, business.keywords)
  );

  return matchedBusiness?.label || null;
};

export const extractBusinessProfile = (messages = []) => {
  const rawUserMessages = messages
    .filter((msg) => msg.role === "user")
    .map((msg) => String(msg.content || ""));

  const userMessages = rawUserMessages.map((msg) => normalizeText(msg));

  const allRawText = rawUserMessages.join(" ");
  const allText = userMessages.join(" ");
  const lastUserMessage = userMessages[userMessages.length - 1] || "";

  const profile = {
    businessName: null,
    businessType: null,
    businessStage: null,
    goal: null,
    biggestChallenge: null,
    monthlyCustomers: null,
    monthlyRevenue: null,
    teamSize: null,
    leadSource: null,
    salesProcess: null,
    websiteStatus: null,
    websiteUrl: null,
    websiteGoal: null,
    marketingChannels: null,
    automationNeed: null,
    techComfort: null,
    businessAge: null,
  };

  profile.businessName = extractBusinessName(allRawText);

  const detectedBusinessType = detectBusinessType(allText);
  if (detectedBusinessType) {
    profile.businessType = detectedBusinessType;
  }

  const stage = normalizeBusinessStage(allText);
  if (stage) {
    profile.businessStage = stage;
    profile.businessAge = stage;
  }

  if (hasAny(allText, ["more customers", "more clients", "get customers", "more leads", "lead generation"])) {
    profile.goal = "Get More Customers";
  } else if (hasAny(allText, ["increase sales", "grow sales", "more sales", "revenue"])) {
    profile.goal = "Increase Sales";
  } else if (hasAny(allText, ["seo", "rank on google", "google ranking", "search engine"])) {
    profile.goal = "Improve SEO";
  } else if (hasAny(allText, ["improve website", "website audit", "better website", "redesign website", "fix my website"])) {
    profile.goal = "Improve Website";
  } else if (hasAny(allText, ["business systems", "operations", "workflow", "process"])) {
    profile.goal = "Improve Business Systems";
  } else if (hasAny(allText, ["automation", "automate", "save time"])) {
    profile.goal = "Automate Business";
  } else if (hasAny(allText, ["expand", "scale", "open another branch"])) {
    profile.goal = "Expand";
  } else if (hasAny(allText, ["funding", "investment", "investor", "raise money"])) {
    profile.goal = "Raise Funding";
  }

  const challengeWords = [
    "customers",
    "sales",
    "marketing",
    "website",
    "seo",
    "staff",
    "automation",
    "competition",
    "leads",
    "cashflow",
    "time",
    "inventory",
    "follow up",
    "follow-up",
  ];

  if (hasAny(lastUserMessage, challengeWords)) {
    profile.biggestChallenge = titleCase(lastUserMessage);
  }

  if (hasAny(allText, ["under 20", "less than 20", "below 20"])) {
    profile.monthlyCustomers = "Under 20";
  } else if (hasAny(allText, ["20-100", "20 to 100", "between 20 and 100"])) {
    profile.monthlyCustomers = "20-100";
  } else if (hasAny(allText, ["100-500", "100 to 500", "between 100 and 500"])) {
    profile.monthlyCustomers = "100-500";
  } else if (hasAny(allText, ["500+", "over 500", "more than 500"])) {
    profile.monthlyCustomers = "500+";
  } else {
    const customerPhrases = [
      /(\d+)\s+(customers|clients|buyers|orders|bookings)\s+(a|per|each)?\s*(month|monthly)/i,
      /(serve|serving|have|about|around)\s+(\d+)\s+(customers|clients|buyers|orders|bookings)/i,
    ];

    for (const pattern of customerPhrases) {
      const match = allRawText.match(pattern);
      const value = match?.[1] || match?.[2];

      if (value) {
        const num = Number(value);

        if (num < 20) profile.monthlyCustomers = "Under 20";
        else if (num <= 100) profile.monthlyCustomers = "20-100";
        else if (num <= 500) profile.monthlyCustomers = "100-500";
        else profile.monthlyCustomers = "500+";

        break;
      }
    }
  }

  const revenue = normalizeRevenue(allText);
  if (revenue) {
    profile.monthlyRevenue = revenue;
  }

  if (hasAny(allText, ["just me", "only me", "solo", "myself"])) {
    profile.teamSize = "Just me";
  } else if (hasAny(allText, ["2-5", "2 to 5", "two to five"])) {
    profile.teamSize = "2-5";
  } else if (hasAny(allText, ["6-20", "6 to 20", "six to twenty"])) {
    profile.teamSize = "6-20";
  } else if (hasAny(allText, ["20+", "more than 20", "over 20"])) {
    profile.teamSize = "20+";
  }

  if (hasAny(allText, ["google ads", "facebook ads", "instagram ads", "paid ads"])) {
    profile.leadSource = "Paid Ads";
  } else if (hasAny(allText, ["agencies", "agency referrals", "referral agencies"])) {
    profile.leadSource = "Agencies";
  } else if (hasAny(allText, ["referrals", "referral", "word of mouth", "recommendations"])) {
    profile.leadSource = "Referrals";
  } else if (hasAny(allText, ["instagram", "facebook", "tiktok", "linkedin", "social media"])) {
    profile.leadSource = "Social Media";
  } else if (hasAny(allText, ["walk-in", "walk ins", "walkins", "physical store"])) {
    profile.leadSource = "Walk-ins";
  } else if (hasAny(allText, ["google", "google search", "search"])) {
    profile.leadSource = "Google";
  } else if (hasAny(allText, ["website"])) {
    profile.leadSource = "Website";
  } else if (hasAny(allText, ["none", "not getting", "no customers"])) {
    profile.leadSource = "No Clear Lead Source";
  }

  if (hasAny(allText, ["whatsapp"])) {
    profile.salesProcess = "WhatsApp";
  } else if (hasAny(allText, ["phone", "call"])) {
    profile.salesProcess = "Phone Call";
  } else if (hasAny(allText, ["instagram dm", "dm"])) {
    profile.salesProcess = "Instagram DM";
  } else if (hasAny(allText, ["booking link", "book online"])) {
    profile.salesProcess = "Booking Link";
  } else if (hasAny(allText, ["physical store", "walk in", "walk-in"])) {
    profile.salesProcess = "Physical Store";
  } else if (hasAny(allText, ["marketplace", "etsy", "amazon", "facebook marketplace"])) {
    profile.salesProcess = "Marketplace";
  } else if (hasAny(allText, ["website checkout", "checkout"])) {
    profile.salesProcess = "Website Checkout";
  }

  const websiteUrl = extractWebsiteUrl(allRawText);

  if (websiteUrl) {
    profile.websiteUrl = websiteUrl;
    profile.websiteStatus = "Has Website";
  } else if (
    hasAny(allText, [
      "no website",
      "dont have a website",
      "don't have a website",
      "do not have a website",
      "without a website",
      "not yet",
    ])
  ) {
    profile.websiteStatus = "No Website";
  } else if (hasAny(allText, ["i have a website", "we have a website", "my website", "our website"])) {
    profile.websiteStatus = "Has Website";
  } else if (["yes", "yeah", "yes i do", "yes we do"].includes(lastUserMessage)) {
    profile.websiteStatus = "Has Website";
  } else if (["no", "nope", "not yet"].includes(lastUserMessage)) {
    profile.websiteStatus = "No Website";
  }

  if (hasAny(lastUserMessage, ["call"])) profile.websiteGoal = "Call";
  else if (hasAny(lastUserMessage, ["book", "booking"])) profile.websiteGoal = "Book";
  else if (hasAny(lastUserMessage, ["buy", "purchase", "shop"])) profile.websiteGoal = "Buy";
  else if (hasAny(lastUserMessage, ["quote", "estimate"])) profile.websiteGoal = "Request a Quote";
  else if (hasAny(lastUserMessage, ["contact", "message"])) profile.websiteGoal = "Contact";
  else if (hasAny(lastUserMessage, ["join", "subscribe", "email list"])) profile.websiteGoal = "Join List";

  const channels = [];

  if (hasAny(allText, ["instagram"])) channels.push("Instagram");
  if (hasAny(allText, ["tiktok"])) channels.push("TikTok");
  if (hasAny(allText, ["facebook"])) channels.push("Facebook");
  if (hasAny(allText, ["google"])) channels.push("Google");
  if (hasAny(allText, ["email"])) channels.push("Email");
  if (hasAny(allText, ["whatsapp"])) channels.push("WhatsApp");
  if (hasAny(allText, ["agencies"])) channels.push("Agencies");
  if (hasAny(allText, ["referral", "referrals", "word of mouth"])) channels.push("Referrals");
  if (hasAny(allText, ["paid ads", "ads"])) channels.push("Paid Ads");

  if (channels.length) {
    profile.marketingChannels = [...new Set(channels)];
  } else if (hasAny(lastUserMessage, ["none", "nothing", "no marketing"])) {
    profile.marketingChannels = ["None"];
  }

  if (hasAny(allText, ["booking", "bookings", "appointments", "scheduling"])) {
    profile.automationNeed = "Bookings";
  } else if (hasAny(allText, ["follow up", "follow-up", "reminders"])) {
    profile.automationNeed = "Follow-ups";
  } else if (hasAny(allText, ["payments", "invoice", "invoicing"])) {
    profile.automationNeed = "Payments";
  } else if (hasAny(allText, ["emails", "email"])) {
    profile.automationNeed = "Emails";
  } else if (hasAny(allText, ["reports", "reporting"])) {
    profile.automationNeed = "Reports";
  } else if (hasAny(allText, ["lead management", "crm", "customer management", "contacts", "customer messages"])) {
    profile.automationNeed = "Lead Management";
  } else if (hasAny(allText, ["tasks", "task management", "to do"])) {
    profile.automationNeed = "Tasks";
  } else if (hasAny(allText, ["manual", "spreadsheets", "excel", "workflow"])) {
    profile.automationNeed = "Workflow Automation";
  }

  if (hasAny(allText, ["beginner", "not good with tech", "not technical"])) {
    profile.techComfort = "Beginner";
  } else if (hasAny(allText, ["intermediate", "average", "somewhat comfortable"])) {
    profile.techComfort = "Intermediate";
  } else if (hasAny(allText, ["advanced", "very comfortable", "technical", "developer"])) {
    profile.techComfort = "Advanced";
  }

  return profile;
};