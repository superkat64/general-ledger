import type { Metadata } from "next";
// Styles Provider
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
// Auth Provider
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Geneal Ledger",
  description: "The Homemade Financial Budgeting App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <StackProvider app={stackClientApp}>
              <StackTheme>
                <Header />
                {children}
              </StackTheme>
            </StackProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
