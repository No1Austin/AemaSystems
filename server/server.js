import "dotenv/config";

import express from "express";
import cors from "cors";

import aiRoutes from "./routes/aiRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import blueprintRoutes from "./routes/blueprintRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

import complianceRoutes from "./routes/complianceRoutes.js";
import compliancePaymentRoutes from "./routes/compliancePaymentRoutes.js";
import complianceWorkspaceRoutes from "./routes/complianceWorkspaceRoutes.js";
import complianceHostingRoutes from "./routes/complianceHostingCheckoutRoute.js";


const app = express();

const PORT = Number(process.env.PORT) || 8000;
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PRODUCTION = NODE_ENV === "production";

const requiredEnvironmentVariables = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
];

const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
  (name) => !process.env[name]
);

if (missingEnvironmentVariables.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvironmentVariables.join(
      ", "
    )}`
  );

  if (IS_PRODUCTION) {
    process.exit(1);
  }
}

app.set("trust proxy", 1);
app.disable("x-powered-by");

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "https://aemasystems.com",
  "https://www.aemasystems.com",
  "https://aemasystems-1.onrender.com",
]);

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.has(origin)) {
    return true;
  }

  try {
    const parsedOrigin = new URL(origin);

    return (
      parsedOrigin.protocol === "https:" &&
      parsedOrigin.hostname.endsWith(".vercel.app")
    );
  } catch {
    return false;
  }
}

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    console.error("Blocked by CORS:", origin);

    const error = new Error(`Not allowed by CORS: ${origin}`);
    error.status = 403;

    return callback(error);
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Stripe-Signature",
    "Idempotency-Key",
    "X-Request-Id",
  ],

  exposedHeaders: ["X-Request-Id"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use((req, res, next) => {
  const incomingRequestId = req.get("x-request-id");

  const requestId =
    incomingRequestId ||
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  next();
});

/*
|--------------------------------------------------------------------------
| Stripe webhook raw body
|--------------------------------------------------------------------------
| This must remain before express.json().
|
| The final route is registered by paymentRoutes:
| POST /api/payments/webhook
*/

app.use(
  "/api/payments/webhook",
  express.raw({
    type: "application/json",
    limit: "2mb",
  })
);

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
    parameterLimit: 10_000,
  })
);

app.use((req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startedAt;

    console.log(
      [
        req.method,
        req.originalUrl,
        res.statusCode,
        `${duration}ms`,
        `requestId=${req.requestId}`,
      ].join(" ")
    );
  });

  next();
});

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    service: "AEMA Systems API",
    status: "Running",
    version: "1.0.0",
    environment: NODE_ENV,
    requestId: req.requestId,
  });
});

app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    service: "AEMA Systems API",
    status: "Healthy",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    requestId: req.requestId,
  });
});

/*
 * Browser diagnostics only.
 * Stripe itself sends POST requests.
 */
app.get("/api/payments/webhook", (req, res) => {
  return res.status(200).json({
    success: true,
    message:
      "Stripe webhook endpoint is available. Stripe must call this URL using POST.",
    methodExpected: "POST",
    requestId: req.requestId,
  });
});

app.use("/api/ai", aiRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/blueprint", blueprintRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reports", reportRoutes);

app.use("/api/compliance", complianceRoutes);
app.use("/api/compliance", complianceWorkspaceRoutes);
app.use("/api/compliance/payments", compliancePaymentRoutes);
app.use("/api/compliance/hosting", complianceHostingRoutes);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Endpoint not found.",
    method: req.method,
    path: req.originalUrl,
    requestId: req.requestId,
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const isCorsError =
    typeof err?.message === "string" &&
    err.message.startsWith("Not allowed by CORS:");

  const isInvalidJson =
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err;

  let statusCode = 500;
  let publicMessage = "Internal Server Error";

  if (isCorsError) {
    statusCode = 403;
    publicMessage = err.message;
  } else if (isInvalidJson) {
    statusCode = 400;
    publicMessage = "Invalid JSON request body.";
  } else if (
    Number.isInteger(err?.status) &&
    err.status >= 400 &&
    err.status < 600
  ) {
    statusCode = err.status;
    publicMessage = err.message || publicMessage;
  }

  console.error("Unhandled server error:", {
    message: err?.message,
    stack: IS_PRODUCTION ? undefined : err?.stack,
    method: req.method,
    path: req.originalUrl,
    requestId: req.requestId,
  });

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500 && IS_PRODUCTION
        ? "Internal Server Error"
        : publicMessage,
    requestId: req.requestId,
  });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`
=========================================
AEMA Systems API Started
=========================================
Environment : ${NODE_ENV}
Port        : ${PORT}
Health      : /health
Webhook     : POST /api/payments/webhook
Payments    : /api/payments
Compliance  : /api/compliance
Comp Pay    : /api/compliance/payments
Hosting     : /api/compliance/hosting
=========================================
`);
});

server.on("error", (error) => {
  console.error("HTTP server error:", error);

  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
  }

  process.exit(1);
});

let isShuttingDown = false;

function shutdown(signal, exitCode = 0) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(`\n${signal} received. Shutting down...`);

  const forceShutdownTimer = setTimeout(() => {
    console.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 10_000);

  forceShutdownTimer.unref();

  server.close((error) => {
    clearTimeout(forceShutdownTimer);

    if (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }

    console.log("HTTP server closed.");
    process.exit(exitCode);
  });
}

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  shutdown("uncaughtException", 1);
});

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export default app;
