import {
  HeartPulse,
  GraduationCap,
  ShoppingBag,
  BriefcaseBusiness,
  Building2,
  Rocket,
  Hotel,
  HandHeart,
} from "lucide-react";

const industries = [
  ["Healthcare", "Booking, admin workflows, patient-focused digital tools.", HeartPulse],
  ["Education", "Websites, dashboards, training systems, and automation.", GraduationCap],
  ["Retail & E-Commerce", "Online stores, product pages, SEO, and sales systems.", ShoppingBag],
  ["Professional Services", "Client portals, booking systems, CRM, and reporting.", BriefcaseBusiness],
  ["Real Estate", "Lead capture, property pages, automation, and client workflows.", Building2],
  ["Startups & SMEs", "MVPs, landing pages, scalable systems, and launch support.", Rocket],
  ["Hospitality", "Booking flows, service websites, guest communication tools.", Hotel],
  ["Nonprofits", "Donation pages, awareness websites, operations support.", HandHeart],
];

export default function Industries() {
  return (
    <section
      id="industries"
      className="relative overflow-hidden bg-[#020617] px-6 py-24 text-white"
    >
      <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            Industries We Serve
          </p>

          <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-black md:text-5xl">
            Built for businesses that need smarter systems.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-slate-300">
            AEMA Systems supports organizations across industries with software,
            automation, SEO, e-commerce, booking platforms, and business systems
            designed for real growth.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map(([title, text, Icon]) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-blue-400/60 hover:bg-white/[0.08]"
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl transition group-hover:bg-blue-500/20" />

              <div className="relative">
                <div className="mb-6 inline-flex rounded-2xl border border-blue-400/20 bg-blue-500/10 p-3 text-blue-300">
                  <Icon size={28} />
                </div>

                <h3 className="text-lg font-bold text-white">{title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {text}
                </p>

                <div className="mt-6 h-1 w-10 rounded-full bg-blue-500 transition-all duration-300 group-hover:w-24" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}