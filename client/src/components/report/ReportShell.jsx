export function ReportCard({ children, className = "" }) {
  return (
    <section
      className={`rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8 shadow-xl shadow-black/10 ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="mb-2 text-xs uppercase tracking-[0.28em] text-blue-300">
          {eyebrow}
        </p>
      )}
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      {description && (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}

export function MetricCard({ label, value, note, tone = "blue" }) {
  const toneMap = {
    blue: "from-blue-500/20 to-cyan-500/5 border-blue-400/20",
    emerald: "from-emerald-500/20 to-cyan-500/5 border-emerald-400/20",
    amber: "from-amber-500/20 to-orange-500/5 border-amber-400/20",
    violet: "from-violet-500/20 to-blue-500/5 border-violet-400/20",
  };

  return (
    <div
      className={`rounded-3xl border bg-gradient-to-br p-5 ${
        toneMap[tone] || toneMap.blue
      }`}
    >
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
      {note && <p className="mt-2 text-xs leading-5 text-slate-500">{note}</p>}
    </div>
  );
}

export function ProgressBar({ label, value, note }) {
  const percent = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div>
      <div className="mb-2 flex justify-between gap-4 text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-bold text-blue-300">{percent}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
      {note && <p className="mt-1 text-xs text-slate-500">{note}</p>}
    </div>
  );
}

export function Chip({ label, value }) {
  if (!value) return null;

  return (
    <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200">
      <strong className="text-blue-300">{label}:</strong> {value}
    </span>
  );
}
