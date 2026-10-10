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
// true quando o capítulo é o que está à vista. Fora do Rasgo vale sempre true.
// Riscado, marca-texto e animações esperam o capítulo aparecer para começar.
const CapituloContext = createContext(true);
export const useCapituloAtivo = () => useContext(CapituloContext);

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
const limitar01 = (v: number) => Math.min(1, Math.max(0, v));

export default function Rasgo({ capitulos }: { capitulos: Capitulo[] }) {
  const trilho = useRef<HTMLDivElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  const preenchimento = useRef<HTMLDivElement>(null);
  const [simples, setSimples] = useState(false);
  const [ativo, setAtivo] = useState(0);
  const n = capitulos.length;
  const bordas = useRef(capitulos.map((_, i) => borda(i + 3, 60 + ((i * 7) % 12))));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSimples(true);
      return;
    }
    const elPalco = palco.current!;
    const elTrilho = trilho.current!;
    const elFill = preenchimento.current;
    // tudo que o laço mexe fica guardado aqui, para não procurar no DOM a cada quadro
    const folhas = [...elPalco.querySelectorAll<HTMLElement>("[data-folha]")].map((folha, i) => {
      const ys = bordas.current[i];
      return {
        folha,
        cima: folha.querySelector<HTMLElement>("[data-cima]"),
        baixo: folha.querySelector<HTMLElement>("[data-baixo]"),
        conteudo: folha.querySelector<HTMLElement>("[data-cima] > [data-conteudo]"),
        recorte: cima(ys),
        meio: ys.reduce((a, b) => a + b, 0) / ys.length,
        ultimo: "", // último estado escrito, para só mexer no estilo quando mudar
        rasgado: false,
        somEm: 0,
      };
    });
    let ultimoAtivo = -1;
    let quadro = 0;
    let sAnterior = -1;
    let porTamanho = false;

    const atualizar = () => {
      quadro = 0;
      const seg = elPalco.offsetHeight;
      const s = elPalco.getBoundingClientRect().top - elTrilho.getBoundingClientRect().top; // quanto já rolamos
      // salto grande (link, recarregar no meio, redimensionar): ajusta sem tocar som
      const salto = sAnterior < 0 || porTamanho || Math.abs(s - sAnterior) > seg * 0.5;
      sAnterior = s;
      porTamanho = false;
      let novoAtivo = 0;
      let somDoQuadro: "rasgo" | "colar" | null = null;
      const agora = performance.now();

      folhas.forEach((f, i) => {
        const t = i === n - 1 ? 0 : limitar01((s - i * seg - PAUSA * seg) / ((1 - PAUSA) * seg));
        if (t >= 0.5) novoAtivo = i + 1;
        const comecou = t > 0.02;
        if (comecou !== f.rasgado) {
          f.rasgado = comecou;
          if (!salto && agora - f.somEm > 600) {
            f.somEm = agora;
            somDoQuadro = comecou ? "rasgo" : somDoQuadro ?? "colar";
            window.dispatchEvent(new CustomEvent("rasgo:mudou", { detail: { i, comecou } }));
          }
        }

        // o capítulo de baixo vem "subindo" enquanto o de cima rasga
        const anterior = i > 0 ? limitar01((s - (i - 1) * seg - PAUSA * seg) / ((1 - PAUSA) * seg)) : 1;
        const escala = i > 0 && anterior < 1 ? 0.93 + 0.07 * suave(anterior) : 1;
        const estado = `${t.toFixed(4)}|${escala.toFixed(4)}`;
        if (estado === f.ultimo) return;
        f.ultimo = estado;

        const e = suave(t);
        if (f.cima && f.baixo && f.conteudo) {
          const rasgando = t > 0;
          f.conteudo.style.clipPath = rasgando ? f.recorte : "none";
          f.folha.style.setProperty("--rasgo", rasgando ? "1" : "0");
          f.baixo.style.visibility = rasgando && t < 1 ? "visible" : "hidden";
          f.cima.style.transform = rasgando ? `translate3d(0, ${-e * (f.meio + 8)}%, 0) rotate(${-e * 4}deg)` : "";
          f.baixo.style.transform = rasgando ? `translate3d(0, ${e * (100 - f.meio + 8)}%, 0) rotate(${e * 3}deg)` : "";
        }
        f.folha.style.visibility = t >= 1 ? "hidden" : "visible";
        f.folha.style.transform = escala < 1 ? `scale(${escala})` : "";
      });

      if (somDoQuadro === "rasgo") som.rasgo();
      else if (somDoQuadro === "colar") som.colar();

      // trilho dos pontinhos: enche conforme a rolagem
      if (elFill) elFill.style.transform = `scaleY(${limitar01(s / ((n - 1) * seg))})`;

      if (novoAtivo !== ultimoAtivo) {
        ultimoAtivo = novoAtivo;
        folhas.forEach((f, i) => (f.folha.inert = i !== novoAtivo));
        setAtivo(novoAtivo);
      }
    };
    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    };
    const aoRedimensionar = () => {
      porTamanho = true;
      agendar();
    };
    atualizar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", aoRedimensionar);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", aoRedimensionar);
    };
  }, [n]);

  const irPara = (i: number) => {
    if (!palco.current || !trilho.current) return;
    const seg = palco.current.offsetHeight;
    const topo = trilho.current.getBoundingClientRect().top + window.scrollY;
    const nav = parseFloat(getComputedStyle(palco.current).top) || 0;
    rolarPara(topo - nav + i * seg); // i telas depois do começo = capítulo i inteiro à vista
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
      <div ref={palco} className="sticky top-[var(--nav)] h-[calc(100svh-var(--nav))] overflow-hidden bg-tinta">
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
                  <CapituloContext.Provider value={i === ativo}>{c.conteudo}</CapituloContext.Provider>
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
                    <CopiaContext.Provider value={true}>
                      <CapituloContext.Provider value={i === ativo}>{c.conteudo}</CapituloContext.Provider>
                    </CopiaContext.Provider>
                  </div>
                  <Linha pontos={linha(ys, -1.4)} />
                </div>
              )}
            </div>
          );
        })}

        {/* pontinhos de navegação, num trilho que vai enchendo conforme a rolagem */}
        <nav aria-label="Capítulos" className="absolute right-3 top-1/2 z-[60] -translate-y-1/2 sm:right-5">
          <div className="relative flex flex-col gap-4">
            <span className="absolute bottom-[7px] left-1/2 top-[7px] w-[3px] -translate-x-1/2 rounded-full bg-white/70" aria-hidden="true" />
            <span className="absolute bottom-[7px] left-1/2 top-[7px] w-[3px] -translate-x-1/2 overflow-hidden rounded-full" aria-hidden="true">
              <span ref={preenchimento} className="block h-full w-full origin-top scale-y-0 bg-laranja" />
            </span>
            {capitulos.map((c, i) => (
              <button
                key={c.id}
                onClick={() => irPara(i)}
                aria-label={c.nome}
                aria-current={i === ativo ? "step" : undefined}
                title={c.nome}
                className={`relative h-3.5 w-3.5 rounded-full border-[2.5px] border-tinta transition-all ${
                  i === ativo ? "scale-125 bg-laranja" : i < ativo ? "bg-laranja-claro" : "bg-white hover:bg-laranja-claro"
                }`}
              />
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

// tira branca de papel que aparece na beirada do rasgo
function Fibra({ clip }: { clip: string }) {
  return (
    <div className="absolute inset-0 bg-[#fffdf8] opacity-[var(--rasgo,0)]" style={{ clipPath: clip }} aria-hidden="true" />
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
