import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LenisProvider } from "@/components/LenisProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VEO | The Future of Performance Cycling",
  description: "Experience the pinnacle of engineering with the VEO S-1. A cinematic product reveal and interactive showcase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
