// server/services/industryInsightsService.js

const text = (value = "") =>
  String(value || "").toLowerCase().trim();

const hasAny = (value = "", words = []) => {
  const clean = text(value);
  return words.some((word) => clean.includes(text(word)));
};

const buildIndustry = (
  industry,
  overview,
  strengths,
  challenges,
  marketing,
  automation,
  kpis
) => ({
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

export const generateIndustryInsights = (
  profile = {},
  identity = {}
) => {
  const description = text(`
    ${profile.businessType || ""}
    ${profile.mainOffer || ""}
    ${profile.businessDescription || ""}
    ${identity.industry || ""}
  `);

  //------------------------------------------------
  // CLOTHING
  //------------------------------------------------

  if (
    hasAny(description, [
      "fashion",
      "clothing",
      "boutique",
      "apparel",
      "wear",
    ])
  ) {
    return buildIndustry(
      "Clothing / Fashion",

      "The fashion industry is highly competitive and strongly influenced by visual branding, customer trust, repeat purchases, and online shopping experiences.",

      [
        "High repeat purchase potential.",
        "Strong visual marketing opportunities.",
        "Easy referral opportunities.",
      ],

      [
        "Customer trust.",
        "Product differentiation.",
        "Inventory management.",
        "Abandoned purchases.",
      ],

      [
        "Instagram",
        "TikTok",
        "Influencer Marketing",
        "Email Marketing",
        "SEO",
      ],

      [
        "Customer follow-up",
        "Inventory management",
        "Order tracking",
        "Email automation",
      ],

      [
        "Conversion Rate",
        "Average Order Value",
        "Repeat Customers",
        "Customer Lifetime Value",
      ]
    );
  }

  //------------------------------------------------
  // CLEANING
  //------------------------------------------------

  if (hasAny(description, ["clean", "cleaning", "janitorial"])) {
    return buildIndustry(
      "Cleaning Services",

      "Cleaning businesses grow primarily through referrals, Google visibility, recurring contracts, and customer trust.",

      [
        "High recurring revenue potential.",
        "Strong referral opportunities.",
      ],

      [
        "Generating recurring customers.",
        "Scheduling.",
        "Staff coordination.",
      ],

      [
        "Local SEO",
        "Google Reviews",
        "Referral Marketing",
      ],

      [
        "Booking automation",
        "Scheduling",
        "Customer reminders",
      ],

      [
        "Monthly Contracts",
        "Quote Conversion",
        "Customer Retention",
      ]
    );
  }

  //------------------------------------------------
  // FOOD
  //------------------------------------------------

  if (
    hasAny(description, [
      "restaurant",
      "food",
      "catering",
      "bakery",
    ])
  ) {
    return buildIndustry(
      "Food / Restaurant",

      "Food businesses depend heavily on local visibility, convenience, customer reviews, and repeat orders.",

      [
        "Strong repeat purchase potential.",
        "Local customer base.",
      ],

      [
        "Competition.",
        "Delivery logistics.",
        "Customer retention.",
      ],

      [
        "Google Business",
        "Instagram",
        "Local SEO",
      ],

      [
        "Online Ordering",
        "Customer Loyalty",
        "Booking",
      ],

      [
        "Orders",
        "Repeat Orders",
        "Average Spend",
      ]
    );
  }

  //------------------------------------------------
  // BARBER
  //------------------------------------------------

  if (
    hasAny(description, [
      "barber",
      "salon",
      "beauty",
    ])
  ) {
    return buildIndustry(
      "Beauty / Salon",

      "Beauty businesses grow through repeat appointments, referrals, reviews, and customer relationships.",

      [
        "Repeat customers.",
        "Strong referrals.",
      ],

      [
        "Missed appointments.",
        "Customer retention.",
      ],

      [
        "Instagram",
        "Google Reviews",
      ],

      [
        "Appointment reminders",
        "Booking System",
      ],

      [
        "Bookings",
        "Repeat Clients",
        "No-show Rate",
      ]
    );
  }

  //------------------------------------------------
  // DIGITAL
  //------------------------------------------------

  if (
    hasAny(description, [
      "software",
      "website",
      "seo",
      "automation",
      "digital",
      "ai",
    ])
  ) {
    return buildIndustry(
      "Digital Services",

      "Digital businesses scale through expertise, recurring clients, referrals, content marketing, and operational efficiency.",

      [
        "High scalability.",
        "Recurring revenue opportunities.",
      ],

      [
        "Standing out.",
        "Generating qualified leads.",
      ],

      [
        "SEO",
        "LinkedIn",
        "Content Marketing",
      ],

      [
        "CRM",
        "Lead Automation",
        "Proposal Tracking",
      ],

      [
        "Qualified Leads",
        "Monthly Revenue",
        "Recurring Clients",
      ]
    );
  }

  //------------------------------------------------
  // DEFAULT
  //------------------------------------------------

  return buildIndustry(
    identity.industry || "General Business",

    "Every growing business succeeds by attracting customers, converting them consistently, delivering quality service, and improving operations through measurable systems.",

    [
      "Growth opportunities exist.",
    ],

    [
      "Customer acquisition.",
      "Operational consistency.",
    ],

    [
      "SEO",
      "Referral Marketing",
      "Social Media",
    ],

    [
      "Task Management",
      "Customer Follow-up",
      "Workflow Automation",
    ],

    [
      "Leads",
      "Sales",
      "Customer Retention",
    ]
  );
};