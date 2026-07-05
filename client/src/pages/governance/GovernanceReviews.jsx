import {
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck,
} from "lucide-react";
import GovernanceSidebar from "../../components/governance/GovernanceSidebar";

const reviews = [
  {
    title: "Privacy Policy",
    category: "Privacy",
    status: "Scheduled",
    lastReviewed: "July 5, 2026",
    nextReview: "Jan 5, 2027",
  },
  {
    title: "Terms of Service",
    category: "Legal",
    status: "Scheduled",
    lastReviewed: "July 5, 2026",
    nextReview: "Jan 5, 2027",
  },
  {
    title: "Responsible AI Policy",
    category: "AI Governance",
    status: "Scheduled",
    lastReviewed: "July 5, 2026",
    nextReview: "Jan 5, 2027",
  },
  {
    title: "Information Security Policy",
    category: "Security",
    status: "Scheduled",
    lastReviewed: "July 5, 2026",
    nextReview: "Jan 5, 2027",
  },
  {
    title: "Password Policy",
    category: "Security",
    status: "Draft Review",
    lastReviewed: "Not reviewed",
    nextReview: "Pending approval",
  },
];

export default function GovernanceReviews() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_1fr]">
        <GovernanceSidebar />

        <div>
          <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10">
                <CalendarClock className="h-7 w-7 text-emerald-400" />
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">
                  Governance Reviews
                </p>
                <h1 className="mt-2 text-4xl font-black">Review Calendar</h1>
              </div>
            </div>

            <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-300">
              Track policy reviews, approval dates, next review cycles, and
              governance maintenance activities for AEMA Systems.
            </p>
          </section>

          <section className="mt-8 grid gap-4">
            {reviews.map((review) => (
              <div
                key={review.title}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10">
                      <FileText className="h-6 w-6 text-cyan-400" />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold">{review.title}</h2>
                      <p className="mt-1 text-sm text-slate-400">
                        {review.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-300">
                      {review.status}
                    </span>

                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-slate-400">
                      Last: {review.lastReviewed}
                    </span>

                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-300">
                      Next: {review.nextReview}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              <h2 className="mt-4 text-3xl font-black">4</h2>
              <p className="mt-2 text-sm text-slate-400">Scheduled Reviews</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <Clock className="h-6 w-6 text-amber-400" />
              <h2 className="mt-4 text-3xl font-black">1</h2>
              <p className="mt-2 text-sm text-slate-400">Pending Approval</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <ShieldCheck className="h-6 w-6 text-cyan-400" />
              <h2 className="mt-4 text-3xl font-black">Jan 2027</h2>
              <p className="mt-2 text-sm text-slate-400">Next Review Cycle</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}