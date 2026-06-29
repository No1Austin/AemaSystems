import { Chip, MetricCard, ReportCard, SectionTitle } from "./ReportShell";
import {
  deriveHealthScores,
  getDisplayBusinessName,
  getPrimaryGoogleBusiness,
  getWebsiteScore,
  safeText,
} from "./ReportUtils";

export default function ExecutiveDashboard({ report = {}, snapshot = {} }) {
  const market = report.marketIntelligence || {};
  const stats = market.competitorStats || {};
  const googleBusiness = getPrimaryGoogleBusiness(market);
  const scores = deriveHealthScores(report);
  const businessName = getDisplayBusinessName(snapshot);

  return (
    <ReportCard className="border-blue-500/20 bg-gradient-to-br from-blue-500/15 to-cyan-500/5">
      <SectionTitle
        eyebrow="AEMA Business Intelligence"
        title={`${safeText(businessName, "Business")} Executive Dashboard`}
        description="A snapshot of business health, digital visibility, market trust, and immediate growth opportunity."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Growth Score"
          value={`${report.growthScore ?? "—"}/100`}
          note={report.growthPotential || "Growth readiness"}
          tone="blue"
        />
        <MetricCard
          label="Website Health"
          value={getWebsiteScore(report)}
          note="Technical and conversion audit"
          tone="amber"
        />
        <MetricCard
          label="Google Rating"
          value={googleBusiness?.rating || stats.averageRating || "N/A"}
          note={
            googleBusiness?.reviewCount
              ? `${googleBusiness.reviewCount} Google reviews`
              : "Market trust signal"
          }
          tone="emerald"
        />
        <MetricCard
          label="Competition"
          value={
            market.marketScore?.competitionLevel
              ? String(market.marketScore.competitionLevel).toUpperCase()
              : stats.totalCompetitorsFound
              ? `${stats.totalCompetitorsFound} found`
              : "N/A"
          }
          note="Visible local competitors"
          tone="violet"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Chip label="Industry" value={snapshot.industry || snapshot.businessType} />
        <Chip label="Location" value={snapshot.serviceLocation} />
        <Chip label="Goal" value={snapshot.goal} />
        <Chip label="Lead Source" value={snapshot.leadSource} />
        <Chip label="Sales" value={snapshot.salesProcess} />
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-[#020617]/50 p-5">
        <p className="text-sm text-slate-400">Primary Growth Bottleneck</p>
        <p className="mt-2 text-xl font-bold text-white">
          {scores.websiteScore < 60
            ? "Website conversion and trust signals"
            : scores.automationScore < 50
            ? "Manual follow-up and operational automation"
            : "Customer acquisition consistency"}
        </p>
      </div>
    </ReportCard>
  );
}
