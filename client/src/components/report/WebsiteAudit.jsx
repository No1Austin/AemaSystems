import { ReportCard, SectionTitle } from "./ReportShell";
import { asArray, getItemText } from "./ReportUtils";

export default function WebsiteAudit({ items }) {
  const auditItems = asArray(items);
  if (!auditItems.length) return null;

  return (
    <ReportCard>
      <SectionTitle
        eyebrow="Website audit"
        title="Website Health Checklist"
        description="A practical checklist of technical, SEO, trust, and conversion signals."
      />

      <div className="grid gap-3 md:grid-cols-2">
        {auditItems.map((item, index) => {
          const text = getItemText(item);
          const lowerText = text.toLowerCase();
          const negative =
            lowerText.includes("missing") ||
            lowerText.includes("no ") ||
            lowerText.includes("weak") ||
            lowerText.includes("not clearly");
          const positive =
            lowerText.includes("detected") ||
            lowerText.includes("reviewed") ||
            lowerText.includes("response time");

          return (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-[#020617]/40 p-4"
            >
              <span
                className={
                  negative
                    ? "text-amber-300"
                    : positive
                    ? "text-emerald-300"
                    : "text-blue-300"
                }
              >
                {negative ? "⚠ " : positive ? "✓ " : "• "}
              </span>
              <span className="text-slate-300">{text}</span>
            </div>
          );
        })}
      </div>
    </ReportCard>
  );
}
