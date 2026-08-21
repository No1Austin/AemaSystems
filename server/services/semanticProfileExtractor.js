// server/services/semanticProfileExtractor.js

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PROFILE_FIELDS = [
  "businessName",
  "businessType",
  "serviceLocation",
  "goal",
  "leadSource",
  "websiteStatus",
  "websiteUrl",
  "marketingChannels",
  "salesProcess",
  "targetCustomers",
  "mainOffer",
  "automationNeed",
  "biggestChallenge",
  "monthlyCustomers",
  "monthlyRevenue",
  "teamSize",
  "businessStage",
  "websiteGoal",
];

const EMPTY_PROFILE = PROFILE_FIELDS.reduce(
  (acc, field) => {
    acc[field] = null;
    return acc;
  },
  {}
);

const safeJsonParse = (value = "") => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const sanitizeExtractedProfile = (data = {}) => {
  const clean = {
    ...EMPTY_PROFILE,
  };

  for (const field of PROFILE_FIELDS) {
    const value = data?.[field];

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      continue;
    }

    if (
      Array.isArray(value) &&
      value.length === 0
    ) {
      continue;
    }

    clean[field] = value;
  }

  return clean;
};

export const extractSemanticBusinessFacts = async ({
  message = "",
  expectedField = null,
  currentProfile = {},
} = {}) => {
  const userMessage = String(message || "").trim();

  if (!userMessage) {
    return {
      profile: {
        ...EMPTY_PROFILE,
      },
      confidence: 0,
      understood: false,
      raw: null,
    };
  }

  const prompt = `
You are the structured business-information extraction engine for AEMA AI.

Your job is to read the user's latest message and extract EVERY useful business fact contained in it.

You are NOT a chatbot.
You are NOT giving advice.
You are ONLY extracting structured business information.

IMPORTANT RULES:

1. Do not limit extraction to the question that was just asked.

2. A single user message may contain multiple business facts.

3. Accept unusual industries, services, workflows, customer types, goals, operational activities, and business models.

4. Do not force the user's answer into one of AEMA's example options.

5. If a value does not fit a standard category, preserve the user's meaning as natural-language free text.

6. Handle spelling mistakes, short answers, informal English, incomplete grammar, abbreviations, and casual wording.

7. Do not invent information.

8. If a field is not supported by the message, return null for that field.

9. If the user clearly corrects previous information, extract the corrected value.

10. Extract only business-related facts.

11. The expected field is only a hint. It does not limit what you may extract.

12. If the user gives a direct answer to the expected field, make sure that field is populated.

13. Prefer the user's actual meaning over predefined labels.

14. If the user says "I fix car", interpret that as an automotive/car repair business.

15. If the user says "I operate in Kitchener, Ontario", extract that as serviceLocation.

16. If the user says "repairing cars itself" in response to a manual-work question, preserve that meaning under automationNeed or operational bottleneck.

Return ONLY valid JSON.

CURRENT PROFILE:
${JSON.stringify(currentProfile)}

EXPECTED FIELD:
${expectedField || "none"}

LATEST USER MESSAGE:
${JSON.stringify(userMessage)}

Return JSON in exactly this structure:

{
  "understood": true,
  "confidence": 0.0,
  "profile": {
    "businessName": null,
    "businessType": null,
    "serviceLocation": null,
    "goal": null,
    "leadSource": null,
    "websiteStatus": null,
    "websiteUrl": null,
    "marketingChannels": null,
    "salesProcess": null,
    "targetCustomers": null,
    "mainOffer": null,
    "automationNeed": null,
    "biggestChallenge": null,
    "monthlyCustomers": null,
    "monthlyRevenue": null,
    "teamSize": null,
    "businessStage": null,
    "websiteGoal": null
  }
}
`;

  try {
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      input: [
        {
          role: "system",
          content:
            "You extract structured business facts from user messages. Return JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const outputText =
      response.output_text?.trim() || "";

    const parsed =
      safeJsonParse(outputText);

    if (!parsed) {
      return {
        profile: {
          ...EMPTY_PROFILE,
        },
        confidence: 0,
        understood: false,
        raw: outputText || null,
      };
    }

    const profile =
      sanitizeExtractedProfile(
        parsed.profile || {}
      );

    const confidence =
      Number(parsed.confidence);

    return {
      profile,

      confidence:
        Number.isFinite(confidence)
          ? Math.max(
              0,
              Math.min(
                1,
                confidence
              )
            )
          : 0.5,

      understood:
        parsed.understood !== false,

      raw: parsed,
    };
  } catch (error) {
    if (
      process.env.NODE_ENV ===
      "development"
    ) {
      console.error(
        "Semantic profile extraction failed:",
        error
      );
    }

    return {
      profile: {
        ...EMPTY_PROFILE,
      },
      confidence: 0,
      understood: false,
      raw: null,
    };
  }
};

export default extractSemanticBusinessFacts;