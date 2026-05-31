export default function Footer() {
  return (
    <footer className="border-t border-cyan-500/10 bg-[#050816] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold tracking-wide text-white">
              AEMA Systems
            </h3>

            <p className="mt-3 max-w-sm text-sm leading-7 text-slate-400">
              AEMA Systems helps businesses grow through software development,
              AI automation, SEO optimization, e-commerce development, booking
              systems, and practical business technology solutions.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Services
            </h4>

            <div className="mt-4 grid gap-3 text-sm text-slate-400">
              <a href="#services" className="transition hover:text-cyan-400">
                Software Development
              </a>
              <a href="#services" className="transition hover:text-cyan-400">
                AI Automation
              </a>
              <a href="#services" className="transition hover:text-cyan-400">
                Business Systems
              </a>
              <a href="#services" className="transition hover:text-cyan-400">
                SEO Optimization
              </a>
              <a href="#services" className="transition hover:text-cyan-400">
                E-Commerce Development
              </a>
              <a href="#booking" className="transition hover:text-cyan-400">
                Booking Systems
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Connect
            </h4>

            <div className="mt-4 grid gap-3 text-sm text-slate-400">
              <a
                href="https://aemasystems.com"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-cyan-400"
              >
                aemasystems.com
              </a>

              <a
                href="mailto:austin@aemasystems.com"
                className="transition hover:text-cyan-400"
              >
                austin@aemasystems.com
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
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs leading-6 text-slate-500">
          © 2026 AEMA Systems · Software Development, AI Automation, SEO,
          E-Commerce & Business Systems · From ideas to intelligent systems.
        </div>
      </div>
    </footer>
  );
}