import type { Metadata } from "next";
import Header from "../components/header";
import Footer from "../components/footer";
import { PrivacyPolicyContent } from "./components/privacy-policy-content";

export const metadata: Metadata = {
  title: "Privacy Policy | Lenix Protocol",
  description:
    "Lenix Protocol Privacy Policy. Learn what personal data we collect, how we use it, and how we protect your privacy in accordance with applicable data protection laws.",
  keywords: ["Privacy Policy", "Data Protection", "GDPR", "Lenix Protocol"],
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <PrivacyPolicyContent />
      <Footer />
    </>
  );
}
