import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { SanityLive } from "@/sanity/lib/live";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import WhatsAppFab from "@/components/WhatsAppFab";
import SocialRail from "@/components/SocialRail";
import SmoothScroll from "@/components/SmoothScroll";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import JsonLd from "@/components/JsonLd";
import {
  SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION, DEFAULT_KEYWORDS, OG_IMAGE, TWITTER_HANDLE,
  organizationSchema, websiteSchema, graph,
} from "@/lib/seo";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  // Site-wide defaults are editable in Studio → Settings → General.
  let general: any = {};
  try {
    const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
    general = data?.general || {};
  } catch {}
  const description = general.description || DEFAULT_DESCRIPTION;
  const keywords = general.keywords?.length ? general.keywords : DEFAULT_KEYWORDS;
  const ogImage = general.ogImage || OG_IMAGE;

  return {
  title: {
    default: "Luxury Properties in Kenya | Pavani Realty Co",
    template: "%s | Pavani Realty Co",
  },
  description,
  keywords,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Real Estate",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Luxury Properties in Kenya | Pavani Realty Co",
    description,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: ogImage,
        secureUrl: ogImage,
        width: 1200,
        height: 630,
        alt: "Pavani Realty Co — Luxury Real Estate in Kenya",
        type: 'image/png',
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Luxury Properties in Kenya | Pavani Realty Co",
    description,
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let siteSettings: any = undefined;
  try {
    const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
    siteSettings = data;
  } catch {
    siteSettings = undefined;
  }

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${cormorant.variable} ${montserrat.variable} font-sans bg-[#FAF8F4] text-[#1C1714] antialiased`} suppressHydrationWarning>
        <JsonLd data={graph(organizationSchema(siteSettings), websiteSchema())} />
        <SmoothScroll />
        <ServiceWorkerRegistration />
        <CurrencyProvider>
          <LanguageProvider>
            {children}
            <SocialRail settings={siteSettings} />
            <WhatsAppFab />
          </LanguageProvider>
        </CurrencyProvider>
        <SanityLive />
        {(await draftMode()).isEnabled && <VisualEditing />}
      </body>
    </html>
  );
}
