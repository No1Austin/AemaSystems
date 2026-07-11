import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

import ComplianceLayout from "../../modules/compliance/layouts/ComplianceLayout.jsx";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const STORAGE_KEYS = {
  assessmentId: "aema_compliance_assessment_id",
  answers: "aema_compliance_completed_answers",
  result: "aema_compliance_evaluation_result",
};

const MAX_AUTOMATIC_CHECKS = 10;
const CHECK_INTERVAL_MS = 3000;

export default function CompliancePaymentSuccess() {
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get("session_id");
  const assessmentIdFromUrl =
    searchParams.get("assessment_id");

  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState(
    "Confirming your payment with Stripe..."
  );
  const [assessmentId, setAssessmentId] = useState(
    assessmentIdFromUrl || ""
  );
  const [documentsGenerated, setDocumentsGenerated] =
    useState(false);
  const [paymentStatus, setPaymentStatus] =
    useState("pending");
  const [checking, setChecking] = useState(false);

  const checkCountRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (assessmentIdFromUrl) {
      rememberAssessmentId(assessmentIdFromUrl);
    }

    if (!sessionId && !assessmentIdFromUrl) {
      setStatus("error");
      setMessage(
        "No Stripe session or assessment reference was provided."
      );

      return undefined;
    }

    verifyPayment();

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, assessmentIdFromUrl]);

  async function verifyPayment({
    manual = false,
  } = {}) {
    if (checking) return;

    setChecking(true);

    if (manual) {
      setStatus("checking");
      setMessage(
        "Checking the latest payment and document status..."
      );
    }

    try {
      if (!sessionId) {
        /*
         * The user may have been redirected here because the assessment
         * was already marked as paid. In that case there is no session
         * ID to verify again.
         */
        if (assessmentIdFromUrl) {
          setAssessmentId(assessmentIdFromUrl);
          rememberAssessmentId(
            assessmentIdFromUrl
          );

          setStatus("success");
          setPaymentStatus("paid");
          setMessage(
            "This assessment has already been paid. Your compliance package is available."
          );

          return;
        }

        throw new Error(
          "The Stripe session ID is missing."
        );
      }

      const response = await fetch(
        `${API_URL}/api/compliance/payments/session/${encodeURIComponent(
          sessionId
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error?.message ||
            data.message ||
            "Unable to verify the Stripe payment."
        );
      }

      const resolvedAssessmentId =
        data.assessmentId ||
        assessmentIdFromUrl ||
        "";

      if (resolvedAssessmentId) {
        setAssessmentId(resolvedAssessmentId);
        rememberAssessmentId(
          resolvedAssessmentId
        );
      }

      setPaymentStatus(
        data.paymentStatus ||
          data.stripePaymentStatus ||
          "pending"
      );

      setDocumentsGenerated(
        Boolean(data.documentsGenerated)
      );

      if (data.paid) {
        clearCompletedAssessmentDraft();

        if (data.documentsGenerated) {
          setStatus("success");
          setMessage(
            "Payment confirmed. Your personalized compliance package has been generated successfully."
          );
        } else {
          setStatus("processing");
          setMessage(
            "Payment confirmed. Your compliance documents are now being generated."
          );

          scheduleAnotherCheck();
        }

        return;
      }

      const normalizedPaymentStatus = String(
        data.paymentStatus ||
          data.stripePaymentStatus ||
          ""
      ).toLowerCase();

      if (
        normalizedPaymentStatus === "failed" ||
        normalizedPaymentStatus === "unpaid"
      ) {
        setStatus("error");
        setMessage(
          "The payment has not been completed. You can return to the assessment and try again."
        );

        return;
      }

      setStatus("processing");
      setMessage(
        "Stripe is still confirming the payment. This normally takes only a few moments."
      );

      scheduleAnotherCheck();
    } catch (error) {
      console.error(
        "Compliance payment verification failed:",
        error
      );

      setStatus("error");
      setMessage(
        error?.message ||
          "Unable to confirm the payment right now."
      );
    } finally {
      setChecking(false);
    }
  }

  function scheduleAnotherCheck() {
    if (
      checkCountRef.current >=
      MAX_AUTOMATIC_CHECKS
    ) {
      setStatus("processing");
      setMessage(
        "Payment was received, but document preparation is taking longer than expected. Use the refresh button below to check again."
      );

      return;
    }

    checkCountRef.current += 1;

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(
      () => verifyPayment(),
      CHECK_INTERVAL_MS
    );
  }

  const pageConfig = getPageConfig(status);

  return (
    <ComplianceLayout
      badge="Compliance OS"
      title={pageConfig.title}
      description={pageConfig.description}
      icon={pageConfig.icon}
      accent={pageConfig.accent}
    >
      <section className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/30">
        <div className="relative p-7 text-center sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.12),transparent_42%)]" />

          <div className="relative">
            <StatusIcon
              status={status}
              checking={checking}
            />

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              Secure Stripe payment
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              {pageConfig.heading}
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              {message}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <StatusCard
                label="Payment"
                value={formatStatus(paymentStatus)}
                icon={ShieldCheck}
              />

              <StatusCard
                label="Documents"
                value={
                  documentsGenerated
                    ? "Generated"
                    : status === "processing"
                    ? "Preparing"
                    : "Pending"
                }
                icon={FileText}
              />

              <StatusCard
                label="Assessment"
                value={
                  assessmentId
                    ? "Connected"
                    : "Pending"
                }
                icon={CheckCircle2}
              />
            </div>

            {assessmentId && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Assessment reference
                </p>

                <p className="mt-2 break-all font-mono text-xs text-slate-300">
                  {assessmentId}
                </p>
              </div>
            )}

            <ActionButtons
              status={status}
              checking={checking}
              documentsGenerated={
                documentsGenerated
              }
              onRefresh={() =>
                verifyPayment({ manual: true })
              }
            />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-3xl rounded-3xl border border-cyan-400/15 bg-cyan-400/[0.05] p-5">
        <div className="flex items-start gap-3">
          <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />

          <p className="text-xs leading-6 text-slate-400">
            Stripe payment confirmation and document generation are handled by the server webhook. Closing this page will not cancel a completed payment or stop document preparation.
          </p>
        </div>
      </section>
    </ComplianceLayout>
  );
}

function StatusIcon({ status, checking }) {
  if (checking || status === "checking") {
    return (
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-cyan-400/20 bg-cyan-400/10">
        <Loader2 className="h-9 w-9 animate-spin text-cyan-300" />
      </span>
    );
  }

  if (status === "success") {
    return (
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-emerald-400/20 bg-emerald-400/10">
        <CheckCircle2 className="h-10 w-10 text-emerald-300" />
      </span>
    );
  }

  if (status === "processing") {
    return (
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-amber-400/20 bg-amber-400/10">
        <Clock3 className="h-10 w-10 text-amber-300" />
      </span>
    );
  }

  return (
    <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-rose-400/20 bg-rose-400/10">
      <AlertTriangle className="h-10 w-10 text-rose-300" />
    </span>
  );
}

function StatusCard({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-left">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
          <Icon className="h-4 w-4 text-emerald-300" />
        </span>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {label}
          </p>

          <p className="mt-1 text-sm font-bold text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionButtons({
  status,
  checking,
  documentsGenerated,
  onRefresh,
}) {
  if (
    status === "success" &&
    documentsGenerated
  ) {
    return (
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/compliance-os"
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.08]"
        >
          Return to Compliance OS
        </Link>

        <button
          type="button"
          onClick={onRefresh}
          disabled={checking}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-3.5 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {checking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          Refresh package status
        </button>
      </div>
    );
  }

  if (
    status === "processing" ||
    status === "checking"
  ) {
    return (
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/compliance-os"
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.08]"
        >
          Return to Compliance OS
        </Link>

        <button
          type="button"
          onClick={onRefresh}
          disabled={checking}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-6 py-3.5 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {checking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          Check again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
      <Link
        to="/compliance-os/assessment"
        className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-6 py-3.5 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
      >
        Return to assessment
      </Link>

      <button
        type="button"
        onClick={onRefresh}
        disabled={checking}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {checking ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
        Try verification again
      </button>
    </div>
  );
}

function getPageConfig(status) {
  if (status === "success") {
    return {
      title: "Payment Confirmed",
      heading: "Your compliance package is ready",
      description:
        "Your payment was confirmed and your Compliance OS package is available.",
      icon: CheckCircle2,
      accent: "emerald",
    };
  }

  if (
    status === "processing" ||
    status === "checking"
  ) {
    return {
      title: "Preparing Your Package",
      heading: "Your payment is being confirmed",
      description:
        "Please keep this page open while Compliance OS prepares your documents.",
      icon: Clock3,
      accent: "cyan",
    };
  }

  return {
    title: "Payment Verification",
    heading: "We could not confirm the payment",
    description:
      "Review the message below or return to the assessment to try again.",
    icon: AlertTriangle,
    accent: "amber",
  };
}

function formatStatus(value) {
  const normalized = String(
    value || "pending"
  )
    .replace(/[_-]+/g, " ")
    .trim();

  return normalized.replace(/\b\w/g, (letter) =>
    letter.toUpperCase()
  );
}

function rememberAssessmentId(id) {
  try {
    localStorage.setItem(
      STORAGE_KEYS.assessmentId,
      id
    );
  } catch {
    // Browser storage may be unavailable.
  }
}

function clearCompletedAssessmentDraft() {
  try {
    localStorage.removeItem(
      STORAGE_KEYS.answers
    );
    localStorage.removeItem(
      STORAGE_KEYS.result
    );
    localStorage.removeItem(
      "aema_compliance_assessment_answers"
    );
    localStorage.removeItem(
      "aema_compliance_assessment_step"
    );
  } catch {
    // Browser storage may be unavailable.
  }
}
