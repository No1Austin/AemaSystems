import crypto from "node:crypto";
import express from "express";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

let stripeClient;
let supabaseAdminClient;

const REQUIRED_ENVIRONMENT_VARIABLES = [
  "STRIPE_SECRET_KEY",
  "STRIPE_COMPLIANCE_PRICE_ID",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "CLIENT_URL",
];

const PACKAGE_DOCUMENTS = [
  {
    key: "privacy_policy",
    title: "Privacy Policy",
    category: "Privacy",
  },
  {
    key: "terms",
    title: "Terms of Service",
    category: "Legal",
  },
  {
    key: "cookie_policy",
    title: "Cookie Policy",
    category: "Privacy",
  },
  {
    key: "security_policy",
    title: "Information Security Policy",
    category: "Security",
  },
  {
    key: "password_policy",
    title: "Password Policy",
    category: "Security",
  },
  {
    key: "access_control",
    title: "Access Control Policy",
    category: "Security",
  },
  {
    key: "incident_response",
    title: "Incident Response Plan",
    category: "Security",
  },
  {
    key: "vendor_register",
    title: "Vendor Register",
    category: "Vendor Management",
  },
  {
    key: "risk_register",
    title: "Risk Register",
    category: "Risk Management",
  },
  {
    key: "data_retention",
    title: "Data Retention Policy",
    category: "Privacy",
  },
  {
    key: "business_continuity",
    title: "Business Continuity Plan",
    category: "Resilience",
  },
  {
    key: "disaster_recovery",
    title: "Disaster Recovery Plan",
    category: "Resilience",
  },
  {
    key: "responsible_ai",
    title: "Responsible AI Policy",
    category: "AI Governance",
  },
  {
    key: "accessibility",
    title: "Accessibility Statement",
    category: "Accessibility",
  },
  {
    key: "acceptable_use",
    title: "Acceptable Use Policy",
    category: "Security",
  },
  {
    key: "refund_policy",
    title: "Refund Policy",
    category: "Legal",
  },
];

function getMissingEnvironmentVariables({
  includeHosting = false,
} = {}) {
  const required = [...REQUIRED_ENVIRONMENT_VARIABLES];

  if (includeHosting) {
    required.push("STRIPE_HOSTING_PRICE_ID");
  }

  return required.filter(
    (name) => !String(process.env[name] || "").trim()
  );
}

function getStripe() {
  if (!stripeClient) {
    stripeClient = new Stripe(
      String(process.env.STRIPE_SECRET_KEY || "").trim()
    );
  }

  return stripeClient;
}

function getSupabaseAdmin() {
  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(
      String(process.env.SUPABASE_URL || "").trim(),
      String(
        process.env.SUPABASE_SERVICE_ROLE_KEY || ""
      ).trim(),
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );
  }

  return supabaseAdminClient;
}

function normalizeClientUrl(value) {
  return String(value || "")
    .trim()
    .replace(/\/+$/, "");
}

function normalizeEmail(value) {
  const email = String(value || "")
    .trim()
    .toLowerCase();

  if (!email) return undefined;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? email
    : null;
}

function cleanText(value) {
  return String(value ?? "").trim();
}

function slugify(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function sendError(
  res,
  status,
  message,
  code,
  details
) {
  return res.status(status).json({
    success: false,
    message,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  });
}

async function findReusableCheckoutSession(
  stripe,
  assessment
) {
  const sessionId =
    assessment.stripe_checkout_session_id;

  if (!sessionId) return null;

  try {
    const session =
      await stripe.checkout.sessions.retrieve(
        sessionId
      );

    return session.status === "open" &&
      session.payment_status === "unpaid" &&
      session.url
      ? session
      : null;
  } catch (error) {
    console.warn(
      "Previous Checkout Session could not be reused:",
      error?.message || error
    );

    return null;
  }
}

function buildDocumentContent({
  document,
  assessment,
}) {
  const businessName =
    cleanText(assessment.business_name) ||
    "the Business";

  const industry =
    cleanText(assessment.industry) ||
    "general business services";

  const jurisdiction =
    [assessment.province, assessment.country]
      .map(cleanText)
      .filter(Boolean)
      .join(", ") || "Canada";

  const contactEmail =
    cleanText(assessment.business_email) ||
    "the designated business contact";

  const generatedDate =
    new Date().toISOString().slice(0, 10);

  const context = {
    privacy_policy: `## 1. Purpose

This Privacy Policy explains how ${businessName} collects, uses, protects, retains, and discloses personal information in connection with its ${industry} operations.

## 2. Information We May Collect

We may collect contact details, account information, service requests, transaction information, communications, website usage data, and other information reasonably required to deliver our services.

## 3. How Information Is Used

Personal information may be used to provide services, manage customer relationships, process transactions, improve operations, maintain security, satisfy legal obligations, and communicate important updates.

## 4. Safeguards

${businessName} uses administrative, technical, and organizational safeguards appropriate to the sensitivity of the information and the nature of the business.

## 5. Retention

Information is retained only for as long as reasonably necessary for identified business, legal, contractual, or regulatory purposes.

## 6. Access and Correction

Individuals may request access to or correction of their personal information, subject to applicable law in ${jurisdiction}.

## 7. Contact

Privacy questions may be directed to ${contactEmail}.`,

    terms: `## 1. Acceptance

By accessing or using the services of ${businessName}, users agree to these Terms of Service.

## 2. Services

${businessName} provides ${industry} services as described in applicable proposals, service descriptions, invoices, or customer agreements.

## 3. Customer Responsibilities

Customers must provide accurate information, use services lawfully, protect account credentials, and comply with applicable policies.

## 4. Fees and Payment

Fees, billing schedules, taxes, and refund rights are governed by the applicable purchase terms or written agreement.

## 5. Intellectual Property

Unless otherwise agreed, ${businessName} retains ownership of its systems, methods, branding, templates, and proprietary materials.

## 6. Limitation of Liability

To the fullest extent permitted by law, ${businessName} is not liable for indirect, incidental, or consequential loss.

## 7. Contact

Questions about these Terms may be directed to ${contactEmail}.`,

    cookie_policy: `## 1. Overview

${businessName} may use cookies and similar technologies to support website functionality, security, analytics, and user preferences.

## 2. Types of Cookies

Cookies may include essential cookies, preference cookies, analytics cookies, and third-party service cookies.

## 3. Choices

Users may adjust browser settings or available consent controls to manage non-essential cookies.

## 4. Contact

Questions about cookie practices may be directed to ${contactEmail}.`,

    security_policy: `## 1. Purpose

This policy defines the information security expectations of ${businessName}.

## 2. Core Practices

Security practices include access controls, strong authentication, software updates, secure configuration, data protection, vendor oversight, backups, and incident reporting.

## 3. Responsibilities

Personnel and authorized users must protect credentials, follow approved procedures, and promptly report suspected security events.

## 4. Review

Security controls are reviewed as business systems, risks, and regulatory expectations change.`,

    password_policy: `## 1. Requirements

Passwords must be unique, difficult to guess, and not reused across business systems.

## 2. Multi-Factor Authentication

Multi-factor authentication should be enabled for systems containing sensitive, financial, customer, or administrative information.

## 3. Storage and Sharing

Passwords must not be shared through unsecured channels or stored in plain text.

## 4. Compromise

Suspected credential compromise must be reported and remediated immediately.`,

    access_control: `## 1. Principle of Least Privilege

Access is granted only to the systems and information reasonably required for an authorized role.

## 2. Approval

Access requests must be approved by an authorized owner and documented where appropriate.

## 3. Reviews

User access should be reviewed periodically and promptly removed when no longer required.

## 4. Privileged Access

Administrative access must receive stronger safeguards, monitoring, and authentication controls.`,

    incident_response: `## 1. Purpose

This plan supports an organized response to privacy, security, technology, and operational incidents.

## 2. Response Lifecycle

${businessName} will identify, contain, investigate, remediate, recover from, and document incidents.

## 3. Notification

Affected individuals, regulators, customers, insurers, or other parties will be notified when required by law or contract.

## 4. Lessons Learned

After significant incidents, ${businessName} will review causes, response effectiveness, and required control improvements.`,

    vendor_register: `## Vendor Register

${businessName} should record each material vendor, including:

- Vendor name
- Service provided
- Information accessed or processed
- Hosting location
- Contract owner
- Security and privacy review status
- Renewal date
- Business criticality
- Exit or contingency plan

Priority vendors commonly include payment processors, cloud hosting providers, email platforms, CRM systems, accounting tools, booking systems, and AI providers.`,

    risk_register: `## Risk Register

${businessName} should record material risks using:

- Risk title
- Category
- Description
- Likelihood
- Impact
- Overall rating
- Existing controls
- Treatment plan
- Owner
- Review date

Initial risk categories should include privacy, cybersecurity, service availability, vendors, payments, legal obligations, employees, and AI use.`,

    data_retention: `## 1. Purpose

This policy defines how ${businessName} retains and securely disposes of business and personal information.

## 2. Retention Principles

Information is retained only while required for service delivery, legal obligations, dispute management, security, accounting, or legitimate operational needs.

## 3. Disposal

Expired records must be securely deleted, destroyed, anonymized, or otherwise made irrecoverable.

## 4. Holds

Normal deletion may be suspended where records are subject to litigation, investigation, audit, or another preservation obligation.`,

    business_continuity: `## 1. Purpose

This plan helps ${businessName} continue priority services during disruption.

## 2. Critical Operations

The business should identify critical people, systems, vendors, communications, facilities, and customer services.

## 3. Continuity Measures

Measures may include remote-work capability, alternate suppliers, emergency communications, backups, manual workarounds, and delegated authority.

## 4. Testing

Continuity arrangements should be reviewed and tested periodically.`,

    disaster_recovery: `## 1. Purpose

This plan guides restoration of technology and information after a serious outage or loss.

## 2. Recovery Priorities

Systems should be prioritized according to customer impact, legal obligations, business criticality, and recovery dependencies.

## 3. Backups

Backups should be protected, monitored, and tested for successful restoration.

## 4. Recovery Review

After recovery, ${businessName} should document the event, lessons learned, and required improvements.`,

    responsible_ai: `## 1. Purpose

This policy governs responsible use of artificial intelligence by ${businessName}.

## 2. Principles

AI should be used lawfully, transparently, securely, fairly, and with appropriate human oversight.

## 3. Data Protection

Sensitive, confidential, or customer information must not be entered into unapproved AI systems.

## 4. Human Review

Material decisions, customer-facing outputs, and high-impact recommendations require appropriate human review.

## 5. Monitoring

AI systems and vendors should be reviewed for accuracy, security, privacy, bias, reliability, and changing business risk.`,

    accessibility: `## Accessibility Commitment

${businessName} is committed to providing services and information in a manner that respects dignity, independence, integration, and equal opportunity.

## Accessible Communication

Reasonable efforts will be made to provide accessible formats and communication support upon request.

## Feedback

Accessibility feedback or accommodation requests may be directed to ${contactEmail}.`,

    acceptable_use: `## 1. Purpose

This policy defines acceptable use of ${businessName} systems, accounts, devices, data, and technology resources.

## 2. Prohibited Conduct

Users must not engage in unlawful activity, unauthorized access, credential sharing, harassment, malicious software use, security bypass, or misuse of confidential information.

## 3. Monitoring and Enforcement

Business systems may be monitored where lawful and necessary for security, operations, and compliance.`,

    refund_policy: `## 1. Scope

This policy describes refund handling for eligible purchases from ${businessName}.

## 2. Eligibility

Refund eligibility depends on the service purchased, work completed, contractual commitments, and applicable consumer-protection law.

## 3. Requests

Refund requests should include the purchaser's name, transaction details, reason for the request, and relevant supporting information.

## 4. Contact

Refund questions may be directed to ${contactEmail}.`,
  };

  return `${context[document.key] || `## Purpose

This document establishes governance expectations for ${businessName}.

## Scope

It applies to relevant personnel, systems, information, vendors, and business activities.

## Responsibilities

Document owners are responsible for implementation, review, and ongoing improvement.`}

---

Document owner: ${businessName}
Jurisdiction: ${jurisdiction}
Generated: ${generatedDate}
Status: Draft — requires business and legal review before publication.`;
}

async function ensureWorkspace({
  supabaseAdmin,
  assessment,
  customerEmail,
}) {
  const existing = await supabaseAdmin
    .from("compliance_workspaces")
    .select("id, slug")
    .eq("assessment_id", assessment.id)
    .maybeSingle();

  if (existing.error) {
    throw existing.error;
  }

  if (existing.data) {
    return existing.data;
  }

  const baseSlug =
    slugify(assessment.business_name) ||
    `workspace-${assessment.id.slice(0, 8)}`;

  const workspaceRecord = {
    assessment_id: assessment.id,
    business_name:
      cleanText(assessment.business_name) ||
      "Business",
    contact_email:
      normalizeEmail(customerEmail) ||
      normalizeEmail(assessment.business_email) ||
      null,
    slug:
      `${baseSlug}-${assessment.id.slice(0, 6)}`,
    package_access: true,
    hosting_status: "inactive",
    subscription_status: "inactive",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const created = await supabaseAdmin
    .from("compliance_workspaces")
    .insert(workspaceRecord)
    .select("id, slug")
    .single();

  if (created.error) {
    throw created.error;
  }

  return created.data;
}

async function generateAndSaveDocuments({
  supabaseAdmin,
  assessment,
  workspace,
}) {
  const existingDocuments =
    await supabaseAdmin
      .from("compliance_documents")
      .select("document_key")
      .eq("assessment_id", assessment.id);

  if (existingDocuments.error) {
    throw existingDocuments.error;
  }

  const existingKeys = new Set(
    (existingDocuments.data || []).map(
      (item) => item.document_key
    )
  );

  const documentsToInsert =
    PACKAGE_DOCUMENTS
      .filter(
        (document) =>
          !existingKeys.has(document.key)
      )
      .map((document, index) => ({
        workspace_id: workspace.id,
        assessment_id: assessment.id,
        document_key: document.key,
        title: document.title,
        slug: slugify(document.title),
        category: document.category,
        content: buildDocumentContent({
          document,
          assessment,
        }),
        status: "Draft",
        version: "1.0",
        display_order: index + 1,
        is_public: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

  if (documentsToInsert.length > 0) {
    const inserted = await supabaseAdmin
      .from("compliance_documents")
      .insert(documentsToInsert);

    if (inserted.error) {
      throw inserted.error;
    }
  }

  const countResult = await supabaseAdmin
    .from("compliance_documents")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("assessment_id", assessment.id);

  if (countResult.error) {
    throw countResult.error;
  }

  return countResult.count || 0;
}

async function provisionPaidAssessment({
  supabaseAdmin,
  assessmentId,
  session,
}) {
  const assessmentResult =
    await supabaseAdmin
      .from("compliance_assessments")
      .select(
        `
          id,
          business_name,
          business_email,
          industry,
          country,
          province,
          website,
          employee_range,
          answers,
          missing_items,
          recommendations,
          risks,
          framework_readiness,
          document_context,
          payment_status,
          documents_generated,
          stripe_checkout_session_id
        `
      )
      .eq("id", assessmentId)
      .maybeSingle();

  if (assessmentResult.error) {
    throw assessmentResult.error;
  }

  if (!assessmentResult.data) {
    throw new Error(
      "The paid assessment could not be found."
    );
  }

  let assessment = assessmentResult.data;

  const paidUpdate = await supabaseAdmin
    .from("compliance_assessments")
    .update({
      payment_status: "paid",
      stripe_checkout_session_id: session.id,
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", assessmentId)
    .select("*")
    .single();

  if (paidUpdate.error) {
    throw paidUpdate.error;
  }

  assessment = paidUpdate.data;

  if (assessment.documents_generated) {
    const existingWorkspace =
      await ensureWorkspace({
        supabaseAdmin,
        assessment,
        customerEmail:
          session.customer_details?.email ||
          session.customer_email,
      });

    return {
      assessment,
      workspace: existingWorkspace,
      documentCount: null,
      alreadyProvisioned: true,
    };
  }

  const workspace = await ensureWorkspace({
    supabaseAdmin,
    assessment,
    customerEmail:
      session.customer_details?.email ||
      session.customer_email,
  });

  const documentCount =
    await generateAndSaveDocuments({
      supabaseAdmin,
      assessment,
      workspace,
    });

  const generatedUpdate =
    await supabaseAdmin
      .from("compliance_assessments")
      .update({
        documents_generated: true,
        documents_generated_at:
          new Date().toISOString(),
        workspace_id: workspace.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", assessmentId)
      .select(
        `
          id,
          payment_status,
          documents_generated,
          workspace_id
        `
      )
      .single();

  if (generatedUpdate.error) {
    throw generatedUpdate.error;
  }

  return {
    assessment: {
      ...assessment,
      ...generatedUpdate.data,
    },
    workspace,
    documentCount,
    alreadyProvisioned: false,
  };
}

/*
|--------------------------------------------------------------------------
| One-Time Compliance Package Checkout
|--------------------------------------------------------------------------
*/

router.post(
  "/create-checkout-session",
  async (req, res) => {
    const requestStartedAt = Date.now();

    try {
      const missing =
        getMissingEnvironmentVariables();

      if (missing.length > 0) {
        return sendError(
          res,
          500,
          "Payment processing is temporarily unavailable.",
          "PAYMENT_CONFIGURATION_ERROR",
          process.env.NODE_ENV === "development"
            ? missing
            : undefined
        );
      }

      const assessmentId = cleanText(
        req.body?.assessmentId
      );

      const suppliedEmail = normalizeEmail(
        req.body?.customerEmail
      );

      const checkoutAttemptId = cleanText(
        req.body?.checkoutAttemptId
      );

      if (!assessmentId) {
        return sendError(
          res,
          400,
          "Assessment ID is required.",
          "ASSESSMENT_ID_REQUIRED"
        );
      }

      if (suppliedEmail === null) {
        return sendError(
          res,
          400,
          "Enter a valid customer email address.",
          "INVALID_CUSTOMER_EMAIL"
        );
      }

      const stripe = getStripe();
      const supabaseAdmin =
        getSupabaseAdmin();

      const clientUrl = normalizeClientUrl(
        process.env.CLIENT_URL
      );

      const assessmentResult =
        await supabaseAdmin
          .from("compliance_assessments")
          .select(
            `
              id,
              business_name,
              business_email,
              payment_status,
              stripe_checkout_session_id,
              documents_generated
            `
          )
          .eq("id", assessmentId)
          .maybeSingle();

      if (assessmentResult.error) {
        console.error(
          "Assessment lookup failed:",
          assessmentResult.error
        );

        return sendError(
          res,
          500,
          "The assessment could not be verified.",
          "ASSESSMENT_LOOKUP_FAILED"
        );
      }

      const assessment =
        assessmentResult.data;

      if (!assessment) {
        return sendError(
          res,
          404,
          "Assessment was not found.",
          "ASSESSMENT_NOT_FOUND"
        );
      }

      if (
        cleanText(
          assessment.payment_status
        ).toLowerCase() === "paid"
      ) {
        return res.status(200).json({
          success: true,
          alreadyPaid: true,
          assessmentId: assessment.id,
          redirectUrl:
            `${clientUrl}/compliance-os/payment-success` +
            `?assessment_id=${encodeURIComponent(
              assessment.id
            )}`,
        });
      }

      const reusableSession =
        await findReusableCheckoutSession(
          stripe,
          assessment
        );

      if (reusableSession) {
        return res.status(200).json({
          success: true,
          reused: true,
          url: reusableSession.url,
          sessionId: reusableSession.id,
          assessmentId: assessment.id,
        });
      }

      const customerEmail =
        suppliedEmail ||
        normalizeEmail(
          assessment.business_email
        );

      const resolvedAttemptId =
        checkoutAttemptId ||
        crypto.randomUUID();

      const session =
        await stripe.checkout.sessions.create(
          {
            mode: "payment",
            submit_type: "pay",
            locale: "auto",
            billing_address_collection:
              "auto",
            line_items: [
              {
                price:
                  process.env
                    .STRIPE_COMPLIANCE_PRICE_ID,
                quantity: 1,
              },
            ],
            ...(customerEmail
              ? {
                  customer_email:
                    customerEmail,
                }
              : {}),
            success_url:
              `${clientUrl}/compliance-os/payment-success` +
              "?session_id={CHECKOUT_SESSION_ID}",
            cancel_url:
              `${clientUrl}/compliance-os/assessment` +
              `?assessment_id=${encodeURIComponent(
                assessment.id
              )}` +
              "&payment=cancelled",
            client_reference_id:
              assessment.id,
            metadata: {
              product:
                "compliance_package",
              assessment_id:
                assessment.id,
              business_name:
                assessment.business_name || "",
              checkout_attempt_id:
                resolvedAttemptId,
            },
            payment_intent_data: {
              metadata: {
                product:
                  "compliance_package",
                assessment_id:
                  assessment.id,
                checkout_attempt_id:
                  resolvedAttemptId,
              },
            },
          },
          {
            idempotencyKey:
              `compliance-package-${assessment.id}-${resolvedAttemptId}`,
          }
        );

      if (!session.url) {
        return sendError(
          res,
          502,
          "Stripe Checkout did not return a payment URL.",
          "CHECKOUT_URL_MISSING"
        );
      }

      const updateResult =
        await supabaseAdmin
          .from("compliance_assessments")
          .update({
            payment_status:
              "checkout_created",
            stripe_checkout_session_id:
              session.id,
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", assessment.id);

      if (updateResult.error) {
        console.error(
          "Unable to save Checkout Session:",
          updateResult.error
        );
      }

      return res.status(201).json({
        success: true,
        reused: false,
        url: session.url,
        sessionId: session.id,
        assessmentId: assessment.id,
        checkoutAttemptId:
          resolvedAttemptId,
        durationMs:
          Date.now() - requestStartedAt,
      });
    } catch (error) {
      console.error(
        "Compliance Checkout creation failed:",
        {
          message: error?.message,
          type: error?.type,
          code: error?.code,
        }
      );

      const isStripeError =
        typeof error?.type === "string" &&
        error.type.startsWith("Stripe");

      return sendError(
        res,
        isStripeError ? 502 : 500,
        isStripeError
          ? "Stripe could not start the checkout session."
          : "Unable to start checkout right now.",
        isStripeError
          ? "STRIPE_CHECKOUT_FAILED"
          : "CHECKOUT_CREATION_FAILED",
        process.env.NODE_ENV === "development"
          ? error?.message
          : undefined
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Verify Payment and Provision the Package
|--------------------------------------------------------------------------
*/

router.get(
  "/session/:sessionId",
  async (req, res) => {
    try {
      const missing =
        getMissingEnvironmentVariables();

      if (missing.length > 0) {
        return sendError(
          res,
          500,
          "Payment verification is temporarily unavailable.",
          "PAYMENT_CONFIGURATION_ERROR",
          process.env.NODE_ENV === "development"
            ? missing
            : undefined
        );
      }

      const sessionId = cleanText(
        req.params?.sessionId
      );

      if (!sessionId) {
        return sendError(
          res,
          400,
          "Stripe session ID is required.",
          "SESSION_ID_REQUIRED"
        );
      }

      const stripe = getStripe();
      const supabaseAdmin =
        getSupabaseAdmin();

      const session =
        await stripe.checkout.sessions.retrieve(
          sessionId,
          {
            expand: [
              "payment_intent",
              "subscription",
            ],
          }
        );

      const assessmentId = cleanText(
        session.client_reference_id ||
          session.metadata?.assessment_id
      );

      const stripePaid =
        session.payment_status === "paid";

      if (!assessmentId) {
        return sendError(
          res,
          400,
          "The payment session is not linked to an assessment.",
          "ASSESSMENT_REFERENCE_MISSING"
        );
      }

      if (!stripePaid) {
        return res.status(200).json({
          success: true,
          assessmentId,
          paid: false,
          paymentStatus:
            session.payment_status ||
            "pending",
          stripePaymentStatus:
            session.payment_status ||
            "pending",
          checkoutStatus:
            session.status || "unknown",
          documentsGenerated: false,
          workspaceId: null,
          workspaceSlug: null,
          sessionId: session.id,
        });
      }

      const provisioned =
        await provisionPaidAssessment({
          supabaseAdmin,
          assessmentId,
          session,
        });

      return res.status(200).json({
        success: true,
        assessmentId,
        paid: true,
        paymentStatus: "paid",
        stripePaymentStatus:
          session.payment_status,
        checkoutStatus:
          session.status || "complete",
        documentsGenerated: Boolean(
          provisioned.assessment
            .documents_generated
        ),
        documentCount:
          provisioned.documentCount,
        workspaceId:
          provisioned.workspace.id,
        workspaceSlug:
          provisioned.workspace.slug,
        alreadyProvisioned:
          provisioned.alreadyProvisioned,
        customerEmail:
          session.customer_details?.email ||
          session.customer_email ||
          null,
        mode: session.mode,
        sessionId: session.id,
      });
    } catch (error) {
      console.error(
        "Payment verification or package provisioning failed:",
        {
          message: error?.message,
          code: error?.code,
          details: error?.details,
          hint: error?.hint,
          type: error?.type,
        }
      );

      const isStripeError =
        typeof error?.type === "string" &&
        error.type.startsWith("Stripe");

      return sendError(
        res,
        isStripeError ? 400 : 500,
        isStripeError
          ? "The Stripe payment session could not be verified."
          : "Payment was confirmed, but the compliance package could not be prepared.",
        isStripeError
          ? "STRIPE_SESSION_VERIFICATION_FAILED"
          : "PACKAGE_PROVISIONING_FAILED",
        process.env.NODE_ENV === "development"
          ? error?.message
          : undefined
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Compliance OS Pro Hosting Subscription
|--------------------------------------------------------------------------
*/

router.post(
  "/create-hosting-checkout-session",
  async (req, res) => {
    try {
      const missing =
        getMissingEnvironmentVariables({
          includeHosting: true,
        });

      if (missing.length > 0) {
        return sendError(
          res,
          500,
          "Hosting subscription configuration is incomplete.",
          "HOSTING_CONFIGURATION_ERROR",
          process.env.NODE_ENV === "development"
            ? missing
            : undefined
        );
      }

      const workspaceId = cleanText(
        req.body?.workspaceId
      );

      const suppliedEmail = normalizeEmail(
        req.body?.customerEmail
      );

      if (!workspaceId) {
        return sendError(
          res,
          400,
          "Workspace ID is required.",
          "WORKSPACE_ID_REQUIRED"
        );
      }

      if (suppliedEmail === null) {
        return sendError(
          res,
          400,
          "Enter a valid customer email address.",
          "INVALID_CUSTOMER_EMAIL"
        );
      }

      const stripe = getStripe();
      const supabaseAdmin =
        getSupabaseAdmin();

      const clientUrl = normalizeClientUrl(
        process.env.CLIENT_URL
      );

      const workspaceResult =
        await supabaseAdmin
          .from("compliance_workspaces")
          .select(
            `
              id,
              business_name,
              contact_email,
              hosting_status,
              stripe_customer_id,
              stripe_subscription_id
            `
          )
          .eq("id", workspaceId)
          .maybeSingle();

      if (workspaceResult.error) {
        throw workspaceResult.error;
      }

      const workspace =
        workspaceResult.data;

      if (!workspace) {
        return sendError(
          res,
          404,
          "Compliance workspace was not found.",
          "WORKSPACE_NOT_FOUND"
        );
      }

      const customerEmail =
        suppliedEmail ||
        normalizeEmail(
          workspace.contact_email
        );

      const session =
        await stripe.checkout.sessions.create({
          mode: "subscription",
          line_items: [
            {
              price:
                process.env
                  .STRIPE_HOSTING_PRICE_ID,
              quantity: 1,
            },
          ],
          ...(workspace.stripe_customer_id
            ? {
                customer:
                  workspace.stripe_customer_id,
              }
            : customerEmail
              ? {
                  customer_email:
                    customerEmail,
                }
              : {}),
          success_url:
            `${clientUrl}/compliance-dashboard/billing` +
            "?hosting=success&session_id={CHECKOUT_SESSION_ID}",
          cancel_url:
            `${clientUrl}/compliance-dashboard/billing` +
            "?hosting=cancelled",
          client_reference_id:
            workspace.id,
          metadata: {
            product:
              "compliance_os_pro",
            workspace_id:
              workspace.id,
          },
          subscription_data: {
            metadata: {
              product:
                "compliance_os_pro",
              workspace_id:
                workspace.id,
            },
          },
        });

      return res.status(201).json({
        success: true,
        url: session.url,
        sessionId: session.id,
        workspaceId: workspace.id,
      });
    } catch (error) {
      console.error(
        "Hosting Checkout creation failed:",
        {
          message: error?.message,
          type: error?.type,
          code: error?.code,
        }
      );

      return sendError(
        res,
        500,
        "Unable to start the hosting subscription.",
        "HOSTING_CHECKOUT_FAILED",
        process.env.NODE_ENV === "development"
          ? error?.message
          : undefined
      );
    }
  }
);

router.get(
  "/hosting/session/:sessionId",
  async (req, res) => {
    try {
      const sessionId = cleanText(
        req.params?.sessionId
      );

      const stripe = getStripe();
      const supabaseAdmin =
        getSupabaseAdmin();

      const session =
        await stripe.checkout.sessions.retrieve(
          sessionId,
          {
            expand: [
              "subscription",
              "customer",
            ],
          }
        );

      const workspaceId = cleanText(
        session.client_reference_id ||
          session.metadata?.workspace_id
      );

      if (!workspaceId) {
        return sendError(
          res,
          400,
          "The hosting session is not linked to a workspace.",
          "WORKSPACE_REFERENCE_MISSING"
        );
      }

      const subscription =
        session.subscription;

      const subscriptionId =
        typeof subscription === "string"
          ? subscription
          : subscription?.id || null;

      const subscriptionStatus =
        typeof subscription === "object"
          ? subscription?.status
          : session.payment_status === "paid"
            ? "active"
            : "incomplete";

      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id || null;

      const hostingActive = [
        "active",
        "trialing",
      ].includes(subscriptionStatus);

      const updateResult =
        await supabaseAdmin
          .from("compliance_workspaces")
          .update({
            hosting_status:
              hostingActive
                ? "active"
                : subscriptionStatus,
            subscription_status:
              subscriptionStatus,
            stripe_customer_id:
              customerId,
            stripe_subscription_id:
              subscriptionId,
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", workspaceId)
          .select(
            `
              id,
              slug,
              hosting_status,
              subscription_status
            `
          )
          .single();

      if (updateResult.error) {
        throw updateResult.error;
      }

      return res.status(200).json({
        success: true,
        workspaceId,
        workspaceSlug:
          updateResult.data.slug,
        hostingActive,
        hostingStatus:
          updateResult.data.hosting_status,
        subscriptionStatus:
          updateResult.data
            .subscription_status,
        subscriptionId,
        customerId,
      });
    } catch (error) {
      console.error(
        "Hosting verification failed:",
        error
      );

      return sendError(
        res,
        500,
        "Unable to verify the hosting subscription.",
        "HOSTING_VERIFICATION_FAILED",
        process.env.NODE_ENV === "development"
          ? error?.message
          : undefined
      );
    }
  }
);

export default router;
