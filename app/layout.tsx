import type { Metadata } from "next";
import { Spectral, Jost, Ubuntu_Mono } from "next/font/google";
import { siteConfig } from "@/lib/config/siteConfig";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import "@/styles/globals.css";

const siteName = siteConfig.name 
const siteTag = siteConfig.tagline

const spectralSerif = Spectral({
  weight: '400',
  variable: "--font-spectral-serif",
  subsets: ["latin"],
});

const jostSans = Jost({
  variable: "--font-jost-sans",
  subsets: ["latin"],
});

const ubuntuMono = Ubuntu_Mono({
  weight: '400',
  variable: "--font-ubuntu-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteName,  
  description: siteTag,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jostSans.variable} ${ubuntuMono.variable} ${spectralSerif.variable} antialiased`}>
        <SiteHeader />
        
        <div className="flex min-h-screen items-center justify-center">
          {/* This main now has solid black background over the hero pattern */}
          <main className="min-h-screen w-full max-w-3xl flex flex-col pt-10 px-8 py-12 bg-black font-serif">
            {children}
          </main>
        </div>
        
        <SiteFooter />
      </body>
    </html>
  );
}