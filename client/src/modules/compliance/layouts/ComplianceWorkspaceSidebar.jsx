import {
  ChevronRight,
  FileCheck2,
  FileText,
  Globe2,
  Loader2,
  LockKeyhole,
} from "lucide-react";
import {
  Link,
  useLocation,
  useSearchParams,
} from "react-router-dom";

const generatedDocuments = [
  { label: "Privacy Policy", slug: "privacy-policy" },
  { label: "Terms of Service", slug: "terms-of-service" },
  { label: "Cookie Policy", slug: "cookie-policy" },
  {
    label: "Information Security Policy",
    slug: "information-security-policy",
  },
  {
    label: "Incident Response Plan",
    slug: "incident-response-plan",
  },
  {
    label: "Responsible AI Policy",
    slug: "responsible-ai-policy",
  },
];

export default function ComplianceWorkspaceSidebar({
  documentsGenerated = true,
  assessmentId = "",
  workspaceId = "",
  workspaceSlug = "",
  startingHosting = false,
  hostingMessage = "",
  hostingStatus = "inactive",
  trustCenterUrl = "",
  onStartHosting,
}) {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const resolvedAssessmentId =
    assessmentId ||
    searchParams.get("assessment_id") ||
    "";

  const resolvedWorkspaceId =
    workspaceId ||
    searchParams.get("workspace_id") ||
    "";

  const canOpenDocuments =
    Boolean(documentsGenerated) &&
    Boolean(resolvedAssessmentId) &&
    Boolean(resolvedWorkspaceId);

  const hostingActive =
    String(hostingStatus).toLowerCase() === "active";

  function buildDocumentUrl(slug = "") {
    if (!canOpenDocuments) return "#";

    const pathname = slug
      ? `/compliance-dashboard/documents/${slug}`
      : "/compliance-dashboard/documents";

    const params = new URLSearchParams({
      workspace_id: resolvedWorkspaceId,
      assessment_id: resolvedAssessmentId,
    });

    return `${pathname}?${params.toString()}`;
  }

  return (
    <aside className="relative self-start overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-[#07101b] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.42)] lg:sticky lg:top-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.14),transparent_72%)]" />
        <div className="absolute -left-16 top-20 h-48 w-48 rounded-full bg-emerald-400/[0.07] blur-3xl" />
        <div className="absolute -right-20 bottom-12 h-56 w-56 rounded-full bg-cyan-400/[0.06] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.4)_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="relative space-y-5">
        <section className="overflow-hidden rounded-[1.5rem] border border-cyan-400/15 bg-white/[0.025] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                Generated documents
              </p>

              <h2 className="mt-1 text-base font-black text-white">
                Your compliance files
              </h2>
            </div>

            <span
              className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${
                documentsGenerated
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                  : "border-white/10 bg-white/[0.03] text-slate-600"
              }`}
            >
              {documentsGenerated ? "Ready" : "Preparing"}
            </span>
          </div>

          <p className="mt-2 text-[11px] leading-5 text-slate-500">
            Open and review every document generated from your assessment.
          </p>

          <div className="mt-4 space-y-2">
            {generatedDocuments.map((document) => {
              const href = buildDocumentUrl(document.slug);
              const isActive =
                location.pathname ===
                `/compliance-dashboard/documents/${document.slug}`;

              return (
                <Link
                  key={document.slug}
                  to={href}
                  onClick={(event) => {
                    if (!canOpenDocuments) {
                      event.preventDefault();
                    }
                  }}
                  aria-disabled={!canOpenDocuments}
                  className={`group flex items-center gap-3 rounded-2xl border px-3 py-3 text-xs transition ${
                    isActive
                      ? "border-cyan-400/25 bg-cyan-400/[0.08] text-white"
                      : canOpenDocuments
                      ? "border-white/[0.07] bg-black/15 text-slate-300 hover:border-cyan-400/20 hover:bg-cyan-400/[0.05] hover:text-white"
                      : "cursor-not-allowed border-transparent text-slate-700"
                  }`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#09111d]">
                    <FileText
                      className={`h-4 w-4 ${
                        canOpenDocuments
                          ? "text-cyan-300"
                          : "text-slate-700"
                      }`}
                    />
                  </span>

                  <span className="min-w-0 flex-1 truncate">
                    {document.label}
                  </span>

                  {canOpenDocuments ? (
                    <ChevronRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-cyan-300" />
                  ) : (
                    <LockKeyhole className="h-3.5 w-3.5 text-slate-700" />
                  )}
                </Link>
              );
            })}
          </div>

          <Link
            to={buildDocumentUrl()}
            onClick={(event) => {
              if (!canOpenDocuments) {
                event.preventDefault();
              }
            }}
            aria-disabled={!canOpenDocuments}
            className={`mt-3 flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-xs font-bold transition ${
              canOpenDocuments
                ? "border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-400/20 hover:bg-cyan-400/[0.06] hover:text-white"
                : "cursor-not-allowed border-white/[0.05] bg-white/[0.015] text-slate-700"
            }`}
          >
            <FileCheck2 className="h-4 w-4" />
            View all generated documents
          </Link>
        </section>

        <section className="overflow-hidden rounded-[1.5rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-400/[0.10] via-cyan-400/[0.05] to-white/[0.02] p-4 shadow-[0_0_36px_rgba(52,211,153,0.07)]">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
              <Globe2 className="h-5 w-5 text-emerald-300" />
            </span>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                Host your compliance
              </p>

              <h3 className="mt-1 text-sm font-black text-white">
                Publish your Trust Center
              </h3>

              <p className="mt-2 text-[11px] leading-5 text-slate-400">
                AEMA creates a public compliance link using your generated
                policies and governance information.
              </p>
            </div>
          </div>

          {hostingActive ? (
            <>
              <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300">
                  Hosting active
                </p>

                <p className="mt-1 text-[11px] leading-5 text-slate-400">
                  Your public Trust Center is live.
                </p>
              </div>

              {trustCenterUrl && (
                <a
                  href={trustCenterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs font-black text-emerald-200 transition hover:bg-emerald-400/15"
                >
                  <Globe2 className="h-4 w-4" />
                  View hosted Trust Center
                </a>
              )}
            </>
          ) : (
            <>
              <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-300">
                      First month free
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-slate-500">
                      Add your card now. Billing starts after 30 days.
                    </p>
                  </div>

                  <span className="shrink-0 text-right">
                    <strong className="block text-xl font-black text-white">
                      $19.99
                    </strong>

                    <span className="text-[9px] text-slate-500">
                      CAD / month
                    </span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onStartHosting}
                disabled={
                  startingHosting ||
                  !documentsGenerated ||
                  !resolvedAssessmentId ||
                  !resolvedWorkspaceId ||
                  !onStartHosting
                }
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-300 px-4 py-3 text-xs font-black text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {startingHosting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Opening secure checkout...
                  </>
                ) : (
                  <>
                    <Globe2 className="h-4 w-4" />
                    Host my compliance
                  </>
                )}
              </button>
            </>
          )}

          {workspaceSlug && (
            <p className="mt-2 text-center text-[10px] leading-5 text-slate-500">
              Workspace: {workspaceSlug}
            </p>
          )}

          {hostingMessage && (
            <p className="mt-3 rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-[10px] leading-5 text-rose-100">
              {hostingMessage}
            </p>
          )}

          {!hostingActive && (
            <p className="mt-3 text-center text-[9px] leading-4 text-slate-600">
              Cancel before the free period ends to avoid the first monthly charge.
            </p>
          )}
        </section>
      </div>
    </aside>
  );
}
