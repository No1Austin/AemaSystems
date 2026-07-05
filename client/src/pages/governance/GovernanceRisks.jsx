import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import GovernanceSidebar from "../../components/governance/GovernanceSidebar";

const risks = [
  {
    risk: "Stripe payment failure",
    category: "Payments",
    likelihood: "Medium",
    impact: "High",
    status: "Open",
    mitigation: "Monitor failed payments and maintain Stripe webhook checks.",
  },
  {
    risk: "Supabase outage",
    category: "Infrastructure",
    likelihood: "Low",
    impact: "High",
    status: "Open",
    mitigation: "Maintain backups and document recovery steps.",
  },
  {
    risk: "AI-generated inaccurate recommendations",
    category: "AI Governance",
    likelihood: "Medium",
    impact: "High",
    status: "Mitigating",
    mitigation: "Use AI disclaimers, human review, and clear limitations.",
  },
  {
    risk: "Admin password compromise",
    category: "Security",
    likelihood: "Medium",
    impact: "High",
    status: "Mitigating",
    mitigation: "Use strong passwords, MFA, and restricted admin access.",
  },
  {
    risk: "Missing HST registration",
    category: "Finance",
    likelihood: "Medium",
    impact: "Medium",
    status: "Open",
    mitigation: "Register for HST when required and update billing records.",
  },
];

export default function GovernanceRisks() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_1fr]">
        <GovernanceSidebar />

        <div>
          <section className="rounded-3xl border border-amber-400/20 bg-amber-400/[0.04] p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10">
                <ShieldAlert className="h-7 w-7 text-amber-400" />
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-amber-400">
                  Risk Register
                </p>
                <h1 className="mt-2 text-4xl font-black">Governance Risks</h1>
              </div>
            </div>

            <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-300">
              Track operational, security, privacy, AI, financial, and vendor
              risks that may affect AEMA Systems.
            </p>
          </section>

          <section className="mt-8 grid gap-4">
            {risks.map((item) => (
              <div
                key={item.risk}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                      <h2 className="text-lg font-bold">{item.risk}</h2>
                    </div>

                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {item.mitigation}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-300">
                      {item.category}
                    </span>

                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-slate-400">
                      Likelihood: {item.likelihood}
                    </span>

                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-slate-400">
                      Impact: {item.impact}
                    </span>

                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-300">
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-bold">Risk Management Principle</h2>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              AEMA Systems should review risks regularly, update mitigations,
              and close risks only when reasonable controls are in place.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              Review risks at least every 90 days.
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}