import type { Metadata } from "next";
import SobreMim from "@/components/SobreMim";
import Stacks from "@/components/Stacks";
import Stats from "@/components/Stats";
import Trajetoria from "@/components/Trajetoria";
import MarcaTexto from "@/components/MarcaTexto";
import Digitando from "@/components/Digitando";
import Riscado from "@/components/Riscado";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Quem é o Weuden: Software Engineer na chatPro, sócio da Vortexi, estudante e jogador de The Last of Us.",
};

export default function PaginaSobre() {
  return (
    <>
      <header className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
        <p className="font-mao text-lg text-laranja-texto">quem escreve isso aqui</p>
        <h1 className="mt-1 font-mao text-5xl leading-tight sm:text-7xl">
          <MarcaTexto>Weuden Reis</MarcaTexto>
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-relaxed sm:text-2xl">
          Software Engineer, sócio da Vortexi e <Riscado>gamer casual</Riscado> fã de The Last of Us. Hoje estou mexendo com{" "}
          <Digitando frases={["agentes de IA", "extensões para o chatPro", "o Sistema Vitrine", "este site"]} className="font-bold text-laranja-texto" />
        </p>
      </header>
      <SobreMim />
      <Stacks />
      <Trajetoria />
      <Stats />
    </>
  );
}
