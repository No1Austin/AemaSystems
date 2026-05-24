import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendBookingEmails = async (booking) => {
  console.log("ADMIN:", process.env.ADMIN_EMAIL);
  console.log("CLIENT:", booking.email);

  // ======================
  // ADMIN EMAIL
  // ======================
  try {
    const adminResult = await resend.emails.send({
      from: "AEMA Systems <bookings@aemasystems.com>",
      to: process.env.ADMIN_EMAIL,
      subject: "🚀 New AEMA Systems Booking Request",

      html: `
        <h1>New Booking Request</h1>

        <p><strong>Name:</strong> ${booking.name}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        <p><strong>Phone:</strong> ${booking.phone || "Not provided"}</p>

        <p><strong>Business:</strong>
        ${booking.business || "N/A"}</p>

        <p><strong>Industry:</strong>
        ${booking.industry || "N/A"}</p>

        <p><strong>Budget:</strong>
        ${booking.budget || "N/A"}</p>

        <p><strong>Preferred Date:</strong>
        ${booking.preferred_date || "N/A"}</p>

        <p><strong>Preferred Time:</strong>
        ${booking.preferred_time || "N/A"}</p>

        <h3>Challenge / Project Need</h3>

        <p>${booking.challenge}</p>
      `,
    });

    console.log("Admin email sent:", adminResult);

  } catch (err) {
    console.error("Admin email failed:", err);
  }


  // ======================
  // CLIENT EMAIL
  // ======================
  try {
    const clientResult = await resend.emails.send({
      from: "AEMA Systems <bookings@aemasystems.com>",
      to: booking.email,

      subject:
        "Your AEMA Systems consultation request was received",

      html: `
        <h2>Hi ${booking.name},</h2>

        <p>
          Thank you for booking a consultation with
          <strong>AEMA Systems</strong>.
        </p>

        <p>
          We received your request and will contact you shortly.
        </p>

        <hr/>

        <p>
          <strong>Preferred Date:</strong>
          ${booking.preferred_date || "N/A"}
        </p>

        <p>
          <strong>Preferred Time:</strong>
          ${booking.preferred_time || "N/A"}
        </p>

        <p>
          <strong>Business:</strong>
          ${booking.business || "N/A"}
        </p>

        <br/>

        <p>
          We're excited to learn more about your project.
        </p>

        <br/>

        <p>— AEMA Systems</p>
      `,
    });

    console.log("Client email sent:", clientResult);

  } catch (err) {
    console.error("Client email failed:", err);
  }
};