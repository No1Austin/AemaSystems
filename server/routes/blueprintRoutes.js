import express from "express";
import { submitBlueprintAssessment } from "../controllers/blueprintController.js";

const router = express.Router();

router.post("/submit", submitBlueprintAssessment);

export default router;