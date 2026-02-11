import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Landmark, LayoutDashboard } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: onboarding } = await supabase
    .from("web_onboarding")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!onboarding || (onboarding.step_completed ?? 0) < 2) {
    redirect("/onboarding");
  }

  const isRecovery = onboarding.service_type === "recovery";

  return (
    <div className="max-w-7xl mx-auto text-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Status Card - glass style */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 relative overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <LayoutDashboard className="w-32 h-32 text-white" />
            </div>

            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              {isRecovery ? (
                <ShieldCheck className="text-yellow-400" />
              ) : (
                <Landmark className="text-yellow-400" />
              )}
              {isRecovery ? "Recovery Case Status" : "Loan Application Status"}
            </h2>

            <div className="space-y-6">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />
                <div className="relative flex items-start gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shrink-0 z-10">
                    <ShieldCheck className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      Application Received
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      We have received your details and are reviewing them.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(onboarding.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="relative flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 z-10 border border-white/20">
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-400">
                      Under Review
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Our team is currently analyzing your request.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/30 p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  Submitted Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">Service Type</span>
                    <span className="text-white capitalize">
                      {onboarding.service_type}
                    </span>
                  </div>
                  {onboarding.details &&
                    Object.entries(onboarding.details).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-gray-500 block capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="text-white">{String(value)}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar card */}
        <div className="space-y-8">
          <div className="rounded-2xl border border-yellow-400/10 bg-yellow-400/5 p-6 backdrop-blur-xl">
            <h3 className="font-bold text-yellow-400 mb-2">Need Help?</h3>
            <p className="text-sm text-gray-400 mb-4">
              Our support team is available 24/7 to assist you with your case.
            </p>
            <Link
              href="https://t.me/Verified_protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-colors text-sm text-center"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
