"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Map as MapIcon, List as ListIcon, SlidersHorizontal,
  ChevronDown, X, Heart, ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { extractCoordsFromGoogleMapsUrl, getCoordsBySearch } from "@/lib/geocoding";
import { useCurrency } from "@/context/CurrencyContext";
import { DISTRICTS, findDistrict } from "@/lib/neighborhoods";
import type { DistrictMapProperty } from "@/components/DistrictMap";

const DistrictMap = dynamic(() => import("@/components/DistrictMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#180900] flex items-center justify-center text-[#C6A75E]/50 uppercase tracking-[0.3em] text-[10px]">
      Tracing districts…
    </div>
  ),
});

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
  property, isActive, onMouseEnter, isCompareEnabled, isSelected, onToggleSelection,
}: {
  property: Property & { coords?: any };
  isActive: boolean;
  onMouseEnter: () => void;
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
    <div
      onMouseEnter={onMouseEnter}
      className={cn(
        "group relative transition-colors duration-300",
        isActive ? "bg-[#180900]" : "bg-[#0D0501] hover:bg-[#180900]"
      )}
    >
      {isCompareEnabled && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSelection(); }}
          aria-label={isSelected ? "Remove from compare" : "Add to compare"}
          className="absolute top-4 left-4 z-30"
        >
          <span className={cn(
            "w-6 h-6 flex items-center justify-center border transition-all duration-200",
            isSelected ? "bg-[#C6A75E] border-[#C6A75E]" : "border-[#E8DCBF]/60 bg-[#0D0501]/50 backdrop-blur-md hover:border-[#C6A75E]"
          )}>
            <span className={cn("w-2 h-2 bg-[#0D0501] transition-transform duration-200", isSelected ? "scale-100" : "scale-0")} />
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
          <span className="absolute top-3 left-3 bg-[#84262B] text-[#E8DCBF] px-2.5 py-1 text-[8px] font-bold tracking-[0.25em] uppercase">
            {property.propertyType?.[0] || "For Sale"}
          </span>
          <button
            onClick={(e) => e.preventDefault()}
            aria-label="Save"
            className="absolute top-3 right-3 p-2 bg-[#0D0501]/45 backdrop-blur-md text-[#E8DCBF] hover:bg-[#C6A75E] hover:text-[#0D0501] transition-colors duration-200"
          >
            <Heart size={14} />
          </button>
          <div className="card-border-reveal" />
        </div>

        <div className="pt-4 space-y-1.5">
          {districtName && (
            <p className="text-[8px] font-bold tracking-[0.45em] uppercase text-[#C6A75E]">{districtName}</p>
          )}
          <h3 className="font-serif text-xl lg:text-[1.4rem] font-light leading-tight text-[#E8DCBF] group-hover:text-[#C6A75E] transition-colors duration-300 line-clamp-1">
            {property.title}
          </h3>
          <p className="font-serif text-base text-[#E8DCBF]/80">{formatPrice(amount, currency)}</p>
          {details.length > 0 && (
            <div className="flex items-center gap-3 pt-2 text-[9px] font-medium tracking-[0.15em] uppercase text-[#E8DCBF]/45">
              {details.map((d, i) => (
                <span key={i} className="flex items-center gap-3">
                  {i > 0 && <span className="w-1 h-1 bg-[#C6A75E]/40 rounded-full" />}
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
    <button className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.2em] uppercase text-[#E8DCBF]/55 hover:text-[#C6A75E] transition-colors whitespace-nowrap">
      {label} <ChevronDown size={12} className="opacity-60" />
    </button>
  );
}

export default function PropertiesClient({ initialProperties, settings }: PropertiesClientProps) {
  const { formatPrice } = useCurrency();
  const [viewMode, setViewMode] = useState<"split" | "list" | "map">("split");
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null);
  const [isCompareEnabled, setIsCompareEnabled] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 1024 && viewMode === "split") setViewMode("list");
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [viewMode]);

  const togglePropertySelection = (property: Property) =>
    setSelectedProperties((prev) =>
      prev.some((p) => p._id === property._id)
        ? prev.filter((p) => p._id !== property._id)
        : prev.length < 4 ? [...prev, property] : prev
    );

  const processedProperties = useMemo(() =>
    (initialProperties || []).map((p) => {
      const districtName = typeof p.district === "object" ? p.district.name : p.district;
      let coords = p.googleMapsUrl ? extractCoordsFromGoogleMapsUrl(p.googleMapsUrl) : null;
      if (!coords) coords = getCoordsBySearch(p.title, districtName, p.county);
      return { ...p, coords, districtName };
    }), [initialProperties]);

  const filteredProperties = useMemo(() =>
    processedProperties.filter((p) => {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.districtName?.toLowerCase().includes(q);
    }), [processedProperties, searchQuery]);

  /* Map data: registry boundaries for districts that have listings + pins. */
  const { mapDistricts, mapProperties } = useMemo(() => {
    const pins: DistrictMapProperty[] = [];
    const slugs = new Set<string>();
    filteredProperties.forEach((p) => {
      const d = findDistrict(p.districtName);
      if (!d || !p.coords) return;
      slugs.add(d.slug);
      pins.push({
        _id: p._id,
        title: p.title,
        price: formatPrice(typeof p.price === "object" ? p.price.amount : p.price, typeof p.price === "object" ? p.price.currency : "USD"),
        coords: p.coords,
        districtSlug: d.slug,
      });
    });
    const districts = DISTRICTS.filter((d) => slugs.has(d.slug));
    return { mapDistricts: districts.length ? districts : DISTRICTS, mapProperties: pins };
  }, [filteredProperties, formatPrice]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0D0501] text-[#E8DCBF] pt-[72px]">
      <Navbar settings={settings} />

      {/* ── Single slim toolbar (above Leaflet panes, below navbar) ── */}
      <div className="sticky top-[72px] z-[500] h-14 border-b border-[#C6A75E]/12 bg-[#0D0501]/95 backdrop-blur-xl flex items-center gap-4 lg:gap-7 px-4 lg:px-8">
        <div className="relative flex items-center min-w-0 flex-1 lg:flex-none lg:w-72">
          <Search size={14} className="text-[#C6A75E]/60 shrink-0" />
          <input
            type="text"
            placeholder="Search district or building…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none pl-3 text-[10px] font-bold tracking-[0.15em] uppercase text-[#E8DCBF] placeholder:text-[#E8DCBF]/30 focus:outline-none"
          />
        </div>

        <div className="hidden md:flex items-center gap-6 mr-auto">
          <FilterPill label="Price" />
          <FilterPill label="Beds / Baths" />
          <FilterPill label="Type" />
          <button className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.2em] uppercase text-[#E8DCBF]/55 hover:text-[#C6A75E] transition-colors">
            <SlidersHorizontal size={13} /> All Filters
          </button>
        </div>

        <div className="flex items-center gap-4 lg:gap-5 ml-auto md:ml-0 shrink-0">
          <span className="hidden sm:inline text-[9px] font-bold tracking-[0.25em] uppercase text-[#E8DCBF]/40 whitespace-nowrap">
            {filteredProperties.length} Homes
          </span>
          <button
            onClick={() => setIsCompareEnabled((v) => !v)}
            className="flex items-center gap-2 text-[9px] font-bold tracking-[0.2em] uppercase text-[#E8DCBF]/55 hover:text-[#C6A75E] transition-colors"
          >
            <span className="hidden sm:inline">Compare</span>
            <span className={cn("w-8 h-4 rounded-full relative transition-colors duration-300", isCompareEnabled ? "bg-[#C6A75E]" : "bg-[#E8DCBF]/15")}>
              <span className={cn("absolute top-0.5 w-3 h-3 bg-[#0D0501] rounded-full transition-all duration-300", isCompareEnabled ? "left-4" : "left-0.5")} />
            </span>
          </button>
          <button
            onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
            aria-label="Toggle map"
            className="lg:hidden w-9 h-9 border border-[#C6A75E]/20 flex items-center justify-center text-[#E8DCBF]/60"
          >
            {viewMode === "list" ? <MapIcon size={16} /> : <ListIcon size={16} />}
          </button>
        </div>
      </div>

      {/* ── Split: list + sticky map ── */}
      <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-128px)]">
        {/* List */}
        <div className={cn(
          "custom-scrollbar bg-[#0D0501]",
          viewMode === "split" ? "w-full lg:w-[46%] xl:w-[42%] lg:h-full lg:overflow-y-auto"
            : viewMode === "list" ? "w-full" : "hidden"
        )}>
          {filteredProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-32 px-8">
              <p className="font-serif text-2xl font-light text-[#C6A75E] mb-3">No matches yet</p>
              <p className="text-[0.85rem] font-light text-[#E8DCBF]/60 max-w-xs">
                Try a different district or clear your search to see the full collection.
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#C6A75E]/10"
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
                    isActive={activePropertyId === property._id}
                    onMouseEnter={() => setActivePropertyId(property._id)}
                    isCompareEnabled={isCompareEnabled}
                    isSelected={selectedProperties.some((p) => p._id === property._id)}
                    onToggleSelection={() => togglePropertySelection(property)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Map — isolate so Leaflet's high z-index panes stay contained */}
        <div className={cn(
          "relative isolate z-0 bg-[#0D0501]",
          viewMode === "split" ? "hidden lg:block lg:flex-grow lg:h-full"
            : viewMode === "map" ? "w-full h-[64vh]" : "hidden"
        )}>
          <DistrictMap
            districts={mapDistricts}
            properties={mapProperties}
            activePropertyId={activePropertyId}
            fitTo="properties"
          />
        </div>
      </div>

      <Footer settings={settings} />

      {/* ── Compare tray ── */}
      <AnimatePresence>
        {selectedProperties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.32, ease }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] lg:max-w-2xl"
          >
            <div className="bg-[#180900] border border-[#C6A75E]/25 p-4 flex items-center justify-between gap-4 shadow-[0_20px_60px_rgba(13,5,1,0.7)]">
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex -space-x-3">
                  {selectedProperties.map((p) => (
                    <div key={p._id} className="w-9 h-9 border border-[#180900] relative overflow-hidden group">
                      <Image src={p.imageUrl} alt={p.title} fill className="object-cover" />
                      <button onClick={() => togglePropertySelection(p)} className="absolute inset-0 bg-[#0D0501]/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <X size={12} className="text-[#E8DCBF]" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#E8DCBF]">{selectedProperties.length} Selected</p>
                  <button onClick={() => setSelectedProperties([])} className="text-[8px] font-bold tracking-[0.25em] uppercase text-[#E8DCBF]/40 hover:text-[#C6A75E] transition-colors">
                    Clear all
                  </button>
                </div>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(true)}
                disabled={selectedProperties.length < 2}
                className={cn(
                  "px-7 py-3 text-[9px] font-bold tracking-[0.3em] uppercase transition-all duration-200 whitespace-nowrap",
                  selectedProperties.length < 2 ? "bg-[#2A1508] text-[#E8DCBF]/30 cursor-not-allowed" : "btn-crimson"
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
            className="fixed inset-0 z-[100] bg-[#0D0501] overflow-y-auto"
          >
            <div className="min-h-screen p-6 lg:p-12 xl:p-20">
              <div className="flex justify-between items-start mb-12 lg:mb-16">
                <div className="space-y-2">
                  <p className="eyebrow">Portfolio Analysis · {selectedProperties.length} Units</p>
                  <h2 className="text-3xl lg:text-5xl font-serif font-light text-[#E8DCBF]">Side by side</h2>
                </div>
                <button onClick={() => setIsCompareModalOpen(false)} className="p-3.5 border border-[#C6A75E]/20 text-[#E8DCBF]/70 hover:border-[#C6A75E] hover:text-[#C6A75E] transition-colors">
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
                    <div key={spec} className="h-16 flex items-center border-b border-[#C6A75E]/12 text-[9px] font-bold tracking-[0.3em] uppercase text-[#E8DCBF]/40">{spec}</div>
                  ))}
                </div>

                {selectedProperties.map((p) => (
                  <div key={p._id} className="space-y-10">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image src={p.imageUrl} alt={p.title} fill className="object-cover" />
                      <span className="absolute top-0 left-0 bg-[#84262B] text-[#E8DCBF] px-3 py-1.5 text-[8px] font-bold tracking-[0.25em] uppercase">
                        {p.propertyType?.[0] || "Exclusive"}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-center md:text-left">
                      <p className="text-[8px] font-bold tracking-[0.4em] uppercase text-[#C6A75E]">{typeof p.district === "object" ? p.district.name : p.district}</p>
                      <h3 className="text-2xl font-serif font-light text-[#E8DCBF]">{p.title}</h3>
                    </div>
                    <div className="border-t border-[#C6A75E]/12">
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

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #C6A75E40; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

function Row({ label, value, serif, gold }: { label: string; value?: string; serif?: boolean; gold?: boolean }) {
  return (
    <>
      <div className="md:hidden flex justify-between gap-4 py-4 border-b border-[#C6A75E]/10 text-[10px] uppercase tracking-[0.15em]">
        <span className="text-[#E8DCBF]/40 font-bold">{label}</span>
        <span className={cn("text-right", gold ? "text-[#C6A75E] font-bold" : "text-[#E8DCBF]/85")}>{value}</span>
      </div>
      <div className={cn(
        "hidden md:flex h-16 items-center border-b border-[#C6A75E]/12",
        serif ? "font-serif text-xl text-[#E8DCBF]" : gold ? "text-[10px] font-bold tracking-[0.2em] uppercase text-[#C6A75E]" : "text-[10px] font-bold tracking-[0.2em] uppercase text-[#E8DCBF]/70"
      )}>
        {value}
      </div>
    </>
  );
}
