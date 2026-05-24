import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import { motion } from "framer-motion";
import Services from "../components/Services";
import Founder from "../components/Founder";
import BookingForm from "../components/BookingForm";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <Hero />
      <Services />

      <section className="bg-white px-6 py-20 text-slate-950">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Why AEMA Systems
          </p> 

          <h2 className="mt-3 max-w-4xl text-3xl font-bold md:text-5xl">
            We do more than build websites. We build business systems.
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-slate-100 p-6">
              <h3 className="text-xl font-semibold">Business First</h3>
              <p className="mt-3 text-slate-700">
                We understand operations, marketing, workflows, and the real
                problems small businesses face.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-100 p-6">
              <h3 className="text-xl font-semibold">Built to Grow</h3>
              <p className="mt-3 text-slate-700">
                Our systems are designed to start simple and scale into bookings,
                dashboards, automation, and internal tools.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-100 p-6">
              <h3 className="text-xl font-semibold">AI-Assisted</h3>
              <p className="mt-3 text-slate-700">
                We use practical AI tools to improve speed, workflows,
                documentation, and smarter business processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Founder />

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
            Our Process
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-5xl">
            From idea to working system.
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              ["01", "Discover", "We understand your idea, business flow, and goals."],
              ["02", "Plan", "We map the features, workflows, and system structure."],
              ["03", "Build", "We design, develop, test, and deploy your solution."],
              ["04", "Support", "We maintain, improve, and help your system grow."],
            ].map(([number, title, text]) => (
              <div key={title} className="rounded-3xl bg-slate-900 p-6">
                <p className="text-sm text-emerald-400">{number}</p>
                <h3 className="mt-3 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BookingForm />
      <Footer />
    </main>
  );
}
