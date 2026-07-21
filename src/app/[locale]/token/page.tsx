import type { Metadata } from "next";
import Header from "../components/header";
import Footer from "../components/footer";
import TokenDetails from "../components/home/token-details";
import TokenSaleSection from "../components/home/token-sale-section";

export const metadata: Metadata = {
  title: "LNX Token | Lenix Protocol",
  description:
    "Purchase LNX and view contract details for the Lenix Protocol token on Polygon.",
};

export default function TokenPage() {
  return (
    <>
      <Header />
      <TokenDetails />
      <TokenSaleSection />
      <Footer />
    </>
  );
}
