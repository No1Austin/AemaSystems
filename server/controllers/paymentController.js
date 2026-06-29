import Stripe from "stripe";
import pool from "../db/pool.js";
import { enhanceBusinessAnalysis } from "../services/ai/aiEnhancer.js";

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

const isPremiumPlan = (plan) => plan === "expert" || plan === "partner";

const shouldUseAIEnhancement = (plan) => {
  return Boolean(
    process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY.startsWith("sk-") &&
      ["blueprint", "expert", "partner"].includes(plan)
  );
};

const buildPaymentResponse = ({
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
}) => ({
  success: true,
  founderDemo,
  paid: founderDemo || session.payment_status === "paid",
  mode: founderDemo ? "founder_demo" : session.mode,

  customerEmail: session.customer_details?.email || null,
  amountTotal: session.amount_total || 0,
  currency: session.currency || "cad",

  plan,
  planLabel: planLabels[plan] || "AEMA Growth Blueprint",

  assessmentId,
  subscriptionId: session.subscription || null,
  customerId: session.customer || null,

  profile,
  blueprint,
  report,
  fullReport: report,

  expertAnalysis,
  preparationNotes,

  aiEnhanced,
  aiStatus,
});

const generateAndSaveReport = async ({ assessmentId, plan, profile }) => {
  const useAI = shouldUseAIEnhancement(plan);

  const analysis = await enhanceBusinessAnalysis({
    profile,
    includeExpertAnalysis: isPremiumPlan(plan),
    includePreparationNotes: isPremiumPlan(plan),
    planInfo: {
      priority: planLabels[plan] || "AEMA Growth Blueprint",
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
        analysis.profile || profile,
        analysis.blueprint || null,
        analysis.report || null,
        analysis.expertAnalysis || null,
        analysis.preparationNotes || null,
        analysis.aiEnhanced || false,
        assessmentId,
      ]
    );
  }

  return {
    ...analysis,
    aiStatus: analysis.aiStatus || (useAI ? "success" : "disabled"),
  };
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

    const userEmail =
      req.user?.email ||
      req.body?.email ||
      safeProfile?.email ||
      safeProfile?.contactEmail ||
      null;

    const isFounderDemo =
      userEmail &&
      process.env.FOUNDER_EMAIL &&
      userEmail.toLowerCase() === process.env.FOUNDER_EMAIL.toLowerCase();

    const assessmentResult = await pool.query(
      `
      INSERT INTO assessments (profile)
      VALUES ($1)
      RETURNING id;
      `,
      [safeProfile]
    );

    const assessmentId = assessmentResult.rows[0].id;

    if (isFounderDemo) {
      return res.json({
        success: true,
        founderDemo: true,
        paid: true,
        plan,
        assessmentId,
        url: `${process.env.CLIENT_URL}/payment-success?founder_demo=true&assessment_id=${assessmentId}&plan=${plan}`,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: selectedPlan.mode,
      payment_method_types: ["card"],
 allow_promotion_codes: true,
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
      assessmentId,
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

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Stripe session ID.",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const assessmentId = session.metadata?.assessmentId || null;
    const plan = session.metadata?.plan || "blueprint";

    let profile = {};
    let cachedBlueprint = null;
    let cachedReport = null;
    let cachedExpertAnalysis = null;
    let cachedPreparationNotes = null;
    let cachedAiEnhanced = false;

    if (assessmentId) {
      const assessmentResult = await pool.query(
        `
        SELECT
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

      if (assessmentResult.rows.length > 0) {
        const assessment = assessmentResult.rows[0];

        profile = assessment.profile || {};
        cachedBlueprint = assessment.blueprint || null;
        cachedReport = assessment.report || null;
        cachedExpertAnalysis = assessment.expert_analysis || null;
        cachedPreparationNotes = assessment.preparation_notes || null;
        cachedAiEnhanced = assessment.ai_enhanced || false;
      }
    }

    if (cachedReport) {
      return res.json(
        buildPaymentResponse({
          session,
          assessmentId,
          plan,
          profile,
          blueprint: cachedBlueprint,
          report: cachedReport,
          expertAnalysis: cachedExpertAnalysis,
          preparationNotes: cachedPreparationNotes,
          aiEnhanced: cachedAiEnhanced,
          aiStatus: "cached",
        })
      );
    }

    const analysis = await generateAndSaveReport({
      assessmentId,
      plan,
      profile,
    });

    return res.json(
      buildPaymentResponse({
        session,
        assessmentId,
        plan,
        profile: analysis.profile || profile,
        blueprint: analysis.blueprint,
        report: analysis.report,
        expertAnalysis: analysis.expertAnalysis || null,
        preparationNotes: analysis.preparationNotes || null,
        aiEnhanced: analysis.aiEnhanced || false,
        aiStatus: analysis.aiStatus,
      })
    );
  } catch (error) {
    console.error("Stripe verify error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not verify payment.",
      error: error.message,
    });
  }
};

export const verifyFounderDemo = async (req, res) => {
  try {
    const { assessmentId, plan = "blueprint" } = req.query;

    if (!assessmentId) {
      return res.status(400).json({
        success: false,
        message: "Missing assessment ID.",
      });
    }

    const assessmentResult = await pool.query(
      `
      SELECT
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

    if (assessmentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Founder demo assessment not found.",
      });
    }

    const assessment = assessmentResult.rows[0];
    const profile = assessment.profile || {};

    if (assessment.report) {
      return res.json(
        buildPaymentResponse({
          assessmentId,
          plan,
          profile,
          blueprint: assessment.blueprint,
          report: assessment.report,
          expertAnalysis: assessment.expert_analysis || null,
          preparationNotes: assessment.preparation_notes || null,
          aiEnhanced: assessment.ai_enhanced || false,
          aiStatus: "cached",
          founderDemo: true,
        })
      );
    }

    const analysis = await generateAndSaveReport({
      assessmentId,
      plan,
      profile,
    });

    return res.json(
      buildPaymentResponse({
        assessmentId,
        plan,
        profile: analysis.profile || profile,
        blueprint: analysis.blueprint,
        report: analysis.report,
        expertAnalysis: analysis.expertAnalysis || null,
        preparationNotes: analysis.preparationNotes || null,
        aiEnhanced: analysis.aiEnhanced || false,
        aiStatus: analysis.aiStatus,
        founderDemo: true,
      })
    );
  } catch (error) {
    console.error("Founder demo verify error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not verify founder demo.",
      error: error.message,
    });
  }
};