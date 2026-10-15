/** Glass surfaces for admin console — Vercel-like structure, forensic glass tokens. */
export const adminGlass = {
  page: "mx-auto flex w-full max-w-[1400px] flex-col gap-8",
  eyebrow: "text-xs font-medium tracking-wide text-zinc-500",
  title: "text-2xl font-semibold tracking-tight text-white sm:text-3xl",
  description: "max-w-2xl text-sm leading-relaxed text-zinc-400",
  surface:
    "rounded-xl border border-white/[0.08] bg-white/[0.03] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-xl",
  surfaceStrong:
    "rounded-xl border border-white/[0.1] bg-black/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl",
  divider: "border-white/[0.06]",
  menu:
    "min-w-[13rem] border-white/10 bg-zinc-950/95 text-zinc-100 shadow-xl backdrop-blur-xl",
  menuLabel: "px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-500",
  dialog: "border-white/10 bg-zinc-950/95 text-white backdrop-blur-xl",
  field:
    "border-white/10 bg-black/30 text-white placeholder:text-zinc-500 focus-visible:border-white/20 focus-visible:ring-white/10",
  chip:
    "inline-flex h-8 items-center rounded-md border border-transparent px-3 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-zinc-200",
  chipActive:
    "inline-flex h-8 items-center rounded-md border border-white/10 bg-white/[0.08] px-3 text-xs font-medium text-white shadow-sm",
  tableHead:
    "h-10 px-4 text-left align-middle text-[11px] font-medium tracking-wide text-zinc-500",
  tableCell: "px-4 py-3 align-middle text-sm text-zinc-300",
} as const;
