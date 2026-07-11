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

function getMissingEnvironmentVariables() {
  return REQUIRED_ENVIRONMENT_VARIABLES.filter(
    (name) => !String(process.env[name] || "").trim()
  );
}

function getStripe() {
  if (!stripeClient) {
    stripeClient = new Stripe(
      process.env.STRIPE_SECRET_KEY
    );
  }

  return stripeClient;
}

function getSupabaseAdmin() {
  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
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

  if (!email) {
    return undefined;
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email)
    ? email
    : null;
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

    // Keep a plain message for the existing frontend.
    message,

    // Keep structured error information for debugging.
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

  if (!sessionId) {
    return null;
  }

  try {
    const session =
      await stripe.checkout.sessions.retrieve(
        sessionId
      );

    const isReusable =
      session.status === "open" &&
      session.payment_status === "unpaid" &&
      Boolean(session.url);

    return isReusable ? session : null;
  } catch (error) {
    console.warn(
      "Previous Stripe Checkout Session could not be reused:",
      error?.message || error
    );

    return null;
  }
}

/*
|--------------------------------------------------------------------------
| Create Compliance Checkout Session
|--------------------------------------------------------------------------
| POST /api/compliance/payments/create-checkout-session
*/

router.post(
  "/create-checkout-session",
  async (req, res) => {
    const requestStartedAt = Date.now();

    try {
      const missingEnvironmentVariables =
        getMissingEnvironmentVariables();

      if (
        missingEnvironmentVariables.length > 0
      ) {
        console.error(
          "Payment route configuration is incomplete:",
          missingEnvironmentVariables
        );

        return sendError(
          res,
          500,
          "Payment processing is temporarily unavailable.",
          "PAYMENT_CONFIGURATION_ERROR",
          process.env.NODE_ENV === "development"
            ? missingEnvironmentVariables
            : undefined
        );
      }

      const assessmentId = String(
        req.body?.assessmentId || ""
      ).trim();

      const suppliedEmail = normalizeEmail(
        req.body?.customerEmail
      );

      const checkoutAttemptId = String(
        req.body?.checkoutAttemptId || ""
      ).trim();

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

      const {
        data: assessment,
        error: assessmentError,
      } = await supabaseAdmin
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

      if (assessmentError) {
        console.error(
          "Assessment lookup failed:",
          assessmentError
        );

        return sendError(
          res,
          500,
          "The assessment could not be verified.",
          "ASSESSMENT_LOOKUP_FAILED"
        );
      }

      if (!assessment) {
        return sendError(
          res,
          404,
          "Assessment was not found.",
          "ASSESSMENT_NOT_FOUND"
        );
      }

      if (
        String(
          assessment.payment_status
        ).toLowerCase() === "paid"
      ) {
        return res.status(200).json({
          success: true,
          alreadyPaid: true,
          message:
            "This assessment has already been paid.",
          assessmentId: assessment.id,

          // Send the customer to the existing success page.
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

      const assessmentEmail =
        normalizeEmail(
          assessment.business_email
        );

      const customerEmail =
        suppliedEmail ||
        assessmentEmail ||
        undefined;

      /*
       * The frontend can supply checkoutAttemptId so a retry of the
       * same click remains idempotent, while a genuinely new payment
       * attempt can create a fresh Checkout Session.
       */
      const resolvedAttemptId =
        checkoutAttemptId ||
        crypto.randomUUID();

      const session =
        await stripe.checkout.sessions.create(
          {
            mode: "payment",
            submit_type: "pay",
            locale: "auto",
            billing_address_collection: "auto",

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

            /*
             * These routes match App.jsx:
             * /compliance-os/payment-success
             * /compliance-os/assessment
             */
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
                "compliance_assessment",
              assessment_id:
                assessment.id,
              business_name:
                assessment.business_name ||
                "",
              checkout_attempt_id:
                resolvedAttemptId,
            },

            payment_intent_data: {
              metadata: {
                product:
                  "compliance_assessment",
                assessment_id:
                  assessment.id,
                checkout_attempt_id:
                  resolvedAttemptId,
              },
            },
          },
          {
            idempotencyKey:
              `compliance-checkout-${assessment.id}-${resolvedAttemptId}`,
          }
        );

      if (!session.url) {
        console.error(
          "Stripe created a Checkout Session without a URL:",
          session.id
        );

        return sendError(
          res,
          502,
          "Stripe Checkout did not return a payment URL.",
          "CHECKOUT_URL_MISSING"
        );
      }

      const { error: updateError } =
        await supabaseAdmin
          .from(
            "compliance_assessments"
          )
          .update({
            payment_status:
              "checkout_created",

            stripe_checkout_session_id:
              session.id,

            updated_at:
              new Date().toISOString(),
          })
          .eq("id", assessment.id);

      if (updateError) {
        console.error(
          "Unable to save Stripe Checkout Session:",
          updateError
        );

        /*
         * Do not hide the valid Stripe URL from the customer.
         * The webhook can still reconcile the assessment through
         * metadata and client_reference_id.
         */
      }

      console.info(
        "Compliance Checkout Session created",
        {
          assessmentId:
            assessment.id,
          sessionId: session.id,
          durationMs:
            Date.now() -
            requestStartedAt,
        }
      );

      return res.status(201).json({
        success: true,
        reused: false,
        url: session.url,
        sessionId: session.id,
        assessmentId: assessment.id,
        checkoutAttemptId:
          resolvedAttemptId,
      });
    } catch (error) {
      console.error(
        "Stripe Checkout creation failed:",
        {
          message: error?.message,
          type: error?.type,
          code: error?.code,

          stack:
            process.env.NODE_ENV ===
            "development"
              ? error?.stack
              : undefined,
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

        process.env.NODE_ENV ===
          "development"
          ? error?.message
          : undefined
      );
    }
  }
);

export default router;
