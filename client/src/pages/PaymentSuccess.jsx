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

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(
  /\/$/,
  ""
);

const clampScore = (value, fallback = 0) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.min(100, Math.round(number)));
};

const createSafeFilename = (name = "AEMA") => {
  const safeName = String(name || "AEMA")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return safeName || "AEMA";
};

const getArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
};

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingPlan, setBookingPlan] = useState(null);
  const [downloadError, setDownloadError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

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
        console.error("Payment verification failed:", {
          message: error?.message,
          response: error?.response?.data,
        });

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
    return report?.businessSnapshot || report?.snapshot || {};
  }, [report]);

  const businessName = useMemo(() => {
    return getDisplayBusinessName(snapshot) || "Your Business";
  }, [snapshot]);

  const downloadReport = async () => {
    setDownloadError("");

    if (!report) {
      setDownloadError("Report is not available yet.");
      return;
    }

    try {
      setIsDownloading(true);

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
      console.error("PDF download failed:", {
        message: error?.message,
        response: error?.response?.data,
      });

      setDownloadError("Could not download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
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
              <ExecutiveBrief businessName={businessName} report={report} />
              <BusinessHealthIndex report={report} />
              <ReportIntro businessName={businessName} report={report} />

              <ExecutiveDashboard report={report} snapshot={snapshot} />
              <BusinessDashboard report={report} />
              <CompetitivePosition report={report} />
              <GrowthImpactCalculator report={report} snapshot={snapshot} />
              <ExecutiveSummary report={report} />
              <TopPriorities report={report} />

              <KeyBusinessRisks report={report} />
              <OpportunityImpact report={report} />

              <MarketIntelligenceSection data={report.marketIntelligence} />
              <WebsiteAudit items={report.websiteAnalysis} />
              <Roadmap items={report.actionPlan30Days} />
              <AnalysisAccordion report={report} />

              <ReportSection
                title="Recommended AEMA Services"
                items={report.recommendedServices}
              />

              <ReportSection title="Next Steps" items={report.nextSteps} />

              <ExecutiveConsultantSummary report={report} />
            </div>

            <aside className="h-fit space-y-5 lg:sticky lg:top-8">
              <ScorePanel report={report} />

              {downloadError ? (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
                  {downloadError}
                </div>
              ) : null}

              <ActionPanel
                payment={payment}
                downloadReport={downloadReport}
                openBooking={openBooking}
                isDownloading={isDownloading}
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
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:52px_52px] opacity-[0.08]" />
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

function ExecutiveBrief({ businessName, report = {} }) {
  const score = clampScore(report.growthScore || report.score, null);
  const bottleneck =
    report.primaryBottleneck ||
    report.bottleneck ||
    report.biggestConstraint ||
    getArray(report.topPriorities)?.[0] ||
    "visibility, conversion, and operational consistency";

  const summary =
    report.executiveBrief ||
    report.executiveNarrative ||
    report.summary ||
    report.executiveSummary;

  return (
    <section className="rounded-[2rem] border border-blue-400/20 bg-blue-500/10 p-7 shadow-2xl backdrop-blur-xl">
      <div className="mb-4 inline-flex rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-blue-100">
        Executive Brief
      </div>

      <h2 className="text-2xl font-black text-white md:text-3xl">
        What AEMA found about {businessName}
      </h2>

      <div className="mt-5 space-y-4 text-base leading-8 text-slate-200">
        {summary ? (
          <p>{summary}</p>
        ) : (
          <>
            <p>
              {businessName} shows a measurable growth opportunity based on its
              current market position, digital readiness, customer visibility,
              and operational structure. The report below translates that
              position into practical actions that can improve trust,
              conversion, and business efficiency.
            </p>

            <p>
              {score !== null
                ? `The current AEMA growth readiness score is ${score}/100, which gives a clear signal of the business's ability to compete, attract customers, and scale with better systems.`
                : "The available business signals show useful opportunities to strengthen customer acquisition, improve operations, and build a more consistent growth system."} The
              most important area to address first is {bottleneck}.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

function BusinessHealthIndex({ report = {} }) {
  const market = report.marketIntelligence || {};
  const stats = market.competitorStats || {};
  const websiteScore =
    report.websiteScore || report.websiteHealth || report.websiteAnalysis?.score;
  const growthScore = report.growthScore || report.score;

  const healthItems = [
    {
      label: "Growth Readiness",
      value: clampScore(growthScore, 72),
      note: "Ability to turn current business position into measurable growth.",
    },
    {
      label: "Marketing Visibility",
      value: clampScore(report.marketingScore || stats.websitePresencePercent, 64),
      note: "How visible and discoverable the business appears to customers.",
    },
    {
      label: "Website Health",
      value: clampScore(websiteScore, 58),
      note: "How well the website supports trust, leads, and conversion.",
    },
    {
      label: "Customer Trust",
      value: clampScore((market.googleRating || stats.averageRating || 4) * 20, 80),
      note: "Signal from reputation, ratings, reviews, and customer proof.",
    },
    {
      label: "Operational Strength",
      value: clampScore(report.operationsScore || report.operationalScore, 68),
      note: "How ready the business is to manage demand consistently.",
    },
    {
      label: "Automation Readiness",
      value: clampScore(report.automationScore || report.aiReadinessScore, 52),
      note: "Opportunity to reduce manual work and improve follow-up.",
    },
  ];

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl">
      <SectionHeader
        eyebrow="Business Health Index"
        title="A clearer view of where the business is strong and where it needs support"
        description="This section breaks the overall report into practical health signals so the recommendations do not feel generic."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {healthItems.map((item) => (
          <HealthCard key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}

function HealthCard({ label, value, note }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black/10 p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-bold text-white">{label}</h3>
        <span className="text-2xl font-black text-blue-100">{value}%</span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-blue-400"
          style={{ width: `${value}%` }}
        />
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-300">{note}</p>
    </article>
  );
}

function KeyBusinessRisks({ report = {} }) {
  const risksFromReport = getArray(report.keyRisks || report.risks);
  const market = report.marketIntelligence || {};
  const stats = market.competitorStats || {};

  const defaultRisks = [
    {
      level: "High",
      title: "Weak conversion system",
      detail:
        "The business may be getting attention but losing leads if the website, booking path, or follow-up process is not clear.",
    },
    {
      level: "Medium",
      title: "Competitive pressure",
      detail:
        stats.totalCompetitors
          ? `AEMA detected ${stats.totalCompetitors} visible competitors, which means positioning and trust signals matter more.`
          : "The market may contain enough competitors that differentiation and visibility need to be intentional.",
    },
    {
      level: "Medium",
      title: "Manual operations",
      detail:
        "Without automation, follow-up, reminders, reporting, and customer tracking can become inconsistent as demand grows.",
    },
  ];

  const risks = risksFromReport.length
    ? risksFromReport.map((risk, index) => ({
        level: index === 0 ? "High" : "Medium",
        title: risk,
        detail:
          "This risk should be reviewed because it can slow growth, reduce customer trust, or create operational friction.",
      }))
    : defaultRisks;

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl">
      <SectionHeader
        eyebrow="Key Business Risks"
        title="The main issues that could slow down growth"
        description="These risks help the business know what to fix before spending more money on marketing or expansion."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {risks.slice(0, 3).map((risk) => (
          <article
            key={`${risk.level}-${risk.title}`}
            className="rounded-2xl border border-white/10 bg-black/10 p-5"
          >
            <span className="rounded-full border border-orange-300/20 bg-orange-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-orange-100">
              {risk.level} Risk
            </span>
            <h3 className="mt-4 text-lg font-bold text-white">{risk.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{risk.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function OpportunityImpact({ report = {} }) {
  const opportunitiesFromReport = getArray(
    report.opportunities || report.growthOpportunities || report.recommendations
  );

  const defaultOpportunities = [
    {
      title: "Improve website conversion",
      impact: "+15–30% better lead capture potential",
      confidence: "High",
    },
    {
      title: "Strengthen Google and local visibility",
      impact: "More qualified discovery from nearby customers",
      confidence: "High",
    },
    {
      title: "Add automated follow-up and business tracking",
      impact: "Less missed revenue and better customer retention",
      confidence: "Medium",
    },
  ];

  const opportunities = opportunitiesFromReport.length
    ? opportunitiesFromReport.slice(0, 3).map((item, index) => ({
        title: item,
        impact:
          index === 0
            ? "+15–30% improvement potential in the targeted area"
            : "Measurable improvement in efficiency, visibility, or conversion",
        confidence: index === 2 ? "Medium" : "High",
      }))
    : defaultOpportunities;

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl">
      <SectionHeader
        eyebrow="Opportunity Value"
        title="Where action can create the most business value"
        description="This turns the report from simple analysis into an implementation-focused growth plan."
      />

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-3 bg-white/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
          <span>Opportunity</span>
          <span>Estimated Impact</span>
          <span>Confidence</span>
        </div>

        {opportunities.map((item) => (
          <div
            key={item.title}
            className="grid grid-cols-1 gap-3 border-t border-white/10 px-4 py-4 text-sm md:grid-cols-3"
          >
            <strong className="text-white">{item.title}</strong>
            <span className="text-slate-300">{item.impact}</span>
            <span className="font-semibold text-blue-100">{item.confidence}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReportIntro({ businessName, report }) {
  const score = report?.growthScore || report?.score || "—";
  const market = report?.marketIntelligence;

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl">
      <div className="grid gap-5 md:grid-cols-3">
        <InsightCard
          label="Business"
          value={businessName || "Your Business"}
          subtext="Personalized growth report"
          type="business"
          report={report}
        />

        <InsightCard
          label="Growth Score"
          value={score === "—" ? "—" : `${score}/100`}
          subtext="AEMA business readiness signal"
          type="growthScore"
          report={report}
          accent="gold"
        />

        <InsightCard
          label="Market Data"
          value={market?.available ? "Available" : "Limited"}
          type="marketData"
          report={report}
          accent="teal"
          subtext={
            market?.available
              ? "Live intelligence included"
              : "Internal analysis used"
          }
        />
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-200">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-black text-white md:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          {description}
        </p>
      ) : null}
    </div>
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



function getCardExplanation(type, report = {}) {
  const market = report?.marketIntelligence || {};
  const stats = market?.competitorStats || {};
  const website =
    report?.websiteAudit ||
    report?.websiteAnalysis ||
    report?.website ||
    {};

  const growthScore = report?.growthScore || report?.score;
  const websiteScore =
    website?.score ||
    report?.websiteScore ||
    report?.websiteHealth ||
    report?.websiteAnalysis?.score;

  const googleRating =
    market?.googleBusinessProfile?.rating ||
    market?.googleRating ||
    stats?.averageRating;

  const competitorCount =
    stats?.totalCompetitorsFound ||
    stats?.totalCompetitors ||
    market?.competitors?.length;

  const websitePresence = stats?.websitePresencePercent;

  const explanations = {
    business:
      "This identifies the business this report was prepared for. AEMA uses this as the anchor for the website audit, market comparison, recommendations, and growth roadmap.",

    growthScore: growthScore
      ? `This score measures how ready the business is to grow. A score of ${growthScore}/100 reflects the combined strength of sales, marketing, operations, website quality, automation, and maturity.`
      : "This score measures how ready the business is to grow based on sales, marketing, operations, website quality, automation, and maturity.",

    websiteHealth: websiteScore
      ? `This measures how well the website supports visibility, trust, SEO, and conversion. The current website score is ${websiteScore}/100, so the website should be treated as an important improvement area.`
      : "This measures how well the website supports visibility, trust, SEO, and conversion. A low score means the website may be reducing customer confidence or blocking leads.",

    googleRating: googleRating
      ? `This reflects public customer trust from Google reviews. The rating helps show how customers currently perceive the business compared with competitors in the same local market.`
      : "This reflects public customer trust from Google reviews. If this shows N/A, AEMA could not confidently match a Google Business Profile for the business.",

    competition: competitorCount
      ? `This shows how crowded the local market is. AEMA identified ${competitorCount} visible competitors or similar businesses from Google market data.`
      : "This shows how crowded the local market is based on visible competitors found through Google Places data.",

    avgMarketRating:
      "This is the average Google rating of similar businesses in the local market. It helps show the level of customer expectation the business must compete against.",

    websitePresence:
      typeof websitePresence === "number"
        ? `This shows the percentage of visible competitors with websites. In this market, ${websitePresence}% of visible competitors have websites, so digital presence is a customer expectation.`
        : "This shows the percentage of visible competitors that have websites. A high percentage means customers expect a strong digital presence.",

    marketData: market?.available
      ? "Live Google market intelligence is included in this report, including competitor visibility, rating averages, review patterns, and website presence."
      : "This report is using internal AEMA analysis because live market intelligence was limited, unavailable, or not confidently matched.",

    bottleneck:
      "This is the main issue currently limiting growth. Solving this first should create the fastest improvement across visibility, conversion, or operations.",
  };

  return (
    explanations[type] ||
    "This metric helps AEMA understand the business position and prioritize growth recommendations."
  );
}


function InsightCard({ label, value, subtext, type, report, accent = "blue" }) {
  const accentStyles = {
    blue: "from-blue-500/20 to-blue-900/20 border-blue-400/30",
    gold: "from-yellow-500/20 to-yellow-900/20 border-yellow-400/30",
    teal: "from-teal-500/20 to-teal-900/20 border-teal-400/30",
    purple: "from-purple-500/20 to-purple-900/20 border-purple-400/30",
  };

  return (
    <div className={`rounded-3xl border bg-gradient-to-br ${accentStyles[accent] || accentStyles.blue} p-6`}>
      <p className="text-sm text-slate-400">{label}</p>
      <h3 className="mt-3 text-4xl font-black text-white">{value || "N/A"}</h3>
      {subtext && <p className="mt-2 text-sm text-slate-400">{subtext}</p>}
      <div className="mt-5 rounded-2xl bg-black/25 p-4">
        <p className="text-sm leading-relaxed text-slate-300">
          {getCardExplanation(type, report)}
        </p>
      </div>
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


function ExecutiveConsultantSummary({ report = {} }) {
  const businessName = report.businessName || "This business";
  const summary =
    report.executiveConsultantSummary ||
    `${businessName} shows strong growth potential, but the report indicates that the next stage of growth depends on improving digital trust, customer conversion, and operational follow-up. The business has a clear market opportunity, but website performance, customer trust signals, and lead management systems need to work together more effectively.

The Google market intelligence shows that the local environment is competitive, which means customers are likely comparing businesses before making a decision. In this type of market, the business cannot rely only on visibility or walk-in traffic. It needs a stronger online presence, clearer calls to action, better customer proof, and a repeatable system for turning interest into sales.

Overall, this business does not need to start from zero. It already has important foundations in place. The strongest opportunity is to improve the systems that convert attention into revenue: website performance, Google trust, lead tracking, follow-up, and monthly performance measurement. If these recommendations are implemented consistently, the business can strengthen its competitive position and create more predictable growth.`;

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-2xl">
      <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
        Consultant&apos;s Perspective
      </p>
      <h2 className="mt-4 text-3xl font-black text-white">
        Executive Business Summary
      </h2>
      <div className="mt-6 space-y-5 text-base leading-8 text-slate-300">
        {summary.split("\n").filter(Boolean).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
