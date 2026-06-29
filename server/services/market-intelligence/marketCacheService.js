// server/services/market-intelligence/marketCacheService.js

import pool from "../../db/pool.js";

const normalize = (value = "") =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

export const buildMarketCacheKey = ({
  businessName,
  businessType,
  location,
}) => {
  return [
    normalize(businessName || "unknown-business"),
    normalize(businessType || "unknown-type"),
    normalize(location || "unknown-location"),
  ].join("|");
};

export const getCachedMarketIntelligence = async (cacheKey) => {
  const result = await pool.query(
    `
    SELECT data
    FROM market_intelligence_cache
    WHERE cache_key = $1
      AND expires_at > NOW()
    LIMIT 1;
    `,
    [cacheKey]
  );

  return result.rows[0]?.data || null;
};

export const saveMarketIntelligenceCache = async ({
  cacheKey,
  businessName,
  businessType,
  location,
  data,
  ttlDays = 30,
}) => {
  await pool.query(
    `
    INSERT INTO market_intelligence_cache (
      cache_key,
      business_name,
      business_type,
      location,
      data,
      expires_at
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      NOW() + ($6 || ' days')::INTERVAL
    )
    ON CONFLICT (cache_key)
    DO UPDATE SET
      data = EXCLUDED.data,
      generated_at = NOW(),
      expires_at = EXCLUDED.expires_at;
    `,
    [cacheKey, businessName, businessType, location, data, ttlDays]
  );
};