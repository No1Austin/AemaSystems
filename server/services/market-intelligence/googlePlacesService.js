// server/services/market-intelligence/googlePlacesService.js

import axios from "axios";

const GOOGLE_PLACES_URL = "https://places.googleapis.com/v1/places:searchText";

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.rating",
  "places.userRatingCount",
  "places.websiteUri",
  "places.googleMapsUri",
  "places.nationalPhoneNumber",
  "places.location",
  "places.businessStatus",
  "places.primaryType",
  "places.types",
].join(",");

const getApiKey = () => {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  return key && key.startsWith("AIza") ? key : null;
};

const normalize = (value = "") =>
  String(value || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const getMatchScore = (place = {}, businessName = "", location = "") => {
  const placeName = normalize(place.displayName?.text);
  const targetName = normalize(businessName);
  const address = normalize(place.formattedAddress);
  const targetLocation = normalize(location);

  let score = 0;

  if (placeName === targetName) score += 70;
  else if (placeName.includes(targetName)) score += 50;
  else if (targetName.includes(placeName)) score += 35;

  if (targetLocation && address.includes(targetLocation)) score += 20;

  if (place.websiteUri) score += 5;
  if (place.rating) score += 3;
  if (place.userRatingCount) score += 2;

  return score;
};

const formatPlace = (place = {}) => ({
  googlePlaceId: place.id || null,
  name: place.displayName?.text || null,
  address: place.formattedAddress || null,
  rating: typeof place.rating === "number" ? place.rating : null,
  reviewCount:
    typeof place.userRatingCount === "number" ? place.userRatingCount : 0,
  website: place.websiteUri || null,
  googleMapsUrl: place.googleMapsUri || null,
  phone: place.nationalPhoneNumber || null,
  businessStatus: place.businessStatus || null,
  primaryType: place.primaryType || null,
  types: place.types || [],
  location: place.location || null,
});

const searchPlaces = async ({ textQuery, limit = 10 }) => {
  const apiKey = getApiKey();

  if (!apiKey) {
    return {
      success: false,
      error: "GOOGLE_PLACES_API_KEY is not configured or invalid.",
      places: [],
    };
  }

  const response = await axios.post(
    GOOGLE_PLACES_URL,
    {
      textQuery,
      maxResultCount: Math.min(Number(limit) || 10, 20),
      languageCode: "en",
      regionCode: "CA",
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      timeout: 15000,
    }
  );

  return {
    success: true,
    query: textQuery,
    places: response.data?.places || [],
  };
};

export const searchExactBusiness = async ({
  businessName,
  location,
  limit = 5,
}) => {
  if (!businessName || !location) {
    return {
      success: false,
      found: false,
      error: "Business name and location are required.",
      business: null,
      candidates: [],
    };
  }

  try {
    const textQuery = `${businessName} ${location}`;
    const result = await searchPlaces({ textQuery, limit });

    const candidates = result.places.map((place) => ({
      ...formatPlace(place),
      matchScore: getMatchScore(place, businessName, location),
    }));

    const bestMatch = [...candidates].sort(
      (a, b) => b.matchScore - a.matchScore
    )[0];

    const found = Boolean(bestMatch && bestMatch.matchScore >= 65);

    return {
      success: true,
      found,
      query: textQuery,
      business: found ? bestMatch : null,
      candidates,
      confidence: bestMatch?.matchScore || 0,
    };
  } catch (error) {
    console.error("Exact Google Business search error:", error.message);
    console.dir(error.response?.data, { depth: null });

    return {
      success: false,
      found: false,
      error:
        error.response?.data?.error?.message ||
        error.message ||
        "Exact business lookup failed.",
      business: null,
      candidates: [],
    };
  }
};

export const searchSimilarBusinesses = async ({
  businessType,
  location,
  limit = 20,
}) => {
  if (!businessType || !location) {
    return {
      success: false,
      error: "Business type and location are required.",
      competitors: [],
    };
  }

  try {
    const textQuery = `${businessType} in ${location}`;
    const result = await searchPlaces({ textQuery, limit });

    const competitors = result.places.map(formatPlace);

    return {
      success: true,
      query: textQuery,
      count: competitors.length,
      competitors,
    };
  } catch (error) {
    console.error("Google Places competitor search error:", error.message);
    console.dir(error.response?.data, { depth: null });

    return {
      success: false,
      error:
        error.response?.data?.error?.message ||
        error.message ||
        "Competitor lookup failed.",
      competitors: [],
    };
  }
};