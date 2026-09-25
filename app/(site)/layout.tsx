import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { SanityLive } from "@/sanity/lib/live";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import StylesheetGuard from "@/components/StylesheetGuard";
import WhatsAppFab from "@/components/WhatsAppFab";
import SocialRail from "@/components/SocialRail";
import SmoothScroll from "@/components/SmoothScroll";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import JsonLd from "@/components/JsonLd";
import {
  SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION, DEFAULT_KEYWORDS, TWITTER_HANDLE,
  OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, OG_IMAGE_ALT, THEME_COLOR, ogImageUrl,
  organizationSchema, websiteSchema, realEstateAgentSchema, graph,
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

// Colours the browser toolbar on Android Chrome and Samsung Internet, and the
// status bar area on iOS Safari, in the brand crimson.
export const viewport: Viewport = {
  themeColor: THEME_COLOR,
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  // Site-wide defaults are editable in Studio → Settings → General.
  let general: any = {};
  try {
    const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
    general = data?.general || {};
  } catch {}
  const description = general.description || DEFAULT_DESCRIPTION;
  const keywords = general.keywords?.length ? general.keywords : DEFAULT_KEYWORDS;
  const ogImage = ogImageUrl(general.ogImage);

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
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: OG_IMAGE_ALT,
        type: 'image/jpeg',
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
    images: [{ url: ogImage, alt: OG_IMAGE_ALT }],
  },
  // Icons (favicon.ico, icon1.png, icon2.svg, apple-icon.png) and the web app
  // manifest come from the metadata file conventions in the top-level app/
  // folder, so Next.js emits their <link> tags automatically.
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
        <JsonLd data={graph(organizationSchema(siteSettings), websiteSchema(), realEstateAgentSchema(siteSettings))} />
        <SmoothScroll />
        <StylesheetGuard />
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
