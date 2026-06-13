import express from "express";
import { chatWithAemaAI } from "../controllers/aiController.js";

const router = express.Router();

router.post("/chat", chatWithAemaAI);

export default router;