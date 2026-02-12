"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, MoreVertical, ShieldAlert, RefreshCw } from "lucide-react";
import { repayLoan, type Loan } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ActiveLoansProps {
  loans: Loan[];
}

export function ActiveLoans({ loans }: ActiveLoansProps) {
  const router = useRouter();
  const [repayingId, setRepayingId] = useState<string | null>(null);

  const handleRepay = async (id: string) => {
      setRepayingId(id);
      const result = await repayLoan(id);
      setRepayingId(null);
      
      if (result?.error) {
         toast.error(result.error);
      } else {
         toast.success("Loan repaid successfully");
         router.refresh();
      }
  };

  if (loans.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10 rounded-2xl bg-white/5 mx-6">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
               <ShieldAlert className="w-6 h-6 text-zinc-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No Active Loans</h3>
            <p className="text-zinc-500 text-sm max-w-xs">
               Your active loans will appear here. Get instant liquidity by applying for a new loan.
            </p>
         </div>
      );
  }

  return (
    <div className="space-y-4 px-6">
       <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Your Portfolios</h2>
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{loans.length} Active</span>
       </div>

      <div className="grid grid-cols-1 gap-4">
        {loans.map((loan) => {
           const healthPercentage = (loan.health_factor / 3) * 100; // Assume 3.0 is max safe
           const isRisky = loan.health_factor < 1.5;

           return (
            <div key={loan.id} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/50 p-5 hover:border-white/10 transition-all">
               <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white bg-zinc-800/50">
                           <MoreVertical className="w-4 h-4" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                        <DropdownMenuItem onClick={() => handleRepay(loan.id)} className="text-emerald-400 focus:text-emerald-400 focus:bg-emerald-400/10 cursor-pointer">
                           {repayingId === loan.id ? "Processing..." : "Repay Loan"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white focus:bg-white/10 cursor-pointer">
                           View Details
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>

               <div className="flex flex-col sm:flex-row sm:items-center gap-6 relative">
                  {/* Asset Info */}
                  <div className="flex items-center gap-4 min-w-[200px]">
                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center border border-white/5">
                        <span className="text-lg font-bold text-yellow-500">{loan.borrow_asset[0]}</span>
                     </div>
                     <div>
                        <p className="text-sm text-zinc-400">Borrowed Amount</p>
                        <p className="text-2xl font-bold text-white">
                           {loan.borrow_amount.toLocaleString()} <span className="text-sm text-zinc-500 font-normal">{loan.borrow_asset}</span>
                        </p>
                     </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6">
                     <div>
                        <p className="text-xs text-zinc-500 mb-1">Collateral</p>
                        <p className="text-sm font-medium text-white">{loan.collateral_amount} {loan.collateral_asset}</p>
                     </div>
                     <div>
                        <p className="text-xs text-zinc-500 mb-1">APY</p>
                        <p className="text-sm font-medium text-emerald-400">{loan.apy}%</p>
                     </div>
                     <div className="col-span-2 lg:col-span-2">
                        <div className="flex justify-between items-end mb-1">
                           <p className="text-xs text-zinc-500">Health Factor</p>
                           <span className={cn("text-xs font-bold", isRisky ? "text-red-400" : "text-emerald-400")}>
                              {loan.health_factor}
                           </span>
                        </div>
                        <Progress value={Math.min(healthPercentage, 100)} className="h-1.5 bg-zinc-800" indicatorColor={isRisky ? "bg-red-500" : "bg-emerald-500"} />
                     </div>
                  </div>
                  
                  {/* Status Badge */}
                   <div className="flex items-center gap-2 self-start sm:self-center">
                     <Badge variant="outline" className={cn(
                        "capitalize border-0 px-3 py-1",
                        loan.status === 'Active' ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-500/10 text-zinc-400"
                     )}>
                        {loan.status === 'Active' ? <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" /> : null}
                        {loan.status}
                     </Badge>
                   </div>
               </div>
            </div>
           );
        })}
      </div>
    </div>
  );
}
