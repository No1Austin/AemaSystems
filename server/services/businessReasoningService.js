const text = (value = "") => String(value || "").toLowerCase();

const includesAny = (value = "", words = []) => {
  const clean = text(value);
  return words.some((word) => clean.includes(word));
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

  const location = profile.serviceLocation || "the target market";
  const industry = industryInsights.industry || "the business category";

  // STRENGTHS
  if (profile.websiteStatus === "Has Website") {
    strengths.push(
      "The business already has a digital foundation through its website, which creates an opportunity to strengthen SEO, credibility, lead capture, and conversion performance."
    );
  }

  if (profile.leadSource === "Google") {
    strengths.push(
      "Google is already functioning as a customer acquisition channel, indicating that market demand and search visibility may already exist."
    );
  }

  if (profile.goal) {
    strengths.push(
      `The business has identified a clear strategic priority: ${profile.goal}. This improves the ability to focus resources and measure progress.`
    );
  }

  if (profile.mainOffer) {
    strengths.push(
      `The business has a defined offer around ${profile.mainOffer}, which can be developed into clearer positioning, stronger messaging, and more targeted campaigns.`
    );
  }

  // WEAKNESSES
  if (profile.websiteStatus === "No Website") {
    weaknesses.push(
      "The absence of a website limits search visibility, trust-building, structured lead capture, and the ability to convert prospects outside social platforms."
    );
  }

  if (includesAny(profile.salesProcess, ["whatsapp", "dm", "message", "manual", "phone"])) {
    weaknesses.push(
      "The current sales process appears dependent on manual communication, which can create inconsistent follow-up, weak conversion tracking, and missed revenue opportunities."
    );
  }

  if (!profile.targetCustomers) {
    weaknesses.push(
      "The target customer segment is not clearly defined, which may weaken marketing accuracy, campaign messaging, and offer positioning."
    );
  }

  if (!profile.marketingChannels) {
    weaknesses.push(
      "Marketing channel usage is not clearly structured, making it difficult to evaluate which activities produce leads and sales."
    );
  }

  if (profile.websiteAudit?.recommendations?.length) {
    weaknesses.push(
      "The website audit identified optimization gaps that may reduce organic visibility, user trust, and conversion performance."
    );
  }

  // RISKS
  if (profile.leadSource === "Google") {
    risks.push(
      "The business may face acquisition risk if it depends heavily on Google without diversified marketing channels, review generation, and direct customer follow-up systems."
    );
  }

  if (profile.leadSource === "Social Media") {
    risks.push(
      "The business may face visibility risk if customer acquisition depends mainly on social platforms where reach, engagement, and algorithm behavior can change quickly."
    );
  }

  if (includesAny(profile.automationNeed, ["manual", "booking", "follow", "lead", "message"])) {
    risks.push(
      "Manual operational processes may become a scalability risk as inquiry volume increases, especially if leads are not tracked through a repeatable workflow."
    );
  }

  if (!profile.monthlyCustomers) {
    risks.push(
      "Without clear monthly customer volume, it is difficult to measure growth performance, forecast demand, or evaluate campaign effectiveness."
    );
  }

  // MARKETING ANALYSIS
  marketingAnalysis.push(
    profile.leadSource
      ? `The current acquisition model is primarily linked to ${profile.leadSource}. This should be evaluated not only by traffic or inquiries, but by how many prospects convert into paying customers.`
      : "The customer acquisition model is not clearly defined, which creates uncertainty around growth planning and marketing investment."
  );

  if (profile.serviceLocation) {
    marketingAnalysis.push(
      `Because the business serves ${location}, marketing should include location-specific positioning, local trust signals, and search terms that align with how customers in that market look for providers.`
    );
  }

  if (profile.marketingChannels) {
    marketingAnalysis.push(
      `The current marketing channel mix includes ${profile.marketingChannels}. These channels should be organized into a measurable funnel rather than treated as isolated activities.`
    );
  }

  if (profile.leadSource === "Google" && profile.websiteStatus === "Has Website") {
    marketingAnalysis.push(
      "Google visibility combined with an existing website creates a strong opportunity to improve conversion. The priority should be strengthening landing pages, calls-to-action, reviews, service/product pages, and inquiry capture."
    );
  }

  if (includesAny(profile.marketingChannels, ["whatsapp"])) {
    marketingAnalysis.push(
      "Reliance on WhatsApp suggests that marketing activity may be generating conversations, but the business needs better structure around inquiry tracking, follow-up, and conversion measurement."
    );
  }

  marketingAnalysis.push(
    `In ${industry}, stronger-performing businesses typically use clear positioning, trust-building assets, customer proof, and simplified conversion paths to reduce friction between interest and purchase.`
  );

  // AUTOMATION ANALYSIS
  if (profile.automationNeed) {
    automationAnalysis.push(
      `The main automation opportunity is ${profile.automationNeed}. This indicates that operational efficiency can be improved by reducing repetitive manual work.`
    );
  } else {
    automationAnalysis.push(
      "The business has not clearly identified its main automation bottleneck, which suggests that a process audit should be completed before implementing tools."
    );
  }

  if (includesAny(profile.automationNeed, ["booking"])) {
    automationAnalysis.push(
      "Booking automation should be prioritized because it can reduce back-and-forth communication, improve response time, and create a more professional customer experience."
    );
  }

  if (includesAny(profile.automationNeed, ["follow", "lead", "message", "whatsapp"])) {
    automationAnalysis.push(
      "Lead follow-up automation should be considered because prospects who are not contacted consistently may fail to convert even when initial interest exists."
    );
  }

  automationAnalysis.push(
    "AEMA Task Manager can support implementation by converting recommendations into tasks, assigning deadlines, and tracking progress against business priorities."
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
      `At approximately ${profile.monthlyCustomers} customers per month, the business should begin tracking lead sources, conversion rates, repeat customers, and service delivery performance.`
    );
  }

  businessSystemsAnalysis.push(
    "The business should establish a basic operating system that tracks leads, follow-ups, customer tasks, marketing actions, and performance indicators."
  );

  if (businessPatterns.length) {
    businessSystemsAnalysis.push(
      `Detected business pattern: ${businessPatterns[0]}`
    );
  }

  return {
    strengths,
    weaknesses,
    risks,
    marketingAnalysis,
    automationAnalysis,
    businessSystemsAnalysis,
  };
};