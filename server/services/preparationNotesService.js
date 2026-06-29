// server/services/preparationNotesService.js

const text = (value = "") => String(value || "").toLowerCase().trim();

const hasAny = (value = "", words = []) => {
  const clean = Array.isArray(value)
    ? value.map((item) => text(item)).join(" ")
    : text(value);

  return words.some((word) => clean.includes(text(word)));
};

const formatList = (value) => {
  if (Array.isArray(value)) return value.join(", ");
  return value || "Unknown";
};

export const generatePreparationNotes = (
  profile = {},
  report = {},
  planInfo = {}
) => {
  const notes = [];

  const packageName = planInfo.priority || planInfo.name || "Standard";

  const manualSales = hasAny(profile.salesProcess, [
    "manual",
    "whatsapp",
    "dm",
    "message",
    "phone",
    "call",
  ]);

  const needsAutomation = hasAny(profile.automationNeed, [
    "booking",
    "follow",
    "lead",
    "workflow",
    "task",
    "payment",
    "email",
    "report",
    "manual",
  ]);

  notes.push(`PACKAGE: ${packageName}`);
  notes.push("");
  notes.push("BUSINESS OVERVIEW");
  notes.push("---------------------------");
  notes.push(`Business Name: ${profile.businessName || "Unknown"}`);
  notes.push(`Business Type: ${profile.businessType || "Unknown"}`);
  notes.push(`Industry: ${profile.industry || "Unknown"}`);
  notes.push(`Business Stage: ${profile.businessStage || profile.businessAge || "Unknown"}`);
  notes.push(`Primary Goal: ${profile.goal || "Unknown"}`);
  notes.push(`Biggest Challenge: ${profile.biggestChallenge || "Unknown"}`);
  notes.push(`Lead Source: ${profile.leadSource || "Unknown"}`);
  notes.push(`Marketing Channels: ${formatList(profile.marketingChannels)}`);
  notes.push(`Sales Process: ${profile.salesProcess || "Unknown"}`);
  notes.push(`Monthly Customers: ${profile.monthlyCustomers || "Unknown"}`);
  notes.push(`Monthly Revenue: ${profile.monthlyRevenue || "Unknown"}`);
  notes.push(`Team Size: ${profile.teamSize || "Unknown"}`);
  notes.push(`Website: ${profile.websiteUrl || "No Website"}`);

  notes.push("");
  notes.push("CONSULTANT FOCUS");
  notes.push("---------------------------");

  if (profile.websiteStatus === "No Website") {
    notes.push("• Explain how a professional website improves credibility, SEO visibility, lead capture, and customer trust.");
  }

  if (profile.websiteStatus === "Has Website") {
    notes.push("• Review the website live with the client and identify messaging, CTA, trust, SEO, and conversion opportunities.");
  }

  if (profile.leadSource === "Referrals") {
    notes.push("• Show how referrals can become a repeatable growth system using reviews, testimonials, referral requests, and follow-up reminders.");
  }

  if (profile.leadSource === "Google" || hasAny(profile.marketingChannels, ["google", "seo"])) {
    notes.push("• Review Google visibility, local SEO, reviews, landing pages, and inquiry capture.");
  }

  if (profile.leadSource === "Social Media" || hasAny(profile.marketingChannels, ["instagram", "facebook", "tiktok"])) {
    notes.push("• Review whether social media is producing customers or only engagement.");
  }

  if (manualSales) {
    notes.push("• Review the current sales journey and identify where leads are being lost or delayed.");
  }

  if (needsAutomation) {
    notes.push("• Demonstrate AEMA TaskFlow and explain how automation can reduce repetitive work and missed follow-ups.");
  }

  notes.push("");
  notes.push("QUESTIONS TO ASK");
  notes.push("---------------------------");
  notes.push("• What happens after a customer first contacts you?");
  notes.push("• How many inquiries become paying customers?");
  notes.push("• How do you currently follow up with prospects?");
  notes.push("• Which marketing channel brings your best customers?");
  notes.push("• What part of the business consumes the most time every week?");
  notes.push("• What process would you fix first if you had the right system?");
  notes.push("• What does success look like in the next 90 days?");
  notes.push("• What does success look like in the next 12 months?");

  notes.push("");
  notes.push("MEETING OBJECTIVE");
  notes.push("---------------------------");
  notes.push(
    "Leave the meeting with three agreed priorities, one quick win that can be implemented immediately, and a clear implementation roadmap inside AEMA TaskFlow."
  );

  return notes.join("\n");
};