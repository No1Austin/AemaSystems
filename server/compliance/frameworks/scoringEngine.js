import { frameworks } from "./frameworks.js";
import { detectFrameworks } from "./industries.js";
import { frameworkControls } from "./controls.js";
import { documentLibrary } from "./documents.js";
import { buildBusinessProfile } from "../businessProfile.js";
import { generateRiskSummary } from "./riskEngine.js";

export function evaluateCompliance(input = {}) {
  const profile = buildBusinessProfile(input);

  const applicableFrameworkIds = detectFrameworks(profile.industry);
  const existingDocuments = new Set(profile.existingDocuments || []);

  const frameworkResults = applicableFrameworkIds.map((frameworkId) => {
    const framework = frameworks.find((item) => item.id === frameworkId);
    const requiredControls = frameworkControls[frameworkId] || [];

    const completed = requiredControls.filter((control) =>
      existingDocuments.has(control)
    );

    const missing = requiredControls.filter(
      (control) => !existingDocuments.has(control)
    );

    const score =
      requiredControls.length === 0
        ? 100
        : Math.round((completed.length / requiredControls.length) * 100);

    return {
      id: frameworkId,
      name: framework?.name || frameworkId,
      region: framework?.region || "",
      description: framework?.description || "",
      priority: getFrameworkPriority(frameworkId, profile),
      score,
      completed: completed.map(formatDocument),
      missing: missing.map(formatDocument),
    };
  });

  const missingIds = new Set();

  frameworkResults.forEach((framework) => {
    framework.missing.forEach((item) => missingIds.add(item.id));
  });

  if (profile.usesAI) missingIds.add("responsible_ai");
  if (profile.hasEmployees) missingIds.add("acceptable_use");
  if (profile.usesPayments) missingIds.add("vendor_register");

  const missingDocuments = [...missingIds].map(formatDocument);

  const overallScore =
    frameworkResults.length === 0
      ? 0
      : Math.round(
          frameworkResults.reduce((sum, item) => sum + item.score, 0) /
            frameworkResults.length
        );

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
    risks,
    recommendation:
      missingDocuments.length > 0
        ? "Generate missing governance and compliance documents with AEMA Compliance OS."
        : "No major missing documents detected from the current profile.",
  };
}

function formatDocument(id) {
  return {
    id,
    name: documentLibrary[id] || id,
  };
}

function getFrameworkPriority(frameworkId, profile) {
  if (frameworkId === "phipa" && profile.collectsSensitiveData) return "Critical";
  if (frameworkId === "pipeda" && profile.collectsCustomerData) return "High";
  if (frameworkId === "pci" && profile.usesPayments) return "High";
  if (frameworkId === "aoda" && profile.province?.toLowerCase() === "ontario")
    return "High";
  if (frameworkId === "soc2" || frameworkId === "iso27001") return "Recommended";

  return "Standard";
}

function getMaturityLevel(score) {
  if (score >= 85) {
    return {
      level: 5,
      label: "Enterprise",
      description: "Strong governance foundation and approaching audit readiness.",
    };
  }

  if (score >= 70) {
    return {
      level: 4,
      label: "Optimized",
      description: "Good foundation with continuous improvement needed.",
    };
  }

  if (score >= 50) {
    return {
      level: 3,
      label: "Managed",
      description: "Several controls exist, but key gaps remain.",
    };
  }

  if (score >= 25) {
    return {
      level: 2,
      label: "Basic",
      description: "Some governance practices exist, but documentation is limited.",
    };
  }

  return {
    level: 1,
    label: "Reactive",
    description: "Governance documentation and compliance controls are mostly missing.",
  };
}