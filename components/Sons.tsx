"use client";

import { useEffect, useState } from "react";
import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react/dist/ssr";
import { alternarSom, aoMudarSom, iniciarAudio, som, somLigado } from "@/lib/sons";

// Liga o áudio no primeiro gesto e dá um clique bem leve nos botões e links do site.
export function SonsGlobais() {
  useEffect(() => {
    const gesto = () => iniciarAudio();
    const clicar = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("a, button");
      if (el && !el.closest("[data-sem-clique]")) som.clique();
    };
    window.addEventListener("pointerdown", gesto, { capture: true });
    window.addEventListener("keydown", gesto, { capture: true });
    document.addEventListener("click", clicar);
    return () => {
      window.removeEventListener("pointerdown", gesto, { capture: true });
      window.removeEventListener("keydown", gesto, { capture: true });
      document.removeEventListener("click", clicar);
    };
  }, []);
  return null;
}

export function BotaoSom({ className = "" }: { className?: string }) {
  const [ligado, setLigado] = useState(true);
  useEffect(() => {
    setLigado(somLigado());
    return aoMudarSom(setLigado);
  }, []);
  return (
    <button
      type="button"
      onClick={() => {
        iniciarAudio();
        alternarSom();
      }}
      className={`botao h-9 w-9 justify-center p-0 ${className}`}
      aria-pressed={ligado}
      aria-label={ligado ? "Desligar os sons" : "Ligar os sons"}
      title={ligado ? "Desligar os sons" : "Ligar os sons"}
      data-sem-clique
    >
      {ligado ? <SpeakerHigh className="h-4 w-4" weight="bold" /> : <SpeakerSlash className="h-4 w-4" weight="bold" />}
    </button>
  );
}
