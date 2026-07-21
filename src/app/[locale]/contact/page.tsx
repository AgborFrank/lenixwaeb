import type { Metadata } from "next";
import ContactHero from "./components/contact-hero";
import ContactMain from "./components/contact-main";
import FAQ from "./components/contact-faq";
import Header from "../components/header";
import Footer from "../components/footer";

export const metadata: Metadata = {
  title: "Contact Our Forensic & Recovery Experts | Lenix Protocol",
  description:
    "Get in touch with Lenix Protocol's elite task force for professional cryptocurrency investigation, asset recovery, and security inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <ContactHero />
      <ContactMain />
      <FAQ />
      <Footer />
    </>
  );
}
