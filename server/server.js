import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import bookingRoutes
from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin:
    "http://localhost:5173",

    credentials:true
  })
);

app.use(express.json());


app.get("/",(req,res)=>{

  res.send(
    "AEMA Systems API Running"
  );

});


app.use(
  "/api/bookings",
  bookingRoutes
);


const PORT =
process.env.PORT || 8000;


app.listen(PORT,()=>{

  console.log(
    `Listening on port ${PORT}`
  );

});