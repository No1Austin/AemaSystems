// server/services/industryInsightsService.js

const text = (value = "") => String(value || "").toLowerCase().trim();

const normalizeText = (value = "") =>
  text(value)
    .replace(/[^\w\s/+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const hasAny = (value = "", words = []) => {
  const clean = normalizeText(value);

  return words.some((word) => {
    const keyword = normalizeText(word);
    if (!keyword) return false;

    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|\\s)${escaped}(\\s|$)`, "i");

    return regex.test(clean);
  });
};

const buildIndustry = ({
  industry,
  overview,
  strengths = [],
  challenges = [],
  marketing = [],
  automation = [],
  kpis = [],
}) => ({
  industry,
  overview,
  strengths,
  typicalChallenges: challenges,
  recommendedMarketing: marketing,
  recommendedAutomation: automation,
  recommendedKPIs: kpis,

  opportunities: [
    "Improve customer acquisition.",
    "Increase customer retention.",
    "Strengthen operational efficiency.",
    "Measure business performance consistently.",
  ],

  risks: [
    "Poor follow-up reduces conversions.",
    "Manual operations reduce scalability.",
    "Weak online presence limits growth.",
  ],
});

const INDUSTRY_PROFILES = [
  {
    industry: "Pharmacy / Retail Health",
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
    overview:
      "Pharmacy and retail health businesses grow through trust, convenience, product availability, local visibility, and repeat customer relationships.",
    strengths: [
      "High repeat customer potential.",
      "Strong local trust opportunities.",
      "Broad customer demand.",
    ],
    challenges: [
      "Customer wait times.",
      "Inventory availability.",
      "Review management.",
      "Customer follow-up.",
    ],
    marketing: ["Google Business", "Local SEO", "Google Reviews", "Paid Search"],
    automation: [
      "Customer follow-up",
      "Inventory reminders",
      "Lead tracking",
      "Task management",
    ],
    kpis: [
      "Monthly Customers",
      "Repeat Customers",
      "Google Rating",
      "Review Count",
      "Customer Retention",
    ],
  },

  {
    industry: "Barbering / Grooming",
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
    overview:
      "Barbering and grooming businesses grow through repeat appointments, referrals, reviews, and customer relationships.",
    strengths: ["Repeat customers.", "Strong referrals."],
    challenges: ["Missed appointments.", "Customer retention."],
    marketing: ["Instagram", "Google Reviews", "Local SEO"],
    automation: ["Appointment reminders", "Booking System", "Customer follow-up"],
    kpis: ["Bookings", "Repeat Clients", "No-show Rate"],
  },

  {
    industry: "Beauty / Spa Services",
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
    overview:
      "Beauty and spa businesses grow through visual proof, customer trust, repeat appointments, referrals, and strong online reputation.",
    strengths: ["Strong visual marketing potential.", "Repeat customer potential."],
    challenges: ["Customer retention.", "Appointment consistency.", "Trust signals."],
    marketing: ["Instagram", "TikTok", "Google Reviews", "Local SEO"],
    automation: ["Booking reminders", "Customer follow-up", "Review requests"],
    kpis: ["Bookings", "Repeat Clients", "Average Spend", "Reviews"],
  },

  {
    industry: "Cleaning Services",
    priority: 80,
    keywords: ["cleaning", "cleaner", "janitorial", "maid", "housekeeping"],
    overview:
      "Cleaning businesses grow through recurring contracts, referrals, local SEO, trust, and reliable scheduling.",
    strengths: ["Recurring revenue potential.", "Strong referral opportunities."],
    challenges: ["Scheduling.", "Staff coordination.", "Generating recurring customers."],
    marketing: ["Local SEO", "Google Reviews", "Referral Marketing"],
    automation: ["Booking automation", "Scheduling", "Customer reminders"],
    kpis: ["Monthly Contracts", "Quote Conversion", "Customer Retention"],
  },

  {
    industry: "Food / Restaurant",
    priority: 80,
    keywords: ["restaurant", "food", "catering", "meal", "kitchen", "chef", "bakery"],
    overview:
      "Food businesses depend on local visibility, convenience, customer reviews, repeat orders, and consistent service quality.",
    strengths: ["Repeat purchase potential.", "Local customer demand."],
    challenges: ["Competition.", "Delivery logistics.", "Customer retention."],
    marketing: ["Google Business", "Instagram", "Local SEO"],
    automation: ["Online Ordering", "Customer Loyalty", "Booking"],
    kpis: ["Orders", "Repeat Orders", "Average Spend"],
  },

  {
    industry: "Clothing / Fashion",
    priority: 80,
    keywords: ["fashion", "clothing", "boutique", "apparel", "wear"],
    overview:
      "Fashion businesses grow through visual branding, customer trust, repeat purchases, and strong online shopping experiences.",
    strengths: [
      "High repeat purchase potential.",
      "Strong visual marketing opportunities.",
      "Referral opportunities.",
    ],
    challenges: [
      "Customer trust.",
      "Product differentiation.",
      "Inventory management.",
      "Abandoned purchases.",
    ],
    marketing: ["Instagram", "TikTok", "Influencer Marketing", "Email Marketing"],
    automation: [
      "Customer follow-up",
      "Inventory management",
      "Order tracking",
      "Email automation",
    ],
    kpis: [
      "Conversion Rate",
      "Average Order Value",
      "Repeat Customers",
      "Customer Lifetime Value",
    ],
  },

  {
    industry: "Digital Services",
    priority: 80,
    keywords: ["software", "website", "seo", "automation", "digital", "ai", "saas"],
    overview:
      "Digital service businesses scale through expertise, recurring clients, referrals, content marketing, and operational efficiency.",
    strengths: ["High scalability.", "Recurring revenue opportunities."],
    challenges: ["Standing out.", "Generating qualified leads."],
    marketing: ["SEO", "LinkedIn", "Content Marketing"],
    automation: ["CRM", "Lead Automation", "Proposal Tracking"],
    kpis: ["Qualified Leads", "Monthly Revenue", "Recurring Clients"],
  },
];

const buildDescription = (profile = {}, identity = {}) =>
  normalizeText(`
    ${profile.businessName || ""}
    ${profile.businessType || ""}
    ${profile.mainOffer || ""}
    ${profile.businessDescription || ""}
    ${profile.industry || ""}
    ${identity.industry || ""}
    ${identity.businessType || ""}
    ${identity.mainOffer || ""}
  `);

const findBestIndustry = (description = "") => {
  const matches = INDUSTRY_PROFILES.map((item) => {
    const score = item.keywords.reduce(
      (total, keyword) => (hasAny(description, [keyword]) ? total + 1 : total),
      0
    );

    return {
      item,
      score,
      weightedScore: score * item.priority,
    };
  })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.weightedScore - a.weightedScore);

  return matches[0]?.item || null;
};

export const generateIndustryInsights = (profile = {}, identity = {}) => {
  const description = buildDescription(profile, identity);
  const matchedIndustry = findBestIndustry(description);

  if (!matchedIndustry) {
    return buildIndustry({
      industry: identity.industry || profile.industry || null,
      overview:
        "The business can improve performance by attracting the right customers, converting interest consistently, delivering quality service, and strengthening operations with measurable systems.",
      strengths: ["Growth opportunities exist."],
      challenges: ["Customer acquisition.", "Operational consistency."],
      marketing: ["SEO", "Referral Marketing", "Social Media"],
      automation: ["Task Management", "Customer Follow-up", "Workflow Automation"],
      kpis: ["Leads", "Sales", "Customer Retention"],
    });
  }

  return buildIndustry(matchedIndustry);
};

export const getIndustryProfiles = () => [...INDUSTRY_PROFILES];