import pool from "../db/pool.js";
import { sendBookingEmails } from "../services/emailService.js";

const getBookingPriority = (plan = "regular") => {
  if (plan === "partner") {
    return "VIP";
  }

  if (plan === "expert") {
    return "HIGH";
  }

  return "STANDARD";
};

const getPlanLabel = (plan = "regular") => {
  const labels = {
    regular: "Regular Consultation - $30",
    blueprint: "AEMA Growth Blueprint",
    expert: "AEMA Blueprint + Expert Session",
    partner: "AEMA Business Partner",
  };

  return labels[plan] || labels.regular;
};

export const createBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      business,
      industry,
      challenge,
      budget,
      preferredDate,
      preferredTime,

      plan = "regular",
      bookingSource = "website",
      aiProfile = null,
    } = req.body;

    if (!name || !email || !challenge || !preferredDate || !preferredTime) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, challenge, preferred date, and preferred time are required.",
      });
    }

    const priority = getBookingPriority(plan);
    const planLabel = getPlanLabel(plan);

    const result = await pool.query(
      `
      INSERT INTO bookings (
        name,
        email,
        phone,
        business,
        industry,
        challenge,
        budget,
        preferred_date,
        preferred_time,
        plan,
        priority,
        booking_source,
        ai_profile
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *;
      `,
      [
        name,
        email,
        phone,
        business,
        industry,
        challenge,
        budget,
        preferredDate,
        preferredTime,
        planLabel,
        priority,
        bookingSource,
        aiProfile,
      ]
    );

    const booking = result.rows[0];

    try {
      await sendBookingEmails({
        ...booking,
        plan: planLabel,
        priority,
        booking_source: bookingSource,
        ai_profile: aiProfile,
      });
    } catch (emailErr) {
      console.error("Email error:", emailErr);
    }

    return res.status(201).json({
      success: true,
      message: "Booking created successfully. Emails sent.",
      booking,
    });
  } catch (err) {
    console.error("Booking error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: err.message,
    });
  }
};