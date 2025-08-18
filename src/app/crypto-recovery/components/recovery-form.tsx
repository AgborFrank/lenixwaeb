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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <section className="bg-black py-24 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-white">
                Ready to Start Your
                <span className="text-yellow-400"> Recovery Journey?</span>
              </h2>
              <p className="text-gray-300 text-xl leading-relaxed">
                Don't let lost crypto assets stay lost forever. Our team of
                experts is ready to help you recover what's yours. Fill out the
                form and we'll get back to you within 24 hours.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    Free Initial Assessment
                  </h3>
                  <p className="text-gray-400">
                    No upfront fees, no obligations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    24-Hour Response
                  </h3>
                  <p className="text-gray-400">We'll get back to you quickly</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    No Recovery, No Fee
                  </h3>
                  <p className="text-gray-400">You only pay if we succeed</p>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-white font-semibold text-lg mb-4">
                Why Trust Us?
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-yellow-400 font-bold text-2xl">85%</div>
                  <div className="text-gray-400">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 font-bold text-2xl">15K+</div>
                  <div className="text-gray-400">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 font-bold text-2xl">
                    $850M
                  </div>
                  <div className="text-gray-400">Recovered</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 font-bold text-2xl">24/7</div>
                  <div className="text-gray-400">Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Start Your Recovery
              </h3>
              <p className="text-gray-400">
                Tell us about your situation and we'll help you get started.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Phone and Asset Type */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Asset Type *
                  </label>
                  <select
                    name="assetType"
                    value={formData.assetType}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  >
                    <option value="">Select asset type</option>
                    <option value="bitcoin">Bitcoin (BTC)</option>
                    <option value="ethereum">Ethereum (ETH)</option>
                    <option value="usdt">Tether (USDT)</option>
                    <option value="usdc">USD Coin (USDC)</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Loss Amount and Type */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Estimated Loss Amount *
                  </label>
                  <input
                    type="text"
                    name="lossAmount"
                    value={formData.lossAmount}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="e.g., $10,000 or 2.5 BTC"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Type of Loss *
                  </label>
                  <select
                    name="lossType"
                    value={formData.lossType}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  >
                    <option value="">Select loss type</option>
                    <option value="hack">Hack/Exploit</option>
                    <option value="phishing">Phishing Scam</option>
                    <option value="lost-access">Lost Access</option>
                    <option value="exchange">Exchange Issues</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Describe Your Situation *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                  placeholder="Please provide details about how you lost your crypto assets, when it happened, and any relevant information that might help with recovery..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
              >
                Start Recovery Process
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-gray-400 text-sm text-center">
                By submitting this form, you agree to our terms of service and
                privacy policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
