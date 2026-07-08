import {
  AlertTriangle,
  Building2,
  CalendarClock,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  Settings,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/governance", icon: LayoutDashboard },
  { label: "Assessment", href: "/governance/assessment", icon: ClipboardCheck },
  { label: "Documents", href: "/governance/documents", icon: FileText },
  { label: "Risks", href: "/governance/risks", icon: AlertTriangle },
  { label: "Vendors", href: "/governance/vendors", icon: Building2 },
  { label: "Reviews", href: "/governance/reviews", icon: CalendarClock },
  { label: "Settings", href: "/governance/settings", icon: Settings },
];

export default function GovernanceSidebar() {
  return (
    <aside className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
        <ShieldCheck className="h-6 w-6 text-emerald-400" />

        <div>
          <h2 className="text-sm font-bold text-white">AEMA Governance</h2>
          <p className="text-xs text-slate-400">Internal control center</p>
        </div>
      </div>

      <nav className="grid gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/[0.05] hover:text-emerald-400"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}