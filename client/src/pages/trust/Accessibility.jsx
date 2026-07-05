import { Accessibility, Mail, MonitorSmartphone, ShieldCheck } from "lucide-react";
import TrustLayout from "../../components/trust/TrustLayout";
import PolicySection from "../../components/trust/PolicySection";

export default function AccessibilityStatement() {
  return (
    <TrustLayout
      title="Accessibility Statement"
      description="AEMA Systems is committed to making our website, software, and digital services accessible and usable for as many people as possible."
    >
      <PolicySection icon={Accessibility} title="1. Our Commitment">
        <p>
          AEMA Systems believes technology should be accessible to everyone. We
          are committed to continually improving the accessibility of our
          website, AI platforms, software, and digital services so that people
          of all abilities can use them effectively.
        </p>
      </PolicySection>

      <PolicySection
        icon={MonitorSmartphone}
        title="2. Accessibility Goals"
        items={[
          "Design interfaces that are simple and easy to navigate.",
          "Use readable fonts and sufficient color contrast.",
          "Support keyboard navigation where practical.",
          "Improve compatibility with assistive technologies over time.",
          "Continuously review accessibility as new features are developed.",
        ]}
      />

      <PolicySection title="3. Ongoing Improvements">
        <p>
          Accessibility is an ongoing effort. As AEMA Systems evolves, we will
          continue improving our products and services to make them more
          inclusive and easier to use.
        </p>

        <p>
          We regularly consider accessibility during the design and development
          of new features and encourage user feedback to help us identify areas
          for improvement.
        </p>
      </PolicySection>

      <PolicySection
        icon={ShieldCheck}
        title="4. Third-Party Services"
      >
        <p>
          Some features of our website may rely on third-party providers such as
          payment processors, mapping services, embedded content, analytics, or
          AI technologies. While we strive to work with trusted providers, we
          cannot guarantee the accessibility of third-party services that are
          outside our control.
        </p>
      </PolicySection>

      <PolicySection title="5. Feedback">
        <p>
          If you experience accessibility barriers while using AEMA Systems, we
          encourage you to let us know. Your feedback helps us improve our
          products and services for everyone.
        </p>
      </PolicySection>

      <PolicySection icon={Mail} title="6. Contact">
        <p>
          For accessibility questions or feedback, contact{" "}
          <a
            href="mailto:accessibility@aemasystems.com"
            className="text-emerald-400 hover:text-emerald-300"
          >
            accessibility@aemasystems.com
          </a>
          .
        </p>
      </PolicySection>
    </TrustLayout>
  );
}