import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import aiRoutes from "./routes/aiRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import blueprintRoutes from "./routes/blueprintRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

import complianceRoutes from "./routes/complianceRoutes.js";
import compliancePaymentRoutes from "./routes/compliancePaymentRoutes.js";
import complianceWorkspaceRoutes from "./routes/complianceWorkspaceRoutes.js";
import complianceHostingRoutes from "./routes/complianceHostingCheckoutRoute.js";

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
| This must remain before express.json().
|
| Webhook URL:
| https://aemasystems-1.onrender.com/api/payments/webhook
*/

app.use(
  "/api/payments/webhook",
  express.raw({
    type: "application/json",
    limit: "2mb",
  })
);

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

const corsOptions = {
  origin(origin, callback) {
    /*
     * Requests without an Origin header include server-to-server requests,
     * Stripe webhooks, Postman, and direct browser navigation.
     */
    if (!origin) {
      return callback(null, true);
    }

    const isAllowed =
      allowedOrigins.includes(origin) ||
      (
        typeof origin === "string" &&
        origin.endsWith(".vercel.app")
      );

    if (isAllowed) {
      return callback(null, true);
    }

    console.error(
      "Blocked by CORS:",
      origin
    );

    return callback(
      new Error(
        `Not allowed by CORS: ${origin}`
      )
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

/*
 * Handles preflight requests.
 * This form works with the current Express router setup.
 */
app.options("*", cors(corsOptions));

/*
|--------------------------------------------------------------------------
| Request Body Parsers
|--------------------------------------------------------------------------
| These must remain after the raw Stripe webhook middleware.
*/

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

/*
|--------------------------------------------------------------------------
| Root and Health Routes
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    service: "AEMA Systems API",
    status: "Running",
    version: "1.0.0",
    environment:
      process.env.NODE_ENV ||
      "development",
  });
});

app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    service: "AEMA Systems API",
    status: "Healthy",
    timestamp:
      new Date().toISOString(),
  });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Every route must be registered before the 404 handler.
*/

/*
|--------------------------------------------------------------------------
| General AEMA Routes
|--------------------------------------------------------------------------
*/

app.use(
  "/api/ai",
  aiRoutes
);

app.use(
  "/api/bookings",
  bookingRoutes
);

app.use(
  "/api/blueprint",
  blueprintRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);

app.use(
  "/api/reports",
  reportRoutes
);

/*
|--------------------------------------------------------------------------
| Compliance OS Routes
|--------------------------------------------------------------------------
*/

/*
 * Compliance assessment save and evaluation routes:
 *
 * POST /api/compliance/save
 * POST /api/compliance/evaluate
 * GET  /api/compliance/test
 */
app.use(
  "/api/compliance",
  complianceRoutes
);

/*
 * Compliance workspace and generated-document routes:
 *
 * GET   /api/compliance/workspace/by-assessment/:assessmentId
 * GET   /api/compliance/workspace/:workspaceId/documents
 * GET   /api/compliance/workspace/:workspaceId/documents/:slug
 * PATCH /api/compliance/workspace/:workspaceId/documents/:documentId
 */
app.use(
  "/api/compliance",
  complianceWorkspaceRoutes
);

/*
 * One-time compliance package payment routes:
 *
 * POST /api/compliance/payments/create-checkout-session
 * GET  /api/compliance/payments/session/:sessionId
 */
app.use(
  "/api/compliance/payments",
  compliancePaymentRoutes
);

/*
 * Monthly hosted Trust Center subscription routes:
 *
 * POST /api/compliance/hosting/create-checkout-session
 * GET  /api/compliance/hosting/session/:sessionId
 */
app.use(
  "/api/compliance/hosting",
  complianceHostingRoutes
);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
| Must remain after every valid API route.
*/

app.use((req, res) => {
  return res.status(404).json({
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
  console.error(
    "Unhandled server error:",
    err
  );

  const isCorsError =
    typeof err?.message === "string" &&
    err.message.startsWith(
      "Not allowed by CORS:"
    );

  const statusCode = isCorsError
    ? 403
    : Number.isInteger(
          err?.status
        ) &&
        err.status >= 400 &&
        err.status < 600
      ? err.status
      : 500;

  return res
    .status(statusCode)
    .json({
      success: false,

      message:
        statusCode === 500 &&
        process.env.NODE_ENV ===
          "production"
          ? "Internal Server Error"
          : err?.message ||
            "Internal Server Error",
    });
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

const PORT =
  process.env.PORT || 8000;

const server = app.listen(
  PORT,
  () => {
    console.log(`
=========================================
AEMA Systems API Started
=========================================
Environment : ${
      process.env.NODE_ENV ||
      "development"
    }
Port        : ${PORT}
Health      : /health
Webhook     : /api/payments/webhook
Compliance  : /api/compliance
Payments    : /api/compliance/payments
Hosting     : /api/compliance/hosting
=========================================
`);
  }
);

/*
|--------------------------------------------------------------------------
| Graceful Shutdown
|--------------------------------------------------------------------------
*/

function shutdown(signal) {
  console.log(
    `\n${signal} received. Shutting down...`
  );

  server.close((error) => {
    if (error) {
      console.error(
        "Error during shutdown:",
        error
      );

      process.exit(1);
    }

    console.log(
      "HTTP server closed."
    );

    process.exit(0);
  });
}

process.on(
  "SIGTERM",
  () => shutdown("SIGTERM")
);

process.on(
  "SIGINT",
  () => shutdown("SIGINT")
);

export default app;