import { HOME_PAGE_QUERY, SITE_SETTINGS_QUERY, TESTIMONIALS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import HomeClient from "./HomeClient";
import JsonLd from "@/components/JsonLd";
import { graph, itemListSchema } from "@/lib/seo";

export const metadata = {
  title: { absolute: "Luxury Properties in Kenya | Pavani Realty Co" },
  description:
    "Discover Kenya's finest luxury real estate with Pavani Realty Co — exclusive apartments, villas and off-plan homes for sale across Nairobi's most prestigious neighbourhoods.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  try {
    const [{ data: homeData }, { data: siteSettings }, { data: testimonials }] = await Promise.all([
      sanityFetch({ query: HOME_PAGE_QUERY }),
      sanityFetch({ query: SITE_SETTINGS_QUERY }),
      sanityFetch({ query: TESTIMONIALS_QUERY }),
    ]);
    const featured = homeData?.propertiesSection?.featuredProperties ?? [];
    return (
      <>
        {featured.length > 0 && <JsonLd data={graph(itemListSchema(featured))} />}
        <HomeClient data={homeData ?? {}} settings={siteSettings} testimonials={testimonials ?? []} />
      </>
    );
  } catch (err) {
    console.error("[Home] Sanity fetch failed:", err);
    return <HomeClient data={{}} settings={undefined} testimonials={[]} />;
  }
}
