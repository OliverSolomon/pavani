import { SITE_SETTINGS_QUERY, TESTIMONIALS_QUERY, ABOUT_PAGE_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import AboutClient from "./AboutClient";

export const metadata = {
  title: "About | Pavani Realty Co",
  description:
    "Learn about Pavani Realty Co - Nairobi's trusted authority in luxury real estate since 2009.",
};

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
