"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { UserSettingsRow, PreferredCurrency } from "@/app/(account)/settings/actions";

type SettingsContextValue = {
  settings: UserSettingsRow | null;
  /** Format a number as currency using user's preferred_currency */
  formatCurrency: (value: number, options?: { minFractionDigits?: number; maxFractionDigits?: number }) => string;
  currency: PreferredCurrency;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

const CURRENCY_SYMBOLS: Record<PreferredCurrency, string> = {
  usd: "$",
  eur: "€",
  gbp: "£",
  jpy: "¥",
};

export function formatCurrencyWith(
  value: number,
  currency: PreferredCurrency,
  options?: { minFractionDigits?: number; maxFractionDigits?: number }
): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const locale = currency === "jpy" ? "ja-JP" : currency === "eur" ? "de-DE" : currency === "gbp" ? "en-GB" : "en-US";
  const code = currency.toUpperCase();
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    minimumFractionDigits: options?.minFractionDigits ?? 2,
    maximumFractionDigits: options?.maxFractionDigits ?? 2,
  }).format(value);
  return formatted;
}

export function SettingsProvider({
  children,
  initialSettings,
}: {
  children: ReactNode;
  initialSettings: UserSettingsRow | null;
}) {
  const value = useMemo<SettingsContextValue>(() => {
    const currency = initialSettings?.preferred_currency ?? "usd";
    return {
      settings: initialSettings,
      currency,
      formatCurrency: (val, opts) => formatCurrencyWith(val, currency, opts),
    };
  }, [initialSettings]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    return {
      settings: null,
      currency: "usd",
      formatCurrency: (val, opts) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: opts?.minFractionDigits ?? 2,
          maximumFractionDigits: opts?.maxFractionDigits ?? 2,
        }).format(val),
    };
  }
  return ctx;
}
