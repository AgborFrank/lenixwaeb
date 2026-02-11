"use client";

import { useState } from "react";
import { Smartphone, Lock, History, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(false);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password updated successfully");
  };

  return (
    <div className="space-y-8">
       {/* 2FA Section */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
               <Smartphone className="h-5 w-5" />
            </div>
            <div>
               <h3 className="font-medium text-white">Two-Factor Authentication</h3>
               <p className="text-sm text-zinc-500">Secure your account with 2FA.</p>
            </div>
         </div>
         <Switch 
            checked={twoFactor} 
            onCheckedChange={setTwoFactor}
            className="data-[state=checked]:bg-yellow-500"
         />
      </div>

      {/* Change Password */}
      <div className="space-y-4">
         <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Lock className="h-4 w-4 text-zinc-400" />
            <h3 className="text-lg font-medium text-white">Change Password</h3>
         </div>
         
         <form onSubmit={handlePasswordUpdate} className="grid gap-4 max-w-md">
            <div className="space-y-2">
               <Label className="text-zinc-400">Current Password</Label>
               <Input type="password" placeholder="••••••••" className="bg-zinc-950/50 border-zinc-800 focus-visible:ring-yellow-500/20" />
            </div>
            <div className="space-y-2">
               <Label className="text-zinc-400">New Password</Label>
               <Input type="password" placeholder="••••••••" className="bg-zinc-950/50 border-zinc-800 focus-visible:ring-yellow-500/20" />
            </div>
            <div className="space-y-2">
               <Label className="text-zinc-400">Confirm Password</Label>
               <Input type="password" placeholder="••••••••" className="bg-zinc-950/50 border-zinc-800 focus-visible:ring-yellow-500/20" />
            </div>
            <Button type="submit" variant="outline" className="w-full mt-2 border-zinc-700 hover:bg-zinc-800 text-zinc-300">
               Update Password
            </Button>
         </form>
      </div>

      {/* Login History (Mock) */}
      <div className="space-y-4">
         <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <History className="h-4 w-4 text-zinc-400" />
            <h3 className="text-lg font-medium text-white">Recent Logins</h3>
         </div>
         <div className="space-y-3">
            {[
               { device: "Chrome on Windows", location: "New York, USA", time: "Just now", status: "Active" },
               { device: "Safari on iPhone", location: "New York, USA", time: "2 hours ago", status: "Signed out" },
            ].map((login, index) => (
               <div key={index} className="flex items-center justify-between text-sm p-3 rounded-lg hover:bg-white/5 transition-colors">
                  <div>
                     <p className="font-medium text-white">{login.device}</p>
                     <p className="text-xs text-zinc-500">{login.location} • {login.time}</p>
                  </div>
                  {login.status === "Active" ? (
                     <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full font-medium">Current</span>
                  ) : (
                     <span className="text-xs text-zinc-500">{login.status}</span>
                  )}
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
