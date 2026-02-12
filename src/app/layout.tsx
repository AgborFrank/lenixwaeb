import type { Metadata } from "next";
import { Inter, Poppins, Roboto_Mono, Onest } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { headers } from "next/headers";
import AppKitProvider from "@/context";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./(account)/_providers/theme-provider";

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

// Custom Bitnovatus Fonts - Using your properly named font files
const BitnovatusDisplay = localFont({
  src: [
    {
      path: "./fonts/bitnovatus_regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/bitnovatus_medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/bitnovatus_bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-bitnovatus-display",
  display: "swap",
});

const BitnovatusSans = localFont({
  src: [
    {
      path: "./fonts/bitnovatus_normal.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-bitnovatus-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crypto Asset Recovery & Blockchain Forensics | Lenix Protocol",
  description:
    "Recover lost or stolen cryptocurrency with Lenix Protocol's certified blockchain forensics. We trace assets, identify scammers, and provide court-ready evidence.",
  keywords: [
    "Crypto Recovery",
    "Blockchain Forensics",
    "Stolen Bitcoin Recovery",
    "Asset Tracing",
    "Security Protocol",
    "Find Crypto Scammer",
    "Wallet Password Recovery",
  ],
  openGraph: {
    title: "Crypto Asset Recovery & Blockchain Forensics | Lenix Protocol",
    description:
      "Professional cryptocurrency investigation and asset recovery services. Trace stolen funds and secure your digital future.",
    url: "https://lenixprotocol.com",
    siteName: "Lenix Protocol",
    images: [
      {
        url: "/assets/img/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lenix Protocol - Blockchain Forensics & Recovery",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto Asset Recovery & Blockchain Forensics | Lenix Protocol",
    description:
      "Recover lost or stolen cryptocurrency with Lenix Protocol's certified blockchain forensics.",
    images: ["/assets/img/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const cookies = headersList.get("cookie");
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`
          ${onest.variable} 
          ${inter.variable} 
          ${poppins.variable} 
          ${robotoMono.variable} 
          ${BitnovatusDisplay.variable} 
          ${BitnovatusSans.variable} 
          antialiased overflow-x-hidden
        `}
      >
        <TooltipProvider>
          <ThemeProvider>
            <AppKitProvider cookies={cookies}>{children}</AppKitProvider>
          </ThemeProvider>
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
