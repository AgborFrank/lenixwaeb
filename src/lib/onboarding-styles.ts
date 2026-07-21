/** Onboarding layout and form tokens. */
export const onboarding = {
  page: "relative min-h-screen overflow-hidden text-white antialiased",
  bgImage: "pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat",
  bgOverlay: "pointer-events-none absolute inset-0 z-[1] bg-black/50",
  header:
    "relative z-20 border-b border-white/10 bg-black/30 backdrop-blur-md",
  headerInner:
    "mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8",
  logo: "h-7 w-auto sm:h-8",
  skipLink:
    "text-sm text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/50 rounded-sm px-2 py-1",
  main: "relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 pb-24 lg:pb-10",
  workspace: "mt-6 lg:mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-8",
  workspaceCentered: "mx-auto w-full max-w-xl space-y-6 sm:max-w-2xl",
  workspaceDetails: "mx-auto mt-6 w-full max-w-2xl space-y-6 sm:max-w-xl lg:max-w-2xl",
  backLink:
    "mb-6 inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/50 rounded-sm",

  card: "overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl",
  cardHeader: "border-b border-white/10 px-6 py-6 sm:px-8 sm:py-7",
  cardBody: "px-6 py-7 sm:px-8 sm:py-9",
  cardFooter:
    "flex flex-col-reverse gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-6 sm:py-4",
  cardFooterSticky:
    "fixed inset-x-0 bottom-0 z-30 flex flex-col-reverse gap-3 border-t border-white/20 bg-black/60 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl sm:static sm:border-t sm:border-white/10 sm:bg-transparent sm:px-6 sm:py-4 sm:backdrop-blur-none",

  fieldStack: "space-y-5",

  title: "text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-3xl",
  subtitle: "mt-2 text-[15px] leading-relaxed text-zinc-400",
  sectionTitle: "text-sm font-medium text-white",
  sectionDesc: "mt-0.5 text-sm text-zinc-500",
  label: "text-xs pb-2 sm:text-[13px] font-medium text-zinc-200 tracking-wide",
  hint: "mt-1.5 text-xs sm:text-[13px] text-zinc-500",
  required: "text-red-400 ml-0.5",
  gridGap: "gap-5 sm:gap-6",
  field: "space-y-2",
  input:
    "h-11 sm:h-12 rounded-xl border border-white/10 bg-white/5 px-3 sm:px-3.5 text-sm sm:text-[15px] text-white shadow-sm placeholder:text-zinc-500 transition-all focus-visible:border-yellow-400/50 focus-visible:ring-1 focus-visible:ring-yellow-400/50 disabled:opacity-50 disabled:cursor-not-allowed",
  textarea:
    "min-h-[120px] resize-y rounded-xl border border-white/10 bg-white/5 px-3 sm:px-3.5 py-3 text-sm sm:text-[15px] leading-relaxed text-white shadow-sm placeholder:text-zinc-500 transition-all focus-visible:border-yellow-400/50 focus-visible:ring-1 focus-visible:ring-yellow-400/50 disabled:opacity-50 disabled:cursor-not-allowed",
  selectTrigger:
    "h-11 sm:h-12 rounded-xl border border-white/10 bg-white/5 px-3 sm:px-3.5 text-sm sm:text-[15px] text-white shadow-sm transition-all focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50 disabled:opacity-50 disabled:cursor-not-allowed [&>svg]:text-zinc-400",
  selectContent: "rounded-xl border border-white/10 bg-[#141414]/95 text-white shadow-xl backdrop-blur-xl",
  selectItem: "rounded-md text-sm sm:text-[15px] px-3 py-2.5 focus:bg-white/[0.08] focus:text-white cursor-pointer",

  section: "space-y-4",
  sectionHeader: "space-y-0.5",

  choiceList: "mt-3 space-y-2",
  choiceRow:
    "group relative flex w-full cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-colors hover:border-white/20 hover:bg-white/[0.08] has-[:checked]:border-yellow-400/40 has-[:checked]:bg-yellow-400/[0.08] has-[[data-state=checked]]:border-yellow-400/40 has-[[data-state=checked]]:bg-yellow-400/[0.08]",
  choiceIcon:
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#222] text-zinc-300 [&_svg]:h-4 [&_svg]:w-4 group-has-[:checked]:text-yellow-400",
  choiceContent: "min-w-0 flex-1",
  choiceTitle: "text-sm font-medium text-white",
  choiceDesc: "mt-0.5 text-sm text-zinc-500",
  choiceIndicator:
    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-zinc-600 group-has-[:checked]:border-yellow-400 group-has-[:checked]:bg-yellow-400 group-has-[[data-state=checked]]:border-yellow-400 group-has-[[data-state=checked]]:bg-yellow-400",
  choiceIndicatorDot:
    "h-1.5 w-1.5 rounded-full bg-black opacity-0 group-has-[:checked]:opacity-100 group-has-[[data-state=checked]]:opacity-100",

  serviceLegend: "text-sm sm:text-[15px] font-medium text-zinc-200",
  serviceList: "mt-3 space-y-1",
  serviceOption:
    "group relative flex w-full cursor-pointer items-start gap-3 rounded-xl border border-transparent px-3 py-4 text-left transition-colors hover:border-white/10 hover:bg-white/[0.06] focus-within:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-400/50 has-[:checked]:border-yellow-400/30 has-[:checked]:bg-yellow-400/[0.08]",
  serviceIcon:
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition-colors [&_svg]:h-5 [&_svg]:w-5 group-hover:text-white group-has-[:checked]:border-yellow-400/35 group-has-[:checked]:bg-yellow-400/[0.12] group-has-[:checked]:text-yellow-300",
  serviceContent: "min-w-0 flex-1 pr-3",
  serviceTitle: "block text-sm sm:text-[15px] font-semibold tracking-[-0.01em] text-white",
  serviceDescription: "mt-1 block text-sm sm:text-[15px] leading-relaxed text-zinc-400",
  serviceIndicator:
    "mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-zinc-600 transition-colors group-hover:border-zinc-400 group-has-[:checked]:border-yellow-400 group-has-[:checked]:bg-yellow-400",
  serviceIndicatorDot:
    "h-2 w-2 rounded-full bg-black opacity-0 transition-opacity group-has-[:checked]:opacity-100",

  tileGrid: "grid grid-cols-1 gap-2 sm:grid-cols-2",
  tileGrid3: "grid grid-cols-3 gap-2",
  choiceTile:
    "group relative flex cursor-pointer flex-col rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:border-white/20 hover:bg-white/[0.08] has-[:checked]:border-yellow-400/40 has-[:checked]:bg-yellow-400/[0.08] has-[[data-state=checked]]:border-yellow-400/40 has-[[data-state=checked]]:bg-yellow-400/[0.08]",
  choiceTileTitle: "text-sm font-medium text-white",
  choiceTileDesc: "mt-0.5 text-xs text-zinc-500",
  choiceTileMeta: "mt-1 text-xs text-zinc-600",

  phoneWrap:
    "flex h-11 sm:h-12 overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-sm transition-all has-[:focus]:border-yellow-400/50 has-[:focus]:ring-1 has-[:focus]:ring-yellow-400/50",
  phoneSelect:
    "h-11 sm:h-12 min-w-[90px] w-[100px] sm:w-[110px] shrink-0 rounded-none border-0 border-r border-white/[0.12] bg-transparent px-2 sm:px-3 text-sm sm:text-[15px] text-white shadow-none [&>svg]:text-zinc-400",
  phoneInput:
    "min-w-0 flex-1 border-0 bg-transparent px-3 sm:px-3.5 text-sm sm:text-[15px] text-white placeholder:text-zinc-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed",

  btnPrimary:
    "inline-flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-lg bg-yellow-400 px-6 sm:px-8 text-sm sm:text-[15px] font-semibold tracking-wide text-black shadow-lg shadow-yellow-400/20 transition-all hover:bg-yellow-300 hover:shadow-xl hover:shadow-yellow-400/30 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none sm:w-auto sm:min-w-[160px]",
  btnSecondary:
    "inline-flex h-10 w-full items-center justify-center rounded-md border border-white/[0.12] bg-transparent px-5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 sm:w-auto",

  error: "rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-4 text-[15px] font-medium text-red-300 shadow-sm",
  warning: "rounded-lg border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-[15px] font-medium text-amber-200 shadow-sm",
  link: "text-yellow-400 underline-offset-2 hover:underline transition-colors",
  footnote: "text-xs sm:text-[13px] text-zinc-500 leading-relaxed",

  aside: "hidden xl:block",
  asideCard:
    "sticky top-8 space-y-4 rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-xl",
  asideTitle: "text-sm font-medium text-white",
  asideText: "text-sm text-zinc-500",
  asideList: "space-y-2",
  asideListItem: "text-sm text-zinc-500",
} as const;
