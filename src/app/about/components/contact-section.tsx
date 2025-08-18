"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
  };

  return (
    <section className="bg-gradient-to-r from-gray-900 to-black py-24 px-4">
      <div className="max-w-screen-xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Let&apos;s Start a
            <span className="text-yellow-400"> Conversation</span>
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            Have questions about our services? Want to learn more about our
            team? We&apos;d love to hear from you and discuss how we can help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">
                Get in Touch
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Whether you&apos;re a potential partner, investor, or just
                curious about what we do, we&apos;re here to help. Reach out and
                let&apos;s explore how we can work together.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Email Us</h4>
                  <p className="text-gray-400">hello@lenixprotocol.com</p>
                  <p className="text-gray-400">support@lenixprotocol.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Call Us</h4>
                  <p className="text-gray-400">+1 (555) 123-4567</p>
                  <p className="text-gray-400">Mon-Fri, 9AM-6PM EST</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Visit Us</h4>
                  <p className="text-gray-400">123 Blockchain Street</p>
                  <p className="text-gray-400">San Francisco, CA 94105</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Business Hours</h4>
                  <p className="text-gray-400">
                    Monday - Friday: 9AM - 6PM EST
                  </p>
                  <p className="text-gray-400">Saturday: 10AM - 4PM EST</p>
                </div>
              </div>
            </div>

            {/* Quick Contact Options */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h4 className="text-white font-semibold mb-4">Quick Contact</h4>
              <div className="space-y-3">
                <button className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Start Live Chat
                </button>
                <button className="w-full bg-transparent border border-gray-600 text-white font-semibold py-3 rounded-lg hover:bg-gray-700 transition-colors">
                  Schedule a Call
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Send us a Message
              </h3>
              <p className="text-gray-400">
                We&apos;ll get back to you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Enter your first name"
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

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
              >
                Send Message
                <Send className="w-5 h-5" />
              </button>

              <p className="text-gray-400 text-sm text-center">
                By submitting this form, you agree to our privacy policy and
                terms of service.
              </p>
            </form>
          </div>
        </div>

        {/* Additional Contact Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 text-center">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-yellow-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">24/7 Support</h4>
            <p className="text-gray-400 text-sm">
              Our support team is always here to help you
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 text-center">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">Quick Response</h4>
            <p className="text-gray-400 text-sm">
              We typically respond within 2 hours
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 text-center">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-yellow-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">Multiple Channels</h4>
            <p className="text-gray-400 text-sm">
              Email, phone, chat - choose your preference
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
