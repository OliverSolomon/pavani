"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Currency = "USD" | "KSH" | "EUR" | "GBP";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amount: number | string, baseCurrency?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const EXCHANGE_RATES: Record<Currency, number> = {
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

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");

  useEffect(() => {
    const savedCurrency = localStorage.getItem("pavani_currency") as Currency;
    if (savedCurrency && ["USD", "KSH", "EUR", "GBP"].includes(savedCurrency)) {
      setCurrencyState(savedCurrency);
    }
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

    let amountInUSD = numericAmount;
    if (baseCurrency === "KSH") amountInUSD = numericAmount / EXCHANGE_RATES.KSH;
    if (baseCurrency === "EUR") amountInUSD = numericAmount / EXCHANGE_RATES.EUR;
    if (baseCurrency === "GBP") amountInUSD = numericAmount / EXCHANGE_RATES.GBP;

    const converted = amountInUSD * EXCHANGE_RATES[currency];

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
