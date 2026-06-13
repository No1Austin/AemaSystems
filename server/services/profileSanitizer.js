export const sanitizeProfile = (profile = {}) => {
  return {
    businessType: profile.businessType || null,
    goal: profile.goal || null,
    leadSource: profile.leadSource || null,
    serviceLocation: profile.serviceLocation || null,
    websiteStatus: profile.websiteStatus || null,
    websiteUrl: profile.websiteUrl || null,
    marketingChannels: profile.marketingChannels || null,
    salesProcess: profile.salesProcess || null,
    targetCustomers: profile.targetCustomers || null,
    mainOffer: profile.mainOffer || null,
    automationNeed: profile.automationNeed || null,
    biggestChallenge: profile.biggestChallenge || null,
    monthlyCustomers: profile.monthlyCustomers || null,
    teamSize: profile.teamSize || null,
    businessAge: profile.businessAge || null,
    websiteGoal: profile.websiteGoal || null,
    websiteAudit: profile.websiteAudit || null,
  };
};