"use client";

import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
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
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { adminGlass } from "@/lib/admin-glass";

interface AdminSession {
  id: string;
  email: string;
  username: string;
  role: string;
}

interface AdminSidebarProps {
  admin: AdminSession;
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Users & funds",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/balances", label: "Balances", icon: Wallet },
      { href: "/admin/banking", label: "Banking", icon: Building2 },
      { href: "/admin/account-controls", label: "Account controls", icon: ShieldAlert },
    ],
  },
  {
    label: "Queues",
    items: [
      { href: "/admin/recovery", label: "Recovery", icon: ShieldCheck },
      { href: "/admin/refunds", label: "Refunds", icon: FileText },
      { href: "/admin/loans", label: "Loans", icon: Banknote },
    ],
  },
  {
    label: "Access",
    items: [
      { href: "/admin/admins", label: "Admins", icon: UserCog },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

function adminDisplayName(username: string | undefined, email: string) {
  if (username?.trim()) return username.trim();
  const local = email.split("@")[0] ?? "Admin";
  return local.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function adminInitials(username: string | undefined, email: string) {
  const name = adminDisplayName(username, email);
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatRole(role: string) {
  if (!role) return "Admin";
  return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayName = adminDisplayName(admin.username, admin.email);
  const initials = adminInitials(admin.username, admin.email);

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

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const SidebarContent = () => (
    <>
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-white/[0.06] px-4">
        <Link href="/admin/dashboard" className="flex min-w-0 flex-1 items-center gap-2">
          <Image
            src="/assets/img/logo.png"
            alt="Lenix Protocol"
            width={120}
            height={32}
            className="h-5 w-auto"
          />
        </Link>
        <span
          className="shrink-0 rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-zinc-400"
        >
          Console
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {navGroups.map((group) => (
          <div key={group.label} className={adminGlass.sidebarSection}>
            <p className={adminGlass.sidebarLabel}>{group.label}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={active ? adminGlass.navItemActive : adminGlass.navItem}
                    >
                      <Icon className={active ? adminGlass.navIconActive : adminGlass.navIcon} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/[0.06] p-3">
        <div className="mb-2 flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] text-[11px] font-semibold text-zinc-300"
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-white">{displayName}</p>
            <p className="truncate text-[11px] text-zinc-500">{formatRole(admin.role)}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`${adminGlass.navItem} w-full text-zinc-500 hover:text-zinc-300 disabled:opacity-50`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {isLoggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </>
  );

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between px-4 lg:hidden ${adminGlass.mobileBar}`}
      >
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Image
            src="/assets/img/logo.png"
            alt="Lenix Protocol"
            width={100}
            height={28}
            className="h-5 w-auto"
          />
          <span className="text-[10px] font-medium tracking-wide text-zinc-500">Console</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-2 text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full flex-col border-r transition-transform duration-200 ease-out lg:hidden ${adminGlass.sidebar} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      <aside
        className={`fixed left-0 top-0 hidden h-full flex-col border-r lg:flex ${adminGlass.sidebar}`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
