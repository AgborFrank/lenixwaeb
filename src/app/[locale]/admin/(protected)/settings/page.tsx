import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import { adminGlass } from "@/lib/admin-glass";
import {
  getFinancialConfig,
  getPlatformConfig,
  getServicesConfig,
  getWeb3Config,
} from "@/lib/platform-settings/server";

const links = [
  {
    href: "/admin/settings/platform",
    title: "Site",
    description: "Maintenance, contact emails, locale, banner",
  },
  {
    href: "/admin/settings/services",
    title: "Services",
    description: "Enable desks: recovery, refunds, loans, banking, wallet",
  },
  {
    href: "/admin/settings/web3",
    title: "Web3",
    description: "Chains, treasury addresses, token references",
  },
  {
    href: "/admin/settings/financial",
    title: "Financial",
    description: "Loan defaults, withdrawal limits, alert thresholds",
  },
  {
    href: "/admin/settings/notifications",
    title: "Notifications",
    description: "Admin email and Telegram routing",
  },
  {
    href: "/admin/settings/api",
    title: "API",
    description: "Programmatic access keys",
  },
] as const;

export default async function SettingsOverviewPage() {
  const [platform, services, web3, financial] = await Promise.all([
    getPlatformConfig(),
    getServicesConfig(),
    getWeb3Config(),
    getFinancialConfig(),
  ]);

  const enabledServices = Object.entries(services).filter(([, v]) => v.enabled).length;
  const enabledChains = Object.values(web3.chains).filter((c) => c.enabled).length;

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h2 className={adminGlass.settingsPageTitle}>Overview</h2>
        <p className={adminGlass.settingsPageDesc}>
          Snapshot of stored configuration. Values save to Supabase{" "}
          <code className="text-zinc-500">system_configs</code>; deploy-time secrets stay in
          environment variables.
        </p>
      </header>

      <section className={`${adminGlass.surface} overflow-hidden`}>
        <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] sm:grid-cols-4">
          {[
            { label: "Maintenance", value: platform.maintenance_mode ? "On" : "Off" },
            { label: "Services on", value: String(enabledServices) },
            { label: "Chains on", value: String(enabledChains) },
            { label: "Loan APR", value: `${financial.loan_interest_rate}%` },
          ].map((metric) => (
            <div key={metric.label} className="px-4 py-3.5">
              <p className="text-[11px] font-medium text-zinc-500">{metric.label}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-white">{metric.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`${adminGlass.surface} overflow-hidden`} aria-label="Settings sections">
        <ul className="divide-y divide-white/[0.06]">
          {links.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.03] sm:px-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{item.description}</p>
                </div>
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-zinc-600 group-hover:text-zinc-400"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
