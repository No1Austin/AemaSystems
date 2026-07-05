import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function TrustLayout({
  title,
  description,
  version = "1.0",
  effectiveDate = "July 5, 2026",
  lastReviewed = "July 5, 2026",
  nextReview = "January 5, 2027",
  children,
}) {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.10),transparent_25%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.10),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20">

        {/* Back Button */}

        <a
          href="/trust"
          className="mb-8 inline-flex items-center gap-2 text-sm text-cyan-400 transition hover:text-cyan-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Trust Center
        </a>

        {/* Hero */}

        <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 to-cyan-500/5 p-10">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10">
              <ShieldCheck className="h-8 w-8 text-emerald-400" />
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">
                AEMA Trust Center
              </p>

              <h1 className="mt-2 text-4xl font-black">
                {title}
              </h1>
            </div>

          </div>

          <p className="mt-8 max-w-4xl text-slate-300 leading-8">
            {description}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">

            <InfoCard
              label="Version"
              value={version}
            />

            <InfoCard
              label="Effective"
              value={effectiveDate}
            />

            <InfoCard
              label="Reviewed"
              value={lastReviewed}
            />

            <InfoCard
              label="Next Review"
              value={nextReview}
            />

          </div>

        </div>

        {/* Content */}

        <div className="mt-10">
          {children}
        </div>

        {/* Footer */}

        <div className="mt-20 rounded-3xl border border-white/10 bg-white/[0.03] p-8">

          <h3 className="text-2xl font-bold">
            Our Promise
          </h3>

          <p className="mt-4 max-w-3xl leading-8 text-slate-400">
            We believe trust is earned through transparency,
            responsible innovation, continuous improvement,
            and respect for every business we serve.

            Every product developed by AEMA Systems is guided
            by these principles.
          </p>

          <div className="mt-8 border-t border-white/10 pt-6">

            <p className="text-sm text-slate-500">
              Questions?

              <a
                href="mailto:trust@aemasystems.com"
                className="ml-2 text-emerald-400 hover:text-emerald-300"
              >
                trust@aemasystems.com
              </a>

            </p>

          </div>

        </div>

      </div>
    </main>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

      <p className="text-xs uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <h3 className="mt-2 text-lg font-bold">
        {value}
      </h3>

    </div>
  );
}