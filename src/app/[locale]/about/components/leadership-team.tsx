"use client";

import { Linkedin, Twitter, Mail } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { HomeSectionHeader } from "@/app/[locale]/components/home/home-section-header";
import { home } from "@/lib/home-styles";

const TEAM_MEMBERS = [
  { id: "sarah", name: "Sarah Chen", image: "/assets/team/1.webp" },
  { id: "michael", name: "Michael Rodriguez", image: "/assets/team/2.webp" },
  { id: "lisa", name: "Lisa Thompson", image: "/assets/team/3.webp" },
  { id: "david", name: "David Kim", image: "/assets/team/4.webp" },
  { id: "allen", name: "Allen Terry", image: "/assets/team/5.webp" },
] as const;

export default function LeadershipTeam() {
  const t = useTranslations("About.Leadership");

  return (
    <section className={`${home.section} ${home.sectionMuted}`}>
      <div className={home.container}>
        <HomeSectionHeader
          align="center"
          title={`${t("title1")}${t("title2")}`}
          description={t("subtitle")}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {TEAM_MEMBERS.map((member) => (
            <article key={member.id} className={`${home.card} ${home.cardBody} text-center`}>
              <div className="relative w-28 h-28 mx-auto mb-5 rounded-full overflow-hidden bg-neutral-800">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
              <h4 className="text-base font-semibold text-white mb-1">{member.name}</h4>
              <p className="text-sm text-yellow-400 mb-3">{t(`members.${member.id}.role`)}</p>
              <p className="text-sm text-neutral-400 leading-relaxed mb-5">
                {t(`members.${member.id}.bio`)}
              </p>
              <div className="flex justify-center gap-2">
                {[
                  { Icon: Linkedin, label: "LinkedIn" },
                  { Icon: Twitter, label: "Twitter" },
                  { Icon: Mail, label: "Email" },
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={`${member.name} on ${label}`}
                    className="flex h-9 w-9 items-center justify-center rounded-md bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className={`${home.card} ${home.cardBody} max-w-2xl mx-auto text-center`}>
          <h3 className="text-lg font-semibold text-white mb-2">{t("join.title")}</h3>
          <p className={`${home.lead} mb-6`}>{t("join.description")}</p>
          <button type="button" className={home.btnPrimary}>
            {t("join.cta")}
          </button>
        </div>
      </div>
    </section>
  );
}
