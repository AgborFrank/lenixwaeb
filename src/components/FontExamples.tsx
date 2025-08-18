import { textStyles, fontClasses, typography } from "@/lib/fonts";

export default function FontExamples() {
  return (
    <div className="bg-black text-white p-8 space-y-12">
      {/* Primary Font - Onest */}
      <section className="space-y-6">
        <h2 className={`${textStyles.sectionTitle} text-yellow-400`}>
          Onest Font - Primary Font
        </h2>
        <div className="space-y-4">
          <h1 className={`${typography.display1} text-white`}>
            Display 1 - Main Hero Text
          </h1>
          <h2 className={`${typography.display2} text-white`}>
            Display 2 - Large Headings
          </h2>
          <h3 className={`${typography.display3} text-white`}>
            Display 3 - Medium Headings
          </h3>
          <p className={`${fontClasses.primary} text-lg text-gray-300`}>
            This is the Onest font used as the primary font for headings and
            large text elements throughout the application.
          </p>
        </div>
      </section>

      {/* Sans Fonts */}
      <section className="space-y-6">
        <h2 className={`${textStyles.sectionTitle} text-yellow-400`}>
          Onest Sans Font
        </h2>
        <div className="space-y-4">
          <p className={`${typography.bodyLarge} text-white`}>
            Body Large - This is the Onest font used for body text and UI
            elements.
          </p>
          <p className={`${typography.body} text-gray-300`}>
            Body - This is the standard body text size with relaxed line height
            for better readability.
          </p>
          <p className={`${typography.bodySmall} text-gray-400`}>
            Body Small - Smaller text for captions and secondary information.
          </p>
          <button
            className={`${textStyles.button} bg-yellow-400 text-black px-6 py-3 rounded-lg`}
          >
            Button Text
          </button>
        </div>
      </section>

      {/* Alternative Fonts */}
      <section className="space-y-6">
        <h2 className={`${textStyles.sectionTitle} text-yellow-400`}>
          Alternative Fonts
        </h2>
        <div className="space-y-4">
          <h3
            className={`${fontClasses.lenixDisplay} text-xl font-bold text-white`}
          >
            Lenix Display Font - Alternative Display
          </h3>
          <p className={`${fontClasses.lenixDisplay} text-gray-300`}>
            Lenix Display can be used as an alternative to Onest for variety.
          </p>

          <h3 className={`${fontClasses.poppins} text-xl font-bold text-white`}>
            Poppins Font - Alternative Display
          </h3>
          <p className={`${fontClasses.poppins} text-gray-300`}>
            Poppins can be used as an alternative to Onest fonts for variety.
          </p>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h4
              className={`${fontClasses.mono} text-lg font-bold text-yellow-400 mb-2`}
            >
              Roboto Mono - Code & Technical
            </h4>
            <code className={`${typography.code} text-green-400 block`}>
              const lenixPay = "crypto-to-fiat";
            </code>
            <code className={`${typography.code} text-blue-400 block`}>
              function processPayment() {"{"} ... {"}"}
            </code>
          </div>
        </div>
      </section>

      {/* Typography Scale */}
      <section className="space-y-6">
        <h2 className={`${textStyles.sectionTitle} text-yellow-400`}>
          Typography Scale
        </h2>
        <div className="space-y-4">
          <h1 className={`${typography.h1} text-white`}>Heading 1</h1>
          <h2 className={`${typography.h2} text-white`}>Heading 2</h2>
          <h3 className={`${typography.h3} text-white`}>Heading 3</h3>
          <h4 className={`${typography.h4} text-white`}>Heading 4</h4>
          <h5 className={`${typography.h5} text-white`}>Heading 5</h5>
          <h6 className={`${typography.h6} text-white`}>Heading 6</h6>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="space-y-6">
        <h2 className={`${textStyles.sectionTitle} text-yellow-400`}>
          Usage Examples
        </h2>
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h1 className={`${textStyles.hero} text-white mb-4`}>
              LenixPay Platform
            </h1>
            <p className={`${textStyles.heroSubtitle} text-gray-300`}>
              Bridging crypto with local payment networks globally
            </p>
          </div>

          {/* Content Section */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className={`${textStyles.contentTitle} text-white mb-4`}>
              How It Works
            </h2>
            <p className={`${textStyles.body} text-gray-300 mb-4`}>
              LenixPay empowers crypto holders and businesses to facilitate
              crypto-to-fiat transactions worldwide.
            </p>
            <button
              className={`${textStyles.button} bg-yellow-400 text-black px-6 py-3 rounded-lg`}
            >
              Get Started
            </button>
          </div>

          {/* UI Elements */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className={`${textStyles.contentSubtitle} text-white mb-4`}>
              UI Elements
            </h3>
            <div className="space-y-3">
              <label className={`${textStyles.label} text-gray-300 block`}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-onest"
              />
              <p className={`${textStyles.caption} text-gray-400`}>
                We'll never share your email with anyone else.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
