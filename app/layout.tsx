import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Virgil, a letra "feita à mão" do Excalidraw (OFL 1.1), a mesma dos desenhos do README
const virgil = localFont({
  src: "../public/fonts/Virgil.woff2",
  variable: "--font-virgil",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Weuden Reis · Software Engineer",
  description:
    "Extensões, automações e produtos web que resolvem problema de verdade. Software Engineer na chatPro, em Goiânia, GO.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.variable} ${geistMono.variable} ${virgil.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
