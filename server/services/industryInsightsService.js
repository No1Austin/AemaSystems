// server/services/industryInsightsService.js

const text = (value = "") => String(value || "").toLowerCase().trim();

export const getIndustryInsights = (profile = {}) => {
  const combined = text(
    `${profile.businessType || ""} ${profile.mainOffer || ""} ${profile.targetCustomers || ""}`
  );

  if (combined.includes("clean")) {
    return {
      industry: "Cleaning Services",
      insights: [
        "Cleaning businesses usually grow faster when they have clear service packages, quote forms, Google reviews, and recurring service options.",
        "A strong cleaning website should make it easy to request a quote, compare services, and trust the provider quickly.",
      ],
    };
  }

  if (
    combined.includes("clothing") ||
    combined.includes("fashion") ||
    combined.includes("wear")
  ) {
    return {
      industry: "Clothing / Fashion",
      insights: [
        "Fashion businesses need strong product presentation, clear sizing information, social proof, fast checkout, and follow-up for abandoned inquiries.",
        "If sales happen through WhatsApp or DMs, the business should add a simple catalog, payment process, and follow-up system.",
      ],
    };
  }

  if (
    combined.includes("restaurant") ||
    combined.includes("food") ||
    combined.includes("catering")
  ) {
    return {
      industry: "Food / Restaurant",
      insights: [
        "Food businesses benefit from clear menus, online ordering, Google reviews, delivery options, and strong local SEO.",
        "The website or social page should quickly answer: menu, price, location, ordering method, and opening hours.",
      ],
    };
  }

  if (
    combined.includes("salon") ||
    combined.includes("barber") ||
    combined.includes("beauty")
  ) {
    return {
      industry: "Beauty / Salon",
      insights: [
        "Beauty businesses grow through bookings, repeat appointments, reviews, before-and-after content, and reminder systems.",
        "A booking system and automated reminders can reduce missed appointments and improve repeat sales.",
      ],
    };
  }

  if (
    combined.includes("consult") ||
    combined.includes("coach") ||
    combined.includes("service")
  ) {
    return {
      industry: "Professional Services",
      insights: [
        "Service businesses need strong positioning, testimonials, clear offers, consultation booking, and trust-building content.",
        "The website should clearly explain the problem solved, who it helps, and how to book or request a quote.",
      ],
    };
  }

  return {
    industry: "General Business",
    insights: [
      "The business should focus on clear positioning, predictable lead generation, simple sales processes, and automation where possible.",
      "AEMA recommends improving the customer journey from discovery to purchase or booking.",
    ],
  };
};