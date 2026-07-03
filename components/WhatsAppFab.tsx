"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";

/* Pavani Realty WhatsApp line */
const PHONE = "254745260289";
const PREFILL = "Hello Pavani Realty, I'd like to enquire about a property.";

export default function WhatsAppFab() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Delay the entrance so it settles after the hero, not against it.
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 900);
    return () => clearTimeout(t);
  }, []);

  // Individual property pages already have a "WhatsApp Us" button in the
  // enquiry form, so the floating button would be redundant there.
  const isPropertyDetail = /^\/properties\/[^/]+/.test(pathname || "");
  if (isPropertyDetail) return null;

  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(PREFILL)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Pavani Realty on WhatsApp"
      data-mounted={mounted}
      className="wa-fab group print:hidden"
    >
      {/* Expanding label (desktop hover) */}
      <span className="wa-fab-label">
        <span className="block text-[8px] font-bold tracking-[0.3em] uppercase text-[#82000D]/55 leading-none mb-1">
          Talk to us
        </span>
        <span className="block text-[11px] font-semibold tracking-wide text-[#1C1714] leading-none">
          Chat on WhatsApp
        </span>
      </span>

      {/* Button */}
      <span className="wa-fab-btn">
        <FaWhatsapp className="wa-fab-icon" />
        <span className="wa-fab-online" aria-hidden="true" />
      </span>
    </a>
  );
}
