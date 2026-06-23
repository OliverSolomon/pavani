"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, ChevronDown, X, Heart, ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";

const ease = [0.23, 1, 0.32, 1] as const;

interface Property {
  _id: string;
  title: string;
  slug: string;
  buildingName?: string;
  price: { amount: string; currency: string } | string;
  imageUrl: string;
  county: string;
  district: { name: string; boundary?: { lat: number; lng: number }[] } | string;
  details?: string;
  propertyType?: string[];
  shortDescription?: string;
  googleMapsUrl?: string;
  amenities?: string[];
  size?: string;
  yearBuilt?: string;
  media?: any[];
}

interface PropertiesClientProps {
  initialProperties: Property[];
  settings?: { general?: any; brand?: any; contact?: any; socials?: any };
}

/* ── Listing card — echoes the neighbourhoods design language ── */
function PropertyCard({
  property, isCompareEnabled, isSelected, onToggleSelection,
}: {
  property: Property;
  isCompareEnabled: boolean;
  isSelected: boolean;
  onToggleSelection: () => void;
}) {
  const { formatPrice } = useCurrency();
  const amount = typeof property.price === "object" ? property.price.amount : property.price;
  const currency = typeof property.price === "object" ? property.price.currency : "USD";
  const districtName = typeof property.district === "object" ? property.district.name : property.district;
  const details = property.details?.split("|").map((d) => d.trim()).filter(Boolean) || [];

  return (
    <div className="group relative bg-[#FFFFFF] hover:bg-[#F3EFE9] transition-colors duration-300">
      {isCompareEnabled && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSelection(); }}
          aria-label={isSelected ? "Remove from compare" : "Add to compare"}
          className="absolute top-4 left-4 z-30"
        >
          <span className={cn(
            "w-6 h-6 flex items-center justify-center border transition-all duration-200",
            isSelected ? "bg-[#82000D] border-[#82000D]" : "border-[#82000D]/40 bg-[#FFFFFF]/60 backdrop-blur-md hover:border-[#82000D]"
          )}>
            <span className={cn("w-2 h-2 bg-[#FBF5F2] transition-transform duration-200", isSelected ? "scale-100" : "scale-0")} />
          </span>
        </button>
      )}

      <Link href={`/properties/${property.slug}`} className="block p-3 lg:p-4">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={property.imageUrl}
            alt={property.title}
            fill
            sizes="(max-width:768px) 100vw, 40vw"
            className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105"
          />
          <span className="absolute top-3 left-3 bg-[#82000D] text-[#FBF5F2] px-2.5 py-1 text-[8px] font-bold tracking-[0.25em] uppercase">
            {property.propertyType?.[0] || "For Sale"}
          </span>
          <button
            onClick={(e) => e.preventDefault()}
            aria-label="Save"
            className="absolute top-3 right-3 p-2 bg-[#FFFFFF]/55 backdrop-blur-md text-[#82000D] hover:bg-[#82000D] hover:text-[#FBF5F2] transition-colors duration-200"
          >
            <Heart size={14} />
          </button>
          <div className="card-border-reveal" />
        </div>

        <div className="pt-4 space-y-1.5">
          {districtName && (
            <p className="text-[8px] font-bold tracking-[0.45em] uppercase text-[#82000D]">{districtName}</p>
          )}
          <h3 className="font-serif text-xl lg:text-[1.4rem] font-normal leading-tight text-[#1C1714] group-hover:text-[#82000D] transition-colors duration-300 line-clamp-1">
            {property.title}
          </h3>
          <p className="font-serif text-base text-[#1C1714]/90">{formatPrice(amount, currency)}</p>
          {details.length > 0 && (
            <div className="flex items-center gap-3 pt-2 text-[9px] font-medium tracking-[0.15em] uppercase text-[#1C1714]/45">
              {details.map((d, i) => (
                <span key={i} className="flex items-center gap-3">
                  {i > 0 && <span className="w-1 h-1 bg-[#82000D]/40 rounded-full" />}
                  {d}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

/* ── Compact filter pill ── */
function FilterPill({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.2em] uppercase text-[#1C1714]/74 hover:text-[#82000D] transition-colors whitespace-nowrap">
      {label} <ChevronDown size={12} className="opacity-60" />
    </button>
  );
}

export default function PropertiesClient({ initialProperties, settings }: PropertiesClientProps) {
  const { formatPrice } = useCurrency();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [isCompareEnabled, setIsCompareEnabled] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const togglePropertySelection = (property: Property) =>
    setSelectedProperties((prev) =>
      prev.some((p) => p._id === property._id)
        ? prev.filter((p) => p._id !== property._id)
        : prev.length < 4 ? [...prev, property] : prev
    );

  const filteredProperties = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return (initialProperties || []).filter((p) => {
      const districtName = typeof p.district === "object" ? p.district.name : p.district;
      return p.title.toLowerCase().includes(q) || districtName?.toLowerCase().includes(q);
    });
  }, [initialProperties, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F4] text-[#1C1714] pt-[72px]">
      <Navbar settings={settings} />

      {/* ── Page heading ── */}
      <div className="px-6 lg:px-10 pt-12 pb-8 max-w-[1700px] mx-auto w-full">
        <p className="eyebrow mb-3">The Collection</p>
        <h1 className="text-3xl lg:text-5xl font-serif font-normal text-[#1C1714]">
          Available <em className="italic text-[#82000D]">Residences</em>
        </h1>
      </div>

      {/* ── Single slim toolbar (glass) ── */}
      <div className="sticky top-[72px] z-[40] h-14 border-y border-[#82000D]/12 glass-nav flex items-center gap-4 lg:gap-7 px-4 lg:px-8">
        <div className="relative flex items-center min-w-0 flex-1 lg:flex-none lg:w-72">
          <Search size={14} className="text-[#82000D]/60 shrink-0" />
          <input
            type="text"
            placeholder="Search district or building…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none pl-3 text-[10px] font-bold tracking-[0.15em] uppercase text-[#1C1714] placeholder:text-[#1C1714]/30 focus:outline-none"
          />
        </div>

        <div className="hidden md:flex items-center gap-6 mr-auto">
          <FilterPill label="Price" />
          <FilterPill label="Beds / Baths" />
          <FilterPill label="Type" />
          <button className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.2em] uppercase text-[#1C1714]/74 hover:text-[#82000D] transition-colors">
            <SlidersHorizontal size={13} /> All Filters
          </button>
        </div>

        <div className="flex items-center gap-4 lg:gap-5 ml-auto md:ml-0 shrink-0">
          <span className="hidden sm:inline text-[9px] font-bold tracking-[0.25em] uppercase text-[#1C1714]/40 whitespace-nowrap">
            {filteredProperties.length} Homes
          </span>
          <button
            onClick={() => setIsCompareEnabled((v) => !v)}
            className="flex items-center gap-2 text-[9px] font-bold tracking-[0.2em] uppercase text-[#1C1714]/74 hover:text-[#82000D] transition-colors"
          >
            <span className="hidden sm:inline">Compare</span>
            <span className={cn("w-8 h-4 rounded-full relative transition-colors duration-300", isCompareEnabled ? "bg-[#82000D]" : "bg-[#1C1714]/15")}>
              <span className={cn("absolute top-0.5 w-3 h-3 bg-[#FBF5F2] rounded-full transition-all duration-300", isCompareEnabled ? "left-4" : "left-0.5")} />
            </span>
          </button>
        </div>
      </div>

      {/* ── Property grid ── */}
      <div className="flex-grow px-4 lg:px-8 py-8 max-w-[1700px] mx-auto w-full">
        {filteredProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-32 px-8">
            <p className="font-serif text-2xl font-normal text-[#82000D] mb-3">No matches yet</p>
            <p className="text-[0.85rem] font-normal text-[#1C1714]/78 max-w-xs">
              Try a different district or clear your search to see the full collection.
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-[#82000D]/10 border border-[#82000D]/10"
            initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          >
            {filteredProperties.map((property) => (
              <motion.div
                key={property._id}
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, ease }}
              >
                <PropertyCard
                  property={property}
                  isCompareEnabled={isCompareEnabled}
                  isSelected={selectedProperties.some((p) => p._id === property._id)}
                  onToggleSelection={() => togglePropertySelection(property)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <Footer settings={settings} />

      {/* ── Compare tray (glass) ── */}
      <AnimatePresence>
        {selectedProperties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.32, ease }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] lg:max-w-2xl"
          >
            <div className="glass-card p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex -space-x-3">
                  {selectedProperties.map((p) => (
                    <div key={p._id} className="w-9 h-9 border border-[#FFFFFF] relative overflow-hidden group">
                      <Image src={p.imageUrl} alt={p.title} fill className="object-cover" />
                      <button onClick={() => togglePropertySelection(p)} className="absolute inset-0 bg-[#210A0B]/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <X size={12} className="text-[#FBF5F2]" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#1C1714]">{selectedProperties.length} Selected</p>
                  <button onClick={() => setSelectedProperties([])} className="text-[8px] font-bold tracking-[0.25em] uppercase text-[#1C1714]/40 hover:text-[#82000D] transition-colors">
                    Clear all
                  </button>
                </div>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(true)}
                disabled={selectedProperties.length < 2}
                className={cn(
                  "px-7 py-3 text-[9px] font-bold tracking-[0.3em] uppercase transition-all duration-200 whitespace-nowrap",
                  selectedProperties.length < 2 ? "bg-[#ECE6DD] text-[#1C1714]/30 cursor-not-allowed" : "btn-crimson"
                )}
              >
                Compare ({selectedProperties.length}/4)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Compare modal (themed) ── */}
      <AnimatePresence>
        {isCompareModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-[#FAF8F4] overflow-y-auto"
          >
            <div className="min-h-screen p-6 lg:p-12 xl:p-20">
              <div className="flex justify-between items-start mb-12 lg:mb-16">
                <div className="space-y-2">
                  <p className="eyebrow">Portfolio Analysis · {selectedProperties.length} Units</p>
                  <h2 className="text-3xl lg:text-5xl font-serif font-normal text-[#1C1714]">Side by side</h2>
                </div>
                <button onClick={() => setIsCompareModalOpen(false)} className="p-3.5 border border-[#82000D]/20 text-[#1C1714]/85 hover:border-[#82000D] hover:text-[#82000D] transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className={cn(
                "grid gap-8 lg:gap-10",
                selectedProperties.length === 2 ? "grid-cols-1 md:grid-cols-3"
                  : selectedProperties.length === 3 ? "grid-cols-1 md:grid-cols-4" : "grid-cols-1 md:grid-cols-5"
              )}>
                <div className="hidden md:block space-y-12 pt-[340px]">
                  {["Price", "District", "Type", "Space", "Amenities", "Completion", "Status"].map((spec) => (
                    <div key={spec} className="h-16 flex items-center border-b border-[#82000D]/12 text-[9px] font-bold tracking-[0.3em] uppercase text-[#1C1714]/40">{spec}</div>
                  ))}
                </div>

                {selectedProperties.map((p) => (
                  <div key={p._id} className="space-y-10">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image src={p.imageUrl} alt={p.title} fill className="object-cover" />
                      <span className="absolute top-0 left-0 bg-[#82000D] text-[#FBF5F2] px-3 py-1.5 text-[8px] font-bold tracking-[0.25em] uppercase">
                        {p.propertyType?.[0] || "Exclusive"}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-center md:text-left">
                      <p className="text-[8px] font-bold tracking-[0.4em] uppercase text-[#82000D]">{typeof p.district === "object" ? p.district.name : p.district}</p>
                      <h3 className="text-2xl font-serif font-normal text-[#1C1714]">{p.title}</h3>
                    </div>
                    <div className="border-t border-[#82000D]/12">
                      <Row label="Price" value={formatPrice(typeof p.price === "object" ? p.price.amount : p.price, typeof p.price === "object" ? p.price.currency : "USD")} serif />
                      <Row label="District" value={typeof p.district === "object" ? p.district.name : p.district} />
                      <Row label="Type" value={p.propertyType?.slice(0, 2).join(" / ") || "Residential"} />
                      <Row label="Space" value={`${p.details || "—"}${p.size ? ` · ${p.size}` : ""}`} />
                      <Row label="Amenities" value={p.amenities?.slice(0, 3).join(", ") || "On request"} />
                      <Row label="Completion" value={p.yearBuilt || "Ready"} />
                      <Row label="Status" value="Available" gold />
                    </div>
                    <Link href={`/properties/${p.slug}`} className="btn-crimson flex items-center justify-center gap-3 w-full py-4 text-[9px] font-bold tracking-[0.35em] uppercase">
                      View Details <ArrowRight size={12} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, value, serif, gold }: { label: string; value?: string; serif?: boolean; gold?: boolean }) {
  return (
    <>
      <div className="md:hidden flex justify-between gap-4 py-4 border-b border-[#82000D]/10 text-[10px] uppercase tracking-[0.15em]">
        <span className="text-[#1C1714]/40 font-bold">{label}</span>
        <span className={cn("text-right", gold ? "text-[#82000D] font-bold" : "text-[#1C1714]/90")}>{value}</span>
      </div>
      <div className={cn(
        "hidden md:flex h-16 items-center border-b border-[#82000D]/12",
        serif ? "font-serif text-xl text-[#1C1714]" : gold ? "text-[10px] font-bold tracking-[0.2em] uppercase text-[#82000D]" : "text-[10px] font-bold tracking-[0.2em] uppercase text-[#1C1714]/85"
      )}>
        {value}
      </div>
    </>
  );
}
