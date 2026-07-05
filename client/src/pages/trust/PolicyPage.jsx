import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FileText, Mail } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import TrustLayout from "../../components/trust/TrustLayout";
import PolicySection from "../../components/trust/PolicySection";

export default function PolicyPage() {
  const { slug } = useParams();

  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPolicy() {
      const { data, error } = await supabase
        .from("governance_policies")
        .select("*")
        .eq("slug", slug)
        .eq("status", "Published")
        .eq("is_public", true)
        .single();

      if (error) {
        console.error(error);
        setPolicy(null);
      } else {
        setPolicy(data);
      }

      setLoading(false);
    }

    fetchPolicy();
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <p className="text-slate-400">Loading policy...</p>
      </main>
    );
  }

  if (!policy) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
        <div className="max-w-lg rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <FileText className="mx-auto h-10 w-10 text-cyan-400" />
          <h1 className="mt-5 text-2xl font-bold">Policy not found</h1>
          <p className="mt-3 text-sm text-slate-400">
            This policy may not exist yet or has not been published.
          </p>
        </div>
      </main>
    );
  }

  return (
    <TrustLayout
      title={policy.title}
      description={policy.description}
      version={policy.version}
      effectiveDate={formatDate(policy.effective_date)}
      lastReviewed={formatDate(policy.last_reviewed)}
      nextReview={formatDate(policy.next_review)}
    >
      <PolicySection icon={FileText} title={policy.title}>
        <div className="policy-content whitespace-pre-line text-sm leading-8 text-slate-400">
          {policy.content}
        </div>
      </PolicySection>

      <PolicySection icon={Mail} title="Contact">
        <p>
          For questions about this policy, contact{" "}
          <a
            href="mailto:trust@aemasystems.com"
            className="text-emerald-400 hover:text-emerald-300"
          >
            trust@aemasystems.com
          </a>
          .
        </p>
      </PolicySection>
    </TrustLayout>
  );
}

function formatDate(value) {
  if (!value) return "Not set";

  return new Date(value).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}