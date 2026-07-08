export function generateRiskSummary(profile, missingDocuments = []) {
  const risks = [];

  if (profile.collectsCustomerData) {
    risks.push({
      title: "Customer data handling risk",
      level: "High",
      recommendation: "Maintain privacy, retention, and incident response policies.",
    });
  }

  if (profile.collectsSensitiveData) {
    risks.push({
      title: "Sensitive information risk",
      level: "High",
      recommendation: "Strengthen access control, security, and breach response procedures.",
    });
  }

  if (profile.usesPayments) {
    risks.push({
      title: "Payment processing risk",
      level: "Medium",
      recommendation: "Track payment processors in a vendor register.",
    });
  }

  if (profile.usesAI) {
    risks.push({
      title: "AI governance risk",
      level: "Medium",
      recommendation: "Create a Responsible AI Policy and human oversight process.",
    });
  }

  if (missingDocuments.length > 5) {
    risks.push({
      title: "Governance documentation gap",
      level: "High",
      recommendation: "Generate missing policies and review them before publishing.",
    });
  }

  return risks;
}