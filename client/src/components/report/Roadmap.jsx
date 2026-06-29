import { ReportCard, SectionTitle } from "./ReportShell";
import { asArray, getItemText } from "./ReportUtils";

export default function Roadmap({ items }) {
  const roadmap = asArray(items);
  if (!roadmap.length) return null;

  return (
    <ReportCard>
      <SectionTitle
        eyebrow="Execution"
        title="30-Day Execution Roadmap"
        description="A practical implementation timeline for the next month."
      />

      <div className="space-y-4">
        {roadmap.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold">
              {index + 1}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex-1">
              <p className="text-slate-200">{getItemText(item)}</p>
            </div>
          </div>
        ))}
      </div>
    </ReportCard>
  );
}
