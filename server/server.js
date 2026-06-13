import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/aiRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import blueprintRoutes from "./routes/blueprintRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://aemasystems.com",
  "https://www.aemasystems.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.options("*", cors());

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

app.options(/.*/, cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("AEMA Systems API Running");
});
app.use("/api/payments", paymentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/blueprint", blueprintRoutes);
app.use("/api/reports", reportRoutes);
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});