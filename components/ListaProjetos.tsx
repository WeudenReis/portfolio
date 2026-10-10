"use client";

import { useState } from "react";
import { categorias, projetos, type Categoria } from "@/lib/dados";
import CartaoProjeto from "./CartaoProjeto";

export default function ListaProjetos() {
  const [filtro, setFiltro] = useState<Categoria | "todos">("todos");
  const lista = filtro === "todos" ? projetos : projetos.filter((p) => p.categoria === filtro);

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
        {[{ id: "todos" as const, nome: "Todos" }, ...categorias].map((c) => {
          const qtd = c.id === "todos" ? projetos.length : projetos.filter((p) => p.categoria === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => setFiltro(c.id)}
              aria-pressed={filtro === c.id}
              className={`botao px-3 py-1.5 text-sm ${filtro === c.id ? "bg-laranja" : ""}`}
            >
              {c.nome} <span className="font-mono text-xs">{qtd}</span>
            </button>
          );
        })}
      </div>

      <ul className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((p) => (
          <li key={p.slug}>
            <CartaoProjeto p={p} />
          </li>
        ))}
      </ul>
    </>
  );
}
