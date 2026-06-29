// server/services/recommendationEngine.js

const text = (value = "") => String(value || "").toLowerCase().trim();

const hasAny = (value = "", words = []) => {
  const clean = Array.isArray(value)
    ? value.map((item) => text(item)).join(" ")
    : text(value);

  return words.some((word) => clean.includes(text(word)));
};

const add = (items, item) => {
  if (item && !items.includes(item)) items.push(item);
};

export const generateRecommendations = (profile = {}, identity = {}) => {
  const recommendations = [];

  const industry =
    identity.industry || profile.industry || profile.businessType || "";

  const hasWebsite = profile.websiteStatus === "Has Website";
  const noWebsite = profile.websiteStatus === "No Website";

  if (noWebsite) {
    add(
      recommendations,
      "Build a professional website that explains the business offer clearly, builds trust, and captures leads."
    );
  }

  if (hasWebsite) {
    add(
      recommendations,
      "Improve the existing website so it works as a conversion system, not just an online presence."
    );
  }

  if (profile.websiteAudit?.recommendations?.length) {
    profile.websiteAudit.recommendations.slice(0, 4).forEach((item) => {
      add(recommendations, item);
    });
  }

  if (profile.leadSource === "Referrals") {
    add(
      recommendations,
      "Turn referrals into a repeatable growth system using reviews, testimonials, referral requests, and follow-up reminders."
    );
  }

  if (profile.leadSource === "Google") {
    add(
      recommendations,
      "Strengthen Google visibility through local SEO, optimized service/product pages, and stronger review collection."
    );
  }

  if (
    profile.leadSource === "Social Media" ||
    hasAny(profile.marketingChannels, ["instagram", "facebook", "tiktok"])
  ) {
    add(
      recommendations,
      "Connect social media activity to a clear sales funnel such as a website, booking link, WhatsApp workflow, product page, or lead form."
    );
  }

  if (
    hasAny(profile.salesProcess, ["whatsapp", "dm", "manual", "phone", "message"]) ||
    hasAny(profile.automationNeed, ["follow", "lead", "booking", "workflow"])
  ) {
    add(
      recommendations,
      "Set up lead tracking and follow-up automation so prospects are not lost after the first inquiry."
    );
  }

  if (hasAny(profile.goal, ["customers", "leads", "sales", "marketing"])) {
    add(
      recommendations,
      "Create a simple customer acquisition funnel that connects visibility, trust, lead capture, follow-up, and conversion."
    );
  }

  if (hasAny(industry, ["clothing", "fashion"])) {
    add(
      recommendations,
      "Improve fashion product presentation with clearer product photos, sizing information, social proof, product pages, and follow-up for abandoned inquiries."
    );
  }

  if (hasAny(industry, ["food", "restaurant"])) {
    add(
      recommendations,
      "Improve food business visibility with clear menus, ordering options, Google reviews, attractive photos, and local SEO."
    );
  }

  if (hasAny(industry, ["barber", "salon", "beauty"])) {
    add(
      recommendations,
      "Use online booking, appointment reminders, reviews, and repeat-customer follow-up to improve customer retention."
    );
  }

  if (hasAny(industry, ["cleaning"])) {
    add(
      recommendations,
      "Create service packages, quote request forms, local SEO pages, Google reviews, and recurring cleaning offers."
    );
  }

  add(
    recommendations,
    "Use AEMA TaskFlow to convert recommendations into tasks, deadlines, customer follow-ups, and measurable business actions."
  );

  return recommendations.slice(0, 12);
};

export const generatePrioritizedRecommendations = (profile = {}, identity = {}) => {
  return generateRecommendations(profile, identity).map((recommendation, index) => ({
    priority: index + 1,
    title: recommendation,
    impact: index < 4 ? "High" : "Medium",
    effort: index < 4 ? "Medium" : "Low-Medium",
    timeframe: index < 4 ? "30 Days" : "30-60 Days",
    reason: recommendation,
  }));
};