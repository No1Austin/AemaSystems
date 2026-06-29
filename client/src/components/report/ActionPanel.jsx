import { Link } from "react-router-dom";

export default function ActionPanel({ payment = {}, downloadReport, openBooking }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 space-y-3">
      <button
        type="button"
        onClick={downloadReport}
        className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold"
      >
        Download PDF Report
      </button>

      {payment.plan === "blueprint" && (
        <button
          type="button"
          onClick={() => openBooking("regular")}
          className="w-full rounded-xl bg-white px-5 py-3 font-semibold text-slate-900"
        >
          Book 30-Min Consultation
        </button>
      )}

      {payment.plan === "expert" && (
        <button
          type="button"
          onClick={() => openBooking("expert")}
          className="w-full rounded-xl bg-white px-5 py-3 font-semibold text-slate-900"
        >
          Book Included Expert Session
        </button>
      )}

      {payment.plan === "partner" && (
        <button
          type="button"
          onClick={() => openBooking("partner")}
          className="w-full rounded-xl bg-white px-5 py-3 font-semibold text-slate-900"
        >
          Schedule Partner Session
        </button>
      )}

      <Link
        to="/ai"
        className="block w-full rounded-xl border border-white/10 px-5 py-3 text-center font-semibold"
      >
        Return to AEMA AI
      </Link>
    </div>
  );
}
