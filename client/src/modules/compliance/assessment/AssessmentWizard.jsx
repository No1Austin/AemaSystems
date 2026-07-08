import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { assessmentSteps } from "../data/assessmentQuestions";
export default function AssessmentWizard({ onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const step = assessmentSteps[stepIndex];
  const isLastStep = stepIndex === assessmentSteps.length - 1;
  const progress = Math.round(((stepIndex + 1) / assessmentSteps.length) * 100);

  function updateAnswer(name, value) {
    setAnswers((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function nextStep() {
    if (isLastStep) {
      onComplete(answers);
      return;
    }

    setStepIndex((current) => current + 1);
  }

  function prevStep() {
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  return (
    <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.04] p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
            AEMA Compliance Assessment
          </p>

          <h2 className="mt-2 text-3xl font-black">{step.title}</h2>
        </div>

        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300">
          {progress}%
        </div>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-emerald-400"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {step.questions.map((question) => (
          <QuestionField
            key={question.name}
            question={question}
            value={answers[question.name] ?? question.defaultValue ?? ""}
            onChange={(value) => updateAnswer(question.name, value)}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={prevStep}
          disabled={stepIndex === 0}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          onClick={nextStep}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
        >
          {isLastStep ? "Complete Assessment" : "Next"}
          {isLastStep ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

function QuestionField({ question, value, onChange }) {
  if (question.type === "boolean") {
    return (
      <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4"
        />
        {question.label}
      </label>
    );
  }

  if (question.type === "select") {
    return (
      <label className="grid gap-2 text-sm text-slate-400">
        {question.label}
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
        >
          <option value="">Select one</option>
          {question.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="grid gap-2 text-sm text-slate-400">
      {question.label}
      <input
        type={question.type || "text"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
      />
    </label>
  );
}