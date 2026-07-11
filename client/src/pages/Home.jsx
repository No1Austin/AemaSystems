import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Briefcase,
  CheckCircle2,
  Gauge,
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
    href: "/compliance-os",
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
  },
  {
    title: "Founder-led delivery",
    text: "Direct strategy, product thinking, implementation, and continuous improvement.",
  },
  {
    title: "One connected ecosystem",
    text: "Business intelligence, compliance, and operations working together.",
  },
];

const benefits = [
  {
    title: "Strategy before software",
    icon: Gauge,
    text: "We begin with your business model, customer journey, workflow, and growth goals before deciding what to build.",
  },
  {
    title: "AI-assisted execution",
    icon: Sparkles,
    text: "We use practical AI to improve planning, documentation, analysis, automation, and business decision-making.",
  },
  {
    title: "Systems that scale",
    icon: Layers3,
    text: "Your platform can begin simple, then grow into dashboards, bookings, compliance, payments, and reporting.",
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

function ProductCard({ product }) {
  const Icon = product.icon;

  const accentStyles = {
    blue: {
      icon: "border-blue-400/20 bg-blue-500/10 text-blue-200",
      glow: "from-blue-500/20",
      link: "text-blue-300",
    },
    emerald: {
      icon: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
      glow: "from-emerald-500/20",
      link: "text-emerald-300",
    },
    cyan: {
      icon: "border-cyan-400/20 bg-cyan-500/10 text-cyan-200",
      glow: "from-cyan-500/20",
      link: "text-cyan-300",
    },
  };

  const styles = accentStyles[product.accent];

  const content = (
    <article className="group relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]">
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b ${styles.glow} to-transparent opacity-70`}
      />

      <div className="relative">
        <div className={`inline-flex rounded-2xl border p-3 ${styles.icon}`}>
          <Icon size={24} />
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          {product.label}
        </p>

        <h3 className="mt-3 text-2xl font-black text-white">
          {product.title}
        </h3>

        <p className="mt-4 leading-7 text-slate-300">
          {product.description}
        </p>

        <div className="mt-6 space-y-3">
          {product.features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 text-sm text-slate-400"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div
          className={`mt-8 inline-flex items-center gap-2 text-sm font-bold ${styles.link}`}
        >
          Explore product
          <ArrowRight
            size={16}
            className="transition group-hover:translate-x-1"
          />
        </div>
      </div>
    </article>
  );

  if (product.external) {
    return (
      <a
        href={product.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={product.href} className="block h-full">
      {content}
    </Link>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <Navbar />
      <Hero />

      <section className="relative px-6 py-16 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.16),transparent_32%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-3">
            {proofPoints.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
              >
                <CheckCircle2 className="text-blue-400" size={22} />

                <h3 className="mt-4 text-lg font-bold">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.14),transparent_28%),radial-gradient(circle_at_85%_75%,rgba(16,185,129,0.1),transparent_32%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                <Network className="h-4 w-4" />
                The AEMA Ecosystem
              </div>

              <h2 className="mt-6 text-3xl font-black tracking-tight md:text-5xl">
                One intelligent business ecosystem.
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                AEMA Systems connects strategy, operations, and compliance so
                growing businesses can understand what to improve, manage daily
                work, and build trust with customers.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/ai"
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
                >
                  Explore AEMA AI
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/compliance-os"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]"
                >
                  Explore Compliance OS
                </Link>
              </div>
            </div>

            <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 md:p-8">
              <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.15),transparent_40%)]" />

              <div className="relative space-y-4">
                <EcosystemNode
                  icon={Bot}
                  title="AEMA AI"
                  subtitle="Business strategy and intelligence"
                  tone="blue"
                />

                <div className="ml-6 h-8 w-px bg-gradient-to-b from-blue-400/60 to-emerald-400/60" />

                <EcosystemNode
                  icon={ShieldCheck}
                  title="Compliance OS"
                  subtitle="Governance, readiness, and trust"
                  tone="emerald"
                />

                <div className="ml-6 h-8 w-px bg-gradient-to-b from-emerald-400/60 to-cyan-400/60" />

                <EcosystemNode
                  icon={Briefcase}
                  title="TaskFlow"
                  subtitle="Contacts, bookings, tasks, and follow-ups"
                  tone="cyan"
                />

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    One connected direction
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    Understand → Govern → Operate → Grow
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
              AEMA Products
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
              Intelligent systems built around real business needs.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Each AEMA product solves a different part of the business
              journey—strategy, operations, and compliance.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.title}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>

      <Services />

      <section className="relative overflow-hidden bg-[#071224] px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_88%_80%,rgba(14,165,233,0.12),transparent_35%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              Compliance OS
            </div>

            <h2 className="mt-6 text-3xl font-black tracking-tight md:text-5xl">
              Understand your compliance before problems appear.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Compliance OS helps businesses assess readiness, identify
              governance gaps, understand applicable frameworks, and prepare
              tailored documents for review.
            </p>

            <div className="mt-8 space-y-4">
              {complianceCapabilities.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 text-sm leading-7 text-slate-300"
                >
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/compliance-os/assessment"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-6 py-3.5 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
              >
                Start Compliance Assessment
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/compliance-os"
                className="inline-flex items-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.08]"
              >
                Learn more
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <CompliancePreviewCard
                label="Overall readiness"
                value="72%"
                helper="Weighted document and governance readiness"
              />

              <CompliancePreviewCard
                label="Frameworks"
                value="5"
                helper="PIPEDA, AODA, SOC 2, ISO 27001, and more"
              />

              <CompliancePreviewCard
                label="Key risks"
                value="3"
                helper="Privacy, security, vendor, and AI exposure"
              />

              <CompliancePreviewCard
                label="Missing documents"
                value="6"
                helper="Policies, plans, and governance registers"
              />
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                Tailored output
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Businesses receive a preliminary readiness result, key risk
                findings, framework recommendations, and a route to generate a
                personalized compliance package.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-[#071224] px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(14,165,233,0.12),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
                Why AEMA Systems
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                We build business infrastructure, not just pages on the internet.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                AEMA is designed for businesses that need more than a website:
                they need systems for operations, customers, decisions,
                compliance, and growth.
              </p>
            </div>

            <div className="grid gap-5">
              {benefits.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur"
                  >
                    <div className="flex gap-4">
                      <div className="h-fit rounded-2xl bg-blue-500/10 p-3 text-blue-300">
                        <Icon size={22} />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold">
                          {item.title}
                        </h3>

                        <p className="mt-3 leading-7 text-slate-300">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Industries />

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-black/20 md:p-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
              Our Process
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
              From business idea to working intelligent system.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {workflowSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-3xl border border-white/10 bg-[#020617]/70 p-6"
              >
                <p className="text-sm font-black text-blue-400">
                  {step.number}
                </p>

                <h3 className="mt-4 text-xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 rounded-[2rem] border border-blue-400/20 bg-blue-600/10 p-7 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-300">
              Growth Blueprint
            </p>

            <h2 className="mt-4 text-3xl font-black md:text-4xl">
              Want to know what your business should improve next?
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Use AEMA AI to evaluate your business strategy, competitors,
              strengths, weaknesses, digital positioning, and growth
              opportunities.
            </p>
          </div>

          <Link
            to="/ai"
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
          >
            Try AEMA AI
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Founder />

      <section id="booking">
        <BookingForm />
      </section>

      <Footer />
    </main>
  );
}

function EcosystemNode({
  icon: Icon,
  title,
  subtitle,
  tone,
}) {
  const tones = {
    blue: "border-blue-400/20 bg-blue-400/10 text-blue-300",
    emerald:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${tones[tone]}`}
      >
        <Icon className="h-5 w-5" />
      </span>

      <div>
        <p className="font-bold text-white">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function CompliancePreviewCard({
  label,
  value,
  helper,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-white">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {helper}
      </p>
    </div>
  );
}
