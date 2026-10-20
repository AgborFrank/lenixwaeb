import { adminGlass } from "@/lib/admin-glass";
import { formatDashboardUsd } from "@/lib/admin-dashboard-stats";

interface DashboardMetricsProps {
  accounts: number;
  verified: number;
  unverified: number;
  withWallet: number;
  portfolioUsd: number;
  openRecovery: number;
  openRefunds: number;
  activeLoans: number;
  pendingAdmins: number;
}

const platformMetrics = [
  { key: "accounts", label: "Accounts" },
  { key: "verified", label: "Verified" },
  { key: "unverified", label: "Unverified" },
  { key: "withWallet", label: "With wallet" },
  { key: "portfolio", label: "Portfolio (USD)" },
] as const;

const queueMetrics = [
  { key: "openRecovery", label: "Open recovery" },
  { key: "openRefunds", label: "Open refunds" },
  { key: "activeLoans", label: "Active loans" },
  { key: "pendingAdmins", label: "Admin reviews" },
] as const;

export function DashboardMetrics(props: DashboardMetricsProps) {
  const platformValues: Record<(typeof platformMetrics)[number]["key"], string> = {
    accounts: props.accounts.toLocaleString(),
    verified: props.verified.toLocaleString(),
    unverified: props.unverified.toLocaleString(),
    withWallet: props.withWallet.toLocaleString(),
    portfolio: `$${formatDashboardUsd(props.portfolioUsd)}`,
  };

  const queueValues: Record<(typeof queueMetrics)[number]["key"], string> = {
    openRecovery: props.openRecovery.toLocaleString(),
    openRefunds: props.openRefunds.toLocaleString(),
    activeLoans: props.activeLoans.toLocaleString(),
    pendingAdmins: props.pendingAdmins.toLocaleString(),
  };

  return (
    <div className="flex flex-col gap-4">
      <section className={`${adminGlass.surface} overflow-hidden`} aria-label="Platform metrics">
        <div className="border-b border-white/[0.06] px-4 py-2.5 sm:px-5">
          <p className="text-[11px] font-medium tracking-wide text-zinc-500">Platform</p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] lg:grid-cols-5">
          {platformMetrics.map((metric) => (
            <div key={metric.key} className="px-4 py-3.5 sm:px-5 sm:py-4">
              <p className="text-[11px] font-medium tracking-wide text-zinc-500">{metric.label}</p>
              <p
                className={`mt-1 break-words font-semibold tabular-nums tracking-tight text-white ${
                  metric.key === "portfolio" ? "text-sm sm:text-lg" : "text-lg sm:text-xl"
                }`}
              >
                {platformValues[metric.key]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className={`${adminGlass.surface} overflow-hidden`} aria-label="Work queue metrics">
        <div className="border-b border-white/[0.06] px-4 py-2.5 sm:px-5">
          <p className="text-[11px] font-medium tracking-wide text-zinc-500">Queues</p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] lg:grid-cols-4">
          {queueMetrics.map((metric) => (
            <div key={metric.key} className="px-4 py-3.5 sm:px-5 sm:py-4">
              <p className="text-[11px] font-medium tracking-wide text-zinc-500">{metric.label}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums tracking-tight text-white sm:text-xl">
                {queueValues[metric.key]}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
