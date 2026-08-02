"use client";

import { useEffect, useState } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Globe,
  Wallet,
  Key,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Check,
  Loader2,
  Save,
  MessageSquare,
  Shield,
  Calendar,
  Hash,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

interface RecoveryRequest {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  wallet_type: string;
  wallet_address: string | null;
  recovery_phrase: string | null;
  private_key: string | null;
  additional_details: string | null;
  status: string;
  created_at: string;
  updated_at: string | null;
  telegram: string | null;
  country: string | null;
  needs_short_questionnaire: boolean | null;
  questionnaire_data: Record<string, any> | null;
}

const statuses = [
  { value: "pending", label: "Pending Review", icon: Clock, className: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30" },
  { value: "in_progress", label: "In Progress", icon: AlertCircle, className: "bg-blue-400/10 text-blue-400 border-blue-400/30" },
  { value: "completed", label: "Completed", icon: CheckCircle2, className: "bg-green-400/10 text-green-400 border-green-400/30" },
  { value: "rejected", label: "Rejected", icon: XCircle, className: "bg-red-400/10 text-red-400 border-red-400/30" },
];

export default function RecoveryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.requestId as string;

  const [data, setData] = useState<RecoveryRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  async function fetchRequest() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/recovery/${requestId}`);
      const result = await res.json();
      if (res.ok && result.data) {
        setData(result.data);
        setStatus(result.data.status);
        setAdminNotes(result.data.admin_notes || "");
      } else {
        toast.error(result.error || "Failed to load request");
      }
    } catch {
      toast.error("Failed to load request");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusUpdate() {
    if (!data) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/recovery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: requestId, 
          status,
          admin_notes: adminNotes 
        }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Status updated successfully");
        fetchRequest();
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
        <Shield className="h-12 w-12 text-zinc-600" />
        <p className="mt-4 text-zinc-400">Recovery request not found</p>
        <Link
          href="/admin/recovery"
          className="mt-4 text-sm text-yellow-400 hover:underline"
        >
          Back to Recovery Requests
        </Link>
      </div>
    );
  }

  const currentStatusConfig = statuses.find((s) => s.value === data.status) || statuses[0];
  const StatusIcon = currentStatusConfig.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/recovery"
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{data.full_name}</h1>
          <p className="mt-1 text-zinc-400">Recovery Request #{data.id.slice(0, 8)}</p>
        </div>
        <div className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ${currentStatusConfig.className}`}>
          <StatusIcon className="h-4 w-4" />
          <span className="font-medium">{currentStatusConfig.label}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - User details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Contact Information */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="border-b border-zinc-800 px-5 py-4">
              <h2 className="font-semibold text-white">Contact Information</h2>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Full Name</p>
                  <p className="font-medium text-white">{data.full_name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Email</p>
                  <p className="font-medium text-white">{data.email}</p>
                </div>
              </div>
              {data.phone && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Phone</p>
                    <p className="font-medium text-white">{data.phone}</p>
                  </div>
                </div>
              )}
              {data.telegram && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Telegram</p>
                    <p className="font-medium text-white">{data.telegram}</p>
                  </div>
                </div>
              )}
              {data.country && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Country</p>
                    <p className="font-medium text-white">{data.country}</p>
                  </div>
                </div>
              )}
              {data.user_id && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
                    <Hash className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">User ID</p>
                    <code className="text-sm text-zinc-300">{data.user_id}</code>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Wallet Information */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="border-b border-zinc-800 px-5 py-4">
              <h2 className="font-semibold text-white">Wallet Information</h2>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-400/10 text-orange-400">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Wallet Type</p>
                  <p className="font-medium text-white">{data.wallet_type}</p>
                </div>
              </div>

              {data.wallet_address && (
                <div className="rounded-lg bg-zinc-800/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Wallet Address</span>
                    <button
                      onClick={() => copyToClipboard(data.wallet_address!, "Address")}
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
                    {data.wallet_address}
                  </code>
                </div>
              )}

              {data.recovery_phrase && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-red-400">
                      <Key className="h-3.5 w-3.5" />
                      Recovery Phrase (Sensitive)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowRecoveryPhrase(!showRecoveryPhrase)}
                        className="text-zinc-500 hover:text-white"
                      >
                        {showRecoveryPhrase ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(data.recovery_phrase!, "Recovery phrase")}
                        className="text-zinc-500 hover:text-white"
                      >
                        {copied === "Recovery phrase" ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <code className="mt-2 block break-all text-sm text-zinc-300">
                    {showRecoveryPhrase ? data.recovery_phrase : "••••••••••••••••••••••••••••••••"}
                  </code>
                </div>
              )}

              {data.private_key && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-red-400">
                      <Key className="h-3.5 w-3.5" />
                      Private Key (Sensitive)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowPrivateKey(!showPrivateKey)}
                        className="text-zinc-500 hover:text-white"
                      >
                        {showPrivateKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(data.private_key!, "Private key")}
                        className="text-zinc-500 hover:text-white"
                      >
                        {copied === "Private key" ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <code className="mt-2 block break-all text-sm text-zinc-300">
                    {showPrivateKey ? data.private_key : "••••••••••••••••••••••••••••••••"}
                  </code>
                </div>
              )}
            </div>
          </div>

          {/* Additional Details */}
          {data.additional_details && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
              <div className="border-b border-zinc-800 px-5 py-4">
                <h2 className="font-semibold text-white">Additional Details</h2>
              </div>
              <div className="p-5">
                <p className="whitespace-pre-wrap text-sm text-zinc-300">
                  {data.additional_details}
                </p>
              </div>
            </div>
          )}

          {/* Questionnaire Data */}
          {data.questionnaire_data && Object.keys(data.questionnaire_data).length > 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
              <div className="border-b border-zinc-800 px-5 py-4">
                <h2 className="font-semibold text-white">Questionnaire Responses</h2>
              </div>
              <div className="divide-y divide-zinc-800">
                {Object.entries(data.questionnaire_data).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-4 px-5 py-3">
                    <span className="text-sm text-zinc-500 capitalize">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-sm text-zinc-300">
                      {typeof value === "object" ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column - Status management */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="border-b border-zinc-800 px-5 py-4">
              <h2 className="font-semibold text-white">Manage Status</h2>
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
                  placeholder="Internal notes about this request..."
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
                Update Status
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
                  <p className="text-xs text-zinc-500">Submitted</p>
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
              <a
                href={`mailto:${data.email}`}
                className="flex w-full items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
              >
                <Mail className="h-4 w-4" />
                Send Email
              </a>
              {data.user_id && (
                <Link
                  href={`/admin/balances?user=${data.user_id}`}
                  className="flex w-full items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
                >
                  <Wallet className="h-4 w-4" />
                  View Balances
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
