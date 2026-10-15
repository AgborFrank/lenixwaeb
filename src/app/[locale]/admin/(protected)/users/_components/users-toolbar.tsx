import { Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { adminGlass } from "@/lib/admin-glass";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type StatusFilter = "all" | "verified" | "unverified";
type WalletFilter = "all" | "with" | "without";

interface UsersToolbarProps {
  search: string;
  status: StatusFilter;
  wallet: WalletFilter;
  filtersActive: boolean;
  showing: number;
  total: number;
  hrefFor: (params: { status?: StatusFilter; wallet?: WalletFilter; search?: string }) => string;
}

const statusChips: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "verified", label: "Verified" },
  { value: "unverified", label: "Unverified" },
];

const walletChips: { value: WalletFilter; label: string }[] = [
  { value: "all", label: "Any wallet" },
  { value: "with", label: "Has wallet" },
  { value: "without", label: "No wallet" },
];

export function UsersToolbar({
  search,
  status,
  wallet,
  filtersActive,
  showing,
  total,
  hrefFor,
}: UsersToolbarProps) {
  return (
    <section className={`${adminGlass.surface} p-4 sm:p-5`} aria-label="Filter users">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <form className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1 sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Search email, name, wallet, or ID"
              aria-label="Search users"
              className={`h-9 pl-9 ${adminGlass.field}`}
            />
          </div>
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="wallet" value={wallet} />
          <div className="flex items-center gap-2">
            <Button type="submit" size="sm" className="h-9 bg-white text-black hover:bg-zinc-200">
              Search
            </Button>
            {filtersActive && (
              <Button type="button" variant="outline" size="sm" className={`h-9 ${adminGlass.field}`} asChild>
                <Link href="/admin/users">Reset</Link>
              </Button>
            )}
          </div>
        </form>
        <p className="shrink-0 text-xs tabular-nums text-zinc-500">
          {showing.toLocaleString()} of {total.toLocaleString()} shown
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[11px] font-medium uppercase tracking-wider text-zinc-600">
            Status
          </span>
          {statusChips.map((chip) => (
            <Link
              key={chip.value}
              href={hrefFor({ status: chip.value, wallet, search })}
              className={status === chip.value ? adminGlass.chipActive : adminGlass.chip}
            >
              {chip.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[11px] font-medium uppercase tracking-wider text-zinc-600">
            Wallet
          </span>
          {walletChips.map((chip) => (
            <Link
              key={chip.value}
              href={hrefFor({ status, wallet: chip.value, search })}
              className={wallet === chip.value ? adminGlass.chipActive : adminGlass.chip}
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
