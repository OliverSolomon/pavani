import { sanityFetch } from "@/sanity/lib/live";
import { NEIGHBORHOODS_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import NeighborhoodsClient from "./NeighborhoodsClient";

export default async function NeighborhoodsPage() {
  try {
    const [{ data: neighborhoods }, { data: settings }] = await Promise.all([
      sanityFetch({ query: NEIGHBORHOODS_QUERY }),
      sanityFetch({ query: SITE_SETTINGS_QUERY }),
    ]);
    return <NeighborhoodsClient neighborhoods={neighborhoods ?? []} settings={settings} />;
  } catch (err) {
    console.error("[Neighborhoods] Sanity fetch failed:", err);
    return <NeighborhoodsClient neighborhoods={[]} settings={undefined} />;
  }
}
