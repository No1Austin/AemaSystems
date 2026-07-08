export function buildPolicyDrafts({ form, missingItems }) {
  const today = new Date().toISOString().slice(0, 10);
  const nextReview = new Date();
  nextReview.setMonth(nextReview.getMonth() + 6);

  const base = {
    category: "Compliance",
    version: "1.0",
    status: "Draft",
    owner: form.businessName || "Business Owner",
    effective_date: today,
    last_reviewed: today,
    next_review: nextReview.toISOString().slice(0, 10),
    is_public: false,
  };

  const templates = {
    "Privacy Policy": {
      slug: "privacy",
      title: "Privacy Policy",
      description: `Privacy Policy for ${form.businessName}.`,
      category: "Privacy",
      content: `## 1. Privacy Commitment

${form.businessName} is committed to protecting personal information and handling customer data responsibly.

## 2. Information Collected

We may collect contact information, business information, service requests, website usage information, and information provided through forms or communications.

## 3. How Information Is Used

Information may be used to provide services, respond to inquiries, improve operations, process transactions, and meet legal obligations.

## 4. Security

We use reasonable safeguards appropriate to the nature of our business to protect information.

## 5. Contact

Questions about this Privacy Policy may be directed to the business owner.`,
    },

    "Terms of Service": {
      slug: "terms",
      title: "Terms of Service",
      description: `Terms of Service for ${form.businessName}.`,
      category: "Legal",
      content: `## 1. Acceptance

By using ${form.businessName}'s services, users agree to these Terms.

## 2. Services

${form.businessName} provides business services to customers based on agreed terms.

## 3. User Responsibilities

Users agree to provide accurate information and use services lawfully.

## 4. Limitation of Liability

To the fullest extent permitted by law, ${form.businessName} is not responsible for indirect or consequential losses.

## 5. Contact

Questions about these Terms may be directed to the business owner.`,
    },

    "Cookie Policy": {
      slug: "cookies",
      title: "Cookie Policy",
      description: `Cookie Policy for ${form.businessName}.`,
      category: "Privacy",
      content: `## 1. Cookies

${form.businessName} may use cookies or similar technologies to support website functionality and improve user experience.

## 2. How Cookies Are Used

Cookies may support site navigation, analytics, security, and preferences.

## 3. Managing Cookies

Users may control cookies through browser settings.`,
    },

    "Security Policy": {
      slug: "security",
      title: "Security Policy",
      description: `Security Policy for ${form.businessName}.`,
      category: "Security",
      content: `## 1. Security Commitment

${form.businessName} is committed to protecting business and customer information.

## 2. Security Practices

Security practices may include access controls, password protection, secure systems, trusted vendors, and review of security risks.

## 3. Continuous Improvement

Security is reviewed and improved as the business grows.`,
    },

    "Incident Response Plan": {
      slug: "incident-response",
      title: "Incident Response Plan",
      description: `Incident Response Plan for ${form.businessName}.`,
      category: "Security",
      content: `## 1. Purpose

This plan helps ${form.businessName} respond to security, privacy, or operational incidents.

## 2. Response Steps

Identify the incident.

Contain the issue.

Assess impact.

Notify affected parties where required.

Document what happened.

Improve controls to prevent recurrence.`,
    },

    "Vendor Register": {
      slug: "vendor-register",
      title: "Vendor Register",
      description: `Vendor Register for ${form.businessName}.`,
      category: "Vendor Management",
      content: `## Vendor Register

This register tracks key third-party providers used by ${form.businessName}.

## Suggested Vendors to Track

Payment processors

Website hosting

Email providers

Cloud software

Accounting tools

AI tools

Customer management systems`,
    },

    "Risk Register": {
      slug: "risk-register",
      title: "Risk Register",
      description: `Risk Register for ${form.businessName}.`,
      category: "Risk Management",
      content: `## Risk Register

This register tracks important business, operational, security, privacy, and vendor risks.

## Suggested Risks

Data loss

Website outage

Payment provider failure

Password compromise

Customer complaint

Regulatory changes

Vendor disruption`,
    },
  };

  return missingItems
    .filter((item) => templates[item])
    .map((item) => ({
      ...base,
      ...templates[item],
    }));
}