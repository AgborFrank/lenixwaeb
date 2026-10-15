import { adminGlass } from "@/lib/admin-glass";

interface UsersMetricsProps {
  total: number;
  verified: number;
  unverified: number;
  withWallet: number;
  withoutWallet: number;
  portfolioUsd: string;
}

const metrics = [
  { key: "total", label: "Accounts" },
  { key: "verified", label: "Verified" },
  { key: "unverified", label: "Unverified" },
  { key: "withWallet", label: "With wallet" },
  { key: "withoutWallet", label: "No wallet" },
  { key: "portfolio", label: "Portfolio (USD)" },
] as const;

export function UsersMetrics({
  total,
  verified,
  unverified,
  withWallet,
  withoutWallet,
  portfolioUsd,
}: UsersMetricsProps) {
  const values: Record<(typeof metrics)[number]["key"], string> = {
    total: total.toLocaleString(),
    verified: verified.toLocaleString(),
    unverified: unverified.toLocaleString(),
    withWallet: withWallet.toLocaleString(),
    withoutWallet: withoutWallet.toLocaleString(),
    portfolio: portfolioUsd,
  };

  return (
    <section className={`${adminGlass.surface} overflow-hidden`} aria-label="User metrics">
      <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] lg:grid-cols-3 xl:grid-cols-6">
        {metrics.map((metric) => (
          <div key={metric.key} className="px-4 py-3.5 sm:px-5 sm:py-4">
            <p className="text-[11px] font-medium tracking-wide text-zinc-500">{metric.label}</p>
            <p
              className={`mt-1 break-words font-semibold tabular-nums tracking-tight text-white ${
                metric.key === "portfolio" ? "text-sm sm:text-lg" : "text-lg sm:text-xl"
              }`}
            >
              {values[metric.key]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
