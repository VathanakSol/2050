import type { Metadata } from "next";
import { Space_Grotesk, Kantumruy_Pro } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Analytics } from "@vercel/analytics/react";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdSenseScript } from "@/components/ads";


const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const kantumruy = Kantumruy_Pro({
  variable: "--font-kantumruy",
  subsets: ["khmer"],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - Future Platform For Developers`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - Future Platform For Developers`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Future Platform For Developers`,
      },
    ],
  },
  twitter: {
    card: siteConfig.twitter.cardType,
    title: `${siteConfig.name} - Future Platform For Developers`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitter.handle,
  },
  icons: {
    icon: [
      { url: `${siteConfig.url}/favicon.ico` },
      { url: `${siteConfig.url}/icon-16x16.png`, sizes: "16x16", type: "image/png" },
      { url: `${siteConfig.url}/icon-32x32.png`, sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: `${siteConfig.url}/apple-icon.png` },
      { url: `${siteConfig.url}/apple-icon-180x180.png`, sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* AdSense Verification Meta Tag */}
        {process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID && (
          <>
            <meta name="google-adsense-account" content={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID} />
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
              crossOrigin="anonymous"
            />
          </>
        )}
      </head>
      <body
        className={`${spaceGrotesk.variable} ${spaceGrotesk.className} ${kantumruy.variable} antialiased flex flex-col min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <Analytics />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
