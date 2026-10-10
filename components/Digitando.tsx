"use client";

import { useEffect, useState } from "react";

// Texto que digita, espera, apaga e passa para a próxima frase.
export default function Digitando({
  frases,
  className = "",
}: {
  frases: string[];
  className?: string;
}) {
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const [apagando, setApagando] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(frases[i].length);
      const t = setTimeout(() => {
        setI((i + 1) % frases.length);
        setN(frases[(i + 1) % frases.length].length);
      }, 2600);
      return () => clearTimeout(t);
    }
    const frase = frases[i];
    let espera = apagando ? 35 : 75;
    if (!apagando && n === frase.length) espera = 1700;
    if (apagando && n === 0) espera = 350;

    const t = setTimeout(() => {
      if (!apagando && n === frase.length) setApagando(true);
      else if (apagando && n === 0) {
        setApagando(false);
        setI((i + 1) % frases.length);
      } else setN(n + (apagando ? -1 : 1));
    }, espera);
    return () => clearTimeout(t);
  }, [i, n, apagando, frases]);

  return (
    // data-nao-comer: a cobrinha do site não morde texto que muda sozinho
    <span className={`digitando ${className}`} data-nao-comer>
      <span className="sr-only">{frases.join(", ")}</span>
      <span aria-hidden="true">{frases[i].slice(0, n)}</span>
      <span className="digitando-cursor" aria-hidden="true" />
    </span>
  );
}
