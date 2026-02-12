"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet, Percent, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function LoanHero({ totalBorrowed, activeLoansCount }: { totalBorrowed: number, activeLoansCount: number }) {
  return (
    <div className="relative max-w-6xl my-3 mx-auto overflow-hidden rounded-none sm:rounded-3xl bg-zinc-900 border-b sm:border border-white/5 mb-6">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-16 md:flex md:items-center md:justify-between">
        <div className="max-w-2xl">
           <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Unlock Liquidity, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                 Keep Your Assets
              </span>
           </h1>
           <p className="text-zinc-400 text-lg mb-8 max-w-lg">
              Get an instant crypto-backed loan without selling your portfolio. Low rates, flexible terms, and immediate funding.
           </p>
           
           <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold h-12 px-8 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-all">
                 <Link href="/crypto-loan?mode=apply">
                    Get Instant Loan <ArrowRight className="ml-2 w-4 h-4" />
                 </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 h-12 px-8 rounded-full bg-black/20 backdrop-blur-sm">
                 <Link href="#learn-more">How it Works</Link>
              </Button>
           </div>
        </div>

        {/* Stats / Graphic for Desktop */}
        <div className="hidden md:block relative">
           <div className="grid grid-cols-2 gap-4">
              <StatCard label="Active Loans" value={activeLoansCount.toString()} icon={<Wallet className="w-5 h-5 text-blue-400" />} />
              <StatCard label="Total Borrowed" value={`$${totalBorrowed.toLocaleString()}`} icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />} />
              <StatCard label="Lowest Rate" value="0.5%" icon={<Percent className="w-5 h-5 text-yellow-400" />} />
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
   return (
      <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-xl flex flex-col gap-2 min-w-[140px]">
         <div className="p-2 rounded-lg bg-white/5 w-fit">{icon}</div>
         <div>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
         </div>
      </div>
   )
}
