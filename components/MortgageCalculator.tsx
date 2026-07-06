"use client";

import { useState, useMemo } from "react";
import { Calculator, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MortgageCalculatorProps {
  propertyPrice?: number;
  baseCurrency?: string;
  className?: string;
  /** Render expanded with no collapse toggle (used as a standalone content section). */
  alwaysOpen?: boolean;
}

/* Rough conversion to KES for the initial home-price value (editable by the user). */
const TO_KES: Record<string, number> = { KSH: 1, KES: 1, USD: 130, EUR: 140, GBP: 165 };

export default function MortgageCalculator({ propertyPrice = 0, baseCurrency = "KSH", className, alwaysOpen = false }: MortgageCalculatorProps) {
  const rate = TO_KES[(baseCurrency || "KSH").toUpperCase()] ?? 1;
  const initialKes = propertyPrice ? Math.round(propertyPrice * rate) : 20000000;
  const [price, setPrice]             = useState(initialKes);
  const [downPaymentPct, setDpPct]    = useState(20);
  const [interestRate, setRate]       = useState(13);
  const [termYears, setTerm]          = useState(25);
  const [isOpen, setIsOpen]           = useState(false);
  const open = alwaysOpen || isOpen;

  const results = useMemo(() => {
    const principal  = price * (1 - downPaymentPct / 100);
    const monthlyRate = interestRate / 100 / 12;
    const n          = termYears * 12;
    if (monthlyRate === 0) return { monthly: principal / n, principal, totalInterest: 0, totalCost: principal, downPayment: price * (downPaymentPct / 100) };
    const monthly    = (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    const totalCost  = monthly * n;
    return { monthly, principal, totalInterest: totalCost - principal, totalCost, downPayment: price * (downPaymentPct / 100) };
  }, [price, downPaymentPct, interestRate, termYears]);

  const fmt = (n: number) => "KSh " + new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n));

  return (
    <div className={cn("border border-[#82000D]/15 bg-[#FFFFFF]", className)}>
      {!alwaysOpen && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#ECE6DD] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Calculator size={16} className="text-[#82000D]" />
            <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-[#1C1714]">Estimate Monthly Repayment</span>
          </div>
          <ChevronDown size={14} className={cn("text-[#1C1714]/30 transition-transform duration-300", isOpen && "rotate-180")} />
        </button>
      )}

      {open && (
        <div className={cn("px-6 lg:px-7 pb-7 space-y-7", alwaysOpen ? "pt-7" : "border-t border-[#82000D]/10")}>
          {/* Monthly payment */}
          <div className="bg-[#FAF8F4] -mx-6 lg:-mx-7 px-6 py-7 text-center">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-[#1C1714]/45 mb-2.5">Est. Monthly Payment</p>
            <p className="text-4xl lg:text-[2.75rem] font-serif text-[#82000D] leading-none">{fmt(results.monthly)}</p>
            <p className="text-[10px] tracking-[0.25em] text-[#1C1714]/40 uppercase mt-2.5">per month</p>
          </div>

          {/* Home price — direct amount input (KSh) */}
          <div className="space-y-2.5 pt-1">
            <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-[#1C1714]/55">Home Price</label>
            <div className="flex items-center border border-[#82000D]/15 bg-[#FAF8F4] focus-within:border-[#82000D] transition-colors">
              <span className="pl-3.5 text-[13px] font-bold text-[#1C1714]/55 shrink-0">KSh</span>
              <input
                type="text"
                inputMode="numeric"
                value={price ? price.toLocaleString("en-US") : ""}
                onChange={(e) => setPrice(Number(e.target.value.replace(/[^0-9]/g, "")) || 0)}
                placeholder="20,000,000"
                className="w-full bg-transparent px-3 py-3 text-[16px] font-semibold text-[#1C1714] focus:outline-none"
              />
            </div>
          </div>

          {/* Down payment slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#1C1714]/55">Down Payment</label>
              <span className="text-[13px] font-bold text-[#82000D]">{downPaymentPct}%</span>
            </div>
            <input type="range" min={5} max={50} step={1} value={downPaymentPct} onChange={e => setDpPct(Number(e.target.value))} className="w-full h-px bg-[#1C1714]/10 appearance-none cursor-pointer accent-[#82000D]" />
          </div>

          {/* Interest rate slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#1C1714]/55">Interest Rate</label>
              <span className="text-[13px] font-bold text-[#82000D]">{interestRate}%</span>
            </div>
            <input type="range" min={1} max={15} step={0.1} value={interestRate} onChange={e => setRate(Number(e.target.value))} className="w-full h-px bg-[#1C1714]/10 appearance-none cursor-pointer accent-[#82000D]" />
          </div>

          {/* Term selector */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#1C1714]/55">Loan Term</label>
            <div className="flex gap-2">
              {[10, 15, 20, 25, 30].map(y => (
                <button
                  key={y}
                  onClick={() => setTerm(y)}
                  className={cn(
                    "flex-1 py-2.5 text-[11px] font-bold tracking-wide uppercase border transition-all",
                    termYears === y
                      ? "bg-[#82000D] text-[#FAF8F4] border-[#82000D]"
                      : "border-[#1C1714]/15 text-[#1C1714]/55 hover:border-[#82000D]/40 hover:text-[#1C1714]"
                  )}
                >
                  {y}yr
                </button>
              ))}
            </div>
          </div>

          {/* Summary grid */}
          <div className="grid grid-cols-2 gap-px bg-[#82000D]/10 border border-[#82000D]/10">
            {[
              { label: "Loan Amount",    value: fmt(results.principal) },
              { label: "Total Interest", value: fmt(results.totalInterest) },
              { label: "Down Payment",   value: fmt(results.downPayment) },
              { label: "Total Cost",     value: fmt(results.totalCost) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#FFFFFF] px-4 py-4">
                <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#1C1714]/45 mb-1.5">{label}</p>
                <p className="text-base font-serif text-[#1C1714]">{value}</p>
              </div>
            ))}
          </div>

          <p className="text-[9px] text-[#1C1714]/40 tracking-[0.15em] uppercase text-center">
            Estimates are for illustrative purposes only.
          </p>
        </div>
      )}
    </div>
  );
}
