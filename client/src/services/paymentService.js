import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const createCheckoutSession = async (plan, profile = {}) => {
  const response = await axios.post(
    `${API_URL}/api/payments/create-checkout-session`,
    {
      plan,
      profile,
    }
  );

  return response.data;
};