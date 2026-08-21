import assert from "node:assert/strict";

import {
  detectExpectedFieldFromAssistant,
  detectExpectedFieldDetailed,
} from "./questionDetector.js";

const tests = [
  {
    message:
      "What is the name of your business?",
    expected: "businessName",
  },

  {
    message:
      "What type of business do you run?",
    expected: "businessType",
  },

  {
    message:
      "Where is your business located?",
    expected: "serviceLocation",
  },

  {
    message:
      "How do most customers currently find you?",
    expected: "leadSource",
  },

  {
    message:
      "Do you currently have a website?",
    expected: "websiteStatus",
  },

  {
    message:
      "Please paste your website link.",
    expected: "websiteUrl",
  },

  {
    message:
      "Who are your main customers?",
    expected: "targetCustomers",
  },

  {
    message:
      "What is your main service?",
    expected: "mainOffer",
  },

  {
    message:
      "What is your biggest challenge right now?",
    expected: "biggestChallenge",
  },

  {
    message:
      "How many customers do you serve in a typical month?",
    expected: "monthlyCustomers",
  },

  {
    message:
      "What is your monthly revenue range?",
    expected: "monthlyRevenue",
  },

  {
    message:
      "How many people are on your team?",
    expected: "teamSize",
  },

  {
    message:
      "How long has your business been operating?",
    expected: "businessStage",
  },

  {
    message:
      "What do you want visitors to do on your website?",
    expected: "websiteGoal",
  },

  /**
   * THE BUG YOU CURRENTLY HAVE
   */
  {
    message: `
      That sounds like a mostly manual sales process,
      which is often where growing businesses start losing
      time, leads, and follow-ups.

      What part of the business takes the most manual time
      right now: bookings, follow-ups, payments, emails,
      reports, lead management, customer messages, or tasks?
    `,
    expected: "automationNeed",
  },

  /**
   * "market" should not cause serviceLocation.
   */
  {
    message: `
      Your market looks competitive.

      What is your biggest challenge right now?
    `,
    expected: "biggestChallenge",
  },

  /**
   * "where" should not cause serviceLocation.
   */
  {
    message: `
      That is often where businesses start losing leads.

      How many customers do you serve per month?
    `,
    expected: "monthlyCustomers",
  },

  /**
   * Website appears in observation,
   * but actual question is goal.
   */
  {
    message: `
      Your website could become an important sales channel.

      What is the main goal you want to achieve this year?
    `,
    expected: "goal",
  },

  /**
   * Multiple words like customers/marketing appear,
   * actual question is teamSize.
   */
  {
    message: `
      More customers may require stronger marketing
      and better processes.

      How many people are currently on your team?
    `,
    expected: "teamSize",
  },
];

let passed = 0;

for (const test of tests) {
  const actual =
    detectExpectedFieldFromAssistant(
      test.message
    );

  try {
    assert.equal(
      actual,
      test.expected
    );

    console.log(
      `✅ ${test.expected}`
    );

    passed += 1;
  } catch {
    console.error(
      `❌ Expected ${test.expected}, got ${actual}`
    );

    console.dir(
      detectExpectedFieldDetailed(
        test.message
      ),
      {
        depth: null,
      }
    );
  }
}

console.log(
  `\n${passed}/${tests.length} tests passed`
);

if (passed !== tests.length) {
  process.exitCode = 1;
}