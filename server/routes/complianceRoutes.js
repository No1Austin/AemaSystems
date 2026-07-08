import express from "express";
import { evaluateCompliance } from "../compliance/frameworks/index.js";

console.log("✅ Compliance routes loaded");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Test Route
|--------------------------------------------------------------------------
*/

router.get("/test", (req, res) => {
  console.log("✅ Compliance test endpoint hit");

  return res.json({
    success: true,
    message: "Compliance route works successfully.",
  });
});

/*
|--------------------------------------------------------------------------
| Compliance Evaluation
|--------------------------------------------------------------------------
*/

router.post("/evaluate", async (req, res) => {
  console.log("✅ Compliance evaluation endpoint hit");

  try {
    const profile = req.body || {};

    const result = evaluateCompliance(profile);

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("❌ Compliance evaluation error:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to evaluate compliance at this time.",
    });
  }
});

export default router;