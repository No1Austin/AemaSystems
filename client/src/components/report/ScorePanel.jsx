export default function ScorePanel({ report = {} }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 text-center">
      <p className="text-sm uppercase tracking-[0.25em] text-blue-300">
        Growth Health
      </p>

      <div className="mx-auto mt-5 flex h-36 w-36 items-center justify-center rounded-full border-4 border-blue-400 bg-[#0f172a] shadow-[0_0_45px_rgba(59,130,246,0.45)]">
        <span className="text-5xl font-black">{report.growthScore ?? "—"}</span>
      </div>

      <p className="mt-4 text-lg font-bold">
        {report.growthPotential || "Assessment ready"}
      </p>

      <p className="mt-3 text-sm text-slate-400">
        This score reflects current growth readiness based on your AEMA
        assessment.
      </p>
    </div>
  );
}
