import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Globe2,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import ComplianceLayout from "../../modules/compliance/layouts/ComplianceLayout.jsx";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ComplianceDashboard() {
  const [searchParams] = useSearchParams();

  const assessmentId =
    searchParams.get("assessment_id") ||
    localStorage.getItem("aema_compliance_assessment_id") ||
    "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workspace, setWorkspace] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [documentCount, setDocumentCount] = useState(0);

  useEffect(() => {
    async function loadWorkspace() {
      if (!assessmentId) {
        setError("No assessment reference was found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/compliance/workspace/by-assessment/${encodeURIComponent(
            assessmentId
          )}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error?.message ||
              data.message ||
              "Unable to load your workspace."
          );
        }

        setWorkspace(data.workspace);
        setAssessment(data.assessment);
        setDocumentCount(Number(data.documentCount || 0));
      } catch (loadError) {
        console.error("Compliance workspace failed:", loadError);

        setError(
          loadError?.message ||
            "Unable to load the compliance workspace."
        );
      } finally {
        setLoading(false);
      }
    }

    loadWorkspace();
  }, [assessmentId]);

  if (loading) {
    return (
      <ComplianceLayout
        badge="Compliance Dashboard"
        title="Loading your workspace"
        description="Connecting your generated documents and governance workspace."
        icon={ShieldCheck}
        accent="cyan"
      >
        <div className="flex min-h-[360px] items-center justify-center">
          <Loader2 className="h-9 w-9 animate-spin text-cyan-300" />
        </div>
      </ComplianceLayout>
    );
  }

  if (error || !workspace) {
    return (
      <ComplianceLayout
        badge="Compliance Dashboard"
        title="Workspace unavailable"
        description={error}
        icon={AlertTriangle}
        accent="amber"
      >
        <Link
          to="/compliance-os"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950"
        >
          Return to Compliance OS
          <ArrowRight className="h-4 w-4" />
        </Link>
      </ComplianceLayout>
    );
  }

  const cards = [
    {
      label: "Compliance score",
      value: `${assessment?.compliance_score || 0}%`,
      helper: assessment?.risk_level || "Preliminary readiness",
      icon: BarChart3,
    },
    {
      label: "Generated documents",
      value: documentCount,
      helper: "Policies, plans, and registers",
      icon: FileText,
    },
    {
      label: "Package access",
      value: workspace.package_access ? "Active" : "Pending",
      helper: "One-time package",
      icon: CheckCircle2,
    },
    {
      label: "Hosted Trust Center",
      value: workspace.hosting_status === "active" ? "Live" : "Inactive",
      helper:
        workspace.hosting_status === "active"
          ? workspace.slug
          : "$19.99 CAD/month",
      icon: Globe2,
    },
  ];

  return (
    <ComplianceLayout
      badge="Compliance Dashboard"
      title={workspace.business_name}
      description="Manage generated documents, governance readiness, and your optional hosted Trust Center."
      icon={ShieldCheck}
      accent="emerald"
    >
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ label, value, helper, icon: Icon }) => (
            <article
              key={label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
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
            </article>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <Link
            to={`/compliance-dashboard/documents?workspace_id=${encodeURIComponent(
              workspace.id
            )}&assessment_id=${encodeURIComponent(assessmentId)}`}
            className="group rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.06] p-6 transition hover:-translate-y-0.5 hover:bg-emerald-400/[0.09]"
          >
            <FileText className="h-7 w-7 text-emerald-300" />

            <h2 className="mt-5 text-xl font-black text-white">
              Open generated documents
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              Review, copy, edit, approve, and prepare your policies for publishing.
            </p>

            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-300">
              View {documentCount} documents
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>

          <article className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.05] p-6">
            <Globe2 className="h-7 w-7 text-cyan-300" />

            <h2 className="mt-5 text-xl font-black text-white">
              Hosted Trust Center
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              Add your logo and colours, choose public documents, and publish a customer-facing compliance link.
            </p>

            <p className="mt-6 text-sm font-bold text-cyan-300">
              {workspace.hosting_status === "active"
                ? "Hosting active"
                : "Optional subscription · $19.99 CAD/month"}
            </p>
          </article>
        </section>
      </div>
    </ComplianceLayout>
  );
}
