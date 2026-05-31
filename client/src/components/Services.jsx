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
} from "lucide-react";

const services = [
  {
    title: "Software Development",
    Icon: Code2,
    description:
      "Custom web applications, client portals, dashboards, and scalable digital platforms built for real business operations.",
  },
  {
    title: "AI Automation",
    Icon: Bot,
    description:
      "AI workflows and automation tools that reduce manual work and help businesses operate smarter.",
  },
  {
    title: "SEO Optimization",
    Icon: Search,
    description:
      "Technical SEO, on-page SEO, local SEO, Search Console setup, and keyword strategy to improve visibility.",
  },
  {
    title: "E-Commerce Development",
    Icon: ShoppingCart,
    description:
      "Shopify, WooCommerce, online stores, payment integration, product pages, and sales-focused experiences.",
  },
  {
    title: "Business Systems",
    Icon: Workflow,
    description:
      "Operations systems, workflow design, CRM setup, reporting, and process improvement for growth.",
  },
  {
    title: "Business Websites",
    Icon: Globe,
    description:
      "Professional websites, landing pages, responsive design, and digital presence built to convert visitors.",
  },
  {
    title: "Booking Systems",
    Icon: CalendarCheck,
    description:
      "Custom booking platforms for consultations, appointments, reminders, and client scheduling workflows.",
  },
  {
    title: "Admin Dashboards",
    Icon: LayoutDashboard,
    description:
      "Secure dashboards for users, bookings, orders, reports, analytics, and business activity management.",
  },
  {
    title: "Operations Support",
    Icon: BarChart3,
    description:
      "Digital operations support, reporting, systems guidance, and technology planning for growing businesses.",
  },
];

const highlights = [
  ["Fast Delivery", "On-time, every time.", Zap],
  ["Secure & Reliable", "Built with best practices.", ShieldCheck],
  ["Scalable Solutions", "Designed for growth.", Rocket],
  ["Ongoing Support", "Support beyond launch.", Headphones],
];

const industries = [
  "Healthcare",
  "Education",
  "Retail & E-Commerce",
  "Professional Services",
  "Nonprofits",
  "Startups",
  "Consulting Firms",
  "Small Businesses",
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#020617] px-6 py-24 text-white"
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <div className="mx-auto inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">
          What We Do
        </div>

        <h2 className="mx-auto mt-6 max-w-5xl text-4xl font-black leading-tight md:text-6xl">
          Powerful Digital Solutions <br />
          Built for <span className="text-blue-500">Your Business</span>
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          AEMA Systems helps businesses automate, optimize, and grow with custom
          software, AI automation, SEO, e-commerce, booking platforms, and
          high-performance business systems.
        </p>

        {/* Moving Services */}
        <div className="relative mt-16 overflow-hidden">
          <div className="flex w-max animate-[scrollServices_35s_linear_infinite] gap-6 hover:[animation-play-state:paused]">
            {[...services, ...services].map(({ title, Icon, description }, index) => (
              <article
                key={`${title}-${index}`}
                className="group flex h-[300px] w-[260px] shrink-0 flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] p-7 text-center backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-blue-400/70 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-blue-500/20"
              >
                <Icon
                  size={48}
                  className="mb-6 text-blue-400 transition duration-300 group-hover:scale-110 group-hover:text-cyan-300"
                />

                <h3 className="text-xl font-bold text-white">{title}</h3>

                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-4">
          {highlights.map(([title, text, Icon]) => (
            <div
              key={title}
              className="flex items-center justify-center gap-4 border-white/10 md:border-r md:last:border-r-0"
            >
              <Icon className="text-blue-400" size={30} />

              <div className="text-left">
                <h4 className="font-bold text-white">{title}</h4>
                <p className="mt-1 text-sm text-slate-400">{text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Industries */}
        <div className="mx-auto mt-16 max-w-5xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <h3 className="text-2xl font-bold text-white md:text-3xl">
            Industries We Support
          </h3>

          <p className="mx-auto mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            From healthcare providers and educational institutions to retail
            businesses, professional service firms, nonprofits, and growing
            startups, AEMA Systems delivers practical technology solutions that
            improve efficiency, visibility, and long-term growth.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {industries.map((industry) => (
              <span
                key={industry}
                className="rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>

        <a
          href="#booking"
          className="mx-auto mt-12 inline-flex items-center justify-center rounded-xl border border-blue-500 bg-blue-600 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-blue-500"
        >
          Let&apos;s Build Something Amazing
        </a>
      </div>

      <style>{`
        @keyframes scrollServices {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}