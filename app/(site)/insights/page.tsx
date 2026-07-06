import { SITE_SETTINGS_QUERY, INSIGHTS_QUERY, INSIGHTS_PAGE_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import InsightsClient from "./InsightsClient";
import { resolveMeta } from "@/lib/seo";

export async function generateMetadata() {
  let seo: any = null;
  try {
    const { data } = await sanityFetch({ query: INSIGHTS_PAGE_QUERY });
    seo = data?.seo ?? null;
  } catch {}
  return resolveMeta({
    seo,
    title: "Insights — Kenya Luxury Real Estate Market Journal",
    description:
      "Market commentary, neighbourhood guides and buyer's insights on Kenya's luxury real estate, from Pavani Realty Co.",
    path: "/insights",
  });
}

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
