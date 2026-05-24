import axios from "axios";

const API_URL =
`${import.meta.env.VITE_API_URL}/api/bookings`;

export const createBooking =
async (data) => {

  const response =
  await axios.post(
    API_URL,
    data,
    {
      headers: {
        "Content-Type":
        "application/json",
      },
    }
  );

  return response.data;
};