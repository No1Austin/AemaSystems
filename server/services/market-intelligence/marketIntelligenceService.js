// server/services/market-intelligence/marketIntelligenceService.js

import {
  searchExactBusiness,
  searchSimilarBusinesses,
} from "./googlePlacesService.js";

import { analyzeCompetitors } from "./competitorAnalyzer.js";

import {
  buildMarketCacheKey,
  getCachedMarketIntelligence,
  saveMarketIntelligenceCache,
} from "./marketCacheService.js";

const log = (...args) => {
  console.log("🌍 MARKET INTELLIGENCE:", ...args);
};

const unavailableResponse = (reason, debug = {}) => ({
  available: false,
  fromCache: false,
  source: null,
  query: null,
  reason:
    reason ||
    "Market intelligence is currently unavailable. This report uses AEMA internal business analysis only.",
  debug,
  googleBusinessProfile: null,
  googleBusinessFound: false,
  googleBusinessConfidence: 0,
  googleBusinessCandidates: [],
  marketingSurvey: [],
  businessSurvey: [],
  geoSurvey: [],
  marketOpportunities: [],
  marketRisks: [],
  competitorStats: null,
  competitors: [],
  marketScore: null,
  dataLimitations: ["No live competitor dataset was available for this report."],
});

const normalizeSearchTerm = (value = "") =>
  String(value || "")
    .replace(/\s*\/\s*/g, " ")
    .replace(/\bBusiness\b/gi, "")
    .replace(/\bService\b/gi, "")
    .replace(/\bServices\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

const getSearchTerm = (profile = {}) =>
  normalizeSearchTerm(profile.businessType) ||
  normalizeSearchTerm(profile.industry) ||
  normalizeSearchTerm(profile.mainOffer) ||
  normalizeSearchTerm(profile.business) ||
  normalizeSearchTerm(profile.service);

const getLocation = (profile = {}) =>
  String(
    profile.serviceLocation ||
      profile.location ||
      profile.city ||
      profile.address ||
      profile.targetLocation ||
      ""
  ).trim();

const getBusinessName = (profile = {}) =>
  String(profile.businessName || profile.name || profile.companyName || "").trim();

const buildMarketScore = (stats = {}) => {
  const competitorCount = stats.totalCompetitorsFound || 0;
  const websitePercent = stats.websitePresencePercent || 0;
  const averageReviewCount = stats.averageReviewCount || 0;
  const averageRating = stats.averageRating || 0;

  const competitionLevel =
    competitorCount >= 15 ? "high" : competitorCount >= 7 ? "moderate" : "low";

  const reviewStrength =
    averageReviewCount >= 150
      ? "high"
      : averageReviewCount >= 50
      ? "moderate"
      : "early or low";

  const competitionScore =
    competitorCount >= 15 ? 80 : competitorCount >= 7 ? 60 : 40;

  const digitalCompetitionScore =
    websitePercent >= 80 ? 85 : websitePercent >= 50 ? 65 : 45;

  const reviewCompetitionScore =
    averageReviewCount >= 150 ? 85 : averageReviewCount >= 50 ? 65 : 45;

  const reputationScore =
    averageRating >= 4.6
      ? 85
      : averageRating >= 4.2
      ? 70
      : averageRating
      ? 55
      : 40;

  const marketOpportunityScore = Math.round(
    (100 - digitalCompetitionScore) * 0.25 +
      (100 - reviewCompetitionScore) * 0.2 +
      reputationScore * 0.25 +
      competitionScore * 0.3
  );

  return {
    competitionLevel,
    reviewStrength,
    competitionScore,
    digitalCompetitionScore,
    reviewCompetitionScore,
    reputationScore,
    marketOpportunityScore,
  };
};

export const generateMarketIntelligence = async (profile = {}) => {
  try {
    log("Function reached.");
    log("Raw profile:", JSON.stringify(profile, null, 2));

    const hasGoogleKey = Boolean(process.env.GOOGLE_PLACES_API_KEY);

    log("Google key exists:", hasGoogleKey);

    if (!hasGoogleKey) {
      return unavailableResponse(
        "Google Places API key is not configured. Market intelligence was skipped.",
        { hasGoogleKey }
      );
    }

    const businessName = getBusinessName(profile);
    const searchTerm = getSearchTerm(profile);
    const location = getLocation(profile);

    log("Business name:", businessName || "N/A");
    log("Search term:", searchTerm || "MISSING");
    log("Location:", location || "MISSING");

    if (!searchTerm) {
      return unavailableResponse(
        "Business type, industry, or main offer is required for market intelligence.",
        { businessName, searchTerm, location }
      );
    }

    if (!location) {
      return unavailableResponse(
        "Service location is required for market intelligence.",
        { businessName, searchTerm, location }
      );
    }

    const cacheKey = buildMarketCacheKey({
      businessName,
      businessType: searchTerm,
      location,
    });

    log("Cache key:", cacheKey);

    const cached = await getCachedMarketIntelligence(cacheKey);

    if (cached) {
      log("Returning cached market intelligence. Google was not called.");
      return {
        ...cached,
        fromCache: true,
      };
    }

    let googleBusinessProfile = null;
    let googleBusinessFound = false;
    let googleBusinessConfidence = 0;
    let googleBusinessCandidates = [];

    if (businessName) {
      log("Calling Google exact business search...");

      const exactBusiness = await searchExactBusiness({
        businessName,
        location,
        limit: 5,
      });

      log("Exact business result:", JSON.stringify(exactBusiness, null, 2));

      googleBusinessFound = exactBusiness?.found || false;
      googleBusinessProfile = exactBusiness?.business || null;
      googleBusinessConfidence = exactBusiness?.confidence || 0;
      googleBusinessCandidates = exactBusiness?.candidates || [];
    } else {
      log("No business name provided. Skipping exact business search.");
    }

    log("Calling Google similar businesses search...");

    const placesResult = await searchSimilarBusinesses({
      businessType: searchTerm,
      location,
      limit: 20,
    });

    log("Similar businesses result:", JSON.stringify(placesResult, null, 2));

    if (!placesResult?.success) {
      return unavailableResponse(
        placesResult?.error ||
          "Google Places competitor lookup failed. Market intelligence was skipped.",
        {
          businessName,
          searchTerm,
          location,
          placesResult,
        }
      );
    }

    const competitors = placesResult.competitors || [];

    const filteredCompetitors = googleBusinessProfile
      ? competitors.filter(
          (item) => item.googlePlaceId !== googleBusinessProfile.googlePlaceId
        )
      : competitors;

    log("Competitors found:", competitors.length);
    log("Competitors after filtering:", filteredCompetitors.length);

    if (!filteredCompetitors.length) {
      return unavailableResponse(
        "No similar businesses were returned from the Google Places search.",
        {
          businessName,
          searchTerm,
          location,
          query: placesResult.query,
        }
      );
    }

    const stats = analyzeCompetitors(filteredCompetitors);
    const marketScore = buildMarketScore(stats);

    const marketData = {
      available: true,
      fromCache: false,
      source: "Google Places API",
      query: placesResult.query,
      generatedAt: new Date().toISOString(),

      googleBusinessFound,
      googleBusinessProfile,
      googleBusinessConfidence,
      googleBusinessCandidates,

      competitors: filteredCompetitors,
      competitorStats: stats,
      marketScore,

      marketingSurvey: [
        `${stats.totalCompetitorsFound} similar visible businesses were identified from Google Places competitor data.`,
        `${stats.websitePresencePercent}% of returned competitors have a website listed on Google.`,
        `The average Google rating among returned competitors is ${
          stats.averageRating || "not available"
        }.`,
        `The average Google review count is ${
          stats.averageReviewCount || "not available"
        }, suggesting ${marketScore.reviewStrength} review competition.`,
      ],

      businessSurvey: [
        googleBusinessFound && googleBusinessProfile
          ? `AEMA found a likely Google Business Profile for ${
              googleBusinessProfile.name
            } with rating ${
              googleBusinessProfile.rating || "N/A"
            } and ${googleBusinessProfile.reviewCount || 0} reviews.`
          : "AEMA could not confidently identify the business's own Google Business Profile from the provided name and location.",
        `${stats.activeBusinesses} returned competitors were marked as operational in Google Places results.`,
        `${stats.phonePresencePercent}% of returned competitors have a phone number listed.`,
        `The highest observed review count among returned competitors is ${
          stats.highestReviewCount || "not available"
        }.`,
      ].filter(Boolean),

      marketInsights: [
        stats.averageReviewCount > 300
          ? "Customers in this market rely heavily on Google reviews before choosing a business."
          : "Google reviews are becoming increasingly important and represent an opportunity to stand out.",

        stats.websitePresencePercent >= 80
          ? "Most competitors already have websites, making website quality and conversion critical differentiators."
          : "Many competitors still have limited digital presence, creating an opportunity for a stronger online strategy.",

        googleBusinessFound &&
        googleBusinessProfile?.reviewCount > stats.averageReviewCount
          ? "Your Google Business Profile appears to outperform the local average, giving you a valuable trust advantage."
          : "Building your Google reputation should be treated as a growth priority.",

        stats.averageRating >= 4.7
          ? "Customer expectations are very high in this market, so maintaining service quality is essential."
          : "Businesses that consistently deliver excellent customer experiences can differentiate themselves quickly.",

        "The businesses that combine strong reviews, an optimized website, and a simple online booking experience are most likely to outperform competitors.",
      ],

      marketOpportunities: [
        googleBusinessFound &&
        googleBusinessProfile?.reviewCount > stats.averageReviewCount
          ? "The business appears to have stronger Google review volume than the local competitor average, which should be used as a major trust asset."
          : "The business should strengthen Google reviews, website credibility, and local trust signals.",
        stats.websitePresencePercent >= 70
          ? "Because many visible competitors have websites, website quality, SEO, and conversion are important differentiators."
          : "A stronger website may create an advantage because many returned competitors do not have websites listed.",
        "The business should compare its website, contact process, and Google visibility against the strongest visible competitors.",
      ],

      marketRisks: [
        marketScore.competitionLevel === "high"
          ? "The market appears competitive, so the business needs strong positioning, reviews, local SEO, and a clear offer."
          : "The market may still have room for stronger local positioning if the business improves visibility and trust signals.",
        stats.websitePresencePercent >= 70
          ? "Many competitors already have websites, so a weak website could reduce trust and conversion."
          : "Even where competitors have weaker websites, poor follow-up or low Google visibility can still reduce growth.",
        stats.averageReviewCount >= 50
          ? "Competitors have meaningful review volume, so the business needs a consistent review generation strategy."
          : "Review competition appears manageable, but the business should build review volume before competitors move faster.",
      ],

      dataLimitations: [
        "Google Places does not provide exact revenue, profit, staffing, or customer volume.",
        "The competitor count is a search result sample, not a complete market census.",
        "Exact business profile matching is based on business name, location, and public Google Places data.",
      ],
    };

    await saveMarketIntelligenceCache({
      cacheKey,
      businessName,
      businessType: searchTerm,
      location,
      data: marketData,
      ttlDays: 30,
    });

    log("Market intelligence completed successfully.");

    return marketData;
  } catch (error) {
    console.error("❌ Market intelligence error:", error);

    return unavailableResponse(
      "Market intelligence failed unexpectedly. This report uses AEMA internal business analysis only.",
      {
        error: error.message,
      }
    );
  }
};