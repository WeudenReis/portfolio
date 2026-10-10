"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { anoDaLinha, linhaDoTempo } from "@/lib/dados";
import MarcaTexto from "../MarcaTexto";
import { useCapituloAtivo, useEhCopia } from "../Rasgo";

// capítulo 4: a linha do tempo vira um mapa com uma trilha, e a cobrinha vai percorrendo a rota
const L = 1000, A = 360;
const paradas = linhaDoTempo.map((_, i) => {
  const x = 50 + (i * (L - 100)) / (linhaDoTempo.length - 1);
  const y = A / 2 + Math.sin(i * 1.15) * 105;
  return { x, y };
});
const trilha = paradas
  .map((p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const a = paradas[i - 1];
    const mx = (a.x + p.x) / 2;
    return `C ${mx} ${a.y}, ${mx} ${p.y}, ${p.x} ${p.y}`;
  })
  .join(" ");

export default function Rota() {
  const copia = useEhCopia();
  const ativo = useCapituloAtivo();
  const ativoRef = useRef(ativo);
  ativoRef.current = ativo;
  const [escolhida, setEscolhida] = useState(linhaDoTempo.length - 1);
  const caminho = useRef<SVGPathElement>(null);
  const corpo = useRef<SVGPolylineElement>(null);
  const contorno = useRef<SVGPolylineElement>(null);
  const cabeca = useRef<SVGGElement>(null);
  const caixa = useRef<HTMLDivElement>(null);
  const [visitadas, setVisitadas] = useState(linhaDoTempo.length);

  useEffect(() => {
    if (copia || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = caminho.current!;
    const elCorpo = corpo.current!;
    const elContorno = contorno.current!;
    const elCabeca = cabeca.current!;
    const total = c.getTotalLength();
    const comprimentos = paradas.map((p) => {
      // acha o ponto da trilha mais perto de cada parada
      let melhor = 0, menor = Infinity;
      for (let d = 0; d <= total; d += 4) {
        const q = c.getPointAtLength(d);
        const dd = Math.hypot(q.x - p.x, q.y - p.y);
        if (dd < menor) (menor = dd), (melhor = d);
      }
      return melhor;
    });
    let visivel = false;
    const obs = new IntersectionObserver(([e]) => (visivel = e.isIntersecting));
    obs.observe(caixa.current!);

    const DURACAO = 11000, SEG = 16, ESP = 9;
    let inicio = performance.now();
    let quadro = 0;
    const loop = (agora: number) => {
      quadro = requestAnimationFrame(loop);
      // só anima com o capítulo à vista (na capa os capítulos ficam empilhados)
      if (!visivel || !ativoRef.current) {
        inicio = agora - ((agora - inicio) % (DURACAO + 1500));
        return;
      }
      const t = ((agora - inicio) % (DURACAO + 1500)) / DURACAO;
      const d = Math.min(1, t) * (total + SEG * ESP);
      const pts: string[] = [];
      for (let s = 0; s < SEG; s++) {
        const q = c.getPointAtLength(Math.max(0, Math.min(total, d - s * ESP)));
        pts.push(`${q.x.toFixed(1)},${q.y.toFixed(1)}`);
      }
      elCorpo.setAttribute("points", pts.join(" "));
      elContorno.setAttribute("points", pts.join(" "));
      const h = c.getPointAtLength(Math.min(total, d));
      const h2 = c.getPointAtLength(Math.max(0, Math.min(total, d) - 3));
      const ang = (Math.atan2(h.y - h2.y, h.x - h2.x) * 180) / Math.PI;
      elCabeca.setAttribute("transform", `translate(${h.x} ${h.y}) rotate(${ang})`);
      elCabeca.style.opacity = d - SEG * ESP > total ? "0" : "1";
      setVisitadas(comprimentos.filter((cp) => cp <= d).length);
    };
    quadro = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(quadro);
      obs.disconnect();
    };
  }, [copia]);

  const item = linhaDoTempo[escolhida];

  return (
    <div ref={caixa} className="mx-auto flex h-full max-w-6xl flex-col justify-center px-4 pr-10 sm:px-8 sm:pr-14">
      <p className="font-mao text-sm uppercase tracking-widest text-laranja-texto">mapa da trilha</p>
      <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2">
        <h2 className="font-mao text-4xl sm:text-5xl">
          <MarcaTexto>A rota até aqui</MarcaTexto>
        </h2>
        {/* o ano aparece uma vez só, como um carimbo; nas paradas ficam só os meses */}
        <span className="-rotate-3 rounded-lg border-[3px] border-tinta bg-white px-3 py-0.5 font-mao text-3xl shadow-brutal-sm sm:text-4xl">
          {anoDaLinha}
        </span>
      </div>

      <div className="-mx-4 mt-4 overflow-x-auto px-4 pb-2">
        <svg viewBox={`0 0 ${L} ${A}`} className="h-auto w-full min-w-[720px]" role="group" aria-label="Linha do tempo">
          {/* curvas de nível desenhadas à mão, só de enfeite */}
          {[0, 1, 2].map((k) => (
            <ellipse key={k} cx={780 - k * 10} cy={90 + k * 6} rx={160 - k * 45} ry={60 - k * 16} fill="none" stroke="#1e1e1e" strokeOpacity="0.12" strokeWidth="2" strokeDasharray="6 7" />
          ))}
          <path ref={caminho} d={trilha} fill="none" stroke="#1e1e1e" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />

          <polyline ref={contorno} fill="none" stroke="#1e1e1e" strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
          <polyline ref={corpo} fill="none" stroke="#FF7A33" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <g ref={cabeca} style={{ opacity: 0 }}>
            <ellipse cx="2" cy="0" rx="11" ry="9.5" fill="#FF7A33" stroke="#1e1e1e" strokeWidth="2.5" />
            <circle cx="5" cy="-4.5" r="3" fill="#fff" stroke="#1e1e1e" strokeWidth="1.5" />
            <circle cx="5" cy="4.5" r="3" fill="#fff" stroke="#1e1e1e" strokeWidth="1.5" />
            <circle cx="6" cy="-4.5" r="1.4" fill="#1e1e1e" />
            <circle cx="6" cy="4.5" r="1.4" fill="#1e1e1e" />
          </g>

          {paradas.map((p, i) => (
            <g
              key={i}
              role="button"
              tabIndex={0}
              aria-label={`${linhaDoTempo[i].mes} de ${anoDaLinha}: ${linhaDoTempo[i].oQue}`}
              aria-pressed={i === escolhida}
              onClick={() => setEscolhida(i)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setEscolhida(i)}
              onMouseEnter={() => setEscolhida(i)}
              className="cursor-pointer outline-none [&:focus-visible>circle]:stroke-laranja-texto"
            >
              <circle cx={p.x} cy={p.y} r={i === escolhida ? 13 : 10} fill={i < visitadas ? "#FF7A33" : "#fff"} stroke="#1e1e1e" strokeWidth="3" className="transition-all" />
              <text x={p.x} y={p.y + (p.y > A / 2 ? 38 : -24)} textAnchor="middle" className="fill-tinta font-mao text-[21px]">
                {linhaDoTempo[i].curto}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-2 flex flex-col gap-3 rounded-xl border-[3px] border-tinta bg-laranja-claro p-4 shadow-brutal sm:flex-row sm:items-center sm:gap-6">
        <span className="w-32 shrink-0 font-mao text-2xl text-laranja-texto">{item.mes}</span>
        <span className="flex-1 text-lg">{item.oQue}</span>
        {item.slug && (
          <Link href={`/projetos/${item.slug}`} className="botao self-start px-3 py-1.5 text-sm sm:self-auto">
            Ver projeto
          </Link>
        )}
      </div>
    </div>
  );
}
