import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, Landmark } from "lucide-react";
import { submitServiceSelection } from "./actions";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  
  // Optional: Check if already completed and redirect to dashboard?
  // Use Middleware or just let them edit. Let's redirect if done.
   const { data: onboarding } = await supabase
    .from("web_onboarding")
    .select("step_completed")
    .eq("user_id", user.id)
    .single();

    if (onboarding && onboarding.step_completed >= 2) {
        redirect("/dashboard");
    }


  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/assets/img/background6.png)" }}
      />
      <div className="absolute inset-0 z-[1] bg-black/50" />

      <div className="max-w-4xl w-full relative z-10">
         <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Welcome to Lenix Protocol</h1>
            <p className="text-xl text-gray-400">How can we assist you today?</p>
         </div>

         <form
          action={submitServiceSelection}
          className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl md:p-10"
        >
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Option 1: Recovery */}
                <label className="group relative rounded-2xl border border-white/20 bg-white/5 p-8 shadow-lg backdrop-blur-md cursor-pointer hover:bg-white/10 hover:border-yellow-400/40 transition-all duration-300">
                    <input type="radio" name="serviceType" value="recovery" className="peer sr-only" required />
                    
                    <div className="absolute top-6 right-6 w-6 h-6 rounded-full border border-white/30 peer-checked:bg-yellow-400 peer-checked:border-yellow-400 transition-colors"></div>
                    
                    <div className="w-16 h-16 bg-yellow-400/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <ShieldCheck className="w-8 h-8 text-yellow-400" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3">Crypto Asset Recovery</h3>
                    <p className="text-gray-400 leading-relaxed">
                        I have lost access to my funds or sent them to the wrong address and need expert assistance to recover them.
                    </p>
                </label>

                {/* Option 2: Loan */}
                 <label className="group relative rounded-2xl border border-white/20 bg-white/5 p-8 shadow-lg backdrop-blur-md cursor-pointer hover:bg-white/10 hover:border-yellow-400/40 transition-all duration-300">
                    <input type="radio" name="serviceType" value="loan" className="peer sr-only" required />
                    
                    <div className="absolute top-6 right-6 w-6 h-6 rounded-full border border-white/30 peer-checked:bg-yellow-400 peer-checked:border-yellow-400 transition-colors"></div>
                    
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Landmark className="w-8 h-8 text-blue-400" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3">Instant Crypto Loan</h3>
                    <p className="text-gray-400 leading-relaxed">
                        I want to use my crypto assets as collateral to get an instant loan with competitive interest rates.
                    </p>
                </label>
             </div>

             <div className="mt-12 text-center">
                <button type="submit" className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 px-12 rounded-full text-lg shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-all">
                    Continue
                </button>
             </div>
         </form>
      </div>
    </main>
  );
}
