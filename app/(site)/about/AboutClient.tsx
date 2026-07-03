"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface AboutClientProps {
  settings?: any;
  testimonials?: any[];
}

const ease = [0.23, 1, 0.32, 1] as const;

const CORE_VALUES = [
  {
    title: "Excellence",
    body: "We maintain the highest standards in every aspect of our business, from property selection to client service. Excellence is not a destination - it is our commitment to continuous improvement.",
  },
  {
    title: "Integrity",
    body: "Transparency and honesty form the foundation of our relationships. We believe in full disclosure, fair dealing, and putting our clients' interests first in every transaction.",
  },
  {
    title: "Expertise",
    body: "Our team brings decades of combined experience in luxury real estate. We leverage market insights, industry connections, and specialised knowledge to deliver exceptional results.",
  },
];

const WHY_US = [
  {
    title: "Market Expertise",
    body: "Deep knowledge of Nairobi's luxury real estate market, including pricing trends, neighbourhood dynamics, and investment opportunities.",
  },
  {
    title: "Exclusive Network",
    body: "Access to off-market properties and a network of high-net-worth individuals, investors, and international clients.",
  },
  {
    title: "White-Glove Service",
    body: "Personalised attention and discretion for every client. We handle all details so you can focus on finding your perfect property.",
  },
  {
    title: "Proven Track Record",
    body: "A long history of successful transactions and a portfolio of satisfied clients from around the world.",
  },
  {
    title: "Comprehensive Solutions",
    body: "From property search and negotiation to legal documentation and post-purchase support, we manage the entire process.",
  },
  {
    title: "Local and Global Perspective",
    body: "We understand both the local Nairobi market and the needs of international clients seeking premium properties.",
  },
];

const TESTIMONIALS = [
  {
    stars: 5,
    quote: "Pavani Realty Co guided us through the acquisition of our Karen estate with unmatched professionalism. Their knowledge of Nairobi's luxury market is truly unrivalled.",
    name: "James Kariuki",
    role: "CEO, Tech Innovation Ltd",
  },
  {
    stars: 5,
    quote: "Outstanding service from start to finish. The team's knowledge of Nairobi's real estate market is exceptional.",
    name: "Amara Osei",
    role: "Investment Director, African Capital",
  },
  {
    stars: 5,
    quote: "I've worked with many firms across Africa. Pavani Realty Co stands out for professionalism and results.",
    name: "Sophie Laurent",
    role: "Founder, Luxury Lifestyle Magazine",
  },
  {
    stars: 5,
    quote: "Exceptional service and market expertise. Pavani Realty Co is the gold standard in luxury real estate.",
    name: "David Mwangi",
    role: "CEO, East Africa Ventures",
  },
];

export default function AboutClient({ settings, testimonials }: AboutClientProps) {
  const reduce = useReducedMotion();

  const reviews = testimonials && testimonials.length
    ? testimonials.map((t: any) => ({ stars: t.rating || 5, quote: t.quote, name: t.authorName, role: t.authorRole }))
    : TESTIMONIALS;

  const fadeUp = (delay = 0) =>
    reduce
      ? {}
      : {
          initial:    { opacity: 0, y: 22, filter: "blur(4px)" },
          whileInView:{ opacity: 1, y: 0,  filter: "blur(0px)" },
          viewport:   { once: true, amount: 0.18 },
          transition: { duration: 0.72, ease, delay },
        };

  const fadeLeft = (delay = 0) =>
    reduce
      ? {}
      : {
          initial:    { opacity: 0, x: -28, filter: "blur(3px)" },
          whileInView:{ opacity: 1, x: 0,   filter: "blur(0px)" },
          viewport:   { once: true, amount: 0.18 },
          transition: { duration: 0.82, ease, delay },
        };

  const fadeRight = (delay = 0) =>
    reduce
      ? {}
      : {
          initial:    { opacity: 0, x: 28 },
          whileInView:{ opacity: 1, x: 0 },
          viewport:   { once: true, amount: 0.18 },
          transition: { duration: 0.82, ease, delay },
        };

  return (
    <main className="min-h-screen bg-[#FAF8F4] text-[#1C1714]">
      <Navbar settings={settings} />

      {/* ── PAGE HERO ── */}
      <section className="relative pt-32 pb-16 px-6 lg:px-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.022] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#82000D,#82000D 1px,transparent 1px,transparent 72px),repeating-linear-gradient(90deg,#82000D,#82000D 1px,transparent 1px,transparent 72px)",
          }}
        />
        <div className="relative max-w-[1400px] mx-auto page-hero-enter">
          <p className="eyebrow mb-4">Our Story</p>
          <h1 className="text-4xl md:text-5xl lg:text-[3.75rem] font-serif font-normal text-[#1C1714] leading-tight mb-5">
            About{" "}
            <em className="italic text-[#82000D]">Pavani Realty Co</em>
          </h1>
          <div className="w-10 h-px bg-[#82000D]/60 mb-5" />
          <p className="text-[0.9375rem] text-[#1C1714]/88 font-normal leading-relaxed max-w-lg">
            Nairobi's trusted authority in luxury real estate since 2009.
          </p>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="py-16 lg:py-24 px-6 lg:px-16 border-t border-[#82000D]/10">
        <motion.div {...fadeUp(0)} className="max-w-3xl mx-auto space-y-7 text-center">
          <h2 className="text-3xl lg:text-4xl font-serif font-normal text-[#1C1714] leading-snug">
            Nairobi's Most{" "}
            <em className="italic text-[#82000D]">Trusted Authority</em>
          </h2>
          <div className="w-8 h-px bg-[#82000D]/50 mx-auto" />
          <p className="text-[0.9375rem] text-[#1C1714]/88 font-normal leading-[1.82]">
            Since 2009, Pavani Realty Co has been the definitive name in luxury real estate across Nairobi's most prestigious addresses. We've built our reputation on a foundation of excellence, discretion, and unwavering commitment to our clients' success.
          </p>
          <p className="text-[0.9375rem] text-[#1C1714]/88 font-normal leading-[1.82]">
            Our deep market knowledge, combined with a network of industry connections and a team of seasoned professionals, positions us uniquely to serve discerning buyers, sellers, and investors seeking the finest properties in Kenya's capital.
          </p>
        </motion.div>
      </section>

      {/* ── LEADERSHIP ── */}
      <section className="py-16 lg:py-24 px-6 lg:px-16 bg-[#F3EFE9]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <motion.div {...fadeLeft(0)} className="relative aspect-[3/4] max-h-[580px] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
              alt="Imani Karugu - Founder and CEO"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top"
            />
          </motion.div>

          <motion.div {...fadeRight(0.1)} className="space-y-7">
            <div>
              <p className="eyebrow mb-3">Leadership</p>
              <h2 className="text-3xl lg:text-4xl font-serif text-[#1C1714] leading-tight">
                Imani{" "}
                <em className="italic text-[#82000D]">Karugu</em>
              </h2>
              <p className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#1C1714]/74 mt-2">
                Founder &amp; CEO, Pavani Realty Co
              </p>
            </div>
            <div className="w-8 h-px bg-[#82000D]/40" />
            <blockquote className="font-serif italic text-[1rem] text-[#1C1714]/90 leading-[1.82]">
              "Luxury real estate is not just about properties - it's about crafting legacies and enabling dreams. At Pavani Realty Co, we believe every client deserves an experience that matches the calibre of their aspirations."
            </blockquote>
            <p className="text-[0.9375rem] text-[#1C1714]/86 font-normal leading-[1.82]">
              With many years of experience in Nairobi's luxury real estate market, Imani Karugu founded Pavani Realty Co to set a new standard for excellence, discretion, and client-centric service. Her deep understanding of the market, combined with an unwavering commitment to integrity, has established Pavani as the trusted choice for discerning buyers, sellers, and investors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="py-16 lg:py-24 px-6 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <motion.div {...fadeUp(0)} className="mb-14">
            <p className="eyebrow mb-4">Values</p>
            <h2 className="text-3xl lg:text-4xl font-serif font-normal text-[#1C1714]">
              Our{" "}
              <em className="italic text-[#82000D]">Core Values</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#82000D]/8">
            {CORE_VALUES.map(({ title, body }, i) => (
              <motion.div
                key={title}
                {...fadeUp(i * 0.1)}
                className="bg-[#FAF8F4] p-8 lg:p-10 space-y-4"
              >
                <h3 className="text-xl font-serif text-[#1C1714]">{title}</h3>
                <div className="w-6 h-px bg-[#82000D]/45" />
                <p className="text-[0.9rem] text-[#1C1714]/88 font-normal leading-[1.82]">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-16 lg:py-24 px-6 lg:px-16 bg-[#F3EFE9]">
        <div className="max-w-[1400px] mx-auto">
          <motion.div {...fadeUp(0)} className="mb-14">
            <p className="eyebrow mb-4">Why Us</p>
            <h2 className="text-3xl lg:text-4xl font-serif font-normal text-[#1C1714]">
              Why Choose{" "}
              <em className="italic text-[#82000D]">Pavani Realty Co</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {WHY_US.map(({ title, body }, i) => (
              <motion.div key={title} {...fadeUp(i * 0.07)} className="flex gap-4">
                <div className="mt-0.5 shrink-0">
                  <CheckCircle size={17} className="text-[#82000D]" strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-[0.875rem] font-bold tracking-wide text-[#1C1714]">{title}</h3>
                  <p className="text-[0.875rem] text-[#1C1714]/86 font-normal leading-[1.78]">{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 lg:py-24 px-6 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <motion.div {...fadeUp(0)} className="mb-14">
            <p className="eyebrow mb-4">Testimonials</p>
            <h2 className="text-3xl lg:text-4xl font-serif font-normal text-[#1C1714]">
              What Our{" "}
              <em className="italic text-[#82000D]">Clients Say</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {reviews.map(({ stars, quote, name, role }, i) => (
              <motion.div
                key={name}
                {...fadeUp(i * 0.08)}
                className="glass-card p-7 space-y-5"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: stars }).map((_, j) => (
                    <span key={j} className="text-[#82000D] text-sm">★</span>
                  ))}
                </div>
                <p className="text-[0.875rem] font-serif italic text-[#1C1714]/90 leading-[1.82]">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="pt-3 border-t border-[#82000D]/10 space-y-1">
                  <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#1C1714]/88">{name}</p>
                  <p className="text-[9px] tracking-widest text-[#1C1714]/72 uppercase font-medium">{role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative py-36 lg:py-48 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&w=1920&q=80"
          alt="Begin your journey with Pavani"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#210A0B]/75 via-[#210A0B]/65 to-[#210A0B]/80" />
        <motion.div
          className="relative z-10 text-center px-6 max-w-2xl mx-auto space-y-8"
          {...(reduce ? {} : {
            initial:    { opacity: 0, y: 28, filter: "blur(6px)" },
            whileInView:{ opacity: 1, y: 0,  filter: "blur(0px)" },
            viewport:   { once: true, amount: 0.4 },
            transition: { duration: 0.95, ease },
          })}
        >
          <div className="w-px h-12 bg-[#E8DCBF]/40 mx-auto" />
          <h2 className="text-4xl lg:text-5xl font-serif font-normal text-[#FBF5F2] leading-tight">
            Ready to Begin Your{" "}
            <em className="italic text-[#E8DCBF]">Journey?</em>
          </h2>
          <div className="w-8 h-px bg-[#E8DCBF]/60 mx-auto" />
          <p className="text-[0.9375rem] font-normal text-[#FBF5F2]/80 leading-relaxed max-w-md mx-auto">
            Let our advisors guide you through Nairobi's most prestigious addresses.
          </p>
          <Link
            href="/contact"
            className="btn-crimson inline-flex items-center gap-3 px-10 py-4 text-[10px] font-bold tracking-[0.45em] uppercase"
          >
            GET IN TOUCH <ArrowRight size={12} />
          </Link>
        </motion.div>
      </section>

      <Footer settings={settings} />
    </main>
  );
}
