import { Cookie, Settings, ShieldCheck, Mail } from "lucide-react";
import TrustLayout from "../../components/trust/TrustLayout";
import PolicySection from "../../components/trust/PolicySection";

export default function CookiePolicy() {
  return (
    <TrustLayout
      title="Cookie Policy"
      description="This Cookie Policy explains how AEMA Systems may use cookies and similar technologies to support website functionality, improve user experience, and protect our services."
    >
      <PolicySection icon={Cookie} title="1. What Cookies Are">
        <p>
          Cookies are small files stored on your device when you visit a website.
          They help websites remember preferences, support functionality, improve
          performance, and understand how users interact with pages.
        </p>
      </PolicySection>

      <PolicySection
        icon={Settings}
        title="2. How AEMA Systems Uses Cookies"
        items={[
          "To support website functionality and navigation.",
          "To remember user preferences where applicable.",
          "To improve website performance and user experience.",
          "To help secure our website and services.",
          "To support payment, analytics, or third-party service integrations where applicable.",
        ]}
      />

      <PolicySection
        icon={ShieldCheck}
        title="3. Types of Cookies We May Use"
        items={[
          "Essential cookies required for website operation and security.",
          "Preference cookies that remember basic settings.",
          "Analytics cookies that help us understand website usage.",
          "Third-party cookies from trusted providers such as payment processors, hosting providers, or analytics tools.",
        ]}
      />

      <PolicySection title="4. Third-Party Cookies">
        <p>
          Some cookies or similar technologies may be placed by third-party
          services that support AEMA Systems, including payment processing,
          hosting, analytics, email, or embedded tools.
        </p>

        <p>
          These third parties may have their own privacy and cookie practices.
          AEMA Systems is not responsible for third-party cookie practices.
        </p>
      </PolicySection>

      <PolicySection title="5. Managing Cookies">
        <p>
          You can control or disable cookies through your browser settings. Most
          browsers allow you to block cookies, delete existing cookies, or receive
          alerts when cookies are being used.
        </p>

        <p>
          Some parts of our website or services may not work properly if cookies
          are disabled.
        </p>
      </PolicySection>

      <PolicySection title="6. Similar Technologies">
        <p>
          We may use similar technologies such as pixels, local storage, session
          storage, log files, or analytics tools to support site functionality,
          security, performance, and service improvement.
        </p>
      </PolicySection>

      <PolicySection title="7. Updates to This Policy">
        <p>
          We may update this Cookie Policy from time to time. When changes are
          made, we will update the version, effective date, and review dates on
          this page.
        </p>
      </PolicySection>

      <PolicySection icon={Mail} title="8. Contact">
        <p>
          For questions about this Cookie Policy, contact{" "}
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