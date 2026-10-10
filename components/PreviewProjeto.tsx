"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Eye, X } from "@phosphor-icons/react/dist/ssr";
import { categorias, projetos } from "@/lib/dados";
import Mockup from "./Mockup";
import { som } from "@/lib/sons";

// Preview de projeto em modal. Qualquer botão do site chama abrirPreview(slug);
// um único <ModalPreview/> no layout escuta e abre o <dialog>.

export const abrirPreview = (slug: string) => window.dispatchEvent(new CustomEvent("preview:abrir", { detail: slug }));

export function BotaoPreview({ slug, className = "botao px-3 py-1.5 text-sm" }: { slug: string; className?: string }) {
  return (
    <button type="button" onClick={() => abrirPreview(slug)} className={className}>
      <Eye className="h-4 w-4" weight="bold" /> Preview
    </button>
  );
}

export default function ModalPreview() {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    const abrir = (e: Event) => setSlug((e as CustomEvent<string>).detail);
    window.addEventListener("preview:abrir", abrir);
    return () => window.removeEventListener("preview:abrir", abrir);
  }, []);

  useEffect(() => {
    const d = dialogo.current!;
    if (slug && !d.open) {
      d.showModal();
      som.abrir();
    }
    if (!slug && d.open) d.close();
  }, [slug]);

  const i = projetos.findIndex((p) => p.slug === slug);
  const p = projetos[i];
  const mover = (passo: number) => setSlug(projetos[(i + passo + projetos.length) % projetos.length].slug);

  return (
    <dialog
      ref={dialogo}
      onClose={() => {
        som.fechar(); // o close dispara em todo jeito de fechar: X, clique fora, Esc, link
        setSlug(null);
      }}
      onClick={(e) => e.target === dialogo.current && setSlug(null)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") mover(1);
        if (e.key === "ArrowLeft") mover(-1);
      }}
      className="m-auto w-[min(54rem,calc(100%-2rem))] max-h-[calc(100svh-2rem)] overflow-visible rounded-xl border-[3px] border-tinta bg-white p-0 shadow-brutal-lg backdrop:bg-tinta/60 open:animate-[surgir_0.25s_ease-out]"
      aria-labelledby="preview-titulo"
      data-cobra-hud
    >
      {p && (
        <div className="max-h-[calc(100svh-2rem)] overflow-y-auto p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className={`etiqueta ${p.categoria === "chatPro" ? "bg-laranja" : "bg-laranja-claro"}`}>
                {categorias.find((c) => c.id === p.categoria)!.nome}
              </span>
              <h2 id="preview-titulo" className="mt-2 font-mao text-3xl sm:text-4xl">
                {p.nome}
              </h2>
            </div>
            <button onClick={() => setSlug(null)} className="botao h-10 w-10 shrink-0 justify-center p-0" aria-label="Fechar preview" autoFocus>
              <X className="h-5 w-5" weight="bold" />
            </button>
          </div>

          <Mockup projeto={p} className="mt-5" />

          <p className="mt-5 text-lg">{p.resumo}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link href={`/projetos/${p.slug}`} onClick={() => setSlug(null)} className="botao-laranja">
              Ver página do projeto
            </Link>
            {p.site && (
              <a href={p.site} target="_blank" rel="noreferrer" className="botao">
                Ver online <ArrowUpRight className="h-4 w-4" weight="bold" />
              </a>
            )}
            <div className="ml-auto flex gap-2">
              <button onClick={() => mover(-1)} className="botao h-10 w-10 justify-center p-0" aria-label="Projeto anterior">
                <ArrowLeft className="h-4 w-4" weight="bold" />
              </button>
              <button onClick={() => mover(1)} className="botao h-10 w-10 justify-center p-0" aria-label="Próximo projeto">
                <ArrowRight className="h-4 w-4" weight="bold" />
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
