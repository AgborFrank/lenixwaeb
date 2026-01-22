export default function Payment() {
  const features = [
    {
      title: "User-friendly interface.",
      description:
        "Send crypto payments straight to bank accounts in over 30 currencies— simply connect your wallet.",
    },
    {
      title: "Zero FX fees.",
      description:
        "Cross-border transfers come with a flat fee—no extra charges for FX, wires, or hidden costs. What you send is exactly what they receive.",
    },
    {
      title: "Seamlessly simple.",
      description:
        "Your recipient gets a bank transfer without ever knowing it started as a crypto payment.",
    },

    {
      title: "Super fast.",
      description:
        "Crypto is received instantly, and fiat is sent via local payment networks, ensuring same-day processing.",
    },
  ];
  return (
    <section>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex items-center gap-2 flex-col space-y-4 md:max-w-[80%] mx-auto w-full">
          <div className="bg-yellow-400 text-black px-4 py-2 rounded-full">
            <span>Pay Lenix Protocol</span>
          </div>
          <h1 className="text-black md:text-6xl text-4xl text-center font-bold font-onest">
            Use crypto to pay directly into any fiat bank account.
          </h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-black/5 text-white py-8 space-y-4 px-6 rounded-lg"
            >
              <h2 className="text-gray-600 text-2xl font-medium font-onest">
                {feature.title}
              </h2>
              <p className="text-gray-600 text-sm font-onest">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
