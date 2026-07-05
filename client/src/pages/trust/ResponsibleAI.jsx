import { Bot, Eye, Mail, Scale, ShieldCheck, UserCheck } from "lucide-react";
import TrustLayout from "../../components/trust/TrustLayout";
import PolicySection from "../../components/trust/PolicySection";

export default function ResponsibleAI() {
  return (
    <TrustLayout
      title="Responsible AI Policy"
      description="This Responsible AI Policy explains how AEMA Systems uses AI to support business decision-making while promoting transparency, human oversight, privacy, and responsible use."
    >
      <PolicySection icon={Bot} title="1. Purpose of AEMA AI">
        <p>
          AEMA AI is designed to help businesses understand their operations,
          identify opportunities, improve digital systems, and generate practical
          business recommendations.
        </p>

        <p>
          Our AI tools are intended to support human decision-making, not replace
          professional judgment.
        </p>
      </PolicySection>

      <PolicySection
        icon={Eye}
        title="2. Transparency"
        items={[
          "We aim to clearly identify when content or recommendations are AI-generated.",
          "We explain the purpose and limitations of AI-generated outputs.",
          "We avoid presenting AI recommendations as guaranteed outcomes.",
          "We encourage users to review AI outputs before making business decisions.",
        ]}
      />

      <PolicySection icon={Scale} title="3. No Professional Advice">
        <p>
          AEMA AI does not provide legal, accounting, tax, investment, financial,
          medical, or regulated professional advice.
        </p>

        <p>
          AI-generated reports and recommendations are provided for informational
          and business planning purposes only.
        </p>
      </PolicySection>

      <PolicySection
        icon={UserCheck}
        title="4. Human Oversight"
        items={[
          "Users are responsible for reviewing AI-generated recommendations.",
          "Business decisions should not be based solely on AI outputs.",
          "Users should consult qualified professionals where legal, tax, accounting, financial, or investment advice is required.",
          "AEMA Systems may review, improve, or adjust AI features over time to improve usefulness and reliability.",
        ]}
      />

      <PolicySection
        icon={ShieldCheck}
        title="5. Responsible Use"
        items={[
          "Users should provide accurate and lawful information.",
          "Users should not use AEMA AI to create harmful, deceptive, discriminatory, illegal, or misleading content.",
          "Users should not rely on AI outputs as guarantees of funding, revenue, profit, investment, or business success.",
          "Users should use AEMA AI as a planning and support tool, not as a substitute for professional advice.",
        ]}
      />

      <PolicySection title="6. AI Limitations">
        <p>
          AI systems may produce outputs that are incomplete, inaccurate,
          outdated, biased, or unsuitable for a specific business situation.
        </p>

        <p>
          AEMA Systems does not guarantee that AI-generated recommendations will
          produce specific results, revenue, investment, funding, or business
          outcomes.
        </p>
      </PolicySection>

      <PolicySection title="7. Data and Privacy">
        <p>
          Information submitted to AEMA AI may be used to generate business
          reports, recommendations, summaries, and related outputs.
        </p>

        <p>
          We handle personal information according to our Privacy Policy and
          continue working to improve data protection practices as our services
          grow.
        </p>
      </PolicySection>

      <PolicySection title="8. Continuous Improvement">
        <p>
          Responsible AI is an ongoing commitment. AEMA Systems may update its AI
          systems, policies, safeguards, prompts, workflows, and review processes
          to improve performance, transparency, safety, and business usefulness.
        </p>
      </PolicySection>

      <PolicySection title="9. Prohibited AI Uses">
        <p>
          Users must not use AEMA AI to support illegal activity, fraud,
          harassment, exploitation, discrimination, impersonation, malware,
          security attacks, or any other harmful or unlawful purpose.
        </p>
      </PolicySection>

      <PolicySection icon={Mail} title="10. Contact">
        <p>
          For questions about responsible AI at AEMA Systems, contact{" "}
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