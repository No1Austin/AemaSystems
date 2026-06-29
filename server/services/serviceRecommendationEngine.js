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

const getWebsiteAuditIssueCount = (profile = {}) => {
  if (!profile.websiteAudit) return 0;

  return [
    ...(profile.websiteAudit.recommendations || []),
    ...(profile.websiteAudit.issues || []),
    ...(profile.websiteAudit.findings || []),
  ].filter(Boolean).length;
};

export const generateServiceRecommendations = (
  profile = {},
  identity = {}
) => {
  const services = [];

  const industry =
    identity.industry ||
    profile.industry ||
    profile.businessType ||
    "General Business";

  const hasWebsite = profile.websiteStatus === "Has Website";
  const noWebsite = profile.websiteStatus === "No Website";
  const auditIssues = getWebsiteAuditIssueCount(profile);

  const needsCustomers =
    hasAny(profile.goal, ["customers", "leads", "sales", "marketing"]) ||
    hasAny(profile.biggestChallenge, [
      "customers",
      "leads",
      "sales",
      "marketing",
      "traffic",
      "visibility",
    ]);

  const needsAutomation =
    hasAny(profile.goal, ["automation", "automate", "operations", "systems"]) ||
    hasAny(profile.automationNeed, [
      "booking",
      "follow",
      "lead",
      "message",
      "email",
      "payment",
      "report",
      "task",
      "workflow",
      "manual",
      "contact",
    ]);

  const manualSales =
    hasAny(profile.salesProcess, [
      "whatsapp",
      "dm",
      "manual",
      "phone",
      "message",
      "call",
    ]) || hasAny(profile.marketingChannels, ["whatsapp"]);

  const usesReferrals = hasAny(profile.leadSource, ["referral"]);
  const usesGoogle = hasAny(profile.leadSource, ["google"]);
  const usesSocial =
    hasAny(profile.leadSource, ["social"]) ||
    hasAny(profile.marketingChannels, ["instagram", "facebook", "tiktok"]);

  if (noWebsite) {
    add(services, "Website Development");
    add(services, "SEO Setup");
    add(services, "Conversion Strategy");
  }

  if (hasWebsite) {
    add(services, "Website Audit");
    add(services, "Conversion Optimization");
  }

  if (hasWebsite && auditIssues >= 3) {
    add(services, "Website Fixes");
    add(services, "SEO Optimization");
  }

  if (hasAny(profile.goal, ["seo"]) || usesGoogle) {
    add(services, "SEO Optimization");
    add(services, "Local SEO");
  }

  if (usesReferrals) {
    add(services, "Review Automation");
    add(services, "Referral System");
    add(services, "Local SEO");
  }

  if (usesSocial) {
    add(services, "Social Media Funnel");
    add(services, "Landing Page Optimization");
  }

  if (needsCustomers) {
    add(services, "Lead Generation Strategy");
    add(services, "Marketing Funnel Setup");
  }

  if (manualSales) {
    add(services, "CRM Setup");
    add(services, "Lead Tracking System");
    add(services, "Follow-up Automation");
  }

  if (needsAutomation) {
    add(services, "Workflow Automation");
    add(services, "AEMA TaskFlow");
  }

  if (hasAny(industry, ["clothing", "fashion"])) {
    add(services, "E-commerce Optimization");
    add(services, "Product Page Optimization");
  }

  if (hasAny(industry, ["barber", "salon", "grooming", "beauty"])) {
    add(services, "Booking System");
    add(services, "Review Automation");
  }

  if (hasAny(industry, ["food", "restaurant", "catering"])) {
    add(services, "Local SEO");
    add(services, "Online Ordering Strategy");
  }

  if (hasAny(industry, ["cleaning"])) {
    add(services, "Local SEO");
    add(services, "Quote Request System");
  }

  if (hasAny(industry, ["real estate", "property"])) {
    add(services, "CRM Setup");
    add(services, "Lead Nurture Automation");
  }

  if (hasAny(industry, ["construction", "home services"])) {
    add(services, "Quote Request System");
    add(services, "Project Tracking System");
  }

  if (hasAny(industry, ["digital", "technology", "professional", "consulting"])) {
    add(services, "Business Systems Consulting");
    add(services, "Dashboard Development");
  }

  add(services, "AEMA TaskFlow");

  return services.slice(0, 10);
};