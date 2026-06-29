// server/services/ai/openaiService.js

import OpenAI from "openai";
import { AEMA_SYSTEM_PROMPT } from "./systemPrompt.js";

const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY?.startsWith("sk-")) return null;

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

const safeParseJson = (content = "") => {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
};

const normalizeEnhancement = (data = {}) => ({
  enhancedExecutiveSummary: Array.isArray(data.enhancedExecutiveSummary)
    ? data.enhancedExecutiveSummary
    : [],
  strategicDiagnosis: Array.isArray(data.strategicDiagnosis)
    ? data.strategicDiagnosis
    : [],
  highestPriorityOpportunities: Array.isArray(data.highestPriorityOpportunities)
    ? data.highestPriorityOpportunities
    : [],
  recommendedNextActions: Array.isArray(data.recommendedNextActions)
    ? data.recommendedNextActions
    : [],
  consultantClosingNote:
    typeof data.consultantClosingNote === "string"
      ? data.consultantClosingNote
      : "",
});

export const generateAIEnhancement = async (prompt) => {
  try {
    const client = getOpenAIClient();

    if (!client) {
      return {
        success: false,
        error: "OpenAI API key not configured.",
      };
    }

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      max_output_tokens: 5000,

      input: [
        {
          role: "system",
          content: AEMA_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      text: {
        format: {
          type: "json_schema",
          name: "aema_report_enhancement",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              enhancedExecutiveSummary: {
                type: "array",
                minItems: 3,
                maxItems: 5,
                items: { type: "string" },
              },
              strategicDiagnosis: {
                type: "array",
                minItems: 3,
                maxItems: 6,
                items: { type: "string" },
              },
              highestPriorityOpportunities: {
                type: "array",
                minItems: 3,
                maxItems: 5,
                items: { type: "string" },
              },
              recommendedNextActions: {
                type: "array",
                minItems: 4,
                maxItems: 6,
                items: { type: "string" },
              },
              consultantClosingNote: {
                type: "string",
              },
            },
            required: [
              "enhancedExecutiveSummary",
              "strategicDiagnosis",
              "highestPriorityOpportunities",
              "recommendedNextActions",
              "consultantClosingNote",
            ],
          },
        },
      },
    });

    const content = response.output_text;

    if (!content) {
      console.error("OpenAI raw response:", JSON.stringify(response, null, 2));

      return {
        success: false,
        error: "OpenAI returned an empty response.",
      };
    }

    const parsed = safeParseJson(content);

    if (!parsed) {
      console.error("OpenAI invalid JSON:", content.slice(0, 1000));

      return {
        success: false,
        error: "OpenAI returned invalid JSON.",
      };
    }

    return {
      success: true,
      data: normalizeEnhancement(parsed),
    };
  } catch (error) {
    console.error("OpenAI Enhancement Error:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};

export default generateAIEnhancement;