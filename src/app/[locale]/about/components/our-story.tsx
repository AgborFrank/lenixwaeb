import { Calendar, Users, Globe, Zap } from "lucide-react";

export default function OurStory() {
  return (
    <section className="bg-black py-24 px-4">
      <div className="max-w-screen-xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Our Journey to
            <span className="text-yellow-400"> Revolutionize Finance</span>
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            From a small team with a big vision to a global platform serving
            millions. Here&apos;s how we&apos;ve grown and evolved over the
            years.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-700 h-full hidden lg:block"></div>

          <div className="space-y-16">
            {/* 2019 */}
            <div className="relative flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 lg:pr-12 lg:text-right">
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                  <div className="flex items-center gap-4 mb-4 lg:justify-end">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      2019 - The Beginning
                    </h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Founded by a team of blockchain enthusiasts and financial
                    experts, Lenix Protocol was born from a simple idea: make
                    crypto accessible to everyone, not just tech-savvy users.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 lg:justify-end">
                    <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-sm">
                      Company Founded
                    </span>
                    <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-sm">
                      First Team
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full border-4 border-black hidden lg:flex items-center justify-center">
                <span className="text-black font-bold text-sm">1</span>
              </div>

              <div className="lg:w-1/2 lg:pl-12">
                {/* Image placeholder */}
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Founding Team Photo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2020 */}
            <div className="relative flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 lg:pr-12 order-2 lg:order-1">
                {/* Image placeholder */}
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">First Product Launch</p>
                  </div>
                </div>
              </div>

              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full border-4 border-black hidden lg:flex items-center justify-center">
                <span className="text-black font-bold text-sm">2</span>
              </div>

              <div className="lg:w-1/2 lg:pl-12 order-1 lg:order-2">
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Globe className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      2020 - First Launch
                    </h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Launched our first cross-border payment solution, helping
                    users send money globally using crypto. The response was
                    overwhelming, and we knew we were onto something special.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-sm">
                      Product Launch
                    </span>
                    <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-sm">
                      10K Users
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2021 */}
            <div className="relative flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 lg:pr-12 lg:text-right">
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                  <div className="flex items-center gap-4 mb-4 lg:justify-end">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Zap className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      2021 - Rapid Growth
                    </h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Expanded our services to include crypto recovery and
                    lending. Our team grew to 50+ experts, and we served users
                    in over 100 countries. The crypto winter didn&apos;t slow us
                    down.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 lg:justify-end">
                    <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-sm">
                      100 Countries
                    </span>
                    <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-sm">
                      50+ Team
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full border-4 border-black hidden lg:flex items-center justify-center">
                <span className="text-black font-bold text-sm">3</span>
              </div>

              <div className="lg:w-1/2 lg:pl-12">
                {/* Image placeholder */}
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Zap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Global Expansion</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2024 */}
            <div className="relative flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 lg:pr-12 order-2 lg:order-1">
                {/* Image placeholder */}
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Current Team & Office</p>
                  </div>
                </div>
              </div>

              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full border-4 border-black hidden lg:flex items-center justify-center">
                <span className="text-black font-bold text-sm">4</span>
              </div>

              <div className="lg:w-1/2 lg:pl-12 order-1 lg:order-2">
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      2024 - Industry Leader
                    </h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Today, we&apos;re proud to serve over 50,000 users across
                    200+ countries. Our platform has processed over $1 billion
                    in transactions and recovered millions in lost crypto
                    assets.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-sm">
                      50K+ Users
                    </span>
                    <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-sm">
                      $1B+ Processed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
