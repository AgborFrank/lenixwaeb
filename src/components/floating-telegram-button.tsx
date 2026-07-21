"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowDown } from "lucide-react"

// Signed-in account pages (wallet, banking, settings, etc.) have their own in-app
// support channels, so the marketing-site Telegram widget shouldn't follow users in there.
const ACCOUNT_ROUTE_PREFIXES = [
  "/dashboard",
  "/lenix-wallet",
  "/banking",
  "/assets",
  "/send",
  "/receive",
  "/transactions",
  "/settings",
  "/vault",
  "/crypto-loan",
  "/recovery-services",
]

export default function FloatingTelegramButton() {
  const pathname = usePathname()
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, "") || "/"

  if (ACCOUNT_ROUTE_PREFIXES.some((prefix) => pathWithoutLocale.startsWith(prefix))) {
    return null
  }

  return (
    <Link
      href="https://t.me/Verified_protocol"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-2 sm:right-0 top-1/2 -translate-y-1/2 z-50 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-3 py-6 rounded-tl-2xl rounded-bl-2xl  flex flex-col items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      aria-label="Connect on Telegram"
    >
      <span className="hidden sm:inline [writing-mode:vertical-rl] [text-orientation:mixed]">Connect on Telegram</span>
      <span className="sm:hidden [writing-mode:vertical-rl] [text-orientation:mixed]">Telegram</span>
      <ArrowDown className="h-4 w-4" />
    </Link>
  )
}
