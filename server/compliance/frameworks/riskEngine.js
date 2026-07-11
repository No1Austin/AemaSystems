export function generateRiskSummary(profile, missingDocuments = []) {
  const risks = [];

  const missing = new Set(
    missingDocuments.map((doc) =>
      typeof doc === "string" ? doc : doc.id
    )
  );

  /*
  |--------------------------------------------------------------------------
  | Privacy
  |--------------------------------------------------------------------------
  */

  if (profile.collectsCustomerData) {
    risks.push({
      title: "Customer data handling risk",
      level: "High",
      recommendation:
        "Maintain a Privacy Policy, Data Retention Policy, and Incident Response Plan.",
    });

    if (missing.has("privacy_policy")) {
      risks.push({
        title: "Missing Privacy Policy",
        level: "Critical",
        recommendation:
          "Create and publish a Privacy Policy before collecting personal information.",
      });
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Sensitive Information
  |--------------------------------------------------------------------------
  */

  if (profile.collectsSensitiveData) {
    risks.push({
      title: "Sensitive information risk",
      level: "Critical",
      recommendation:
        "Strengthen access control, encryption, logging, and breach response procedures.",
    });

    if (missing.has("security_policy")) {
      risks.push({
        title: "Weak security governance",
        level: "High",
        recommendation:
          "Develop an Information Security Policy and Access Control Policy.",
      });
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Payment Processing
  |--------------------------------------------------------------------------
  */

  if (profile.usesPayments) {
    risks.push({
      title: "Payment processing risk",
      level: "High",
      recommendation:
        "Maintain a Vendor Register and review payment providers regularly.",
    });

    if (missing.has("vendor_register")) {
      risks.push({
        title: "Third-party vendor oversight gap",
        level: "Medium",
        recommendation:
          "Document payment providers and evaluate their security practices.",
      });
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Artificial Intelligence
  |--------------------------------------------------------------------------
  */

  if (profile.usesAI) {
    risks.push({
      title: "AI governance risk",
      level: "Medium",
      recommendation:
        "Implement Responsible AI governance, human oversight, and model review procedures.",
    });

    if (missing.has("responsible_ai")) {
      risks.push({
        title: "Missing Responsible AI Policy",
        level: "Medium",
        recommendation:
          "Create a Responsible AI Policy describing oversight, transparency, and accountability.",
      });
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Employees
  |--------------------------------------------------------------------------
  */

  if (profile.hasEmployees && missing.has("acceptable_use")) {
    risks.push({
      title: "Internal governance risk",
      level: "Medium",
      recommendation:
        "Create an Acceptable Use Policy for staff and contractors.",
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Business Continuity
  |--------------------------------------------------------------------------
  */

  if (missing.has("business_continuity")) {
    risks.push({
      title: "Business interruption risk",
      level: "Medium",
      recommendation:
        "Develop a Business Continuity Plan to prepare for operational disruptions.",
    });
  }

  if (missing.has("disaster_recovery")) {
    risks.push({
      title: "Technology recovery risk",
      level: "Medium",
      recommendation:
        "Prepare a Disaster Recovery Plan covering backups and system restoration.",
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Governance
  |--------------------------------------------------------------------------
  */

  if (missing.size >= 5) {
    risks.push({
      title: "Governance documentation gap",
      level: "High",
      recommendation:
        "Generate the missing governance documents and review them before publication.",
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Overall readiness
  |--------------------------------------------------------------------------
  */

  if (missing.size >= 10) {
    risks.push({
      title: "Immature governance programme",
      level: "Critical",
      recommendation:
        "Establish a formal governance programme before pursuing compliance certifications.",
    });
  }

  return risks;
}