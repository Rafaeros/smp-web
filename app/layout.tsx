import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@/src/core/contexts/ToastContext";
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
  title: "SMP - Industrial IoT",
  description: "Production Monitoring System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} antialiased
          min-h-screen
          flex flex-col
          overflow-x-hidden
          md:h-screen md:overflow-hidden
        `}
        style={{
          // Desktop: 100vh, overflow hidden; Mobile: min-h-screen, scroll liberado
          height: undefined,
        }}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}