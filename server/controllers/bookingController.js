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

    if (!name || !email || !challenge || !preferredDate || !preferredTime) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, challenge, preferred date, and preferred time are required.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO bookings(
        name,
  email,
  phone,
  business,
  industry,
  challenge,
  budget,
  preferredDate,
  preferredTime,
      )
      VALUES(
        $1,$2,$3,$4,
        $5,$6,$7,$8
      )
      RETURNING *
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

    await sendBookingEmails(booking);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully. Emails sent.",
      booking,
    });
  } catch (err) {
    console.log("Booking error:", err);

    return res.status(500).json({
      success: false,
      error: "Failed to create booking",
    });
  }
};