import { CalendarCheck, LayoutDashboard, Workflow, Bot, Globe, BarChart3 } from "lucide-react";

const services = [
  ["Booking Systems", CalendarCheck],
  ["Admin Dashboards", LayoutDashboard],
  ["Workflow Apps", Workflow],
  ["AI Automation", Bot],
  ["Business Websites", Globe],
  ["Operations Support", BarChart3],
];

export default function Services() {
  return (
    <section id="services" className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
          Services
        </p>

        <h2 className="mt-3 text-3xl font-bold md:text-5xl">
          Practical systems for real business growth.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map(([title, Icon]) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <Icon className="mb-5 text-emerald-400" size={32} />
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-slate-300">
                Custom-built solutions designed to reduce manual work,
                improve workflows, and support smarter business operations.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}