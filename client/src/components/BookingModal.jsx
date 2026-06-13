import { useState } from "react";
import { submitBookingRequest } from "../services/bookingService";

const planLabels = {
  regular: "Regular Consultation - $30",
  expert: "Blueprint + Expert Session - Included",
  partner: "AEMA Business Partner - Monthly Session",
};

export default function BookingModal({ open, onClose, plan, aiProfile }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
    plan: plan || "",
    bookingSource: "payment-success",
    aiProfile: aiProfile || null,
  });

  if (!open) return null;

  const selectedPlan = planLabels[plan] || "AEMA Consultation";

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await submitBookingRequest({
        plan: form.plan || plan,
        bookingSource: form.bookingSource,

        name: form.name,
        email: form.email,
        phone: form.phone,

        business: form.businessName,
        industry: "AEMA AI Client",
        challenge: form.notes || selectedPlan,
        budget: selectedPlan,

        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,

        aiProfile: form.aiProfile,
      });

      alert("Booking request received. AEMA will contact you to confirm.");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="booking-overlay">
      <div className="booking-modal">
        <button className="booking-close" onClick={onClose} type="button">
          ✕
        </button>

        <h2>Book Your AEMA Session</h2>

        <div className="locked-plan">
          <span>Locked Plan</span>
          <strong>{selectedPlan}</strong>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <label>
            Full Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Phone
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Business Name
            <input
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
            />
          </label>

          <div className="booking-grid">
            <label>
              Preferred Date
              <input
                name="preferredDate"
                type="date"
                value={form.preferredDate}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Preferred Time
              <input
                name="preferredTime"
                type="time"
                value={form.preferredTime}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label>
            Notes
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Tell us what you want to discuss..."
            />
          </label>

          <button type="submit">Submit Booking Request</button>
        </form>
      </div>
    </div>
  );
}