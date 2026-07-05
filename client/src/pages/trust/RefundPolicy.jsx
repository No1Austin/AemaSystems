import { CreditCard, DollarSign, Mail, ShieldCheck } from "lucide-react";
import TrustLayout from "../../components/trust/TrustLayout";
import PolicySection from "../../components/trust/PolicySection";

export default function RefundPolicy() {
  return (
    <TrustLayout
      title="Refund Policy"
      description="This Refund Policy explains when refunds may be available for purchases made through AEMA Systems, including AI reports, software subscriptions, consulting services, and digital products."
    >
      <PolicySection icon={DollarSign} title="1. General Policy">
        <p>
          AEMA Systems aims to provide high-quality digital products and
          professional business services. Because many of our services are
          delivered immediately or involve significant work once an order is
          placed, refunds may be limited.
        </p>
      </PolicySection>

      <PolicySection
        icon={CreditCard}
        title="2. Digital Products"
      >
        <p>
          Unless otherwise required by law, purchases of digital products,
          downloadable reports, AI-generated business assessments, templates,
          documents, and other digital content are generally non-refundable once
          they have been delivered or made available.
        </p>
      </PolicySection>

      <PolicySection title="3. AI Reports">
        <p>
          AI-generated reports are created using information provided by the
          customer together with automated analytical processes.
        </p>

        <p>
          Because these reports are generated specifically for each request,
          refunds are generally not available after report generation has begun
          or the report has been delivered.
        </p>

        <p>
          If a technical issue caused by AEMA Systems prevents delivery of the
          report, we will work with you to regenerate or provide access to the
          report before considering a refund.
        </p>
      </PolicySection>

      <PolicySection title="4. Consulting Services">
        <p>
          Consulting sessions may be cancelled or rescheduled with reasonable
          notice, subject to the specific agreement made at the time of booking.
        </p>

        <p>
          Once consulting services have been provided, fees are generally
          non-refundable unless otherwise agreed in writing.
        </p>
      </PolicySection>

      <PolicySection title="5. Software Subscriptions">
        <p>
          Subscription services, including platforms such as TaskFlow or future
          subscription-based services offered by AEMA Systems, remain active
          until cancelled.
        </p>

        <p>
          Cancelling a subscription stops future billing but does not normally
          entitle the customer to a refund for subscription periods that have
          already started, except where required by applicable law.
        </p>
      </PolicySection>

      <PolicySection
        title="6. Exceptional Refunds"
        items={[
          "Duplicate payments.",
          "Incorrect billing caused by AEMA Systems.",
          "Failure to deliver a purchased service due to a verified technical issue.",
          "Refunds required by applicable law.",
        ]}
      >
        <p>
          Refund requests are reviewed individually. Approval of one refund does
          not create an obligation to approve future requests.
        </p>
      </PolicySection>

      <PolicySection title="7. Chargebacks">
        <p>
          Customers are encouraged to contact AEMA Systems before initiating a
          payment dispute or chargeback through their payment provider.
        </p>

        <p>
          Fraudulent or abusive chargebacks may result in suspension or
          termination of access to our services.
        </p>
      </PolicySection>

      <PolicySection
        icon={ShieldCheck}
        title="8. Our Commitment"
      >
        <p>
          While we may not always be able to issue a refund, we are committed to
          resolving genuine customer concerns fairly and professionally.
        </p>

        <p>
          Where appropriate, we may offer technical support, corrections,
          replacement services, regenerated reports, service credits, or other
          reasonable solutions.
        </p>
      </PolicySection>

      <PolicySection icon={Mail} title="9. Contact">
        <p>
          For refund requests or billing questions, contact{" "}
          <a
            href="mailto:billing@aemasystems.com"
            className="text-emerald-400 hover:text-emerald-300"
          >
            billing@aemasystems.com
          </a>{" "}
          or{" "}
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