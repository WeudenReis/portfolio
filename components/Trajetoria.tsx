import Link from "next/link";
import { anoDaLinha, linhaDoTempo } from "@/lib/dados";
import Titulo from "./Titulo";

// Linha do tempo: o ano aparece uma vez só, como carimbo no topo; cada item mostra o mês.
export default function Trajetoria() {
  return (
    <section id="linha-do-tempo" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Titulo>Linha do tempo</Titulo>
      <div className="mx-auto max-w-3xl">
        <span className="mb-6 inline-block -rotate-2 rounded-lg border-[3px] border-tinta bg-laranja px-4 py-1 font-mao text-4xl shadow-brutal-sm">
          {anoDaLinha}
        </span>
        <ol className="relative border-l-[3px] border-tinta pl-8">
          {linhaDoTempo.map(({ mes, oQue, slug }, i) => (
            <li key={mes} className="relative pb-6 last:pb-0">
              <span
                className={`absolute -left-[2.85rem] top-3 h-6 w-6 rounded-full border-[3px] border-tinta ${
                  i === linhaDoTempo.length - 1 ? "bg-laranja" : "bg-white"
                }`}
              />
              <div className="caixa flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:gap-5">
                <span className="w-28 shrink-0 whitespace-nowrap font-mao text-xl text-laranja-texto">{mes}</span>
                <span className="flex-1">{oQue}</span>
                {slug && (
                  <Link href={`/projetos/${slug}`} className="text-sm font-bold underline decoration-2 underline-offset-4 hover:text-laranja-texto">
                    ver projeto
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
