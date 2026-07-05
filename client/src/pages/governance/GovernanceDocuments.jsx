import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bot, Database, FileText, Lock, Scale, ShieldCheck } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import GovernanceLayout from "../../components/governance/GovernanceLayout";

const iconMap = {
  Security: Lock,
  Privacy: Database,
  Legal: Scale,
  "AI Governance": Bot,
  Compliance: ShieldCheck,
  Trust: FileText,
};

export default function GovernanceDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocuments() {
      const { data, error } = await supabase
        .from("governance_policies")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
        setDocuments([]);
      } else {
        setDocuments(data || []);
      }

      setLoading(false);
    }

    fetchDocuments();
  }, []);

  return (
    <GovernanceLayout
      badge="Governance Documents"
      title="Policies"
      description="Manage AEMA Systems Trust Center policies, versions, review cycles, ownership, and publication status."
      icon={FileText}
      accent="cyan"
    >
      {loading ? (
        <p className="text-sm text-slate-400">Loading policies...</p>
      ) : (
        <section className="grid gap-4">
          {documents.map((doc) => {
            const Icon = iconMap[doc.category] || FileText;

            return (
              <Link
                key={doc.id}
                to={`/governance/documents/${doc.slug}`}
                className="block rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/40 hover:bg-white/[0.05]"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10">
                      <Icon className="h-6 w-6 text-emerald-400" />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-white">
                        {doc.title}
                      </h2>

                      <p className="mt-1 text-sm text-slate-400">
                        {doc.category} · Version {doc.version} · Owner:{" "}
                        {doc.owner}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                      {doc.status}
                    </span>

                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-400">
                      Review: {doc.next_review || "Not set"}
                    </span>

                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold text-cyan-300">
                      Open Editor
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </GovernanceLayout>
  );
}