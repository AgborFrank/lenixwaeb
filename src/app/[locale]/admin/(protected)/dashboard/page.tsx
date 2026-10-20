import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { adminGlass } from "@/lib/admin-glass";
import { getAdminDashboardStats } from "@/lib/admin-dashboard-stats";
import { Badge } from "@/components/ui/badge";
import { DashboardMetrics } from "./_components/dashboard-metrics";

function displayName(username: string | undefined, email: string | undefined) {
  if (username?.trim()) return username.trim();
  if (email) {
    const local = email.split("@")[0];
    return local.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return "Admin";
}

const queueLinks = [
  {
    href: "/admin/users",
    title: "User directory",
    description: "Signups, verification, and wallet status",
    countKey: "accounts" as const,
    countLabel: "accounts",
  },
  {
    href: "/admin/recovery",
    title: "Recovery requests",
    description: "Pending and in-progress cases",
    countKey: "openRecovery" as const,
    countLabel: "open",
  },
  {
    href: "/admin/refunds",
    title: "Purchase refunds",
    description: "Intake queue — payout not automated",
    countKey: "openRefunds" as const,
    countLabel: "open",
  },
  {
    href: "/admin/loans",
    title: "Crypto loans",
    description: "Approved and active positions",
    countKey: "activeLoans" as const,
    countLabel: "active",
  },
  {
    href: "/admin/balances",
    title: "Balance operations",
    description: "Credit and debit user balances",
    countKey: null,
    countLabel: null,
  },
  {
    href: "/admin/admins",
    title: "Admin access",
    description: "Pending approvals and roles",
    countKey: "pendingAdmins" as const,
    countLabel: "pending",
  },
] as const;

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  const stats = await getAdminDashboardStats();
  const name = displayName(session?.username, session?.email);

  return (
    <div className={adminGlass.page}>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className={adminGlass.eyebrow}>Overview</p>
          <h1 className={adminGlass.title}>Welcome back, {name}</h1>
          <p className={adminGlass.description}>
            Live counts from auth, balances, and open queues. Numbers match the user directory and
            desk pages — not wallet-row proxies.
          </p>
        </div>
        <Badge
          variant="outline"
          className="w-fit shrink-0 border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-normal text-zinc-300"
        >
          {stats.accounts.toLocaleString()} accounts
        </Badge>
      </header>

      <DashboardMetrics
        accounts={stats.accounts}
        verified={stats.verified}
        unverified={stats.unverified}
        withWallet={stats.withWallet}
        portfolioUsd={stats.portfolioUsd}
        openRecovery={stats.openRecovery}
        openRefunds={stats.openRefunds}
        activeLoans={stats.activeLoans}
        pendingAdmins={stats.pendingAdmins}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={`${adminGlass.surface} overflow-hidden`} aria-label="Recent balance operations">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3.5 sm:px-5">
            <h2 className="text-sm font-medium text-white">Recent balance operations</h2>
            <Link
              href="/admin/balances"
              className="text-xs font-medium text-zinc-400 transition-colors hover:text-white"
            >
              View all
            </Link>
          </div>
          {stats.recentOperations.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-zinc-500 sm:px-5">
              No balance operations yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[320px] border-collapse text-sm">
                <thead>
                  <tr className={`border-b ${adminGlass.divider} bg-white/[0.02]`}>
                    <th className={adminGlass.tableHead}>Type</th>
                    <th className={adminGlass.tableHead}>Amount</th>
                    <th className={`${adminGlass.tableHead} text-right`}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOperations.map((op) => {
                    const isCredit = op.operation_type === "credit";
                    return (
                      <tr key={op.id} className={`border-b ${adminGlass.divider} last:border-0`}>
                        <td className={adminGlass.tableCell}>
                          <span
                            className={
                              isCredit ? "text-emerald-400/90" : "text-red-400/90"
                            }
                          >
                            {isCredit ? "Credit" : "Debit"}
                          </span>
                        </td>
                        <td className={`${adminGlass.tableCell} tabular-nums text-white`}>
                          {op.amount} {op.token_symbol}
                        </td>
                        <td className={`${adminGlass.tableCell} text-right text-zinc-500`}>
                          {new Date(op.created_at).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className={`${adminGlass.surface} overflow-hidden`} aria-label="Go to desk">
          <div className="border-b border-white/[0.06] px-4 py-3.5 sm:px-5">
            <h2 className="text-sm font-medium text-white">Desks</h2>
            <p className="mt-1 text-xs text-zinc-500">Jump to a queue or tool</p>
          </div>
          <ul className="divide-y divide-white/[0.06]">
            {queueLinks.map((item) => {
              const count =
                item.countKey != null ? stats[item.countKey] : null;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.03] sm:px-5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">{item.description}</p>
                    </div>
                    {count != null && item.countLabel && (
                      <span className="shrink-0 tabular-nums text-xs text-zinc-400">
                        {count.toLocaleString()} {item.countLabel}
                      </span>
                    )}
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-zinc-600 transition-colors group-hover:text-zinc-400"
                      aria-hidden
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
