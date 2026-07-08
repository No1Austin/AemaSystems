import { useState } from "react";
import { ClipboardCheck, ShieldCheck } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import ComplianceLayout from "../../modules/compliance/layouts/ComplianceLayout.jsx";
import { buildPolicyDrafts } from "./complianceTemplates";
import { scoreFrameworks } from "./frameworkScoring";

export default function ComplianceAssessment() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    businessName: "",
    industry: "",
    country: "Canada",
    province: "Ontario",
    hasWebsite: false,
    collectsCustomerData: false,
    acceptsOnlinePayments: false,
    usesAI: false,
    hasEmployees: false,
    hasPrivacyPolicy: false,
    hasTerms: false,
    hasCookiePolicy: false,
    hasSecurityPolicy: false,
    hasIncidentResponse: false,
    hasVendorRegister: false,
    hasRiskRegister: false,
  });

  const result = calculateCompliance(form);
  const existingItems = getExistingItems(form);
  const frameworkResults = scoreFrameworks(existingItems);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function saveAssessment() {
    if (!form.businessName.trim()) {
      setMessage("Please enter a business name before saving.");
      return;
    }

    setSaving(true);
    setMessage("");

    const { error: assessmentError } = await supabase
      .from("compliance_assessments")
      .insert({
        business_name: form.businessName.trim(),
        industry: form.industry.trim(),
        country: form.country.trim(),
        province: form.province.trim(),

        has_website: form.hasWebsite,
        collects_customer_data: form.collectsCustomerData,
        accepts_online_payments: form.acceptsOnlinePayments,
        uses_ai: form.usesAI,
        has_employees: form.hasEmployees,

        has_privacy_policy: form.hasPrivacyPolicy,
        has_terms: form.hasTerms,
        has_cookie_policy: form.hasCookiePolicy,
        has_security_policy: form.hasSecurityPolicy,
        has_incident_response: form.hasIncidentResponse,
        has_vendor_register: form.hasVendorRegister,
        has_risk_register: form.hasRiskRegister,

        compliance_score: result.score,
        missing_items: result.missing,
        recommendations: result.recommendations,
      });

    if (assessmentError) {
      console.error(assessmentError);
      setMessage("Unable to save assessment. Please check Supabase setup.");
      setSaving(false);
      return;
    }

    const drafts = buildPolicyDrafts({
      form,
      missingItems: result.missing,
    });

    if (drafts.length > 0) {
      const { error: draftError } = await supabase
        .from("governance_policies")
        .upsert(drafts, {
          onConflict: "slug",
        });

      if (draftError) {
        console.error(draftError);
        setMessage("Assessment saved, but document drafts could not be created.");
        setSaving(false);
        return;
      }
    }

    setMessage(
      `Assessment saved. ${drafts.length} draft document(s) created in Governance Documents.`
    );

    setSaving(false);
  }

  return (
    <ComplianceLayout
      badge="Compliance OS"
      title="Compliance Assessment"
      description="Evaluate a business, identify missing governance items, and recommend documents AEMA Governance OS can prepare."
      icon={ClipboardCheck}
      accent="emerald"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-bold">Business Profile</h2>

          <div className="mt-5 grid gap-4">
            <Input
              label="Business Name"
              value={form.businessName}
              onChange={(value) => updateField("businessName", value)}
            />

            <Input
              label="Industry"
              value={form.industry}
              onChange={(value) => updateField("industry", value)}
            />

            <Input
              label="Country"
              value={form.country}
              onChange={(value) => updateField("country", value)}
            />

            <Input
              label="Province / State"
              value={form.province}
              onChange={(value) => updateField("province", value)}
            />
          </div>

          <h3 className="mt-8 text-lg font-bold">Business Activities</h3>

          <div className="mt-4 grid gap-3">
            <Check
              label="Has a website"
              checked={form.hasWebsite}
              onChange={(value) => updateField("hasWebsite", value)}
            />

            <Check
              label="Collects customer information"
              checked={form.collectsCustomerData}
              onChange={(value) => updateField("collectsCustomerData", value)}
            />

            <Check
              label="Accepts online payments"
              checked={form.acceptsOnlinePayments}
              onChange={(value) => updateField("acceptsOnlinePayments", value)}
            />

            <Check
              label="Uses AI tools"
              checked={form.usesAI}
              onChange={(value) => updateField("usesAI", value)}
            />

            <Check
              label="Has employees or contractors"
              checked={form.hasEmployees}
              onChange={(value) => updateField("hasEmployees", value)}
            />
          </div>

          <h3 className="mt-8 text-lg font-bold">Existing Documents</h3>

          <div className="mt-4 grid gap-3">
            <Check
              label="Privacy Policy"
              checked={form.hasPrivacyPolicy}
              onChange={(value) => updateField("hasPrivacyPolicy", value)}
            />

            <Check
              label="Terms of Service"
              checked={form.hasTerms}
              onChange={(value) => updateField("hasTerms", value)}
            />

            <Check
              label="Cookie Policy"
              checked={form.hasCookiePolicy}
              onChange={(value) => updateField("hasCookiePolicy", value)}
            />

            <Check
              label="Security Policy"
              checked={form.hasSecurityPolicy}
              onChange={(value) => updateField("hasSecurityPolicy", value)}
            />

            <Check
              label="Incident Response Plan"
              checked={form.hasIncidentResponse}
              onChange={(value) => updateField("hasIncidentResponse", value)}
            />

            <Check
              label="Vendor Register"
              checked={form.hasVendorRegister}
              onChange={(value) => updateField("hasVendorRegister", value)}
            />

            <Check
              label="Risk Register"
              checked={form.hasRiskRegister}
              onChange={(value) => updateField("hasRiskRegister", value)}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            <h2 className="text-xl font-bold">Assessment Result</h2>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-slate-400">Compliance Score</p>

            <h3 className="mt-2 text-6xl font-black text-white">
              {result.score}%
            </h3>
          </div>

          <div className="mt-6">
            <h3 className="font-bold">Missing Items</h3>

            <div className="mt-3 grid gap-3">
              {result.missing.length === 0 ? (
                <p className="text-sm text-emerald-300">
                  No major missing items detected.
                </p>
              ) : (
                result.missing.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300"
                  >
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-bold">Recommendations</h3>

            <div className="mt-3 grid gap-3">
              {result.recommendations.length === 0 ? (
                <p className="text-sm text-emerald-300">
                  No recommendations at this time.
                </p>
              ) : (
                result.recommendations.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100"
                  >
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-bold">Framework Readiness</h3>

            <div className="mt-3 grid gap-3">
              {frameworkResults.map((framework) => (
                <div
                  key={framework.id}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {framework.name}
                      </h4>

                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        {framework.description}
                      </p>
                    </div>

                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                      {framework.score}%
                    </span>
                  </div>

                  {framework.missing.length > 0 && (
                    <p className="mt-3 text-xs text-amber-300">
                      Missing: {framework.missing.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {message && (
            <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={saveAssessment}
            disabled={saving}
            className="mt-6 w-full rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving Assessment..."
              : "Save Assessment & Generate Documents"}
          </button>
        </section>
      </div>
    </ComplianceLayout>
  );
}

function calculateCompliance(form) {
  const checks = [
    ["Privacy Policy", form.hasPrivacyPolicy],
    ["Terms of Service", form.hasTerms],
    ["Cookie Policy", !form.hasWebsite || form.hasCookiePolicy],
    ["Security Policy", form.hasSecurityPolicy],
    ["Incident Response Plan", form.hasIncidentResponse],
    ["Vendor Register", form.hasVendorRegister],
    ["Risk Register", form.hasRiskRegister],
  ];

  const missing = checks.filter(([, passed]) => !passed).map(([name]) => name);
  const passed = checks.length - missing.length;
  const score = Math.round((passed / checks.length) * 100);

  const recommendations = [];

  if (form.collectsCustomerData && !form.hasPrivacyPolicy) {
    recommendations.push(
      "Create a Privacy Policy because the business collects customer information."
    );
  }

  if (form.hasWebsite && !form.hasCookiePolicy) {
    recommendations.push("Create a Cookie Policy for website transparency.");
  }

  if (!form.hasTerms) {
    recommendations.push(
      "Create Terms of Service to define user responsibilities and limit business risk."
    );
  }

  if (form.acceptsOnlinePayments && !form.hasVendorRegister) {
    recommendations.push(
      "Add payment providers such as Stripe to a Vendor Register."
    );
  }

  if (form.usesAI) {
    recommendations.push(
      "Create a Responsible AI Policy and AI usage disclosure."
    );
  }

  if (!form.hasSecurityPolicy) {
    recommendations.push(
      "Create a Security Policy to describe how the business protects information."
    );
  }

  if (!form.hasIncidentResponse) {
    recommendations.push(
      "Create an Incident Response Plan to prepare for security or data incidents."
    );
  }

  if (!form.hasRiskRegister) {
    recommendations.push(
      "Create a Risk Register to track business, security, vendor, and operational risks."
    );
  }

  return { score, missing, recommendations };
}

function getExistingItems(form) {
  const items = [];

  if (form.hasPrivacyPolicy) items.push("Privacy Policy");
  if (form.hasTerms) items.push("Terms of Service");
  if (form.hasCookiePolicy) items.push("Cookie Policy");
  if (form.hasSecurityPolicy) items.push("Security Policy");
  if (form.hasIncidentResponse) items.push("Incident Response Plan");
  if (form.hasVendorRegister) items.push("Vendor Register");
  if (form.hasRiskRegister) items.push("Risk Register");

  return items;
}

function Input({ label, value, onChange }) {
  return (
    <label className="grid gap-2 text-sm text-slate-400">
      {label}

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
      />
    </label>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4"
      />

      {label}
    </label>
  );
}