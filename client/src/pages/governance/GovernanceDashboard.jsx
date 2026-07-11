import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock,
  Eye,
  FileEdit,
  FileText,
  Globe2,
  LoaderCircle,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

import GovernanceSidebar from "../../components/governance/GovernanceSidebar";
import { supabase } from "../../lib/supabaseClient";

export default function GovernanceDashboard() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const { data, error } = await supabase
          .from("governance_policies")
          .select(
            `
              id,
              title,
              slug,
              description,
              version,
              status,
              is_public,
              effective_date,
              last_reviewed,
              next_review,
              created_at,
              updated_at
            `
          )
          .order("updated_at", { ascending: false });

        if (!isMounted) return;

        if (error) {
          console.error("Unable to load governance dashboard:", error);
          setPolicies([]);
          setErrorMessage("Unable to load governance information.");
          return;
        }

        setPolicies(data || []);
        setErrorMessage("");
      } catch (error) {
        if (!isMounted) return;

        console.error("Unexpected dashboard error:", error);
        setPolicies([]);
        setErrorMessage(
          "An unexpected error occurred while loading the dashboard."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const metrics = useMemo(() => calculateMetrics(policies), [policies]);

  const upcomingReviews = useMemo(() => {
    return [...policies]
      .filter((policy) => policy.next_review)
      .sort(
        (first, second) =>
          new Date(first.next_review).getTime() -
          new Date(second.next_review).getTime()
      )
      .slice(0, 5);
  }, [policies]);

  const recentPolicies = useMemo(() => {
    return [...policies]
      .sort(
        (first, second) =>
          new Date(second.updated_at || second.created_at).getTime() -
          new Date(first.updated_at || first.created_at).getTime()
      )
      .slice(0, 5);
  }, [policies]);

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-6 text-white sm:px-6 lg:py-10">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <GovernanceSidebar />

        <div className="min-w-0">
          <DashboardHero
            score={metrics.governanceScore}
            publishedPolicies={metrics.publishedPolicies}
            totalPolicies={metrics.totalPolicies}
          />

          {errorMessage && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Governance Score"
              value={`${metrics.governanceScore}%`}
              subtext={`${metrics.completedRequirements} of ${metrics.totalRequirements} requirements complete`}
              icon={ShieldCheck}
              accent="emerald"
            />

            <MetricCard
              label="Published Policies"
              value={metrics.publishedPolicies}
              subtext={`${metrics.draftPolicies} draft ${
                metrics.draftPolicies === 1 ? "policy" : "policies"
              }`}
              icon={FileText}
              accent="cyan"
            />

            <MetricCard
              label="Need Review"
              value={metrics.reviewRequired}
              subtext="Overdue or due within 30 days"
              icon={Clock}
              accent={metrics.reviewRequired > 0 ? "amber" : "emerald"}
            />

            <MetricCard
              label="Public Documents"
              value={metrics.publicPolicies}
              subtext="Visible in the Trust Center"
              icon={Globe2}
              accent="blue"
            />
          </section>

          <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
            <div className="min-w-0">
              <SectionHeading
                icon={FileText}
                title="Governance documents"
                description="Policies managed through the AEMA governance portal."
                actionLabel="Manage documents"
                actionHref="/governance/documents"
              />

              <div className="grid gap-4">
                {recentPolicies.length > 0 ? (
                  recentPolicies.map((policy) => (
                    <PolicyCard key={policy.id} policy={policy} />
                  ))
                ) : (
                  <EmptyState
                    icon={FileText}
                    title="No governance policies"
                    description="Create your first governance document to begin building the AEMA Trust Center."
                    actionLabel="Create policy"
                    actionHref="/governance/documents"
                  />
                )}
              </div>
            </div>

            <aside className="grid content-start gap-6">
              <TrustCenterStatus
                publishedPolicies={metrics.publishedPolicies}
                publicPolicies={metrics.publicPolicies}
              />

              <UpcomingReviews policies={upcomingReviews} />

              <GovernanceHealth metrics={metrics} />
            </aside>
          </section>
        </div>
      </div>
    </main>
  );
}

function DashboardHero({
  score,
  publishedPolicies,
  totalPolicies,
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 via-cyan-400/[0.04] to-transparent p-6 sm:p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
              <ShieldCheck className="h-7 w-7 text-emerald-400" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400 sm:text-sm">
                AEMA Governance
              </p>

              <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                Governance Center
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-300">
            Manage AEMA Systems policies, public Trust Center documents,
            review schedules, governance records, and internal control
            activities from one workspace.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/governance/documents"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              Manage policies
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/trust"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
            >
              View Trust Center
              <Eye className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="min-w-[220px] rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-slate-400">Overall governance</p>

          <div className="mt-3 flex items-end gap-2">
            <span className="text-5xl font-black text-white">{score}%</span>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-500"
              style={{ width: `${score}%` }}
            />
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-400">
            {publishedPolicies} of {totalPolicies} policies are currently
            published.
          </p>
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  subtext,
  icon: Icon,
  accent = "emerald",
}) {
  const accentClasses = {
    emerald: {
      icon: "text-emerald-400",
      background: "bg-emerald-400/10",
      border: "border-emerald-400/20",
    },
    cyan: {
      icon: "text-cyan-400",
      background: "bg-cyan-400/10",
      border: "border-cyan-400/20",
    },
    amber: {
      icon: "text-amber-400",
      background: "bg-amber-400/10",
      border: "border-amber-400/20",
    },
    blue: {
      icon: "text-blue-400",
      background: "bg-blue-400/10",
      border: "border-blue-400/20",
    },
  };

  const styles = accentClasses[accent] || accentClasses.emerald;

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${styles.border} ${styles.background}`}
      >
        <Icon className={`h-5 w-5 ${styles.icon}`} />
      </div>

      <p className="mt-5 text-3xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm font-medium text-slate-300">{label}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{subtext}</p>
    </article>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}) {
  return (
    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-cyan-400" />
          <h2 className="text-xl font-bold">{title}</h2>
        </div>

        <p className="mt-2 text-sm text-slate-400">{description}</p>
      </div>

      <Link
        to={actionHref}
        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function PolicyCard({ policy }) {
  const isPublished = normalizeStatus(policy.status) === "published";
  const reviewStatus = getReviewStatus(policy.next_review);

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.05]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10">
            <FileText className="h-6 w-6 text-cyan-400" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-bold text-white">{policy.title}</h3>

            <p className="mt-1 text-sm text-slate-400">
              Version {policy.version || "1.0"} · Updated{" "}
              {formatDate(policy.updated_at || policy.created_at)}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge
                label={isPublished ? "Published" : policy.status || "Draft"}
                type={isPublished ? "success" : "neutral"}
              />

              {policy.is_public && (
                <StatusBadge label="Public" type="info" />
              )}

              {reviewStatus.type !== "neutral" && (
                <StatusBadge
                  label={reviewStatus.label}
                  type={reviewStatus.type}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {isPublished && policy.is_public && policy.slug && (
            <Link
              to={`/trust/${policy.slug}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-300"
            >
              <Eye className="h-4 w-4" />
              Public page
            </Link>
          )}

          <Link
            to={`/governance/documents/${policy.slug}`}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/15"
          >
            <FileEdit className="h-4 w-4" />
            Edit
          </Link>
        </div>
      </div>
    </article>
  );
}

function TrustCenterStatus({
  publishedPolicies,
  publicPolicies,
}) {
  const isOnline = publicPolicies > 0;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center gap-3">
        <Globe2 className="h-5 w-5 text-emerald-400" />
        <h2 className="font-bold">Trust Center status</h2>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4">
        <div>
          <p className="text-sm font-semibold text-white">
            {isOnline ? "Online" : "No public documents"}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {publicPolicies} public document
            {publicPolicies === 1 ? "" : "s"}
          </p>
        </div>

        <span
          className={`h-3 w-3 rounded-full ${
            isOnline
              ? "bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.8)]"
              : "bg-slate-600"
          }`}
        />
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-400">
        <div className="flex items-center justify-between">
          <span>Published policies</span>
          <strong className="text-white">{publishedPolicies}</strong>
        </div>

        <div className="flex items-center justify-between">
          <span>Public documents</span>
          <strong className="text-white">{publicPolicies}</strong>
        </div>
      </div>

      <Link
        to="/trust"
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
      >
        Open Trust Center
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}

function UpcomingReviews({ policies }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center gap-3">
        <CalendarClock className="h-5 w-5 text-cyan-400" />
        <h2 className="font-bold">Upcoming reviews</h2>
      </div>

      <div className="mt-5 grid gap-3">
        {policies.length > 0 ? (
          policies.map((policy) => {
            const status = getReviewStatus(policy.next_review);

            return (
              <div
                key={policy.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {policy.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(policy.next_review)}
                    </p>
                  </div>

                  <StatusBadge
                    label={status.label}
                    type={status.type}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm leading-6 text-slate-400">
            No policy reviews have been scheduled.
          </p>
        )}
      </div>
    </section>
  );
}

function GovernanceHealth({ metrics }) {
  const healthItems = [
    {
      label: "Policies published",
      complete: metrics.publishedPolicies > 0,
    },
    {
      label: "Trust Center available",
      complete: metrics.publicPolicies > 0,
    },
    {
      label: "Review dates assigned",
      complete: metrics.policiesWithReviewDates === metrics.totalPolicies,
    },
    {
      label: "No overdue reviews",
      complete: metrics.overduePolicies === 0,
    },
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center gap-3">
        <RefreshCcw className="h-5 w-5 text-emerald-400" />
        <h2 className="font-bold">Governance health</h2>
      </div>

      <div className="mt-5 grid gap-3">
        {healthItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
          >
            {item.complete ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
            )}

            <span className="text-sm text-slate-300">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatusBadge({
  label,
  type = "neutral",
}) {
  const classes = {
    success:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    warning: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    danger: "border-red-400/20 bg-red-400/10 text-red-300",
    info: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    neutral: "border-white/10 bg-white/[0.04] text-slate-400",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        classes[type] || classes.neutral
      }`}
    >
      {label}
    </span>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
      <Icon className="mx-auto h-9 w-9 text-slate-500" />

      <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        {description}
      </p>

      <Link
        to={actionHref}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function DashboardLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
      <div className="text-center">
        <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-emerald-400" />
        <p className="mt-4 text-sm text-slate-400">
          Loading governance dashboard...
        </p>
      </div>
    </main>
  );
}

function calculateMetrics(policies) {
  const now = new Date();
  const reviewWindow = new Date();
  reviewWindow.setDate(reviewWindow.getDate() + 30);

  const totalPolicies = policies.length;

  const publishedPolicies = policies.filter(
    (policy) => normalizeStatus(policy.status) === "published"
  ).length;

  const draftPolicies = policies.filter(
    (policy) => normalizeStatus(policy.status) === "draft"
  ).length;

  const publicPolicies = policies.filter(
    (policy) =>
      normalizeStatus(policy.status) === "published" && policy.is_public
  ).length;

  const policiesWithReviewDates = policies.filter(
    (policy) => Boolean(policy.next_review)
  ).length;

  const overduePolicies = policies.filter((policy) => {
    if (!policy.next_review) return false;

    return new Date(policy.next_review).getTime() < now.getTime();
  }).length;

  const dueSoonPolicies = policies.filter((policy) => {
    if (!policy.next_review) return false;

    const reviewDate = new Date(policy.next_review);

    return reviewDate >= now && reviewDate <= reviewWindow;
  }).length;

  const reviewRequired = overduePolicies + dueSoonPolicies;

  const requirements = [
    totalPolicies > 0,
    publishedPolicies > 0,
    publicPolicies > 0,
    policiesWithReviewDates === totalPolicies && totalPolicies > 0,
    overduePolicies === 0,
    draftPolicies === 0,
  ];

  const completedRequirements = requirements.filter(Boolean).length;
  const totalRequirements = requirements.length;

  const governanceScore = Math.round(
    (completedRequirements / totalRequirements) * 100
  );

  return {
    totalPolicies,
    publishedPolicies,
    draftPolicies,
    publicPolicies,
    policiesWithReviewDates,
    overduePolicies,
    dueSoonPolicies,
    reviewRequired,
    governanceScore,
    completedRequirements,
    totalRequirements,
  };
}

function getReviewStatus(value) {
  if (!value) {
    return {
      label: "Not scheduled",
      type: "neutral",
    };
  }

  const today = new Date();
  const reviewDate = new Date(value);
  const difference = reviewDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(difference / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return {
      label: "Overdue",
      type: "danger",
    };
  }

  if (daysRemaining === 0) {
    return {
      label: "Due today",
      type: "warning",
    };
  }

  if (daysRemaining <= 30) {
    return {
      label: `Due in ${daysRemaining} days`,
      type: "warning",
    };
  }

  return {
    label: "Scheduled",
    type: "success",
  };
}

function normalizeStatus(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function formatDate(value) {
  if (!value) return "Not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}