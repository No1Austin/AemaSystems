// server/services/conversation/questionDetector.js

/**
 * AEMA Question Detector Engine
 *
 * Purpose:
 * Detect which business-profile field the assistant is asking the user to answer.
 *
 * Design goals:
 * - Prefer actual question sentences over surrounding observations.
 * - Avoid false matches caused by generic words.
 * - Support multiple natural-language variations.
 * - Use weighted scoring instead of first-match logic.
 * - Return null when confidence is genuinely weak.
 * - Provide detailed debug output for testing.
 *
 * Long-term note:
 * The strongest architecture is to carry `expectedField`
 * as metadata when generating the assistant question.
 * This detector should remain as a robust fallback.
 */

const normalize = (value = "") =>
  String(value || "")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

const normalizeForMatching = (value = "") =>
  normalize(value)
    .replace(/[?!.,:;]/g, "")
    .replace(
      /\b(currently|usually|generally|typically|right now|at the moment)\b/g,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();

const unique = (items = []) => [...new Set(items)];

const containsPhrase = (text = "", phrase = "") => {
  const cleanText = normalizeForMatching(text);
  const cleanPhrase = normalizeForMatching(phrase);

  if (!cleanText || !cleanPhrase) {
    return false;
  }

  return cleanText.includes(cleanPhrase);
};

const getSentences = (message = "") => {
  const raw = String(message || "").trim();

  if (!raw) {
    return [];
  }

  return raw
    .split(/(?<=[?.!])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
};

const looksLikeQuestion = (sentence = "") => {
  const clean = normalize(sentence);

  if (!clean) {
    return false;
  }

  if (sentence.includes("?")) {
    return true;
  }

  return /^(what|which|where|who|how|do|does|did|are|is|can|could|would|have|has|tell me|describe|share|paste|send)\b/.test(
    clean
  );
};

/**
 * Extract the portion of the assistant message most likely
 * to contain the actual requested information.
 */
const getQuestionSentences = (message = "") => {
  const sentences = getSentences(message);

  if (!sentences.length) {
    return [];
  }

  const explicitQuestions = sentences.filter((sentence) =>
    sentence.includes("?")
  );

  if (explicitQuestions.length) {
    return explicitQuestions;
  }

  const likelyQuestions = sentences.filter(looksLikeQuestion);

  if (likelyQuestions.length) {
    return likelyQuestions;
  }

  /**
   * If punctuation is poor, inspect the last sentence first.
   * Generated conversational replies often place the actual
   * question at the end.
   */
  return [sentences[sentences.length - 1]];
};

const QUESTION_RULES = [
  {
    field: "businessName",
    weight: 100,
    phrases: [
      "what is the name of your business",
      "what's the name of your business",
      "what is your business called",
      "what's your business called",
      "what should i call your business",
      "what is the company called",
      "what's the company called",
      "business name",
      "company name",
      "brand name",
      "name of your business",
    ],
    supportingWords: [
      "business name",
      "company name",
      "brand name",
      "called",
      "name",
    ],
  },

  {
    field: "businessType",
    weight: 100,
    phrases: [
      "what type of business",
      "what kind of business",
      "type of business is it",
      "what does your business do",
      "what does the business do",
      "what industry is your business in",
      "which industry are you in",
      "what industry do you operate in",
      "describe your business",
      "what services does your business provide",
      "what products does your business sell",
    ],
    supportingWords: [
      "type of business",
      "kind of business",
      "industry",
      "business do",
      "services",
      "products",
    ],
  },

  {
    field: "serviceLocation",
    weight: 100,
    phrases: [
      "what city are you based in",
      "which city are you based in",
      "where are you based",
      "where is your business based",
      "where is your business located",
      "where are you located",
      "what city is the business in",
      "what region do you serve",
      "which region do you serve",
      "what area do you serve",
      "which area do you serve",
      "what area do you primarily serve",
      "which area do you primarily serve",
      "what market do you primarily serve",
      "which market do you primarily serve",
      "where are most of your customers located",
      "what geographic area do you serve",
      "what location do you serve",
    ],
    supportingWords: [
      "city",
      "where are you based",
      "where is your business located",
      "region do you serve",
      "area do you serve",
      "geographic area",
      "located",
    ],
  },

  {
    field: "goal",
    weight: 100,
    phrases: [
      "what is your main goal",
      "what's your main goal",
      "what is the main goal",
      "what's the main goal",
      "what is the main goal you want to achieve",
      "what's the main goal you want to achieve",
      "what goal do you want to achieve",
      "what is your biggest goal",
      "what's your biggest goal",
      "what outcome do you want",
      "main outcome you want",
      "what do you want to achieve",
      "what are you trying to achieve",
      "what do you want right now",
      "what should your growth blueprint focus on",
      "what would success look like",
      "what would you most like to improve",
      "what is your primary objective",
    ],
    supportingWords: [
      "main goal",
      "goal",
      "objective",
      "outcome",
      "achieve",
      "success",
    ],
  },

  {
    field: "leadSource",
    weight: 100,
    phrases: [
      "how do customers currently find you",
      "how do most customers currently find you",
      "how do most customers find you",
      "how do customers find you",
      "how are customers currently finding you",
      "how are customers finding you",
      "where do your customers come from",
      "where do most of your customers come from",
      "how do people discover your business",
      "how do new customers hear about you",
      "where do most leads come from",
      "what brings customers to your business",
      "how do you attract customers",
      "how are you getting customers",
    ],
    supportingWords: [
      "customers find",
      "customers come from",
      "discover your business",
      "new customers hear",
      "leads come from",
      "attract customers",
      "find you",
    ],
  },

  {
    field: "websiteStatus",
    weight: 100,
    phrases: [
      "do you currently have a website",
      "do you have a website",
      "does your business have a website",
      "does the business have a website",
      "are you currently using a website",
      "do you already have a website",
      "is there a website for the business",
    ],
    supportingWords: [
      "have a website",
      "using a website",
      "already have a website",
    ],
  },

  {
    field: "websiteUrl",
    weight: 110,
    phrases: [
      "paste your website link",
      "share your website link",
      "send your website link",
      "what is your website url",
      "what's your website url",
      "send me your website",
      "share your website",
      "website address",
      "what is the website address",
      "what's the website address",
    ],
    supportingWords: [
      "website url",
      "website link",
      "website address",
      "paste",
      "share",
      "send",
    ],
  },

  {
    field: "marketingChannels",
    weight: 100,
    phrases: [
      "what marketing channels do you use",
      "which marketing channels do you use",
      "what marketing channels are you using",
      "which marketing channels are you using",
      "how do you currently market your business",
      "where do you currently market your business",
      "what platforms do you use for marketing",
      "which platforms do you use for marketing",
      "where do you promote your business",
      "how are you marketing the business",
    ],
    supportingWords: [
      "marketing channels",
      "market your business",
      "platforms do you use",
      "promote your business",
      "marketing the business",
    ],
  },

  {
    field: "salesProcess",
    weight: 100,
    phrases: [
      "how do customers buy from you",
      "how do customers usually buy from you",
      "how do they usually buy",
      "how do people buy from you",
      "how do customers book your service",
      "how do people book your service",
      "how do customers place an order",
      "how do customers place orders",
      "what happens when someone wants to buy",
      "what happens when someone wants to book",
      "what happens after someone decides to buy",
      "describe your sales process",
      "how does your sales process work",
      "how do you close sales",
      "how do customers pay or book",
    ],
    supportingWords: [
      "customers buy",
      "customers book",
      "place an order",
      "sales process",
      "close sales",
      "pay or book",
    ],
  },

  {
    field: "targetCustomers",
    weight: 100,
    phrases: [
      "who are your main customers",
      "who are your customers",
      "who normally buys from you",
      "who normally uses your service",
      "who is your ideal customer",
      "who are your ideal customers",
      "who do you mainly serve",
      "who do you serve",
      "what kind of customers do you serve",
      "what type of customers do you serve",
      "describe your target customer",
      "who is your target market",
      "who is your target audience",
    ],
    supportingWords: [
      "main customers",
      "ideal customer",
      "target customer",
      "target market",
      "target audience",
      "who do you serve",
    ],
  },

  {
    field: "mainOffer",
    weight: 100,
    phrases: [
      "what is your main product",
      "what's your main product",
      "what is your main service",
      "what's your main service",
      "what is your main offer",
      "what's your main offer",
      "main product or service",
      "what do you mainly sell",
      "what do you primarily sell",
      "what service do you mainly provide",
      "what product do you mainly sell",
      "what are you selling",
      "what do customers pay you for",
    ],
    supportingWords: [
      "main product",
      "main service",
      "main offer",
      "mainly sell",
      "primarily sell",
      "customers pay you for",
    ],
  },

  {
    field: "automationNeed",
    weight: 110,
    phrases: [
      "what part of the business takes the most manual time",
      "which part of the business takes the most manual time",
      "what takes the most manual time",
      "takes the most manual time",
      "what part is most manual",
      "which part is most manual",
      "what process is most manual",
      "which process is most manual",
      "what is the most repetitive part",
      "what's the most repetitive part",
      "what work is most repetitive",
      "which work is most repetitive",
      "what takes the most time manually",
      "what do you spend the most time doing manually",
      "where do you spend the most manual time",
      "what would you most like to automate",
      "which process would you most like to automate",
      "what process would you automate first",
      "what task would you automate first",
      "what operational task takes the most time",
      "what administrative work takes the most time",
      "what slows you down operationally",
    ],
    supportingWords: [
      "most manual time",
      "most manual",
      "most repetitive",
      "doing manually",
      "like to automate",
      "automate first",
      "operational task",
      "administrative work",
    ],
  },

  {
    field: "biggestChallenge",
    weight: 100,
    phrases: [
      "what is your biggest challenge",
      "what's your biggest challenge",
      "biggest challenge right now",
      "what is the main challenge",
      "what's the main challenge",
      "what is stopping the business",
      "what's stopping the business",
      "what is holding the business back",
      "what's holding the business back",
      "what is your biggest problem",
      "what's your biggest problem",
      "what is getting in the way",
      "what is the biggest obstacle",
      "what's the biggest obstacle",
      "what is limiting your growth",
      "what is making growth difficult",
    ],
    supportingWords: [
      "biggest challenge",
      "main challenge",
      "stopping the business",
      "holding the business back",
      "biggest problem",
      "biggest obstacle",
      "limiting your growth",
    ],
  },

  {
    field: "monthlyCustomers",
    weight: 100,
    phrases: [
      "how many customers do you serve",
      "how many customers do you serve each month",
      "how many customers per month",
      "customers in a typical month",
      "customers do you serve in a typical month",
      "how many clients do you serve per month",
      "how many customers do you get monthly",
      "monthly customer volume",
      "what is your monthly customer volume",
      "what's your monthly customer volume",
    ],
    supportingWords: [
      "how many customers",
      "how many clients",
      "customers per month",
      "clients per month",
      "typical month",
      "monthly customers",
      "monthly customer volume",
    ],
  },

  {
    field: "monthlyRevenue",
    weight: 100,
    phrases: [
      "what is your monthly revenue",
      "what's your monthly revenue",
      "monthly revenue range",
      "what is your revenue range",
      "what's your revenue range",
      "how much revenue do you make per month",
      "how much does the business make per month",
      "how much does your business make monthly",
      "what does the business generate monthly",
      "what is your average monthly revenue",
      "what's your average monthly revenue",
    ],
    supportingWords: [
      "monthly revenue",
      "revenue range",
      "revenue per month",
      "make per month",
      "make monthly",
      "generate monthly",
    ],
  },

  {
    field: "teamSize",
    weight: 100,
    phrases: [
      "how many people work in the business",
      "how many people work with you",
      "how many people are on your team",
      "how many people are currently on your team",
      "how many people do you have on your team",
      "what is your team size",
      "what's your team size",
      "how large is your team",
      "how big is your team",
      "how many employees do you have",
      "how many employees",
      "how many staff do you have",
      "how many staff",
      "is it just you or do you have a team",
    ],
    supportingWords: [
      "how many people",
      "people on your team",
      "your team",
      "team size",
      "how many employees",
      "how many staff",
    ],
  },

  {
    field: "businessStage",
    weight: 100,
    phrases: [
      "how long has your business been operating",
      "how long has the business been operating",
      "how long have you been in business",
      "how old is your business",
      "how old is the business",
      "business age",
      "when did you start the business",
      "when was the business started",
      "how many years have you been operating",
      "what stage is the business at",
      "what stage is your business at",
    ],
    supportingWords: [
      "how long has your business",
      "how long have you been in business",
      "how old is your business",
      "when did you start",
      "business age",
      "business stage",
    ],
  },

  {
    field: "websiteGoal",
    weight: 100,
    phrases: [
      "what do you want visitors to do on your website",
      "what should visitors do on your website",
      "what is the goal of your website",
      "what's the goal of your website",
      "website goal",
      "main goal of your website",
      "what action should visitors take",
      "what do you want people to do when they visit your website",
      "what should happen when someone visits your website",
      "what is the main call to action on your website",
    ],
    supportingWords: [
      "visitors to do",
      "goal of your website",
      "website goal",
      "visitors take",
      "visit your website",
      "call to action",
    ],
  },
];

/**
 * Generic words are not allowed to carry meaningful weight alone.
 */
const GENERIC_WORDS = new Set([
  "business",
  "customer",
  "customers",
  "website",
  "sales",
  "service",
  "product",
  "time",
  "people",
  "work",
  "goal",
  "location",
  "market",
  "marketing",
  "team",
]);

const getSupportingWordScore = (textValue = "", words = []) => {
  const clean = normalizeForMatching(textValue);

  let score = 0;

  for (const word of words) {
    const normalizedWord = normalizeForMatching(word);

    if (!normalizedWord) {
      continue;
    }

    if (!clean.includes(normalizedWord)) {
      continue;
    }

    const wordCount = normalizedWord.split(" ").length;

    /**
     * Multi-word evidence is much safer than single words.
     */
    if (wordCount >= 4) {
      score += 8;
      continue;
    }

    if (wordCount === 3) {
      score += 6;
      continue;
    }

    if (wordCount === 2) {
      score += 4;
      continue;
    }

    if (GENERIC_WORDS.has(normalizedWord)) {
      score += 0.5;
      continue;
    }

    score += 2;
  }

  return score;
};

const scoreRuleAgainstText = (
  rule,
  textValue,
  { multiplier = 1 } = {}
) => {
  const clean = normalizeForMatching(textValue);

  if (!clean) {
    return {
      field: rule.field,
      score: 0,
      exactPhraseMatches: [],
      supportingMatches: [],
    };
  }

  const exactPhraseMatches = unique(
    rule.phrases.filter((phrase) =>
      containsPhrase(clean, phrase)
    )
  );

  const supportingMatches = unique(
    (rule.supportingWords || []).filter((word) =>
      containsPhrase(clean, word)
    )
  );

  let score = 0;

  for (const phrase of exactPhraseMatches) {
    const phraseWordCount =
      normalizeForMatching(phrase).split(" ").length;

    let specificityBonus = 0;

    if (phraseWordCount >= 8) {
      specificityBonus = 35;
    } else if (phraseWordCount >= 6) {
      specificityBonus = 28;
    } else if (phraseWordCount >= 4) {
      specificityBonus = 20;
    } else if (phraseWordCount >= 3) {
      specificityBonus = 12;
    } else if (phraseWordCount >= 2) {
      specificityBonus = 5;
    }

    score +=
      (rule.weight + specificityBonus) *
      multiplier;
  }

  score +=
    getSupportingWordScore(
      clean,
      rule.supportingWords || []
    ) * multiplier;

  return {
    field: rule.field,
    score,
    exactPhraseMatches,
    supportingMatches,
  };
};

const scoreAllRules = (message = "") => {
  const fullMessage = normalizeForMatching(message);

  const questionSentences =
    getQuestionSentences(message);

  const results = QUESTION_RULES.map((rule) => {
    /**
     * Score full message lightly.
     *
     * This captures useful context, but prevents observations
     * from overpowering the actual question.
     */
    const fullScore = scoreRuleAgainstText(
      rule,
      fullMessage,
      {
        multiplier: 0.2,
      }
    );

    /**
     * Score question sentences heavily.
     */
    const questionResults = questionSentences.map(
      (question) =>
        scoreRuleAgainstText(
          rule,
          question,
          {
            multiplier: 1.5,
          }
        )
    );

    const bestQuestionResult =
      questionResults.sort(
        (a, b) => b.score - a.score
      )[0] || {
        field: rule.field,
        score: 0,
        exactPhraseMatches: [],
        supportingMatches: [],
      };

    /**
     * If the actual question has an exact phrase match,
     * strongly prioritize that over matches only present in
     * surrounding explanatory text.
     */
    let totalScore =
      bestQuestionResult.score +
      fullScore.score;

    if (
      bestQuestionResult.exactPhraseMatches.length > 0
    ) {
      totalScore += 25;
    }

    return {
      field: rule.field,
      score: Number(totalScore.toFixed(2)),

      exactPhraseMatches: unique([
        ...bestQuestionResult.exactPhraseMatches,
        ...fullScore.exactPhraseMatches,
      ]),

      questionExactPhraseMatches: unique(
        bestQuestionResult.exactPhraseMatches
      ),

      supportingMatches: unique([
        ...bestQuestionResult.supportingMatches,
        ...fullScore.supportingMatches,
      ]),
    };
  });

  return results.sort(
    (a, b) => b.score - a.score
  );
};

const calculateConfidence = (
  winner,
  runnerUp
) => {
  if (!winner || winner.score <= 0) {
    return 0;
  }

  const winnerScore =
    winner.score;

  const runnerScore =
    runnerUp?.score || 0;

  const margin =
    winnerScore - runnerScore;

  const relativeMargin =
    margin / Math.max(winnerScore, 1);

  const runnerRatio =
    runnerScore /
    Math.max(winnerScore, 1);

  let confidence = 0;

  /**
   * Exact match in the actual question is very strong evidence.
   */
  if (
    winner.questionExactPhraseMatches?.length > 0
  ) {
    confidence += 0.7;
  } else if (
    winner.exactPhraseMatches?.length > 0
  ) {
    confidence += 0.5;
  }

  /**
   * Supporting evidence.
   */
  const supportCount =
    winner.supportingMatches?.length || 0;

  if (supportCount >= 4) {
    confidence += 0.2;
  } else if (supportCount >= 3) {
    confidence += 0.17;
  } else if (supportCount >= 2) {
    confidence += 0.12;
  } else if (supportCount === 1) {
    confidence += 0.05;
  }

  /**
   * How dominant is the winner?
   */
  if (relativeMargin >= 0.85) {
    confidence += 0.25;
  } else if (relativeMargin >= 0.65) {
    confidence += 0.2;
  } else if (relativeMargin >= 0.45) {
    confidence += 0.15;
  } else if (relativeMargin >= 0.25) {
    confidence += 0.08;
  }

  /**
   * Penalize close competitors.
   */
  if (runnerRatio >= 0.95) {
    confidence -= 0.3;
  } else if (runnerRatio >= 0.85) {
    confidence -= 0.2;
  } else if (runnerRatio >= 0.75) {
    confidence -= 0.1;
  }

  return Number(
    Math.max(
      0,
      Math.min(1, confidence)
    ).toFixed(3)
  );
};

const isAmbiguousResult = (
  winner,
  runnerUp
) => {
  if (
    !winner ||
    !runnerUp ||
    runnerUp.score <= 0
  ) {
    return false;
  }

  const winnerScore =
    winner.score;

  const runnerScore =
    runnerUp.score;

  const difference =
    winnerScore - runnerScore;

  const runnerRatio =
    runnerScore /
    Math.max(winnerScore, 1);

  /**
   * --------------------------------------------------
   * HIGH-CONFIDENCE FIELD OVERRIDES
   * --------------------------------------------------
   *
   * Certain fields are naturally nested inside broader
   * business concepts.
   *
   * Example:
   *
   * "What do you want visitors to do on your website?"
   *
   * This is clearly websiteGoal, even though it also
   * contains language that can resemble the generic
   * business "goal" field.
   */

  const protectedSpecificFields = new Set([
    "websiteGoal",
    "websiteUrl",
    "websiteStatus",
    "monthlyRevenue",
    "monthlyCustomers",
    "teamSize",
    "serviceLocation",
    "automationNeed",
    "leadSource",
    "salesProcess",
  ]);

  /**
   * If the winner is a more specific field and has an
   * exact phrase match in the actual question, trust it.
   */
  if (
    protectedSpecificFields.has(
      winner.field
    ) &&
    winner
      .questionExactPhraseMatches
      ?.length > 0
  ) {
    return false;
  }

  /**
   * If the winner has an exact phrase match in the actual
   * question and the runner-up only matched surrounding
   * context, it is not ambiguous.
   */
  if (
    winner
      .questionExactPhraseMatches
      ?.length > 0 &&
    (
      !runnerUp
        .questionExactPhraseMatches ||
      runnerUp
        .questionExactPhraseMatches
        .length === 0
    )
  ) {
    return false;
  }

  /**
   * --------------------------------------------------
   * SPECIFIC FIELD VS GENERIC FIELD
   * --------------------------------------------------
   *
   * Some fields are more specific versions of others.
   *
   * websiteGoal > goal
   *
   * monthlyRevenue > goal
   *
   * monthlyCustomers > generic customer wording
   *
   * teamSize > generic people wording
   */

  const specificityPairs = {
    websiteGoal: [
      "goal",
    ],

    websiteUrl: [
      "websiteStatus",
    ],

    monthlyRevenue: [
      "goal",
    ],

    monthlyCustomers: [
      "targetCustomers",
      "leadSource",
    ],

    teamSize: [
      "targetCustomers",
    ],

    automationNeed: [
      "biggestChallenge",
    ],
  };

  const lessSpecificFields =
    specificityPairs[
      winner.field
    ] || [];

  if (
    lessSpecificFields.includes(
      runnerUp.field
    ) &&
    winner
      .questionExactPhraseMatches
      ?.length > 0
  ) {
    return false;
  }

  /**
   * Exact match inside the actual question should normally win,
   * unless another candidate is nearly identical.
   */
  if (
    winner.questionExactPhraseMatches?.length > 0 &&
    runnerUp.questionExactPhraseMatches?.length === 0
  ) {
    return false;
  }

  /**
   * Only call it ambiguous when the runner-up is genuinely
   * close to the winner.
   */
  return (
    runnerRatio >= 0.85 &&
    difference <= Math.max(
      8,
      winnerScore * 0.15
    )
  );
};

export const detectExpectedFieldDetailed = (
  message = "",
  options = {}
) => {
  const {
    minimumScore = 5,
    minimumConfidence = 0.45,
  } = options;

  const clean =
    normalizeForMatching(message);

  if (!clean) {
    return {
      field: null,
      confidence: 0,
      score: 0,
      ambiguous: false,
      reason: "EMPTY_MESSAGE",
      candidates: [],
      questionSentences: [],
    };
  }

  const candidates =
    scoreAllRules(message);

  const winner =
    candidates[0] || null;

  const runnerUp =
    candidates[1] || null;

  if (
    !winner ||
    winner.score <= 0
  ) {
    return {
      field: null,
      confidence: 0,
      score: 0,
      ambiguous: false,
      reason: "NO_MATCH",
      candidates:
        candidates.slice(0, 5),
      questionSentences:
        getQuestionSentences(message),
    };
  }

  const confidence =
    calculateConfidence(
      winner,
      runnerUp
    );

  const ambiguous =
    isAmbiguousResult(
      winner,
      runnerUp
    );

  const hasExactMatch =
    winner.exactPhraseMatches?.length > 0;

  const hasQuestionExactMatch =
    winner.questionExactPhraseMatches?.length > 0;

  const hasEnoughSupportingEvidence =
    (winner.supportingMatches?.length || 0) >= 2;

  const evidenceIsSufficient =
    hasQuestionExactMatch ||
    hasExactMatch ||
    hasEnoughSupportingEvidence;

  if (
    winner.score < minimumScore ||
    confidence < minimumConfidence ||
    ambiguous ||
    !evidenceIsSufficient
  ) {
    return {
      field: null,
      confidence,
      score: winner.score,
      ambiguous,
      reason: ambiguous
        ? "AMBIGUOUS_MATCH"
        : !evidenceIsSufficient
          ? "INSUFFICIENT_EVIDENCE"
          : "LOW_CONFIDENCE",

      bestCandidate:
        winner.field,

      candidates:
        candidates.slice(0, 5),

      questionSentences:
        getQuestionSentences(message),
    };
  }

  return {
    field:
      winner.field,

    confidence,
    score:
      winner.score,

    ambiguous:
      false,

    reason:
      "MATCHED",

    candidates:
      candidates.slice(0, 5),

    questionSentences:
      getQuestionSentences(message),
  };
};

/**
 * Backward-compatible API.
 *
 * Existing code can keep using:
 *
 * detectExpectedFieldFromAssistant(message)
 *
 * and receive:
 *
 * "automationNeed"
 *
 * or:
 *
 * null
 */
export const detectExpectedFieldFromAssistant = (
  message = ""
) => {
  const result =
    detectExpectedFieldDetailed(message);

  return result.field;
};

export default detectExpectedFieldFromAssistant;