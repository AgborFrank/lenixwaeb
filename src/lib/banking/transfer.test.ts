import assert from "node:assert/strict";
import test from "node:test";
import { bankingOverview } from "./sample-data";
import { applyTransferToOverview, calculateTransferQuote, validateAvailableBalance, validateTransferRequest } from "./transfer";

const assets = {
  USDC: { symbol: "USDC", priceUsd: 1 },
  ETH: { symbol: "ETH", priceUsd: 3950.25 },
};

test("internal transfers are instant and fee free", () => {
  const quote = calculateTransferQuote(
    {
      direction: "spot_to_funding",
      asset: "USDC",
      amount: 1000,
      payoutCurrency: "USD",
    },
    assets
  );

  assert.equal(quote.grossUsd, 1000);
  assert.equal(quote.platformFeeUsd, 0);
  assert.equal(quote.bankFeeUsd, 0);
  assert.equal(quote.recipientAmount, 1000);
  assert.equal(quote.estimatedArrival, "Instant");
});

test("spot to bank quotes include conversion and bank fees", () => {
  const quote = calculateTransferQuote(
    {
      direction: "spot_to_bank",
      asset: "ETH",
      amount: 2,
      payoutCurrency: "USD",
      bankAccountId: "bank_us_4821",
    },
    assets
  );

  assert.equal(quote.grossUsd, 7900.5);
  assert.equal(quote.platformFeeUsd, 27.65);
  assert.equal(quote.bankFeeUsd, 15);
  assert.equal(quote.recipientAmount, 7857.85);
  assert.equal(quote.estimatedArrival, "1–2 business days");
});

test("transfer validation rejects invalid amounts", () => {
  assert.deepEqual(
    validateTransferRequest({
      direction: "funding_to_spot",
      asset: "USDC",
      amount: 0,
      payoutCurrency: "USD",
    }),
    { valid: false, error: "Enter an amount greater than zero." }
  );
});

test("bank transfers require a destination account", () => {
  assert.deepEqual(
    validateTransferRequest({
      direction: "funding_to_bank",
      asset: "USDC",
      amount: 500,
      payoutCurrency: "USD",
    }),
    { valid: false, error: "Select a verified bank account." }
  );
});

test("transfer validation rejects amounts above the source balance", () => {
  assert.deepEqual(
    validateAvailableBalance(
      {
        direction: "spot_to_funding",
        asset: "USDC",
        amount: 20000,
        payoutCurrency: "USD",
      },
      bankingOverview.assets
    ),
    { valid: false, error: "Amount exceeds the available Spot wallet balance." }
  );
});

test("completed internal transfers move value from spot to funding", () => {
  const transfer = {
    ...bankingOverview.transactions[1],
    id: "txn_test",
    direction: "spot_to_funding" as const,
    asset: "USDC",
    assetAmount: 1000,
    fiatAmount: 1000,
  };

  const updated = applyTransferToOverview(bankingOverview, transfer);

  assert.equal(updated.spotBalanceUsd, bankingOverview.spotBalanceUsd - 1000);
  assert.equal(updated.fundingBalanceUsd, bankingOverview.fundingBalanceUsd + 1000);
  assert.equal(updated.transactions[0].id, "txn_test");
});

test("internal transfers create the destination holding when it does not exist", () => {
  const transfer = {
    ...bankingOverview.transactions[1],
    id: "txn_new_holding",
    direction: "funding_to_spot" as const,
    asset: "USDT",
    assetAmount: 500,
    fiatAmount: 500,
  };

  const updated = applyTransferToOverview(bankingOverview, transfer);
  const destination = updated.assets.find((asset) => asset.location === "spot" && asset.symbol === "USDT");

  assert.equal(destination?.amount, 500);
  assert.equal(destination?.usdValue, 500);
});
