/**
 * Production-grade wallet UI design tokens
 * Mobile-first responsive system inspired by Coinbase/Binance
 */

export const wallet = {
  // Layout
  container: "mx-auto max-w-7xl px-2 pb-8 sm:px-6 lg:px-8",
  grid: "grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4",
  mainCol: "space-y-3 lg:col-span-2",
  sideCol: "space-y-3",

  // Typography - Mobile-first with desktop scaling
  pageTitle: "text-lg font-semibold text-white sm:text-xl",
  pageSubtitle: "mt-0.5 text-xs text-zinc-500 sm:text-sm",
  sectionTitle: "text-sm font-medium text-white",
  cardTitle: "text-xs font-medium text-black",
  balanceText: "flex items-center gap-2 text-xl font-bold tabular-nums tracking-tight text-black sm:text-2xl",
  balanceSecondary: "text-xs text-zinc-500",
  label: "text-xs font-medium text-zinc-800 uppercase tracking-wide",
  value: "text-sm font-medium text-white",

  // Cards
  card: "rounded-2xl border border-white/[0.06] bg-zinc-900/50 p-3 sm:p-4",
  cardFlat: "rounded-xl border border-white/[0.06] bg-zinc-900/30",
  balanceCard:
    "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900 p-4",

  // Buttons
  actionBtn:
    "flex flex-1 flex-col items-center justify-center gap-1 rounded-xl bg-zinc-900/60 py-2 text-center transition-colors hover:bg-zinc-800 active:scale-[0.98] sm:py-2.5",
  actionIcon: "h-4 w-4 text-zinc-300",
  actionLabel: "text-[11px] font-medium text-zinc-400",
  primaryBtn:
    "h-9 w-full rounded-lg bg-[#FCD535] text-sm font-medium text-black transition-colors hover:bg-[#F0B90B] disabled:bg-zinc-800 disabled:text-zinc-500",
  secondaryBtn:
    "h-9 rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white sm:h-10 sm:px-4",
  ghostBtn:
    "inline-flex items-center gap-1.5 bg-white rounded-lg px-2 py-1 text-xs text-black transition-colors hover:bg-white/5 hover:text-white sm:px-3 sm:py-1.5 sm:text-sm",

  // List items
  listItem:
    "flex items-center justify-between gap-3 border-b border-white/[0.04] px-1 py-2 last:border-0",
  listIcon: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800",

  // Status indicators
  statusDot: "h-2 w-2 rounded-full",
  statusGreen: "bg-emerald-400",
  statusYellow: "bg-yellow-400",
  statusRed: "bg-red-400",
  badge:
    "inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-400 sm:text-xs",
  badgeSuccess: "bg-emerald-500/10 text-emerald-400",
  badgeWarning: "bg-yellow-500/10 text-yellow-400",

  // Inputs
  input:
    "h-9 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 text-sm text-white placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none",

  // Address display
  address: "font-mono text-xs text-zinc-400 sm:text-sm",
  addressTruncated: "max-w-[120px] truncate sm:max-w-none",

  // Empty states
  emptyState: "flex flex-col items-center gap-2 py-5 text-center",
  emptyIcon: "h-8 w-8 text-zinc-700",
  emptyText: "text-sm text-zinc-500",

  // Dividers
  divider: "border-t border-white/[0.04]",

  // Responsive utilities
  hideOnMobile: "hidden sm:block",
  showOnMobile: "sm:hidden",
} as const;
