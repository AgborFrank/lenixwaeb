"use client";

import { ShieldCheck, Activity, AlertTriangle, CheckCircle2, ArrowUpRight, ArrowDownLeft, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function WalletStatus() {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="h-5 w-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Wallet Health</h3>
        </div>
        
        <div className="space-y-4">
           <div className="space-y-2">
              <div className="flex justify-between text-sm">
                 <span className="text-zinc-400">Health Score</span>
                 <span className="text-white font-bold">85/100</span>
              </div>
              <Progress value={85} className="h-2 bg-zinc-800" indicatorColor="bg-yellow-500" />
           </div>

           <div className="grid gap-3">
              <SecurityItem 
                 icon={CheckCircle2} 
                 label="Phrase Backed Up" 
                 status="Active" 
                 color="text-emerald-400" 
              />
              <SecurityItem 
                 icon={CheckCircle2} 
                 label="Biometrics" 
                 status="Enabled" 
                 color="text-emerald-400" 
              />
              <SecurityItem 
                 icon={AlertTriangle} 
                 label="Withdrawal Limit" 
                 status="Not Set" 
                 color="text-yellow-400" 
                 action="Set Limit"
              />
           </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 backdrop-blur-sm">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
               <Activity className="h-5 w-5 text-yellow-400" />
               <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            </div>
            <Button variant="link" className="text-xs text-zinc-500 hover:text-white p-0">View All</Button>
         </div>
         
         <div className="space-y-4 relative">
            {/* Timeline line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-zinc-800" />
            
            <ActivityItem 
               title="Received USDT" 
               time="Today, 10:45 AM" 
               amount="+500.00" 
               status="Completed"
               icon={ArrowDownLeft}
               iconColor="text-emerald-400 bg-emerald-400/10"
            />
             <ActivityItem 
               title="Sent ETH" 
               time="Yesterday, 4:20 PM" 
               amount="-0.45"
               status="Completed"
               icon={ArrowUpRight}
               iconColor="text-zinc-400 bg-zinc-400/10"
            />
             <ActivityItem 
               title="Swapped MATIC" 
               time="Feb 10, 2026" 
               desc="to USDT"
               amount="450 MATIC"
               status="Pending"
               icon={RefreshCcw}
               iconColor="text-yellow-400 bg-yellow-400/10"
            />
         </div>
      </div>
    </div>
  );
}

function SecurityItem({ icon: Icon, label, status, color, action }: any) {
   return (
      <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-white/5 border border-white/5">
         <div className="flex items-center gap-3">
            <Icon className={`h-4 w-4 ${color}`} />
            <span className="text-zinc-300">{label}</span>
         </div>
         <div className="flex items-center gap-3">
            <span className={`text-xs font-medium ${color}`}>{status}</span>
            {action && (
               <button className="text-xs bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded hover:bg-yellow-400/20 transition-colors">
                  {action}
               </button>
            )}
         </div>
      </div>
   );
}

function ActivityItem({ title, time, amount, desc, status, icon: Icon, iconColor }: any) {
   return (
      <div className="relative pl-6">
         <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full bg-zinc-900 border-2 border-zinc-700 ring-4 ring-zinc-950 z-10 flex items-center justify-center">
            {/* Optional dot center */}
         </div>
         <div className="flex justify-between items-start">
            <div>
               <p className="text-sm font-medium text-white">{title}</p>
               <p className="text-xs text-zinc-500">{time}</p>
            </div>
            <div className="text-right">
               {amount && <p className="text-sm font-bold text-white">{amount}</p>}
               {desc && <p className="text-xs text-zinc-400">{desc}</p>}
               <span className="text-[10px] text-zinc-600 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 mt-1 inline-block">
                  {status}
               </span>
            </div>
         </div>
      </div>
   )
}
