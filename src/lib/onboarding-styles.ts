/** Onboarding layout and form tokens - Enterprise Compact Glassmorphism */
export const onboarding = {
  page: "relative min-h-screen overflow-x-hidden text-zinc-100 antialiased selection:bg-amber-400 selection:text-black",
  bgImage: "pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40",
  bgOverlay: "pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-zinc-950/80 via-zinc-950/90 to-black",
  
  header:
    "relative z-20 border-b border-white/[0.08] bg-zinc-950/40 backdrop-blur-xl",
  headerInner:
    "mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8",
  logo: "h-6 w-auto sm:h-7 transition-opacity hover:opacity-90",
  skipLink:
    "text-xs text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/50 rounded px-2 py-1",
  main: "relative z-10 mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-6 pb-20 sm:pb-8",
  workspace: "mt-4 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_260px] xl:gap-6",
  workspaceCentered: "mx-auto w-full max-w-2xl space-y-4",
  workspaceDetails: "mx-auto w-full max-w-2xl space-y-4",
  backLink:
    "mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-amber-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/50 rounded px-1.5 py-1",

  card: "relative overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.035] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.14)] backdrop-blur-2xl ring-1 ring-black/40",
  cardHeader: "border-b border-white/[0.07] bg-white/[0.015] px-5 py-4 sm:px-6 sm:py-4.5",
  cardBody: "px-5 py-4 sm:px-6 sm:py-5",
  cardFooter:
    "flex flex-col-reverse gap-2.5 border-t border-white/[0.07] bg-black/25 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6 sm:py-3.5 backdrop-blur-xl",
  cardFooterSticky:
    "fixed inset-x-0 bottom-0 z-30 flex flex-col-reverse gap-2.5 border-t border-white/[0.12] bg-zinc-950/85 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-2xl sm:static sm:border-t sm:border-white/[0.07] sm:bg-black/25 sm:px-6 sm:py-3.5 sm:backdrop-blur-none",

  fieldStack: "space-y-3.5",

  title: "text-lg sm:text-xl font-bold tracking-tight text-white",
  subtitle: "mt-1 text-xs sm:text-[13px] leading-relaxed text-zinc-400",
  sectionTitle: "text-xs sm:text-sm font-semibold tracking-wide text-zinc-200 uppercase",
  sectionDesc: "mt-0.5 text-xs text-zinc-500",
  label: "text-xs font-medium text-zinc-300 tracking-wide pb-1 block",
  hint: "mt-1 text-[11px] text-zinc-500",
  required: "text-amber-400 ml-0.5 font-normal",
  gridGap: "gap-3 sm:gap-3.5",
  field: "space-y-1.5",
  input:
    "h-9.5 sm:h-10 rounded-lg border border-white/[0.10] bg-white/[0.03] px-3 text-xs sm:text-sm text-white shadow-sm placeholder:text-zinc-500 transition-all hover:border-white/20 focus-visible:border-amber-400/60 focus-visible:ring-1 focus-visible:ring-amber-400/40 focus-visible:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed",
  textarea:
    "min-h-[84px] resize-y rounded-lg border border-white/[0.10] bg-white/[0.03] px-3 py-2 text-xs sm:text-sm leading-relaxed text-white shadow-sm placeholder:text-zinc-500 transition-all hover:border-white/20 focus-visible:border-amber-400/60 focus-visible:ring-1 focus-visible:ring-amber-400/40 focus-visible:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed",
  selectTrigger:
    "h-9.5 sm:h-10 rounded-lg border border-white/[0.10] bg-white/[0.03] px-3 text-xs sm:text-sm text-white shadow-sm transition-all hover:border-white/20 focus:ring-1 focus:ring-amber-400/40 focus:border-amber-400/60 disabled:opacity-50 disabled:cursor-not-allowed [&>svg]:text-zinc-400",
  selectContent: "rounded-xl border border-white/[0.12] bg-zinc-950/95 text-white shadow-2xl backdrop-blur-2xl ring-1 ring-black/60",
  selectItem: "rounded-md text-xs sm:text-sm px-2.5 py-1.5 focus:bg-amber-400/15 focus:text-amber-300 cursor-pointer transition-colors",

  section: "space-y-3",
  sectionHeader: "space-y-0.5",

  choiceList: "mt-2 space-y-2",
  choiceRow:
    "group relative flex w-full cursor-pointer items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 text-left transition-all hover:border-white/20 hover:bg-white/[0.05] has-[:checked]:border-amber-400/50 has-[:checked]:bg-amber-400/[0.08] has-[[data-state=checked]]:border-amber-400/50 has-[[data-state=checked]]:bg-amber-400/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
  choiceIcon:
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 [&_svg]:h-4 [&_svg]:w-4 group-has-[:checked]:border-amber-400/40 group-has-[:checked]:bg-amber-400/10 group-has-[:checked]:text-amber-400 transition-colors",
  choiceContent: "min-w-0 flex-1",
  choiceTitle: "text-xs sm:text-sm font-semibold text-white",
  choiceDesc: "mt-0.5 text-xs text-zinc-400 leading-normal",
  choiceIndicator:
    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-zinc-600 group-has-[:checked]:border-amber-400 group-has-[:checked]:bg-amber-400 group-has-[[data-state=checked]]:border-amber-400 group-has-[[data-state=checked]]:bg-amber-400 transition-all",
  choiceIndicatorDot:
    "h-1.5 w-1.5 rounded-full bg-zinc-950 opacity-0 group-has-[:checked]:opacity-100 group-has-[[data-state=checked]]:opacity-100 transition-opacity",

  serviceLegend: "text-xs font-semibold uppercase tracking-wider text-zinc-400",
  serviceList: "mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2",
  serviceOption:
    "group relative flex flex-col justify-between cursor-pointer rounded-xl border border-white/[0.09] bg-white/[0.025] p-3.5 text-left transition-all hover:border-white/25 hover:bg-white/[0.05] hover:-translate-y-0.5 focus-within:outline-none focus-within:ring-1 focus-within:ring-amber-400/50 has-[:checked]:border-amber-400/60 has-[:checked]:bg-amber-400/[0.08] has-[:checked]:shadow-[0_0_24px_rgba(245,158,11,0.12),inset_0_1px_0_0_rgba(255,255,255,0.18)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
  serviceIcon:
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.04] text-zinc-300 transition-colors [&_svg]:h-4 [&_svg]:w-4 group-hover:text-amber-300 group-hover:border-amber-400/30 group-has-[:checked]:border-amber-400/50 group-has-[:checked]:bg-amber-400/15 group-has-[:checked]:text-amber-300",
  serviceContent: "min-w-0 flex-1 mt-2.5",
  serviceTitle: "block text-xs sm:text-sm font-semibold tracking-tight text-white group-has-[:checked]:text-amber-300 transition-colors",
  serviceDescription: "mt-1 block text-xs leading-relaxed text-zinc-400 group-hover:text-zinc-300 line-clamp-2 transition-colors",
  serviceIndicator:
    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-zinc-600 transition-all group-hover:border-zinc-400 group-has-[:checked]:border-amber-400 group-has-[:checked]:bg-amber-400",
  serviceIndicatorDot:
    "h-1.5 w-1.5 rounded-full bg-zinc-950 opacity-0 transition-opacity group-has-[:checked]:opacity-100",

  tileGrid: "grid grid-cols-1 gap-2 sm:grid-cols-2",
  tileGrid3: "grid grid-cols-3 gap-2",
  choiceTile:
    "group relative flex cursor-pointer flex-col justify-between rounded-xl border border-white/[0.09] bg-white/[0.025] p-3 transition-all hover:border-white/20 hover:bg-white/[0.05] has-[:checked]:border-amber-400/50 has-[:checked]:bg-amber-400/[0.08] has-[[data-state=checked]]:border-amber-400/50 has-[[data-state=checked]]:bg-amber-400/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
  choiceTileTitle: "text-xs sm:text-sm font-semibold text-white",
  choiceTileDesc: "mt-0.5 text-xs text-zinc-400",
  choiceTileMeta: "mt-1 text-[11px] font-mono text-zinc-500",

  phoneWrap:
    "flex h-9.5 sm:h-10 overflow-hidden rounded-lg border border-white/[0.10] bg-white/[0.03] shadow-sm transition-all hover:border-white/20 has-[:focus]:border-amber-400/60 has-[:focus]:ring-1 has-[:focus]:ring-amber-400/40 has-[:focus]:bg-white/[0.05]",
  phoneSelect:
    "h-9.5 sm:h-10 min-w-[85px] w-[95px] sm:w-[100px] shrink-0 rounded-none border-0 border-r border-white/[0.10] bg-transparent px-2 text-xs sm:text-sm text-white shadow-none [&>svg]:text-zinc-400 focus:ring-0",
  phoneInput:
    "min-w-0 flex-1 border-0 bg-transparent px-3 text-xs sm:text-sm text-white placeholder:text-zinc-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0",

  btnPrimary:
    "inline-flex h-9.5 sm:h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 px-5 text-xs sm:text-sm font-semibold tracking-wide text-zinc-950 shadow-[0_1px_2px_rgba(0,0,0,0.5),0_0_20px_rgba(245,158,11,0.25)] transition-all hover:from-amber-300 hover:to-yellow-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/50 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none sm:w-auto sm:min-w-[140px]",
  btnSecondary:
    "inline-flex h-9.5 sm:h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-white/[0.10] bg-white/[0.03] px-4 text-xs sm:text-sm font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 sm:w-auto",

  error: "flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-red-300 shadow-sm",
  warning: "flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-amber-200 shadow-sm",
  link: "text-amber-400 underline-offset-2 hover:underline transition-colors",
  footnote: "text-[11px] text-zinc-500 leading-normal",

  aside: "hidden xl:block",
  asideCard:
    "sticky top-6 space-y-3 rounded-2xl border border-white/[0.10] bg-white/[0.025] p-4 shadow-xl backdrop-blur-xl ring-1 ring-black/40",
  asideTitle: "text-xs font-semibold text-white tracking-wide uppercase",
  asideText: "text-xs text-zinc-400 leading-relaxed",
  asideList: "space-y-1.5",
  asideListItem: "text-xs text-zinc-400 leading-relaxed flex items-start gap-1.5 before:content-['•'] before:text-amber-400",
} as const;
