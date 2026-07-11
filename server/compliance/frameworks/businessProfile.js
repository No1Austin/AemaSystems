export function buildBusinessProfile(input = {}) {
  const industry = normalizeText(input.industry);

  const isHealthcare = includesAny(industry, [
    "health",
    "healthcare",
    "clinic",
    "dental",
    "medical",
    "therapy",
    "pharmacy",
    "hospital",
    "patient",
    "long term care",
    "long-term care",
    "care home",
    "rehabilitation",
  ]);

  const isTechnology = includesAny(industry, [
    "tech",
    "technology",
    "software",
    "saas",
    "app",
    "digital",
    "platform",
    "cloud",
    "it services",
    "cybersecurity",
  ]);

  const isEcommerce = includesAny(industry, [
    "ecommerce",
    "e-commerce",
    "retail",
    "online store",
    "online shop",
    "marketplace",
    "shopify",
  ]);

  const isFinancial = includesAny(industry, [
    "finance",
    "financial",
    "banking",
    "insurance",
    "accounting",
    "bookkeeping",
    "tax",
    "credit",
    "investment",
    "fintech",
  ]);

  const isEducation = includesAny(industry, [
    "education",
    "school",
    "college",
    "university",
    "training",
    "tutoring",
    "childcare",
    "daycare",
  ]);

  const isProfessionalServices = includesAny(industry, [
    "consulting",
    "legal",
    "law",
    "marketing",
    "real estate",
    "recruitment",
    "staffing",
    "professional services",
  ]);

  const collectsHealthData = isYes(
    input.collectsHealthData
  );

  const collectsFinancialData = isYes(
    input.collectsFinancialData
  );

  const collectsChildrenData = isYes(
    input.collectsChildrenData
  );

  const collectsGovernmentIdentifiers = isYes(
    input.collectsGovernmentIdentifiers
  );

  const collectsBiometricData = isYes(
    input.collectsBiometricData
  );

  const collectsSensitiveData =
    collectsHealthData ||
    collectsFinancialData ||
    collectsChildrenData ||
    collectsGovernmentIdentifiers ||
    collectsBiometricData ||
    isYes(input.collectsSensitiveData) ||
    isHealthcare;

  const usesPaymentProvider =
    isYes(input.usesPaymentProvider) ||
    isYes(input.acceptsOnlinePayments);

  const usesCloudSoftware =
    isYes(input.usesCloudSoftware) ||
    isYes(input.usesCloudHosting);

  const usesVendors = [
    input.sharesDataWithVendors,
    input.usesPaymentProvider,
    input.usesEmailProvider,
    input.usesCloudHosting,
    input.usesCRM,
    input.usesAccountingSoftware,
    input.usesBookingSoftware,
    input.usesMarketingSoftware,
  ].some(isYes);

  const offersOnlineServices =
    isYes(input.offersOnlineServices) ||
    Boolean(cleanText(input.website));

  const servesEurope =
    isYes(input.servesEurope) ||
    isYes(input.hasEuropeanCustomers) ||
    isYes(input.monitorsEuropeanUsers);

  const existingDocuments =
    buildExistingDocuments(input);

  return {
    businessName:
      cleanText(input.businessName) || "Business",

    industry:
      cleanText(input.industry) || "General",

    country:
      cleanText(input.country) || "Canada",

    province:
      cleanText(input.province),

    website:
      cleanText(input.website),

    email:
      cleanText(input.email),

    employeeRange:
      cleanText(input.employees),

    industryFlags: {
      healthcare: isHealthcare,
      technology: isTechnology,
      ecommerce: isEcommerce,
      financial: isFinancial,
      education: isEducation,
      professionalServices: isProfessionalServices,
    },

    hasWebsite:
      Boolean(cleanText(input.website)),

    usesPayments:
      usesPaymentProvider,

    usesPaymentProvider,

    usesAI:
      isYes(input.usesAI),

    aiMakesImportantDecisions:
      isYes(input.aiMakesImportantDecisions),

    usesCustomerDataInAI:
      isYes(input.usesCustomerDataInAI),

    hasEmployees:
      isYes(input.hasEmployees),

    hasMoreThanOneEmployee:
      isYes(input.hasMoreThanOneEmployee),

    hasRemoteWorkers:
      isYes(input.hasRemoteWorkers),

    hasMultipleLocations:
      isYes(input.hasMultipleLocations),

    collectsCustomerData:
      isYes(input.collectsCustomerData),

    collectsSensitiveData,

    collectsHealthData,
    collectsFinancialData,
    collectsChildrenData,
    collectsGovernmentIdentifiers,
    collectsBiometricData,

    collectsEmployeeData:
      isYes(input.collectsEmployeeData),

    collectsContactData:
      isYes(input.collectsContactData),

    sharesDataWithVendors:
      isYes(input.sharesDataWithVendors),

    transfersDataOutsideCountry:
      isYes(input.transfersDataOutsideCountry),

    usesCloudSoftware,

    usesCloudHosting:
      isYes(input.usesCloudHosting),

    usesVendors,

    offersOnlineServices,

    servesOtherRegions:
      isYes(input.servesOtherRegions),

    servesEurope,

    hasEuropeanCustomers:
      isYes(input.hasEuropeanCustomers),

    monitorsEuropeanUsers:
      isYes(input.monitorsEuropeanUsers),

    existingDocuments,
  };
}

function buildExistingDocuments(input) {
  const documents = new Set(
    normalizeExistingDocuments(
      input.existingDocuments
    )
  );

  const mappings = [
    ["hasPrivacyPolicy", "privacy_policy"],
    ["hasTerms", "terms"],
    ["hasCookiePolicy", "cookie_policy"],
    ["hasSecurityPolicy", "security_policy"],
    ["hasPasswordPolicy", "password_policy"],
    ["hasAccessControlPolicy", "access_control"],
    ["hasRiskRegister", "risk_register"],
    ["hasDataRetentionPolicy", "data_retention"],
    [
      "hasBusinessContinuityPlan",
      "business_continuity",
    ],
    [
      "hasDisasterRecoveryPlan",
      "disaster_recovery",
    ],
    ["hasAIPolicy", "responsible_ai"],
    [
      "hasAccessibilityStatement",
      "accessibility",
    ],
    [
      "hasAcceptableUsePolicy",
      "acceptable_use",
    ],
  ];

  for (const [answerKey, documentId] of mappings) {
    if (isYes(input[answerKey])) {
      documents.add(documentId);
    }
  }

  if (
    isYes(input.hasIncidentResponsePolicy) ||
    isYes(input.hasIncidentPlan)
  ) {
    documents.add("incident_response");
  }

  if (
    isYes(input.hasVendorRegister) ||
    isYes(input.maintainsVendorList)
  ) {
    documents.add("vendor_register");
  }

  return [...documents];
}

function normalizeExistingDocuments(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((document) => {
      if (typeof document === "string") {
        return document.trim();
      }

      if (
        document &&
        typeof document === "object" &&
        document.id
      ) {
        return String(document.id).trim();
      }

      return "";
    })
    .filter(Boolean);
}

function includesAny(value, keywords) {
  return keywords.some((keyword) =>
    value.includes(keyword)
  );
}

function cleanText(value) {
  return String(value ?? "").trim();
}

function normalizeText(value) {
  return cleanText(value).toLowerCase();
}

function isYes(value) {
  return (
    value === true ||
    value === "yes" ||
    value === "true" ||
    value === 1 ||
    value === "1"
  );
}