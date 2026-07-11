import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock3,
  FileText,
  History,
  LoaderCircle,
} from "lucide-react";

import { supabase } from "../../lib/supabaseClient";
import ComplianceLayout from "../../modules/compliance/layouts/ComplianceLayout.jsx";

export default function PolicyVersionHistory() {
  const { slug } = useParams();

  const [policy, setPolicy] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;

    async function loadHistory() {
      try {
        const { data: policyData, error: policyError } = await supabase
          .from("governance_policies")
          .select("id, title, slug, version, status")
          .eq("slug", slug)
          .maybeSingle();

        if (!isMounted) return;

        if (policyError) {
          throw policyError;
        }

        if (!policyData) {
          setErrorMessage("Policy not found.");
          return;
        }

        const { data: versionData, error: versionError } = await supabase
          .from("policy_versions")
          .select("*")
          .eq("policy_id", policyData.id)
          .order("created_at", { ascending: false });

        if (!isMounted) return;

        if (versionError) {
          throw versionError;
        }

        setPolicy(policyData);
        setVersions(versionData || []);
      } catch (error) {
        console.error("Unable to load version history:", error);

        if (isMounted) {
          setErrorMessage(
            error?.message || "Unable to load policy version history."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-cyan-400" />

          <p className="mt-4 text-sm text-slate-400">
            Loading version history...
          </p>
        </div>
      </main>
    );
  }

  if (!policy) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
        <div className="max-w-lg rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <FileText className="mx-auto h-10 w-10 text-cyan-400" />

          <h1 className="mt-5 text-2xl font-bold">History unavailable</h1>

          <p className="mt-3 text-sm text-slate-400">
            {errorMessage || "This policy could not be found."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <ComplianceLayout
      badge="Version History"
      title={policy.title}
      description="Review saved policy versions and the changes recorded for each update."
      icon={History}
      accent="cyan"
    >
      <div className="grid gap-6">
        <div>
          <Link
            to={`/governance/documents/${policy.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to policy editor
          </Link>
        </div>

        {errorMessage && (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-200">
            {errorMessage}
          </div>
        )}

        <section className="grid gap-4">
          {versions.length > 0 ? (
            versions.map((version) => (
              <VersionCard key={version.id} version={version} />
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
              <History className="mx-auto h-9 w-9 text-slate-500" />

              <h2 className="mt-4 text-lg font-bold text-white">
                No saved versions
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Save or publish the policy to create its first version record.
              </p>
            </div>
          )}
        </section>
      </div>
    </ComplianceLayout>
  );
}

function VersionCard({ version }) {
  const isPublished =
    String(version.status || "").toLowerCase() === "published";

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-white">
              Version {version.version || "1.0"}
            </h2>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                isPublished
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                  : "border-white/10 bg-white/[0.04] text-slate-400"
              }`}
            >
              {version.status || "Draft"}
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {version.change_summary || "No change summary was recorded."}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-xs text-slate-500">
          <Clock3 className="h-4 w-4" />
          {formatDateTime(version.created_at)}
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-white/10 pt-5 text-sm sm:grid-cols-3">
        <VersionDetail label="Title" value={version.title} />

        <VersionDetail
          label="Effective"
          value={formatDate(version.effective_date)}
        />

        <VersionDetail
          label="Next review"
          value={formatDate(version.next_review)}
        />
      </div>
    </article>
  );
}

function VersionDetail({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-slate-300">
        {value || "Not set"}
      </p>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "Not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not set";

  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "Unknown";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown";

  return date.toLocaleString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}