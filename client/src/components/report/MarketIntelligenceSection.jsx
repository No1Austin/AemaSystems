// client/src/components/report/MarketIntelligenceSection.jsx

import { MetricCard, ReportCard, SectionTitle } from "./ReportShell";
import { getPrimaryGoogleBusiness } from "./ReportUtils";
import ReportSection from "./ReportSection";

const hasItems = (items) => Array.isArray(items) && items.length > 0;

const buildFallbackInsights = ({ stats = {}, businessFound, googleBusiness }) => {
  const insights = [];

  if (stats.averageReviewCount) {
    insights.push(
      stats.averageReviewCount > 300
        ? "Customers in this market appear to rely heavily on Google reviews before choosing a business."
        : "Google reviews are important in this market and can help the business stand out."
    );
  }

  if (stats.websitePresencePercent !== undefined) {
    insights.push(
      stats.websitePresencePercent >= 80
        ? "Most visible competitors already have websites, so website quality and conversion matter more than simply having a website."
        : "Some competitors have limited digital presence, creating room for a stronger website and online booking strategy."
    );
  }

  if (businessFound && googleBusiness?.reviewCount > stats.averageReviewCount) {
    insights.push(
      "The business appears to have stronger review volume than the local competitor average, which can become a major trust advantage."
    );
  }

  insights.push(
    "Businesses that combine strong reviews, a clear website, and easy booking are better positioned to win customers in this market."
  );

  return insights;
};

export default function MarketIntelligenceSection({ data }) {
  if (!data?.available) return null;

  const stats = data.competitorStats || {};
  const googleBusiness = getPrimaryGoogleBusiness(data);
  const businessFound = Boolean(data.googleBusinessFound && googleBusiness);

  const websitePresence =
    stats.websitePresencePercent !== null &&
    stats.websitePresencePercent !== undefined &&
    stats.websitePresencePercent !== ""
      ? `${stats.websitePresencePercent}%`
      : "N/A";

  const marketInsights = hasItems(data.marketInsights)
    ? data.marketInsights
    : buildFallbackInsights({ stats, businessFound, googleBusiness });

  return (
    <ReportCard className="border-cyan-500/20 bg-cyan-500/10">
      <SectionTitle
        eyebrow="Market intelligence"
        title="Local Market Snapshot"
        description="AEMA compares the business with visible local competitors using public Google Business data."
      />

      <div className="mb-6 rounded-3xl border border-white/10 bg-[#020617]/40 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">
          Your Google Business Presence
        </p>

        {businessFound ? (
          <>
            <h4 className="mt-2 text-2xl font-bold text-white">
              {googleBusiness.name}
            </h4>

            <p className="mt-2 text-sm text-emerald-300">
              Verified likely match • Confidence {data.googleBusinessConfidence}%
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <MetricCard
                label="Rating"
                value={googleBusiness.rating || "N/A"}
                tone="emerald"
              />
              <MetricCard
                label="Reviews"
                value={googleBusiness.reviewCount || "N/A"}
                tone="blue"
              />
              <MetricCard
                label="Website Listed"
                value={googleBusiness.website ? "Yes" : "No"}
                tone="violet"
              />
            </div>
          </>
        ) : (
          <div className="mt-3 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
            <h4 className="text-xl font-bold text-white">
              Google Business Profile Not Confirmed
            </h4>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              AEMA could not confidently identify the business's own Google
              Business Profile from the provided name and location. Competitor
              analysis is still shown below.
            </p>
          </div>
        )}
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Competitors Found"
          value={stats.totalCompetitorsFound ?? "N/A"}
          note="Visible Google competitors"
          tone="blue"
        />
        <MetricCard
          label="Avg. Rating"
          value={stats.averageRating ?? "N/A"}
          note="Market trust level"
          tone="emerald"
        />
        <MetricCard
          label="Website Presence"
          value={websitePresence}
          note="Competitors with websites"
          tone="violet"
        />
      </div>

      <div className="space-y-5">
        <ReportSection
          title="Marketing Survey"
          items={data.marketingSurvey}
          compact
        />

        <ReportSection
          title="Business Survey"
          items={data.businessSurvey}
          compact
        />

        {hasItems(marketInsights) && (
          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-500/5 p-6">
            <h3 className="mb-5 text-xl font-bold text-white">
              What This Means
            </h3>

            <div className="space-y-4">
              {marketInsights.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-4"
                >
                  <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-emerald-400" />
                  <p className="leading-7 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <ReportSection
          title="Market Opportunities"
          items={data.marketOpportunities}
          compact
        />
      </div>
    </ReportCard>
  );
}