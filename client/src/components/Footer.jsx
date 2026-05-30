export default function Footer() {
  return (
    <footer className="border-t border-cyan-500/10 bg-[#050816] px-6 py-8">
      <div className="mx-auto max-w-7xl">

        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

          {/* Logo + Brand */}
          <div>
            <h3 className="text-lg font-bold tracking-wide text-white">
              AEMA Systems
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Building intelligent systems for modern businesses.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">

            <a
              href="https://aemasystems.com"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-cyan-400"
            >
              Website
            </a>

            <a
              href="https://github.com/No1Austin"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-cyan-400"
            >
              GitHub
            </a>

            <a
              href="https://linkedin.com/in/YOUR-LINKEDIN"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-cyan-400"
            >
              LinkedIn
            </a>

            <a
              href="mailto:your@email.com"
              className="transition hover:text-cyan-400"
            >
              Email
            </a>

          </div>
        </div>

        {/* Bottom */}
        <div className="mt-6 border-t border-white/5 pt-6 text-center text-xs text-slate-500">
          © 2026 AEMA Systems · From ideas to intelligent systems.
        </div>

      </div>
    </footer>
  );
}