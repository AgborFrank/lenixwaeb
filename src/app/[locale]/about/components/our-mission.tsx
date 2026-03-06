import { Target, Heart, Shield, Globe, Zap, Users } from "lucide-react";

export default function OurMission() {
  return (
    <section className="bg-gradient-to-r from-gray-900 to-black py-24 px-4">
      <div className="max-w-screen-xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Our Mission to
            <span className="text-yellow-400"> Empower Everyone</span>
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            We believe that financial freedom should be accessible to everyone,
            regardless of where they live or their technical expertise.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 border border-gray-700 mb-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-8">
              <Target className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-6">
              &quot;To democratize access to financial services through
              innovative blockchain technology, making crypto practical, secure,
              and accessible for everyone.&quot;
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              This isn&apos;t just our mission statement—it&apos;s our daily
              commitment. Every feature we build, every service we offer, and
              every decision we make is guided by this vision of financial
              inclusion.
            </p>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Innovation */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              Innovation First
            </h3>
            <p className="text-gray-300 leading-relaxed">
              We constantly push the boundaries of what&apos;s possible with
              blockchain technology, always looking for new ways to solve
              real-world problems.
            </p>
          </div>

          {/* Security */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              Security by Design
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Every aspect of our platform is built with security in mind. We
              protect our users&apos; assets with military-grade encryption and
              best practices.
            </p>
          </div>

          {/* Accessibility */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              Accessibility for All
            </h3>
            <p className="text-gray-300 leading-relaxed">
              We believe crypto should be accessible to everyone, not just tech
              experts. Our intuitive interfaces make complex financial
              operations simple.
            </p>
          </div>

          {/* Global Reach */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Global Impact</h3>
            <p className="text-gray-300 leading-relaxed">
              We serve users in over 200 countries, breaking down geographical
              barriers and connecting people through the power of decentralized
              finance.
            </p>
          </div>

          {/* Trust */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              Trust & Transparency
            </h3>
            <p className="text-gray-300 leading-relaxed">
              We build trust through transparency. Our users always know what
              we&apos;re doing, why we&apos;re doing it, and how their assets
              are being protected.
            </p>
          </div>

          {/* Community */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              Community Driven
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Our community of users, developers, and partners drives our
              innovation. We listen, learn, and build together to create better
              financial solutions.
            </p>
          </div>
        </div>

        {/* Vision Statement */}
        <div className="mt-16 text-center">
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              To create a world where anyone, anywhere, can access the same
              financial opportunities regardless of their location, background,
              or technical expertise. We envision a future where crypto is as
              common and easy to use as traditional banking, but with the added
              benefits of transparency, security, and global access.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
