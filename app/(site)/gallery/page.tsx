import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import GalleryClient from "./GalleryClient";

export const metadata = {
  title: "Gallery — Luxury Property Tours & Photography",
  description:
    "Explore video tours and photography of Pavani Realty Co's luxury properties across Nairobi's finest neighbourhoods.",
  alternates: { canonical: "/gallery" },
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
