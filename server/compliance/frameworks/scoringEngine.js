import { frameworks } from "./frameworks.js";
import { detectFrameworks } from "./industries.js";
import { frameworkControls } from "./controls.js";
import { documentLibrary } from "./documents.js";
import { buildBusinessProfile } from "./businessProfile.js";
import { generateRiskSummary } from "./riskEngine.js";

/**
 * Evaluates document and governance readiness for the business.
 *
 * Important:
 * This engine provides a preliminary readiness assessment based on
 * self-reported answers and confirmed documents. It does not certify legal,
 * regulatory, SOC 2, PCI DSS, or ISO 27001 compliance.
 */
export function evaluateCompliance(input = {}) {
  const profile = normalizeProfile(buildBusinessProfile(input));

  const applicableFrameworkIds = determineApplicableFrameworks(profile);

  const existingDocuments = new Set(
    normalizeDocumentIds(profile.existingDocuments)
  );

  const frameworkResults = applicableFrameworkIds
    .map((frameworkId) =>
      evaluateFramework({
        frameworkId,
        profile,
        existingDocuments,
      })
    )
    .filter(Boolean);

  const missingIds = collectMissingDocuments({
    frameworkResults,
    profile,
    existingDocuments,
  });

  const missingDocuments = [...missingIds].map(formatDocument);

  const overallScore = calculateOverallScore(frameworkResults);

  const risks = generateRiskSummary(profile, missingDocuments);
  const maturity = getMaturityLevel(overallScore);

  return {
    businessName: profile.businessName,
    industry: profile.industry,
    country: profile.country,
    province: profile.province,

    overallScore,
    maturity,

    frameworks: frameworkResults,
    missingDocuments,
    existingDocuments: [...existingDocuments].map(formatDocument),
    risks,

    recommendation:
      missingDocuments.length > 0
        ? "Prioritize the missing governance documents and validate that the underlying operational controls are implemented."
        : "No major document gaps were detected from the current profile. Continue reviewing operational controls and maintaining evidence.",

    disclaimer:
      "This is a preliminary readiness assessment based on self-reported information. It is not legal advice, certification, an audit opinion, or a guarantee of compliance.",
  };
}

function evaluateFramework({
  frameworkId,
  profile,
  existingDocuments,
}) {
  const framework = frameworks.find(
    (item) => item.id === frameworkId
  );

  if (!framework) {
    console.warn(
      `Framework "${frameworkId}" was detected but is not defined in frameworks.js.`
    );

    return null;
  }

  const requiredControls = getApplicableControls(
    frameworkId,
    profile
  );

  const completedIds = requiredControls.filter((controlId) =>
    existingDocuments.has(controlId)
  );

  const missingIds = requiredControls.filter(
    (controlId) => !existingDocuments.has(controlId)
  );

  const score =
    requiredControls.length === 0
      ? 100
      : Math.round(
          (completedIds.length / requiredControls.length) * 100
        );

  return {
    id: framework.id,
    name: framework.name,
    region: framework.region || "",
    description: framework.description || "",

    priority:
      framework.priority ||
      getFrameworkPriority(frameworkId, profile),

    applicability:
      framework.applicable ||
      getFrameworkApplicabilityLabel(frameworkId, profile),

    score,
    status: getReadinessStatus(score),

    requiredCount: requiredControls.length,
    completedCount: completedIds.length,
    missingCount: missingIds.length,

    completed: completedIds.map(formatDocument),
    missing: missingIds.map(formatDocument),

    note:
      "This score measures preliminary document readiness and does not confirm that the underlying controls are operating effectively.",
  };
}

function determineApplicableFrameworks(profile) {
  const detected = new Set(
    detectFrameworks(profile.industry) || []
  );

  const country = normalizeText(profile.country);
  const province = normalizeText(profile.province);
  const industry = normalizeText(profile.industry);

  /*
   * Jurisdiction-based frameworks
   */

  if (
    country === "canada" &&
    profile.collectsCustomerData
  ) {
    detected.add("pipeda");
  }

  if (
    province === "ontario" &&
    profile.hasEmployees
  ) {
    detected.add("aoda");
  }

  if (
    province === "ontario" &&
    profile.collectsSensitiveData &&
    isHealthcareIndustry(industry)
  ) {
    detected.add("phipa");
  }

  /*
   * Activity-based frameworks
   */

  if (profile.usesPayments) {
    detected.add("pci");
  }

  if (
    profile.offersOnlineServices ||
    profile.usesCloudSoftware ||
    profile.usesCloudHosting
  ) {
    detected.add("soc2");
    detected.add("iso27001");
  }

  /*
   * GDPR should remain conditional unless the business confirms EU/EEA scope.
   */

  if (
    profile.servesEurope ||
    profile.hasEuropeanCustomers ||
    profile.monitorsEuropeanUsers
  ) {
    detected.add("gdpr");
  }

  return [...detected].filter((frameworkId) =>
    isFrameworkApplicable(frameworkId, profile)
  );
}

function isFrameworkApplicable(frameworkId, profile) {
  const country = normalizeText(profile.country);
  const province = normalizeText(profile.province);
  const industry = normalizeText(profile.industry);

  switch (frameworkId) {
    case "pipeda":
      return (
        country === "canada" &&
        profile.collectsCustomerData
      );

    case "phipa":
      return (
        province === "ontario" &&
        profile.collectsSensitiveData &&
        isHealthcareIndustry(industry)
      );

    case "aoda":
      return (
        province === "ontario" &&
        profile.hasEmployees
      );

    case "gdpr":
      return Boolean(
        profile.servesEurope ||
          profile.hasEuropeanCustomers ||
          profile.monitorsEuropeanUsers
      );

    case "pci":
      return profile.usesPayments;

    case "soc2":
    case "iso27001":
      return Boolean(
        profile.offersOnlineServices ||
          profile.usesCloudSoftware ||
          profile.usesCloudHosting
      );

    default:
      return true;
  }
}

function getApplicableControls(frameworkId, profile) {
  const controls = [
    ...(frameworkControls[frameworkId] || []),
  ];

  /*
   * Conditional requirements should only affect businesses
   * where the requirement is relevant.
   */

  if (
    profile.usesAI &&
    ["soc2", "iso27001"].includes(frameworkId)
  ) {
    controls.push("responsible_ai");
  }

  if (
    profile.hasEmployees &&
    ["soc2", "iso27001"].includes(frameworkId)
  ) {
    controls.push("acceptable_use");
  }

  if (
    profile.hasWebsite &&
    ["pipeda", "gdpr"].includes(frameworkId)
  ) {
    controls.push("cookie_policy");
  }

  if (
    profile.offersOnlineServices &&
    ["pipeda", "gdpr"].includes(frameworkId)
  ) {
    controls.push("terms");
  }

  if (
    profile.usesPayments &&
    frameworkId === "pci"
  ) {
    controls.push("vendor_register");
  }

  return [...new Set(controls)].filter(
    (controlId) => documentLibrary[controlId]
  );
}

function collectMissingDocuments({
  frameworkResults,
  profile,
  existingDocuments,
}) {
  const missingIds = new Set();

  for (const framework of frameworkResults) {
    for (const item of framework.missing) {
      missingIds.add(item.id);
    }
  }

  /*
   * Cross-framework business requirements
   */

  if (
    profile.collectsCustomerData &&
    !existingDocuments.has("privacy_policy")
  ) {
    missingIds.add("privacy_policy");
  }

  if (
    profile.collectsSensitiveData &&
    !existingDocuments.has("data_retention")
  ) {
    missingIds.add("data_retention");
  }

  if (
    (profile.collectsCustomerData ||
      profile.usesCloudSoftware ||
      profile.usesCloudHosting) &&
    !existingDocuments.has("security_policy")
  ) {
    missingIds.add("security_policy");
  }

  if (
    (profile.collectsCustomerData ||
      profile.usesPayments ||
      profile.usesCloudHosting) &&
    !existingDocuments.has("incident_response")
  ) {
    missingIds.add("incident_response");
  }

  if (
    profile.usesVendors &&
    !existingDocuments.has("vendor_register")
  ) {
    missingIds.add("vendor_register");
  }

  if (
    profile.usesAI &&
    !existingDocuments.has("responsible_ai")
  ) {
    missingIds.add("responsible_ai");
  }

  if (
    profile.hasEmployees &&
    !existingDocuments.has("acceptable_use")
  ) {
    missingIds.add("acceptable_use");
  }

  if (
    profile.province?.toLowerCase() === "ontario" &&
    profile.hasEmployees &&
    !existingDocuments.has("accessibility")
  ) {
    missingIds.add("accessibility");
  }

  return missingIds;
}

function calculateOverallScore(frameworkResults) {
  if (frameworkResults.length === 0) {
    return 0;
  }

  const weighted = frameworkResults.reduce(
    (total, framework) => {
      const weight = getPriorityWeight(
        framework.priority
      );

      return {
        score:
          total.score +
          framework.score * weight,
        weight: total.weight + weight,
      };
    },
    {
      score: 0,
      weight: 0,
    }
  );

  return weighted.weight === 0
    ? 0
    : Math.round(
        weighted.score / weighted.weight
      );
}

function normalizeProfile(profile = {}) {
  return {
    ...profile,

    businessName:
      cleanText(profile.businessName) ||
      "Unnamed business",

    industry:
      cleanText(profile.industry) ||
      "Not specified",

    country:
      cleanText(profile.country) ||
      "Not specified",

    province:
      cleanText(profile.province) ||
      "Not specified",

    existingDocuments:
      Array.isArray(profile.existingDocuments)
        ? profile.existingDocuments
        : [],

    collectsCustomerData: toBoolean(
      profile.collectsCustomerData
    ),

    collectsSensitiveData: toBoolean(
      profile.collectsSensitiveData
    ),

    hasEmployees: toBoolean(
      profile.hasEmployees
    ),

    usesPayments: toBoolean(
      profile.usesPayments
    ),

    usesAI: toBoolean(profile.usesAI),

    usesVendors: toBoolean(
      profile.usesVendors
    ),

    hasWebsite: toBoolean(
      profile.hasWebsite
    ),

    offersOnlineServices: toBoolean(
      profile.offersOnlineServices
    ),

    usesCloudSoftware: toBoolean(
      profile.usesCloudSoftware
    ),

    usesCloudHosting: toBoolean(
      profile.usesCloudHosting
    ),

    servesEurope: toBoolean(
      profile.servesEurope
    ),

    hasEuropeanCustomers: toBoolean(
      profile.hasEuropeanCustomers
    ),

    monitorsEuropeanUsers: toBoolean(
      profile.monitorsEuropeanUsers
    ),
  };
}

function normalizeDocumentIds(documents = []) {
  const validIds = new Set(
    Object.keys(documentLibrary)
  );

  const nameToId = new Map(
    Object.entries(documentLibrary).map(
      ([id, name]) => [
        normalizeText(name),
        id,
      ]
    )
  );

  return [
    ...new Set(
      documents
        .map((document) => {
          if (typeof document === "string") {
            if (validIds.has(document)) {
              return document;
            }

            return (
              nameToId.get(
                normalizeText(document)
              ) || null
            );
          }

          if (
            document &&
            typeof document === "object"
          ) {
            if (
              document.id &&
              validIds.has(document.id)
            ) {
              return document.id;
            }

            if (document.name) {
              return (
                nameToId.get(
                  normalizeText(document.name)
                ) || null
              );
            }
          }

          return null;
        })
        .filter(Boolean)
    ),
  ];
}

function formatDocument(id) {
  return {
    id,
    name: documentLibrary[id] || id,
  };
}

function getFrameworkPriority(
  frameworkId,
  profile
) {
  if (
    frameworkId === "phipa" &&
    profile.collectsSensitiveData
  ) {
    return "Critical";
  }

  if (
    frameworkId === "pipeda" &&
    profile.collectsCustomerData
  ) {
    return "High";
  }

  if (
    frameworkId === "pci" &&
    profile.usesPayments
  ) {
    return "High";
  }

  if (
    frameworkId === "aoda" &&
    normalizeText(profile.province) ===
      "ontario"
  ) {
    return "High";
  }

  if (
    frameworkId === "soc2" ||
    frameworkId === "iso27001"
  ) {
    return "Recommended";
  }

  if (frameworkId === "gdpr") {
    return "Conditional";
  }

  return "Standard";
}

function getFrameworkApplicabilityLabel(
  frameworkId,
  profile
) {
  if (
    frameworkId === "soc2" ||
    frameworkId === "iso27001"
  ) {
    return "recommended";
  }

  if (frameworkId === "gdpr") {
    return "conditional";
  }

  if (
    frameworkId === "phipa" ||
    frameworkId === "aoda" ||
    frameworkId === "pci"
  ) {
    return "conditional";
  }

  return "automatic";
}

function getReadinessStatus(score) {
  if (score >= 85) return "strong";
  if (score >= 60) return "moderate";
  if (score >= 25) return "early";
  return "limited";
}

function getPriorityWeight(priority) {
  switch (normalizeText(priority)) {
    case "critical":
      return 1.5;

    case "high":
      return 1.25;

    case "recommended":
      return 1;

    case "conditional":
      return 1;

    default:
      return 1;
  }
}

function getMaturityLevel(score) {
  if (score >= 85) {
    return {
      level: 5,
      label: "Enterprise",
      description:
        "Strong governance foundation and approaching audit readiness.",
    };
  }

  if (score >= 70) {
    return {
      level: 4,
      label: "Optimized",
      description:
        "Good foundation with continuous improvement needed.",
    };
  }

  if (score >= 50) {
    return {
      level: 3,
      label: "Managed",
      description:
        "Several controls exist, but key gaps remain.",
    };
  }

  if (score >= 25) {
    return {
      level: 2,
      label: "Basic",
      description:
        "Some governance practices exist, but documentation is limited.",
    };
  }

  return {
    level: 1,
    label: "Reactive",
    description:
      "Governance documentation and compliance controls are mostly missing.",
  };
}

function isHealthcareIndustry(industry) {
  return [
    "healthcare",
    "health",
    "medical",
    "clinic",
    "dental",
    "pharmacy",
    "therapy",
    "hospital",
    "long term care",
    "long-term care",
  ].some((keyword) =>
    industry.includes(keyword)
  );
}

function cleanText(value) {
  return String(value ?? "").trim();
}

function normalizeText(value) {
  return cleanText(value).toLowerCase();
}

function toBoolean(value) {
  return (
    value === true ||
    value === "yes" ||
    value === "true" ||
    value === 1 ||
    value === "1"
  );
}
