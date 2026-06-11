"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { MapPin, Phone, Mail, Check, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface ContactClientProps {
  settings?: any;
}

const INQUIRY_TYPES = [
  "Buying a Property",
  "Selling a Property",
  "Investment Advisory",
  "Rental Inquiry",
  "Private Viewing",
  "General Inquiry",
];

const ease = [0.23, 1, 0.32, 1] as const;

export default function ContactClient({ settings }: ContactClientProps) {
  const reduce = useReducedMotion();
  const email   = settings?.contact?.email   || "pavanirealtyco@gmail.com";
  const phone   = settings?.contact?.phone   || "+254 729 377 495";
  const address = settings?.contact?.address || "Kofisi, Westlands, Nairobi, Kenya";

  const [form, setForm] = useState({
    name: "", email: "", phone: "", inquiryType: "General Inquiry", message: "",
  });
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
  };

  const fadeUp = (delay = 0) =>
    reduce ? {} : {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.7, ease, delay },
    };

  return (
    <main className="min-h-screen bg-[#0D0501] text-[#EDE0C8]">
      <Navbar settings={settings} />

      {/* ── PAGE HERO ── */}
      <section className="relative pt-32 pb-14 px-6 lg:px-16 overflow-hidden">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#C9A96E,#C9A96E 1px,transparent 1px,transparent 72px),repeating-linear-gradient(90deg,#C9A96E,#C9A96E 1px,transparent 1px,transparent 72px)",
          }}
        />
        <div className="relative max-w-[1400px] mx-auto">
          <motion.div {...fadeUp(0)}>
            <p className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#C9A96E] mb-4">Contact</p>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-serif font-light text-[#EDE0C8] leading-tight mb-5">
              Get In Touch
            </h1>
            <div className="w-10 h-px bg-[#C9A96E]/60" />
          </motion.div>
        </div>
      </section>

      {/* ── OFFICES + FORM ── */}
      <section className="py-12 lg:py-16 px-6 lg:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 lg:gap-20">

          {/* ── LEFT: OFFICES ── */}
          <motion.div {...fadeUp(0.08)} className="space-y-8">
            <p className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#C9A96E]/70">Offices</p>

            {/* Main office card */}
            <div className="border border-[#C9A96E]/15 p-8 space-y-6 bg-[#180900]">
              <h3 className="text-lg font-serif text-[#EDE0C8]">Westlands Office</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={14} className="text-[#C9A96E] mt-0.5 shrink-0" />
                  <p className="text-[13px] text-[#EDE0C8]/70 leading-relaxed font-light">{address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={14} className="text-[#C9A96E] shrink-0" />
                  <a href={`tel:${phone}`} className="text-[13px] text-[#EDE0C8]/70 hover:text-[#C9A96E] transition-colors font-light">
                    {phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={14} className="text-[#C9A96E] shrink-0" />
                  <a href={`mailto:${email}`} className="text-[13px] text-[#EDE0C8]/70 hover:text-[#C9A96E] transition-colors font-light">
                    {email}
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="space-y-2">
              <p className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#C9A96E]/72">Office Hours</p>
              <p className="text-[0.875rem] text-[#EDE0C8]/72 font-light">Monday – Saturday</p>
              <p className="text-[0.875rem] text-[#EDE0C8]/72 font-light">8:00 AM – 6:00 PM EAT</p>
            </div>
          </motion.div>

          {/* ── RIGHT: ENQUIRY FORM ── */}
          <motion.div {...fadeUp(0.16)}>
            <div className="mb-8">
              <p className="eyebrow mb-4">Enquiry Form</p>
              <h2 className="text-2xl lg:text-3xl font-serif font-light text-[#EDE0C8] leading-snug">
                Tell Us About Your{" "}
                <em className="italic text-[#C9A96E]">Requirements</em>
              </h2>
              <div className="w-8 h-px bg-[#C9A96E]/40 mt-5" />
            </div>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease }}
                className="border border-[#C9A96E]/15 bg-[#180900] p-16 flex flex-col items-center gap-6 text-center"
              >
                <div className="w-14 h-14 bg-[#C9A96E] flex items-center justify-center">
                  <Check size={22} className="text-[#0D0501]" />
                </div>
                <div>
                  <p className="text-xl font-serif uppercase mb-2 text-[#EDE0C8]">Thank You</p>
                  <p className="text-[13px] text-[#EDE0C8]/60 font-light leading-relaxed max-w-xs">
                    Your enquiry has been received. One of our advisors will contact you within 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => setSent(false)}
                  className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#EDE0C8]/40 hover:text-[#C9A96E] transition-colors flex items-center gap-2"
                >
                  Send another <ArrowRight size={11} />
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold tracking-[0.35em] uppercase text-[#EDE0C8]/70">Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                      className="pavani-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold tracking-[0.35em] uppercase text-[#EDE0C8]/70">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="pavani-input"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold tracking-[0.35em] uppercase text-[#EDE0C8]/70">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+254 ..."
                    className="pavani-input"
                  />
                </div>

                {/* Inquiry type */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold tracking-[0.35em] uppercase text-[#EDE0C8]/70">Inquiry Type</label>
                  <div className="flex flex-wrap gap-2">
                    {INQUIRY_TYPES.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, inquiryType: type }))}
                        className={cn(
                          "px-3.5 py-2 text-[9px] font-bold tracking-widest uppercase border transition-all duration-200",
                          form.inquiryType === type
                            ? "bg-[#C9A96E] text-[#0D0501] border-[#C9A96E]"
                            : "border-[#C9A96E]/20 text-[#EDE0C8]/50 hover:border-[#C9A96E]/40 hover:text-[#EDE0C8]/75"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold tracking-[0.35em] uppercase text-[#EDE0C8]/70">Message</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Your requirements..."
                    className="pavani-input resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "cta-link w-full h-13 py-4 text-[10px] font-bold tracking-[0.45em] uppercase transition-all duration-300 flex items-center justify-center gap-3 border",
                    loading
                      ? "border-[#C9A96E]/20 text-[#EDE0C8]/30 cursor-wait"
                      : "border-[#C9A96E]/40 text-[#EDE0C8]/80 hover:bg-[#C9A96E] hover:border-[#C9A96E] hover:text-[#0D0501]"
                  )}
                >
                  {loading ? "SENDING..." : <><span>SUBMIT ENQUIRY</span><ArrowRight size={13} /></>}
                </button>

                <p className="text-[8px] text-[#EDE0C8]/30 tracking-wider text-center">
                  Your information is kept strictly confidential.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <Footer settings={settings} />
    </main>
  );
}
