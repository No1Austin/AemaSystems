// server/services/conversationCoach.js

/**
 * AEMA Conversation Coach
 *
 * Responsibilities:
 * 1. Select the next assessment objective.
 * 2. Give a short contextual observation.
 * 3. Ask one clear question.
 * 4. Avoid unsupported assumptions.
 * 5. Avoid repeating information already known.
 * 6. Return structured metadata when required.
 *
 * IMPORTANT:
 * This file should guide the conversation.
 * It should NOT make final business conclusions before
 * sufficient information has been collected.
 */

const normalize = (value = "") =>
  String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const hasAny = (value = "", words = []) => {
  const clean = Array.isArray(value)
    ? value.map((item) => normalize(item)).join(" ")
    : normalize(value);

  return words.some((word) =>
    clean.includes(normalize(word))
  );
};

const isEmpty = (value) =>
  value === null ||
  value === undefined ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

const formatGoal = (goal = "") => {
  const clean = String(goal || "").trim();

  if (!clean) return "";

  return clean
    .replace(/^get /i, "getting ")
    .replace(/^increase /i, "increasing ")
    .replace(/^improve /i, "improving ")
    .toLowerCase();
};

const formatValue = (value = "") => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(", ");
  }

  return String(value || "").trim();
};

/**
 * -------------------------------------------------------
 * OBSERVATION ENGINE
 * -------------------------------------------------------
 *
 * Observations should:
 * - acknowledge known information;
 * - explain why the next question matters;
 * - never invent a problem;
 * - never prematurely diagnose the business.
 */

const getObservation = (
  profile = {},
  nextField = ""
) => {
  switch (nextField) {
    case "businessName":
      return (
        "I’ll start with the business identity so the rest of the assessment can be connected to the right company."
      );

    case "businessType":
      if (profile.businessName) {
        return (
          `Thanks. Now I need to understand what ${profile.businessName} actually does so I can interpret the rest of the business correctly.`
        );
      }

      return (
        "Next I need to understand what the business actually does so the assessment can use the right business context."
      );

    case "serviceLocation":
      if (profile.businessName) {
        return (
          `Knowing where ${profile.businessName} operates will help me understand its market, local visibility, customer reach, and competitive environment.`
        );
      }

      return (
        "Location helps me understand the market the business operates in and whether the strategy should be local, regional, national, or online."
      );

    case "goal":
      if (profile.businessType) {
        return (
          `I understand the business better now. The next step is identifying the result you most want the business to achieve.`
        );
      }

      return (
        "The main business objective will determine what the rest of the assessment should prioritize."
      );

    case "leadSource":
      if (profile.goal) {
        return (
          `Since your current goal is ${formatGoal(
            profile.goal
          )}, understanding where customers come from will help identify which acquisition channels are already working.`
        );
      }

      return (
        "Understanding where customers currently come from helps distinguish an awareness problem from a conversion or retention problem."
      );

    case "websiteStatus":
      return (
        "Your digital presence is another important part of the picture because a website can affect trust, discovery, lead capture, bookings, and sales."
      );

    case "websiteUrl":
      return (
        "Since the business already has a website, I can use the actual website rather than relying only on self-reported information."
      );

    case "marketingChannels":
      if (profile.leadSource) {
        return (
          `You mentioned ${formatValue(
            profile.leadSource
          )} as a customer source. I also want to understand the other channels the business actively uses.`
        );
      }

      return (
        "The channels you actively use help me understand how the business creates awareness and reaches potential customers."
      );

    case "salesProcess":
      if (profile.leadSource) {
        return (
          `Now that I know how customers are finding the business, I want to understand what happens after someone becomes interested.`
        );
      }

      return (
        "The next step is understanding how customer interest turns into an inquiry, booking, purchase, or payment."
      );

    case "targetCustomers":
      if (profile.businessType) {
        return (
          `Knowing the business type helps, but the strategy also depends on exactly who the business serves.`
        );
      }

      return (
        "A useful growth strategy needs a clear picture of the people or organizations most likely to buy."
      );

    case "mainOffer":
      if (profile.targetCustomers) {
        return (
          `I now have a clearer idea of who the business serves. Next I need to understand the main thing those customers are actually paying for.`
        );
      }

      return (
        "The primary offer is central to the assessment because marketing, pricing, conversion, and customer experience all depend on what is actually being sold."
      );

    case "automationNeed":
      /**
       * IMPORTANT:
       *
       * Do NOT automatically describe phone, WhatsApp,
       * DMs, walk-ins, etc. as a problem.
       *
       * We have not yet asked the user which activity
       * actually consumes the most time.
       */

      if (
        hasAny(
          profile.salesProcess,
          ["whatsapp", "dm", "phone", "walk-in", "invoice"]
        )
      ) {
        return (
          `I understand how customers currently move through the sales or booking process. Now I want to look beyond that and identify where time is actually being spent across the business.`
        );
      }

      if (profile.salesProcess) {
        return (
          "That gives me the customer process. The next question is about operational effort—what actually consumes the most hands-on time."
        );
      }

      return (
        "Now I want to understand where the business is spending the most hands-on time so I can distinguish necessary work from work that may be simplified or automated."
      );

    case "biggestChallenge":
      if (profile.goal && profile.automationNeed) {
        return (
          `I understand both the goal and where significant time is being spent. Now I need to identify the biggest obstacle preventing the business from moving forward.`
        );
      }

      if (profile.goal) {
        return (
          `Since the goal is ${formatGoal(
            profile.goal
          )}, identifying the biggest blocker will help determine what should be addressed first.`
        );
      }

      return (
        "The biggest current obstacle helps determine where the first meaningful improvement should be made."
      );

    case "monthlyCustomers":
      return (
        "Customer volume helps me understand the scale of the operation and whether the priority is acquisition, conversion, capacity, retention, or scaling."
      );

    case "monthlyRevenue":
      return (
        "Revenue gives useful context about the current business stage and helps keep recommendations realistic for the size of the operation."
      );

    case "teamSize":
      return (
        "Team size helps me understand who is actually available to execute the strategy and where automation, delegation, or process improvements may matter."
      );

    case "businessStage":
      return (
        "The length of time the business has been operating helps distinguish early-stage challenges from problems that appear during growth and scaling."
      );

    case "websiteGoal":
      return (
        "Since the business has a website, I also need to understand the primary action that website is supposed to generate."
      );

    default:
      return (
        "That adds useful context. I’m continuing to build the business picture before producing the Growth Blueprint."
      );
  }
};

/**
 * -------------------------------------------------------
 * QUESTION ENGINE
 * -------------------------------------------------------
 *
 * Questions should:
 * - ask one thing at a time;
 * - allow unexpected/free-text answers;
 * - provide examples without implying that examples
 *   are the only valid answers.
 */

const QUESTIONS = {
  businessName:
    "What is the name of your business?",

  businessType:
    "What does the business do? You can describe it in your own words—for example, car repair, childcare, consulting, construction, clothing, software, food services, or anything else.",

  serviceLocation:
    "Where does the business primarily operate or serve customers? You can give a city, region, country, or say that it operates online.",

  goal:
    "What is the main result you want the business to achieve right now? For example, more customers, higher sales, stronger marketing, better systems, expansion, automation, or something else.",

  leadSource:
    "How do most new customers currently discover the business? For example, referrals, Google, social media, walk-ins, advertising, partnerships, or another source.",

  websiteStatus:
    "Does the business currently have a website? You can answer yes, no, or paste the website link.",

  websiteUrl:
    "Please paste the website link.",

  marketingChannels:
    "Which marketing or promotional channels does the business currently use? List as many as apply, or describe them in your own words.",

  salesProcess:
    "When someone becomes interested, what normally happens from that point until they become a paying customer or complete a booking?",

  targetCustomers:
    "Who normally buys the product or uses the service? Describe the typical customer in your own words.",

  mainOffer:
    "What is the main product or service customers pay the business for?",

  automationNeed:
    "What part of running the business takes the most hands-on or manual time? It can be anything—including the actual service you provide, administration, bookings, customer communication, payments, follow-ups, reporting, or something else.",

  biggestChallenge:
    "What is the biggest challenge preventing the business from growing or operating better right now?",

  monthlyCustomers:
    "Roughly how many customers does the business serve in a typical month? You can give an exact number, an estimate, or a range.",

  monthlyRevenue:
    "What is the approximate monthly revenue? You can give an amount or a rough range if you prefer.",

  teamSize:
    "How many people currently work in the business, including you?",

  businessStage:
    "How long has the business been operating? You can give the number of months or years, or say that it is still at the idea stage.",

  websiteGoal:
    "What is the main action you want someone to take after visiting the website—for example call, book, buy, request a quote, contact you, subscribe, or something else?",
};

const getQuestion = (nextField = "") =>
  QUESTIONS[nextField] ||
  "Can you tell me a little more about that part of the business?";

/**
 * -------------------------------------------------------
 * STRUCTURED TURN BUILDER
 * -------------------------------------------------------
 *
 * This is the preferred function for the future.
 *
 * Instead of returning only English, it returns:
 *
 * {
 *   reply,
 *   expectedField,
 *   observation,
 *   question
 * }
 *
 * That means the application no longer needs to guess
 * what question AEMA asked.
 */

export const buildConversationTurn = ({
  profile = {},
  missingFields = [],
} = {}) => {
  const nextField =
    Array.isArray(missingFields)
      ? missingFields.find(
          (field) =>
            field &&
            isEmpty(profile[field])
        )
      : null;

  if (!nextField) {
    return {
      reply:
        "Excellent. I have enough information to create your AEMA Growth Blueprint.",

      expectedField: null,

      observation: null,

      question: null,

      complete: true,
    };
  }

  const observation =
    getObservation(
      profile,
      nextField
    );

  const question =
    getQuestion(nextField);

  const reply =
    observation
      ? `${observation}\n\n${question}`
      : question;

  return {
    reply,

    expectedField:
      nextField,

    observation,

    question,

    complete: false,
  };
};

/**
 * -------------------------------------------------------
 * BACKWARD-COMPATIBLE FUNCTION
 * -------------------------------------------------------
 *
 * profileStateEngine currently expects a string:
 *
 * buildConversationalReply(...)
 *
 * Keep this function so nothing else breaks.
 */

export const buildConversationalReply = ({
  profile = {},
  missingFields = [],
} = {}) => {
  return buildConversationTurn({
    profile,
    missingFields,
  }).reply;
};

export default buildConversationalReply;