import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function AuthCodeError() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/assets/img/background6.png)" }}
      />
      <div className="absolute inset-0 z-[1] bg-black/50" />

      <div className="w-full max-w-md relative z-10 rounded-3xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">
          Authentication Error
        </h1>
        <p className="text-gray-400 mb-8">
          There was a problem authenticating your account. The link may have
          expired or is invalid.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-yellow-400 text-black font-bold py-3 px-6 rounded-xl hover:bg-yellow-300 transition-colors shadow-[0_0_20px_rgba(250,204,21,0.2)]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    </main>
  );
}
