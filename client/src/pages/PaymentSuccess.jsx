import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import BookingModal from "../components/BookingModal";

import ReportLoadingScreen from "../components/report/ReportLoadingScreen";
import ExecutiveDashboard from "../components/report/ExecutiveDashboard";
import BusinessDashboard from "../components/report/BusinessDashboard";
import CompetitivePosition from "../components/report/CompetitivePosition";
import GrowthImpactCalculator from "../components/report/GrowthImpactCalculator";
import ExecutiveSummary from "../components/report/ExecutiveSummary";
import TopPriorities from "../components/report/TopPriorities";
import MarketIntelligenceSection from "../components/report/MarketIntelligenceSection";
import WebsiteAudit from "../components/report/WebsiteAudit";
import Roadmap from "../components/report/Roadmap";
import AnalysisAccordion from "../components/report/AnalysisAccordion";
import ReportSection from "../components/report/ReportSection";
import ScorePanel from "../components/report/ScorePanel";
import ActionPanel from "../components/report/ActionPanel";

import { getDisplayBusinessName, money } from "../components/report/ReportUtils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const createSafeFilename = (name = "AEMA") => {
  const safeName = String(name || "AEMA")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return safeName || "AEMA";
};

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingPlan, setBookingPlan] = useState(null);

  useEffect(() => {
    let mounted = true;

    const verifyPayment = async () => {
      try {
        if (!sessionId) {
          if (mounted) {
            setPayment({
              success: false,
              paid: false,
              message: "Missing payment session.",
            });
          }
          return;
        }

        const { data } = await axios.get(
          `${API_URL}/api/payments/verify-session/${encodeURIComponent(
            sessionId
          )}`
        );

        if (mounted) {
          setPayment(data || { success: false, paid: false });
        }
      } catch (error) {
        console.error("Payment verification failed:", error);

        if (mounted) {
          setPayment({
            success: false,
            paid: false,
            message:
              error?.response?.data?.message ||
              "Could not verify payment. Please try again or contact AEMA Systems.",
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    verifyPayment();

    return () => {
      mounted = false;
    };
  }, [sessionId]);

  const report = payment?.fullReport || payment?.report || null;

  const snapshot = useMemo(() => {
    return report?.businessSnapshot || {};
  }, [report]);

  const businessName = useMemo(() => {
    return getDisplayBusinessName(snapshot);
  }, [snapshot]);

  const downloadReport = async () => {
    if (!report) {
      alert("Report is not available yet.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/reports/download-pdf`,
        { report },
        { responseType: "blob" }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      const filename = createSafeFilename(businessName);

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `${filename}-Growth-Blueprint.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error("PDF download failed:", error);
      alert("Could not download PDF. Please try again.");
    }
  };

  const openBooking = (plan) => {
    setBookingPlan(plan || payment?.plan || "AEMA Plan");
    setShowBooking(true);
  };

  const closeBooking = () => {
    setShowBooking(false);
    setBookingPlan(null);
  };

  if (loading) {
    return <ReportLoadingScreen />;
  }

  if (!payment?.paid) {
    return <PaymentFailedPanel message={payment?.message} />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] px-5 py-20 text-white">
      <PremiumBackground />

      <section className="relative mx-auto max-w-7xl">
        <PaymentHeader payment={payment} businessName={businessName} />

        {report ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="space-y-8">
              <ReportIntro businessName={businessName} report={report} />

              <ExecutiveDashboard report={report} snapshot={snapshot} />
              <BusinessDashboard report={report} />
              <CompetitivePosition report={report} />
              <GrowthImpactCalculator report={report} snapshot={snapshot} />
              <ExecutiveSummary report={report} />
              <TopPriorities report={report} />

              <MarketIntelligenceSection data={report.marketIntelligence} />
              <WebsiteAudit items={report.websiteAnalysis} />
              <Roadmap items={report.actionPlan30Days} />
              <AnalysisAccordion report={report} />

              <ReportSection
                title="Recommended AEMA Services"
                items={report.recommendedServices}
              />

              <ReportSection title="Next Steps" items={report.nextSteps} />
            </div>

            <aside className="h-fit space-y-5 lg:sticky lg:top-8">
              <ScorePanel report={report} />

              <ActionPanel
                payment={payment}
                downloadReport={downloadReport}
                openBooking={openBooking}
              />

              <MiniTrustPanel />
            </aside>
          </div>
        ) : (
          <NoReportPanel />
        )}
      </section>

      <BookingModal open={showBooking} onClose={closeBooking} plan={bookingPlan} />
    </main>
  );
}

function PremiumBackground() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(14,165,233,0.18),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.16),transparent_35%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.2),rgba(2,6,23,0.95))]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:52px_52px]" />
    </>
  );
}

function PaymentHeader({ payment = {}, businessName = "Your Business" }) {
  const planName = payment.planLabel || payment.plan || "AEMA Plan";

  return (
    <section className="mb-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 text-center shadow-2xl backdrop-blur-xl">
      <div className="mx-auto mb-5 inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
        AEMA Growth Blueprint
      </div>

      <h1 className="mb-3 text-4xl font-extrabold md:text-5xl">
        Payment Successful 🎉
      </h1>

      <p className="mb-8 text-slate-300">
        Thank you. Your payment has been verified.
      </p>

      <div className="mx-auto mb-6 max-w-2xl rounded-2xl border border-blue-400/20 bg-blue-500/10 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-200">
          Business Report Prepared For
        </p>

        <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
          {businessName}
        </h2>
      </div>

      <div className="mx-auto grid max-w-3xl gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-left md:grid-cols-3">
        <InfoItem label="Plan" value={planName} />
        <InfoItem label="Email" value={payment.customerEmail || "Not available"} />
        <InfoItem
          label="Amount"
          value={money(payment.amountTotal, payment.currency)}
        />
      </div>

      <p className="mx-auto mt-6 max-w-3xl text-slate-300">
        <span className="font-semibold text-white">{businessName}</span>'s
        executive business intelligence report is ready. Review your dashboard,
        market intelligence, competitive positioning, financial projection, and
        30-day execution roadmap below.
      </p>
    </section>
  );
}

function ReportIntro({ businessName, report }) {
  const score = report?.growthScore || report?.score || "—";
  const market = report?.marketIntelligence;

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl">
      <div className="grid gap-5 md:grid-cols-3">
        <IntroCard
          label="Business"
          value={businessName || "Your Business"}
          note="Personalized growth report"
        />

        <IntroCard
          label="Growth Score"
          value={score === "—" ? "—" : `${score}/100`}
          note="AEMA business readiness signal"
        />

        <IntroCard
          label="Market Data"
          value={market?.available ? "Available" : "Limited"}
          note={
            market?.available
              ? "Live intelligence included"
              : "Internal analysis used"
          }
        />
      </div>
    </section>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/10 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 font-bold text-white">{value}</p>
    </div>
  );
}

function IntroCard({ label, value, note }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <h3 className="mt-2 text-2xl font-black text-white">{value}</h3>
      <p className="mt-2 text-sm text-slate-400">{note}</p>
    </div>
  );
}

function MiniTrustPanel() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
        AEMA Intelligence
      </p>

      <h3 className="mt-3 text-xl font-bold text-white">
        Built for business action
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-300">
        This report is designed to help you understand your current position,
        identify growth gaps, and take practical steps toward better visibility,
        conversion, and business management.
      </p>
    </section>
  );
}

function PaymentFailedPanel({ message }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-6 text-white">
      <PremiumBackground />

      <section className="relative max-w-xl rounded-3xl border border-white/10 bg-white/[0.045] p-10 text-center shadow-2xl backdrop-blur-xl">
        <h1 className="mb-4 text-3xl font-bold">Payment Not Verified</h1>

        <p className="mb-8 text-slate-300">
          {message ||
            "We could not verify your payment. Please contact AEMA Systems if you were charged."}
        </p>

        <Link
          to="/ai"
          className="inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
        >
          Return to AEMA AI
        </Link>
      </section>
    </main>
  );
}

function NoReportPanel() {
  return (
    <section className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 text-center shadow-2xl backdrop-blur-xl">
      <h2 className="mb-3 text-2xl font-bold">Report Not Available Yet</h2>

      <p className="mb-6 text-slate-300">
        Your payment was verified, but the report data was not returned from the
        server.
      </p>

      <Link
        to="/ai"
        className="inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
      >
        Return to AEMA AI
      </Link>
    </section>
  );
}