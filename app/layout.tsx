import type { Metadata } from "next";
import { Spectral, Jost, Ubuntu_Mono } from "next/font/google";
import { siteConfig } from "@/lib/config/siteConfig";
import "@/styles/globals.css";

const siteName = siteConfig.name 
const siteTag = siteConfig.tagline

const spectralSerif = Spectral({
  weight: '400', // or ['400', '700'] for multiple weights
  variable: "--font-spectral-serif",
  subsets: ["latin"],
});

const jostSans = Jost({
  variable: "--font-jost-sans",
  subsets: ["latin"],
});

const ubuntuMono = Ubuntu_Mono({
  weight: '400', // or ['400', '700'] for multiple weights
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
      <body
        className={`${jostSans.variable} ${ubuntuMono.variable} ${spectralSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
