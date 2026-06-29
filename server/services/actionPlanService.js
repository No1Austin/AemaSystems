// server/services/actionPlanService.js

const text = (value = "") => String(value || "").toLowerCase().trim();

const includes = (value = "", words = []) => {
  const clean = Array.isArray(value)
    ? value.map((item) => text(item)).join(" ")
    : text(value);

  return words.some((word) => clean.includes(text(word)));
};

const getWebsiteAuditIssueCount = (profile = {}) => {
  if (!profile.websiteAudit) return 0;

  return [
    ...(profile.websiteAudit.recommendations || []),
    ...(profile.websiteAudit.issues || []),
    ...(profile.websiteAudit.findings || []),
  ].filter(Boolean).length;
};

export const generateActionPlan = (profile = {}, identity = {}) => {
  const hasWebsite = profile.websiteStatus === "Has Website";
  const noWebsite = profile.websiteStatus === "No Website";
  const auditIssues = getWebsiteAuditIssueCount(profile);

  const industry = identity.industry || profile.industry || profile.businessType || "the business";

  const earlyStage =
    includes(profile.businessStage || profile.businessAge, ["idea", "less than 1 year"]) ||
    includes(profile.monthlyCustomers, ["under 20"]);

  const growthStage =
    includes(profile.monthlyCustomers, ["20-100", "100-500", "500+"]) ||
    includes(profile.monthlyRevenue, ["2k", "10k", "50k"]);

  const needsCustomers =
    includes(profile.goal, ["customers", "leads", "sales", "marketing"]) ||
    includes(profile.biggestChallenge, ["customers", "leads", "sales", "marketing", "traffic"]);

  const needsAutomation =
    includes(profile.goal, ["automate", "automation", "operations", "systems"]) ||
    includes(profile.automationNeed, [
      "booking",
      "follow",
      "payment",
      "email",
      "report",
      "contact",
      "task",
      "lead",
      "workflow",
      "manual",
    ]);

  const usesReferrals = includes(profile.leadSource, ["referral"]);
  const usesSocial =
    includes(profile.leadSource, ["social"]) ||
    includes(profile.marketingChannels, ["instagram", "tiktok", "facebook"]);
  const usesWhatsApp =
    includes(profile.salesProcess, ["whatsapp"]) ||
    includes(profile.marketingChannels, ["whatsapp"]);

  if (noWebsite) {
    return [
      "Week 1: Define the business offer, target customer, main promise, and the action you want prospects to take.",
      "Week 2: Build a simple conversion-focused website with service/product pages, trust elements, and clear contact options.",
      "Week 3: Add lead capture tools such as WhatsApp, quote forms, booking forms, email signup, or inquiry buttons.",
      "Week 4: Connect traffic sources, track inquiries, and measure how many leads turn into paying customers.",
    ];
  }

  if (hasWebsite && auditIssues >= 3) {
    return [
      `Week 1: Fix the highest-priority website audit issues affecting SEO, trust, mobile experience, and conversion.`,
      `Week 2: Improve the homepage message, calls-to-action, lead capture, and website goal: ${profile.websiteGoal || "turn visitors into leads"}.`,
      "Week 3: Add trust signals such as reviews, testimonials, portfolio proof, FAQs, guarantees, or clear service/product information.",
      "Week 4: Track website inquiries, traffic sources, conversion actions, and weak pages that need further optimization.",
    ];
  }

  if (hasWebsite && includes(profile.goal, ["website", "seo"])) {
    return [
      `Week 1: Audit ${profile.websiteUrl || "the website"} for SEO, mobile experience, page speed, content quality, and conversion gaps.`,
      `Week 2: Improve the homepage headline, calls-to-action, trust elements, and website goal: ${profile.websiteGoal || "turn visitors into leads"}.`,
      "Week 3: Add or improve lead capture systems such as forms, booking buttons, WhatsApp, quote requests, or product inquiry buttons.",
      "Week 4: Review traffic, search visibility, leads, and conversion performance, then optimize weak pages.",
    ];
  }

  if (earlyStage && needsCustomers) {
    return [
      `Week 1: Clarify the target customer, strongest offer, pricing, and why people should choose this ${industry}.`,
      "Week 2: Create simple marketing content that explains the offer clearly and directs people to call, book, buy, or inquire.",
      "Week 3: Build trust using reviews, testimonials, referral requests, before-and-after proof, customer stories, or product/service examples.",
      "Week 4: Track inquiries, follow-ups, and closed sales so the business can understand which channel brings real customers.",
    ];
  }

  if (needsCustomers && usesReferrals) {
    return [
      "Week 1: Turn referrals into a formal system by asking past customers for reviews, testimonials, introductions, and repeat business.",
      "Week 2: Create a referral offer or simple customer-share message that makes it easy for people to recommend the business.",
      "Week 3: Add follow-up reminders so every happy customer is asked for a review, repeat purchase, testimonial, or referral.",
      "Week 4: Measure referral leads, conversion rate, repeat customers, and the number of new customers generated.",
    ];
  }

  if (needsCustomers && usesSocial) {
    return [
      "Week 1: Define the ideal customer, content themes, strongest offer, and the main call-to-action for social media.",
      "Week 2: Create content around proof, education, offers, behind-the-scenes, customer results, and frequently asked questions.",
      "Week 3: Connect social media to a clear sales path such as WhatsApp, booking link, website page, or product inquiry form.",
      "Week 4: Track content engagement, inquiries, leads, follow-ups, and sales from each social channel.",
    ];
  }

  if (usesWhatsApp) {
    return [
      "Week 1: Organize the WhatsApp sales process from first message to payment, booking, delivery, or follow-up.",
      "Week 2: Create saved replies, product/service information, pricing responses, and a simple customer intake process.",
      "Week 3: Add a follow-up system for prospects who ask questions but do not buy immediately.",
      "Week 4: Track WhatsApp inquiries, response time, follow-ups, closed sales, and missed opportunities.",
    ];
  }

  if (needsAutomation) {
    return [
      "Week 1: Map the current customer journey from inquiry to sale, booking, payment, delivery, and follow-up.",
      "Week 2: Identify repetitive tasks that waste time, especially bookings, reminders, customer contacts, payments, and follow-ups.",
      "Week 3: Set up a simple workflow using AEMA TaskFlow to manage tasks, contacts, bookings, customer follow-up, and implementation actions.",
      "Week 4: Track response time, completed tasks, missed leads, repeat customers, and operational improvement.",
    ];
  }

  if (growthStage) {
    return [
      "Week 1: Review current revenue, customer volume, lead sources, conversion rate, and repeat customer activity.",
      "Week 2: Strengthen the highest-performing sales channel and remove weak steps in the customer journey.",
      "Week 3: Add systems for follow-up, task management, customer segmentation, and performance tracking.",
      "Week 4: Review KPIs and create a monthly growth routine for marketing, sales, operations, and customer retention.",
    ];
  }

  return [
    "Week 1: Audit the current business model, customer journey, offer, website, and sales process.",
    "Week 2: Improve online presence, messaging, trust elements, and lead capture.",
    "Week 3: Implement follow-up, automation, task management, and customer tracking opportunities.",
    "Week 4: Measure leads, conversions, customer activity, revenue signals, and next growth priorities.",
  ];
};