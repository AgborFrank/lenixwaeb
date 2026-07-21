import { createServiceRoleClient } from "@/utils/supabase/server";
import { Search, User, Wallet, ExternalLink, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface UserWithWallet {
  user_id: string;
  ethereum_address: string | null;
  created_at: string;
  email: string | null;
  display_name: string;
  total_usd_value: number;
  balance_count: number;
}

function getDisplayName(email: string | null | undefined): string {
  if (!email) return "Unknown User";
  const localPart = email.split("@")[0];
  return localPart
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function getUsers(search?: string): Promise<UserWithWallet[]> {
  const supabase = createServiceRoleClient();

  let query = supabase
    .from("user_wallets")
    .select("user_id, ethereum_address, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (search) {
    query = query.or(`ethereum_address.ilike.%${search}%,user_id.ilike.%${search}%`);
  }

  const { data: wallets } = await query;

  if (!wallets || wallets.length === 0) {
    return [];
  }

  // Get user emails from auth.users
  const userIds = wallets.map((w) => w.user_id);
  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const userEmails: Record<string, string | null> = {};
  authUsers?.users?.forEach((u) => {
    userEmails[u.id] = u.email ?? null;
  });

  // Get balance data for each user
  const { data: balances } = await supabase
    .from("user_balances")
    .select("user_id, usd_value")
    .in("user_id", userIds);

  // Aggregate balances by user
  const userBalances: Record<string, { total: number; count: number }> = {};
  balances?.forEach((b) => {
    if (!userBalances[b.user_id]) {
      userBalances[b.user_id] = { total: 0, count: 0 };
    }
    userBalances[b.user_id].total += Number(b.usd_value || 0);
    userBalances[b.user_id].count += 1;
  });

  return wallets.map((w) => ({
    user_id: w.user_id,
    ethereum_address: w.ethereum_address,
    created_at: w.created_at,
    email: userEmails[w.user_id] ?? null,
    display_name: getDisplayName(userEmails[w.user_id]),
    total_usd_value: userBalances[w.user_id]?.total || 0,
    balance_count: userBalances[w.user_id]?.count || 0,
  }));
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const users = await getUsers(search);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="mt-1 text-zinc-400">
            Manage user wallets and balances
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 p-4">
          <form className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by wallet address..."
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
            />
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
                  Wallet Address
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Total Balance
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Assets
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Joined
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
                    <User className="mx-auto h-8 w-8 text-zinc-600" />
                    <p className="mt-2 text-sm text-zinc-500">
                      {search ? "No users found matching your search" : "No users yet"}
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
                      {user.ethereum_address ? (
                        <code className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                          {user.ethereum_address.slice(0, 6)}...{user.ethereum_address.slice(-4)}
                        </code>
                      ) : (
                        <span className="text-sm text-zinc-500">Not set</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-medium text-white">
                        ${user.total_usd_value.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-zinc-400">{user.balance_count}</span>
                    </td>
                    <td className="px-5 py-4 text-right text-sm text-zinc-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/admin/balances?user=${user.user_id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-400/10 px-3 py-1.5 text-xs font-medium text-yellow-400 transition-colors hover:bg-yellow-400/20"
                        >
                          <Wallet className="h-3 w-3" />
                          Manage Balance
                        </Link>
                        <Link
                          href={`/admin/account-controls?user=${user.user_id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-red-400/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-400/20"
                        >
                          <ShieldAlert className="h-3 w-3" />
                          Freeze / Bank
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
    </div>
  );
}
