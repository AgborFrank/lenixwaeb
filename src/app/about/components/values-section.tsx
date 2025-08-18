import { Award, Heart, Shield, Users, Globe, Zap } from "lucide-react";

export default function ValuesSection() {
  return (
    <section className="bg-black py-24 px-4">
      <div className="max-w-screen-xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            The Values That
            <span className="text-yellow-400"> Drive Us Forward</span>
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            These core values guide every decision we make, every product we
            build, and every interaction we have with our community.
          </p>
        </div>

        {/* Values Grid */}
        <div className="space-y-16">
          {/* Value 1 - Left Image, Right Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              {/* Image placeholder */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 border border-gray-700 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Award className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                  <p className="text-gray-400 text-lg">
                    Excellence in Everything
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-3 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-2 w-fit">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">
                  Excellence
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white">
                Excellence in Everything We Do
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                We don't settle for good enough. Every feature, every
                interaction, and every service we provide is crafted with
                attention to detail and a commitment to excellence.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Quality-driven development process
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Continuous improvement mindset
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  User-centric design approach
                </li>
              </ul>
            </div>
          </div>

          {/* Value 2 - Right Image, Left Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-2 w-fit">
                <Heart className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">
                  Integrity
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white">
                Integrity and Trust Above All
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Trust is the foundation of everything we do. We operate with
                complete transparency, always putting our users' interests first
                and maintaining the highest ethical standards.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Transparent business practices
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  User-first decision making
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Ethical technology development
                </li>
              </ul>
            </div>
            <div>
              {/* Image placeholder */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 border border-gray-700 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Heart className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                  <p className="text-gray-400 text-lg">Building Trust</p>
                </div>
              </div>
            </div>
          </div>

          {/* Value 3 - Left Image, Right Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              {/* Image placeholder */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 border border-gray-700 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                  <p className="text-gray-400 text-lg">Community Focus</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-3 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-2 w-fit">
                <Users className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">
                  Community
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white">
                Community-Driven Innovation
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our community is our greatest asset. We listen to our users,
                learn from their experiences, and build solutions that address
                real needs. Together, we're stronger.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  User feedback integration
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Collaborative development
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Open communication channels
                </li>
              </ul>
            </div>
          </div>

          {/* Value 4 - Right Image, Left Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-2 w-fit">
                <Globe className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">
                  Impact
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white">
                Global Impact and Accessibility
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                We're committed to making financial services accessible to
                everyone, everywhere. Our technology breaks down barriers and
                creates opportunities for people around the world.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Inclusive design principles
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Multi-language support
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Cross-cultural understanding
                </li>
              </ul>
            </div>
            <div>
              {/* Image placeholder */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 border border-gray-700 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Globe className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                  <p className="text-gray-400 text-lg">Global Reach</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
