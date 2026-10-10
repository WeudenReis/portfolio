import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import Rodape from "@/components/Rodape";
import ModoCobra from "@/components/ModoCobra";
import ModalPreview from "@/components/PreviewProjeto";
import { SonsGlobais } from "@/components/Sons";
import RolagemLenta from "@/components/RolagemLenta";
import Mascote from "@/components/Mascote";
import BarraProgresso from "@/components/BarraProgresso";
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
  title: {
    default: "weuden",
    template: "%s · weuden",
  },
  applicationName: "weuden",
  description:
    "Extensões, automações e produtos web que resolvem problema de verdade. Software Engineer na chatPro, em Goiânia, GO.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.variable} ${geistMono.variable} ${virgil.variable} font-sans`}>
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded focus:bg-laranja focus:px-3 focus:py-2 focus:font-bold">
          Pular para o conteúdo
        </a>
        <Navbar />
        <BarraProgresso />
        <main id="conteudo" className="overflow-x-clip">
          {children}
        </main>
        <Rodape />
        <ModoCobra />
        <ModalPreview />
        <SonsGlobais />
        <Mascote />
        <RolagemLenta />
      </body>
    </html>
  );
}
