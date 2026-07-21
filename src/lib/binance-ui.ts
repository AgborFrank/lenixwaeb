/** Binance dark theme tokens (wallet / withdraw). */
export const binance = {
  textPrimary: "text-[#EAECEF]",
  textSecondary: "text-[#848E9C]",
  textTertiary: "text-[#5E6673]",
  textError: "text-[#F6465D]",
  fieldBg: "bg-[#2B3139]",
  fieldBorder: "border border-[#474D57]",
  fieldRadius: "rounded-[4px]",
  input:
    "h-10 w-full bg-[#2B3139] px-3 text-sm text-[#EAECEF] placeholder:text-[#5E6673] outline-none focus:border-[#FCD535]",
  selectTrigger:
    "h-10 w-full bg-[#2B3139] border-[#474D57] text-sm text-[#EAECEF] rounded-[4px] focus:ring-0 focus:ring-offset-0 focus:border-[#FCD535] [&>svg]:text-[#848E9C]",
  selectContent: "bg-[#1E2026] border-[#474D57] text-[#EAECEF] rounded-[4px]",
  selectItem: "text-sm focus:bg-[#2B3139] focus:text-[#EAECEF] cursor-pointer",
  rowButton:
    "flex h-10 w-full items-center justify-between bg-[#2B3139] px-3 text-left text-sm text-[#EAECEF] rounded-[4px] hover:bg-[#474D57]/40",
  link: "text-sm text-[#FCD535] hover:text-[#F0B90B]",
  btnPrimary:
    "h-10 w-full rounded-[4px] bg-[#FCD535] text-sm font-medium text-[#181A20] hover:bg-[#F0B90B] disabled:cursor-not-allowed disabled:bg-[#2B3139] disabled:text-[#5E6673]",
  divider: "border-t border-[#2B3139]",
  label: "text-sm text-[#848E9C]",
  pageTitle: "text-2xl font-semibold text-[#EAECEF]",
} as const;
