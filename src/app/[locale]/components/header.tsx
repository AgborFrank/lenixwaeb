"use client";

import Link from "next/link";
import {
  ChevronDown,
  Menu,
  X,
  Wallet,
  Landmark,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Lock,
  Send,
  ArrowDownToLine,
  History,
  Settings,
  FileSearch,
  Scale,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { LanguagePicker } from "./language-picker";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations("Header");
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsSolutionsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsSolutionsOpen(false);
    }, 300);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full bg-black/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="shrink-0 z-20">
              <Image
                src="/assets/img/logo.png"
                alt="logo"
                width={150}
                height={40}
                className="h-[30px] w-[145px]"
              />
            </div>
          </Link>
          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8 z-20 text-[14px]">
            <Link
              href="/giveaway"
              className="flex items-center space-x-1 text-white hover:text-gray-300 cursor-pointer"
            >
              <span>{t("nav.giveaway")}</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center space-x-1 text-white hover:text-gray-300 cursor-pointer"
            >
              <span>{t("nav.about")}</span>
            </Link>
            <DropdownMenu
              open={isSolutionsOpen}
              onOpenChange={setIsSolutionsOpen}
            >
              <div
                className="h-full flex items-center"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <DropdownMenuTrigger className="flex items-center space-x-1 text-white hover:text-gray-300 cursor-pointer outline-none group data-[state=open]:text-yellow-400 py-4">
                  <span>{t("nav.solutions")}</span>
                  <ChevronDown className="h-4 w-4 transition duration-200 group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
              </div>
              <DropdownMenuContent
                className="w-80 bg-black/80 backdrop-blur-2xl border border-white/10 p-2 rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] z-50"
                sideOffset={0}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <DropdownMenuItem className="focus:bg-white/5 cursor-pointer rounded-lg p-0">
                  <Link
                    href="/wallet"
                    className="flex items-start gap-4 p-3 w-full"
                  >
                    <div className="p-2 bg-yellow-400/10 rounded-lg shrink-0">
                      <Wallet className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-white leading-none">
                        {t("solutions.wallet.title")}
                      </span>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-snug">
                        {t("solutions.wallet.desc")}
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="focus:bg-white/5 cursor-pointer rounded-lg p-0 mt-1">
                  <Link
                    href="/finance"
                    className="flex items-start gap-4 p-3 w-full"
                  >
                    <div className="p-2 bg-yellow-400/10 rounded-lg shrink-0">
                      <Landmark className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-white leading-none">
                        {t("solutions.finance.title")}
                      </span>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-snug">
                        {t("solutions.finance.desc")}
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="focus:bg-white/5 cursor-pointer rounded-lg p-0 mt-1">
                  <Link
                    href="/crypto-recovery"
                    className="flex items-start gap-4 p-3 w-full"
                  >
                    <div className="p-2 bg-yellow-400/10 rounded-lg shrink-0">
                      <ShieldCheck className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-white leading-none">
                        {t("solutions.recovery.title")}
                      </span>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-snug">
                        {t("solutions.recovery.desc")}
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="focus:bg-white/5 cursor-pointer rounded-lg p-0 mt-1">
                  <Link
                    href="/compliance-investigations"
                    className="flex items-start gap-4 p-3 w-full"
                  >
                    <div className="p-2 bg-yellow-400/10 rounded-lg shrink-0">
                      <FileSearch className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-white leading-none">
                        {t("solutions.compliance.title")}
                      </span>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-snug">
                        {t("solutions.compliance.desc")}
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="focus:bg-white/5 cursor-pointer rounded-lg p-0 mt-1">
                  <Link
                    href="/law-enforcement"
                    className="flex items-start gap-4 p-3 w-full"
                  >
                    <div className="p-2 bg-yellow-400/10 rounded-lg shrink-0">
                      <Scale className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-white leading-none">
                        {t("solutions.enforcement.title")}
                      </span>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-snug">
                        {t("solutions.enforcement.desc")}
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/blockchain-forensics"
              className="flex items-center space-x-1 text-white hover:text-gray-300 cursor-pointer"
            >
              <span>{t("nav.blockchain_forensics")}</span>
            </Link>
            <Link
              href="/crypto-recovery"
              className="flex items-center space-x-1 text-white hover:text-gray-300 cursor-pointer"
            >
              <span>{t("nav.asset_recovery")}</span>
            </Link>
            <Link href="/contact" className="text-white hover:text-gray-300">
              {t("nav.contact")}
            </Link>
            <Link href="/airdrop" className="text-white hover:text-gray-300">
              {t("nav.airdrop")}
            </Link>
          </nav>

          {/* Desktop Connect Wallet & Auth */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0 z-20">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full border border-white/20 text-white hover:bg-white/10 h-9 w-9"
                  >
                    <Avatar className="h-8 w-8 rounded-full bg-yellow-400/20">
                      <AvatarFallback className="bg-yellow-400/20 text-yellow-400 text-sm rounded-full">
                        {user.email?.slice(0, 2).toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-black/95 border-white/10 text-white max-h-[min(70vh,400px)] overflow-y-auto"
                >
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium text-white truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-500">{t("user_menu.account")}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4 shrink-0" />
                      {t("user_menu.dashboard")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/vault" className="cursor-pointer flex items-center gap-2">
                      <Lock className="h-4 w-4 shrink-0" />
                      {t("user_menu.vault")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/lenix-wallet" className="cursor-pointer flex items-center gap-2">
                      <Wallet className="h-4 w-4 shrink-0" />
                      {t("user_menu.lenix_wallet")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/crypto-loan" className="cursor-pointer flex items-center gap-2">
                      <Landmark className="h-4 w-4 shrink-0" />
                      {t("user_menu.loan")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/assets" className="cursor-pointer flex items-center gap-2">
                      <Wallet className="h-4 w-4 shrink-0" />
                      {t("user_menu.assets")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/send" className="cursor-pointer flex items-center gap-2">
                      <Send className="h-4 w-4 shrink-0" />
                      {t("user_menu.send")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/receive" className="cursor-pointer flex items-center gap-2">
                      <ArrowDownToLine className="h-4 w-4 shrink-0" />
                      {t("user_menu.receive")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/transactions" className="cursor-pointer flex items-center gap-2">
                      <History className="h-4 w-4 shrink-0" />
                      {t("user_menu.transactions")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer flex items-center gap-2">
                      <Settings className="h-4 w-4 shrink-0" />
                      {t("user_menu.settings")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-400 focus:text-red-400 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("user_menu.sign_out")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-white hover:text-yellow-400 transition-colors"
              >
                {t("buttons.log_in")}
              </Link>
            )}

            <LanguagePicker />

            {isConnected ? (
              <appkit-button />
            ) : (
              <button
                onClick={() => open()}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2.5 px-6 rounded-full transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:shadow-[0_0_25px_rgba(250,204,21,0.5)] text-sm"
              >
                {t("buttons.get_reward")}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4 z-20">
            {isConnected ? (
              <appkit-button size="sm" />
            ) : (
              <button
                onClick={() => open()}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 px-4 rounded-full transition-all shadow-[0_0_10px_rgba(250,204,21,0.3)] text-xs whitespace-nowrap"
              >
                {t("buttons.get_reward")}
              </button>
            )}
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-gray-300 p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/90 backdrop-blur-xl border-t border-white/10">
              <Link
                href="/giveaway"
                className="block px-3 py-2 text-white hover:text-gray-300 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{t("nav.giveaway")}</span>
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-white hover:text-gray-300 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{t("nav.about")}</span>
              </Link>
              <div className="space-y-1">
                <div className="px-3 py-2 text-white font-medium text-sm text-yellow-400">
                  {t("nav.solutions")}
                </div>
                <Link
                  href="/wallet"
                  className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg mx-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Wallet className="h-4 w-4 text-yellow-400" />
                  <span>{t("solutions.wallet.title")}</span>
                </Link>
                <Link
                  href="/finance"
                  className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg mx-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Landmark className="h-4 w-4 text-yellow-400" />
                  <span>{t("solutions.finance.title")}</span>
                </Link>
                <Link
                  href="/crypto-recovery"
                  className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg mx-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShieldCheck className="h-4 w-4 text-yellow-400" />
                  <span>{t("nav.crypto_recovery")}</span>
                </Link>
                <Link
                  href="/compliance-investigations"
                  className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg mx-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FileSearch className="h-4 w-4 text-yellow-400" />
                  <span>{t("solutions.compliance.title")}</span>
                </Link>
                <Link
                  href="/law-enforcement"
                  className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg mx-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Scale className="h-4 w-4 text-yellow-400" />
                  <span>{t("solutions.enforcement.title")}</span>
                </Link>
              </div>
              <a
                href="#"
                className="block px-3 py-2 text-white hover:text-gray-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </a>
              <Link
                href="/blockchain-forensics"
                className="block px-3 py-2 text-white hover:text-gray-300 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{t("nav.blockchain_forensics")}</span>
              </Link>
              <Link
                href="/crypto-recovery"
                className="block px-3 py-2 text-white hover:text-gray-300 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{t("nav.crypto_recovery")}</span>
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-white hover:text-gray-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/airdrop"
                className="block px-3 py-2 text-white hover:text-gray-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Airdrop
              </Link>

              <div className="border-t border-white/10 mt-2 pt-2">
                 {user ? (
                    <>
                      <div className="flex items-center gap-3 px-3 py-2">
                        <Avatar className="h-10 w-10 rounded-full border border-white/20 bg-yellow-400/20 shrink-0">
                          <AvatarFallback className="bg-yellow-400/20 text-yellow-400 text-sm rounded-full">
                            {user.email?.slice(0, 2).toUpperCase() ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">
                            {user.email}
                          </p>
                          <p className="text-xs text-gray-500">{t("user_menu.account")}</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("user_menu.account")}
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg mx-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <LayoutDashboard className="h-4 w-4 text-yellow-400 shrink-0" />
                        {t("user_menu.dashboard")}
                      </Link>
                      <Link href="/vault" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg mx-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <Lock className="h-4 w-4 text-yellow-400 shrink-0" />
                        {t("user_menu.vault")}
                      </Link>
                      <Link href="/lenix-wallet" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg mx-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <Wallet className="h-4 w-4 text-yellow-400 shrink-0" />
                        {t("user_menu.lenix_wallet")}
                      </Link>
                      <Link href="/crypto-loan" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg mx-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <Landmark className="h-4 w-4 text-yellow-400 shrink-0" />
                        {t("user_menu.loan")}
                      </Link>
                      <Link href="/assets" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg mx-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <Wallet className="h-4 w-4 text-yellow-400 shrink-0" />
                        {t("user_menu.assets")}
                      </Link>
                      <Link href="/send" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg mx-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <Send className="h-4 w-4 text-yellow-400 shrink-0" />
                        {t("user_menu.send")}
                      </Link>
                      <Link href="/receive" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg mx-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <ArrowDownToLine className="h-4 w-4 text-yellow-400 shrink-0" />
                        {t("user_menu.receive")}
                      </Link>
                      <Link href="/transactions" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg mx-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <History className="h-4 w-4 text-yellow-400 shrink-0" />
                        {t("user_menu.transactions")}
                      </Link>
                      <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg mx-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <Settings className="h-4 w-4 text-yellow-400 shrink-0" />
                        {t("user_menu.settings")}
                      </Link>
                      <button 
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-white/5 rounded-lg w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t("user_menu.sign_out")}</span>
                      </button>
                    </>
                 ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-3 px-3 py-2 text-yellow-400 hover:bg-white/5 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>{t("buttons.log_in_sign_up")}</span>
                  </Link>
                )}
              </div>
              
              <div className="border-t border-white/10 mt-2 p-4 flex justify-center">
                <LanguagePicker showFullName />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
