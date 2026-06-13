import axios from "axios";

const normalizeUrl = (url = "") => {
  let cleanUrl = String(url).trim();

  if (!cleanUrl) return null;

  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = `https://${cleanUrl}`;
  }

  return cleanUrl;
};

const countMatches = (html = "", regex) => {
  const matches = html.match(regex);
  return matches ? matches.length : 0;
};

export const auditWebsite = async (websiteUrl) => {
  const url = normalizeUrl(websiteUrl);

  if (!url) {
    return {
      available: false,
      url: null,
      findings: ["No website URL was provided."],
      recommendations: ["Add a business website to improve trust and lead generation."],
    };
  }

  try {
    const response = await axios.get(url, {
      timeout: 8000,
      maxRedirects: 5,
      headers: {
        "User-Agent": "AEMAWebsiteAuditBot/1.0",
      },
    });

    const html = response.data || "";

    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const metaDescriptionMatch = html.match(
      /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i
    );

    const h1Count = countMatches(html, /<h1[\s>]/gi);
    const imageCount = countMatches(html, /<img[\s>]/gi);
    const imagesWithAlt = countMatches(html, /<img[^>]+alt=["'][^"']+["'][^>]*>/gi);
    const missingAltCount = Math.max(imageCount - imagesWithAlt, 0);

    const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
    const hasForms = /<form[\s>]/i.test(html);
    const hasPhone = /tel:/i.test(html);
    const hasEmail = /mailto:/i.test(html);
    const hasWhatsApp = /wa\.me|whatsapp/i.test(html);
    const hasCTA = /book|call|contact|quote|buy|shop|get started|schedule/i.test(html);

    const findings = [];
    const recommendations = [];

    if (titleMatch?.[1]) {
      findings.push(`Page title detected: "${titleMatch[1].trim()}".`);
    } else {
      findings.push("No page title was detected.");
      recommendations.push("Add a clear SEO title tag that includes your business name and main service.");
    }

    if (metaDescriptionMatch?.[1]) {
      findings.push("Meta description detected.");
    } else {
      findings.push("Meta description appears to be missing.");
      recommendations.push("Add a strong meta description to improve search appearance and click-through rate.");
    }

    if (h1Count === 0) {
      findings.push("No H1 heading was detected.");
      recommendations.push("Add one clear H1 headline that explains what the business does.");
    } else if (h1Count > 1) {
      findings.push(`Multiple H1 headings detected (${h1Count}).`);
      recommendations.push("Use one main H1 and structure the rest of the page with H2/H3 headings.");
    } else {
      findings.push("One H1 heading detected.");
    }

    if (!hasViewport) {
      findings.push("Mobile viewport tag appears to be missing.");
      recommendations.push("Add a viewport tag to improve mobile responsiveness.");
    } else {
      findings.push("Mobile viewport tag detected.");
    }

    if (missingAltCount > 0) {
      findings.push(`${missingAltCount} image(s) may be missing alt text.`);
      recommendations.push("Add descriptive alt text to important images for SEO and accessibility.");
    }

    if (!hasForms && !hasPhone && !hasEmail && !hasWhatsApp) {
      findings.push("No obvious lead capture method was detected.");
      recommendations.push("Add a contact form, booking form, phone link, WhatsApp link, or quote request button.");
    } else {
      findings.push("At least one contact or lead capture method was detected.");
    }

    if (!hasCTA) {
      findings.push("No strong call-to-action was clearly detected.");
      recommendations.push("Add clear calls-to-action such as Book Now, Request a Quote, Contact Us, or Buy Now.");
    } else {
      findings.push("Call-to-action language was detected.");
    }

    return {
      available: true,
      url,
      status: response.status,
      title: titleMatch?.[1]?.trim() || null,
      metaDescription: metaDescriptionMatch?.[1]?.trim() || null,
      h1Count,
      imageCount,
      missingAltCount,
      hasViewport,
      hasForms,
      hasPhone,
      hasEmail,
      hasWhatsApp,
      hasCTA,
      findings,
      recommendations,
    };
  } catch (error) {
    return {
      available: false,
      url,
      findings: [
        "AEMA could not fully access the website during this audit.",
      ],
      recommendations: [
        "Check that the website is live, secure, and accessible without blocking automated audits.",
        "A manual review may be needed for deeper website analysis.",
      ],
      error: error.message,
    };
  }
};