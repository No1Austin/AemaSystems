import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileText,
  History,
  LoaderCircle,
  Save,
  Send,
} from "lucide-react";

import { supabase } from "../../lib/supabaseClient";
import ComplianceLayout from "../../modules/compliance/layouts/ComplianceLayout.jsx";

export default function GovernancePolicyEditor() {
  const { slug } = useParams();

  const [policy, setPolicy] = useState(null);
  const [changeSummary, setChangeSummary] = useState("");
  const [loading, setLoading] = useState(Boolean(slug));
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

 useEffect(() => {
  if (!slug) return undefined;

  let isMounted = true;

  async function fetchPolicy() {
    try {
      const { data, error } = await supabase
        .from("governance_policies")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (!isMounted) return;

      if (error) {
        console.error("Unable to load policy:", error);
        setPolicy(null);
        setStatusMessage(error.message || "Unable to load this policy.");
        setMessageType("error");
        return;
      }

      if (!data) {
        setPolicy(null);
        setStatusMessage("Policy not found.");
        setMessageType("error");
        return;
      }

      setPolicy(normalizePolicyDates(data));
    } catch (error) {
      if (!isMounted) return;

      console.error("Unexpected policy loading error:", error);
      setPolicy(null);
      setStatusMessage("An unexpected error occurred while loading.");
      setMessageType("error");
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }

  fetchPolicy();

  return () => {
    isMounted = false;
  };
}, [slug]);

if (!slug) {
  return <EditorMessage message="No policy was selected." />;
}

  function updateField(field, value) {
    setPolicy((current) => {
      if (!current) return current;

      return {
        ...current,
        [field]: value,
      };
    });

    if (statusMessage) {
      setStatusMessage("");
    }
  }

  function validatePolicy(newStatus) {
    if (!policy?.title?.trim()) {
      return "Policy title is required.";
    }

    if (!policy?.slug?.trim()) {
      return "Policy slug is required.";
    }

    if (!policy?.content?.trim()) {
      return "Policy content is required.";
    }

    if (newStatus === "Published" && !policy.description?.trim()) {
      return "A description is required before publishing.";
    }

    if (newStatus === "Published" && !policy.effective_date) {
      return "An effective date is required before publishing.";
    }

    return "";
  }

  async function saveVersionHistory(savedPolicy, summary) {
    if (!summary.trim()) {
      return { success: true };
    }

    const versionPayload = {
      policy_id: savedPolicy.id,
      version: savedPolicy.version || "1.0",
      title: savedPolicy.title,
      description: savedPolicy.description || null,
      content: savedPolicy.content,
      status: savedPolicy.status,
      change_summary: summary.trim(),
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("policy_versions")
      .insert(versionPayload);

    if (error) {
      console.error("Unable to save policy version history:", error);

      return {
        success: false,
        message:
          "The policy was saved, but the version-history entry could not be created. Check the policy_versions table columns and permissions.",
      };
    }

    return { success: true };
  }

  async function savePolicy(newStatus) {
    if (!policy || saving) return;

    const validationError = validatePolicy(newStatus);

    if (validationError) {
      setStatusMessage(validationError);
      setMessageType("error");
      return;
    }

    try {
      setSaving(true);
      setStatusMessage("");

      const isPublished = newStatus === "Published";
      const now = new Date().toISOString();

      const updatePayload = {
        title: policy.title.trim(),
        description: policy.description?.trim() || null,
        content: policy.content.trim(),
        category: policy.category?.trim() || null,
        version: policy.version?.trim() || "1.0",
        status: newStatus,
        is_public: isPublished,
        effective_date: policy.effective_date || null,
        last_reviewed: policy.last_reviewed || null,
        next_review: policy.next_review || null,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from("governance_policies")
        .update(updatePayload)
        .eq("id", policy.id)
        .select("*")
        .maybeSingle();

      if (error) {
        console.error("Unable to save policy:", error);
        setStatusMessage(error.message || "Could not save policy.");
        setMessageType("error");
        return;
      }

      if (!data) {
        setStatusMessage("The policy could not be found after saving.");
        setMessageType("error");
        return;
      }

      const historyResult = await saveVersionHistory(data, changeSummary);

      setPolicy(normalizePolicyDates(data));

      if (!historyResult.success) {
        setStatusMessage(historyResult.message);
        setMessageType("error");
        return;
      }

      setChangeSummary("");
      setStatusMessage(
        isPublished
          ? "Policy published successfully."
          : "Draft saved successfully."
      );
      setMessageType("success");
    } catch (error) {
      console.error("Unexpected policy save error:", error);
      setStatusMessage("An unexpected error occurred while saving.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  if (!slug) {
    return <EditorMessage message="No policy was selected." />;
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-cyan-400" />
          <p className="mt-4 text-sm text-slate-400">Loading editor...</p>
        </div>
      </main>
    );
  }

  if (!policy) {
    return (
      <EditorMessage message={statusMessage || "Policy not found."} />
    );
  }

  const isPublished =
    String(policy.status || "").toLowerCase() === "published";

  return (
    <ComplianceLayout
      badge="Policy Editor"
      title={policy.title}
      description="Edit, review, and publish AEMA Systems Trust Center policies."
      icon={FileText}
      accent="cyan"
    >
      <div className="grid gap-6">
        {statusMessage && (
          <StatusMessage type={messageType} message={statusMessage} />
        )}

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Current status</p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge
                  label={policy.status || "Draft"}
                  type={isPublished ? "success" : "neutral"}
                />

                {policy.is_public && (
                  <StatusBadge label="Public" type="info" />
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {isPublished && policy.is_public ? (
                <Link
                  to={`/trust/${policy.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-400"
                >
                  <Eye className="h-4 w-4" />
                  View public page
                </Link>
              ) : (
                <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-600">
                  <Eye className="h-4 w-4" />
                  Not published
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field
              label="Title"
              value={policy.title}
              onChange={(value) => updateField("title", value)}
              required
            />

            <Field
              label="Slug"
              value={policy.slug}
              disabled
              onChange={() => {}}
            />

            <Field
              label="Category"
              value={policy.category || ""}
              onChange={(value) => updateField("category", value)}
              placeholder="Legal, Security, AI, Governance"
            />

            <Field
              label="Version"
              value={policy.version || ""}
              onChange={(value) => updateField("version", value)}
              placeholder="1.0"
            />

            <Field
              label="Effective Date"
              type="date"
              value={policy.effective_date || ""}
              onChange={(value) => updateField("effective_date", value)}
            />

            <Field
              label="Last Reviewed"
              type="date"
              value={policy.last_reviewed || ""}
              onChange={(value) => updateField("last_reviewed", value)}
            />

            <Field
              label="Next Review"
              type="date"
              value={policy.next_review || ""}
              onChange={(value) => updateField("next_review", value)}
            />

            <Field
              label="Status"
              value={policy.status || ""}
              disabled
              onChange={() => {}}
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm text-slate-400">
              Description
            </label>

            <textarea
              value={policy.description || ""}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              rows={3}
              placeholder="Write a short public summary of this policy."
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm text-slate-400">
              Policy Content
              <span className="ml-1 text-red-300">*</span>
            </label>

            <textarea
              value={policy.content || ""}
              onChange={(event) =>
                updateField("content", event.target.value)
              }
              rows={20}
              placeholder="Write the complete policy content here."
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />

            <p className="mt-2 text-xs text-slate-500">
              {policy.content?.length || 0} characters
            </p>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm text-slate-400">
              Change Summary
            </label>

            <textarea
              value={changeSummary}
              onChange={(event) => {
                setChangeSummary(event.target.value);

                if (statusMessage) {
                  setStatusMessage("");
                }
              }}
              rows={3}
              placeholder="Example: Updated data retention section and contact information."
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />

            <p className="mt-2 text-xs text-slate-500">
              Optional. When provided, this note is stored in the policy version
              history.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-6">
            <button
              type="button"
              disabled={saving}
              onClick={() => savePolicy("Draft")}
              className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              Save Draft
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => savePolicy("Published")}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}

              Publish
            </button>
          </div>
        </section>
      </div>
    </ComplianceLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  placeholder = "",
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-400">
        {label}

        {required && <span className="ml-1 text-red-300">*</span>}
      </label>

      <input
        type={type}
        value={value || ""}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

function StatusMessage({ type, message }) {
  const isError = type === "error";

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border px-5 py-4 text-sm ${
        isError
          ? "border-red-400/20 bg-red-400/10 text-red-200"
          : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      }`}
    >
      {isError ? (
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
      ) : (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
      )}

      <p>{message}</p>
    </div>
  );
}

function StatusBadge({ label, type = "neutral" }) {
  const classes = {
    success:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    info: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    neutral: "border-white/10 bg-white/[0.04] text-slate-400",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        classes[type] || classes.neutral
      }`}
    >
      {label}
    </span>
  );
}

function EditorMessage({ message }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
      <div className="max-w-lg rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <FileText className="mx-auto h-10 w-10 text-cyan-400" />

        <h1 className="mt-5 text-2xl font-bold">Policy unavailable</h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">{message}</p>
      </div>
    </main>
  );
}

function normalizePolicyDates(policy) {
  return {
    ...policy,
    effective_date: formatInputDate(policy.effective_date),
    last_reviewed: formatInputDate(policy.last_reviewed),
    next_review: formatInputDate(policy.next_review),
  };
}

function formatInputDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}
