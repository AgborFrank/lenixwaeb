"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Menu,
  LogOut,
  MessageCircle,
  Wallet,
  Send,
  ArrowDownToLine,
  History,
  Settings,
  Lock,
  Landmark,
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
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const TELEGRAM_URL = "https://t.me/Verified_protocol";

const navSections = [
  {
    label: "Account",
    items: [
      { href: "/dashboard", label: "Home", icon: LayoutDashboard },
      { href: "/vault", label: "Blockchain Vault", icon: Lock },
      { href: "/lenix-wallet", label: "Lenix Wallet", icon: Wallet },
      { href: "/crypto-loan", label: "Crypto Loan", icon: Landmark },
    ],
  },
  {
    label: "Wallet",
    items: [
      { href: "/assets", label: "Assets", icon: Wallet },
      { href: "/send", label: "Send", icon: Send },
      { href: "/receive", label: "Receive", icon: ArrowDownToLine },
      { href: "/transactions", label: "Transactions", icon: History },
    ],
  },
  {
    label: null,
    items: [{ href: "/settings", label: "Settings", icon: Settings }],
  },
];

export function AccountLayout({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <div className="flex flex-col h-full">
      <nav className="flex-1 space-y-6 p-4">
        {navSections.map((section) => (
          <div key={section.label ?? "bottom"}>
            {section.label && (
              <p className="px-4 mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {section.label}
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
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 space-y-2">
        <p className="text-xs text-gray-500 px-2">Need help?</p>
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onLinkClick}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-yellow-400 hover:bg-yellow-400/10 transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          Contact Support
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar - scrollbar hidden via .account-sidebar in globals.css */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col">
        <div className="account-sidebar flex grow flex-col gap-y-5 overflow-y-auto overflow-x-hidden rounded-r-2xl border-r border-white/10 bg-white/5 backdrop-blur-xl px-4 pb-4 pt-6">
          <Link href="/dashboard" className="flex items-center gap-2 px-4">
            <span className="text-lg font-bold text-white">Account</span>
          </Link>
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
                <DrawerHeader>
                  <DrawerTitle className="text-white">Menu</DrawerTitle>
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
              <p className="text-xs text-gray-500 truncate">Verified User</p>
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
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/vault" className="cursor-pointer">
                    Blockchain Vault
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/lenix-wallet" className="cursor-pointer">
                    Lenix Wallet
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/crypto-loan" className="cursor-pointer">
                    Crypto Loan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/assets" className="cursor-pointer">
                    Assets
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/send" className="cursor-pointer">
                    Send
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/receive" className="cursor-pointer">
                    Receive
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/transactions" className="cursor-pointer">
                    Transactions
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-400 focus:text-red-400 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
