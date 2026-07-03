import { SITE_SETTINGS_QUERY, INSIGHTS_QUERY, INSIGHTS_PAGE_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import InsightsClient from "./InsightsClient";

export const metadata = {
  title: "Insights | Pavani Realty Co",
  description:
    "Market insights, neighbourhood guides and stories from Pavani Realty Co - Nairobi's authority in luxury real estate.",
};

export default async function InsightsPage() {
  try {
    const [{ data: siteSettings }, { data: posts }, { data: content }] = await Promise.all([
      sanityFetch({ query: SITE_SETTINGS_QUERY }),
      sanityFetch({ query: INSIGHTS_QUERY }),
      sanityFetch({ query: INSIGHTS_PAGE_QUERY }),
    ]);
    return <InsightsClient settings={siteSettings} posts={posts ?? []} content={content ?? null} />;
  } catch (err) {
    console.error("[Insights] Sanity fetch failed:", err);
    return <InsightsClient settings={undefined} posts={[]} content={null} />;
  }
}
