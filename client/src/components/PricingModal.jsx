import { createCheckoutSession } from "../services/paymentService";

export default function PricingModal({ open, onClose, profile }) {
  if (!open) return null;

  const handleChoosePlan = async (plan) => {
    try {
      localStorage.setItem(
        "aema_paid_profile",
        JSON.stringify(profile || {})
      );

      const result = await createCheckoutSession(plan, profile);

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error(error);
      alert("Payment could not start. Please try again.");
    }
  };

  return (
    <div className="pricing-overlay">
      <div className="pricing-modal">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2>Unlock Your Growth Blueprint</h2>

        <div className="pricing-cards">
          <div className="pricing-card">
            <h3>🚀 Growth Blueprint</h3>
            <h1>$9.99</h1>

            <ul>
              <li>✓ AI Business Analysis</li>
              <li>✓ Growth Blueprint</li>
              <li>✓ PDF Report</li>
              <li>✓ 30-Day Action Plan</li>
            </ul>

            <button onClick={() => handleChoosePlan("blueprint")}>
              Choose Plan
            </button>
          </div>

          <div className="pricing-card featured">
            <div className="badge">Most Popular</div>

            <h3>💼 Blueprint + Expert</h3>
            <h1>$49</h1>

            <ul>
              <li>✓ Everything in Blueprint</li>
              <li>✓ 30-Min Consultation</li>
              <li>✓ Growth Strategy Session</li>
              <li>✓ Technology Recommendations</li>
            </ul>

            <button onClick={() => handleChoosePlan("expert")}>
              Choose Plan
            </button>
          </div>

          <div className="pricing-card">
            <h3>🧠 AEMA Business Partner</h3>
            <h1>$30/mo</h1>

            <ul>
              <li>✓ Monthly Growth Reports</li>
              <li>✓ Monthly Consultation</li>
              <li>✓ Unlimited AI Access</li>
              <li>✓ Priority Support</li>
            </ul>

            <p className="minimum">3-Month Minimum Commitment</p>

            <button onClick={() => handleChoosePlan("partner")}>
              Choose Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}