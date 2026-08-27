import { GALLERY_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import GalleryClient, { type SiteSettings } from "./GalleryClient";

export const metadata = {
  title: "Gallery — Luxury Property Tours & Photography",
  description:
    "Explore video tours and photography of Pavani Realty Co's luxury properties across Nairobi's finest neighbourhoods.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  let gallery: Awaited<ReturnType<typeof sanityFetch>>["data"] | null = null;
  let siteSettings: SiteSettings | undefined = undefined;

  try {
    const [galleryRes, settingsRes] = await Promise.all([
      sanityFetch({ query: GALLERY_QUERY }),
      sanityFetch({ query: SITE_SETTINGS_QUERY }),
    ]);
    gallery = galleryRes.data;
    siteSettings = settingsRes.data as SiteSettings;
  } catch (err) {
    console.error("[Gallery] Sanity fetch failed:", err);
  }

  return (
    <GalleryClient
      settings={siteSettings}
      featured={gallery?.featured ?? []}
      videos={gallery?.videos ?? []}
    />
  );
}
