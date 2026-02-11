"use client";

import { useState } from "react";
import { User, Mail, Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export function ProfileSettings() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [avatar, setAvatar] = useState("https://github.com/shadcn.png");

  const handleSave = () => {
    toast.success("Profile updated successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Avatar className="h-24 w-24 border-2 border-zinc-800">
            <AvatarImage src={avatar} />
            <AvatarFallback className="bg-zinc-800 text-zinc-400 text-2xl">JD</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
             <Camera className="h-8 w-8 text-white" />
          </div>
        </div>
        <div>
           <h3 className="text-lg font-medium text-white mb-1">Profile Picture</h3>
           <p className="text-sm text-zinc-500 mb-3">PNG, JPG up to 5MB</p>
           <div className="flex gap-3">
              <Button size="sm" variant="outline" className="h-8 border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white">
                 Upload New
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                 Remove
              </Button>
           </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
         <div className="space-y-2">
            <Label className="text-zinc-400">Display Name</Label>
            <div className="relative">
               <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
               <Input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-zinc-950/50 border-zinc-800 focus-visible:ring-yellow-500/20"
               />
            </div>
         </div>
         
         <div className="space-y-2">
            <Label className="text-zinc-400">Email Address</Label>
            <div className="relative">
               <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
               <Input 
                  value={email}
                  disabled
                  className="pl-10 bg-zinc-950/30 border-zinc-800 text-zinc-500 cursor-not-allowed"
               />
            </div>
            <p className="text-xs text-zinc-500">Email cannot be changed directly. Contact support.</p>
         </div>
      </div>

      <div className="pt-4 flex justify-end">
         <Button onClick={handleSave} className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium">
            Save Changes
         </Button>
      </div>
    </div>
  );
}
