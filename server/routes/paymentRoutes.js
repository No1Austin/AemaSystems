import express from "express";
import {
  createCheckoutSession,
  verifyCheckoutSession,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.get("/verify-session/:sessionId", verifyCheckoutSession);

export default router;