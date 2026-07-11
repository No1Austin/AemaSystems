export const assessmentSteps = [
  {
    id: "business",
    title: "Business Profile",
    description:
      "Provide basic information about your business. This helps AEMA identify the standards and legal requirements that may apply.",
    questions: [
      {
        name: "businessName",
        label: "Business name",
        type: "text",
        placeholder: "Example: ABC Dental Clinic",
        required: true,
      },
      {
        name: "industry",
        label: "Industry",
        type: "text",
        placeholder: "Example: Healthcare, SaaS, Retail, Consulting",
        required: true,
      },
      {
        name: "country",
        label: "Country of operation",
        type: "text",
        defaultValue: "Canada",
        required: true,
      },
      {
        name: "province",
        label: "Province, state, or territory",
        type: "text",
        defaultValue: "Ontario",
        required: true,
      },
      {
        name: "website",
        label: "Business website",
        type: "url",
        placeholder: "https://yourbusiness.com",
        required: false,
      },
      {
        name: "email",
        label: "Business email",
        type: "email",
        placeholder: "contact@yourbusiness.com",
        required: true,
      },
      {
        name: "employees",
        label: "Number of employees or contractors",
        type: "select",
        options: ["1", "2–10", "11–50", "51–200", "More than 200"],
        required: true,
      },
    ],
  },

  {
    id: "operations",
    title: "Business Operations",
    description:
      "Select Yes, No, or N/A for each statement that describes how your business operates.",
    questions: [
      {
        name: "collectsCustomerData",
        label:
          "I collect, store, or process personal information about customers, clients, or website visitors.",
        type: "boolean",
        required: true,
      },
      {
        name: "acceptsOnlinePayments",
        label:
          "I accept payments online through Stripe, Square, PayPal, Shopify, Moneris, or another payment provider.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasEmployees",
        label: "I have employees, contractors, interns, or temporary workers.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasMoreThanOneEmployee",
        label: "My business has more than one employee or contractor.",
        type: "boolean",
        required: true,
      },
      {
        name: "usesCloudSoftware",
        label: "I use cloud-based software to operate or manage my business.",
        type: "boolean",
        required: true,
      },
      {
        name: "offersOnlineServices",
        label:
          "Customers can access my services through a website, app, portal, or online booking system.",
        type: "boolean",
        required: true,
      },
      {
        name: "servesOtherRegions",
        label:
          "I serve customers outside my province, state, territory, or country.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasMultipleLocations",
        label: "My business operates from more than one location.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasRemoteWorkers",
        label: "Some of my employees or contractors work remotely.",
        type: "boolean",
        required: true,
      },
    ],
  },

  {
    id: "data",
    title: "Information and Privacy",
    description:
      "Select Yes, No, or N/A for each type of information your business collects, stores, accesses, or processes.",
    questions: [
      {
        name: "collectsContactData",
        label:
          "I collect names, email addresses, phone numbers, or mailing addresses.",
        type: "boolean",
        required: true,
      },
      {
        name: "collectsBusinessData",
        label:
          "I collect information about businesses, organizations, customers, suppliers, or business contacts.",
        type: "boolean",
        required: true,
      },
      {
        name: "collectsHealthData",
        label:
          "I collect health, medical, treatment, disability, or patient information.",
        type: "boolean",
        required: true,
      },
      {
        name: "collectsFinancialData",
        label:
          "I collect financial information, banking information, tax records, credit information, or payment details.",
        type: "boolean",
        required: true,
      },
      {
        name: "collectsChildrenData",
        label:
          "I collect information about children or individuals under the age of majority.",
        type: "boolean",
        required: true,
      },
      {
        name: "collectsEmployeeData",
        label:
          "I collect employee or contractor records, including payroll, identification, performance, or background information.",
        type: "boolean",
        required: true,
      },
      {
        name: "collectsGovernmentIdentifiers",
        label:
          "I collect government-issued identifiers such as SIN numbers, passport details, driver's licence details, or tax numbers.",
        type: "boolean",
        required: true,
      },
      {
        name: "collectsPhotosOrVideos",
        label:
          "I collect photographs, videos, audio recordings, or surveillance footage.",
        type: "boolean",
        required: true,
      },
      {
        name: "collectsLocationData",
        label:
          "I collect precise or approximate location information about customers, employees, or devices.",
        type: "boolean",
        required: true,
      },
      {
        name: "collectsBiometricData",
        label:
          "I collect biometric information such as fingerprints, facial recognition data, or voiceprints.",
        type: "boolean",
        required: true,
      },
      {
        name: "sharesDataWithVendors",
        label:
          "I share customer, employee, or business information with third-party service providers.",
        type: "boolean",
        required: true,
      },
      {
        name: "transfersDataOutsideCountry",
        label:
          "Some of my business or customer information is stored or processed outside my country.",
        type: "boolean",
        required: true,
      },
    ],
  },

  {
    id: "technology",
    title: "Technology and Vendors",
    description:
      "Select Yes, No, or N/A for each statement about the technology and third-party providers used by your business.",
    questions: [
      {
        name: "usesPaymentProvider",
        label:
          "I use a payment provider such as Stripe, Square, PayPal, Moneris, or Shopify Payments.",
        type: "boolean",
        required: true,
      },
      {
        name: "usesEmailProvider",
        label:
          "I use an external email provider such as Google Workspace, Microsoft 365, Resend, or Mailchimp.",
        type: "boolean",
        required: true,
      },
      {
        name: "usesCloudHosting",
        label:
          "My website, application, or business data is hosted by a cloud provider.",
        type: "boolean",
        required: true,
      },
      {
        name: "usesCRM",
        label:
          "I use a CRM, contact-management system, or customer-management platform.",
        type: "boolean",
        required: true,
      },
      {
        name: "usesAccountingSoftware",
        label: "I use accounting, bookkeeping, payroll, or tax software.",
        type: "boolean",
        required: true,
      },
      {
        name: "usesBookingSoftware",
        label:
          "I use online booking, appointment, scheduling, or reservation software.",
        type: "boolean",
        required: true,
      },
      {
        name: "usesMarketingSoftware",
        label:
          "I use email marketing, advertising, analytics, or customer-tracking software.",
        type: "boolean",
        required: true,
      },
      {
        name: "vendorsReviewed",
        label:
          "I periodically review important vendors for privacy, security, reliability, and contractual risk.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasVendorAgreements",
        label:
          "I have written agreements or accepted formal terms with vendors that process business or customer information.",
        type: "boolean",
        required: true,
      },
      {
        name: "maintainsVendorList",
        label:
          "I maintain a list of the third-party services and vendors used by my business.",
        type: "boolean",
        required: true,
      },
    ],
  },

  {
    id: "security",
    title: "Security Practices",
    description:
      "Select Yes, No, or N/A for each security measure used in your business.",
    questions: [
      {
        name: "hasMFA",
        label:
          "I use multi-factor authentication for important business accounts and administrative systems.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasStrongPasswords",
        label:
          "I have password requirements or use a password manager for business accounts.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasBackups",
        label:
          "I regularly back up important business systems, files, and information.",
        type: "boolean",
        required: true,
      },
      {
        name: "testsBackups",
        label:
          "I test backups to confirm that business information can be successfully restored.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasAccessControl",
        label:
          "I limit access to systems and information based on each person's role and responsibilities.",
        type: "boolean",
        required: true,
      },
      {
        name: "removesFormerUserAccess",
        label:
          "I promptly remove system access when an employee, contractor, or administrator leaves.",
        type: "boolean",
        required: true,
      },
      {
        name: "usesDeviceProtection",
        label:
          "Business devices use antivirus, endpoint protection, firewalls, or other security tools.",
        type: "boolean",
        required: true,
      },
      {
        name: "usesEncryption",
        label: "Sensitive information is encrypted while stored or transmitted.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasSecurityTraining",
        label:
          "Employees and contractors receive privacy, cybersecurity, or acceptable-use training.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasIncidentPlan",
        label:
          "I have a documented process for responding to security incidents, privacy breaches, or system outages.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasSecurityMonitoring",
        label:
          "I monitor systems, account activity, or logs for suspicious or unauthorized activity.",
        type: "boolean",
        required: true,
      },
      {
        name: "performsSecurityTesting",
        label:
          "I periodically perform vulnerability checks, security reviews, penetration tests, or software updates.",
        type: "boolean",
        required: true,
      },
    ],
  },

  {
    id: "governance",
    title: "Policies and Governance",
    description:
      "Select Yes, No, or N/A for each document, policy, register, or governance process maintained by your business.",
    questions: [
      {
        name: "hasPrivacyPolicy",
        label: "I have a written Privacy Policy.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasTerms",
        label: "I have written Terms of Service or customer terms.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasCookiePolicy",
        label: "I have a Cookie Policy or website cookie notice.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasSecurityPolicy",
        label: "I have a written Information Security Policy.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasAccessControlPolicy",
        label: "I have a written Access Control Policy.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasPasswordPolicy",
        label: "I have a written Password Policy.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasDataRetentionPolicy",
        label: "I have a written Data Retention and Deletion Policy.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasRiskRegister",
        label: "I maintain a Risk Register.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasVendorRegister",
        label: "I maintain a Vendor Register.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasBusinessContinuityPlan",
        label: "I have a Business Continuity Plan.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasDisasterRecoveryPlan",
        label: "I have a Disaster Recovery Plan.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasIncidentResponsePolicy",
        label: "I have a written Incident Response Plan.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasAcceptableUsePolicy",
        label: "I have an Acceptable Use Policy for staff and contractors.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasAccessibilityStatement",
        label: "I have an Accessibility Statement or Accessibility Policy.",
        type: "boolean",
        required: true,
      },
      {
        name: "reviewsPolicies",
        label:
          "I formally review and update business policies on a regular schedule.",
        type: "boolean",
        required: true,
      },
      {
        name: "recordsPolicyApprovals",
        label:
          "I record policy approvals, effective dates, versions, and review dates.",
        type: "boolean",
        required: true,
      },
    ],
  },

  {
    id: "ai",
    title: "Artificial Intelligence",
    description:
      "Select Yes, No, or N/A for each statement about how artificial intelligence is used or governed in your business.",
    questions: [
      {
        name: "usesAI",
        label:
          "I use AI tools for business analysis, content, automation, customer service, hiring, recommendations, or decision support.",
        type: "boolean",
        required: true,
      },
      {
        name: "usesCustomerDataInAI",
        label:
          "I enter customer, employee, confidential, or sensitive information into AI tools.",
        type: "boolean",
        required: true,
      },
      {
        name: "aiMakesImportantDecisions",
        label:
          "AI is used to support important decisions involving customers, employees, eligibility, pricing, credit, health, or access to services.",
        type: "boolean",
        required: true,
      },
      {
        name: "reviewsAIOutputs",
        label:
          "A person reviews AI-generated outputs before important decisions are made.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasAIPolicy",
        label: "I have a written Responsible AI or AI Acceptable Use Policy.",
        type: "boolean",
        required: true,
      },
      {
        name: "disclosesAIUse",
        label:
          "I inform customers when AI is used in a way that may affect their experience or the recommendations they receive.",
        type: "boolean",
        required: true,
      },
      {
        name: "maintainsAIInventory",
        label:
          "I maintain a list of the AI tools and systems used by my business.",
        type: "boolean",
        required: true,
      },
      {
        name: "assessesAIRisk",
        label:
          "I evaluate AI tools for privacy, security, accuracy, bias, and business risk.",
        type: "boolean",
        required: true,
      },
    ],
  },

  {
    id: "history",
    title: "Compliance History and Oversight",
    description:
      "Select Yes, No, or N/A for each statement about your compliance history and oversight practices.",
    questions: [
      {
        name: "hadSecurityIncident",
        label:
          "My business has experienced a security incident, privacy breach, account compromise, or significant system outage.",
        type: "boolean",
        required: true,
      },
      {
        name: "receivedPrivacyComplaint",
        label:
          "My business has received a privacy complaint, regulatory inquiry, or request involving personal information.",
        type: "boolean",
        required: true,
      },
      {
        name: "completedAudit",
        label:
          "My business has completed a compliance, privacy, cybersecurity, or financial-controls audit.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasCyberInsurance",
        label: "My business maintains cyber liability or data-breach insurance.",
        type: "boolean",
        required: true,
      },
      {
        name: "hasComplianceOwner",
        label:
          "A specific person is responsible for privacy, security, risk, or compliance.",
        type: "boolean",
        required: true,
      },
      {
        name: "tracksEvidence",
        label:
          "I retain evidence that policies and controls are followed, such as screenshots, logs, training records, reviews, or meeting notes.",
        type: "boolean",
        required: true,
      },
      {
        name: "performsRegularReviews",
        label:
          "I conduct regular privacy, security, risk, or compliance reviews.",
        type: "boolean",
        required: true,
      },
      {
        name: "reportsComplianceToManagement",
        label:
          "Compliance, privacy, security, or risk results are reported to business leadership.",
        type: "boolean",
        required: true,
      },
    ],
  },
];
