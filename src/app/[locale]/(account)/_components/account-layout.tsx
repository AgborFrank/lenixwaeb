"use client";

import { useMemo, useState } from "react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/client";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { LanguagePicker } from "../../components/language-picker";
import { MobileTabs } from "./mobile-tabs";

const TELEGRAM_URL = "https://t.me/Verified_protocol";

type NavLabelKey =
  | "home"
  | "vault"
  | "lenix_wallet"
  | "banking"
  | "recovery_services"
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

const DROPDOWN_LINKS: NavItem[] = NAV_SECTIONS.flatMap((section) => section.items);

export function AccountLayout({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  const t = useTranslations("AccountSidebar");
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navSections = useMemo(() => NAV_SECTIONS, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <div className="flex flex-col h-full">
      <nav className="flex-1 space-y-6 p-4">
        {navSections.map((section) => (
          <div key={section.sectionKey ?? "bottom"}>
            {section.sectionKey && (
              <p className="px-4 mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t(`sections.${section.sectionKey}`)}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => onLinkClick?.()}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {t(`nav.${item.labelKey}`)}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 space-y-2">
        <p className="text-xs text-gray-500 px-2">{t("support.need_help")}</p>
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onLinkClick}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-yellow-400 hover:bg-yellow-400/10 transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          {t("support.contact_support")}
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar - scrollbar hidden via .account-sidebar in globals.css */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col">
        <div className="account-sidebar flex grow flex-col gap-y-5 overflow-y-auto overflow-x-hidden rounded-r-2xl border-r border-white/10 bg-white/5 backdrop-blur-xl px-4 pb-4 pt-6">
          <div className="flex items-center justify-between gap-2 px-2">
            <Link href="/dashboard" className="flex shrink-0 items-center">
              <Image
                src="/assets/img/logo.png"
                alt={t("logo_alt")}
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>
            <LanguagePicker isDark menuSide="bottom" />
          </div>
          <ScrollArea className="flex-1 [&>[data-slot=scroll-area-scrollbar]]:hidden">
            <SidebarContent />
          </ScrollArea>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-64 flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-white/5 backdrop-blur-xl px-4 sm:px-6 lg:px-8">
          {/* Mobile menu - inside header to avoid overlap with user details */}
          <div className="lg:hidden shrink-0">
            <Drawer
              direction="left"
              open={mobileMenuOpen}
              onOpenChange={setMobileMenuOpen}
            >
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-full w-[280px] rounded-none border-r border-white/10 bg-black/90 backdrop-blur-xl text-white">
                <DrawerHeader className="flex flex-row items-center justify-between gap-3">
                  <DrawerTitle className="text-white">{t("header.menu")}</DrawerTitle>
                  <LanguagePicker isDark menuSide="bottom" />
                </DrawerHeader>
                <SidebarContent onLinkClick={() => setMobileMenuOpen(false)} />
              </DrawerContent>
            </Drawer>
          </div>
          <div className="flex flex-1 items-center justify-between gap-3 min-w-0">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                {userEmail}
              </p>
              <p className="text-xs text-gray-500 truncate">{t("header.verified_user")}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-white/20 text-white hover:bg-white/10"
                >
                  <Avatar className="h-8 w-8 rounded-full bg-yellow-400/20">
                    <AvatarFallback className="bg-yellow-400/20 text-yellow-400 text-sm rounded-full">
                      {userEmail?.slice(0, 2).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-black/95 border-white/10 text-white"
              >
                {DROPDOWN_LINKS.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="cursor-pointer">
                      {t(`nav.${item.labelKey}`)}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-400 focus:text-red-400 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("header.sign_out")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className={cn(
           "flex-1 pb-20 lg:pb-0", // Add bottom padding for mobile tabs
           pathname === "/crypto-loan" ? "p-0" : "p-4 sm:p-6 lg:p-8"
        )}>
          {children}
        </main>
        
        <MobileTabs />
      </div>
    </div>
  );
}
