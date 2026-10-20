"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Menu,
  LogOut,
  MessageCircle,
  Wallet,
  Send,
  ArrowDownToLine,
  Building2,
  History,
  Settings,
  Lock,
  Landmark,
  ShieldCheck,
  Package,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { adminGlass } from "@/lib/admin-glass";
import { isAccountRouteEnabled, type ServicesConfig } from "@/lib/platform-settings";
import { LanguagePicker } from "../../components/language-picker";
import { MobileTabs } from "./mobile-tabs";

const TELEGRAM_URL = "https://t.me/Verified_protocol";

type NavLabelKey =
  | "home"
  | "vault"
  | "lenix_wallet"
  | "banking"
  | "recovery_services"
  | "refund_services"
  | "crypto_loan"
  | "assets"
  | "send"
  | "receive"
  | "transactions"
  | "settings";

type NavItem = { href: string; labelKey: NavLabelKey; icon: LucideIcon };

type NavSection = {
  sectionKey: "account" | "wallet" | null;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    sectionKey: "account",
    items: [
      { href: "/dashboard", labelKey: "home", icon: LayoutDashboard },
      { href: "/vault", labelKey: "vault", icon: Lock },
      { href: "/lenix-wallet", labelKey: "lenix_wallet", icon: Wallet },
      { href: "/banking", labelKey: "banking", icon: Building2 },
      { href: "/recovery-services", labelKey: "recovery_services", icon: ShieldCheck },
      { href: "/refund-services", labelKey: "refund_services", icon: Package },
      { href: "/crypto-loan", labelKey: "crypto_loan", icon: Landmark },
    ],
  },
  {
    sectionKey: "wallet",
    items: [
      { href: "/assets", labelKey: "assets", icon: Wallet },
      { href: "/send", labelKey: "send", icon: Send },
      { href: "/receive", labelKey: "receive", icon: ArrowDownToLine },
      { href: "/transactions", labelKey: "transactions", icon: History },
    ],
  },
  {
    sectionKey: null,
    items: [{ href: "/settings", labelKey: "settings", icon: Settings }],
  },
];

function SidebarNav({
  pathname,
  onNavigate,
  onSignOut,
  userEmail,
  servicesConfig,
}: {
  pathname: string;
  onNavigate?: () => void;
  onSignOut: () => void;
  userEmail: string;
  servicesConfig: ServicesConfig;
}) {
  const t = useTranslations("AccountSidebar");

  return (
    <div className="flex h-full flex-col">
      <nav className="flex-1 space-y-6 px-3 py-4" aria-label={t("header.menu")}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.sectionKey ?? "settings"}>
            {section.sectionKey && (
              <p className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                {t(`sections.${section.sectionKey}`)}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items
                .filter((item) => isAccountRouteEnabled(item.href, servicesConfig))
                .map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-8 items-center gap-2.5 rounded-md px-2 text-sm transition-colors",
                      active
                        ? "bg-white/[0.08] font-medium text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                        : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100",
                    )}
                  >
                    <item.icon className={cn("size-4 shrink-0", active ? "text-white" : "text-zinc-500")} />
                    <span className="truncate">{t(`nav.${item.labelKey}`)}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-2 border-t border-white/[0.06] p-3">
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className="flex h-8 items-center gap-2.5 rounded-md px-2 text-sm text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          <MessageCircle className="size-4 shrink-0 text-zinc-500" />
          {t("support.contact_support")}
        </a>
        <div className="flex items-center gap-2 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-2 backdrop-blur-md">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-[11px] font-medium text-zinc-200">
            {userEmail.slice(0, 2).toUpperCase() || "U"}
          </span>
          <p className="min-w-0 flex-1 truncate text-xs text-zinc-400">{userEmail}</p>
          <button
            type="button"
            onClick={onSignOut}
            className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white"
            aria-label={t("header.sign_out")}
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AccountLayout({
  children,
  userEmail,
  servicesConfig,
}: {
  children: React.ReactNode;
  userEmail: string;
  servicesConfig: ServicesConfig;
}) {
  const t = useTranslations("AccountSidebar");
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-60 lg:flex-col">
        <div className="account-sidebar flex h-full flex-col border-r border-white/[0.08] bg-black/40 shadow-[inset_-1px_0_0_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
          <div className="flex h-14 items-center justify-between gap-2 border-b border-white/[0.06] px-4">
            <Link href="/dashboard" className="flex shrink-0 items-center">
              <Image
                src="/assets/img/logo.png"
                alt={t("logo_alt")}
                width={120}
                height={32}
                className="h-6 w-auto object-contain"
                priority
              />
            </Link>
            <LanguagePicker isDark menuSide="bottom" />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <SidebarNav
              pathname={pathname}
              onSignOut={handleSignOut}
              userEmail={userEmail}
              servicesConfig={servicesConfig}
            />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-white/[0.08] bg-black/50 px-3 backdrop-blur-xl sm:px-5 lg:px-6">
          <div className="lg:hidden">
            <Drawer direction="left" open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-zinc-300 hover:bg-white/[0.06] hover:text-white"
                  aria-label={t("header.menu")}
                >
                  <Menu className="size-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="flex h-full w-[280px] flex-col rounded-none border-r border-white/10 bg-zinc-950/95 text-white backdrop-blur-xl">
                <DrawerHeader className="flex flex-row items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
                  <DrawerTitle className="text-sm font-medium text-white">{t("header.menu")}</DrawerTitle>
                  <LanguagePicker isDark menuSide="bottom" />
                </DrawerHeader>
                <div className="min-h-0 flex-1">
                  <SidebarNav
                    pathname={pathname}
                    userEmail={userEmail}
                    onNavigate={() => setMobileMenuOpen(false)}
                    onSignOut={handleSignOut}
                    servicesConfig={servicesConfig}
                  />
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          <div className="min-w-0 flex-1 lg:hidden">
            <Image src="/assets/img/logo.png" alt={t("logo_alt")} width={100} height={28} className="h-5 w-auto" />
          </div>
          <div className="hidden flex-1 lg:block" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-8 max-w-[220px] items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-1.5 pr-2.5 text-left backdrop-blur-md transition-colors hover:bg-white/[0.08]"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-[10px] font-medium text-zinc-200">
                  {userEmail.slice(0, 2).toUpperCase() || "U"}
                </span>
                <span className="hidden truncate text-xs text-zinc-300 sm:block">{userEmail}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`w-56 ${adminGlass.menu}`}>
              <DropdownMenuLabel className="font-normal">
                <p className="truncate text-sm text-white">{userEmail}</p>
                <p className="text-xs text-zinc-500">{t("header.verified_user")}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="size-4" />
                  {t("nav.settings")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer text-red-400 focus:text-red-300"
              >
                <LogOut className="size-4" />
                {t("header.sign_out")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main
          className={cn(
            "flex-1 pb-24 lg:pb-8",
            "p-3 sm:p-6 lg:p-8",
          )}
        >
          {children}
        </main>

        <MobileTabs servicesConfig={servicesConfig} />
      </div>
    </div>
  );
}
