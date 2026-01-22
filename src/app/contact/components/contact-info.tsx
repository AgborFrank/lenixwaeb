"use client";

import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Globe,
  Twitter,
  Linkedin,
  Github,
  MessageCircle,
} from "lucide-react";

export default function ContactInfo() {
  return (
    <div className="space-y-8">
      {/* Company Information */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-6">
          Contact Information
        </h2>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Office Address</h3>
              <p className="text-gray-300 text-sm">
                123 Blockchain Street
                <br />
                Crypto Valley, Zug 6300
                <br />
                Switzerland
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Email Address</h3>
              <p className="text-gray-300 text-sm">
                <a
                  href="mailto:hello@Lenix Protocol.com"
                  className="hover:text-yellow-400 transition-colors"
                >
                  hello@Lenix Protocol.com
                </a>
              </p>
              <p className="text-gray-300 text-sm">
                <a
                  href="mailto:support@Lenix Protocol.com"
                  className="hover:text-yellow-400 transition-colors"
                >
                  support@Lenix Protocol.com
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Phone Number</h3>
              <p className="text-gray-300 text-sm">
                <a
                  href="tel:+41551234567"
                  className="hover:text-yellow-400 transition-colors"
                >
                  +41 55 123 45 67
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Business Hours</h3>
              <p className="text-gray-300 text-sm">
                Monday - Friday: 9:00 AM - 6:00 PM CET
                <br />
                Saturday: 10:00 AM - 4:00 PM CET
                <br />
                Sunday: Closed
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Website</h3>
              <p className="text-gray-300 text-sm">
                <a
                  href="https://Lenix Protocol.com"
                  className="hover:text-yellow-400 transition-colors"
                >
                  https://Lenix Protocol.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-black font-bold text-lg">
              Need Immediate Help?
            </h3>
            <p className="text-black/80 text-sm">
              Our live chat is available 24/7
            </p>
          </div>
        </div>
        <button className="w-full mt-4 bg-black text-yellow-400 py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition-colors">
          Start Live Chat
        </button>
      </div>

      {/* Social Media */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Follow Us</h3>

        <div className="grid grid-cols-2 gap-4">
          <a
            href="https://twitter.com/Lenix Protocol"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Twitter className="w-6 h-6 text-blue-400" />
            <span className="text-white font-medium">Twitter</span>
          </a>

          <a
            href="https://linkedin.com/company/Lenix Protocol"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Linkedin className="w-6 h-6 text-blue-600" />
            <span className="text-white font-medium">LinkedIn</span>
          </a>

          <a
            href="https://github.com/Lenix Protocol"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Github className="w-6 h-6 text-white" />
            <span className="text-white font-medium">GitHub</span>
          </a>

          <a
            href="https://t.me/Lenix Protocol"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <MessageCircle className="w-6 h-6 text-blue-500" />
            <span className="text-white font-medium">Telegram</span>
          </a>
        </div>
      </div>

      {/* Response Time */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Response Times</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Email Support</span>
            <span className="text-yellow-400 font-semibold">
              Within 24 hours
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Live Chat</span>
            <span className="text-yellow-400 font-semibold">Instant</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Phone Support</span>
            <span className="text-yellow-400 font-semibold">
              Business Hours
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
