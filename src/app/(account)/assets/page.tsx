"use client";

import { Wallet, PieChart } from "lucide-react";
import { Overview } from "./_components/overview";
import { AllocationChart } from "./_components/allocation-chart";
import { AssetTable } from "./_components/asset-table";

export default function AssetsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div>
         <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Wallet className="h-6 w-6 text-yellow-400" />
            My Assets
         </h1>
         <p className="text-zinc-400 text-sm mt-1">
            Manage your crypto balances across all supported networks.
         </p>
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2">
            <Overview />
         </div>
         <div>
            <AllocationChart />
         </div>
      </div>

      {/* Asset List Section */}
      <div className="space-y-4">
         <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold text-white">Your Holdings</h2>
            {/* Filter/Search could go here */}
         </div>
         <AssetTable />
      </div>
    </div>
  );
}
