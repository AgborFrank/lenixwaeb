"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Lock,
  Unlock,
  Loader2,
  ShieldAlert,
  Plus,
  Minus,
  Clock,
  CheckCircle2,
  Bitcoin,
  Landmark,
} from "lucide-react";
import { toast } from "sonner";

interface AssetBalance {
  id: string;
  token_symbol: string;
  network: string;
  balance: string;
  admin_balance: string;
  is_frozen: boolean;
  freeze_reason: string | null;
  freeze_fee_amount: string | null;
  freeze_fee_currency: string | null;
  frozen_at: string | null;
}

interface FiatBalance {
  id: string;
  currency: string;
  balance: string;
  updated_at: string;
}

interface FreezeEvent {
  id: string;
  user_id: string;
  token_symbol: string;
  network: string;
  action: "freeze" | "unfreeze";
  reason: string | null;
  fee_amount: string | null;
  fee_currency: string | null;
  fee_tx_hash: string | null;
  actor: string;
  created_at: string;
}

interface FiatOperation {
  id: string;
  user_id: string;
  operation_type: "credit" | "debit";
  currency: string;
  amount: string;
  status: string;
  created_at: string;
}

const NETWORKS = [
  { value: "bitcoin", label: "Bitcoin" },
  { value: "ethereum", label: "Ethereum" },
  { value: "bsc", label: "BNB Smart Chain" },
  { value: "polygon", label: "Polygon" },
];

export default function AdminAccountControlsPage() {
  const searchParams = useSearchParams();
  const prefilledUserId = searchParams.get("user");

  const [userId, setUserId] = useState(prefilledUserId || "");
  const [balances, setBalances] = useState<AssetBalance[]>([]);
  const [fiatBalances, setFiatBalances] = useState<FiatBalance[]>([]);
  const [freezeEvents, setFreezeEvents] = useState<FreezeEvent[]>([]);
  const [fiatOperations, setFiatOperations] = useState<FiatOperation[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  // Freeze form
  const [freezeTokenSymbol, setFreezeTokenSymbol] = useState("BTC");
  const [freezeNetwork, setFreezeNetwork] = useState("bitcoin");
  const [freezeReason, setFreezeReason] = useState("");
  const [freezeFeeAmount, setFreezeFeeAmount] = useState("");
  const [isFreezing, setIsFreezing] = useState(false);

  // Fiat credit/debit form
  const [fiatOperationType, setFiatOperationType] = useState<"credit" | "debit">("credit");
  const [fiatCurrency, setFiatCurrency] = useState<"USD" | "EUR" | "GBP">("USD");
  const [fiatAmount, setFiatAmount] = useState("");
  const [fiatReason, setFiatReason] = useState("");
  const [isSubmittingFiat, setIsSubmittingFiat] = useState(false);

  useEffect(() => {
    fetchGlobalActivity();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    } else {
      setBalances([]);
      setFiatBalances([]);
    }
  }, [userId]);

  async function fetchGlobalActivity() {
    try {
      const [freezeRes, fiatRes] = await Promise.all([
        fetch("/api/admin/freeze"),
        fetch("/api/admin/banking/balance"),
      ]);
      const freezeData = await freezeRes.json();
      const fiatData = await fiatRes.json();
      if (freezeData.events) setFreezeEvents(freezeData.events);
      if (fiatData.operations) setFiatOperations(fiatData.operations);
    } catch {
      // Non-critical background activity feed; ignore failures.
    }
  }

  async function fetchUserData() {
    setIsLoadingUser(true);
    try {
      const [balRes, fiatRes] = await Promise.all([
        fetch(`/api/admin/freeze?userId=${userId}`),
        fetch(`/api/admin/banking/balance?userId=${userId}`),
      ]);
      const balData = await balRes.json();
      const fiatData = await fiatRes.json();
      setBalances(balData.balances || []);
      setFiatBalances(fiatData.balances || []);
    } catch {
      toast.error("Failed to load user data");
    } finally {
      setIsLoadingUser(false);
    }
  }

  async function handleFreezeToggle(asset: AssetBalance) {
    if (!userId.trim()) {
      toast.error("Enter a user ID first");
      return;
    }

    const action = asset.is_frozen ? "unfreeze" : "freeze";
    if (action === "freeze" && !window.confirm(`Freeze ${asset.token_symbol} (${asset.network}) for this user?`)) return;

    try {
      const res = await fetch("/api/admin/freeze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId.trim(),
          tokenSymbol: asset.token_symbol,
          network: asset.network,
          action,
          reason: action === "freeze" ? (asset.freeze_reason ?? "Frozen by admin") : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update freeze state");
      toast.success(action === "freeze" ? "Asset frozen" : "Asset unfrozen");
      fetchUserData();
      fetchGlobalActivity();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update freeze state");
    }
  }

  async function handleFreezeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId.trim()) {
      toast.error("Enter a user ID first");
      return;
    }
    if (!freezeReason.trim()) {
      toast.error("A reason/purpose is required to freeze an asset");
      return;
    }

    setIsFreezing(true);
    try {
      const res = await fetch("/api/admin/freeze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId.trim(),
          tokenSymbol: freezeTokenSymbol,
          network: freezeNetwork,
          action: "freeze",
          reason: freezeReason.trim(),
          feeAmount: freezeFeeAmount.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to freeze asset");
      toast.success(`${freezeTokenSymbol} frozen for user`);
      setFreezeReason("");
      setFreezeFeeAmount("");
      fetchUserData();
      fetchGlobalActivity();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to freeze asset");
    } finally {
      setIsFreezing(false);
    }
  }

  async function handleFiatSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId.trim()) {
      toast.error("Enter a user ID first");
      return;
    }
    if (!fiatAmount || parseFloat(fiatAmount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setIsSubmittingFiat(true);
    try {
      const res = await fetch("/api/admin/banking/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId.trim(),
          operationType: fiatOperationType,
          currency: fiatCurrency,
          amount: fiatAmount,
          reason: fiatReason,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Operation failed");
      toast.success(`${fiatOperationType === "credit" ? "Credited" : "Debited"} ${fiatAmount} ${fiatCurrency}`);
      setFiatAmount("");
      setFiatReason("");
      fetchUserData();
      fetchGlobalActivity();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Operation failed");
    } finally {
      setIsSubmittingFiat(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Account Controls</h1>
        <p className="mt-1 text-zinc-400">Freeze/unfreeze assets, set unlock fees, and manage bank balances</p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <label className="mb-1.5 block text-sm font-medium text-zinc-400">User ID</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user ID (UUID)"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Freeze form */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-white">
            <ShieldAlert className="h-5 w-5 text-red-400" />
            Freeze an asset
          </h2>
          <p className="mb-4 text-sm text-zinc-500">
            State a purpose and, optionally, a BTC fee the user must deposit to their own wallet to auto-unfreeze.
          </p>
          <form onSubmit={handleFreezeSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-400">Token</label>
                <input
                  value={freezeTokenSymbol}
                  onChange={(e) => setFreezeTokenSymbol(e.target.value.toUpperCase())}
                  placeholder="BTC"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-400">Network</label>
                <select
                  value={freezeNetwork}
                  onChange={(e) => setFreezeNetwork(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                >
                  {NETWORKS.map((net) => (
                    <option key={net.value} value={net.value}>{net.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">Reason / purpose (required)</label>
              <textarea
                value={freezeReason}
                onChange={(e) => setFreezeReason(e.target.value)}
                placeholder="e.g. Compliance review pending — KYC re-verification required"
                rows={2}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Required BTC deposit to unfreeze (optional)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={freezeFeeAmount}
                  onChange={(e) => setFreezeFeeAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 pr-14 text-sm text-white placeholder-zinc-500 focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-zinc-500">BTC</span>
              </div>
              <p className="mt-1.5 text-xs text-zinc-500">
                Leave blank if there's no fee — the account will require manual unfreeze instead.
              </p>
            </div>

            <button
              type="submit"
              disabled={isFreezing}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isFreezing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {isFreezing ? "Freezing..." : "Freeze asset"}
            </button>
          </form>
        </div>

        {/* Fiat credit/debit */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-white">
            <Landmark className="h-5 w-5 text-yellow-400" />
            Bank balance operation
          </h2>
          <p className="mb-4 text-sm text-zinc-500">Credit or debit the fiat balance behind this user's banking workspace.</p>
          <form onSubmit={handleFiatSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFiatOperationType("credit")}
                className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                  fiatOperationType === "credit"
                    ? "border-green-500 bg-green-500/10 text-green-400"
                    : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600"
                }`}
              >
                <Plus className="h-4 w-4" />
                Credit
              </button>
              <button
                type="button"
                onClick={() => setFiatOperationType("debit")}
                className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                  fiatOperationType === "debit"
                    ? "border-red-500 bg-red-500/10 text-red-400"
                    : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600"
                }`}
              >
                <Minus className="h-4 w-4" />
                Debit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-400">Currency</label>
                <select
                  value={fiatCurrency}
                  onChange={(e) => setFiatCurrency(e.target.value as "USD" | "EUR" | "GBP")}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-400">Amount</label>
                <input
                  type="number"
                  step="any"
                  value={fiatAmount}
                  onChange={(e) => setFiatAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">Reason (optional)</label>
              <textarea
                value={fiatReason}
                onChange={(e) => setFiatReason(e.target.value)}
                placeholder="Enter a reason for this operation..."
                rows={2}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingFiat}
              className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                fiatOperationType === "credit" ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {isSubmittingFiat && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmittingFiat ? "Processing..." : fiatOperationType === "credit" ? "Credit bank balance" : "Debit bank balance"}
            </button>
          </form>
        </div>
      </div>

      {/* Current state for selected user */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="border-b border-zinc-800 px-5 py-4">
            <h2 className="font-semibold text-white">Asset Freeze Status</h2>
            <p className="mt-1 text-sm text-zinc-500">{userId ? `For ${userId.slice(0, 12)}...` : "Enter a user ID above"}</p>
          </div>
          <div className="divide-y divide-zinc-800">
            {isLoadingUser ? (
              <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-zinc-500" /></div>
            ) : balances.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Bitcoin className="h-8 w-8 text-zinc-600" />
                <p className="mt-2 text-sm text-zinc-500">{userId ? "No balances found" : "No user selected"}</p>
              </div>
            ) : (
              balances.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{asset.token_symbol}</p>
                      <span className="text-xs text-zinc-500">{asset.network}</span>
                      {asset.is_frozen && <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400">Frozen</span>}
                    </div>
                    {asset.is_frozen && asset.freeze_reason && <p className="mt-0.5 text-xs text-zinc-500">{asset.freeze_reason}</p>}
                    {asset.is_frozen && asset.freeze_fee_amount && (
                      <p className="mt-0.5 text-xs text-amber-400">Unlock fee: {asset.freeze_fee_amount} {asset.freeze_fee_currency}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleFreezeToggle(asset)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      asset.is_frozen ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    {asset.is_frozen ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                    {asset.is_frozen ? "Unfreeze" : "Freeze"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="border-b border-zinc-800 px-5 py-4">
            <h2 className="font-semibold text-white">Bank Balances</h2>
            <p className="mt-1 text-sm text-zinc-500">{userId ? `For ${userId.slice(0, 12)}...` : "Enter a user ID above"}</p>
          </div>
          <div className="divide-y divide-zinc-800">
            {fiatBalances.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Landmark className="h-8 w-8 text-zinc-600" />
                <p className="mt-2 text-sm text-zinc-500">{userId ? "No fiat balances" : "No user selected"}</p>
              </div>
            ) : (
              fiatBalances.map((balance) => (
                <div key={balance.id} className="flex items-center justify-between px-5 py-3">
                  <p className="text-sm font-medium text-white">{balance.currency}</p>
                  <p className="text-sm font-medium text-white">
                    {Number(balance.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="border-b border-zinc-800 px-5 py-4"><h2 className="font-semibold text-white">Recent Freeze Activity</h2></div>
          <div className="divide-y divide-zinc-800">
            {freezeEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="h-6 w-6 text-zinc-600" />
                <p className="mt-2 text-sm text-zinc-500">No activity yet</p>
              </div>
            ) : (
              freezeEvents.map((event) => (
                <div key={event.id} className="px-5 py-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`inline-flex items-center gap-1.5 font-medium ${event.action === "freeze" ? "text-red-400" : "text-green-400"}`}>
                      {event.action === "freeze" ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                      {event.token_symbol} {event.action}d
                    </span>
                    <span className="text-xs text-zinc-500">{new Date(event.created_at).toLocaleString()}</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    {event.actor === "system_auto" ? "Auto-released (fee paid)" : "Admin action"}
                    {event.fee_amount ? ` · Fee: ${event.fee_amount} ${event.fee_currency}` : ""}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="border-b border-zinc-800 px-5 py-4"><h2 className="font-semibold text-white">Recent Bank Operations</h2></div>
          <div className="divide-y divide-zinc-800">
            {fiatOperations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="h-6 w-6 text-zinc-600" />
                <p className="mt-2 text-sm text-zinc-500">No operations yet</p>
              </div>
            ) : (
              fiatOperations.map((op) => (
                <div key={op.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className={`inline-flex items-center gap-1.5 font-medium ${op.operation_type === "credit" ? "text-green-400" : "text-red-400"}`}>
                    {op.operation_type === "credit" ? <Plus className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                    {op.amount} {op.currency}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                    <CheckCircle2 className="h-3 w-3 text-green-400" />
                    {new Date(op.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
