import express from "express";

import {
  createCheckoutSession,
  verifyCheckoutSession,
  verifyFounderDemo,
  handleStripeWebhook,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post(
  "/create-checkout-session",
  createCheckoutSession
);

router.post(
  "/webhook",
  handleStripeWebhook
);

router.get(
  "/verify-session/:sessionId",
  verifyCheckoutSession
);

/*
 * This route should ideally use your authentication middleware.
 *
 * Example:
 * router.get("/verify-founder-demo", protect, verifyFounderDemo);
 */
router.get(
  "/verify-founder-demo",
  verifyFounderDemo
);

export default router;
