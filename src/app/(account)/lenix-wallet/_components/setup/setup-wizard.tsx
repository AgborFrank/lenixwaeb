"use client";

import { useState } from "react";
import { WelcomeScreen } from "./welcome-screen";
import { CreateWalletFlow } from "./create-wallet-flow";
import { ImportWalletFlow } from "./import-wallet-flow";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type SetupStep = "welcome" | "create" | "import";

interface SetupWizardProps {
  onComplete: () => void;
}

export function SetupWizard({ onComplete }: SetupWizardProps) {
  const [step, setStep] = useState<SetupStep>("welcome");

  const handleBack = () => setStep("welcome");

  return (
    <div className="max-w-2xl mx-auto">
      {step !== "welcome" && (
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-6 text-zinc-400 hover:text-white px-0 hover:bg-transparent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      )}

      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 sm:p-10 backdrop-blur-xl">
        {step === "welcome" && (
          <WelcomeScreen 
            onCreate={() => setStep("create")} 
            onImport={() => setStep("import")} 
          />
        )}
        
        {step === "create" && (
          <CreateWalletFlow onComplete={onComplete} />
        )}
        
        {step === "import" && (
          <ImportWalletFlow onComplete={onComplete} />
        )}
      </div>
    </div>
  );
}
