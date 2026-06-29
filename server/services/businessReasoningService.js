// server/services/businessReasoningService.js

const text = (value = "") => String(value || "").toLowerCase().trim();

const hasAny = (value = "", words = []) => {
  const clean = Array.isArray(value)
    ? value.map((item) => text(item)).join(" ")
    : text(value);

  return words.some((word) => clean.includes(text(word)));
};

const addUnique = (list, item) => {
  if (item && !list.includes(item)) list.push(item);
};

export const generateBusinessReasoning = ({
  profile = {},
  industryInsights = {},
  businessPatterns = [],
  scoring = {},
}) => {
  const strengths = [];
  const weaknesses = [];
  const risks = [];
  const marketingAnalysis = [];
  const automationAnalysis = [];
  const businessSystemsAnalysis = [];

  const businessPosition = [];
  const growthConstraints = [];
  const growthOpportunities = [];

  const industry =
    industryInsights.industry ||
    profile.industry ||
    profile.businessType ||
    "the business category";

  const location = profile.serviceLocation || "the target market";

  const hasWebsite = profile.websiteStatus === "Has Website";
  const noWebsite = profile.websiteStatus === "No Website";

  const manualSales = hasAny(profile.salesProcess, [
    "whatsapp",
    "dm",
    "message",
    "manual",
    "phone",
    "call",
  ]);

  const referralLed = profile.leadSource === "Referrals";
  const googleLed = profile.leadSource === "Google";
  const socialLed =
    profile.leadSource === "Social Media" ||
    hasAny(profile.marketingChannels, ["instagram", "facebook", "tiktok"]);

  const earlyStage =
    hasAny(profile.businessStage || profile.businessAge, [
      "idea",
      "less than 1 year",
    ]) || hasAny(profile.monthlyCustomers, ["under 20"]);

  // BUSINESS POSITION
  if (hasWebsite && googleLed) {
    businessPosition.push(
      "The business already has a digital foundation and receives acquisition potential through Google. The strongest opportunity is to improve how effectively website visitors become leads or paying customers."
    );
  } else if (hasWebsite && referralLed) {
    businessPosition.push(
      "The business has referral trust and an existing website. This creates a strong foundation, but the next step is turning private recommendations into public credibility through reviews, testimonials, SEO, and stronger lead capture."
    );
  } else if (noWebsite) {
    businessPosition.push(
      "The business lacks a dedicated digital hub. This limits credibility, search visibility, structured lead capture, and the ability to convert prospects outside referrals or social media."
    );
  } else {
    businessPosition.push(
      `${profile.businessType || "The business"} shows growth potential, but needs stronger structure across marketing, conversion, automation, and performance tracking.`
    );
  }

  if (profile.goal) {
    businessPosition.push(
      `The primary strategic goal is ${profile.goal}. The blueprint should therefore focus on actions that directly support this outcome.`
    );
  }

  if (scoring?.growthScore) {
    businessPosition.push(
      `The current growth score is ${scoring.growthScore}/100, which should be treated as a baseline for future improvement.`
    );
  }

  // STRENGTHS
  if (hasWebsite) {
    strengths.push(
      "The business already has a website, which creates a foundation for credibility, SEO, lead capture, and conversion improvement."
    );
  }

  if (googleLed) {
    strengths.push(
      "Google is already connected to customer acquisition, suggesting there may be existing market demand and search visibility."
    );
  }

  if (referralLed) {
    strengths.push(
      "Referral activity suggests the business has trust potential with existing customers or personal networks."
    );
  }

  if (profile.goal) {
    strengths.push(
      `The business has identified a clear strategic priority: ${profile.goal}.`
    );
  }

  if (profile.mainOffer) {
    strengths.push(
      `The business has a defined offer: ${profile.mainOffer}.`
    );
  }

  // WEAKNESSES / CONSTRAINTS
  if (noWebsite) {
    addUnique(
      growthConstraints,
      "The absence of a website limits trust-building, search visibility, structured lead capture, and conversion outside social media or referrals."
    );
  }

  if (hasWebsite && !profile.websiteGoal) {
    addUnique(
      growthConstraints,
      "The website exists, but the main conversion goal is unclear. Visitors should know whether to call, book, buy, request a quote, or contact the business."
    );
  }

  if (manualSales) {
    addUnique(
      growthConstraints,
      "The sales process appears dependent on manual communication, which can create inconsistent follow-up, weak tracking, and missed revenue opportunities."
    );
  }

  if (!profile.targetCustomers) {
    addUnique(
      growthConstraints,
      "The target customer segment is not clearly defined, which may weaken marketing accuracy, campaign messaging, and offer positioning."
    );
  }

  if (!profile.marketingChannels) {
    addUnique(
      growthConstraints,
      "Marketing channel usage is not clearly structured, making it difficult to evaluate which activities produce leads and sales."
    );
  }

  if (profile.websiteAudit?.recommendations?.length) {
    addUnique(
      growthConstraints,
      "The website audit identified optimization gaps that may reduce organic visibility, user trust, and conversion performance."
    );
  }

  weaknesses.push(...growthConstraints.slice(0, 5));

  // RISKS
  if (referralLed) {
    risks.push(
      "Relying heavily on referrals can make customer flow unpredictable unless reviews, follow-up, and repeatable referral systems are created."
    );
  }

  if (socialLed) {
    risks.push(
      "Depending heavily on social platforms can create visibility risk because reach, engagement, and algorithm behavior can change quickly."
    );
  }

  if (manualSales || hasAny(profile.automationNeed, ["manual", "booking", "follow", "lead", "message"])) {
    risks.push(
      "Manual operational processes may become a scalability risk as inquiry volume increases, especially if leads are not tracked through a repeatable workflow."
    );
  }

  if (!profile.monthlyCustomers) {
    risks.push(
      "Without clear monthly customer volume, it is difficult to measure growth performance, forecast demand, or evaluate campaign effectiveness."
    );
  }

  // OPPORTUNITIES
  if (hasWebsite) {
    growthOpportunities.push({
      title: "Turn the existing website into a stronger lead-generation system",
      priority: "High",
      rationale:
        "The website should guide visitors toward clear actions such as booking, calling, buying, contacting, or requesting a quote.",
    });
  }

  if (noWebsite) {
    growthOpportunities.push({
      title: "Build a conversion-focused website",
      priority: "High",
      rationale:
        "A website would improve credibility, SEO visibility, customer education, and structured lead capture.",
    });
  }

  if (referralLed) {
    growthOpportunities.push({
      title: "Convert referral trust into public online credibility",
      priority: "High",
      rationale:
        "Reviews, testimonials, referral requests, and local SEO can make referrals more scalable and visible.",
    });
  }

  if (socialLed) {
    growthOpportunities.push({
      title: "Connect social media to a measurable sales funnel",
      priority: "Medium-High",
      rationale:
        "Social content should lead prospects to a website, booking page, WhatsApp workflow, quote form, or product inquiry process.",
    });
  }

  if (manualSales || profile.automationNeed) {
    growthOpportunities.push({
      title: "Implement lead tracking and follow-up automation",
      priority: "High",
      rationale:
        "Manual inquiry handling can lose prospects. A structured workflow improves response time, tracking, and conversion.",
    });
  }

  if (earlyStage) {
    growthOpportunities.push({
      title: "Build a consistent customer acquisition system",
      priority: "High",
      rationale:
        "Early-stage businesses should focus on offer clarity, trust-building, customer acquisition, and simple systems before scaling expenses.",
    });
  }

  // MARKETING ANALYSIS
  marketingAnalysis.push(
    profile.leadSource
      ? `The current acquisition model is primarily linked to ${profile.leadSource}. This should be evaluated by how many prospects convert into paying customers, not only by visibility or inquiries.`
      : "The customer acquisition model is not clearly defined, which creates uncertainty around growth planning and marketing investment."
  );

  if (profile.serviceLocation) {
    marketingAnalysis.push(
      `Because the business serves ${location}, marketing should include location-specific positioning, local trust signals, and search terms that match how customers in that market look for providers.`
    );
  }

  if (profile.marketingChannels) {
    marketingAnalysis.push(
      `The current marketing channel mix includes ${
        Array.isArray(profile.marketingChannels)
          ? profile.marketingChannels.join(", ")
          : profile.marketingChannels
      }. These channels should be organized into a measurable funnel rather than treated as isolated activity.`
    );
  }

  if (hasWebsite && googleLed) {
    marketingAnalysis.push(
      "Google visibility combined with an existing website creates a strong opportunity to improve conversion through better landing pages, calls-to-action, reviews, service/product pages, and inquiry capture."
    );
  }

  if (hasAny(profile.marketingChannels, ["whatsapp"])) {
    marketingAnalysis.push(
      "Reliance on WhatsApp suggests that marketing may be generating conversations, but the business needs stronger inquiry tracking, follow-up, and conversion measurement."
    );
  }

  marketingAnalysis.push(
    `In ${industry}, stronger-performing businesses typically use clear positioning, trust-building assets, customer proof, and simplified conversion paths to reduce friction between interest and purchase.`
  );

  // AUTOMATION ANALYSIS
  if (profile.automationNeed) {
    automationAnalysis.push(
      `The main automation opportunity is ${profile.automationNeed}. This indicates that operational efficiency can improve by reducing repetitive manual work.`
    );
  } else {
    automationAnalysis.push(
      "The business has not clearly identified its main automation bottleneck, which suggests that a process audit should be completed before implementing tools."
    );
  }

  if (hasAny(profile.automationNeed, ["booking"])) {
    automationAnalysis.push(
      "Booking automation should be prioritized because it can reduce back-and-forth communication, improve response time, and create a more professional customer experience."
    );
  }

  if (hasAny(profile.automationNeed, ["follow", "lead", "message", "whatsapp"])) {
    automationAnalysis.push(
      "Lead follow-up automation should be considered because prospects who are not contacted consistently may fail to convert even when initial interest exists."
    );
  }

  automationAnalysis.push(
    "AEMA TaskFlow can support implementation by converting recommendations into tasks, assigning deadlines, tracking customer actions, and monitoring business priorities."
  );

  // BUSINESS SYSTEMS ANALYSIS
  if (profile.salesProcess) {
    businessSystemsAnalysis.push(
      `The current sales process is described as ${profile.salesProcess}. This process should be documented, measured, and improved so the business can identify where prospects drop off.`
    );
  }

  if (profile.teamSize) {
    businessSystemsAnalysis.push(
      `With a team size of ${profile.teamSize}, the business requires clear task ownership, simple operating procedures, and visibility into pending work.`
    );
  }

  if (profile.monthlyCustomers) {
    businessSystemsAnalysis.push(
      `At approximately ${profile.monthlyCustomers} customers per month, the business should track lead sources, conversion rates, repeat customers, and service delivery performance.`
    );
  }

  businessSystemsAnalysis.push(
    "The business should establish a basic operating system that tracks leads, follow-ups, customer tasks, marketing actions, and performance indicators."
  );

  if (businessPatterns.length) {
    businessSystemsAnalysis.push(`Detected business pattern: ${businessPatterns[0]}`);
  }

  return {
    businessPosition,
    growthConstraints,
    growthOpportunities,

    strengths,
    weaknesses,
    risks,

    marketingAnalysis,
    automationAnalysis,
    businessSystemsAnalysis,

    executiveRecommendation: {
      summary:
        "AEMA recommends improving the full customer journey from discovery to conversion, then using systems and tracking to make growth repeatable.",
      strategicFocus:
        "The focus should be visibility, trust, lead capture, follow-up, conversion, retention, and performance tracking.",
      recommendedOrder: [
        hasWebsite
          ? "Improve website messaging, trust signals, calls-to-action, and lead capture"
          : "Build a simple conversion-focused website or landing page",
        referralLed
          ? "Create a review and referral system"
          : "Strengthen the strongest customer acquisition channel",
        manualSales || profile.automationNeed
          ? "Set up lead tracking and follow-up automation"
          : "Document the sales process",
        "Use AEMA TaskFlow to manage implementation and measure progress",
      ],
    },
  };
};