import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const sendMessageToAemaAI = async (messages) => {
  const response = await axios.post(`${API_URL}/api/ai/chat`, {
    messages,
  });

  return response.data;
};