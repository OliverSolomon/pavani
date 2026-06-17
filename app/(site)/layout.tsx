import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { SanityLive } from "@/sanity/lib/live";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import WhatsAppFab from "@/components/WhatsAppFab";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { LanguageProvider } from "@/context/LanguageContext";

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

export const metadata: Metadata = {
  title: "Pavani | Premium Real Estate & Luxury Homes",
  description: "Pavani is a premier luxury real estate agency offering exclusive residential and commercial properties. Experience unmatched elegance in real estate.",
  metadataBase: new URL('https://pavani.re'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Pavani | Premium Real Estate & Luxury Homes',
    description: 'Premier luxury real estate. Exclusive residences curated for discerning clients.',
    url: 'https://pavani.re',
    siteName: 'Pavani',
    images: [
      {
        url: 'https://pavani.re/og-image.png',
        secureUrl: 'https://pavani.re/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pavani Premium Real Estate',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pavani | Premium Real Estate',
    description: 'Premier luxury real estate. Exclusive residences curated for discerning clients.',
    images: ['https://pavani.re/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Pavani",
  "url": "https://pavani.re",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://pavani.re/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${cormorant.variable} ${montserrat.variable} font-sans bg-[#FAF8F4] text-[#1C1714] antialiased`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ServiceWorkerRegistration />
        <CurrencyProvider>
          <LanguageProvider>
            {children}
            <WhatsAppFab />
          </LanguageProvider>
        </CurrencyProvider>
        <SanityLive />
        {(await draftMode()).isEnabled && <VisualEditing />}
      </body>
    </html>
  );
}
