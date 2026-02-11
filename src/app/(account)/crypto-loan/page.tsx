"use client";

import { Landmark, HelpingHand, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoanOverview } from "./_components/loan-overview";
import { BorrowForm } from "./_components/borrow-form";
import { ActiveLoans } from "./_components/active-loans";
import { CollateralAssets } from "./_components/collateral-assets";

export default function CryptoLoanPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Landmark className="h-6 w-6 text-yellow-400" />
              Crypto Loan
           </h1>
           <p className="text-zinc-400 text-sm">Borrow transparently against your crypto assets.</p>
        </div>
        <Button variant="outline" className="border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white">
           <HelpingHand className="mr-2 h-4 w-4" />
           How it Works
        </Button>
      </div>

      {/* Main Loan Stats */}
      <LoanOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Content (Calculator & Loans) */}
         <div className="lg:col-span-2 space-y-6">
            <div className="block lg:hidden">
               <BorrowForm />
            </div>
            <ActiveLoans />

            {/* Information Section */}
            <div className="p-6 rounded-2xl bg-yellow-500/5 border border-yellow-500/10">
               <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 mt-1">
                     <Info className="h-5 w-5" />
                  </div>
                  <div>
                     <h4 className="font-semibold text-white mb-1">About Lenix Loans</h4>
                     <p className="text-sm text-zinc-400 leading-relaxed">
                        Lenix offers over-collateralized loans. This means you must deposit more crypto than you borrow. 
                        If the value of your collateral drops significantly, your assets may be liquidated to cover the loan. 
                        Current Liquidation Threshold is 85% LTV.
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar (Calculator & Assets) */}
         <div className="space-y-6">
            <div className="hidden lg:block h-fit">
               <BorrowForm />
            </div>
            <CollateralAssets />
         </div>
      </div>
    </div>
  );
}
