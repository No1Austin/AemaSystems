import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  FileText,
  Loader2,
  Search,
} from "lucide-react";

import ComplianceLayout from "../../modules/compliance/layouts/ComplianceLayout.jsx";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ComplianceDocuments() {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspace_id");
  const assessmentId = searchParams.get("assessment_id");

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function loadDocuments() {
      if (!workspaceId) {
        setError("Workspace reference is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/compliance/workspace/${encodeURIComponent(
            workspaceId
          )}/documents`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error?.message ||
              data.message ||
              "Unable to load documents."
          );
        }

        setDocuments(data.documents || []);
      } catch (loadError) {
        console.error("Document list failed:", loadError);
        setError(
          loadError?.message ||
            "Unable to load generated documents."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, [workspaceId]);

  const filteredDocuments = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return documents;

    return documents.filter(
      (document) =>
        String(document.title || "").toLowerCase().includes(normalized) ||
        String(document.category || "").toLowerCase().includes(normalized)
    );
  }, [documents, query]);

  return (
    <ComplianceLayout
      badge="Generated Documents"
      title="Compliance Document Library"
      description="Open, review, edit, and approve the generated policies in your workspace."
      icon={FileText}
      accent="cyan"
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to={`/compliance-dashboard?assessment_id=${encodeURIComponent(
              assessmentId || ""
            )}`}
            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <label className="relative block w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search documents..."
              className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40"
            />
          </label>
        </div>

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-300" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-5 text-sm text-rose-100">
            <AlertTriangle className="mb-3 h-5 w-5" />
            {error}
          </div>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredDocuments.map((document) => (
              <Link
                key={document.id}
                to={`/compliance-dashboard/documents/${encodeURIComponent(
                  document.slug
                )}?workspace_id=${encodeURIComponent(
                  workspaceId
                )}&assessment_id=${encodeURIComponent(assessmentId || "")}`}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-0.5 hover:border-cyan-400/25 hover:bg-cyan-400/[0.05]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                    <FileText className="h-5 w-5 text-cyan-300" />
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold text-slate-500">
                    {document.status}
                  </span>
                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {document.category || "Governance"}
                </p>

                <h2 className="mt-2 text-lg font-black text-white">
                  {document.title}
                </h2>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Version {document.version}
                  </span>

                  <ChevronRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-300" />
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </ComplianceLayout>
  );
}
