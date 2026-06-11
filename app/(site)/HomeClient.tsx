"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion, useReducedMotion } from "framer-motion";
import { useCurrency } from "@/context/CurrencyContext";
import Navbar from "@/components/Navbar";

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

export default function HomeClient({ data, settings }: HomeClientProps) {
  const { formatPrice, currency } = useCurrency();
  const [email, setEmail] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const siteName = settings?.general?.siteName || "PAVANI";
  const agencyEmail = settings?.contact?.email || "pavanirealtyco@gmail.com";
  const agencyPhone = settings?.contact?.phone || "+254 729 377 495";
  const agencyAddress = settings?.contact?.address || "Kofisi, Westlands, Nairobi, Kenya";
  const socials = settings?.socials;

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
    <main className="min-h-screen bg-[#0D0501] text-[#E8DCBF]">
      <Navbar settings={settings} />

      {/* ── HERO ── */}
      <section className="relative min-h-[100dvh] w-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={vHero} type="video/mp4" />
        </video>
        {/* Layered scrims: bottom-up gradient + overall tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0501] via-[#0D0501]/40 to-[#0D0501]/15" />
        <div className="absolute inset-0 bg-[#0D0501]/18" />

        {/* Hero text — bottom left, CSS @starting-style stagger + blur bridge */}
        <div className="absolute bottom-0 left-0 right-0 px-8 lg:px-16 pb-28 lg:pb-32 z-20 max-w-4xl">
          <h1 className="text-5xl lg:text-[5.5rem] xl:text-[6rem] leading-[0.92] tracking-tight mb-8">
            <span className="hero-line hero-line-1 block font-serif font-light text-[#E8DCBF]">Nairobi's</span>
            <span className="hero-line hero-line-2 block font-serif italic text-[#C6A75E] pb-1">Finest</span>
            <span className="hero-line hero-line-3 block font-serif font-light text-[#E8DCBF]">Addresses</span>
          </h1>
          <div className="hero-line hero-sub w-12 h-px bg-[#C6A75E]/60 mb-6 gold-line-animate" />
          <p className="hero-line hero-sub text-[0.9375rem] font-light text-[#E8DCBF]/78 max-w-md leading-[1.75] tracking-wide mb-10">
            Exceptional apartments and villas across Kenya's most prestigious neighbourhoods.
          </p>
          <div className="hero-line hero-cta flex items-center gap-4">
            <Link
              href="/properties"
              className="btn-crimson inline-flex items-center gap-3 px-8 py-4 text-[10px] font-bold tracking-[0.4em] uppercase"
            >
              BROWSE PROPERTIES
            </Link>
            <Link
              href="/contact"
              className="cta-link inline-flex items-center gap-3 border border-[#E8DCBF]/40 px-8 py-4 text-[10px] font-bold tracking-[0.4em] uppercase text-[#E8DCBF]/88 hover:border-[#C6A75E] hover:text-[#C6A75E] transition-all duration-300"
            >
              CONTACT US
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <ChevronDown size={18} className="text-[#E8DCBF]/40 animate-bounce" />
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
            <h2 className="text-4xl lg:text-6xl font-serif font-light text-[#E8DCBF] leading-tight">
              Exceptional<br />
              <em className="italic text-[#C6A75E]">Residences</em>
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
                        <p className="text-[8px] font-bold tracking-[0.5em] uppercase text-[#C6A75E]">{district}</p>
                      )}
                      <h3 className="text-xl lg:text-2xl font-serif font-light text-[#E8DCBF] group-hover:text-[#C6A75E] transition-colors duration-300">
                        {p.title}
                      </h3>
                      {amt && (
                        <p className="text-base font-serif text-[#E8DCBF]/80">
                          {formatPrice(amt, cur)}
                        </p>
                      )}
                      {p.details && (
                        <p className="text-[9px] tracking-widest text-[#E8DCBF]/50 font-medium">{p.details}</p>
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
              className="cta-link inline-flex items-center gap-3 border border-[#C6A75E]/40 px-10 py-4 text-[10px] font-bold tracking-[0.4em] uppercase text-[#C6A75E] hover:bg-[#C6A75E] hover:text-[#0D0501] transition-all duration-300"
            >
              VIEW ALL PROPERTIES <ArrowRight size={13} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT / STATEMENT ── */}
      <section className="py-20 lg:py-28 px-6 lg:px-16 bg-[#180900]">
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
              <h2 className="text-3xl lg:text-5xl font-serif font-light text-[#E8DCBF] leading-snug">
                Nairobi's Most{" "}
                <em className="italic text-[#C6A75E]">Trusted<br />Authority</em>
              </h2>
            </div>
            <div className="w-8 h-px bg-[#C6A75E]/50" />
            <p className="text-[0.9375rem] font-light text-[#E8DCBF]/78 leading-[1.78] max-w-lg">
              Since 2009, Pavani Realty Co has been the definitive name in luxury real estate across Nairobi's most prestigious addresses. We've built our reputation on a foundation of excellence, discretion, and unwavering commitment to our clients' success.
            </p>

            {/* Stats — spring animation for "alive" feeling */}
            <div className="grid grid-cols-3 gap-8 pt-4">
              {[
                { stat: "15+",  label: "Years of Experience" },
                { stat: "500+", label: "Successful Transactions" },
                { stat: "6",    label: "Prime Neighborhoods" },
              ].map(({ stat, label }, i) => (
                <motion.div
                  key={stat}
                  {...mp({
                    initial:    { opacity: 0, y: 16 },
                    whileInView:{ opacity: 1, y: 0 },
                    viewport:   { once: true, amount: 0.4 },
                    transition: { type: "spring" as const, duration: 0.6, bounce: 0.25, delay: 0.15 + i * 0.09 },
                  })}
                >
                  <p className="text-3xl lg:text-4xl font-serif font-light text-[#C6A75E]">{stat}</p>
                  <p className="text-[8px] font-bold tracking-[0.3em] uppercase text-[#E8DCBF]/55 mt-1.5">{label}</p>
                </motion.div>
              ))}
            </div>

            <Link href="/about" className="cta-link inline-flex items-center gap-3 text-[9px] font-bold tracking-[0.35em] uppercase text-[#C6A75E] border-b border-[#C6A75E]/35 pb-1 hover:border-[#C6A75E] transition-all">
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

      {/* ── NEIGHBORHOODS ── */}
      <section className="py-24 lg:py-32 px-6 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-5"
            {...mp(fadeUpNoBlur(0))}
          >
            <div>
              <p className="eyebrow mb-4">Discover</p>
              <h2 className="text-3xl lg:text-5xl font-serif font-light text-[#E8DCBF]">Prime Neighborhoods</h2>
            </div>
            <Link href="/neighborhoods" className="cta-link flex items-center gap-2 text-[9px] font-bold tracking-[0.3em] uppercase text-[#E8DCBF]/58 hover:text-[#C6A75E] transition-colors">
              ALL NEIGHBORHOODS <ArrowRight size={12} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { name: "Westlands", count: "24 Listings", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" },
              { name: "Muthaiga",  count: "12 Listings", img: "https://images.unsplash.com/photo-1600607687940-c52af096999c?auto=format&fit=crop&w=800&q=80" },
              { name: "Karen",     count: "18 Listings", img: "https://images.unsplash.com/photo-1600607687644-c7f34b5063c7?auto=format&fit=crop&w=800&q=80" },
              { name: "Kilimani",  count: "31 Listings", img: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80" },
            ].map(({ name, count, img }, i) => (
              <motion.div key={name} {...mp(fadeUpNoBlur(i * 0.08))}>
                <Link href="/neighborhoods" className="group relative h-52 lg:h-80 overflow-hidden block">
                  <Image
                    src={img}
                    alt={name}
                    fill
                    sizes="25vw"
                    className="object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0501]/85 via-[#0D0501]/20 to-transparent" />
                  <div className="absolute bottom-5 left-5">
                    <p className="font-serif text-[1.1rem] text-[#E8DCBF] group-hover:text-[#C6A75E] transition-colors duration-300">
                      {name}
                    </p>
                    <p className="text-[8px] font-bold tracking-[0.35em] uppercase text-[#E8DCBF]/55 mt-0.5">{count}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 lg:py-32 px-6 lg:px-16 bg-[#180900]">
        <div className="max-w-[1400px] mx-auto">
          <motion.div className="mb-14" {...mp(fadeUpNoBlur(0))}>
            <p className="eyebrow mb-4">Testimonials</p>
            <h2 className="text-4xl lg:text-6xl font-serif font-light text-[#E8DCBF]">
              What Our{" "}
              <em className="italic text-[#C6A75E]">Clients Say</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ stars, quote, name, role }, i) => (
              <motion.div
                key={name}
                {...mp(fadeUp(i * 0.1))}
                className="bg-[#1E0D02] border border-[#C6A75E]/12 p-8 lg:p-10 space-y-6"
              >
                <div className="flex gap-1">
                  {Array.from({ length: stars }).map((_, j) => (
                    <span key={j} className="text-[#C6A75E] text-base">★</span>
                  ))}
                </div>
                <p className="text-[0.9rem] font-light text-[#E8DCBF]/80 leading-[1.8] italic font-serif">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="pt-4 border-t border-[#C6A75E]/10">
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#E8DCBF]/88">{name}</p>
                  <p className="text-[9px] tracking-widest text-[#E8DCBF]/50 font-medium mt-1">{role}</p>
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
        <div className="absolute inset-0 bg-[#0D0501]/70" />
        <motion.div
          className="relative z-10 text-center px-6 max-w-3xl mx-auto space-y-8"
          {...mp({
            initial:    { opacity: 0, y: 28, scale: 0.97, filter: "blur(6px)" },
            whileInView:{ opacity: 1, y: 0,  scale: 1,    filter: "blur(0px)" },
            viewport:   { once: true, amount: 0.4 },
            transition: { duration: 0.95, ease },
          })}
        >
          <div className="w-px h-14 bg-[#C6A75E]/30 mx-auto" />
          <h2 className="text-5xl lg:text-7xl font-serif font-light text-[#E8DCBF] leading-tight">
            Ready to Begin Your{" "}
            <em className="italic text-[#C6A75E]">Journey?</em>
          </h2>
          <div className="w-8 h-px bg-[#C6A75E]/50 mx-auto" />
          <p className="text-[0.9375rem] font-light text-[#E8DCBF]/72 leading-relaxed max-w-md mx-auto">
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
      <footer className="bg-[#0D0501] border-t border-[#C6A75E]/10 pt-20 pb-10 px-6 lg:px-16 print:hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16 mb-16 pb-16 border-b border-[#C6A75E]/10">
            {/* Brand */}
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C6A75E] flex items-center justify-center">
                  <span className="font-serif text-[#0D0501] text-xl font-semibold">P</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-[0.35em] uppercase text-[#E8DCBF]">{siteName}</p>
                  <p className="text-[8px] tracking-[0.3em] uppercase text-[#C6A75E]/60">REALTY CO</p>
                </div>
              </Link>
              <div className="flex gap-5">
                {socials?.instagram && <Link href={socials.instagram} target="_blank" className="text-[#E8DCBF]/40 hover:text-[#C6A75E] transition-colors"><FaInstagram size={16} /></Link>}
                {socials?.linkedin  && <Link href={socials.linkedin}  target="_blank" className="text-[#E8DCBF]/40 hover:text-[#C6A75E] transition-colors"><FaLinkedinIn size={16} /></Link>}
                {socials?.facebook  && <Link href={socials.facebook}  target="_blank" className="text-[#E8DCBF]/40 hover:text-[#C6A75E] transition-colors"><FaFacebookF size={16} /></Link>}
                {socials?.twitter   && <Link href={socials.twitter}   target="_blank" className="text-[#E8DCBF]/40 hover:text-[#C6A75E] transition-colors"><FaXTwitter size={16} /></Link>}
                {!socials && <>
                  <span className="text-[#E8DCBF]/25"><FaInstagram size={16} /></span>
                  <span className="text-[#E8DCBF]/25"><FaLinkedinIn size={16} /></span>
                  <span className="text-[#E8DCBF]/25"><FaFacebookF size={16} /></span>
                </>}
              </div>
            </div>

            {/* Get in Touch */}
            <div className="space-y-5">
              <h4 className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#C6A75E]/80">Get in Touch</h4>
              <div className="space-y-3 text-[0.875rem] font-light text-[#E8DCBF]/65">
                <p>{agencyAddress}</p>
                <p>{agencyPhone}</p>
                <p>{agencyEmail}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-5">
              <h4 className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#C6A75E]/80">Navigation</h4>
              <ul className="space-y-3 text-[0.6875rem] font-medium tracking-widest text-[#E8DCBF]/60">
                {[
                  { label: "Home",       href: "/" },
                  { label: "Properties", href: "/properties" },
                  { label: "Gallery",    href: "/gallery" },
                  { label: "About Us",   href: "/about" },
                  { label: "Contact",    href: "/contact" },
                ].map(item => (
                  <li key={item.label}>
                    <Link href={item.href} className="hover:text-[#C6A75E] transition-colors duration-200">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Most Viewed */}
            <div className="space-y-5">
              <h4 className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#C6A75E]/80">Most Viewed</h4>
              <ul className="space-y-3 text-[0.6875rem] font-medium tracking-widest text-[#E8DCBF]/60">
                {["Villa Serene, Runda", "Karen Estate Villa", "Muthaiga Modern Apartment"].map(item => (
                  <li key={item}>
                    <Link href="/properties" className="hover:text-[#C6A75E] transition-colors duration-200">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[8px] tracking-[0.3em] uppercase text-[#E8DCBF]/38">
            <p>© {new Date().getFullYear()} {siteName} Realty Co. All rights reserved.</p>
            <Link href="#" className="hover:text-[#C6A75E] transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
