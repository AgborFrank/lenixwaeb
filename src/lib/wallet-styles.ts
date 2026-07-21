/**
 * Production-grade wallet UI design tokens
 * Mobile-first responsive system inspired by Coinbase/Binance
 */

export const wallet = {
  // Layout
  container: "mx-auto max-w-7xl px-2 pb-24 sm:px-6 lg:px-8",
  grid: "grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6",
  mainCol: "lg:col-span-2 space-y-5",
  sideCol: "space-y-5",

  // Typography - Mobile-first with desktop scaling
  pageTitle: "text-xl font-semibold text-white sm:text-2xl",
  pageSubtitle: "mt-0.5 text-sm text-zinc-500",
  sectionTitle: "text-base font-medium text-white sm:text-lg",
  cardTitle: "text-sm font-medium text-black",
  balanceText: "text-2xl font-bold flex items-center gap-2 tabular-nums tracking-tight text-black sm:text-3xl lg:text-4xl",
  balanceSecondary: "text-xs text-zinc-500 sm:text-sm",
  label: "text-xs font-medium text-zinc-800 uppercase tracking-wide",
  value: "text-sm font-medium text-white",

  // Cards
  card: "rounded-2xl border border-white/[0.06] bg-zinc-900/50 p-4 sm:p-5",
  cardFlat: "rounded-xl border border-white/[0.06] bg-zinc-900/30",
  balanceCard:
    "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900 p-5 sm:p-6",

  // Buttons
  actionBtn:
    "flex flex-1 flex-col items-center justify-center gap-1.5 rounded-xl bg-zinc-900/60 py-3 text-center transition-colors hover:bg-zinc-800 active:scale-[0.98] sm:gap-2 sm:py-4",
  actionIcon: "h-5 w-5 text-zinc-300 sm:h-6 sm:w-6",
  actionLabel: "text-[11px] font-medium text-zinc-400 sm:text-xs",
  primaryBtn:
    "h-10 w-full rounded-lg bg-[#FCD535] text-sm font-medium text-black transition-colors hover:bg-[#F0B90B] disabled:bg-zinc-800 disabled:text-zinc-500 sm:h-11",
  secondaryBtn:
    "h-9 rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white sm:h-10 sm:px-4",
  ghostBtn:
    "inline-flex items-center gap-1.5 bg-white rounded-lg px-2 py-1 text-xs text-black transition-colors hover:bg-white/5 hover:text-white sm:px-3 sm:py-1.5 sm:text-sm",

  // List items
  listItem:
    "flex items-center justify-between gap-3 border-b border-white/[0.04] px-1 py-3 last:border-0 sm:py-4",
  listIcon: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800 sm:h-10 sm:w-10",

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
    "h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 text-sm text-white placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none sm:h-11",

  // Address display
  address: "font-mono text-xs text-zinc-400 sm:text-sm",
  addressTruncated: "max-w-[120px] truncate sm:max-w-none",

  // Empty states
  emptyState: "flex flex-col items-center gap-3 py-8 text-center sm:py-12",
  emptyIcon: "h-12 w-12 text-zinc-700 sm:h-16 sm:w-16",
  emptyText: "text-sm text-zinc-500",

  // Dividers
  divider: "border-t border-white/[0.04]",

  // Responsive utilities
  hideOnMobile: "hidden sm:block",
  showOnMobile: "sm:hidden",
} as const;
