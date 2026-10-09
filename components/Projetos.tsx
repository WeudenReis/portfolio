import { ArrowUpRight, BookMarked } from "lucide-react";
import { coresLinguagem, projetos } from "@/lib/dados";
import { IconeGithub } from "./Icones";
import Titulo from "./Titulo";

export default function Projetos() {
  return (
    <section id="projetos" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Titulo>Projetos em destaque</Titulo>
      <div className="grid gap-8 md:grid-cols-2">
        {projetos.map((p) => (
          <article
            key={p.nome}
            className="caixa flex flex-col p-6 transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lg"
          >
            <h3 className="flex items-center gap-2 text-xl font-bold text-laranja-texto">
              <BookMarked className="h-5 w-5 shrink-0" strokeWidth={2.5} />
              <a href={p.repo} target="_blank" rel="noreferrer" className="break-all hover:underline">
                {p.nome}
              </a>
            </h3>
            <p className="mt-3 flex-1 text-cinza">{p.descricao}</p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <span
                  className="h-3.5 w-3.5 rounded-full border-2 border-tinta"
                  style={{ background: coresLinguagem[p.linguagem] }}
                />
                {p.linguagem}
              </span>
              <div className="flex gap-3">
                <a href={p.repo} target="_blank" rel="noreferrer" className="botao px-3 py-1.5 text-sm">
                  <IconeGithub className="h-4 w-4" /> Código
                </a>
                {p.demo && (
                  <a href={p.demo} target="_blank" rel="noreferrer" className="botao-laranja px-3 py-1.5 text-sm">
                    Ver online <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
