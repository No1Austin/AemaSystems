import { processBusinessConversation } from "../services/profileStateEngine.js";
import { generateBlueprint } from "../services/blueprintGenerator.js";

export const chatWithAemaAI = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: "Messages array is required.",
      });
    }

    const result = processBusinessConversation(messages);

    let blueprint = null;

    if (result.readyForBlueprint) {
      blueprint = generateBlueprint(result.profile);
    }

    console.log("AEMA PROFILE:", result.profile);
    console.log("READY FOR BLUEPRINT:", result.readyForBlueprint);
    console.log("BLUEPRINT:", blueprint);

    return res.status(200).json({
      success: true,
      reply: result.reply,
      profile: result.profile,
      blueprint,
    });
  } catch (error) {
    console.error("AEMA AI error:", error);

    return res.status(500).json({
      success: false,
      message: "AEMA AI failed to respond.",
    });
  }
};