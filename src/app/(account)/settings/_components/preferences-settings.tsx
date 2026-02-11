"use client";

import { useState } from "react";
import { Globe, DollarSign, Bell } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function PreferencesSettings() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  return (
    <div className="space-y-8">
      
      {/* Regional Settings */}
      <div className="space-y-4">
         <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <Globe className="h-4 w-4 text-zinc-400" />
            Regional
         </h3>
         <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
               <Label className="text-zinc-400">Language</Label>
               <Select defaultValue="en">
                  <SelectTrigger className="bg-zinc-950/50 border-zinc-800 text-white focus:ring-yellow-500/20">
                     <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                     <SelectItem value="en">English (US)</SelectItem>
                     <SelectItem value="es">Español</SelectItem>
                     <SelectItem value="fr">Français</SelectItem>
                     <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
               </Select>
            </div>
            <div className="space-y-2">
               <Label className="text-zinc-400">Currency</Label>
               <Select defaultValue="usd">
                  <SelectTrigger className="bg-zinc-950/50 border-zinc-800 text-white focus:ring-yellow-500/20">
                     <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                     <SelectItem value="usd">USD ($)</SelectItem>
                     <SelectItem value="eur">EUR (€)</SelectItem>
                     <SelectItem value="gbp">GBP (£)</SelectItem>
                     <SelectItem value="jpy">JPY (¥)</SelectItem>
                  </SelectContent>
               </Select>
            </div>
         </div>
      </div>

      <Separator className="bg-white/5" />

      {/* Notifications */}
      <div className="space-y-4">
         <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-zinc-400" />
            Notifications
         </h3>
         <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
               <div>
                  <p className="text-sm font-medium text-white">Email Notifications</p>
                  <p className="text-xs text-zinc-500">Receive updates about your account activity.</p>
               </div>
               <Switch 
                  checked={emailNotifs} 
                  onCheckedChange={setEmailNotifs}
                  className="data-[state=checked]:bg-yellow-500"
               />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
               <div>
                  <p className="text-sm font-medium text-white">Push Notifications</p>
                  <p className="text-xs text-zinc-500">Receive real-time alerts on your device.</p>
               </div>
               <Switch 
                  checked={pushNotifs} 
                  onCheckedChange={setPushNotifs}
                  className="data-[state=checked]:bg-yellow-500"
               />
            </div>
         </div>
      </div>
    </div>
  );
}
