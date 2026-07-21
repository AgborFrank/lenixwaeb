"use client";

import { BookmarkPlus, ChevronRight } from "lucide-react";

const ADDRESSES = [
  { label: "Alice", address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", network: "ERC20" },
  { label: "Bob", address: "0x82C7656EC7ab88b098defB751B7401B5f6d8991A", network: "ERC20" },
  { label: "Exchange", address: "0x12C7656EC7ab88b098defB751B7401B5f6d8944D", network: "BEP20" },
];

function truncateAddress(value: string) {
  if (value.length <= 16) return value;
  return `${value.slice(0, 8)}...${value.slice(-8)}`;
}

export function RecentRecipients() {
  return (
    <aside className="rounded-2xl border border-white/10 bg-black/30 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">Saved recipients</h2>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">Select a verified address or manage your address book.</p>
        </div>
        <button type="button" aria-label="Add recipient" className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/6 hover:text-white">
          <BookmarkPlus className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <ul className="mt-4 space-y-1" aria-label="Saved recipient addresses">
        {ADDRESSES.map((item) => (
          <li key={item.address}>
            <button type="button" className="group flex w-full items-center justify-between gap-3 rounded-xl px-2.5 py-3 text-left transition-colors hover:bg-white/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/50">
              <span className="min-w-0">
                <span className="block text-sm font-medium text-zinc-200">{item.label}</span>
                <span className="mt-1 block truncate font-mono text-xs text-zinc-500">{truncateAddress(item.address)}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1 text-xs text-zinc-500 group-hover:text-zinc-300">
                {item.network}
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <button type="button" className="mt-4 w-full rounded-xl border border-white/10 px-3 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/6 hover:text-white">
        Manage address book
      </button>
    </aside>
  );
}
