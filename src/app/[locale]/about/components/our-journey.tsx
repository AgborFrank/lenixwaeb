import { Calendar, Users, Globe, Zap, Award } from "lucide-react";

export default function OurJourney() {
  return (
    <section className="bg-black py-20 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Our Journey to
            <span className="text-yellow-400"> Industry Leadership</span>
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            From a small team with a big vision to a global platform serving
            millions. Here&apos;s how we&apos;ve grown and evolved over the
            years.
          </p>
        </div>

        {/* Horizontal Timeline Slider */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 transform -translate-y-1/2"></div>

          {/* Scrollable Container */}
          <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide">
            {/* 2019 */}
            <div className="flex-shrink-0 w-80">
              <div className="relative">
                {/* Timeline Dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-400 rounded-full border-4 border-black flex items-center justify-center z-10">
                  <span className="text-black font-bold text-xs">1</span>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-black" />
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      2019 - The Beginning
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Founded by blockchain enthusiasts and financial experts,
                    Lenix Protocol was born from a simple idea: make crypto
                    accessible to everyone, not just tech-savvy users.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-full text-xs">
                      Company Founded
                    </span>
                    <span className="bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-full text-xs">
                      First Team
                    </span>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Founding Team Photo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2020 */}
            <div className="flex-shrink-0 w-80">
              <div className="relative">
                {/* Timeline Dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-400 rounded-full border-4 border-black flex items-center justify-center z-10">
                  <span className="text-black font-bold text-xs">2</span>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Globe className="w-5 h-5 text-black" />
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      2020 - First Launch
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Launched our first cross-border payment solution, helping
                    users send money globally using crypto. The response was
                    overwhelming, and we knew we were onto something special.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-full text-xs">
                      Product Launch
                    </span>
                    <span className="bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-full text-xs">
                      10K Users
                    </span>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">
                      First Product Launch
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2021 */}
            <div className="flex-shrink-0 w-80">
              <div className="relative">
                {/* Timeline Dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-400 rounded-full border-4 border-black flex items-center justify-center z-10">
                  <span className="text-black font-bold text-xs">3</span>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-black" />
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      2021 - Rapid Growth
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Expanded our services to include crypto recovery and
                    lending. Our team grew to 50+ experts, and we served users
                    in over 100 countries. The crypto winter didn&apos;t slow us
                    down.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-full text-xs">
                      100 Countries
                    </span>
                    <span className="bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-full text-xs">
                      50+ Team
                    </span>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Zap className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Global Expansion</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2024 */}
            <div className="flex-shrink-0 w-80">
              <div className="relative">
                {/* Timeline Dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-400 rounded-full border-4 border-black flex items-center justify-center z-10">
                  <span className="text-black font-bold text-xs">4</span>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-black" />
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      2024 - Industry Leader
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Today, we&apos;re proud to serve over 50,000 users across
                    200+ countries. Our platform has processed over $1 billion
                    in transactions and we&apos;re recognized as a leader in the
                    crypto payment space.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-full text-xs">
                      50K+ Users
                    </span>
                    <span className="bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-full text-xs">
                      $1B+ Processed
                    </span>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Award className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">
                      Industry Recognition
                    </p>
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
