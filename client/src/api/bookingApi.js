import axios from "axios";

const API_URL =
"https://aemasystems.onrender.com";

export const createBooking =
async (data) => {

  const response =
  await axios.post(
    API_URL,
    data,
    {
      headers:{
        "Content-Type":
        "application/json"
      }
    }
  );

  return response.data;

};