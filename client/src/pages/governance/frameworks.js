export const frameworks = [
  {
    id: "soc2",
    name: "SOC 2 Preliminary Readiness",
    shortName: "SOC 2",
    type: "assurance",
    version: "Trust Services Criteria",
    description:
      "A preliminary assessment of security, availability, confidentiality, privacy, vendor, risk, monitoring, and incident-management practices relevant to a future SOC 2 examination.",

    disclaimer:
      "This score is a self-assessment readiness estimate. It is not a SOC 2 report, audit opinion, attestation, or certification.",

    applicability: {
      mode: "recommended",
      reason:
        "Most relevant to service organizations that store, process, transmit, or manage customer information through technology-enabled services.",
      anyAnswersYes: [
        "offersOnlineServices",
        "usesCloudHosting",
        "usesCloudSoftware",
        "collectsCustomerData",
      ],
    },

    domains: [
      {
        id: "governance",
        name: "Governance and Accountability",
        weight: 15,
        controls: [
          {
            id: "soc2-governance-owner",
            name: "Security and compliance ownership",
            answerKeys: ["hasComplianceOwner"],
            evidenceItems: [],
          },
          {
            id: "soc2-policy-governance",
            name: "Documented security governance",
            answerKeys: [
              "hasSecurityPolicy",
              "reviewsPolicies",
              "recordsPolicyApprovals",
            ],
            evidenceItems: ["Information Security Policy"],
          },
          {
            id: "soc2-risk-management",
            name: "Risk assessment and treatment",
            answerKeys: ["hasRiskRegister", "performsRegularReviews"],
            evidenceItems: ["Risk Register"],
          },
        ],
      },

      {
        id: "access-security",
        name: "Logical Access and Security",
        weight: 25,
        controls: [
          {
            id: "soc2-mfa",
            name: "Multi-factor authentication",
            answerKeys: ["hasMFA"],
            evidenceItems: [],
          },
          {
            id: "soc2-passwords",
            name: "Password security",
            answerKeys: ["hasStrongPasswords"],
            evidenceItems: [],
          },
          {
            id: "soc2-access-control",
            name: "Role-based access control",
            answerKeys: [
              "hasAccessControl",
              "hasAccessControlPolicy",
              "removesFormerUserAccess",
            ],
            evidenceItems: ["Access Control Policy"],
          },
          {
            id: "soc2-device-protection",
            name: "Endpoint and device protection",
            answerKeys: ["usesDeviceProtection"],
            evidenceItems: [],
          },
          {
            id: "soc2-encryption",
            name: "Encryption and data protection",
            answerKeys: ["usesEncryption"],
            evidenceItems: [],
          },
        ],
      },

      {
        id: "operations",
        name: "Security Operations",
        weight: 20,
        controls: [
          {
            id: "soc2-monitoring",
            name: "Security monitoring",
            answerKeys: ["hasSecurityMonitoring"],
            evidenceItems: [],
          },
          {
            id: "soc2-testing",
            name: "Security testing and vulnerability management",
            answerKeys: ["performsSecurityTesting"],
            evidenceItems: [],
          },
          {
            id: "soc2-training",
            name: "Security awareness training",
            answerKeys: ["hasSecurityTraining"],
            evidenceItems: [],
          },
          {
            id: "soc2-incident-response",
            name: "Incident response",
            answerKeys: [
              "hasIncidentPlan",
              "hasIncidentResponsePolicy",
            ],
            evidenceItems: ["Incident Response Plan"],
          },
        ],
      },

      {
        id: "availability",
        name: "Availability and Resilience",
        weight: 15,
        controls: [
          {
            id: "soc2-backups",
            name: "Backups",
            answerKeys: ["hasBackups", "testsBackups"],
            evidenceItems: [],
          },
          {
            id: "soc2-continuity",
            name: "Business continuity",
            answerKeys: ["hasBusinessContinuityPlan"],
            evidenceItems: ["Business Continuity Plan"],
          },
          {
            id: "soc2-recovery",
            name: "Disaster recovery",
            answerKeys: ["hasDisasterRecoveryPlan"],
            evidenceItems: ["Disaster Recovery Plan"],
          },
        ],
      },

      {
        id: "vendor-management",
        name: "Vendor Management",
        weight: 15,
        controls: [
          {
            id: "soc2-vendor-inventory",
            name: "Vendor inventory",
            answerKeys: [
              "maintainsVendorList",
              "hasVendorRegister",
            ],
            evidenceItems: ["Vendor Register"],
          },
          {
            id: "soc2-vendor-review",
            name: "Vendor due diligence",
            answerKeys: ["vendorsReviewed"],
            evidenceItems: [],
          },
          {
            id: "soc2-vendor-contracts",
            name: "Vendor agreements",
            answerKeys: ["hasVendorAgreements"],
            evidenceItems: [],
          },
        ],
      },

      {
        id: "privacy",
        name: "Privacy and Confidentiality",
        weight: 10,
        controls: [
          {
            id: "soc2-privacy-policy",
            name: "Privacy governance",
            answerKeys: ["hasPrivacyPolicy"],
            evidenceItems: ["Privacy Policy"],
          },
          {
            id: "soc2-retention",
            name: "Retention and deletion",
            answerKeys: ["hasDataRetentionPolicy"],
            evidenceItems: ["Data Retention and Deletion Policy"],
          },
        ],
      },
    ],
  },

  {
    id: "iso27001",
    name: "ISO/IEC 27001 Preliminary Readiness",
    shortName: "ISO 27001",
    type: "management-system",
    version: "ISO/IEC 27001:2022",
    description:
      "A preliminary evaluation of the organization's information security management system, including leadership, risk management, controls, monitoring, evidence, and continual improvement.",

    disclaimer:
      "This score does not represent ISO/IEC 27001 certification, conformity, or the result of an accredited audit.",

    applicability: {
      mode: "recommended",
      reason:
        "Applicable to organizations of any size seeking a structured information security management system.",
      anyAnswersYes: [
        "collectsCustomerData",
        "usesCloudSoftware",
        "usesCloudHosting",
        "offersOnlineServices",
      ],
    },

    domains: [
      {
        id: "context-leadership",
        name: "Context, Leadership, and Governance",
        weight: 15,
        controls: [
          {
            id: "iso-owner",
            name: "Information security ownership",
            answerKeys: ["hasComplianceOwner"],
            evidenceItems: [],
          },
          {
            id: "iso-security-policy",
            name: "Information security policy",
            answerKeys: [
              "hasSecurityPolicy",
              "reviewsPolicies",
              "recordsPolicyApprovals",
            ],
            evidenceItems: ["Information Security Policy"],
          },
        ],
      },

      {
        id: "risk",
        name: "Risk Assessment and Treatment",
        weight: 20,
        controls: [
          {
            id: "iso-risk-register",
            name: "Information security risk register",
            answerKeys: ["hasRiskRegister"],
            evidenceItems: ["Risk Register"],
          },
          {
            id: "iso-risk-review",
            name: "Periodic risk review",
            answerKeys: ["performsRegularReviews"],
            evidenceItems: [],
          },
          {
            id: "iso-management-reporting",
            name: "Management reporting",
            answerKeys: ["reportsComplianceToManagement"],
            evidenceItems: [],
          },
        ],
      },

      {
        id: "access-asset",
        name: "Access, Assets, and Data Protection",
        weight: 20,
        controls: [
          {
            id: "iso-access",
            name: "Access control",
            answerKeys: [
              "hasAccessControl",
              "hasAccessControlPolicy",
              "removesFormerUserAccess",
            ],
            evidenceItems: ["Access Control Policy"],
          },
          {
            id: "iso-authentication",
            name: "Authentication security",
            answerKeys: ["hasMFA", "hasStrongPasswords"],
            evidenceItems: [],
          },
          {
            id: "iso-encryption",
            name: "Cryptographic protection",
            answerKeys: ["usesEncryption"],
            evidenceItems: [],
          },
          {
            id: "iso-retention",
            name: "Information retention and deletion",
            answerKeys: ["hasDataRetentionPolicy"],
            evidenceItems: ["Data Retention and Deletion Policy"],
          },
        ],
      },

      {
        id: "operations-resilience",
        name: "Operations and Resilience",
        weight: 20,
        controls: [
          {
            id: "iso-monitoring",
            name: "Monitoring and logging",
            answerKeys: ["hasSecurityMonitoring"],
            evidenceItems: [],
          },
          {
            id: "iso-vulnerability",
            name: "Vulnerability and update management",
            answerKeys: ["performsSecurityTesting"],
            evidenceItems: [],
          },
          {
            id: "iso-backups",
            name: "Backup and restoration",
            answerKeys: ["hasBackups", "testsBackups"],
            evidenceItems: [],
          },
          {
            id: "iso-continuity",
            name: "Business continuity",
            answerKeys: ["hasBusinessContinuityPlan"],
            evidenceItems: ["Business Continuity Plan"],
          },
          {
            id: "iso-recovery",
            name: "Disaster recovery",
            answerKeys: ["hasDisasterRecoveryPlan"],
            evidenceItems: ["Disaster Recovery Plan"],
          },
        ],
      },

      {
        id: "incident-vendor",
        name: "Incident and Supplier Management",
        weight: 15,
        controls: [
          {
            id: "iso-incident",
            name: "Incident management",
            answerKeys: [
              "hasIncidentPlan",
              "hasIncidentResponsePolicy",
            ],
            evidenceItems: ["Incident Response Plan"],
          },
          {
            id: "iso-vendor-register",
            name: "Supplier inventory",
            answerKeys: [
              "maintainsVendorList",
              "hasVendorRegister",
            ],
            evidenceItems: ["Vendor Register"],
          },
          {
            id: "iso-vendor-review",
            name: "Supplier security review",
            answerKeys: [
              "vendorsReviewed",
              "hasVendorAgreements",
            ],
            evidenceItems: [],
          },
        ],
      },

      {
        id: "improvement",
        name: "Performance and Improvement",
        weight: 10,
        controls: [
          {
            id: "iso-audit",
            name: "Audit or independent review",
            answerKeys: ["completedAudit"],
            evidenceItems: [],
          },
          {
            id: "iso-evidence",
            name: "Control evidence",
            answerKeys: ["tracksEvidence"],
            evidenceItems: [],
          },
          {
            id: "iso-policy-review",
            name: "Continual improvement",
            answerKeys: [
              "reviewsPolicies",
              "performsRegularReviews",
            ],
            evidenceItems: [],
          },
        ],
      },
    ],
  },

  {
    id: "pipeda",
    name: "PIPEDA Preliminary Readiness",
    shortName: "PIPEDA",
    type: "privacy-law",
    description:
      "A preliminary assessment against major PIPEDA accountability, consent, transparency, safeguards, access, retention, and complaint-handling expectations.",

    disclaimer:
      "This is an informational readiness estimate and does not determine whether PIPEDA or a substantially similar provincial privacy law legally applies.",

    applicability: {
      mode: "conditional",
      reason:
        "Potentially applicable to Canadian private-sector organizations handling personal information in commercial activities.",
      allAnswersYes: ["collectsCustomerData"],
      countries: ["Canada"],
    },

    domains: [
      {
        id: "accountability",
        name: "Accountability",
        weight: 15,
        controls: [
          {
            id: "pipeda-owner",
            name: "Privacy accountability",
            answerKeys: ["hasComplianceOwner"],
            evidenceItems: [],
          },
          {
            id: "pipeda-policy",
            name: "Privacy policy and procedures",
            answerKeys: [
              "hasPrivacyPolicy",
              "reviewsPolicies",
            ],
            evidenceItems: ["Privacy Policy"],
          },
        ],
      },

      {
        id: "purposes-consent",
        name: "Purposes and Consent",
        weight: 20,
        controls: [
          {
            id: "pipeda-transparency",
            name: "Transparent collection and use",
            answerKeys: ["hasPrivacyPolicy"],
            evidenceItems: ["Privacy Policy"],
          },
          {
            id: "pipeda-website-notice",
            name: "Website privacy transparency",
            answerKeys: ["hasPrivacyPolicy", "hasCookiePolicy"],
            evidenceItems: ["Privacy Policy"],
          },
        ],
      },

      {
        id: "collection-use-retention",
        name: "Collection, Use, and Retention",
        weight: 20,
        controls: [
          {
            id: "pipeda-retention",
            name: "Retention and deletion controls",
            answerKeys: ["hasDataRetentionPolicy"],
            evidenceItems: ["Data Retention and Deletion Policy"],
          },
          {
            id: "pipeda-access-limitation",
            name: "Limited internal access",
            answerKeys: [
              "hasAccessControl",
              "hasAccessControlPolicy",
            ],
            evidenceItems: ["Access Control Policy"],
          },
        ],
      },

      {
        id: "safeguards",
        name: "Safeguards",
        weight: 25,
        controls: [
          {
            id: "pipeda-security-policy",
            name: "Security governance",
            answerKeys: ["hasSecurityPolicy"],
            evidenceItems: ["Information Security Policy"],
          },
          {
            id: "pipeda-security-controls",
            name: "Technical safeguards",
            answerKeys: [
              "hasMFA",
              "hasStrongPasswords",
              "usesEncryption",
              "usesDeviceProtection",
            ],
            evidenceItems: [],
          },
          {
            id: "pipeda-incident",
            name: "Privacy and security incident response",
            answerKeys: [
              "hasIncidentPlan",
              "hasIncidentResponsePolicy",
            ],
            evidenceItems: ["Incident Response Plan"],
          },
        ],
      },

      {
        id: "openness-access",
        name: "Openness, Access, and Complaints",
        weight: 20,
        controls: [
          {
            id: "pipeda-open-policy",
            name: "Public privacy information",
            answerKeys: ["hasPrivacyPolicy"],
            evidenceItems: ["Privacy Policy"],
          },
          {
            id: "pipeda-complaint-oversight",
            name: "Complaint and request oversight",
            answerKeys: [
              "hasComplianceOwner",
              "receivedPrivacyComplaint",
            ],
            evidenceItems: [],
            negativeAnswerKeys: ["receivedPrivacyComplaint"],
          },
        ],
      },
    ],
  },

  {
    id: "gdpr",
    name: "GDPR Preliminary Readiness",
    shortName: "GDPR",
    type: "privacy-law",
    description:
      "A preliminary assessment of privacy governance, lawful processing, transparency, security, rights handling, high-risk processing, and international-transfer practices.",

    disclaimer:
      "This score does not establish GDPR applicability or legal compliance. Territorial scope and controller or processor obligations require a separate legal assessment.",

    applicability: {
      mode: "conditional",
      reason:
        "Potentially applicable where the business offers goods or services to, or monitors, individuals in the EU or EEA.",
      anyAnswersYes: [
        "servesOtherRegions",
        "transfersDataOutsideCountry",
      ],
      requiresManualConfirmation: true,
      confirmationQuestion:
        "Does the business offer goods or services to, or monitor the behaviour of, individuals in the EU or EEA?",
    },

    domains: [
      {
        id: "governance",
        name: "Accountability and Governance",
        weight: 15,
        controls: [
          {
            id: "gdpr-owner",
            name: "Privacy responsibility",
            answerKeys: ["hasComplianceOwner"],
            evidenceItems: [],
          },
          {
            id: "gdpr-policy",
            name: "Privacy governance",
            answerKeys: [
              "hasPrivacyPolicy",
              "reviewsPolicies",
            ],
            evidenceItems: ["Privacy Policy"],
          },
          {
            id: "gdpr-evidence",
            name: "Compliance evidence",
            answerKeys: ["tracksEvidence"],
            evidenceItems: [],
          },
        ],
      },

      {
        id: "lawfulness-transparency",
        name: "Lawfulness and Transparency",
        weight: 20,
        controls: [
          {
            id: "gdpr-privacy-notice",
            name: "Privacy notice",
            answerKeys: ["hasPrivacyPolicy"],
            evidenceItems: ["Privacy Policy"],
          },
          {
            id: "gdpr-cookie-transparency",
            name: "Cookie and tracking transparency",
            answerKeys: ["hasCookiePolicy"],
            evidenceItems: ["Cookie Policy"],
          },
        ],
      },

      {
        id: "data-management",
        name: "Data Management",
        weight: 20,
        controls: [
          {
            id: "gdpr-retention",
            name: "Retention and deletion",
            answerKeys: ["hasDataRetentionPolicy"],
            evidenceItems: ["Data Retention and Deletion Policy"],
          },
          {
            id: "gdpr-access",
            name: "Access restrictions",
            answerKeys: [
              "hasAccessControl",
              "hasAccessControlPolicy",
            ],
            evidenceItems: ["Access Control Policy"],
          },
          {
            id: "gdpr-vendor",
            name: "Processor and vendor governance",
            answerKeys: [
              "maintainsVendorList",
              "hasVendorAgreements",
              "vendorsReviewed",
            ],
            evidenceItems: ["Vendor Register"],
          },
        ],
      },

      {
        id: "security",
        name: "Security and Breach Management",
        weight: 20,
        controls: [
          {
            id: "gdpr-security",
            name: "Security safeguards",
            answerKeys: [
              "hasMFA",
              "usesEncryption",
              "usesDeviceProtection",
              "hasSecurityMonitoring",
            ],
            evidenceItems: ["Information Security Policy"],
          },
          {
            id: "gdpr-incident",
            name: "Personal-data breach response",
            answerKeys: [
              "hasIncidentPlan",
              "hasIncidentResponsePolicy",
            ],
            evidenceItems: ["Incident Response Plan"],
          },
        ],
      },

      {
        id: "high-risk-processing",
        name: "High-Risk Processing",
        weight: 15,
        controls: [
          {
            id: "gdpr-risk-register",
            name: "Privacy risk assessment",
            answerKeys: [
              "hasRiskRegister",
              "performsRegularReviews",
            ],
            evidenceItems: ["Risk Register"],
          },
          {
            id: "gdpr-ai-risk",
            name: "AI and automated-decision risk",
            answerKeys: [
              "assessesAIRisk",
              "reviewsAIOutputs",
            ],
            evidenceItems: ["Responsible AI Policy"],
            applicableWhenAnyYes: [
              "usesAI",
              "aiMakesImportantDecisions",
            ],
          },
        ],
      },

      {
        id: "international-transfers",
        name: "International Transfers",
        weight: 10,
        controls: [
          {
            id: "gdpr-transfer-governance",
            name: "International-transfer governance",
            answerKeys: [
              "maintainsVendorList",
              "hasVendorAgreements",
              "vendorsReviewed",
            ],
            evidenceItems: ["Vendor Register"],
            applicableWhenAnyYes: [
              "transfersDataOutsideCountry",
            ],
          },
        ],
      },
    ],
  },

  {
    id: "aoda",
    name: "AODA Preliminary Readiness",
    shortName: "AODA",
    type: "accessibility-law",
    description:
      "A preliminary assessment of accessibility policies, customer service, employment, information, communications, website accessibility, training, planning, and reporting.",

    disclaimer:
      "AODA obligations vary by organization type, number of Ontario employees, and activities. This score is not a legal determination of compliance.",

    applicability: {
      mode: "conditional",
      reason:
        "Potentially applicable to organizations operating in Ontario with at least one employee.",
      provinces: ["Ontario"],
      allAnswersYes: ["hasEmployees"],
    },

    domains: [
      {
        id: "policy",
        name: "Accessibility Policy",
        weight: 20,
        controls: [
          {
            id: "aoda-policy",
            name: "Accessibility policy or statement",
            answerKeys: ["hasAccessibilityStatement"],
            evidenceItems: ["Accessibility Statement"],
          },
          {
            id: "aoda-review",
            name: "Accessibility-policy review",
            answerKeys: ["reviewsPolicies"],
            evidenceItems: [],
          },
        ],
      },

      {
        id: "customer-service",
        name: "Accessible Customer Service",
        weight: 20,
        controls: [
          {
            id: "aoda-customer-service-policy",
            name: "Accessible customer-service procedures",
            answerKeys: [],
            evidenceItems: ["Accessible Customer Service Policy"],
            requiresManualEvidence: true,
          },
          {
            id: "aoda-training",
            name: "Accessibility training",
            answerKeys: [],
            evidenceItems: [],
            requiresManualEvidence: true,
          },
        ],
      },

      {
        id: "information-communications",
        name: "Information and Communications",
        weight: 20,
        controls: [
          {
            id: "aoda-accessible-formats",
            name: "Accessible formats and communication supports",
            answerKeys: [],
            evidenceItems: [],
            requiresManualEvidence: true,
          },
          {
            id: "aoda-feedback",
            name: "Accessible feedback process",
            answerKeys: [],
            evidenceItems: [],
            requiresManualEvidence: true,
          },
        ],
      },

      {
        id: "website",
        name: "Website Accessibility",
        weight: 15,
        controls: [
          {
            id: "aoda-website",
            name: "Public website accessibility review",
            answerKeys: [],
            evidenceItems: [],
            applicableWhenAnyYes: ["offersOnlineServices"],
            requiresManualEvidence: true,
          },
        ],
      },

      {
        id: "employment",
        name: "Employment Accessibility",
        weight: 15,
        controls: [
          {
            id: "aoda-employment",
            name: "Accessible employment practices",
            answerKeys: [],
            evidenceItems: [],
            applicableWhenAnyYes: ["hasEmployees"],
            requiresManualEvidence: true,
          },
        ],
      },

      {
        id: "planning-reporting",
        name: "Planning and Reporting",
        weight: 10,
        controls: [
          {
            id: "aoda-multiyear-plan",
            name: "Multi-year accessibility plan",
            answerKeys: [],
            evidenceItems: ["Multi-Year Accessibility Plan"],
            requiresManualEvidence: true,
          },
          {
            id: "aoda-reporting",
            name: "Accessibility compliance reporting",
            answerKeys: [],
            evidenceItems: [],
            requiresManualEvidence: true,
          },
        ],
      },
    ],
  },
];