import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import BookingModal from "../components/BookingModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingPlan, setBookingPlan] = useState(null);

  const downloadReport = async () => {
    try {
      const report = payment?.fullReport;

      if (!report) {
        alert("Report is not available yet.");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/reports/download-pdf`,
        { report },
        { responseType: "blob" }
      );

      const file = new Blob([response.data], {
        type: "application/pdf",
      });

      const fileURL = URL.createObjectURL(file);

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "AEMA-Growth-Blueprint.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error(error);
      alert("Could not download PDF. Please try again.");
    }
  };

  const openBooking = (plan) => {
    setBookingPlan(plan);
    setShowBooking(true);
  };

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!sessionId) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_URL}/api/payments/verify-session/${sessionId}`
        );

        setPayment(response.data);
      } catch (error) {
        console.error(error);

        setPayment({
          success: false,
          paid: false,
          message: "Could not verify payment.",
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <p>Verifying payment...</p>
      </main>
    );
  }

  if (!payment?.paid) {
    return (
      <main className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-6">
        <section className="max-w-xl text-center rounded-3xl border border-white/10 bg-white/5 p-10">
          <h1 className="text-3xl font-bold mb-4">Payment Not Verified</h1>

          <p className="text-slate-300 mb-8">
            We could not verify your payment. Please contact AEMA Systems if you
            were charged.
          </p>

          <Link
            to="/ai"
            className="inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold"
          >
            Return to AEMA AI
          </Link>
        </section>
      </main>
    );
  }

  const report = payment.fullReport;
  const planName = payment.planLabel || payment.plan;

  return (
    <main className="payment-success-page min-h-screen bg-[#020617] text-white px-6 py-24">
      <section className="mx-auto max-w-5xl">
        <div className="text-center rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl mb-8">
          <h1 className="text-4xl font-bold mb-4">Payment Successful 🎉</h1>

          <p className="text-slate-300 mb-6">
            Thank you. Your payment has been verified.
          </p>

          <div className="mx-auto max-w-xl rounded-2xl bg-white/5 border border-white/10 p-5 mb-8 text-left">
            <p>
              <strong>Plan:</strong> {planName}
            </p>

            <p>
              <strong>Email:</strong> {payment.customerEmail || "Not available"}
            </p>

            <p>
              <strong>Amount:</strong>{" "}
              ${(payment.amountTotal / 100).toFixed(2)}{" "}
              {payment.currency?.toUpperCase()}
            </p>
          </div>

          {payment.plan === "blueprint" && (
            <p className="text-slate-300">
              Your AEMA Growth Blueprint report is ready below. If you want to
              discuss the report with an expert, you can book a separate
              30-minute consultation for $30.
            </p>
          )}

          {payment.plan === "expert" && (
            <p className="text-slate-300">
              Your Blueprint + Expert package is active. Your report is ready
              below, and your included 30-minute expert session can be booked
              from this page.
            </p>
          )}

          {payment.plan === "partner" && (
            <p className="text-slate-300">
              Your AEMA Business Partner subscription is active. Your report is
              ready below, and you can schedule your monthly partner session.
            </p>
          )}
        </div>

        {report && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-3">{report.title}</h2>

              {report.executiveSummary?.length > 0 && (
                <>
                  <h3 className="text-xl font-bold mb-4 text-blue-300">
                    Executive Summary
                  </h3>

                  <ul className="space-y-3 text-slate-300">
                    {report.executiveSummary.map((item, index) => (
                      <li
                        key={index}
                        className="rounded-xl bg-white/5 border border-white/10 p-4"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 mb-8">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <h3 className="font-bold mb-3">Business Snapshot</h3>

                <p>
                  <strong>Business:</strong>{" "}
                  {report.businessSnapshot?.businessType || "Not provided"}
                </p>

                <p>
                  <strong>Goal:</strong>{" "}
                  {report.businessSnapshot?.goal || "Not provided"}
                </p>

                <p>
                  <strong>Lead Source:</strong>{" "}
                  {report.businessSnapshot?.leadSource || "Not provided"}
                </p>

                {report.businessSnapshot?.serviceLocation && (
                  <p>
                    <strong>Location:</strong>{" "}
                    {report.businessSnapshot.serviceLocation}
                  </p>
                )}

                <p>
                  <strong>Website:</strong>{" "}
                  {report.businessSnapshot?.websiteStatus || "Not provided"}
                </p>

                {report.businessSnapshot?.websiteUrl && (
                  <p>
                    <strong>Website URL:</strong>{" "}
                    {report.businessSnapshot.websiteUrl}
                  </p>
                )}

                {report.businessSnapshot?.marketingChannels && (
                  <p>
                    <strong>Marketing:</strong>{" "}
                    {report.businessSnapshot.marketingChannels}
                  </p>
                )}

                {report.businessSnapshot?.salesProcess && (
                  <p>
                    <strong>Sales Process:</strong>{" "}
                    {report.businessSnapshot.salesProcess}
                  </p>
                )}
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <h3 className="font-bold mb-6 text-center">
                  AEMA Growth Health
                </h3>

                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping"></div>

                    <div className="growth-heartbeat relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-blue-400 bg-[#0f172a] shadow-[0_0_50px_rgba(59,130,246,0.45)]">
                      <span className="text-4xl font-extrabold text-white">
                        {report.growthScore}
                      </span>
                    </div>
                  </div>

                  <span className="mt-4 text-sm uppercase tracking-[0.3em] text-blue-300">
                    Growth Score
                  </span>

                  <span className="mt-2 text-lg font-semibold text-slate-300">
                    {report.growthPotential}
                  </span>

                  <p className="mt-4 text-center text-sm text-slate-400">
                    Based on your AEMA assessment, this score reflects the
                    current health and growth readiness of your business.
                  </p>
                </div>
              </div>
            </div>

            <ReportSection title="Strengths" items={report.strengths} />
            <ReportSection title="Weaknesses" items={report.weaknesses} />
            <ReportSection title="Opportunities" items={report.opportunities} />
            <ReportSection title="Risks" items={report.risks} />
            <ReportSection
              title="Website Analysis"
              items={report.websiteAnalysis}
            />
            <ReportSection
              title="Marketing Analysis"
              items={report.marketingAnalysis}
            />
            <ReportSection
              title="Automation Analysis"
              items={report.automationAnalysis}
            />
            <ReportSection
              title="Business Systems Analysis"
              items={report.businessSystemsAnalysis}
            />
            <ReportSection
              title="30-Day Action Plan"
              items={report.actionPlan30Days}
            />


            {report.prioritizedRecommendations?.length > 0 && (
  <section className="mt-10 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6">
    <h3 className="text-2xl font-bold mb-4">
      Priority Recommendations
    </h3>

    {report.advisorNotes?.length > 0 && (
  <section className="mt-10 rounded-3xl border border-purple-500/20 bg-purple-500/10 p-6">
    <h3 className="text-2xl font-bold mb-4">
      AEMA Advisor Notes
    </h3>
{report.growthProjection && (
  <section className="mt-10 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
    <h3 className="text-2xl font-bold mb-4">
      Growth Projection
    </h3>

    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-slate-300">
            {report.growthProjection.currentScore}
          </span>
          <span className="text-sm text-slate-400">
            Current Score
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-slate-300">
            {report.growthProjection.projectedRange}
          </span>
          <span className="text-sm text-slate-400">
            Projected Range
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-slate-300">
            {report.growthProjection.timeframe}
          </span>
          <span className="text-sm text-slate-400">
            Timeframe
          </span>
        </div>
      </div>

      <p className="text-slate-300">
        {report.growthProjection.statement}
      </p>
    </div>

    {report.growthProjection.expectedOutcomes?.length > 0 && (
      <div className="mt-6">
        <h4 className="font-bold mb-3">
          Expected Outcomes
        </h4>

        <ul className="space-y-2 text-slate-300">
          {report.growthProjection.expectedOutcomes.map(
            (outcome, index) => (
              <li key={index}>
                • {outcome}
              </li>
            )
          )}
        </ul>
      </div>
    )}
  </section>
)}
    <div className="space-y-4">
      {report.advisorNotes.map((note, index) => (
        <div
          key={index}
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <p className="text-slate-300 leading-7">
            
            "{note}"
          </p>
        </div>
      ))}
    </div>
  </section>
)}

    <div className="space-y-4">
      {report.prioritizedRecommendations.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
            <span className="rounded-xl bg-red-500/20 px-4 py-2 text-center text-sm">
              Impact: {item.impact}
            </span>

            <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm">
              Effort: {item.effort}
            </span>

            <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm">
              {item.timeframe}
            </span>
          </div>

          <h4 className="font-bold text-lg">
            {item.title}
          </h4>

          <p className="mt-2 text-slate-300">
            {item.reason}
          </p>
        </div>
      ))}
    </div>
  </section>
)}
            <ReportSection
              title="Recommended AEMA Services"
              items={report.recommendedServices}
            />
            <ReportSection title="Next Steps" items={report.nextSteps} />

            {report.expertAnalysis && (
              <ExpertAnalysis analysis={report.expertAnalysis} />
            )}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <button
                onClick={downloadReport}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold"
              >
                Download PDF Report
              </button>

              {payment.plan === "blueprint" && (
                <button
                  onClick={() => openBooking("regular")}
                  className="rounded-xl bg-white text-slate-900 px-6 py-3 font-semibold"
                >
                  Book 30-Min Consultation - $30
                </button>
              )}

              {payment.plan === "expert" && (
                <button
                  onClick={() => openBooking("expert")}
                  className="rounded-xl bg-white text-slate-900 px-6 py-3 font-semibold"
                >
                  Book Included Expert Session
                </button>
              )}

              {payment.plan === "partner" && (
                <>
                  <button
                    onClick={() => openBooking("partner")}
                    className="rounded-xl bg-white text-slate-900 px-6 py-3 font-semibold"
                  >
                    Schedule Monthly Partner Session
                  </button>

                  <a
                    href={`https://wa.me/4375661645?text=${encodeURIComponent(
                      `⭐ AEMA BUSINESS PARTNER SUPPORT REQUEST

Plan: ${payment?.planLabel || "AEMA Business Partner"}

Customer Email: ${payment?.customerEmail || ""}

I need assistance with:
`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white"
                  >
                    Contact Priority Support
                  </a>
                </>
              )}

              <Link
                to="/ai"
                className="rounded-xl border border-white/10 px-6 py-3 font-semibold"
              >
                Return to AEMA AI
              </Link>
            </div>
          </div>
        )}
      </section>

      <BookingModal
        open={showBooking}
        onClose={() => setShowBooking(false)}
        plan={bookingPlan}
      />
    </main>
  );
}

function ReportSection({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-7">
      <h3 className="text-xl font-bold mb-3">{title}</h3>

      <ul className="space-y-2 text-slate-300">
        {items.map((item, index) => (
          <li
            key={index}
            className="rounded-xl bg-white/5 border border-white/10 p-4"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ExpertAnalysis({ analysis }) {
  return (
    <section className="mt-10 rounded-3xl border border-blue-500/20 bg-blue-500/10 p-6">
      <h3 className="text-2xl font-bold mb-4">Expert Strategic Analysis</h3>

      <ReportSection
        title="Consultant Summary"
        items={analysis.consultantSummary}
      />

      {analysis.gapAnalysis?.length > 0 && (
        <section className="mb-7">
          <h4 className="text-xl font-bold mb-3">Gap Analysis</h4>

          <div className="space-y-4">
            {analysis.gapAnalysis.map((gap, index) => (
              <div
                key={index}
                className="rounded-xl bg-white/5 border border-white/10 p-4"
              >
                <h5 className="font-bold mb-2">{gap.area}</h5>

                <div className="space-y-4">
                  <strong>Current State:</strong> {gap.currentState}
                </div>

                <div className="space-y-4">
                  <strong>Desired State:</strong> {gap.desiredState}
                </div>

                <div className="space-y-4">
                  <strong>Gap:</strong> {gap.gap}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {analysis.strategicOpportunities?.length > 0 && (
        <section className="mb-7">
          <h4 className="text-xl font-bold mb-3">Strategic Opportunities</h4>

          <div className="space-y-4">
            {analysis.strategicOpportunities.map((item, index) => (
              <div
                key={index}
                className="rounded-xl bg-white/5 border border-white/10 p-4"
              >
                <p className="text-blue-300 font-semibold">
                  Priority: {item.priority}
                </p>

                <h5 className="font-bold mt-1">{item.opportunity}</h5>

                <p className="text-slate-300 mt-2">{item.rationale}</p>

                <p className="text-slate-300 mt-2">
                  <strong>AEMA Support:</strong>{" "}
                  {item.recommendedAemaSupport}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {analysis.ninetyDayRoadmap?.length > 0 && (
        <section className="mb-7">
          <h4 className="text-xl font-bold mb-3">90-Day Strategic Roadmap</h4>

          <div className="space-y-4">
            {analysis.ninetyDayRoadmap.map((month, index) => (
              <div
                key={index}
                className="rounded-xl bg-white/5 border border-white/10 p-4"
              >
                <h5 className="font-bold mb-2">{month.period}</h5>

                <ul className="space-y-2 text-slate-300">
                  {month.actions.map((action, i) => (
                    <li key={i}>• {action}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      <ReportSection
        title="Priority Actions"
        items={analysis.priorityActions}
      />

      <ReportSection
        title="Expected Outcomes"
        items={analysis.expectedOutcomes}
      />
    </section>
  );
}