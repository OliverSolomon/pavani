import { NEIGHBORHOOD_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import NeighborhoodClient from "./NeighborhoodClient";
import { notFound } from "next/navigation";
import { DISTRICT_BY_SLUG } from "@/lib/neighborhoods";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = DISTRICT_BY_SLUG[slug];
  try {
    const { data: neighborhood } = await sanityFetch({ query: NEIGHBORHOOD_QUERY, params: { slug } });
    const name = neighborhood?.name || guide?.name;
    if (!name) return { title: "Neighbourhood Not Found" };
    return {
      title: `${name} — Luxury Property & Neighbourhood Guide`,
      description: guide?.summary || `Explore luxury homes and living in ${name}, Nairobi, with Pavani Realty Co's neighbourhood guide.`,
      alternates: { canonical: `/neighborhoods/${slug}` },
    };
  } catch {
    return { title: guide ? `${guide.name} — Neighbourhood Guide` : "Neighbourhood Guide" };
  }
}

export default async function NeighborhoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = DISTRICT_BY_SLUG[slug] ?? null;

  let neighborhood: any = null;
  let siteSettings: any = undefined;
  try {
    const [{ data: n }, { data: s }] = await Promise.all([
      sanityFetch({ query: NEIGHBORHOOD_QUERY, params: { slug } }),
      sanityFetch({ query: SITE_SETTINGS_QUERY }),
    ]);
    neighborhood = n;
    siteSettings = s;
  } catch (err) {
    console.error("[NeighborhoodPage] Sanity fetch failed:", err);
  }

  // Fall back to the local registry so guide pages always render.
  if (!neighborhood && !guide) notFound();

  return <NeighborhoodClient neighborhood={neighborhood} guide={guide} settings={siteSettings} />;
}
