import GovernanceSidebar from "./GovernanceSidebar";

export default function GovernanceLayout({
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
    },
    cyan: {
      border: "border-cyan-400/20",
      bg: "bg-cyan-400/[0.04]",
      iconBg: "bg-cyan-400/10",
      text: "text-cyan-400",
    },
    amber: {
      border: "border-amber-400/20",
      bg: "bg-amber-400/[0.04]",
      iconBg: "bg-amber-400/10",
      text: "text-amber-400",
    },
  };

  const style = accentStyles[accent] || accentStyles.emerald;

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_1fr]">
        <GovernanceSidebar />

        <div>
          <section
            className={`rounded-3xl border ${style.border} ${style.bg} p-8`}
          >
            <div className="flex items-center gap-4">
              {Icon && (
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${style.iconBg}`}
                >
                  <Icon className={`h-7 w-7 ${style.text}`} />
                </div>
              )}

              <div>
                {badge && (
                  <p
                    className={`text-sm uppercase tracking-[0.3em] ${style.text}`}
                  >
                    {badge}
                  </p>
                )}

                <h1 className="mt-2 text-4xl font-black">{title}</h1>
              </div>
            </div>

            {description && (
              <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-300">
                {description}
              </p>
            )}
          </section>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </main>
  );
}