import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-cyan-500/10 bg-[#050816] px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold tracking-wide text-white">
              AEMA Systems
            </h3>

            <p className="mt-3 max-w-sm text-sm leading-7 text-slate-400">
              From ideas to intelligent systems. We help businesses grow through
              software, AI automation, digital systems, and practical business
              technology solutions.
            </p>

            <div className="mt-6 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Canadian Business
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Privacy Focused
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Responsible AI
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Products
            </h4>

            <div className="mt-4 grid gap-3 text-sm text-slate-400">
              <a href="/ai" className="transition hover:text-cyan-400">
                AEMA AI
              </a>

              <a href="/taskflow" className="transition hover:text-cyan-400">
                TaskFlow
              </a>

              <a href="#booking" className="transition hover:text-cyan-400">
                Business Consulting
              </a>
            </div>
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
                E-Commerce
              </a>
            </div>
          </div>

          {/* Trust */}
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />

              <h4 className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
                Trust
              </h4>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-slate-400">
              <a
                href="/trust"
                className="font-medium text-emerald-400 transition hover:text-emerald-300"
              >
                Trust Center
              </a>

              <a
                href="/trust/privacy"
                className="transition hover:text-emerald-400"
              >
                Privacy Policy
              </a>

              <a
                href="/trust/terms"
                className="transition hover:text-emerald-400"
              >
                Terms of Service
              </a>

              <a
                href="/trust/security"
                className="transition hover:text-emerald-400"
              >
                Security
              </a>

              <a
                href="/trust/responsible-ai"
                className="transition hover:text-emerald-400"
              >
                Responsible AI
              </a>

              <a
                href="/trust/compliance"
                className="transition hover:text-emerald-400"
              >
                Compliance
              </a>
            </div>
          </div>

          {/* Connect */}
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
                href="https://t.me/aemasystems"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-cyan-400"
              >
                Telegram Community
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-slate-500">
              © 2026 AEMA Systems. Building trusted AI-powered business software.
            </p>

            <div className="flex flex-wrap gap-5 text-xs">
              <a
                href="/trust/privacy"
                className="text-slate-500 transition hover:text-cyan-400"
              >
                Privacy
              </a>

              <a
                href="/trust/terms"
                className="text-slate-500 transition hover:text-cyan-400"
              >
                Terms
              </a>

              <a
                href="/trust/security"
                className="text-slate-500 transition hover:text-cyan-400"
              >
                Security
              </a>

              <a
                href="/trust"
                className="font-semibold text-emerald-400 transition hover:text-emerald-300"
              >
                Trust Center
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}