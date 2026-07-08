export function buildBusinessProfile(input = {}) {
  const industry = String(input.industry || "").toLowerCase();

  const isHealthcare =
    industry.includes("health") ||
    industry.includes("clinic") ||
    industry.includes("dental") ||
    industry.includes("medical") ||
    industry.includes("therapy");

  const isTechnology =
    industry.includes("tech") ||
    industry.includes("software") ||
    industry.includes("saas") ||
    industry.includes("app");

  const isEcommerce =
    industry.includes("ecommerce") ||
    industry.includes("retail") ||
    industry.includes("online store");

  return {
    businessName: input.businessName || "Business",
    industry: input.industry || "General",
    country: input.country || "Canada",
    province: input.province || "",
    website: input.website || "",
    email: input.email || "",

    industryFlags: {
      healthcare: isHealthcare,
      technology: isTechnology,
      ecommerce: isEcommerce,
    },

    usesPayments: Boolean(input.acceptsOnlinePayments),
    usesAI: Boolean(input.usesAI),
    hasEmployees: Boolean(input.hasEmployees),
    collectsCustomerData: Boolean(input.collectsCustomerData),
    collectsSensitiveData: isHealthcare || Boolean(input.collectsSensitiveData),

    existingDocuments: input.existingDocuments || [],
  };
}