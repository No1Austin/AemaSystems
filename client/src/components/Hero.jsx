import {
  ArrowRight,
  CalendarDays,
  Sparkles,
  Code2,
  Bot,
  Workflow,
  Rocket,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const offers = [
    ["AI Automation", "Smart workflows that save time.", Bot],
    ["Custom Software", "Web apps built for business growth.", Code2],
    ["Business Systems", "Tools that improve operations.", Workflow],
    ["Digital Growth", "SEO, e-commerce, and automation.", Rocket],
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#020617] px-6 pt-32 text-white md:px-12 lg:px-20"
    >
      <div className="absolute inset-0">
        <img
          src="/aema-ai-bg.png"
          alt="AEMA Systems AI background"
          className="h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/78 to-[#020617]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/40" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className="max-w-lg"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-200 backdrop-blur">
            <Sparkles size={14} />
            Technology • Automation • Growth
          </div>

          <h1 className="font-black uppercase leading-[0.86] tracking-[-0.06em]">
            <span className="block text-4xl text-white md:text-5xl lg:text-6xl">
              From Ideas
            </span>

            <span className="block bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-300 bg-clip-text text-4xl text-transparent md:text-5xl lg:text-6xl">
              To Intelligent
            </span>

            <span className="block text-4xl text-white md:text-5xl lg:text-6xl">
              Systems
            </span>
          </h1>

          <p className="mt-6 max-w-md text-sm leading-7 text-slate-300 md:text-base">
            AEMA Systems transforms ideas into intelligent software, AI
            automation, business systems, and digital platforms that help
            organizations operate smarter, scale faster, and grow with
            confidence.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="#booking"
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500"
            >
              <CalendarDays size={18} />
              Book a Consultation
              <ArrowRight size={18} />
            </a>

            <a
              href="#aema-ai"
              className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
            >
              <Sparkles size={18} />
              Use AEMA AI
              <ArrowRight size={18} />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.75 }}
          className="mt-14 grid gap-4 rounded-3xl border border-white/10 bg-black/35 p-5 shadow-2xl backdrop-blur-xl md:grid-cols-4"
        >
          {offers.map(([title, text, Icon]) => (
            <div
              key={title}
              className="flex items-start gap-4 border-white/10 md:border-r md:pr-5 md:last:border-r-0"
            >
              <div className="rounded-2xl bg-blue-600/10 p-3 text-blue-400">
                <Icon size={24} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">{text}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}