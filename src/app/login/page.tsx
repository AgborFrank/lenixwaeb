"use client";

import Link from "next/link";
import { login } from "../auth/actions";
import { ArrowLeft, User, Lock } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string; error: string };
}) {
  useEffect(() => {
    if (searchParams?.message) {
      toast.success(searchParams.message);
    }
    if (searchParams?.error) {
      toast.error(searchParams.error);
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/assets/img/background6.png)" }}
      />
      <div className="absolute inset-0 z-[1] bg-black/50" />

      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/assets/img/logo.png"
                alt="Lenix Protocol"
                width={150}
                height={40}
                className="h-8 w-auto mx-auto"
              />
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400 text-sm">
              Sign in to access your dashboard
            </p>
          </div>

          <form action={login} className="space-y-6">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-300 ml-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/50 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label
                  className="text-sm font-medium text-gray-300"
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-yellow-400 hover:text-yellow-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)]"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-yellow-400 hover:text-yellow-300 font-medium"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
