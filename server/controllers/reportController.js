import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoPath = path.join(__dirname, "../assets/aema-logo.png");

export const downloadReportPdf = async (req, res) => {
  try {
    const { report } = req.body;

    if (!report) {
      return res.status(400).json({
        success: false,
        message: "Report data is required.",
      });
    }

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=AEMA-Growth-Blueprint.pdf"
    );

    doc.pipe(res);

    const blue = "#2563EB";
    const sky = "#0EA5E9";
    const dark = "#111827";
    const grey = "#6B7280";

    const addLogo = () => {
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 35, {
          fit: [110, 55],
        });
      } else {
        doc.fontSize(18).fillColor(blue).text("AEMA SYSTEMS", 50, 45);
      }
    };

    const addTitle = (title) => {
      doc.moveDown(1);
      doc.fontSize(16).fillColor(blue).text(title);
      doc.moveDown(0.4);
    };

    const addText = (text) => {
      doc.fontSize(11).fillColor(dark).text(text || "Not provided", {
        lineGap: 4,
      });
    };

    const addList = (title, items = []) => {
      if (!items || items.length === 0) return;

      addTitle(title);

      items.forEach((item) => {
        doc.fontSize(11).fillColor(dark).text(`• ${item}`, {
          indent: 12,
          lineGap: 5,
        });
      });
    };

    const checkPageSpace = () => {
      if (doc.y > 720) {
        doc.addPage();
        addLogo();
        doc.moveDown(4);
      }
    };

    const snapshot = report.businessSnapshot || {};

    // COVER
    addLogo();

    doc.moveDown(5);

    doc
      .fontSize(26)
      .fillColor(blue)
      .text("AEMA Growth Blueprint Report", { align: "center" });

    doc.moveDown(0.5);

    doc
      .fontSize(12)
      .fillColor(grey)
      .text("Prepared by AEMA Systems", { align: "center" });

    doc.moveDown(2);

    doc.fontSize(12).fillColor(dark);
    doc.text(`Business: ${snapshot.businessType || "Not provided"}`, {
      align: "center",
    });
    doc.text(`Goal: ${snapshot.goal || "Not provided"}`, {
      align: "center",
    });
    doc.text(`Lead Source: ${snapshot.leadSource || "Not provided"}`, {
      align: "center",
    });
    doc.text(`Website: ${snapshot.websiteStatus || "Not provided"}`, {
      align: "center",
    });

    if (snapshot.websiteUrl) {
      doc.text(`Website URL: ${snapshot.websiteUrl}`, { align: "center" });
    }

    doc.moveDown(2);

    doc
      .fontSize(40)
      .fillColor(sky)
      .text(`${report.growthScore || 0}/100`, { align: "center" });

    doc
      .fontSize(12)
      .fillColor(grey)
      .text("Business Growth Score", { align: "center" });

    // BODY
    doc.addPage();
    addLogo();
    doc.moveDown(4);

    addTitle("Executive Summary");
    addText(report.executiveSummary || "No executive summary available.");

    addTitle("Business Snapshot");
    addText(`Business Type: ${snapshot.businessType || "Not provided"}`);
    addText(`Goal: ${snapshot.goal || "Not provided"}`);
    addText(`Lead Source: ${snapshot.leadSource || "Not provided"}`);
    addText(`Website Status: ${snapshot.websiteStatus || "Not provided"}`);

    if (snapshot.websiteUrl) addText(`Website URL: ${snapshot.websiteUrl}`);
    if (snapshot.biggestChallenge) addText(`Biggest Challenge: ${snapshot.biggestChallenge}`);
    if (snapshot.monthlyCustomers) addText(`Monthly Customers: ${snapshot.monthlyCustomers}`);
    if (snapshot.teamSize) addText(`Team Size: ${snapshot.teamSize}`);
    if (snapshot.businessAge) addText(`Business Age: ${snapshot.businessAge}`);

    addTitle("Growth Score");
    doc.fontSize(24).fillColor(sky).text(`${report.growthScore || 0}/100`);
    addText("This score is based on the information collected from your AEMA AI assessment.");

    const sections = [
      ["Strengths", report.strengths],
      ["Weaknesses", report.weaknesses],
      ["Opportunities", report.opportunities],
      ["Risks", report.risks],
      ["Website Analysis", report.websiteAnalysis],
      ["Marketing Analysis", report.marketingAnalysis],
      ["Automation Analysis", report.automationAnalysis],
      ["Business Systems Analysis", report.businessSystemsAnalysis],
      ["30-Day Action Plan", report.actionPlan30Days],
      ["Recommended AEMA Services", report.recommendedServices],
      ["Next Steps", report.nextSteps],
    ];

    sections.forEach(([title, items]) => {
      checkPageSpace();
      addList(title, items);
    });

    doc.end();
  } catch (error) {
    console.error("PDF generation error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not generate PDF.",
    });
  }
};