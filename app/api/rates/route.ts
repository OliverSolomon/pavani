import { NextResponse } from "next/server";

/* Live FX rates relative to USD. Source: open.er-api.com (free, no key, includes KES).
   Cached for 12h via Next's data cache; falls back to sane static rates on failure. */
const FALLBACK = { USD: 1, KSH: 130, EUR: 0.92, GBP: 0.79 };

export const revalidate = 43200; // 12 hours

export async function GET() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 43200 },
    });
    if (!res.ok) throw new Error(`rates HTTP ${res.status}`);
    const data = await res.json();
    const r = data?.rates || {};
    const rates = {
      USD: 1,
      KSH: typeof r.KES === "number" ? r.KES : FALLBACK.KSH,
      EUR: typeof r.EUR === "number" ? r.EUR : FALLBACK.EUR,
      GBP: typeof r.GBP === "number" ? r.GBP : FALLBACK.GBP,
    };
    return NextResponse.json({ rates, updated: data?.time_last_update_utc ?? null });
  } catch (err) {
    console.error("[rates] using fallback:", err);
    return NextResponse.json({ rates: FALLBACK, updated: null, fallback: true });
  }
}
