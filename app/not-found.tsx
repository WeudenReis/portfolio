import Link from "next/link";
import MarcaTexto from "@/components/MarcaTexto";
import { IconeCobra } from "@/components/Icones";

export default function NaoEncontrada() {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-3xl flex-col items-start justify-center px-4 py-16 sm:px-6">
      <p className="font-mao text-8xl text-laranja sm:text-9xl">404</p>
      <h1 className="mt-2 font-mao text-4xl leading-tight sm:text-5xl">
        <MarcaTexto>A cobrinha comeu esta página</MarcaTexto>
      </h1>
      <p className="mt-5 text-lg text-cinza">O endereço não existe, ou ela estava com muita fome. Tenta voltar pelo começo.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="botao-laranja">
          Voltar para o início
        </Link>
        <Link href="/jogo" className="botao">
          <IconeCobra className="h-5 w-5" /> Vingar a página
        </Link>
      </div>
    </div>
  );
}
