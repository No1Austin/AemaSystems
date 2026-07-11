import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Clock3,
  Upload,
  FileText,
  Globe2,
  Link2,
  LockKeyhole,
  Palette,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const capabilities = [
  {
    icon: ShieldCheck,
    eyebrow: "Assess",
    title: "Understand your compliance position",
    description:
      "Complete a guided assessment covering privacy, security, vendors, AI, payments, employees, and governance.",
  },
  {
    icon: Bot,
    eyebrow: "Interpret",
    title: "Receive business-specific guidance",
    description:
      "AEMA evaluates your industry, jurisdiction, technology use, and operational risks to produce tailored recommendations.",
  },
  {
    icon: FileText,
    eyebrow: "Generate",
    title: "Create your compliance package",
    description:
      "Generate practical policies, governance documents, readiness summaries, and next-step recommendations for your business.",
  },
  {
    icon: Globe2,
    eyebrow: "Publish",
    title: "Present compliance professionally",
    description:
      "Launch a polished compliance page, host it with AEMA, or place the supplied link directly on your own website.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Complete the free assessment",
    description:
      "Answer guided questions at your own pace. Your progress remains saved in your browser until you finish.",
  },
  {
    number: "02",
    title: "Review your readiness result",
    description:
      "See your score, maturity level, key gaps, business risks, missing documents, and relevant framework readiness.",
  },
  {
    number: "03",
    title: "Unlock everything for $29.99 CAD",
    description:
      "Pay once to generate your tailored compliance package and publishing options. There is no monthly subscription.",
  },
  {
    number: "04",
    title: "Customize and publish",
    description:
      "Choose your colours, add your logo, adjust the presentation, and decide where your compliance page should live.",
  },
];

const packageItems = [
  "Personalized compliance and governance documents",
  "Executive readiness and risk summary",
  "Framework readiness results",
  "Recommended next actions",
  "Downloadable compliance package",
  "Customizable public compliance page",
  "AEMA-hosted publishing option",
  "Shareable link for your existing website",
];

const publishingOptions = [
  {
    icon: Palette,
    title: "Customize your compliance page",
    description:
      "Choose your brand colours, add your company logo, and tailor the page presentation to match your business.",
    badge: "Your brand",
  },
  {
    icon: Globe2,
    title: "Host it securely with AEMA",
    description:
      "Publish your compliance page on AEMA infrastructure without managing an additional website or hosting setup.",
    badge: "AEMA hosted",
  },
  {
    icon: Link2,
    title: "Add the link to your website",
    description:
      "Copy your public compliance link and place it in your website footer, Trust Center, privacy page, or navigation.",
    badge: "Simple integration",
  },
];

const trustPoints = [
  "Built in Canada",
  "Free assessment",
  "Saved progress",
  "Account after payment",
  "Optional hosting",
];

const dashboardMetrics = [
  {
    label: "Compliance score",
    value: "84%",
    helper: "Improved 8% this month",
    icon: BarChart3,
  },
  {
    label: "Documents",
    value: "14",
    helper: "12 approved · 2 draft",
    icon: FileText,
  },
  {
    label: "Next review",
    value: "18 days",
    helper: "Privacy Policy",
    icon: Clock3,
  },
  {
    label: "Hosting",
    value: "Active",
    helper: "Public Trust Center live",
    icon: Globe2,
  },
];

const oneTimePackageItems = [
  "AI-guided compliance assessment",
  "Executive readiness and risk summary",
  "Framework readiness results",
  "Personalized compliance documents",
  "Download and copy documents",
  "Lifetime access to generated files",
  "Customer account and document dashboard",
];

const proItems = [
  "Hosted public Trust Center",
  "Custom company logo",
  "Custom brand colours",
  "Public compliance URL",
  "Policy publishing controls",
  "Version history",
  "Review reminders",
  "Ongoing governance dashboard",
  "Risk and vendor registers",
];

const documentItems = [
  "Privacy Policy",
  "Cookie Policy",
  "Terms of Service",
  "Information Security Policy",
  "Incident Response Plan",
  "Vendor Register",
  "Risk Register",
  "Responsible AI Policy",
  "Accessibility Statement",
  "Business Continuity Plan",
  "Disaster Recovery Plan",
  "Data Retention Policy",
];

export default function ComplianceOS() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] text-white">
      <Navbar />

      <section className="relative px-5 pb-24 pt-28 sm:px-6 lg:pt-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(circle_at_18%_15%,rgba(16,185,129,0.20),transparent_31%),radial-gradient(circle_at_83%_17%,rgba(34,211,238,0.16),transparent_30%)]" />
          <div className="absolute left-1/2 top-0 h-[680px] w-px bg-gradient-to-b from-cyan-300/20 via-transparent to-transparent" />
          <div className="absolute left-1/2 top-[560px] h-96 w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/[0.05] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <HeroSection />

          <section className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((item) => (
              <div
                key={item}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-slate-300 backdrop-blur"
              >
                <Check className="h-4 w-4 text-emerald-300" />
                {item}
              </div>
            ))}
          </section>

          <DashboardPreview />

          <section className="mt-24">
            <SectionHeading
              eyebrow="A complete compliance workflow"
              title="Everything you need to assess, prepare, and present your compliance position."
              description="Compliance OS transforms a complicated governance process into a guided, professional experience built for growing businesses."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {capabilities.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.055]"
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent opacity-0 transition group-hover:opacity-100" />

                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                      <Icon className="h-6 w-6 text-emerald-300" />
                    </span>

                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
                      {item.eyebrow}
                    </p>

                    <h2 className="mt-3 text-xl font-bold leading-snug text-white">
                      {item.title}
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          <section
            id="how-it-works"
            className="mt-24 grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center"
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                <Sparkles className="h-4 w-4" />
                How it works
              </div>

              <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
                From business answers to a credible compliance presence.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                Understand your current position, identify what is missing,
                generate the right documents, and present your commitments with
                confidence.
              </p>

              <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                    <LockKeyhole className="h-5 w-5 text-emerald-300" />
                  </span>

                  <div>
                    <h3 className="font-bold text-white">
                      Your progress stays available
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-slate-400">
                      Your assessment draft is saved in your browser, so you can
                      refresh, close the tab, or return later without starting
                      again.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-[21px] top-10 hidden h-[calc(100%-80px)] w-px bg-gradient-to-b from-emerald-400/50 via-cyan-400/30 to-transparent sm:block" />

              <div className="grid gap-4">
                {processSteps.map((step) => (
                  <article
                    key={step.number}
                    className="relative flex gap-4 rounded-[1.75rem] border border-white/10 bg-black/20 p-5 transition hover:border-white/20 hover:bg-white/[0.03] sm:p-6"
                  >
                    <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-[#07111f] text-sm font-black text-emerald-300">
                      {step.number}
                    </span>

                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-slate-400">
                        {step.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <DocumentsSection />

          <section className="mt-24">
            <SectionHeading
              eyebrow="Hosted Trust Center"
              title="Publish a compliance page that looks like it belongs to your business."
              description="Customize the page, host it with AEMA, and share the link anywhere your customers expect to find privacy and security information."
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {publishingOptions.map((option) => {
                const Icon = option.icon;

                return (
                  <article
                    key={option.title}
                    className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-7"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                        <Icon className="h-6 w-6 text-cyan-300" />
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-slate-400">
                        {option.badge}
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-bold text-white">
                      {option.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {option.description}
                    </p>
                  </article>
                );
              })}
            </div>

            <TrustCenterPreview />
          </section>

          <PricingSection />

          <section className="mt-24 rounded-[2rem] border border-white/10 bg-white/[0.035] px-6 py-12 text-center sm:px-10 sm:py-16">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <ShieldCheck className="h-7 w-7 text-cyan-300" />
            </span>

            <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
              Build a clearer, more professional compliance presence today.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Start with the free assessment, review your readiness result, and
              unlock your complete package only when you are ready.
            </p>

            <Link
              to="/compliance-os/assessment"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-7 py-4 text-sm font-black text-slate-950 transition hover:bg-cyan-300"
            >
              Get My Compliance Score
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function HeroSection() {
  return (
    <div className="mx-auto max-w-5xl text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
        <ShieldCheck className="h-4 w-4" />
        AEMA Compliance OS
      </div>

      <h1 className="mt-8 text-5xl font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-[5.4rem]">
        Build trust.
        <span className="block bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-200 bg-clip-text text-transparent">
          Demonstrate compliance.
        </span>
        Win more business.
      </h1>

      <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
        Assess your readiness, generate tailored governance documents, create
        your account, and manage a branded public Trust Center from one
        intelligent platform.
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          to="/compliance-os/assessment"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-8 py-4 text-sm font-black text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-300 sm:w-auto"
        >
          Start Free Assessment
          <ArrowRight className="h-4 w-4" />
        </Link>

        <a
          href="#pricing"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-8 py-4 text-sm font-bold text-white backdrop-blur transition hover:border-white/20 hover:bg-white/[0.08] sm:w-auto"
        >
          View Pricing
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>

      <p className="mt-5 text-sm font-medium text-slate-400">
        Free assessment. Compliance package{" "}
        <span className="text-emerald-300">$29.99 CAD</span>. Optional hosting{" "}
        <span className="text-cyan-300">$19.99 CAD/month</span>.
      </p>
    </div>
  );
}

function DashboardPreview() {
  return (
    <section className="mt-20 rounded-[2.25rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/30 sm:p-7 lg:p-8">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
            Governance Dashboard
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">
            A complete view of your compliance workspace.
          </h2>
        </div>

        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold text-emerald-300">
          Live workspace preview
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-black/20 p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {item.label}
                </p>
                <Icon className="h-4 w-4 text-emerald-300" />
              </div>

              <p className="mt-4 text-3xl font-black text-white">
                {item.value}
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                {item.helper}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white">
              Compliance progress
            </h3>
            <span className="text-sm font-bold text-emerald-300">
              84%
            </span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MiniStatus label="Privacy" value="Ready" />
            <MiniStatus label="Security" value="In review" />
            <MiniStatus label="AI governance" value="Ready" />
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
            Next recommendation
          </p>
          <h3 className="mt-3 text-lg font-bold text-white">
            Complete your Vendor Register
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            Add your payment, email, hosting, CRM, and AI providers to improve
            vendor-governance readiness.
          </p>
        </div>
      </div>
    </section>
  );
}

function MiniStatus({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function DocumentsSection() {
  return (
    <section className="mt-24 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
          <FileText className="h-4 w-4" />
          Governance Documents
        </div>

        <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
          More than a report. A complete governance document library.
        </h2>

        <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
          Your assessment identifies the policies, plans, and registers your
          business needs, then prepares them for review and approval.
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <div className="flex items-start gap-4">
            <Upload className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />

            <div>
              <h3 className="font-bold text-white">
                Download, copy, edit, or publish
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                Keep your documents private, export them for your own website,
                or publish approved versions through AEMA.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {documentItems.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span className="text-sm font-medium text-slate-300">
              {item}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrustCenterPreview() {
  return (
    <div className="mt-10 overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#07111f] shadow-2xl shadow-black/30">
      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
          <span className="ml-3 rounded-full border border-white/10 bg-black/20 px-4 py-1.5">
            aemasystems.com/compliance/acme-business
          </span>
        </div>
      </div>

      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
            <span className="text-lg font-black text-emerald-300">
              AC
            </span>
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
            Acme Business
          </p>

          <h3 className="mt-3 text-3xl font-black text-white">
            Trust Center
          </h3>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            Learn how Acme Business approaches privacy, security, responsible
            AI, accessibility, and governance.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {["Privacy", "Security", "Responsible AI", "Accessibility"].map(
            (item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <p className="text-sm font-bold text-white">
                  {item}
                </p>
                <p className="mt-2 text-xs leading-6 text-slate-500">
                  View the latest approved policy and review date.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="mt-24">
      <SectionHeading
        eyebrow="Simple pricing"
        title="Start once. Upgrade only when ongoing hosting makes sense."
        description="The one-time package gives you your documents and dashboard access. The optional monthly plan adds hosted publishing and continuous governance features."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <PricingCard
          badge="One-time package"
          title="Compliance Package"
          price="$29.99"
          cadence="CAD one-time"
          description="Complete the assessment, unlock your tailored documents, and create your account."
          items={oneTimePackageItems}
          buttonLabel="Start Free Assessment"
          buttonHref="/compliance-os/assessment"
          featured
        />

        <PricingCard
          badge="Optional subscription"
          title="Compliance OS Pro"
          price="$19.99"
          cadence="CAD per month"
          description="Host your branded Trust Center and continue managing governance from one dashboard."
          items={proItems}
          buttonLabel="Available after account creation"
          disabled
        />
      </div>
    </section>
  );
}

function PricingCard({
  badge,
  title,
  price,
  cadence,
  description,
  items,
  buttonLabel,
  buttonHref,
  featured = false,
  disabled = false,
}) {
  return (
    <article
      className={`rounded-[2rem] border p-7 sm:p-8 ${
        featured
          ? "border-emerald-400/25 bg-emerald-400/[0.055]"
          : "border-white/10 bg-white/[0.035]"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className={`rounded-full border px-3 py-1 text-xs font-bold ${
            featured
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
              : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
          }`}
        >
          {badge}
        </span>

        {featured && (
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-slate-400">
            Start here
          </span>
        )}
      </div>

      <h3 className="mt-6 text-2xl font-black text-white">
        {title}
      </h3>

      <div className="mt-4 flex items-end gap-2">
        <span className="text-5xl font-black tracking-tight text-white">
          {price}
        </span>
        <span className="pb-1 text-sm font-semibold text-slate-400">
          {cadence}
        </span>
      </div>

      <p className="mt-5 text-sm leading-7 text-slate-400">
        {description}
      </p>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 text-sm leading-7 text-slate-300"
          >
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      {disabled ? (
        <button
          type="button"
          disabled
          className="mt-7 inline-flex w-full cursor-not-allowed items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-bold text-slate-500"
        >
          {buttonLabel}
        </button>
      ) : (
        <Link
          to={buttonHref}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
        >
          {buttonLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </article>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">
        {eyebrow}
      </p>

      <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
        {description}
      </p>
    </div>
  );
}
