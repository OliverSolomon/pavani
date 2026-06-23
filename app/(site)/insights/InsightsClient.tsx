"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface InsightsClientProps {
  settings?: any;
  posts?: any[];
}

const ease = [0.23, 1, 0.32, 1] as const;

const FEATURED = {
  category: "Market Outlook",
  date: "June 2026",
  title: "The 2026 Nairobi Luxury Market Outlook",
  excerpt:
    "Where capital is moving across the city's prime addresses — supply, pricing and the neighbourhoods quietly outperforming the rest.",
  img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
};

const ARTICLES = [
  {
    category: "Neighbourhoods",
    date: "May 2026",
    title: "Why Westlands Became Nairobi's New Business Address",
    excerpt: "The shift from suburban estates to vertical city living, and what it means for buyers.",
    img: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80",
  },
  {
    category: "Buyer's Guide",
    date: "May 2026",
    title: "A Quiet Word: Buying Off-Market Listings",
    excerpt: "How the city's most desirable homes change hands before they ever reach a portal.",
    img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
  },
  {
    category: "Design",
    date: "April 2026",
    title: "Designing for Resale: What Actually Adds Value",
    excerpt: "The finishes and floor-plans that hold their worth in Nairobi's luxury segment.",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    category: "Neighbourhoods",
    date: "April 2026",
    title: "The Diplomatic Belt: Living in Muthaiga & Gigiri",
    excerpt: "Privacy, provenance and green canopy — inside the city's most discreet addresses.",
    img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
  },
  {
    category: "Finance",
    date: "March 2026",
    title: "Financing a Luxury Purchase in Kenya",
    excerpt: "Mortgages, FX and structuring — a clear view of the routes available to buyers.",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  },
  {
    category: "Investment",
    date: "March 2026",
    title: "Runda & the Case for Gated Estate Living",
    excerpt: "Yield, security and lifestyle in Nairobi's established gated communities.",
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
  },
];

export default function InsightsClient({ settings, posts }: InsightsClientProps) {
  const reduce = useReducedMotion();
  const linkedin = settings?.socials?.linkedin || "https://www.linkedin.com/company/pavani-realty/";

  // Render from the CMS when articles exist; otherwise fall back to sample copy.
  const fmtDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";
  const normalize = (p: any) => ({
    id: p._id as string,
    category: p.category || "Insight",
    date: fmtDate(p.publishedAt),
    title: p.title as string,
    excerpt: p.excerpt || "",
    img: p.coverImage || FEATURED.img,
    href: p.externalUrl || linkedin,
  });
  const cms = posts && posts.length ? posts : null;
  const featuredSrc = cms ? cms.find((p: any) => p.featured) || cms[0] : null;
  const featured = featuredSrc ? normalize(featuredSrc) : { ...FEATURED, id: "fb", href: linkedin };
  const articles = cms
    ? cms.filter((p: any) => p._id !== featuredSrc._id).map(normalize)
    : ARTICLES.map((a, i) => ({ ...a, id: `fb-${i}`, href: linkedin }));

  const fadeUp = (delay = 0) =>
    reduce
      ? {}
      : {
          initial:    { opacity: 0, y: 22, filter: "blur(4px)" },
          whileInView:{ opacity: 1, y: 0,  filter: "blur(0px)" },
          viewport:   { once: true, amount: 0.18 },
          transition: { duration: 0.72, ease, delay },
        };

  return (
    <main className="min-h-screen bg-[#FAF8F4] text-[#1C1714]">
      <Navbar settings={settings} />

      {/* ── PAGE HERO ── */}
      <section className="relative pt-32 pb-14 px-6 lg:px-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#82000D,#82000D 1px,transparent 1px,transparent 72px),repeating-linear-gradient(90deg,#82000D,#82000D 1px,transparent 1px,transparent 72px)",
          }}
        />
        <div className="relative max-w-[1400px] mx-auto page-hero-enter">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="eyebrow mb-4">Insights</p>
              <h1 className="text-4xl md:text-5xl lg:text-[3.75rem] font-serif font-normal text-[#1C1714] leading-tight mb-5">
                Notes on <em className="italic text-[#82000D]">Nairobi</em>
              </h1>
              <div className="w-10 h-px bg-[#82000D]/60 mb-5" />
              <p className="text-[0.9375rem] text-[#1C1714]/86 font-normal leading-relaxed max-w-lg">
                Market commentary, neighbourhood guides and stories from our advisors. New pieces are published first on LinkedIn.
              </p>
            </div>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-crimson inline-flex items-center gap-3 px-7 py-4 text-[10px] font-bold tracking-[0.35em] uppercase shrink-0 self-start"
            >
              <FaLinkedinIn size={14} /> Follow on LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="px-6 lg:px-16 pb-6">
        <motion.a
          href={featured.href}
          target="_blank"
          rel="noopener noreferrer"
          {...fadeUp(0)}
          className="group relative block max-w-[1400px] mx-auto overflow-hidden h-[58vh] min-h-[380px]"
        >
          <Image
            src={featured.img}
            alt={featured.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1400px"
            className="object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#210A0B]/85 via-[#210A0B]/25 to-transparent" />
          <div className="card-border-reveal" />
          <div className="absolute bottom-0 left-0 right-0 p-7 lg:p-12 max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#E8DCBF]">{featured.category}</span>
              <span className="w-1 h-1 rounded-full bg-[#E8DCBF]/50" />
              <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#FBF5F2]/60">{featured.date}</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-serif font-normal text-[#FBF5F2] leading-tight mb-4">
              {featured.title}
            </h2>
            <p className="text-[0.95rem] font-normal text-[#FBF5F2]/80 leading-relaxed max-w-xl mb-6">
              {featured.excerpt}
            </p>
            <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.35em] uppercase text-[#E8DCBF] group-hover:gap-3 transition-all">
              Read on LinkedIn <ArrowUpRight size={14} />
            </span>
          </div>
        </motion.a>
      </section>

      {/* ── ARTICLE GRID ── */}
      <section className="py-14 lg:py-20 px-6 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <motion.div {...fadeUp(0)} className="mb-10">
            <p className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#82000D]/70 mb-3">The Journal</p>
            <h2 className="text-2xl lg:text-3xl font-serif font-normal text-[#1C1714]">Latest Articles</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {articles.map((a, i) => (
              <motion.a
                key={a.id}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                {...fadeUp((i % 3) * 0.08)}
                className="group block"
              >
                <div className="relative aspect-[16/11] overflow-hidden mb-5">
                  <Image
                    src={a.img}
                    alt={a.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[2.2s] ease-out group-hover:scale-105"
                  />
                  <div className="card-border-reveal" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[8px] font-bold tracking-[0.4em] uppercase text-[#82000D]">{a.category}</span>
                  <span className="w-1 h-1 rounded-full bg-[#82000D]/30" />
                  <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-[#1C1714]/40">{a.date}</span>
                </div>
                <h3 className="text-xl font-serif font-normal text-[#1C1714] leading-snug group-hover:text-[#82000D] transition-colors duration-300 mb-2.5">
                  {a.title}
                </h3>
                <p className="text-[0.875rem] font-normal text-[#1C1714]/85 leading-[1.7] mb-4">{a.excerpt}</p>
                <span className="inline-flex items-center gap-2 text-[9px] font-bold tracking-[0.3em] uppercase text-[#82000D] group-hover:gap-3 transition-all">
                  Read on LinkedIn <ArrowUpRight size={13} />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── LINKEDIN CTA ── */}
      <section className="relative py-24 lg:py-32 px-6 lg:px-16 bg-[#210A0B] overflow-hidden">
        <motion.div
          className="relative z-10 text-center max-w-2xl mx-auto space-y-7"
          {...(reduce ? {} : {
            initial:    { opacity: 0, y: 26, filter: "blur(6px)" },
            whileInView:{ opacity: 1, y: 0,  filter: "blur(0px)" },
            viewport:   { once: true, amount: 0.4 },
            transition: { duration: 0.9, ease },
          })}
        >
          <div className="w-px h-12 bg-[#E8DCBF]/40 mx-auto" />
          <h2 className="text-3xl lg:text-5xl font-serif font-normal text-[#FBF5F2] leading-tight">
            Every insight, first on <em className="italic text-[#E8DCBF]">LinkedIn</em>
          </h2>
          <p className="text-[0.9375rem] font-normal text-[#FBF5F2]/75 leading-relaxed max-w-md mx-auto">
            Follow Pavani Realty Co for market notes, new listings and the stories behind Nairobi's finest addresses.
          </p>
          <div className="flex justify-center pt-1">
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#E8DCBF] text-[#82000D] px-9 py-4 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-[#FBF5F2] transition-colors duration-300"
            >
              <FaLinkedinIn size={14} /> Follow on LinkedIn
            </a>
          </div>
        </motion.div>
      </section>

      <Footer settings={settings} />
    </main>
  );
}
