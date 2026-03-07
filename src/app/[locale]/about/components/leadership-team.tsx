import { Linkedin, Twitter, Mail, Users, Award, Globe } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const TEAM_MEMBERS = [
  {
    id: "sarah",
    name: "Sarah Chen",
    image: "/assets/team/1.webp",
    socials: { linkedin: "#", twitter: "#", email: "#" },
  },
  {
    id: "michael",
    name: "Michael Rodriguez",
    image: "/assets/team/2.webp",
    socials: { linkedin: "#", twitter: "#", email: "#" },
  },
  {
    id: "lisa",
    name: "Lisa Thompson",
    image: "/assets/team/3.webp",
    socials: { linkedin: "#", twitter: "#", email: "#" },
  },
  {
    id: "david",
    name: "David Kim",
    image: "/assets/team/4.webp",
    socials: { linkedin: "#", twitter: "#", email: "#" },
  },
  {
    id: "allen",
    name: "Allen Terry",
    image: "/assets/team/5.webp",
    socials: { linkedin: "#", twitter: "#", email: "#" },
  },
];

export default function LeadershipTeam() {
  const t = useTranslations("About.Leadership");
  return (
    <section className="bg-gradient-to-r from-gray-900 to-black py-20 px-4">
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

        {/* Leadership Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {TEAM_MEMBERS.map((member, idx) => (
            <div
              key={idx}
              className="bg-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group"
            >
              <div className="text-center">
                <div className="w-42 h-42 mx-auto mb-6 rounded-full overflow-hidden border-2 border-transparent group-hover:border-yellow-400/50 transition-colors">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">
                  {member.name}
                </h4>
                <p className="text-yellow-400 font-medium mb-3">
                  {t(`members.${member.id}.role`)}
                </p>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  {t(`members.${member.id}.bio`)}
                </p>
                <div className="flex justify-center gap-3">
                  <a
                    href={member.socials.linkedin}
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-white" />
                  </a>
                  <a
                    href={member.socials.twitter}
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
                  >
                    <Twitter className="w-4 h-4 text-white" />
                  </a>
                  <a
                    href={member.socials.email}
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-white" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Join Us CTA */}
        <div className="text-center mt-16">
          <div className="bg rounded-2xl p-8 border border-gray-700 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              {t("join.title")}
            </h3>
            <p className="text-gray-300 mb-6">
              {t("join.description")}
            </p>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto">
              {t("join.cta")}
              <Users className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
