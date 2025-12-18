"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";

export default function ContactHero() {
  return (
    <section className="relative bg-gradient-to-br from-black via-black to-gray-900 py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/assets/img/noise.png')] bg-repeat opacity-20"></div>
      </div>

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions about Bitnovatus? We&apos;re here to help. Reach out to
            our team for support, partnerships, or general inquiries.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="flex flex-col items-center p-6 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-white font-semibold mb-2">Email Us</h3>
            <p className="text-gray-300 text-sm">support@Bitnovatus.com</p>
          </div>

          <div className="flex flex-col items-center p-6 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-white font-semibold mb-2">Live Chat</h3>
            <p className="text-gray-300 text-sm">Available 24/7</p>
          </div>

          <div className="flex flex-col items-center p-6 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-white font-semibold mb-2">Call Us</h3>
            <p className="text-gray-300 text-sm">+1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </section>
  );
}
