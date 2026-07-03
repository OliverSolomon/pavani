"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Heart,
  FileText,
  Download,
  Printer,
  MapPin,
  Play,
  X,
  Check,
  Scale,
} from "lucide-react";
import { PortableText } from "@portabletext/react";
import { FaYoutube } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import PropertyGallery from "@/components/PropertyGallery";
import MortgageCalculator from "@/components/MortgageCalculator";
import CurrencyBadge from "@/components/CurrencyBadge";
import ContactForm from "@/components/ContactForm";

interface PropertyDetailClientProps {
  property: any;
}

/* Extract a YouTube video id from common URL shapes. */
function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/|live\/))([\w-]{11})/);
  if (m?.[1]) return m[1];
  return /^[\w-]{11}$/.test(url) ? url : null;
}

/* Click-to-load YouTube facade - premium thumbnail + play, loads the iframe only on demand. */
function VideoTour({ url, title }: { url: string; title: string }) {
  const id = getYouTubeId(url);
  const [playing, setPlaying] = useState(false);
  if (!id) return null;

  return (
    <div className="relative w-full aspect-video overflow-hidden border border-[#82000D]/12 bg-[#210A0B] shadow-[0_18px_50px_rgba(33,10,11,0.12)]">
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video tour: ${title}`}
          className="group absolute inset-0 w-full h-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
            alt={`${title} - video tour`}
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`; }}
          />
          <div className="absolute inset-0 bg-[#210A0B]/30 group-hover:bg-[#210A0B]/15 transition-colors duration-300" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[#82000D] text-[#FBF5F2] flex items-center justify-center shadow-[0_10px_30px_rgba(130,0,13,0.45)] transition-transform duration-300 group-hover:scale-105">
              <Play size={26} fill="currentColor" className="ml-1" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

function CompareRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-[#82000D]/8 text-[10px] uppercase tracking-[0.15em]">
      <span className="text-[#1C1714]/40 font-bold shrink-0">{label}</span>
      <span className="text-[#1C1714]/85 font-medium capitalize text-right">{value || "-"}</span>
    </div>
  );
}

export default function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const { formatPrice: globalFormatPrice } = useCurrency();

  const [isLiked, setIsLiked] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");

  // Compare (similar properties, side by side with the current one)
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const toggleCompare = (id: string) =>
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );

  useEffect(() => {
    setCurrentUrl(window.location.href);
    const favorites = JSON.parse(localStorage.getItem("pavani_favorites") || "[]");
    setIsLiked(favorites.includes(property.slug));
  }, [property.slug]);

  const toggleLike = () => {
    const favorites = JSON.parse(localStorage.getItem("pavani_favorites") || "[]");
    let newFavorites;
    if (isLiked) {
      newFavorites = favorites.filter((s: string) => s !== property.slug);
      setShowToast("Removed from saved");
    } else {
      newFavorites = [...favorites, property.slug];
      setShowToast("Saved to collection");
    }
    localStorage.setItem("pavani_favorites", JSON.stringify(newFavorites));
    setIsLiked(!isLiked);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: property.title, text: property.shortDescription, url: currentUrl });
      } catch {}
    } else {
      navigator.clipboard?.writeText(currentUrl);
      setShowToast("Link copied");
      setTimeout(() => setShowToast(null), 3000);
    }
  };

  const mediaItems = useMemo(() => {
    const items = property.media?.map((m: any) => ({
      ...m,
      type: m._type === "externalVideo" ? "video" : "image"
    })) || [];
    if (property.imageUrl && !items.some((m: any) => m.url === property.imageUrl)) {
      items.unshift({ url: property.imageUrl, type: "image" });
    }
    return items;
  }, [property.media, property.imageUrl]);

  const priceAmount = typeof property.price === 'object' ? property.price?.amount : property.price;
  const priceCurrency = typeof property.price === 'object' ? property.price?.currency : "USD";

  return (
    <main className="min-h-screen bg-[#FAF8F4] text-[#1C1714] font-sans">
      <Navbar settings={property.siteSettings} />

      {showToast && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[3000] bg-[#82000D] text-[#FBF5F2] px-8 py-4 text-[10px] font-bold tracking-[0.3em] uppercase">
          {showToast}
        </div>
      )}

      <div className="print:hidden">
        {/* Breadcrumbs */}
        <div className="pt-[5.5rem] pb-3 px-6 lg:px-12 bg-[#F3EFE9] flex flex-wrap items-center justify-center gap-3 text-[8px] lg:text-[9px] font-bold tracking-[0.4em] text-[#1C1714]/40 uppercase border-b border-[#82000D]/10">
          <Link href="/properties" className="hover:text-[#1C1714] transition-colors">ALL PROPERTIES</Link>
          <span>/</span>
          <Link href={`/properties?search=${property.district?.name}`} className="hover:text-[#1C1714] transition-colors">
            {property.district?.name}
          </Link>
          <span>/</span>
          <span className="text-[#1C1714]">{property.title}</span>
        </div>

        {/* Gallery - inset from the screen edges */}
        <div className="pt-6 px-4 sm:px-6 lg:px-12 max-w-[1700px] mx-auto">
          <PropertyGallery media={mediaItems} title={property.title} />
        </div>

        {/* Property Header */}
        <motion.section
          className="py-12 lg:py-20 px-6 text-center max-w-4xl mx-auto border-b border-[#82000D]/10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="space-y-3 mb-8">
            <p className="text-[9px] font-bold tracking-[0.5em] text-[#82000D] uppercase">
              <span className="capitalize">{property.propertyType?.[0] || "Exclusive Listing"}</span>
              {property.status ? <span className="text-[#1C1714]/40"> · {property.status}</span> : null}
            </p>
            <h1 className="text-3xl lg:text-5xl font-serif tracking-tight text-[#1C1714] capitalize leading-tight">{property.title}</h1>
            <p className="text-[10px] tracking-[0.4em] text-[#1C1714]/40 uppercase font-bold flex items-center justify-center gap-2">
              <MapPin size={10} className="text-[#82000D]" />
              {property.buildingName && `${property.buildingName}, `}{property.street && `${property.street}, `}{property.district?.name}, {property.county}
            </p>
          </div>

          <div className="h-px w-8 bg-[#82000D] mx-auto mb-8" />

          <div className="mb-10">
            <p className="text-[9px] font-bold tracking-[0.5em] text-[#1C1714]/40 uppercase mb-3">Starting From</p>
            {priceAmount ? (
              <CurrencyBadge
                amount={priceAmount}
                baseCurrency={priceCurrency}
                className="text-4xl lg:text-6xl font-serif text-[#1C1714] tracking-tighter justify-center"
              />
            ) : (
              <p className="text-4xl lg:text-5xl font-serif text-[#1C1714]">Price on Request</p>
            )}
          </div>

          <div className="flex flex-wrap justify-center items-center gap-10 lg:gap-20">
            {[
              { label: "BEDROOMS", value: property.details?.split("|")[0]?.trim() || "-" },
              { label: "BATHROOMS", value: property.details?.split("|")[1]?.trim() || "-" },
              { label: "APPROX. SIZE", value: property.size || "On Request" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <p className="text-xl lg:text-2xl font-serif text-[#1C1714]">{stat.value}</p>
                <p className="text-[8px] font-bold tracking-[0.4em] text-[#1C1714]/40 uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Main Content + Sidebar */}
        <section className="py-12 lg:py-20 px-6 lg:px-16 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Content */}
          <div className="lg:col-span-8 space-y-16">
            {/* Description */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px w-10 bg-[#82000D]" />
                <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#82000D]">The Property</h2>
              </div>
              <p className="text-xl lg:text-2xl font-normal font-serif italic text-[#82000D] leading-relaxed">
                {property.shortDescription || "A residence of unparalleled distinction and architectural purity."}
              </p>
              <div className="prose prose-lg max-w-none text-[#1C1714]/88 font-normal leading-relaxed">
                {property.longDescription ? <PortableText value={property.longDescription} /> : (
                  <p>Detailed architectural specifications and floor plans are available upon request. Contact our advisors for a private presentation.</p>
                )}
              </div>
            </div>

            {/* Property Features */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px w-10 bg-[#82000D]" />
                  <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#82000D]">Features & Amenities</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 py-3 border-b border-[#82000D]/8">
                      <div className="w-1 h-1 bg-[#82000D] shrink-0" />
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#1C1714]/70">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compliance Documents */}
            {property.verificationDocuments?.length > 0 && (
              <div className="bg-[#FFFFFF] p-8 lg:p-12 space-y-8 border border-[#82000D]/10">
                <div>
                  <h3 className="text-xl font-serif uppercase tracking-tight mb-1">Compliance & Verification</h3>
                  <p className="text-[10px] font-bold tracking-widest text-[#1C1714]/40 uppercase">Verified Asset Dossier</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#82000D]/15 border border-[#82000D]/15">
                  {property.verificationDocuments.map((doc: any, i: number) => (
                    <div key={i} className="bg-[#F3EFE9] p-6 flex items-center justify-between group hover:bg-[#FFFFFF] transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <FileText className="text-[#82000D]" size={20} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">{doc.originalFilename}</span>
                      </div>
                      <Download size={16} className="text-[#1C1714]/40 group-hover:text-[#82000D] transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property Video Tour */}
            {property.videoTour && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px w-10 bg-[#82000D]" />
                  <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#82000D] flex items-center gap-2.5">
                    <FaYoutube size={15} className="text-[#82000D]" /> Property Video Tour
                  </h2>
                </div>
                <VideoTour url={property.videoTour} title={property.title} />
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 h-fit space-y-6">

            {/* Inquiry form - replaces the listing-agent card */}
            <div id="enquire-section" className="bg-[#FFFFFF] border border-[#82000D]/10 p-7 lg:p-8 scroll-mt-28">
              <div className="mb-8 text-center">
                <p className="text-[10px] font-bold tracking-[0.4em] text-[#82000D] uppercase mb-3">Interested in this property?</p>
                <h3 className="text-2xl font-serif text-[#1C1714]">Send an Enquiry</h3>
              </div>
              <ContactForm
                initialInquiryType="Buying a Property"
                prefilledMessage={`Hello, I would like more information about the property "${property.title}".`}
              />
            </div>

            {/* Quick Actions */}
            <div className="flex justify-center gap-10 text-[#1C1714]/60 border border-[#82000D]/10 py-6 bg-[#FFFFFF] shadow-sm">
              <button onClick={handleShare} className="flex flex-col items-center gap-2 hover:text-[#82000D] transition-colors">
                <Share2 size={18} /><span className="text-[8px] font-bold uppercase tracking-widest">Share</span>
              </button>
              <button onClick={() => window.print()} className="flex flex-col items-center gap-2 hover:text-[#82000D] transition-colors">
                <Printer size={18} /><span className="text-[8px] font-bold uppercase tracking-widest">Print</span>
              </button>
              <button onClick={toggleLike} className={cn("flex flex-col items-center gap-2 transition-colors", isLiked ? "text-[#82000D]" : "hover:text-[#82000D]")}>
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} /><span className="text-[8px] font-bold uppercase tracking-widest">{isLiked ? "Saved" : "Save"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Mortgage Section */}
        <section className="py-20 lg:py-28 px-6 lg:px-16 max-w-[1100px] mx-auto border-t border-[#82000D]/10">
          <div className="max-w-2xl">
            <div className="mb-8">
              <h3 className="text-3xl font-serif text-[#1C1714] mb-4">Mortgage <em className="italic text-[#82000D]">Calculator</em></h3>
              <p className="text-[0.95rem] font-normal text-[#1C1714]/70 leading-relaxed">
                Estimate your monthly payments. Adjust the home price, down payment, and interest rate to see how they impact your costs.
              </p>
            </div>
            <div className="bg-[#FFFFFF] shadow-[0_10px_40px_rgba(28,23,20,0.03)] border border-[#82000D]/5 p-2">
              <MortgageCalculator propertyPrice={priceAmount ? Number(priceAmount) : undefined} className="border-none shadow-none" />
            </div>
          </div>
        </section>

        {/* Similar Listings */}
        {property.similarProperties?.length > 0 && (
          <section className="py-24 bg-[#F3EFE9] px-6 lg:px-16 border-t border-[#82000D]/10">
            <div className="text-center space-y-3 mb-8">
              <p className="text-[9px] font-bold tracking-[0.5em] text-[#82000D] uppercase">Curated Portfolio</p>
              <h2 className="text-2xl lg:text-4xl font-serif uppercase tracking-tight">Similar Properties</h2>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#1C1714]/40">Tick properties to compare them side by side</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1700px] mx-auto">
              {property.similarProperties.map((p: any) => {
                const selected = compareIds.includes(p._id);
                return (
                  <div key={p._id} className={cn("relative group bg-[#FFFFFF] border transition-colors duration-200", selected ? "border-[#82000D]" : "border-[#82000D]/10")}>
                    <button
                      type="button"
                      onClick={() => toggleCompare(p._id)}
                      aria-label={selected ? "Remove from compare" : "Add to compare"}
                      className="absolute top-3 right-3 z-20"
                    >
                      <span className={cn(
                        "w-6 h-6 flex items-center justify-center border transition-all duration-200",
                        selected ? "bg-[#82000D] border-[#82000D] text-[#FBF5F2]" : "bg-[#FAF8F4]/80 backdrop-blur-sm border-[#82000D]/40 text-transparent hover:border-[#82000D]"
                      )}>
                        <Check size={13} />
                      </span>
                    </button>
                    <Link href={`/properties/${p.slug}`} className="block">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {p.imageUrl ? (
                          <Image src={p.imageUrl} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                        ) : (
                          <div className="w-full h-full bg-[#ECE6DD] flex items-center justify-center"><span className="font-serif text-4xl text-[#82000D]/30">P</span></div>
                        )}
                        <div className="absolute top-0 left-0 bg-[#82000D] text-[#FBF5F2] px-3 py-1.5 text-[8px] font-bold tracking-widest uppercase">EXCLUSIVE</div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <p className="text-xl font-serif text-[#1C1714] mb-1">
                            {globalFormatPrice(typeof p.price === 'object' ? p.price.amount : p.price, typeof p.price === 'object' ? p.price.currency : "USD")}
                          </p>
                          <h3 className="text-[11px] font-bold tracking-widest text-[#1C1714]/50 uppercase line-clamp-1">{p.title}</h3>
                        </div>
                        <div className="pt-4 border-t border-[#82000D]/8 flex items-center justify-between text-[9px] font-bold tracking-widest text-[#1C1714]/40 uppercase">
                          <span>{p.details?.split("|")[0]?.trim() || "-"}</span>
                          <span>{p.details?.split("|")[1]?.trim() || "-"}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Compare bar */}
      <AnimatePresence>
        {compareIds.length > 0 && !compareOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] print:hidden"
          >
            <div className="glass-card flex items-center gap-4 pl-6 pr-3 py-3">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#1C1714]">{compareIds.length} selected</span>
              <button onClick={() => setCompareIds([])} className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#1C1714]/45 hover:text-[#82000D] transition-colors">Clear</button>
              <button onClick={() => setCompareOpen(true)} className="btn-crimson inline-flex items-center gap-2 px-6 py-3 text-[10px] font-bold tracking-[0.3em] uppercase">
                <Scale size={13} /> Compare
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare modal (side by side) */}
      <AnimatePresence>
        {compareOpen && (() => {
          const selectedSimilars = (property.similarProperties || []).filter((p: any) => compareIds.includes(p._id));
          const items = [
            { _id: property._id, title: property.title, imageUrl: property.imageUrl, amount: priceAmount, currency: priceCurrency, district: property.district?.name, type: property.propertyType?.[0], details: property.details, current: true, slug: undefined as string | undefined },
            ...selectedSimilars.map((p: any) => ({ _id: p._id, slug: p.slug, title: p.title, imageUrl: p.imageUrl, amount: typeof p.price === "object" ? p.price.amount : p.price, currency: typeof p.price === "object" ? p.price.currency : "USD", district: p.district, type: p.propertyType?.[0], details: p.details, current: false })),
          ];
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fixed inset-0 z-[100] bg-[#FAF8F4] overflow-y-auto print:hidden">
              <div className="min-h-screen p-6 lg:p-12 xl:p-16">
                <div className="flex justify-between items-start mb-10 lg:mb-14">
                  <div className="space-y-2">
                    <p className="eyebrow">Side by side · {items.length} properties</p>
                    <h2 className="text-3xl lg:text-5xl font-serif font-light text-[#1C1714]">Compare</h2>
                  </div>
                  <button onClick={() => setCompareOpen(false)} aria-label="Close compare" className="p-3.5 border border-[#82000D]/20 text-[#1C1714]/70 hover:border-[#82000D] hover:text-[#82000D] transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <div className={cn("grid gap-6 lg:gap-8", items.length <= 2 ? "sm:grid-cols-2 max-w-3xl" : "sm:grid-cols-2 lg:grid-cols-4")}>
                  {items.map((it) => (
                    <div key={it._id} className="border border-[#82000D]/12 bg-[#FFFFFF]">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {it.imageUrl ? (
                          <Image src={it.imageUrl} alt={it.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#ECE6DD] flex items-center justify-center"><span className="font-serif text-4xl text-[#82000D]/30">P</span></div>
                        )}
                        {it.current && <span className="absolute top-0 left-0 bg-[#82000D] text-[#FBF5F2] px-3 py-1.5 text-[8px] font-bold tracking-[0.25em] uppercase">This Property</span>}
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="space-y-1">
                          <p className="text-[8px] font-bold tracking-[0.4em] uppercase text-[#82000D]">{it.district || "-"}</p>
                          <h3 className="font-serif text-lg font-light text-[#1C1714] capitalize line-clamp-1">{it.title}</h3>
                          <p className="font-serif text-xl text-[#1C1714]">{globalFormatPrice(it.amount, it.currency)}</p>
                        </div>
                        <div className="border-t border-[#82000D]/10">
                          <CompareRow label="Type" value={it.type} />
                          <CompareRow label="Bedrooms" value={it.details?.split("|")[0]?.trim()} />
                          <CompareRow label="Bathrooms" value={it.details?.split("|")[1]?.trim()} />
                        </div>
                        {!it.current && it.slug && (
                          <Link href={`/properties/${it.slug}`} onClick={() => setCompareOpen(false)} className="btn-crimson flex items-center justify-center w-full py-3 text-[9px] font-bold tracking-[0.3em] uppercase">View Details</Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <Footer settings={property.siteSettings} />

      <style jsx global>{`
        * { border-radius: 0 !important; }
        .prose p { margin-bottom: 1.5em; }
      `}</style>
    </main>
  );
}
