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
        <div className="rounded-3xl bg-zinc-900/50 p-6 border border-white/5 h-full flex flex-col items-center justify-center text-center space-y-4">
             <div className="p-4 rounded-full bg-zinc-800/50">
                <PieChart className="h-8 w-8 text-zinc-500" />
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
              <span className="text-xs text-zinc-500">Top Asset</span>
              <span className="text-xl font-bold text-white">{topAsset.name}</span>
           </div>
        </div>

        {/* Legend */}
        <div className="flex-1 grid grid-cols-2 gap-4">
           {chartData.map((item) => (
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
