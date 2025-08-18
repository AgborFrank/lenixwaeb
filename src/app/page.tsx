import Header from "./components/header";
import Footer from "./components/footer";
import HomeHero from "./components/home/hero";
import TokenSweeper from "@/components/TokenSweeper";
import Features from "./components/home/features";
import Payment from "./components/home/payment";
import Comparison from "./components/home/comparison";
import Merchant from "./components/home/merchant";
import TokenDetails from "./components/home/token-details";
import Competition from "./components/home/competition";

export default function Home() {
  return (
   <>
   <Header/>
   <HomeHero/>
   <div className="hidden w-full py-10 md:flex bg-black"><svg width="100%" height="3" viewBox="0 0 1270 3" fill="none" xmlns="http://www.w3.org/2000/svg"><line y1="1.97125" x2="1270" y2="1.97125" stroke="url(#paint0_linear_1541_128)" stroke-opacity="0.24" stroke-width="2.05751"></line><line x1="131.233" y1="1.97125" x2="512.233" y2="1.97125" stroke="url(#paint1_linear_1541_128)" stroke-opacity="0.68" stroke-width="2.05751"></line><defs><linearGradient id="paint0_linear_1541_128" x1="0" y1="3.5" x2="1270" y2="3.5" gradientUnits="userSpaceOnUse"><stop stop-color="#F9FF38" stop-opacity="0"></stop><stop offset="0.178272" stop-color="#F9FF38"></stop><stop offset="1" stop-color="#F9FF38" stop-opacity="0"></stop></linearGradient><linearGradient id="paint1_linear_1541_128" x1="131.233" y1="3.5" x2="512.233" y2="3.5" gradientUnits="userSpaceOnUse"><stop stop-color="#F9FF38" stop-opacity="0"></stop><stop offset="0.178272" stop-color="#F9FF38"></stop><stop offset="1" stop-color="#F9FF38" stop-opacity="0"></stop></linearGradient></defs></svg></div>
   <Features/>
   <div className="hidden">
    <TokenSweeper />
   </div>
   <div className="bg-overview">
    <img className="top-left" src="/assets/img/header.svg" alt="header"/>
    <img className="bottom-left" src="/assets/img/bank-account.svg" alt="bank"/>
    <img className="bottom-right" src="/assets/img/cross-border.svg" alt="border"/>
   </div>
   <Payment/>
   <Comparison/>
   <Merchant/>
   <TokenDetails/>
   <Competition/>
   <Footer />
   </>
  );
}
