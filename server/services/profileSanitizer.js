// server/services/profileSanitizer.js

import {
  BUSINESS_PROFILE_FIELDS,
  EMPTY_BUSINESS_PROFILE,
} from "./businessProfileSchema.js";

const clean = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
  }

  if (Array.isArray(value)) {
    const cleaned = value
      .map((item) =>
        typeof item === "string" ? item.trim() : item
      )
      .filter(Boolean);

    return cleaned.length ? cleaned : null;
  }

  return value;
};

export const sanitizeProfile = (profile = {}) => {
  const sanitized = {
    ...EMPTY_BUSINESS_PROFILE,
  };

  for (const field of BUSINESS_PROFILE_FIELDS) {
    sanitized[field] = clean(profile[field]);
  }

  // Preserve complex objects without modification
  if (profile.websiteAudit) {
    sanitized.websiteAudit = profile.websiteAudit;
  }

  return sanitized;
};

export default sanitizeProfile;