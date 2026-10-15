import {
  ShieldCheck,
  Clock,
  AlertCircle,
  User,
  Mail,
  ExternalLink,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { createServiceRoleClient } from "@/utils/supabase/server";
import { RefundStatusSelect } from "./_components/refund-status-select";

interface RefundRequest {
  id: string;
  role: string;
  full_name: string;
  email: string;
  counterparty_name: string | null;
  amount: string;
  asset: string;
  status: string;
  lifecycle: string;
  created_at: string;
}

async function getRefundRequests(): Promise<RefundRequest[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("refund_requests")
    .select("id, role, full_name, email, counterparty_name, amount, asset, status, lifecycle, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch refund requests:", error);
    return [];
  }

  return data || [];
}

export default async function AdminRefundsPage() {
  const requests = await getRefundRequests();
  const pendingCount = requests.filter((request) => request.status === "pending").length;
  const inProgressCount = requests.filter((request) => request.status === "in_progress").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Purchase Refunds</h1>
          <p className="mt-1 text-zinc-400">
            Intake queue. Instant payout is not enabled on these cases yet.
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
                  Claim
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
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <ShieldCheck className="mx-auto h-8 w-8 text-zinc-600" />
                    <p className="mt-2 text-sm text-zinc-500">No purchase refund cases yet</p>
                  </td>
                </tr>
              ) : (
                requests.map((request) => {
                  return (
                    <tr key={request.id} className="hover:bg-zinc-800/50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{request.full_name}</p>
                            <p className="text-xs capitalize text-zinc-500">{request.role}</p>
                            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-zinc-400">
                              <Mail className="h-3.5 w-3.5 text-zinc-500" />
                              {request.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-white">
                          {request.amount} {request.asset}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {request.counterparty_name || "No counterparty"}
                        </p>
                        <p className="mt-1 text-[11px] uppercase tracking-wide text-zinc-600">
                          {request.lifecycle}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <RefundStatusSelect requestId={request.id} currentStatus={request.status} />
                      </td>
                      <td className="px-5 py-4 text-right text-sm text-zinc-400">
                        {new Date(request.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/refunds/${request.id}`}
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
