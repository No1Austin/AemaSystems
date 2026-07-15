import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Copy,
  FileText,
  Loader2,
  Save,
} from "lucide-react";

import ComplianceLayout from "../../modules/compliance/layouts/ComplianceLayout.jsx";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ComplianceDocumentViewer() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspace_id");
  const assessmentId = searchParams.get("assessment_id");

  const [document, setDocument] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadDocument() {
      if (!workspaceId || !slug) {
        setError("Document reference is incomplete.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/compliance/workspace/${encodeURIComponent(
            workspaceId
          )}/documents/${encodeURIComponent(slug)}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error?.message ||
              data.message ||
              "Unable to load this document."
          );
        }

        setDocument(data.document);
        setContent(data.document.content || "");
      } catch (loadError) {
        console.error("Document load failed:", loadError);
        setError(
          loadError?.message ||
            "Unable to load this document."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDocument();
  }, [slug, workspaceId]);

  async function saveDocument(status) {
    if (!document) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/compliance/workspace/${encodeURIComponent(
          workspaceId
        )}/documents/${encodeURIComponent(document.id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            status: status || document.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error?.message ||
            data.message ||
            "Unable to save this document."
        );
      }

      setDocument(data.document);
      setContent(data.document.content || "");
      setMessage(
        status === "Approved"
          ? "Document approved successfully."
          : "Document saved successfully."
      );
    } catch (saveError) {
      console.error("Document save failed:", saveError);
      setMessage(
        saveError?.message ||
          "Unable to save this document."
      );
    } finally {
      setSaving(false);
    }
  }

  async function copyDocument() {
    try {
      await navigator.clipboard.writeText(content);
      setMessage("Document copied to your clipboard.");
    } catch {
      setMessage("Your browser could not copy the document.");
    }
  }

  return (
    <ComplianceLayout
      badge="Generated Document"
      title={document?.title || "Compliance Document"}
      description="Review and customize this generated draft before approving or publishing it."
      icon={FileText}
      accent="emerald"
    >
      <div className="space-y-5">
        <Link
          to={`/compliance-dashboard/documents?workspace_id=${encodeURIComponent(
            workspaceId || ""
          )}&assessment_id=${encodeURIComponent(assessmentId || "")}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to documents
        </Link>

        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-300" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-5 text-sm text-rose-100">
            <AlertTriangle className="mb-3 h-5 w-5" />
            {error}
          </div>
        ) : (
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
                  {document?.category || "Governance"}
                </p>

                <h2 className="mt-2 text-xl font-black text-white">
                  {document?.title}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Version {document?.version} · {document?.status}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copyDocument}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-bold text-white transition hover:bg-white/[0.08]"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </button>

                <button
                  type="button"
                  onClick={() => saveDocument()}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-xs font-bold text-cyan-200 transition hover:bg-cyan-400/15 disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save draft
                </button>

                <button
                  type="button"
                  onClick={() => saveDocument("Approved")}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-xs font-black text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
                >
                  <Check className="h-4 w-4" />
                  Approve
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="min-h-[680px] w-full resize-y rounded-2xl border border-white/10 bg-[#07101b] p-5 font-mono text-sm leading-7 text-slate-200 outline-none transition focus:border-emerald-400/40"
              />

              {message && (
                <p className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-slate-300">
                  {message}
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </ComplianceLayout>
  );
}
