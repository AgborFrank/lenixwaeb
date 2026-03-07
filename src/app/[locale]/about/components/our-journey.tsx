import { Calendar, Users, Globe, Zap, Award, Layers, Shield, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";

const JOURNEY_STEPS = [
  {
    id: "step1",
    titleIcon: Calendar,
    photoIcon: Users,
  },
  {
    id: "step2",
    titleIcon: Globe,
    photoIcon: Globe,
  },
  {
    id: "step3",
    titleIcon: Zap,
    photoIcon: Zap,
  },
  {
    id: "step4",
    titleIcon: Layers,
    photoIcon: Layers,
  },
  {
    id: "step5",
    titleIcon: Shield,
    photoIcon: Shield,
  },
  {
    id: "step6",
    titleIcon: Rocket,
    photoIcon: Rocket,
  },
  {
    id: "step7",
    titleIcon: Award,
    photoIcon: Award,
  },
];

export default function OurJourney() {
  const t = useTranslations("About.Journey");
  return (
    <section className="bg-black py-20 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            {t("title1")}
            <span className="text-yellow-400"> {t("title2")}</span>
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Horizontal Timeline Slider */}
        <div className="relative">
          
          {/* Scrollable Container */}
          <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide">
            {JOURNEY_STEPS.map((step, index) => (
              <div key={step.id} className="flex-shrink-0 w-80">
                <div className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-400 rounded-full border-4 border-black flex items-center justify-center z-10">
                    <span className="text-black font-bold text-xs">{index + 1}</span>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-gray-700 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                        <step.titleIcon className="w-5 h-5 text-black" />
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        {t(`${step.id}.title`)}
                      </h3>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {t(`${step.id}.desc`)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-full text-xs">
                        {t(`${step.id}.tag1`)}
                      </span>
                      <span className="bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-full text-xs">
                        {t(`${step.id}.tag2`)}
                      </span>
                    </div>
                  </div>

                 
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
