const text = (value = "") => String(value || "").toLowerCase();

const has = (value, words = []) => {
  const clean = text(value);
  return words.some((word) => clean.includes(word));
};

export const generateDynamicReportSections = ({
  profile = {},
  blueprint = {},
  industryInsights = {},
  businessPatterns = [],
}) => {
  const strengths = [];
  const weaknesses = [];
  const risks = [];
  const marketingAnalysis = [];
  const automationAnalysis = [];
  const businessSystemsAnalysis = [];

  // Strengths
  if (profile.goal) strengths.push(`The business has a clear growth goal: ${profile.goal}.`);

  if (profile.websiteStatus === "Has Website") {
    strengths.push("The business already has a website, which gives it a foundation for SEO, trust-building, and lead generation.");
  }

  if (profile.leadSource) {
    strengths.push(`The business already has a known customer source: ${profile.leadSource}.`);
  }

  if (profile.mainOffer) {
    strengths.push(`The business has a defined offer: ${profile.mainOffer}.`);
  }

  if (profile.targetCustomers) {
    strengths.push(`The business has identified a target audience: ${profile.targetCustomers}.`);
  }

  // Weaknesses
  if (profile.websiteStatus === "No Website") {
    weaknesses.push("The business does not currently have a website, which limits trust, SEO visibility, and structured lead capture.");
  }

  if (!profile.targetCustomers) {
    weaknesses.push("The target customer group is not clearly defined, which can weaken marketing and messaging.");
  }

  if (!profile.salesProcess) {
    weaknesses.push("The sales process is not clearly defined, which can make conversion tracking difficult.");
  }

  if (!profile.marketingChannels) {
    weaknesses.push("Marketing channels were not clearly identified.");
  }

  if (profile.websiteAudit?.recommendations?.length) {
    weaknesses.push("The website audit found areas that may reduce SEO performance, trust, or conversion.");
  }

  // Risks
  if (profile.leadSource && !profile.marketingChannels) {
    risks.push("The business may be relying on a limited or unclear marketing system.");
  }

  if (profile.leadSource === "Google") {
    risks.push("Depending heavily on Google can be risky if rankings, reviews, or search visibility change.");
  }

  if (profile.leadSource === "Social Media") {
    risks.push("Depending mainly on social media can be risky because reach and engagement can change quickly.");
  }

  if (has(profile.salesProcess, ["whatsapp", "dm", "manual", "phone", "message"])) {
    risks.push("A manual sales process can lead to missed follow-ups, lost leads, and inconsistent conversion.");
  }

  if (has(profile.automationNeed, ["booking", "follow", "lead", "message", "manual"])) {
    risks.push("Manual processes may slow growth as inquiries increase.");
  }

  // Marketing Analysis
  // Marketing Analysis
marketingAnalysis.push(
  profile.leadSource
    ? `Current lead source: ${profile.leadSource}.`
    : "The main lead source is not clearly defined."
);

if (profile.serviceLocation) {
  marketingAnalysis.push(
    `Primary market served: ${profile.serviceLocation}. Marketing should be localized around this area where relevant.`
  );
}

if (profile.marketingChannels) {
  marketingAnalysis.push(
    `Current marketing channels: ${profile.marketingChannels}.`
  );
}

if (industryInsights.industry) {
  marketingAnalysis.push(
    `Industry context: ${industryInsights.industry}.`
  );
}

if (profile.serviceLocation && profile.websiteStatus === "Has Website") {
  marketingAnalysis.push(
    `Local SEO opportunity: create or improve website content that targets ${profile.serviceLocation} together with your main services or products.`
  );
}

if (profile.serviceLocation && profile.leadSource === "Google") {
  marketingAnalysis.push(
    `Because customers currently find you through Google, your business should strengthen Google Business Profile visibility, reviews, local keywords, and location-based service pages for ${profile.serviceLocation}.`
  );
}

if (profile.serviceLocation && profile.leadSource === "Social Media") {
  marketingAnalysis.push(
    `Because customers come through social media, content should include location-based trust signals such as customer results, testimonials, delivery/service areas, and local proof for ${profile.serviceLocation}.`
  );
}

if (profile.targetCustomers) {
  marketingAnalysis.push(
    `Marketing should speak directly to ${profile.targetCustomers}.`
  );
}

if (profile.websiteStatus === "Has Website") {
  marketingAnalysis.push(
    "The website should support marketing by converting visitors into leads, bookings, calls, or purchases."
  );
} else {
  marketingAnalysis.push(
    "A website would help turn marketing attention into a structured customer journey."
  );
}

  // Automation Analysis
  if (profile.automationNeed) {
    automationAnalysis.push(`Main automation opportunity: ${profile.automationNeed}.`);
  } else {
    automationAnalysis.push("Automation needs were not clearly identified, so the business should review repetitive tasks.");
  }

  if (has(profile.salesProcess, ["whatsapp", "dm", "message", "manual"])) {
    automationAnalysis.push("The business can benefit from automated follow-ups, customer tracking, and inquiry reminders.");
  }

  if (has(profile.automationNeed, ["booking"])) {
    automationAnalysis.push("Booking automation can reduce back-and-forth messages and missed appointments.");
  }

  if (has(profile.automationNeed, ["lead"])) {
    automationAnalysis.push("Lead management automation can help track inquiries from first contact to conversion.");
  }

  automationAnalysis.push("AEMA Task Manager can help organize recommendations, assign tasks, and monitor implementation progress.");

  // Business Systems Analysis
  if (profile.salesProcess) {
    businessSystemsAnalysis.push(`Current sales process: ${profile.salesProcess}.`);
  }

  if (profile.monthlyCustomers) {
    businessSystemsAnalysis.push(`Current monthly customer volume: approximately ${profile.monthlyCustomers}.`);
  }

  if (profile.teamSize) {
    businessSystemsAnalysis.push(`Current team size: ${profile.teamSize}.`);
  }

  if (profile.businessAge) {
    businessSystemsAnalysis.push(`Business age: ${profile.businessAge}.`);
  }

  businessSystemsAnalysis.push("The business should document its customer journey from discovery to purchase or booking.");
  businessSystemsAnalysis.push("The business should track leads, follow-ups, completed tasks, and conversion performance.");

  return {
    strengths: strengths.length ? strengths : blueprint.strengths || [],
    weaknesses: weaknesses.length ? weaknesses : blueprint.weaknesses || [],
    risks: risks.length ? risks : blueprint.risks || [],
    marketingAnalysis,
    automationAnalysis,
    businessSystemsAnalysis,
  };
};