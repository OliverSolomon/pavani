"use client";

import { useState } from "react";
import { Phone, X, Share2 } from "lucide-react";
import {
  FaLinkedinIn, FaFacebookF, FaInstagram, FaTiktok, FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface SocialRailProps {
  settings?: { contact?: any; socials?: any };
}

/* Floating social rail - all links editable via Sanity (socialSettings + contactSettings). */
export default function SocialRail({ settings }: SocialRailProps) {
  const [open, setOpen] = useState(true);

  const s = settings?.socials || {};
  const phone = settings?.contact?.phone || "+254 729 377 495";

  const items = [
    { key: "call",      href: `tel:${phone}`,                                         icon: <Phone size={15} />,        bg: "#1FA85A", label: "Call" },
    { key: "linkedin",  href: s.linkedin  || "https://www.linkedin.com/company/pavani-realty/", icon: <FaLinkedinIn size={15} />, bg: "#0A66C2", label: "LinkedIn" },
    { key: "facebook",  href: s.facebook  || "https://facebook.com",                  icon: <FaFacebookF size={15} />,  bg: "#1877F2", label: "Facebook" },
    { key: "tiktok",    href: s.tiktok    || "https://tiktok.com",                    icon: <FaTiktok size={15} />,     bg: "#111111", label: "TikTok" },
    { key: "instagram", href: s.instagram || "https://instagram.com",                 icon: <FaInstagram size={16} />,  bg: "#E1306C", label: "Instagram" },
    { key: "twitter",   href: s.twitter   || "https://x.com",                         icon: <FaXTwitter size={14} />,   bg: "#111111", label: "X (Twitter)" },
    { key: "youtube",   href: s.youtube   || "https://youtube.com",                   icon: <FaYoutube size={15} />,    bg: "#FF0000", label: "YouTube" },
  ];

  return (
    <div className="social-rail print:hidden hidden md:flex flex-col items-center gap-2.5">
      <div className={`social-rail-stack flex flex-col items-center gap-2.5 ${open ? "is-open" : "is-closed"}`}>
        {items.map((it) => (
          <a
            key={it.key}
            href={it.href}
            target={it.key === "call" ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={it.label}
            title={it.label}
            className="social-rail-btn"
            style={{ backgroundColor: it.bg }}
          >
            {it.icon}
          </a>
        ))}
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Hide social links" : "Show social links"}
        className="social-rail-toggle"
      >
        {open ? <X size={16} /> : <Share2 size={15} />}
      </button>
    </div>
  );
}
