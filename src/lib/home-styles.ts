/** Shared layout and typography for enterprise-grade homepage sections. */
export const home = {
  section: "py-20 lg:py-24 px-4 sm:px-6 lg:px-8",
  sectionMuted: "bg-neutral-950",
  container: "container mx-auto",
  eyebrow: "text-sm font-medium text-neutral-400",
  title: "text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight",
  titleCenter: "text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight text-center",
  lead: "text-base text-neutral-400 leading-relaxed",
  leadCenter: "text-base text-neutral-400 leading-relaxed text-center max-w-2xl mx-auto",
  card: "rounded-lg border border-neutral-800 bg-neutral-900/40 overflow-hidden",
  cardInteractive:
    "rounded-lg border border-neutral-800 bg-neutral-900/40 overflow-hidden transition-colors hover:border-neutral-700 hover:bg-neutral-900/60",
  cardBody: "p-6 lg:p-7",
  media: "relative aspect-[16/10] bg-neutral-900 overflow-hidden",
  mediaImage: "object-container",
  btnPrimary:
    "inline-flex items-center justify-center h-11 px-6 rounded-md bg-yellow-400 text-neutral-950 text-sm font-semibold hover:bg-yellow-300 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400",
  btnSecondary:
    "inline-flex items-center justify-center h-11 px-6 rounded-md border border-neutral-600 bg-transparent text-sm font-medium text-white hover:bg-neutral-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500",
  textLink: "text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors",
} as const;
