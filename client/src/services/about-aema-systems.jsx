import { Link } from "react-router-dom";
import { ArrowRight, Bot, Code2, Search, Workflow } from "lucide-react";

export default function AboutAemaSystems() {
  const items = [
    ["Software", Code2],
    ["AI Automation", Bot],
    ["SEO", Search],
    ["Business Systems", Workflow],
  ];

  return (
    <main className="min-h-screen bg-[#020617] px-6 py-28 text-white md:px-12 lg:px-20">
      <section className="mx-auto grid min-h-[75vh] max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            About AEMA Systems
          </p>

          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            Building intelligent systems for modern businesses.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300">
            AEMA Systems helps businesses turn ideas into practical digital
            solutions through software, AI automation, SEO, e-commerce, booking
            systems, and smarter workflows.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
            >
              Home <ArrowRight size={17} />
            </Link>

            <a
              href="/#booking"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold hover:bg-white/10"
            >
              Book <ArrowRight size={17} />
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl">
          <h2 className="text-2xl font-bold">What we focus on</h2>

          <div className="mt-6 grid gap-4">
            {items.map(([title, Icon]) => (
              <div
                key={title}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <Icon className="text-blue-400" size={24} />
                <p className="font-semibold">{title}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm leading-6 text-slate-400">
            From ideas to intelligent systems — built to improve efficiency,
            visibility, operations, and long-term growth.
          </p>
        </div>
      </section>
    </main>
  );
}