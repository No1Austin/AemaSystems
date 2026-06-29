// server/controllers/aiController.js

import { processBusinessConversation } from "../services/profileStateEngine.js";
import { analyzeBusiness } from "../services/ai/businessAnalyzer.js";

export const chatWithAemaAI = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: "Messages array is required.",
      });
    }

    // AI extracts everything it can from the conversation
    const conversation = await processBusinessConversation(messages);

    let analysis = null;

    if (conversation.readyForBlueprint) {
      analysis = await analyzeBusiness({
        profile: conversation.profile,
      });
    }

    return res.status(200).json({
      success: true,

      reply: conversation.reply,

      profile: analysis?.profile || conversation.profile,

      blueprint: analysis?.blueprint || null,

      report: analysis?.report || null,

      expertAnalysis: analysis?.expertAnalysis || null,

      preparationNotes: analysis?.preparationNotes || null,
    });
  } catch (error) {
    console.error("AEMA AI Error:", error);

    return res.status(500).json({
      success: false,
      message: "AEMA AI failed to respond.",
      error: error.message,
    });
  }
};

export default chatWithAemaAI;