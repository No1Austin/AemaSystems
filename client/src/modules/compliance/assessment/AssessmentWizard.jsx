import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleSlash2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import { assessmentSteps } from "../data/assessmentQuestions";

const STORAGE_KEYS = {
  answers: "aema_compliance_assessment_answers",
  stepIndex: "aema_compliance_assessment_step",
  lastSaved: "aema_compliance_assessment_last_saved",
};

const RESPONSE_OPTIONS = [
  {
    value: "yes",
    label: "Yes",
    helper: "Currently implemented",
    icon: Check,
    selectedClass:
      "border-emerald-400/70 bg-emerald-400/10 text-emerald-200 shadow-lg shadow-emerald-950/20",
    iconClass: "bg-emerald-400/15 text-emerald-300",
  },
  {
    value: "no",
    label: "No",
    helper: "Not implemented",
    icon: X,
    selectedClass:
      "border-rose-400/70 bg-rose-400/10 text-rose-200 shadow-lg shadow-rose-950/20",
    iconClass: "bg-rose-400/15 text-rose-300",
  },
  {
    value: "na",
    label: "N/A",
    helper: "Not applicable",
    icon: CircleSlash2,
    selectedClass:
      "border-slate-300/40 bg-white/[0.07] text-white shadow-lg shadow-black/20",
    iconClass: "bg-white/10 text-slate-200",
  },
];

export default function AssessmentWizard({ onComplete }) {
  const [stepIndex, setStepIndex] = useState(() => {
    try {
      const savedStep = localStorage.getItem(
        STORAGE_KEYS.stepIndex
      );

      const parsedStep = Number(savedStep);

      if (
        Number.isInteger(parsedStep) &&
        parsedStep >= 0 &&
        parsedStep < assessmentSteps.length
      ) {
        return parsedStep;
      }
    } catch (error) {
      console.error(
        "Unable to restore assessment step:",
        error
      );
    }

    return 0;
  });

  const [answers, setAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(
        STORAGE_KEYS.answers
      );

      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error(
        "Unable to restore assessment answers:",
        error
      );

      return {};
    }
  });

  const [lastSaved, setLastSaved] = useState(() => {
    try {
      return localStorage.getItem(
        STORAGE_KEYS.lastSaved
      );
    } catch {
      return null;
    }
  });

  const [validationMessage, setValidationMessage] =
    useState("");

  useEffect(() => {
    try {
      const savedAt = new Date().toISOString();

      localStorage.setItem(
        STORAGE_KEYS.answers,
        JSON.stringify(answers)
      );

      localStorage.setItem(
        STORAGE_KEYS.lastSaved,
        savedAt
      );

      setLastSaved(savedAt);
    } catch (error) {
      console.error(
        "Unable to save assessment answers:",
        error
      );
    }
  }, [answers]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.stepIndex,
        String(stepIndex)
      );
    } catch (error) {
      console.error(
        "Unable to save assessment step:",
        error
      );
    }
  }, [stepIndex]);

  const step = assessmentSteps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep =
    stepIndex === assessmentSteps.length - 1;

  const progress = Math.round(
    ((stepIndex + 1) /
      assessmentSteps.length) *
      100
  );

  const answeredCount = useMemo(() => {
    return step.questions.filter((question) => {
      const value =
        answers[question.name] ??
        question.defaultValue ??
        "";

      return String(value).trim() !== "";
    }).length;
  }, [answers, step]);

  const totalQuestions = step.questions.length;

  function updateAnswer(name, value) {
    setAnswers((current) => ({
      ...current,
      [name]: value,
    }));

    setValidationMessage("");
  }

  function validateCurrentStep() {
    const missingRequired =
      step.questions.filter((question) => {
        if (!question.required) return false;

        const value =
          answers[question.name] ??
          question.defaultValue ??
          "";

        return String(value).trim() === "";
      });

    if (missingRequired.length > 0) {
      setValidationMessage(
        "Please complete all required fields before continuing."
      );

      return false;
    }

    const validBooleanValues =
      RESPONSE_OPTIONS.map(
        (option) => option.value
      );

    const unansweredBooleanQuestions =
      step.questions.filter((question) => {
        if (question.type !== "boolean") {
          return false;
        }

        return !validBooleanValues.includes(
          answers[question.name]
        );
      });

    if (
      unansweredBooleanQuestions.length > 0
    ) {
      setValidationMessage(
        "Please select Yes, No, or N/A for every assessment statement."
      );

      return false;
    }

    return true;
  }

  function nextStep() {
    if (!validateCurrentStep()) return;

    if (isLastStep) {
      /*
       * Keep the browser draft after completion.
       * It should only be cleared deliberately by the user
       * or after confirmed payment.
       */
      onComplete?.(answers);
      return;
    }

    setStepIndex(
      (current) => current + 1
    );

    setValidationMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function previousStep() {
    if (isFirstStep) return;

    setStepIndex((current) =>
      Math.max(current - 1, 0)
    );

    setValidationMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function clearSavedAssessment() {
    const confirmed = window.confirm(
      "Are you sure you want to clear your saved assessment and start again?"
    );

    if (!confirmed) return;

    try {
      localStorage.removeItem(
        STORAGE_KEYS.answers
      );

      localStorage.removeItem(
        STORAGE_KEYS.stepIndex
      );

      localStorage.removeItem(
        STORAGE_KEYS.lastSaved
      );
    } catch (error) {
      console.error(
        "Unable to clear saved assessment:",
        error
      );
    }

    setAnswers({});
    setStepIndex(0);
    setLastSaved(null);
    setValidationMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <section className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#07111f] shadow-2xl shadow-black/40">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -right-20 top-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative">
        <AssessmentProgressHeader
          stepIndex={stepIndex}
          progress={progress}
          answeredCount={answeredCount}
          totalQuestions={totalQuestions}
          lastSaved={lastSaved}
          onClear={clearSavedAssessment}
        />

        <main className="p-5 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-5xl">
            <header className="border-b border-white/10 pb-7">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Step {stepIndex + 1} of{" "}
                  {assessmentSteps.length}
                </span>

                <span className="text-xs text-slate-500">
                  {answeredCount}/{totalQuestions} answered
                </span>
              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                {step.title}
              </h2>

              {step.description && (
                <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
                  {step.description}
                </p>
              )}
            </header>

            <div className="mt-7 space-y-4">
              {step.questions.map(
                (question, index) => (
                  <QuestionField
                    key={question.name}
                    number={index + 1}
                    question={question}
                    value={
                      answers[
                        question.name
                      ] ??
                      question.defaultValue ??
                      ""
                    }
                    onChange={(value) =>
                      updateAnswer(
                        question.name,
                        value
                      )
                    }
                  />
                )
              )}
            </div>

            {validationMessage && (
              <div
                role="alert"
                className="mt-6 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-5 py-4 text-sm font-medium text-amber-100"
              >
                {validationMessage}
              </div>
            )}

            <footer className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={previousStep}
                disabled={isFirstStep}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:brightness-105"
              >
                {isLastStep
                  ? "Complete Assessment"
                  : "Continue"}

                {isLastStep ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </footer>
          </div>
        </main>
      </div>
    </section>
  );
}

function AssessmentProgressHeader({
  stepIndex,
  progress,
  answeredCount,
  totalQuestions,
  lastSaved,
  onClear,
}) {
  return (
    <div className="border-b border-white/10 bg-white/[0.025] px-5 py-5 sm:px-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
            <Sparkles className="h-5 w-5 text-emerald-300" />
          </span>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
              Assessment Progress
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <p className="text-sm font-semibold text-white">
                {progress}% complete
              </p>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
                Step {stepIndex + 1} of{" "}
                {assessmentSteps.length}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
                {answeredCount}/{totalQuestions} answered
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <p className="text-xs text-emerald-300">
            {lastSaved
              ? `Saved in this browser ${formatSavedTime(
                  lastSaved
                )}`
              : "Answers save automatically"}
          </p>

          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-slate-500 transition hover:text-rose-300"
          >
            Clear saved draft
          </button>
        </div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}

function QuestionField({
  question,
  value,
  onChange,
  number,
}) {
  if (question.type === "boolean") {
    return (
      <fieldset className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-white/15 sm:p-6">
        <legend className="sr-only">
          {question.label}
        </legend>

        <div className="flex items-start gap-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-bold text-slate-400">
            {number}
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-7 text-slate-100 sm:text-base">
              {question.label}
            </p>

            {question.helpText && (
              <p className="mt-2 text-xs leading-6 text-slate-500">
                {question.helpText}
              </p>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {RESPONSE_OPTIONS.map(
                (option) => {
                  const Icon = option.icon;
                  const selected =
                    value === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        onChange(option.value)
                      }
                      className={`group flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                        selected
                          ? option.selectedClass
                          : "border-white/10 bg-[#091321] text-slate-400 hover:border-white/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          selected
                            ? option.iconClass
                            : "bg-white/[0.04] text-slate-500"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>

                      <span>
                        <span className="block text-sm font-bold">
                          {option.label}
                        </span>

                        <span className="mt-1 block text-xs opacity-70">
                          {option.helper}
                        </span>
                      </span>

                      {selected && (
                        <CheckCircle2 className="ml-auto h-4 w-4" />
                      )}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </fieldset>
    );
  }

  if (question.type === "select") {
    return (
      <label className="block rounded-3xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-white/15 sm:p-6">
        <span className="flex items-start gap-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-bold text-slate-400">
            {number}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-slate-100 sm:text-base">
              {question.label}

              {question.required && (
                <span className="ml-1 text-rose-300">
                  *
                </span>
              )}
            </span>

            <select
              value={value}
              required={question.required}
              onChange={(event) =>
                onChange(event.target.value)
              }
              className="mt-4 w-full rounded-2xl border border-white/10 bg-[#091321] px-4 py-3.5 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10"
            >
              <option value="">
                Select one
              </option>

              {(question.options ?? []).map(
                (option) => {
                  const optionLabel =
                    typeof option ===
                    "object"
                      ? option.label
                      : option;

                  const optionValue =
                    typeof option ===
                    "object"
                      ? option.value
                      : option;

                  return (
                    <option
                      key={optionValue}
                      value={optionValue}
                    >
                      {optionLabel}
                    </option>
                  );
                }
              )}
            </select>
          </span>
        </span>
      </label>
    );
  }

  return (
    <label className="block rounded-3xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-white/15 sm:p-6">
      <span className="flex items-start gap-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-bold text-slate-400">
          {number}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-slate-100 sm:text-base">
            {question.label}

            {question.required && (
              <span className="ml-1 text-rose-300">
                *
              </span>
            )}
          </span>

          <input
            type={question.type || "text"}
            value={value}
            required={question.required}
            placeholder={
              question.placeholder || ""
            }
            onChange={(event) =>
              onChange(event.target.value)
            }
            className="mt-4 w-full rounded-2xl border border-white/10 bg-[#091321] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10"
          />
        </span>
      </span>
    </label>
  );
}

function formatSavedTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}
