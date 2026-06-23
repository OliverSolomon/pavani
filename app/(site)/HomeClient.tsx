"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useCurrency } from "@/context/CurrencyContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface VideoSource {
  title?: string;
  subtitle?: string;
  type?: "file" | "url";
  videoUrl?: string;
  fileUrl?: string;
}

interface HomeClientProps {
  data: {
    heroVideo?: VideoSource;
    secondaryVideo?: VideoSource;
    propertiesSection?: { title?: string; subtitle?: string; featuredProperties?: any[] };
    experienceVideo?: VideoSource;
    spotlightSection?: any;
    closingVideo?: VideoSource;
  };
  settings?: { general?: any; brand?: any; contact?: any; socials?: any };
  testimonials?: any[];
}

const TESTIMONIALS = [
  { stars: 5, quote: "Exceptional service and attention to detail. Pavani found us the perfect home in Karen.", name: "Sarah Kipchoge", role: "Property Buyer" },
  { stars: 5, quote: "Professional, knowledgeable, and trustworthy. Highly recommend for luxury real estate in Nairobi.", name: "James Mwangi", role: "Investor" },
  { stars: 5, quote: "They marketed our villa beautifully and secured an excellent price. Outstanding experience.", name: "Amara Okonkwo", role: "Seller" },
];

const ease = [0.23, 1, 0.32, 1] as const;

/* Emil technique: blur-bridge makes transitions feel more organic */
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 20, filter: "blur(4px)" },
  whileInView:{ opacity: 1, y: 0,  filter: "blur(0px)" },
  viewport:   { once: true, amount: 0.15 },
  transition: { duration: 0.72, ease, delay },
});

const fadeUpNoBlur = (delay = 0) => ({
  initial:    { opacity: 0, y: 18 },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true, amount: 0.15 },
  transition: { duration: 0.68, ease, delay },
});

export default function HomeClient({ data, settings, testimonials }: HomeClientProps) {
  const { formatPrice } = useCurrency();
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  const reviews = testimonials && testimonials.length
    ? testimonials.map((t: any) => ({ stars: t.rating || 5, quote: t.quote, name: t.authorName, role: t.authorRole }))
    : TESTIMONIALS;

  const getVideoSrc = (s?: VideoSource, fallback?: string) => {
    if (!s) return fallback;
    return s.type === "url" ? s.videoUrl || fallback : s.fileUrl || fallback;
  };
  const vHero = getVideoSrc(data?.heroVideo, "/videos/amethyst.mp4");

  const properties = data?.propertiesSection?.featuredProperties?.length
    ? data.propertiesSection.featuredProperties
    : [
        { _id: "1", title: "Amethyst Residences", district: "Kilimani",  price: { amount: "7000000",  currency: "KSH" }, imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", details: "2b · 2ba · 88m²",  slug: { current: "#" } },
        { _id: "2", title: "Muthaiga Sky Penthouse", district: "Muthaiga", price: { amount: "1450000", currency: "USD" }, imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", details: "4b · 5ba · 539m²", slug: { current: "#" } },
        { _id: "3", title: "Villa Serene, Runda", district: "Runda",     price: { amount: "1950000",  currency: "USD" }, imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80", details: "5b · 6ba · 688m²", slug: { current: "#" } },
      ];

  const mp = <T extends object>(props: T) => (reduce ? {} : props);

  return (
    <main className="min-h-screen bg-[#FAF8F4] text-[#1C1714]">
      <Navbar settings={settings} />

      {/* ── HERO ── */}
      <section className="relative min-h-[100dvh] w-full overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={vHero} type="video/mp4" />
        </video>
        {/* Soft scrim for legibility of the centred glass panel */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#210A0B]/35 via-[#210A0B]/15 to-[#210A0B]/45" />

        {/* Hero text — centred glass panel, two-line headline (enlarged ~35%) */}
        <div className="relative z-20 w-full max-w-4xl mx-auto px-6 text-center">
          <div className="glass-dark px-10 py-16 lg:px-[4.75rem] lg:py-[5.5rem]">
            <p className="hero-line hero-line-1 text-[11px] font-bold tracking-[0.5em] uppercase text-[#E8DCBF] mb-8">
              Pavani Realty Co
            </p>
            <h1 className="text-5xl sm:text-[4rem] lg:text-[6rem] leading-[1.02] tracking-tight mb-9">
              <span className="hero-line hero-line-2 block font-serif font-normal text-[#FBF5F2]">
                Nairobi's <em className="italic text-[#E8DCBF]">Finest</em>
              </span>
              <span className="hero-line hero-line-3 block font-serif italic font-normal text-[#FBF5F2]">
                Addresses
              </span>
            </h1>
            <div className="hero-line hero-sub w-16 h-px bg-[#E8DCBF]/70 mb-9 mx-auto gold-line-animate" />
            <p className="hero-line hero-sub text-[1.0625rem] font-normal text-[#FBF5F2]/85 max-w-lg mx-auto leading-[1.75] tracking-wide mb-12">
              Exceptional apartments and villas across Kenya's most prestigious neighbourhoods.
            </p>
            <div className="hero-line hero-cta flex flex-wrap items-center justify-center gap-5">
              <Link
                href="/properties"
                className="btn-crimson inline-flex items-center gap-3 px-10 py-5 text-[10px] font-bold tracking-[0.4em] uppercase"
              >
                BROWSE PROPERTIES
              </Link>
              <Link
                href="/contact"
                className="cta-link inline-flex items-center gap-3 border border-[#FBF5F2]/45 px-10 py-5 text-[10px] font-bold tracking-[0.4em] uppercase text-[#FBF5F2]/90 hover:border-[#E8DCBF] hover:text-[#E8DCBF] transition-all duration-300"
              >
                CONTACT US
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <ChevronDown size={18} className="text-[#FBF5F2]/55 animate-bounce" />
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ── */}
      <section className="py-24 lg:py-32 px-6 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            className="mb-14"
            {...mp(fadeUp(0))}
          >
            <p className="eyebrow mb-4">Featured</p>
            <h2 className="text-4xl lg:text-6xl font-serif font-normal text-[#1C1714] leading-tight">
              Exceptional<br />
              <em className="italic text-[#82000D]">Residences</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {properties.slice(0, 3).map((p: any, i: number) => {
              const amt  = typeof p.price === "object" ? p.price.amount    : p.price;
              const cur  = typeof p.price === "object" ? p.price.currency  : "USD";
              const slug = p.slug?.current || p.slug || "#";
              const district = p.district?.name || p.district || "";
              return (
                <motion.div key={p._id} {...mp(fadeUp(i * 0.1))}>
                  <Link href={`/properties/${slug}`} className="group block">
                    {/* Image with card-border-reveal (Emil clip-path technique) */}
                    <div className="relative aspect-[4/3] overflow-hidden mb-5">
                      <Image
                        src={p.imageUrl}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-[2.2s] ease-out group-hover:scale-105"
                      />
                      <div className="card-border-reveal" />
                    </div>
                    <div className="space-y-2">
                      {district && (
                        <p className="text-[8px] font-bold tracking-[0.5em] uppercase text-[#82000D]">{district}</p>
                      )}
                      <h3 className="text-xl lg:text-2xl font-serif font-normal text-[#1C1714] group-hover:text-[#82000D] transition-colors duration-300">
                        {p.title}
                      </h3>
                      {amt && (
                        <p className="text-base font-serif text-[#1C1714]/90">
                          {formatPrice(amt, cur)}
                        </p>
                      )}
                      {p.details && (
                        <p className="text-[9px] tracking-widest text-[#1C1714]/70 font-medium">{p.details}</p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            className="mt-16 flex justify-center"
            {...mp(fadeUpNoBlur(0.3))}
          >
            <Link
              href="/properties"
              className="cta-link inline-flex items-center gap-3 border border-[#82000D]/40 px-10 py-4 text-[10px] font-bold tracking-[0.4em] uppercase text-[#82000D] hover:bg-[#82000D] hover:text-[#FAF8F4] transition-all duration-300"
            >
              VIEW ALL PROPERTIES <ArrowRight size={13} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT / STATEMENT ── */}
      <section className="py-20 lg:py-28 px-6 lg:px-16 bg-[#F3EFE9]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left text */}
          <motion.div
            className="space-y-8"
            {...mp({
              initial:    { opacity: 0, x: -24, filter: "blur(4px)" },
              whileInView:{ opacity: 1, x: 0,   filter: "blur(0px)" },
              viewport:   { once: true, amount: 0.25 },
              transition: { duration: 0.85, ease },
            })}
          >
            <div>
              <p className="eyebrow mb-5">Our Story</p>
              <h2 className="text-3xl lg:text-5xl font-serif font-normal text-[#1C1714] leading-snug">
                Nairobi's Most{" "}
                <em className="italic text-[#82000D]">Trusted<br />Authority</em>
              </h2>
            </div>
            <div className="w-8 h-px bg-[#82000D]/50" />
            <p className="text-[0.9375rem] font-normal text-[#1C1714]/90 leading-[1.78] max-w-lg">
              Since 2009, Pavani Realty Co has been the definitive name in luxury real estate across Nairobi's most prestigious addresses. We've built our reputation on a foundation of excellence, discretion, and unwavering commitment to our clients' success.
            </p>

            <Link href="/about" className="cta-link inline-flex items-center gap-3 text-[9px] font-bold tracking-[0.35em] uppercase text-[#82000D] border-b border-[#82000D]/35 pb-1 hover:border-[#82000D] transition-all">
              MEET OUR TEAM <ArrowRight size={12} />
            </Link>
          </motion.div>

          {/* Right images — staggered entry */}
          <motion.div
            className="grid grid-cols-2 gap-4 h-[480px] lg:h-[540px]"
            {...mp({
              initial:    { opacity: 0, x: 24 },
              whileInView:{ opacity: 1, x: 0 },
              viewport:   { once: true, amount: 0.2 },
              transition: { duration: 0.85, ease, delay: 0.15 },
            })}
          >
            <div className="relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                alt="Luxury residence"
                fill
                className="object-cover"
                sizes="25vw"
              />
            </div>
            <div className="relative overflow-hidden mt-12">
              <Image
                src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"
                alt="Luxury interior"
                fill
                className="object-cover"
                sizes="25vw"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 lg:py-32 px-6 lg:px-16 bg-[#F3EFE9]">
        <div className="max-w-[1400px] mx-auto">
          <motion.div className="mb-14" {...mp(fadeUpNoBlur(0))}>
            <p className="eyebrow mb-4">Testimonials</p>
            <h2 className="text-4xl lg:text-6xl font-serif font-normal text-[#1C1714]">
              What Our{" "}
              <em className="italic text-[#82000D]">Clients Say</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map(({ stars, quote, name, role }, i) => (
              <motion.div
                key={name}
                {...mp(fadeUp(i * 0.1))}
                className="glass-card p-8 lg:p-10 space-y-6"
              >
                <div className="flex gap-1">
                  {Array.from({ length: stars }).map((_, j) => (
                    <span key={j} className="text-[#82000D] text-base">★</span>
                  ))}
                </div>
                <p className="text-[0.9rem] font-normal text-[#1C1714]/90 leading-[1.8] italic font-serif">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="pt-4 border-t border-[#82000D]/10">
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#1C1714]/88">{name}</p>
                  <p className="text-[9px] tracking-widest text-[#1C1714]/70 font-medium mt-1">{role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative py-40 lg:py-52 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&w=1920&q=80"
          alt="Begin your journey"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#210A0B]/75 via-[#210A0B]/65 to-[#210A0B]/80" />
        <motion.div
          className="relative z-10 text-center px-6 max-w-3xl mx-auto space-y-8"
          {...mp({
            initial:    { opacity: 0, y: 28, scale: 0.97, filter: "blur(6px)" },
            whileInView:{ opacity: 1, y: 0,  scale: 1,    filter: "blur(0px)" },
            viewport:   { once: true, amount: 0.4 },
            transition: { duration: 0.95, ease },
          })}
        >
          <div className="w-px h-14 bg-[#E8DCBF]/40 mx-auto" />
          <h2 className="text-5xl lg:text-7xl font-serif font-normal text-[#FBF5F2] leading-tight">
            Ready to Begin Your{" "}
            <em className="italic text-[#E8DCBF]">Journey?</em>
          </h2>
          <div className="w-8 h-px bg-[#E8DCBF]/60 mx-auto" />
          <p className="text-[0.9375rem] font-normal text-[#FBF5F2]/80 leading-relaxed max-w-md mx-auto">
            Let our team guide you through every step of finding your perfect property in Nairobi's most prestigious neighbourhoods.
          </p>
          <Link
            href="/contact"
            className="btn-crimson inline-flex items-center gap-3 px-10 py-4 text-[10px] font-bold tracking-[0.4em] uppercase"
          >
            GET IN TOUCH
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <Footer settings={settings} />
    </main>
  );
}
