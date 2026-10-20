"use client";

import { Link, usePathname } from "@/i18n/navigation";
import {
  Settings,
  User,
  Shield,
  Bell,
  Key,
  ChevronLeft,
  Globe,
  Layers,
  Coins,
  Landmark,
} from "lucide-react";
import { adminGlass } from "@/lib/admin-glass";

const settingsGroups = [
  {
    label: "Platform",
    items: [
      { label: "Overview", href: "/admin/settings", icon: Settings },
      { label: "Site", href: "/admin/settings/platform", icon: Globe },
      { label: "Services", href: "/admin/settings/services", icon: Layers },
      { label: "Web3", href: "/admin/settings/web3", icon: Coins },
      { label: "Financial", href: "/admin/settings/financial", icon: Landmark },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Account", href: "/admin/settings/account", icon: User },
      { label: "Security", href: "/admin/settings/security", icon: Shield },
      { label: "Notifications", href: "/admin/settings/notifications", icon: Bell },
      { label: "API", href: "/admin/settings/api", icon: Key },
    ],
  },
] as const;

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin/settings") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className={`${adminGlass.page} !max-w-[1100px] !gap-8`}>
      <header className="space-y-4">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
          Dashboard
        </Link>
        <div>
          <p className={adminGlass.eyebrow}>Project</p>
          <h1 className={adminGlass.title}>Settings</h1>
          <p className={`mt-2 ${adminGlass.description}`}>
            Platform behavior, product surfaces, Web3 parameters, and admin preferences.
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className={`shrink-0 ${adminGlass.settingsNavWidth}`}>
          <nav
            className={`${adminGlass.surface} overflow-hidden lg:sticky lg:top-6`}
            aria-label="Settings"
          >
            {settingsGroups.map((group) => (
              <div key={group.label} className={adminGlass.sidebarSection}>
                <p className={adminGlass.sidebarLabel}>{group.label}</p>
                <ul className="space-y-0.5 px-1 pb-2">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={active ? adminGlass.navItemActive : adminGlass.navItem}
                        >
                          <Icon
                            className={active ? adminGlass.navIconActive : adminGlass.navIcon}
                          />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <div className={adminGlass.settingsContent}>{children}</div>
      </div>
    </div>
  );
}
