import {
  Code2,
  Bot,
  Workflow,
  ShoppingCart,
  Search,
  Globe,
  LayoutDashboard,
  CalendarCheck,
  BarChart3,
  Zap,
  ShieldCheck,
  Rocket,
  Headphones,
  ArrowRight,
} from "lucide-react";

const services = [
  ["Software Development", Code2, "Custom web apps, portals, dashboards, and platforms built for real business operations."],
  ["AI Automation", Bot, "AI workflows that reduce repetitive tasks and help your business operate smarter."],
  ["Business Systems", Workflow, "CRM tools, workflow design, reporting, and internal systems for growth."],
  ["Business Websites", Globe, "Modern websites and landing pages designed to build trust and convert visitors."],
  ["Booking Systems", CalendarCheck, "Appointment, consultation, reminder, and client scheduling platforms."],
  ["Admin Dashboards", LayoutDashboard, "Secure dashboards for bookings, orders, users, reports, analytics, and activity."],
  ["SEO Optimization", Search, "Technical SEO, local SEO, keyword strategy, and search visibility improvements."],
  ["E-Commerce", ShoppingCart, "Online stores, product pages, payment integrations, and sales-focused experiences."],
  ["Operations Support", BarChart3, "Digital operations guidance, reporting, systems planning, and process improvement."],
];

const highlights = [
  ["Fast Delivery", "Clear timelines and focused execution.", Zap],
  ["Secure Build", "Reliable systems with best practices.", ShieldCheck],
  ["Built to Scale", "Designed for long-term growth.", Rocket],
  ["Ongoing Support", "Support beyond launch.", Headphones],
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#020617] px-6 py-24 text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.18),transparent_30%),radial-gradient(circle_at_90%_40%,rgba(14,165,233,0.12),transparent_28%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
            What We Do
          </p>

          <h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
            Digital systems built to make your business smarter.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            AEMA Systems helps businesses build software, automate operations,
            improve visibility, manage customers, and scale with confidence.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(([title, Icon, description]) => (
            <article
              key={title}
              className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:bg-white/[0.07]"
            >
              <div className="inline-flex rounded-2xl border border-blue-400/20 bg-blue-500/10 p-3 text-blue-300 transition group-hover:text-cyan-300">
                <Icon size={26} />
              </div>

              <h3 className="mt-6 text-xl font-bold">{title}</h3>

              <p className="mt-4 leading-7 text-slate-300">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 grid gap-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:grid-cols-4 md:p-8">
          {highlights.map(([title, text, Icon]) => (
            <div key={title} className="flex gap-4">
              <div className="h-fit rounded-2xl bg-blue-500/10 p-3 text-blue-300">
                <Icon size={22} />
              </div>

              <div>
                <h4 className="font-bold">{title}</h4>
                <p className="mt-1 text-sm leading-6 text-slate-400">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-[2rem] border border-blue-400/20 bg-blue-600/10 p-7 text-center md:p-10">
          <h3 className="text-3xl font-black md:text-4xl">
            Have an idea, workflow, or business problem?
          </h3>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
            We can help you turn it into a working system with software,
            automation, AI, and a clear business plan.
          </p>

          <a
            href="#booking"
            className="mt-8 inline-flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
          >
            Let&apos;s Build Something Amazing
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}