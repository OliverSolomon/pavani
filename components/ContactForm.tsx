"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

interface ContactFormProps {
  initialInquiryType?: string;
  prefilledMessage?: string;
  className?: string;
  /** WhatsApp number (any format) for the WhatsApp button under submit. */
  whatsappNumber?: string;
  whatsappMessage?: string;
  /** Show the WhatsApp button + Pavani logo under the submit button. */
  showBrand?: boolean;
  /** Show the "Inquiry Type" option buttons. */
  showInquiryType?: boolean;
}

const INQUIRY_TYPES = [
  "General Inquiry",
  "Schedule Viewing",
  "Make Offer",
  "Investment Analysis",
];

const ease = [0.23, 1, 0.32, 1] as const;

const inputClass =
  "w-full border border-[#82000D]/15 bg-[#FAF8F4] px-4 py-3 text-[14px] text-[#1C1714] placeholder:text-[#1C1714]/30 focus:outline-none focus:border-[#82000D] transition-colors";
const labelClass =
  "block text-[9px] font-bold tracking-[0.35em] uppercase text-[#1C1714]/50 mb-2.5";

export default function ContactForm({
  initialInquiryType = "General Inquiry",
  prefilledMessage = "",
  className,
  whatsappNumber,
  whatsappMessage,
  showBrand = true,
  showInquiryType = true,
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

  const wa = (whatsappNumber || "254745260289").replace(/[^0-9]/g, "");
  const waHref = `https://wa.me/${wa}?text=${encodeURIComponent(
    whatsappMessage || prefilledMessage || "Hello Pavani Realty, I'd like to make an enquiry."
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
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
        <div className="w-16 h-16 bg-[#82000D] flex items-center justify-center mb-8">
          <Check size={28} className="text-[#FAF8F4]" />
        </div>
        <h3 className="text-2xl lg:text-3xl font-serif text-[#1C1714] mb-4">Thank You</h3>
        <p className="text-[13px] text-[#1C1714]/70 font-normal leading-relaxed max-w-sm mb-10 mx-auto">
          Your enquiry has been received. One of our advisors will be in touch with you shortly.
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
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Full Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Your full name"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Email Address</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="your@email.com"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Phone Number</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          placeholder="+254 700 000 000"
          className={inputClass}
        />
      </div>

      {showInquiryType && (
        <div>
          <label className={labelClass}>Inquiry Type</label>
          <div className="flex flex-wrap gap-2">
            {INQUIRY_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm((f) => ({ ...f, inquiryType: type }))}
                className={cn(
                  "px-4 py-2.5 text-[9px] font-bold tracking-[0.2em] uppercase border transition-all duration-200",
                  form.inquiryType === type
                    ? "bg-[#82000D] text-[#FBF5F2] border-[#82000D]"
                    : "bg-[#FFFFFF] border-[#82000D]/15 text-[#1C1714]/60 hover:border-[#82000D]/40 hover:text-[#1C1714]"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className={labelClass}>Message</label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="How can we assist you?"
          className={cn(inputClass, "resize-none")}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{ boxShadow: "none" }}
        className={cn(
          "btn-crimson w-full h-14 text-[10px] font-bold tracking-[0.4em] uppercase flex items-center justify-center gap-3",
          loading && "opacity-60 cursor-wait"
        )}
      >
        {loading ? "SENDING…" : <>SEND INQUIRY <ArrowRight size={14} /></>}
      </button>

      {showBrand && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-[#82000D]/12" />
            <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#1C1714]/35">or</span>
            <span className="h-px flex-1 bg-[#82000D]/12" />
          </div>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{ boxShadow: "none" }}
            className="btn-whatsapp flex items-center justify-center gap-3 w-full h-14 text-[10px] font-bold tracking-[0.3em] uppercase"
          >
            <FaWhatsapp size={18} /> WhatsApp Us
          </a>

          <div className="flex items-center justify-center pt-6 mt-1 border-t border-[#82000D]/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-crimson.svg" alt="Pavani Realty" className="h-14 w-auto opacity-95" />
          </div>
        </div>
      )}
    </form>
  );
}
