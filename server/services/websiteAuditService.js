// server/services/websiteAuditService.js

import axios from "axios";

const normalizeUrl = (url = "") => {
  let cleanUrl = String(url || "").trim();

  if (!cleanUrl) return null;

  cleanUrl = cleanUrl.replace(/\s+/g, "");

  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = `https://${cleanUrl}`;
  }

  return cleanUrl;
};

const countMatches = (html = "", regex) => {
  const matches = String(html || "").match(regex);
  return matches ? matches.length : 0;
};

const getMetaContent = (html = "", name = "") => {
  const regex = new RegExp(
    `<meta[^>]+name=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`,
    "i"
  );

  return html.match(regex)?.[1]?.trim() || null;
};

const hasText = (html = "", words = []) => {
  const clean = String(html || "").toLowerCase();
  return words.some((word) => clean.includes(String(word).toLowerCase()));
};

export const auditWebsite = async (websiteUrl) => {
  const url = normalizeUrl(websiteUrl);

  if (!url) {
    return {
      available: false,
      url: null,
      score: 0,
      findings: ["No website URL was provided."],
      recommendations: [
        "Add a business website to improve credibility, trust, search visibility, and lead generation.",
      ],
    };
  }

  try {
    const startTime = Date.now();

    const response = await axios.get(url, {
      timeout: 10000,
      maxRedirects: 5,
      headers: {
        "User-Agent": "AEMAWebsiteAuditBot/1.0",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      validateStatus: (status) => status >= 200 && status < 500,
    });

    const loadTimeMs = Date.now() - startTime;
    const html = String(response.data || "");

    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const title = titleMatch?.[1]?.replace(/\s+/g, " ").trim() || null;

    const metaDescription = getMetaContent(html, "description");

    const h1Count = countMatches(html, /<h1[\s>]/gi);
    const h2Count = countMatches(html, /<h2[\s>]/gi);

    const imageCount = countMatches(html, /<img[\s>]/gi);
    const imagesWithAlt = countMatches(
      html,
      /<img[^>]+alt=["'][^"']+["'][^>]*>/gi
    );
    const missingAltCount = Math.max(imageCount - imagesWithAlt, 0);

    const linkCount = countMatches(html, /<a[\s>]/gi);
    const scriptCount = countMatches(html, /<script[\s>]/gi);

    const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
    const hasCanonical = /<link[^>]+rel=["']canonical["']/i.test(html);

    const hasForms = /<form[\s>]/i.test(html);
    const hasPhone = /tel:/i.test(html);
    const hasEmail = /mailto:/i.test(html);
    const hasWhatsApp = /wa\.me|api\.whatsapp|whatsapp/i.test(html);

    const hasCTA = hasText(html, [
      "book",
      "call",
      "contact",
      "quote",
      "buy",
      "shop",
      "get started",
      "schedule",
      "request",
      "consultation",
      "order",
      "subscribe",
    ]);

    const hasTrustSignals = hasText(html, [
      "testimonial",
      "testimonials",
      "review",
      "reviews",
      "google review",
      "trusted",
      "certified",
      "licensed",
      "portfolio",
      "case study",
      "clients",
    ]);

    const hasPricingSignal = hasText(html, [
      "pricing",
      "price",
      "packages",
      "plans",
      "rates",
      "starting at",
    ]);

    const hasSocialLinks = hasText(html, [
      "instagram.com",
      "facebook.com",
      "tiktok.com",
      "linkedin.com",
      "youtube.com",
      "x.com",
      "twitter.com",
    ]);

    const findings = [];
    const recommendations = [];
    let score = 100;

    if (response.status >= 400) {
      score -= 25;
      findings.push(`Website returned status code ${response.status}.`);
      recommendations.push(
        "Fix website availability or server response issues so visitors and search engines can access the site reliably."
      );
    }

    if (title) {
      findings.push(`Page title detected: "${title}".`);
      if (title.length < 20) {
        score -= 4;
        recommendations.push(
          "Expand the page title so it clearly includes the business name, main offer, and location or service focus."
        );
      }
    } else {
      score -= 10;
      findings.push("No page title was detected.");
      recommendations.push(
        "Add a clear SEO title tag that includes the business name and main service."
      );
    }

    if (metaDescription) {
      findings.push("Meta description detected.");
      if (metaDescription.length < 70) {
        score -= 3;
        recommendations.push(
          "Improve the meta description so it gives customers a stronger reason to click from search results."
        );
      }
    } else {
      score -= 8;
      findings.push("Meta description appears to be missing.");
      recommendations.push(
        "Add a strong meta description to improve search appearance and click-through rate."
      );
    }

    if (h1Count === 0) {
      score -= 8;
      findings.push("No H1 heading was detected.");
      recommendations.push(
        "Add one clear H1 headline that explains what the business does."
      );
    } else if (h1Count > 1) {
      score -= 3;
      findings.push(`Multiple H1 headings detected (${h1Count}).`);
      recommendations.push(
        "Use one main H1 and structure the rest of the page with H2/H3 headings."
      );
    } else {
      findings.push("One H1 heading detected.");
    }

    if (h2Count === 0) {
      score -= 3;
      findings.push("No H2 section headings were detected.");
      recommendations.push(
        "Add clear section headings for services, benefits, proof, process, pricing, FAQs, or contact information."
      );
    }

    if (!hasViewport) {
      score -= 8;
      findings.push("Mobile viewport tag appears to be missing.");
      recommendations.push(
        "Add a viewport tag to improve mobile responsiveness."
      );
    } else {
      findings.push("Mobile viewport tag detected.");
    }

    if (!hasCanonical) {
      score -= 2;
      findings.push("Canonical link was not clearly detected.");
      recommendations.push(
        "Add a canonical URL to support SEO consistency and reduce duplicate page issues."
      );
    }

    if (imageCount > 0 && missingAltCount > 0) {
      const ratio = missingAltCount / imageCount;
      score -= ratio > 0.5 ? 6 : 3;
      findings.push(`${missingAltCount} image(s) may be missing alt text.`);
      recommendations.push(
        "Add descriptive alt text to important images for SEO and accessibility."
      );
    }

    if (!hasForms && !hasPhone && !hasEmail && !hasWhatsApp) {
      score -= 12;
      findings.push("No obvious lead capture method was detected.");
      recommendations.push(
        "Add a contact form, booking form, phone link, WhatsApp link, or quote request button."
      );
    } else {
      findings.push("At least one contact or lead capture method was detected.");
    }

    if (!hasCTA) {
      score -= 10;
      findings.push("No strong call-to-action was clearly detected.");
      recommendations.push(
        "Add clear calls-to-action such as Book Now, Request a Quote, Contact Us, Buy Now, or Schedule a Consultation."
      );
    } else {
      findings.push("Call-to-action language was detected.");
    }

    if (!hasTrustSignals) {
      score -= 7;
      findings.push("No clear trust signals were detected.");
      recommendations.push(
        "Add testimonials, reviews, portfolio examples, certifications, case studies, or client proof to increase visitor trust."
      );
    } else {
      findings.push("Trust signals were detected.");
    }

    if (!hasPricingSignal) {
      findings.push("Pricing or package information was not clearly detected.");
      recommendations.push(
        "Consider adding pricing guidance, packages, starting rates, or a quote request path to reduce customer uncertainty."
      );
    }

    if (!hasSocialLinks) {
      findings.push("Social media links were not clearly detected.");
      recommendations.push(
        "Add relevant social media links if those channels support trust, proof, or customer communication."
      );
    }

    if (loadTimeMs > 5000) {
      score -= 8;
      findings.push(`Website response took about ${loadTimeMs}ms.`);
      recommendations.push(
        "Improve website speed by optimizing hosting, images, scripts, caching, and unnecessary third-party tools."
      );
    } else {
      findings.push(`Website response time was about ${loadTimeMs}ms.`);
    }

    if (scriptCount > 25) {
      score -= 3;
      findings.push(`High script count detected (${scriptCount}).`);
      recommendations.push(
        "Review unnecessary scripts because too many scripts can slow the page and hurt user experience."
      );
    }

    const finalScore = Math.max(0, Math.min(Math.round(score), 100));

    return {
      available: true,
      url,
      status: response.status,
      score: finalScore,
      health:
        finalScore >= 85
          ? "Strong"
          : finalScore >= 70
          ? "Good"
          : finalScore >= 55
          ? "Needs Improvement"
          : "Weak",

      title,
      metaDescription,
      h1Count,
      h2Count,
      imageCount,
      missingAltCount,
      linkCount,
      scriptCount,
      loadTimeMs,

      hasViewport,
      hasCanonical,
      hasForms,
      hasPhone,
      hasEmail,
      hasWhatsApp,
      hasCTA,
      hasTrustSignals,
      hasPricingSignal,
      hasSocialLinks,

      findings,
      recommendations: [...new Set(recommendations)],
    };
  } catch (error) {
    return {
      available: false,
      url,
      score: 0,
      health: "Unavailable",
      findings: ["AEMA could not fully access the website during this audit."],
      recommendations: [
        "Check that the website is live, secure, and accessible without blocking automated audits.",
        "A manual review may be needed for deeper website analysis.",
      ],
      error: error.message,
    };
  }
};