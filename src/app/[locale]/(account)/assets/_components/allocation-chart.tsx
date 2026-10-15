"use client";

import { PieChart } from "lucide-react";

interface AllocationChartProps {
    tokens: any[];
}

export function AllocationChart({ tokens }: AllocationChartProps) {
  // Process tokens to get allocation data
  // Sort by USD value descending
  const sortedTokens = [...tokens].sort((a, b) => (b.quote || 0) - (a.quote || 0));
  const totalValue = sortedTokens.reduce((acc, t) => acc + (t.quote || 0), 0);

  // Take top 3 and group the rest as "Others"
  // If totalValue is 0, avoid division by zero
  const chartData = totalValue > 0 ? [
      ...sortedTokens.slice(0, 3).map((t, i) => ({
          name: t.contract_ticker_symbol,
          value: Math.round(((t.quote || 0) / totalValue) * 100),
          color: i === 0 ? "text-orange-500" : i === 1 ? "text-blue-500" : "text-emerald-500",
          bg: i === 0 ? "bg-orange-500" : i === 1 ? "bg-blue-500" : "bg-emerald-500",
      })),
      {
          name: "Others",
          value: Math.round((sortedTokens.slice(3).reduce((acc, t) => acc + (t.quote || 0), 0) / totalValue) * 100),
          color: "text-purple-500",
          bg: "bg-purple-500"
      }
  ].filter(item => item.value > 0) : []; // Remove 0% items

  // If no data, show empty state
  if (chartData.length === 0) {
      return (
        <div className="flex h-full flex-col items-center justify-center space-y-2 rounded-2xl border border-white/5 bg-zinc-900/50 p-4 text-center">
             <div className="rounded-full bg-zinc-800/50 p-2.5">
                <PieChart className="h-5 w-5 text-zinc-500" />
             </div>
             <div>
                <p className="text-white font-medium">No Assets</p>
                <p className="text-sm text-zinc-500">Deposit crypto to see allocation</p>
             </div>
        </div>
      );
  }

  // Calculate cumulative offsets for the chart
  let cumulativePercent = 0;
  const pieSegments = chartData.map(item => {
      const startOffset = cumulativePercent; // Starting point (0-100)
      cumulativePercent += item.value;
      return { ...item, startOffset };
  });

  const topAsset = chartData[0];

  return (
    <div className="h-full rounded-2xl border border-white/5 bg-zinc-900/50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <PieChart className="h-4 w-4 text-zinc-400" />
        <h3 className="text-sm font-medium text-white">Asset Allocation</h3>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative h-28 w-28 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
            {/* Background Circle */}
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#27272a" strokeWidth="12" />
            
            {/* Segments */}
            {pieSegments.map((segment, idx) => (
                <circle 
                   key={segment.name}
                   cx="50" cy="50" r="40" 
                   fill="transparent" 
                   stroke="currentColor" 
                   strokeWidth="12" 
                   className={segment.color}
                   strokeDasharray={`${segment.value * 2.51} 251`} 
                   strokeDashoffset={`${-(segment.startOffset * 2.51)}`}
                />
            ))}
          </svg>
           {/* Center Text */}
           <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] leading-none text-zinc-500">Top Asset</span>
              <span className="mt-0.5 text-sm font-bold leading-none text-white">{topAsset.name}</span>
           </div>
        </div>

        {/* Legend */}
        <div className="grid flex-1 grid-cols-2 gap-2">
           {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                 <div className={`h-2 w-2 rounded-full ${item.bg}`} />
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
