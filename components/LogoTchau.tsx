"use client";

import { som } from "@/lib/sons";

// O logo </> que se abre e vira um bonequinho dando tchau, e depois volta a ser logo.
// "<" vira as pernas, "/" fica em pé e vira o corpo, ">" vira os braços abanando, e nasce uma cabeça.
// A animação é toda em CSS (.logo-tchau em globals.css). O "oi" só toca quando a pessoa
// passa o mouse ou clica, para não ficar apitando a cada ciclo.
export default function LogoTchau({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Logo </> que vira um bonequinho dando tchau"
      onPointerEnter={(e) => e.pointerType === "mouse" && som.tchau()}
      onClick={() => som.tchau()}
      className={`logo-tchau inline-flex items-center justify-center rounded-2xl border-[3px] border-tinta bg-white shadow-brutal-sm ${className}`}
    >
      <svg viewBox="0 0 100 100" className="h-[78%] w-[78%] overflow-visible" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline className="lt-menor" points="30,30 12,50 30,70" stroke="#1e1e1e" strokeWidth="9" />
        <line className="lt-barra" x1="58" y1="22" x2="42" y2="78" stroke="#FF7A33" strokeWidth="9" />
        <circle className="lt-cabeca" cx="50" cy="22" r="10" fill="#FF7A33" stroke="#1e1e1e" strokeWidth="6" />
        <g className="lt-bracos">
          <polyline className="lt-maior" points="70,30 88,50 70,70" stroke="#1e1e1e" strokeWidth="9" />
        </g>
      </svg>
    </span>
  );
}
