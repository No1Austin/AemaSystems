// server/services/actionPlanService.js

const includes = (value = "", words = []) => {
  const text = String(value).toLowerCase();
  return words.some((word) => text.includes(word));
};

export const generateActionPlan = (profile = {}) => {
  const plan = [];

  if (profile.websiteStatus === "No Website") {
    return [
      "Week 1: Define the business offer, target customers, and core website message.",
      "Week 2: Build a simple conversion-focused website with service/product pages and contact options.",
      "Week 3: Add lead capture tools such as WhatsApp, quote forms, booking forms, or email signup.",
      "Week 4: Connect website traffic sources and begin tracking inquiries, leads, and conversions.",
    ];
  }

  if (
    profile.websiteStatus === "Has Website" &&
    (profile.goal === "Improve Website" || profile.goal === "Improve SEO")
  ) {
    return [
      `Week 1: Audit ${profile.websiteUrl || "the website"} for SEO, speed, content, mobile experience, and conversion issues.`,
      "Week 2: Improve homepage messaging, service/product pages, calls-to-action, and trust elements.",
      "Week 3: Add or improve lead capture systems such as forms, booking, WhatsApp, or consultation buttons.",
      "Week 4: Review traffic, leads, and conversion performance, then optimize weak pages.",
    ];
  }

  if (profile.goal === "Get More Customers") {
    return [
      "Week 1: Clarify the target customer, main offer, and strongest customer acquisition channel.",
      "Week 2: Improve marketing content and create a simple lead capture process.",
      "Week 3: Set up follow-up workflows for inquiries that do not convert immediately.",
      "Week 4: Measure leads, conversions, and customer acquisition results.",
    ];
  }

  if (includes(profile.automationNeed, ["booking", "follow", "message", "lead"])) {
    return [
      "Week 1: Map the current customer journey from inquiry to purchase or booking.",
      "Week 2: Identify repetitive tasks that can be automated, especially follow-ups and lead management.",
      "Week 3: Implement a simple task or CRM workflow using AEMA Task Manager or a similar system.",
      "Week 4: Track response time, completed tasks, missed leads, and conversion improvement.",
    ];
  }

  return [
    "Week 1: Audit current business operations and customer journey.",
    "Week 2: Improve online presence, messaging, and lead capture.",
    "Week 3: Implement automation and task management opportunities.",
    "Week 4: Measure results, review KPIs, and optimize the growth system.",
  ];
};