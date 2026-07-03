"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

interface ContactClientProps {
  settings?: any;
}

const ease = [0.23, 1, 0.32, 1] as const;

export default function ContactClient({ settings }: ContactClientProps) {
  const reduce = useReducedMotion();
  const email   = settings?.contact?.email   || "pavanirealtyco@gmail.com";
  const phone   = settings?.contact?.phone   || "+254 729 377 495";
  const address = settings?.contact?.address || "Kofisi, Westlands, Nairobi, Kenya";

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
            <p className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#82000D] mb-4">Contact</p>
            <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-serif font-normal text-[#1C1714] leading-tight mb-5">
              Get In Touch
            </h1>
            <div className="w-10 h-px bg-[#82000D]/60 mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT INFO + FORM SPLIT ── */}
      <section className="py-12 lg:py-20 px-6 lg:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* ── Contact Information (now on the right) ── */}
          <motion.div {...fadeUp(0.08)} className="space-y-12 lg:sticky lg:top-32 order-1 lg:order-2">
            <div>
              <h2 className="text-3xl lg:text-4xl font-serif font-normal text-[#1C1714] leading-tight mb-6">
                Connect With Our <em className="italic text-[#82000D]">Advisors</em>
              </h2>
              <p className="text-[1.05rem] font-normal text-[#1C1714]/80 leading-[1.8] max-w-md">
                Whether you&rsquo;re seeking your next primary residence, a strategic investment, or expert market analysis, our dedicated team provides unparalleled discretion and service.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 pt-8 border-t border-[#82000D]/10">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-full bg-[#F3EFE9] flex items-center justify-center text-[#82000D] mb-4 border border-[#82000D]/10">
                  <MapPin size={14} />
                </div>
                <p className="text-[9px] font-bold tracking-[0.35em] uppercase text-[#1C1714]/40">Visit Us</p>
                <p className="text-[14px] text-[#1C1714]/90 leading-relaxed font-medium">{address}</p>
              </div>

              <div className="space-y-3">
                <div className="w-8 h-8 rounded-full bg-[#F3EFE9] flex items-center justify-center text-[#82000D] mb-4 border border-[#82000D]/10">
                  <Phone size={14} />
                </div>
                <p className="text-[9px] font-bold tracking-[0.35em] uppercase text-[#1C1714]/40">Call Us</p>
                <a href={`tel:${phone}`} className="text-[14px] text-[#1C1714]/90 hover:text-[#82000D] transition-colors font-medium">{phone}</a>
              </div>

              <div className="space-y-3">
                <div className="w-8 h-8 rounded-full bg-[#F3EFE9] flex items-center justify-center text-[#82000D] mb-4 border border-[#82000D]/10">
                  <Mail size={14} />
                </div>
                <p className="text-[9px] font-bold tracking-[0.35em] uppercase text-[#1C1714]/40">Email Us</p>
                <a href={`mailto:${email}`} className="text-[14px] text-[#1C1714]/90 hover:text-[#82000D] transition-colors break-all font-medium">{email}</a>
              </div>

              <div className="space-y-3">
                <div className="w-8 h-8 rounded-full bg-[#F3EFE9] flex items-center justify-center text-[#82000D] mb-4 border border-[#82000D]/10">
                  <Clock size={14} />
                </div>
                <p className="text-[9px] font-bold tracking-[0.35em] uppercase text-[#1C1714]/40">Office Hours</p>
                <p className="text-[14px] text-[#1C1714]/90 leading-relaxed font-medium">Mon&ndash;Sat · 8AM&ndash;6PM EAT</p>
              </div>
            </div>
          </motion.div>

          {/* ── Premium Form (now on the left) ── */}
          <motion.div {...fadeUp(0.16)} className="bg-[#FFFFFF] p-8 lg:p-12 shadow-[0_10px_40px_rgba(28,23,20,0.03)] border border-[#82000D]/5 order-2 lg:order-1">
            <div className="mb-10 text-center">
              <p className="text-[10px] font-bold tracking-[0.4em] text-[#82000D] uppercase mb-3">Enquiry Form</p>
              <h3 className="text-2xl font-serif text-[#1C1714]">Send a Message</h3>
            </div>
            
            <ContactForm />
          </motion.div>
        </div>
      </section>

      <Footer settings={settings} />
    </main>
  );
}

