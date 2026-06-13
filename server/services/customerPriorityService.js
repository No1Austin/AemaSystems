export const getCustomerPriority = (plan) => {
  switch (plan) {
    case "partner":
      return {
        priority: "VIP",
        eventPrefix: "⭐ BUSINESS PARTNER REVIEW",
        duration: 45,
        color: "red",
      };

    case "expert":
      return {
        priority: "HIGH",
        eventPrefix: "🔥 EXPERT CONSULTATION",
        duration: 30,
        color: "blue",
      };

    default:
      return {
        priority: "STANDARD",
        eventPrefix: "✅ BLUEPRINT REVIEW",
        duration: 15,
        color: "green",
      };
  }
};