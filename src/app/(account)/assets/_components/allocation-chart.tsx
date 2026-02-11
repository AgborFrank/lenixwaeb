"use client";

import { PieChart } from "lucide-react";

export function AllocationChart() {
  // Mock data for the chart
  const data = [
    { name: "BTC", value: 45, color: "text-orange-500", bg: "bg-orange-500" },
    { name: "ETH", value: 30, color: "text-blue-500", bg: "bg-blue-500" },
    { name: "USDT", value: 15, color: "text-emerald-500", bg: "bg-emerald-500" },
    { name: "SOL", value: 10, color: "text-purple-500", bg: "bg-purple-500" },
  ];

  return (
    <div className="rounded-3xl bg-zinc-900/50 p-6 border border-white/5 h-full">
      <div className="flex items-center gap-2 mb-6">
        <PieChart className="h-5 w-5 text-zinc-400" />
        <h3 className="text-lg font-semibold text-white">Asset Allocation</h3>
      </div>

      <div className="flex items-center gap-8">
        {/* Simple CSS/SVG Donut Chart */}
        <div className="relative h-48 w-48 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
            {/* Background Circle */}
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#27272a" strokeWidth="12" />
            
            {/* Segments - Simplified for demo (approximate strokes) */}
            {/* BTC - 45% */}
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="12" 
               className="text-orange-500" 
               strokeDasharray={`${45 * 2.51} 251`} 
            />
            
            {/* ETH - 30% (starts at 45%) */}
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="12" 
               className="text-blue-500" 
               strokeDasharray={`${30 * 2.51} 251`} 
               strokeDashoffset={`${-(45 * 2.51)}`}
            />

            {/* USDT - 15% (starts at 75%) */}
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="12" 
               className="text-emerald-500" 
               strokeDasharray={`${15 * 2.51} 251`} 
               strokeDashoffset={`${-(75 * 2.51)}`}
            />

            {/* SOL - 10% (starts at 90%) */}
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="12" 
               className="text-purple-500" 
               strokeDasharray={`${10 * 2.51} 251`} 
               strokeDashoffset={`${-(90 * 2.51)}`}
            />
          </svg>
           {/* Center Text */}
           <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-zinc-500">Top Asset</span>
              <span className="text-xl font-bold text-white">BTC</span>
           </div>
        </div>

        {/* Legend */}
        <div className="flex-1 grid grid-cols-2 gap-4">
           {data.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                 <div className={`h-3 w-3 rounded-full ${item.bg}`} />
                 <div>
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-zinc-500">{item.value}%</p>
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}
