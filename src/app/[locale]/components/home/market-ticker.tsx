"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowDownRight, ArrowUpRight, Loader2 } from "lucide-react";

interface MarketTickerEntry {
  symbol: string;
  name: string;
  priceUsd: number;
  change24h: number;
  logo: string;
}

interface MarketTickerResponse {
  updatedAt: string;
  entries: MarketTickerEntry[];
}

export function MarketTicker() {
  const t = useTranslations("Home.MarketTicker");
  const [data, setData] = useState<MarketTickerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch("/api/markets/ticker", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const result = (await response.json()) as MarketTickerResponse;
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        console.error("Failed to load market ticker", err);
        if (isMounted) {
          setError(t("error"));
        }
      }
    }

    load();

    const interval = setInterval(load, 60_000);
    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(interval);
    };
  }, [t]);

  const tickerItems = useMemo(() => {
    if (!data?.entries) return [];

    return data.entries
      .filter((entry) => Number.isFinite(entry.priceUsd))
      .map((entry) => {
        const change = Number(entry.change24h ?? 0);
        const isPositive = change >= 0;

        return {
          ...entry,
          direction: isPositive ? "up" : "down",
          formattedPrice: `$${entry.priceUsd.toLocaleString(undefined, {
            minimumFractionDigits: entry.priceUsd < 1 ? 4 : 2,
            maximumFractionDigits: entry.priceUsd < 1 ? 6 : 2,
          })}`,
          formattedChange: `${isPositive ? "+" : ""}${change.toFixed(2)}%`,
        };
      });
  }, [data]);

  if (error) {
    return (
      <div className="bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-2xl p-4">
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  if (!tickerItems.length) {
    return (
      <div className="bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-2xl p-6 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-zinc-400 mr-3" />
        <span className="text-sm font-medium text-zinc-400">{t("loading")}</span>
      </div>
    );
  }

  const repeatedItems = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <section className="relative  to-zinc-900 px-4">
     

      <div className="relative container mx-auto overflow-hidden">
        <div className="ticker-marquee flex md:gap-4 gap-2 will-change-transform">
          {repeatedItems.map((entry, index) => (
            <div
              key={`${entry.symbol}-${index}`}
              className="flex min-w-[180px] items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 shadow-sm backdrop-blur"
            >
              {entry.logo ? (
                <Image
                  src={entry.logo}
                  alt={entry.symbol}
                  width={28}
                  height={28}
                  className="rounded-full"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-white">
                  {entry.symbol[0]}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">{entry.symbol}</p>
                <p className="truncate text-[12px] font-semibold text-white">{entry.formattedPrice}</p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                {entry.direction === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-400" />
                )}
                <span
                  className={`text-[8px] font-semibold ${entry.direction === "up" ? "text-emerald-400" : "text-red-400"}`}
                >
                  {entry.formattedChange}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
