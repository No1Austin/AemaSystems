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

  const [checkoutEmail, setCheckoutEmail] = useState(() =>
    cleanText(
      readStoredJson(STORAGE_KEYS.answers)?.email ||
        readStoredJson(STORAGE_KEYS.answers)?.businessEmail ||
        readStoredJson(STORAGE_KEYS.answers)?.contactEmail ||
        readStoredJson(STORAGE_KEYS.answers)?.emailAddress
    )
  );

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
      email: cleanText(checkoutEmail) || "Not provided",
    };
  }, [answers, checkoutEmail]);

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

      setCheckoutEmail(
        cleanText(
          completedAnswers.email ||
            completedAnswers.businessEmail ||
            completedAnswers.contactEmail ||
            completedAnswers.emailAddress
        )
      );

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
      business_email: cleanText(checkoutEmail),
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

      answers: {
        ...answers,
        email: cleanText(checkoutEmail),
      },
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
      const normalizedEmail =
        cleanText(checkoutEmail);

      if (!normalizedEmail) {
        throw new Error(
          "Enter your email address before continuing to payment."
        );
      }

      if (!isValidEmail(normalizedEmail)) {
        throw new Error(
          "Enter a valid email address before continuing."
        );
      }

      const updatedAnswers = {
        ...answers,
        email: normalizedEmail,
      };

      setAnswers(updatedAnswers);
      writeStoredJson(
        STORAGE_KEYS.answers,
        updatedAnswers
      );

      const id =
        await saveAssessmentForPayment();

      const response = await fetch(
        `${API_URL}/api/compliance/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assessmentId: id,
            customerEmail: cleanText(checkoutEmail),
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
    setCheckoutEmail("");
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

          <CheckoutCard
            loading={startingCheckout}
            message={message}
            status={status}
            email={checkoutEmail}
            onEmailChange={setCheckoutEmail}
            onCheckout={startCheckout}
          />

          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
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

            <div className="space-y-6">
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
  email,
  onEmailChange,
  onCheckout,
}) {
  const plans = [
    {
      id: "package",
      badge: "Start here",
      title: "Compliance Package",
      price: COMPLIANCE_PACKAGE_PRICE,
      cadence: "CAD one-time",
      description:
        "Generate your documents, readiness report, and customer workspace.",
      features: [
        "Tailored documents",
        "Readiness report",
        "Download and copy",
        "Account dashboard",
      ],
      featured: true,
    },
    {
      id: "pro",
      badge: "Optional later",
      title: "Compliance OS Pro",
      price: HOSTING_PLAN_PRICE,
      cadence: "CAD/month",
      description:
        "Host your branded Trust Center and manage governance continuously.",
      features: [
        "Custom logo and colours",
        "Public compliance link",
        "Version history",
        "Review reminders",
      ],
      featured: false,
    },
  ];

  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.025] p-4 sm:p-5">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
            Unlock your workspace
          </p>

          <h3 className="mt-1 text-xl font-black text-white">
            Choose your Compliance OS plan
          </h3>
        </div>

        <span className="w-fit rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] font-semibold text-slate-400">
          Secure Stripe checkout
        </span>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
        <label className="block">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-sm font-bold text-white">
                Email for payment and account access
              </span>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                We will use this for Stripe confirmation and to connect your
                compliance package to your future account.
              </p>
            </div>

            <span className="w-fit rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-300">
              Required
            </span>
          </div>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              onEmailChange(event.target.value)
            }
            placeholder="you@business.com"
            autoComplete="email"
            className="mt-3 w-full rounded-xl border border-white/10 bg-[#091321] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className={`rounded-2xl border p-4 sm:p-5 ${
              plan.featured
                ? "border-emerald-400/25 bg-emerald-400/[0.05]"
                : "border-cyan-400/20 bg-cyan-400/[0.035]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                    plan.featured
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                      : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                  }`}
                >
                  {plan.badge}
                </span>

                <h4 className="mt-3 text-base font-black text-white">
                  {plan.title}
                </h4>
              </div>

              <div className="text-right">
                <p className="text-2xl font-black tracking-tight text-white">
                  {plan.price}
                </p>

                <p className="mt-0.5 text-[10px] font-semibold text-slate-500">
                  {plan.cadence}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs leading-6 text-slate-400">
              {plan.description}
            </p>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {plan.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-xs text-slate-300"
                >
                  <CheckCircle2
                    className={`h-3.5 w-3.5 shrink-0 ${
                      plan.featured
                        ? "text-emerald-400"
                        : "text-cyan-300"
                    }`}
                  />

                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {plan.featured ? (
              <button
                type="button"
                onClick={onCheckout}
                disabled={loading}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-3 text-xs font-black text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Opening checkout...
                  </>
                ) : (
                  <>
                    Get Compliance Package
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            ) : (
              <div className="mt-4 rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-center text-[11px] font-semibold text-slate-500">
                Available after account creation
              </div>
            )}
          </article>
        ))}
      </div>

      {message && (
        <StatusMessage
          status={status}
          message={message}
        />
      )}

      <p className="mt-3 text-center text-[10px] leading-5 text-slate-500">
        Your saved assessment remains available until payment succeeds.
      </p>
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

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    String(value || "").trim().toLowerCase()
  );
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
