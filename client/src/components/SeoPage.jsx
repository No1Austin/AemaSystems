import { Link } from "react-router-dom";

export default function SeoPage({ label, title, description, points = [] }) {
  return (
    <main className="min-h-screen bg-[#020617] px-6 py-24 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
          {label}
        </p>

        <h1 className="mt-4 text-4xl font-black md:text-6xl">
          {title}
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-300">
          {description}
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {points.map((point) => (
            <div
              key={point}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300"
            >
              {point}
            </div>
          ))}
        </div>

        <Link
          to="/"
          className="mt-10 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500"
        >
          Back Home
        </Link>
      </section>
    </main>
  );
}