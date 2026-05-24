import pool from "../db/pool.js";
import { sendBookingEmails } from "../services/emailService.js";

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
    } = req.body;

    // Validate required fields
    if (!name || !email || !challenge || !preferredDate || !preferredTime) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, challenge, preferred date, and preferred time are required.",
      });
    }

    // Insert booking into database
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
        preferred_time
      )
      VALUES (
        $1,$2,$3,$4,
        $5,$6,$7,$8,$9
      )
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
      ]
    );

    const booking = result.rows[0];

    // Send confirmation emails
    await sendBookingEmails(booking);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully. Emails sent.",
      booking,
    });

  } catch (err) {
    console.error("Booking error:", err); // Shows exact error in Render logs

    return res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: err.message, // helpful during debugging
    });
  }
};