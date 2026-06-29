// server/services/advisorNotesService.js

const text = (value = "") => String(value || "").toLowerCase().trim();

const hasAny = (value = "", words = []) => {
  const clean = Array.isArray(value)
    ? value.map((item) => text(item)).join(" ")
    : text(value);

  return words.some((word) => clean.includes(text(word)));
};

const addUnique = (notes, note) => {
  if (note && !notes.includes(note)) notes.push(note);
};

export const generateAdvisorNotes = (profile = {}) => {
  const notes = [];

  const hasWebsite = profile.websiteStatus === "Has Website";
  const noWebsite = profile.websiteStatus === "No Website";

  const earlyStage =
    hasAny(profile.businessStage || profile.businessAge, [
      "idea",
      "less than 1 year",
    ]) || hasAny(profile.monthlyCustomers, ["under 20"]);

  const manualSales = hasAny(profile.salesProcess, [
    "manual",
    "whatsapp",
    "dm",
    "message",
    "phone",
    "call",
  ]);

  const needsMarketing =
    hasAny(profile.goal, ["marketing", "customers", "sales", "leads"]) ||
    hasAny(profile.biggestChallenge, [
      "marketing",
      "customers",
      "sales",
      "leads",
    ]);

  const needsAutomation =
    hasAny(profile.goal, ["automation", "automate", "operations", "systems"]) ||
    hasAny(profile.automationNeed, [
      "booking",
      "follow",
      "lead",
      "message",
      "contact",
      "task",
      "workflow",
      "payment",
      "email",
      "report",
    ]);

  if (needsMarketing && (noWebsite || manualSales)) {
    addUnique(
      notes,
      "AEMA believes the business should strengthen its conversion system before investing heavily in additional marketing."
    );
  }

  if (profile.leadSource === "Google" && hasWebsite) {
    addUnique(
      notes,
      "Google is already creating acquisition potential. The priority should be converting existing search interest through stronger website messaging, clearer calls-to-action, SEO improvements, and better inquiry capture."
    );
  }

  if (profile.leadSource === "Referrals") {
    addUnique(
      notes,
      "The business has trust-based growth potential because customers already come through referrals. AEMA recommends turning referrals into a repeatable system using reviews, testimonials, referral requests, and follow-up reminders."
    );
  }

  if (profile.leadSource === "Walk-ins") {
    addUnique(
      notes,
      "The business appears dependent on physical or direct customer traffic. AEMA recommends building digital acquisition channels so growth is not limited by location-based exposure alone."
    );
  }

  if (manualSales) {
    addUnique(
      notes,
      "The sales process appears to depend heavily on manual conversations. AEMA recommends organizing inquiries, saved replies, follow-ups, customer details, and next actions so interested prospects are not lost."
    );
  }

  if (needsAutomation) {
    addUnique(
      notes,
      "Operational improvements should focus on repeatable systems. Lead tracking, follow-up reminders, customer records, booking management, and TaskFlow ownership will likely create better consistency."
    );
  }

  if (earlyStage) {
    addUnique(
      notes,
      "The business appears to be in an early growth stage. AEMA recommends focusing first on offer clarity, trust-building, customer acquisition, and simple systems before scaling expenses."
    );
  }

  if (hasWebsite && !profile.websiteGoal) {
    addUnique(
      notes,
      "The website should have one clear conversion goal. Visitors should immediately know whether to call, book, buy, request a quote, join a list, or contact the business."
    );
  }

  if (!notes.length) {
    notes.push(
      "AEMA recommends prioritizing the highest-friction point in the customer journey first, then expanding marketing once the business can consistently convert inquiries into paying customers."
    );
  }

  return notes;
};