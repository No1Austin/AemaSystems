// server/services/conversation/profileCompleteness.js

import { REQUIRED_BLUEPRINT_FIELDS } from "../businessProfileSchema.js";

const isEmpty = (value) =>
  value === null ||
  value === undefined ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

export const getMissingFields = (profile = {}) => {
  const missing = REQUIRED_BLUEPRINT_FIELDS.filter((field) =>
    isEmpty(profile[field])
  );

  if (profile.websiteStatus === "Has Website" && isEmpty(profile.websiteUrl)) {
    missing.unshift("websiteUrl");
  }

  if (profile.websiteStatus === "Has Website" && isEmpty(profile.websiteGoal)) {
    missing.push("websiteGoal");
  }

  return [...new Set(missing)];
};