import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Gauge,
  Loader2,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import ComplianceLayout from "../../modules/compliance/layouts/ComplianceLayout.jsx";
import AssessmentWizard from "../../modules/compliance/assessment/AssessmentWizard.jsx";

const STORAGE_KEYS = {
  answers: "aema_compliance_completed_answers",
  result: "aema_compliance_evaluation_result",
  assessmentId: "aema_compliance_assessment_id",
};

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const COMPLIANCE_PACKAGE_PRICE = "$29.99";
const HOSTING_PLAN_PRICE = "$19.99";

export default function ComplianceAssessment() {
  const [answers, setAnswers] = useState(() =>
    readStoredJson(STORAGE_KEYS.answers)
  );

  const [result, setResult] = useState(() =>
    readStoredJson(STORAGE_KEYS.result)
  );

  const [assessmentId, setAssessmentId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.assessmentId) || "";
    } catch {
      return "";
    }
  });

  const [evaluating, setEvaluating] = useState(false);
  const [startingCheckout, setStartingCheckout] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");

  const businessProfile = useMemo(() => {
    if (!answers) return null;

    return {
      name: cleanText(answers.businessName) || "Unnamed business",
      industry: cleanText(answers.industry) || "Not specified",
      jurisdiction:
        [cleanText(answers.province), cleanText(answers.country)]
          .filter(Boolean)
          .join(", ") || "Not specified",
      employees: cleanText(answers.employees) || "Not specified",
      website: cleanText(answers.website) || "Not provided",
      email: cleanText(answers.email) || "Not provided",
    };
  }, [answers]);

  async function handleAssessmentComplete(completedAnswers) {
    setEvaluating(true);
    setStatus("evaluating");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/compliance/evaluate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(completedAnswers),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "The compliance assessment could not be evaluated."
        );
      }

      const evaluatedResult = data.result;

      setAnswers(completedAnswers);
      setResult(evaluatedResult);
      setAssessmentId("");
      setStatus("success");

      writeStoredJson(STORAGE_KEYS.answers, completedAnswers);
      writeStoredJson(STORAGE_KEYS.result, evaluatedResult);

      try {
        localStorage.removeItem(STORAGE_KEYS.assessmentId);
      } catch {
        // Storage may be unavailable in private browsing mode.
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Compliance evaluation failed:", error);

      setStatus("error");
      setMessage(
        error?.message ||
          "Unable to evaluate the assessment. Please try again."
      );
    } finally {
      setEvaluating(false);
    }
  }

  async function saveAssessmentForPayment() {
    if (!answers || !result) {
      throw new Error(
        "Complete the assessment before starting payment."
      );
    }

    if (assessmentId) {
      return assessmentId;
    }

    const payload = {
      business_name: cleanText(answers.businessName),
      industry: cleanText(answers.industry),
      country: cleanText(answers.country),
      province: cleanText(answers.province),
      website: cleanText(answers.website),
      business_email: cleanText(answers.email),
      employee_range: cleanText(answers.employees),

      compliance_score: Number(result.overallScore || 0),
      risk_level: deriveOverallRiskLevel(result.risks),
      missing_items: (result.missingDocuments || []).map(
        (item) => item.name || item.title || item.id
      ),
      recommendations: [
        result.recommendation,
        ...(result.risks || [])
          .map((risk) => risk.recommendation)
          .filter(Boolean),
      ].filter(Boolean),

      answers,
      business_profile: {
        name: businessProfile?.name,
        industry: businessProfile?.industry,
        jurisdiction: businessProfile?.jurisdiction,
        employees: businessProfile?.employees,
        website: businessProfile?.website,
        email: businessProfile?.email,
      },
      domain_scores: {},
      risks: result.risks || [],
      framework_readiness: result.frameworks || [],
      document_context: {
        disclaimer: result.disclaimer || "",
        recommendation: result.recommendation || "",
      },

      payment_status: "unpaid",
      documents_generated: false,
    };

    const response = await fetch(
      `${API_URL}/api/compliance/save`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error(
        "The compliance server returned an invalid response."
      );
    }

    if (!response.ok || !data.success || !data.assessmentId) {
      throw new Error(
        data.message ||
          data.error?.message ||
          "We could not securely save your assessment. Please try again."
      );
    }

    setAssessmentId(data.assessmentId);

    try {
      localStorage.setItem(
        STORAGE_KEYS.assessmentId,
        data.assessmentId
      );
    } catch {
      // Storage may be unavailable in private browsing mode.
    }

    return data.assessmentId;
  }

  async function startCheckout() {
    setStartingCheckout(true);
    setStatus("checkout");
    setMessage("");

    try {
      const id = await saveAssessmentForPayment();

      const response = await fetch(
        `${API_URL}/api/compliance/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assessmentId: id,
            customerEmail: answers?.email || "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
  throw new Error(
    data.error?.message ||
      data.message ||
      "Unable to open Stripe Checkout."
  );
}

if (data.alreadyPaid && data.redirectUrl) {
  window.location.assign(data.redirectUrl);
  return;
}

if (!data.url) {
  throw new Error(
    "Stripe Checkout did not return a payment URL."
  );
}

      window.location.assign(data.url);
    } catch (error) {
      console.error("Compliance Checkout failed:", error);

      setStatus("error");
      const rawMessage = String(
        error?.message || ""
      );

      const isDatabasePolicyError =
        rawMessage
          .toLowerCase()
          .includes("row-level security") ||
        rawMessage
          .toLowerCase()
          .includes("violates row-level security");

      setMessage(
        isDatabasePolicyError
          ? "We could not securely save your assessment. Please try again in a moment."
          : rawMessage ||
              "Unable to start payment. Please try again."
      );
    } finally {
      setStartingCheckout(false);
    }
  }

  function restartAssessment() {
    const confirmed = window.confirm(
      "Restart the assessment and clear the saved result?"
    );

    if (!confirmed) return;

    setAnswers(null);
    setResult(null);
    setAssessmentId("");
    setMessage("");
    setStatus("idle");

    try {
      Object.values(STORAGE_KEYS).forEach((key) =>
        localStorage.removeItem(key)
      );

      localStorage.removeItem(
        "aema_compliance_assessment_answers"
      );
      localStorage.removeItem(
        "aema_compliance_assessment_step"
      );
    } catch {
      // Storage may be unavailable in private browsing mode.
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <ComplianceLayout
      badge="Compliance OS"
      title="Compliance Intelligence Assessment"
      description="Understand how your business operates, identify governance gaps, assess framework readiness, and unlock a tailored compliance package."
      icon={ClipboardCheck}
      accent="emerald"
    >
      {evaluating ? (
        <EvaluationLoading />
      ) : !result ? (
        <>
          {message && (
            <StatusMessage
              status={status}
              message={message}
            />
          )}

          <AssessmentWizard
            onComplete={handleAssessmentComplete}
          />
        </>
      ) : (
        <div className="space-y-8">
          <AssessmentSummaryHeader
            businessProfile={businessProfile}
            result={result}
            onRestart={restartAssessment}
          />

          <ScoreOverview result={result} />

          <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8">
              <BusinessProfileCard
                profile={businessProfile}
              />

              <RiskFindingsCard
                risks={result.risks || []}
              />

              <RecommendationCard
                recommendation={result.recommendation}
              />
            </div>

            <div className="space-y-8">
              <MissingDocumentsCard
                documents={
                  result.missingDocuments || []
                }
              />

              <FrameworkReadinessCard
                frameworks={result.frameworks || []}
              />
            </div>
          </div>

          <CheckoutCard
            loading={startingCheckout}
            message={message}
            status={status}
            onCheckout={startCheckout}
          />

          {result.disclaimer && (
            <p className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 text-xs leading-6 text-slate-500">
              {result.disclaimer}
            </p>
          )}
        </div>
      )}
    </ComplianceLayout>
  );
}

function EvaluationLoading() {
  return (
    <section className="mx-auto flex min-h-[420px] max-w-2xl flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-3xl border border-emerald-400/20 bg-emerald-400/10">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-300" />
      </span>

      <h2 className="mt-6 text-2xl font-black text-white">
        Evaluating your business
      </h2>

      <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
        AEMA Compliance OS is reviewing your business profile,
        applicable frameworks, document readiness, and risk
        exposure.
      </p>
    </section>
  );
}

function AssessmentSummaryHeader({
  businessProfile,
  result,
  onRestart,
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-emerald-400/[0.08] via-white/[0.03] to-cyan-400/[0.06] p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
              <BrainCircuit className="h-5 w-5 text-emerald-300" />
            </span>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                Assessment complete
              </p>

              <h2 className="mt-1 text-2xl font-black text-white">
                {businessProfile?.name}
              </h2>
            </div>
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400">
            Your current readiness score is{" "}
            <strong className="text-white">
              {result.overallScore || 0}%
            </strong>
            . Your organization is at maturity level{" "}
            <strong className="text-white">
              {result.maturity?.level || 1} —{" "}
              {result.maturity?.label || "Reactive"}
            </strong>
            . The assessment identified{" "}
            <strong className="text-white">
              {result.missingDocuments?.length || 0}
            </strong>{" "}
            missing governance document(s).
          </p>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
        >
          <RefreshCcw className="h-4 w-4" />
          Restart assessment
        </button>
      </div>
    </section>
  );
}

function ScoreOverview({ result }) {
  const highestRisk = deriveOverallRiskLevel(
    result.risks
  );

  const cards = [
    {
      label: "Overall readiness",
      value: `${result.overallScore || 0}%`,
      helper: "Preliminary document readiness",
      icon: Gauge,
    },
    {
      label: "Maturity",
      value: `Level ${result.maturity?.level || 1}`,
      helper:
        result.maturity?.label || "Reactive",
      icon: BarChart3,
    },
    {
      label: "Risk level",
      value: highestRisk,
      helper: `${result.risks?.length || 0} identified risk(s)`,
      icon: AlertTriangle,
    },
    {
      label: "Missing documents",
      value: result.missingDocuments?.length || 0,
      helper: "Policies, plans, and registers",
      icon: FileText,
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(
        ({ label, value, helper, icon: Icon }) => (
          <div
            key={label}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                {label}
              </p>
              <Icon className="h-5 w-5 text-emerald-300" />
            </div>

            <p className="mt-4 text-3xl font-black text-white">
              {value}
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              {helper}
            </p>
          </div>
        )
      )}
    </section>
  );
}

function BusinessProfileCard({ profile }) {
  const items = [
    ["Industry", profile?.industry],
    ["Jurisdiction", profile?.jurisdiction],
    ["Employees", profile?.employees],
    ["Website", profile?.website],
    ["Contact email", profile?.email],
  ];

  return (
    <Panel
      icon={Sparkles}
      title="Business Profile"
      description="Information used by the backend compliance engine."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
              {label}
            </p>
            <p className="mt-2 break-words text-sm font-semibold text-slate-200">
              {value || "Not specified"}
            </p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function RiskFindingsCard({ risks }) {
  return (
    <Panel
      icon={AlertTriangle}
      title="Key Risks"
      description="Risk findings returned by the backend compliance engine."
    >
      <div className="space-y-3">
        {risks.length === 0 ? (
          <EmptyState text="No major risks were detected from the submitted answers." />
        ) : (
          risks.map((risk, index) => (
            <div
              key={`${risk.title}-${index}`}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="font-bold text-white">
                  {risk.title}
                </h4>
                <RiskBadge level={risk.level} />
              </div>

              {(risk.description ||
                risk.recommendation) && (
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {risk.description ||
                    risk.recommendation}
                </p>
              )}

              {risk.impact && (
                <p className="mt-3 text-xs font-medium text-amber-200">
                  Business impact: {risk.impact}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </Panel>
  );
}

function RecommendationCard({ recommendation }) {
  return (
    <Panel
      icon={CheckCircle2}
      title="Recommended Next Step"
      description="The most important action based on the current assessment."
    >
      <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] p-5 text-sm leading-7 text-cyan-100">
        {recommendation ||
          "Continue improving governance controls and maintaining evidence."}
      </div>
    </Panel>
  );
}

function MissingDocumentsCard({ documents }) {
  return (
    <Panel
      icon={FileText}
      title="Missing Documents"
      description="Documents identified as missing by the backend engine."
    >
      <div className="space-y-3">
        {documents.length === 0 ? (
          <EmptyState text="No major missing documents were detected." />
        ) : (
          documents.map((document, index) => (
            <div
              key={document.id || `${document.name}-${index}`}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/10">
                <FileText className="h-4 w-4 text-amber-300" />
              </span>

              <div>
                <h4 className="text-sm font-bold text-white">
                  {document.name ||
                    document.title ||
                    document.id}
                </h4>

                {document.id && (
                  <p className="mt-1 text-xs text-slate-500">
                    {document.id}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Panel>
  );
}

function FrameworkReadinessCard({ frameworks }) {
  return (
    <Panel
      icon={ShieldCheck}
      title="Framework Readiness"
      description="Preliminary document readiness for frameworks relevant to the business."
    >
      <div className="space-y-3">
        {frameworks.length === 0 ? (
          <EmptyState text="No frameworks were triggered by the current profile." />
        ) : (
          frameworks.map((framework) => (
            <div
              key={framework.id}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {framework.name}
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {framework.description}
                  </p>

                  {framework.priority && (
                    <p className="mt-2 text-xs font-medium text-cyan-200">
                      Priority: {framework.priority}
                    </p>
                  )}
                </div>

                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-300">
                  {framework.score || 0}%
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                  style={{
                    width: `${framework.score || 0}%`,
                  }}
                />
              </div>

              {framework.missing?.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-200">
                    Missing requirements
                  </p>

                  <p className="mt-2 text-xs leading-6 text-slate-400">
                    {framework.missing
                      .map(
                        (item) =>
                          item.name ||
                          item.title ||
                          item.id
                      )
                      .join(", ")}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Panel>
  );
}

function CheckoutCard({
  loading,
  message,
  status,
  onCheckout,
}) {
  const packageFeatures = [
    "Personalized compliance documents",
    "Executive readiness report",
    "Risk and framework recommendations",
    "Download and copy access",
    "Customer account and document dashboard",
  ];

  const hostingFeatures = [
    "Branded public Trust Center",
    "Custom logo and colours",
    "Shareable compliance URL",
    "Ongoing governance dashboard",
    "Review reminders and version history",
  ];

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 bg-gradient-to-r from-emerald-400/[0.08] via-transparent to-cyan-400/[0.08] px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
              <ShieldCheck className="h-6 w-6 text-emerald-300" />
            </span>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                Unlock your workspace
              </p>

              <h3 className="mt-2 text-2xl font-black text-white">
                Choose how you want to use Compliance OS
              </h3>

              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
                Start with the one-time compliance package. After account
                creation, you can optionally activate ongoing hosted governance.
              </p>
            </div>
          </div>

          <span className="w-fit rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-semibold text-slate-400">
            Secure Stripe checkout
          </span>
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-2 sm:p-8">
        <article className="relative overflow-hidden rounded-[1.75rem] border border-emerald-400/25 bg-emerald-400/[0.055] p-6">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
              Start here
            </span>

            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              One-time payment
            </span>
          </div>

          <h4 className="mt-5 text-xl font-black text-white">
            AEMA Compliance Package
          </h4>

          <div className="mt-4 flex items-end gap-2">
            <span className="text-5xl font-black tracking-tight text-white">
              {COMPLIANCE_PACKAGE_PRICE}
            </span>

            <span className="pb-1 text-sm font-semibold text-slate-500">
              CAD
            </span>
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            Generate your tailored documents, create your customer account,
            and access your compliance workspace.
          </p>

          <div className="mt-6 space-y-3">
            {packageFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-3 text-sm leading-6 text-slate-300"
              >
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onCheckout}
            disabled={loading}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-4 text-sm font-black text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Opening secure checkout...
              </>
            ) : (
              <>
                Generate My Compliance Package
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </article>

        <article className="rounded-[1.75rem] border border-cyan-400/20 bg-cyan-400/[0.045] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
              Optional upgrade
            </span>

            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              After account creation
            </span>
          </div>

          <h4 className="mt-5 text-xl font-black text-white">
            Compliance OS Pro
          </h4>

          <div className="mt-4 flex items-end gap-2">
            <span className="text-5xl font-black tracking-tight text-white">
              {HOSTING_PLAN_PRICE}
            </span>

            <span className="pb-1 text-sm font-semibold text-slate-500">
              CAD/month
            </span>
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            Keep your branded Trust Center hosted with AEMA and manage
            governance continuously.
          </p>

          <div className="mt-6 space-y-3">
            {hostingFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-3 text-sm leading-6 text-slate-300"
              >
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-cyan-300" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center text-xs font-semibold text-slate-500">
            Available from your dashboard after purchasing the package
          </div>
        </article>
      </div>

      {message && (
        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          <StatusMessage
            status={status}
            message={message}
          />
        </div>
      )}

      <div className="border-t border-white/10 px-6 py-4 text-center sm:px-8">
        <p className="text-[11px] leading-5 text-slate-500">
          Payment is processed securely through Stripe. Your questionnaire and
          readiness result remain saved in this browser until payment succeeds.
        </p>
      </div>
    </section>
  );
}

function Panel({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
          <Icon className="h-5 w-5 text-emerald-300" />
        </span>

        <div>
          <h3 className="text-lg font-bold text-white">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4 text-sm text-emerald-200">
      {text}
    </div>
  );
}

function StatusMessage({ status, message }) {
  const isError = status === "error";

  return (
    <div
      role="alert"
      className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
        isError
          ? "border-rose-400/20 bg-rose-400/10 text-rose-100"
          : "border-cyan-400/20 bg-cyan-400/10 text-cyan-100"
      }`}
    >
      {message}
    </div>
  );
}

function RiskBadge({ level }) {
  const normalized =
    String(level || "Medium").toLowerCase();

  const classes = {
    critical:
      "border-rose-400/30 bg-rose-400/10 text-rose-200",
    high:
      "border-orange-400/30 bg-orange-400/10 text-orange-200",
    medium:
      "border-amber-400/30 bg-amber-400/10 text-amber-200",
    low:
      "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-bold ${
        classes[normalized] || classes.medium
      }`}
    >
      {level || "Medium"}
    </span>
  );
}

function deriveOverallRiskLevel(risks = []) {
  const levels = new Set(
    (Array.isArray(risks) ? risks : []).map(
      (risk) =>
        String(risk.level || "").toLowerCase()
    )
  );

  if (levels.has("critical")) return "Critical";
  if (levels.has("high")) return "High";
  if (levels.has("medium")) return "Medium";
  return "Low";
}

function cleanText(value) {
  return String(value ?? "").trim();
}

function readStoredJson(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function writeStoredJson(key, value) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch {
    // Storage may be unavailable in private browsing mode.
  }
}
