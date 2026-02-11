"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, User, Shield, Sliders, ChevronRight, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Profile",
      description: "Personal details & picture",
      icon: User,
      href: "/settings",
      active: pathname === "/settings",
    },
    {
      title: "Security",
      description: "Password & 2FA",
      icon: Shield,
      href: "/settings/security",
      active: pathname === "/settings/security",
    },
    {
      title: "Preferences",
      description: "Language & Notifications",
      icon: Sliders,
      href: "/settings/preferences",
      active: pathname === "/settings/preferences",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          Account Settings
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Manage your personal information and preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:w-80 flex-shrink-0 flex flex-col gap-4">
          
          {/* User Profile Header */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-white/5">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-zinc-700">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-yellow-500 text-black font-bold">JD</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-bold text-white leading-none">John Doe</p>
                <p className="text-xs text-zinc-500 mt-1">john.doe@example.com</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col w-full h-auto bg-transparent p-0 gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "w-full relative flex items-center justify-between p-4 h-auto rounded-xl border transition-all group",
                  item.active
                    ? "bg-zinc-900 border-yellow-500/50"
                    : "bg-zinc-900/50 border-white/5 hover:bg-zinc-900"
                )}
              >
                <div className="flex items-center gap-4 text-left">
                  <div
                    className={cn(
                      "flex-shrink-0 p-2 rounded-lg transition-colors",
                      item.active
                        ? "bg-yellow-500 text-black"
                        : "bg-zinc-800 text-zinc-400 group-hover:bg-yellow-500 group-hover:text-black"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p
                      className={cn(
                        "text-xs mt-0.5",
                        item.active ? "text-zinc-400" : "text-zinc-500 group-hover:text-zinc-400"
                      )}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={cn(
                    "h-5 w-5 transition-colors",
                    item.active ? "text-yellow-500" : "text-zinc-600 group-hover:text-yellow-500"
                  )}
                />
              </Link>
            ))}
          </div>

          <div className="pt-2">
            <Button
              variant="ghost"
              className="w-full justify-between p-4 h-auto rounded-xl border border-transparent hover:bg-red-500/10 hover:border-red-500/20 group"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="flex-shrink-0 p-2 rounded-lg bg-zinc-800 text-zinc-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <LogOut className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-zinc-400 group-hover:text-red-400 transition-colors">
                    Sign Out
                  </p>
                  <p className="text-xs text-zinc-600 group-hover:text-red-400/70 transition-colors">
                    Log out of your account
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-700 group-hover:text-red-400 transition-colors" />
            </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl min-h-[600px]">
             {children}
          </div>
        </div>
      </div>
    </div>
  );
}
