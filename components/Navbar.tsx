"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import SearchOverlay from "./SearchOverlay";

interface NavbarProps {
  settings?: { general?: any; brand?: any; contact?: any; socials?: any };
}

const CURRENCIES = [
  { code: "USD", label: "USD $", flag: "🇺🇸" },
  { code: "KSH", label: "KSH",   flag: "🇰🇪" },
  { code: "EUR", label: "EUR €", flag: "🇪🇺" },
  { code: "GBP", label: "GBP £", flag: "🇬🇧" },
];

const NAV_LINKS = [
  { label: "Properties", href: "/properties" },
  { label: "Gallery",    href: "/gallery" },
  { label: "Insights",   href: "/insights" },
  { label: "About",      href: "/about" },
  { label: "Contact",    href: "/contact" },
];

const ease = [0.23, 1, 0.32, 1] as const;

export default function Navbar({ settings }: NavbarProps) {
  const [mobile, setMobile]       = useState(false);
  const [search, setSearch]       = useState(false);
  const [currOpen, setCurrOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const { currency, setCurrency } = useCurrency();
  const currRef  = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const siteName = settings?.general?.siteName || "PAVANI";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (currRef.current && !currRef.current.contains(e.target as Node)) setCurrOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => { setMobile(false); }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const activeCurr = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  /* Transparent over the dark home hero; glass everywhere else. */
  const onHeroTop = pathname === "/" && !scrolled;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 w-full z-[1000] transition-all duration-500",
          onHeroTop
            ? "bg-transparent"
            : "glass-nav border-b border-[#82000D]/10 shadow-[0_1px_30px_rgba(130,0,13,0.06)]"
        )}
      >
        <div className="flex items-center justify-between px-6 lg:px-10 h-[72px]">

          {/* Logo — crimson on light, cream over the hero */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group" aria-label="Pavani Realty Co">
            <img
              src={onHeroTop ? "/logo-light.svg" : "/logo-crimson.svg"}
              alt="Pavani Realty Co"
              className="hidden sm:block h-34 w-auto"
            />
          </Link>

          {/* Centre nav — desktop */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map(l => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className={cn(
                    "nav-link relative text-[9px] font-bold tracking-[0.32em] uppercase transition-all duration-300 py-1",
                    active
                      ? "text-[#82000D]"
                      : onHeroTop
                        ? "text-[#FBF5F2]/85 hover:text-[#FBF5F2]"
                        : "text-[#1C1714]/86 hover:text-[#1C1714]"
                  )}
                  data-active={active}
                >
                  {l.label}
                  <span
                    className={cn(
                      "nav-link-underline",
                      active && "[clip-path:inset(0_0%_0_0)]"
                    )}
                    style={active ? { clipPath: "inset(0 0% 0 0)" } : {}}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-5">
            {/* Currency picker */}
            <div className="relative hidden sm:block" ref={currRef}>
              <button
                onClick={() => setCurrOpen(!currOpen)}
                className={cn(
                  "flex items-center gap-1.5 text-[9px] font-bold tracking-[0.2em] uppercase transition-colors duration-200",
                  onHeroTop ? "text-[#FBF5F2]/75 hover:text-[#FBF5F2]" : "text-[#1C1714]/80 hover:text-[#82000D]"
                )}
              >
                {activeCurr.flag} {currency}
                <ChevronDown
                  size={11}
                  className={cn(
                    "transition-transform duration-300",
                    currOpen && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {currOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease }}
                    className="absolute top-full right-0 mt-3 w-36 bg-[#FFFFFF] border border-[#82000D]/15 py-1 z-[1100] shadow-2xl"
                    style={{ transformOrigin: "top right" }}
                  >
                    {CURRENCIES.map(c => (
                      <button
                        key={c.code}
                        onClick={() => { setCurrency(c.code as any); setCurrOpen(false); }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 text-[9px] font-bold tracking-[0.2em] uppercase transition-colors duration-150 text-left hover:bg-[#ECE6DD]",
                          currency === c.code ? "text-[#82000D]" : "text-[#1C1714]/78"
                        )}
                      >
                        {c.flag} {c.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Inquire CTA */}
            <Link
              href="/contact"
              className={cn(
                "hidden sm:flex items-center px-5 h-9 border text-[9px] font-bold tracking-[0.3em] uppercase transition-all duration-300",
                onHeroTop
                  ? "border-[#FBF5F2]/40 text-[#FBF5F2]/90 hover:bg-[#FBF5F2] hover:border-[#FBF5F2] hover:text-[#82000D]"
                  : "border-[#82000D]/30 text-[#1C1714]/90 hover:bg-[#82000D] hover:border-[#82000D] hover:text-[#FBF5F2]"
              )}
            >
              INQUIRE
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobile(true)}
              className={cn(
                "lg:hidden transition-colors duration-200",
                onHeroTop ? "text-[#FBF5F2]/85 hover:text-[#FBF5F2]" : "text-[#1C1714]/88 hover:text-[#82000D]"
              )}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile overlay — full-screen with drawer easing ── */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            className="fixed inset-0 z-[2000] bg-[#FAF8F4] flex flex-col"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.40, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 h-[72px] border-b border-[#82000D]/10">
              <Link href="/" className="flex items-center gap-3" aria-label="Pavani Realty Co">
                <img src="/logo-crimson.svg" alt="Pavani Realty Co" className="h-34 w-auto" />
              </Link>
              <button
                onClick={() => setMobile(false)}
                className="text-[#1C1714]/74 hover:text-[#1C1714] transition-colors"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col flex-1 justify-center px-8 space-y-5">
              {NAV_LINKS.map((l, i) => {
                const active = isActive(l.href);
                return (
                  <motion.div
                    key={l.label}
                    initial={{ opacity: 0, x: 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.42,
                      ease: [0.23, 1, 0.32, 1],
                      delay: 0.08 + i * 0.055,
                    }}
                  >
                    <Link
                      href={l.href}
                      className={cn(
                        "text-4xl font-serif tracking-tight italic block transition-colors duration-200",
                        active ? "text-[#82000D]" : "text-[#1C1714] hover:text-[#82000D]"
                      )}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer strip */}
            <div className="px-8 pb-12 border-t border-[#82000D]/10 pt-7 space-y-4">
              <p className="text-[8px] font-bold tracking-[0.4em] uppercase text-[#1C1714]/30">
                Currency
              </p>
              <div className="flex gap-2 flex-wrap">
                {CURRENCIES.map(c => (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c.code as any)}
                    className={cn(
                      "px-3.5 py-2 text-[9px] font-bold tracking-widest uppercase border transition-all duration-200",
                      currency === c.code
                        ? "border-[#82000D] text-[#82000D]"
                        : "border-[#1C1714]/18 text-[#1C1714]/45 hover:border-[#1C1714]/35"
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <Link
                href="/contact"
                className="btn-crimson block w-full mt-4 py-4 text-center text-[9px] font-bold tracking-[0.4em] uppercase"
              >
                INQUIRE NOW
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={search} onClose={() => setSearch(false)} />
    </>
  );
}
