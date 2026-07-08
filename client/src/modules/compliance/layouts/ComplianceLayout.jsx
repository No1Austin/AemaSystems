import ComplianceSidebar from "../components/ComplianceSidebar";

export default function ComplianceLayout({
  children,
  badge,
  title,
  description,
  icon: Icon,
  accent = "emerald",
}) {
  const accentStyles = {
    emerald: {
      border: "border-emerald-400/20",
      bg: "bg-emerald-400/[0.04]",
      iconBg: "bg-emerald-400/10",
      text: "text-emerald-400",
      glow: "shadow-emerald-500/10",
    },

    cyan: {
      border: "border-cyan-400/20",
      bg: "bg-cyan-400/[0.04]",
      iconBg: "bg-cyan-400/10",
      text: "text-cyan-400",
      glow: "shadow-cyan-500/10",
    },

    amber: {
      border: "border-amber-400/20",
      bg: "bg-amber-400/[0.04]",
      iconBg: "bg-amber-400/10",
      text: "text-amber-400",
      glow: "shadow-amber-500/10",
    },

    rose: {
      border: "border-rose-400/20",
      bg: "bg-rose-400/[0.04]",
      iconBg: "bg-rose-400/10",
      text: "text-rose-400",
      glow: "shadow-rose-500/10",
    },
  };

  const style = accentStyles[accent] || accentStyles.emerald;

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[290px_1fr]">

        {/* Sidebar */}

        <ComplianceSidebar />

        {/* Main Content */}

        <section className="space-y-8">

          {/* Page Header */}

          <header
            className={`rounded-3xl border ${style.border} ${style.bg} ${style.glow} p-8 shadow-xl`}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">

              {Icon && (
                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl ${style.iconBg}`}
                >
                  <Icon className={`h-8 w-8 ${style.text}`} />
                </div>
              )}

              <div className="flex-1">

                {badge && (
                  <span
                    className={`inline-flex rounded-full border ${style.border} px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${style.text}`}
                  >
                    {badge}
                  </span>
                )}

                <h1 className="mt-4 text-4xl font-black tracking-tight">
                  {title}
                </h1>

                {description && (
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}

          <section className="space-y-8">
            {children}
          </section>

        </section>

      </div>
    </main>
  );
}