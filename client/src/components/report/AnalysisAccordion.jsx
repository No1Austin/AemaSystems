import { useState } from "react";
import { asArray, getItemText } from "./ReportUtils";

function Accordion({ title, items }) {
  const [open, setOpen] = useState(false);
  const list = asArray(items);

  if (!list.length) return null;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <span className="text-xl font-bold">{title}</span>
        <span className="text-slate-400">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <ul className="space-y-3 px-5 pb-5">
          {list.map((item, index) => (
            <li
              key={index}
              className="rounded-2xl border border-white/10 bg-[#020617]/40 p-4 text-slate-300"
            >
              {getItemText(item)}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function AnalysisAccordion({ report = {} }) {
  return (
    <section className="space-y-4">
      <Accordion title="Marketing Analysis" items={report.marketingAnalysis} />
      <Accordion title="Automation Analysis" items={report.automationAnalysis} />
      <Accordion
        title="Business Systems Analysis"
        items={report.businessSystemsAnalysis}
      />
      <Accordion title="Strengths" items={report.strengths} />
      <Accordion title="Weaknesses" items={report.weaknesses} />
      <Accordion title="Advisor Notes" items={report.advisorNotes} />
    </section>
  );
}
