export const generatePreparationNotes = (
  profile,
  report,
  planInfo
) => {
  return `
Package: ${planInfo.priority}

Business Type:
${profile.businessType || "Not provided"}

Goal:
${profile.goal || "Not provided"}

Website:
${profile.websiteUrl || "No website"}

Biggest Challenge:
${profile.biggestChallenge || "Not provided"}

Monthly Customers:
${profile.monthlyCustomers || "Unknown"}

Team Size:
${profile.teamSize || "Unknown"}

Preparation Checklist:
• Review AI report
• Review website
• Review recommendations
• Prepare solutions
• Review AEMA Task Manager opportunities
`;
};