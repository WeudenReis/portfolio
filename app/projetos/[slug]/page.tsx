import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, LockSimple } from "@phosphor-icons/react/dist/ssr";
import { categorias, projetos } from "@/lib/dados";
import MarcaTexto from "@/components/MarcaTexto";
import Mockup from "@/components/Mockup";
import { IconeGithub } from "@/components/Icones";

export function generateStaticParams() {
  return projetos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projetos.find((x) => x.slug === slug);
  return p ? { title: p.nome, description: p.resumo } : {};
}

export default async function PaginaProjeto({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = projetos.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = projetos[i];
  const cat = categorias.find((c) => c.id === p.categoria)!;
  const anterior = projetos[(i - 1 + projetos.length) % projetos.length];
  const proximo = projetos[(i + 1) % projetos.length];

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href="/projetos" className="inline-flex items-center gap-1 text-sm font-bold hover:underline">
        <ArrowLeft className="h-4 w-4" weight="bold" /> Todos os projetos
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className={`etiqueta ${p.categoria === "chatPro" ? "bg-laranja" : "bg-laranja-claro"}`}>{cat.nome}</span>
        <span className="etiqueta">{p.quando}</span>
        {p.privado ? (
          <span className="etiqueta text-cinza">
            <LockSimple className="h-3 w-3" weight="bold" /> código privado
          </span>
        ) : (
          <span className="etiqueta">código aberto</span>
        )}
      </div>

      <h1 className="mt-4 font-mao text-5xl leading-tight sm:text-7xl">
        <MarcaTexto>{p.nome}</MarcaTexto>
      </h1>
      <p className="mt-5 text-xl leading-relaxed sm:text-2xl">{p.resumo}</p>

      {(p.repo || p.site) && (
        <div className="mt-7 flex flex-wrap gap-3">
          {p.site && (
            <a href={p.site} target="_blank" rel="noreferrer" className="botao-laranja">
              Ver online <ArrowUpRight className="h-5 w-5" weight="bold" />
            </a>
          )}
          {p.repo && (
            <a href={p.repo} target="_blank" rel="noreferrer" className="botao">
              <IconeGithub /> Ver o código
            </a>
          )}
        </div>
      )}

      <Mockup projeto={p} className="mt-10 shadow-brutal-lg" />

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <section className="caixa p-6">
          <h2 className="font-mao text-2xl text-laranja-texto">O problema</h2>
          <p className="mt-3 text-lg leading-relaxed">{p.problema}</p>
        </section>
        <section className="caixa bg-laranja-claro p-6">
          <h2 className="font-mao text-2xl text-laranja-texto">O que eu fiz</h2>
          <p className="mt-3 text-lg leading-relaxed">{p.solucao}</p>
        </section>
      </div>

      {/* depoimento: como foi fazer, contado por mim */}
      <section className="mt-12">
        <h2 className="font-mao text-3xl">
          <MarcaTexto>Como foi fazer</MarcaTexto>
        </h2>
        <figure className="relative mt-5 rotate-[-0.6deg] rounded-xl border-[3px] border-tinta bg-laranja-claro p-6 shadow-brutal sm:p-8">
          <img
            src="/profile.jpg"
            alt=""
            aria-hidden="true"
            className="absolute -right-3 -top-4 h-14 w-12 rotate-3 border-[3px] border-dashed border-tinta bg-white object-cover p-0.5"
          />
          <blockquote className="pr-8 text-lg leading-relaxed">{p.bastidores}</blockquote>
          <figcaption className="mt-4 font-mao text-xl">Weuden</figcaption>
        </figure>
      </section>

      <section className="mt-10">
        <h2 className="font-mao text-3xl">
          <MarcaTexto>Destaques</MarcaTexto>
        </h2>
        <ul className="mt-5 space-y-3">
          {p.destaques.map((d) => (
            <li key={d} className="flex gap-3 text-lg">
              <span className="mt-2.5 h-2.5 w-2.5 shrink-0 rotate-45 border-2 border-tinta bg-laranja" />
              {d}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-mao text-3xl">
          <MarcaTexto>Feito com</MarcaTexto>
        </h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <span key={s} className="etiqueta px-3 py-1 text-sm shadow-brutal-sm">
              {s}
            </span>
          ))}
        </div>
      </section>

      <nav className="mt-16 grid gap-4 border-t-[3px] border-tinta pt-8 sm:grid-cols-2" aria-label="Outros projetos">
        <Link href={`/projetos/${anterior.slug}`} className="caixa p-4 hover:bg-laranja-claro">
          <span className="flex items-center gap-1 text-sm text-cinza">
            <ArrowLeft className="h-4 w-4" weight="bold" /> Anterior
          </span>
          <span className="mt-1 block font-mao text-xl">{anterior.nome}</span>
        </Link>
        <Link href={`/projetos/${proximo.slug}`} className="caixa p-4 text-right hover:bg-laranja-claro">
          <span className="flex items-center justify-end gap-1 text-sm text-cinza">
            Próximo <ArrowRight className="h-4 w-4" weight="bold" />
          </span>
          <span className="mt-1 block font-mao text-xl">{proximo.nome}</span>
        </Link>
      </nav>
    </article>
  );
}
