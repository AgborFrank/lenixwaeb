"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Wallet,
  ShieldCheck,
  FileText,
  Banknote,
  UserCog,
  LogOut,
  Menu,
  X,
  Building2,
  Settings,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AdminSession {
  id: string;
  email: string;
  username: string;
  role: string;
}

interface AdminSidebarProps {
  admin: AdminSession;
}

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/balances", label: "Balance Operations", icon: Wallet },
  { href: "/admin/banking", label: "Banking Services", icon: Building2 },
  { href: "/admin/account-controls", label: "Account Controls", icon: ShieldAlert },
  { href: "/admin/recovery", label: "Recovery Requests", icon: ShieldCheck },
  { href: "/admin/loans", label: "Loans", icon: Banknote },
  { href: "/admin/admins", label: "Admin Management", icon: UserCog },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Failed to log out");
      setIsLoggingOut(false);
    }
  };

  const isActive = (href: string) => {
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, "");
    return pathWithoutLocale === href || pathWithoutLocale.startsWith(href + "/");
  };

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center gap-3 border-b border-zinc-800 px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Image
            src="/assets/img/logo.png"
            alt="Lenix Protocol"
            width={120}
            height={32}
            className="h-6 w-auto"
          />
        </Link>
        <span className="rounded bg-yellow-400/10 px-2 py-0.5 text-xs font-medium text-yellow-400">
          Admin
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-yellow-400/10 text-yellow-400"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800 p-3">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-zinc-800/50 px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400/10 text-sm font-bold text-yellow-400">
            {admin.username.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {admin.username}
            </p>
            <p className="truncate text-xs text-zinc-500">{admin.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {isLoggingOut ? "Logging out..." : "Log Out"}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 lg:hidden">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Image
            src="/assets/img/logo.png"
            alt="Lenix Protocol"
            width={100}
            height={28}
            className="h-5 w-auto"
          />
          <span className="rounded bg-yellow-400/10 px-1.5 py-0.5 text-[10px] font-medium text-yellow-400">
            Admin
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-zinc-950 transition-transform lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r border-zinc-800 bg-zinc-950 lg:flex">
        <SidebarContent />
      </aside>
    </>
  );
}
