import { createServiceRoleClient } from "@/utils/supabase/server";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Wallet,
  Globe,
  ExternalLink,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { RecoveryStatusSelect } from "./_components/recovery-status-select";

interface RecoveryRequest {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  wallet_type: string;
  wallet_address: string | null;
  status: string;
  created_at: string;
  country: string | null;
  telegram: string | null;
}

async function getRecoveryRequests(): Promise<RecoveryRequest[]> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("recovery_requests")
    .select("id, user_id, full_name, email, phone, wallet_type, wallet_address, status, created_at, country, telegram")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch recovery requests:", error);
    return [];
  }

  return data || [];
}

const statusConfig: Record<string, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: "Pending", icon: Clock, className: "bg-yellow-400/10 text-yellow-400" },
  in_progress: { label: "In Progress", icon: AlertCircle, className: "bg-blue-400/10 text-blue-400" },
  completed: { label: "Completed", icon: CheckCircle2, className: "bg-green-400/10 text-green-400" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-red-400/10 text-red-400" },
};

export default async function AdminRecoveryPage() {
  const requests = await getRecoveryRequests();

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const inProgressCount = requests.filter((r) => r.status === "in_progress").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Recovery Requests</h1>
          <p className="mt-1 text-zinc-400">
            Manage wallet recovery assistance requests
          </p>
        </div>
        <div className="flex gap-3">
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-400/10 px-3 py-1.5 text-sm font-medium text-yellow-400">
              <Clock className="h-4 w-4" />
              {pendingCount} Pending
            </span>
          )}
          {inProgressCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-400/10 px-3 py-1.5 text-sm font-medium text-blue-400">
              <AlertCircle className="h-4 w-4" />
              {inProgressCount} In Progress
            </span>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-800 bg-zinc-900/50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Requester
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Contact
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Wallet
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Submitted
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <ShieldCheck className="mx-auto h-8 w-8 text-zinc-600" />
                    <p className="mt-2 text-sm text-zinc-500">
                      No recovery requests yet
                    </p>
                  </td>
                </tr>
              ) : (
                requests.map((request) => {
                  const status = statusConfig[request.status] || statusConfig.pending;
                  const StatusIcon = status.icon;

                  return (
                    <tr key={request.id} className="hover:bg-zinc-800/50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {request.full_name}
                            </p>
                            {request.country && (
                              <p className="flex items-center gap-1 text-xs text-zinc-500">
                                <Globe className="h-3 w-3" />
                                {request.country}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <p className="flex items-center gap-1.5 text-sm text-zinc-300">
                            <Mail className="h-3.5 w-3.5 text-zinc-500" />
                            {request.email}
                          </p>
                          {request.phone && (
                            <p className="flex items-center gap-1.5 text-sm text-zinc-400">
                              <Phone className="h-3.5 w-3.5 text-zinc-500" />
                              {request.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-zinc-500" />
                          <span className="text-sm text-zinc-300">
                            {request.wallet_type}
                          </span>
                        </div>
                        {request.wallet_address && (
                          <code className="mt-1 block rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                            {request.wallet_address.slice(0, 10)}...
                            {request.wallet_address.slice(-6)}
                          </code>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <RecoveryStatusSelect
                          requestId={request.id}
                          currentStatus={request.status}
                        />
                      </td>
                      <td className="px-5 py-4 text-right text-sm text-zinc-400">
                        {new Date(request.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/recovery/${request.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-600"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
