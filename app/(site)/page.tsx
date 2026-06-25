import { HOME_PAGE_QUERY, SITE_SETTINGS_QUERY, TESTIMONIALS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import HomeClient from "./HomeClient";

export default async function Home() {
  try {
    const [{ data: homeData }, { data: siteSettings }, { data: testimonials }] = await Promise.all([
      sanityFetch({ query: HOME_PAGE_QUERY }),
      sanityFetch({ query: SITE_SETTINGS_QUERY }),
      sanityFetch({ query: TESTIMONIALS_QUERY }),
    ]);
    return <HomeClient data={homeData ?? {}} settings={siteSettings} testimonials={testimonials ?? []} />;
  } catch (err) {
    console.error("[Home] Sanity fetch failed:", err);
    return <HomeClient data={{}} settings={undefined} testimonials={[]} />;
  }
}
