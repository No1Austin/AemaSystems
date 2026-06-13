const text = (value = "") => String(value || "").toLowerCase();

const hasAny = (value = "", words = []) => {
  const clean = text(value);
  return words.some((word) => clean.includes(word));
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
  const industry = industryInsights.industry || "the business category";

  consultantSummary.push(
    `${profile.businessType || "The business"} shows growth potential, but the current operating model requires stronger structure across marketing, conversion, automation, and performance tracking.`
  );

  if (profile.leadSource) {
    consultantSummary.push(
      `Customer acquisition currently depends heavily on ${profile.leadSource}, which creates an opportunity to strengthen conversion systems and reduce channel dependency.`
    );
  }

  if (profile.websiteStatus === "Has Website") {
    consultantSummary.push(
      "The existing website provides a digital foundation, but it should be treated as a conversion asset rather than only an online presence."
    );
  } else {
    consultantSummary.push(
      "The absence of a dedicated website creates a strategic gap in credibility, SEO visibility, and structured lead capture."
    );
  }

  if (businessPatterns.length) {
    consultantSummary.push(businessPatterns[0]);
  }

  // Gap Analysis
  gapAnalysis.push({
    area: "Customer Acquisition",
    currentState: profile.leadSource
      ? `The business currently receives customers primarily through ${profile.leadSource}.`
      : "The main customer acquisition source is not clearly defined.",
    desiredState:
      "A diversified acquisition system supported by measurable marketing channels, strong local visibility, trust signals, and conversion tracking.",
    gap:
      "The business needs stronger visibility into which channels produce leads, which leads convert, and where prospects drop off.",
  });

  gapAnalysis.push({
    area: "Website & Conversion",
    currentState:
      profile.websiteStatus === "Has Website"
        ? `The business has a website${profile.websiteUrl ? ` at ${profile.websiteUrl}` : ""}.`
        : "The business does not currently have a website.",
    desiredState:
      "A conversion-focused digital presence with clear messaging, calls-to-action, trust elements, and lead capture systems.",
    gap:
      profile.websiteStatus === "Has Website"
        ? "The website should be optimized for SEO, user experience, lead capture, and conversion performance."
        : "The business needs a website that can support credibility, search visibility, and customer acquisition.",
  });

  gapAnalysis.push({
    area: "Sales Process",
    currentState: profile.salesProcess
      ? `The current sales process is ${profile.salesProcess}.`
      : "The sales process is not clearly documented.",
    desiredState:
      "A repeatable sales process that tracks inquiries, follow-ups, conversion rates, and customer outcomes.",
    gap:
      "The business needs clearer sales process documentation and better tracking between inquiry and purchase.",
  });

  gapAnalysis.push({
    area: "Operations & Automation",
    currentState: profile.automationNeed
      ? `The main automation need is ${profile.automationNeed}.`
      : "Automation needs have not been clearly identified.",
    desiredState:
      "A structured operating system where repetitive tasks, lead follow-ups, bookings, and internal actions are tracked and automated where possible.",
    gap:
      "The business should reduce manual dependency and create operational consistency through systems and task management.",
  });

  // Strategic Opportunities
  if (profile.websiteStatus === "No Website") {
    strategicOpportunities.push({
      priority: "High",
      opportunity: "Build a conversion-focused website",
      rationale:
        "A website would improve credibility, search visibility, and structured lead capture.",
      recommendedAemaSupport: "Website Development, SEO Setup, Conversion Strategy",
    });
  }

  if (profile.websiteStatus === "Has Website") {
    strategicOpportunities.push({
      priority: "High",
      opportunity: "Optimize the website for conversion",
      rationale:
        "The website should guide visitors toward clear actions such as booking, calling, buying, or requesting a quote.",
      recommendedAemaSupport: "Website Audit, SEO Optimization, Conversion Optimization",
    });
  }

  if (profile.leadSource === "Google") {
    strategicOpportunities.push({
      priority: "High",
      opportunity: `Strengthen local search performance in ${location}`,
      rationale:
        "Google is already part of the acquisition journey, so improving rankings, reviews, local pages, and calls-to-action can produce faster gains.",
      recommendedAemaSupport: "Local SEO, Google Business Profile Optimization, Review Strategy",
    });
  }

  if (
    profile.leadSource === "Social Media" ||
    hasAny(profile.marketingChannels, ["instagram", "facebook", "tiktok"])
  ) {
    strategicOpportunities.push({
      priority: "Medium",
      opportunity: "Turn social attention into a structured sales funnel",
      rationale:
        "Social engagement must be connected to a clear customer journey, lead capture process, and follow-up system.",
      recommendedAemaSupport: "Social Funnel Strategy, Landing Page, CRM Workflow",
    });
  }

  if (
    hasAny(profile.salesProcess, ["whatsapp", "dm", "message", "manual"]) ||
    hasAny(profile.automationNeed, ["follow", "lead", "message"])
  ) {
    strategicOpportunities.push({
      priority: "High",
      opportunity: "Implement lead tracking and follow-up automation",
      rationale:
        "Manual inquiry handling can reduce conversion consistency and make it difficult to know which leads were lost.",
      recommendedAemaSupport: "Workflow Automation, CRM Setup, AEMA Task Manager",
    });
  }

  strategicOpportunities.push({
    priority: "Medium",
    opportunity: "Use AEMA Task Manager to manage implementation",
    rationale:
      "Recommendations only create value when they are converted into tasks, deadlines, owners, and progress tracking.",
    recommendedAemaSupport: "AEMA Task Manager",
  });

  // Priority Actions
  priorityActions.push(
    "Review the current customer journey from first discovery to final purchase or booking.",
    "Identify where potential customers drop off before converting.",
    "Improve website messaging, trust signals, and calls-to-action.",
    "Set up a simple lead tracking and follow-up workflow.",
    "Use AEMA Task Manager to convert recommendations into measurable tasks."
  );

  if (websiteAudit?.recommendations?.length) {
    priorityActions.push(...websiteAudit.recommendations.slice(0, 3));
  }

  // Expected Outcomes
  expectedOutcomes.push(
    "Improved clarity around the business growth bottlenecks.",
    "Stronger lead capture and follow-up consistency.",
    "Better alignment between marketing channels and conversion systems.",
    "Improved ability to track business performance and implementation progress."
  );

  const ninetyDayRoadmap = [
    {
      period: "Month 1 — Stabilize",
      actions: [
        "Audit website, marketing channels, customer journey, and sales process.",
        "Fix the most obvious conversion gaps such as unclear messaging, weak calls-to-action, or missing follow-up steps.",
        "Document the current process from lead generation to purchase or booking.",
      ],
    },
    {
      period: "Month 2 — Optimize",
      actions: [
        "Improve SEO, local positioning, trust signals, service/product pages, and lead capture systems.",
        "Introduce structured follow-up workflows for inquiries.",
        "Begin tracking KPIs such as leads, conversions, source of leads, and completed tasks.",
      ],
    },
    {
      period: "Month 3 — Scale",
      actions: [
        "Expand the strongest acquisition channels.",
        "Automate repetitive workflows where possible.",
        "Use AEMA Task Manager or a CRM workflow to manage growth execution and accountability.",
      ],
    },
  ];

  return {
    title: "AEMA Expert Strategic Analysis",
    consultantSummary,
    gapAnalysis,
    strategicOpportunities,
    ninetyDayRoadmap,
    priorityActions,
    expectedOutcomes,
    industryContext: industry,
    locationContext: location,
  };
};