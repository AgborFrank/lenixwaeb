"use client";

import { Link, usePathname } from "@/i18n/navigation";
import {
  Settings,
  User,
  Shield,
  Bell,
  Key,
  ChevronLeft,
} from "lucide-react";

const settingsNav = [
  {
    label: "General",
    href: "/admin/settings/general",
    icon: Settings,
    description: "Platform configuration and defaults",
  },
  {
    label: "Account",
    href: "/admin/settings/account",
    icon: User,
    description: "Your profile and preferences",
  },
  {
    label: "Security",
    href: "/admin/settings/security",
    icon: Shield,
    description: "Password and authentication",
  },
  {
    label: "Notifications",
    href: "/admin/settings/notifications",
    icon: Bell,
    description: "Email and alert preferences",
  },
  {
    label: "API",
    href: "/admin/settings/api",
    icon: Key,
    description: "API keys and webhooks",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/50 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-zinc-400">
          Manage your admin account and platform settings
        </p>
      </div>

      <div className="flex">
        {/* Settings Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-zinc-800 lg:block">
          <nav className="sticky top-0 space-y-1 p-4">
            {settingsNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-start gap-3 rounded-lg px-3 py-3 transition-colors ${
                    active
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`mt-0.5 h-5 w-5 shrink-0 ${
                      active ? "text-yellow-400" : "text-zinc-500 group-hover:text-zinc-400"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">{item.description}</p>
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation */}
        <div className="border-b border-zinc-800 lg:hidden">
          <div className="flex gap-1 overflow-x-auto p-2">
            {settingsNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-yellow-400" : ""}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
