import {
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Mail,
  Scale,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import TrustLayout from "../../components/trust/TrustLayout";
import PolicySection from "../../components/trust/PolicySection";

export default function Compliance() {
  return (
    <TrustLayout
      title="Compliance"
      description="AEMA Systems is committed to operating responsibly, transparently, and continuously improving our governance, privacy, security, and AI practices."
    >
      <PolicySection icon={ClipboardCheck} title="1. Compliance Commitment">
        <p>
          At AEMA Systems, trust is foundational to how we design, develop, and
          deliver technology. We are committed to protecting customer
          information, operating transparently, and continuously improving our
          governance, security, privacy, and responsible AI practices.
        </p>
      </PolicySection>

      <PolicySection
        icon={CheckCircle2}
        title="2. Current Governance Program"
        items={[
          "Business governance and proper operating records.",
          "Privacy and data protection practices.",
          "Information security and access control awareness.",
          "Responsible AI disclosures and limitations.",
          "Risk management and continuous improvement.",
          "Vendor oversight and secure third-party service usage.",
          "Transparent policies for users, customers, and partners.",
        ]}
      />

      <PolicySection icon={Scale} title="3. Legal and Business Standards">
        <p>
          AEMA Systems operates as a sole proprietorship in Ontario, Canada. We
          strive to comply with applicable Canadian laws and regulations relevant
          to our business activities, including privacy, consumer protection,
          electronic commerce, and contractual obligations.
        </p>

        <p>
          As our business evolves, we review our governance program to align with
          changing legal, operational, and customer trust expectations.
        </p>
      </PolicySection>

      <PolicySection icon={ShieldCheck} title="4. Privacy and Security">
        <p>
          We maintain administrative, technical, and organizational measures
          appropriate to the size and nature of our business.
        </p>

        <p>
          These measures may include governance policies, access management,
          vendor oversight, secure software development practices, secure payment
          processing, and ongoing reviews of our security and privacy program.
        </p>
      </PolicySection>

      <PolicySection icon={FileText} title="5. Responsible AI Governance">
        <p>
          AEMA Systems uses AI to support business analysis, planning,
          recommendations, and digital strategy. We aim to clearly communicate
          the purpose, limitations, and appropriate use of AI-generated outputs.
        </p>

        <p>
          AI-generated content should be reviewed by users and should not be
          treated as legal, tax, accounting, financial, investment, or other
          regulated professional advice.
        </p>
      </PolicySection>

      <PolicySection
        title="6. Current Certification Status"
        items={[
          "AEMA Systems does not currently claim SOC 2 certification.",
          "AEMA Systems does not currently claim ISO/IEC 27001 certification.",
          "AEMA Systems does not currently claim formal third-party security certification.",
          "AEMA Systems is not a regulated financial, investment, legal, tax, or accounting advisor.",
        ]}
      >
        <p>
          While we are not currently certified under frameworks such as SOC 2 or
          ISO/IEC 27001, our Governance OS is designed to help us organize,
          monitor, and improve governance practices aligned with recognized
          industry frameworks.
        </p>
      </PolicySection>

      <PolicySection
        icon={TrendingUp}
        title="7. Governance Roadmap"
        items={[
          "Strengthening internal governance processes.",
          "Expanding security monitoring and access review practices.",
          "Enhancing vendor management and risk tracking.",
          "Improving incident response and business continuity planning.",
          "Increasing audit readiness over time.",
          "Advancing alignment with recognized compliance frameworks.",
        ]}
      />

      <PolicySection title="8. Continuous Improvement">
        <p>
          Compliance is an ongoing process. AEMA Systems will continue improving
          its governance documents, internal procedures, technical safeguards,
          AI policies, customer protections, and business practices over time.
        </p>

        <p>
          Trust is built through transparency, accountability, responsible
          innovation, and continuous improvement. AEMA Systems is committed to
          strengthening its governance program as we grow.
        </p>
      </PolicySection>

      <PolicySection icon={Mail} title="9. Contact">
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