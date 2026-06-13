export const getNextBusinessQuestion = (profile) => {
  if (!profile.businessType) {
    return "What type of business do you run?";
  }

  if (!profile.goal) {
    return "What do you want to improve first: getting more customers, your website, SEO, automation, sales, or business systems?";
  }

  if (!profile.leadSource) {
    return "How do most customers currently find you: Google, social media, referrals, walk-ins, or paid ads?";
  }

  if (!profile.websiteStatus) {
    return "Do you currently have a website for your business?";
  }

  if (
    profile.websiteStatus === "Has Website" &&
    !profile.websiteUrl
  ) {
    return "Please share your website link.";
  }

  if (!profile.automationNeed) {
    return "What part of your business takes the most manual time right now: bookings, follow-ups, payments, emails, reports, or lead management?";
  }

  if (!profile.biggestChallenge) {
    return "What is the single biggest challenge preventing your business from growing faster?";
  }

  if (!profile.monthlyCustomers) {
    return "Approximately how many customers do you serve each month?";
  }

  if (!profile.teamSize) {
    return "How many people currently work in your business?";
  }

  if (!profile.businessAge) {
    return "How long has your business been operating?";
  }

  if (
    profile.websiteStatus === "Has Website" &&
    !profile.websiteGoal
  ) {
    return "What do you want visitors to do on your website: call, book, buy, request a quote, or contact you?";
  }

  return "__GENERATE_BLUEPRINT__";
};