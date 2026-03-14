"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ShieldCheck,
  Search,
  Lock,
  ArrowRight,
  Database,
  Mail,
  Phone,
  Key,
  Shield,
  Briefcase,
  Monitor,
  LayoutGrid,
  CreditCard,
  Hash,
  FileSearch
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function CryptoAssetIdentificationContent() {
  const t = useTranslations("CryptoAssetId");

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/img/bg.jpg')",
              opacity: 0.15,
            }}
          />
        </div>

        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl opacity-50 z-0 transform-gpu" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl opacity-30 transform-gpu" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex">
          <div className="md:w-[70%] w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-6 transition-all hover:bg-yellow-400/20">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-xs font-medium text-yellow-400 uppercase tracking-wider">
                {t("Hero.badge")}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-zinc-400 mb-4 md:leading-[1.1] leading-[1.1]">
              {t("Hero.title1")}
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-yellow-400 mb-8">
              {t("Hero.subtitle1")}
            </h2>
            <div className="space-y-6 max-w-3xl">
              <p className="text-xl text-zinc-300 leading-relaxed font-medium">
                {t("Hero.desc1")}
              </p>
              <p className="text-lg text-zinc-400 leading-relaxed italic">
                {t("Hero.desc2")}
              </p>
            </div>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link href="/contact"
                  className="bg-yellow-400 flex hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-full shadow-lg shadow-yellow-400/20 items-center justify-center transition-transform hover:scale-105"
                >
                  {t("Hero.btn_consultation")} <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section className="py-20 bg-zinc-900/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 max-w-2xl mx-auto">
              {t("Coverage.title")}
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
               {t("Coverage.desc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <ServiceCard
              icon={<ShieldCheck className="w-6 h-6 text-yellow-400" />}
              title={t("Coverage.card1_title")}
              description={t("Coverage.card1_desc")}
            />
            <ServiceCard
              icon={<Search className="w-6 h-6 text-blue-400" />}
              title={t("Coverage.card2_title")}
              description={t("Coverage.card2_desc")}
            />
            <ServiceCard
              icon={<Briefcase className="w-6 h-6 text-emerald-400" />}
              title={t("Coverage.card3_title")}
              description={t("Coverage.card3_desc")}
            />
            <ServiceCard
              icon={<Database className="w-6 h-6 text-purple-400" />}
              title={t("Coverage.card4_title")}
              description={t("Coverage.card4_desc")}
            />
            <ServiceCard
              icon={<Lock className="w-6 h-6 text-pink-400" />}
              title={t("Coverage.card5_title")}
              description={t("Coverage.card5_desc")}
            />
          </div>
          
          <div className="text-center text-zinc-300 italic max-w-3xl mx-auto p-6 bg-white/5 border border-white/10 rounded-2xl">
             {t("Coverage.footer")}
          </div>
        </div>
      </section>

      {/* Methods Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto">
              {t("Methods.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <UseCaseItem
              icon={<Hash className="w-6 h-6 text-yellow-400" />}
              title={t("Methods.card1_title")}
              description={t("Methods.card1_desc")}
            />
            <UseCaseItem
              icon={<Monitor className="w-6 h-6 text-blue-400" />}
              title={t("Methods.card2_title")}
              description={t("Methods.card2_desc")}
            />
            <UseCaseItem
              icon={<LayoutGrid className="w-6 h-6 text-emerald-400" />}
              title={t("Methods.card3_title")}
              description={t("Methods.card3_desc")}
            />
            <UseCaseItem
              icon={<CreditCard className="w-6 h-6 text-purple-400" />}
              title={t("Methods.card4_title")}
              description={t("Methods.card4_desc")}
            />
            <UseCaseItem
              icon={<Key className="w-6 h-6 text-pink-400" />}
              title={t("Methods.card5_title")}
              description={t("Methods.card5_desc")}
            />
          </div>

          <div className="text-center text-zinc-300 max-w-3xl mx-auto p-6 bg-yellow-400/5 text-yellow-400/90 border border-yellow-400/10 rounded-2xl">
             {t("Methods.footer")}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-zinc-900/40 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t("WhyChooseUs.title")}
              </h2>
              <p className="text-zinc-400 mb-10 text-lg leading-relaxed">
                {t("WhyChooseUs.desc")}
              </p>

              <div className="space-y-4">
                <UseCaseItem
                  icon={<ShieldCheck className="w-6 h-6 text-yellow-400" />}
                  title={t("WhyChooseUs.point1_title")}
                  description={t("WhyChooseUs.point1_desc")}
                />
                <UseCaseItem
                  icon={<Shield className="w-6 h-6 text-yellow-400" />}
                  title={t("WhyChooseUs.point2_title")}
                  description={t("WhyChooseUs.point2_desc")}
                />
                <UseCaseItem
                  icon={<Briefcase className="w-6 h-6 text-yellow-400" />}
                  title={t("WhyChooseUs.point3_title")}
                  description={t("WhyChooseUs.point3_desc")}
                />
                <UseCaseItem
                  icon={<FileSearch className="w-6 h-6 text-yellow-400" />}
                  title={t("WhyChooseUs.point4_title")}
                  description={t("WhyChooseUs.point4_desc")}
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/20 to-blue-500/20 rounded-2xl blur-3xl opacity-60 transform-gpu" />
              {/* Empty space reserved for user's custom image */}
              <div className="relative w-full md:h-[700px] h-[500px] rounded-2xl">
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-zinc-900/60 border-t border-white/5 relative">
        {/* Abstract decor */}
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl transform-gpu" />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t("CTA.title")} <span className="text-yellow-400">{t("CTA.title_highlight")}</span>
          </h2>
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
            {t("CTA.desc_part1")} <a href="tel:+447887052128" className="text-white hover:text-yellow-400 font-semibold">+44 7887 052128</a> {t("CTA.desc_part2")}
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="group flex items-center gap-4 bg-black/40 border border-white/10 px-8 py-5 rounded-2xl hover:border-yellow-400/50 transition-all">
              <div className="w-12 h-12 bg-yellow-400/10 rounded-xl flex items-center justify-center group-hover:bg-yellow-400/20 transition-colors">
                <Mail className="text-yellow-400 w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">{t("CTA.email_label")}</p>
                <a href="mailto:recovery@lenixprotocol.com" className="text-white text-lg font-medium hover:text-yellow-400 transition-colors">recovery@lenixprotocol.com</a>
              </div>
            </div>
            
            <div className="group flex items-center gap-4 bg-black/40 border border-white/10 px-8 py-5 rounded-2xl hover:border-yellow-400/50 transition-all">
              <div className="w-12 h-12 bg-yellow-400/10 rounded-xl flex items-center justify-center group-hover:bg-yellow-400/20 transition-colors">
                <Phone className="text-yellow-400 w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">{t("CTA.phone_label")}</p>
                <a href="tel:+447887052128" className="text-white text-lg font-medium hover:text-yellow-400 transition-colors">+44 7887 052128</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-400/30 hover:bg-white/10 transition-all duration-500 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-2xl bg-black/50 flex items-center justify-center border border-white/10 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl group-hover:shadow-yellow-400/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 group-hover:text-yellow-400 transition-colors min-h-[3.5rem] flex items-center">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">{description}</p>
    </div>
  );
}

function UseCaseItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-yellow-400/20 hover:bg-white/[0.07] transition-all duration-300">
      <div className="w-14 h-14 rounded-xl bg-yellow-400/5 flex items-center justify-center shrink-0 border border-yellow-400/10 group-hover:border-yellow-400/30 group-hover:bg-yellow-400/10 transition-all">
        {icon}
      </div>
      <div className="flex flex-col justify-center">
        <h4 className="font-bold text-white text-lg mb-1 group-hover:text-yellow-400 transition-colors">{title}</h4>
        <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
