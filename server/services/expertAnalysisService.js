// server/services/expertAnalysisService.js

const text = (value = "") => String(value || "").toLowerCase().trim();

const hasAny = (value = "", words = []) => {
  const clean = text(value);
  return words.some((word) => clean.includes(text(word)));
};

const listHasAny = (value = [], words = []) => {
  const items = Array.isArray(value) ? value : [value];
  return items.some((item) => hasAny(item, words));
};

const addUnique = (list, item, key = null) => {
  const exists = key
    ? list.some((existing) => existing[key] === item[key])
    : list.includes(item);

  if (!exists) list.push(item);
};

export const generateExpertAnalysis = ({
  profile = {},
  blueprint = {},
  websiteAudit = null,
  industryInsights = {},
  businessPatterns = [],
  scoring = {},
}) => {
  const consultantSummary = [];
  const gapAnalysis = [];
  const strategicOpportunities = [];
  const priorityActions = [];
  const expectedOutcomes = [];

  const location = profile.serviceLocation || "the target market";
  const industry =
    industryInsights.industry || profile.industry || profile.businessType || "the business category";

  const hasWebsite = profile.websiteStatus === "Has Website";
  const noWebsite = profile.websiteStatus === "No Website";

  const earlyStage =
    hasAny(profile.businessStage, ["idea", "less than 1 year"]) ||
    hasAny(profile.monthlyCustomers, ["under 20"]);

  const growthStage =
    hasAny(profile.monthlyCustomers, ["20-100", "100-500", "500+"]) ||
    hasAny(profile.monthlyRevenue, ["2k", "10k", "50k"]);

  const manualSales =
    hasAny(profile.salesProcess, ["whatsapp", "dm", "message", "manual", "phone"]) ||
    listHasAny(profile.marketingChannels, ["whatsapp"]);

  const needsCustomers =
    hasAny(profile.goal, ["customer", "lead", "sale", "marketing"]) ||
    hasAny(profile.biggestChallenge, ["customer", "lead", "sale", "marketing"]);

  const needsAutomation =
    hasAny(profile.goal, ["automation", "automate", "operations", "systems"]) ||
    hasAny(profile.automationNeed, [
      "booking",
      "follow",
      "lead",
      "message",
      "contact",
      "task",
      "workflow",
      "payment",
      "email",
      "report",
    ]);

  consultantSummary.push(
    `${profile.businessType || "The business"} shows growth potential, but the current operating model should be strengthened across acquisition, conversion, operations, and performance tracking.`
  );

  if (profile.goal) {
    consultantSummary.push(
      `The main stated goal is ${profile.goal}, so the blueprint should focus on actions that directly improve this outcome rather than general business activity.`
    );
  }

  if (profile.leadSource) {
    consultantSummary.push(
      `Customer acquisition currently depends heavily on ${profile.leadSource}, which creates an opportunity to improve channel consistency and reduce over-dependence on one source.`
    );
  }

  if (hasWebsite) {
    consultantSummary.push(
      "The existing website provides a useful digital foundation, but it should be treated as a measurable conversion asset with clear calls-to-action, trust signals, and lead capture."
    );
  }

  if (noWebsite) {
    consultantSummary.push(
      "The absence of a dedicated website creates a strategic gap in credibility, search visibility, and structured lead capture."
    );
  }

  if (earlyStage) {
    consultantSummary.push(
      "The business appears to be in an early growth stage, so the first priority should be validating customer demand, clarifying the offer, and creating a repeatable customer acquisition process."
    );
  }

  if (growthStage) {
    consultantSummary.push(
      "The business shows signs of growth activity, so the next priority is improving systems, reporting, customer follow-up, and repeatable execution."
    );
  }

  if (businessPatterns.length) {
    consultantSummary.push(businessPatterns[0]);
  }

  addUnique(
    gapAnalysis,
    {
      area: "Customer Acquisition",
      currentState: profile.leadSource
        ? `The business currently receives customers primarily through ${profile.leadSource}.`
        : "The main customer acquisition source is not clearly defined.",
      desiredState:
        "A measurable acquisition system supported by clear channels, trust signals, lead capture, follow-up, and conversion tracking.",
      gap:
        "The business needs better visibility into which channels produce leads, which leads convert, and where prospects drop off.",
    },
    "area"
  );

  addUnique(
    gapAnalysis,
    {
      area: "Website & Conversion",
      currentState: hasWebsite
        ? `The business has a website${profile.websiteUrl ? ` at ${profile.websiteUrl}` : ""}.`
        : "The business does not currently have a website.",
      desiredState:
        "A conversion-focused digital presence with clear messaging, calls-to-action, trust elements, and lead capture systems.",
      gap: hasWebsite
        ? "The website should be optimized for SEO, user experience, lead capture, and conversion performance."
        : "The business needs a website that can support credibility, search visibility, and customer acquisition.",
    },
    "area"
  );

  addUnique(
    gapAnalysis,
    {
      area: "Sales Process",
      currentState: profile.salesProcess
        ? `The current sales process is ${profile.salesProcess}.`
        : "The sales process is not clearly documented.",
      desiredState:
        "A repeatable sales process that tracks inquiries, follow-ups, conversion rates, and customer outcomes.",
      gap: manualSales
        ? "Manual sales conversations should be supported by saved replies, lead tracking, reminders, and clear next steps."
        : "The business needs clearer sales process documentation and better tracking between inquiry and purchase.",
    },
    "area"
  );

  addUnique(
    gapAnalysis,
    {
      area: "Operations & Automation",
      currentState: profile.automationNeed
        ? `The main automation need is ${profile.automationNeed}.`
        : "Automation needs have not been clearly identified.",
      desiredState:
        "A structured operating system where repetitive tasks, lead follow-ups, bookings, customer records, and internal actions are tracked and automated where possible.",
      gap:
        "The business should reduce manual dependency and create operational consistency through systems and task management.",
    },
    "area"
  );

  if (noWebsite) {
    addUnique(
      strategicOpportunities,
      {
        priority: "High",
        opportunity: "Build a conversion-focused website",
        rationale:
          "A website would improve credibility, search visibility, structured lead capture, and customer trust.",
        recommendedAemaSupport:
  "Workflow Automation, CRM Setup, AEMA TaskFlow",
      },
      "opportunity"
    );
  }

  if (hasWebsite) {
    addUnique(
      strategicOpportunities,
      {
        priority: "High",
        opportunity: "Optimize the website for conversion",
        rationale:
          "The website should guide visitors toward clear actions such as booking, calling, buying, contacting, joining a list, or requesting a quote.",
        recommendedAemaSupport:
          "Website Audit, SEO Optimization, Conversion Optimization",
      },
      "opportunity"
    );
  }

  if (profile.leadSource === "Google") {
    addUnique(
      strategicOpportunities,
      {
        priority: "High",
        opportunity: `Strengthen local search performance in ${location}`,
        rationale:
          "Google is already part of the acquisition journey, so improving rankings, reviews, local pages, and calls-to-action can produce faster gains.",
        recommendedAemaSupport:
          "Local SEO, Google Business Profile Optimization, Review Strategy",
      },
      "opportunity"
    );
  }

  if (profile.leadSource === "Referrals") {
    addUnique(
      strategicOpportunities,
      {
        priority: "High",
        opportunity: "Turn referrals into a repeatable growth system",
        rationale:
          "Referral-based businesses already have trust. The next step is converting that trust into reviews, testimonials, introductions, and repeatable follow-up.",
        recommendedAemaSupport:
          "Review Automation, Referral System, CRM Follow-up",
      },
      "opportunity"
    );
  }

  if (
    profile.leadSource === "Social Media" ||
    listHasAny(profile.marketingChannels, ["instagram", "facebook", "tiktok"])
  ) {
    addUnique(
      strategicOpportunities,
      {
        priority: "Medium",
        opportunity: "Turn social attention into a structured sales funnel",
        rationale:
          "Social engagement should connect to a clear customer journey, lead capture process, and follow-up system.",
        recommendedAemaSupport:
          "Social Funnel Strategy, Landing Page, CRM Workflow",
      },
      "opportunity"
    );
  }

  if (manualSales || needsAutomation) {
    addUnique(
      strategicOpportunities,
      {
        priority: "High",
        opportunity: "Implement lead tracking and follow-up automation",
        rationale:
          "Manual inquiry handling can reduce conversion consistency and make it difficult to know which leads were lost.",
        recommendedAemaSupport:
           "Workflow Automation, CRM Setup, AEMA TaskFlow",
      },
      "opportunity"
    );
  }

  if (earlyStage && needsCustomers) {
    addUnique(
      strategicOpportunities,
      {
        priority: "High",
        opportunity: "Create a first-customer acquisition system",
        rationale:
          "Early-stage businesses need a simple, focused system for turning attention into paying customers before scaling expenses.",
        recommendedAemaSupport:
          "Lead Generation Strategy, Offer Positioning, Sales Funnel Setup",
      },
      "opportunity"
    );
  }

  addUnique(
    strategicOpportunities,
    {
      priority: "Medium",
      opportunity: "Use AEMA TaskFlow to manage implementation",
      rationale:
        "Recommendations only create value when they are converted into tasks, deadlines, owners, and progress tracking.",
      recommendedAemaSupport: "AEMA TaskFlow",
    },
    "opportunity"
  );

  priorityActions.push(
    "Review the current customer journey from first discovery to final purchase or booking.",
    "Identify where potential customers drop off before converting.",
    hasWebsite
      ? "Improve website messaging, trust signals, calls-to-action, and lead capture."
      : "Create a simple website or landing page that explains the offer and captures leads.",
    "Set up a simple lead tracking and follow-up workflow.",
    "Use AEMA TaskFlow to convert recommendations into measurable tasks."
  );

  if (websiteAudit?.recommendations?.length) {
    priorityActions.push(...websiteAudit.recommendations.slice(0, 3));
  }

  expectedOutcomes.push(
    "Improved clarity around the business growth bottlenecks.",
    "Stronger lead capture and follow-up consistency.",
    "Better alignment between marketing channels and conversion systems.",
    "Improved ability to track business performance and implementation progress."
  );

  if (needsAutomation) {
    expectedOutcomes.push(
      "Reduced manual workload through clearer workflows, task ownership, reminders, and automation."
    );
  }

  if (needsCustomers) {
    expectedOutcomes.push(
      "A more consistent path for turning attention, referrals, or website traffic into paying customers."
    );
  }

  const ninetyDayRoadmap = [
    {
      period: "Month 1 — Stabilize",
      actions: [
        "Audit website, marketing channels, customer journey, and sales process.",
        "Fix obvious conversion gaps such as unclear messaging, weak calls-to-action, missing trust signals, or missing follow-up steps.",
        "Document the current process from lead generation to purchase or booking.",
      ],
    },
    {
      period: "Month 2 — Optimize",
      actions: [
        "Improve SEO, local positioning, trust signals, service/product pages, and lead capture systems.",
        "Introduce structured follow-up workflows for inquiries.",
        "Begin tracking KPIs such as leads, conversions, source of leads, response time, and completed tasks.",
      ],
    },
    {
      period: "Month 3 — Scale",
      actions: [
        "Expand the strongest acquisition channels.",
        "Automate repetitive workflows where possible.",
        "Use AEMA TaskFlow or a CRM workflow to manage growth execution and accountability.",
      ],
    },
  ];

  if (scoring?.growthScore) {
    consultantSummary.push(
      `The current growth score is ${scoring.growthScore}/100, which should be used as a baseline for measuring improvement after implementation.`
    );
  }

  return {
    title: "AEMA Expert Strategic Analysis",
    consultantSummary,
    gapAnalysis,
    strategicOpportunities,
    ninetyDayRoadmap,
    priorityActions: [...new Set(priorityActions)],
    expectedOutcomes: [...new Set(expectedOutcomes)],
    industryContext: industry,
    locationContext: location,
  };
};