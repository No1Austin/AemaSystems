// server/services/serviceRecommendationService.js

const text = (value = "") => String(value || "").toLowerCase().trim();

const hasAny = (value = "", words = []) => {
  const clean = Array.isArray(value)
    ? value.map((item) => text(item)).join(" ")
    : text(value);

  return words.some((word) => clean.includes(text(word)));
};

const add = (services, service) => {
  if (service && !services.includes(service)) {
    services.push(service);
  }
};

export const generateServiceRecommendations = (profile = {}, identity = {}) => {
  const services = [];

  const industry =
    identity.industry || profile.industry || profile.businessType || "";

  const hasWebsite = profile.websiteStatus === "Has Website";
  const noWebsite = profile.websiteStatus === "No Website";

  if (noWebsite) {
    add(services, "Website Development");
    add(services, "SEO Setup");
  }

  if (hasWebsite) {
    add(services, "Website Audit");
    add(services, "Conversion Optimization");
  }

  if (hasAny(profile.leadSource, ["google", "referral"])) {
    add(services, "Local SEO");
    add(services, "Review Automation");
  }

  if (hasAny(profile.goal, ["customers", "leads", "sales", "marketing"])) {
    add(services, "Lead Generation Strategy");
  }

  if (hasAny(profile.automationNeed, ["booking", "follow", "lead", "workflow", "task"])) {
    add(services, "Workflow Automation");
    add(services, "AEMA TaskFlow");
  }

  if (hasAny(industry, ["clothing", "fashion"])) {
    add(services, "E-commerce Optimization");
    add(services, "Marketing Funnel Setup");
  }

  if (hasAny(industry, ["barber", "salon", "beauty"])) {
    add(services, "Booking System");
  }

  if (hasAny(industry, ["restaurant", "food"])) {
    add(services, "Online Ordering Strategy");
  }

  add(services, "AEMA TaskFlow");

  return services.slice(0, 10);
};