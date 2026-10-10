"use client";

import { useEffect, useRef } from "react";
import { desenharCobra, type Ponto } from "@/lib/desenharCobra";
import { useEhCopia } from "./Rasgo";

// Título da capa: uma cobrinha atravessa as linhas comendo as letras, e elas nascem de novo depois.
export default function CobraTitulo({ linhas, className = "" }: { linhas: string[]; className?: string }) {
  const caixa = useRef<HTMLDivElement>(null);
  const tela = useRef<HTMLCanvasElement>(null);
  const copia = useEhCopia();

  useEffect(() => {
    const el = caixa.current!;
    const cv = tela.current!;
    if (copia || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d")!;
    const letras = [...el.querySelectorAll<HTMLSpanElement>(".letra-comivel")];

    let caminho: Ponto[] = [];
    let comprimento = 0;
    let raio = 10;
    let centros: { x: number; y: number; w: number }[] = [];

    const medir = () => {
      const r = el.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const folga = 40;
      cv.width = (r.width + folga * 2) * dpr;
      cv.height = (r.height + folga * 2) * dpr;
      cv.style.width = `${r.width + folga * 2}px`;
      cv.style.height = `${r.height + folga * 2}px`;
      ctx.setTransform(dpr, 0, 0, dpr, folga, folga);

      centros = letras.map((l) => {
        const b = l.getBoundingClientRect();
        return { x: b.left - r.left + b.width / 2, y: b.top - r.top + b.height * 0.55, w: b.width };
      });
      raio = Math.max(6, Math.min(14, (letras[0]?.getBoundingClientRect().height ?? 40) * 0.17));

      // agrupa as letras por linha visual e monta um zigue-zague: ida, desce, volta
      const porLinha: { y: number; xs: number[] }[] = [];
      for (const c of centros) {
        const linha = porLinha.find((p) => Math.abs(p.y - c.y) < 12);
        if (linha) linha.xs.push(c.x);
        else porLinha.push({ y: c.y, xs: [c.x] });
      }
      porLinha.sort((a, b) => a.y - b.y);
      caminho = [];
      porLinha.forEach((linha, k) => {
        const min = Math.min(...linha.xs) - raio * 4;
        const max = Math.max(...linha.xs) + raio * 4;
        const [a, b] = k % 2 === 0 ? [min, max] : [max, min];
        if (k === 0) caminho.push({ x: a - raio * 10, y: linha.y });
        caminho.push({ x: a, y: linha.y }, { x: b, y: linha.y });
      });
      const ult = caminho[caminho.length - 1];
      const voltando = porLinha.length % 2 === 0;
      caminho.push({ x: ult.x + (voltando ? -1 : 1) * raio * 30, y: ult.y });
      comprimento = 0;
      for (let i = 1; i < caminho.length; i++) comprimento += dist(caminho[i - 1], caminho[i]);
    };

    const pontoEm = (d: number): Ponto => {
      for (let i = 1; i < caminho.length; i++) {
        const seg = dist(caminho[i - 1], caminho[i]);
        if (d <= seg) {
          const t = d / seg;
          return { x: lerp(caminho[i - 1].x, caminho[i].x, t), y: lerp(caminho[i - 1].y, caminho[i].y, t) };
        }
        d -= seg;
      }
      return caminho[caminho.length - 1];
    };

    medir();
    const aoRedimensionar = () => medir();
    window.addEventListener("resize", aoRedimensionar);
    document.fonts?.ready.then(medir);

    const SEGMENTOS = 14;
    const RENASCE = 1300; // ms depois de comida, a letra nasce de novo
    const comidaEm = letras.map(() => 0);
    let d = 0;
    let andando = false;
    let espera = 900;
    let anterior = performance.now();
    let visivel = true;
    let quadro = 0;

    const obs = new IntersectionObserver(([e]) => (visivel = e.isIntersecting));
    obs.observe(el);

    const loop = (agora: number) => {
      quadro = requestAnimationFrame(loop);
      const dt = Math.min(50, agora - anterior);
      anterior = agora;
      if (!visivel || document.hidden) return;

      // letras comidas há um tempinho nascem de novo, com um pulinho
      comidaEm.forEach((t, i) => {
        if (t && agora - t > RENASCE) {
          comidaEm[i] = 0;
          letras[i].classList.remove("letra-comida");
        }
      });

      ctx.clearRect(-40, -40, cv.width, cv.height);
      if (!andando) {
        espera -= dt;
        if (espera <= 0) {
          andando = true;
          d = 0;
        }
        return;
      }

      d += (dt / 1000) * raio * 26;
      const corpo: Ponto[] = [];
      for (let s = 0; s < SEGMENTOS; s++) corpo.push(pontoEm(Math.max(0, d - s * raio * 1.35)));
      const cabeca = corpo[0];

      centros.forEach((c, i) => {
        if (!comidaEm[i] && Math.abs(c.x - cabeca.x) < c.w * 0.5 + raio * 0.6 && Math.abs(c.y - cabeca.y) < raio * 2) {
          comidaEm[i] = agora;
          letras[i].classList.add("letra-comida");
        }
      });

      desenharCobra(ctx, corpo, raio, agora);

      if (d - SEGMENTOS * raio * 1.35 > comprimento) {
        andando = false;
        espera = 3200;
      }
    };
    quadro = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(quadro);
      obs.disconnect();
      window.removeEventListener("resize", aoRedimensionar);
      letras.forEach((l) => l.classList.remove("letra-comida"));
    };
  }, [copia]);

  const texto = linhas.join(" ");
  return (
    <div ref={caixa} className={`relative ${className}`} data-nao-comer>
      <h1 className="font-mao leading-[1.1]">
        <span className="sr-only">{texto}</span>
        {linhas.map((linha, l) => (
          <span key={l} className="block" aria-hidden="true">
            {linha.split(" ").map((palavra, p) => (
              <span key={p} className="inline-block whitespace-nowrap">
                {[...palavra].map((ch, c) => (
                  <span key={c} className="letra-comivel">
                    {ch}
                  </span>
                ))}
                {p < linha.split(" ").length - 1 && <span>&nbsp;</span>}
              </span>
            ))}
          </span>
        ))}
      </h1>
      <canvas ref={tela} className="pointer-events-none absolute -left-10 -top-10" aria-hidden="true" />
    </div>
  );
}

const dist = (a: Ponto, b: Ponto) => Math.hypot(a.x - b.x, a.y - b.y);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
