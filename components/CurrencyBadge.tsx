"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD" },
  { code: "KSH", symbol: "KSh", label: "KSH" },
  { code: "EUR", symbol: "€", label: "EUR" },
  { code: "GBP", symbol: "£", label: "GBP" },
];

interface CurrencyBadgeProps {
  amount: number | string;
  baseCurrency?: string;
  className?: string;
  showSwitcher?: boolean;
}

export default function CurrencyBadge({
  amount,
  baseCurrency = "USD",
  className,
  showSwitcher = true,
}: CurrencyBadgeProps) {
  const { currency, setCurrency, formatPrice } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const formatted = formatPrice(amount, baseCurrency);

  return (
    <div className={cn("relative inline-flex items-center gap-1.5", className)} ref={ref}>
      <span className="font-serif">{formatted}</span>
      {showSwitcher && (
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); setIsOpen(!isOpen); }}
          className="flex items-center gap-0.5 text-[8px] font-bold tracking-wider uppercase opacity-60 hover:opacity-100 transition-opacity"
        >
          {currency} <ChevronDown size={10} />
        </button>
      )}

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1.5 w-28 bg-[#1E0D02] shadow-2xl border border-[#C9A96E]/15 py-1 z-[500]"
          onClick={e => e.stopPropagation()}
        >
          {CURRENCIES.map(c => (
            <button
              key={c.code}
              onClick={() => { setCurrency(c.code as any); setIsOpen(false); }}
              className={cn(
                "w-full text-left px-3 py-2 text-[9px] font-bold tracking-widest uppercase hover:bg-[#2A1508] transition-colors",
                currency === c.code ? "text-[#C9A96E]" : "text-[#EDE0C8]/50"
              )}
            >
              {c.symbol} {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
