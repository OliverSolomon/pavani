import type { MetadataRoute } from "next";
import { SITE_NAME, DEFAULT_DESCRIPTION, THEME_COLOR, BACKGROUND_COLOR } from "@/lib/seo";

/**
 * Web app manifest, served at /manifest.webmanifest.
 * Gives Android "Add to Home Screen" a proper name, colours and icons.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Pavani",
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: BACKGROUND_COLOR,
    theme_color: THEME_COLOR,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
