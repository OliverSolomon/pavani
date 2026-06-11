"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Play, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface GalleryClientProps {
  settings?: any;
}

const ease = [0.23, 1, 0.32, 1] as const;

/* ── Video data ── */
const VIDEOS = [
  { id: "v1", title: "Karen Estate Luxury Tour",          thumb: "photo-1600607687940-c52af096999c", ytId: "" },
  { id: "v2", title: "Muthaiga Penthouse Showcase",       thumb: "photo-1600585154340-be6161a56a0c", ytId: "" },
  { id: "v3", title: "Investment Guide 2024",             thumb: "photo-1582407947304-fd86f028f716", ytId: "" },
  { id: "v4", title: "Runda Estate Community Tour",       thumb: "photo-1613490493576-7fde63acd811", ytId: "" },
  { id: "v5", title: "Westlands Luxury Living",           thumb: "photo-1512917774080-9991f1c4c750", ytId: "" },
  { id: "v6", title: "Lavington Family Homes",            thumb: "photo-1600607687644-c7f34b5063c7", ytId: "" },
  { id: "v7", title: "Gigiri Diplomatic Villas",          thumb: "photo-1613977257363-707ba9348227", ytId: "" },
  { id: "v8", title: "Nairobi Real Estate Market Trends", thumb: "photo-1486406146926-c627a92ad1ab", ytId: "" },
];

type Category = "all" | "villa" | "apartment" | "interior" | "exterior" | "amenities" | "penthouse";

/* ── Property photo showcase ── */
const PHOTOS: { id: string; category: Category; name: string; thumb: string }[] = [
  { id: "p1",  category: "villa",     name: "Villa Serene, Runda",       thumb: "photo-1600607687940-c52af096999c" },
  { id: "p2",  category: "villa",     name: "Karen Grand Estate",         thumb: "photo-1613490493576-7fde63acd811" },
  { id: "p3",  category: "interior",  name: "Luxury Living Room",         thumb: "photo-1600585154340-be6161a56a0c" },
  { id: "p4",  category: "apartment", name: "Westlands Penthouse Suite",  thumb: "photo-1512917774080-9991f1c4c750" },
  { id: "p5",  category: "exterior",  name: "Muthaiga Estate Exterior",   thumb: "photo-1600607687644-c7f34b5063c7" },
  { id: "p6",  category: "penthouse", name: "Sky Residence, Upperhill",   thumb: "photo-1582407947304-fd86f028f716" },
  { id: "p7",  category: "amenities", name: "Infinity Pool, Karen",       thumb: "photo-1613977257363-707ba9348227" },
  { id: "p8",  category: "interior",  name: "Master Suite Design",        thumb: "photo-1486406146926-c627a92ad1ab" },
  { id: "p9",  category: "villa",     name: "Runda Villa Gardens",        thumb: "photo-1613490493576-7fde63acd811" },
  { id: "p10", category: "apartment", name: "Kilimani Residence",         thumb: "photo-1600607687940-c52af096999c" },
  { id: "p11", category: "amenities", name: "Rooftop Terrace, Parklands", thumb: "photo-1512917774080-9991f1c4c750" },
  { id: "p12", category: "exterior",  name: "Lavington Garden Estate",    thumb: "photo-1600585154340-be6161a56a0c" },
];

const FILTER_TABS: { label: string; value: Category }[] = [
  { label: "All",        value: "all" },
  { label: "Villa",      value: "villa" },
  { label: "Apartment",  value: "apartment" },
  { label: "Interior",   value: "interior" },
  { label: "Exterior",   value: "exterior" },
  { label: "Amenities",  value: "amenities" },
  { label: "Penthouse",  value: "penthouse" },
];

export default function GalleryClient({ settings }: GalleryClientProps) {
  const reduce = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const [lightboxIdx, setLightboxIdx]   = useState<number | null>(null);

  const filteredPhotos =
    activeFilter === "all" ? PHOTOS : PHOTOS.filter(p => p.category === activeFilter);

  const fadeUp = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.15 },
          transition: { duration: 0.68, ease, delay },
        };

  /* Lightbox keyboard nav */
  const closeLightbox = () => setLightboxIdx(null);
  const prevPhoto = () =>
    setLightboxIdx(i => (i === null ? null : (i - 1 + filteredPhotos.length) % filteredPhotos.length));
  const nextPhoto = () =>
    setLightboxIdx(i => (i === null ? null : (i + 1) % filteredPhotos.length));

  return (
    <main className="min-h-screen bg-[#0D0501] text-[#EDE0C8]">
      <Navbar settings={settings} />

      {/* ── PAGE HERO ── */}
      <section className="relative pt-32 pb-14 px-6 lg:px-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#C9A96E,#C9A96E 1px,transparent 1px,transparent 72px),repeating-linear-gradient(90deg,#C9A96E,#C9A96E 1px,transparent 1px,transparent 72px)",
          }}
        />
        <div className="relative max-w-[1400px] mx-auto page-hero-enter">
          <p className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#C9A96E] mb-4">Gallery</p>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-serif font-light text-[#EDE0C8] leading-tight mb-5">
            Visual Showcase
          </h1>
          <div className="w-10 h-px bg-[#C9A96E]/60" />
        </div>
      </section>

      {/* ── VIDEO TOURS ── */}
      <section className="py-14 lg:py-20 px-6 lg:px-16 border-t border-[#C9A96E]/10">
        <div className="max-w-[1400px] mx-auto">
          <motion.div {...fadeUp(0)} className="mb-10">
            <p className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#C9A96E]/70 mb-3">Featured Videos</p>
            <h2 className="text-2xl lg:text-3xl font-serif font-light text-[#EDE0C8]">
              Video Tours &amp; Insights
            </h2>
          </motion.div>

          {/* 4 × 2 video grid */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
            variants={reduce ? {} : {
              hidden: {},
              show: { transition: { staggerChildren: 0.07 } },
            }}
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
          >
            {VIDEOS.map(({ id, title, thumb }) => (
              <motion.div
                key={id}
                variants={reduce ? {} : {
                  hidden: { opacity: 0, y: 18 },
                  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
                }}
              >
                {/* Video thumbnail card */}
                <button
                  className="group relative aspect-video w-full overflow-hidden block text-left"
                  aria-label={`Play: ${title}`}
                >
                  <Image
                    src={`https://images.unsplash.com/${thumb}?auto=format&fit=crop&w=600&q=75`}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                  />
                  {/* Dark scrim */}
                  <div className="absolute inset-0 bg-[#0D0501]/45 group-hover:bg-[#0D0501]/25 transition-colors duration-300" />
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-[#C9A96E] bg-[#0D0501]/40 flex items-center justify-center group-hover:bg-[#C9A96E] group-hover:border-[#C9A96E] transition-all duration-300">
                      <Play size={16} className="text-[#C9A96E] group-hover:text-[#0D0501] transition-colors ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                  {/* Title overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#0D0501]/90 to-transparent">
                    <p className="text-[8px] font-bold tracking-[0.25em] uppercase text-[#EDE0C8]/80 leading-tight">
                      {title}
                    </p>
                  </div>
                </button>
              </motion.div>
            ))}
          </motion.div>

          {/* YouTube CTA */}
          <motion.div {...fadeUp(0.2)} className="mt-12 flex justify-center">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-link inline-flex items-center gap-3 border border-[#C9A96E]/35 px-10 py-4 text-[10px] font-bold tracking-[0.45em] uppercase text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#0D0501] transition-all duration-300"
            >
              SUBSCRIBE ON YOUTUBE <ArrowRight size={12} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── PROPERTY SHOWCASE ── */}
      <section className="py-14 lg:py-20 px-6 lg:px-16 bg-[#180900]">
        <div className="max-w-[1400px] mx-auto">
          <motion.div {...fadeUp(0)} className="mb-10">
            <p className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#C9A96E]/70 mb-3">Property Showcase</p>
            <h2 className="text-2xl lg:text-3xl font-serif font-light text-[#EDE0C8]">
              Featured Properties
            </h2>
          </motion.div>

          {/* Filter tabs */}
          <motion.div {...fadeUp(0.06)} className="flex flex-wrap gap-2 mb-8">
            {FILTER_TABS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={cn(
                  "px-4 py-2 text-[9px] font-bold tracking-[0.3em] uppercase border transition-all duration-200",
                  activeFilter === value
                    ? "bg-[#C9A96E] text-[#0D0501] border-[#C9A96E]"
                    : "border-[#C9A96E]/20 text-[#EDE0C8]/55 hover:border-[#C9A96E]/40 hover:text-[#EDE0C8]/80"
                )}
              >
                {label}
              </button>
            ))}
          </motion.div>

          {/* Photo grid with AnimatePresence for filter transitions */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredPhotos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? {} : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease, delay: reduce ? 0 : i * 0.04 }}
                >
                  <button
                    className="group relative aspect-[4/3] w-full overflow-hidden block"
                    onClick={() => setLightboxIdx(i)}
                    aria-label={`View ${photo.name}`}
                  >
                    <Image
                      src={`https://images.unsplash.com/${photo.thumb}?auto=format&fit=crop&w=700&q=75`}
                      alt={photo.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0501]/80 via-[#0D0501]/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                    <div className="absolute top-3 left-3">
                      <span className="text-[7px] font-bold tracking-[0.4em] uppercase bg-[#0D0501]/70 text-[#C9A96E] px-2.5 py-1.5">
                        {photo.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-[13px] font-serif text-[#EDE0C8] leading-snug">{photo.name}</p>
                    </div>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* View all properties link */}
          <motion.div {...fadeUp(0.15)} className="mt-12 flex justify-center">
            <Link
              href="/properties"
              className="cta-link inline-flex items-center gap-3 border border-[#C9A96E]/35 px-10 py-4 text-[10px] font-bold tracking-[0.45em] uppercase text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#0D0501] transition-all duration-300"
            >
              VIEW ALL PROPERTIES <ArrowRight size={12} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            className="fixed inset-0 z-[9000] bg-[#0D0501]/95 flex items-center justify-center p-4"
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
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={`https://images.unsplash.com/${filteredPhotos[lightboxIdx].thumb}?auto=format&fit=crop&w=1200&q=85`}
                alt={filteredPhotos[lightboxIdx].name}
                fill
                className="object-cover"
                sizes="100vw"
              />
              {/* Title bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0D0501]/90 to-transparent p-6">
                <p className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#C9A96E] mb-1">
                  {filteredPhotos[lightboxIdx].category}
                </p>
                <p className="font-serif text-lg text-[#EDE0C8]">
                  {filteredPhotos[lightboxIdx].name}
                </p>
              </div>
              {/* Close */}
              <button
                className="absolute top-4 right-4 w-10 h-10 bg-[#0D0501]/70 flex items-center justify-center text-[#EDE0C8]/70 hover:text-[#C9A96E] transition-colors"
                onClick={closeLightbox}
              >
                <X size={18} />
              </button>
              {/* Prev */}
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0D0501]/70 flex items-center justify-center text-[#EDE0C8]/70 hover:text-[#C9A96E] transition-colors text-lg"
                onClick={prevPhoto}
              >
                &#8592;
              </button>
              {/* Next */}
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0D0501]/70 flex items-center justify-center text-[#EDE0C8]/70 hover:text-[#C9A96E] transition-colors text-lg"
                onClick={nextPhoto}
              >
                &#8594;
              </button>
            </motion.div>
            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-[0.3em] uppercase text-[#EDE0C8]/40">
              {lightboxIdx + 1} / {filteredPhotos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer settings={settings} />
    </main>
  );
}
