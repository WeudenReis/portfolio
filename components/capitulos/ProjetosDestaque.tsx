"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, LockSimple } from "@phosphor-icons/react/dist/ssr";
import { categorias, projetos } from "@/lib/dados";
import MarcaTexto from "../MarcaTexto";
import { BotaoPreview } from "../PreviewProjeto";
import { som } from "@/lib/sons";

const destaque = projetos.filter((p) => p.emDestaque);

// o índice fica fora do componente para as duas metades do rasgo mostrarem o mesmo cartão
let indice = 0;
const ouvintes = new Set<() => void>();
const mudar = (passo: number) => {
  indice = (indice + passo + destaque.length) % destaque.length;
  som.embaralhar();
  ouvintes.forEach((f) => f());
};
const assinar = (f: () => void) => (ouvintes.add(f), () => ouvintes.delete(f));

export default function ProjetosDestaque() {
  const atual = useSyncExternalStore(assinar, () => indice, () => 0);
  const p = destaque[atual];
  const cat = categorias.find((c) => c.id === p.categoria)!;

  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col justify-center px-4 pr-10 sm:px-8 sm:pr-14">
      <h2 className="mb-6 font-mao text-4xl sm:mb-10 sm:text-5xl">
        <MarcaTexto cor="branco">Projetos em destaque</MarcaTexto>
      </h2>

      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
        {/* pilha de cartões */}
        <div className="relative mx-auto aspect-[4/3] w-full max-w-md">
          {destaque.map((d, k) => {
            const pos = (k - atual + destaque.length) % destaque.length;
            const estilos = [
              "z-30 rotate-0 translate-x-0 translate-y-0 opacity-100",
              "z-20 rotate-3 translate-x-3 translate-y-3 opacity-100",
              "z-10 -rotate-3 translate-x-5 translate-y-5 opacity-100",
            ];
            return (
              <div
                key={d.slug}
                className={`absolute inset-0 flex flex-col justify-between rounded-xl border-[3px] border-tinta bg-white p-5 shadow-brutal transition-all duration-500 sm:p-7 ${
                  estilos[pos] ?? "z-0 translate-x-5 translate-y-5 opacity-0"
                }`}
                aria-hidden={pos !== 0}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="etiqueta bg-laranja-claro">{categorias.find((c) => c.id === d.categoria)!.nome}</span>
                  <span className="font-mao text-lg text-cinza">{d.quando}</span>
                </div>
                <p className="font-mao text-3xl leading-tight sm:text-4xl">{d.nome}</p>
                <p className="text-sm text-cinza sm:text-base">{d.resumo}</p>
              </div>
            );
          })}
        </div>

        {/* detalhes do cartão de cima */}
        <div className="rounded-xl border-[3px] border-tinta bg-laranja-claro p-5 shadow-brutal sm:p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-laranja-texto">{cat.descricao}</p>
          <ul className="mt-3 hidden space-y-2 sm:block">
            {p.destaques.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="mt-2 h-2 w-2 shrink-0 rotate-45 border-2 border-tinta bg-laranja" />
                {d}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <span key={s} className="etiqueta">
                {s}
              </span>
            ))}
            {p.privado && (
              <span className="etiqueta text-cinza">
                <LockSimple className="h-3 w-3" weight="bold" /> privado
              </span>
            )}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button onClick={() => mudar(-1)} className="botao h-10 w-10 justify-center p-0" aria-label="Projeto anterior">
              <ArrowLeft className="h-4 w-4" weight="bold" />
            </button>
            <button onClick={() => mudar(1)} className="botao h-10 w-10 justify-center p-0" aria-label="Próximo projeto">
              <ArrowRight className="h-4 w-4" weight="bold" />
            </button>
            <span className="font-mao text-lg" aria-live="polite">
              {String(atual + 1).padStart(2, "0")} / {String(destaque.length).padStart(2, "0")}
            </span>
            <BotaoPreview slug={p.slug} className="botao ml-auto px-3 py-1.5 text-sm" />
            <Link href={`/projetos/${p.slug}`} className="botao-tinta px-3 py-1.5 text-sm">
              Ver projeto
            </Link>
          </div>
        </div>
      </div>

      <Link href="/projetos" className="relative z-40 mt-10 self-start font-bold underline decoration-2 underline-offset-4 hover:text-white">
        Ver todos os {projetos.length} projetos
      </Link>
    </div>
  );
}
