import { createClient } from "@/utils/supabase/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  Users,
  Wallet,
  ShieldCheck,
  Banknote,
  UserCog,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

async function getStats() {
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: totalWallets },
    { count: pendingRecovery },
    { count: activeLoans },
    { count: pendingAdmins },
    { data: recentOperations },
  ] = await Promise.all([
    supabase.from("user_wallets").select("*", { count: "exact", head: true }),
    supabase.from("user_balances").select("*", { count: "exact", head: true }).gt("usd_value", 0),
    supabase.from("recovery_requests").select("*", { count: "exact", head: true }).neq("status", "completed"),
    supabase.from("active_loans").select("*", { count: "exact", head: true }),
    supabase.from("admin_users").select("*", { count: "exact", head: true }).eq("is_active", false),
    supabase
      .from("admin_balance_operations")
      .select("id, operation_type, token_symbol, amount, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    totalUsers: totalUsers ?? 0,
    totalWallets: totalWallets ?? 0,
    pendingRecovery: pendingRecovery ?? 0,
    activeLoans: activeLoans ?? 0,
    pendingAdmins: pendingAdmins ?? 0,
    recentOperations: recentOperations ?? [],
  };
}

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  const stats = await getStats();

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      href: "/admin/users",
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      label: "Active Balances",
      value: stats.totalWallets,
      icon: Wallet,
      href: "/admin/balances",
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      label: "Pending Recovery",
      value: stats.pendingRecovery,
      icon: ShieldCheck,
      href: "/admin/recovery",
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
    },
    {
      label: "Active Loans",
      value: stats.activeLoans,
      icon: Banknote,
      href: "/admin/loans",
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      label: "Pending Approvals",
      value: stats.pendingAdmins,
      icon: UserCog,
      href: "/admin/admins",
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {session?.username}
        </h1>
        <p className="mt-1 text-zinc-400">
          Here's an overview of your platform.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bgColor}`}
                >
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </span>
                <TrendingUp className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-zinc-400" />
              </div>
              <p className="mt-4 text-2xl font-bold text-white">{card.value}</p>
              <p className="mt-1 text-sm text-zinc-500">{card.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
            <h2 className="font-semibold text-white">Recent Balance Operations</h2>
            <Link
              href="/admin/balances"
              className="text-sm text-yellow-400 hover:text-yellow-300"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-zinc-800">
            {stats.recentOperations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="h-8 w-8 text-zinc-600" />
                <p className="mt-2 text-sm text-zinc-500">No recent operations</p>
              </div>
            ) : (
              stats.recentOperations.map((op: any) => (
                <div
                  key={op.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                        op.operation_type === "credit"
                          ? "bg-green-400/10 text-green-400"
                          : "bg-red-400/10 text-red-400"
                      }`}
                    >
                      {op.operation_type === "credit" ? "+" : "-"}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {op.operation_type === "credit" ? "Credit" : "Debit"}{" "}
                        {op.amount} {op.token_symbol}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {new Date(op.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
            <h2 className="font-semibold text-white">Quick Actions</h2>
          </div>
          <div className="grid gap-3 p-5">
            <Link
              href="/admin/users"
              className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 transition-colors hover:border-zinc-700"
            >
              <Users className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-medium text-white">
                Manage Users
              </span>
            </Link>
            <Link
              href="/admin/balances"
              className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 transition-colors hover:border-zinc-700"
            >
              <Wallet className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium text-white">
                Credit/Debit Balances
              </span>
            </Link>
            <Link
              href="/admin/recovery"
              className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 transition-colors hover:border-zinc-700"
            >
              <ShieldCheck className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-medium text-white">
                Review Recovery Requests
              </span>
            </Link>
            {stats.pendingAdmins > 0 && (
              <Link
                href="/admin/admins"
                className="flex items-center gap-3 rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-3 transition-colors hover:border-orange-500/50"
              >
                <AlertCircle className="h-5 w-5 text-orange-400" />
                <span className="text-sm font-medium text-orange-400">
                  {stats.pendingAdmins} admin approval{stats.pendingAdmins !== 1 ? "s" : ""} pending
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
