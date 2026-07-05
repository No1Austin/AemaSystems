import {
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Mail,
  Scale,
  ShieldCheck,
} from "lucide-react";
import TrustLayout from "../../components/trust/TrustLayout";
import PolicySection from "../../components/trust/PolicySection";

export default function Compliance() {
  return (
    <TrustLayout
      title="Compliance"
      description="This Compliance page explains AEMA Systems’ commitment to operating responsibly, transparently, and in alignment with applicable business, privacy, security, and AI governance expectations."
    >
      <PolicySection icon={ClipboardCheck} title="1. Compliance Commitment">
        <p>
          AEMA Systems is committed to building trustworthy business technology
          through responsible operations, privacy awareness, security practices,
          transparent AI use, and continuous improvement.
        </p>
      </PolicySection>

      <PolicySection
        icon={CheckCircle2}
        title="2. Current Compliance Focus"
        items={[
          "Business registration and proper operating records.",
          "Privacy and data protection practices.",
          "Clear Terms of Service and user responsibilities.",
          "Responsible AI disclosures and limitations.",
          "Secure payment processing through trusted providers.",
          "Transparent refund, cookie, and accessibility policies.",
        ]}
      />

      <PolicySection icon={Scale} title="3. Legal and Business Standards">
        <p>
          AEMA Systems operates as a sole proprietorship in Ontario, Canada. We
          aim to follow applicable Canadian business, privacy, consumer, and
          commercial requirements as they apply to our services.
        </p>
      </PolicySection>

      <PolicySection icon={ShieldCheck} title="4. Privacy and Security">
        <p>
          Our compliance work includes maintaining privacy, security, and data
          protection practices that reflect the nature and size of our business.
        </p>

        <p>
          As AEMA Systems grows, we intend to strengthen our internal policies,
          security controls, data retention practices, incident response
          procedures, and vendor management processes.
        </p>
      </PolicySection>

      <PolicySection icon={FileText} title="5. AI Governance">
        <p>
          AEMA Systems uses AI to support business analysis, planning, and
          digital strategy. We aim to clearly communicate the purpose,
          limitations, and appropriate use of AI-generated outputs.
        </p>

        <p>
          AI-generated content should be reviewed by users and should not be
          treated as legal, tax, accounting, financial, investment, or other
          regulated professional advice.
        </p>
      </PolicySection>

      <PolicySection
        title="6. What AEMA Does Not Claim Yet"
        items={[
          "We do not currently claim SOC 2 certification.",
          "We do not currently claim ISO 27001 certification.",
          "We do not currently claim formal third-party security certification.",
          "We do not currently claim to be a regulated financial, investment, legal, tax, or accounting advisor.",
        ]}
      />

      <PolicySection title="7. Continuous Improvement">
        <p>
          Compliance is an ongoing process. AEMA Systems will continue improving
          its governance documents, internal procedures, technical safeguards,
          AI policies, customer protections, and business practices over time.
        </p>
      </PolicySection>

      <PolicySection icon={Mail} title="8. Contact">
        <p>
          For compliance questions, contact{" "}
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