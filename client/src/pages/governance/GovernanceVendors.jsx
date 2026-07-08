import {
  Building2,
  Cloud,
  CreditCard,
  Database,
  FolderGit2,
  Mail,
  Server,
  ShieldCheck,
} from "lucide-react";
import ComplianceLayout from "../../modules/compliance/layouts/ComplianceLayout.jsx";

const vendors = [
  {
    name: "Stripe",
    purpose: "Payment processing and billing",
    category: "Payments",
    criticality: "High",
    status: "Active",
    review: "Jan 5, 2027",
    icon: CreditCard,
  },
  {
    name: "Supabase",
    purpose: "Database, authentication, and backend services",
    category: "Infrastructure",
    criticality: "High",
    status: "Active",
    review: "Jan 5, 2027",
    icon: Database,
  },
  {
    name: "Render",
    purpose: "Backend hosting and API deployment",
    category: "Hosting",
    criticality: "High",
    status: "Active",
    review: "Jan 5, 2027",
    icon: Server,
  },
  {
    name: "Vercel",
    purpose: "Frontend hosting and deployment",
    category: "Hosting",
    criticality: "Medium",
    status: "Active",
    review: "Jan 5, 2027",
    icon: Cloud,
  },
  {
    name: "Resend",
    purpose: "Transactional email delivery",
    category: "Email",
    criticality: "Medium",
    status: "Active",
    review: "Jan 5, 2027",
    icon: Mail,
  },
  {
    name: "Cloudflare",
    purpose: "DNS, domain security, and email routing",
    category: "Security",
    criticality: "Medium",
    status: "Planned",
    review: "Jan 5, 2027",
    icon: ShieldCheck,
  },
  {
    name: "GitHub",
    purpose: "Source code hosting and version control",
    category: "Development",
    criticality: "High",
    status: "Active",
    review: "Jan 5, 2027",
    icon: FolderGit2,
  },
];

function getStatusClasses(status) {
  if (status === "Active") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }

  if (status === "Planned") {
    return "border-amber-400/20 bg-amber-400/10 text-amber-300";
  }

  return "border-white/10 bg-black/20 text-slate-400";
}

function getCriticalityClasses(criticality) {
  if (criticality === "High") {
    return "border-rose-400/20 bg-rose-400/10 text-rose-300";
  }

  if (criticality === "Medium") {
    return "border-amber-400/20 bg-amber-400/10 text-amber-300";
  }

  return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
}

export default function GovernanceVendors() {
  return (
    <ComplianceLayout
      badge="Vendor Management"
      title="Key Vendors"
      description="Track third-party services that support AEMA Systems infrastructure, payments, hosting, email delivery, source code, security, and business operations."
      icon={Building2}
      accent="cyan"
    >
      <section className="grid gap-4">
        {vendors.map((vendor) => {
          const Icon = vendor.icon;

          return (
            <article
              key={vendor.name}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/30 hover:bg-white/[0.05]"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10">
                    <Icon className="h-6 w-6 text-emerald-400" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {vendor.name}
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {vendor.purpose}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-300">
                    {vendor.category}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 ${getCriticalityClasses(
                      vendor.criticality
                    )}`}
                  >
                    Criticality: {vendor.criticality}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 ${getStatusClasses(
                      vendor.status
                    )}`}
                  >
                    {vendor.status}
                  </span>

                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-slate-400">
                    Review: {vendor.review}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">
            Vendor Review Principle
          </h2>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-400">
          AEMA Systems should review key vendors periodically to confirm that
          they remain suitable for security, reliability, privacy, payment,
          infrastructure, and business continuity needs.
        </p>
      </section>
    </ComplianceLayout>
  );
}