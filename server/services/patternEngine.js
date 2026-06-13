// server/services/patternEngine.js

const clean = (value = "") => String(value).toLowerCase();

const has = (value, words = []) => {
  const text = clean(value);
  return words.some((word) => text.includes(word));
};

export const detectBusinessPatterns = (profile = {}) => {
  const patterns = [];

  if (
    profile.websiteStatus === "No Website" &&
    profile.leadSource === "Social Media"
  ) {
    patterns.push(
      "The business relies on social media without a dedicated website. This can create trust and conversion gaps because customers may not have a structured place to learn, compare, and take action."
    );
  }

  if (
    profile.websiteStatus === "Has Website" &&
    profile.leadSource === "Google"
  ) {
    patterns.push(
      "The business already has search visibility potential through Google. The next opportunity is improving website conversion, calls-to-action, SEO structure, and lead capture."
    );
  }

  if (has(profile.salesProcess, ["whatsapp", "dm", "message", "manual"])) {
    patterns.push(
      "The sales process appears to depend on manual conversations. This can work at an early stage, but it may reduce conversion tracking and consistent follow-up."
    );
  }

  if (has(profile.automationNeed, ["booking", "follow", "message", "lead"])) {
    patterns.push(
      "The business has clear automation opportunities around bookings, follow-ups, customer messages, and lead management."
    );
  }

  if (!profile.monthlyCustomers || Number(profile.monthlyCustomers) < 20) {
    patterns.push(
      "Customer volume appears early-stage or limited. The business should focus on lead generation, trust-building, and stronger conversion systems."
    );
  }

  if (!profile.targetCustomers) {
    patterns.push(
      "The target customer group is not clearly defined. Clearer customer targeting will improve marketing, website messaging, and sales conversion."
    );
  }

  return patterns;
};