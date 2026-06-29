import { useEffect, useState } from "react";

const loadingSteps = [
  "Verifying payment",
  "Analyzing profile",
  "Checking website",
  "Preparing report",
];

export default function ReportLoadingScreen() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((step) =>
        step < loadingSteps.length - 1 ? step + 1 : step
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const progress = Math.round(((activeStep + 1) / loadingSteps.length) * 100);

  return (
    <main className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.18),transparent_35%)]" />

      <section className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/20">
            <span className="text-2xl">🧠</span>
          </div>

          <p className="text-xs uppercase tracking-[0.32em] text-blue-300">
            AEMA Intelligence
          </p>

          <h1 className="mt-3 text-2xl font-extrabold">
            Building Blueprint
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Preparing your business report.
          </p>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs text-slate-400">
            <span>{loadingSteps[activeStep]}</span>
            <span>{progress}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2">
          {loadingSteps.map((step, index) => {
            const done = index <= activeStep;

            return (
              <div
                key={step}
                className={`h-2 rounded-full ${
                  done ? "bg-emerald-400" : "bg-white/10"
                }`}
              />
            );
          })}
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
          Keep this page open.
        </p>
      </section>
    </main>
  );
}