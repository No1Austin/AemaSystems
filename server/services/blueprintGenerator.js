import { calculateGrowthScoreDetails } from "./blueprintScoringService.js";

export const generateBlueprint = (profile) => {
  const recommendations = [];
  const recommendedServices = new Set();
  const priorityActions = [];
  const opportunities = [];
  const risks = [];

  const scoring = calculateGrowthScoreDetails(profile);

  // =========================
  // WEBSITE LOGIC
  // =========================

  if (profile.websiteStatus === "No Website") {
    recommendations.push(
      "Your business needs a professional website to build credibility, attract customers from Google, capture leads, and support long-term growth."
    );

    recommendations.push(
      "A business website can help customers understand your services, contact you easily, book appointments, and trust your brand before speaking with you."
    );

    priorityActions.push("Build a professional business website.");
    priorityActions.push("Add lead capture forms and clear call-to-action buttons.");

    opportunities.push("Increase trust and online visibility with a strong website presence.");
    risks.push("Without a website, your business may depend too much on referrals or social media.");

    recommendedServices.add("Website Development");
  }

  if (profile.websiteStatus === "Has Website" && profile.websiteUrl) {
    recommendations.push(
      `Website Review Opportunity: ${profile.websiteUrl} should be reviewed for SEO, speed, user experience, mobile responsiveness, messaging, and conversion flow.`
    );

    recommendations.push(
      "Your website can likely be improved by strengthening its content, structure, page speed, trust signals, and lead capture strategy."
    );

    priorityActions.push("Audit the current website for SEO, speed, design, and conversion issues.");
    priorityActions.push("Improve website messaging, calls-to-action, and customer journey.");

    opportunities.push("Turn the existing website into a stronger lead-generation system.");

    recommendedServices.add("Website Audit");
    recommendedServices.add("SEO Optimization");
    recommendedServices.add("Conversion Optimization");
  }

  // =========================
  // LEAD SOURCE LOGIC
  // =========================

  if (profile.leadSource === "Referrals") {
    recommendations.push(
      "Your business currently depends on referrals. This is a good trust signal, but you need additional channels like Google, SEO, and website lead capture to grow more consistently."
    );

    priorityActions.push("Create or improve your Google Business Profile.");
    priorityActions.push("Build a review collection system to turn happy customers into online proof.");

    opportunities.push("Convert referral trust into public online credibility using reviews and local SEO.");
    risks.push("Relying only on referrals can slow growth and make customer flow unpredictable.");

    recommendedServices.add("Local SEO");
    recommendedServices.add("Review Automation");
  }

  if (profile.leadSource === "Google") {
    recommendations.push(
      "Since customers already find you through Google, your next opportunity is to improve your ranking, reviews, website content, and conversion flow."
    );

    priorityActions.push("Optimize Google Business Profile and website SEO.");
    recommendedServices.add("SEO Optimization");
  }

  if (profile.leadSource === "Social Media") {
    recommendations.push(
      "Social media is useful for awareness, but your business should connect social traffic to a website, booking page, lead form, or automated follow-up system."
    );

    priorityActions.push("Create a clear path from social media to inquiry, booking, or purchase.");
    recommendedServices.add("Marketing Funnel Setup");
  }

  if (profile.leadSource === "Paid Ads") {
    recommendations.push(
      "Paid ads can bring traffic quickly, but they work best when connected to a strong landing page, tracking system, and follow-up automation."
    );

    priorityActions.push("Improve ad landing pages and install lead tracking.");
    recommendedServices.add("Landing Page Optimization");
    recommendedServices.add("Analytics Setup");
  }

  if (profile.leadSource === "Walk-ins") {
    recommendations.push(
      "Walk-ins are valuable, but your business should also build digital channels so customers can discover, contact, and book you online."
    );

    priorityActions.push("Create online booking and Google visibility systems.");
    recommendedServices.add("Booking System");
    recommendedServices.add("Local SEO");
  }

  if (profile.leadSource === "No Clear Lead Source") {
    recommendations.push(
      "Your business does not yet have a clear lead generation system. You need a repeatable way to attract, capture, and follow up with potential customers."
    );

    priorityActions.push("Set up a basic lead generation funnel.");
    recommendedServices.add("Lead Generation System");
  }

  // =========================
  // GOAL LOGIC
  // =========================

  if (profile.goal === "Get More Customers") {
    recommendations.push(
      "To get more customers, your business needs a clear growth funnel: visibility, trust, lead capture, follow-up, and conversion."
    );

    priorityActions.push("Build a simple customer acquisition funnel.");
    priorityActions.push("Set up tracking for leads, inquiries, and conversions.");

    opportunities.push("Increase customer flow by combining website, SEO, reviews, and automation.");

    recommendedServices.add("Lead Generation Strategy");
    recommendedServices.add("SEO Optimization");
  }

  if (profile.goal === "Improve Website") {
    recommendations.push(
      "Your website should not only look good. It should explain your value clearly, build trust, capture leads, and guide visitors toward action."
    );

    priorityActions.push("Improve homepage messaging, service pages, and calls-to-action.");
    recommendedServices.add("Website Redesign");
    recommendedServices.add("Website Audit");
  }

  if (profile.goal === "Improve SEO") {
    recommendations.push(
      "SEO can help your business attract customers without relying only on ads or referrals. Start with local keywords, optimized service pages, and Google Business Profile improvements."
    );

    priorityActions.push("Research local keywords and optimize key website pages.");
    recommendedServices.add("SEO Optimization");
    recommendedServices.add("Content Strategy");
  }

  if (profile.goal === "Automate Business") {
    recommendations.push(
      "Automation can reduce manual work, improve customer response time, and make the business easier to manage as it grows."
    );

    priorityActions.push("Identify repetitive tasks and automate the highest-impact workflow first.");
    recommendedServices.add("AI Automation");
    recommendedServices.add("Workflow Automation");
  }

  if (profile.goal === "Improve Business Systems") {
    recommendations.push(
      "Your business needs stronger internal systems so leads, customers, bookings, payments, reports, and follow-ups are easier to manage."
    );

    priorityActions.push("Map the current business process and identify weak points.");
    recommendedServices.add("Business Systems");
    recommendedServices.add("Dashboard Development");
  }

  if (profile.goal === "Improve Branding") {
    recommendations.push(
      "Stronger branding can help your business look more professional, build trust faster, and create a more consistent customer experience."
    );

    priorityActions.push("Improve brand messaging, visuals, and positioning.");
    recommendedServices.add("Brand Strategy");
  }

  if (profile.goal === "Improve Marketing") {
    recommendations.push(
      "Your marketing should connect awareness to action. Every campaign should lead users toward a website, booking page, form, call, or offer."
    );

    priorityActions.push("Create a simple marketing funnel with clear next steps.");
    recommendedServices.add("Digital Marketing Strategy");
  }

  // =========================
  // AUTOMATION LOGIC
  // =========================

  if (profile.automationNeed) {
    recommendations.push(
      "Your business can benefit from automation in areas like bookings, reminders, follow-ups, lead management, invoices, reports, and customer communication."
    );

    priorityActions.push("Automate one high-value workflow first, such as bookings or follow-ups.");

    opportunities.push("Save time and respond to customers faster with automation.");
    recommendedServices.add("AI Automation");
    recommendedServices.add("Workflow Automation");
  }

  // =========================
  // BUSINESS TYPE LOGIC
  // =========================

  if (profile.businessType?.includes("Cleaning")) {
    recommendations.push(
      "For a cleaning business, strong local SEO, customer reviews, service pages, before-and-after proof, and automated booking/follow-up systems can strongly improve growth."
    );

    recommendedServices.add("Local SEO");
    recommendedServices.add("Booking System");
  }

  if (profile.businessType?.includes("Barbing") || profile.businessType?.includes("Salon")) {
    recommendations.push(
      "For a barber or salon business, online booking, social proof, Google reviews, service pricing, location visibility, and reminder automation are very important."
    );

    recommendedServices.add("Booking System");
    recommendedServices.add("Local SEO");
  }

  if (profile.businessType?.includes("Clothing") || profile.businessType?.includes("Fashion")) {
    recommendations.push(
      "For a clothing or fashion business, product presentation, online store experience, social media funnels, email follow-up, and abandoned cart recovery can improve sales."
    );

    recommendedServices.add("E-commerce Development");
    recommendedServices.add("Marketing Funnel Setup");
  }

  if (profile.businessType?.includes("Restaurant") || profile.businessType?.includes("Food")) {
    recommendations.push(
      "For a food business, local search visibility, menu presentation, online ordering, reviews, photos, and repeat customer campaigns can improve sales."
    );

    recommendedServices.add("Local SEO");
    recommendedServices.add("Online Ordering System");
  }

  if (profile.businessType?.includes("Real Estate")) {
    recommendations.push(
      "For a real estate business, lead capture, property pages, CRM follow-up, local SEO, and automated nurture campaigns can improve conversion."
    );

    recommendedServices.add("CRM Setup");
    recommendedServices.add("Lead Generation System");
  }

  if (profile.marketingChannels) {
    recommendations.push(
      `Your current marketing channels are ${profile.marketingChannels}. These should be organized into a clear funnel that turns attention into leads and sales.`
    );
  }

  if (profile.salesProcess) {
    recommendations.push(
      `Your current sales process is ${profile.salesProcess}. This process can be improved with clearer steps, better follow-up, and automation.`
    );
  }

  if (profile.targetCustomers) {
    recommendations.push(
      `Your business should create messaging that speaks directly to ${profile.targetCustomers}.`
    );
  }

  if (profile.mainOffer) {
    recommendations.push(
      `Your main offer is ${profile.mainOffer}. This offer should be clearly presented on your website, social media, and sales process.`
    );
  }

  // =========================
  // FALLBACKS
  // =========================

  if (recommendations.length === 0) {
    recommendations.push(
      "Your business has growth opportunities that can be improved through better online visibility, clearer systems, stronger marketing, and automation."
    );

    priorityActions.push("Start with a simple business audit and identify the biggest growth bottleneck.");
    recommendedServices.add("Business Analysis");
  }

  return {
    businessType: profile.businessType,
    goal: profile.goal,
    leadSource: profile.leadSource,
    websiteStatus: profile.websiteStatus,
    websiteUrl: profile.websiteUrl,
    automationNeed: profile.automationNeed,
    biggestChallenge: profile.biggestChallenge,
    monthlyCustomers: profile.monthlyCustomers,
    teamSize: profile.teamSize,
    businessAge: profile.businessAge,
    websiteGoal: profile.websiteGoal,

    growthScore: scoring.growthScore,
    growthPotential: scoring.growthPotential,
    scoreBreakdown: scoring.scoreBreakdown,
    scoringNotes: scoring.scoringNotes,

    recommendations,
    priorityActions,
    opportunities,
    risks,

    marketingChannels: profile.marketingChannels,
    salesProcess: profile.salesProcess,
    targetCustomers: profile.targetCustomers,
    mainOffer: profile.mainOffer,

    recommendedServices: Array.from(recommendedServices),
  };
};