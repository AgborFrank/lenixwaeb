import type { AssetBalance, AssetPriceMap, BankingCurrency, BankingOverview, TransferQuote, TransferRecord, TransferRequest } from "./types";

const PAYOUT_RATES: Record<BankingCurrency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
};

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function validateTransferRequest(request: TransferRequest) {
  if (!Number.isFinite(request.amount) || request.amount <= 0) {
    return { valid: false as const, error: "Enter an amount greater than zero." };
  }

  if (!request.asset.trim()) {
    return { valid: false as const, error: "Select an asset." };
  }

  if (request.direction.endsWith("_to_bank") && !request.bankAccountId) {
    return { valid: false as const, error: "Select a verified bank account." };
  }

  return { valid: true as const };
}

export function validateAvailableBalance(request: TransferRequest, assets: AssetBalance[]) {
  const sourceLocation = request.direction.startsWith("spot") ? "spot" : "funding";
  const sourceAsset = assets.find((item) => item.location === sourceLocation && item.symbol === request.asset);
  if (!sourceAsset || request.amount > sourceAsset.amount) {
    const label = sourceLocation === "spot" ? "Spot" : "Funding";
    return { valid: false as const, error: `Amount exceeds the available ${label} wallet balance.` };
  }
  return { valid: true as const };
}

export function applyTransferToOverview(overview: BankingOverview, transfer: TransferRecord): BankingOverview {
  const sourceLocation = transfer.direction.startsWith("spot") ? "spot" : "funding";
  const destinationLocation = transfer.direction === "spot_to_funding" ? "funding" : transfer.direction === "funding_to_spot" ? "spot" : null;
  const sourceAsset = overview.assets.find((item) => item.location === sourceLocation && item.symbol === transfer.asset);
  const transferUsd = roundCurrency(transfer.assetAmount * (sourceAsset?.priceUsd ?? 0));
  const assets = overview.assets.map((item) => {
    if (item.symbol !== transfer.asset) return item;
    if (item.location === sourceLocation) {
      const amount = Math.max(0, item.amount - transfer.assetAmount);
      return { ...item, amount, usdValue: roundCurrency(amount * item.priceUsd) };
    }
    if (destinationLocation && item.location === destinationLocation) {
      const amount = item.amount + transfer.assetAmount;
      return { ...item, amount, usdValue: roundCurrency(amount * item.priceUsd) };
    }
    return item;
  });
  const hasDestinationAsset = destinationLocation ? assets.some((item) => item.location === destinationLocation && item.symbol === transfer.asset) : true;
  if (destinationLocation && !hasDestinationAsset && sourceAsset) {
    assets.push({ ...sourceAsset, location: destinationLocation, amount: transfer.assetAmount, usdValue: transferUsd });
  }

  let spotBalanceUsd = overview.spotBalanceUsd;
  let fundingBalanceUsd = overview.fundingBalanceUsd;
  let pendingSettlementUsd = overview.pendingSettlementUsd;

  if (sourceLocation === "spot") spotBalanceUsd = roundCurrency(spotBalanceUsd - transferUsd);
  if (sourceLocation === "funding") fundingBalanceUsd = roundCurrency(fundingBalanceUsd - transferUsd);
  if (destinationLocation === "spot") spotBalanceUsd = roundCurrency(spotBalanceUsd + transferUsd);
  if (destinationLocation === "funding") fundingBalanceUsd = roundCurrency(fundingBalanceUsd + transferUsd);
  if (transfer.direction.endsWith("_to_bank")) pendingSettlementUsd = roundCurrency(pendingSettlementUsd + transfer.fiatAmount);

  return {
    ...overview,
    spotBalanceUsd,
    fundingBalanceUsd,
    pendingSettlementUsd,
    assets,
    transactions: [transfer, ...overview.transactions],
  };
}

export function calculateTransferQuote(request: TransferRequest, assets: AssetPriceMap): TransferQuote {
  const asset = assets[request.asset];
  if (!asset) {
    throw new Error("Selected asset is unavailable.");
  }

  const isBankTransfer = request.direction.endsWith("_to_bank");
  const grossUsd = roundCurrency(request.amount * asset.priceUsd);
  const platformFeeUsd = isBankTransfer ? roundCurrency(grossUsd * 0.0035) : 0;
  const bankFeeUsd = isBankTransfer ? 15 : 0;
  const totalFeeUsd = roundCurrency(platformFeeUsd + bankFeeUsd);
  const exchangeRate = PAYOUT_RATES[request.payoutCurrency];
  const recipientAmount = roundCurrency((grossUsd - totalFeeUsd) * exchangeRate);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  return {
    id: `quote_${crypto.randomUUID()}`,
    direction: request.direction,
    asset: request.asset,
    assetAmount: request.amount,
    assetPriceUsd: asset.priceUsd,
    grossUsd,
    exchangeRate,
    payoutCurrency: request.payoutCurrency,
    platformFeeUsd,
    bankFeeUsd,
    totalFeeUsd,
    recipientAmount,
    estimatedArrival: isBankTransfer ? "1–2 business days" : "Instant",
    expiresAt,
  };
}
