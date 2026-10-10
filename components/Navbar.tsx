"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { soltarCobra } from "./ModoCobra";
import { IconeCobra } from "./Icones";
import { BotaoSom } from "./Sons";

const paginas = [
  { nome: "Início", href: "/" },
  { nome: "Projetos", href: "/projetos" },
  { nome: "Sobre", href: "/sobre" },
  { nome: "Jogo", href: "/jogo" },
  { nome: "Contato", href: "/contato" },
];

export default function Navbar() {
  const caminho = usePathname();
  const [aberto, setAberto] = useState(false);
  useEffect(() => setAberto(false), [caminho]);

  const ehAtual = (href: string) => (href === "/" ? caminho === "/" : caminho.startsWith(href));

  return (
    <header className="sticky top-0 z-50 h-[var(--nav)] border-b-[3px] border-tinta bg-white">
      <nav className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Principal">
        <Link href="/" className="shrink-0 font-mao text-2xl">
          weuden<span className="text-laranja">.</span>
        </Link>

        <ul className="hidden items-center gap-1 text-sm font-bold md:flex">
          {paginas.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                aria-current={ehAtual(p.href) ? "page" : undefined}
                className={`rounded-md border-2 px-3 py-1.5 ${
                  ehAtual(p.href) ? "border-tinta bg-laranja" : "border-transparent hover:border-tinta hover:bg-laranja-claro"
                }`}
              >
                {p.nome}
              </Link>
            </li>
          ))}
          <li>
            <button onClick={soltarCobra} className="botao ml-2 px-3 py-1.5 text-sm" title="Soltar a cobrinha nesta página">
              <IconeCobra className="h-4 w-4" /> Cobrinha
            </button>
          </li>
          <li>
            <BotaoSom className="ml-1" />
          </li>
        </ul>

        <div className="flex items-center gap-2 md:hidden">
        <BotaoSom />
        <button
          className="botao px-2.5 py-1.5"
          onClick={() => setAberto(!aberto)}
          aria-expanded={aberto}
          aria-controls="menu-celular"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
        >
          {aberto ? <X className="h-5 w-5" weight="bold" /> : <List className="h-5 w-5" weight="bold" />}
        </button>
        </div>
      </nav>

      {aberto && (
        <ul
          id="menu-celular"
          className="absolute inset-x-0 top-full border-b-[3px] border-tinta bg-white px-4 pb-5 pt-2 font-mao text-2xl md:hidden"
        >
          {paginas.map((p) => (
            <li key={p.href} className="border-b-2 border-dashed border-tinta/20 last:border-0">
              <Link href={p.href} className="block py-3" aria-current={ehAtual(p.href) ? "page" : undefined} onClick={() => setAberto(false)}>
                {ehAtual(p.href) ? <span className="marca marca-laranja marca-visivel">{p.nome}</span> : p.nome}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
