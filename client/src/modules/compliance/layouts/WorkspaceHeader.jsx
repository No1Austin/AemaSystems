export default function WorkspaceHeader({
  badge = "Compliance OS",
  title,
  description,
  action,
}) {
  return (
    <header className="mb-6 rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.20)] sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
            {badge}
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
            {title}
          </h1>

          {description && (
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
              {description}
            </p>
          )}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}
