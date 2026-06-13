import Stripe from "stripe";
import pool from "../db/pool.js";
import { generateFullReport } from "../services/fullReportGenerator.js";
import { generateBlueprint } from "../services/blueprintGenerator.js";
import { auditWebsite } from "../services/websiteAuditService.js";
import { getIndustryInsights } from "../services/industryInsightsService.js";
import { detectBusinessPatterns } from "../services/patternEngine.js";
import { calculateGrowthScoreDetails } from "../services/blueprintScoringService.js";
import { generateExpertAnalysis } from "../services/expertAnalysisService.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

export const createCheckoutSession = async (req, res) => {
  try {
    const { plan, profile } = req.body;

    const selectedPlan = plans[plan];

    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan selected.",
      });
    }

    const safeProfile = profile || {};

    const assessmentResult = await pool.query(
      `
      INSERT INTO assessments (profile)
      VALUES ($1)
      RETURNING id;
      `,
      [safeProfile]
    );

    const assessmentId = assessmentResult.rows[0].id;

    const session = await stripe.checkout.sessions.create({
      mode: selectedPlan.mode,
      payment_method_types: ["card"],

      metadata: {
        plan,
        assessmentId,
      },

      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: selectedPlan.name,
            },
            unit_amount: selectedPlan.amount,

            ...(selectedPlan.mode === "subscription" && {
              recurring: {
                interval: "month",
              },
            }),
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/ai`,
    });

    return res.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not create checkout session.",
      error: error.message,
    });
  }
};

export const verifyCheckoutSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const assessmentId = session.metadata?.assessmentId;
    const plan = session.metadata?.plan;

    let profile = {};

    if (assessmentId) {
      const assessmentResult = await pool.query(
        `
        SELECT profile
        FROM assessments
        WHERE id = $1
        LIMIT 1;
        `,
        [assessmentId]
      );

      if (assessmentResult.rows.length > 0) {
        profile = assessmentResult.rows[0].profile || {};
      }
    }

    let websiteAudit = null;

    if (profile.websiteStatus === "Has Website" && profile.websiteUrl) {
      websiteAudit = await auditWebsite(profile.websiteUrl);
    }

    const enrichedProfile = {
      ...profile,
      websiteAudit,
    };

    const blueprint = generateBlueprint(enrichedProfile);
    let fullReport = generateFullReport(enrichedProfile, blueprint);

    let expertAnalysis = null;

    if (plan === "expert" || plan === "partner") {
      const industryInsights = getIndustryInsights(enrichedProfile);
      const businessPatterns = detectBusinessPatterns(enrichedProfile);
      const scoring = calculateGrowthScoreDetails(enrichedProfile);

      expertAnalysis = generateExpertAnalysis({
        profile: enrichedProfile,
        blueprint,
        websiteAudit,
        industryInsights,
        businessPatterns,
        scoring,
      });

      fullReport.expertAnalysis = expertAnalysis;
    }

    return res.json({
      success: true,
      paid: session.payment_status === "paid",
      mode: session.mode,

      customerEmail: session.customer_details?.email || null,
      amountTotal: session.amount_total,
      currency: session.currency,
      plan,
      planLabel: planLabels[plan] || "AEMA Growth Blueprint",
      assessmentId,
      subscriptionId: session.subscription || null,
      customerId: session.customer || null,
      fullReport,
    });
  } catch (error) {
    console.error("Stripe verify error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not verify payment.",
      error: error.message,
    });
  }
};