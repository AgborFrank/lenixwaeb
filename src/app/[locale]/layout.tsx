import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Poppins, Roboto_Mono, Onest } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import { headers } from "next/headers";
import AppKitProvider from "@/context";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./(account)/_providers/theme-provider";
import FloatingTelegramButton from "@/components/floating-telegram-button";

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
      path: "../fonts/bitnovatus_regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/bitnovatus_medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/bitnovatus_bold.woff2",
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
      path: "../fonts/bitnovatus_normal.woff2",
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
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Await params directly when relying on Next.js 15+ asynchronous route parameters, 
  // but for Next.js 14 and below, params might be synchronous. We resolve it properly.
  const { locale } = await params;
  const headersList = await headers();
  const cookies = headersList.get("cookie");
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      {/* Cookiebot Consent - afterInteractive for Next.js 16 compatibility */}
      <Script
        id="Cookiebot"
        src="https://consent.cookiebot.com/uc.js"
        data-cbid="8401ae51-ed97-41da-8b28-43d9b5787e1d"
        data-blockingmode="auto"
        strategy="afterInteractive"
      />
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-0R636JVJSQ"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-0R636JVJSQ');
        `}
      </Script>
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
        <NextIntlClientProvider messages={messages}>
          <TooltipProvider>
            <ThemeProvider>
              <AppKitProvider cookies={cookies}>{children}</AppKitProvider>
            </ThemeProvider>
          </TooltipProvider>
          <Toaster />
          <FloatingTelegramButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
