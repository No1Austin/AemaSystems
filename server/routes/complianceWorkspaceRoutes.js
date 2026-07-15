import express from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();
let supabaseAdminClient;

function getSupabaseAdmin() {
  if (!supabaseAdminClient) {
    const url = String(process.env.SUPABASE_URL || "").trim();
    const key = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

    if (!url || !key) {
      throw new Error("Supabase server configuration is incomplete.");
    }

    supabaseAdminClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  return supabaseAdminClient;
}

function cleanText(value) {
  return String(value ?? "").trim();
}

function sendError(res, status, message, code, details) {
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

function createSlug(value) {
  const slug = cleanText(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);

  return slug || `business-${Date.now()}`;
}

async function createUniqueWorkspaceSlug({
  supabaseAdmin,
  baseSlug,
  workspaceId,
}) {
  const normalizedBase = createSlug(baseSlug);

  let candidate = normalizedBase;
  let suffix = 1;

  while (suffix <= 50) {
    const { data, error } = await supabaseAdmin
      .from("compliance_workspaces")
      .select("id")
      .eq("slug", candidate)
      .neq("id", workspaceId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return candidate;
    }

    suffix += 1;
    candidate = `${normalizedBase}-${suffix}`;
  }

  return `${normalizedBase}-${Date.now()}`;
}

function normalizeClientUrl(value) {
  return cleanText(value).replace(/\/+$/, "");
}

router.get("/workspace/by-assessment/:assessmentId", async (req, res) => {
  try {
    const assessmentId = cleanText(req.params?.assessmentId);

    if (!assessmentId) {
      return sendError(
        res,
        400,
        "Assessment ID is required.",
        "ASSESSMENT_ID_REQUIRED"
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { data: assessment, error: assessmentError } = await supabaseAdmin
      .from("compliance_assessments")
      .select(
        `
          id,
          business_name,
          business_email,
          compliance_score,
          risk_level,
          payment_status,
          documents_generated,
          workspace_id
        `
      )
      .eq("id", assessmentId)
      .maybeSingle();

    if (assessmentError) throw assessmentError;

    if (!assessment) {
      return sendError(
        res,
        404,
        "Assessment was not found.",
        "ASSESSMENT_NOT_FOUND"
      );
    }

    if (!assessment.workspace_id) {
      return sendError(
        res,
        409,
        "The compliance workspace has not been created yet.",
        "WORKSPACE_NOT_READY"
      );
    }

    const { data: workspace, error: workspaceError } = await supabaseAdmin
      .from("compliance_workspaces")
      .select("*")
      .eq("id", assessment.workspace_id)
      .maybeSingle();

    if (workspaceError) throw workspaceError;

    const { count: documentCount, error: countError } = await supabaseAdmin
      .from("compliance_documents")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", assessment.workspace_id);

    if (countError) throw countError;

    return res.status(200).json({
      success: true,
      assessment,
      workspace,
      documentCount: documentCount || 0,
    });
  } catch (error) {
    console.error("Workspace lookup failed:", error);

    return sendError(
      res,
      500,
      "Unable to load the compliance workspace.",
      "WORKSPACE_LOOKUP_FAILED",
      process.env.NODE_ENV === "development" ? error?.message : undefined
    );
  }
});

router.get("/workspace/:workspaceId/documents", async (req, res) => {
  try {
    const workspaceId = cleanText(req.params?.workspaceId);

    if (!workspaceId) {
      return sendError(
        res,
        400,
        "Workspace ID is required.",
        "WORKSPACE_ID_REQUIRED"
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { data: documents, error } = await supabaseAdmin
      .from("compliance_documents")
      .select(
        `
          id,
          workspace_id,
          assessment_id,
          document_key,
          title,
          slug,
          category,
          status,
          version,
          display_order,
          is_public,
          approved_at,
          published_at,
          next_review,
          created_at,
          updated_at
        `
      )
      .eq("workspace_id", workspaceId)
      .order("display_order", { ascending: true })
      .order("title", { ascending: true });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      documents: documents || [],
    });
  } catch (error) {
    console.error("Document list failed:", error);

    return sendError(
      res,
      500,
      "Unable to load generated documents.",
      "DOCUMENT_LIST_FAILED",
      process.env.NODE_ENV === "development" ? error?.message : undefined
    );
  }
});

router.get("/workspace/:workspaceId/documents/:slug", async (req, res) => {
  try {
    const workspaceId = cleanText(req.params?.workspaceId);
    const slug = cleanText(req.params?.slug);

    if (!workspaceId || !slug) {
      return sendError(
        res,
        400,
        "Workspace ID and document slug are required.",
        "DOCUMENT_REFERENCE_REQUIRED"
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { data: document, error } = await supabaseAdmin
      .from("compliance_documents")
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;

    if (!document) {
      return sendError(
        res,
        404,
        "Generated document was not found.",
        "DOCUMENT_NOT_FOUND"
      );
    }

    return res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    console.error("Document lookup failed:", error);

    return sendError(
      res,
      500,
      "Unable to load this generated document.",
      "DOCUMENT_LOOKUP_FAILED",
      process.env.NODE_ENV === "development" ? error?.message : undefined
    );
  }
});

router.patch(
  "/workspace/:workspaceId/documents/:documentId",
  async (req, res) => {
    try {
      const workspaceId = cleanText(req.params?.workspaceId);
      const documentId = cleanText(req.params?.documentId);
      const allowedStatuses = ["Draft", "In Review", "Approved"];
      const payload = {};

      if (typeof req.body?.content === "string") {
        payload.content = req.body.content;
      }

      if (typeof req.body?.title === "string") {
        payload.title = cleanText(req.body.title);
      }

      if (allowedStatuses.includes(req.body?.status)) {
        payload.status = req.body.status;

        if (req.body.status === "Approved") {
          payload.approved_at = new Date().toISOString();
        }
      }

      if (typeof req.body?.isPublic === "boolean") {
        payload.is_public = req.body.isPublic;
      }

      payload.updated_at = new Date().toISOString();

      const supabaseAdmin = getSupabaseAdmin();

      const { data: document, error } = await supabaseAdmin
        .from("compliance_documents")
        .update(payload)
        .eq("id", documentId)
        .eq("workspace_id", workspaceId)
        .select("*")
        .single();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        document,
      });
    } catch (error) {
      console.error("Document update failed:", error);

      return sendError(
        res,
        500,
        "Unable to update this document.",
        "DOCUMENT_UPDATE_FAILED",
        process.env.NODE_ENV === "development" ? error?.message : undefined
      );
    }
  }
);
router.get(
  "/workspace/:workspaceId",
  async (req, res) => {
    try {
      const workspaceId = cleanText(
        req.params?.workspaceId
      );

      if (!workspaceId) {
        return sendError(
          res,
          400,
          "Workspace ID is required.",
          "WORKSPACE_ID_REQUIRED"
        );
      }

      const supabaseAdmin =
        getSupabaseAdmin();

      const {
        data: workspace,
        error: workspaceError,
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
            stripe_subscription_id,
            logo_url,
            primary_color,
            accent_color,
            appearance,
            headline,
            description,
            business_website,
            is_published,
            published_at,
            created_at,
            updated_at
          `
        )
        .eq("id", workspaceId)
        .maybeSingle();

      if (workspaceError) {
        throw workspaceError;
      }

      if (!workspace) {
        return sendError(
          res,
          404,
          "Compliance workspace was not found.",
          "WORKSPACE_NOT_FOUND"
        );
      }

      const {
        data: documents,
        error: documentsError,
      } = await supabaseAdmin
        .from("compliance_documents")
        .select(
          `
            id,
            workspace_id,
            assessment_id,
            document_key,
            title,
            slug,
            category,
            status,
            version,
            display_order,
            is_public,
            approved_at,
            published_at,
            next_review,
            created_at,
            updated_at
          `
        )
        .eq("workspace_id", workspaceId)
        .order("display_order", {
          ascending: true,
        })
        .order("title", {
          ascending: true,
        });

      if (documentsError) {
        throw documentsError;
      }

      return res.status(200).json({
        success: true,
        workspace,
        documents: documents || [],
        documentCount:
          documents?.length || 0,
      });
    } catch (error) {
      console.error(
        "Load compliance workspace failed:",
        {
          message: error?.message,
          code: error?.code,
          details: error?.details,
          hint: error?.hint,
        }
      );

      return sendError(
        res,
        500,
        "Unable to load the compliance workspace.",
        "WORKSPACE_LOAD_FAILED",
        process.env.NODE_ENV ===
          "development"
          ? error?.message
          : undefined
      );
    }
  }
);


router.patch(
  "/workspace/:workspaceId",
  async (req, res) => {
    try {
      const workspaceId = cleanText(
        req.params?.workspaceId
      );

      if (!workspaceId) {
        return sendError(
          res,
          400,
          "Workspace ID is required.",
          "WORKSPACE_ID_REQUIRED"
        );
      }

      const supabaseAdmin =
        getSupabaseAdmin();

      const {
        data: existingWorkspace,
        error: lookupError,
      } = await supabaseAdmin
        .from("compliance_workspaces")
        .select(
          `
            id,
            business_name,
            slug,
            is_published,
            published_at
          `
        )
        .eq("id", workspaceId)
        .maybeSingle();

      if (lookupError) {
        throw lookupError;
      }

      if (!existingWorkspace) {
        return sendError(
          res,
          404,
          "Compliance workspace was not found.",
          "WORKSPACE_NOT_FOUND"
        );
      }

      const requestedPublish =
        req.body?.isPublished === true ||
        req.body?.is_published === true;

      const requestedSlug =
        cleanText(req.body?.slug);

      const stableBaseSlug =
        requestedSlug ||
        existingWorkspace.slug ||
        createSlug(
          existingWorkspace.business_name
        );

      const uniqueSlug =
        await createUniqueWorkspaceSlug({
          supabaseAdmin,
          baseSlug: stableBaseSlug,
          workspaceId,
        });

      const payload = {
        slug: uniqueSlug,
        updated_at: new Date().toISOString(),
      };

      if (
        "logoUrl" in req.body ||
        "logo_url" in req.body
      ) {
        payload.logo_url =
          req.body?.logoUrl ??
          req.body?.logo_url ??
          null;
      }

      if (
        "primaryColor" in req.body ||
        "primary_color" in req.body
      ) {
        payload.primary_color =
          cleanText(
            req.body?.primaryColor ??
              req.body?.primary_color
          ) || "#10b981";
      }

      if (
        "accentColor" in req.body ||
        "accent_color" in req.body
      ) {
        payload.accent_color =
          cleanText(
            req.body?.accentColor ??
              req.body?.accent_color
          ) || "#22d3ee";
      }

      if ("appearance" in req.body) {
        payload.appearance =
          cleanText(req.body?.appearance) ||
          "dark";
      }

      if ("headline" in req.body) {
        payload.headline =
          cleanText(req.body?.headline) ||
          null;
      }

      if ("description" in req.body) {
        payload.description =
          cleanText(req.body?.description) ||
          null;
      }

      if (
        "businessWebsite" in req.body ||
        "business_website" in req.body
      ) {
        payload.business_website =
          cleanText(
            req.body?.businessWebsite ??
              req.body?.business_website
          ) || null;
      }

      if (
        "isPublished" in req.body ||
        "is_published" in req.body
      ) {
        payload.is_published =
          requestedPublish;

        payload.published_at =
          requestedPublish
            ? existingWorkspace.published_at ||
              new Date().toISOString()
            : null;
      }

      const {
        data: workspace,
        error: updateError,
      } = await supabaseAdmin
        .from("compliance_workspaces")
        .update(payload)
        .eq("id", workspaceId)
        .select("*")
        .single();

      if (updateError) {
        throw updateError;
      }

      const clientUrl =
        normalizeClientUrl(
          process.env.CLIENT_URL ||
            "http://localhost:5173"
        );

      const trustCenterUrl =
        `${clientUrl}/trust-center/` +
        encodeURIComponent(
          workspace.slug
        );

      return res.status(200).json({
        success: true,
        message: requestedPublish
          ? "Trust Center published successfully."
          : "Trust Center settings saved successfully.",
        workspace,
        publicUrl: trustCenterUrl,
        trustCenterUrl,
      });
    } catch (error) {
      console.error(
        "Trust Center save failed:",
        {
          message: error?.message,
          code: error?.code,
          details: error?.details,
          hint: error?.hint,
        }
      );

      return sendError(
        res,
        500,
        error?.message ||
          "Unable to save the Trust Center.",
        "WORKSPACE_UPDATE_FAILED",
        process.env.NODE_ENV ===
          "development"
          ? error?.message
          : undefined
      );
    }
  }
);

router.get(
  "/public/trust-center/:slug",
  async (req, res) => {
    try {
      const slug = cleanText(
        req.params?.slug
      );

      if (!slug) {
        return sendError(
          res,
          400,
          "Trust Center slug is required.",
          "TRUST_CENTER_SLUG_REQUIRED"
        );
      }

      const supabaseAdmin =
        getSupabaseAdmin();

      const {
        data: workspace,
        error: workspaceError,
      } = await supabaseAdmin
        .from("compliance_workspaces")
        .select(
          `
            id,
            business_name,
            slug,
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
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (workspaceError) {
        throw workspaceError;
      }

      if (!workspace) {
        return sendError(
          res,
          404,
          "Published Trust Center was not found.",
          "TRUST_CENTER_NOT_FOUND"
        );
      }

      const {
        data: documents,
        error: documentsError,
      } = await supabaseAdmin
        .from("compliance_documents")
        .select(
          `
            id,
            title,
            slug,
            category,
            content,
            version,
            approved_at,
            published_at,
            next_review,
            display_order
          `
        )
        .eq("workspace_id", workspace.id)
        .eq("is_public", true)
        .eq("status", "Approved")
        .order("display_order", {
          ascending: true,
        })
        .order("title", {
          ascending: true,
        });

      if (documentsError) {
        throw documentsError;
      }

      return res.status(200).json({
        success: true,
        workspace,
        documents: documents || [],
      });
    } catch (error) {
      console.error(
        "Public Trust Center load failed:",
        {
          message: error?.message,
          code: error?.code,
          details: error?.details,
          hint: error?.hint,
        }
      );

      return sendError(
        res,
        500,
        "Unable to load the Trust Center.",
        "TRUST_CENTER_LOAD_FAILED",
        process.env.NODE_ENV ===
          "development"
          ? error?.message
          : undefined
      );
    }
  }
);

export default router;
