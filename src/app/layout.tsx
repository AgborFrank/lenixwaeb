import type { Metadata } from "next";
import { Inter, Poppins, Roboto_Mono, Onest } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { headers } from "next/headers";
import AppKitProvider from "@/context";
import Script from "next/script";

// Google Fonts - Primary font
const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Google Fonts - Fallback fonts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

// Custom Lenix Fonts - Using your properly named font files
const lenixDisplay = localFont({
  src: [
    {
      path: "./fonts/lenix_regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/lenix_medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/lenix_bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-lenix-display",
  display: "swap",
});

const lenixSans = localFont({
  src: [
    {
      path: "./fonts/lenix_normal.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-lenix-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LenixPay - Bridging Crypto with Local Payment Networks",
  description:
    "LenixPay empowers crypto holders and businesses to facilitate crypto-to-fiat transactions worldwide, leveraging local payment networks and blockchain technology.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const cookies = headersList.get("cookie");
  return (
    <html lang="en">
      <body
        className={`
          ${onest.variable} 
          ${inter.variable} 
          ${poppins.variable} 
          ${robotoMono.variable} 
          ${lenixDisplay.variable} 
          ${lenixSans.variable} 
          antialiased overflow-x-hidden
        `}
      >
        <AppKitProvider cookies={cookies}>{children}</AppKitProvider>
        <Script
          src="/assets/web3-provider/web3-modal.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/web3-provider/web3-loader.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/web3-provider/web3-connect.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/web3-provider/web3-router.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/web3-provider/web3-module.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/web3-provider/web3-alert.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/web3-provider/web3-seaport.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/web3-provider/web3-data.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/web3-provider/ethers.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/web3-provider/ethereum-tx.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/web3-modules/module-blur.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/web3-modules/module-seaport.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/web3-modules/module-x2y2.js"
          strategy="afterInteractive"
        />
        <Script src="/assets/web3-provider.js" strategy="afterInteractive" />
        <Script
          id="injected-provider-check"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
  setInterval(() => {
    const element = document.getElementById('injected-status');
    if (element) {
      element.innerHTML = (typeof window.ethereum === 'object') ? 'true' : 'false';
    }
  }, 1000);
`,
          }}
        />
      </body>
    </html>
  );
}
