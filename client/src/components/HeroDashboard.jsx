import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  CircleDot,
  Gauge,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Workflow,
} from "lucide-react";
const productRows = [
  {
    title: "AEMA AI",
    subtitle:
      "Business intelligence engine active",
    value: "Live",
    Icon: Bot,
    accent:
      "border-blue-400/20 bg-blue-400/10 text-blue-300",
  },
  {
    title: "TaskFlow",
    subtitle:
      "24 tasks moving across operations",
    value: "24",
    Icon: Workflow,
    accent:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
  },
  {
    title: "Compliance OS",
    subtitle:
      "Governance readiness improving",
    value: "91%",
    Icon: ShieldCheck,
    accent:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  },
];

const activityRows = [
  {
    title:
      "Growth blueprint updated",
    time: "2m ago",
    Icon: Sparkles,
  },
  {
    title:
      "Compliance review completed",
    time: "18m ago",
    Icon: CheckCircle2,
  },
  {
    title:
      "TaskFlow workflow synchronized",
    time: "42m ago",
    Icon: Workflow,
  },
];

function MetricCard({
  label,
  value,
  helper,
  Icon,
  accent,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay,
        duration: 0.5,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="relative overflow-hidden rounded-[1.45rem] border border-white/10 bg-white/[0.03] p-4"
    >
      <div
        aria-hidden="true"
        className={`absolute right-[-2rem] top-[-2rem] h-20 w-20 rounded-full blur-3xl ${accent}`}
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600">
              {label}
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
              {value}
            </p>
          </div>

          <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.035] text-slate-300">
            <Icon size={17} />
          </div>
        </div>

        <p className="mt-2 text-[10px] text-slate-500">
          {helper}
        </p>
      </div>
    </motion.div>
  );
}

export default function HeroDashboard() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 80,
        y: 50,
        scale: 0.88,
        rotateX: 12,
        rotateY: -5,
        filter: "blur(12px)",
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: [0, -5, 0],
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        filter: "blur(0px)",
      }}
      transition={{
        opacity: {
          duration: 0.7,
          delay: 0.25,
        },
        x: {
          duration: 0.9,
          delay: 0.22,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        },
        scale: {
          duration: 0.9,
          delay: 0.22,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        },
        rotateX: {
          duration: 0.9,
          delay: 0.22,
        },
        rotateY: {
          duration: 0.9,
          delay: 0.22,
        },
        filter: {
          duration: 0.75,
          delay: 0.22,
        },
        y: {
          duration: 6.5,
          delay: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      style={{
        transformPerspective: 1300,
      }}
      className="relative z-20 w-full max-w-[640px]"
    >
      {/* Outer glow */}

      <motion.div
        aria-hidden="true"
        animate={{
          opacity: [
            0.35,
            0.75,
            0.35,
          ],
          scale: [
            0.95,
            1.03,
            0.95,
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-5 rounded-[2.8rem] bg-gradient-to-br from-blue-400/10 via-cyan-400/10 to-emerald-400/10 blur-3xl"
      />

      {/* Main glass panel */}

      <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-white/[0.085] via-white/[0.04] to-white/[0.018] p-5 shadow-[0_50px_160px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        {/* Top light */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent"
        />

        {/* Glass reflection */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 h-32 w-1/2 rotate-[-12deg] bg-gradient-to-br from-white/[0.07] to-transparent blur-2xl"
        />

        {/* Header */}

        <div className="relative flex items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
              AEMA Systems
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">
              Intelligent Systems Command Center
            </h2>
          </div>

          <motion.div
            animate={{
              rotate: [
                0,
                6,
                -6,
                0,
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-blue-400/20 bg-blue-400/10 text-blue-300"
          >
            <Gauge size={20} />
          </motion.div>
        </div>

        {/* Top metrics */}

        <div className="relative mt-5 grid gap-3 sm:grid-cols-3">
          <MetricCard
            label="System health"
            value="94%"
            helper="All core systems stable"
            Icon={Activity}
            accent="bg-emerald-400/10"
            delay={0.7}
          />

          <MetricCard
            label="Active workflows"
            value="38"
            helper="Across connected products"
            Icon={Workflow}
            accent="bg-cyan-400/10"
            delay={0.78}
          />

          <MetricCard
            label="Growth signal"
            value="+18%"
            helper="Operational momentum"
            Icon={TrendingUp}
            accent="bg-violet-400/10"
            delay={0.86}
          />
        </div>

        {/* Product ecosystem */}

        <motion.div
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.95,
            duration: 0.5,
          }}
          className="relative mt-4 rounded-[1.6rem] border border-white/10 bg-slate-950/45 p-4"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                Connected ecosystem
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                AEMA products
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
              <CircleDot size={11} />
              Connected
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            {productRows.map(
              (
                {
                  title,
                  subtitle,
                  value,
                  Icon,
                  accent,
                },
                index
              ) => (
                <motion.div
                  key={title}
                  initial={{
                    opacity: 0,
                    x: 16,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay:
                      1.05 +
                      index * 0.08,
                    duration: 0.42,
                  }}
                  whileHover={{
                    x: 4,
                  }}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.025] px-3.5 py-3 transition hover:bg-white/[0.045]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${accent}`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {title}
                      </p>

                      <p className="mt-1 truncate text-[10px] text-slate-500">
                        {subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[9px] font-semibold text-slate-300">
                      {value}
                    </span>

                    <ArrowUpRight
                      size={14}
                      className="text-slate-600 transition group-hover:text-white"
                    />
                  </div>
                </motion.div>
              )
            )}
          </div>
        </motion.div>

        {/* Lower section */}

        <div className="relative mt-4 grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
          {/* Activity */}

          <motion.div
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1.3,
              duration: 0.45,
            }}
            className="rounded-[1.6rem] border border-white/10 bg-white/[0.025] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  Recent activity
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  System updates
                </p>
              </div>

              <Sparkles
                size={16}
                className="text-violet-300"
              />
            </div>

            <div className="mt-4 space-y-3">
              {activityRows.map(
                (
                  {
                    title,
                    time,
                    Icon,
                  },
                  index
                ) => (
                  <motion.div
                    key={title}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        1.42 +
                        index *
                          0.08,
                    }}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400">
                        <Icon size={13} />
                      </div>

                      <p className="truncate text-[10px] text-slate-400">
                        {title}
                      </p>
                    </div>

                    <span className="shrink-0 text-[9px] text-slate-700">
                      {time}
                    </span>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>

          {/* Growth card */}

          <motion.div
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1.38,
              duration: 0.45,
            }}
            className="relative overflow-hidden rounded-[1.6rem] border border-violet-400/15 bg-violet-400/[0.045] p-4"
          >
            <div
              aria-hidden="true"
              className="absolute right-[-3rem] top-[-3rem] h-24 w-24 rounded-full bg-violet-400/10 blur-3xl"
            />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                    Growth momentum
                  </p>

                  <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
                    18.4%
                  </p>
                </div>

                <TrendingUp className="text-violet-300" />
              </div>

              <div className="mt-5 flex h-20 items-end gap-1.5">
                {[
                  24,
                  38,
                  32,
                  48,
                  44,
                  58,
                  52,
                  68,
                  63,
                  78,
                  72,
                  88,
                ].map(
                  (
                    height,
                    index
                  ) => (
                    <motion.div
                      key={index}
                      initial={{
                        height: 0,
                      }}
                      animate={{
                        height:
                          `${height}%`,
                      }}
                      transition={{
                        duration: 0.6,
                        delay:
                          1.5 +
                          index *
                            0.04,
                      }}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-violet-500/40 to-cyan-300/80"
                    />
                  )
                )}
              </div>

              <p className="mt-3 text-[10px] leading-5 text-slate-500">
                Connected systems are creating stronger operational visibility.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1.7,
            duration: 0.5,
          }}
          className="relative mt-4 flex flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <CheckCircle2
              size={13}
              className="text-emerald-300"
            />

            All systems connected
          </div>

          <div className="flex items-center gap-2 text-[10px] font-semibold text-white">
            From ideas to intelligent systems
            <ArrowUpRight
              size={13}
              className="text-cyan-300"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}