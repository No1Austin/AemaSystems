import {
  Bell,
  CalendarClock,
  Lock,
  Mail,
  Settings,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import GovernanceSidebar from "../../components/governance/GovernanceSidebar";

const settings = [
  {
    title: "Governance Owner",
    value: "AEMA Systems",
    description: "Responsible for maintaining governance records.",
    icon: UserCheck,
  },
  {
    title: "Review Frequency",
    value: "Every 6–12 months",
    description: "Policies should be reviewed at least annually.",
    icon: CalendarClock,
  },
  {
    title: "Trust Contact",
    value: "trust@aemasystems.com",
    description: "Main contact for privacy, compliance, and trust questions.",
    icon: Mail,
  },
  {
    title: "Security Contact",
    value: "security@aemasystems.com",
    description: "Contact for security issues and vulnerability reports.",
    icon: Lock,
  },
  {
    title: "Notifications",
    value: "Planned",
    description: "Future reminders for reviews, risks, and vendor checks.",
    icon: Bell,
  },
];

export default function GovernanceSettings() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_1fr]">
        <GovernanceSidebar />

        <div>
          <section className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.04] p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10">
                <Settings className="h-7 w-7 text-cyan-400" />
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
                  Governance Settings
                </p>
                <h1 className="mt-2 text-4xl font-black">Settings</h1>
              </div>
            </div>

            <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-300">
              Configure the basic governance ownership, review cycle, contacts,
              security expectations, and future notification settings for AEMA
              Systems.
            </p>
          </section>

          <section className="mt-8 grid gap-4">
            {settings.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10">
                        <Icon className="h-6 w-6 text-emerald-400" />
                      </div>

                      <div>
                        <h2 className="text-lg font-bold">{item.title}</h2>
                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
                      {item.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-bold">Governance Principle</h2>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              AEMA Systems should maintain accurate governance records, review
              policies regularly, track key risks, and improve internal controls
              as the business grows.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}