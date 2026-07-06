import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { SITE_URL } from "@/lib/seo";

/* Pulls live content from Sanity so every property, article and neighbourhood is
   discoverable. Property entries carry an image for Google Image indexing. */
const SITEMAP_QUERY = `{
  "properties": *[_type == "property" && defined(slug.current)]{
    "slug": slug.current,
    _updatedAt,
    "image": coalesce(image.asset->url, image.externalUrl, media[_type=="image"][0].asset->url, media[_type=="externalImage"][0].url)
  },
  "posts": *[_type == "post" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "districts": *[_type == "district" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  let data: { properties?: any[]; posts?: any[]; districts?: any[] } = {};
  try {
    data = await client.fetch(SITEMAP_QUERY);
  } catch (err) {
    console.error("[sitemap] Sanity fetch failed:", err);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/properties`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/insights`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/gallery`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const statusRoutes: MetadataRoute.Sitemap = ["off-plan", "on-going", "ready"].map((s) => ({
    url: `${SITE_URL}/properties/${s}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const properties: MetadataRoute.Sitemap = (data.properties || []).map((p) => ({
    url: `${SITE_URL}/properties/${p.slug}`,
    lastModified: p._updatedAt ? new Date(p._updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.8,
    ...(p.image ? { images: [p.image] } : {}),
  }));

  const posts: MetadataRoute.Sitemap = (data.posts || []).map((p) => ({
    url: `${SITE_URL}/insights/${p.slug}`,
    lastModified: p._updatedAt ? new Date(p._updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const districts: MetadataRoute.Sitemap = (data.districts || []).map((d) => ({
    url: `${SITE_URL}/neighborhoods/${d.slug}`,
    lastModified: d._updatedAt ? new Date(d._updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...statusRoutes, ...properties, ...posts, ...districts];
}
