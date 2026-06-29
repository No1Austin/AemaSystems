// server/services/ai/promptBuilder.js

const asArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const cleanText = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

const take = (items, limit = 5) => {
  return asArray(items).slice(0, limit);
};

const formatList = (items = [], limit = 5) => {
  const list = take(items, limit);

  if (!list.length) return "None provided";

  return list
    .map((item, index) => {
      if (typeof item === "string") {
        return `${index + 1}. ${item}`;
      }

      return `${index + 1}. ${
        item.title ||
        item.reason ||
        item.opportunity ||
        item.action ||
        item.summary ||
        JSON.stringify(item)
      }`;
    })
    .join("\n");
};

const getSnapshot = (report = {}, profile = {}) => {
  const snapshot = report.businessSnapshot || {};

  return {
    businessName:
      snapshot.businessName ||
      profile.businessName ||
      snapshot.businessType ||
      profile.businessType ||
      "Not provided",

    industry: snapshot.industry || profile.industry || "Not provided",

    businessType:
      snapshot.businessType || profile.businessType || "Not provided",

    mainOffer: snapshot.mainOffer || profile.mainOffer || "Not provided",

    goal: snapshot.goal || profile.goal || "Not provided",

    leadSource: snapshot.leadSource || profile.leadSource || "Not provided",

    serviceLocation:
      snapshot.serviceLocation || profile.serviceLocation || "Not provided",

    websiteStatus:
      snapshot.websiteStatus || profile.websiteStatus || "Not provided",

    websiteUrl: snapshot.websiteUrl || profile.websiteUrl || "Not provided",

    marketingChannels:
      snapshot.marketingChannels ||
      profile.marketingChannels ||
      "Not provided",

    salesProcess:
      snapshot.salesProcess || profile.salesProcess || "Not provided",

    monthlyCustomers:
      snapshot.monthlyCustomers || profile.monthlyCustomers || "Not provided",

    monthlyRevenue:
      snapshot.monthlyRevenue || profile.monthlyRevenue || "Not provided",

    teamSize: snapshot.teamSize || profile.teamSize || "Not provided",

    businessStage:
      snapshot.businessStage ||
      profile.businessStage ||
      profile.businessAge ||
      "Not provided",

    biggestChallenge:
      snapshot.biggestChallenge || profile.biggestChallenge || "Not provided",

    automationNeed:
      snapshot.automationNeed || profile.automationNeed || "Not provided",
  };
};

export const buildBusinessAnalysisPrompt = (analysis = {}) => {
  const {
    profile = {},
    blueprint = {},
    report = {},
    expertAnalysis = null,
    preparationNotes = null,
    marketIntelligence = {},
  } = analysis;

  const snapshot = getSnapshot(report, profile);

  return `
You are enhancing an AEMA Growth Blueprint into a premium business consultant report.

Use ONLY the business facts below.
Do NOT invent facts.
Do NOT change the growth score.
Do NOT change the growth potential.
Do NOT create fake revenue, customers, competitors, or website findings.
If a field is unclear or inconsistent, mention it professionally as something to verify.

BUSINESS SNAPSHOT
Business Name: ${cleanText(snapshot.businessName)}
Industry: ${cleanText(snapshot.industry)}
Business Type: ${cleanText(snapshot.businessType)}
Main Offer: ${cleanText(snapshot.mainOffer)}
Goal: ${cleanText(snapshot.goal)}
Lead Source: ${cleanText(snapshot.leadSource)}
Location: ${cleanText(snapshot.serviceLocation)}
Website Status: ${cleanText(snapshot.websiteStatus)}
Website URL: ${cleanText(snapshot.websiteUrl)}
Marketing Channels: ${cleanText(snapshot.marketingChannels)}
Sales Process: ${cleanText(snapshot.salesProcess)}
Monthly Customers: ${cleanText(snapshot.monthlyCustomers)}
Monthly Revenue: ${cleanText(snapshot.monthlyRevenue)}
Team Size: ${cleanText(snapshot.teamSize)}
Business Stage: ${cleanText(snapshot.businessStage)}
Biggest Challenge: ${cleanText(snapshot.biggestChallenge)}
Automation Need: ${cleanText(snapshot.automationNeed)}

GROWTH SCORE
Score: ${cleanText(report.growthScore || blueprint.growthScore)}/100
Potential: ${cleanText(report.growthPotential || blueprint.growthPotential)}

SCORING NOTES
${formatList(report.scoringNotes, 7)}

WEBSITE FINDINGS
${formatList(report.websiteAnalysis, 10)}

STRENGTHS
${formatList(report.strengths, 5)}

WEAKNESSES
${formatList(report.weaknesses, 5)}

RISKS
${formatList(report.risks, 5)}

CURRENT RECOMMENDATIONS
${formatList(
  report.prioritizedRecommendations ||
    blueprint.recommendations ||
    report.opportunities,
  6
)}

ACTION PLAN
${formatList(report.actionPlan30Days, 4)}

MARKET INTELLIGENCE
Available: ${marketIntelligence?.available ? "Yes" : "No"}
Source: ${marketIntelligence?.source || "Not available"}

Marketing Survey:
${formatList(marketIntelligence?.marketingSurvey, 5)}

Business Survey:
${formatList(marketIntelligence?.businessSurvey, 5)}

Geo Survey:
${formatList(marketIntelligence?.geoSurvey, 5)}

Market Opportunities:
${formatList(marketIntelligence?.marketOpportunities, 5)}

Market Risks:
${formatList(marketIntelligence?.marketRisks, 5)}

EXPERT ANALYSIS SUMMARY
${
  expertAnalysis
    ? `
Consultant Summary:
${formatList(expertAnalysis.consultantSummary, 4)}

Priority Actions:
${formatList(expertAnalysis.priorityActions, 5)}

Expected Outcomes:
${formatList(expertAnalysis.expectedOutcomes, 5)}
`
    : "No expert analysis provided."
}

PREPARATION NOTES
${preparationNotes ? cleanText(preparationNotes).slice(0, 1200) : "None provided."}

YOUR TASK

Write like a senior business consultant preparing a paid business operating plan.

Return valid JSON only using this exact structure:

{
  "enhancedExecutiveSummary": [
    "Paragraph 1: situation and score interpretation.",
    "Paragraph 2: root cause diagnosis.",
    "Paragraph 3: recommended strategic direction."
  ],
  "strategicDiagnosis": [
    "Connect the main growth problem to the facts provided.",
    "Explain the relationship between acquisition, website, sales process, follow-up, and operations.",
    "Explain what should be treated as the highest priority."
  ],
  "highestPriorityOpportunities": [
    "Priority opportunity 1.",
    "Priority opportunity 2.",
    "Priority opportunity 3."
  ],
  "recommendedNextActions": [
    "Action 1.",
    "Action 2.",
    "Action 3.",
    "Action 4.",
    "Action 5."
  ],
  "consultantClosingNote": "A short, confident closing note focused on execution, TaskFlow, and measurement."
}

QUALITY RULES

- Make the executive summary read like a connected business story, not separate bullet points.
- Use market intelligence only if it is provided.
- If market intelligence is unavailable, do not pretend it exists.
- Identify the root cause behind the growth issue.
- Be direct and practical.
- Prioritize actions; do not list everything equally.
- Connect recommendations to implementation.
- Mention AEMA TaskFlow only where it helps with tasks, follow-up, bookings, contacts, reminders, implementation, or KPI tracking.
- Do not use generic motivational language.
- Do not over-explain.
- Keep the JSON concise so it does not get cut off.
`;
};