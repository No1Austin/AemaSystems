// server/services/market-intelligence/competitorAnalyzer.js

const average = (numbers = []) => {
  const valid = numbers.filter((num) => typeof num === "number" && !Number.isNaN(num));
  if (!valid.length) return null;
  return Number((valid.reduce((sum, value) => sum + value, 0) / valid.length).toFixed(2));
};

const percentage = (count, total) => {
  if (!total) return 0;
  return Math.round((count / total) * 100);
};

export const analyzeCompetitors = (competitors = []) => {
  const total = competitors.length;
  const withWebsite = competitors.filter((item) => item.website).length;
  const withPhone = competitors.filter((item) => item.phone).length;
  const activeBusinesses = competitors.filter(
    (item) => item.businessStatus === "OPERATIONAL"
  ).length;

  const ratings = competitors
    .map((item) => item.rating)
    .filter((rating) => typeof rating === "number");

  const reviewCounts = competitors
    .map((item) => item.reviewCount)
    .filter((count) => typeof count === "number");

  const topCompetitors = [...competitors]
    .sort((a, b) => {
      const bScore = (b.rating || 0) * 20 + Math.min(b.reviewCount || 0, 500) / 10;
      const aScore = (a.rating || 0) * 20 + Math.min(a.reviewCount || 0, 500) / 10;
      return bScore - aScore;
    })
    .slice(0, 5);

  return {
    totalCompetitorsFound: total,
    activeBusinesses,
    averageRating: average(ratings),
    averageReviewCount: average(reviewCounts),
    highestReviewCount: reviewCounts.length ? Math.max(...reviewCounts) : null,
    websitePresencePercent: percentage(withWebsite, total),
    phonePresencePercent: percentage(withPhone, total),
    topCompetitors,
  };
};
