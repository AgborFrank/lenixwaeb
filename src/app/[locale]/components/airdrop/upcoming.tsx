"use client";

import { Calendar, Lock, Star } from "lucide-react";

export default function AirdropUpcoming() {
    const events = [
        {
            title: "LNX Token Drop",
            date: "Coming Soon",
            description: "Governance token distribution for active liquidity providers.",
            reward: "LNX Tokens",
            icon: Lock,
            status: "Locked"
        },
        {
            title: "NFT Whitelist",
            date: "Q4 2026",
            description: "Exclusive access to the Lenix Genesis NFT collection.",
            reward: "Whitelist Spot",
            icon: Star,
            status: "Upcoming"
        },
        {
            title: "Partner Protocol",
            date: "TBA",
            description: "Surprise drop from our strategic DeFi partners.",
            reward: "Mystery Box",
            icon: Lock,
            status: "Locked"
        }
    ];

    return (
        <section className="py-24 px-4 bg-black border-t border-white/5">
            <div className="max-w-screen-xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Upcoming <span className="text-yellow-400">Events</span>
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Stay tuned for future distribution events. Eligibility criteria will be announced shortly.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {events.map((event, i) => (
                        <div key={i} className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors overflow-hidden">
                            {/* Locked Overlay Pattern */}
                            <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #222 25%, #222 75%, #000 75%, #000)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px'}}></div>
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-yellow-400/50 transition-colors">
                                        <event.icon className="w-6 h-6 text-gray-500 group-hover:text-yellow-400 transition-colors" />
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                        {event.status}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gray-200 transition-colors">{event.title}</h3>
                                <p className="text-gray-500 mb-6 flex-grow">{event.description}</p>

                                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="text-sm">
                                        <div className="text-gray-600 font-medium mb-1">Est. Date</div>
                                        <div className="text-white font-mono">{event.date}</div>
                                    </div>
                                    <div className="text-right text-sm">
                                        <div className="text-gray-600 font-medium mb-1">Reward</div>
                                        <div className="text-yellow-400 font-bold">{event.reward}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
