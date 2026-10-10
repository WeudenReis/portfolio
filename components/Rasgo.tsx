"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { som } from "@/lib/sons";
import { rolarPara } from "./RolagemLenta";

// Capítulos de tela cheia que rasgam como papel quando você rola, revelando o próximo.
// Cada capítulo (menos o último) é desenhado duas vezes: a metade de cima e a de baixo,
// recortadas pela mesma borda irregular. Em repouso só a de cima aparece, inteira e clicável.

export type Capitulo = { id: string; nome: string; fundo: string; conteudo: ReactNode };

// true dentro da cópia de baixo: componentes animados usam isso para não rodar duas vezes
const CopiaContext = createContext(false);
export const useEhCopia = () => useContext(CopiaContext);

const PONTOS = 40;
const PAUSA = 0.38; // fração da rolagem de cada capítulo em que ele fica parado antes de rasgar

function borda(semente: number, base: number) {
  let s = semente * 7919;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const ys: number[] = [];
  let y = 0;
  for (let i = 0; i <= PONTOS; i++) {
    y = y * 0.5 + (rnd() - 0.5) * 3.4;
    ys.push(+(base + y + Math.sin(i / 4 + semente) * 1.4).toFixed(2));
  }
  return ys;
}
const xDe = (i: number) => +((i / PONTOS) * 100).toFixed(2);
const cima = (ys: number[], d = 0) =>
  `polygon(0% 0%, 100% 0%, ${ys.map((y, i) => `${xDe(PONTOS - i)}% ${ys[PONTOS - i] + d}%`).join(", ")})`;
const baixo = (ys: number[], d = 0) =>
  `polygon(${ys.map((y, i) => `${xDe(i)}% ${y + d}%`).join(", ")}, 100% 100%, 0% 100%)`;
const linha = (ys: number[], d = 0) => ys.map((y, i) => `${xDe(i)},${y + d}`).join(" ");

const suave = (t: number) => t * t * (3 - 2 * t);

export default function Rasgo({ capitulos }: { capitulos: Capitulo[] }) {
  const trilho = useRef<HTMLDivElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  const [simples, setSimples] = useState(false);
  const [ativo, setAtivo] = useState(0);
  const n = capitulos.length;
  const bordas = useRef(capitulos.map((_, i) => borda(i + 3, 60 + ((i * 7) % 12))));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSimples(true);
      return;
    }
    const folhas = [...palco.current!.querySelectorAll<HTMLElement>("[data-folha]")];
    let ultimoAtivo = -1;
    let quadro = 0;
    const rasgado = folhas.map(() => false); // para tocar o som só quando o rasgo começa
    let primeira = true;

    const atualizar = () => {
      quadro = 0;
      const seg = palco.current!.offsetHeight;
      const nav = palco.current!.getBoundingClientRect().top - trilho.current!.getBoundingClientRect().top;
      const s = nav; // quanto já rolamos dentro do trilho
      let novoAtivo = 0;

      folhas.forEach((folha, i) => {
        const t = i === n - 1 ? 0 : Math.min(1, Math.max(0, (s - i * seg - PAUSA * seg) / ((1 - PAUSA) * seg)));
        if (t >= 0.5) novoAtivo = i + 1;
        const comecou = t > 0.02;
        if (comecou !== rasgado[i]) {
          rasgado[i] = comecou;
          if (!primeira) {
            comecou ? som.rasgo() : som.colar();
            window.dispatchEvent(new CustomEvent("rasgo:mudou", { detail: { i, comecou } }));
          }
        }
        const e = suave(t);
        const ys = bordas.current[i];
        const meio = ys.reduce((a, b) => a + b, 0) / ys.length;

        const fCima = folha.querySelector<HTMLElement>("[data-cima]");
        const fBaixo = folha.querySelector<HTMLElement>("[data-baixo]");
        const conteudo = folha.querySelector<HTMLElement>("[data-cima] > [data-conteudo]");
        if (fCima && fBaixo && conteudo) {
          const rasgando = t > 0;
          conteudo.style.clipPath = rasgando ? cima(ys) : "none";
          folha.style.setProperty("--rasgo", rasgando ? "1" : "0");
          fBaixo.style.visibility = rasgando ? "visible" : "hidden";
          fCima.style.transform = rasgando
            ? `translate3d(0, ${-e * (meio + 8)}%, 0) rotate(${-e * 4}deg)`
            : "";
          fBaixo.style.transform = rasgando
            ? `translate3d(0, ${e * (100 - meio + 8)}%, 0) rotate(${e * 3}deg)`
            : "";
        }
        folha.style.visibility = t >= 1 ? "hidden" : "visible";

        // o capítulo de baixo vem "subindo" enquanto o de cima rasga
        const anterior = i > 0 ? Math.min(1, Math.max(0, (s - (i - 1) * seg - PAUSA * seg) / ((1 - PAUSA) * seg))) : 1;
        folha.style.transform = i > 0 && anterior < 1 ? `scale(${0.93 + 0.07 * suave(anterior)})` : "";
      });

      primeira = false;
      if (novoAtivo !== ultimoAtivo) {
        ultimoAtivo = novoAtivo;
        folhas.forEach((f, i) => (f.inert = i !== novoAtivo));
        setAtivo(novoAtivo);
      }
    };
    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    };
    atualizar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, [n]);

  const irPara = (i: number) => {
    const seg = palco.current!.offsetHeight;
    const topo = trilho.current!.getBoundingClientRect().top + window.scrollY;
    const nav = parseFloat(getComputedStyle(palco.current!).top) || 0;
    const destino = i === 0 ? 0 : (i - 1) * seg + seg; // fim do rasgo do capítulo anterior
    rolarPara(topo - nav + destino);
  };

  if (simples) {
    return (
      <div>
        {capitulos.map((c) => (
          <section key={c.id} id={c.id} className={`relative min-h-[calc(100svh-var(--nav))] ${c.fundo}`}>
            {c.conteudo}
          </section>
        ))}
      </div>
    );
  }

  return (
    <div ref={trilho} className="relative" style={{ height: `calc(${n} * (100svh - var(--nav)))` }}>
      <div
        ref={palco}
        className="sticky top-[var(--nav)] h-[calc(100svh-var(--nav))] overflow-hidden bg-tinta"
      >
        {capitulos.map((c, i) => {
          const ys = bordas.current[i];
          const ultimo = i === n - 1;
          return (
            <div
              key={c.id}
              id={c.id}
              data-folha
              className="absolute inset-0 origin-center"
              style={{ zIndex: n - i }}
              aria-label={c.nome}
              role="region"
            >
              <div data-cima className="absolute inset-0 origin-[0%_60%] will-change-transform">
                {!ultimo && <Fibra clip={cima(ys, 1.6)} />}
                <div data-conteudo className={`absolute inset-0 overflow-hidden ${c.fundo}`}>
                  {c.conteudo}
                </div>
                {!ultimo && <Linha pontos={linha(ys, 1.6)} />}
              </div>
              {!ultimo && (
                <div
                  data-baixo
                  className="absolute inset-0 origin-[100%_60%] will-change-transform"
                  style={{ visibility: "hidden" }}
                  aria-hidden="true"
                  inert
                >
                  <Fibra clip={baixo(ys, -1.4)} />
                  <div className={`absolute inset-0 overflow-hidden ${c.fundo}`} style={{ clipPath: baixo(ys) }}>
                    <CopiaContext.Provider value={true}>{c.conteudo}</CopiaContext.Provider>
                  </div>
                  <Linha pontos={linha(ys, -1.4)} />
                </div>
              )}
            </div>
          );
        })}

        {/* bolinhas de navegação entre capítulos */}
        <nav
          aria-label="Capítulos"
          className="absolute right-3 top-1/2 z-[60] flex -translate-y-1/2 flex-col gap-3 sm:right-5"
        >
          {capitulos.map((c, i) => (
            <button
              key={c.id}
              onClick={() => irPara(i)}
              aria-label={c.nome}
              aria-current={i === ativo ? "step" : undefined}
              title={c.nome}
              className={`h-3.5 w-3.5 rounded-full border-[2.5px] border-tinta transition-all ${
                i === ativo ? "scale-125 bg-laranja" : "bg-white hover:bg-laranja-claro"
              }`}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}

// tira branca de papel que aparece na beirada do rasgo
function Fibra({ clip }: { clip: string }) {
  return (
    <div
      className="absolute inset-0 bg-[#fffdf8] opacity-[var(--rasgo,0)]"
      style={{ clipPath: clip }}
      aria-hidden="true"
    />
  );
}

// contorno preto grosso da beirada, no traço neobrutalista
function Linha({ pontos }: { pontos: string }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[var(--rasgo,0)]"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline points={pontos} fill="none" stroke="#1e1e1e" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}
