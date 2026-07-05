import {
  AlertTriangle,
  Database,
  KeyRound,
  Lock,
  Mail,
  Server,
  ShieldCheck,
} from "lucide-react";
import TrustLayout from "../../components/trust/TrustLayout";
import PolicySection from "../../components/trust/PolicySection";

export default function Security() {
  return (
    <TrustLayout
      title="Security"
      description="This Security page explains AEMA Systems’ approach to protecting our website, software, business data, payment workflows, and digital services."
    >
      <PolicySection icon={ShieldCheck} title="1. Security Commitment">
        <p>
          AEMA Systems is committed to protecting the information entrusted to
          us through reasonable technical, administrative, and organizational
          safeguards appropriate to the size and nature of our services.
        </p>
      </PolicySection>

      <PolicySection
        icon={Lock}
        title="2. Current Security Measures"
        items={[
          "HTTPS encryption for website traffic.",
          "Secure hosting through trusted infrastructure providers.",
          "Authentication and access controls where accounts are used.",
          "Password protection for administrative systems.",
          "Payment processing through trusted third-party providers such as Stripe.",
          "Limited access to systems and data based on business need.",
        ]}
      />

      <PolicySection icon={Database} title="3. Data Protection">
        <p>
          We take reasonable steps to protect personal and business information
          from unauthorized access, loss, misuse, alteration, or disclosure.
        </p>

        <p>
          No method of electronic transmission or storage is completely secure,
          so we continue to improve our safeguards as AEMA Systems grows.
        </p>
      </PolicySection>

      <PolicySection icon={Server} title="4. Infrastructure">
        <p>
          AEMA Systems may use third-party infrastructure, database, deployment,
          payment, email, analytics, and AI service providers to operate our
          platforms.
        </p>

        <p>
          We aim to work with trusted providers and configure services in a way
          that supports reliability, security, and responsible operations.
        </p>
      </PolicySection>

      <PolicySection
        icon={KeyRound}
        title="5. Account and Access Security"
        items={[
          "Users are responsible for keeping their login details confidential.",
          "Users should use strong passwords and avoid sharing account access.",
          "AEMA Systems may suspend access where account misuse, fraud, or security risk is suspected.",
        ]}
      />

      <PolicySection icon={AlertTriangle} title="6. Security Incidents">
        <p>
          If AEMA Systems becomes aware of a security incident affecting user
          information, we will take reasonable steps to investigate, contain, and
          respond to the incident.
        </p>

        <p>
          Where required by applicable law, we may notify affected users,
          service providers, regulators, or other relevant parties.
        </p>
      </PolicySection>

      <PolicySection title="7. Vulnerability Reporting">
        <p>
          If you believe you have found a security vulnerability affecting AEMA
          Systems, please report it responsibly and avoid accessing, modifying,
          deleting, or sharing data that does not belong to you.
        </p>

        <p>
          Security reports can be sent to{" "}
          <a
            href="mailto:security@aemasystems.com"
            className="text-emerald-400 hover:text-emerald-300"
          >
            security@aemasystems.com
          </a>
          .
        </p>
      </PolicySection>

      <PolicySection title="8. What We Do Not Claim Yet">
        <p>
          AEMA Systems does not currently claim SOC 2, ISO 27001, PCI DSS
          certification, external penetration testing, or formal third-party
          security certification unless expressly stated in writing.
        </p>
      </PolicySection>

      <PolicySection title="9. Continuous Improvement">
        <p>
          Security is an ongoing process. As AEMA Systems grows, we intend to
          improve monitoring, logging, access management, backups, vulnerability
          management, incident response, and internal security practices.
        </p>
      </PolicySection>

      <PolicySection icon={Mail} title="10. Contact">
        <p>
          For security questions, contact{" "}
          <a
            href="mailto:security@aemasystems.com"
            className="text-emerald-400 hover:text-emerald-300"
          >
            security@aemasystems.com
          </a>
          .
        </p>
      </PolicySection>
    </TrustLayout>
  );
}