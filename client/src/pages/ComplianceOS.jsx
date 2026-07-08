import { useState } from "react";
import {
  Bot,
  CheckCircle2,
  Download,
  Globe,
  ShieldCheck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AssessmentWizard from "../modules/compliance/assessment/AssessmentWizard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ComplianceOS() {
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleAssessmentFromWizard(answers) {
    setLoading(true);
    setErrorMessage("");

    try {
      const existingDocuments = [];

      if (answers.hasPrivacyPolicy) existingDocuments.push("privacy_policy");
      if (answers.hasTerms) existingDocuments.push("terms");
      if (answers.hasCookiePolicy) existingDocuments.push("cookie_policy");
      if (answers.hasSecurityPolicy) existingDocuments.push("security_policy");
      if (answers.hasRiskRegister) existingDocuments.push("risk_register");
      if (answers.hasVendorRegister) existingDocuments.push("vendor_register");
      if (answers.hasIncidentPlan) existingDocuments.push("incident_response");
      if (answers.hasAIPolicy) existingDocuments.push("responsible_ai");

      const response = await fetch(`${API_URL}/api/compliance/evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...answers,
          existingDocuments,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to complete assessment.");
      }

      setResult(data.result);
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to complete assessment. Please check your backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 pb-24 pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.22),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.18),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          {!started && !result && <HeroSection onStart={() => setStarted(true)} />}

          {started && !result && (
            <>
              {loading ? (
                <LoadingState />
              ) : (
                <AssessmentWizard onComplete={handleAssessmentFromWizard} />
              )}

              {errorMessage && (
                <div className="mx-auto mt-6 max-w-4xl rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm text-amber-200">
                  {errorMessage}
                </div>
              )}
            </>
          )}

          {result && <AssessmentResult result={result} />}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function HeroSection({ onStart }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
        <ShieldCheck className="h-4 w-4" />
        AEMA Compliance OS
      </div>

      <h1 className="mt-8 text-5xl font-black leading-tight md:text-7xl">
        Automate compliance without hiring a compliance team.
      </h1>

      <p className="mt-6 text-lg leading-8 text-slate-300">
        Complete an AI-guided assessment, discover compliance gaps, see readiness
        levels, and generate governance documents for your business.
      </p>

      <button
        onClick={onStart}
        className="mt-10 rounded-2xl bg-emerald-400 px-8 py-4 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
      >
        Start Assessment
      </button>

      <p className="mt-4 text-sm text-slate-400">
        Compliance package: $49 CAD one-time.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-8 text-center">
      <Bot className="mx-auto h-10 w-10 text-emerald-400" />
      <h2 className="mt-5 text-2xl font-black">Evaluating compliance...</h2>
      <p className="mt-3 text-sm text-slate-400">
        AEMA AI is reviewing your answers and mapping your business against
        relevant compliance frameworks.
      </p>
    </div>
  );
}

function AssessmentResult({ result }) {
  const frameworks = result.frameworks || [];
  const missingDocuments = result.missingDocuments || [];
  const risks = result.risks || [];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.05] p-8">
        <div className="flex items-center gap-3">
          <Bot className="h-7 w-7 text-emerald-400" />
          <h2 className="text-3xl font-black">Compliance Readiness Result</h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <ScoreCard label="Overall" value={`${result.overallScore || 0}%`} />
          <ScoreCard
            label="Maturity"
            value={`Level ${result.maturity?.level || 1}`}
          />
          {frameworks.slice(0, 2).map((framework) => (
            <ScoreCard
              key={framework.id}
              label={framework.name}
              value={`${framework.score}%`}
            />
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-6">
          <h3 className="text-xl font-bold">
            {result.maturity?.label || "Reactive"} Maturity
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            {result.maturity?.description}
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Panel title="Missing Documents">
            {missingDocuments.length === 0 ? (
              <p className="text-sm text-emerald-300">
                No major missing documents detected.
              </p>
            ) : (
              missingDocuments.map((item) => (
                <p key={item.id} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-amber-400" />
                  {item.name}
                </p>
              ))
            )}
          </Panel>

          <Panel title="Key Risks">
            {risks.length === 0 ? (
              <p className="text-sm text-emerald-300">No major risks detected.</p>
            ) : (
              risks.map((risk) => (
                <div key={risk.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="font-semibold text-white">{risk.title}</p>
                  <p className="mt-1 text-xs text-amber-300">Risk: {risk.level}</p>
                  <p className="mt-2 text-sm text-slate-400">{risk.recommendation}</p>
                </div>
              ))
            )}
          </Panel>
        </div>

        <div className="mt-8 grid gap-4">
          <h3 className="text-xl font-bold">Framework Readiness</h3>

          {frameworks.map((framework) => (
            <div key={framework.id} className="rounded-3xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold">{framework.name}</h4>
                  <p className="mt-1 text-sm text-slate-400">
                    {framework.description}
                  </p>
                  <p className="mt-2 text-xs text-cyan-300">
                    Priority: {framework.priority}
                  </p>
                </div>

                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-bold text-emerald-300">
                  {framework.score}%
                </span>
              </div>

              {framework.missing?.length > 0 && (
                <p className="mt-4 text-sm text-amber-300">
                  Missing: {framework.missing.map((item) => item.name).join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-6">
          <h3 className="font-bold">Recommended Next Step</h3>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Generate your compliance and governance package for $49 CAD. You can
            download your documents or create a hosted compliance web link with
            AEMA Systems.
          </p>

          <button className="mt-6 w-full rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-emerald-300">
            Generate Compliance & Governance — $49 CAD
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <button className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 text-left transition hover:bg-cyan-400/15">
          <Globe className="h-7 w-7 text-cyan-400" />
          <h3 className="mt-4 text-xl font-bold">Create Hosted Weblink</h3>
          <p className="mt-2 text-sm text-slate-400">
            Host your compliance page with AEMA Systems.
          </p>
        </button>

        <button className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-left transition hover:bg-white/[0.07]">
          <Download className="h-7 w-7 text-emerald-400" />
          <h3 className="mt-4 text-xl font-bold">Download Documents</h3>
          <p className="mt-2 text-sm text-slate-400">
            Download your generated compliance files.
          </p>
        </button>
      </div>
    </div>
  );
}

function ScoreCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
      <p className="text-sm text-slate-400">{label}</p>
      <h3 className="mt-2 text-4xl font-black">{value}</h3>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
      <h3 className="font-bold">{title}</h3>
      <div className="mt-4 grid gap-3">{children}</div>
    </div>
  );
}