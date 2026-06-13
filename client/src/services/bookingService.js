import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const submitBookingRequest = async (bookingData) => {
  const response = await axios.post(
    `${API_URL}/api/bookings/create`,
    bookingData
  );

  return response.data;
};