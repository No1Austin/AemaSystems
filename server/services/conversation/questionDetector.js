// server/services/conversation/questionDetector.js

const text = (value = "") => String(value || "").toLowerCase();

const hasAny = (value = "", words = []) => {
  const clean = text(value);
  return words.some((word) => clean.includes(text(word)));
};

export const detectExpectedFieldFromAssistant = (message = "") => {
  const clean = text(message);

  if (hasAny(clean, ["name of your business", "business name", "what is your business called"])) return "businessName";
  if (hasAny(clean, ["what type of business", "type of business is it"])) return "businessType";
  if (hasAny(clean, ["city", "region", "market", "primarily serve", "where", "location"])) return "serviceLocation";
  if (hasAny(clean, ["main outcome", "want right now", "growth blueprint should focus"])) return "goal";
  if (hasAny(clean, ["customers currently find you", "how do most customers"])) return "leadSource";
  if (hasAny(clean, ["currently have a website", "do you currently have a website"])) return "websiteStatus";
  if (hasAny(clean, ["paste your website link", "share your website link"])) return "websiteUrl";
  if (hasAny(clean, ["marketing channels"])) return "marketingChannels";
  if (hasAny(clean, ["buy from you", "book your service", "how do they usually buy"])) return "salesProcess";
  if (hasAny(clean, ["main customers", "who normally buys", "who normally uses"])) return "targetCustomers";
  if (hasAny(clean, ["main product", "main service", "main offer"])) return "mainOffer";
  if (hasAny(clean, ["manual time", "takes the most manual", "most repetitive"])) return "automationNeed";
  if (hasAny(clean, ["biggest challenge", "stopping the business"])) return "biggestChallenge";
  if (hasAny(clean, ["customers do you serve", "typical month"])) return "monthlyCustomers";
  if (hasAny(clean, ["monthly revenue", "revenue range"])) return "monthlyRevenue";
  if (hasAny(clean, ["people work", "team size", "how many people"])) return "teamSize";
  if (hasAny(clean, ["business been operating", "how long has", "business age"])) return "businessStage";
  if (hasAny(clean, ["visitors to do on your website", "website goal"])) return "websiteGoal";

  return null;
};
