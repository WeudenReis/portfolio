import type { Metadata } from "next";
import ListaProjetos from "@/components/ListaProjetos";
import MarcaTexto from "@/components/MarcaTexto";
import Riscado from "@/components/Riscado";
import Digitando from "@/components/Digitando";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Extensões, automações, sites e sistemas que eu criei na chatPro, na Vortexi e por conta própria.",
};

export default function PaginaProjetos() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="font-mao text-lg text-laranja-texto">caderno de campo</p>
      <h1 className="mt-1 font-mao text-5xl leading-tight sm:text-7xl">
        <MarcaTexto>Projetos</MarcaTexto>
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed sm:text-xl">
        Tudo que eu construí para resolver{" "}
        <Digitando frases={["o atendimento da chatPro", "a operação da Vortexi", "as minhas próprias ideias", "as atividades da faculdade"]} className="font-bold text-laranja-texto" />
      </p>
      <p className="mt-3 max-w-3xl text-cinza">
        Boa parte é <Riscado>pública</Riscado> privada, por ser de empresa ou de cliente. Mesmo assim, cada um tem a sua página contando o
        problema e o que eu fiz.
      </p>
      <div className="mt-10">
        <ListaProjetos />
      </div>
    </div>
  );
}
