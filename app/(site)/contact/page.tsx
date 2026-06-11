import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact | Pavani Premium Real Estate",
  description: "Connect with Pavani's expert advisors. Schedule a private consultation or inquire about our exclusive listings.",
};

export default async function ContactPage() {
  try {
    const { data: siteSettings } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
    return <ContactClient settings={siteSettings} />;
  } catch (err) {
    console.error("[Contact] Sanity fetch failed:", err);
    return <ContactClient settings={undefined} />;
  }
}
