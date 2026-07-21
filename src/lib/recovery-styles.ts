/** Glassmorphism tokens for crypto-recovery and related forensic pages. */
export const glass = {
  section: "py-20 lg:py-24 px-4 sm:px-6 lg:px-8",
  container: "max-w-screen-xl mx-auto",
  eyebrow: "text-sm font-medium text-neutral-400",
  title: "text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight",
  titleCenter: "text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight text-center",
  lead: "text-base text-neutral-400 leading-relaxed",
  leadCenter: "text-base text-neutral-400 leading-relaxed text-center max-w-2xl mx-auto",
  panel: "bg-white/5 backdrop-blur-xl border border-white/10",
  panelStrong: "bg-black/35 backdrop-blur-xl border border-white/10",
  card: "rounded-xl bg-white/5 backdrop-blur-lg border border-white/10",
  cardHover: "rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-colors",
  cardBody: "p-6 lg:p-7",
  media: "relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-lg border border-white/10",
  btnPrimary:
    "inline-flex items-center justify-center h-11 px-6 rounded-md bg-yellow-400 text-neutral-950 text-sm font-semibold hover:bg-yellow-300 transition-colors",
  btnGlass:
    "inline-flex items-center justify-center h-11 px-6 rounded-md bg-white/5 border border-white/15 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/10 transition-colors",
  textLink: "text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors",
  label: "block text-sm font-medium text-neutral-300 mb-1.5",
  field:
    "h-11 w-full rounded-md border border-white/10 bg-black/30 px-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/25 focus:border-white/20 transition-colors",
  textarea:
    "w-full min-h-[120px] rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/25 focus:border-white/20 transition-colors resize-y",
} as const;
