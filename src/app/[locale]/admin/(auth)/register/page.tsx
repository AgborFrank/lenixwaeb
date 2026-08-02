"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, User, Mail, Lock, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminRegisterPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
    } catch {
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/assets/img/background6.png)" }}
        />
        <div className="absolute inset-0 z-[1] bg-black/50" />

        <div className="relative z-10 w-full max-w-md">
          <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                  <CheckCircle2 className="h-8 w-8 text-green-400" />
                </div>
              </div>
              <h1 className="mb-2 text-2xl font-bold text-white">
                Registration Submitted
              </h1>
              <p className="mb-6 text-gray-400">
                Your admin access request has been submitted and is pending
                approval. You will be notified once an administrator reviews
                your request.
              </p>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 font-bold text-black transition-all hover:bg-yellow-300"
              >
                Return to Login
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/assets/img/background6.png)" }}
      />
      <div className="absolute inset-0 z-[1] bg-black/50" />

      <Link
        href="/"
        className="absolute left-8 top-8 z-20 flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </Link>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <Link href="/" className="mb-6 inline-block">
              <Image
                src="/assets/img/logo.png"
                alt="Lenix Protocol"
                width={150}
                height={40}
                className="mx-auto h-8 w-auto"
              />
            </Link>
            <div className="mb-2 flex items-center justify-center gap-2">
              <ShieldCheck className="h-5 w-5 text-yellow-400" />
              <h1 className="text-2xl font-bold text-white">Request Admin Access</h1>
            </div>
            <p className="text-sm text-gray-400">
              Submit a request to become an administrator
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                className="ml-1 text-sm font-medium text-gray-300"
                htmlFor="username"
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-gray-500 transition-all focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                  placeholder="johndoe"
                  disabled={isLoading}
                  minLength={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="ml-1 text-sm font-medium text-gray-300"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-gray-500 transition-all focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                  placeholder="admin@example.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="ml-1 text-sm font-medium text-gray-300"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-gray-500 transition-all focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                  placeholder="••••••••"
                  disabled={isLoading}
                  minLength={8}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="ml-1 text-sm font-medium text-gray-300"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-gray-500 transition-all focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                  placeholder="••••••••"
                  disabled={isLoading}
                  minLength={8}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 py-3.5 font-bold text-black shadow-[0_0_20px_rgba(250,204,21,0.2)] transition-all hover:bg-yellow-300 hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Submitting..." : "Request Access"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Already have access?{" "}
              <Link
                href="/admin/login"
                className="font-medium text-yellow-400 hover:text-yellow-300"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
