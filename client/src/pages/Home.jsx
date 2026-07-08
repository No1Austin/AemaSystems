import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Industries from "../components/Industries";
import Founder from "../components/Founder";
import BookingForm from "../components/BookingForm";
import Footer from "../components/Footer";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Briefcase,
  CheckCircle2,
  Gauge,
  Layers3,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

const products = [
  {
    title: "AEMA AI",
    label: "Business Intelligence",
    icon: Bot,
    description:
      "Evaluate your business, understand your digital position, identify strengths and weaknesses, and receive a practical growth blueprint.",
    href: "/ai",
    accent: "blue",
  },
  {
    title: "Compliance OS",
    label: "Governance Platform",
    icon: ShieldCheck,
    description:
      "Manage policies, risks, controls, evidence, reviews, vendors, trust documents, and compliance readiness from one operating system.",
    href: "/compliance-os",
    accent: "emerald",
  },
  {
    title: "TaskFlow",
    label: "Business Management",
    icon: Briefcase,
    description:
      "Manage contacts, bookings, tasks, follow-ups, and business activity with AI-assisted operational insights.",
    href: "https://taskflowaemasystems.com/",
    external: true,
    accent: "cyan",
  },
];

const metrics = [
  ["AI Business Reviews", "Strategy, competitors, positioning, and growth plans."],
  ["Operational Systems", "Bookings, dashboards, automation, CRM, and workflows."],
  ["Compliance Readiness", "Privacy, security, governance, risk, and trust support."],
];

const benefits = [
  {
    title: "Strategy before software",
    icon: Gauge,
    text: "We start with your business model, customer journey, workflow, and growth goals before deciding what to build.",
  },
  {
    title: "AI-assisted execution",
    icon: Sparkles,
    text: "We use practical AI to improve planning, documentation, analysis, automation, and business decision-making.",
  },
  {
    title: "Systems that scale",
    icon: Layers3,
    text: "Your platform can begin simple, then grow into dashboards, booking tools, compliance, payments, and reporting.",
  },
];

const workflowSteps = [
  ["01", "Discover", "We understand your business, goals, customer flow, and current operational challenges."],
  ["02", "Design", "We map the system structure, user experience, features, integrations, and growth opportunities."],
  ["03", "Build", "We develop, test, deploy, and connect your platform with the tools your business needs."],
  ["04", "Improve", "We review results, optimize workflows, and add automation or AI support as the business grows."],
];

function ProductCard({ product }) {
  const Icon = product.icon;

  const accentStyles = {
    blue: "border-blue-400/20 bg-blue-500/10 text-blue-200",
    emerald: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
    cyan: "border-cyan-400/20 bg-cyan-500/10 text-cyan-200",
  };

  const card = (
    <div className="group relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:bg-white/[0.07]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className={`inline-flex rounded-2xl border p-3 ${accentStyles[product.accent]}`}>
        <Icon size={24} />
      </div>

      <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
        {product.label}
      </p>

      <h3 className="mt-3 text-2xl font-black text-white">{product.title}</h3>

      <p className="mt-4 leading-7 text-slate-300">{product.description}</p>

      <div className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-blue-300">
        Explore product <ArrowRight size={16} />
      </div>
    </div>
  );

  return product.external ? (
    <a href={product.href} target="_blank" rel="noopener noreferrer">
      {card}
    </a>
  ) : (
    <a href={product.href}>{card}</a>
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
            {metrics.map(([title, text]) => (
              <div
                key={title}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
              >
                <CheckCircle2 className="text-blue-400" size={22} />
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
              AEMA Ecosystem
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
              One company. Multiple intelligent systems for business growth.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              AEMA Systems brings AI, automation, compliance, and operational
              software together so businesses can understand where they are,
              improve how they work, and scale with confidence.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.title} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Services />

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
                they need systems for operations, customers, decisions, compliance,
                and growth.
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
                        <h3 className="text-xl font-bold">{item.title}</h3>
                        <p className="mt-3 leading-7 text-slate-300">{item.text}</p>
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
            {workflowSteps.map(([number, title, text]) => (
              <div
                key={title}
                className="rounded-3xl border border-white/10 bg-[#020617]/70 p-6"
              >
                <p className="text-sm font-black text-blue-400">{number}</p>
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
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
              strengths, weaknesses, digital positioning, and growth opportunities.
            </p>
          </div>

          <a
            href="/ai"
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
          >
            Try AEMA AI
            <ArrowRight size={18} />
          </a>
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
