import type { Metadata } from "next";
import Header from "../components/header";
import Footer from "../components/footer";
import { LawEnforcementContent } from "./components/law-enforcement-content";

export const metadata: Metadata = {
  title: "Blockchain Intelligence for Law Enforcement | Lenix Protocol",
  description:
    "Solve more crime with the industry's highest quality blockchain intelligence and investigation tools. Track illicit crypto activity, recover assets, and build cases with confidence.",
  keywords: [
    "Law Enforcement",
    "Blockchain Intelligence",
    "Crypto Investigations",
    "Criminal Investigations",
    "Asset Recovery",
    "Blockchain Forensics",
  ],
};

export default function LawEnforcementPage() {
  return (
    <>
      <Header />
      <LawEnforcementContent />
      <Footer />
    </>
  );
}
