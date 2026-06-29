// server/services/conversationCoach.js

const text = (value = "") => String(value || "").toLowerCase();

const hasAny = (value = "", words = []) => {
  const clean = Array.isArray(value)
    ? value.map((item) => text(item)).join(" ")
    : text(value);

  return words.some((word) => clean.includes(text(word)));
};

const formatGoal = (goal = "") =>
  String(goal || "")
    .replace(/^get /i, "getting ")
    .replace(/^increase /i, "increasing ")
    .toLowerCase();

const getObservation = (profile = {}, nextField = "") => {
  switch (nextField) {
    case "businessName":
      return "Let’s start with the business name so AEMA can identify the business properly and, where possible, compare it against public Google Business visibility.";

    case "businessType":
      return profile.businessName
        ? `Great. Now I need to understand what kind of business ${profile.businessName} is so the analysis uses the right industry logic.`
        : "Now I need to understand the type of business so AEMA can apply the right industry logic, customer journey, and growth model.";

    case "serviceLocation":
      return profile.businessName
        ? `To check local visibility and similar businesses, I need to know where ${profile.businessName} primarily operates.`
        : "Location helps AEMA tailor the strategy around local search, competition, customer behavior, and realistic marketing channels.";

    case "goal":
      return "Now that I understand the business foundation, I need to know the main outcome the Growth Blueprint should focus on.";

    case "leadSource":
      return "Your customer source tells me whether the business needs more visibility, better conversion, stronger follow-up, or a more predictable acquisition system.";

    case "websiteStatus":
      return "Your website situation matters because it affects trust, SEO visibility, lead capture, and how easily customers can take action.";

    case "websiteUrl":
      return "Great. If the business already has a website, AEMA can include it in the audit and look for conversion, trust, and SEO opportunities.";

    case "marketingChannels":
      return profile.leadSource
        ? `Since customers currently come through ${profile.leadSource}, I want to understand the full marketing mix and whether the business is too dependent on one channel.`
        : "Marketing channels show how the business creates awareness and whether those activities connect to real customer acquisition.";

    case "salesProcess":
      if (hasAny(profile.marketingChannels, ["instagram", "facebook", "tiktok", "social"])) {
        return "Social media can create attention, but the sales process determines whether that attention becomes real customers.";
      }
      if (hasAny(profile.leadSource, ["google"])) {
        return "Google can bring interested prospects, but the sales process determines whether that search interest becomes inquiries, bookings, or sales.";
      }
      return "The next important part is understanding how interest turns into payment, booking, or inquiry.";

    case "targetCustomers":
      if (hasAny(profile.businessType, ["clothing", "fashion"])) {
        return "For clothing businesses, the target customer affects style, pricing, content, product presentation, and marketing message.";
      }
      if (hasAny(profile.businessType, ["cleaning"])) {
        return "For cleaning businesses, residential customers, offices, landlords, and commercial clients all need different messaging.";
      }
      if (hasAny(profile.businessType, ["restaurant", "food"])) {
        return "For food businesses, knowing the customer helps shape the menu, pricing, delivery options, content, and local marketing.";
      }
      return "Before I recommend a growth strategy, I need to understand the exact type of customer the business is trying to attract.";

    case "mainOffer":
      return profile.targetCustomers
        ? "That gives me a clearer picture of who the business serves. Now I need to understand the main offer those customers are buying."
        : "The main offer is the center of the growth strategy. The clearer the offer, the easier it is to market and sell.";

    case "automationNeed":
      if (hasAny(profile.salesProcess, ["whatsapp", "dm", "manual", "phone"])) {
        return "That sounds like a mostly manual sales process, which is often where growing businesses start losing time, leads, and follow-ups.";
      }
      return "Now I want to identify where the business is losing the most time operationally.";

    case "biggestChallenge":
      return profile.goal
        ? `Since the goal is ${formatGoal(profile.goal)}, the biggest challenge will help identify the first real growth blocker.`
        : "This is important because the biggest growth blocker usually tells us where the first priority should be.";

    case "monthlyCustomers":
      return "Customer volume helps me understand whether the business needs foundation-building, conversion improvement, or scaling systems.";

    case "monthlyRevenue":
      return "Revenue range helps connect the strategy to the current business stage and realistic next steps.";

    case "teamSize":
      return "Team size tells me whether the growth plan should be built around solo execution, delegation, automation, or stronger internal systems.";

    case "businessStage":
      return "Business age helps separate early-stage problems from scaling problems, because a new business and an established business need different priorities.";

    case "websiteGoal":
      return "Since the business has a website, it needs one clear purpose so visitors know exactly what action to take.";

    default:
      return "That helps. I am building a clearer picture before generating the Growth Blueprint.";
  }
};

const getQuestion = (nextField = "") => {
  const questions = {
    businessName:
      "What is the name of your business? If it has a Google Business Profile, AEMA can use the name and location to check public visibility signals.",

    businessType:
      "What type of business is it? For example: hair salon, childcare, restaurant, cleaning service, clothing brand, construction company, consulting business, or software business.",

    serviceLocation:
      "What city, region, or market does the business primarily serve?",

    goal:
      "What main outcome do you want right now: more customers, more sales, better marketing, a stronger website, SEO, automation, or better business systems?",

    leadSource:
      "How do most customers currently find you: referrals, Google, social media, walk-ins, paid ads, WhatsApp, agencies, or another source?",

    websiteStatus:
      "Do you currently have a website? You can answer yes, no, or paste the website link.",

    websiteUrl:
      "Please paste your website link.",

    marketingChannels:
      "Which marketing channels do you currently use? For example: Instagram, Facebook, TikTok, Google, referrals, agencies, WhatsApp, email, flyers, or paid ads.",

    salesProcess:
      "Once someone shows interest, how do they usually buy from you or book your service? For example: WhatsApp, DM, phone call, booking form, website checkout, walk-in, agency referral, or invoice.",

    targetCustomers:
      "Who normally buys from you? For example: young adults, families, brides, homeowners, students, professionals, small businesses, agencies, or online shoppers.",

    mainOffer:
      "What is your main product or service offer?",

    automationNeed:
      "What part of the business takes the most manual time right now: bookings, follow-ups, payments, emails, reports, lead management, customer messages, or tasks?",

    biggestChallenge:
      "What is the biggest challenge stopping the business from growing faster?",

    monthlyCustomers:
      "Roughly how many customers do you serve in a typical month? You can answer: under 20, 20-100, 100-500, or 500+.",

    monthlyRevenue:
      "What is your approximate monthly revenue range? You can answer: under $2k, $2k-$10k, $10k-$50k, or $50k+.",

    teamSize:
      "How many people work in the business? You can answer: just me, 2-5, 6-20, or 20+.",

    businessStage:
      "How long has the business been operating? Example: idea stage, less than 1 year, 1-3 years, 3-5 years, or over 5 years.",

    websiteGoal:
      "What do you want visitors to do on your website: call, book, buy, request a quote, contact you, or join a list?",
  };

  return questions[nextField] || "Can you share a little more about the business?";
};

export const buildConversationalReply = ({ profile = {}, missingFields = [] } = {}) => {
  const nextField = missingFields[0];

  if (!nextField) {
    return "Excellent. I have enough information to create your AEMA Growth Blueprint.";
  }

  const observation = getObservation(profile, nextField);
  const question = getQuestion(nextField);

  return `${observation}\n\n${question}`;
};
