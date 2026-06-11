import { PROPERTY_DETAIL_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import PropertyDetailClient from "./PropertyDetailClient";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const { data: property } = await sanityFetch({
      query: PROPERTY_DETAIL_QUERY,
      params: { slug },
    });
    if (!property) return { title: "Property Not Found" };
    return {
      title: `${property.title} | Pavani Realty Co`,
      description: property.shortDescription || `View details for ${property.title}`,
    };
  } catch {
    return { title: "Property | Pavani Realty Co" };
  }
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const [{ data: property }, { data: siteSettings }] = await Promise.all([
      sanityFetch({ query: PROPERTY_DETAIL_QUERY, params: { slug } }),
      sanityFetch({ query: SITE_SETTINGS_QUERY }),
    ]);
    if (!property) notFound();
    return <PropertyDetailClient property={{ ...property, siteSettings }} />;
  } catch (err) {
    console.error("[PropertyPage] Sanity fetch failed:", err);
    notFound();
  }
}
