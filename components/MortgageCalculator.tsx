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
    <div className={cn("border border-[#C6A75E]/15 bg-[#1E0D02]", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#2A1508] transition-colors"
      >
        <div className="flex items-center gap-3">
          <Calculator size={16} className="text-[#C6A75E]" />
          <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#E8DCBF]">Mortgage Calculator</span>
        </div>
        <ChevronDown size={14} className={cn("text-[#E8DCBF]/30 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="px-6 pb-6 space-y-6 border-t border-[#C6A75E]/10">
          {/* Monthly payment */}
          <div className="bg-[#0D0501] -mx-6 px-6 py-6 text-center">
            <p className="text-[8px] font-bold tracking-[0.4em] uppercase text-[#E8DCBF]/30 mb-2">Est. Monthly Payment</p>
            <p className="text-3xl font-serif text-[#C6A75E]">{fmt(results.monthly)}</p>
            <p className="text-[8px] tracking-widest text-[#E8DCBF]/20 uppercase mt-1">/ month</p>
          </div>

          {/* Price slider */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between">
              <label className="text-[8px] font-bold tracking-[0.3em] uppercase text-[#E8DCBF]/35">Home Price</label>
              <span className="text-[9px] font-bold text-[#E8DCBF]/70">{fmt(price)}</span>
            </div>
            <input type="range" min={50000} max={10000000} step={10000} value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full h-px bg-[#E8DCBF]/10 appearance-none cursor-pointer accent-[#C6A75E]" />
            <div className="flex justify-between text-[7px] text-[#E8DCBF]/20 tracking-widest"><span>$50K</span><span>$10M</span></div>
          </div>

          {/* Down payment slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[8px] font-bold tracking-[0.3em] uppercase text-[#E8DCBF]/35">Down Payment</label>
              <span className="text-[9px] font-bold text-[#E8DCBF]/70">{downPaymentPct}%</span>
            </div>
            <input type="range" min={5} max={50} step={1} value={downPaymentPct} onChange={e => setDpPct(Number(e.target.value))} className="w-full h-px bg-[#E8DCBF]/10 appearance-none cursor-pointer accent-[#C6A75E]" />
          </div>

          {/* Interest rate slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[8px] font-bold tracking-[0.3em] uppercase text-[#E8DCBF]/35">Interest Rate</label>
              <span className="text-[9px] font-bold text-[#E8DCBF]/70">{interestRate}%</span>
            </div>
            <input type="range" min={1} max={15} step={0.1} value={interestRate} onChange={e => setRate(Number(e.target.value))} className="w-full h-px bg-[#E8DCBF]/10 appearance-none cursor-pointer accent-[#C6A75E]" />
          </div>

          {/* Term selector */}
          <div className="space-y-2">
            <label className="text-[8px] font-bold tracking-[0.3em] uppercase text-[#E8DCBF]/35">Loan Term</label>
            <div className="flex gap-1.5">
              {[10, 15, 20, 25, 30].map(y => (
                <button
                  key={y}
                  onClick={() => setTerm(y)}
                  className={cn(
                    "flex-1 py-2 text-[8px] font-bold tracking-widest uppercase border transition-all",
                    termYears === y
                      ? "bg-[#C6A75E] text-[#0D0501] border-[#C6A75E]"
                      : "border-[#E8DCBF]/10 text-[#E8DCBF]/35 hover:border-[#C6A75E]/30"
                  )}
                >
                  {y}yr
                </button>
              ))}
            </div>
          </div>

          {/* Summary grid */}
          <div className="grid grid-cols-2 gap-px bg-[#C6A75E]/10 border border-[#C6A75E]/10">
            {[
              { label: "Loan Amount",    value: fmt(results.principal) },
              { label: "Total Interest", value: fmt(results.totalInterest) },
              { label: "Down Payment",   value: fmt(results.downPayment) },
              { label: "Total Cost",     value: fmt(results.totalCost) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#1E0D02] px-4 py-4">
                <p className="text-[7px] font-bold tracking-[0.3em] uppercase text-[#E8DCBF]/30 mb-1">{label}</p>
                <p className="text-sm font-serif text-[#E8DCBF]/80">{value}</p>
              </div>
            ))}
          </div>

          <p className="text-[7px] text-[#E8DCBF]/20 tracking-wider uppercase text-center">
            Estimates are for illustrative purposes only.
          </p>
        </div>
      )}
    </div>
  );
}
