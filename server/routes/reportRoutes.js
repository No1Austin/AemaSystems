import express from "express";
import { downloadReportPdf } from "../controllers/reportController.js";

const router = express.Router();

router.post("/download-pdf", downloadReportPdf);

export default router;