import type { User } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/utils/supabase/server";

export interface AdminUserOption {
  id: string;
  email: string | null;
  displayName: string;
  verified: boolean;
  hasWallet: boolean;
  created_at: string;
}

function getDisplayName(email: string | null | undefined): string {
  if (!email) return "Unknown user";
  const localPart = email.split("@")[0];
  return localPart
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
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

async function listWalletUserIds(supabase: ReturnType<typeof createServiceRoleClient>) {
  const ids = new Set<string>();
  const pageSize = 1000;
  let from = 0;

  while (from < 20000) {
    const { data, error } = await supabase
      .from("user_wallets")
      .select("user_id")
      .range(from, from + pageSize - 1);

    if (error) break;
    if (!data?.length) break;
    for (const row of data) {
      if (row.user_id) ids.add(row.user_id);
    }
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return ids;
}

export async function getAdminUserDirectory(): Promise<AdminUserOption[]> {
  const supabase = createServiceRoleClient();
  const [authUsers, walletUserIds] = await Promise.all([
    listAllAuthUsers(supabase),
    listWalletUserIds(supabase),
  ]);

  return authUsers
    .map((user) => ({
      id: user.id,
      email: user.email ?? null,
      displayName: getDisplayName(user.email),
      verified: isVerified(user),
      hasWallet: walletUserIds.has(user.id),
      created_at: user.created_at,
    }))
    .sort((a, b) => {
      const aLabel = (a.email ?? a.displayName).toLowerCase();
      const bLabel = (b.email ?? b.displayName).toLowerCase();
      return aLabel.localeCompare(bLabel);
    });
}

export function filterAdminUsers(
  users: AdminUserOption[],
  query: string,
): AdminUserOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return users;

  return users.filter((user) => {
    if (user.id.toLowerCase().includes(q)) return true;
    if (user.email?.toLowerCase().includes(q)) return true;
    if (user.displayName.toLowerCase().includes(q)) return true;
    return false;
  });
}
