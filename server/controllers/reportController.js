import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoPath = path.join(__dirname, "../assets/aema-logo.png");

const safeText = (value) => {
  if (Array.isArray(value)) return value.join(", ");
  if (value === null || value === undefined || value === "") return "Not provided";
  if (typeof value === "object") return value.title || value.summary || JSON.stringify(value);
  return String(value);
};

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
      bufferPages: true,
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
        doc.image(logoPath, 50, 35, { fit: [110, 55] });
      } else {
        doc.fontSize(18).fillColor(blue).text("AEMA SYSTEMS", 50, 45);
      }
    };

    const ensureSpace = (space = 90) => {
      if (doc.y + space > doc.page.height - 60) {
        doc.addPage();
        addLogo();
        doc.moveDown(4);
      }
    };

    const addTitle = (title) => {
      ensureSpace(60);
      doc.moveDown(0.7);
      doc.fontSize(16).fillColor(blue).text(title);
      doc.moveDown(0.4);
    };

    const addText = (value) => {
      ensureSpace(45);
      doc.fontSize(11).fillColor(dark).text(safeText(value), {
        lineGap: 4,
      });
      doc.moveDown(0.35);
    };

    const addList = (title, items = []) => {
      if (!items || items.length === 0) return;

      addTitle(title);

      items.forEach((item) => {
        ensureSpace(45);

        const value =
          typeof item === "object"
            ? item.title || item.opportunity || item.rationale || JSON.stringify(item)
            : item;

        doc.fontSize(11).fillColor(dark).text(`• ${safeText(value).replace(/[^\x20-\x7E]/g, "")}`, {
          indent: 12,
          lineGap: 5,
        });
      });
    };

    const snapshot = report.businessSnapshot || {};

    addLogo();

    doc.moveDown(5);

    doc
      .fontSize(26)
      .fillColor(blue)
      .text(report.title || "AEMA Growth Blueprint Report", {
        align: "center",
      });

    doc.moveDown(0.5);

    doc
      .fontSize(12)
      .fillColor(grey)
      .text("Prepared by AEMA Systems", { align: "center" });

    doc.moveDown(2);

    doc.fontSize(12).fillColor(dark);
    doc.text(`Business: ${snapshot.businessName || snapshot.businessType || "Not provided"}`, {
      align: "center",
    });
    doc.text(`Industry: ${snapshot.industry || "Not provided"}`, {
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

    doc.addPage();
    addLogo();
    doc.moveDown(4);

    addTitle("Executive Summary");
    if (Array.isArray(report.executiveSummary)) {
      report.executiveSummary.forEach(addText);
    } else {
      addText(report.executiveSummary || "No executive summary available.");
    }

    addTitle("Business Snapshot");
    addText(`Business Type: ${snapshot.businessType || "Not provided"}`);
    addText(`Industry: ${snapshot.industry || "Not provided"}`);
    addText(`Main Offer: ${snapshot.mainOffer || "Not provided"}`);
    addText(`Goal: ${snapshot.goal || "Not provided"}`);
    addText(`Lead Source: ${snapshot.leadSource || "Not provided"}`);
    addText(`Website Status: ${snapshot.websiteStatus || "Not provided"}`);
    if (snapshot.websiteUrl) addText(`Website URL: ${snapshot.websiteUrl}`);
    if (snapshot.biggestChallenge) addText(`Biggest Challenge: ${snapshot.biggestChallenge}`);
    if (snapshot.monthlyCustomers) addText(`Monthly Customers: ${snapshot.monthlyCustomers}`);
    if (snapshot.monthlyRevenue) addText(`Monthly Revenue: ${snapshot.monthlyRevenue}`);
    if (snapshot.teamSize) addText(`Team Size: ${snapshot.teamSize}`);
    if (snapshot.businessStage) addText(`Business Stage: ${snapshot.businessStage}`);
    if (snapshot.salesProcess) addText(`Sales Process: ${snapshot.salesProcess}`);
    if (snapshot.marketingChannels) addText(`Marketing Channels: ${snapshot.marketingChannels}`);

    addTitle("Growth Score");
    doc.fontSize(24).fillColor(sky).text(`${report.growthScore || 0}/100`);
    addText(`Growth Potential: ${report.growthPotential || "Not provided"}`);
    addText("This score is based on the information collected from your AEMA AI assessment.");

    addList("Scoring Notes", report.scoringNotes);
    addList("Strengths", report.strengths);
    addList("Weaknesses", report.weaknesses);
    addList("Opportunities", report.opportunities);
    addList("Risks", report.risks);
    addList("Website Analysis", report.websiteAnalysis);
    addList("Marketing Analysis", report.marketingAnalysis);
    addList("Automation Analysis", report.automationAnalysis);
    addList("Business Systems Analysis", report.businessSystemsAnalysis);
    addList("30-Day Action Plan", report.actionPlan30Days);
    addList("Recommended AEMA Services", report.recommendedServices);
    addList("Next Steps", report.nextSteps);

    doc.end();
  } catch (error) {
    console.error("PDF generation error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not generate PDF.",
      error: error.message,
    });
  }
};