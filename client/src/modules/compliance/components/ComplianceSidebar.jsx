import {
  Bot,
  ClipboardCheck,
  CreditCard,
  FileText,
  Globe,
  HelpCircle,
  Home,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    label: "Overview",
    href: "/compliance-os",
    icon: Home,
    end: true,
  },
  {
    label: "Assessment",
    href: "/compliance-os/assessment",
    icon: ClipboardCheck,
  },
  {
    label: "AEMA Trust Center",
    href: "/trust",
    icon: Globe,
  },
];

const upcomingItems = [
  {
    label: "AI Compliance",
    icon: Bot,
  },
  {
    label: "My Documents",
    icon: FileText,
  },
  {
    label: "Hosted Trust Page",
    icon: ShieldCheck,
  },
  {
    label: "Billing",
    icon: CreditCard,
  },
];

export default function ComplianceSidebar() {
  return (
    <aside className="self-start rounded-3xl border border-white/10 bg-[#080c19] p-5 lg:sticky lg:top-24">
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
            <ShieldCheck className="h-6 w-6 text-emerald-300" />
          </span>

          <div className="min-w-0">
            <h2 className="font-bold leading-6 text-white">
              AEMA Compliance OS
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              AI-guided compliance readiness
            </p>
          </div>
        </div>
      </div>

      <nav className="mt-6 space-y-2">
        <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">
          Workspace
        </p>

        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                    : "border-transparent text-slate-400 hover:bg-white/[0.05] hover:text-white"
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="my-6 border-t border-white/10" />

      <div className="space-y-2">
        <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">
          After payment
        </p>

        {upcomingItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              title="Available after payment or currently being developed"
              className="flex cursor-not-allowed items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm text-slate-600"
            >
              <Icon className="h-5 w-5 shrink-0" />

              <span className="flex-1">
                {item.label}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Soon
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05] p-4">
        <div className="flex items-start gap-3">
          <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />

          <div>
            <p className="text-sm font-bold text-white">
              Progress is saved
            </p>

            <p className="mt-2 text-xs leading-6 text-slate-500">
              Your assessment answers remain stored in this browser until you
              deliberately clear the saved draft.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300">
          Complete package
        </p>

        <p className="mt-2 text-2xl font-black text-white">
          $29.99
          <span className="ml-1 text-xs font-medium text-slate-500">
            CAD
          </span>
        </p>

        <p className="mt-2 text-xs leading-6 text-slate-500">
          Includes tailored documents, readiness results, downloads, and
          hosted compliance-page options.
        </p>
      </div>

      <a
        href="mailto:support@aemasystems.com"
        className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
      >
        <HelpCircle className="h-5 w-5" />
        Get support
      </a>
    </aside>
  );
}