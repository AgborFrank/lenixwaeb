"use client";

import { Star, Quote, ArrowRight, UserCheck } from "lucide-react";

const testimonials = [
    {
        name: "Michael Chen",
        role: "Software Engineer",
        loss: "45 BTC",
        quote: "I thought I had lost everything when my hardware wallet was compromised. The Lenix team not only recovered my funds but also helped me secure my new setup.",
        rating: 5
    },
    {
        name: "Sarah Johnson",
        role: "Marketing Director",
        loss: "12 ETH",
        quote: "Lost 12 ETH to a phishing scam. Lenix recovered 11.5 ETH within 3 weeks. Their communication was excellent throughout the process.",
        rating: 5
    },
    {
        name: "David Rodriguez",
        role: "Business Owner",
        loss: "$150k USDT",
        quote: "After losing access to my wallet, I thought recovery was impossible. The team proved me wrong. Professional, efficient, and caring.",
        rating: 5
    }
];

export default function SuccessStories() {
  return (
    <section className="bg-black py-24 px-4 relative border-t border-white/5">
       <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent" />
       
      <div className="max-w-screen-xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Success Stories That
            <span className="text-yellow-400"> Inspire</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Real people, real recoveries. See how we've helped clients reclaim their digital lives.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-8 relative hover:bg-white/10 transition-colors group">
                    <Quote className="absolute top-8 right-8 w-10 h-10 text-white/5 group-hover:text-yellow-400/20 transition-colors" />
                    
                    <div className="flex gap-1 mb-6">
                        {[...Array(t.rating)].map((_, j) => (
                            <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ))}
                    </div>

                    <p className="text-gray-300 leading-relaxed mb-8 min-h-[100px]">"{t.quote}"</p>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 font-bold">
                            {t.name[0]}
                        </div>
                        <div>
                            <div className="text-white font-bold text-sm">{t.name}</div>
                            <div className="text-gray-500 text-xs">{t.role}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
