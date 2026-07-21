"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AlertCircle, Clipboard, Info, Loader2 } from "lucide-react";
import {
  JsonRpcProvider,
  Wallet,
  Contract,
  formatUnits,
  parseUnits,
} from "ethers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useWallet } from "../../lenix-wallet/_hooks/use-wallet";
import { useTranslations } from "next-intl";

const FALLBACK_VECTOR = "/assets/vectors/coin.svg";

function TokenLogo({
  src,
  size,
  className,
}: {
  src?: string | null;
  size: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || FALLBACK_VECTOR}
      alt=""
      width={size}
      height={size}
      className={className}
      onError={(event) => {
        event.currentTarget.src = FALLBACK_VECTOR;
      }}
    />
  );
}

const RPC_BY_CHAIN: Record<number, string> = {
  1: process.env.NEXT_PUBLIC_RPC_ETH || "https://eth.llamarpc.com",
  56: process.env.NEXT_PUBLIC_RPC_BSC || "https://bsc-dataseed.binance.org",
  137: process.env.NEXT_PUBLIC_RPC_POLYGON || "https://polygon.llamarpc.com",
};

const ZERO_BIGINT = BigInt(0);
const TOKEN_GAS_LIMIT = BigInt(80_000);
const NATIVE_GAS_LIMIT = BigInt(21_000);

const CHAIN_METADATA: Record<
  number,
  {
    label: string;
    nativeSymbol: string;
    tokenGasLimit: bigint;
    nativeGasLimit: bigint;
  }
> = {
  0: {
    label: "Bitcoin (Native)",
    nativeSymbol: "BTC",
    tokenGasLimit: ZERO_BIGINT,
    nativeGasLimit: ZERO_BIGINT,
  },
  1: {
    label: "Ethereum (ERC20)",
    nativeSymbol: "ETH",
    tokenGasLimit: TOKEN_GAS_LIMIT,
    nativeGasLimit: NATIVE_GAS_LIMIT,
  },
  56: {
    label: "BNB Smart Chain (BEP20)",
    nativeSymbol: "BNB",
    tokenGasLimit: TOKEN_GAS_LIMIT,
    nativeGasLimit: NATIVE_GAS_LIMIT,
  },
  137: {
    label: "Polygon (ERC20)",
    nativeSymbol: "MATIC",
    tokenGasLimit: TOKEN_GAS_LIMIT,
    nativeGasLimit: NATIVE_GAS_LIMIT,
  },
};

const ERC20_ABI = [
  "function transfer(address to, uint256 amount) external returns (bool)",
];

export interface SendFormToken {
  id: string;
  name: string;
  symbol: string;
  chainId: number;
  decimals: number;
  balance: string; // raw wei string
  priceUsd?: number;
  quote?: number;
  logoUrl?: string | null;
  native?: boolean;
  contractAddress?: string;
  isFrozen?: boolean;
  freezeReason?: string | null;
  freezeFeeAmount?: string | null;
  /** Raw-unit balance actually backed by real on-chain funds. When present, this —
   *  not `balance` — is what's enforced as the sendable amount, since `balance` may
   *  include admin-credited amounts that were never deposited on-chain. */
  spendableBalance?: string;
}

interface SendFormProps {
  tokens: SendFormToken[];
  initialTokenId?: string | null;
  onSuccess?: (txHash: string) => void;
}

function Field({
  label,
  action,
  children,
}: {
  label: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-zinc-300">
          {label}
        </span>
        {action}
      </div>
      {children}
    </div>
  );
}

export function SendForm({
  tokens,
  initialTokenId = null,
  onSuccess,
}: SendFormProps) {
  const t = useTranslations("AccountLenixWallet.send_form");
  const { walletState, walletData } = useWallet();
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);
  const [networkFee, setNetworkFee] = useState<string>("--");
  const [feeLoading, setFeeLoading] = useState(false);

  const sortedTokens = useMemo(() => {
    return [...tokens].sort((a, b) => (b.quote ?? 0) - (a.quote ?? 0));
  }, [tokens]);

  useEffect(() => {
    if (!selectedTokenId && sortedTokens.length > 0) {
      if (
        initialTokenId &&
        sortedTokens.find((token) => token.id === initialTokenId)
      ) {
        setSelectedTokenId(initialTokenId);
      } else {
        setSelectedTokenId(sortedTokens[0].id);
      }
    }
  }, [initialTokenId, selectedTokenId, sortedTokens]);

  const token = useMemo(() => {
    return (
      sortedTokens.find((item) => item.id === selectedTokenId) ??
      sortedTokens[0]
    );
  }, [sortedTokens, selectedTokenId]);

  // What's actually enforced as sendable — real, on-chain-backed funds only. Admin
  // credits were never deposited on-chain, so they're excluded here even though the
  // wallet dashboard shows them as part of the headline balance.
  const available = useMemo(() => {
    if (!token) return 0;
    try {
      return Number(
        formatUnits(
          BigInt(token.spendableBalance ?? token.balance ?? "0"),
          token.decimals,
        ),
      );
    } catch {
      return 0;
    }
  }, [token]);

  // Full balance shown to the user, matching what the wallet dashboard displays
  // (includes admin credits). Purely informational — sends are still capped to `available`.
  const displayBalance = useMemo(() => {
    if (!token) return 0;
    try {
      return Number(formatUnits(BigInt(token.balance ?? "0"), token.decimals));
    } catch {
      return 0;
    }
  }, [token]);

  const usdEstimate = useMemo(() => {
    if (!token) return 0;
    const amt = Number(amount || "0");
    return (token.priceUsd ?? 0) * amt;
  }, [amount, token]);

  const networkMeta = token ? CHAIN_METADATA[token.chainId] : undefined;
  const isBitcoin = token?.chainId === 0;

  useEffect(() => {
    const fetchFee = async () => {
      if (!token || !networkMeta) {
        setNetworkFee("--");
        return;
      }
      if (token.chainId === 0) {
        setNetworkFee(t("fee_bitcoin_estimate"));
        return;
      }
      const rpcUrl = RPC_BY_CHAIN[token.chainId];
      if (!rpcUrl) {
        setNetworkFee("--");
        return;
      }
      try {
        setFeeLoading(true);
        const provider = new JsonRpcProvider(rpcUrl);
        const feeData = await provider.getFeeData();
        const gasPrice = feeData.gasPrice ?? ZERO_BIGINT;
        if (gasPrice === ZERO_BIGINT) {
          setNetworkFee("--");
          return;
        }
        const gasLimit = token.native
          ? networkMeta.nativeGasLimit
          : networkMeta.tokenGasLimit;
        const fee = gasPrice * gasLimit;
        setNetworkFee(
          `${Number(formatUnits(fee, 18)).toFixed(6)} ${networkMeta.nativeSymbol}`,
        );
      } catch (error) {
        console.error("Failed to fetch fee", error);
        setNetworkFee("--");
      } finally {
        setFeeLoading(false);
      }
    };

    fetchFee();
  }, [token, networkMeta]);

  const addressValid = useMemo(() => {
    if (!address) return false;
    if (isBitcoin) {
      return /^(bc1|[13])[a-zA-Z0-9]{20,87}$/.test(address.trim());
    }
    return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
  }, [address, isBitcoin]);

  const parsedAmount = useMemo(() => {
    const numeric = Number(amount || "0");
    if (!Number.isFinite(numeric)) return 0;
    return numeric;
  }, [amount]);

  const canSubmit = Boolean(
    token &&
    !token.isFrozen &&
    addressValid &&
    parsedAmount > 0 &&
    parsedAmount <= available &&
    walletState === "unlocked" &&
    (isBitcoin
      ? Boolean(walletData?.password)
      : Boolean(walletData?.privateKey)) &&
    !isSending,
  );

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setAddress(text.trim());
      setTxError(null);
    } catch {
      toast.error(t("clipboard_error"));
    }
  };

  const handleMax = () => {
    if (!token) return;
    const max = available;
    if (token.native && networkMeta) {
      // Reserve a small buffer for gas (0.001 native token)
      const buffer = 0.001;
      setAmount(max > buffer ? (max - buffer).toString() : max.toString());
    } else {
      setAmount(max.toString());
    }
    setTxError(null);
  };

  const handleSend = async () => {
    if (!token) return;
    if (!canSubmit) {
      if (walletState !== "unlocked") {
        toast.error(t("wallet_locked_error"));
      }
      return;
    }

    if (isBitcoin) {
      try {
        setIsSending(true);
        setTxError(null);
        const response = await fetch("/api/btc/withdrawals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            password: walletData?.password,
            destinationAddress: address.trim(),
            amountBtc: amount,
          }),
        });
        const body = await response.json().catch(() => null);
        if (!response.ok)
          throw new Error(body?.error || t("bitcoin_send_failed"));
        const hash = body.data.txid as string;
        onSuccess?.(hash);
        setAmount("");
        toast.success(t("bitcoin_send_success"), { id: hash });
      } catch (error: any) {
        const message = error?.message || t("bitcoin_send_failed");
        setTxError(message);
        toast.error(message);
      } finally {
        setIsSending(false);
      }
      return;
    }

    const rpcUrl = RPC_BY_CHAIN[token.chainId];
    if (!rpcUrl || !networkMeta) {
      toast.error(t("unsupported_network"));
      return;
    }

    try {
      setIsSending(true);
      setTxError(null);

      const provider = new JsonRpcProvider(rpcUrl);
      const senderWallet = new Wallet(walletData!.privateKey!, provider);
      const value = parseUnits(amount, token.decimals);

      let hash: string;
      if (token.native || !token.contractAddress) {
        const tx = await senderWallet.sendTransaction({
          to: address.trim() as `0x${string}`,
          value,
        });
        toast.loading(t("broadcasting_transaction"), { id: tx.hash });
        const receipt = await tx.wait();
        toast.success(t("transfer_confirmed"), { id: tx.hash });
        hash = receipt?.hash ?? tx.hash;
      } else {
        const contract = new Contract(
          token.contractAddress,
          ERC20_ABI,
          senderWallet,
        );
        const tx = await contract.transfer(address.trim(), value);
        toast.loading(t("broadcasting_token_transfer"), { id: tx.hash });
        const receipt = await tx.wait();
        toast.success(t("token_transfer_complete"), { id: tx.hash });
        hash = receipt?.hash ?? tx.hash;
      }

      onSuccess?.(hash);
      setAmount("");
    } catch (error: any) {
      console.error("Send failed", error);
      const message =
        error?.reason ||
        error?.data?.message ||
        error?.message ||
        t("transaction_failed");
      setTxError(message);
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  if (sortedTokens.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/30 p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
        <Image
          src="/assets/vectors/start-deposit-no.svg"
          alt={t("no_assets_alt")}
          width={160}
          height={160}
          className="mb-4 opacity-80"
        />
        <h2 className="text-base font-semibold text-white">
          {t("no_assets_title")}
        </h2>
        <p className="mt-2 max-w-sm text-sm text-zinc-400">
          {t("no_assets_description")}
        </p>
      </section>
    );
  }

  return (
    <section className=" backdrop-blur-xl ">
      <div className="space-y-5">
        <Field label={t("asset_label")}>
          <Select
            value={selectedTokenId ?? undefined}
            onValueChange={(value) => {
              setSelectedTokenId(value);
              setAmount("");
              setTxError(null);
            }}
          >
            <SelectTrigger
              aria-label={t("asset_label")}
              className="h-14 rounded-xl flex flex-row items-center gap-3 border-white/10 bg-white/5 px-3 text-sm text-white transition-colors hover:border-white/20 focus:ring-1 focus:ring-yellow-400/60 [&>svg]:text-zinc-400"
            >
              {token && (
                <span className="flex flex-row items-center gap-3 text-left">
                  <TokenLogo
                    src={token.logoUrl}
                    size={28}
                    className="rounded-full object-cover"
                  />
                  <span>
                    <span className="block font-medium">{token.symbol}</span>
                    <span className="block text-xs text-zinc-500">
                      {token.name}
                    </span>
                  </span>
                </span>
              )}
            </SelectTrigger>
            <SelectContent className="max-h-72 rounded-xl border-white/10 bg-zinc-950 text-white shadow-xl">
              {sortedTokens.map((item) => (
                <SelectItem
                  key={item.id}
                  value={item.id}
                  className="cursor-pointer py-2.5 text-sm focus:bg-white/8 focus:text-white"
                >
                  <div className="flex w-full items-center justify-between gap-6">
                    <span className="flex items-center gap-2.5">
                      <TokenLogo
                        src={item.logoUrl}
                        size={22}
                        className="rounded-full object-cover"
                      />
                      <span className="flex items-center gap-1.5">
                        {item.symbol}
                        {item.isFrozen && (
                          <span className="rounded-full bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-400">
                            {t("frozen")}
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="text-xs text-zinc-500">
                      {Number(
                        formatUnits(BigInt(item.balance ?? "0"), item.decimals),
                      ).toLocaleString(undefined, {
                        maximumFractionDigits: item.chainId === 0 ? 8 : 6,
                      })}{" "}
                      {t("available")}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {token && networkMeta && (
          <Field label={t("network_label")}>
            <div className="flex h-12 items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white">
              <span>{networkMeta.label}</span>
              <span className="text-xs text-zinc-500">
                {t("chain_id", { id: token.chainId })}
              </span>
            </div>
          </Field>
        )}

        <Field
          label={t("recipient_label")}
          action={
            <button
              type="button"
              disabled={token?.isFrozen}
              className="inline-flex items-center gap-1 text-xs font-medium text-yellow-400 transition-colors hover:text-yellow-300 disabled:cursor-not-allowed disabled:text-zinc-600 disabled:hover:text-zinc-600"
              onClick={handlePaste}
            >
              <Clipboard className="h-3.5 w-3.5" aria-hidden />
              {t("paste")}
            </button>
          }
        >
          <input
            type="text"
            value={address}
            disabled={token?.isFrozen}
            onChange={(e) => {
              setAddress(e.target.value);
              setTxError(null);
            }}
            placeholder={isBitcoin ? "bc1q..." : "0x..."}
            aria-label={t("recipient_label")}
            aria-invalid={address.length > 0 && !addressValid}
            className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-3 font-mono text-sm text-white placeholder:text-zinc-600 outline-none transition-colors hover:border-white/20 focus:border-yellow-400/70 focus:ring-1 focus:ring-yellow-400/50 aria-invalid:border-yellow-400/60 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-white/10"
          />
          {address.length > 0 && !addressValid && (
            <p className="mt-2 text-xs text-yellow-300">
              {isBitcoin
                ? t("recipient_error_bitcoin")
                : t("recipient_error_evm")}
            </p>
          )}
        </Field>

        <Field
          label={t("amount_label")}
          action={
            <button
              type="button"
              disabled={token?.isFrozen}
              className="text-xs font-semibold text-yellow-400 transition-colors hover:text-yellow-300 disabled:cursor-not-allowed disabled:text-zinc-600 disabled:hover:text-zinc-600"
              onClick={handleMax}
            >
              MAX
            </button>
          }
        >
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              disabled={token?.isFrozen}
              onChange={(e) => {
                setAmount(e.target.value);
                setTxError(null);
              }}
              placeholder="0.00"
              aria-label={
                token
                  ? t("amount_aria", { symbol: token.symbol })
                  : t("amount_label")
              }
              className="h-14 w-full rounded-xl border border-white/10 bg-white/5 px-3 pr-20 text-lg font-medium text-white placeholder:text-zinc-600 outline-none transition-colors hover:border-white/20 focus:border-yellow-400/70 focus:ring-1 focus:ring-yellow-400/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-white/10"
            />
            {token && (
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-medium text-zinc-400">
                {token.symbol}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            {token && (
              <span className="text-zinc-500">
                {t("available")}:{" "}
                {displayBalance.toLocaleString(undefined, {
                  maximumFractionDigits: isBitcoin ? 8 : 6,
                })}{" "}
                {token.symbol}
              </span>
            )}
            <span className="text-zinc-500">
              ≈ $
              {usdEstimate.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          {token && available < displayBalance && (
            <p className="mt-1.5 text-[11px] text-amber-300/90 hidden">
              {t("on_chain_only", {
                amount: available.toLocaleString(undefined, {
                  maximumFractionDigits: isBitcoin ? 8 : 6,
                }),
                symbol: token.symbol,
              })}
            </p>
          )}
        </Field>

        <div
          className="rounded-xl bg-white/4 px-3.5 py-3"
          aria-label={t("summary_label")}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">{t("network_fee")}</span>
            <span className="font-medium text-white">
              {feeLoading ? t("calculating_fee") : networkFee}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-zinc-400">{t("recipient_receives")}</span>
            <span className="font-medium text-white">
              {parsedAmount > 0
                ? parsedAmount.toFixed(6).replace(/\.0+$/, "")
                : "0"}{" "}
              {token?.symbol}
            </span>
          </div>
        </div>

        {token?.isFrozen ? (
          <div
            className="flex gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-xs leading-relaxed text-red-200"
            role="alert"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-red-400"
              aria-hidden
            />
            <p>
              {t("frozen_message", { reason: token.freezeReason ?? "" })}
              {token.freezeFeeAmount
                ? t("frozen_unfreeze_instruction", {
                    amount: token.freezeFeeAmount,
                  })
                : t("frozen_contact_support")}
            </p>
          </div>
        ) : (
          <div className="flex gap-2 rounded-xl bg-amber-400/10 px-3.5 py-3 text-xs leading-relaxed text-amber-100">
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-300"
              aria-hidden
            />
            {t("irreversible_warning")}
          </div>
        )}

        {txError && (
          <div
            className="flex gap-2 rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-3.5 py-3 text-sm text-yellow-100"
            role="alert"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-yellow-300"
              aria-hidden
            />
            <p>{txError}</p>
          </div>
        )}

        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleSend}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 text-sm font-semibold text-black transition-colors hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/50 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-zinc-500"
        >
          {isSending && (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          )}
          {isSending ? t("sending") : t("send_now")}
        </button>
      </div>
    </section>
  );
}
