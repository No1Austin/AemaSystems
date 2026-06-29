import { MetricCard, ReportCard, SectionTitle } from "./ReportShell";
import { getWebsiteScore } from "./ReportUtils";

export default function BusinessDashboard({ report = {} }) {
  const market = report.marketIntelligence || {};
  const stats = market.competitorStats || {};

  const cards = [
    {
      label: "Growth Score",
      value: `${report.growthScore || "—"}/100`,
      note: report.growthPotential || "Growth readiness",
      tone: "blue",
    },
    {
      label: "Website Health",
      value: getWebsiteScore(report),
      note: "Website audit score",
      tone: "amber",
    },
    {
      label: "Avg. Market Rating",
      value: stats.averageRating || "N/A",
      note: "Google competitors",
      tone: "emerald",
    },
    {
      label: "Website Presence",
      value:
        stats.websitePresencePercent !== undefined
          ? `${stats.websitePresencePercent}%`
          : "N/A",
      note: "Visible competitors",
      tone: "violet",
    },
  ];

  return (
    <ReportCard>
      <SectionTitle
        eyebrow="Business health"
        title="Business Intelligence Dashboard"
        description="The main health indicators AEMA uses to prioritize recommendations."
      />
      <div className="grid gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </div>
    </ReportCard>
  );
}
