import express from "express";
import { createClient } from "@supabase/supabase-js";
import { evaluateCompliance } from "../compliance/frameworks/index.js";

console.log("✅ Compliance routes loaded");

const router = express.Router();

let supabaseAdminClient;

/*
|--------------------------------------------------------------------------
| Supabase Admin Client
|--------------------------------------------------------------------------
*/

function getSupabaseAdmin() {
  if (supabaseAdminClient) {
    return supabaseAdminClient;
  }

  const url = String(
    process.env.SUPABASE_URL || ""
  ).trim();

  const serviceRoleKey = String(
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  ).trim();

  if (!url) {
    throw new Error(
      "SUPABASE_URL is missing from the server environment."
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is missing from the server environment."
    );
  }

  console.log("Supabase admin configuration:", {
    project: url.replace("https://", ""),
    hasServiceRoleKey: Boolean(serviceRoleKey),
    keyPrefix: serviceRoleKey.slice(0, 12),
    keyLength: serviceRoleKey.length,
  });

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

  return supabaseAdminClient;
}

/*
|--------------------------------------------------------------------------
| Test Route
|--------------------------------------------------------------------------
*/

router.get("/test", (req, res) => {
  return res.status(200).json({
    success: true,
    message:
      "Compliance route works successfully.",
  });
});

/*
|--------------------------------------------------------------------------
| Configuration Test
|--------------------------------------------------------------------------
| This confirms whether the server can see the required Supabase variables.
| It never exposes the complete secret key.
*/

router.get("/config-test", (req, res) => {
  const url = String(
    process.env.SUPABASE_URL || ""
  ).trim();

  const serviceRoleKey = String(
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  ).trim();

  return res.status(200).json({
    success: true,
    supabaseUrlConfigured: Boolean(url),
    serviceRoleKeyConfigured:
      Boolean(serviceRoleKey),
    project: url
      ? url
          .replace("https://", "")
          .replace(".supabase.co", "")
      : null,
    keyPrefix: serviceRoleKey
      ? serviceRoleKey.slice(0, 12)
      : null,
    keyLength: serviceRoleKey.length,
  });
});

/*
|--------------------------------------------------------------------------
| Compliance Evaluation
|--------------------------------------------------------------------------
*/

router.post("/evaluate", (req, res) => {
  try {
    const profile = req.body;

    if (
      !profile ||
      typeof profile !== "object" ||
      Array.isArray(profile)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A valid assessment profile is required.",
      });
    }

    const result =
      evaluateCompliance(profile);

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(
      "❌ Compliance evaluation error:",
      {
        message: error?.message,
        stack:
          process.env.NODE_ENV ===
          "development"
            ? error?.stack
            : undefined,
      }
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Unable to evaluate compliance at this time.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Save Assessment
|--------------------------------------------------------------------------
| This insert runs through the server-side Supabase admin client.
*/

router.post("/save", async (req, res) => {
  try {
    const payload = req.body;

    if (
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A valid assessment payload is required.",
      });
    }

    const businessName = String(
      payload.business_name || ""
    ).trim();

    if (!businessName) {
      return res.status(400).json({
        success: false,
        message:
          "Business name is required before payment.",
      });
    }

    const supabaseAdmin =
      getSupabaseAdmin();

    /*
     * Only send fields expected by compliance_assessments.
     * This avoids accidentally inserting frontend-only properties.
     */
    const safePayload = {
      business_name: businessName,

      industry:
        cleanText(payload.industry),

      country:
        cleanText(payload.country) ||
        "Canada",

      province:
        cleanText(payload.province),

      website:
        cleanText(payload.website),

      business_email:
        cleanText(payload.business_email),

      employee_range:
        cleanText(payload.employee_range),

      compliance_score: Number(
        payload.compliance_score || 0
      ),

      risk_level:
        cleanText(payload.risk_level),

      missing_items: Array.isArray(
        payload.missing_items
      )
        ? payload.missing_items
        : [],

      recommendations: Array.isArray(
        payload.recommendations
      )
        ? payload.recommendations
        : [],

      answers:
        isPlainObject(payload.answers)
          ? payload.answers
          : {},

      business_profile:
        isPlainObject(
          payload.business_profile
        )
          ? payload.business_profile
          : {},

      domain_scores:
        isPlainObject(payload.domain_scores)
          ? payload.domain_scores
          : {},

      risks: Array.isArray(payload.risks)
        ? payload.risks
        : [],

      framework_readiness:
        Array.isArray(
          payload.framework_readiness
        )
          ? payload.framework_readiness
          : [],

      document_context:
        isPlainObject(
          payload.document_context
        )
          ? payload.document_context
          : {},

      payment_status:
        cleanText(
          payload.payment_status
        ) || "unpaid",

      documents_generated: Boolean(
        payload.documents_generated
      ),
    };

    console.log(
      "Saving compliance assessment:",
      {
        businessName:
          safePayload.business_name,
        email:
          safePayload.business_email,
        score:
          safePayload.compliance_score,
        fields:
          Object.keys(safePayload),
      }
    );

    const { data, error } =
      await supabaseAdmin
        .from("compliance_assessments")
        .insert(safePayload)
        .select("id")
        .single();

    if (error) {
      console.error(
        "❌ Assessment save failed:",
        {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        }
      );

      return res.status(500).json({
        success: false,

        message:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : "The assessment could not be securely saved.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? {
                code: error.code,
                details: error.details,
                hint: error.hint,
              }
            : undefined,
      });
    }

    console.log(
      "✅ Compliance assessment saved:",
      data.id
    );

    return res.status(201).json({
      success: true,
      assessmentId: data.id,
    });
  } catch (error) {
    console.error(
      "❌ Unexpected assessment save error:",
      {
        message: error?.message,
        stack:
          process.env.NODE_ENV ===
          "development"
            ? error?.stack
            : undefined,
      }
    );

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV ===
        "development"
          ? error?.message
          : "Unable to save the assessment right now.",
    });
  }
});

function cleanText(value) {
  return String(value ?? "").trim();
}

function isPlainObject(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      !Array.isArray(value)
  );
}

export default router;