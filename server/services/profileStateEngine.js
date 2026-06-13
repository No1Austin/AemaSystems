const normalize = (value = "") => value.toLowerCase().trim();

const yesAnswers = ["yes", "yeah", "yep", "yes i do", "we do"];
const noAnswers = [
  "no",
  "nope",
  "not yet",
  "no i don't",
  "no i dont",
  "we don't",
  "we dont",
];

const invalidShortAnswers = ["yes", "no", "ok", "okay", "maybe", "not sure"];

const hasWebsiteUrl = (text) =>
  /(https?:\/\/[^\s]+|www\.[^\s]+|[a-z0-9-]+\.(com|ca|net|org|co|io|app|dev|ai|site|online|store|biz|info)[^\s]*)/i.test(
    text
  );

const extractWebsiteUrl = (text) => {
  const match = text.match(
    /(https?:\/\/[^\s]+|www\.[^\s]+|[a-z0-9-]+\.(com|ca|net|org|co|io|app|dev|ai|site|online|store|biz|info)[^\s]*)/i
  );

  return match ? match[0] : null;
};

const getInitialProfile = () => ({
  businessType: null,
  goal: null,
  leadSource: null,
  serviceLocation: null,
  websiteStatus: null,
  websiteUrl: null,

  marketingChannels: null,
  salesProcess: null,
  targetCustomers: null,
  mainOffer: null,

  automationNeed: null,
  biggestChallenge: null,
  monthlyCustomers: null,
  teamSize: null,
  businessAge: null,
  websiteGoal: null,
  
});

const getCurrentStep = (profile) => {
  if (!profile.businessType) return "businessType";
  if (!profile.goal) return "goal";
  if (!profile.leadSource) return "leadSource";
  if (!profile.serviceLocation) return "serviceLocation";
  if (!profile.websiteStatus) return "websiteStatus";
  if (profile.websiteStatus === "Has Website" && !profile.websiteUrl) {
    return "websiteUrl";
  }

  if (!profile.marketingChannels) return "marketingChannels";
  if (!profile.salesProcess) return "salesProcess";
  if (!profile.targetCustomers) return "targetCustomers";
  if (!profile.mainOffer) return "mainOffer";

  if (!profile.automationNeed) return "automationNeed";
  if (!profile.biggestChallenge) return "biggestChallenge";
  if (!profile.monthlyCustomers) return "monthlyCustomers";
  if (!profile.teamSize) return "teamSize";
  if (!profile.businessAge) return "businessAge";

  if (profile.websiteStatus === "Has Website" && !profile.websiteGoal) {
    return "websiteGoal";
  }

  return "ready";
};

const questions = {
  businessType:
    "What type of business do you run? Please describe it clearly. Example: clothing business, cleaning company, restaurant, salon, or online store.",

  goal:
    "What do you want to improve first: getting more customers, your website, SEO, automation, sales, marketing, or business systems?",

  leadSource:
    "How do most customers currently find you: Google, social media, referrals, walk-ins, paid ads, website, or another source?",

  serviceLocation:
  "What city, region, or market do you primarily serve? Example: Kitchener-Waterloo, Toronto, Lagos, or Online Worldwide.",

    websiteStatus:
    "Do you currently have a website for your business? Please answer yes or no.",

  websiteUrl:
    "Great. Please share your website link.",

  marketingChannels:
    "What marketing channels do you currently use? Example: Instagram, Facebook, TikTok, Google, flyers, referrals, WhatsApp, email, or paid ads.",

  salesProcess:
    "How do customers usually buy from you or book your service? Example: website checkout, WhatsApp, phone call, DM, booking form, walk-in, invoice, or manual follow-up.",

  targetCustomers:
    "Who are your main customers? Example: local families, students, small businesses, brides, homeowners, professionals, or online shoppers.",

  mainOffer:
    "What is your main product or service offer? Example: cleaning packages, clothing items, haircuts, food delivery, website design, consulting, or monthly service plans.",

  automationNeed:
    "What part of your business takes the most manual time right now: bookings, follow-ups, payments, emails, reports, lead management, customer messages, or something else?",

  biggestChallenge:
    "What is the single biggest challenge preventing your business from growing faster?",

  monthlyCustomers:
    "Approximately how many customers do you serve each month?",

  teamSize:
    "How many people currently work in your business?",

  businessAge:
    "How long has your business been operating?",

  websiteGoal:
    "What do you want visitors to do on your website: call, book, buy, request a quote, or contact you?",
};

const clarificationQuestions = {
  businessType:
    "Can you describe your business more clearly? For example: clothing store, cleaning service, restaurant, consulting, salon, or online store.",

  goal:
    "Can you rephrase your goal? Do you want more customers, better SEO, a better website, automation, more sales, stronger marketing, or better business systems?",

  leadSource:
    "Can you expand on this? Do customers mostly come from Google, social media, referrals, walk-ins, paid ads, your website, or somewhere else?",

  serviceLocation:
  "Can you share the city, region, or market you serve? Example: Kitchener-Waterloo, Toronto, Lagos, or Online Worldwide.",
  
    websiteStatus:
    "I just want to confirm — do you currently have a website? Please answer yes or no.",

  websiteUrl:
    "Please share your website link, for example: yourbusiness.com or https://yourbusiness.com",

  marketingChannels:
    "Can you list the marketing channels you currently use? Example: Instagram, Facebook, TikTok, Google, WhatsApp, email, referrals, flyers, or paid ads.",

  salesProcess:
    "Can you explain how customers buy from you or book your service? Example: WhatsApp, website checkout, phone call, DM, booking form, walk-in, or invoice.",

  targetCustomers:
    "Can you describe who your main customers are? Example: local families, businesses, students, homeowners, brides, professionals, or online shoppers.",

  mainOffer:
    "Can you explain your main product or service? Example: clothing items, cleaning packages, food delivery, haircuts, consulting, or monthly plans.",

  automationNeed:
    "Can you explain what takes the most manual time? Example: bookings, follow-ups, payments, emails, reports, customer messages, or lead management.",

  biggestChallenge:
    "Can you expand on your biggest challenge? What is stopping the business from growing faster?",

  monthlyCustomers:
    "Please enter an approximate number of customers you serve monthly. Example: 20, 50, or 100.",

  teamSize:
    "Please enter the number of people working in the business. Example: 1, 3, or 10.",

  businessAge:
    "Please tell me how long the business has been operating. Example: 6 months, 1 year, or 3 years.",

  websiteGoal:
    "Can you clarify what you want website visitors to do: call, book, buy, request a quote, or contact you?",
};

const detectGoal = (text) => {
  if (
    text.includes("customer") ||
    text.includes("client") ||
    text.includes("lead") ||
    text.includes("sales") ||
    text.includes("sell") ||
    text.includes("buyers")
  ) {
    return "Get More Customers";
  }

  if (text.includes("seo") || text.includes("google ranking")) {
    return "Improve SEO";
  }

  if (text.includes("website") || text.includes("site")) {
    return "Improve Website";
  }

  if (text.includes("automation") || text.includes("automate")) {
    return "Automate Business";
  }

  if (text.includes("system") || text.includes("operation")) {
    return "Improve Business Systems";
  }

  if (text.includes("marketing") || text.includes("advertising")) {
    return "Improve Marketing";
  }

  if (text.includes("brand") || text.includes("branding")) {
    return "Improve Branding";
  }

  return null;
};

const detectLeadSource = (text) => {
  if (
    text.includes("google ads") ||
    text.includes("facebook ads") ||
    text.includes("instagram ads") ||
    text.includes("paid ads")
  ) {
    return "Paid Ads";
  }

  if (text.includes("referral") || text.includes("word of mouth")) {
    return "Referrals";
  }

  if (
    text.includes("social") ||
    text.includes("instagram") ||
    text.includes("facebook") ||
    text.includes("tiktok") ||
    text.includes("linkedin")
  ) {
    return "Social Media";
  }

  if (text.includes("walk")) return "Walk-ins";
  if (text.includes("google")) return "Google";
  if (text.includes("website")) return "Website";
  if (text.includes("whatsapp")) return "WhatsApp";

  return null;
};

const isUsefulText = (answer) => {
  if (!answer || answer.length < 3) return false;
  if (invalidShortAnswers.includes(answer)) return false;
  return true;
};

export const processBusinessConversation = (messages = []) => {
  const profile = getInitialProfile();
  const userMessages = messages.filter((msg) => msg.role === "user");

  for (const msg of userMessages) {
    const rawAnswer = msg.content?.trim() || "";
    const answer = normalize(rawAnswer);
    const step = getCurrentStep(profile);

    if (step === "ready") break;

    if (step === "businessType") {
      if (!isUsefulText(answer)) continue;
      profile.businessType = rawAnswer;
      continue;
    }

    if (step === "goal") {
      const goal = detectGoal(answer);
      if (!goal) continue;
      profile.goal = goal;
      continue;
    }

    if (step === "leadSource") {
      const leadSource = detectLeadSource(answer);
      if (!leadSource) continue;
      profile.leadSource = leadSource;
      continue;
    }


    if (step === "serviceLocation") {
  if (!isUsefulText(answer)) continue;
  profile.serviceLocation = rawAnswer;
  continue;
}

    if (step === "websiteStatus") {
      if (
        yesAnswers.includes(answer) ||
        answer.includes("i have") ||
        answer.includes("we have") ||
        hasWebsiteUrl(answer)
      ) {
        profile.websiteStatus = "Has Website";

        const url = extractWebsiteUrl(answer);
        if (url) profile.websiteUrl = url;

        continue;
      }

      if (
        noAnswers.includes(answer) ||
        answer.includes("no website") ||
        answer.includes("don't have") ||
        answer.includes("dont have") ||
        answer.includes("do not have") ||
        answer.includes("without website") ||
        answer.includes("without a website")
      ) {
        profile.websiteStatus = "No Website";
        continue;
      }

      continue;
    }

    if (step === "websiteUrl") {
      const url = extractWebsiteUrl(answer);
      if (!url) continue;

      profile.websiteUrl = url;
      profile.websiteStatus = "Has Website";
      continue;
    }

    if (step === "marketingChannels") {
      if (!isUsefulText(answer)) continue;
      profile.marketingChannels = rawAnswer;
      continue;
    }

    if (step === "salesProcess") {
      if (!isUsefulText(answer)) continue;
      profile.salesProcess = rawAnswer;
      continue;
    }

    if (step === "targetCustomers") {
      if (!isUsefulText(answer)) continue;
      profile.targetCustomers = rawAnswer;
      continue;
    }

    if (step === "mainOffer") {
      if (!isUsefulText(answer)) continue;
      profile.mainOffer = rawAnswer;
      continue;
    }

    if (step === "automationNeed") {
      if (!isUsefulText(answer)) continue;
      profile.automationNeed = rawAnswer;
      continue;
    }

    if (step === "biggestChallenge") {
      if (!isUsefulText(answer)) continue;
      profile.biggestChallenge = rawAnswer;
      continue;
    }

    if (step === "monthlyCustomers") {
      const number = answer.match(/\d+/);
      if (!number) continue;

      profile.monthlyCustomers = Number(number[0]);
      continue;
    }

    if (step === "teamSize") {
      const number = answer.match(/\d+/);
      if (!number) continue;

      profile.teamSize = Number(number[0]);
      continue;
    }

    if (step === "businessAge") {
      if (
        !answer.includes("month") &&
        !answer.includes("year") &&
        !answer.match(/\d+/)
      ) {
        continue;
      }

      profile.businessAge = rawAnswer;
      continue;
    }

    if (step === "websiteGoal") {
      if (!isUsefulText(answer)) continue;
      profile.websiteGoal = rawAnswer;
      continue;
    }
  }

  const currentStep = getCurrentStep(profile);
  const userAnswerCount = userMessages.length;

  if (currentStep === "ready") {
    return {
      profile,
      readyForBlueprint: true,
      reply:
        "Excellent. I have enough information to create your AEMA Growth Blueprint.",
    };
  }

  if (userAnswerCount >= 10) {
    return {
      profile,
      readyForBlueprint: true,
      reply:
        "I have enough information to create your first AEMA Growth Blueprint. For deeper analysis, you can unlock the full report after reviewing the summary.",
    };
  }

  const lastUserMessage = normalize(
    userMessages[userMessages.length - 1]?.content || ""
  );

  const needsClarification =
    userMessages.length > 0 &&
    (lastUserMessage.length < 3 ||
      invalidShortAnswers.includes(lastUserMessage));

  if (needsClarification) {
    return {
      profile,
      readyForBlueprint: false,
      reply: clarificationQuestions[currentStep],
    };
  }

  return {
    profile,
    readyForBlueprint: false,
    reply: questions[currentStep],
  };
};