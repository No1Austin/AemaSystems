import { ReportCard, SectionTitle } from "./ReportShell";
import { asArray, getItemText } from "./ReportUtils";

export default function ExecutiveSummary({ report = {} }) {
  const items = asArray(
    report.enhancedExecutiveSummary || report.executiveSummary
  );

  if (!items.length) return null;

  return (
    <ReportCard>
      <SectionTitle eyebrow="Consultant view" title="Executive Summary" />
      <div className="space-y-5 text-slate-200 leading-8">
        {items.map((item, index) => (
          <p key={index}>{getItemText(item)}</p>
        ))}
      </div>
    </ReportCard>
  );
}
