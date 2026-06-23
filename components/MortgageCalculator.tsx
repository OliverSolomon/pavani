"use client";

import { useState, useMemo } from "react";
import { Calculator, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MortgageCalculatorProps {
  propertyPrice?: number;
  className?: string;
}

export default function MortgageCalculator({ propertyPrice = 0, className }: MortgageCalculatorProps) {
  const [price, setPrice]             = useState(propertyPrice || 500000);
  const [downPaymentPct, setDpPct]    = useState(20);
  const [interestRate, setRate]       = useState(7.5);
  const [termYears, setTerm]          = useState(30);
  const [isOpen, setIsOpen]           = useState(false);

  const results = useMemo(() => {
    const principal  = price * (1 - downPaymentPct / 100);
    const monthlyRate = interestRate / 100 / 12;
    const n          = termYears * 12;
    if (monthlyRate === 0) return { monthly: principal / n, principal, totalInterest: 0, totalCost: principal, downPayment: price * (downPaymentPct / 100) };
    const monthly    = (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    const totalCost  = monthly * n;
    return { monthly, principal, totalInterest: totalCost - principal, totalCost, downPayment: price * (downPaymentPct / 100) };
  }, [price, downPaymentPct, interestRate, termYears]);

  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div className={cn("border border-[#82000D]/15 bg-[#FFFFFF]", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#ECE6DD] transition-colors"
      >
        <div className="flex items-center gap-3">
          <Calculator size={16} className="text-[#82000D]" />
          <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#1C1714]">Mortgage Calculator</span>
        </div>
        <ChevronDown size={14} className={cn("text-[#1C1714]/30 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="px-6 pb-6 space-y-6 border-t border-[#82000D]/10">
          {/* Monthly payment */}
          <div className="bg-[#FAF8F4] -mx-6 px-6 py-6 text-center">
            <p className="text-[8px] font-bold tracking-[0.4em] uppercase text-[#1C1714]/30 mb-2">Est. Monthly Payment</p>
            <p className="text-3xl font-serif text-[#82000D]">{fmt(results.monthly)}</p>
            <p className="text-[8px] tracking-widest text-[#1C1714]/20 uppercase mt-1">/ month</p>
          </div>

          {/* Price slider */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between">
              <label className="text-[8px] font-bold tracking-[0.3em] uppercase text-[#1C1714]/35">Home Price</label>
              <span className="text-[9px] font-bold text-[#1C1714]/85">{fmt(price)}</span>
            </div>
            <input type="range" min={50000} max={10000000} step={10000} value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full h-px bg-[#1C1714]/10 appearance-none cursor-pointer accent-[#82000D]" />
            <div className="flex justify-between text-[7px] text-[#1C1714]/20 tracking-widest"><span>$50K</span><span>$10M</span></div>
          </div>

          {/* Down payment slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[8px] font-bold tracking-[0.3em] uppercase text-[#1C1714]/35">Down Payment</label>
              <span className="text-[9px] font-bold text-[#1C1714]/85">{downPaymentPct}%</span>
            </div>
            <input type="range" min={5} max={50} step={1} value={downPaymentPct} onChange={e => setDpPct(Number(e.target.value))} className="w-full h-px bg-[#1C1714]/10 appearance-none cursor-pointer accent-[#82000D]" />
          </div>

          {/* Interest rate slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[8px] font-bold tracking-[0.3em] uppercase text-[#1C1714]/35">Interest Rate</label>
              <span className="text-[9px] font-bold text-[#1C1714]/85">{interestRate}%</span>
            </div>
            <input type="range" min={1} max={15} step={0.1} value={interestRate} onChange={e => setRate(Number(e.target.value))} className="w-full h-px bg-[#1C1714]/10 appearance-none cursor-pointer accent-[#82000D]" />
          </div>

          {/* Term selector */}
          <div className="space-y-2">
            <label className="text-[8px] font-bold tracking-[0.3em] uppercase text-[#1C1714]/35">Loan Term</label>
            <div className="flex gap-1.5">
              {[10, 15, 20, 25, 30].map(y => (
                <button
                  key={y}
                  onClick={() => setTerm(y)}
                  className={cn(
                    "flex-1 py-2 text-[8px] font-bold tracking-widest uppercase border transition-all",
                    termYears === y
                      ? "bg-[#82000D] text-[#FAF8F4] border-[#82000D]"
                      : "border-[#1C1714]/10 text-[#1C1714]/35 hover:border-[#82000D]/30"
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
                <p className="text-[7px] font-bold tracking-[0.3em] uppercase text-[#1C1714]/30 mb-1">{label}</p>
                <p className="text-sm font-serif text-[#1C1714]/90">{value}</p>
              </div>
            ))}
          </div>

          <p className="text-[7px] text-[#1C1714]/20 tracking-wider uppercase text-center">
            Estimates are for illustrative purposes only.
          </p>
        </div>
      )}
    </div>
  );
}
