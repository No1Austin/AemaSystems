const text = (value = "") => String(value || "").toLowerCase();

const hasAny = (value = "", words = []) =>
  words.some((word) => text(value).includes(word));

export const generateAdvisorNotes = (profile = {}) => {
  const notes = [];

  if (
    profile.goal === "Improve Marketing" &&
    (profile.websiteStatus === "No Website" ||
      hasAny(profile.salesProcess, ["manual", "whatsapp", "dm", "message"]))
  ) {
    notes.push(
      "AEMA believes the business should strengthen its conversion system before investing heavily in additional marketing activity. Increasing visibility without improving follow-up, trust signals, and lead capture may produce weaker returns."
    );
  }

  if (profile.leadSource === "Google" && profile.websiteStatus === "Has Website") {
    notes.push(
      "Google is already creating acquisition potential. The priority should be converting existing search interest more effectively through stronger website messaging, clearer calls-to-action, and better inquiry capture."
    );
  }

  if (profile.leadSource === "Walk-ins") {
    notes.push(
      "The business appears dependent on physical or direct customer traffic. AEMA recommends building digital acquisition channels so growth is not limited by location-based exposure alone."
    );
  }

  if (hasAny(profile.automationNeed, ["booking", "follow", "lead", "message"])) {
    notes.push(
      "Operational improvements should focus on repeatable systems. Lead tracking, follow-up reminders, and task ownership will likely create better consistency than relying on memory or manual communication."
    );
  }

  if (!notes.length) {
    notes.push(
      "AEMA recommends prioritizing the highest-friction point in the customer journey first, then expanding marketing once the business can consistently convert inquiries into paying customers."
    );
  }

  return notes;
};