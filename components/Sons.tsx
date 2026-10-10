"use client";

import { useEffect, useState } from "react";
import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react/dist/ssr";
import { alternarSom, aoMudarSom, iniciarAudio, som, somLigado } from "@/lib/sons";

// Liga o áudio no primeiro gesto de verdade e dá um clique bem leve nos botões e links do site.
// Só eventos que o navegador aceita como ativação (tecla, mousedown, soltar o dedo, clique);
// num pointerdown de toque o áudio nasceria travado.
const GESTOS = ["keydown", "mousedown", "pointerup", "touchend", "click"] as const;
export function SonsGlobais() {
  useEffect(() => {
    const gesto = () => iniciarAudio();
    const clicar = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("a, button");
      if (el && !el.closest("[data-sem-clique]")) som.clique();
    };
    GESTOS.forEach((g) => window.addEventListener(g, gesto, { capture: true }));
    document.addEventListener("click", clicar);
    return () => {
      GESTOS.forEach((g) => window.removeEventListener(g, gesto, { capture: true }));
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
      aria-label="Sons do site"
      title={ligado ? "Desligar os sons" : "Ligar os sons"}
      data-sem-clique
    >
      {ligado ? <SpeakerHigh className="h-4 w-4" weight="bold" /> : <SpeakerSlash className="h-4 w-4" weight="bold" />}
    </button>
  );
}
