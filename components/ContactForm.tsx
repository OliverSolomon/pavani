"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ContactFormProps {
  initialInquiryType?: string;
  prefilledMessage?: string;
  className?: string;
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

export default function ContactForm({
  initialInquiryType = "General Inquiry",
  prefilledMessage = "",
  className
}: ContactFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: initialInquiryType,
    message: prefilledMessage,
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network request
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className={cn("flex flex-col items-center justify-center text-center py-16 px-6 bg-[#FFFFFF] border border-[#82000D]/10", className)}
      >
        <div className="w-16 h-16 bg-[#82000D] flex items-center justify-center rounded-full shadow-lg shadow-[#82000D]/20 mb-8">
          <Check size={28} className="text-[#FAF8F4]" />
        </div>
        <h3 className="text-2xl lg:text-3xl font-serif text-[#1C1714] mb-4">Thank You</h3>
        <p className="text-[13px] text-[#1C1714]/70 font-normal leading-relaxed max-w-sm mb-10 mx-auto">
          Your enquiry has been securely received. One of our specialized advisors will be in touch with you shortly.
        </p>
        <button
          onClick={() => setSent(false)}
          className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#1C1714]/40 hover:text-[#82000D] transition-colors flex items-center gap-2 mx-auto"
        >
          Send another message <ArrowRight size={11} />
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-8", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="relative group">
          <input
            type="text"
            required
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="peer w-full bg-transparent border-b border-[#1C1714]/20 py-3 text-[14px] text-[#1C1714] placeholder-transparent focus:outline-none focus:border-[#82000D] transition-colors"
            placeholder="Name"
            id="cf-name"
          />
          <label htmlFor="cf-name" className="absolute left-0 -top-3.5 text-[9px] font-bold tracking-[0.35em] uppercase text-[#1C1714]/50 transition-all peer-placeholder-shown:text-[11px] peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-[9px] peer-focus:text-[#82000D] pointer-events-none">
            Full Name
          </label>
        </div>
        
        <div className="relative group">
          <input
            type="email"
            required
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="peer w-full bg-transparent border-b border-[#1C1714]/20 py-3 text-[14px] text-[#1C1714] placeholder-transparent focus:outline-none focus:border-[#82000D] transition-colors"
            placeholder="Email"
            id="cf-email"
          />
          <label htmlFor="cf-email" className="absolute left-0 -top-3.5 text-[9px] font-bold tracking-[0.35em] uppercase text-[#1C1714]/50 transition-all peer-placeholder-shown:text-[11px] peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-[9px] peer-focus:text-[#82000D] pointer-events-none">
            Email Address
          </label>
        </div>
      </div>

      <div className="relative group">
        <input
          type="tel"
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          className="peer w-full bg-transparent border-b border-[#1C1714]/20 py-3 text-[14px] text-[#1C1714] placeholder-transparent focus:outline-none focus:border-[#82000D] transition-colors"
          placeholder="Phone"
          id="cf-phone"
        />
        <label htmlFor="cf-phone" className="absolute left-0 -top-3.5 text-[9px] font-bold tracking-[0.35em] uppercase text-[#1C1714]/50 transition-all peer-placeholder-shown:text-[11px] peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-[9px] peer-focus:text-[#82000D] pointer-events-none">
          Phone Number
        </label>
      </div>

      <div className="space-y-4 pt-2">
        <label className="text-[9px] font-bold tracking-[0.35em] uppercase text-[#1C1714]/50">Nature of Inquiry</label>
        <div className="flex flex-wrap gap-2">
          {INQUIRY_TYPES.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setForm(f => ({ ...f, inquiryType: type }))}
              className={cn(
                "px-4 py-2.5 text-[9px] font-bold tracking-[0.2em] uppercase border transition-all duration-300",
                form.inquiryType === type
                  ? "bg-[#82000D] text-[#FAF8F4] border-[#82000D]"
                  : "bg-[#FFFFFF] border-[#1C1714]/10 text-[#1C1714]/70 hover:border-[#82000D]/40 hover:text-[#1C1714]"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="relative group pt-4">
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          className="peer w-full bg-transparent border-b border-[#1C1714]/20 py-3 text-[14px] text-[#1C1714] placeholder-transparent focus:outline-none focus:border-[#82000D] transition-colors resize-none"
          placeholder="Message"
          id="cf-message"
        />
        <label htmlFor="cf-message" className="absolute left-0 -top-1.5 text-[9px] font-bold tracking-[0.35em] uppercase text-[#1C1714]/50 transition-all peer-placeholder-shown:text-[11px] peer-placeholder-shown:top-3.5 peer-focus:-top-1.5 peer-focus:text-[9px] peer-focus:text-[#82000D] pointer-events-none">
          How can we assist you?
        </label>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full h-14 text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500 flex items-center justify-center gap-4 relative overflow-hidden group",
            loading
              ? "bg-[#1C1714]/5 text-[#1C1714]/40 cursor-wait border border-[#1C1714]/10"
              : "bg-[#82000D] text-[#FAF8F4] hover:bg-[#6A000A]"
          )}
        >
          <span className="relative z-10 flex items-center gap-3">
            {loading ? "SENDING..." : <>SUBMIT ENQUIRY <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>}
          </span>
        </button>
        <p className="text-[8px] text-[#1C1714]/40 tracking-wider text-center mt-5 uppercase font-medium">
          Your information is kept strictly confidential.
        </p>
      </div>
    </form>
  );
}
