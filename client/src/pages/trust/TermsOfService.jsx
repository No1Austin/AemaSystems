import {
  Bot,
  CreditCard,
  FileText,
  Gavel,
  Lock,
  Scale,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import TrustLayout from "../../components/trust/TrustLayout";
import PolicySection from "../../components/trust/PolicySection";

export default function TermsOfService() {
  return (
    <TrustLayout
      title="Terms of Service"
      description="These Terms of Service govern your use of AEMA Systems, including our website, software services, AI tools, business reports, consulting services, and digital products."
    >
      <PolicySection icon={FileText} title="1. Acceptance of Terms">
        <p>
          By accessing or using AEMA Systems, you agree to be bound by these
          Terms of Service. If you do not agree, you should not use our website,
          products, or services.
        </p>
      </PolicySection>

      <PolicySection icon={UserCheck} title="2. Who We Are">
        <p>
          AEMA Systems is a sole proprietorship operating in Ontario, Canada. We
          provide software development, AI-powered business tools, automation,
          business systems, digital strategy, consulting, and related technology
          services.
        </p>
      </PolicySection>

      <PolicySection
        icon={Bot}
        title="3. AI Services and Business Reports"
      >
        <p>
          AEMA Systems may provide AI-generated business insights, assessments,
          recommendations, reports, and digital strategy suggestions.
        </p>

        <p>
          AI outputs may be incomplete, inaccurate, outdated, or unsuitable for a
          specific business situation. Users are responsible for reviewing all
          outputs and making their own decisions.
        </p>
      </PolicySection>

      <PolicySection
        icon={Scale}
        title="4. No Professional Advice"
      >
        <p>
          AEMA Systems does not provide legal, accounting, tax, investment,
          financial, medical, or regulated professional advice. Information
          provided through our website, AI tools, reports, and services is for
          general informational and business planning purposes only.
        </p>
      </PolicySection>

      <PolicySection
        icon={Lock}
        title="5. User Responsibilities"
        items={[
          "Provide accurate and lawful information.",
          "Use the platform only for lawful business purposes.",
          "Keep account login information confidential.",
          "Review AI-generated outputs before relying on them.",
          "Avoid uploading harmful, illegal, misleading, or infringing content.",
        ]}
      />

      <PolicySection
        icon={ShieldCheck}
        title="6. Acceptable Use"
        items={[
          "You must not attempt to hack, disrupt, overload, or damage our systems.",
          "You must not reverse engineer, copy, scrape, or misuse our software.",
          "You must not use AEMA Systems to commit fraud, impersonation, or unlawful activity.",
          "You must not upload viruses, malware, spam, or malicious code.",
        ]}
      />

      <PolicySection icon={CreditCard} title="7. Payments and Billing">
        <p>
          Paid services may be processed through trusted third-party payment
          providers such as Stripe. Prices, billing terms, taxes, subscriptions,
          and payment requirements may vary depending on the service purchased.
        </p>

        <p>
          Users are responsible for providing valid payment information and
          paying all applicable fees, taxes, and charges.
        </p>
      </PolicySection>

      <PolicySection title="8. Refunds and Cancellations">
        <p>
          Refunds and cancellations are handled according to the applicable
          refund policy, service agreement, or payment terms presented at the
          time of purchase.
        </p>
      </PolicySection>

      <PolicySection title="9. Intellectual Property">
        <p>
          AEMA Systems owns or licenses the website, software, branding, design,
          content, reports, documentation, code, systems, and related
          intellectual property used to provide our services.
        </p>

        <p>
          Users may not copy, reproduce, resell, modify, distribute, or exploit
          AEMA Systems materials without written permission.
        </p>
      </PolicySection>

      <PolicySection title="10. Third-Party Services">
        <p>
          AEMA Systems may rely on third-party services for hosting, payments,
          analytics, email, AI features, database services, deployment, and other
          platform functions. We are not responsible for outages, errors,
          security incidents, or policy changes caused by third-party providers.
        </p>
      </PolicySection>

      <PolicySection icon={Gavel} title="11. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, AEMA Systems will not be liable
          for indirect, incidental, consequential, special, exemplary, or punitive
          damages, including loss of profits, business interruption, data loss, or
          loss of goodwill arising from use of our services.
        </p>
      </PolicySection>

      <PolicySection icon={ShieldCheck} title="12. Indemnification">
        <p>
          You agree to defend, indemnify, and hold harmless AEMA Systems, its
          owner, contractors, service providers, and partners from claims,
          damages, losses, liabilities, costs, and expenses arising from your use
          of our services, violation of these Terms, misuse of AI outputs,
          infringement of third-party rights, or unlawful conduct.
        </p>
      </PolicySection>

      <PolicySection title="13. Suspension or Termination">
        <p>
          We may suspend or terminate access to our services where we believe a
          user has violated these Terms, failed to make required payments,
          created risk for the platform, misused our services, or engaged in
          unlawful or harmful activity.
        </p>
      </PolicySection>

      <PolicySection title="14. Governing Law">
        <p>
          These Terms are governed by the laws of Ontario and the applicable laws
          of Canada. Any disputes will be handled in the appropriate courts or
          forums located in Ontario, Canada, unless otherwise required by law.
        </p>
      </PolicySection>

      <PolicySection title="15. Changes to These Terms">
        <p>
          We may update these Terms from time to time. When changes are made, we
          will update the version, effective date, and review dates on this page.
        </p>
      </PolicySection>

      <PolicySection title="16. Contact">
        <p>
          For questions about these Terms, contact{" "}
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