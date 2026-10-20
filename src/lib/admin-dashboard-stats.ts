import type { User } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/utils/supabase/server";

export interface BalanceOperationRow {
  id: string;
  operation_type: string;
  token_symbol: string;
  amount: string | number;
  created_at: string;
}

export interface AdminDashboardStats {
  accounts: number;
  verified: number;
  unverified: number;
  withWallet: number;
  portfolioUsd: number;
  openRecovery: number;
  openRefunds: number;
  activeLoans: number;
  pendingAdmins: number;
  recentOperations: BalanceOperationRow[];
}

function isVerified(user: User): boolean {
  return Boolean(user.email_confirmed_at || user.phone_confirmed_at || user.confirmed_at);
}

async function listAllAuthUsers(
  supabase: ReturnType<typeof createServiceRoleClient>,
): Promise<User[]> {
  const users: User[] = [];
  let page = 1;
  const perPage = 200;

  while (page <= 100) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      console.error("Failed to list auth users:", error);
      break;
    }

    users.push(...data.users);
    if (data.users.length < perPage || data.nextPage == null) break;
    page = data.nextPage;
  }

  return users;
}

async function countUsersWithWallet(supabase: ReturnType<typeof createServiceRoleClient>) {
  const userIds = new Set<string>();
  const pageSize = 1000;
  let from = 0;

  while (from < 20000) {
    const { data, error } = await supabase
      .from("user_wallets")
      .select("user_id")
      .range(from, from + pageSize - 1);

    if (error) {
      console.error("Failed to list wallets:", error);
      break;
    }
    if (!data || data.length === 0) break;

    for (const row of data) {
      if (row.user_id) userIds.add(row.user_id);
    }
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return userIds.size;
}

async function sumPortfolioUsd(supabase: ReturnType<typeof createServiceRoleClient>) {
  let total = 0;
  const pageSize = 1000;
  let from = 0;

  while (from < 500000) {
    const { data, error } = await supabase
      .from("user_balances")
      .select("usd_value")
      .range(from, from + pageSize - 1);

    if (error) {
      console.error("Failed to sum balances:", error);
      break;
    }
    if (!data || data.length === 0) break;

    for (const row of data) {
      total += Number(row.usd_value || 0);
    }
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return total;
}

async function countPendingAdmins(supabase: ReturnType<typeof createServiceRoleClient>) {
  const { data, error } = await supabase.from("admin_users").select("role, is_active");

  if (error) {
    console.error("Failed to list admin users:", error);
    return 0;
  }

  return (data ?? []).filter((row) => row.role === "pending" || !row.is_active).length;
}

const OPEN_QUEUE_STATUSES = ["pending", "in_progress"] as const;
const ACTIVE_LOAN_STATUSES = ["active", "approved"] as const;

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const supabase = createServiceRoleClient();

  const authUsers = await listAllAuthUsers(supabase);
  let verified = 0;
  for (const user of authUsers) {
    if (isVerified(user)) verified += 1;
  }
  const accounts = authUsers.length;
  const unverified = accounts - verified;

  const [
    withWallet,
    portfolioUsd,
    openRecovery,
    openRefunds,
    activeLoans,
    pendingAdmins,
    recentResult,
  ] = await Promise.all([
    countUsersWithWallet(supabase),
    sumPortfolioUsd(supabase),
    supabase
      .from("recovery_requests")
      .select("*", { count: "exact", head: true })
      .in("status", [...OPEN_QUEUE_STATUSES]),
    supabase
      .from("refund_requests")
      .select("*", { count: "exact", head: true })
      .in("status", [...OPEN_QUEUE_STATUSES]),
    supabase
      .from("active_loans")
      .select("*", { count: "exact", head: true })
      .in("status", [...ACTIVE_LOAN_STATUSES]),
    countPendingAdmins(supabase),
    supabase
      .from("admin_balance_operations")
      .select("id, operation_type, token_symbol, amount, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  return {
    accounts,
    verified,
    unverified,
    withWallet,
    portfolioUsd,
    openRecovery: openRecovery.count ?? 0,
    openRefunds: openRefunds.count ?? 0,
    activeLoans: activeLoans.count ?? 0,
    pendingAdmins,
    recentOperations: recentResult.data ?? [],
  };
}

export function formatDashboardUsd(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
