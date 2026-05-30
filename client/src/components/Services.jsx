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
} from "lucide-react";

const services = [
  {
    title: "Software Development",
    Icon: Code2,
    description:
      "Custom web applications, business management systems, client portals, dashboards, and scalable digital platforms built for real business operations.",
    keywords: ["Web Apps", "Dashboards", "Client Portals", "API Integrations"],
  },
  {
    title: "AI Automation",
    Icon: Bot,
    description:
      "AI-powered workflows and automation tools that reduce manual work, improve response times, and help businesses operate smarter.",
    keywords: ["AI Workflows", "Lead Automation", "Email Automation", "Smart Tools"],
  },
  {
    title: "Business Systems",
    Icon: Workflow,
    description:
      "Practical systems for operations, workflow design, process improvement, CRM setup, reporting, and business performance tracking.",
    keywords: ["Operations", "CRM", "Workflow Design", "Process Improvement"],
  },
  {
    title: "E-Commerce Development",
    Icon: ShoppingCart,
    description:
      "Modern online stores, Shopify websites, WooCommerce solutions, payment integration, product pages, and sales-focused customer experiences.",
    keywords: ["Shopify", "WooCommerce", "Online Stores", "Payments"],
  },
  {
    title: "SEO Optimization",
    Icon: Search,
    description:
      "Search engine optimization services including technical SEO, on-page SEO, local SEO, Google Search Console setup, and keyword strategy.",
    keywords: ["Technical SEO", "Local SEO", "On-Page SEO", "Search Console"],
  },
  {
    title: "Business Websites",
    Icon: Globe,
    description:
      "Professional business websites, landing pages, portfolio sites, and responsive digital experiences designed to build trust and convert visitors.",
    keywords: ["Web Design", "Landing Pages", "Responsive Design", "Brand Presence"],
  },
  {
    title: "Booking Systems",
    Icon: CalendarCheck,
    description:
      "Custom booking platforms for consultations, appointments, service businesses, events, reminders, and client scheduling workflows.",
    keywords: ["Scheduling", "Appointments", "Consultations", "Reminders"],
  },
  {
    title: "Admin Dashboards",
    Icon: LayoutDashboard,
    description:
      "Secure admin dashboards for managing users, bookings, orders, analytics, forms, reports, and day-to-day business activities.",
    keywords: ["Admin Panels", "Reports", "Analytics", "User Management"],
  },
  {
    title: "Operations Support",
    Icon: BarChart3,
    description:
      "Digital operations support for growing businesses that need better systems, clearer workflows, reporting, and technology guidance.",
    keywords: ["Operations", "Reporting", "Strategy", "Business Growth"],
  },
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
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
          Services
        </p>

        <h2 className="mt-3 max-w-5xl text-3xl font-black md:text-5xl">
          Technology Solutions That Drive Growth
        </h2>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Austin Amadi | AEMA Systems helps businesses build digital platforms,
          automate operations, improve search visibility, launch e-commerce
          stores, and create intelligent systems that support long-term growth.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ title, Icon, description, keywords }) => (
            <article
              key={title}
              className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-2 hover:border-emerald-400/60 hover:bg-white/10"
            >
              <Icon className="mb-5 text-emerald-400" size={34} />

              <h3 className="text-xl font-bold text-white">{title}</h3>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                {description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-5xl text-center">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h3 className="text-2xl font-bold text-white md:text-3xl">
              Industries We Support
            </h3>

            <p className="mx-auto mt-5 max-w-4xl text-lg leading-8 text-slate-300">
              From healthcare providers and educational institutions to retail
              businesses, professional service firms, nonprofits, and growing
              startups, AEMA Systems delivers practical technology solutions
              that improve efficiency, visibility, and long-term growth.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {industries.map((industry) => (
                <span
                  key={industry}
                  className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}