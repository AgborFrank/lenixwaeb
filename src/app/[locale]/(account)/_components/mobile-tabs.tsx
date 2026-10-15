"use client";

import { useTranslations } from "next-intl";
import { Building2, LayoutDashboard, Wallet, Landmark, Settings } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", labelKey: "home" as const, icon: LayoutDashboard },
  { href: "/banking", labelKey: "banking" as const, icon: Building2 },
  { href: "/lenix-wallet", labelKey: "wallet" as const, icon: Wallet },
  { href: "/crypto-loan", labelKey: "loan" as const, icon: Landmark },
  { href: "/settings", labelKey: "settings" as const, icon: Settings },
];

export function MobileTabs() {
  const t = useTranslations("AccountMobileTabs");
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-black/55 backdrop-blur-xl lg:hidden">
      <nav className="flex h-16 items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium",
                isActive ? "text-white" : "text-zinc-500",
              )}
            >
              <item.icon className="size-5" strokeWidth={isActive ? 2.25 : 1.75} />
              <span className="truncate">{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
