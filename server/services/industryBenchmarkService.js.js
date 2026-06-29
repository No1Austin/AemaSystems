// server/services/competitorInsightService.js

const includes = (value = "", words = []) => {
  const text = String(value || "").toLowerCase();
  return words.some((word) => text.includes(word.toLowerCase()));
};

export const generateCompetitorInsights = (profile = {}) => {
  const insights = [];

  const business = profile.businessType || "";
  const website = profile.websiteStatus || "";
  const leadSource = profile.leadSource || "";
  const customers = profile.monthlyCustomers || "";

  // ==========================
  // CLOTHING
  // ==========================

  if (includes(business, ["clothing", "fashion"])) {
    insights.push(
      "Successful clothing brands typically invest heavily in professional product photography, consistent branding, Instagram and TikTok content, customer reviews, and a fast online checkout experience."
    );

    insights.push(
      "Many growing fashion businesses increase repeat purchases through email marketing, loyalty programs, abandoned-cart recovery, and seasonal promotions."
    );
  }

  // ==========================
  // BARBER
  // ==========================

  if (includes(business, ["barber", "salon"])) {
    insights.push(
      "High-performing barber shops usually offer online booking, automated appointment reminders, Google reviews, loyalty rewards, and active social media showcasing customer transformations."
    );
  }

  // ==========================
  // CLEANING
  // ==========================

  if (includes(business, ["cleaning"])) {
    insights.push(
      "Leading cleaning companies generate consistent leads through Google Business Profile optimization, local SEO, customer testimonials, and instant quote request forms."
    );
  }

  // ==========================
  // RESTAURANT
  // ==========================

  if (includes(business, ["restaurant", "food"])) {
    insights.push(
      "Successful restaurants typically focus on Google reviews, attractive food photography, online ordering, reservations, and repeat customer promotions."
    );
  }

  // ==========================
  // REAL ESTATE
  // ==========================

  if (includes(business, ["real estate"])) {
    insights.push(
      "Successful real estate businesses rely on CRM systems, automated lead nurturing, educational content, local SEO, and rapid response to new inquiries."
    );
  }

  // ==========================
  // DIGITAL / SOFTWARE
  // ==========================

  if (
    includes(business, [
      "software",
      "technology",
      "digital",
      "web",
      "app",
    ])
  ) {
    insights.push(
      "Successful digital businesses focus on publishing case studies, demonstrating results, collecting testimonials, and creating educational content that builds trust before a sales conversation."
    );
  }

  // ==========================
  // WEBSITE
  // ==========================

  if (website === "No Website") {
    insights.push(
      "Businesses with a professional website generally have greater credibility, generate more qualified inquiries, and are easier for new customers to discover online."
    );
  }

  // ==========================
  // REFERRALS
  // ==========================

  if (leadSource === "Referrals") {
    insights.push(
      "Businesses that grow beyond referrals usually combine customer recommendations with Google search visibility, social proof, local SEO, and follow-up systems."
    );
  }

  // ==========================
  // EARLY STAGE
  // ==========================

  if (
    includes(customers, [
      "under 20",
      "20-100",
    ])
  ) {
    insights.push(
      "Businesses at this stage usually achieve faster growth by improving customer acquisition systems before investing heavily in expansion."
    );
  }

  // ==========================
  // DEFAULT
  // ==========================

  if (!insights.length) {
    insights.push(
      "Growing businesses usually outperform competitors by improving customer experience, building stronger systems, measuring performance, and creating consistent marketing rather than relying on one acquisition channel."
    );
  }

  return insights;
};