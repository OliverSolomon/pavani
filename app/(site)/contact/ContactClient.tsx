"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { MapPin, Phone, Mail, Check, ArrowRight, Clock } from "lucide-react";
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
        <div className="relative max-w-[1400px] mx-auto">
          <motion.div {...fadeUp(0)}>
            <p className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#82000D] mb-4">Contact</p>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-serif font-normal text-[#1C1714] leading-tight mb-5">
              Get In Touch
            </h1>
            <div className="w-10 h-px bg-[#82000D]/60" />
          </motion.div>
        </div>
      </section>

      {/* ── OFFICES + FORM ── */}
      <section className="py-12 lg:py-16 px-6 lg:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-start">

          {/* ── LEFT: description alone ── */}
          <motion.div {...fadeUp(0.08)} className="lg:sticky lg:top-28">
            <p className="eyebrow mb-5">Enquiry Form</p>
            <h2 className="text-3xl lg:text-5xl font-serif font-normal text-[#1C1714] leading-tight">
              Tell Us About Your{" "}
              <em className="italic text-[#82000D]">Requirements</em>
            </h2>
            <div className="w-10 h-px bg-[#82000D]/50 my-7" />
            <p className="text-[1rem] font-normal text-[#1C1714]/90 leading-[1.8] max-w-md">
              Whether you&rsquo;re buying, selling, or seeking advice on Nairobi&rsquo;s prime addresses, our advisors are ready to help. Share a few details and we&rsquo;ll be in touch within 24 hours.
            </p>
          </motion.div>

          {/* ── RIGHT: enquiry box — all contact info lives here ── */}
          <motion.div {...fadeUp(0.16)} className="glass-card p-7 lg:p-10">
            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 pb-8 mb-8 border-b border-[#82000D]/12">
              <div className="flex items-start gap-3">
                <MapPin size={15} className="text-[#82000D] mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-[8px] font-bold tracking-[0.35em] uppercase text-[#82000D]">Visit</p>
                  <p className="text-[13px] text-[#1C1714]/90 leading-relaxed">{address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={15} className="text-[#82000D] mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-[8px] font-bold tracking-[0.35em] uppercase text-[#82000D]">Call</p>
                  <a href={`tel:${phone}`} className="text-[13px] text-[#1C1714]/90 hover:text-[#82000D] transition-colors">{phone}</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={15} className="text-[#82000D] mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-[8px] font-bold tracking-[0.35em] uppercase text-[#82000D]">Email</p>
                  <a href={`mailto:${email}`} className="text-[13px] text-[#1C1714]/90 hover:text-[#82000D] transition-colors break-all">{email}</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={15} className="text-[#82000D] mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-[8px] font-bold tracking-[0.35em] uppercase text-[#82000D]">Hours</p>
                  <p className="text-[13px] text-[#1C1714]/90 leading-relaxed">Mon&ndash;Sat · 8AM&ndash;6PM EAT</p>
                </div>
              </div>
            </div>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease }}
                className="border border-[#82000D]/15 bg-[#F3EFE9] p-16 flex flex-col items-center gap-6 text-center"
              >
                <div className="w-14 h-14 bg-[#82000D] flex items-center justify-center">
                  <Check size={22} className="text-[#FAF8F4]" />
                </div>
                <div>
                  <p className="text-xl font-serif uppercase mb-2 text-[#1C1714]">Thank You</p>
                  <p className="text-[13px] text-[#1C1714]/78 font-normal leading-relaxed max-w-xs">
                    Your enquiry has been received. One of our advisors will contact you within 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => setSent(false)}
                  className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#1C1714]/40 hover:text-[#82000D] transition-colors flex items-center gap-2"
                >
                  Send another <ArrowRight size={11} />
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold tracking-[0.35em] uppercase text-[#1C1714]/85">Name</label>
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
                    <label className="text-[9px] font-bold tracking-[0.35em] uppercase text-[#1C1714]/85">Email</label>
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
                  <label className="text-[9px] font-bold tracking-[0.35em] uppercase text-[#1C1714]/85">Phone</label>
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
                  <label className="text-[9px] font-bold tracking-[0.35em] uppercase text-[#1C1714]/85">Inquiry Type</label>
                  <div className="flex flex-wrap gap-2">
                    {INQUIRY_TYPES.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, inquiryType: type }))}
                        className={cn(
                          "px-3.5 py-2 text-[9px] font-bold tracking-widest uppercase border transition-all duration-200",
                          form.inquiryType === type
                            ? "bg-[#82000D] text-[#FAF8F4] border-[#82000D]"
                            : "border-[#82000D]/20 text-[#1C1714]/70 hover:border-[#82000D]/40 hover:text-[#1C1714]/88"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold tracking-[0.35em] uppercase text-[#1C1714]/85">Message</label>
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
                      ? "border-[#82000D]/20 text-[#1C1714]/30 cursor-wait"
                      : "border-[#82000D]/40 text-[#1C1714]/90 hover:bg-[#82000D] hover:border-[#82000D] hover:text-[#FAF8F4]"
                  )}
                >
                  {loading ? "SENDING..." : <><span>SUBMIT ENQUIRY</span><ArrowRight size={13} /></>}
                </button>

                <p className="text-[8px] text-[#1C1714]/30 tracking-wider text-center">
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
