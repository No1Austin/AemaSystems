import { ProgressBar, ReportCard, SectionTitle } from "./ReportShell";
import { deriveHealthScores } from "./ReportUtils";

export default function CompetitivePosition({ report = {} }) {
  const scores = deriveHealthScores(report);

  const items = [
    { label: "Business Health", score: scores.growthScore },
    { label: "Website SEO", score: scores.websiteScore },
    { label: "Customer Trust", score: scores.trustScore },
    { label: "Marketing System", score: scores.marketingScore },
    { label: "Sales Conversion", score: scores.salesScore },
    { label: "Automation", score: scores.automationScore },
    { label: "Operations", score: scores.operationsScore },
  ];

  return (
    <ReportCard>
      <SectionTitle
        eyebrow="Competitive position"
        title="Where the Business Stands"
        description="Visual comparison of core areas that affect customer acquisition, conversion, and operational capacity."
      />

      <div className="space-y-5">
        {items.map((item) => (
          <ProgressBar key={item.label} label={item.label} value={item.score} />
        ))}
      </div>
    </ReportCard>
  );
}
