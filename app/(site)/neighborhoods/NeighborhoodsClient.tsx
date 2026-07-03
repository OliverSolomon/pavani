"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, MapPin, GraduationCap, ShoppingBag, Clock, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DISTRICTS, findDistrict } from "@/lib/neighborhoods";
import type { DistrictMapProperty } from "@/components/DistrictMap";
import { extractCoordsFromGoogleMapsUrl, getCoordsBySearch } from "@/lib/geocoding";

const DistrictMap = dynamic(() => import("@/components/DistrictMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#F3EFE9] flex items-center justify-center text-[#82000D]/50 tracking-[0.3em] text-[10px] uppercase">
      Tracing districts…
    </div>
  ),
});

const ease = [0.23, 1, 0.32, 1] as const;

interface Props {
  neighborhoods: any[];
  settings: any;
}

export default function NeighborhoodsClient({ neighborhoods, settings }: Props) {
  const reduce = useReducedMotion();
  const [activeSlug, setActiveSlug] = useState<string | null>(DISTRICTS[0].slug);

  /* Match live Sanity listings to registry districts (count + map pins). */
  const { countBySlug, mapProperties } = useMemo(() => {
    const count: Record<string, number> = {};
    const pins: DistrictMapProperty[] = [];
    (neighborhoods || []).forEach((n) => {
      const d = findDistrict(n.name);
      if (!d) return;
      const props = n.properties || [];
      count[d.slug] = (count[d.slug] || 0) + props.length;
      props.forEach((p: any) => {
        let coords = p.googleMapsUrl ? extractCoordsFromGoogleMapsUrl(p.googleMapsUrl) : null;
        if (!coords) coords = getCoordsBySearch(p.title, n.name, p.county);
        if (coords) pins.push({ _id: p._id, title: p.title, price: p.price?.amount ? `${p.price.amount} ${p.price.currency || ""}` : undefined, coords, districtSlug: d.slug });
      });
    });
    return { countBySlug: count, mapProperties: pins };
  }, [neighborhoods]);

  const mp = <T extends object>(p: T) => (reduce ? {} : p);

  return (
    <main className="min-h-screen bg-[#FAF8F4] text-[#1C1714]">
      <Navbar settings={settings} />

      {/* ── Header ── */}
      <section className="pt-32 lg:pt-40 px-6 lg:px-16 pb-12 lg:pb-16">
        <div className="max-w-[1400px] mx-auto">
          <motion.p className="eyebrow mb-5" {...mp({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease } })}>
            The Pavani Guide
          </motion.p>
          <motion.h1
            className="text-5xl lg:text-7xl xl:text-[5rem] font-serif font-normal leading-[0.95] text-[#1C1714] max-w-4xl"
            style={{ textWrap: "balance" } as any}
            {...mp({ initial: { opacity: 0, y: 22, filter: "blur(6px)" }, animate: { opacity: 1, y: 0, filter: "blur(0px)" }, transition: { duration: 0.85, ease, delay: 0.08 } })}
          >
            Nairobi, read{" "}
            <em className="italic text-[#82000D]">district by district.</em>
          </motion.h1>
          <motion.p
            className="mt-7 text-[0.95rem] font-normal text-[#1C1714]/86 leading-[1.78] max-w-xl"
            {...mp({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease, delay: 0.2 } })}
          >
            Every address tells a different story - of pace, privacy and place. Explore the
            neighbourhoods we represent, trace their true boundaries on the map, and find the one
            that already feels like yours.
          </motion.p>
        </div>
      </section>

      {/* ── Explorer: list + detail (left), sticky map (right) ── */}
      <section className="px-6 lg:px-16 pb-24">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_1.05fr] gap-px bg-[#82000D]/12 border border-[#82000D]/12">
          {/* LEFT */}
          <div className="bg-[#FAF8F4] lg:max-h-[80vh] lg:overflow-y-auto no-scrollbar">
            {/* District list - inline accordion */}
            <div className="divide-y divide-[#82000D]/10">
              {DISTRICTS.map((d, i) => {
                const isActive = activeSlug === d.slug;
                const count = countBySlug[d.slug] || 0;
                return (
                  <motion.div
                    key={d.slug}
                    {...mp({ initial: { opacity: 0, x: -16 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true, amount: 0.5 }, transition: { duration: 0.5, ease, delay: i * 0.03 } })}
                  >
                    <button
                      onClick={() => setActiveSlug(isActive ? null : d.slug)}
                      aria-expanded={isActive}
                      className={`group w-full text-left px-7 lg:px-9 py-6 flex items-baseline justify-between gap-4 transition-colors duration-300 ${isActive ? "bg-[#82000D]/[0.05]" : "hover:bg-[#F3EFE9]"}`}
                    >
                      <div className="min-w-0">
                        <h3 className={`font-serif text-2xl lg:text-[1.7rem] font-normal leading-tight transition-colors duration-300 ${isActive ? "text-[#82000D]" : "text-[#1C1714] group-hover:text-[#82000D]"}`}>
                          {d.name}
                        </h3>
                        <p className="mt-1 text-[0.8rem] font-normal text-[#1C1714]/74 leading-snug truncate">{d.tagline}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-[#1C1714]/45 whitespace-nowrap">
                          {count > 0 ? `${count} Listing${count === 1 ? "" : "s"}` : "Guide"}
                        </span>
                        <span className={`h-7 w-7 flex items-center justify-center border transition-all duration-300 ${isActive ? "bg-[#82000D] border-[#82000D] text-[#FAF8F4] rotate-90" : "border-[#82000D]/25 text-[#82000D]/60 group-hover:border-[#82000D]"}`}>
                          <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </button>

                    {/* Inline deep-dive */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={reduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduce ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease }}
                          className="overflow-hidden bg-[#82000D]/[0.05]"
                        >
                          <div className="px-7 lg:px-9 pb-10 pt-2">
                            <p className="font-serif italic text-xl lg:text-2xl text-[#82000D] leading-snug mb-5">{d.summary}</p>
                            <p className="text-[0.9rem] font-normal text-[#1C1714]/86 leading-[1.8] mb-8">{d.character}</p>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                              {d.stats.map((s) => (
                                <div key={s.label} className="border-t border-[#82000D]/20 pt-3">
                                  <p className="font-serif text-2xl font-normal text-[#82000D] leading-none">{s.value}</p>
                                  <p className="mt-1.5 text-[8px] font-bold tracking-[0.25em] uppercase text-[#1C1714]/70">{s.label}</p>
                                </div>
                              ))}
                            </div>

                            <div className="space-y-3 mb-8 text-[0.82rem]">
                              <Fact icon={<Building2 size={14} />} label="Built form" value={d.builtForm} />
                              <Fact icon={<MapPin size={14} />} label="Price band" value={d.priceBand} />
                              <Fact icon={<Clock size={14} />} label="To the CBD" value={d.commuteCBD} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 mb-9">
                              <Column icon={<GraduationCap size={15} />} title="Schools">{d.schools}</Column>
                              <Column icon={<ShoppingBag size={15} />} title="Life & Leisure">{d.lifestyle}</Column>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-9">
                              {d.vibe.map((v) => (
                                <span key={v} className="px-3 py-1.5 text-[8px] font-bold tracking-[0.25em] uppercase text-[#82000D] border border-[#82000D]/25">{v}</span>
                              ))}
                            </div>

                            <Link
                              href={`/properties?search=${encodeURIComponent(d.name)}`}
                              className="btn-crimson inline-flex items-center gap-3 px-7 py-3.5 text-[9px] font-bold tracking-[0.35em] uppercase"
                            >
                              View {d.name} Listings <ArrowRight size={12} />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT - sticky map */}
          <div className="bg-[#FAF8F4] relative h-[420px] lg:h-[80vh] lg:sticky lg:top-[72px]">
            <DistrictMap
              districts={DISTRICTS}
              properties={mapProperties}
              activeSlug={activeSlug}
              onSelect={setActiveSlug}
            />
            {/* Legend */}
            <div className="absolute bottom-5 left-5 z-[500] bg-[#FAF8F4]/90 backdrop-blur-md border border-[#82000D]/20 px-5 py-4 space-y-2.5">
              <p className="text-[8px] font-bold tracking-[0.3em] uppercase text-[#82000D]/70">Legend</p>
              <Legend swatch={<span className="block w-4 h-0 border-t border-dashed border-[#82000D]" />} label="District boundary" />
              <Legend swatch={<span className="block w-2.5 h-2.5 rounded-full bg-[#82000D]" />} label="Active listing" />
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings} />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[#82000D]/70">{icon}</span>
      <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-[#1C1714]/45 w-24 shrink-0">{label}</span>
      <span className="font-normal text-[#1C1714]/90">{value}</span>
    </div>
  );
}

function Column({ icon, title, children }: { icon: React.ReactNode; title: string; children: string[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-[#82000D]">
        {icon}
        <span className="text-[8px] font-bold tracking-[0.35em] uppercase">{title}</span>
      </div>
      <ul className="space-y-2">
        {children.map((c) => (
          <li key={c} className="text-[0.82rem] font-normal text-[#1C1714]/86 border-b border-[#82000D]/8 pb-2">{c}</li>
        ))}
      </ul>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      {swatch}
      <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-[#1C1714]/82">{label}</span>
    </div>
  );
}
