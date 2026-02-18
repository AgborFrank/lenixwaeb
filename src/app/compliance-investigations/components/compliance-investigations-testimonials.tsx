import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Lenix Protocol has been our trusted partner since 2015, helping strengthen our AML program and create a new standard for compliance in the crypto industry. We value their emphasis on data precision, as well as their commitment to building a more transparent and safer crypto economy.",
    author: "Coinbase",
    role: null,
    company: null,
  },
  {
    quote:
      "Given that Lenix Protocol is recognized as the gold standard in crypto-related regulatory compliance, our partnership enables us to meet rigorous AML compliance requirements for cryptoassets and be confident that we will maintain a culture of cutting-edge compliance from both a technology and regulatory perspective.",
    author: "Anastasia Cavallini",
    role: "Compliance Leader",
    company: null,
  },
  {
    quote:
      "Lenix Protocol is an industry leader in the compliance space. The support, service, and tools of Lenix Protocol and their team are best-in-class. Their blockchain analytics allow our compliance department to use comprehensive rulesets for managing and monitoring our data, giving us the ability to assess risk in a relevant and material way.",
    author: "Kyle Pickner",
    role: "Director of Trust Operations",
    company: null,
  },
  {
    quote:
      "Lenix Protocol's asset-agnostic scoring capabilities, configurable risk rules, as well as the extensive selection of cryptocurrencies supported are crucial for Revolut's compliance operations and broadened cryptocurrency offering.",
    author: "Ed Cooper",
    role: "Head of Crypto",
    company: "Revolut",
  },
] as const;

export default function ComplianceInvestigationsTestimonials() {
  return (
    <section className="py-20 bg-zinc-900/30 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Hear from our customers
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Trusted by leading exchanges and institutions worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map(({ quote, author, role, company }) => (
            <div
              key={author}
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-400/30 hover:bg-white/10 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-yellow-400/60 mb-4" />
              <blockquote className="text-zinc-400 text-sm leading-relaxed mb-6">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <footer>
                <cite className="not-italic text-white font-bold">
                  {author}
                </cite>
                {(role || company) && (
                  <p className="text-zinc-500 text-sm mt-0.5">
                    {[role, company].filter(Boolean).join(", ")}
                  </p>
                )}
              </footer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
