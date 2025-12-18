"use client";

import { Copy } from "lucide-react";

export default function TokenDetails() {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText("0x319177997dbf0C0a7DFE0...");
  };
 const tokenAddress = process.env.NEXT_PUBLIC_LNX_TOKEN_ADDRESS;
  return (
    
    <section className="bg-black bg-accept py-16 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-400/15 rounded-full blur-3xl"></div>
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-12">
          <svg
            width="100%"
            height="3"
            viewBox="0 0 1270 3"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hidden md:flex -mx-12"
          >
            <line
              y1="1.97125"
              x2="1270"
              y2="1.97125"
              stroke="url(#paint0_linear_1541_128)"
              stroke-opacity="0.24"
              stroke-width="2.05751"
            ></line>
            <line
              x1="131.233"
              y1="1.97125"
              x2="512.233"
              y2="1.97125"
              stroke="url(#paint1_linear_1541_128)"
              stroke-opacity="0.68"
              stroke-width="2.05751"
            ></line>
            <defs>
              <linearGradient
                id="paint0_linear_1541_128"
                x1="0"
                y1="3.5"
                x2="1270"
                y2="3.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#F9FF38" stop-opacity="0"></stop>
                <stop offset="0.178272" stop-color="#F9FF38"></stop>
                <stop offset="1" stop-color="#F9FF38" stop-opacity="0"></stop>
              </linearGradient>
              <linearGradient
                id="paint1_linear_1541_128"
                x1="131.233"
                y1="3.5"
                x2="512.233"
                y2="3.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#F9FF38" stop-opacity="0"></stop>
                <stop offset="0.178272" stop-color="#F9FF38"></stop>
                <stop offset="1" stop-color="#F9FF38" stop-opacity="0"></stop>
              </linearGradient>
            </defs>
          </svg>
          <h2 className="text-4xl md:text-6xl tracking-tight font-bold text-white mt-8 mb-4">
            <span className="text-yellow-400">Bitnovatus</span> Token
            Details
          </h2>
          <p className="text-gray-300 text-lg">
            Use the contract information below to add the Bitnovatus token
            to your wallet.
          </p>
        </div>

        <div className="bg-black rounded-lg overflow-hidden border-2 border-yellow-400">
          {/* Table Header */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-6 border-b border-gray-700">
            <div className="text-white font-semibold">Contract Address</div>
            <div className="text-white font-semibold">Token Name</div>
            <div className="text-white font-semibold">Token Symbol</div>
            <div className="text-white font-semibold">Token Supply</div>
            <div className="text-white font-semibold">Network</div>
            <div className="text-white font-semibold">Decimals</div>
          </div>

          {/* Table Data */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-6">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 font-mono text-sm line-clamp-1 max-w-[260px] text-ellipsis">
                {tokenAddress}
              </span>
              <button
                onClick={handleCopyAddress}
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
                aria-label="Copy contract address"
              >
                <Copy size={16} />
              </button>
            </div>
            <div className="text-white">Bitnovatus</div>
            <div className="text-white">LNX</div>
            <div className="text-white">1,500,000,000</div>
            <div className="text-white">Polygon</div>
            <div className="text-white">18</div>
          </div>
        </div>
      </div>
      <div className="bg-tokenomics">
        <img
          className="absolute -bottom-1/3 -left-1/3"
          src="/assets/img/noise.png"
          alt="noise"
        />
        <img
          className="absolute -bottom-40 -right-1/3"
          src="/assets/img/noise.png"
          alt="noise"
        />
      </div>
    </section>
  );
}
