import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import complianceRoutes from "./routes/complianceRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import blueprintRoutes from "./routes/blueprintRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import compliancePaymentRoutes from "./routes/compliancePaymentRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://aemasystems.com",
  "https://www.aemasystems.com",
  "https://aemasystems-1.onrender.com",
];

/*
|--------------------------------------------------------------------------
| Stripe Webhook Raw Body
|--------------------------------------------------------------------------
| This must stay before express.json().
| Final webhook URL:
| https://aemasystems-1.onrender.com/api/payments/webhook
*/

app.use(
  "/api/payments/webhook",
  express.raw({
    type: "application/json",
    limit: "2mb",
  })
);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    const isAllowed =
      allowedOrigins.includes(origin) ||
      (typeof origin === "string" &&
        origin.endsWith(".vercel.app"));

    if (isAllowed) {
      return callback(null, true);
    }

    console.error("Blocked by CORS:", origin);

    return callback(
      new Error(`Not allowed by CORS: ${origin}`)
    );
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    service: "AEMA Systems API",
    status: "Running",
    version: "1.0.0",
    environment:
      process.env.NODE_ENV || "development",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "AEMA Systems API",
    status: "Healthy",
    timestamp: new Date().toISOString(),
  });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| All routes must be registered before the 404 handler.
*/

app.use("/api/ai", aiRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/blueprint", blueprintRoutes);

app.use("/api/payments", paymentRoutes);

app.use(
  "/api/compliance/payments",
  compliancePaymentRoutes
);

app.use("/api/reports", reportRoutes);
app.use("/api/compliance", complianceRoutes);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found.",
    method: req.method,
    path: req.originalUrl,
  });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);

  const statusCode =
    Number.isInteger(err?.status) &&
    err.status >= 400 &&
    err.status < 600
      ? err.status
      : 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500 &&
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err?.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`
=========================================
AEMA Systems API Started
=========================================
Environment : ${process.env.NODE_ENV || "development"}
Port        : ${PORT}
Webhook     : /api/payments/webhook
Compliance  : /api/compliance/payments
=========================================
`);
});

function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down...`);

  server.close((error) => {
    if (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }

    console.log("HTTP server closed.");
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export default app;
