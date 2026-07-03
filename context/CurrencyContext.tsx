"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Currency = "USD" | "KSH" | "EUR" | "GBP";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amount: number | string, baseCurrency?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

/* Static fallback rates relative to USD (used until live rates load, or if the API fails). */
const FALLBACK_RATES: Record<Currency, number> = {
  USD: 1,
  KSH: 130,
  EUR: 0.92,
  GBP: 0.79,
};

const SYMBOLS: Record<Currency, string> = {
  USD: "$",
  KSH: "KSh",
  EUR: "€",
  GBP: "£",
};

/* Normalise whatever currency code is stored in Sanity to our internal codes. */
function normaliseCode(code?: string): Currency {
  const c = (code || "USD").trim().toUpperCase();
  if (c === "KES" || c === "KSH" || c === "KSHS") return "KSH";
  if (c === "EUR") return "EUR";
  if (c === "GBP") return "GBP";
  return "USD";
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [rates, setRates] = useState<Record<Currency, number>>(FALLBACK_RATES);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("pavani_currency") as Currency;
    if (savedCurrency && ["USD", "KSH", "EUR", "GBP"].includes(savedCurrency)) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  // Pull live FX rates (cached server-side for 12h via /api/rates).
  useEffect(() => {
    let active = true;
    fetch("/api/rates")
      .then((r) => r.json())
      .then((data) => {
        if (active && data?.rates) {
          setRates({
            USD: 1,
            KSH: Number(data.rates.KSH) || FALLBACK_RATES.KSH,
            EUR: Number(data.rates.EUR) || FALLBACK_RATES.EUR,
            GBP: Number(data.rates.GBP) || FALLBACK_RATES.GBP,
          });
        }
      })
      .catch(() => {/* keep fallback rates */});
    return () => { active = false; };
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("pavani_currency", newCurrency);
  };

  const formatPrice = (amount: number | string, baseCurrency: string = "USD") => {
    const numericAmount =
      typeof amount === "string"
        ? parseFloat(amount.replace(/[^0-9.]/g, ""))
        : amount;

    if (isNaN(numericAmount)) return "Price on Request";

    // Convert the listed price (in its base currency) to USD, then to the active currency.
    const base = normaliseCode(baseCurrency);
    const amountInUSD = numericAmount / (rates[base] || 1);
    const converted = amountInUSD * (rates[currency] || 1);

    return (
      SYMBOLS[currency] +
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(converted)
    );
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
