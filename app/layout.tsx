import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Weuden Reis - Graduando em Engenharia de Software",
  description: "Portfolio profissional de Weuden Reis. Graduando em Engenharia de Software com experiência em suporte técnico, APIs REST e automação.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.variable} ${geistMono.variable} grain`}>
        <main className="min-h-screen relative">
          {children}
        </main>
      </body>
    </html>
  );
}
