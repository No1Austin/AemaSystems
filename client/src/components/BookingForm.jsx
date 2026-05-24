import { useState } from "react";
import { CalendarCheck, Loader2 } from "lucide-react";
import { createBooking } from "../api/bookingApi";

export default function BookingForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    industry: "",
    challenge: "",
    budget: "",
    preferredDate: "",
    preferredTime: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-slate-900 p-4 text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      await createBooking(form);

      setStatus(
        "Booking request submitted successfully. We will contact you shortly."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        business: "",
        industry: "",
        challenge: "",
        budget: "",
        preferredDate: "",
        preferredTime: "",
      });
    } catch {
      setStatus("Something went wrong. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="booking"
      className="relative overflow-hidden px-6 py-24 md:px-12 lg:px-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_35%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            <CalendarCheck size={16} />
            Start your project
          </div>

          <h2 className="text-4xl font-bold leading-tight md:text-6xl">
            Book a Consultation
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Tell us about your idea, business, or system you want to build.
            AEMA Systems helps turn ideas into intelligent systems through web
            apps, automation, AI workflows, and practical business tools.
          </p>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="font-semibold text-white">What happens next?</p>

            <div className="mt-5 space-y-4 text-slate-300">
              <p>1. You submit your project or business idea.</p>
              <p>2. We review your needs and preferred time.</p>
              <p>3. You receive a confirmation and next steps.</p>
              <p>4. We discuss how to bring your idea to life.</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl backdrop-blur md:p-10">
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="business"
                placeholder="Business Name"
                value={form.business}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <input
                name="industry"
                placeholder="Industry"
                value={form.industry}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="budget"
                placeholder="Estimated Budget"
                value={form.budget}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <textarea
              name="challenge"
              placeholder="What do you need help building?"
              value={form.challenge}
              onChange={handleChange}
              className={inputClass}
              rows="5"
              required
            />

            <div className="grid gap-5 md:grid-cols-2">
              <input
                name="preferredDate"
                type="date"
                value={form.preferredDate}
                onChange={handleChange}
                className={`${inputClass} calendar-white`}
                required
              />

              <input
                name="preferredTime"
                type="time"
                value={form.preferredTime}
                onChange={handleChange}
                className={`${inputClass} calendar-white`}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={20} />
                  Submitting...
                </>
              ) : (
                "Submit Booking Request"
              )}
            </button>

            {status && (
              <p
                className={`rounded-xl p-4 text-sm ${
                  status.includes("successfully")
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}