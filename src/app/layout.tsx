import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "مطعم سوريا - أطيب الأطباق السورية التقليدية",
  description: "مطعم سوريا يقدم أطيب الأطباق السورية التقليدية مع تجربة طعام أصيلة",
  keywords: ["مطعم سوريا", "طعام سوري", "مطعم", "أكل سوري", "مشاوي", "منسف"],
  authors: [{ name: "مطعم سوريا" }],
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
  openGraph: {
    title: "مطعم سوريا - أطيب الأطباق السورية التقليدية",
    description: "مطعم سوريا يقدم أطيب الأطباق السورية التقليدية مع تجربة طعام أصيلة",
    url: "https://foodsyria.app",
    siteName: "مطعم سوريا",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "مطعم سوريا - أطيب الأطباق السورية التقليدية",
    description: "مطعم سوريا يقدم أطيب الأطباق السورية التقليدية مع تجربة طعام أصيلة",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
