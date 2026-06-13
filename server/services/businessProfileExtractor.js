export const extractBusinessProfile = (messages = []) => {
  const userMessages = messages
    .filter((msg) => msg.role === "user")
    .map((msg) => msg.content.toLowerCase().trim());

  const text = userMessages.join(" ");
  const lastUserMessage = userMessages[userMessages.length - 1] || "";
  const firstUserMessage = userMessages[0] || "";

  const profile = {
  businessType: null,
  goal: null,
  leadSource: null,
  websiteStatus: null,
  websiteUrl: null,
  automationNeed: null,

  biggestChallenge: null,
  teamSize: null,
  businessAge: null,
  monthlyCustomers: null,
  websiteGoal: null,
};

  // =========================
  // BUSINESS TYPE
  // =========================

  const businessTypes = [
    {
      label: "Cleaning Business",
      keywords: ["cleaning", "cleaner", "janitorial", "housekeeping"],
    },
    {
      label: "Barbing / Salon Business",
      keywords: ["barber", "barbing", "salon", "haircut", "hair", "braids"],
    },
    {
      label: "Restaurant / Food Business",
      keywords: ["restaurant", "food", "catering", "bakery", "kitchen", "meal"],
    },
    {
      label: "E-commerce Business",
      keywords: ["ecommerce", "e-commerce", "online store", "shopify", "dropshipping"],
    },
    {
      label: "Clothing / Fashion Business",
      keywords: ["clothing", "fashion", "apparel", "boutique", "wears", "clothes"],
    },
    {
      label: "Real Estate Business",
      keywords: ["real estate", "realtor", "property", "housing", "mortgage"],
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
      keywords: ["photography", "photographer", "photo", "video", "videography"],
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
      keywords: ["consulting", "consultant", "coach", "coaching", "advisor"],
    },
    {
      label: "Healthcare / Care Service Business",
      keywords: ["healthcare", "care", "clinic", "home care", "nursing", "therapy"],
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
      keywords: ["software", "saas", "tech", "app", "web app", "technology"],
    },
    {
      label: "Event / Entertainment Business",
      keywords: ["event", "dj", "party", "wedding", "entertainment"],
    },
    {
      label: "Nonprofit / Community Organization",
      keywords: ["nonprofit", "ngo", "charity", "community organization"],
    },
  ];

  const matchedBusiness = businessTypes.find((business) =>
    business.keywords.some((keyword) => text.includes(keyword))
  );

  if (matchedBusiness) {
    profile.businessType = matchedBusiness.label;
  } else if (firstUserMessage.length > 2) {
    profile.businessType =
      firstUserMessage.charAt(0).toUpperCase() + firstUserMessage.slice(1);
  }

  // =========================
  // GOAL
  // =========================

  if (
    text.includes("more customers") ||
    text.includes("more clients") ||
    text.includes("get customers") ||
    text.includes("getting more customers") ||
    text.includes("increase customers") ||
    text.includes("more leads") ||
    text.includes("lead generation") ||
    text.includes("increase sales") ||
    text.includes("grow sales")
  ) {
    profile.goal = "Get More Customers";
  } else if (
    text.includes("seo") ||
    text.includes("rank on google") ||
    text.includes("google ranking") ||
    text.includes("search engine")
  ) {
    profile.goal = "Improve SEO";
  } else if (
    text.includes("improve my website") ||
    text.includes("improve website") ||
    text.includes("website audit") ||
    text.includes("better website") ||
    text.includes("redesign website") ||
    text.includes("fix my website")
  ) {
    profile.goal = "Improve Website";
  } else if (
    text.includes("business systems") ||
    text.includes("business system") ||
    text.includes("systems") ||
    text.includes("operations") ||
    text.includes("workflow") ||
    text.includes("process")
  ) {
    profile.goal = "Improve Business Systems";
  } else if (
    text.includes("automation") ||
    text.includes("automate") ||
    text.includes("save time")
  ) {
    profile.goal = "Automate Business";
  } else if (
    text.includes("branding") ||
    text.includes("brand")
  ) {
    profile.goal = "Improve Branding";
  } else if (
    text.includes("marketing") ||
    text.includes("advertising")
  ) {
    profile.goal = "Improve Marketing";
  } else if (
    lastUserMessage.length > 2 &&
    userMessages.length >= 2 &&
    !profile.goal
  ) {
    profile.goal =
      lastUserMessage.charAt(0).toUpperCase() + lastUserMessage.slice(1);
  }

  // =========================
  // LEAD SOURCE
  // =========================

  if (
    text.includes("google ads") ||
    text.includes("facebook ads") ||
    text.includes("instagram ads") ||
    text.includes("paid ads")
  ) {
    profile.leadSource = "Paid Ads";
  } else if (
    text.includes("referrals") ||
    text.includes("referral") ||
    text.includes("word of mouth") ||
    text.includes("recommendations")
  ) {
    profile.leadSource = "Referrals";
  } else if (
    text.includes("social media") ||
    text.includes("instagram") ||
    text.includes("facebook") ||
    text.includes("tiktok") ||
    text.includes("linkedin")
  ) {
    profile.leadSource = "Social Media";
  } else if (
    text.includes("walk-in") ||
    text.includes("walk ins") ||
    text.includes("walkins") ||
    text.includes("physical store")
  ) {
    profile.leadSource = "Walk-ins";
  } else if (
    text.includes("google") ||
    text.includes("google search") ||
    text.includes("search")
  ) {
    profile.leadSource = "Google";
  } else if (
    text.includes("website")
  ) {
    profile.leadSource = "Website";
  } else if (
    text.includes("none") ||
    text.includes("not getting") ||
    text.includes("no customers")
  ) {
    profile.leadSource = "No Clear Lead Source";
  }

  // =========================
  // WEBSITE STATUS
  // =========================

  const noWebsitePhrases = [
    "no website",
    "don't have a website",
    "dont have a website",
    "do not have a website",
    "without a website",
    "i do not have any website",
    "i don't have any website",
    "not yet",
  ];

  const hasWebsitePhrases = [
    "i have a website",
    "we have a website",
    "my website is",
    "our website is",
    "website is",
    "www.",
    "http://",
    "https://",
    ".com",
    ".ca",
    ".net",
    ".org",
    ".app",
".dev",
".ai",
".site",
".online",
".store",".biz",".info"
  ];

  if (noWebsitePhrases.some((phrase) => text.includes(phrase))) {
    profile.websiteStatus = "No Website";
  } else if (hasWebsitePhrases.some((phrase) => text.includes(phrase))) {
    profile.websiteStatus = "Has Website";
  } else if (
    lastUserMessage === "yes" ||
    lastUserMessage === "yeah" ||
    lastUserMessage === "yes i do" ||
    lastUserMessage === "yes we do"
  ) {
    profile.websiteStatus = "Has Website";
  } else if (
    lastUserMessage === "no" ||
    lastUserMessage === "nope" ||
    lastUserMessage === "not yet"
  ) {
    profile.websiteStatus = "No Website";
  }
const urlMatch = text.match(
  /(https?:\/\/[^\s]+|www\.[^\s]+|[a-z0-9-]+\.(com|ca|net|org|co|io|app|dev|ai|site|online|store|biz|info)[^\s]*)/i
);

if (urlMatch) {
  profile.websiteUrl = urlMatch[0];
  profile.websiteStatus = "Has Website";
}

  // =========================
  // AUTOMATION NEED
  // =========================

  if (
    text.includes("booking") ||
    text.includes("bookings") ||
    text.includes("appointments") ||
    text.includes("manual") ||
    text.includes("follow up") ||
    text.includes("follow-up") ||
    text.includes("emails") ||
    text.includes("reports") ||
    text.includes("payments") ||
    text.includes("lead management") ||
    text.includes("customer management") ||
    text.includes("crm") ||
    text.includes("invoice") ||
    text.includes("invoicing") ||
    text.includes("reminders") ||
    text.includes("scheduling") ||
    text.includes("forms") ||
    text.includes("spreadsheets") ||
    text.includes("excel")
  ) {
    profile.automationNeed = "Workflow Automation";
  } else if (
    lastUserMessage.length > 2 &&
    userMessages.length >= 5 &&
    !profile.automationNeed
  ) {
    profile.automationNeed =
      lastUserMessage.charAt(0).toUpperCase() + lastUserMessage.slice(1);
  }
// BIGGEST CHALLENGE

const challengeKeywords = [
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
];

const challengeMatch = challengeKeywords.find((keyword) =>
  lastUserMessage.includes(keyword)
);

if (challengeMatch && !profile.biggestChallenge) {
  profile.biggestChallenge = lastUserMessage;
}


const customerMatch = lastUserMessage.match(/\d+/);

if (
  customerMatch &&
  !profile.monthlyCustomers &&
  userMessages.length > 5
) {
  profile.monthlyCustomers = parseInt(customerMatch[0]);
}

if (
  lastUserMessage.match(/^\d+$/) &&
  !profile.teamSize &&
  profile.monthlyCustomers
) {
  profile.teamSize = parseInt(lastUserMessage);
}

if (
  lastUserMessage.includes("year") ||
  lastUserMessage.includes("month")
) {
  profile.businessAge = lastUserMessage;
}

const websiteGoals = [
  "call",
  "book",
  "buy",
  "quote",
  "contact",
];

const websiteGoalMatch = websiteGoals.find((goal) =>
  lastUserMessage.includes(goal)
);

if (websiteGoalMatch) {
  profile.websiteGoal = websiteGoalMatch;
}


  return profile;
};