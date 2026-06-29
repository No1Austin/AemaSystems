export const getNextBusinessQuestion = (profile = {}) => {
  if (!profile.businessType) {
    return "What type of business do you run?";
  }

  if (!profile.businessStage) {
    return "What stage is your business in: idea stage, less than 1 year, 1-3 years, 3-5 years, or over 5 years?";
  }

  if (!profile.goal) {
    return "What is your biggest business goal right now: get more customers, increase sales, improve operations, automate your business, expand, or raise funding?";
  }

  if (!profile.biggestChallenge) {
    return "What is the single biggest challenge preventing your business from growing faster?";
  }

  if (!profile.monthlyCustomers) {
    return "Approximately how many customers do you serve each month: under 20, 20-100, 100-500, or 500+?";
  }

  if (!profile.monthlyRevenue) {
    return "What is your average monthly revenue range: under $2k, $2k-$10k, $10k-$50k, or $50k+?";
  }

  if (!profile.teamSize) {
    return "How many people currently work in your business: just me, 2-5, 6-20, or 20+?";
  }

  if (!profile.leadSource) {
    return "Where do most customers currently find you: Google, social media, referrals, walk-ins, WhatsApp, website, or paid ads?";
  }

  if (!profile.salesProcess) {
    return "How do customers usually buy, book, or contact you: website, WhatsApp, phone call, Instagram DM, physical store, booking link, or marketplace?";
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

  if (
    profile.websiteStatus === "Has Website" &&
    !profile.websiteGoal
  ) {
    return "What do you want visitors to do on your website: call, book, buy, request a quote, join your list, or contact you?";
  }

  if (!profile.marketingChannels) {
    return "Which marketing channels do you currently use: Instagram, TikTok, Facebook, Google, email, WhatsApp, referrals, paid ads, or none?";
  }

  if (!profile.automationNeed) {
    return "What part of your business takes the most manual time right now: bookings, follow-ups, payments, emails, reports, customer contacts, tasks, or lead management?";
  }

  if (!profile.techComfort) {
    return "How comfortable are you with digital tools and automation: beginner, intermediate, or advanced?";
  }

  return "__GENERATE_BLUEPRINT__";
};