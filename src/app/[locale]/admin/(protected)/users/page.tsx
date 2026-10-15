import { createServiceRoleClient } from "@/utils/supabase/server";
import type { User } from "@supabase/supabase-js";
import { User as UserIcon } from "lucide-react";
import { adminGlass } from "@/lib/admin-glass";
import { Badge } from "@/components/ui/badge";
import { UsersMetrics } from "./_components/users-metrics";
import { UsersToolbar } from "./_components/users-toolbar";
import { UserRowMenu } from "./_components/user-row-menu";

interface AdminUserRow {
  user_id: string;
  ethereum_address: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email: string | null;
  display_name: string;
  verified: boolean;
  has_wallet: boolean;
  total_usd_value: number;
  balance_count: number;
}

interface UserStats {
  total: number;
  verified: number;
  unverified: number;
  withWallet: number;
  withoutWallet: number;
  portfolioUsd: number;
}

type StatusFilter = "all" | "verified" | "unverified";
type WalletFilter = "all" | "with" | "without";

function getDisplayName(email: string | null | undefined): string {
  if (!email) return "Unknown User";
  const localPart = email.split("@")[0];
  return localPart
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function isVerified(user: User): boolean {
  return Boolean(user.email_confirmed_at || user.phone_confirmed_at || user.confirmed_at);
}

function usersHref(params: { status?: StatusFilter; wallet?: WalletFilter; search?: string }) {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.status && params.status !== "all") query.set("status", params.status);
  if (params.wallet && params.wallet !== "all") query.set("wallet", params.wallet);
  const qs = query.toString();
  return qs ? `/admin/users?${qs}` : "/admin/users";
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

async function listWallets(supabase: ReturnType<typeof createServiceRoleClient>) {
  const rows: { user_id: string; ethereum_address: string | null; created_at: string }[] = [];
  const pageSize = 1000;
  let from = 0;

  while (from < 20000) {
    const { data, error } = await supabase
      .from("user_wallets")
      .select("user_id, ethereum_address, created_at")
      .order("created_at", { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) {
      console.error("Failed to list wallets:", error);
      break;
    }
    if (!data || data.length === 0) break;

    rows.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return rows;
}

async function listBalances(
  supabase: ReturnType<typeof createServiceRoleClient>,
  userIds: string[],
) {
  const totals: Record<string, { total: number; count: number }> = {};
  const chunkSize = 100;

  for (let i = 0; i < userIds.length; i += chunkSize) {
    const chunk = userIds.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from("user_balances")
      .select("user_id, usd_value")
      .in("user_id", chunk);

    if (error) {
      console.error("Failed to list balances:", error);
      continue;
    }

    data?.forEach((balance) => {
      if (!totals[balance.user_id]) {
        totals[balance.user_id] = { total: 0, count: 0 };
      }
      totals[balance.user_id].total += Number(balance.usd_value || 0);
      totals[balance.user_id].count += 1;
    });
  }

  return totals;
}

async function getUsers(): Promise<AdminUserRow[]> {
  const supabase = createServiceRoleClient();
  const [authUsers, wallets] = await Promise.all([
    listAllAuthUsers(supabase),
    listWallets(supabase),
  ]);

  const walletByUser = new Map<string, { address: string | null }>();
  for (const wallet of wallets) {
    if (!walletByUser.has(wallet.user_id)) {
      walletByUser.set(wallet.user_id, { address: wallet.ethereum_address });
    }
  }

  const userIds = authUsers.map((user) => user.id);
  const balances = await listBalances(supabase, userIds);

  return authUsers
    .map((user) => {
      const wallet = walletByUser.get(user.id);
      const email = user.email ?? null;
      return {
        user_id: user.id,
        ethereum_address: wallet?.address ?? null,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at ?? null,
        email,
        display_name: getDisplayName(email),
        verified: isVerified(user),
        has_wallet: Boolean(wallet),
        total_usd_value: balances[user.id]?.total || 0,
        balance_count: balances[user.id]?.count || 0,
      };
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

function summarize(users: AdminUserRow[]): UserStats {
  return users.reduce<UserStats>(
    (stats, user) => {
      stats.total += 1;
      if (user.verified) stats.verified += 1;
      else stats.unverified += 1;
      if (user.has_wallet) stats.withWallet += 1;
      else stats.withoutWallet += 1;
      stats.portfolioUsd += user.total_usd_value;
      return stats;
    },
    {
      total: 0,
      verified: 0,
      unverified: 0,
      withWallet: 0,
      withoutWallet: 0,
      portfolioUsd: 0,
    },
  );
}

function parseStatus(value: string | undefined): StatusFilter {
  if (value === "verified" || value === "unverified") return value;
  return "all";
}

function parseWallet(value: string | undefined): WalletFilter {
  if (value === "with" || value === "without") return value;
  return "all";
}

function formatUsd(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; wallet?: string }>;
}) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const status = parseStatus(params.status);
  const wallet = parseWallet(params.wallet);
  const users = await getUsers();
  const stats = summarize(users);

  const filtered = users.filter((user) => {
    if (status === "verified" && !user.verified) return false;
    if (status === "unverified" && user.verified) return false;
    if (wallet === "with" && !user.has_wallet) return false;
    if (wallet === "without" && user.has_wallet) return false;
    if (!search) return true;

    const query = search.toLowerCase();
    return (
      user.email?.toLowerCase().includes(query) ||
      user.display_name.toLowerCase().includes(query) ||
      user.ethereum_address?.toLowerCase().includes(query) ||
      user.user_id.toLowerCase().includes(query)
    );
  });

  const filtersActive = Boolean(search) || status !== "all" || wallet !== "all";

  return (
    <div className={adminGlass.page}>
      <header className="flex flex-col gap-3 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className={adminGlass.eyebrow}>User management</p>
          <h1 className={adminGlass.title}>Users</h1>
          <p className={adminGlass.description}>
            Directory of every signup, including accounts that have not confirmed email. Use filters
            to review verification and wallet status before taking action.
          </p>
        </div>
        <Badge
          variant="outline"
          className="w-fit shrink-0 border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-normal text-zinc-300"
        >
          {stats.total.toLocaleString()} total accounts
        </Badge>
      </header>

      <UsersMetrics
        total={stats.total}
        verified={stats.verified}
        unverified={stats.unverified}
        withWallet={stats.withWallet}
        withoutWallet={stats.withoutWallet}
        portfolioUsd={`$${formatUsd(stats.portfolioUsd)}`}
      />

      <UsersToolbar
        search={search}
        status={status}
        wallet={wallet}
        filtersActive={filtersActive}
        showing={filtered.length}
        total={stats.total}
        hrefFor={usersHref}
      />

      <section className={`${adminGlass.surface} overflow-hidden`} aria-label="User directory">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse text-sm">
            <thead>
              <tr className={`border-b ${adminGlass.divider} bg-white/[0.02]`}>
                <th className={adminGlass.tableHead}>User</th>
                <th className={adminGlass.tableHead}>Verification</th>
                <th className={adminGlass.tableHead}>Wallet</th>
                <th className={`${adminGlass.tableHead} text-right`}>Balance</th>
                <th className={`${adminGlass.tableHead} text-right`}>Assets</th>
                <th className={`${adminGlass.tableHead} text-right`}>Joined</th>
                <th className={`${adminGlass.tableHead} w-12 text-right`}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                        <UserIcon className="size-5 text-zinc-500" />
                      </div>
                      <p className="text-sm font-medium text-zinc-300">
                        {filtersActive ? "No users match these filters" : "No users yet"}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {filtersActive
                          ? "Try clearing filters or broadening your search."
                          : "New signups will appear here automatically."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr
                    key={user.user_id}
                    className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                  >
                    <td className={adminGlass.tableCell}>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-semibold text-zinc-200">
                          {user.display_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">{user.display_name}</p>
                          <p className="truncate text-xs text-zinc-500">
                            {user.email || user.user_id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={adminGlass.tableCell}>
                      <div className="flex flex-col gap-1.5">
                        <Badge
                          variant="outline"
                          className={
                            user.verified
                              ? "w-fit border-emerald-500/30 bg-emerald-500/10 font-normal text-emerald-300"
                              : "w-fit border-amber-500/30 bg-amber-500/10 font-normal text-amber-200"
                          }
                        >
                          {user.verified ? "Verified" : "Unverified"}
                        </Badge>
                        <span className="text-xs text-zinc-500">
                          {user.last_sign_in_at
                            ? `Last sign-in ${new Date(user.last_sign_in_at).toLocaleDateString()}`
                            : "Never signed in"}
                        </span>
                      </div>
                    </td>
                    <td className={adminGlass.tableCell}>
                      {user.ethereum_address ? (
                        <code className="rounded-md border border-white/10 bg-black/30 px-2 py-1 font-mono text-xs text-zinc-300">
                          {user.ethereum_address.slice(0, 6)}…{user.ethereum_address.slice(-4)}
                        </code>
                      ) : (
                        <span className="text-xs text-zinc-500">Not provisioned</span>
                      )}
                    </td>
                    <td className={`${adminGlass.tableCell} text-right tabular-nums text-white`}>
                      ${formatUsd(user.total_usd_value)}
                    </td>
                    <td className={`${adminGlass.tableCell} text-right tabular-nums text-zinc-400`}>
                      {user.balance_count}
                    </td>
                    <td className={`${adminGlass.tableCell} text-right text-xs text-zinc-500`}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className={`${adminGlass.tableCell} text-right`}>
                      <UserRowMenu
                        userId={user.user_id}
                        email={user.email}
                        displayName={user.display_name}
                        verified={user.verified}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
