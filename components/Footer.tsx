"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useState } from "react";

interface FooterProps {
  settings?: { general?: any; brand?: any; contact?: any; socials?: any };
}

export default function Footer({ settings }: FooterProps) {
  const [email, setEmail] = useState("");
  const agencyEmail   = settings?.contact?.email   || "pavanirealtyco@gmail.com";
  const agencyPhone   = settings?.contact?.phone   || "+254 729 377 495";
  const agencyAddress = settings?.contact?.address || "Kofisi, Westlands, Nairobi, Kenya";
  const siteName      = settings?.general?.siteName || "PAVANI";
  const socials       = settings?.socials;

  return (
    <footer className="bg-[#0D0501] text-[#EDE0C8] border-t border-[#C9A96E]/10 pt-20 pb-10 px-6 lg:px-16 print:hidden">
      <div className="max-w-[1400px] mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16 mb-16 pb-16 border-b border-[#C9A96E]/10">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#C9A96E] flex items-center justify-center shrink-0">
                <span className="font-serif text-[#0D0501] text-xl font-semibold leading-none">P</span>
              </div>
              <div>
                <p className="text-[11px] font-bold tracking-[0.35em] uppercase text-[#EDE0C8]">{siteName}</p>
                <p className="text-[8px] tracking-[0.3em] uppercase text-[#C9A96E]/60">REALTY CO</p>
              </div>
            </Link>
            <div className="flex gap-5 pt-2">
              {socials?.instagram && <Link href={socials.instagram} target="_blank" className="text-[#EDE0C8]/30 hover:text-[#C9A96E] transition-colors"><FaInstagram size={16} /></Link>}
              {socials?.facebook  && <Link href={socials.facebook}  target="_blank" className="text-[#EDE0C8]/30 hover:text-[#C9A96E] transition-colors"><FaFacebookF  size={16} /></Link>}
              {socials?.linkedin  && <Link href={socials.linkedin}  target="_blank" className="text-[#EDE0C8]/30 hover:text-[#C9A96E] transition-colors"><FaLinkedinIn  size={16} /></Link>}
              {socials?.twitter   && <Link href={socials.twitter}   target="_blank" className="text-[#EDE0C8]/30 hover:text-[#C9A96E] transition-colors"><FaXTwitter   size={16} /></Link>}
              {!socials && <>
                <FaInstagram size={16} className="text-[#EDE0C8]/20" />
                <FaLinkedinIn size={16} className="text-[#EDE0C8]/20" />
                <FaFacebookF size={16} className="text-[#EDE0C8]/20" />
              </>}
            </div>
          </div>

          {/* Get in Touch */}
          <div className="space-y-5">
            <h4 className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#C9A96E]/70">Get in Touch</h4>
            <div className="space-y-3 text-sm font-light text-[#EDE0C8]/50 leading-relaxed">
              <div className="flex items-start gap-3"><MapPin size={13} className="text-[#C9A96E]/50 shrink-0 mt-0.5" /><span>{agencyAddress}</span></div>
              <div className="flex items-center gap-3"><Phone size={13} className="text-[#C9A96E]/50 shrink-0" /><a href={`tel:${agencyPhone}`} className="hover:text-[#C9A96E] transition-colors">{agencyPhone}</a></div>
              <div className="flex items-center gap-3"><Mail  size={13} className="text-[#C9A96E]/50 shrink-0" /><a href={`mailto:${agencyEmail}`} className="hover:text-[#C9A96E] transition-colors">{agencyEmail}</a></div>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-5">
            <h4 className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#C9A96E]/70">Navigation</h4>
            <ul className="space-y-3 text-[10px] font-medium tracking-[0.2em] text-[#EDE0C8]/45">
              {[
                { label: "Home",         href: "/" },
                { label: "Properties",   href: "/properties" },
                { label: "Neighborhoods",href: "/neighborhoods" },
                { label: "Gallery",      href: "/properties" },
                { label: "Insights",     href: "/properties" },
                { label: "About Us",     href: "/contact" },
                { label: "Contact",      href: "/contact" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-[#C9A96E] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-5">
            <h4 className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#C9A96E]/70">Join Our Collective</h4>
            <p className="text-xs font-light text-[#EDE0C8]/40 leading-relaxed">
              Curated updates on exclusive developments, delivered privately.
            </p>
            <div className="border-b border-[#EDE0C8]/10 pb-3 flex items-center gap-3 group">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="YOUR EMAIL"
                className="bg-transparent flex-grow text-[9px] font-bold tracking-[0.3em] placeholder:text-[#EDE0C8]/20 text-[#EDE0C8] uppercase outline-none"
              />
              <button className="text-[#EDE0C8]/20 group-hover:text-[#C9A96E] group-hover:translate-x-0.5 transition-all duration-300">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[8px] tracking-[0.3em] uppercase text-[#EDE0C8]/20">
          <p>© {new Date().getFullYear()} {siteName} Realty Co. All rights reserved.</p>
          <Link href="#" className="hover:text-[#C9A96E] transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
