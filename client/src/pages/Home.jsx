import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Briefcase,
  Check,
  CheckCircle2,
  CircleDot,
  Gauge,
  Globe2,
  Layers3,
  Network,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Industries from "../components/Industries";
import Founder from "../components/Founder";
import BookingForm from "../components/BookingForm";
import Footer from "../components/Footer";

const COMPLIANCE_OS_URL =
  "https://aemacompliance.com/";

const products = [
  {
    title: "AEMA AI",
    label: "Business Intelligence",
    icon: Bot,
    description:
      "Evaluate your business strategy, understand your competitive position, identify strengths and weaknesses, and receive a practical growth blueprint.",
    href: "/ai",
    accent: "blue",
    features: [
      "Business evaluation",
      "Competitor analysis",
      "Growth blueprint",
    ],
  },
  {
    title: "Compliance OS",
    label: "Governance Platform",
    icon: ShieldCheck,
    description:
      "Assess compliance readiness, identify risks, manage governance documents, and build a stronger privacy and security foundation.",
    href: COMPLIANCE_OS_URL,
    external: true,
    accent: "emerald",
    features: [
      "Readiness assessment",
      "Policy generation",
      "Framework mapping",
    ],
  },
  {
    title: "TaskFlow",
    label: "Business Management",
    icon: Briefcase,
    description:
      "Manage contacts, bookings, tasks, follow-ups, and daily business activity with AI-assisted operational insights.",
    href: "https://taskflowaemasystems.com/",
    external: true,
    accent: "cyan",
    features: [
      "Contacts and bookings",
      "Tasks and follow-ups",
      "AI operational insights",
    ],
  },
];

const proofPoints = [
  {
    title: "Built in Canada",
    text: "Designed for practical business operations, privacy, governance, and growth.",
    icon: BadgeCheck,
    accent: "blue",
  },
  {
    title: "Founder-led delivery",
    text: "Direct strategy, product thinking, implementation, and continuous improvement.",
    icon: Sparkles,
    accent: "violet",
  },
  {
    title: "One connected ecosystem",
    text: "Business intelligence, compliance, and operations working together.",
    icon: Network,
    accent: "emerald",
  },
];

const benefits = [
  {
    title: "Strategy before software",
    icon: Gauge,
    text: "We begin with your business model, customer journey, workflow, and growth goals before deciding what to build.",
    accent: "blue",
  },
  {
    title: "AI-assisted execution",
    icon: Sparkles,
    text: "We use practical AI to improve planning, documentation, analysis, automation, and business decision-making.",
    accent: "violet",
  },
  {
    title: "Systems that scale",
    icon: Layers3,
    text: "Your platform can begin simple, then grow into dashboards, bookings, compliance, payments, and reporting.",
    accent: "emerald",
  },
];

const workflowSteps = [
  {
    number: "01",
    title: "Discover",
    text: "We understand your business, goals, customer flow, and current operational challenges.",
  },
  {
    number: "02",
    title: "Design",
    text: "We map the system structure, user experience, features, integrations, and growth opportunities.",
  },
  {
    number: "03",
    title: "Build",
    text: "We develop, test, deploy, and connect your platform with the tools your business needs.",
  },
  {
    number: "04",
    title: "Improve",
    text: "We review results, optimize workflows, and add automation or AI support as the business grows.",
  },
];

const complianceCapabilities = [
  "Understand which compliance frameworks may apply",
  "Identify missing privacy, security, and governance documents",
  "Assess operational and documentation readiness",
  "Generate tailored policy drafts after payment",
  "Prepare governance information for review and publication",
];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const toneStyles = {
  blue: {
    icon:
      "border-blue-400/20 bg-blue-400/10 text-blue-300",
    glow: "bg-blue-400/10",
    text: "text-blue-300",
  },
  emerald: {
    icon:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    glow: "bg-emerald-400/10",
    text: "text-emerald-300",
  },
  cyan: {
    icon:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    glow: "bg-cyan-400/10",
    text: "text-cyan-300",
  },
  violet: {
    icon:
      "border-violet-400/20 bg-violet-400/10 text-violet-300",
    glow: "bg-violet-400/10",
    text: "text-violet-300",
  },
};

function ProductCard({ product }) {
  const Icon = product.icon;
  const style =
    toneStyles[product.accent] ||
    toneStyles.blue;

  const card = (
    <motion.article
      variants={fadeUp}
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.22,
      }}
      className="group relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.035] to-white/[0.02] p-7 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition hover:border-white/20"
    >
      <div
        aria-hidden="true"
        className={[
          "absolute right-[-3rem] top-[-3rem] h-32 w-32 rounded-full blur-3xl transition duration-300 group-hover:scale-125",
          style.glow,
        ].join(" ")}
      />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      <div className="relative">
        <motion.div
          whileHover={{
            rotate: -5,
            scale: 1.06,
          }}
          className={[
            "inline-flex rounded-2xl border p-3",
            style.icon,
          ].join(" ")}
        >
          <Icon size={24} />
        </motion.div>

        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          {product.label}
        </p>

        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          {product.title}
        </h3>

        <p className="mt-4 leading-7 text-slate-400">
          {product.description}
        </p>

        <div className="mt-6 space-y-3">
          {product.features.map(
            (feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 text-sm text-slate-400"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>{feature}</span>
              </div>
            )
          )}
        </div>

        <div
          className={[
            "mt-8 inline-flex items-center gap-2 text-sm font-bold",
            style.text,
          ].join(" ")}
        >
          Open product
          <ArrowRight
            size={16}
            className="transition group-hover:translate-x-1"
          />
        </div>
      </div>
    </motion.article>
  );

  if (product.external) {
    return (
      <a
        href={product.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {card}
      </a>
    );
  }

  return (
    <Link
      to={product.href}
      className="block h-full"
    >
      {card}
    </Link>
  );
}

function ProofCard({
  item,
  index,
}) {
  const Icon = item.icon;
  const style =
    toneStyles[item.accent] ||
    toneStyles.blue;

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.22 }}
      className="group relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-6 shadow-xl shadow-black/10 backdrop-blur-xl"
    >
      <div
        aria-hidden="true"
        className={[
          "absolute right-[-3rem] top-[-3rem] h-28 w-28 rounded-full blur-3xl transition duration-300 group-hover:scale-125",
          style.glow,
        ].join(" ")}
      />

      <div className="relative">
        <div
          className={[
            "grid h-11 w-11 place-items-center rounded-2xl border",
            style.icon,
          ].join(" ")}
        >
          <Icon size={20} />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-white">
          {item.title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          {item.text}
        </p>
      </div>
    </motion.article>
  );
}

function EcosystemNode({
  icon: Icon,
  title,
  subtitle,
  tone,
  href,
  external,
}) {
  const style =
    toneStyles[tone] ||
    toneStyles.blue;

  const node = (
    <motion.div
      whileHover={{
        x: 5,
      }}
      className="group relative flex items-center gap-4 overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-950/55 p-4 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:border-white/20"
    >
      <div
        className={[
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border",
          style.icon,
        ].join(" ")}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="font-semibold text-white">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {subtitle}
        </p>
      </div>

      <ArrowRight
        size={16}
        className="ml-auto text-slate-600 transition group-hover:translate-x-1 group-hover:text-white"
      />
    </motion.div>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {node}
      </a>
    );
  }

  return (
    <Link to={href}>
      {node}
    </Link>
  );
}

function CompliancePreviewCard({
  label,
  value,
  helper,
  accent = "emerald",
}) {
  const style =
    toneStyles[accent] ||
    toneStyles.emerald;

  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-950/55 p-5 shadow-lg shadow-black/10 backdrop-blur-xl"
    >
      <div
        aria-hidden="true"
        className={[
          "absolute right-[-3rem] top-[-3rem] h-24 w-24 rounded-full blur-3xl",
          style.glow,
        ].join(" ")}
      />

      <div className="relative">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
          {label}
        </p>

        <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
          {value}
        </p>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          {helper}
        </p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize:
            "48px 48px",
          maskImage:
            "linear-gradient(to bottom, black, transparent 85%)",
        }}
      />

      <Navbar />
      <Hero />

      <section className="relative px-6 py-16 md:py-20">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[-8rem] h-72 w-72 -translate-x-1/2 rounded-full bg-blue-400/[0.08] blur-[120px]"
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="relative mx-auto grid max-w-7xl gap-5 md:grid-cols-3"
        >
          {proofPoints.map(
            (item, index) => (
              <ProofCard
                key={item.title}
                item={item}
                index={index}
              />
            )
          )}
        </motion.div>
      </section>

      <section className="relative px-6 py-24">
        <div
          aria-hidden="true"
          className="absolute left-[-10rem] top-20 h-80 w-80 rounded-full bg-blue-400/[0.06] blur-[130px]"
        />

        <div
          aria-hidden="true"
          className="absolute right-[-10rem] bottom-10 h-80 w-80 rounded-full bg-emerald-400/[0.06] blur-[130px]"
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.25,
              }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">
                <Network className="h-4 w-4" />
                The AEMA Ecosystem
              </div>

              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
                One intelligent business ecosystem.
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                AEMA Systems connects strategy, operations, and compliance so growing businesses can understand what to improve, manage daily work, and build trust with customers.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/ai"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/25 transition hover:-translate-y-0.5"
                >
                  Explore AEMA AI
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href={COMPLIANCE_OS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.08] px-5 py-3 text-sm font-bold text-emerald-100 transition hover:-translate-y-0.5 hover:bg-emerald-400/[0.13]"
                >
                  Open Compliance OS
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.2,
              }}
              className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.035] to-white/[0.02] p-6 shadow-[0_35px_110px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-8"
            >
              <div
                aria-hidden="true"
                className="absolute right-[-5rem] top-[-5rem] h-40 w-40 rounded-full bg-blue-400/10 blur-[95px]"
              />

              <div className="relative space-y-4">
                <EcosystemNode
                  icon={Bot}
                  title="AEMA AI"
                  subtitle="Business strategy and intelligence"
                  tone="blue"
                  href="/ai"
                />

                <div className="ml-6 h-7 w-px bg-gradient-to-b from-blue-400/60 to-emerald-400/60" />

                <EcosystemNode
                  icon={ShieldCheck}
                  title="Compliance OS"
                  subtitle="Governance, readiness, and trust"
                  tone="emerald"
                  href={COMPLIANCE_OS_URL}
                  external
                />

                <div className="ml-6 h-7 w-px bg-gradient-to-b from-emerald-400/60 to-cyan-400/60" />

                <EcosystemNode
                  icon={Briefcase}
                  title="TaskFlow"
                  subtitle="Contacts, bookings, tasks, and follow-ups"
                  tone="cyan"
                  href="https://taskflowaemasystems.com/"
                  external
                />

                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                    One connected direction
                  </p>

                  <p className="mt-2 text-sm font-semibold text-white">
                    Understand → Govern → Operate → Grow
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.25,
            }}
            className="max-w-3xl"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-300">
              AEMA Products
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
              Intelligent systems built around real business needs.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
              Each AEMA product solves a different part of the business journey—strategy, operations, and compliance.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            className="mt-12 grid gap-6 md:grid-cols-3"
          >
            {products.map(
              (product) => (
                <ProductCard
                  key={product.title}
                  product={product}
                />
              )
            )}
          </motion.div>
        </div>
      </section>

      <Services />

      <section className="relative overflow-hidden border-y border-white/10 bg-[#071224] px-6 py-24">
        <div
          aria-hidden="true"
          className="absolute left-[-8rem] top-0 h-80 w-80 rounded-full bg-emerald-400/[0.08] blur-[135px]"
        />

        <div
          aria-hidden="true"
          className="absolute right-[-8rem] bottom-0 h-80 w-80 rounded-full bg-cyan-400/[0.06] blur-[135px]"
        />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              Compliance OS
            </div>

            <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
              Understand your compliance before problems appear.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Compliance OS helps businesses assess readiness, identify governance gaps, understand applicable frameworks, and prepare tailored documents for review.
            </p>

            <div className="mt-8 space-y-4">
              {complianceCapabilities.map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-sm leading-7 text-slate-300"
                  >
                    <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-400/10 text-emerald-300">
                      <Check size={14} />
                    </span>

                    <span>{item}</span>
                  </div>
                )
              )}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={COMPLIANCE_OS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-6 py-3.5 text-sm font-black text-slate-950 shadow-xl shadow-emerald-950/25 transition hover:-translate-y-0.5"
              >
                Start Compliance Assessment
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href={COMPLIANCE_OS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-white transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                Learn more
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.035] to-white/[0.02] p-6 shadow-[0_35px_110px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-8"
          >
            <div
              aria-hidden="true"
              className="absolute right-[-5rem] top-[-5rem] h-40 w-40 rounded-full bg-emerald-400/10 blur-[95px]"
            />

            <div className="relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
                    Live readiness preview
                  </p>

                  <h3 className="mt-2 text-xl font-semibold text-white">
                    Compliance command center
                  </h3>
                </div>

                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                  <ShieldCheck size={22} />
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <CompliancePreviewCard
                  label="Overall readiness"
                  value="72%"
                  helper="Weighted document and governance readiness"
                  accent="emerald"
                />

                <CompliancePreviewCard
                  label="Frameworks"
                  value="5"
                  helper="PIPEDA, AODA, SOC 2, ISO 27001, and more"
                  accent="blue"
                />

                <CompliancePreviewCard
                  label="Key risks"
                  value="3"
                  helper="Privacy, security, vendor, and AI exposure"
                  accent="violet"
                />

                <CompliancePreviewCard
                  label="Missing documents"
                  value="6"
                  helper="Policies, plans, and governance registers"
                  accent="cyan"
                />
              </div>

              <div className="mt-5 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300">
                  Tailored output
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Businesses receive a preliminary readiness result, key risk findings, framework recommendations, and a route to generate a personalized compliance package.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.2,
              }}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-300">
                Why AEMA Systems
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
                We build business infrastructure, not just pages on the internet.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-400">
                AEMA is designed for businesses that need more than a website: they need systems for operations, customers, decisions, compliance, and growth.
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.15,
              }}
              className="grid gap-5"
            >
              {benefits.map(
                (item) => {
                  const Icon = item.icon;
                  const style =
                    toneStyles[
                      item.accent
                    ] ||
                    toneStyles.blue;

                  return (
                    <motion.article
                      key={
                        item.title
                      }
                      variants={
                        fadeUp
                      }
                      whileHover={{
                        x: 6,
                      }}
                      className="group relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/10 backdrop-blur-xl"
                    >
                      <div
                        aria-hidden="true"
                        className={[
                          "absolute right-[-3rem] top-[-3rem] h-28 w-28 rounded-full blur-3xl transition duration-300 group-hover:scale-125",
                          style.glow,
                        ].join(
                          " "
                        )}
                      />

                      <div className="relative flex gap-4">
                        <div
                          className={[
                            "h-fit rounded-2xl border p-3",
                            style.icon,
                          ].join(
                            " "
                          )}
                        >
                          <Icon
                            size={
                              22
                            }
                          />
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold">
                            {
                              item.title
                            }
                          </h3>

                          <p className="mt-3 leading-7 text-slate-400">
                            {
                              item.text
                            }
                          </p>
                        </div>
                      </div>
                    </motion.article>
                  );
                }
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Industries />

      <section className="px-6 py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.035] to-white/[0.02] p-7 shadow-[0_35px_110px_rgba(0,0,0,0.32)] backdrop-blur-2xl md:p-12">
          <div
            aria-hidden="true"
            className="absolute right-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-blue-400/[0.08] blur-[120px]"
          />

          <div className="relative max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-300">
              Our Process
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
              From business idea to working intelligent system.
            </h2>
          </div>

          <div className="relative mt-12 grid gap-5 md:grid-cols-4">
            {workflowSteps.map(
              (
                step,
                index
              ) => (
                <motion.div
                  key={
                    step.title
                  }
                  initial={{
                    opacity: 0,
                    y: 18,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    delay:
                      index *
                      0.07,
                  }}
                  whileHover={{
                    y: -5,
                  }}
                  className="relative rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-6"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black text-blue-300">
                      {
                        step.number
                      }
                    </p>

                    <CircleDot className="text-slate-700" />
                  </div>

                  <h3 className="mt-4 text-xl font-semibold">
                    {
                      step.title
                    }
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {
                      step.text
                    }
                  </p>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="relative mx-auto grid max-w-7xl gap-6 overflow-hidden rounded-[2.2rem] border border-blue-400/20 bg-gradient-to-br from-blue-500/[0.14] via-cyan-400/[0.07] to-violet-400/[0.08] p-7 shadow-[0_35px_110px_rgba(0,0,0,0.32)] backdrop-blur-2xl md:grid-cols-[1fr_auto] md:items-center md:p-10"
        >
          <div
            aria-hidden="true"
            className="absolute left-[-4rem] top-[-5rem] h-40 w-40 rounded-full bg-blue-400/15 blur-[90px]"
          />

          <div className="relative">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-300">
              Growth Blueprint
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
              Want to know what your business should improve next?
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-400">
              Use AEMA AI to evaluate your business strategy, competitors, strengths, weaknesses, digital positioning, and growth opportunities.
            </p>
          </div>

          <Link
            to="/ai"
            className="relative inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-950/25 transition hover:-translate-y-0.5"
          >
            Try AEMA AI
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      <Founder />

      <section id="booking">
        <BookingForm />
      </section>

      <Footer />
    </main>
  );
}
