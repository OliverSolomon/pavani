import { PROPERTIES_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import PropertiesClient from "./PropertiesClient";
import { Suspense } from "react";

export const metadata = {
  title: "Properties | Pavani Realty Co",
  description: "Browse luxury properties across Nairobi and beyond. Find your next home with Pavani Realty Co.",
};

export default async function PropertiesPage() {
  try {
    const [{ data: properties }, { data: siteSettings }] = await Promise.all([
      sanityFetch({ query: PROPERTIES_QUERY }),
      sanityFetch({ query: SITE_SETTINGS_QUERY })
    ]);
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#FAF8F4]" />}>
        <PropertiesClient initialProperties={properties ?? []} settings={siteSettings} />
      </Suspense>
    );
  } catch (err) {
    console.error("[Properties] Sanity fetch failed:", err);
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#FAF8F4]" />}>
        <PropertiesClient initialProperties={[]} settings={undefined} />
      </Suspense>
    );
  }
}
