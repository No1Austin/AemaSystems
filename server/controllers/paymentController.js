import "dotenv/config";
import Stripe from "stripe";

import pool from "../db/pool.js";
import { enhanceBusinessAnalysis } from "../services/ai/aiEnhancer.js";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const CLIENT_URL =
  process.env.CLIENT_URL ||
  "http://localhost:5173";

const IS_PRODUCTION =
  process.env.NODE_ENV === "production";

const plans = {
  blueprint: {
    name: "AEMA Growth Blueprint",
    amount: 999,
    mode: "payment",
  },

  expert: {
    name: "AEMA Growth Blueprint + Expert Session",
    amount: 4900,
    mode: "payment",
  },

  partner: {
    name: "AEMA Business Partner",
    amount: 3000,
    mode: "subscription",
  },
};

const planLabels = {
  blueprint: "AEMA Growth Blueprint",
  expert: "AEMA Blueprint + Expert Session",
  partner: "AEMA Business Partner",
};

function normalizeEmail(email) {
  if (typeof email !== "string") {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();

  return normalizedEmail || null;
}

function isValidPlan(plan) {
  return Object.prototype.hasOwnProperty.call(plans, plan);
}

function isPremiumPlan(plan) {
  return plan === "expert" || plan === "partner";
}

function shouldUseAIEnhancement(plan) {
  return Boolean(
    process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY.startsWith("sk-") &&
      isValidPlan(plan)
  );
}

function isCheckoutSessionPaid(session) {
  if (!session) {
    return false;
  }

  return (
    session.status === "complete" &&
    (
      session.payment_status === "paid" ||
      session.payment_status === "no_payment_required"
    )
  );
}

function getPublicError(error, fallbackMessage) {
  if (IS_PRODUCTION) {
    return {
      success: false,
      message: fallbackMessage,
    };
  }

  return {
    success: false,
    message: fallbackMessage,
    error: error?.message || "Unknown error",
  };
}

function buildPaymentResponse({
  session = {},
  assessmentId,
  plan,
  profile,
  blueprint,
  report,
  expertAnalysis = null,
  preparationNotes = null,
  aiEnhanced = false,
  aiStatus = "disabled",
  founderDemo = false,
}) {
  const paid =
    founderDemo ||
    isCheckoutSessionPaid(session);

  return {
    success: true,
    founderDemo,
    paid,

    mode: founderDemo
      ? "founder_demo"
      : session.mode || null,

    paymentStatus: founderDemo
      ? "founder_demo"
      : session.payment_status || null,

    checkoutStatus: founderDemo
      ? "complete"
      : session.status || null,

    customerEmail:
      session.customer_details?.email ||
      session.customer_email ||
      null,

    amountTotal: session.amount_total || 0,
    currency: session.currency || "cad",

    plan,
    planLabel:
      planLabels[plan] ||
      planLabels.blueprint,

    assessmentId,
    subscriptionId:
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id || null,

    paymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id || null,

    customerId:
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id || null,

    profile,
    blueprint,
    report,
    fullReport: report,

    expertAnalysis,
    preparationNotes,

    aiEnhanced,
    aiStatus,
  };
}

async function createAssessment(profile) {
  const result = await pool.query(
    `
      INSERT INTO assessments (profile)
      VALUES ($1)
      RETURNING id;
    `,
    [profile]
  );

  return result.rows[0].id;
}

async function getAssessment(assessmentId) {
  if (!assessmentId) {
    return null;
  }

  const result = await pool.query(
    `
      SELECT
        id,
        profile,
        blueprint,
        report,
        expert_analysis,
        preparation_notes,
        ai_enhanced
      FROM assessments
      WHERE id = $1
      LIMIT 1;
    `,
    [assessmentId]
  );

  return result.rows[0] || null;
}

async function generateAndSaveReport({
  assessmentId,
  plan,
  profile,
}) {
  if (!isValidPlan(plan)) {
    throw new Error(
      `Cannot generate report for invalid plan: ${plan}`
    );
  }

  const existingAssessment =
    assessmentId
      ? await getAssessment(assessmentId)
      : null;

  if (existingAssessment?.report) {
    return {
      profile:
        existingAssessment.profile ||
        profile ||
        {},

      blueprint:
        existingAssessment.blueprint ||
        null,

      report:
        existingAssessment.report,

      expertAnalysis:
        existingAssessment.expert_analysis ||
        null,

      preparationNotes:
        existingAssessment.preparation_notes ||
        null,

      aiEnhanced:
        existingAssessment.ai_enhanced ||
        false,

      aiStatus: "cached",
    };
  }

  const useAI =
    shouldUseAIEnhancement(plan);

  const analysis =
    await enhanceBusinessAnalysis({
      profile: profile || {},

      includeExpertAnalysis:
        isPremiumPlan(plan),

      includePreparationNotes:
        isPremiumPlan(plan),

      planInfo: {
        priority:
          planLabels[plan] ||
          planLabels.blueprint,

        plan,
      },

      useAI,
    });

  if (assessmentId) {
    await pool.query(
      `
        UPDATE assessments
        SET
          profile = $1,
          blueprint = $2,
          report = $3,
          expert_analysis = $4,
          preparation_notes = $5,
          ai_enhanced = $6,
          updated_at = NOW()
        WHERE id = $7;
      `,
      [
        analysis.profile ||
          profile ||
          {},

        analysis.blueprint || null,
        analysis.report || null,

        analysis.expertAnalysis ||
          null,

        analysis.preparationNotes ||
          null,

        analysis.aiEnhanced || false,
        assessmentId,
      ]
    );
  }

  return {
    ...analysis,

    aiStatus:
      analysis.aiStatus ||
      (
        useAI
          ? "success"
          : "disabled"
      ),
  };
}

async function fulfilCheckoutSession(session) {
  if (!isCheckoutSessionPaid(session)) {
    const error = new Error(
      "Checkout Session payment has not been completed."
    );

    error.status = 402;
    throw error;
  }

  const assessmentId =
    session.metadata?.assessmentId ||
    null;

  const plan =
    session.metadata?.plan ||
    "blueprint";

  if (!assessmentId) {
    throw new Error(
      "Stripe Checkout Session is missing assessmentId metadata."
    );
  }

  if (!isValidPlan(plan)) {
    throw new Error(
      `Stripe Checkout Session contains an invalid plan: ${plan}`
    );
  }

  const assessment =
    await getAssessment(assessmentId);

  if (!assessment) {
    const error = new Error(
      "Assessment connected to this payment was not found."
    );

    error.status = 404;
    throw error;
  }

  if (assessment.report) {
    return {
      assessmentId,
      plan,

      profile:
        assessment.profile || {},

      blueprint:
        assessment.blueprint ||
        null,

      report:
        assessment.report,

      expertAnalysis:
        assessment.expert_analysis ||
        null,

      preparationNotes:
        assessment.preparation_notes ||
        null,

      aiEnhanced:
        assessment.ai_enhanced ||
        false,

      aiStatus: "cached",
    };
  }

  const analysis =
    await generateAndSaveReport({
      assessmentId,
      plan,
      profile:
        assessment.profile || {},
    });

  return {
    assessmentId,
    plan,

    profile:
      analysis.profile ||
      assessment.profile ||
      {},

    blueprint:
      analysis.blueprint || null,

    report:
      analysis.report || null,

    expertAnalysis:
      analysis.expertAnalysis ||
      null,

    preparationNotes:
      analysis.preparationNotes ||
      null,

    aiEnhanced:
      analysis.aiEnhanced ||
      false,

    aiStatus:
      analysis.aiStatus ||
      "success",
  };
}

export async function createCheckoutSession(req, res) {
  try {
    const {
      plan,
      profile,
    } = req.body || {};

    if (!isValidPlan(plan)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan selected.",
      });
    }

    const selectedPlan = plans[plan];

    const safeProfile =
      profile &&
      typeof profile === "object" &&
      !Array.isArray(profile)
        ? profile
        : {};

    const authenticatedEmail =
      normalizeEmail(req.user?.email);

    const founderEmail =
      normalizeEmail(
        process.env.FOUNDER_EMAIL
      );

    const isFounderDemo =
      Boolean(
        authenticatedEmail &&
        founderEmail &&
        authenticatedEmail ===
          founderEmail
      );

    const assessmentId =
      await createAssessment(safeProfile);

    if (isFounderDemo) {
      return res.status(200).json({
        success: true,
        founderDemo: true,
        paid: true,
        plan,
        assessmentId,

        url:
          `${CLIENT_URL}` +
          `/payment-success` +
          `?founder_demo=true` +
          `&assessment_id=${encodeURIComponent(
            assessmentId
          )}` +
          `&plan=${encodeURIComponent(plan)}`,
      });
    }

    const metadata = {
      plan: String(plan),
      assessmentId: String(assessmentId),
    };

    const checkoutParameters = {
      mode: selectedPlan.mode,

      payment_method_types: ["card"],

      allow_promotion_codes: true,

      metadata,

      client_reference_id:
        String(assessmentId),

      line_items: [
        {
          price_data: {
            currency: "cad",

            product_data: {
              name: selectedPlan.name,

              metadata: {
                plan: String(plan),
              },
            },

            unit_amount:
              selectedPlan.amount,

            ...(selectedPlan.mode ===
              "subscription"
              ? {
                  recurring: {
                    interval: "month",
                  },
                }
              : {}),
          },

          quantity: 1,
        },
      ],

      success_url:
        `${CLIENT_URL}` +
        `/payment-success` +
        `?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${CLIENT_URL}/ai` +
        `?checkout=cancelled` +
        `&assessment_id=${encodeURIComponent(
          assessmentId
        )}`,
    };

    if (selectedPlan.mode === "payment") {
      checkoutParameters.payment_intent_data = {
        metadata,
      };
    }

    if (selectedPlan.mode === "subscription") {
      checkoutParameters.subscription_data = {
        metadata,
      };
    }

    const session =
      await stripe.checkout.sessions.create(
        checkoutParameters,
        {
          idempotencyKey:
            `aema-checkout-${assessmentId}`,
        }
      );

    return res.status(201).json({
      success: true,
      url: session.url,
      sessionId: session.id,
      assessmentId,
    });
  } catch (error) {
    console.error("Stripe checkout error:", {
      message: error?.message,
      type: error?.type,
      code: error?.code,
      requestId: error?.requestId,
    });

    return res.status(500).json(
      getPublicError(
        error,
        "Could not create checkout session."
      )
    );
  }
}

export async function verifyCheckoutSession(req, res) {
  try {
    const { sessionId } = req.params;

    if (
      !sessionId ||
      typeof sessionId !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing Stripe session ID.",
      });
    }

    const session =
      await stripe.checkout.sessions.retrieve(
        sessionId,
        {
          expand: [
            "subscription",
            "payment_intent",
          ],
        }
      );

    if (!isCheckoutSessionPaid(session)) {
      return res.status(402).json({
        success: false,
        paid: false,

        message:
          "Payment has not been completed.",

        checkoutStatus:
          session.status || null,

        paymentStatus:
          session.payment_status ||
          null,
      });
    }

    const fulfilment =
      await fulfilCheckoutSession(session);

    return res.status(200).json(
      buildPaymentResponse({
        session,

        assessmentId:
          fulfilment.assessmentId,

        plan: fulfilment.plan,
        profile: fulfilment.profile,
        blueprint: fulfilment.blueprint,
        report: fulfilment.report,

        expertAnalysis:
          fulfilment.expertAnalysis,

        preparationNotes:
          fulfilment.preparationNotes,

        aiEnhanced:
          fulfilment.aiEnhanced,

        aiStatus:
          fulfilment.aiStatus,
      })
    );
  } catch (error) {
    console.error("Stripe verification error:", {
      message: error?.message,
      type: error?.type,
      code: error?.code,
      requestId: error?.requestId,
    });

    const statusCode =
      Number.isInteger(error?.status)
        ? error.status
        : 500;

    return res.status(statusCode).json(
      getPublicError(
        error,
        statusCode === 404
          ? "Payment record was not found."
          : "Could not verify payment."
      )
    );
  }
}

export async function handleStripeWebhook(req, res) {
  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "STRIPE_WEBHOOK_SECRET is missing."
    );

    return res.status(500).json({
      success: false,
      message:
        "Stripe webhook is not configured.",
    });
  }

  const signature =
    req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).json({
      success: false,
      message:
        "Missing Stripe-Signature header.",
    });
  }

  let event;

  try {
    event =
      stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
  } catch (error) {
    console.error(
      "Stripe signature verification failed:",
      error?.message
    );

    return res.status(400).send(
      `Webhook Error: ${
        error?.message ||
        "Invalid signature"
      }`
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session =
          event.data.object;

        if (isCheckoutSessionPaid(session)) {
          await fulfilCheckoutSession(session);
        } else {
          console.log(
            "Checkout completed but payment is pending:",
            session.id,
            session.payment_status
          );
        }

        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session =
          event.data.object;

        await fulfilCheckoutSession(session);

        break;
      }

      case "checkout.session.async_payment_failed": {
        const session =
          event.data.object;

        console.warn(
          "Asynchronous Checkout payment failed:",
          {
            sessionId: session.id,

            assessmentId:
              session.metadata
                ?.assessmentId ||
              null,

            plan:
              session.metadata?.plan ||
              null,
          }
        );

        break;
      }

      case "invoice.paid": {
        const invoice =
          event.data.object;

        console.log(
          "Stripe invoice paid:",
          {
            invoiceId: invoice.id,
            customerId:
              invoice.customer || null,
            subscriptionId:
              invoice.subscription || null,
          }
        );

        break;
      }

      case "invoice.payment_failed": {
        const invoice =
          event.data.object;

        console.warn(
          "Stripe invoice payment failed:",
          {
            invoiceId: invoice.id,
            customerId:
              invoice.customer || null,
            subscriptionId:
              invoice.subscription || null,
          }
        );

        break;
      }

      case "invoice.payment_action_required": {
        const invoice =
          event.data.object;

        console.warn(
          "Stripe invoice requires customer action:",
          {
            invoiceId: invoice.id,
            customerId:
              invoice.customer || null,
            subscriptionId:
              invoice.subscription || null,
          }
        );

        break;
      }

      case "customer.subscription.updated": {
        const subscription =
          event.data.object;

        console.log(
          "Stripe subscription updated:",
          {
            subscriptionId:
              subscription.id,
            status:
              subscription.status,
            customerId:
              subscription.customer,
          }
        );

        break;
      }

      case "customer.subscription.deleted": {
        const subscription =
          event.data.object;

        console.log(
          "Stripe subscription ended:",
          {
            subscriptionId:
              subscription.id,
            customerId:
              subscription.customer,
          }
        );

        break;
      }

      default:
        console.log(
          `Unhandled Stripe event: ${event.type}`
        );
    }

    return res.status(200).json({
      received: true,
      eventId: event.id,
      eventType: event.type,
    });
  } catch (error) {
    console.error(
      "Stripe webhook processing failed:",
      {
        eventId: event?.id || null,
        eventType:
          event?.type || null,
        message: error?.message,
      }
    );

    return res.status(500).json({
      success: false,
      received: false,
      message:
        "Webhook processing failed.",
    });
  }
}

export async function verifyFounderDemo(req, res) {
  try {
    const {
      assessmentId,
      plan = "blueprint",
    } = req.query;

    if (!assessmentId) {
      return res.status(400).json({
        success: false,
        message:
          "Missing assessment ID.",
      });
    }

    if (!isValidPlan(plan)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid plan selected.",
      });
    }

    const authenticatedEmail =
      normalizeEmail(req.user?.email);

    const founderEmail =
      normalizeEmail(
        process.env.FOUNDER_EMAIL
      );

    if (
      !authenticatedEmail ||
      !founderEmail ||
      authenticatedEmail !== founderEmail
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Founder demo access denied.",
      });
    }

    const assessment =
      await getAssessment(assessmentId);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message:
          "Founder demo assessment not found.",
      });
    }

    if (assessment.report) {
      return res.status(200).json(
        buildPaymentResponse({
          assessmentId,
          plan,

          profile:
            assessment.profile || {},

          blueprint:
            assessment.blueprint ||
            null,

          report:
            assessment.report,

          expertAnalysis:
            assessment.expert_analysis ||
            null,

          preparationNotes:
            assessment.preparation_notes ||
            null,

          aiEnhanced:
            assessment.ai_enhanced ||
            false,

          aiStatus: "cached",
          founderDemo: true,
        })
      );
    }

    const analysis =
      await generateAndSaveReport({
        assessmentId,
        plan,

        profile:
          assessment.profile || {},
      });

    return res.status(200).json(
      buildPaymentResponse({
        assessmentId,
        plan,

        profile:
          analysis.profile ||
          assessment.profile ||
          {},

        blueprint:
          analysis.blueprint ||
          null,

        report:
          analysis.report ||
          null,

        expertAnalysis:
          analysis.expertAnalysis ||
          null,

        preparationNotes:
          analysis.preparationNotes ||
          null,

        aiEnhanced:
          analysis.aiEnhanced ||
          false,

        aiStatus: analysis.aiStatus,
        founderDemo: true,
      })
    );
  } catch (error) {
    console.error(
      "Founder demo verification error:",
      error
    );

    return res.status(500).json(
      getPublicError(
        error,
        "Could not verify founder demo."
      )
    );
  }
}
