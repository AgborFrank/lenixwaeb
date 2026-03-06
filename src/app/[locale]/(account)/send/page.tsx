"use client";

import { Send } from "lucide-react";
import { SendForm } from "./_components/send-form";
import { RecentRecipients } from "./_components/recent-recipients";

export default function SendPage() {
  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8">
      
      {/* Page Header */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
          <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
             <Send className="h-6 w-6" />
          </div>
          Send Assets
        </h1>
        <p className="text-zinc-400 text-sm mt-1 ml-1">
          Securely transfer crypto to any blockchain address.
        </p>
      </div>

      {/* Content */}
      <div className="grid gap-12">
        <SendForm />
        <RecentRecipients />
      </div>
    </div>
  );
}
