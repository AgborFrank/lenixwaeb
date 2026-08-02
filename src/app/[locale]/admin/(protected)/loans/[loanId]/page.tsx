"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Globe,
  Wallet,
  Banknote,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Check,
  Loader2,
  Save,
  Calendar,
  Percent,
  Shield,
  DollarSign,
  Hash,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

interface LoanDetails {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  collateral_amount: number;
  collateral_currency: string;
  interest_rate: number;
  duration_days: number;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string | null;
  user: {
    email: string | null;
    display_name: string;
  } | null;
  onboarding: {
    details: Record<string, any>;
    step_completed: number;
  } | null;
  payout: {
    payout_method: string;
    payout_details: Record<string, any>;
  } | null;
  balances: {
    token_symbol: string;
    balance: string;
    admin_balance: string;
    network: string;
    usd_value: number;
  }[];
}

const statuses = [
  { value: "pending", label: "Pending Review", icon: Clock, className: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30" },
  { value: "approved", label: "Approved", icon: CheckCircle2, className: "bg-green-400/10 text-green-400 border-green-400/30" },
  { value: "active", label: "Active", icon: TrendingUp, className: "bg-blue-400/10 text-blue-400 border-blue-400/30" },
  { value: "completed", label: "Completed", icon: CheckCircle2, className: "bg-emerald-400/10 text-emerald-400 border-emerald-400/30" },
  { value: "rejected", label: "Rejected", icon: XCircle, className: "bg-red-400/10 text-red-400 border-red-400/30" },
  { value: "defaulted", label: "Defaulted", icon: AlertCircle, className: "bg-red-400/10 text-red-400 border-red-400/30" },
];

export default function LoanDetailPage() {
  const params = useParams();
  const loanId = params.loanId as string;

  const [data, setData] = useState<LoanDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState<string>("");

  useEffect(() => {
    fetchLoan();
  }, [loanId]);

  async function fetchLoan() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/loans/${loanId}`);
      const result = await res.json();
      if (res.ok && result.data) {
        setData(result.data);
        setStatus(result.data.status);
        setAdminNotes(result.data.admin_notes || "");
      } else {
        toast.error(result.error || "Failed to load loan");
      }
    } catch {
      toast.error("Failed to load loan");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusUpdate() {
    if (!data) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/loans", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: loanId,
          status,
          adminNotes,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Loan updated successfully");
        fetchLoan();
      } else {
        toast.error(result.error || "Failed to update");
      }
    } catch {
      toast.error("Failed to update");
    } finally {
      setIsSaving(false);
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copied to clipboard`);
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
        <Banknote className="h-12 w-12 text-zinc-600" />
        <p className="mt-4 text-zinc-400">Loan not found</p>
        <Link
          href="/admin/loans"
          className="mt-4 text-sm text-yellow-400 hover:underline"
        >
          Back to Loans
        </Link>
      </div>
    );
  }

  const currentStatusConfig = statuses.find((s) => s.value === data.status) || statuses[0];
  const StatusIcon = currentStatusConfig.icon;
  const collateralRatio = ((Number(data.collateral_amount) / Number(data.amount)) * 100).toFixed(1);
  const totalInterest = (Number(data.amount) * (Number(data.interest_rate) / 100) * (data.duration_days / 365)).toFixed(2);
  const totalRepayment = (Number(data.amount) + Number(totalInterest)).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/loans"
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">
            ${Number(data.amount).toLocaleString()} {data.currency} Loan
          </h1>
          <p className="mt-1 text-zinc-400">Loan #{data.id.slice(0, 8)}</p>
        </div>
        <div className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ${currentStatusConfig.className}`}>
          <StatusIcon className="h-4 w-4" />
          <span className="font-medium">{currentStatusConfig.label}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Loan and User details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Loan Summary */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="border-b border-zinc-800 px-5 py-4">
              <h2 className="font-semibold text-white">Loan Summary</h2>
            </div>
            <div className="grid gap-6 p-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-zinc-800/50 p-4">
                <div className="flex items-center gap-2 text-zinc-500">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-xs">Loan Amount</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-white">
                  ${Number(data.amount).toLocaleString()}
                </p>
                <p className="text-sm text-zinc-400">{data.currency}</p>
              </div>
              <div className="rounded-lg bg-zinc-800/50 p-4">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs">Collateral</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-white">
                  {Number(data.collateral_amount).toLocaleString()}
                </p>
                <p className="text-sm text-zinc-400">{data.collateral_currency}</p>
              </div>
              <div className="rounded-lg bg-zinc-800/50 p-4">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Percent className="h-4 w-4" />
                  <span className="text-xs">Interest Rate</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-white">
                  {data.interest_rate}%
                </p>
                <p className="text-sm text-zinc-400">APR</p>
              </div>
              <div className="rounded-lg bg-zinc-800/50 p-4">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs">Duration</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-white">
                  {data.duration_days}
                </p>
                <p className="text-sm text-zinc-400">days</p>
              </div>
            </div>
            <div className="border-t border-zinc-800 p-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex justify-between sm:flex-col sm:gap-1">
                  <span className="text-sm text-zinc-500">Collateral Ratio</span>
                  <span className="font-medium text-white">{collateralRatio}%</span>
                </div>
                <div className="flex justify-between sm:flex-col sm:gap-1">
                  <span className="text-sm text-zinc-500">Est. Interest</span>
                  <span className="font-medium text-white">${totalInterest}</span>
                </div>
                <div className="flex justify-between sm:flex-col sm:gap-1">
                  <span className="text-sm text-zinc-500">Total Repayment</span>
                  <span className="font-medium text-green-400">${totalRepayment}</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="border-b border-zinc-800 px-5 py-4">
              <h2 className="font-semibold text-white">Borrower Information</h2>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Name</p>
                  <p className="font-medium text-white">
                    {data.onboarding?.details?.name || data.user?.display_name || "Unknown"}
                  </p>
                </div>
              </div>
              {data.user?.email && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Email</p>
                    <p className="font-medium text-white">{data.user.email}</p>
                  </div>
                </div>
              )}
              {data.onboarding?.details?.phone && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Phone</p>
                    <p className="font-medium text-white">{data.onboarding.details.phone}</p>
                  </div>
                </div>
              )}
              {data.onboarding?.details?.country && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Country</p>
                    <p className="font-medium text-white">{data.onboarding.details.country}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
                  <Hash className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">User ID</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-zinc-300">{data.user_id}</code>
                    <button
                      onClick={() => copyToClipboard(data.user_id, "User ID")}
                      className="text-zinc-500 hover:text-white"
                    >
                      {copied === "User ID" ? (
                        <Check className="h-3.5 w-3.5 text-green-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payout Method */}
          {data.payout && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
              <div className="border-b border-zinc-800 px-5 py-4">
                <h2 className="font-semibold text-white">Payout Method</h2>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-400/10 text-orange-400">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Method</p>
                    <p className="font-medium text-white capitalize">{data.payout.payout_method}</p>
                  </div>
                </div>
                {data.payout.payout_details?.wallet_address && (
                  <div className="mt-4 rounded-lg bg-zinc-800/50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">
                        {data.payout.payout_details.network?.toUpperCase()} Address
                      </span>
                      <button
                        onClick={() => copyToClipboard(data.payout!.payout_details.wallet_address, "Address")}
                        className="text-zinc-500 hover:text-white"
                      >
                        {copied === "Address" ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <code className="mt-2 block break-all text-sm text-zinc-300">
                      {data.payout.payout_details.wallet_address}
                    </code>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Balances */}
          {data.balances && data.balances.length > 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
              <div className="border-b border-zinc-800 px-5 py-4">
                <h2 className="font-semibold text-white">User Assets</h2>
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
                        USD Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {data.balances.map((balance, idx) => (
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
                        <td className="px-5 py-3 text-right text-sm text-white">
                          ${balance.usd_value?.toLocaleString() || "0.00"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right column - Status management */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="border-b border-zinc-800 px-5 py-4">
              <h2 className="font-semibold text-white">Manage Loan</h2>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">
                  Status
                </label>
                <div className="space-y-2">
                  {statuses.map((s) => {
                    const Icon = s.icon;
                    return (
                      <label
                        key={s.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                          status === s.value
                            ? s.className + " border-current"
                            : "border-zinc-700 hover:border-zinc-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={s.value}
                          checked={status === s.value}
                          onChange={(e) => setStatus(e.target.value)}
                          className="sr-only"
                        />
                        <Icon className={`h-4 w-4 ${status === s.value ? "" : "text-zinc-500"}`} />
                        <span className={`text-sm font-medium ${status === s.value ? "" : "text-zinc-400"}`}>
                          {s.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">
                  Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-yellow-400/50 focus:outline-none"
                  placeholder="Internal notes about this loan..."
                />
              </div>

              <button
                onClick={handleStatusUpdate}
                disabled={isSaving}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-black hover:bg-yellow-300 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Update Loan
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="border-b border-zinc-800 px-5 py-4">
              <h2 className="font-semibold text-white">Timeline</h2>
            </div>
            <div className="space-y-3 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Applied</p>
                  <p className="text-sm text-zinc-300">
                    {new Date(data.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              {data.updated_at && data.updated_at !== data.created_at && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Last Updated</p>
                    <p className="text-sm text-zinc-300">
                      {new Date(data.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="mb-3 text-sm font-medium text-zinc-400">Quick Actions</h3>
            <div className="space-y-2">
              {data.user?.email && (
                <a
                  href={`mailto:${data.user.email}`}
                  className="flex w-full items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </a>
              )}
              <Link
                href={`/admin/balances?user=${data.user_id}`}
                className="flex w-full items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
              >
                <Wallet className="h-4 w-4" />
                Manage Balances
              </Link>
              <Link
                href={`/admin/banking/${data.user_id}`}
                className="flex w-full items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
              >
                <Banknote className="h-4 w-4" />
                Banking Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
