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
  shell:
    "min-h-screen bg-black text-zinc-100 [background-image:radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(255,255,255,0.06),transparent)]",
  sidebar:
    "flex h-full w-[260px] flex-col border-white/[0.08] bg-zinc-950/75 backdrop-blur-xl",
  sidebarSection: "px-3 pt-4 first:pt-3",
  sidebarLabel: "mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wider text-zinc-600",
  navItem:
    "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] font-medium text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-zinc-200",
  navItemActive:
    "flex items-center gap-2.5 rounded-md border border-white/[0.08] bg-white/[0.08] px-2 py-1.5 text-[13px] font-medium text-white shadow-sm",
  navIcon: "h-4 w-4 shrink-0 text-zinc-500",
  navIconActive: "h-4 w-4 shrink-0 text-zinc-300",
  mobileBar:
    "border-b border-white/[0.08] bg-zinc-950/90 backdrop-blur-xl",
  main: "flex min-h-screen flex-1 flex-col lg:ml-[260px]",
  mainInner: "flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8",
  settingsNavWidth: "lg:w-[220px]",
  settingsContent: "min-w-0 flex-1 space-y-6 lg:max-w-3xl",
  settingsPageTitle: "text-lg font-semibold tracking-tight text-white sm:text-xl",
  settingsPageDesc: "text-sm leading-relaxed text-zinc-400",
  settingsSectionHeader:
    "flex flex-col gap-3 border-b border-white/[0.06] px-4 py-3.5 sm:flex-row sm:items-start sm:justify-between sm:px-5",
  settingsSectionTitle: "text-sm font-medium text-white",
  settingsSectionDesc: "mt-0.5 text-xs leading-relaxed text-zinc-500",
  settingsSectionBody: "space-y-4 p-4 sm:p-5",
  settingsRow:
    "flex flex-col gap-3 border-b border-white/[0.06] px-4 py-3.5 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5",
  settingsDlRow:
    "flex flex-col gap-1 border-b border-white/[0.06] px-4 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:px-5",
  fieldLabel: "mb-1.5 block text-[13px] font-medium text-zinc-300",
  fieldHint: "mt-1.5 text-xs text-zinc-500",
  input:
    "h-9 w-full rounded-md border border-white/10 bg-black/30 px-3 text-sm text-white placeholder:text-zinc-500 focus-visible:border-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/10",
  buttonPrimary:
    "inline-flex h-9 items-center justify-center gap-2 rounded-md bg-white px-4 text-[13px] font-medium text-black transition-colors hover:bg-zinc-200 disabled:pointer-events-none disabled:opacity-50",
  buttonSecondary:
    "inline-flex h-9 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-4 text-[13px] font-medium text-zinc-200 transition-colors hover:bg-white/[0.06] disabled:pointer-events-none disabled:opacity-50",
  buttonGhost:
    "inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-[13px] font-medium text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-zinc-200",
  badgeMuted:
    "inline-flex items-center rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-zinc-400",
} as const;
