import { createClient } from "@/utils/supabase/server";
import { getUserLoans } from "./actions";
import { LoanHero } from "./_components/loan-hero";
import { ActiveLoans } from "./_components/active-loans";
import { MarketRates } from "./_components/market-rates";
import { LoanApplication } from "./_components/loan-application";
import { Button } from "@/components/ui/button";

export default async function CryptoLoanPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const supabase = await createClient();
  const loans = (await getUserLoans()) || [];
  const params = await searchParams;
  const isApplyMode = params.mode === "apply";

  // Fetch loan types for both MarketRates and Application
  const { data } = await supabase
       .from("loan_types")
       .select("*")
       .order("id", { ascending: true });
  const loanTypes = data || [];

  // Calculate stats
  // @ts-ignore
  const totalBorrowed = loans.reduce((acc, loan) => acc + Number(loan.borrow_amount), 0);
  const activeLoansCount = loans.filter(l => l.status === 'Active').length;

  // If in Apply Mode, show Wizard (Full Screen or Overlay)
  if (isApplyMode) {
     return (
        <div className="min-h-screen bg-black/40 backdrop-blur-xl p-4 sm:p-8 animate-in fade-in duration-300">
           <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                 <Button variant="ghost" asChild className="text-zinc-400 hover:text-white">
                    <a href="/crypto-loan">&larr; Back to Dashboard</a>
                 </Button>
              </div>
              {/* @ts-ignore */}
              <LoanApplication loanTypes={loanTypes} />
           </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen pb-20">
       <LoanHero totalBorrowed={totalBorrowed} activeLoansCount={activeLoansCount} />
       
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Main Content: Active Loans */}
             <div className="lg:col-span-2 space-y-6">
                <ActiveLoans loans={loans} />
             </div>

             {/* Sidebar: Market Rates & Info */}
             <div className="space-y-6">
                <MarketRates loanTypes={loanTypes} />
                
                {/* Helper Card */}
                <div className="bg-gradient-to-br from-yellow-400/10 to-transparent border border-yellow-400/20 rounded-2xl p-6">
                   <h3 className="text-white font-bold mb-2">Need more collateral?</h3>
                   <p className="text-sm text-zinc-400 mb-4">
                      Deposit more assets to your vault to increase your borrowing limit and improve health factor.
                   </p>
                   <Button variant="outline" className="w-full border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300">
                      Go to Vault
                   </Button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
