"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Play, ArrowRight, X } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * Gallery page — 100% Sanity-driven, no hardcoded media.
 *
 *  · "Video Tours"       ← the `videoTour` URL and any `externalVideo` media
 *                          entries on Property documents.
 *  · "Property Showcase" ← the exact same six properties selected in
 *                          Studio → Pages → Home Page → Featured Properties.
 *
 * Any section with no content simply does not render.
 */

interface GalleryVideo {
  _id: string;
  title?: string;
  slug?: string;
  district?: string;
  thumbUrl?: string;
  videos?: (string | null)[];
}

interface FeaturedProperty {
  _id: string;
  title?: string;
  slug?: string;
  buildingName?: string;
  price?: { amount?: string; currency?: string } | string;
  imageUrl?: string;
  county?: string;
  district?: string;
  details?: string;
  propertyType?: string[];
  status?: string;
}

export interface SiteSettings {
  general?: Record<string, unknown>;
  brand?: Record<string, unknown>;
  contact?: Record<string, unknown>;
  socials?: Record<string, string | undefined>;
}

interface GalleryClientProps {
  settings?: SiteSettings;
  featured?: FeaturedProperty[];
  videos?: GalleryVideo[];
}

const ease = [0.23, 1, 0.32, 1] as const;

/** Flatten one entry per video URL, carrying its parent property's details. */
function flattenVideos(videos: GalleryVideo[]) {
  return videos.flatMap((p) =>
    (p.videos ?? [])
      .filter((url): url is string => Boolean(url))
      .map((url, i) => ({
        key: `${p._id}-${i}`,
        url,
        title: p.title ?? "",
        district: p.district ?? "",
        thumbUrl: p.thumbUrl,
      }))
  );
}

export default function GalleryClient({
  settings,
  featured = [],
  videos = [],
}: GalleryClientProps) {
  const reduce = useReducedMotion();
  const { formatPrice } = useCurrency();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const youtube = settings?.socials?.youtube;

  const videoItems = flattenVideos(videos);

  const fadeUp = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.15 },
          transition: { duration: 0.68, ease, delay },
        };

  /* Lightbox navigation over the featured properties */
  const closeLightbox = () => setLightboxIdx(null);
  const prevPhoto = () =>
    setLightboxIdx((i) => (i === null ? null : (i - 1 + featured.length) % featured.length));
  const nextPhoto = () =>
    setLightboxIdx((i) => (i === null ? null : (i + 1) % featured.length));

  const active = lightboxIdx !== null ? featured[lightboxIdx] : null;

  return (
    <main className="min-h-screen bg-[#FAF8F4] text-[#1C1714]">
      <Navbar settings={settings} />

      {/* ── PAGE HERO ── */}
      <section className="relative pt-32 pb-14 px-6 lg:px-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#82000D,#82000D 1px,transparent 1px,transparent 72px),repeating-linear-gradient(90deg,#82000D,#82000D 1px,transparent 1px,transparent 72px)",
          }}
        />
        <div className="relative max-w-[1400px] mx-auto page-hero-enter">
          <p className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#82000D] mb-4">Gallery</p>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-serif font-normal text-[#1C1714] leading-tight mb-5">
            Visual Showcase
          </h1>
          <div className="w-10 h-px bg-[#82000D]/60" />
        </div>
      </section>

      {/* ── VIDEO TOURS (from property video tours) ── */}
      {videoItems.length > 0 && (
        <section className="py-14 lg:py-20 px-6 lg:px-16 border-t border-[#82000D]/10">
          <div className="max-w-[1400px] mx-auto">
            <motion.div {...fadeUp(0)} className="mb-10">
              <p className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#82000D]/70 mb-3">
                Featured Videos
              </p>
              <h2 className="text-2xl lg:text-3xl font-serif font-normal text-[#1C1714]">
                Video Tours &amp; Insights
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-3"
              variants={reduce ? {} : { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
              initial={reduce ? false : "hidden"}
              whileInView="show"
              viewport={{ once: true, amount: 0.05 }}
            >
              {videoItems.map((v) => (
                <motion.div
                  key={v.key}
                  variants={reduce ? {} : {
                    hidden: { opacity: 0, y: 18 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
                  }}
                >
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-video w-full overflow-hidden block text-left"
                    aria-label={`Watch video tour: ${v.title}`}
                  >
                    {v.thumbUrl ? (
                      <Image
                        src={v.thumbUrl}
                        alt={v.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#ECE6DD] flex items-center justify-center">
                        <span className="font-serif text-4xl text-[#82000D]/30">P</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-[#210A0B]/40 group-hover:bg-[#210A0B]/25 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-2 border-[#FBF5F2]/70 bg-[#FBF5F2]/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#82000D] group-hover:border-[#82000D] transition-all duration-300">
                        <Play size={16} className="text-[#FBF5F2] transition-colors ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#210A0B]/90 to-transparent">
                      <p className="text-[8px] font-bold tracking-[0.25em] uppercase text-[#FBF5F2]/90 leading-tight line-clamp-2">
                        {v.title}
                      </p>
                    </div>
                  </a>
                </motion.div>
              ))}
            </motion.div>

            {youtube && (
              <motion.div {...fadeUp(0.2)} className="mt-12 flex justify-center">
                <a
                  href={youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-link inline-flex items-center gap-3 border border-[#82000D]/35 px-10 py-4 text-[10px] font-bold tracking-[0.45em] uppercase text-[#82000D] hover:bg-[#82000D] hover:text-[#FAF8F4] transition-all duration-300"
                >
                  SUBSCRIBE ON YOUTUBE <ArrowRight size={12} />
                </a>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* ── PROPERTY SHOWCASE (same six as the Home page) ── */}
      {featured.length > 0 && (
        <section className="py-14 lg:py-20 px-6 lg:px-16 bg-[#F3EFE9]">
          <div className="max-w-[1400px] mx-auto">
            <motion.div {...fadeUp(0)} className="mb-10">
              <p className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#82000D]/70 mb-3">
                Property Showcase
              </p>
              <h2 className="text-2xl lg:text-3xl font-serif font-normal text-[#1C1714]">
                Featured Properties
              </h2>
            </motion.div>

            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" layout>
              {featured.map((p, i) => {
                const amount = typeof p.price === "object" ? p.price?.amount : p.price;
                const currency = typeof p.price === "object" ? p.price?.currency : "KSh";
                const label = p.district || p.county || p.propertyType?.[0] || "";
                return (
                  <motion.div
                    key={p._id}
                    layout
                    initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease, delay: reduce ? 0 : i * 0.04 }}
                  >
                    <button
                      className="group relative aspect-[4/3] w-full overflow-hidden block"
                      onClick={() => setLightboxIdx(i)}
                      aria-label={`View ${p.title}`}
                    >
                      {p.imageUrl ? (
                        <Image
                          src={p.imageUrl}
                          alt={p.title ?? "Featured property"}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#ECE6DD] flex items-center justify-center">
                          <span className="font-serif text-5xl text-[#82000D]/30">P</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#210A0B]/85 via-[#210A0B]/15 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-300" />
                      {label && (
                        <div className="absolute top-3 left-3">
                          <span className="text-[7px] font-bold tracking-[0.4em] uppercase bg-[#82000D] text-[#FBF5F2] px-2.5 py-1.5">
                            {label}
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 right-4 text-left">
                        <p className="text-[13px] font-serif text-[#FBF5F2] leading-snug line-clamp-2">
                          {p.title}
                        </p>
                        {amount && (
                          <p className="mt-1 text-[10px] tracking-widest text-[#E8DCBF]">
                            {formatPrice(amount, currency)}
                          </p>
                        )}
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div {...fadeUp(0.15)} className="mt-12 flex justify-center">
              <Link
                href="/properties"
                className="cta-link inline-flex items-center gap-3 border border-[#82000D]/35 px-10 py-4 text-[10px] font-bold tracking-[0.45em] uppercase text-[#82000D] hover:bg-[#82000D] hover:text-[#FAF8F4] transition-all duration-300"
              >
                VIEW ALL PROPERTIES <ArrowRight size={12} />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── EMPTY STATE (nothing published yet) ── */}
      {featured.length === 0 && videoItems.length === 0 && (
        <section className="py-24 px-6 lg:px-16 border-t border-[#82000D]/10">
          <div className="max-w-[1400px] mx-auto text-center">
            <p className="font-serif text-xl text-[#1C1714]/70 mb-6">
              Our gallery is being updated. Please check back shortly.
            </p>
            <Link
              href="/properties"
              className="cta-link inline-flex items-center gap-3 border border-[#82000D]/35 px-10 py-4 text-[10px] font-bold tracking-[0.45em] uppercase text-[#82000D] hover:bg-[#82000D] hover:text-[#FAF8F4] transition-all duration-300"
            >
              BROWSE PROPERTIES <ArrowRight size={12} />
            </Link>
          </div>
        </section>
      )}

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[9000] bg-[#210A0B]/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            onClick={closeLightbox}
          >
            <motion.div
              className="relative w-full max-w-4xl aspect-[4/3]"
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              transition={{ duration: 0.3, ease }}
              onClick={(e) => e.stopPropagation()}
            >
              {active.imageUrl && (
                <Image
                  src={active.imageUrl}
                  alt={active.title ?? "Featured property"}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#210A0B]/95 to-transparent p-6">
                {(active.district || active.county) && (
                  <p className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#E8DCBF] mb-1">
                    {active.district || active.county}
                  </p>
                )}
                <p className="font-serif text-lg text-[#FBF5F2] mb-3">{active.title}</p>
                {active.slug && (
                  <Link
                    href={`/properties/${active.slug}`}
                    className="inline-flex items-center gap-2 text-[9px] font-bold tracking-[0.35em] uppercase text-[#E8DCBF] hover:text-[#FBF5F2] transition-colors"
                  >
                    VIEW LISTING <ArrowRight size={11} />
                  </Link>
                )}
              </div>
              <button
                className="absolute top-4 right-4 w-10 h-10 bg-[#FBF5F2]/90 flex items-center justify-center text-[#82000D] hover:bg-[#FBF5F2] transition-colors"
                onClick={closeLightbox}
                aria-label="Close"
              >
                <X size={18} />
              </button>
              {featured.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#FBF5F2]/90 flex items-center justify-center text-[#82000D] hover:bg-[#FBF5F2] transition-colors text-lg"
                    onClick={prevPhoto}
                    aria-label="Previous"
                  >
                    &#8592;
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#FBF5F2]/90 flex items-center justify-center text-[#82000D] hover:bg-[#FBF5F2] transition-colors text-lg"
                    onClick={nextPhoto}
                    aria-label="Next"
                  >
                    &#8594;
                  </button>
                </>
              )}
            </motion.div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-[0.3em] uppercase text-[#FBF5F2]/55">
              {(lightboxIdx ?? 0) + 1} / {featured.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer settings={settings} />
    </main>
  );
}
