import { asArray, getItemText } from "./ReportUtils";

export default function ReportSection({ title, items, compact = false }) {
  const list = asArray(items);
  if (!list.length) return null;

  if (compact) {
    return (
      <section className="rounded-3xl border border-white/10 bg-[#020617]/30 p-5">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <ul className="space-y-3">
          {list.map((item, index) => (
            <li key={index} className="text-sm leading-6 text-slate-300">
              • {getItemText(item)}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
      <h3 className="text-2xl font-bold mb-5">{title}</h3>

      <ul className="space-y-3">
        {list.map((item, index) => (
          <li
            key={index}
            className="rounded-2xl border border-white/10 bg-[#020617]/40 p-4 text-slate-300"
          >
            {getItemText(item)}
          </li>
        ))}
      </ul>
    </section>
  );
}
