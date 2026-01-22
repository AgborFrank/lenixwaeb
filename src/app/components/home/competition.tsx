import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Competition() {
  return (
    <section className="py-20 px-4 bg-white relative overflow-hidden">
      <div
        className="max-w-7xl rounded-[60px] p-8 mx-auto relative"
        style={{
          backgroundImage: "url('/assets/img/competition.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "30px",
        }}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                Enter Our Competition for a Chance to Win{" "}
                <span className="text-yellow-400">$250K</span>
              </h2>

              <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
                Enter Lenix Protocol $250,000 Giveaway! Ten winners will each
                claim $25,000 in LNX. Boost your odds by sharing and completing
                all tasks for bonus entries. Don&apos;t miss this chance - join
                now!
              </p>
            </div>

            <Link
              href="/giveaway"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300 flex items-center gap-2 group w-fit"
            >
              Enter Competition Now!
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right Visual */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Futuristic Platform */}
            <div className="relative">
              {/* Glowing Base */}
              <div className="w-64 h-32 bg-gradient-to-t from-yellow-500/30 to-transparent rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
