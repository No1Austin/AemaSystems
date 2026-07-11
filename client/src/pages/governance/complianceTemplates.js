function cleanText(value, fallback = "") {
  const cleaned = String(value ?? "").trim();
  return cleaned || fallback;
}

function createSlug(value) {
  return cleanText(value, "business")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatList(items = [], fallback = "None confirmed") {
  if (!Array.isArray(items) || items.length === 0) {
    return `- ${fallback}`;
  }

  return items.map((item) => `- ${item}`).join("\n");
}

function getAnswer(form, key) {
  return form?.[key] ?? "";
}

function isYes(form, key) {
  return getAnswer(form, key) === "yes";
}

export function buildPolicyDrafts({
  form = {},
  missingItems = [],
  businessProfile = {},
  risks = [],
  recommendations = [],
  frameworkResults = [],
  documentContext = {},
  assessmentId = null,
}) {
  const today = new Date();
  const nextReview = new Date(today);

  nextReview.setMonth(nextReview.getMonth() + 6);

  const effectiveDate = today.toISOString().slice(0, 10);
  const reviewDate = nextReview.toISOString().slice(0, 10);

  const businessName = cleanText(
    form.businessName,
    businessProfile.name || "The organization"
  );

  const businessSlug = createSlug(businessName);

  const jurisdiction = cleanText(
    businessProfile.jurisdiction,
    [form.province, form.country].filter(Boolean).join(", ")
  );

  const industry = cleanText(
    businessProfile.industry,
    form.industry || "Not specified"
  );

  const website = cleanText(form.website, "[Website to be confirmed]");
  const contactEmail = cleanText(
    form.email,
    "[Privacy or compliance contact to be confirmed]"
  );

  const confirmedFacts = Array.isArray(documentContext.confirmedFacts)
    ? documentContext.confirmedFacts
    : [];

  const unknowns = Array.isArray(documentContext.unknowns)
    ? documentContext.unknowns
    : [];

  const prohibitedClaims = Array.isArray(
    documentContext.prohibitedClaims
  )
    ? documentContext.prohibitedClaims
    : [];

  const base = {
    assessment_id: assessmentId,
    category: "Compliance",
    version: "1.0",
    status: "Draft",
    owner: businessName,
    effective_date: effectiveDate,
    last_reviewed: effectiveDate,
    next_review: reviewDate,
    is_public: false,
  };

  const contextHeader = `> **Draft status:** This document was generated from assessment responses and must be reviewed, completed, and approved before publication or operational use.

## Organization Information

- **Organization:** ${businessName}
- **Industry:** ${industry}
- **Jurisdiction:** ${jurisdiction || "Not specified"}
- **Website:** ${website}
- **Contact:** ${contactEmail}
- **Effective date:** ${effectiveDate}
- **Next review date:** ${reviewDate}

## Confirmed Assessment Facts

${formatList(confirmedFacts)}

## Information Requiring Confirmation

${formatList(unknowns, "No outstanding information identified")}
`;

  const approvalSection = `
## Document Approval

- **Approved by:** [To be completed]
- **Position:** [To be completed]
- **Approval date:** [To be completed]
- **Document owner:** ${businessName}
- **Version:** 1.0

## Revision History

| Version | Date | Description | Approved By |
|---|---|---|---|
| 1.0 | ${effectiveDate} | Initial draft generated from the compliance assessment | Pending approval |
`;

  const templates = {
    "Privacy Policy": {
      slug: `${businessSlug}-privacy`,
      title: "Privacy Policy",
      description: `Draft Privacy Policy for ${businessName}.`,
      category: "Privacy",
      content: `${contextHeader}

## 1. Purpose

This Privacy Policy explains how ${businessName} collects, uses, discloses, protects, retains, and manages personal information.

## 2. Scope

This policy applies to personal information handled through the organization's services, website, communications, employees, contractors, and third-party providers.

## 3. Information Collected

The organization may collect information that is necessary to provide services and operate the business.

The exact categories of information must be confirmed before publication.

${isYes(form, "collectsContactData") ? "- Contact information, including names, email addresses, telephone numbers, and mailing addresses." : ""}

${isYes(form, "collectsHealthData") ? "- Health, medical, disability, treatment, or patient information." : ""}

${isYes(form, "collectsFinancialData") ? "- Financial, payment, banking, credit, tax, or transaction information." : ""}

${isYes(form, "collectsEmployeeData") ? "- Employee and contractor information." : ""}

${isYes(form, "collectsGovernmentIdentifiers") ? "- Government-issued identification information." : ""}

${isYes(form, "collectsPhotosOrVideos") ? "- Photographs, video, audio, or surveillance information." : ""}

${isYes(form, "collectsLocationData") ? "- Device or location information." : ""}

${isYes(form, "collectsBiometricData") ? "- Biometric information." : ""}

## 4. Purposes of Collection and Use

Personal information may be collected and used to:

- provide and administer services;
- respond to inquiries;
- manage customer and business relationships;
- process transactions;
- maintain security;
- meet contractual and legal obligations;
- improve business operations.

## 5. Consent and Lawful Handling

The organization will obtain consent or rely on another lawful authority where required.

The organization will limit collection, use, and disclosure to appropriate and identified purposes.

## 6. Service Providers

${
  isYes(form, "sharesDataWithVendors")
    ? "The organization uses third-party service providers. These providers must be reviewed and governed through appropriate contractual, privacy, and security controls."
    : "The use of third-party providers must be confirmed."
}

## 7. International Processing

${
  isYes(form, "transfersDataOutsideCountry")
    ? "Personal information may be stored or processed outside the organization's home jurisdiction and may be subject to the laws of those locations."
    : "Cross-border processing was not confirmed in the assessment."
}

## 8. Retention and Deletion

Personal information will be retained only for approved business, contractual, and legal purposes.

Specific retention periods must be documented and approved before this policy is finalized.

## 9. Security Safeguards

The organization will maintain administrative, technical, and physical safeguards appropriate to the sensitivity of the information and the identified risks.

This section does not represent that every safeguard has already been implemented.

## 10. Individual Rights

Individuals may contact the organization to ask questions, request access or correction, or raise concerns about personal information, subject to applicable law.

## 11. Privacy Incidents

Suspected privacy or security incidents must be reported and managed through the organization's incident-response process.

## 12. Contact

Privacy questions or requests may be directed to:

${contactEmail}

## 13. Approval

This document becomes effective only after review and formal approval by the organization.
`,
    },

    "Terms of Service": {
      slug: `${businessSlug}-terms`,
      title: "Terms of Service",
      description: `Draft Terms of Service for ${businessName}.`,
      category: "Legal",
      content: `${contextHeader}

## 1. Acceptance

These Terms govern access to and use of the services provided by ${businessName}.

Users should not use the services unless they agree to these Terms.

## 2. Services

The organization provides services within the scope agreed with each customer.

Detailed service descriptions, pricing, timelines, and deliverables may be contained in separate agreements, proposals, or order forms.

## 3. User Responsibilities

Users must:

- provide accurate information;
- use the services lawfully;
- protect their account credentials;
- avoid interfering with systems or other users;
- comply with applicable agreements and policies.

## 4. Fees and Payments

Applicable fees, taxes, billing schedules, refunds, and cancellation rules must be confirmed and included before publication.

## 5. Intellectual Property

Ownership and permitted use of software, content, deliverables, trademarks, and customer materials must be confirmed.

## 6. Privacy

Personal information will be handled according to the organization's Privacy Policy.

## 7. Availability and Changes

The organization may update, improve, suspend, or discontinue parts of the services, subject to contracts and applicable law.

## 8. Disclaimers

Services are provided subject to the representations and warranties expressly stated in applicable agreements.

## 9. Limitation of Liability

Any limitation of liability must be reviewed for the organization's jurisdiction, services, contracts, and consumer-protection obligations before publication.

## 10. Termination

The organization may suspend or terminate access where users breach these Terms, misuse services, or create legal or security risk.

## 11. Governing Law

The appropriate governing law and dispute-resolution process must be confirmed.

## 12. Contact

Questions may be directed to:

${contactEmail}
`,
    },

    "Cookie Policy": {
      slug: `${businessSlug}-cookies`,
      title: "Cookie Policy",
      description: `Draft Cookie Policy for ${businessName}.`,
      category: "Privacy",
      content: `${contextHeader}

## 1. Purpose

This Cookie Policy explains how ${businessName} may use cookies and similar technologies on ${website}.

## 2. What Cookies Are

Cookies are small files or identifiers stored on or accessed through a user's device.

## 3. Categories of Cookies

The website may use:

- strictly necessary cookies;
- security cookies;
- preference cookies;
- analytics cookies;
- advertising or marketing cookies.

The actual cookies and technologies used must be confirmed through a website or consent-platform review.

## 4. Third-Party Technologies

Third-party services may place or access cookies when embedded or used through the website.

## 5. Consent

Where required, non-essential cookies should not operate until the user has provided valid consent.

## 6. Managing Cookies

Users may manage cookies through the website consent tool or their browser settings.

## 7. Updates

This policy should be reviewed whenever the website, analytics, advertising, or tracking technologies change.

## 8. Contact

Questions may be directed to:

${contactEmail}
`,
    },

    "Information Security Policy": {
      slug: `${businessSlug}-information-security`,
      title: "Information Security Policy",
      description: `Draft Information Security Policy for ${businessName}.`,
      category: "Security",
      content: `${contextHeader}

## 1. Purpose

This policy establishes the principles used by ${businessName} to protect business, customer, employee, and system information.

## 2. Scope

This policy applies to employees, contractors, administrators, systems, devices, applications, networks, information, and third-party services.

## 3. Security Principles

The organization will:

- restrict access according to business need;
- use secure authentication;
- protect devices and systems;
- maintain appropriate backups;
- identify and manage security risks;
- respond to incidents;
- review important vendors;
- train relevant personnel.

## 4. Access Control

Access must be authorized, role-based, reviewed periodically, and removed promptly when no longer required.

## 5. Authentication

Important systems should use strong passwords and multi-factor authentication.

## 6. Data Protection

Sensitive information should be protected in storage and transmission using safeguards appropriate to the risk.

## 7. Devices and Systems

Business devices and systems should receive appropriate updates, malware protection, configuration controls, and monitoring.

## 8. Backup and Recovery

Important systems and information should be backed up and restoration should be tested.

## 9. Vendor Security

Important vendors should be assessed before onboarding and periodically thereafter.

## 10. Incident Management

Suspected security incidents must be reported, contained, investigated, documented, and remediated.

## 11. Training

Relevant employees and contractors should receive recurring security and privacy training.

## 12. Review and Approval

This policy must be reviewed at least annually or after material operational, legal, or technology changes.
`,
    },

    "Security Policy": {
      slug: `${businessSlug}-information-security`,
      title: "Information Security Policy",
      description: `Draft Information Security Policy for ${businessName}.`,
      category: "Security",
      content: `${contextHeader}

## 1. Purpose

This policy establishes the information-security responsibilities of ${businessName}.

## 2. Core Requirements

The organization will establish and maintain:

- access controls;
- secure authentication;
- data-protection safeguards;
- device and system protection;
- backup and recovery procedures;
- vendor-security reviews;
- incident-response procedures;
- training and awareness;
- periodic security reviews.

## 3. Implementation Status

This document describes required controls. It does not represent that every control is currently implemented.

## 4. Review

The policy must be approved and reviewed at least annually.
`,
    },

    "Access Control Policy": {
      slug: `${businessSlug}-access-control`,
      title: "Access Control Policy",
      description: `Draft Access Control Policy for ${businessName}.`,
      category: "Security",
      content: `${contextHeader}

## 1. Purpose

This policy governs how access to information, systems, applications, and facilities is requested, approved, granted, reviewed, and removed.

## 2. Principles

Access must follow:

- least privilege;
- need-to-know;
- unique user identification;
- role-based authorization;
- separation of duties where practical.

## 3. Access Approval

Access must be approved by an authorized owner before it is granted.

## 4. Privileged Access

Administrative access must be restricted, logged, and reviewed.

## 5. User Lifecycle

Access must be updated when roles change and removed promptly when employment, contracts, or business need ends.

## 6. Reviews

Important access rights should be reviewed periodically.

## 7. Exceptions

Exceptions must be documented, approved, time-limited, and reviewed.
`,
    },

    "Data Retention and Deletion Policy": {
      slug: `${businessSlug}-data-retention`,
      title: "Data Retention and Deletion Policy",
      description: `Draft Data Retention and Deletion Policy for ${businessName}.`,
      category: "Privacy",
      content: `${contextHeader}

## 1. Purpose

This policy establishes how information is retained, archived, deleted, and disposed of.

## 2. Principles

Information must be retained only for approved legal, contractual, operational, security, or historical purposes.

## 3. Retention Schedule

A retention schedule must identify:

- information category;
- business owner;
- retention period;
- legal or business basis;
- storage location;
- disposal method.

## 4. Legal Holds

Information subject to litigation, investigation, audit, or regulatory request must not be deleted until the hold is released.

## 5. Secure Deletion

Information must be securely deleted or destroyed when retention is no longer required.

## 6. Vendor Deletion

Contracts and offboarding procedures should address deletion or return of information held by vendors.

## 7. Review

Retention periods must be reviewed periodically and whenever legal or operational requirements change.
`,
    },

    "Incident Response Plan": {
      slug: `${businessSlug}-incident-response`,
      title: "Incident Response Plan",
      description: `Draft Incident Response Plan for ${businessName}.`,
      category: "Security",
      content: `${contextHeader}

## 1. Purpose

This plan establishes how ${businessName} prepares for, identifies, contains, investigates, resolves, and learns from security, privacy, technology, and operational incidents.

## 2. Roles

The organization must assign:

- an incident coordinator;
- technical responders;
- privacy or legal support;
- communications responsibility;
- business leadership oversight.

## 3. Response Lifecycle

### Identification

Record the date, source, affected systems, affected information, and initial indicators.

### Triage

Assess severity, business impact, affected individuals, and legal or contractual obligations.

### Containment

Limit ongoing harm while preserving relevant evidence.

### Investigation

Determine root cause, scope, timeline, and affected systems or information.

### Recovery

Restore systems safely, validate operations, and monitor for recurrence.

### Notification

Notify affected individuals, customers, regulators, insurers, vendors, or law enforcement where required.

### Lessons Learned

Document corrective actions, owners, deadlines, and policy or control improvements.

## 4. Evidence

Logs, screenshots, communications, decisions, and remediation actions must be preserved.

## 5. Testing

The plan should be reviewed and tested periodically.
`,
    },

    "Vendor Register": {
      slug: `${businessSlug}-vendor-register`,
      title: "Vendor Register",
      description: `Draft Vendor Register structure for ${businessName}.`,
      category: "Vendor Management",
      content: `${contextHeader}

## Vendor Register Fields

| Vendor | Service | Business Owner | Data Processed | Data Location | Contract Status | Risk Rating | Last Review | Next Review | Status |
|---|---|---|---|---|---|---|---|---|---|
| To be completed |  |  |  |  |  |  |  |  |  |

## Suggested Vendor Categories

- payment processors;
- hosting providers;
- email providers;
- cloud software;
- accounting and payroll systems;
- booking systems;
- marketing and analytics tools;
- CRM platforms;
- artificial-intelligence tools.

## Review Requirements

Important vendors should be assessed for privacy, security, availability, data location, subcontractors, breach notification, contract terms, and exit requirements.
`,
    },

    "Risk Register": {
      slug: `${businessSlug}-risk-register`,
      title: "Risk Register",
      description: `Draft Risk Register structure for ${businessName}.`,
      category: "Risk Management",
      content: `${contextHeader}

## Risk Register Fields

| Risk | Category | Description | Likelihood | Impact | Rating | Existing Controls | Treatment | Owner | Due Date | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| To be completed |  |  |  |  |  |  |  |  |  |  |

## Assessment-Identified Risks

${formatList(
  risks.map(
    (risk) =>
      `${risk.title} — ${risk.level}: ${risk.description || risk.recommendation || "Review required"}`
  ),
  "No material risks supplied"
)}

## Review Requirements

Risks should be reviewed periodically and after material incidents, business changes, technology changes, or regulatory developments.
`,
    },

    "Business Continuity Plan": {
      slug: `${businessSlug}-business-continuity`,
      title: "Business Continuity Plan",
      description: `Draft Business Continuity Plan for ${businessName}.`,
      category: "Resilience",
      content: `${contextHeader}

## 1. Purpose

This plan establishes how essential business services will continue during disruption.

## 2. Critical Activities

The organization must identify critical services, systems, people, vendors, locations, and information.

## 3. Disruption Scenarios

Planning should address:

- loss of systems or internet;
- cyber incidents;
- vendor outages;
- loss of facilities;
- workforce unavailability;
- data loss;
- utility or communication failures.

## 4. Recovery Priorities

Each critical activity should have an approved recovery priority and acceptable downtime.

## 5. Communications

The plan must identify how employees, customers, vendors, and other stakeholders will be informed.

## 6. Testing

Continuity procedures should be exercised and updated periodically.
`,
    },

    "Disaster Recovery Plan": {
      slug: `${businessSlug}-disaster-recovery`,
      title: "Disaster Recovery Plan",
      description: `Draft Disaster Recovery Plan for ${businessName}.`,
      category: "Resilience",
      content: `${contextHeader}

## 1. Purpose

This plan establishes technical recovery procedures for systems, applications, infrastructure, and data.

## 2. Recovery Inventory

The organization must maintain an inventory of critical systems, owners, dependencies, backup locations, and recovery instructions.

## 3. Recovery Objectives

Recovery-time and recovery-point objectives must be documented for critical systems.

## 4. Backup Requirements

Backups should be protected, monitored, and tested through restoration exercises.

## 5. Recovery Process

The recovery process should include:

- incident authorization;
- system prioritization;
- restoration;
- validation;
- security review;
- return to normal operations.

## 6. Testing

Recovery procedures should be tested periodically and after major system changes.
`,
    },

    "Responsible AI Policy": {
      slug: `${businessSlug}-responsible-ai`,
      title: "Responsible AI Policy",
      description: `Draft Responsible AI Policy for ${businessName}.`,
      category: "Artificial Intelligence",
      content: `${contextHeader}

## 1. Purpose

This policy governs the responsible procurement, development, configuration, and use of artificial-intelligence systems.

## 2. Principles

AI use should support:

- lawful and appropriate purposes;
- privacy and security;
- accuracy and reliability;
- fairness and non-discrimination;
- transparency;
- human oversight;
- accountability.

## 3. Approved Use

AI tools may be used only for approved business purposes and within documented risk limits.

## 4. Restricted Information

Sensitive, confidential, customer, employee, health, financial, or proprietary information must not be entered into AI tools unless the use is specifically approved and protected.

## 5. Human Oversight

Important outputs and decisions must receive meaningful human review.

## 6. Risk Assessment

Higher-impact AI systems must be assessed before use and periodically thereafter.

## 7. Transparency

Customers and affected individuals should receive appropriate notice when AI materially affects their experience or an important decision.

## 8. Inventory

The organization must maintain an inventory of AI systems, owners, purposes, data, vendors, risks, and review dates.

## 9. Incident Reporting

Suspected AI errors, security issues, privacy concerns, or harmful outcomes must be reported and investigated.
`,
    },

    "AI Systems Inventory": {
      slug: `${businessSlug}-ai-inventory`,
      title: "AI Systems Inventory",
      description: `Draft AI Systems Inventory structure for ${businessName}.`,
      category: "Artificial Intelligence",
      content: `${contextHeader}

## AI Inventory Fields

| AI System | Provider | Business Purpose | Owner | Data Used | Important Decisions | Human Review | Risk Rating | Approval Date | Next Review | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| To be completed |  |  |  |  |  |  |  |  |  |  |

## Minimum Review Areas

Each AI system should be reviewed for:

- purpose and necessity;
- personal or confidential information;
- security;
- accuracy;
- bias and fairness;
- human oversight;
- transparency;
- contractual terms;
- data retention;
- incident handling.
`,
    },

    "Password Policy": {
      slug: `${businessSlug}-password-policy`,
      title: "Password Policy",
      description: `Draft Password Policy for ${businessName}.`,
      category: "Security",
      content: `${contextHeader}

## 1. Purpose

This policy establishes password and authentication requirements for systems and accounts used by ${businessName}.

## 2. Scope

This policy applies to employees, contractors, administrators, service accounts, business applications, cloud platforms, and devices.

## 3. Password Requirements

Passwords must:

- be sufficiently long and difficult to guess;
- not be reused across important business accounts;
- not contain easily identifiable personal or business information;
- be changed when compromise is suspected;
- be stored only in approved password-management tools.

## 4. Multi-Factor Authentication

Multi-factor authentication should be enabled for email, administrative, financial, cloud, and other high-risk accounts wherever available.

## 5. Password Sharing

Passwords must not be shared through unsecured channels or stored in plain text.

## 6. Default and Temporary Credentials

Default credentials must be changed before systems are placed into use. Temporary credentials must expire or be replaced promptly.

## 7. Service Accounts

Service-account credentials must be restricted, documented, protected, and reviewed periodically.

## 8. Incident Reporting

Suspected credential compromise must be reported immediately and affected credentials must be reset.

## 9. Review

This policy should be reviewed at least annually and after significant security incidents or system changes.

${approvalSection}
`,
    },

    "Acceptable Use Policy": {
      slug: `${businessSlug}-acceptable-use`,
      title: "Acceptable Use Policy",
      description: `Draft Acceptable Use Policy for ${businessName}.`,
      category: "Security",
      content: `${contextHeader}

## 1. Purpose

This policy establishes acceptable use requirements for business systems, devices, networks, applications, information, and communication tools.

## 2. Scope

This policy applies to employees, contractors, temporary workers, interns, administrators, and other authorized users.

## 3. Authorized Use

Business technology and information must be used for authorized, lawful, ethical, and appropriate business purposes.

## 4. Prohibited Activities

Users must not:

- access information without authorization;
- share credentials or bypass security controls;
- install unapproved software;
- introduce malicious code;
- use business systems for illegal, abusive, discriminatory, or harmful activity;
- disclose confidential information without authorization;
- store business information in unapproved services.

## 5. Email and Communications

Users must exercise care when opening links, sharing information, and communicating on behalf of the organization.

## 6. Devices and Remote Work

Business information must be protected on office, remote, mobile, and personally owned devices approved for business use.

## 7. Artificial Intelligence Tools

Confidential, personal, customer, employee, or proprietary information must not be entered into unapproved AI tools.

## 8. Monitoring

The organization may monitor business systems and activity where lawful and appropriate for security, compliance, support, and operational purposes.

## 9. Violations

Violations may result in access restriction, corrective action, contract consequences, or other appropriate measures.

## 10. Acknowledgement

Relevant users should acknowledge that they have read and understood this policy.

${approvalSection}
`,
    },

    "Accessibility Statement": {
      slug: `${businessSlug}-accessibility`,
      title: "Accessibility Statement",
      description: `Draft Accessibility Statement for ${businessName}.`,
      category: "Accessibility",
      content: `${contextHeader}

## 1. Commitment

${businessName} is committed to improving accessibility and providing services, information, and customer experiences that respect the dignity and independence of people with disabilities.

## 2. Scope

This statement applies to customer service, communications, digital services, employment practices, facilities, and other areas relevant to the organization.

## 3. Accessible Service

The organization will make reasonable efforts to:

- communicate in ways that consider accessibility needs;
- provide accessible formats or communication supports where required;
- welcome assistive devices, support persons, and service animals where applicable;
- respond to accessibility feedback;
- train relevant personnel where required.

## 4. Digital Accessibility

The organization will work toward improving the accessibility of its website, applications, documents, and digital content.

The current accessibility status of ${website} must be reviewed before this statement is published.

## 5. Accommodation

Requests for accommodation will be considered individually and addressed in accordance with applicable requirements.

## 6. Feedback

Accessibility questions, requests, or feedback may be directed to:

${contactEmail}

## 7. Review

This statement should be reviewed when services, technology, facilities, or applicable accessibility requirements change.

${approvalSection}
`,
    },

    "Refund Policy": {
      slug: `${businessSlug}-refund-policy`,
      title: "Refund Policy",
      description: `Draft Refund Policy for ${businessName}.`,
      category: "Legal",
      content: `${contextHeader}

## 1. Purpose

This policy explains how refund, cancellation, credit, and dispute requests are handled by ${businessName}.

## 2. Scope

This policy applies only to the products and services identified by the organization before publication.

## 3. Eligibility

Refund eligibility, time limits, exclusions, and required supporting information must be confirmed based on the organization's actual products, services, contracts, and legal obligations.

## 4. Non-Refundable Items

Any non-refundable products, completed services, deposits, customized work, digital products, or administrative fees must be clearly identified before publication.

## 5. Cancellations

Cancellation deadlines, notice requirements, and applicable fees must be confirmed.

## 6. Processing

Approved refunds should be returned through the original payment method where practical. Processing timelines may depend on payment providers and financial institutions.

## 7. Chargebacks and Disputes

Customers should contact the organization first so concerns can be reviewed before escalating a payment dispute.

## 8. Consumer Rights

Nothing in this policy limits rights that cannot lawfully be excluded.

## 9. Contact

Refund or cancellation questions may be directed to:

${contactEmail}

${approvalSection}
`,
    },
  };

  const aliases = {
    privacy_policy: "Privacy Policy",
    terms: "Terms of Service",
    cookie_policy: "Cookie Policy",
    security_policy: "Information Security Policy",
    password_policy: "Password Policy",
    access_control: "Access Control Policy",
    incident_response: "Incident Response Plan",
    vendor_register: "Vendor Register",
    risk_register: "Risk Register",
    data_retention: "Data Retention and Deletion Policy",
    business_continuity: "Business Continuity Plan",
    disaster_recovery: "Disaster Recovery Plan",
    responsible_ai: "Responsible AI Policy",
    ai_inventory: "AI Systems Inventory",
    accessibility: "Accessibility Statement",
    refund_policy: "Refund Policy",
    acceptable_use: "Acceptable Use Policy",

    "Security Policy": "Information Security Policy",
    "Data Retention Policy": "Data Retention and Deletion Policy",
    "AI Inventory": "AI Systems Inventory",
  };

  const normalizedMissingItems = [
    ...new Set(
      missingItems
        .map((item) => {
          if (typeof item === "string") {
            return aliases[item] || item;
          }

          if (item && typeof item === "object") {
            const candidate =
              item.id || item.name || item.title || "";

            return aliases[candidate] || candidate;
          }

          return "";
        })
        .filter(Boolean)
    ),
  ];

  return normalizedMissingItems
    .filter((item) => templates[item])
    .map((item) => ({
      ...base,
      ...templates[item],
      metadata: {
        business_profile: businessProfile,
        assessment_risks: risks,
        recommendations,
        framework_readiness: frameworkResults,
        confirmed_facts: confirmedFacts,
        unknowns,
        prohibited_claims: prohibitedClaims,
        generated_at: new Date().toISOString(),
        source_assessment_id: assessmentId,
      },
    }));
}