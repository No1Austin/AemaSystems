import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default function PolicySection({
  icon: Icon,
  title,
  children,
  items = [],
  note,
  warning,
}) {
  return (
    <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-4 flex items-center gap-3">
        {Icon && <Icon className="h-5 w-5 text-emerald-400" />}
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>

      <div className="space-y-4 text-sm leading-7 text-slate-400">
        {children}

        {items.length > 0 && (
          <ul className="mt-4 grid gap-3">
            {items.map((item) => (
              <li key={item} className="flex gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        {note && (
          <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-cyan-100">
            {note}
          </div>
        )}

        {warning && (
          <div className="mt-5 flex gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-amber-100">
            <AlertTriangle className="mt-1 h-4 w-4 shrink-0" />
            <p>{warning}</p>
          </div>
        )}
      </div>
    </section>
  );
}