import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate min-h-screen overflow-hidden bg-[#020617] px-6 py-10 text-white md:px-12 lg:px-20"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_40%,rgba(37,99,235,0.35),transparent_32%),radial-gradient(circle_at_30%_80%,rgba(59,130,246,0.16),transparent_28%)]"
        animate={{ opacity: [0.65, 1, 0.65], scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:280px_280px]" />
      </div>

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl items-center">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles size={16} />
              Software Development • AI Automation • SEO • E-Commerce
            </motion.div>

            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.45em] text-slate-400">
              AEMA Systems
            </p>

            <motion.h1
              className="max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.08em] md:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8 }}
            >
              From Ideas
              <span className="block text-blue-500">To Intelligent</span>
              Systems
            </motion.h1>

            <motion.p
              className="mt-8 max-w-2xl border-l-2 border-blue-500 pl-5 text-base leading-8 text-slate-300 md:text-lg"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              AEMA Systems builds custom software, business websites, booking
              platforms, e-commerce stores, SEO strategies, AI automation
              workflows, admin dashboards, and business systems that help
              growing companies operate smarter, improve visibility, and scale
              with confidence.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.8 }}
            >
              <motion.a
                href="#booking"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center border border-blue-500 bg-blue-600 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_35px_rgba(37,99,235,0.45)] transition hover:bg-blue-500"
              >
                Book a Consultation <ArrowRight className="ml-3" size={18} />
              </motion.a>

              <motion.a
                href="#services"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:border-blue-400 hover:bg-white/10"
              >
                Explore Services
              </motion.a>
            </motion.div>
          </motion.div>

          <div className="relative hidden min-h-[620px] items-center justify-center lg:flex">
            <motion.div
              className="absolute h-[440px] w-[440px] rounded-full bg-blue-600/20 blur-[100px]"
              animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.9, 0.45] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="absolute bottom-16 h-4 w-[380px] rounded-full bg-blue-500 blur-xl"
              animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.8, 1.15, 0.8] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="relative text-[520px] font-black leading-none tracking-[-0.12em] text-transparent"
              style={{
                WebkitTextStroke: "3px rgba(59,130,246,0.95)",
                textShadow:
                  "0 0 30px rgba(37,99,235,0.9), 0 0 80px rgba(59,130,246,0.75)",
              }}
              initial={{ opacity: 0, scale: 0.75, rotate: -6 }}
              animate={{
                opacity: 1,
                scale: [1, 1.035, 1],
                rotate: [-2, 1.5, -2],
                y: [0, -18, 0],
              }}
              transition={{
                opacity: { duration: 0.8 },
                scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              A
            </motion.div>

            <motion.div
              className="absolute inset-x-20 bottom-12 h-[220px] bg-[radial-gradient(circle,rgba(59,130,246,0.75),transparent_58%)] blur-2xl"
              animate={{ opacity: [0.35, 0.9, 0.35], y: [10, -10, 10] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {[...Array(18)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute bottom-28 h-1 w-1 rounded-full bg-blue-300 shadow-[0_0_18px_rgba(96,165,250,1)]"
                style={{
                  left: `${25 + Math.random() * 50}%`,
                }}
                animate={{
                  y: [0, -260 - Math.random() * 180],
                  x: [0, Math.random() * 100 - 50],
                  opacity: [0, 1, 0],
                  scale: [0.6, 1.5, 0.3],
                }}
                transition={{
                  duration: 2.5 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeOut",
                }}
              />
            ))}

            <motion.div
              className="absolute right-10 top-24 h-[520px] w-[260px] rounded-full bg-blue-500/20 blur-3xl"
              animate={{ opacity: [0.25, 0.75, 0.25], x: [0, -25, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}