import type { Metadata } from "next";
import { Space_Grotesk, Kantumruy_Pro } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Analytics } from "@vercel/analytics/react";
import { Footer } from "@/components/layout/Footer";


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
  title: "Developer 2050",
  description: "Future Platform For Developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${spaceGrotesk.className} ${kantumruy.variable} antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
