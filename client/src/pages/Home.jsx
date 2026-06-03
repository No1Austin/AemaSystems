import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Industries from "../components/Industries";
import Founder from "../components/Founder";
import BookingForm from "../components/BookingForm";
import Footer from "../components/Footer";

const events = [
  {
    title: "AI for Small Business",
    date: "June 15, 2026",
    location: "Toronto, ON",
    description: "Learn practical AI tools to improve workflows and operations.",
    status: "Registration opens soon",
  },
  {
    title: "Founder Tech Night",
    date: "July 5, 2026",
    location: "Virtual",
    description: "Networking and discussions for founders and builders.",
    status: "Coming soon",
  },
];

const webinars = [
  {
    title: "Automation Basics",
    date: "June 30, 2026",
    duration: "1 hour",
    description: "How automation can save time in your business.",
    status: "Registration opens soon",
  },
  {
    title: "AI Tools for Founders",
    date: "July 12, 2026",
    duration: "90 mins",
    description: "AI workflows for content, operations, and planning.",
    status: "Coming soon",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <Hero />
      <Services />
      <Industries />

      <section id="events" className="bg-slate-950 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Events
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-5xl">
            Upcoming Events
          </h2>

          <p className="mt-4 max-w-3xl text-slate-300">
            Join AEMA Systems events, workshops, and business technology
            sessions.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {events.map((event) => (
              <div
                key={event.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-xl font-semibold">{event.title}</h3>

                <p className="mt-2 text-sm text-blue-400">
                  {event.date} • {event.location}
                </p>

                <p className="mt-4 text-slate-300">{event.description}</p>

                <p className="mt-6 text-sm font-semibold text-white">
                  {event.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="webinars" className="bg-[#020617] px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Webinars
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-5xl">
            Upcoming Webinars
          </h2>

          <p className="mt-4 max-w-3xl text-slate-300">
            Learn about automation, AI tools, business systems, and digital
            growth.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {webinars.map((webinar) => (
              <div
                key={webinar.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-xl font-semibold">{webinar.title}</h3>

                <p className="mt-2 text-sm font-medium text-blue-400">
                  {webinar.date} • {webinar.duration}
                </p>

                <p className="mt-4 text-slate-300">{webinar.description}</p>

                <p className="mt-6 text-sm font-semibold text-white">
                  {webinar.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#020617] px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Why AEMA Systems
          </p>

          <h2 className="mt-3 max-w-4xl text-3xl font-bold md:text-5xl">
            We do more than build websites. We build business systems.
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              [
                "Business First",
                "We understand operations, marketing, workflows, and the real problems small businesses face.",
              ],
              [
                "Built to Grow",
                "Our systems are designed to start simple and scale into bookings, dashboards, automation, and internal tools.",
              ],
              [
                "AI-Assisted",
                "We use practical AI tools to improve speed, workflows, documentation, and smarter business processes.",
              ],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Founder />

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Our Process
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-5xl">
            From idea to working system.
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              [
                "01",
                "Discover",
                "We understand your idea, business flow, and goals.",
              ],
              [
                "02",
                "Plan",
                "We map the features, workflows, and system structure.",
              ],
              [
                "03",
                "Build",
                "We design, develop, test, and deploy your solution.",
              ],
              [
                "04",
                "Support",
                "We maintain, improve, and help your system grow.",
              ],
            ].map(([number, title, text]) => (
              <div key={title} className="rounded-3xl bg-slate-900 p-6">
                <p className="text-sm text-blue-400">{number}</p>
                <h3 className="mt-3 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="booking">
        <BookingForm />
      </section>

      <Footer />
    </main>
  );
}