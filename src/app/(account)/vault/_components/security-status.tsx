"use client";

import { ShieldCheck, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function SecurityStatus() {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Vault Security Health</h3>
        </div>
        
        <div className="space-y-4">
           <div className="space-y-2">
              <div className="flex justify-between text-sm">
                 <span className="text-zinc-400">Security Score</span>
                 <span className="text-white font-bold">92/100</span>
              </div>
              <Progress value={92} className="h-2 bg-zinc-800"  /> {/* Note: Requires Progress component, if not exists need standard div */}
           </div>

           <div className="grid gap-3">
              <SecurityItem 
                 icon={CheckCircle2} 
                 label="2FA Enabled" 
                 status="Active" 
                 color="text-emerald-400" 
              />
              <SecurityItem 
                 icon={CheckCircle2} 
                 label="Cold Storage" 
                 status="Active" 
                 color="text-emerald-400" 
              />
              <SecurityItem 
                 icon={CheckCircle2} 
                 label="Withdrawal Whitelist" 
                 status="Active" 
                 color="text-emerald-400" 
              />
              <SecurityItem 
                 icon={AlertTriangle} 
                 label="Recovery Phrase Backup" 
                 status="Pending Verification" 
                 color="text-yellow-400" 
                 action="Verify"
              />
           </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 backdrop-blur-sm">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
               <Activity className="h-5 w-5 text-blue-400" />
               <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            </div>
            <Button variant="link" className="text-xs text-zinc-500 hover:text-white p-0">View All</Button>
         </div>
         
         <div className="space-y-4 relative">
            {/* Timeline line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-zinc-800" />
            
            <ActivityItem 
               title="USDT Deposit" 
               time="2 hours ago" 
               amount="+500 USDT" 
               status="Completed"
            />
             <ActivityItem 
               title="Security Check" 
               time="1 day ago" 
               desc="System automated scan"
               status="Passed"
            />
             <ActivityItem 
               title="Wallet Connected" 
               time="3 days ago" 
               desc="MetaMask (0x71...76F)"
               status="Authorized"
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

function ActivityItem({ title, time, amount, desc, status }: any) {
   return (
      <div className="relative pl-6">
         <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full bg-zinc-900 border-2 border-zinc-700 ring-4 ring-zinc-950 z-10" />
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
