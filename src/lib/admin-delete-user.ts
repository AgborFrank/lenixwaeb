import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Platform tables that store a customer's data, ordered so restricted
 * foreign keys are removed before the rows they point at.
 * `user_wallets` is last because bitcoin deposits restrict address deletes.
 */
const USER_DATA_TABLES = [
  "btc_deposits",
  "btc_withdrawals",
  "btc_addresses",
  "user_transactions",
  "account_freeze_events",
  "user_balances",
  "user_sessions",
  "admin_balance_operations",
  "admin_fiat_operations",
  "user_fiat_balances",
  "user_bank_accounts",
  "loans",
  "active_loans",
  "recovery_wallet_assets",
  "recovery_requests",
  "refund_requests",
  "support_tickets",
  "web_loan_payouts",
  "web_onboarding",
  "user_settings",
  "vault_wallets",
  "user_wallets",
] as const;

const STORAGE_BUCKETS = ["avatars", "onboarding-evidence"] as const;

async function deleteByUserId(
  supabase: SupabaseClient,
  table: (typeof USER_DATA_TABLES)[number],
  userId: string,
) {
  const { error } = await supabase.from(table).delete().eq("user_id", userId);
  if (error) {
    throw new Error(`Failed to delete ${table}: ${error.message}`);
  }
}

async function deleteBitcoinDepositsForWallets(
  supabase: SupabaseClient,
  walletIds: string[],
) {
  if (walletIds.length === 0) return;

  const { data: addresses, error: addressError } = await supabase
    .from("btc_addresses")
    .select("id")
    .in("wallet_id", walletIds);

  if (addressError) {
    throw new Error(`Failed to load bitcoin addresses: ${addressError.message}`);
  }

  const addressIds = (addresses ?? []).map((address) => address.id as string);
  if (addressIds.length > 0) {
    const { error } = await supabase.from("btc_deposits").delete().in("address_id", addressIds);
    if (error) {
      throw new Error(`Failed to delete bitcoin deposits: ${error.message}`);
    }
  }

  const { error: walletDepositError } = await supabase
    .from("btc_deposits")
    .delete()
    .in("wallet_id", walletIds);
  if (walletDepositError) {
    throw new Error(`Failed to delete bitcoin deposits: ${walletDepositError.message}`);
  }
}

async function removeStorageFolder(
  supabase: SupabaseClient,
  bucket: string,
  userId: string,
) {
  const { data, error } = await supabase.storage.from(bucket).list(userId, { limit: 1000 });
  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("not found") || message.includes("does not exist")) return;
    throw new Error(`Failed to list ${bucket} files: ${error.message}`);
  }

  const paths = (data ?? [])
    .filter((file) => file.name && file.name !== ".emptyFolderPlaceholder")
    .map((file) => `${userId}/${file.name}`);

  if (paths.length === 0) return;

  const { error: removeError } = await supabase.storage.from(bucket).remove(paths);
  if (removeError) {
    throw new Error(`Failed to delete ${bucket} files: ${removeError.message}`);
  }
}

/** Remove every platform row and uploaded file owned by this auth user. */
export async function deleteUserPlatformData(supabase: SupabaseClient, userId: string) {
  const { data: wallets, error: walletError } = await supabase
    .from("user_wallets")
    .select("id")
    .eq("user_id", userId);

  if (walletError) {
    throw new Error(`Failed to load wallets: ${walletError.message}`);
  }

  await deleteBitcoinDepositsForWallets(
    supabase,
    (wallets ?? []).map((wallet) => wallet.id as string),
  );

  for (const table of USER_DATA_TABLES) {
    await deleteByUserId(supabase, table, userId);
  }

  for (const bucket of STORAGE_BUCKETS) {
    await removeStorageFolder(supabase, bucket, userId);
  }
}
