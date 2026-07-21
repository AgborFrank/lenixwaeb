import { createServiceRoleClient } from "@/utils/supabase/server";
import {
  Search,
  Building2,
  Wallet,
  Bitcoin,
  CreditCard,
  ExternalLink,
  User,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Phone,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { BankingApplicationStatusSelect } from "./_components/banking-status-select";

interface UserBankingData {
  user_id: string;
  email: string | null;
  display_name: string;
  payout_method: string | null;
  payout_details: {
    network?: string;
    wallet_address?: string;
    bank_name?: string;
    account_number?: string;
    routing_number?: string;
    account_holder?: string;
    memo?: string;
  } | null;
  total_balance_usd: number;
  asset_count: number;
  created_at: string;
}

interface BankingApplication {
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
  created_at: string;
  admin_notes: string | null;
}

function getDisplayName(email: string | null | undefined, name?: string): string {
  if (name) return name;
  if (!email) return "Unknown User";
  const localPart = email.split("@")[0];
  return localPart
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function getBankingApplications(): Promise<BankingApplication[]> {
  const supabase = createServiceRoleClient();

  const { data: applications } = await supabase
    .from("web_onboarding")
    .select("user_id, service_type, details, step_completed, status, admin_notes, created_at")
    .eq("service_type", "banking")
    .order("created_at", { ascending: false });

  if (!applications || applications.length === 0) {
    return [];
  }

  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const userEmails: Record<string, string | null> = {};
  authUsers?.users?.forEach((u) => {
    userEmails[u.id] = u.email ?? null;
  });

  return applications.map((app) => {
    const email = userEmails[app.user_id] ?? null;
    const details = (app.details || {}) as BankingApplication["details"];
    return {
      user_id: app.user_id,
      email,
      display_name: getDisplayName(email, details.name),
      service_type: app.service_type,
      details,
      status: app.status || "pending",
      step_completed: app.step_completed,
      created_at: app.created_at,
      admin_notes: app.admin_notes,
    };
  });
}

async function getBankingUsers(search?: string): Promise<UserBankingData[]> {
  const supabase = createServiceRoleClient();

  const { data: payouts } = await supabase
    .from("web_loan_payouts")
    .select("user_id, payout_method, payout_details, created_at")
    .order("created_at", { ascending: false });

  if (!payouts || payouts.length === 0) {
    return [];
  }

  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const userEmails: Record<string, string | null> = {};
  authUsers?.users?.forEach((u) => {
    userEmails[u.id] = u.email ?? null;
  });

  const userIds = payouts.map((p) => p.user_id);
  const { data: balances } = await supabase
    .from("user_balances")
    .select("user_id, usd_value")
    .in("user_id", userIds);

  const userBalances: Record<string, { total: number; count: number }> = {};
  balances?.forEach((b) => {
    if (!userBalances[b.user_id]) {
      userBalances[b.user_id] = { total: 0, count: 0 };
    }
    userBalances[b.user_id].total += Number(b.usd_value || 0);
    userBalances[b.user_id].count += 1;
  });

  let results = payouts.map((p) => {
    const email = userEmails[p.user_id] ?? null;
    return {
      user_id: p.user_id,
      email,
      display_name: getDisplayName(email),
      payout_method: p.payout_method,
      payout_details: p.payout_details as UserBankingData["payout_details"],
      total_balance_usd: userBalances[p.user_id]?.total || 0,
      asset_count: userBalances[p.user_id]?.count || 0,
      created_at: p.created_at,
    };
  });

  if (search) {
    const searchLower = search.toLowerCase();
    results = results.filter(
      (r) =>
        r.email?.toLowerCase().includes(searchLower) ||
        r.display_name.toLowerCase().includes(searchLower) ||
        r.payout_details?.wallet_address?.toLowerCase().includes(searchLower) ||
        r.user_id.toLowerCase().includes(searchLower)
    );
  }

  return results;
}

const statusConfig: Record<string, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: "Pending", icon: Clock, className: "bg-yellow-400/10 text-yellow-400" },
  under_review: { label: "Under Review", icon: FileText, className: "bg-blue-400/10 text-blue-400" },
  approved: { label: "Approved", icon: CheckCircle2, className: "bg-green-400/10 text-green-400" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-red-400/10 text-red-400" },
};

export default async function AdminBankingPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; tab?: string }>;
}) {
  const { search, tab = "applications" } = await searchParams;
  const applications = await getBankingApplications();
  const users = await getBankingUsers(search);

  const pendingCount = applications.filter((a) => a.status === "pending" || a.status === "under_review").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Banking Services</h1>
          <p className="mt-1 text-zinc-400">
            Manage banking applications and user payout methods
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-yellow-400/10 px-3 py-2">
              <Clock className="h-4 w-4 text-yellow-400" />
              <span className="text-yellow-400">{pendingCount} pending review</span>
            </div>
          )}
          <div className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2">
            <User className="h-4 w-4 text-zinc-500" />
            <span className="text-zinc-300">{applications.length} applications</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-800">
        <div className="flex gap-4">
          <Link
            href="/admin/banking?tab=applications"
            className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
              tab === "applications"
                ? "border-yellow-400 text-white"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Banking Applications ({applications.length})
          </Link>
          <Link
            href="/admin/banking?tab=payouts"
            className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
              tab === "payouts"
                ? "border-yellow-400 text-white"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Payout Methods ({users.length})
          </Link>
        </div>
      </div>

      {tab === "applications" ? (
        /* Banking Applications Tab */
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-800 bg-zinc-900/50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Applicant
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Contact
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Service
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
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <Building2 className="mx-auto h-8 w-8 text-zinc-600" />
                      <p className="mt-2 text-sm text-zinc-500">
                        No banking applications yet
                      </p>
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => {
                    const status = statusConfig[app.status] || statusConfig.pending;

                    return (
                      <tr key={app.user_id} className="hover:bg-zinc-800/50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold text-yellow-400">
                              {app.display_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {app.display_name}
                              </p>
                              <p className="text-xs text-zinc-500">
                                {app.email || app.user_id.slice(0, 12) + "..."}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            {app.details.phone_number && (
                              <p className="flex items-center gap-1.5 text-sm text-zinc-300">
                                <Phone className="h-3.5 w-3.5 text-zinc-500" />
                                {app.details.country_phone_code?.split(":")[1] || ""}{app.details.phone_number}
                              </p>
                            )}
                            {app.details.country && (
                              <p className="flex items-center gap-1.5 text-xs text-zinc-400">
                                <Globe className="h-3 w-3 text-zinc-500" />
                                {app.details.country}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-400/10 px-2.5 py-1 text-xs font-medium text-blue-400">
                            <Building2 className="h-3 w-3" />
                            {app.details.banking_service || "Banking"}
                          </span>
                          {app.details.notes && (
                            <p className="mt-1 max-w-xs truncate text-xs text-zinc-500">
                              {app.details.notes}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <BankingApplicationStatusSelect
                            userId={app.user_id}
                            currentStatus={app.status}
                          />
                        </td>
                        <td className="px-5 py-4 text-right text-sm text-zinc-400">
                          {new Date(app.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/admin/banking/application/${app.user_id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-600"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Review
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
      ) : (
        /* Payout Methods Tab */
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="border-b border-zinc-800 p-4">
            <form className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search by email, name, or wallet address..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
              />
              <input type="hidden" name="tab" value="payouts" />
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-800 bg-zinc-900/50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    User
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Payout Method
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Payout Details
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Total Balance
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Registered
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <Building2 className="mx-auto h-8 w-8 text-zinc-600" />
                      <p className="mt-2 text-sm text-zinc-500">
                        {search
                          ? "No users found matching your search"
                          : "No payout methods configured yet"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.user_id} className="hover:bg-zinc-800/50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold text-yellow-400">
                            {user.display_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {user.display_name}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {user.email || user.user_id.slice(0, 12) + "..."}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                            user.payout_method === "crypto"
                              ? "bg-orange-400/10 text-orange-400"
                              : user.payout_method === "bank"
                                ? "bg-blue-400/10 text-blue-400"
                                : "bg-zinc-700 text-zinc-400"
                          }`}
                        >
                          {user.payout_method === "crypto" ? (
                            <Bitcoin className="h-3 w-3" />
                          ) : user.payout_method === "bank" ? (
                            <CreditCard className="h-3 w-3" />
                          ) : (
                            <Wallet className="h-3 w-3" />
                          )}
                          {user.payout_method || "Not set"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {user.payout_details ? (
                          <div className="max-w-xs">
                            {user.payout_method === "crypto" ? (
                              <div>
                                <p className="text-xs text-zinc-400">
                                  {user.payout_details.network?.toUpperCase() || "Unknown"} Network
                                </p>
                                <code className="mt-1 block truncate rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                                  {user.payout_details.wallet_address || "No address"}
                                </code>
                              </div>
                            ) : user.payout_method === "bank" ? (
                              <div>
                                <p className="text-xs font-medium text-zinc-300">
                                  {user.payout_details.bank_name || "Bank"}
                                </p>
                                <p className="text-xs text-zinc-500">
                                  ****{user.payout_details.account_number?.slice(-4) || "****"}
                                </p>
                              </div>
                            ) : (
                              <span className="text-xs text-zinc-500">-</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-zinc-500">No details</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-zinc-500" />
                          <span className="font-medium text-white">
                            {user.total_balance_usd.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {user.asset_count} assets
                        </p>
                      </td>
                      <td className="px-5 py-4 text-right text-sm text-zinc-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/balances?user=${user.user_id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-400/10 px-3 py-1.5 text-xs font-medium text-yellow-400 transition-colors hover:bg-yellow-400/20"
                          >
                            <Wallet className="h-3 w-3" />
                            Balances
                          </Link>
                          <Link
                            href={`/admin/banking/${user.user_id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-600"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
