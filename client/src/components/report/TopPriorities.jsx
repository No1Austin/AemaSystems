import { ReportCard, SectionTitle } from "./ReportShell";
import { asArray, getItemText } from "./ReportUtils";

export default function TopPriorities({ report = {} }) {
  const items = asArray(
    report.recommendedNextActions ||
      report.highestPriorityOpportunities ||
      report.prioritizedRecommendations
  ).slice(0, 3);

  if (!items.length) return null;

  return (
    <ReportCard>
      <SectionTitle
        eyebrow="What to do first"
        title="Top Strategic Priorities"
        description="The highest-impact actions AEMA would prioritize first."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item, index) => {
          const title = getItemText(item);
          const reason =
            typeof item === "object"
              ? item?.reason || item?.rationale || item?.description
              : null;

          return (
            <div
              key={index}
              className="rounded-3xl border border-white/10 bg-[#020617]/40 p-5"
            >
              <p className="mb-3 text-sm font-bold text-blue-300">
                Priority #{index + 1}
              </p>
              <h4 className="text-lg font-bold mb-3">{title}</h4>
              {reason && <p className="text-sm text-slate-400">{reason}</p>}
            </div>
          );
        })}
      </div>
    </ReportCard>
  );
}
