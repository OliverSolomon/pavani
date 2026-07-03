"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, Mail } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface ContactClientProps {
  settings?: any;
  content?: any;
}

const ease = [0.23, 1, 0.32, 1] as const;

export default function ContactClient({ settings, content }: ContactClientProps) {
  const reduce = useReducedMotion();
  const email   = settings?.contact?.email   || "pavanirealtyco@gmail.com";
  const phone   = settings?.contact?.phone   || "+254 729 377 495";
  const address = settings?.contact?.address || "Kofisi, Westlands, Nairobi, Kenya";

  const C = content || {};
  const heroEyebrow  = C.heroEyebrow  || "Contact";
  const heroTitle    = C.heroTitle    || "Get In Touch";
  const officesLabel = C.officesLabel || "Offices";
  const officeName   = C.officeName   || "Westlands Office";
  const formEyebrow  = C.formEyebrow  || "Enquiry Form";
  const formTitle    = C.formTitle    || "Tell Us About Your Requirements";

  const fadeUp = (delay = 0) =>
    reduce ? {} : {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.7, ease, delay },
    };

  return (
    <main className="min-h-screen bg-[#FAF8F4] text-[#1C1714]">
      <Navbar settings={settings} />

      {/* ── PAGE HERO ── */}
      <section className="relative pt-32 pb-14 px-6 lg:px-16 overflow-hidden">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#82000D,#82000D 1px,transparent 1px,transparent 72px),repeating-linear-gradient(90deg,#82000D,#82000D 1px,transparent 1px,transparent 72px)",
          }}
        />
        <div className="relative max-w-[1400px] mx-auto text-center">
          <motion.div {...fadeUp(0)}>
            <p className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#82000D] mb-4">{heroEyebrow}</p>
            <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-serif font-normal text-[#1C1714] leading-tight mb-5">
              {heroTitle}
            </h1>
            <div className="w-10 h-px bg-[#82000D]/60 mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* ── OFFICES (left) + FORM (right) ── */}
      <section className="py-12 lg:py-20 px-6 lg:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] gap-12 lg:gap-16 items-start">

          {/* ── Offices — small card ── */}
          <motion.div {...fadeUp(0.08)} className="lg:sticky lg:top-32">
            <p className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#82000D] mb-6">{officesLabel}</p>
            <div className="border border-[#82000D]/12 p-7 space-y-6">
              <h2 className="text-xl font-serif text-[#1C1714]">{officeName}</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={15} className="text-[#82000D] shrink-0 mt-0.5" />
                  <span className="text-[13px] text-[#1C1714]/80 font-medium leading-relaxed">{address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={15} className="text-[#82000D] shrink-0" />
                  <a href={`tel:${phone}`} className="text-[13px] text-[#1C1714]/80 font-medium hover:text-[#82000D] transition-colors">{phone}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={15} className="text-[#82000D] shrink-0" />
                  <a href={`mailto:${email}`} className="text-[13px] text-[#1C1714]/80 font-medium hover:text-[#82000D] transition-colors break-all">{email}</a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Enquiry form — right ── */}
          <motion.div {...fadeUp(0.16)} className="bg-[#FFFFFF] p-8 lg:p-12 shadow-[0_10px_40px_rgba(28,23,20,0.03)] border border-[#82000D]/5">
            <div className="mb-10">
              <p className="text-[10px] font-bold tracking-[0.4em] text-[#82000D] uppercase mb-3">{formEyebrow}</p>
              <h3 className="text-2xl lg:text-3xl font-serif text-[#1C1714] leading-tight">{formTitle}</h3>
              <div className="w-8 h-px bg-[#82000D]/50 mt-5" />
            </div>

            <ContactForm showBrand={false} showInquiryType={false} whatsappNumber={settings?.socials?.whatsapp || settings?.contact?.phone} />
          </motion.div>
        </div>
      </section>

      <Footer settings={settings} />
    </main>
  );
}

