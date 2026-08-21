// server/controllers/aiController.js

import { processBusinessConversation } from "../services/profileStateEngine.js";
import { analyzeBusiness } from "../services/ai/businessAnalyzer.js";

/**
 * Prevent malformed / empty AI output from reaching the frontend.
 */
const cleanReply = (value = "") => {
  return String(value || "")
    .replace(/```[\w-]*\s*```/g, "")
    .replace(/(?:\s*```\s*```\s*)+/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export const chatWithAemaAI = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: "Messages array is required.",
      });
    }

    /**
     * Reconstruct the business profile from the complete
     * conversation.
     *
     * processBusinessConversation is responsible for:
     *
     * - extracting business facts
     * - applying answers to expected fields
     * - semantic extraction
     * - determining missing fields
     * - determining the next expected field
     */
    const conversation =
      await processBusinessConversation(messages);

    let analysis = null;

    /**
     * Only generate the Growth Blueprint once enough
     * business information has been collected.
     */
    if (conversation.readyForBlueprint) {
      analysis = await analyzeBusiness({
        profile: conversation.profile,
      });
    }

    /**
     * Never send malformed/empty assistant output.
     */
    const reply =
      cleanReply(conversation.reply) ||
      "I understood your response, but I could not generate the next question. Please continue telling me about your business.";

    return res.status(200).json({
      success: true,

      reply,

      /**
       * CRITICAL CONVERSATION STATE
       *
       * The frontend must preserve these values.
       */
      expectedField:
        conversation.expectedField || null,

      missingFields:
        Array.isArray(conversation.missingFields)
          ? conversation.missingFields
          : [],

      readyForBlueprint:
        Boolean(conversation.readyForBlueprint),

      /**
       * Current structured business knowledge.
       */
      profile:
        analysis?.profile ||
        conversation.profile ||
        {},

      /**
       * Blueprint/report information.
       */
      blueprint:
        analysis?.blueprint || null,

      report:
        analysis?.report || null,

      expertAnalysis:
        analysis?.expertAnalysis || null,

      preparationNotes:
        analysis?.preparationNotes || null,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("AEMA AI Error:", error);
    }

    return res.status(500).json({
      success: false,
      message:
        "AEMA AI could not process the conversation. Please try again.",
    });
  }
};

export default chatWithAemaAI;