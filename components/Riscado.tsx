"use client";

import { useEffect } from "react";
import { useNaTela } from "@/lib/useNaTela";
import { som } from "@/lib/sons";
import { useEhCopia } from "./Rasgo";

// Palavra apagadinha com um risco feito à mão por cima, como se tivesse sido cortada do texto.
export default function Riscado({ children, atraso = 250 }: { children: React.ReactNode; atraso?: number }) {
  const [ref, visto] = useNaTela<HTMLSpanElement>();
  const copia = useEhCopia();
  useEffect(() => {
    if (!visto || copia) return;
    const t = setTimeout(() => som.risco(), atraso);
    return () => clearTimeout(t);
  }, [visto, copia, atraso]);
  return (
    <span ref={ref} className="riscado">
      <del className="no-underline">{children}</del>
      <svg viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M2 12 C 18 8, 30 13, 48 10 S 80 8, 98 11"
          pathLength={1}
          className={visto ? "riscado-desenhado" : ""}
          style={{ transitionDelay: `${atraso}ms` }}
        />
        <path
          d="M4 14 C 26 11, 52 15, 70 12 S 90 11, 96 13"
          pathLength={1}
          className={visto ? "riscado-desenhado" : ""}
          style={{ transitionDelay: `${atraso + 280}ms` }}
        />
      </svg>
    </span>
  );
}
