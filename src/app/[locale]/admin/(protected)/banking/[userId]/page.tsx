"use client";

import { useEffect, useState } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  User,
  Wallet,
  Bitcoin,
  CreditCard,
  Building2,
  Copy,
  Check,
  Loader2,
  Save,
  DollarSign,
  Clock,
  Network,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

interface BankAccountReview {
  id: string;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  routing_number: string | null;
  iban: string | null;
  swift_bic: string | null;
  account_type: string;
  currency: string;
  country: string;
  status: "pending" | "verified" | "rejected";
  is_default: boolean;
  admin_notes: string | null;
  created_at: string;
}

interface UserBankingDetails {
  user_id: string;
  email: string | null;
  display_name: string;
  payout_method: string | null;
  payout_details: Record<string, any> | null;
  balances: {
    token_symbol: string;
    balance: string;
    admin_balance: string;
    network: string;
    usd_value: number;
  }[];
  transactions: {
    id: string;
    amount: string;
    token_symbol: string;
    transaction_type: string;
    status: string;
    created_at: string;
  }[];
  onboarding: {
    step_completed: number;
    details: Record<string, any>;
  } | null;
  bank_accounts: BankAccountReview[];
  created_at: string;
}

export default function AdminBankingUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [data, setData] = useState<UserBankingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  // Edit state
  const [editMode, setEditMode] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<string>("");
  const [network, setNetwork] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  async function fetchUserData() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/banking/${userId}`);
      const result = await res.json();
      if (res.ok && result.data) {
        setData(result.data);
        setPayoutMethod(result.data.payout_method || "crypto");
        setNetwork(result.data.payout_details?.network || "");
        setWalletAddress(result.data.payout_details?.wallet_address || "");
      } else {
        toast.error(result.error || "Failed to load user data");
      }
    } catch {
      toast.error("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/banking/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payout_method: payoutMethod,
          payout_details: {
            network,
            wallet_address: walletAddress,
            payout_method: payoutMethod,
          },
        }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Payout details updated");
        setEditMode(false);
        fetchUserData();
      } else {
        toast.error(result.error || "Failed to update");
      }
    } catch {
      toast.error("Failed to update");
    } finally {
      setIsSaving(false);
    }
  }

  async function reviewBankAccount(accountId: string, status: "verified" | "rejected") {
    setReviewingId(accountId);
    try {
      const adminNotes = status === "rejected" ? window.prompt("Reason for rejection (shown to the user):") ?? "" : undefined;
      const res = await fetch(`/api/admin/banking/accounts/${accountId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update bank account");
      toast.success(status === "verified" ? "Bank account verified" : "Bank account rejected");
      fetchUserData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update bank account");
    } finally {
      setReviewingId(null);
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copied`);
    setTimeout(() => setCopied(null), 2000);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <User className="h-12 w-12 text-zinc-600" />
        <p className="mt-4 text-zinc-400">User not found</p>
        <Link
          href="/admin/banking"
          className="mt-4 text-sm text-yellow-400 hover:underline"
        >
          Back to Banking
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/banking"
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{data.display_name}</h1>
          <p className="mt-1 text-zinc-400">{data.email || data.user_id}</p>
        </div>
        <Link
          href={`/admin/balances?user=${userId}`}
          className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-300"
        >
          <Wallet className="h-4 w-4" />
          Manage Balances
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payout Method */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
            <div>
              <h2 className="font-semibold text-white">Payout Method</h2>
              <p className="mt-1 text-sm text-zinc-500">
                User's preferred withdrawal method
              </p>
            </div>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="rounded-lg bg-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-600"
              >
                Edit
              </button>
            )}
          </div>
          <div className="p-5 space-y-4">
            {editMode ? (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                    Method
                  </label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none"
                  >
                    <option value="crypto">Crypto</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>
                {payoutMethod === "crypto" && (
                  <>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                        Network
                      </label>
                      <select
                        value={network}
                        onChange={(e) => setNetwork(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none"
                      >
                        <option value="">Select network</option>
                        <option value="ethereum">Ethereum (ERC20)</option>
                        <option value="bsc">BNB Smart Chain (BEP20)</option>
                        <option value="polygon">Polygon</option>
                        <option value="bitcoin">Bitcoin</option>
                        <option value="tron">TRON (TRC20)</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                        Wallet Address
                      </label>
                      <input
                        type="text"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none"
                        placeholder="0x..."
                      />
                    </div>
                  </>
                )}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-300 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-600"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      data.payout_method === "crypto"
                        ? "bg-orange-400/10 text-orange-400"
                        : data.payout_method === "bank"
                          ? "bg-blue-400/10 text-blue-400"
                          : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {data.payout_method === "crypto" ? (
                      <Bitcoin className="h-6 w-6" />
                    ) : data.payout_method === "bank" ? (
                      <CreditCard className="h-6 w-6" />
                    ) : (
                      <Wallet className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white capitalize">
                      {data.payout_method || "Not configured"}
                    </p>
                    {data.payout_details?.network && (
                      <p className="text-sm text-zinc-500">
                        {data.payout_details.network.toUpperCase()} Network
                      </p>
                    )}
                  </div>
                </div>
                {data.payout_details?.wallet_address && (
                  <div className="rounded-lg bg-zinc-800/50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">
                        Wallet Address
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            data.payout_details!.wallet_address,
                            "Address"
                          )
                        }
                        className="text-zinc-500 hover:text-white"
                      >
                        {copied === "Address" ? (
                          <Check className="h-3.5 w-3.5 text-green-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <code className="mt-1 block break-all text-sm text-zinc-300">
                      {data.payout_details.wallet_address}
                    </code>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="border-b border-zinc-800 px-5 py-4">
            <h2 className="font-semibold text-white">User Profile</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Onboarding and account details
            </p>
          </div>
          <div className="p-5 space-y-3">
            {data.onboarding?.details && (
              <>
                {data.onboarding.details.name && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Full Name</span>
                    <span className="text-zinc-300">
                      {data.onboarding.details.name}
                    </span>
                  </div>
                )}
                {data.onboarding.details.phone && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Phone</span>
                    <span className="text-zinc-300">
                      {data.onboarding.details.phone}
                    </span>
                  </div>
                )}
                {data.onboarding.details.country && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Country</span>
                    <span className="text-zinc-300">
                      {data.onboarding.details.country}
                    </span>
                  </div>
                )}
              </>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Onboarding Status</span>
              <span
                className={`font-medium ${
                  (data.onboarding?.step_completed ?? 0) >= 2
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                {(data.onboarding?.step_completed ?? 0) >= 2
                  ? "Complete"
                  : `Step ${data.onboarding?.step_completed ?? 0} of 2`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Registered</span>
              <span className="text-zinc-300">
                {new Date(data.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Linked Bank Accounts */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h2 className="font-semibold text-white">Linked Bank Accounts</h2>
          <p className="mt-1 text-sm text-zinc-500">Self-submitted accounts awaiting or under compliance review</p>
        </div>
        <div className="divide-y divide-zinc-800">
          {data.bank_accounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Building2 className="h-8 w-8 text-zinc-600" />
              <p className="mt-2 text-sm text-zinc-500">No bank accounts submitted</p>
            </div>
          ) : (
            data.bank_accounts.map((account) => (
              <div key={account.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{account.bank_name}</p>
                    {account.is_default && <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium uppercase text-zinc-400">Default</span>}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        account.status === "verified"
                          ? "bg-green-400/10 text-green-400"
                          : account.status === "rejected"
                            ? "bg-red-400/10 text-red-400"
                            : "bg-yellow-400/10 text-yellow-400"
                      }`}
                    >
                      {account.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    {account.account_holder_name} · {account.account_type} · ••••{account.account_number.slice(-4)} · {account.currency} · {account.country}
                  </p>
                  {account.routing_number && <p className="mt-0.5 text-xs text-zinc-600">Routing: {account.routing_number}</p>}
                  {account.iban && <p className="mt-0.5 text-xs text-zinc-600">IBAN: {account.iban}</p>}
                  {account.swift_bic && <p className="mt-0.5 text-xs text-zinc-600">SWIFT/BIC: {account.swift_bic}</p>}
                  {account.admin_notes && <p className="mt-1 text-xs text-zinc-400">Note: {account.admin_notes}</p>}
                </div>
                {account.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => reviewBankAccount(account.id, "verified")}
                      disabled={reviewingId === account.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/20 disabled:opacity-50"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verify
                    </button>
                    <button
                      onClick={() => reviewBankAccount(account.id, "rejected")}
                      disabled={reviewingId === account.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Balances */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h2 className="font-semibold text-white">Asset Balances</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Current holdings across all networks
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-800 bg-zinc-900/30">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                  Asset
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                  Network
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-zinc-500">
                  Balance
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-zinc-500">
                  Admin Balance
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-zinc-500">
                  USD Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {data.balances.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center">
                    <DollarSign className="mx-auto h-6 w-6 text-zinc-600" />
                    <p className="mt-2 text-sm text-zinc-500">No balances</p>
                  </td>
                </tr>
              ) : (
                data.balances.map((balance, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/30">
                    <td className="px-5 py-3 font-medium text-white">
                      {balance.token_symbol}
                    </td>
                    <td className="px-5 py-3 text-sm text-zinc-400">
                      {balance.network}
                    </td>
                    <td className="px-5 py-3 text-right text-sm text-zinc-300">
                      {parseFloat(balance.balance || "0").toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right text-sm text-yellow-400">
                      {parseFloat(balance.admin_balance || "0").toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right text-sm text-white">
                      ${balance.usd_value?.toLocaleString() || "0.00"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h2 className="font-semibold text-white">Recent Transactions</h2>
          <p className="mt-1 text-sm text-zinc-500">Last 10 transactions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-800 bg-zinc-900/30">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                  Type
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                  Amount
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-zinc-500">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-zinc-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {data.transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center">
                    <Clock className="mx-auto h-6 w-6 text-zinc-600" />
                    <p className="mt-2 text-sm text-zinc-500">
                      No transactions
                    </p>
                  </td>
                </tr>
              ) : (
                data.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-800/30">
                    <td className="px-5 py-3 text-sm font-medium capitalize text-zinc-300">
                      {tx.transaction_type}
                    </td>
                    <td className="px-5 py-3 text-sm text-white">
                      {tx.amount} {tx.token_symbol}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          tx.status === "confirmed" || tx.status === "completed"
                            ? "bg-green-400/10 text-green-400"
                            : tx.status === "pending"
                              ? "bg-yellow-400/10 text-yellow-400"
                              : "bg-zinc-700 text-zinc-400"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-sm text-zinc-400">
                      {new Date(tx.created_at).toLocaleDateString()}
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
