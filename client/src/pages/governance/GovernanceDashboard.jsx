import GovernanceSidebar from "../../components/governance/GovernanceSidebar";

import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock,
  Database,
  Lock,
  Scale,
} from "lucide-react";

const stats = [
  { label: "Overall Governance", value: "72%", icon: ShieldCheck },
  { label: "Active Policies", value: "9", icon: FileText },
  { label: "Need Review", value: "3", icon: Clock },
  { label: "Open Risks", value: "4", icon: AlertTriangle },
];

const documents = [
  {
    title: "Privacy Policy",
    category: "Privacy",
    version: "1.0",
    status: "Active",
    nextReview: "Jan 5, 2027",
    icon: Lock,
  },
  {
    title: "Terms of Service",
    category: "Legal",
    version: "1.0",
    status: "Active",
    nextReview: "Jan 5, 2027",
    icon: Scale,
  },
  {
    title: "Security Policy",
    category: "Security",
    version: "1.0",
    status: "Active",
    nextReview: "Jan 5, 2027",
    icon: ShieldCheck,
  },
  {
    title: "Data Governance Policy",
    category: "Data",
    version: "1.0",
    status: "Active",
    nextReview: "Jan 5, 2027",
    icon: Database,
  },
];

const risks = [
  "Vendor dependency risk",
  "Data retention review needed",
  "AI output accuracy monitoring",
  "Policy review cycle tracking",
];

const vendors = ["Vercel", "Render", "Supabase", "Stripe", "Resend"];

export default function GovernanceDashboard() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_1fr]">
        <GovernanceSidebar />

        <div>
          <section className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 to-cyan-500/5 p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10">
                <ShieldCheck className="h-7 w-7 text-emerald-400" />
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">
                  AEMA Governance
                </p>

                <h1 className="mt-2 text-4xl font-black">
                  Governance Dashboard
                </h1>
              </div>
            </div>

            <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-300">
              Internal control center for AEMA Systems policies, compliance,
              security, risk management, vendor tracking, and governance
              reviews.
            </p>
          </section>

          <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <Icon className="h-6 w-6 text-emerald-400" />

                  <h2 className="mt-5 text-4xl font-black">{stat.value}</h2>

                  <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
                </div>
              );
            })}
          </section>

          <section className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400" />
                <h2 className="text-xl font-bold">Governance Documents</h2>
              </div>

              <div className="grid gap-4">
                {documents.map((doc) => {
                  const Icon = doc.icon;

                  return (
                    <div
                      key={doc.title}
                      className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
                    >
                      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10">
                            <Icon className="h-6 w-6 text-cyan-400" />
                          </div>

                          <div>
                            <h3 className="font-bold text-white">
                              {doc.title}
                            </h3>

                            <p className="mt-1 text-sm text-slate-400">
                              {doc.category} · Version {doc.version}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 text-xs">
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-300">
                            {doc.status}
                          </span>

                          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-slate-400">
                            Review: {doc.nextReview}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className="grid gap-6">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  <h2 className="font-bold">Risk Register</h2>
                </div>

                <div className="grid gap-3">
                  {risks.map((risk) => (
                    <div
                      key={risk}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-400"
                    >
                      {risk}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-cyan-400" />
                  <h2 className="font-bold">Key Vendors</h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {vendors.map((vendor) => (
                    <span
                      key={vendor}
                      className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300"
                    >
                      {vendor}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-4 flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-emerald-400" />
                  <h2 className="font-bold">Upcoming Reviews</h2>
                </div>

                <div className="grid gap-3 text-sm text-slate-400">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Privacy Policy — Jan 5, 2027
                  </p>

                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Security Policy — Jan 5, 2027
                  </p>

                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Responsible AI — Jan 5, 2027
                  </p>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </main>
  );
}