"use client";

import { useState } from "react";
import { PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr";
import { contato } from "@/lib/dados";

// Cartão-postal: o formulário não manda nada sozinho, ele abre o e-mail da pessoa já preenchido.
export default function Postal() {
  const [nome, setNome] = useState("");
  const [assunto, setAssunto] = useState("Projeto");
  const [mensagem, setMensagem] = useState("");
  const [enviado, setEnviado] = useState(false);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const corpo = `${mensagem}\n\n${nome}`;
    window.location.href = `mailto:${contato.email}?subject=${encodeURIComponent(`[${assunto}] Recado do site`)}&body=${encodeURIComponent(corpo)}`;
    setEnviado(true);
  };

  return (
    <form onSubmit={enviar} className="relative -rotate-1 rounded-xl border-[3px] border-tinta bg-white p-5 shadow-brutal-lg sm:p-8">
      <div className="grid gap-6 md:grid-cols-[3fr_2fr]">
        <div>
          <label htmlFor="mensagem" className="font-mao text-lg text-cinza">
            Oi Weuden, ...
          </label>
          <textarea
            id="mensagem"
            required
            rows={8}
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Tenho um problema na operação que dá pra automatizar..."
            className="mt-2 w-full resize-none bg-[repeating-linear-gradient(transparent,transparent_31px,#1e1e1e22_31px,#1e1e1e22_32px)] font-mao text-xl leading-8 outline-none placeholder:text-cinza/60"
          />
        </div>
        <div className="flex flex-col gap-4 md:border-l-2 md:border-dashed md:border-tinta/30 md:pl-6">
          <div className="ml-auto flex h-20 w-16 rotate-3 items-center justify-center border-[3px] border-dashed border-tinta bg-laranja font-mao text-sm leading-tight">
            selo
            <br />
            GO
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-cinza">Para</p>
            <p className="font-mao text-xl">Weuden, Goiânia GO</p>
          </div>
          <div>
            <label htmlFor="nome" className="text-xs font-bold uppercase tracking-widest text-cinza">
              De
            </label>
            <input
              id="nome"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="seu nome"
              className="mt-1 w-full border-b-2 border-tinta bg-transparent py-1 font-mao text-xl outline-none focus:border-laranja-texto"
            />
          </div>
          <fieldset>
            <legend className="text-xs font-bold uppercase tracking-widest text-cinza">Assunto</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Projeto", "Vaga", "Só um oi"].map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => setAssunto(a)}
                  aria-pressed={assunto === a}
                  className={`etiqueta ${assunto === a ? "bg-laranja" : ""}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </fieldset>
          <button type="submit" className="botao-tinta mt-auto justify-center">
            <PaperPlaneTilt className="h-4 w-4" weight="bold" /> Mandar o postal
          </button>
        </div>
      </div>
      {enviado && (
        <p className="mt-4 text-sm text-cinza" role="status">
          Abri o seu programa de e-mail com o recado preenchido. É só conferir e enviar por lá.
        </p>
      )}
    </form>
  );
}
