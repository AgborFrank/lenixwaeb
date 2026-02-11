"use client";

import Link from "next/link";
import { ChevronDown, Menu, X, Wallet, Landmark, ShieldCheck, User as UserIcon, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function Header() {
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
            <Image src="/assets/img/logo.png" alt="logo" width={150} height={40} className="h-[30px] w-[145px]" />
          </div>
          </Link>
          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8 z-20 text-[14px]">
            <Link
              href="/giveaway"
              className="flex items-center space-x-1 text-white hover:text-gray-300 cursor-pointer"
            >
              <span>250K Giveaway</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center space-x-1 text-white hover:text-gray-300 cursor-pointer"
            >
              <span>About</span>
            </Link>
            <DropdownMenu open={isSolutionsOpen} onOpenChange={setIsSolutionsOpen}>
              <div className="h-full flex items-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <DropdownMenuTrigger 
                  className="flex items-center space-x-1 text-white hover:text-gray-300 cursor-pointer outline-none group data-[state=open]:text-yellow-400 py-4"
                >
                  <span>Solutions</span>
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
                  <Link href="/wallet" className="flex items-start gap-4 p-3 w-full">
                    <div className="p-2 bg-yellow-400/10 rounded-lg shrink-0">
                      <Wallet className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-white leading-none">Lenix Wallet</span>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-snug">
                        Secure multi-chain wallet for your digital assets.
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="focus:bg-white/5 cursor-pointer rounded-lg p-0 mt-1">
                  <Link href="/finance" className="flex items-start gap-4 p-3 w-full">
                    <div className="p-2 bg-yellow-400/10 rounded-lg shrink-0">
                      <Landmark className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-white leading-none">Lenix Finance</span>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-snug">
                        Decentralized finance solutions for everyone.
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="focus:bg-white/5 cursor-pointer rounded-lg p-0 mt-1">
                  <Link href="/crypto-recovery" className="flex items-start gap-4 p-3 w-full">
                    <div className="p-2 bg-yellow-400/10 rounded-lg shrink-0">
                      <ShieldCheck className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-white leading-none">Crypto Recovery</span>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-snug">
                        Recover lost assets with expert assistance.
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          
            <div className="flex items-center space-x-1 text-white hover:text-gray-300 cursor-pointer">
              <span>Learn</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            <Link
              href="/crypto-recovery"
              className="flex items-center space-x-1 text-white hover:text-gray-300 cursor-pointer"
            >
              <span>Crypto Recovery</span>
            </Link>
            <Link href="/contact" className="text-white hover:text-gray-300">
              Contact
            </Link>
            <Link href="/airdrop" className="text-white hover:text-gray-300">
              Airdrop
            </Link>
          </nav>


          {/* Desktop Connect Wallet & Auth */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0 z-20">
            {user ? (
              <div className="flex items-center gap-4">
                 <span className="text-sm text-gray-300 truncate max-w-[100px]">{user.email}</span>
                 <button 
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Sign Out"
                 >
                   <LogOut className="w-5 h-5" />
                 </button>
              </div>
            ) : (
              <Link 
                href="/login"
                className="text-sm font-medium text-white hover:text-yellow-400 transition-colors"
              >
                Log In
              </Link>
            )}

            {isConnected ? (
               <appkit-button />
            ) : (
              <button 
                onClick={() => open()}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2.5 px-6 rounded-full transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:shadow-[0_0_25px_rgba(250,204,21,0.5)] text-sm"
              >
                Connect Wallet - Claim 50USDT
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
                Claim 50USDT Gift
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
                <span>250K Giveaway</span>
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-white hover:text-gray-300 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>About</span>
              </Link>
              <div className="space-y-1">
                <div className="px-3 py-2 text-white font-medium text-sm text-yellow-400">Solutions</div>
                <Link
                  href="/wallet"
                  className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg mx-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Wallet className="h-4 w-4 text-yellow-400" />
                  <span>Lenix Wallet</span>
                </Link>
                <Link
                  href="/finance"
                  className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg mx-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Landmark className="h-4 w-4 text-yellow-400" />
                  <span>Lenix Finance</span>
                </Link>
                <Link
                  href="/crypto-recovery"
                  className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg mx-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShieldCheck className="h-4 w-4 text-yellow-400" />
                  <span>Crypto Recovery</span>
                </Link>
              </div>
              <a
                href="#"
                className="block px-3 py-2 text-white hover:text-gray-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </a>
              <div className="block px-3 py-2 text-white hover:text-gray-300 cursor-pointer">
                <span>Learn</span>
              </div>
              <Link
                href="/crypto-recovery"
                className="block px-3 py-2 text-white hover:text-gray-300 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Crypto Recovery</span>
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
                      <div className="px-3 py-2 text-sm text-gray-400">{user.email}</div>
                      <button 
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-white/5 rounded-lg w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                 ) : (
                    <Link
                      href="/login"
                      className="flex items-center gap-3 px-3 py-2 text-yellow-400 hover:bg-white/5 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserIcon className="h-4 w-4" />
                      <span>Log In / Sign Up</span>
                    </Link>
                 )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
