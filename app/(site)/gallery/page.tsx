import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import GalleryClient from "./GalleryClient";

export const metadata = {
  title: "Gallery | Pavani Realty Co",
  description:
    "Explore Pavani's visual showcase - video tours, property photography, and insights across Nairobi's finest addresses.",
};

export default async function GalleryPage() {
  try {
    const { data: siteSettings } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
    return <GalleryClient settings={siteSettings} />;
  } catch (err) {
    console.error("[Gallery] Sanity fetch failed:", err);
    return <GalleryClient settings={undefined} />;
  }
}
