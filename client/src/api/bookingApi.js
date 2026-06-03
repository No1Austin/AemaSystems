import axios from "axios";

const WEBHOOK_URL =
  "https://aemasystem.app.n8n.cloud/webhook/aema-booking";

export const createBooking = async (data) => {
  const response = await axios.post(
    WEBHOOK_URL,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};