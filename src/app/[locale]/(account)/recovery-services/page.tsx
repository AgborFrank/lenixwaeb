import { Search, Shield, Zap, CheckCircle } from "lucide-react";
import { RecoveryRequestForm } from "./_components/recovery-request-form";

const steps = [
  { icon: Search, title: "Assessment", description: "We analyze the trail and assess recoverability." },
  { icon: Shield, title: "Strategy", description: "Tailored plan with legal and forensic support." },
  { icon: Zap, title: "Recovery", description: "We engage exchanges and authorities to retrieve funds." },
  { icon: CheckCircle, title: "Return", description: "Funds transferred to your verified wallet." },
];

export default function RecoveryServicesPage() {
  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Recovery Services
        </h1>
        <p className="text-gray-400">
          Submit a recovery request for lost or stolen crypto assets. Our forensic team will assess your case and contact you within 24–48 hours.
        </p>
      </div>

      {/* Recovery Process */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
          Process
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-3 lg:flex-col lg:items-center lg:text-center"
            >
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center shrink-0 lg:mb-3">
                <step.icon className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recovery Request Form */}
      <div className="rounded-2xl border border-white/20 bg-white/10 p-6 md:p-8 shadow-xl backdrop-blur-xl mb-20 md:mb-0">
        <h2 className="text-xl font-bold text-white mb-2">
          Asset Recovery & Forensics Details
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          We help you trace and recover lost crypto assets and build verified evidence for lawful fund recovery.
        </p>
        <RecoveryRequestForm />
      </div>
    </div>
  );
}
