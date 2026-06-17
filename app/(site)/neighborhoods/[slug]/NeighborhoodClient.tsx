"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import {
  MapPin, GraduationCap, ShoppingBag, Clock, Building2, ArrowRight, ArrowLeft,
} from "lucide-react";
import { PortableText } from "@portabletext/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DISTRICTS, type DistrictGuide } from "@/lib/neighborhoods";

const DistrictMap = dynamic(() => import("@/components/DistrictMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#F3EFE9] animate-pulse" />,
});

const ease = [0.23, 1, 0.32, 1] as const;

interface Props {
  neighborhood: any | null;
  guide: DistrictGuide | null;
  settings?: any;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22, filter: "blur(5px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease, delay },
});

export default function NeighborhoodClient({ neighborhood, guide, settings }: Props) {
  const reduce = useReducedMotion();
  const mp = <T extends object>(p: T) => (reduce ? {} : p);

  const name = neighborhood?.name || guide?.name || "District";
  const heroImage = neighborhood?.mainImage || neighborhood?.photos?.[0] || null;
  const summary = guide?.summary;
  const character = guide?.character;
  const schools = (neighborhood?.schools?.length ? neighborhood.schools : guide?.schools) || [];
  const malls = (neighborhood?.malls?.length ? neighborhood.malls : guide?.lifestyle) || [];
  const spotlightImg = neighborhood?.photos?.[0] || null;

  return (
    <main className="min-h-screen bg-[#FAF8F4] text-[#1C1714]">
      <Navbar settings={settings} />

      {/* ── Hero ── */}
      <section className="relative h-[68vh] lg:h-[84vh] w-full flex items-end overflow-hidden">
        {heroImage ? (
          <Image src={heroImage} alt={name} fill priority className="object-cover" sizes="100vw" />
        ) : (
          <div className="absolute inset-0 bg-[#F3EFE9]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F4] via-[#FAF8F4]/55 to-[#FAF8F4]/25" />
        <div className="relative z-10 px-6 lg:px-16 pb-16 lg:pb-24 max-w-[1400px] mx-auto w-full">
          <Link href="/neighborhoods" className="cta-link inline-flex items-center gap-2 text-[9px] font-bold tracking-[0.35em] uppercase text-[#1C1714]/65 hover:text-[#82000D] mb-7">
            <ArrowLeft size={13} /> All Districts
          </Link>
          <p className="hero-line hero-line-1 eyebrow mb-4">District Guide</p>
          <h1 className="hero-line hero-line-2 text-5xl lg:text-8xl font-serif font-light leading-[0.92] text-[#1C1714]">
            {name}
          </h1>
          {guide?.tagline && (
            <p className="hero-line hero-sub mt-5 text-lg lg:text-2xl font-serif italic text-[#82000D] max-w-2xl">
              {guide.tagline}
            </p>
          )}
        </div>
      </section>

      {/* ── Quick facts bar ── */}
      {guide && (
        <section className="bg-[#82000D]">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#FBF5F2]/15">
            <Stat icon={<Building2 size={15} />} label="Built form" value={guide.builtForm} />
            <Stat icon={<MapPin size={15} />} label="Price band" value={guide.priceBand} />
            <Stat icon={<Clock size={15} />} label="To the CBD" value={guide.commuteCBD} />
            <Stat icon={<MapPin size={15} />} label="Character" value={guide.vibe.join(" · ")} />
          </div>
        </section>
      )}

      {/* ── Narrative ── */}
      <section className="py-20 lg:py-32 px-6 lg:px-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <motion.div className="w-12 h-px bg-[#82000D]/50 mx-auto" {...mp(fadeUp(0))} />
          {summary && (
            <motion.p className="text-2xl lg:text-4xl font-serif italic font-light text-[#82000D] leading-snug" style={{ textWrap: "balance" } as any} {...mp(fadeUp(0.05))}>
              {summary}
            </motion.p>
          )}
          {character && (
            <motion.p className="text-[0.98rem] font-light text-[#1C1714]/75 leading-[1.85]" {...mp(fadeUp(0.12))}>
              {character}
            </motion.p>
          )}
          {neighborhood?.description && (
            <motion.div className="prose max-w-none text-[#1C1714]/70 font-light leading-relaxed text-left" {...mp(fadeUp(0.16))}>
              <PortableText value={neighborhood.description} />
            </motion.div>
          )}
          <motion.div className="flex flex-col sm:flex-row gap-3 justify-center pt-4" {...mp(fadeUp(0.2))}>
            <Link href={`/properties?search=${encodeURIComponent(name)}`} className="btn-crimson inline-flex items-center justify-center gap-3 px-8 py-4 text-[10px] font-bold tracking-[0.35em] uppercase">
              Listings For Sale <ArrowRight size={13} />
            </Link>
            <Link href="/contact" className="cta-link inline-flex items-center justify-center gap-3 border border-[#82000D]/40 px-8 py-4 text-[10px] font-bold tracking-[0.35em] uppercase text-[#82000D] hover:bg-[#82000D] hover:text-[#FAF8F4] transition-all duration-300">
              Request a Briefing
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Schools & Lifestyle ── */}
      <section className="py-20 lg:py-28 px-6 lg:px-16 bg-[#F3EFE9]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {spotlightImg && (
            <motion.div className="relative aspect-[4/5] overflow-hidden group" {...mp(fadeUp(0))}>
              <Image src={spotlightImg} alt={`${name} living`} fill className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105" sizes="(max-width:1024px) 100vw, 50vw" />
              <div className="card-border-reveal" />
            </motion.div>
          )}
          <motion.div className={`space-y-12 ${spotlightImg ? "" : "lg:col-span-2 max-w-3xl"}`} {...mp(fadeUp(0.1))}>
            <div>
              <p className="eyebrow mb-4">Local Knowledge</p>
              <h2 className="text-3xl lg:text-5xl font-serif font-light text-[#1C1714] leading-tight">
                Living in <em className="italic text-[#82000D]">{name}</em>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-8 border-t border-[#82000D]/12">
              <Listing icon={<GraduationCap size={18} />} title="Schools" items={schools} />
              <Listing icon={<ShoppingBag size={18} />} title="Life & Leisure" items={malls} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Map ── */}
      {guide && (
        <section className="relative h-[480px] lg:h-[680px] w-full border-t border-[#82000D]/12">
          <DistrictMap districts={DISTRICTS} activeSlug={guide.slug} />
          <div className="absolute top-8 left-6 lg:left-16 z-[500] bg-[#FAF8F4]/92 backdrop-blur-md border border-[#82000D]/20 p-7 max-w-xs hidden sm:block">
            <p className="eyebrow mb-3">On the Map</p>
            <h4 className="font-serif text-2xl font-light text-[#1C1714] mb-3">{name} boundaries</h4>
            <p className="text-[0.82rem] font-light text-[#1C1714]/65 leading-relaxed mb-5">
              The crimson demarcation traces {name}&rsquo;s commonly held extent. Pan and zoom to see how it sits within the city.
            </p>
            <Link href="/neighborhoods" className="cta-link text-[9px] font-bold tracking-[0.3em] uppercase text-[#82000D] border-b border-[#82000D]/40 pb-1 inline-block">
              Explore Full Map
            </Link>
          </div>
        </section>
      )}

      <Footer settings={settings} />
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="px-6 lg:px-8 py-7 space-y-2">
      <div className="flex items-center gap-2 text-[#E8DCBF]">
        {icon}
        <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-[#FBF5F2]/65">{label}</span>
      </div>
      <p className="font-serif text-base lg:text-lg font-light text-[#FBF5F2] leading-tight">{value}</p>
    </div>
  );
}

function Listing({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 text-[#82000D]">
        {icon}
        <span className="text-[9px] font-bold tracking-[0.4em] uppercase">{title}</span>
      </div>
      <ul className="space-y-3">
        {items.map((s) => (
          <li key={s} className="text-[0.875rem] font-light text-[#1C1714]/72 border-b border-[#82000D]/10 pb-3">{s}</li>
        ))}
      </ul>
    </div>
  );
}
