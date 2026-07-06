import { SITE_SETTINGS_QUERY, TESTIMONIALS_QUERY, ABOUT_PAGE_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import AboutClient from "./AboutClient";
import { resolveMeta } from "@/lib/seo";

export async function generateMetadata() {
  let seo: any = null;
  try {
    const { data } = await sanityFetch({ query: ABOUT_PAGE_QUERY });
    seo = data?.seo ?? null;
  } catch {}
  return resolveMeta({
    seo,
    title: "About Us — Kenya's Luxury Real Estate Authority",
    description:
      "Since 2009, Pavani Realty Co has been Kenya's trusted authority in luxury real estate, curating exclusive homes and investments across Nairobi's most prestigious neighbourhoods.",
    path: "/about",
  });
}

export default async function AboutPage() {
  try {
    const [{ data: siteSettings }, { data: testimonials }, { data: about }] = await Promise.all([
      sanityFetch({ query: SITE_SETTINGS_QUERY }),
      sanityFetch({ query: TESTIMONIALS_QUERY }),
      sanityFetch({ query: ABOUT_PAGE_QUERY }),
    ]);
    return <AboutClient settings={siteSettings} testimonials={testimonials ?? []} about={about ?? null} />;
  } catch (err) {
    console.error("[About] Sanity fetch failed:", err);
    return <AboutClient settings={undefined} testimonials={[]} about={null} />;
  }
}
