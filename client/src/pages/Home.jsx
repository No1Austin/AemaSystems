import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Founder from "../components/Founder";
import BookingForm from "../components/BookingForm";
import Footer from "../components/Footer";

// ======================================
// EVENTS DATA
// Edit here whenever you add new events
// ======================================

const events = [
  {
    title: "AI for Small Business",
    date: "June 15, 2026",
    location: "Toronto, ON",
    description:
      "Learn practical AI tools to improve workflows and operations.",
    status: "Registration opens soon",
  },
  {
    title: "Founder Tech Night",
    date: "July 5, 2026",
    location: "Virtual",
    description:
      "Networking and discussions for founders and builders.",
    status: "Coming soon",
  },
];

// ======================================
// WEBINARS DATA
// Edit here whenever you add webinars
// ======================================

const webinars = [
  {
    title: "Automation Basics",
    date: "June 30, 2026",
    duration: "1 hour",
    description:
      "How automation can save time in your business.",
    status: "Registration opens soon",
  },
  {
    title: "AI Tools for Founders",
    date: "July 12, 2026",
    duration: "90 mins",
    description:
      "AI workflows for content, operations, and planning.",
    status: "Coming soon",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <Hero />
      <Services />

      {/* ======================================
          EVENTS SECTION
      ====================================== */}

      <section id="events" className="bg-slate-950 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
            Events
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-5xl">
            Upcoming Events
          </h2>

          <p className="mt-4 max-w-3xl text-slate-300">
            Join AEMA Systems events, workshops, and business technology sessions.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-xl font-semibold">{event.title}</h3>

                <p className="mt-2 text-sm text-emerald-400">
                  {event.date} • {event.location}
                </p>

                <p className="mt-4 text-slate-300">
                  {event.description}
                </p>

                <p className="mt-6 text-sm font-semibold text-white">
                  {event.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================
          WEBINARS SECTION
      ====================================== */}

      <section id="webinars" className="bg-white px-6 py-20 text-slate-950">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Webinars
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-5xl">
            Upcoming Webinars
          </h2>

          <p className="mt-4 max-w-3xl text-slate-700">
            Learn about automation, AI tools, business systems, and digital growth.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {webinars.map((webinar) => (
              <div key={webinar.title} className="rounded-3xl bg-slate-100 p-6">
                <h3 className="text-xl font-semibold">{webinar.title}</h3>

                <p className="mt-2 text-sm font-medium text-blue-600">
                  {webinar.date} • {webinar.duration}
                </p>

                <p className="mt-4 text-slate-700">
                  {webinar.description}
                </p>

                <p className="mt-6 text-sm font-semibold text-slate-950">
                  {webinar.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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