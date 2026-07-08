import {
  ClipboardCheck,
  FileText,
  ShieldCheck,
  Globe,
  CreditCard,
  Bot,
} from "lucide-react";
import { Link } from "react-router-dom";

const items = [
  {
    label: "Assessment",
    href: "/compliance-os",
    icon: ClipboardCheck,
  },
  {
    label: "AI Compliance",
    href: "/compliance-os",
    icon: Bot,
  },
  {
    label: "Documents",
    href: "/compliance-os",
    icon: FileText,
  },
  {
    label: "Trust Center",
    href: "/compliance-os",
    icon: Globe,
  },
  {
    label: "Billing",
    href: "/compliance-os",
    icon: CreditCard,
  },
];

export default function ComplianceSidebar() {
  return (
    <aside className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-7 w-7 text-emerald-400" />

          <div>
            <h2 className="font-bold text-white">
              AEMA Compliance OS
            </h2>

            <p className="text-xs text-slate-400">
              AI Compliance Platform
            </p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-emerald-400"
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}