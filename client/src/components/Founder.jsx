export default function Founder() {
  return (
    <section id="founder" className="bg-[#020617] px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Founder
          </p>

          <h2 className="mt-3 text-3xl font-black md:text-5xl">
            Austin Amadi
          </h2>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            AEMA Systems was founded by Austin Amadi, a software engineer,
            business systems builder, and technology strategist focused on
            building practical digital solutions that help organizations improve
            operations, automate workflows, and grow through technology.
          </p>

          <a
            href="https://austin-amadi.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
          >
            Visit Founder Portfolio →
          </a>
        </div>
      </div>
    </section>
  );
}