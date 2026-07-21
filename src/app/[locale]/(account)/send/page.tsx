"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EllipsisVertical, LockKeyhole, Search } from "lucide-react";
import { formatUnits } from "ethers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import { useWallet } from "../lenix-wallet/_hooks/use-wallet";
import { SendForm, type SendFormToken } from "./_components/send-form";
import { useTranslations } from "next-intl";

const FALLBACK_VECTOR = "/assets/vectors/coin.svg";
const CHAIN_LABEL: Record<number, { name: string; short: string }> = {
  0: { name: "Bitcoin", short: "BTC" },
  1: { name: "Ethereum", short: "ETH" },
  56: { name: "BNB Smart Chain", short: "BSC" },
  137: { name: "Polygon", short: "POLY" },
};

function toFixed(value: number, digits = 4) {
  return Number.isFinite(value) ? value.toFixed(digits) : "0.0000";
}

export default function SendPage() {
  const t = useTranslations("AccountLenixWallet.send_page");
  const { walletState, portfolio, walletData } = useWallet();
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [hideDust, setHideDust] = useState(false);

  const normalizedTokens = useMemo(() => {
    if (!portfolio?.tokens)
      return [] as Array<{
        id: string;
        symbol: string;
        name: string;
        chainId: number;
        balance: number;
        usdValue: number;
        usdYesterday: number;
        logoUrl?: string | null;
        native: boolean;
        rawBalance: string;
        isFrozen: boolean;
        freezeReason: string | null;
        freezeFeeAmount: string | null;
        sendToken: SendFormToken;
      }>;

    return portfolio.tokens.map((token: any) => {
      const decimals = Number(token.contract_decimals ?? 18);
      const rawBalance = BigInt(token.balance ?? "0");
      const humanBalance = Number(formatUnits(rawBalance, decimals));
      const usdValue = Number(
        token.quote ?? humanBalance * (token.quote_rate ?? 0),
      );
      const usdYesterday = Number(token.quote_24h ?? token.quote ?? usdValue);
      const symbol = token.contract_ticker_symbol || token.symbol || "—";
      const chainId = Number(token.chainId ?? token.chain_id ?? 0);
      const id = `${token.contract_address ?? symbol}-${chainId}-${token.native_token ? "native" : "erc20"}`;
      const name =
        token.contract_name ||
        token.name ||
        (token.native_token
          ? `${CHAIN_LABEL[chainId]?.name ?? "Native"} (${symbol})`
          : symbol);

      const sendToken: SendFormToken = {
        id,
        name,
        symbol,
        chainId,
        decimals,
        balance: token.balance ?? "0",
        spendableBalance: token.spendableBalance ?? undefined,
        priceUsd: token.quote_rate ?? undefined,
        quote: usdValue,
        logoUrl: token.logo_url,
        native: Boolean(token.native_token),
        contractAddress: token.native_token
          ? undefined
          : token.contract_address,
        isFrozen: Boolean(token.isFrozen),
        freezeReason: token.freezeReason ?? null,
        freezeFeeAmount: token.freezeFeeAmount ?? null,
      };

      return {
        id,
        symbol,
        name,
        chainId,
        balance: humanBalance,
        usdValue,
        usdYesterday,
        logoUrl: token.logo_url,
        native: Boolean(token.native_token),
        rawBalance: token.balance ?? "0",
        isFrozen: Boolean(token.isFrozen),
        freezeReason: token.freezeReason ?? null,
        freezeFeeAmount: token.freezeFeeAmount ?? null,
        sendToken,
      };
    });
  }, [portfolio?.tokens]);

  const totalUsd = useMemo(() => {
    if (typeof portfolio?.totalBalanceUsd === "number")
      return portfolio.totalBalanceUsd;
    return normalizedTokens.reduce(
      (sum, token) => sum + (token.usdValue || 0),
      0,
    );
  }, [portfolio?.totalBalanceUsd, normalizedTokens]);

  const totalUsdYesterday = useMemo(() => {
    return normalizedTokens.reduce(
      (sum, token) => sum + (token.usdYesterday || 0),
      0,
    );
  }, [normalizedTokens]);

  const pnlUsd = totalUsd - totalUsdYesterday;
  const pnlPct = totalUsdYesterday > 0 ? (pnlUsd / totalUsdYesterday) * 100 : 0;

  const filteredTokens = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return normalizedTokens.filter((token) => {
      const matchesDust = !hideDust || (token.usdValue ?? 0) >= 1;
      const matchesSearch =
        !term ||
        token.symbol.toLowerCase().includes(term) ||
        token.name.toLowerCase().includes(term) ||
        (CHAIN_LABEL[token.chainId]?.name.toLowerCase().includes(term) ??
          false);
      return matchesDust && matchesSearch;
    });
  }, [normalizedTokens, searchTerm, hideDust]);

  const sendableTokens = useMemo(
    () => normalizedTokens.map((token) => token.sendToken),
    [normalizedTokens],
  );
  const primaryHolding = normalizedTokens[0];
  const withdrawDisabled =
    walletState !== "unlocked" || sendableTokens.length === 0;

  const handleWithdraw = (tokenId?: string) => {
    if (tokenId) setSelectedTokenId(tokenId);
    setIsWithdrawOpen(true);
  };

  if (walletState === "loading") {
    return (
      <div className="mx-auto w-full max-w-6xl pb-20">
        <div className="mt-4 space-y-4">
          <div className="h-40 animate-pulse rounded-xl bg-zinc-900/60" />
          <div className="h-72 animate-pulse rounded-xl bg-zinc-900/60" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl pb-20">
      {walletState !== "unlocked" && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-yellow-400/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <div>
            <p className="font-medium">{t("unlock_message")}</p>
            <p className="mt-1 text-xs text-yellow-100/80">
              {walletState === "locked" ? (
                <>
                  {t("unlock_locked_prefix")}{" "}
                  <Link
                    href="../lenix-wallet"
                    className="underline decoration-yellow-300 hover:text-yellow-200"
                  >
                    {t("wallet_page")}
                  </Link>{" "}
                  {t("unlock_locked_suffix")}
                </>
              ) : (
                <>
                  {t("unlock_no_wallet_prefix")}{" "}
                  <Link
                    href="../lenix-wallet"
                    className="underline decoration-yellow-300 hover:text-yellow-200"
                  >
                    {t("wallet_dashboard")}
                  </Link>{" "}
                  {t("unlock_no_wallet_suffix")}
                </>
              )}
            </p>
          </div>
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900/90">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-300">
              {t("estimated_total_value")}
              <span className="text-xs text-zinc-500" aria-hidden>
                {primaryHolding
                  ? (CHAIN_LABEL[primaryHolding.chainId]?.short ?? "EVM")
                  : ""}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-semibold tabular-nums text-white">
                {formatCurrency(totalUsd)}
              </span>
              {primaryHolding && (
                <span className="text-xs font-medium text-zinc-400">
                  {toFixed(primaryHolding.balance)} {primaryHolding.symbol}
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              {t("wallet_label")}:{" "}
              {walletData?.address
                ? `${walletData.address.slice(0, 6)}…${walletData.address.slice(-4)}`
                : "—"}
            </p>
            <p
              className={`mt-1 text-xs ${pnlUsd >= 0 ? "text-emerald-400" : "text-red-400"}`}
            >
              {t("pnl_today")} {pnlUsd >= 0 ? "+" : ""}
              {formatCurrency(pnlUsd)} ({pnlPct.toFixed(2)}%)
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="h-8 rounded-md bg-white/10 px-3 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/15"
            >
              {t("deposit")}
            </button>
            <button
              type="button"
              onClick={() => handleWithdraw()}
              disabled={withdrawDisabled}
              className="h-8 rounded-md bg-yellow-400 px-3 text-xs font-semibold text-black transition-colors hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-zinc-500"
            >
              {t("withdraw")}
            </button>
            <button
              type="button"
              className="h-8 rounded-md bg-white/10 px-3 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/15"
            >
              {t("transfer")}
            </button>
            <button
              type="button"
              aria-label={t("more_funding_actions")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <EllipsisVertical className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-zinc-900/90 sm:mt-6">
        <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h1 className="text-base font-semibold text-white">
            {t("funding_title")}
          </h1>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4 sm:text-xs sm:text-zinc-400">
            <div className="relative w-full sm:w-64">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                aria-hidden
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t("search_placeholder")}
                className="h-9 w-full rounded-md border border-white/10 bg-white/5 pl-9 pr-3 text-xs text-white placeholder:text-zinc-500 focus:border-yellow-400/60 focus:outline-none focus:ring-1 focus:ring-yellow-400/40"
              />
            </div>
            <button
              type="button"
              className="hidden items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-white sm:inline-flex"
            >
              <span className="text-yellow-400">◉</span>
              {t("small_asset_exchange")}
            </button>
            <label className="flex items-center gap-2 text-xs text-zinc-400">
              <input
                type="checkbox"
                checked={hideDust}
                onChange={(event) => setHideDust(event.target.checked)}
                className="h-3.5 w-3.5 rounded border-zinc-600 bg-transparent accent-yellow-400"
              />
              {t("hide_dust")}
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="border-y border-white/6 text-[11px] font-medium text-zinc-500">
              <tr>
                <th className="px-5 py-3 sm:px-6">{t("asset")}</th>
                <th className="px-4 py-3 text-right">{t("amount")}</th>
                <th className="px-4 py-3 text-right">{t("available")}</th>
                <th className="px-4 py-3 text-right">{t("frozen")}</th>
                <th className="px-5 py-3 text-right sm:px-6">{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTokens.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-zinc-400">
                      <Image
                        src="/assets/vectors/start-deposit-no.svg"
                        alt={t("no_assets")}
                        width={120}
                        height={120}
                        className="opacity-80"
                      />
                      <p className="text-sm">{t("no_assets_match")}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTokens.map((token) => {
                  const chainDescriptor =
                    CHAIN_LABEL[token.chainId]?.name ?? "EVM Chain";
                  const valueFormatted = formatCurrency(token.usdValue || 0);
                  const balanceFormatted = toFixed(token.balance, 6);
                  const withdrawReady =
                    token.balance > 0 && !withdrawDisabled && !token.isFrozen;

                  return (
                    <tr
                      key={token.id}
                      className="transition-colors hover:bg-white/3"
                    >
                      <td className="px-5 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={token.logoUrl || FALLBACK_VECTOR}
                            alt=""
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                FALLBACK_VECTOR;
                            }}
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-medium text-zinc-100">
                                {token.symbol}
                              </p>
                              {token.isFrozen && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-400">
                                  <LockKeyhole
                                    className="h-2.5 w-2.5"
                                    aria-hidden
                                  />
                                  {t("frozen")}
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-zinc-500">
                              {token.isFrozen && token.freezeFeeAmount
                                ? t("unfreeze_deposit", {
                                    amount: token.freezeFeeAmount,
                                  })
                                : `${token.name} · ${chainDescriptor}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm tabular-nums text-zinc-200">
                          {balanceFormatted}
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {valueFormatted}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-right text-sm tabular-nums text-zinc-200">
                        {balanceFormatted}
                      </td>
                      <td className="px-4 py-4 text-right text-sm tabular-nums text-zinc-200">
                        0.00
                      </td>
                      <td className="px-5 py-4 text-right sm:px-6">
                        <div className="inline-flex items-center gap-3 text-xs">
                          <button
                            type="button"
                            onClick={() => handleWithdraw(token.id)}
                            disabled={!withdrawReady}
                            className="font-medium text-yellow-400 transition-colors hover:text-yellow-300 disabled:cursor-not-allowed disabled:text-zinc-600"
                          >
                            {t("withdraw")}
                          </button>
                          <button
                            type="button"
                            aria-label={t("more_actions_for", {
                              symbol: token.symbol,
                            })}
                            className="text-zinc-500 transition-colors hover:text-white"
                          >
                            <EllipsisVertical className="h-4 w-4" aria-hidden />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto border-white/10 bg-zinc-900 p-0 text-white">
          <DialogHeader className="px-5 pt-5 sm:px-6 sm:pt-6">
            <DialogTitle className="text-lg font-semibold text-white">
              {t("withdraw_modal.title")}
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-400">
              {t("withdraw_modal.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="px-1 pb-1">
            <SendForm
              tokens={sendableTokens}
              initialTokenId={selectedTokenId}
              onSuccess={() => setIsWithdrawOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
