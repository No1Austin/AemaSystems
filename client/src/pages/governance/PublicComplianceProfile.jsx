import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  ShieldCheck,
  X,
} from "lucide-react";

import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function PublicComplianceProfile() {
  const { slug } = useParams();

  const [workspace, setWorkspace] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPublicProfile() {
      if (!slug) {
        setErrorMessage(
          "This compliance page does not have a valid public link."
        );
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/compliance/public/trust-center/${encodeURIComponent(
            slug
          )}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        let data;

        try {
          data = await response.json();
        } catch {
          throw new Error(
            "The public compliance server returned an invalid response."
          );
        }

        if (!response.ok || !data.success) {
          throw new Error(
            data.error?.message ||
              data.message ||
              "This Trust Center is unavailable."
          );
        }

        if (!isMounted) return;

        setWorkspace(data.workspace || null);
        setDocuments(data.documents || []);
        setErrorMessage("");
      } catch (error) {
        if (!isMounted) return;

        console.error(
          "Public Trust Center failed:",
          error
        );

        setErrorMessage(
          error?.message ||
            "This Trust Center is unavailable."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPublicProfile();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816]">
        <Loader2 className="h-9 w-9 animate-spin text-cyan-300" />
      </main>
    );
  }

  if (errorMessage || !workspace) {
    return (
      <main className="min-h-screen bg-[#050816] text-white">
        <Navbar />

        <section className="mx-auto flex min-h-[72vh] max-w-xl items-center px-6 pt-28">
          <div className="w-full rounded-3xl border border-rose-400/20 bg-rose-400/10 p-8 text-center">
            <AlertTriangle className="mx-auto h-9 w-9 text-rose-300" />

            <h1 className="mt-5 text-2xl font-black">
              Trust Center unavailable
            </h1>

            <p className="mt-3 text-sm leading-7 text-rose-100">
              {errorMessage ||
                "This Trust Center is not available right now."}
            </p>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  const primaryColor =
    workspace.primary_color || "#10b981";

  const accentColor =
    workspace.accent_color || "#22d3ee";

  return (
    <main
      className="min-h-screen text-white"
      style={{
        background: `
          radial-gradient(
            circle at 12% 4%,
            ${primaryColor}22,
            transparent 30%
          ),
          radial-gradient(
            circle at 88% 10%,
            ${accentColor}18,
            transparent 32%
          ),
          #050816
        `,
      }}
    >
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-32">
        <header className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-7 shadow-[0_35px_120px_rgba(0,0,0,0.45)] sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              {workspace.logo_url ? (
                <img
                  src={workspace.logo_url}
                  alt={`${workspace.business_name || "Business"} logo`}
                  className="h-20 w-20 rounded-3xl border border-white/10 object-cover"
                />
              ) : (
                <span
                  className="flex h-20 w-20 items-center justify-center rounded-3xl text-2xl font-black"
                  style={{
                    backgroundColor: `${primaryColor}25`,
                    border: `1px solid ${primaryColor}55`,
                  }}
                >
                  {String(
                    workspace.business_name || "B"
                  )
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              )}

              <p
                className="mt-7 text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: accentColor }}
              >
                {workspace.business_name}
              </p>

              <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                {workspace.headline ||
                  "Trust, privacy, and security at our business"}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400">
                {workspace.description ||
                  "Learn how our business approaches privacy, security, responsible AI, accessibility, and governance."}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  Hosted by AEMA Compliance OS
                </span>

                {workspace.contact_email && (
                  <a
                    href={`mailto:${workspace.contact_email}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <Mail className="h-4 w-4 text-cyan-300" />
                    Contact
                  </a>
                )}

                {workspace.business_website && (
                  <a
                    href={workspace.business_website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <ExternalLink className="h-4 w-4 text-cyan-300" />
                    Visit website
                  </a>
                )}
              </div>
            </div>

            <div className="grid min-w-[250px] gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <SummaryCard
                label="Public policies"
                value={documents.length}
                color={primaryColor}
              />

              <SummaryCard
                label="Page status"
                value="Published"
                color={accentColor}
              />
            </div>
          </div>
        </header>

        <section className="mt-8">
          <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Compliance library
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Published policies and governance documents
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">
              These documents have been reviewed and selected for public access
              by {workspace.business_name}.
            </p>
          </div>

          {documents.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {documents.map((document) => (
                <button
                  key={document.id}
                  type="button"
                  onClick={() =>
                    setSelectedDocument(document)
                  }
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-cyan-400/25 hover:bg-white/[0.05] hover:shadow-[0_24px_70px_rgba(0,0,0,0.24)]"
                >
                  <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-cyan-400/[0.05] blur-3xl transition group-hover:bg-cyan-400/[0.09]" />

                  <div className="relative flex items-start justify-between gap-4">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border"
                      style={{
                        backgroundColor: `${primaryColor}18`,
                        borderColor: `${primaryColor}45`,
                      }}
                    >
                      <FileText
                        className="h-5 w-5"
                        style={{ color: primaryColor }}
                      />
                    </span>

                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-300">
                      Approved
                    </span>
                  </div>

                  <div className="relative">
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                      {document.category || "Governance"}
                    </p>

                    <h3 className="mt-2 text-xl font-black text-white">
                      {document.title}
                    </h3>

                    <div className="mt-4 rounded-2xl border border-white/[0.06] bg-black/15 p-4">
                      <DocumentPreview
                        content={document.content}
                      />
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                        <CheckCircle2 className="h-4 w-4" />
                        Version {document.version || "1.0"}
                      </div>

                      <span className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-black text-cyan-200 transition group-hover:bg-cyan-400/15">
                        View document
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
              <FileText className="mx-auto h-8 w-8 text-slate-600" />

              <h3 className="mt-4 text-lg font-black">
                No public documents yet
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-500">
                The business has not published any compliance documents on this
                Trust Center yet.
              </p>
            </div>
          )}
        </section>
      </section>

      {selectedDocument && (
        <DocumentModal
          selectedDocument={selectedDocument}
          primaryColor={primaryColor}
          onClose={() => setSelectedDocument(null)}
        />
      )}

      <Footer />
    </main>
  );
}

function DocumentPreview({ content }) {
  const lines = String(content || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const previewLines = lines.slice(0, 5);

  if (previewLines.length === 0) {
    return (
      <p className="text-sm leading-7 text-slate-500">
        Open this document to review its published content.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {previewLines.map((line, index) => {
        const cleanLine = line
          .replace(/^#{1,6}\s*/, "")
          .replace(/^[-*]\s+/, "");

        const isHeading = /^#{1,6}\s+/.test(line);

        return isHeading ? (
          <p
            key={`${cleanLine}-${index}`}
            className="text-sm font-bold text-slate-200"
          >
            {cleanLine}
          </p>
        ) : (
          <p
            key={`${cleanLine}-${index}`}
            className="line-clamp-2 text-sm leading-6 text-slate-400"
          >
            {cleanLine}
          </p>
        );
      })}

      {lines.length > previewLines.length && (
        <p className="text-xs font-semibold text-slate-600">
          Continue reading…
        </p>
      )}
    </div>
  );
}

function DocumentModal({
  selectedDocument,
  primaryColor,
  onClose,
}) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.document.body.style.overflow = "hidden";
    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.document.body.style.overflow = "";
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose]);

  if (!selectedDocument) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[120] overflow-y-auto bg-black/80 px-4 py-6 backdrop-blur-md"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="public-document-title"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#08111d] shadow-[0_35px_120px_rgba(0,0,0,0.65)]"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.12),transparent_70%)]" />
          <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.4)_1px,transparent_1px)] [background-size:38px_38px]" />
        </div>

        <header className="relative border-b border-white/10 px-6 py-6 sm:px-8">
          <div className="flex items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
                style={{
                  backgroundColor: `${primaryColor}18`,
                  borderColor: `${primaryColor}45`,
                }}
              >
                <FileText
                  className="h-5 w-5"
                  style={{ color: primaryColor }}
                />
              </span>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  {selectedDocument.category || "Governance"}
                </p>

                <h2
                  id="public-document-title"
                  className="mt-1 text-2xl font-black text-white sm:text-3xl"
                >
                  {selectedDocument.title}
                </h2>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Approved
                  </span>

                  <span className="text-xs font-semibold text-slate-500">
                    Version {selectedDocument.version || "1.0"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close document"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <article className="relative max-h-[72vh] overflow-y-auto px-6 py-7 sm:px-8 sm:py-9">
          <FormattedDocumentContent
            content={selectedDocument.content}
            primaryColor={primaryColor}
          />
        </article>
      </div>
    </div>
  );
}

function FormattedDocumentContent({
  content,
  primaryColor,
}) {
  const lines = String(content || "")
    .split("\n");

  if (!String(content || "").trim()) {
    return (
      <p className="text-sm leading-7 text-slate-400">
        This document does not contain any published content yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {lines.map((rawLine, index) => {
        const line = rawLine.trim();

        if (!line) {
          return (
            <div
              key={`space-${index}`}
              className="h-2"
            />
          );
        }

        if (/^###\s+/.test(line)) {
          return (
            <h4
              key={`${line}-${index}`}
              className="pt-2 text-lg font-black text-white"
            >
              {line.replace(/^###\s+/, "")}
            </h4>
          );
        }

        if (/^##\s+/.test(line)) {
          return (
            <h3
              key={`${line}-${index}`}
              className="border-b border-white/10 pb-3 pt-4 text-xl font-black text-white"
            >
              {line.replace(/^##\s+/, "")}
            </h3>
          );
        }

        if (/^#\s+/.test(line)) {
          return (
            <h2
              key={`${line}-${index}`}
              className="border-b border-white/10 pb-4 text-2xl font-black text-white"
            >
              {line.replace(/^#\s+/, "")}
            </h2>
          );
        }

        if (/^[-*]\s+/.test(line)) {
          return (
            <div
              key={`${line}-${index}`}
              className="flex items-start gap-3 text-sm leading-7 text-slate-300"
            >
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: primaryColor,
                }}
              />
              <span>
                {line.replace(/^[-*]\s+/, "")}
              </span>
            </div>
          );
        }

        return (
          <p
            key={`${line}-${index}`}
            className="whitespace-pre-wrap text-sm leading-8 text-slate-300"
          >
            {line}
          </p>
        );
      })}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p
        className="mt-2 text-2xl font-black"
        style={{ color }}
      >
        {value}
      </p>
    </div>
  );
}
