import express from "express";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

let stripeClient;
let supabaseAdminClient;

function getStripe() {
  if (!stripeClient) {
    const secretKey = String(
      process.env.STRIPE_SECRET_KEY || ""
    ).trim();

    if (!secretKey) {
      throw new Error(
        "STRIPE_SECRET_KEY is not configured."
      );
    }

    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
}

function getSupabaseAdmin() {
  if (!supabaseAdminClient) {
    const url = String(
      process.env.SUPABASE_URL || ""
    ).trim();

    const serviceRoleKey = String(
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    ).trim();

    if (!url || !serviceRoleKey) {
      throw new Error(
        "Supabase server configuration is incomplete."
      );
    }

    supabaseAdminClient = createClient(
      url,
      serviceRoleKey,
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

function cleanText(value) {
  return String(value ?? "").trim();
}

function normalizeClientUrl(value) {
  return cleanText(value).replace(/\/+$/, "");
}

function normalizeEmail(value) {
  const email = cleanText(value).toLowerCase();

  if (!email) {
    return undefined;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
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
    message,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  });
}

async function findAssessmentAndWorkspace({
  assessmentId,
  workspaceId,
}) {
  const supabaseAdmin = getSupabaseAdmin();

  let assessment = null;
  let workspace = null;

  if (workspaceId) {
    const {
      data,
      error,
    } = await supabaseAdmin
      .from("compliance_workspaces")
      .select(
        `
          id,
          assessment_id,
          business_name,
          contact_email,
          slug,
          package_access,
          hosting_status,
          subscription_status,
          stripe_customer_id,
          stripe_subscription_id
        `
      )
      .eq("id", workspaceId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    workspace = data;
  }

  const resolvedAssessmentId =
    assessmentId ||
    workspace?.assessment_id ||
    "";

  if (resolvedAssessmentId) {
    const {
      data,
      error,
    } = await supabaseAdmin
      .from("compliance_assessments")
      .select(
        `
          id,
          business_name,
          business_email,
          payment_status,
          documents_generated,
          workspace_id
        `
      )
      .eq("id", resolvedAssessmentId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    assessment = data;
  }

  if (!workspace && assessment?.workspace_id) {
    const {
      data,
      error,
    } = await supabaseAdmin
      .from("compliance_workspaces")
      .select(
        `
          id,
          assessment_id,
          business_name,
          contact_email,
          slug,
          package_access,
          hosting_status,
          subscription_status,
          stripe_customer_id,
          stripe_subscription_id
        `
      )
      .eq("id", assessment.workspace_id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    workspace = data;
  }

  return {
    assessment,
    workspace,
  };
}

/*
|--------------------------------------------------------------------------
| Create Hosting Subscription Checkout
|--------------------------------------------------------------------------
| Mounted URL:
| POST /api/compliance/hosting/create-checkout-session
|
| Accepts either:
| {
|   "assessmentId": "...",
|   "customerEmail": "..."
| }
|
| or:
| {
|   "workspaceId": "...",
|   "customerEmail": "..."
| }
*/

router.post(
  "/create-checkout-session",
  async (req, res) => {
    try {
      const assessmentId = cleanText(
        req.body?.assessmentId
      );

      const workspaceId = cleanText(
        req.body?.workspaceId
      );

      const suppliedEmail = normalizeEmail(
        req.body?.customerEmail
      );

      if (!assessmentId && !workspaceId) {
        return sendError(
          res,
          400,
          "assessmentId or workspaceId is required.",
          "HOSTING_REFERENCE_REQUIRED"
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

      const hostingPriceId = cleanText(
        process.env
          .STRIPE_COMPLIANCE_HOSTING_PRICE_ID
      );

      if (!hostingPriceId) {
        return sendError(
          res,
          500,
          "The hosting subscription price is not configured.",
          "HOSTING_PRICE_NOT_CONFIGURED"
        );
      }

      const clientUrl = normalizeClientUrl(
        process.env.CLIENT_URL ||
          "http://localhost:5173"
      );

      const {
        assessment,
        workspace,
      } = await findAssessmentAndWorkspace({
        assessmentId,
        workspaceId,
      });

      if (!assessment) {
        return sendError(
          res,
          404,
          "Compliance assessment was not found.",
          "ASSESSMENT_NOT_FOUND"
        );
      }

      if (!assessment.documents_generated) {
        return sendError(
          res,
          409,
          "Documents must be generated before hosting can be activated.",
          "DOCUMENTS_NOT_READY"
        );
      }

      if (!workspace) {
        return sendError(
          res,
          409,
          "The compliance workspace has not been created yet.",
          "WORKSPACE_NOT_READY"
        );
      }

      const email =
        suppliedEmail ||
        normalizeEmail(workspace.contact_email) ||
        normalizeEmail(
          assessment.business_email
        );

      const stripe = getStripe();

      const session =
        await stripe.checkout.sessions.create({
          mode: "subscription",

          payment_method_collection:
            "always",

          line_items: [
            {
              price: hostingPriceId,
              quantity: 1,
            },
          ],

          ...(workspace.stripe_customer_id
            ? {
                customer:
                  workspace.stripe_customer_id,
              }
            : email
              ? {
                  customer_email: email,
                }
              : {}),

          subscription_data: {
            trial_period_days: 30,

            metadata: {
              assessmentId:
                assessment.id,

              workspaceId:
                workspace.id,

              product:
                "compliance_os_hosting",
            },
          },

          metadata: {
            assessmentId:
              assessment.id,

            workspaceId:
              workspace.id,

            product:
              "compliance_os_hosting",
          },

          client_reference_id:
            workspace.id,

          allow_promotion_codes: true,

          success_url:
            `${clientUrl}/compliance-dashboard/hosting-success` +
            "?session_id={CHECKOUT_SESSION_ID}",

          cancel_url:
            `${clientUrl}/compliance-os/payment-success` +
            `?assessment_id=${encodeURIComponent(
              assessment.id
            )}`,
        });

      if (!session.url) {
        return sendError(
          res,
          502,
          "Stripe did not return a hosting Checkout URL.",
          "HOSTING_CHECKOUT_URL_MISSING"
        );
      }

      return res.status(201).json({
        success: true,
        url: session.url,
        sessionId: session.id,
        assessmentId: assessment.id,
        workspaceId: workspace.id,
      });
    } catch (error) {
      console.error(
        "Create compliance hosting checkout session failed:",
        {
          message: error?.message,
          type: error?.type,
          code: error?.code,
          details: error?.details,
          hint: error?.hint,
        }
      );

      const isStripeError =
        typeof error?.type === "string" &&
        error.type.startsWith("Stripe");

      return sendError(
        res,
        isStripeError ? 502 : 500,
        isStripeError
          ? "Stripe could not start the hosting subscription."
          : "Unable to create the hosting checkout session.",
        isStripeError
          ? "STRIPE_HOSTING_CHECKOUT_FAILED"
          : "HOSTING_CHECKOUT_FAILED",
        process.env.NODE_ENV ===
          "development"
          ? error?.message
          : undefined
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Verify Hosting Checkout Session
|--------------------------------------------------------------------------
| Mounted URL:
| GET /api/compliance/hosting/session/:sessionId
*/

router.get(
  "/session/:sessionId",
  async (req, res) => {
    try {
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
              "subscription",
              "customer",
            ],
          }
        );

      const workspaceId = cleanText(
        session.metadata?.workspaceId ||
          session.client_reference_id
      );

      const assessmentId = cleanText(
        session.metadata?.assessmentId
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

      const {
        data: workspace,
        error: updateError,
      } = await supabaseAdmin
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
            assessment_id,
            business_name,
            contact_email,
            slug,
            package_access,
            hosting_status,
            subscription_status,
            stripe_customer_id,
            stripe_subscription_id,
            logo_url,
            primary_color,
            accent_color,
            appearance,
            headline,
            description,
            business_website,
            is_published,
            published_at
          `
        )
        .single();

      if (updateError) {
        throw updateError;
      }

      return res.status(200).json({
        success: true,

        assessmentId:
          assessmentId ||
          workspace.assessment_id,

        workspaceId:
          workspace.id,

        workspaceSlug:
          workspace.slug,

        businessName:
          workspace.business_name,

        hostingActive,

        hostingStatus:
          workspace.hosting_status,

        subscriptionStatus:
          workspace.subscription_status,

        subscriptionId,

        customerId,

        workspace,
      });
    } catch (error) {
      console.error(
        "Compliance hosting verification failed:",
        {
          message: error?.message,
          type: error?.type,
          code: error?.code,
          details: error?.details,
          hint: error?.hint,
        }
      );

      const isStripeError =
        typeof error?.type === "string" &&
        error.type.startsWith("Stripe");

      return sendError(
        res,
        isStripeError ? 400 : 500,
        isStripeError
          ? "The Stripe hosting session could not be verified."
          : "Unable to verify the hosting subscription.",
        isStripeError
          ? "STRIPE_HOSTING_VERIFICATION_FAILED"
          : "HOSTING_VERIFICATION_FAILED",
        process.env.NODE_ENV ===
          "development"
          ? error?.message
          : undefined
      );
    }
  }
);

export default router;
