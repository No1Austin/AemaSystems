import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

console.log(
  "KEY:",
  process.env.GEMINI_API_KEY?.substring(0, 15)
);

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

async function test() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(
      "Say hello in one sentence."
    );

    console.log(result.response.text());
  } catch (error) {
    console.error("GEMINI TEST ERROR:", error);
  }
}

test();