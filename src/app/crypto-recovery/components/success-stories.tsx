import { Star, Quote, ArrowRight } from "lucide-react";

export default function SuccessStories() {
  return (
    <section className="bg-gradient-to-br from-gray-900 to-black py-24 px-4">
      <div className="max-w-screen-xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Success Stories That
            <span className="text-yellow-400"> Inspire Hope</span>
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            Real people, real recoveries. Here are just a few of the thousands
            of success stories from our satisfied clients.
          </p>
        </div>

        {/* Featured Case Study */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 lg:p-12 border border-gray-700 mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm font-medium">
                  Featured Recovery
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white">
                $2.3M Bitcoin Recovery
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                &quot;I thought I had lost everything when my hardware wallet
                was compromised. The Lenix team not only recovered my 45 BTC but
                also helped me implement better security measures. They&apos;re
                true professionals.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <div>
                  <div className="text-white font-semibold">Michael Chen</div>
                  <div className="text-gray-400 text-sm">
                    Software Engineer, San Francisco
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full">
                  Recovery Time: 18 days
                </span>
                <span className="bg-green-400/10 text-green-400 px-3 py-1 rounded-full">
                  Success Rate: 100%
                </span>
              </div>
            </div>
            <div>
              {/* Image placeholder */}
              <div className="bg-gray-700 rounded-2xl p-8 h-80 flex items-center justify-center">
                <div className="text-center">
                  <Quote className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Client Testimonial Video</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              &quot;Lost 12 ETH to a phishing scam. Lenix recovered 11.5 ETH
              within 3 weeks. Their communication was excellent throughout the
              process.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">S</span>
              </div>
              <div>
                <div className="text-white font-semibold">Sarah Johnson</div>
                <div className="text-gray-400 text-sm">Marketing Director</div>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              &quot;After losing access to my wallet, I thought recovery was
              impossible. The team at Lenix proved me wrong. Professional,
              efficient, and caring.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">D</span>
              </div>
              <div>
                <div className="text-white font-semibold">David Rodriguez</div>
                <div className="text-gray-400 text-sm">Business Owner</div>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              &quot;Incredible service! They recovered my stolen USDT and helped
              me understand what went wrong. Now I&apos;m much more
              security-conscious.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">L</span>
              </div>
              <div>
                <div className="text-white font-semibold">Lisa Thompson</div>
                <div className="text-gray-400 text-sm">Crypto Investor</div>
              </div>
            </div>
          </div>

          {/* Testimonial 4 */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              &quot;The team worked tirelessly to recover my assets. Their
              expertise in blockchain forensics is unmatched. Highly
              recommend!&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">R</span>
              </div>
              <div>
                <div className="text-white font-semibold">Robert Kim</div>
                <div className="text-gray-400 text-sm">Tech Entrepreneur</div>
              </div>
            </div>
          </div>

          {/* Testimonial 5 */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              &quot;Fast, professional, and successful. They recovered my lost
              Bitcoin when I thought all hope was gone. Thank you, Lenix
              team!&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">A</span>
              </div>
              <div>
                <div className="text-white font-semibold">Alex Morgan</div>
                <div className="text-gray-400 text-sm">Financial Analyst</div>
              </div>
            </div>
          </div>

          {/* Testimonial 6 */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              &quot;Outstanding service from start to finish. They kept me
              informed every step of the way and delivered results beyond my
              expectations.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">M</span>
              </div>
              <div>
                <div className="text-white font-semibold">Maria Garcia</div>
                <div className="text-gray-400 text-sm">Real Estate Agent</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-4 rounded-lg transition-colors flex items-center gap-2 mx-auto text-lg">
            Join Our Success Stories
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
