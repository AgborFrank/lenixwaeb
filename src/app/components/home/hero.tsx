"use client";

import { X, Send, FileText, Star, CreditCard } from "lucide-react";
import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useChainId,
} from "wagmi";
import { parseEther, parseUnits, formatUnits } from "viem";
import { LNX_SALE_ABI } from "@/lib/abis/LNXSale";
import { LNX_SALE_ADDRESS, USDT_ADDRESS_BY_CHAIN } from "@/config";
import { ERC20_ABI } from "@/lib/abis/ERC20";
import dynamic from "next/dynamic";

const StripeCardForm = dynamic(() => import("@/components/StripeCardForm"), {
  ssr: false,
});

export default function HomeHero() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { writeContract, isPending } = useWriteContract();

  const [ethAmount, setEthAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"ETH" | "USDT" | "CARD">(
    "ETH"
  );

  const usdtAddress = USDT_ADDRESS_BY_CHAIN[chainId];
  const ZERO_ADDRESS =
    "0x0000000000000000000000000000000000000000" as `0x${string}`;
  const ONE_ETHER = BigInt("1000000000000000000");

  // Quotes for current input
  const { data: quotedTokensOut } = useReadContract({
    abi: LNX_SALE_ABI,
    address: LNX_SALE_ADDRESS,
    functionName: "quoteTokensForETH",
    args: [ethAmount ? parseEther(ethAmount) : BigInt(0)],
    query: { enabled: !!ethAmount && paymentMethod === "ETH" },
  });

  const { data: quotedTokensOutErc20 } = useReadContract({
    abi: LNX_SALE_ABI,
    address: LNX_SALE_ADDRESS,
    functionName: "quoteTokensForERC20",
    args: [
      usdtAddress ?? ZERO_ADDRESS,
      ethAmount ? parseUnits(ethAmount, 6) : BigInt(0),
    ],
    query: {
      enabled: !!ethAmount && paymentMethod === "USDT" && !!usdtAddress,
    },
  });

  // Live sale data
  const { data: totalTokensSold } = useReadContract({
    abi: LNX_SALE_ABI,
    address: LNX_SALE_ADDRESS,
    functionName: "totalTokensSold",
  });

  const { data: priceEthPerTokenWei } = useReadContract({
    abi: LNX_SALE_ABI,
    address: LNX_SALE_ADDRESS,
    functionName: "priceEthPerTokenWei",
  });

  const { data: isUsdtAccepted } = useReadContract({
    abi: LNX_SALE_ABI,
    address: LNX_SALE_ADDRESS,
    functionName: "isAcceptedErc20",
    args: [usdtAddress ?? ZERO_ADDRESS],
    query: { enabled: !!usdtAddress },
  });

  const { data: priceUsdtPerTokenUnits } = useReadContract({
    abi: LNX_SALE_ABI,
    address: LNX_SALE_ADDRESS,
    functionName: "priceErc20PerToken",
    args: [usdtAddress ?? ZERO_ADDRESS],
    query: { enabled: !!usdtAddress },
  });

  const { data: usdtDecimals } = useReadContract({
    abi: ERC20_ABI,
    address: usdtAddress ?? ZERO_ADDRESS,
    functionName: "decimals",
    query: { enabled: !!usdtAddress },
  });

  // Derived displays
  const ethPriceDisplay = priceEthPerTokenWei
    ? formatUnits(priceEthPerTokenWei as bigint, 18)
    : "-";

  const usdtDec =
    typeof usdtDecimals === "number"
      ? usdtDecimals
      : (usdtDecimals as unknown as bigint | undefined) !== undefined
      ? Number(usdtDecimals as unknown as bigint)
      : 6;

  const hasUsdtPricing = Boolean(
    isUsdtAccepted && priceUsdtPerTokenUnits && usdtAddress
  );

  const lnxUsdPrice = hasUsdtPricing
    ? formatUnits(priceUsdtPerTokenUnits as bigint, usdtDec)
    : undefined;

  const tokenPriceUsd = lnxUsdPrice ?? "0.095";

  const cardUsdAmount = ethAmount ? Number(ethAmount) : 0; // ethAmount field doubles as USD when CARD selected
  const usdToCharge = paymentMethod === "CARD" ? cardUsdAmount : 0;

  const tokensOutDisplayEth = quotedTokensOut
    ? formatUnits(quotedTokensOut as bigint, 18)
    : "";

  const tokensOutDisplay: string =
    paymentMethod === "ETH"
      ? tokensOutDisplayEth
      : paymentMethod === "USDT"
      ? quotedTokensOutErc20
        ? formatUnits(quotedTokensOutErc20 as bigint, 18)
        : ""
      : ethAmount && tokenPriceUsd
      ? String((Number(ethAmount) / Number(tokenPriceUsd)).toFixed(4))
      : "";

  const tokensSoldDisplay = totalTokensSold
    ? formatUnits(totalTokensSold as bigint, 18)
    : "0";

  const priceLineLeft =
    paymentMethod === "ETH"
      ? `1 LNX = ${ethPriceDisplay} ETH`
      : `1 LNX = $${tokenPriceUsd}`;

  const priceLineRight =
    paymentMethod === "ETH"
      ? tokenPriceUsd
        ? `USD price: $${tokenPriceUsd}`
        : ""
      : ethPriceDisplay
      ? `ETH price: ${ethPriceDisplay} ETH`
      : "";

  // Approximate USD raised using USDT price * tokens sold (works even if paid in ETH)
  let usdRaisedDisplay = "-";
  if (hasUsdtPricing && totalTokensSold) {
    const priceUnits = priceUsdtPerTokenUnits as bigint; // USDT units per 1e18 LNX
    const sold = totalTokensSold as bigint; // in 1e18
    const usdtUnits = (sold * priceUnits) / ONE_ETHER; // / 1e18
    usdRaisedDisplay = formatUnits(usdtUnits, usdtDec);
  }

  const payLabel =
    paymentMethod === "ETH"
      ? "ETH you pay"
      : paymentMethod === "USDT"
      ? "USDT you pay"
      : "USD you pay";

  const canPay =
    paymentMethod === "ETH"
      ? !!ethAmount
      : paymentMethod === "USDT"
      ? !!ethAmount && !!usdtAddress && hasUsdtPricing
      : false;

  async function handlePay() {
    if (!isConnected || !address) return;
    if (!ethAmount) return;

    if (paymentMethod === "ETH") {
      const value = parseEther(ethAmount);
      const minOut = quotedTokensOut
        ? ((quotedTokensOut as bigint) * BigInt(99)) / BigInt(100)
        : BigInt(0); // 1% slippage
      try {
        await writeContract({
          abi: LNX_SALE_ABI,
          address: LNX_SALE_ADDRESS,
          functionName: "buyWithETH",
          args: [address, minOut],
          value,
        });
      } catch (e) {
        console.error(e);
      }
      return;
    }

    if (paymentMethod === "USDT") {
      if (!usdtAddress) return;
      const amountIn = parseUnits(ethAmount, usdtDec);
      const minOut = quotedTokensOutErc20
        ? ((quotedTokensOutErc20 as bigint) * BigInt(99)) / BigInt(100)
        : BigInt(0);
      try {
        await writeContract({
          abi: ERC20_ABI,
          address: usdtAddress,
          functionName: "approve",
          args: [LNX_SALE_ADDRESS, amountIn],
        });
        await writeContract({
          abi: LNX_SALE_ABI,
          address: LNX_SALE_ADDRESS,
          functionName: "buyWithERC20",
          args: [usdtAddress, amountIn, address, minOut],
        });
      } catch (e) {
        console.error(e);
      }
      return;
    }

    // CARD: not enabled yet
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 hero-grid-pattern" />
      </div>

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 z-10">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight z-20">
                Cross-border
                <br />
                Payments
                <br />
                <span className="text-yellow-400">Reinvented</span>
              </h1>

              <div className="space-y-2 text-gray-300 text-lg max-w-lg">
                <p>
                  Lenix Protocol enables users to pay fiat into any bank account
                  around the world using crypto, by just simply connecting your
                  wallet.
                </p>
                <p className="text-yellow-400 font-semibold">
                  Welcome to the PayFi revolution!
                </p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Send className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <FileText className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Star className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Right Widget */}
          <div className="lg:justify-self-end z-20">
            <div className="bg-black/30 border-2 border-yellow-400 rounded-2xl p-6 max-w-md w-full">
              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-white text-xl font-bold mb-1">Buy Now</h3>
                <p className="text-yellow-400 text-lg font-semibold">
                  Before Price Rises
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="bg-gray-700 rounded-full h-3 mb-2">
                  <div
                    className="bg-yellow-400 h-3 rounded-full"
                    style={{ width: "71%" }}
                  />
                </div>
                <p className="text-yellow-400 text-sm font-semibold">
                  {hasUsdtPricing ? `$${usdRaisedDisplay}` : "—"}
                </p>
              </div>

              {/* Stats */}
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">USD RAISED SO FAR :</span>
                  <span className="text-white font-semibold">
                    {hasUsdtPricing ? `$${usdRaisedDisplay}` : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Tokens Sold :</span>
                  <span className="text-white font-semibold">
                    {tokensSoldDisplay}
                  </span>
                </div>
              </div>

              {/* Price Info */}
              <div className="flex justify-between items-center mb-6 text-sm">
                <span className="text-white">{priceLineLeft}</span>
                <span className="text-green-400">{priceLineRight}</span>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <button
                  onClick={() => setPaymentMethod("ETH")}
                  className={`${
                    paymentMethod === "ETH"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-700 hover:bg-gray-600"
                  } text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1`}
                >
                  <img
                    src="/assets/img/eth.svg"
                    alt="eth"
                    className="w-6 h-6"
                  />
                  ETH
                </button>
                <button
                  onClick={() => setPaymentMethod("USDT")}
                  className={`${
                    paymentMethod === "USDT"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-700 hover:bg-gray-600"
                  } text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1`}
                >
                  <img
                    src="/assets/img/usdt.svg"
                    alt="usdt"
                    className="w-6 h-6"
                  />
                  USDT
                </button>
                <button
                  onClick={() => setPaymentMethod("CARD")}
                  className={`${
                    paymentMethod === "CARD"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-700 hover:bg-gray-600"
                  } text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1`}
                >
                  <CreditCard className="w-6 h-6" />
                  CARD
                </button>
              </div>

              {/* Input Fields */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">{payLabel}</span>
                  <span className="text-yellow-400 text-sm">
                    $LNX you receive
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-lg p-3 flex items-center">
                    <div className="w-6 h-6 bg-blue-400 rounded-full mr-2" />
                    <input
                      type="text"
                      placeholder="0"
                      className="bg-transparent text-white outline-none flex-1"
                      value={ethAmount}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9.]/g, "");
                        setEthAmount(v);
                      }}
                    />
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 flex items-center">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full mr-2" />
                    <input
                      type="text"
                      placeholder="0"
                      className="bg-transparent text-white outline-none flex-1"
                      value={tokensOutDisplay}
                      readOnly
                    />
                  </div>
                </div>
                {paymentMethod === "CARD" &&
                  isConnected &&
                  address &&
                  usdToCharge > 0 && (
                    <div className="pt-2">
                      <StripeCardForm
                        amountUsd={usdToCharge}
                        walletAddress={address}
                      />
                    </div>
                  )}
              </div>

              {/* Connect/Pay Button */}
              {isConnected ? (
                <>
                  <button
                    onClick={handlePay}
                    disabled={isPending || !canPay || paymentMethod === "CARD"}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-lg transition-colors mb-2"
                  >
                    {isPending
                      ? "Processing..."
                      : paymentMethod === "ETH"
                      ? "Pay with ETH"
                      : paymentMethod === "USDT"
                      ? "Pay with USDT"
                      : "Enter Card Details Below"}
                  </button>
                  {paymentMethod === "CARD" && (
                    <p className="text-center text-xs text-gray-400 mb-4">
                      Powered by Stripe. Amount charged in USD.
                    </p>
                  )}
                </>
              ) : (
                <div className="mb-4 w-full">
                  <div className="w-full">
                    <appkit-button />
                  </div>
                </div>
              )}

              {/* Giveaway */}
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <span className="text-white font-semibold">
                  $250,000 Giveaway
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
