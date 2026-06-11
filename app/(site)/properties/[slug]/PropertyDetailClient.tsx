"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Share2,
  Heart,
  FileText,
  Download,
  Printer,
  Mail,
  Phone,
  Check,
  MapPin,
} from "lucide-react";
import { PortableText } from "@portabletext/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { extractCoordsFromGoogleMapsUrl, getCoordsBySearch } from "@/lib/geocoding";
import { useCurrency } from "@/context/CurrencyContext";
import PropertyGallery from "@/components/PropertyGallery";
import MortgageCalculator from "@/components/MortgageCalculator";
import CurrencyBadge from "@/components/CurrencyBadge";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#1E0D02] animate-pulse flex items-center justify-center text-gray-300 uppercase tracking-widest text-[10px]">LOADING MAP...</div>
});

interface PropertyDetailClientProps {
  property: any;
}

export default function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const { formatPrice: globalFormatPrice } = useCurrency();
  const agencyEmail = property.siteSettings?.contact?.email || "info@pavani.re";
  const contactPhone = property.siteSettings?.contact?.phone || "+254 700 000000";

  // Inquiry form state
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", phone: "", message: "", type: "General Inquiry" });
  const [inquirySent, setInquirySent] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");

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

  const coords = useMemo(() => {
    let extracted = property.googleMapsUrl ? extractCoordsFromGoogleMapsUrl(property.googleMapsUrl) : null;
    if (!extracted) extracted = getCoordsBySearch(property.title, property.district?.name, property.county);
    return extracted;
  }, [property.googleMapsUrl, property.district, property.county]);

  const priceAmount = typeof property.price === 'object' ? property.price?.amount : property.price;
  const priceCurrency = typeof property.price === 'object' ? property.price?.currency : "USD";

  const mapProperties = useMemo(() => {
    if (!coords) return [];
    return [{
      _id: property._id,
      title: property.title,
      price: globalFormatPrice(priceAmount, priceCurrency),
      coords,
      imageUrl: property.imageUrl,
      district: property.district?.name
    }];
  }, [property, coords, globalFormatPrice, priceAmount, priceCurrency]);

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => setInquirySent(false), 5000);
  };

  return (
    <main className="min-h-screen bg-[#0D0501] text-[#EDE0C8] font-sans">
      <Navbar settings={property.siteSettings} />

      {showToast && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[3000] bg-[#0D0501] text-white px-8 py-4 text-[10px] font-bold tracking-[0.3em] uppercase">
          {showToast}
        </div>
      )}

      <div className="print:hidden">
        {/* Breadcrumbs */}
        <div className="pt-[5.5rem] pb-3 px-6 lg:px-12 bg-[#180900] flex flex-wrap items-center justify-center gap-3 text-[8px] lg:text-[9px] font-bold tracking-[0.4em] text-[#EDE0C8]/40 uppercase border-b border-[#C9A96E]/10">
          <Link href="/properties" className="hover:text-[#EDE0C8] transition-colors">ALL PROPERTIES</Link>
          <span>/</span>
          <Link href={`/properties?search=${property.district?.name}`} className="hover:text-[#EDE0C8] transition-colors">
            {property.district?.name}
          </Link>
          <span>/</span>
          <span className="text-[#EDE0C8]">{property.title}</span>
        </div>

        {/* Gallery */}
        <div className="pt-2">
          <PropertyGallery media={mediaItems} title={property.title} />
        </div>

        {/* Property Header */}
        <motion.section
          className="py-12 lg:py-20 px-6 text-center max-w-4xl mx-auto border-b border-[#C9A96E]/10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="space-y-3 mb-8">
            <p className="text-[9px] font-bold tracking-[0.5em] text-[#C9A96E] uppercase">
              {property.propertyType?.[0] || "EXCLUSIVE LISTING"}
            </p>
            <h1 className="text-3xl lg:text-5xl font-serif tracking-tight text-[#EDE0C8] uppercase leading-tight">{property.title}</h1>
            <p className="text-[10px] tracking-[0.4em] text-[#EDE0C8]/40 uppercase font-bold flex items-center justify-center gap-2">
              <MapPin size={10} className="text-[#C9A96E]" />
              {property.buildingName && `${property.buildingName}, `}{property.district?.name}, {property.county}
            </p>
          </div>

          <div className="h-px w-8 bg-[#C9A96E] mx-auto mb-8" />

          <div className="mb-10">
            <p className="text-[9px] font-bold tracking-[0.5em] text-[#EDE0C8]/40 uppercase mb-3">OFFERED AT</p>
            {priceAmount ? (
              <CurrencyBadge
                amount={priceAmount}
                baseCurrency={priceCurrency}
                className="text-4xl lg:text-6xl font-serif text-[#EDE0C8] tracking-tighter justify-center"
              />
            ) : (
              <p className="text-4xl lg:text-5xl font-serif text-[#EDE0C8]">Price on Request</p>
            )}
          </div>

          <div className="flex flex-wrap justify-center items-center gap-10 lg:gap-20">
            {[
              { label: "BEDROOMS", value: property.details?.split("|")[0]?.trim() || "—" },
              { label: "BATHROOMS", value: property.details?.split("|")[1]?.trim() || "—" },
              { label: "APPROX. SIZE", value: property.size || "On Request" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <p className="text-xl lg:text-2xl font-serif text-[#EDE0C8]">{stat.value}</p>
                <p className="text-[8px] font-bold tracking-[0.4em] text-[#EDE0C8]/40 uppercase">{stat.label}</p>
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
                <div className="h-px w-10 bg-[#C9A96E]" />
                <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#C9A96E]">The Property</h2>
              </div>
              <p className="text-xl lg:text-2xl font-light font-serif italic text-gray-600 leading-relaxed">
                {property.shortDescription || "A residence of unparalleled distinction and architectural purity."}
              </p>
              <div className="prose prose-lg max-w-none text-[#EDE0C8]/50 font-light leading-relaxed">
                {property.longDescription ? <PortableText value={property.longDescription} /> : (
                  <p>Detailed architectural specifications and floor plans are available upon request. Contact our advisors for a private presentation.</p>
                )}
              </div>
            </div>

            {/* Property Features */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px w-10 bg-[#C9A96E]" />
                  <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#C9A96E]">Features & Amenities</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 py-3 border-b border-[#C9A96E]/8">
                      <div className="w-1 h-1 bg-[#C9A96E] shrink-0" />
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#EDE0C8]/50">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compliance Documents */}
            {property.verificationDocuments?.length > 0 && (
              <div className="bg-[#1E0D02] p-8 lg:p-12 space-y-8 border border-[#C9A96E]/10">
                <div>
                  <h3 className="text-xl font-serif uppercase tracking-tight mb-1">Compliance & Verification</h3>
                  <p className="text-[10px] font-bold tracking-widest text-[#EDE0C8]/40 uppercase">Verified Asset Dossier</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-200 border border-[#C9A96E]/15">
                  {property.verificationDocuments.map((doc: any, i: number) => (
                    <div key={i} className="bg-[#180900] p-6 flex items-center justify-between group hover:bg-[#1E0D02] transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <FileText className="text-[#C9A96E]" size={20} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">{doc.originalFilename}</span>
                      </div>
                      <Download size={16} className="text-gray-300 group-hover:text-[#EDE0C8] transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {coords && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px w-10 bg-[#C9A96E]" />
                  <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#C9A96E]">Location</h2>
                </div>
                <div className="h-[400px] border border-[#C9A96E]/10">
                  <PropertyMap properties={mapProperties} activePropertyId={property._id} center={[coords.lat, coords.lng]} zoom={15} />
                </div>
              </div>
            )}

            {/* Inquiry Form */}
            <div className="border border-[#C9A96E]/15 p-8 lg:p-12 space-y-8">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-px w-10 bg-[#C9A96E]" />
                  <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#C9A96E]">Make an Inquiry</h2>
                </div>
                <p className="text-sm text-[#EDE0C8]/50 font-light leading-relaxed">
                  Connect with our advisors for a private showing or detailed analysis.
                </p>
              </div>

              {inquirySent ? (
                <div className="flex flex-col items-center py-12 gap-4">
                  <div className="w-12 h-12 bg-[#C9A96E] flex items-center justify-center">
                    <Check size={20} className="text-white" />
                  </div>
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase">Inquiry Received</p>
                  <p className="text-sm text-[#EDE0C8]/40 text-center">Our team will be in touch within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleInquiry} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#EDE0C8]/40">Full Name</label>
                      <input
                        type="text"
                        required
                        value={inquiryForm.name}
                        onChange={e => setInquiryForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full border border-[#C9A96E]/15 bg-[#1E0D02] text-[#EDE0C8] placeholder:text-[#EDE0C8]/25 px-4 py-3 text-[11px] tracking-wide focus:outline-none focus:border-[#C9A96E] transition-colors bg-[#180900]"
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#EDE0C8]/40">Email Address</label>
                      <input
                        type="email"
                        required
                        value={inquiryForm.email}
                        onChange={e => setInquiryForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full border border-[#C9A96E]/15 bg-[#1E0D02] text-[#EDE0C8] placeholder:text-[#EDE0C8]/25 px-4 py-3 text-[11px] tracking-wide focus:outline-none focus:border-[#C9A96E] transition-colors bg-[#180900]"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#EDE0C8]/40">Phone Number</label>
                    <input
                      type="tel"
                      value={inquiryForm.phone}
                      onChange={e => setInquiryForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full border border-[#C9A96E]/15 bg-[#1E0D02] text-[#EDE0C8] placeholder:text-[#EDE0C8]/25 px-4 py-3 text-[11px] tracking-wide focus:outline-none focus:border-[#C9A96E] transition-colors bg-[#180900]"
                      placeholder="+254 700 000 000"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#EDE0C8]/40">Inquiry Type</label>
                    <div className="flex flex-wrap gap-2">
                      {["General Inquiry", "Schedule Viewing", "Make Offer", "Investment Analysis"].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setInquiryForm(f => ({ ...f, type }))}
                          className={cn(
                            "px-4 py-2 text-[9px] font-bold tracking-widest uppercase border transition-all",
                            inquiryForm.type === type
                              ? "bg-[#0D0501] text-white border-[#0A0A0F]"
                              : "border-[#C9A96E]/15 text-[#EDE0C8]/40 hover:border-gray-400"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#EDE0C8]/40">Message</label>
                    <textarea
                      rows={4}
                      value={inquiryForm.message}
                      onChange={e => setInquiryForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full border border-[#C9A96E]/15 bg-[#1E0D02] text-[#EDE0C8] placeholder:text-[#EDE0C8]/25 px-4 py-3 text-[11px] tracking-wide focus:outline-none focus:border-[#C9A96E] transition-colors bg-[#180900] resize-none"
                      placeholder={`I'm interested in ${property.title}...`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full h-14 bg-[#0D0501] text-white text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-[#C9A96E] transition-all duration-300"
                  >
                    SEND INQUIRY
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit space-y-6">
            {/* Consultation Card */}
            <div className="border border-[#C9A96E]/15 p-8 space-y-8">
              <div>
                <p className="text-[10px] font-bold tracking-[0.5em] text-[#EDE0C8]/40 uppercase mb-2">Private Consultation</p>
                <p className="text-sm text-[#EDE0C8]/50 font-light leading-relaxed">
                  Our advisors provide discreet, expert guidance for discerning buyers.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={`mailto:${agencyEmail}?subject=Inquiry: ${property.title}`}
                  className="flex items-center gap-3 w-full h-12 bg-[#C9A96E] text-white text-[10px] font-bold tracking-[0.3em] uppercase px-5 hover:bg-[#b8935a] transition-all"
                >
                  <Mail size={14} /> EMAIL AN ADVISOR
                </a>
                <a
                  href={`tel:${contactPhone}`}
                  className="flex items-center gap-3 w-full h-12 border border-[#0A0A0F] text-[#EDE0C8] text-[10px] font-bold tracking-[0.3em] uppercase px-5 hover:bg-[#0D0501] hover:text-white transition-all"
                >
                  <Phone size={14} /> {contactPhone}
                </a>
              </div>

              <div className="pt-6 border-t border-[#C9A96E]/10 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#0D0501] text-[#C9A96E] flex items-center justify-center font-serif text-lg">P</div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase">Pavani Realty</p>
                  <p className="text-[8px] text-[#EDE0C8]/40 tracking-[0.2em] uppercase font-bold">Exclusive Listing Agent</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-center gap-10 text-[#EDE0C8]/40 border border-[#C9A96E]/10 py-5">
              <button onClick={handleShare} className="flex flex-col items-center gap-2 hover:text-[#EDE0C8] transition-colors">
                <Share2 size={18} /><span className="text-[8px] font-bold uppercase tracking-widest">Share</span>
              </button>
              <button onClick={() => window.print()} className="flex flex-col items-center gap-2 hover:text-[#EDE0C8] transition-colors">
                <Printer size={18} /><span className="text-[8px] font-bold uppercase tracking-widest">Print</span>
              </button>
              <button onClick={toggleLike} className={cn("flex flex-col items-center gap-2 transition-colors", isLiked ? "text-[#C9A96E]" : "hover:text-[#EDE0C8]")}>
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} /><span className="text-[8px] font-bold uppercase tracking-widest">{isLiked ? "Saved" : "Save"}</span>
              </button>
            </div>

            {/* Mortgage Calculator */}
            <MortgageCalculator propertyPrice={priceAmount ? Number(priceAmount) : undefined} />
          </div>
        </section>

        {/* Similar Listings */}
        {property.similarProperties?.length > 0 && (
          <section className="py-24 bg-[#180900] px-6 lg:px-16 border-t border-[#C9A96E]/10">
            <div className="text-center space-y-3 mb-16">
              <p className="text-[9px] font-bold tracking-[0.5em] text-[#C9A96E] uppercase">Curated Portfolio</p>
              <h2 className="text-2xl lg:text-4xl font-serif uppercase tracking-tight">Similar Properties</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1700px] mx-auto">
              {property.similarProperties.map((p: any) => (
                <Link key={p._id} href={`/properties/${p.slug}`} className="group bg-[#180900] border border-[#C9A96E]/10 block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={p.imageUrl} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute top-0 left-0 bg-[#0D0501] text-white px-3 py-1.5 text-[8px] font-bold tracking-widest uppercase">EXCLUSIVE</div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-xl font-serif text-[#EDE0C8] mb-1">
                        {globalFormatPrice(typeof p.price === 'object' ? p.price.amount : p.price, typeof p.price === 'object' ? p.price.currency : "USD")}
                      </p>
                      <h3 className="text-[10px] font-bold tracking-widest text-[#EDE0C8]/40 uppercase line-clamp-1">{p.title}</h3>
                    </div>
                    <div className="pt-4 border-t border-[#C9A96E]/8 flex items-center justify-between text-[9px] font-bold tracking-widest text-[#EDE0C8]/40 uppercase">
                      <span>{p.details?.split("|")[0]?.trim() || "—"}</span>
                      <span>{p.details?.split("|")[1]?.trim() || "—"}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer settings={property.siteSettings} />

      <style jsx global>{`
        * { border-radius: 0 !important; }
        .prose p { margin-bottom: 1.5em; }
      `}</style>
    </main>
  );
}
