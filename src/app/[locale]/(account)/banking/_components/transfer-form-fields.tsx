"use client";

import { ArrowDown, Building2, WalletCards } from "lucide-react";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { AssetBalance, BankingCurrency, LinkedBankAccount, TransferDirection } from "@/lib/banking/types";

interface TransferFormFieldsProps {
  direction: TransferDirection;
  onDirectionChange: (direction: TransferDirection) => void;
  asset: string;
  onAssetChange: (asset: string) => void;
  amount: string;
  onAmountChange: (amount: string) => void;
  payoutCurrency: BankingCurrency;
  onPayoutCurrencyChange: (currency: BankingCurrency) => void;
  bankAccountId: string;
  onBankAccountChange: (accountId: string) => void;
  assets: AssetBalance[];
  bankAccounts: LinkedBankAccount[];
  error: string | null;
}

const transferDirections: TransferDirection[] = [
  "spot_to_funding",
  "funding_to_spot",
  "funding_to_bank",
  "spot_to_bank",
];

export function TransferFormFields({
  direction,
  onDirectionChange,
  asset,
  onAssetChange,
  amount,
  onAmountChange,
  payoutCurrency,
  onPayoutCurrencyChange,
  bankAccountId,
  onBankAccountChange,
  assets,
  bankAccounts,
  error,
}: TransferFormFieldsProps) {
  const t = useTranslations("AccountBanking.transfer");
  const isBankTransfer = direction.endsWith("_to_bank");
  const sourceLocation = direction.startsWith("spot") ? "spot" : "funding";
  const sourceAssets = assets.filter((item) => item.location === sourceLocation);
  const selectedAsset = sourceAssets.find((item) => item.symbol === asset) ?? sourceAssets[0];

  const destinationLabel = useMemo(() => {
    if (isBankTransfer) return t("bank_account");
    return sourceLocation === "spot" ? t("funding_wallet") : t("spot_wallet");
  }, [isBankTransfer, sourceLocation, t]);

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="mb-2 text-xs font-medium text-zinc-400">{t("type_legend")}</legend>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {transferDirections.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onDirectionChange(option)}
              className={`rounded-md border p-2.5 sm:p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD535]/50 ${
                direction === option ? "border-[#FCD535] bg-[#FCD535]/10" : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
              }`}
            >
              <span className="block text-xs sm:text-sm font-semibold text-white">{t(`types.${option}.label`)}</span>
              <span className="mt-1 block text-[11px] sm:text-xs text-zinc-500">{t(`types.${option}.description`)}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-md border border-zinc-800 bg-zinc-900/70 p-3">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-zinc-500">{t("from")}</p>
          <p className="mt-1 flex items-center gap-2 text-sm font-medium text-white">
            <WalletCards className="h-4 w-4 text-zinc-400" aria-hidden />
            {sourceLocation === "spot" ? t("spot_wallet") : t("funding_wallet")}
          </p>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950 text-zinc-400 mx-auto sm:mx-0">
          <ArrowDown className="h-4 w-4 sm:rotate-0" aria-hidden />
        </span>
        <div className="text-left sm:text-right">
          <p className="text-[11px] uppercase tracking-widest text-zinc-500">{t("to")}</p>
          <p className="mt-1 flex items-center gap-2 text-sm font-medium text-white sm:justify-end">
            {isBankTransfer ? (
              <Building2 className="h-4 w-4 text-zinc-400" aria-hidden />
            ) : (
              <WalletCards className="h-4 w-4 text-zinc-400" aria-hidden />
            )}
            {destinationLabel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-zinc-400">{t("asset")}</span>
            <select
              name="asset"
              value={asset}
              onChange={(event) => onAssetChange(event.target.value)}
              className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm font-medium text-white outline-none focus:border-[#FCD535]"
            >
            {sourceAssets.map((item) => (
              <option key={`${item.location}-${item.symbol}`} value={item.symbol}>
                {item.symbol} · {item.amount.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 flex items-center justify-between text-xs font-medium text-zinc-400">
            <span>{t("amount")}</span>
            <button
              type="button"
              onClick={() => onAmountChange(String(selectedAsset?.amount ?? 0))}
              className="font-semibold text-red-600 hover:text-red-500"
            >
              {t("max")}
            </button>
          </span>
          <div className="relative">
            <input
              name="amount"
              value={amount}
              onChange={(event) => onAmountChange(event.target.value)}
              inputMode="decimal"
              placeholder={t("amount_placeholder")}
              className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 pr-16 text-base sm:text-lg font-medium text-white outline-none placeholder:text-zinc-600 focus:border-[#FCD535]"
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-medium text-zinc-400">
              {asset}
            </span>
          </div>
        </label>
      </div>

      {isBankTransfer && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-zinc-400">{t("payout_currency")}</span>
            <select
              name="payoutCurrency"
              value={payoutCurrency}
              onChange={(event) => onPayoutCurrencyChange(event.target.value as BankingCurrency)}
              className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm font-medium text-white outline-none focus:border-[#FCD535]"
            >
              <option value="USD">{t("currencies.USD")}</option>
              <option value="EUR">{t("currencies.EUR")}</option>
              <option value="GBP">{t("currencies.GBP")}</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-zinc-400">{t("bank_account")}</span>
            <select
              name="bankAccountId"
              value={bankAccountId}
              onChange={(event) => onBankAccountChange(event.target.value)}
              className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm font-medium text-white outline-none focus:border-[#FCD535]"
            >
              <option value="">{t("select_account")}</option>
              {bankAccounts
                .filter((account) => account.status === "verified" && account.currency === payoutCurrency)
                .map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.bankName} · {account.maskedNumber}
                  </option>
                ))}
            </select>
          </label>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-zinc-800 pt-4 text-sm">
        <span className="text-zinc-500">{t("available")}</span>
        <span className="font-medium text-white">
          {selectedAsset?.amount.toLocaleString(undefined, { maximumFractionDigits: 6 }) ?? "0"}{" "}
          {selectedAsset?.symbol ?? asset}
        </span>
      </div>
      {error && (
        <div role="alert" className="rounded-md border border-red-600/30 bg-red-600/10 px-3 py-2.5 text-sm text-red-200">
          {error}
        </div>
      )}
    </div>
  );
}
