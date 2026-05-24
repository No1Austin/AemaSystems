import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendBookingEmails = async (booking) => {
  // Email to site owner/admin
  await resend.emails.send({
    from: "AEMA Systems <onboarding@resend.dev>",
    to: process.env.ADMIN_EMAIL,
    subject: "New AEMA Systems Booking Request",
    html: `
      <h2>New Booking Request</h2>

      <p><strong>Name:</strong> ${booking.name}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Business:</strong> ${booking.business || "N/A"}</p>
      <p><strong>Industry:</strong> ${booking.industry || "N/A"}</p>
      <p><strong>Budget:</strong> ${booking.budget || "N/A"}</p>
      <p><strong>Preferred Date:</strong> ${booking.preferred_date}</p>
      <p><strong>Preferred Time:</strong> ${booking.preferred_time}</p>

      <h3>Challenge / Project Need</h3>
      <p>${booking.challenge}</p>
    `,
  });

  // Email to client
  await resend.emails.send({
    from: "AEMA Systems <onboarding@resend.dev>",
    to: booking.email,
    subject: "Your AEMA Systems consultation request was received",
    html: `
      <h2>Hi ${booking.name},</h2>

      <p>Thank you for booking a consultation with AEMA Systems.</p>

      <p>We received your request and will review your idea or business need shortly.</p>

      <p><strong>Preferred Date:</strong> ${booking.preferred_date}</p>
      <p><strong>Preferred Time:</strong> ${booking.preferred_time}</p>

      <p>At AEMA Systems, we help transform ideas into intelligent systems.</p>

      <br/>

      <p>— AEMA Systems</p>
    `,
  });
};