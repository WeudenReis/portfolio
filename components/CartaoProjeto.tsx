import Link from "next/link";
import { ArrowUpRight, LockSimple } from "@phosphor-icons/react/dist/ssr";
import { categorias, type Projeto } from "@/lib/dados";
import { BotaoPreview } from "./PreviewProjeto";

// O cartão todo leva à página do projeto (o link do título cobre o cartão),
// e o botão de preview fica por cima, abrindo o modal.
export default function CartaoProjeto({ p }: { p: Projeto }) {
  const cat = categorias.find((c) => c.id === p.categoria)!;
  return (
    <article className="caixa group relative flex h-full flex-col p-5 transition-all duration-150 focus-within:-translate-y-1 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lg">
      <div className="flex items-center justify-between gap-2">
        <span className={`etiqueta ${p.categoria === "chatPro" ? "bg-laranja" : "bg-laranja-claro"}`}>{cat.nome}</span>
        <span className="font-mao text-base text-cinza">{p.quando}</span>
      </div>
      <h3 className="mt-4 font-mao text-2xl leading-tight group-hover:text-laranja-texto">
        <Link href={`/projetos/${p.slug}`} className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:underline">
          {p.nome}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-cinza">{p.resumo}</p>
      <div className="mt-5 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {p.stack.slice(0, 2).map((s) => (
            <span key={s} className="etiqueta">
              {s}
            </span>
          ))}
          {p.privado && (
            <span className="etiqueta text-cinza" title="Código privado">
              <LockSimple className="h-3 w-3" weight="bold" />
            </span>
          )}
        </div>
        <div className="relative z-10 flex items-center gap-2">
          <BotaoPreview slug={p.slug} className="botao px-2.5 py-1 text-xs" />
          <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" weight="bold" />
        </div>
      </div>
    </article>
  );
}
