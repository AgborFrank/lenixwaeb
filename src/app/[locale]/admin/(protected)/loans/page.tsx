import { createServiceRoleClient } from "@/utils/supabase/server";
import {
  Banknote,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LoanStatusSelect } from "./_components/loan-status-select";

interface Loan {
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
}

async function getLoans(): Promise<Loan[]> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("loans")
    .select("id, user_id, amount, currency, collateral_amount, collateral_currency, interest_rate, duration_days, status, admin_notes, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch loans:", error);
    return [];
  }

  return data || [];
}

const statusConfig: Record<string, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: "Pending", icon: Clock, className: "bg-yellow-400/10 text-yellow-400" },
  approved: { label: "Approved", icon: CheckCircle2, className: "bg-green-400/10 text-green-400" },
  active: { label: "Active", icon: TrendingUp, className: "bg-blue-400/10 text-blue-400" },
  completed: { label: "Completed", icon: CheckCircle2, className: "bg-green-400/10 text-green-400" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-red-400/10 text-red-400" },
  defaulted: { label: "Defaulted", icon: AlertCircle, className: "bg-red-400/10 text-red-400" },
};

export default async function AdminLoansPage() {
  const loans = await getLoans();

  const pendingCount = loans.filter((l) => l.status === "pending").length;
  const activeCount = loans.filter((l) => l.status === "active" || l.status === "approved").length;

  const totalValue = loans
    .filter((l) => l.status === "active" || l.status === "approved")
    .reduce((sum, l) => sum + Number(l.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Loans</h1>
          <p className="mt-1 text-zinc-400">
            Manage loan applications and active loans
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-400/10 px-3 py-1.5 text-sm font-medium text-yellow-400">
              <Clock className="h-4 w-4" />
              {pendingCount} Pending
            </span>
          )}
          {activeCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-400/10 px-3 py-1.5 text-sm font-medium text-blue-400">
              <TrendingUp className="h-4 w-4" />
              {activeCount} Active
            </span>
          )}
          {totalValue > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-400/10 px-3 py-1.5 text-sm font-medium text-green-400">
              <Banknote className="h-4 w-4" />
              ${totalValue.toLocaleString()} Outstanding
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
                  Loan
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Collateral
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Terms
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Applied
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <Banknote className="mx-auto h-8 w-8 text-zinc-600" />
                    <p className="mt-2 text-sm text-zinc-500">
                      No loan applications yet
                    </p>
                  </td>
                </tr>
              ) : (
                loans.map((loan) => {
                  const status = statusConfig[loan.status] || statusConfig.pending;

                  return (
                    <tr key={loan.id} className="hover:bg-zinc-800/50">
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-lg font-semibold text-white">
                            ${Number(loan.amount).toLocaleString()}
                          </p>
                          <p className="text-sm text-zinc-500">
                            {loan.currency}
                          </p>
                          <code className="mt-1 block text-xs text-zinc-500">
                            User: {loan.user_id.slice(0, 8)}...
                          </code>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-zinc-300">
                            {Number(loan.collateral_amount).toLocaleString()} {loan.collateral_currency}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {((Number(loan.collateral_amount) / Number(loan.amount)) * 100).toFixed(0)}% ratio
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <p className="flex items-center gap-1.5 text-sm text-zinc-300">
                            <TrendingUp className="h-3.5 w-3.5 text-zinc-500" />
                            {loan.interest_rate}% APR
                          </p>
                          <p className="flex items-center gap-1.5 text-sm text-zinc-400">
                            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                            {loan.duration_days} days
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <LoanStatusSelect
                          loanId={loan.id}
                          currentStatus={loan.status}
                        />
                      </td>
                      <td className="px-5 py-4 text-right text-sm text-zinc-400">
                        {new Date(loan.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/loans/${loan.id}`}
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
