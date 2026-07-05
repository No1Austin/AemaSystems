import {
  Database,
  Eye,
  Globe,
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import TrustLayout from "../../components/trust/TrustLayout";
import PolicySection from "../../components/trust/PolicySection";

export default function PrivacyPolicy() {
  return (
    <TrustLayout
      title="Privacy Policy"
      description="This Privacy Policy explains how AEMA Systems collects, uses, protects, stores, and safeguards personal information when you use our website, AI platforms, software, and business services."
    >
      <PolicySection icon={ShieldCheck} title="1. Our Commitment to Privacy">
        <p>
          AEMA Systems respects your privacy and is committed to protecting the
          personal information you provide when using our website, software,
          artificial intelligence platforms, and business services.
        </p>

        <p>
          We collect and process information responsibly, only where necessary
          to provide our services, improve our products, communicate with users,
          and comply with applicable legal obligations.
        </p>
      </PolicySection>

      <PolicySection
        icon={Database}
        title="2. Information We Collect"
        items={[
          "Name and contact information.",
          "Business information you voluntarily provide.",
          "Booking and consultation information.",
          "AI prompts and information submitted to AEMA AI.",
          "Website usage and analytics information.",
          "Technical information such as browser, device, and IP address.",
          "Payment-related information processed through trusted payment providers.",
        ]}
      />

      <PolicySection
        icon={UserCheck}
        title="3. How We Use Your Information"
        items={[
          "Provide our software and services.",
          "Generate AI reports and recommendations.",
          "Respond to enquiries and customer support requests.",
          "Process bookings and consultations.",
          "Improve our products and user experience.",
          "Maintain platform security and prevent fraud.",
          "Comply with legal and regulatory obligations.",
        ]}
      />

      <PolicySection icon={Eye} title="4. AI and Business Information">
        <p>
          Information submitted to AEMA AI may be processed to generate
          business insights, reports, summaries, recommendations, and related
          outputs.
        </p>

        <p>
          AI-generated recommendations are intended to assist decision-making
          and should not be treated as legal, accounting, financial, tax,
          investment, or other regulated professional advice.
        </p>
      </PolicySection>

      <PolicySection icon={Lock} title="5. Information Security">
        <p>
          We implement reasonable technical, administrative, and organizational
          safeguards to protect information from unauthorized access, loss,
          misuse, alteration, or disclosure.
        </p>

        <p>
          These safeguards may include secure hosting, HTTPS encryption,
          authentication controls, password protection, limited administrative
          access, secure payment processing, and ongoing review of our security
          practices.
        </p>

        <p>
          While we take reasonable steps to protect your information, no method
          of electronic transmission or storage can be guaranteed to be
          completely secure. To the fullest extent permitted by law, AEMA
          Systems disclaims liability for unauthorized access or security
          incidents beyond our reasonable control.
        </p>
      </PolicySection>

      <PolicySection title="6. Sharing Information">
        <p>
          We do not sell your personal information.
        </p>

        <p>
          We may share information with trusted third-party service providers
          that help us operate our business, including hosting providers,
          payment processors, email providers, analytics services, and cloud
          infrastructure providers where necessary to provide our services.
        </p>
      </PolicySection>

      <PolicySection title="7. Data Retention">
        <p>
          We retain information only for as long as reasonably necessary to
          provide our services, comply with legal obligations, resolve disputes,
          protect our legitimate business interests, and enforce our agreements.
        </p>
      </PolicySection>

      <PolicySection
        icon={Globe}
        title="8. International Processing"
      >
        <p>
          Depending on the services used, your information may be processed or
          stored by trusted service providers located in different jurisdictions.
          By using our services, you acknowledge that such processing may occur
          where permitted by applicable law.
        </p>
      </PolicySection>

      <PolicySection title="9. Your Privacy Rights">
        <p>
          Subject to applicable law, you may have the right to request access
          to, correction of, or deletion of certain personal information that
          we hold about you.
        </p>
      </PolicySection>

      <PolicySection title="10. Children's Privacy">
        <p>
          Our services are not directed toward children under the age required
          by applicable law. We do not knowingly collect personal information
          from children through our services.
        </p>
      </PolicySection>

      <PolicySection title="11. Changes to this Policy">
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in our services, legal obligations, technology, or business
          operations. The updated version will become effective when published
          on this website.
        </p>
      </PolicySection>

      <PolicySection icon={Mail} title="12. Contact Us">
        <p>
          Questions regarding this Privacy Policy may be directed to:
        </p>

        <p className="mt-4">
          <strong>AEMA Systems</strong>
          <br />
          Ontario, Canada
          <br />
          Email:{" "}
          <a
            href="mailto:privacy@aemasystems.com"
            className="text-emerald-400 hover:text-emerald-300"
          >
            privacy@aemasystems.com
          </a>
        </p>
      </PolicySection>
    </TrustLayout>
  );
}