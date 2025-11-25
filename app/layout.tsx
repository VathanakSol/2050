import type { Metadata } from "next";
import { Space_Grotesk, Kantumruy_Pro } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";

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
  title: "NakTech Search",
  description: "Search Engine For Developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${kantumruy.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
