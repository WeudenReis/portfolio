import type { Metadata } from "next";
import JogoCobra from "@/components/JogoCobra";
import MarcaTexto from "@/components/MarcaTexto";
import Riscado from "@/components/Riscado";

export const metadata: Metadata = {
  title: "Jogo da cobrinha",
  description: "Cobrinha das letras: coma as letras na ordem certa para formar as palavras do meu dia a dia.",
};

export default function PaginaJogo() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="font-mao text-lg text-laranja-texto">a mesma do meu GitHub, só que agora você joga</p>
      <h1 className="mt-1 font-mao text-5xl leading-tight sm:text-7xl">
        <MarcaTexto>Cobrinha das letras</MarcaTexto>
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed">
        No meu perfil ela come o gráfico de contribuições. Aqui ela come <Riscado>quadradinhos verdes</Riscado> letras, e você
        guia: forme as palavras do meu dia a dia, uma letra de cada vez.
      </p>
      <div className="mt-10">
        <JogoCobra />
      </div>
    </div>
  );
}
