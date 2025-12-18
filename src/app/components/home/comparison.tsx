export default function Comparison() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-2 md:gap-32 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-5xl lg:text-5xl font-bold text-gray-900 font-onest leading-tight">
              Crypto-to-fiat payments{" "}
              <span className="bg-yellow-300 px-2 py-1 rounded">
                made simple.
              </span>
            </h2>
            <p className="text-md text-gray-600 leading-relaxed font-onest">
              <span className="font-semibold text-gray-900">BitnovatusPay</span>{" "}
              operates just like your favorite banking apps, but we allow you to
              send crypto while ensuring your recipients receive fiat. When you
              need an easy solution for crypto payments, BitnovatusPay is your go-to
              protocol.
            </p>
          </div>

          {/* Right - Comparison Cards */}
          <div className="space-y-4 max-w-[400px] right-0 ">
            {/* Stripe Card */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold">stripe</div>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">Fiat- Fiat payments</div>
              </div>
            </div>

            {/* Wise Card */}
            <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-2xl p-6 text-white flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold">wise</div>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">Fiat- Fiat Transfers</div>
              </div>
            </div>

            {/* BitnovatusPay Card - Highlighted */}
            <div className="bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-2xl p-6 text-black flex items-center justify-between border-4 border-yellow-500 shadow-lg transform scale-105">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold flex items-center">
                  <span className="mr-2">⚡</span>
                  BitnovatusPay
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">
                  Crypto-Fiat Transfers
                </div>
              </div>
            </div>

            {/* Coinbase Card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold">coinbase</div>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">
                  Crypto-Crypto Transfers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
