"use client";

import { ShieldCheck, Lock, Zap } from "lucide-react";
import Image from "next/image";

export default function WalletSecurity() {
  return (
    <section className="py-24 bg-white/5 border-y border-white/5 relative">
       <div className="max-w-screen-xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative mx-auto w-full max-w-[500px] h-[700px] flex items-center justify-center lg:order-last">
             
             {/* Back Phone - System Status */}
             <div className="absolute top-1/2 left-1/2 -translate-x-[45%] -translate-y-[55%] w-[280px] h-[580px] bg-black rounded-[45px] border-[6px] border-zinc-800 shadow-2xl overflow-hidden transform rotate-[5deg] opacity-60 hover:opacity-100 hover:rotate-[0deg] hover:z-20 transition-all duration-500 hover:scale-105 origin-center">
                <div className="absolute top-0 inset-x-0 h-7 bg-black z-50 rounded-b-2xl" />
                <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-6 relative">
                     <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
                     <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4">
                        <Zap className="w-10 h-10 text-blue-500" />
                     </div>
                     <h3 className="text-white font-bold text-lg mb-2">SYSTEM SECURED</h3>
                     <div className="w-full bg-zinc-900 rounded-lg p-3 border border-white/5 mb-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Network</span>
                            <span className="text-blue-400">Connected</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-blue-500 animate-pulse" />
                        </div>
                     </div>
                      <div className="w-full bg-zinc-900 rounded-lg p-3 border border-white/5">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Firewall</span>
                            <span className="text-green-400">Active</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-green-500" />
                        </div>
                     </div>
                </div>
             </div>

             {/* Front Phone - Biometric Scan */}
             <div className="absolute top-1/2 left-1/2 -translate-x-[55%] -translate-y-[45%] w-[300px] h-[620px] bg-black rounded-[50px] border-[8px] border-zinc-800 shadow-2xl shadow-green-900/20 overflow-hidden transform rotate-[-5deg] hover:rotate-0 hover:z-30 transition-all duration-500 hover:scale-105 origin-center">
                {/* Dynamic Island / Notch Area */}
                <div className="absolute top-0 inset-x-0 h-8 bg-black z-50 rounded-b-3xl" />
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 flex justify-end items-center pr-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                </div>
                
                {/* Screen Content - Security Scanning */}
                <div className="w-full h-full bg-black text-white overflow-hidden flex flex-col relative">
                    {/* Background Grid & Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-black to-black" />
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                    
                    {/* Scanning Animation */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-green-500/0 via-green-500/10 to-green-500/0 animate-scan z-10 pointer-events-none" />
                    
                    {/* Center Lock Icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-500/30 blur-xl rounded-full animate-pulse" />
                            <div className="w-24 h-24 rounded-full border-2 border-green-500/50 flex items-center justify-center relative bg-black/50 backdrop-blur-sm">
                                <ShieldCheck className="w-10 h-10 text-green-400" />
                                {/* Rotating Rings */}
                                <div className="absolute inset-[-10px] border border-green-500/30 rounded-full border-t-transparent animate-spin duration-3000" />
                                <div className="absolute inset-[-20px] border border-green-500/20 rounded-full border-b-transparent animate-spin-slow duration-5000" />
                            </div>
                        </div>
                        <h3 className="mt-8 text-xl font-bold text-white tracking-wider">SECURE VAULT</h3>
                        <p className="text-green-400 text-xs font-mono mt-2 animate-pulse">BIOMETRIC VERIFIED</p>
                    </div>

                    {/* Security Metrics */}
                    <div className="absolute bottom-12 left-6 right-6 space-y-4 z-20">
                        <div className="bg-zinc-900/80 backdrop-blur-md rounded-xl p-4 border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Lock className="w-4 h-4 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Encryption</p>
                                    <p className="text-[10px] text-gray-400">AES-256 Enabled</p>
                                </div>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
                        </div>
                        <div className="bg-zinc-900/80 backdrop-blur-md rounded-xl p-4 border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Zap className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Network Status</p>
                                    <p className="text-[10px] text-gray-400">L2 Secured</p>
                                </div>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                        </div>
                    </div>
                </div>
             </div>
             
             {/* Decorative Elements */}
             <div className="absolute bottom-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl -z-10" />
          </div>
          
          <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-white">Bank-Grade Security Architecture</h2>
              <div className="space-y-6">
                  <div className="flex gap-4">
                      <div className="p-3 bg-white/5 rounded-lg h-fit border border-white/10">
                          <Zap className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                          <h4 className="text-white font-bold text-lg">Zero-Knowledge Proofs</h4>
                          <p className="text-gray-400">Verify transactions without revealing sensitive data. Your financial privacy is mathematically guaranteed.</p>
                      </div>
                  </div>
                  <div className="flex gap-4">
                      <div className="p-3 bg-white/5 rounded-lg h-fit border border-white/10">
                          <Lock className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                          <h4 className="text-white font-bold text-lg">Non-Custodial Design</h4>
                          <p className="text-gray-400">You are the only one with access to your funds. We cannot freeze your account or access your assets.</p>
                      </div>
                  </div>
                  <div className="flex gap-4">
                      <div className="p-3 bg-white/5 rounded-lg h-fit border border-white/10">
                          <ShieldCheck className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                          <h4 className="text-white font-bold text-lg">Biometric Authentication</h4>
                          <p className="text-gray-400">Secure your wallet with FaceID or TouchID integration, adding a physical layer of security to your digital assets.</p>
                      </div>
                  </div>
              </div>
          </div>
       </div>
    </section>
  );
}
