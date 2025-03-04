import type { Metadata } from "next";
import { Geist, Azeret_Mono as Geist_Mono } from 'next/font/google';
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import DashboardWrapper from "./dashboardwrapper";
import React from "react";
import { Analytics } from '@vercel/analytics/next';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stockiqs",
  description: "Sneakers Inventory Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <DashboardWrapper>
            {children}
            <Analytics />
          </DashboardWrapper>
        </ClerkProvider>
      </body>
    </html>
  );
}