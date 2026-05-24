import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#020617] px-6 py-10 text-white md:px-12 lg:px-20"
    >
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(37,99,235,0.22),transparent_30%),radial-gradient(circle_at_30%_80%,rgba(16,185,129,0.12),transparent_25%)]"
        animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:280px_280px]" />
      </div>

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl items-center">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-200"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles size={16} />
              AI • Automation • Business Systems
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
              We build custom web applications, booking platforms, AI workflows,
              automation tools, and business systems that help growing companies
              operate smarter and scale with confidence.
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
                className="inline-flex items-center justify-center rounded-none border border-blue-500 bg-blue-600 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-blue-500"
              >
                Let&apos;s Build <ArrowRight className="ml-3" size={18} />
              </motion.a>

              <motion.a
                href="#services"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center rounded-none border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white/10"
              >
                Explore Systems
              </motion.a>
            </motion.div>
          </motion.div>

          <div className="relative hidden lg:block">
            <motion.div
              className="absolute -inset-10 rounded-full bg-blue-600/20 blur-3xl"
              animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.12, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="relative ml-auto h-[520px] w-[420px] rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur"
              initial={{ opacity: 0, x: 80, rotateY: -12 }}
              animate={{
                opacity: 1,
                x: 0,
                rotateY: 0,
                y: [0, -14, 0],
              }}
              transition={{
                opacity: { duration: 0.8 },
                x: { duration: 0.8 },
                rotateY: { duration: 0.8 },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <div className="h-full rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                    System Core
                  </p>

                  <motion.div
                    className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.9)]"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                </div>

                <div className="mt-8 space-y-5">
                  {[
                    "Business idea captured",
                    "Workflow mapped",
                    "AI automation planned",
                    "Booking system deployed",
                    "Admin dashboard connected",
                  ].map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: 45 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.15, duration: 0.5 }}
                      whileHover={{
                        scale: 1.03,
                        borderColor: "rgba(96,165,250,0.8)",
                        backgroundColor: "rgba(255,255,255,0.07)",
                      }}
                      className="flex items-center justify-between border border-white/10 bg-white/[0.03] p-4"
                    >
                      <span className="text-sm text-slate-300">{item}</span>
                      <span className="text-xs text-blue-400">
                        0{index + 1}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}