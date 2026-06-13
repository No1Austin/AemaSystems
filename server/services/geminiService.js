import { GoogleGenerativeAI } from "@google/generative-ai";

export const askGemini = async (messages = []) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    console.log("================================");
    console.log("ASK GEMINI CALLED");
    console.log("REQUEST KEY PREVIEW:", apiKey?.substring(0, 15));
    console.log("REQUEST KEY LENGTH:", apiKey?.length);
    console.log("MESSAGES IS ARRAY:", Array.isArray(messages));
    console.log("MESSAGES LENGTH:", messages.length);
    console.log("================================");

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing from .env");
    }

    if (!Array.isArray(messages)) {
      throw new Error("Messages must be an array.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const systemPrompt = `
You are AEMA AI, a Business Intelligence Partner built by AEMA Systems.

Your job is to quickly understand the user's business and prepare a first business blueprint.

Rules:
1. Ask only ONE question at a time.
2. Do not ask more than 6 total discovery questions.
3. Do not over-investigate.
4. If the user has provided business type, goal, lead source, website status, marketing channel, and biggest challenge, end your response with:
[READY_FOR_BLUEPRINT]
5. Be concise. Maximum 2 short sentences per reply.
6. Do not discuss pricing.
7. Do not generate the full report in the chat.
8. Do not mention Gemini, Google, or AI model names.

Collect these core fields:
- Business type
- Main goal
- Lead source or marketing channel
- Website status
- Website URL if available
- Biggest challenge
- Automation or sales process issue

When enough information is collected, reply with a short transition sentence and end with exactly:
[READY_FOR_BLUEPRINT]
`;

    const conversation = messages
      .map((msg, index) => {
        if (!msg?.role || !msg?.content) {
          console.log("BAD MESSAGE AT INDEX:", index, msg);
        }

        return `${msg.role}: ${msg.content}`;
      })
      .join("\n");

    const prompt = `
${systemPrompt}

Conversation:
${conversation}
`;

    console.log("PROMPT LENGTH:", prompt.length);

    const result = await model.generateContent(prompt);

    console.log("GEMINI RAW RESULT RECEIVED");

    const text = result.response.text();

    console.log("GEMINI TEXT PREVIEW:", text?.substring(0, 150));

    if (!text) {
      return "I need a little more detail to understand your business properly. What type of business do you run and what is your biggest growth goal right now?";
    }

    return text;
  } catch (error) {
    console.error("================================");
    console.error("GEMINI ERROR");
    console.error("ERROR NAME:", error?.name);
    console.error("ERROR MESSAGE:", error?.message);
    console.error("ERROR STATUS:", error?.status);
    console.error("ERROR STATUS TEXT:", error?.statusText);
    console.error("ERROR DETAILS:", JSON.stringify(error?.errorDetails, null, 2));
    console.error("FULL ERROR:", error);
    console.error("================================");

    throw error;
  }
};