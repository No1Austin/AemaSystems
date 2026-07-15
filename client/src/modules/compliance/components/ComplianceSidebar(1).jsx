import {
  Bot,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  FileText,
  Fingerprint,
  Globe,
  HelpCircle,
  Home,
  LayoutDashboard,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { NavLink, useSearchParams } from "react-router-dom";

const publicNavigationItems = [
  {
    label: "Overview",
    path: "/compliance-os",
    icon: Home,
    end: true,
  },
  {
    label: "Assessment",
    path: "/compliance-os/assessment",
    icon: ClipboardCheck,
  },
];

const workspaceNavigationItems = [
  {
    label: "Dashboard",
    path: "/compliance-dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "My Documents",
    path: "/compliance-dashboard/documents",
    icon: FileText,
  },
  {
    label: "AI Compliance",
    path: "/compliance-dashboard/ai",
    icon: Bot,
  },
  {
    label: "Hosted Trust Page",
    path: "/compliance-dashboard/trust-center",
    icon: ShieldCheck,
  },
  {
    label: "Billing",
    path: "/compliance-dashboard/billing",
    icon: CreditCard,
  },
];

export default function ComplianceSidebar({
  workspaceId: workspaceIdProp = "",
  assessmentId: assessmentIdProp = "",
  businessName = "AEMA Compliance OS",
  documentCount = 0,
  hostingStatus = "inactive",
  paymentStatus = "",
}) {
  const [searchParams] = useSearchParams();

  const workspaceId =
    workspaceIdProp ||
    searchParams.get("workspace_id") ||
    localStorage.getItem("aema_compliance_workspace_id") ||
    "";

  const assessmentId =
    assessmentIdProp ||
    searchParams.get("assessment_id") ||
    localStorage.getItem("aema_compliance_assessment_id") ||
    "";

  const normalizedPaymentStatus = String(
    paymentStatus ||
      localStorage.getItem("aema_compliance_payment_status") ||
      ""
  ).toLowerCase();

  const hasWorkspace = Boolean(workspaceId);

  const hasPaidAccess =
    hasWorkspace ||
    normalizedPaymentStatus === "paid";

  const navigationItems = hasPaidAccess
    ? workspaceNavigationItems
    : publicNavigationItems;

  function buildWorkspaceUrl(path) {
    if (!hasPaidAccess) {
      return path;
    }

    const params = new URLSearchParams();

    if (workspaceId) {
      params.set("workspace_id", workspaceId);
    }

    if (assessmentId) {
      params.set("assessment_id", assessmentId);
    }

    const query = params.toString();

    return query
      ? `${path}?${query}`
      : path;
  }

  return (
    <aside className="relative self-start overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-[#07101b] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.42)] lg:sticky lg:top-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.18),transparent_72%)]" />
        <div className="absolute -left-16 top-28 h-48 w-48 rounded-full bg-emerald-400/[0.09] blur-3xl" />
        <div className="absolute -right-20 bottom-24 h-56 w-56 rounded-full bg-cyan-400/[0.08] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.45)_1px,transparent_1px)] [background-size:30px_30px]" />
        <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-cyan-300/25 via-white/5 to-transparent" />
      </div>

      <div className="relative">
        <div className="overflow-hidden rounded-[1.5rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-400/[0.11] via-cyan-400/[0.05] to-white/[0.025] p-5 shadow-[0_0_40px_rgba(52,211,153,0.08)]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 shadow-[0_0_28px_rgba(52,211,153,0.12)]">
                <ShieldCheck className="h-6 w-6 text-emerald-300" />

                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#07101b] bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
              </span>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                  {hasPaidAccess
                    ? "Customer workspace"
                    : "Governance workspace"}
                </p>

                <h2 className="mt-1 truncate font-black leading-6 text-white">
                  {businessName}
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {hasPaidAccess
                    ? "Documents, hosting, and governance"
                    : "AI-guided compliance readiness"}
                </p>
              </div>
            </div>

            <Sparkles className="h-4 w-4 shrink-0 text-cyan-300" />
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-3.5 w-3.5 text-cyan-300" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">
                Secure session
              </span>
            </div>

            <span className="font-mono text-[10px] text-emerald-300">
              ACTIVE
            </span>
          </div>
        </div>

        <nav className="mt-6 space-y-2">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            {hasPaidAccess
              ? "Customer workspace"
              : "Compliance OS"}
          </p>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const target = buildWorkspaceUrl(
              item.path
            );

            return (
              <NavLink
                key={item.label}
                to={target}
                end={item.end}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 text-sm font-medium transition duration-300 ${
                    isActive
                      ? "border-cyan-400/25 bg-gradient-to-r from-cyan-400/[0.10] via-emerald-400/[0.05] to-transparent text-white shadow-[0_0_28px_rgba(34,211,238,0.08)]"
                      : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.045] hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute inset-y-3 left-0 w-[2px] rounded-full bg-gradient-to-b from-cyan-300 to-emerald-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                    )}

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition ${
                        isActive
                          ? "border-cyan-400/20 bg-cyan-400/10"
                          : "border-white/10 bg-white/[0.03] group-hover:border-cyan-400/15 group-hover:bg-cyan-400/[0.06]"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          isActive
                            ? "text-cyan-300"
                            : "text-slate-500 group-hover:text-cyan-300"
                        }`}
                      />
                    </span>

                    <span className="flex-1">
                      {item.label}
                    </span>

                    <ChevronRight
                      className={`h-4 w-4 transition ${
                        isActive
                          ? "translate-x-0 text-cyan-300"
                          : "-translate-x-1 text-slate-700 group-hover:translate-x-0 group-hover:text-slate-400"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {hasPaidAccess ? (
          <>
            <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <section className="grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Generated documents
                </p>

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-2xl font-black text-white">
                    {documentCount}
                  </p>

                  <FileText className="h-4 w-4 text-cyan-300" />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Hosted Trust Center
                </p>

                <div className="mt-2 flex items-center justify-between">
                  <p
                    className={`text-sm font-black ${
                      hostingStatus === "active"
                        ? "text-emerald-300"
                        : "text-slate-400"
                    }`}
                  >
                    {hostingStatus === "active"
                      ? "Active"
                      : "Not activated"}
                  </p>

                  <Globe className="h-4 w-4 text-emerald-300" />
                </div>
              </div>
            </section>

            <div className="mt-5 overflow-hidden rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-cyan-400/[0.08] via-white/[0.025] to-transparent p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-cyan-300">
                Compliance OS Pro
              </p>

              <p className="mt-2 text-xs leading-6 text-slate-500">
                Host your branded Trust Center, publish approved policies, and manage ongoing reviews.
              </p>

              <p className="mt-3 text-sm font-black text-white">
                $19.99 CAD/month
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="space-y-2">
              <div className="flex items-center justify-between px-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  After payment
                </p>

                <span className="rounded-full border border-cyan-400/15 bg-cyan-400/[0.05] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-cyan-300">
                  Locked
                </span>
              </div>

              {workspaceNavigationItems
                .slice(1)
                .map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex cursor-not-allowed items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-600"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#09111d]">
                        <Icon className="h-4 w-4" />
                      </span>

                      <span className="flex-1">
                        {item.label}
                      </span>

                      <span className="font-mono text-[9px] text-slate-700">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>
                    </div>
                  );
                })}
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-cyan-400/[0.08] via-white/[0.025] to-transparent p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                  <LockKeyhole className="h-4 w-4 text-cyan-300" />
                </span>

                <div>
                  <p className="text-sm font-bold text-white">
                    Progress is saved
                  </p>

                  <p className="mt-1.5 text-xs leading-6 text-slate-500">
                    Your assessment remains saved until you deliberately restart it.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-emerald-400/15 bg-gradient-to-br from-emerald-400/[0.09] via-cyan-400/[0.035] to-transparent p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-emerald-300">
                    Complete package
                  </p>

                  <p className="mt-2 text-3xl font-black tracking-tight text-white">
                    $29.99
                    <span className="ml-1 text-xs font-medium text-slate-500">
                      CAD
                    </span>
                  </p>
                </div>

                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-emerald-300">
                  One-time
                </span>
              </div>
            </div>
          </>
        )}

        <a
          href="mailto:support@aemasystems.com"
          className="group mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-slate-400 transition duration-300 hover:border-cyan-400/20 hover:bg-cyan-400/[0.05] hover:text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition group-hover:border-cyan-400/20 group-hover:bg-cyan-400/10">
            <HelpCircle className="h-4 w-4 transition group-hover:text-cyan-300" />
          </span>

          <span className="flex-1">
            Get support
          </span>

          <ChevronRight className="h-4 w-4 text-slate-700 transition group-hover:translate-x-1 group-hover:text-cyan-300" />
        </a>
      </div>
    </aside>
  );
}
