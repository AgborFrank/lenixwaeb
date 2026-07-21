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
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden block">
       {/* Gradient Border Top */}
       <div className="h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent" />
       
       <div className="bg-black/80 backdrop-blur-xl pb-safe pt-2 px-2">
          <nav className="flex items-center justify-around h-16">
             {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                   <Link 
                      key={item.href} 
                      href={item.href}
                      className={cn(
                         "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200",
                         isActive ? "text-yellow-400" : "text-zinc-500 hover:text-zinc-300"
                      )}
                   >
                      <item.icon className={cn("w-6 h-6", isActive && "fill-yellow-400/20")} strokeWidth={isActive ? 2.5 : 2} />
                      <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
                   </Link>
                )
             })}
          </nav>
       </div>
    </div>
  );
}
