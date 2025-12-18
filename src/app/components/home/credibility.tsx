import { ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Credibility() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-4">
            Bitnovatus in{" "}
            <span className="bg-yellow-400 px-2 py-1 rounded-full">detail</span>
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            Audited by CertiK. Built with Confidence.
          </p>
          <p className="text-lg text-gray-600">
            Get in-depth knowledge of our ecosystem by reading our{" "}
            <span className="font-semibold text-black">Whitepaper</span> and
            security audit.
          </p>
        </div>

        {/* Two Column Content */}
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Left Column - CertiK Audit */}
          <div className="text-center">
            <Image
              src="/assets/img/certiklogo.png"
              alt="CertiK"
              className="w-1/2 mx-auto mb-4"
              width={100}
              height={100}
            />
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Bitnovatus has been fully audited by CertiK, the world&apos;s
              leading blockchain security firm.
            </p>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-4 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto">
              <span>View CertiK Audit</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Column - Whitepaper */}
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Read the full report and explore our whitepaper for deeper insight
              into our tech and tokenomics.
            </p>
            <button className="bg-black hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto">
              <span>Whitepaper</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
