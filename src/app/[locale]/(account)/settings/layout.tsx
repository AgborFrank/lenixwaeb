"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, LogOut, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { getSettingsAndUser } from "./actions";

function initials(name: string | null, email: string | undefined): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "?";
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tLayout = useTranslations("Settings.Layout");
  const tNav = useTranslations("Settings.Nav");
  const pathname = usePathname();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    getSettingsAndUser().then(({ user, settings }) => {
      if (user) setEmail(user.email ?? "");
      if (settings) {
        setDisplayName(settings.display_name);
        setAvatarUrl(settings.avatar_url);
      }
    });
  }, []);

  const navItems = [
    {
      title: tNav("profile"),
      href: "/settings",
      active: pathname === "/settings" || pathname.endsWith("/settings"),
      group: "primary"
    },
    {
      title: tNav("preferences"),
      href: "/settings/preferences",
      active: pathname.includes("/settings/preferences"),
      group: "primary"
    },
    {
      title: tNav("advanced"),
      href: "/settings/advanced",
      active: pathname.includes("/settings/advanced"),
      group: "primary"
    },
    {
      title: tNav("contacts"),
      href: "/settings/contacts",
      active: pathname.includes("/settings/contacts"),
      group: "primary"
    },
    {
      title: tNav("security_privacy"),
      href: "/settings/security",
      active: pathname.includes("/settings/security"),
      group: "security"
    },
    {
      title: tNav("notifications"),
      href: "/settings/notifications",
      active: pathname.includes("/settings/notifications"),
      group: "security"
    },
    {
      title: tNav("networks"),
      href: "/settings/networks",
      active: pathname.includes("/settings/networks"),
      group: "system"
    },
    {
      title: tNav("about"),
      href: "/settings/about",
      active: pathname.includes("/settings/about"),
      group: "system"
    },
  ];

  // For mobile, if we are in a sub-page, we show a back button and the sub-page content only
  const isBasePage = pathname.endsWith("/settings") || pathname.endsWith("/settings/");

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-0 lg:gap-6 pb-12">
      {/* Sidebar Navigation - Hidden on mobile when viewing a sub-page */}
      <aside className={cn(
        "lg:w-72 shrink-0 flex flex-col gap-4",
        !isBasePage && "hidden lg:flex"
      )}>
        <div className="px-4 lg:px-0 mt-3 lg:mt-0">
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            {tLayout("title")}
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            {tLayout("subtitle")}
          </p>
        </div>

        {/* User Card */}
        <div className="mx-4 lg:mx-0 p-3 rounded-xl bg-zinc-900/50 border border-white/5 flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-zinc-700">
            <AvatarImage src={avatarUrl ?? undefined} />
            <AvatarFallback className="bg-yellow-500 text-zinc-950 text-sm font-bold">
              {initials(displayName, email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-tight truncate">
              {displayName || tLayout("user_fallback")}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5 truncate">{email}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex flex-col gap-4 px-4 lg:px-0">
          {["primary", "security", "system"].map((group) => (
            <div key={group} className="flex flex-col gap-1">
              <h3 className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-2 mb-1">
                {tNav(`groups.${group}`)}
              </h3>
              <div className="flex flex-col gap-1">
                {navItems
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg transition-colors group",
                        item.active
                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 border border-transparent"
                      )}
                    >
                      <span className="text-sm font-medium">{item.title}</span>
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform group-hover:translate-x-0.5",
                        item.active ? "text-yellow-400" : "text-zinc-600"
                      )} />
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sign Out Button */}
        <div className="px-4 lg:px-0 pt-4 mt-auto border-t border-white/5">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-auto px-3 py-2.5 rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-colors group"
          >
            <LogOut className="h-4 w-4" />
            <div className="text-left">
              <p className="text-sm font-medium">{tLayout("sign_out")}</p>
            </div>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 min-w-0 transition-all duration-300",
        "block"
      )}>
        {/* Mobile Header with Back Button */}
        {!isBasePage && (
          <>
          <div className="lg:hidden flex items-center h-14 px-4 border-b border-white/5 bg-zinc-900/50 sticky top-0 z-10 backdrop-blur-xl">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/settings")}
              className="text-zinc-400"
              aria-label={tLayout("back")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="flex-1 px-2 text-sm font-semibold text-white truncate">
              {navItems.find(item => item.active)?.title || tLayout("title")}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileNavOpen(true)}
              className="text-zinc-400 hover:text-white"
              aria-label="Open settings navigation"
              aria-expanded={mobileNavOpen}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          {mobileNavOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-sm">
              <div className="flex h-full flex-col overflow-y-auto px-4 py-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <p className="text-lg font-semibold text-white">{tLayout("mobile_nav_title")}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">{tLayout("mobile_nav_subtitle")}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileNavOpen(false)}
                    className="text-zinc-400 hover:text-white"
                    aria-label="Close settings navigation"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="mt-5 space-y-5">
                  {["primary", "security", "system"].map((group) => (
                    <div key={group}>
                      <h3 className="px-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                        {tNav(`groups.${group}`)}
                      </h3>
                      <div className="mt-1 space-y-1">
                        {navItems
                          .filter((item) => item.group === group)
                          .map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileNavOpen(false)}
                              className={cn(
                                "flex items-center justify-between rounded-lg px-3 py-3 text-sm transition-colors",
                                item.active
                                  ? "bg-yellow-500/10 text-yellow-400"
                                  : "text-zinc-300 hover:bg-zinc-900"
                              )}
                            >
                              <span className="font-medium">{item.title}</span>
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          ))}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          )}
          </>
        )}

        <div className={cn(
          "bg-zinc-900/40 lg:border border-white/5 rounded-none lg:rounded-xl p-4 sm:p-5 lg:p-6 min-h-0",
          !isBasePage && "pt-5 lg:pt-6"
        )}>
          {children}
        </div>
      </main>
    </div>
  );
}
