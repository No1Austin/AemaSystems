import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FileText, Save, Send } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import GovernanceLayout from "../../components/governance/GovernanceLayout";

export default function GovernancePolicyEditor() {
  const { slug } = useParams();

  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    async function fetchPolicy() {
      const { data, error } = await supabase
        .from("governance_policies")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error(error);
        setPolicy(null);
      } else {
        setPolicy(data);
      }

      setLoading(false);
    }

    fetchPolicy();
  }, [slug]);

  function updateField(field, value) {
    setPolicy((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function savePolicy(newStatus = policy.status) {
    setStatusMessage("");

    const { error } = await supabase
      .from("governance_policies")
      .update({
        title: policy.title,
        description: policy.description,
        content: policy.content,
        category: policy.category,
        version: policy.version,
        status: newStatus,
        is_public: newStatus === "Published",
        effective_date: policy.effective_date,
        last_reviewed: policy.last_reviewed,
        next_review: policy.next_review,
        updated_at: new Date().toISOString(),
      })
      .eq("id", policy.id);

    if (error) {
      console.error(error);
      setStatusMessage("Could not save policy.");
      return;
    }

    setPolicy((current) => ({
      ...current,
      status: newStatus,
      is_public: newStatus === "Published",
    }));

    setStatusMessage(
      newStatus === "Published"
        ? "Policy published successfully."
        : "Draft saved successfully."
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <p className="text-slate-400">Loading editor...</p>
      </main>
    );
  }

  if (!policy) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <p className="text-slate-400">Policy not found.</p>
      </main>
    );
  }

  return (
    <GovernanceLayout
      badge="Policy Editor"
      title={policy.title}
      description="Edit, save, and publish Trust Center policies from the AEMA Governance Portal."
      icon={FileText}
      accent="cyan"
    >
      <div className="grid gap-6">
        {statusMessage && (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-300">
            {statusMessage}
          </div>
        )}

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Title"
              value={policy.title}
              onChange={(value) => updateField("title", value)}
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
            />

            <Field
              label="Version"
              value={policy.version || ""}
              onChange={(value) => updateField("version", value)}
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
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm text-slate-400">
              Policy Content
            </label>

            <textarea
              value={policy.content || ""}
              onChange={(e) => updateField("content", e.target.value)}
              rows={18}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm leading-7 text-white outline-none transition focus:border-cyan-400"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => savePolicy("Draft")}
              className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400/20"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </button>

            <button
              type="button"
              onClick={() => savePolicy("Published")}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              <Send className="h-4 w-4" />
              Publish
            </button>

            <a
              href={`/trust/${policy.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-400"
            >
              Preview Public Page
            </a>
          </div>
        </section>
      </div>
    </GovernanceLayout>
  );
}

function Field({ label, value, onChange, type = "text", disabled = false }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-400">{label}</label>

      <input
        type={type}
        value={value || ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}