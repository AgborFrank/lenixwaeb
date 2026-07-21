"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Globe,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Loader2,
  Save,
  Calendar,
  MessageSquare,
  Hash,
} from "lucide-react";
import { toast } from "sonner";

interface ApplicationDetails {
  user_id: string;
  email: string | null;
  display_name: string;
  service_type: string;
  details: {
    name?: string;
    notes?: string;
    country?: string;
    phone_number?: string;
    banking_service?: string;
    country_phone_code?: string;
  };
  status: string;
  step_completed: number;
  admin_notes: string | null;
  created_at: string;
  updated_at: string | null;
  reviewed_at: string | null;
}

const statuses = [
  { value: "pending", label: "Pending Review", icon: Clock, className: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30" },
  { value: "under_review", label: "Under Review", icon: FileText, className: "bg-blue-400/10 text-blue-400 border-blue-400/30" },
  { value: "approved", label: "Approved", icon: CheckCircle2, className: "bg-green-400/10 text-green-400 border-green-400/30" },
  { value: "rejected", label: "Rejected", icon: XCircle, className: "bg-red-400/10 text-red-400 border-red-400/30" },
];

export default function BankingApplicationDetailPage() {
  const params = useParams();
  const userId = params.userId as string;

  const [data, setData] = useState<ApplicationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState<string>("");

  useEffect(() => {
    fetchApplication();
  }, [userId]);

  async function fetchApplication() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/banking/application?user_id=${userId}`);
      const result = await res.json();
      if (res.ok && result.data) {
        setData(result.data);
        setStatus(result.data.status || "pending");
        setAdminNotes(result.data.admin_notes || "");
      } else {
        toast.error(result.error || "Failed to load application");
      }
    } catch {
      toast.error("Failed to load application");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusUpdate() {
    if (!data) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/banking/application", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          status,
          admin_notes: adminNotes,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Application updated successfully");
        fetchApplication();
      } else {
        toast.error(result.error || "Failed to update");
      }
    } catch {
      toast.error("Failed to update");
    } finally {
      setIsSaving(false);
    }
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
        <Building2 className="h-12 w-12 text-zinc-600" />
        <p className="mt-4 text-zinc-400">Application not found</p>
        <Link
          href="/admin/banking"
          className="mt-4 text-sm text-yellow-400 hover:underline"
        >
          Back to Banking
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
          href="/admin/banking"
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{data.display_name}</h1>
          <p className="mt-1 text-zinc-400">Banking Service Application</p>
        </div>
        <div className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ${currentStatusConfig.className}`}>
          <StatusIcon className="h-4 w-4" />
          <span className="font-medium">{currentStatusConfig.label}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Application details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Applicant Information */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="border-b border-zinc-800 px-5 py-4">
              <h2 className="font-semibold text-white">Applicant Information</h2>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Full Name</p>
                  <p className="font-medium text-white">{data.details.name || "Not provided"}</p>
                </div>
              </div>
              {data.email && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Email</p>
                    <p className="font-medium text-white">{data.email}</p>
                  </div>
                </div>
              )}
              {data.details.phone_number && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Phone Number</p>
                    <p className="font-medium text-white">
                      {data.details.country_phone_code?.split(":")[1] || ""}{data.details.phone_number}
                    </p>
                  </div>
                </div>
              )}
              {data.details.country && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Country</p>
                    <p className="font-medium text-white">{data.details.country}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
                  <Hash className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">User ID</p>
                  <code className="text-sm text-zinc-300">{data.user_id}</code>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="border-b border-zinc-800 px-5 py-4">
              <h2 className="font-semibold text-white">Service Details</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-400/10 text-blue-400">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Banking Service Type</p>
                  <p className="font-medium text-white capitalize">
                    {data.details.banking_service || "General Banking"}
                  </p>
                </div>
              </div>

              {data.details.notes && (
                <div className="rounded-lg bg-zinc-800/50 p-4">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Additional Notes
                  </div>
                  <p className="mt-2 text-sm text-zinc-300 whitespace-pre-wrap">
                    {data.details.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 rounded-lg bg-zinc-800/50 px-4 py-3">
                <span className="text-sm text-zinc-500">Onboarding Progress:</span>
                <span className={`text-sm font-medium ${data.step_completed >= 2 ? "text-green-400" : "text-yellow-400"}`}>
                  Step {data.step_completed} of 2 {data.step_completed >= 2 ? "(Complete)" : "(In Progress)"}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="border-b border-zinc-800 px-5 py-4">
              <h2 className="font-semibold text-white">Application Timeline</h2>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-400/10 text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Application Received</p>
                    <p className="text-xs text-zinc-500">
                      {new Date(data.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {data.status === "under_review" && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-400/10 text-blue-400">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Under Review</p>
                      <p className="text-xs text-zinc-500">Team is currently analyzing your request</p>
                    </div>
                  </div>
                )}

                {data.status === "approved" && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-400/10 text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Approved</p>
                      <p className="text-xs text-zinc-500">
                        {data.reviewed_at ? new Date(data.reviewed_at).toLocaleString() : "Recently approved"}
                      </p>
                    </div>
                  </div>
                )}

                {data.status === "rejected" && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-400/10 text-red-400">
                      <XCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Rejected</p>
                      <p className="text-xs text-zinc-500">
                        {data.reviewed_at ? new Date(data.reviewed_at).toLocaleString() : "Recently rejected"}
                      </p>
                    </div>
                  </div>
                )}

                {(data.status === "pending" || data.status === "under_review") && (
                  <div className="flex items-start gap-4 opacity-50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-zinc-600">
                      <Clock className="h-4 w-4 text-zinc-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-500">Awaiting Decision</p>
                      <p className="text-xs text-zinc-600">Pending admin review</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Status management */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="border-b border-zinc-800 px-5 py-4">
              <h2 className="font-semibold text-white">Review Application</h2>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">
                  Update Status
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
                  placeholder="Internal notes about this application..."
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
                Update Application
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="mb-3 text-sm font-medium text-zinc-400">Quick Actions</h3>
            <div className="space-y-2">
              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="flex w-full items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
                >
                  <Mail className="h-4 w-4" />
                  Contact Applicant
                </a>
              )}
              <Link
                href={`/admin/balances?user=${data.user_id}`}
                className="flex w-full items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
              >
                <Building2 className="h-4 w-4" />
                View User Balances
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
