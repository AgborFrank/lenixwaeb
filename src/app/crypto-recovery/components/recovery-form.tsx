"use client";

import { useState } from "react";
import { ArrowRight, Shield, Clock, CheckCircle } from "lucide-react";

export default function RecoveryForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    assetType: "",
    lossAmount: "",
    lossType: "",
    description: "",
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <section className="bg-black py-24 px-4 relative border-t border-white/5" id="start-recovery">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Start Your
                <br />
                <span className="text-yellow-400">Recovery Case</span>
              </h2>
              <p className="text-gray-400 text-xl leading-relaxed">
                Time is critical in asset recovery. The sooner you report the loss, the higher the chances of a successful reclamation. Our team evaluates new cases within 24 hours.
              </p>
            </div>

            <div className="space-y-8">
                {[
                    { title: "Confidential Consultation", desc: "Your case details are protected by attorney-client privilege standards.", icon: Shield },
                    { title: "Rapid Response Team", desc: "Immediate deployment of forensic tools to track asset movement.", icon: Clock },
                    { title: "Risk-Free Assessment", desc: "We evaluate the recoverability of your case at no cost.", icon: CheckCircle }
                ].map((item, i) => (
                    <div key={i} className="flex gap-6">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <item.icon className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-gray-400">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 relative shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none" />
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Asset Type</label>
                  <select
                    name="assetType"
                    value={formData.assetType}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all appearance-none"
                  >
                    <option value="">Select Asset</option>
                    <option value="bitcoin">Bitcoin (BTC)</option>
                    <option value="ethereum">Ethereum (ETH)</option>
                    <option value="usdt">USDT / USDC</option>
                    <option value="other">Other Altcoins</option>
                  </select>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-300">Estimated Loss</label>
                  <input
                    type="text"
                    name="lossAmount"
                    value={formData.lossAmount}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
                    placeholder="e.g. 2.5 BTC"
                  />
                </div>
              </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Case Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all resize-none"
                    placeholder="Please provide transaction hashes and details..."
                  />
                </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-5 rounded-xl transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] text-lg flex items-center justify-center gap-2"
              >
                Submit Case for Review <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
