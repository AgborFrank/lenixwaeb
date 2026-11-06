import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Poppins, Roboto_Mono, Onest } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import { headers } from "next/headers";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./(account)/_providers/theme-provider";
import FloatingTelegramButton from "@/components/floating-telegram-button";
import { basePathFromPathname, withPublicMetadata } from "@/lib/public-metadata";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const headerList = await headers();
  const pathname = headerList.get("x-lenix-pathname") ?? `/${locale}`;

  return withPublicMetadata(locale, basePathFromPathname(pathname), {
    title: "Crypto Asset Recovery & Blockchain Forensics | Lenix Protocol",
    description:
      "Wallet and seed phrase recovery, blockchain forensics, and tracing for lost or stolen cryptocurrency.",
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
        "Wallet and seed phrase recovery, blockchain forensics, and tracing for lost or stolen cryptocurrency.",
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
        "Wallet and seed phrase recovery, blockchain forensics, and tracing for lost or stolen cryptocurrency.",
      images: ["/assets/img/og-image.png"],
    },
  });
}

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

  const enableWallet =
    process.env.NEXT_PUBLIC_ENABLE_WALLET === "true" ||
    process.env.NEXT_PUBLIC_ENABLE_WALLET === "1";

  let page = children;
  if (enableWallet) {
    const { default: AppKitProvider } = await import("@/context");
    page = <AppKitProvider cookies={cookies}>{children}</AppKitProvider>;
  }

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Lenix Protocol",
    url: "https://lenixprotocol.com",
    logo: "https://lenixprotocol.com/assets/img/favicon.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Theilerstrasse 1a",
      postalCode: "6300",
      addressLocality: "Zug",
      addressCountry: "CH",
    },
  };

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <TooltipProvider>
            <ThemeProvider>
              {page}
            </ThemeProvider>
          </TooltipProvider>
          <Toaster />
          <FloatingTelegramButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
