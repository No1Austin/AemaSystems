// server/services/preparationNotesService.js

const text = (value = "") => String(value || "").toLowerCase().trim();

const hasAny = (value = "", words = []) =>
  words.some((word) => text(value).includes(text(word)));

export const generatePreparationNotes = (
  profile = {},
  report = {},
  planInfo = {}
) => {
  const notes = [];

  notes.push(`PACKAGE: ${planInfo.priority || "Standard"}`);
  notes.push("");

  notes.push("BUSINESS OVERVIEW");
  notes.push("---------------------------");
  notes.push(`Business Type: ${profile.businessType || "Unknown"}`);
  notes.push(`Business Stage: ${profile.businessStage || profile.businessAge || "Unknown"}`);
  notes.push(`Primary Goal: ${profile.goal || "Unknown"}`);
  notes.push(`Biggest Challenge: ${profile.biggestChallenge || "Unknown"}`);
  notes.push(`Lead Source: ${profile.leadSource || "Unknown"}`);
  notes.push(`Monthly Customers: ${profile.monthlyCustomers || "Unknown"}`);
  notes.push(`Monthly Revenue: ${profile.monthlyRevenue || "Unknown"}`);
  notes.push(`Team Size: ${profile.teamSize || "Unknown"}`);
  notes.push(`Sales Process: ${profile.salesProcess || "Unknown"}`);
  notes.push(`Website: ${profile.websiteUrl || "No Website"}`);

  notes.push("");

  notes.push("CONSULTANT FOCUS");
  notes.push("---------------------------");

  if (profile.websiteStatus === "No Website") {
    notes.push(
      "• Demonstrate how a professional website improves credibility, lead generation and Google visibility."
    );
  } else {
    notes.push(
      "• Review the website live with the client and identify conversion opportunities."
    );
  }

  if (profile.leadSource === "Referrals") {
    notes.push(
      "• Explain how to turn referrals into a predictable growth system using reviews, Google Business Profile and follow-up automation."
    );
  }

  if (
    profile.leadSource === "Social Media" ||
    hasAny(profile.marketingChannels, [
      "instagram",
      "facebook",
      "tiktok",
    ])
  ) {
    notes.push(
      "• Review whether social media is producing customers or only engagement."
    );
  }

  if (
    hasAny(profile.salesProcess, [
      "whatsapp",
      "manual",
      "phone",
      "dm",
    ])
  ) {
    notes.push(
      "• Review the current sales journey and identify where leads are being lost."
    );
  }

  if (
    hasAny(profile.automationNeed, [
      "booking",
      "follow",
      "crm",
      "workflow",
      "lead",
    ])
  ) {
    notes.push(
      "• Demonstrate TaskFlow and explain how automation can remove repetitive work."
    );
  }

  notes.push("");

  notes.push("QUESTIONS TO ASK");
  notes.push("---------------------------");

  notes.push("• What happens after a customer first contacts you?");
  notes.push("• How many inquiries become paying customers?");
  notes.push("• How do you currently follow up with prospects?");
  notes.push("• Which marketing channel performs best?");
  notes.push("• What business process consumes the most time?");
  notes.push("• What does success look like in the next 12 months?");

  notes.push("");

  notes.push("LIKELY OPPORTUNITIES");
  notes.push("---------------------------");

  if (report?.opportunities?.length) {
    report.opportunities.forEach((item) =>
      notes.push(`• ${item}`)
    );
  } else {
    notes.push("• Website optimization");
    notes.push("• Better lead generation");
    notes.push("• Stronger customer follow-up");
    notes.push("• Automation");
  }

  notes.push("");

  notes.push("PRODUCTS TO DEMONSTRATE");
  notes.push("---------------------------");

  notes.push("• AEMA AI Business Intelligence");
  notes.push("• TaskFlow Business Management");
  notes.push("• Website Audit");
  notes.push("• SEO Optimization");
  notes.push("• Workflow Automation");

  notes.push("");

  notes.push("MEETING OBJECTIVE");
  notes.push("---------------------------");

  notes.push(
    "Leave the meeting with three agreed priorities, one quick win that can be implemented immediately, and a clear implementation roadmap inside TaskFlow."
  );

  return notes.join("\n");
};