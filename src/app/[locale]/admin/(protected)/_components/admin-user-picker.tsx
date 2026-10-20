"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronsUpDown, Loader2, Search, User } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { adminGlass } from "@/lib/admin-glass";
import { cn } from "@/lib/utils";

export interface AdminUserPickerOption {
  id: string;
  email: string | null;
  displayName: string;
  verified: boolean;
  hasWallet: boolean;
}

interface AdminUserPickerProps {
  value: string;
  onChange: (userId: string) => void;
  label?: string;
  hint?: string;
}

export function AdminUserPicker({
  value,
  onChange,
  label = "User",
  hint = "Search by email or name. IDs stay internal.",
}: AdminUserPickerProps) {
  const [users, setUsers] = useState<AdminUserPickerOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (!cancelled && res.ok && data.users) {
          setUsers(data.users);
        }
      } catch {
        if (!cancelled) setUsers([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = users.find((u) => u.id === value);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((user) => {
      if (user.id.toLowerCase().includes(q)) return true;
      if (user.email?.toLowerCase().includes(q)) return true;
      return user.displayName.toLowerCase().includes(q);
    });
  }, [users, search]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label className={adminGlass.fieldLabel}>{label}</label>
        <Link
          href="/admin/users"
          className="text-[11px] font-medium text-zinc-500 hover:text-zinc-300"
        >
          User directory
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2 rounded-md border border-white/10 bg-black/30 px-3 py-2 text-left text-sm text-white transition-colors hover:border-white/20 ${adminGlass.input}`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="flex min-w-0 items-center gap-2">
          <User className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
          {selected ? (
            <span className="truncate">
              <span className="font-medium">{selected.displayName}</span>
              {selected.email ? (
                <span className="text-zinc-500"> · {selected.email}</span>
              ) : null}
            </span>
          ) : value ? (
            <span className="truncate text-zinc-400">User {value.slice(0, 8)}…</span>
          ) : (
            <span className="text-zinc-500">Select a user</span>
          )}
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
      </button>

      {hint ? <p className={adminGlass.fieldHint}>{hint}</p> : null}

      {open ? (
        <div
          className={`${adminGlass.surface} mt-1 overflow-hidden`}
          role="listbox"
          aria-label="Users"
        >
          <div className="border-b border-white/[0.06] p-2">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
                aria-hidden
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search email or name…"
                className={`${adminGlass.input} pl-8`}
                autoFocus
              />
            </div>
          </div>

          <ul className="max-h-56 overflow-y-auto p-1">
            {isLoading ? (
              <li className="flex items-center justify-center gap-2 py-8 text-sm text-zinc-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading accounts…
              </li>
            ) : filtered.length === 0 ? (
              <li className="py-6 text-center text-sm text-zinc-500">No matching users</li>
            ) : (
              filtered.map((user) => {
                const active = user.id === value;
                return (
                  <li key={user.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        onChange(user.id);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={cn(
                        "flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors",
                        active ? "bg-white/[0.08] text-white" : "text-zinc-300 hover:bg-white/[0.05]",
                      )}
                    >
                      <Check
                        className={cn(
                          "mt-0.5 h-3.5 w-3.5 shrink-0",
                          active ? "opacity-100 text-white" : "opacity-0",
                        )}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{user.displayName}</span>
                        <span className="block truncate text-xs text-zinc-500">
                          {user.email ?? "No email"}
                          {user.hasWallet ? " · wallet" : ""}
                          {!user.verified ? " · unverified" : ""}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
