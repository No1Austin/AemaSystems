import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  FileText,
  Bot,
  RefreshCcw,
  Mail,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const trustBadges = [
  "Canadian Business",
  "Privacy Focused",
  "Secure Payments",
  "Responsible AI",
  "Business First",
];

const trustCards = [
  {
    title: "Legal",
    description:
      "Review AEMA Systems policies, terms, privacy commitments, and legal standards.",
    icon: FileText,
    href: "/trust/privacy",
    links: [
      { label: "Privacy Policy", href: "/trust/privacy" },
      { label: "Terms of Service", href: "/trust/terms" },
    ],
  },
  {
    title: "Security",
    description:
      "Learn how AEMA Systems protects business information, payments, accounts, and platform access.",
    icon: Lock,
    href: "/trust/security",
    links: [{ label: "Security Overview", href: "/trust/security" }],
  },
  {
    title: "Responsible AI",
    description:
      "Understand how AEMA AI supports business decision-making with transparency and human oversight.",
    icon: Bot,
    href: "/trust/responsible-ai",
    links: [
      { label: "Responsible AI Policy", href: "/trust/responsible-ai" },
    ],
  },
];

const commitments = [
  "Transparency",
  "Privacy by design",
  "Secure digital systems",
  "Responsible AI development",
  "Customer trust",
  "Continuous improvement",
];

export default function TrustCenter() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="relative overflow-hidden px-6 py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(59,130,246,0.14),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10">
              <ShieldCheck className="h-8 w-8 text-emerald-400" />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">
              AEMA Trust Center
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
              Building trusted AI-powered business systems.
            </h1>

            <p className="mt-6 text-base leading-8 text-slate-300 md:text-lg">
              At AEMA Systems, trust is part of everything we build. We are
              committed to protecting data, operating transparently, and using
              AI responsibly to support business growth.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2">
            {trustCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 transition hover:border-emerald-400/40 hover:bg-white/[0.05]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10">
                      <Icon className="h-6 w-6 text-emerald-400" />
                    </div>

                    <Link
                      to={card.href}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
                    >
                      View
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <h2 className="mt-5 text-2xl font-bold text-white">
                    {card.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {card.description}
                  </p>

                  <div className="mt-6 grid gap-3">
                    {card.links.map((link) => (
                      <Link
                        key={link.label}
                        to={link.href}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-400"
                      >
                        {link.label}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.04] p-8 md:p-10">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
                Our Commitments
              </p>

              <h2 className="mt-4 text-3xl font-black md:text-4xl">
                Trust principles that guide AEMA Systems.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                These principles guide how we design products, handle customer
                information, develop AI features, and support businesses using
                our platforms.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {commitments.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300"
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3">
              <RefreshCcw className="h-5 w-5 text-cyan-400" />
              <h3 className="text-lg font-bold">Document Control</h3>
            </div>

            <div className="mt-5 grid gap-3 text-sm text-slate-400">
              <p>Trust Center Version: 1.0</p>
              <p>Published: July 2026</p>
              <p>Last Reviewed: July 2026</p>
              <p>Next Review: January 2027</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-bold">Need help?</h3>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              For privacy, security, compliance, or responsible AI questions,
              contact AEMA Systems directly.
            </p>

            <div className="mt-5 grid gap-3 text-sm">
              <a
                href="mailto:trust@aemasystems.com"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                trust@aemasystems.com
              </a>

              <a
                href="mailto:security@aemasystems.com"
                className="text-cyan-400 transition hover:text-cyan-300"
              >
                security@aemasystems.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}