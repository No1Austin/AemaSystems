import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CircleDot,
  Gauge,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

const COMPLIANCE_OS_URL =
  "https://aemacompliance.com/";

const productCards = [
  {
    title: "AEMA AI",
    tag: "Business Intelligence",
    description:
      "Evaluate strategy, competitive position, risks, strengths, and growth opportunities through one intelligent platform.",
    Icon: Bot,
    href: "/ai",
    accent: "blue",
    features: [
      "Business evaluation",
      "Competitor intelligence",
      "Growth blueprint",
    ],
  },
  {
    title: "TaskFlow",
    tag: "Business Management",
    description:
      "Manage contacts, bookings, tasks, follow-ups, and daily business activity from one connected workspace.",
    Icon: Workflow,
    href: "https://taskflowaemasystems.com/",
    external: true,
    accent: "cyan",
    features: [
      "Contacts and bookings",
      "Tasks and follow-ups",
      "Operational visibility",
    ],
  },
  {
    title: "Compliance OS",
    tag: "Governance Platform",
    description:
      "Manage policies, risks, controls, evidence, vendors, implementation work, and public compliance readiness.",
    Icon: ShieldCheck,
    href: COMPLIANCE_OS_URL,
    external: true,
    accent: "emerald",
    features: [
      "Readiness assessment",
      "Governance documents",
      "Hosted Trust Center",
    ],
  },
];

const accents = {
  blue: {
    border: "border-blue-400/20",
    icon:
      "border-blue-400/20 bg-blue-400/10 text-blue-300",
    glow: "bg-blue-400/10",
    line: "via-blue-300/65",
    text: "text-blue-300",
  },
  cyan: {
    border: "border-cyan-400/20",
    icon:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    glow: "bg-cyan-400/10",
    line: "via-cyan-300/65",
    text: "text-cyan-300",
  },
  emerald: {
    border: "border-emerald-400/20",
    icon:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    glow: "bg-emerald-400/10",
    line: "via-emerald-300/65",
    text: "text-emerald-300",
  },
};

const reveal = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

function ProductCard({
  title,
  tag,
  description,
  Icon,
  href,
  external,
  accent,
  features,
}) {
  const style =
    accents[accent] ||
    accents.blue;

  const content = (
    <motion.article
      variants={reveal}
      animate={{
        y: [0, -4, 0],
      }}
      transition={{
        y: {
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
        scale: {
          duration: 0.22,
        },
      }}
      whileHover={{
        y: -10,
        scale: 1.01,
      }}
      className={[
        "group relative h-full min-h-[320px] overflow-hidden rounded-[2rem] border bg-gradient-to-br from-white/[0.065] via-white/[0.035] to-white/[0.018] p-6 shadow-[0_30px_95px_rgba(0,0,0,0.34)] backdrop-blur-2xl transition hover:border-white/20",
        style.border,
      ].join(" ")}
    >
      <motion.div
        aria-hidden="true"
        animate={{
          scale: [1, 1.16, 1],
          opacity: [0.55, 0.9, 0.55],
        }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={[
          "absolute right-[-3rem] top-[-3rem] h-32 w-32 rounded-full blur-3xl transition duration-300 group-hover:scale-125",
          style.glow,
        ].join(" ")}
      />

      <div
        aria-hidden="true"
        className={[
          "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent",
          style.line,
        ].join(" ")}
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <motion.div
            whileHover={{
              rotate: -5,
              scale: 1.06,
            }}
            className={[
              "grid h-12 w-12 place-items-center rounded-2xl border",
              style.icon,
            ].join(" ")}
          >
            <Icon size={22} />
          </motion.div>

          <span
            className={[
              "rounded-full border border-white/10 bg-white/[0.025] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em]",
              style.text,
            ].join(" ")}
          >
            {tag}
          </span>
        </div>

        <h3 className="mt-6 !font-['Poppins'] text-2xl font-semibold tracking-[-0.03em] text-white">
          {title}
        </h3>

        <p className="mt-4 text-sm leading-7 text-slate-400">
          {description}
        </p>

        <div className="mt-6 space-y-3">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 text-sm text-slate-400"
            >
              <span
                className={[
                  "grid h-5 w-5 place-items-center rounded-full border",
                  style.icon,
                ].join(" ")}
              >
                <Check
                  size={12}
                  strokeWidth={3}
                />
              </span>

              {feature}
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-6">
          <span
            className={[
              "text-sm font-semibold",
              style.text,
            ].join(" ")}
          >
            Open product
          </span>

          <ArrowRight
            size={18}
            className={[
              "transition group-hover:translate-x-1",
              style.text,
            ].join(" ")}
          />
        </div>
      </div>
    </motion.article>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {content}
      </a>
    );
  }

  return (
    <a
      href={href}
      className="block h-full"
    >
      {content}
    </a>
  );
}

function CommandCenterPreview() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.97,
        y: 24,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -8, 0],
      }}
      transition={{
        opacity: {
          duration: 0.65,
          delay: 0.18,
        },
        scale: {
          duration: 0.65,
          delay: 0.18,
        },
        y: {
          duration: 7,
          delay: 0.85,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      className="relative z-10 w-full min-w-0"
    >
      <div
        aria-hidden="true"
        className="absolute inset-6 rounded-[3rem] bg-gradient-to-br from-blue-400/15 via-cyan-400/10 to-emerald-400/10 blur-3xl"
      />

      <div className="relative overflow-hidden rounded-[2.6rem] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-white/[0.018] p-5 shadow-[0_44px_150px_rgba(0,0,0,0.52)] backdrop-blur-2xl sm:p-6">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/75 to-transparent"
        />

        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300">
              AEMA command center
            </p>

            <h2 className="mt-2 !font-['Poppins'] text-xl font-semibold tracking-[-0.03em] text-white">
              Business systems overview
            </h2>
          </div>

          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-blue-400/20 bg-blue-400/10 text-blue-300">
            <Gauge size={22} />
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-blue-400/15 bg-blue-400/[0.055] p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
              Strategy score
            </p>

            <div className="mt-4 flex items-end justify-between gap-4">
              <p className="!font-['Poppins'] text-4xl font-semibold tracking-tight text-white">
                84%
              </p>

              <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-blue-300">
                Strong
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "84%" }}
                transition={{
                  duration: 1.25,
                  delay: 0.55,
                }}
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-300"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
              Compliance readiness
            </p>

            <div className="mt-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
                <ShieldCheck size={20} />
              </div>

              <div>
                <p className="font-semibold text-white">
                  Developing
                </p>

                <p className="text-xs text-slate-500">
                  4 actions remaining
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          {[
            {
              title: "AEMA AI",
              subtitle:
                "Growth blueprint updated",
              Icon: Bot,
              tone:
                "border-blue-400/20 bg-blue-400/10 text-blue-300",
              status: "Live",
            },
            {
              title: "TaskFlow",
              subtitle:
                "12 tasks moving this week",
              Icon: BriefcaseBusiness,
              tone:
                "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
              status: "Active",
            },
            {
              title: "Compliance OS",
              subtitle:
                "6 governance documents ready",
              Icon: ShieldCheck,
              tone:
                "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
              status: "Ready",
            },
          ].map(
            ({
              title,
              subtitle,
              Icon,
              tone,
              status,
            }) => (
              <motion.div
                key={title}
                whileHover={{
                  x: 4,
                }}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-4 transition hover:bg-white/[0.045]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={[
                      "grid h-10 w-10 place-items-center rounded-xl border",
                      tone,
                    ].join(" ")}
                  >
                    <Icon size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {subtitle}
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.025] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                  {status}
                </span>
              </motion.div>
            )
          )}
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CircleDot
              size={13}
              className="text-emerald-300"
            />
            All systems connected
          </div>

          <span className="text-xs font-semibold text-white">
            Operate smarter
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  useEffect(() => {
    const fontId =
      "aema-poppins-font";

    if (
      document.getElementById(
        fontId
      )
    ) {
      return undefined;
    }

    const preconnect =
      document.createElement(
        "link"
      );

    preconnect.id =
      `${fontId}-preconnect`;

    preconnect.rel =
      "preconnect";

    preconnect.href =
      "https://fonts.googleapis.com";

    document.head.appendChild(
      preconnect
    );

    const fontLink =
      document.createElement(
        "link"
      );

    fontLink.id = fontId;
    fontLink.rel =
      "stylesheet";

    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap";

    document.head.appendChild(
      fontLink
    );

    return undefined;
  }, []);

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-[#020611] px-6 pb-24 pt-36 text-white md:pb-32 md:pt-44"
      style={{
        fontFamily:
          "'Poppins', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize:
            "48px 48px",
          maskImage:
            "linear-gradient(to bottom, black, transparent 90%)",
        }}
      />

      <motion.div
        aria-hidden="true"
        animate={{
          x: ["-50%", "-47%", "-50%"],
          y: [0, 24, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-[-16rem] h-[50rem] w-[50rem] -translate-x-1/2 rounded-full bg-blue-500/[0.17] blur-[185px]"
      />

      <motion.div
        aria-hidden="true"
        animate={{
          x: [0, -28, 0],
          y: [0, -18, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-12rem] top-[18rem] h-[34rem] w-[34rem] rounded-full bg-emerald-400/[0.09] blur-[160px]"
      />

      <motion.div
        aria-hidden="true"
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[-12rem] top-[34rem] h-[30rem] w-[30rem] rounded-full bg-violet-500/[0.08] blur-[160px]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid min-h-[680px] items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] xl:gap-20">
          <motion.div
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.72,
            }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 rgba(59,130,246,0)",
                  "0 0 34px rgba(59,130,246,0.18)",
                  "0 0 0 rgba(59,130,246,0)",
                ],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
              }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.08] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300 shadow-lg shadow-blue-950/20 backdrop-blur-xl"
            >
              <Sparkles size={14} />
              Intelligent systems for modern businesses
            </motion.div>

            <h1 className="mt-7 max-w-4xl !font-['Poppins'] text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl xl:text-[5.75rem]">
              From ideas
              <motion.span
                animate={{
                  backgroundPosition: [
                    "0% 50%",
                    "100% 50%",
                    "0% 50%",
                  ],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="block bg-[linear-gradient(90deg,#93c5fd,#67e8f9,#6ee7b7,#c4b5fd,#93c5fd)] bg-[length:250%_250%] bg-clip-text text-transparent"
              >
                to intelligent systems.
              </motion.span>
            </h1>

            <p className="mt-7 max-w-2xl !font-['Poppins'] text-base leading-8 text-slate-400 sm:text-lg">
              AEMA Systems transforms ideas into intelligent software, AI automation, business systems, and digital platforms that help organizations operate smarter, scale faster, and grow with confidence.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#booking"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-300 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-950/30 transition hover:-translate-y-0.5"
              >
                <CalendarDays size={18} />
                Book a Consultation
                <motion.span
                  animate={{
                    x: [0, 4, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight size={18} />
                </motion.span>
              </a>

              <a
                href="/ai"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07]"
              >
                <Sparkles size={18} />
                Try AEMA AI
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
              {[
                "Founder-led strategy",
                "AI-assisted execution",
                "Scalable systems",
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2"
                >
                  <BadgeCheck
                    size={17}
                    className="text-emerald-400"
                  />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <CommandCenterPreview />
        </div>

        <motion.div
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          initial="hidden"
          animate="visible"
          className="mt-16 grid gap-5 md:grid-cols-3"
        >
          {productCards.map((product) => (
            <ProductCard
              key={product.title}
              {...product}
            />
          ))}
        </motion.div>

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
            delay: 0.48,
            duration: 0.5,
          }}
          className="mt-10 flex flex-col items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-4 text-center shadow-lg shadow-black/10 backdrop-blur-xl sm:flex-row sm:text-left"
        >
          <div>
            <p className="!font-['Poppins'] text-sm font-semibold text-white">
              Start building smarter systems.
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Choose the product that fits your current stage and expand as your business grows.
            </p>
          </div>

          <a
            href="#booking"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] px-4 py-2.5 text-sm font-semibold text-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-400/[0.13]"
          >
            Get started
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
