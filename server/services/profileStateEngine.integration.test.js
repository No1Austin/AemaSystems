import "dotenv/config";
import assert from "node:assert/strict";

import {
  processBusinessConversation,
} from "./profileStateEngine.js";

const runConversation = async (messages) => {
  const result =
    await processBusinessConversation(messages);

  return result;
};

const tests = [
  {
    name: "Car repair location should not repeat",

    messages: [
      {
        role: "assistant",
        content:
          "Hi, I'm AEMA AI — your Business Intelligence Partner. Let's start by identifying your business properly. What is the name of your business?",
        metadata: {
          expectedField: "businessName",
        },
      },

      {
        role: "user",
        content: "James Auto",
      },

      {
        role: "assistant",
        content:
          "What does the business do?",
        metadata: {
          expectedField: "businessType",
        },
      },

      {
        role: "user",
        content: "I fix cars",
      },

      {
        role: "assistant",
        content:
          "Where does the business primarily operate or serve customers?",
        metadata: {
          expectedField: "serviceLocation",
        },
      },

      {
        role: "user",
        content:
          "Kitchener, Ontario",
      },
    ],

    check(result) {
      assert.ok(
        result.profile.serviceLocation,
        "serviceLocation should be stored"
      );

      assert.ok(
        String(
          result.profile.serviceLocation
        )
          .toLowerCase()
          .includes("kitchener"),
        `Expected Kitchener, got ${result.profile.serviceLocation}`
      );

      assert.notEqual(
        result.expectedField,
        "serviceLocation",
        "AEMA should move on from serviceLocation"
      );
    },
  },

  {
    name:
      "Unexpected automation answer should be accepted",

    messages: [
      {
        role: "assistant",
        content:
          "What part of running the business takes the most hands-on or manual time?",
        metadata: {
          expectedField:
            "automationNeed",
        },
      },

      {
        role: "user",
        content:
          "Repairing cars itself",
      },
    ],

    check(result) {
      assert.ok(
        result.profile.automationNeed,
        "automationNeed should be stored"
      );

      assert.notEqual(
        result.expectedField,
        "automationNeed",
        "AEMA should not repeat automationNeed"
      );
    },
  },

  {
    name:
      "Multiple facts in one answer should be stored",

    messages: [
      {
        role: "assistant",
        content:
          "Where does the business primarily operate?",
        metadata: {
          expectedField:
            "serviceLocation",
        },
      },

      {
        role: "user",
        content:
          "We are in Kitchener, have 4 mechanics, and most customers find us on Google.",
      },
    ],

    check(result) {
      assert.ok(
        result.profile.serviceLocation,
        "serviceLocation should exist"
      );

      assert.ok(
        result.profile.leadSource,
        "leadSource should be extracted"
      );
    },
  },

  {
    name:
      "One-word location should be accepted",

    messages: [
      {
        role: "assistant",
        content:
          "Where does the business operate?",
        metadata: {
          expectedField:
            "serviceLocation",
        },
      },

      {
        role: "user",
        content: "Waterloo",
      },
    ],

    check(result) {
      assert.equal(
        result.profile.serviceLocation,
        "Waterloo"
      );

      assert.notEqual(
        result.expectedField,
        "serviceLocation"
      );
    },
  },

  {
    name:
      "Country-only location should be accepted",

    messages: [
      {
        role: "assistant",
        content:
          "Where does the business operate?",
        metadata: {
          expectedField:
            "serviceLocation",
        },
      },

      {
        role: "user",
        content: "Nigeria",
      },
    ],

    check(result) {
      assert.equal(
        result.profile.serviceLocation,
        "Nigeria"
      );
    },
  },

  {
    name:
      "Free-text business type should be accepted",

    messages: [
      {
        role: "assistant",
        content:
          "What does the business do?",
        metadata: {
          expectedField:
            "businessType",
        },
      },

      {
        role: "user",
        content:
          "I repair heavy-duty truck transmissions",
      },
    ],

    check(result) {
      assert.ok(
        result.profile.businessType,
        "businessType should not stay empty"
      );
    },
  },

  {
    name:
      "I don't know should not cause infinite loop",

    messages: [
      {
        role: "assistant",
        content:
          "What is your approximate monthly revenue?",
        metadata: {
          expectedField:
            "monthlyRevenue",
        },
      },

      {
        role: "user",
        content:
          "I don't know",
      },

      {
        role: "assistant",
        content:
          "What is your approximate monthly revenue?",
        metadata: {
          expectedField:
            "monthlyRevenue",
        },
      },

      {
        role: "user",
        content:
          "Not sure",
      },
    ],

    check(result) {
      assert.notEqual(
        result.expectedField,
        "monthlyRevenue",
        "monthlyRevenue should be deferred after repeated uncertainty"
      );
    },
  },

  {
    name:
      "Team size should not be confused with monthly customers",

    messages: [
      {
        role: "assistant",
        content:
          "How many people work in the business?",
        metadata: {
          expectedField:
            "teamSize",
        },
      },

      {
        role: "user",
        content:
          "4 mechanics",
      },
    ],

    check(result) {
      assert.ok(
        result.profile.teamSize,
        "teamSize should be stored"
      );
    },
  },

  {
    name:
      "Website URL should set website status",

    messages: [
      {
        role: "assistant",
        content:
          "Please paste your website link.",
        metadata: {
          expectedField:
            "websiteUrl",
        },
      },

      {
        role: "user",
        content:
          "https://example.com",
      },
    ],

    check(result) {
      assert.equal(
        result.profile.websiteStatus,
        "Has Website"
      );

      assert.ok(
        result.profile.websiteUrl
      );
    },
  },

  {
    name:
      "No website should not require website URL",

    messages: [
      {
        role: "assistant",
        content:
          "Do you currently have a website?",
        metadata: {
          expectedField:
            "websiteStatus",
        },
      },

      {
        role: "user",
        content:
          "No",
      },
    ],

    check(result) {
      assert.equal(
        result.profile.websiteStatus,
        "No Website"
      );

      assert.ok(
        !result.missingFields.includes(
          "websiteUrl"
        ),
        "websiteUrl should not be required"
      );
    },
  },
];

let passed = 0;

for (const test of tests) {
  try {
    const result =
      await runConversation(
        test.messages
      );

    test.check(result);

    console.log(
      `✅ ${test.name}`
    );

    passed += 1;
  } catch (error) {
    console.error(
      `❌ ${test.name}`
    );

    console.error(
      error.message
    );
  }
}

console.log(
  `\n${passed}/${tests.length} conversation tests passed`
);

if (
  passed !==
  tests.length
) {
  process.exitCode = 1;
}