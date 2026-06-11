import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import AboutClient from "./AboutClient";

export const metadata = {
  title: "About | Pavani Realty Co",
  description:
    "Learn about Pavani Realty Co — Nairobi's trusted authority in luxury real estate since 2009.",
};

export default async function AboutPage() {
  try {
    const { data: siteSettings } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
    return <AboutClient settings={siteSettings} />;
  } catch (err) {
    console.error("[About] Sanity fetch failed:", err);
    return <AboutClient settings={undefined} />;
  }
}
