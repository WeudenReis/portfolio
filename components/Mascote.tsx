"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { som } from "@/lib/sons";

// O bonequinho do logo </> acompanha a leitura. Ele escolhe, meio ao acaso, um lugar perto de onde
// a pessoa está lendo e faz algo que combina com o lugar: senta na beirada de cartões e imagens,
// fica do lado de títulos apontando para eles, aponta para botões e acena no rodapé. Quando o lugar
// dele sai da tela, ele pula para outro. Às vezes solta uma frase curta.
// Na capa ele mora dentro do logo e só sai quando a pessoa começa a rolar.
// Some com a cobrinha solta, com modal aberto e para quem pediu menos movimento.

type Pose = "sentado" | "acenando" | "apontando" | "pulando" | "espiando" | "em-pe";
type Tipo = "titulo" | "cartao" | "botao" | "rodape";
type Lugar = { el: Element; tipo: Tipo; frac: number };
type Ponto = { x: number; y: number };

const NAV = 64;
const FRASES: Record<Tipo | "rasgo" | "fim" | "parado" | "oi", string[]> = {
  titulo: ["Olha essa parte", "Lê comigo", "Essa é boa"],
  cartao: ["Senta aqui comigo", "Esse eu gosto", "Dá um preview aí"],
  botao: ["Clica aqui!", "Esse botão aqui", "Pode clicar"],
  rodape: ["Tchau! Volta sempre", "Chegamos no fim"],
  rasgo: ["Opa, rasgou!", "Ih, rasgou a página", "Rasga mais!"],
  fim: ["Chegamos no fim"],
  parado: ["Ainda tá aí?", "Rola mais um pouco"],
  oi: ["Oi!", "Oi, tudo bem?"],
};
const sortear = <T,>(l: T[]) => l[Math.floor(Math.random() * l.length)];

export default function Mascote() {
  const caixa = useRef<HTMLDivElement>(null);
  const figura = useRef<SVGSVGElement>(null);
  const [fala, setFala] = useState<string | null>(null);
  const caminho = useRef("/");
  const pathname = usePathname();
  caminho.current = pathname;
  const reiniciar = useRef<() => void>(() => {});

  useEffect(() => reiniciar.current(), [pathname]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = caixa.current!;
    const svg = figura.current!;
    const esc = () => (window.innerWidth < 640 ? 0.62 : 0.85);

    let lugar: Lugar | null = null;
    let pose: Pose = "em-pe";
    let lado = 1;
    let pos: Ponto = { x: -200, y: -200 };
    let pulo: { de: Ponto; t0: number; dur: number } | null = null;
    let escondido = true;
    let cobraAtiva = false;
    let ultimaFala = 0;
    let ultimaTroca = 0;
    let ultimaRolagem = 0;
    let ultimoMovimento = performance.now();
    let quadro = 0;

    const falar = (lista: string[], chance = 1) => {
      const agora = performance.now();
      if (agora - ultimaFala < 7000 || Math.random() > chance) return;
      ultimaFala = agora;
      setFala(sortear(lista));
      setTimeout(() => setFala(null), 2400);
    };

    const definirPose = (p: Pose) => {
      if (p === pose) return;
      pose = p;
      svg.setAttribute("class", `mascote pose-${p}`);
    };

    // ----- onde ele pode ficar -----
    const visivelDeVerdade = (alvo: Element, x: number, y: number) => {
      if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) return false;
      const topo = document.elementFromPoint(x, y);
      return !!topo && (topo === alvo || alvo.contains(topo) || topo.contains(alvo));
    };
    const candidatos = (): Lugar[] => {
      const lista: Lugar[] = [];
      const add = (sel: string, tipo: Tipo) =>
        document.querySelectorAll(sel).forEach((e) => {
          if (e.closest("[inert], [aria-hidden='true'], dialog, header, [data-cobra-hud], [data-sem-mascote]")) return;
          // botão dentro de cartão não: ele ficaria em cima do conteúdo; no cartão ele senta na beirada
          if (tipo === "botao" && e.closest(".caixa, article, figure, form")) return;
          const r = e.getBoundingClientRect();
          if (r.width < 60 || r.height < 16) return;
          const ref = tipo === "botao" || tipo === "titulo" ? r.bottom : r.top;
          if (ref < NAV + 70 || ref > window.innerHeight * 0.82) return;
          if (!visivelDeVerdade(e, r.left + r.width / 2, r.top + Math.min(r.height / 2, 20))) return;
          lista.push({ el: e, tipo, frac: 0.15 + Math.random() * 0.7 });
        });
      add("main h1, main h2", "titulo");
      add("main .caixa, main figure", "cartao");
      add("main .botao, main .botao-laranja, main .botao-tinta", "botao");
      add("footer", "rodape");
      return lista;
    };
    const escolher = () => {
      const lista = candidatos().filter((c) => c.el !== lugar?.el);
      if (!lista.length) return null;
      // prefere o que está perto do meio da tela, mas com sorteio
      const meio = window.innerHeight * 0.5;
      const pesos = lista.map((c) => {
        const r = c.el.getBoundingClientRect();
        const d = Math.abs((r.top + r.bottom) / 2 - meio) / window.innerHeight;
        return Math.max(0.05, 1 - d) * (c.tipo === "botao" ? 0.7 : 1);
      });
      let s = Math.random() * pesos.reduce((a, b) => a + b, 0);
      for (let i = 0; i < lista.length; i++) if ((s -= pesos[i]) <= 0) return lista[i];
      return lista[lista.length - 1];
    };

    // onde os pés (ou o quadril, sentado) ficam, e qual pose combina com o lugar
    const pontoDe = (l: Lugar): { p: Ponto; pose: Pose; lado: number } | null => {
      const r = l.el.getBoundingClientRect();
      const e = esc();
      if (!l.el.isConnected || r.width === 0) return null;
      if (l.tipo === "titulo") {
        // de pé logo depois do fim da última linha do título, apontando para ele
        const range = document.createRange();
        range.selectNodeContents(l.el);
        const linhas = range.getClientRects();
        const ult = linhas[linhas.length - 1] ?? r;
        const x = ult.right + 26 * e;
        if (x + 30 * e < window.innerWidth - 8)
          return { p: { x, y: ult.bottom - 6 * e }, pose: "apontando", lado: -1 };
        return { p: { x: r.left + 30 * e, y: r.top }, pose: "sentado", lado: 1 };
      }
      if (l.tipo === "botao") {
        if (r.left > 60 * e) return { p: { x: r.left - 24 * e, y: r.bottom }, pose: "apontando", lado: 1 };
        return { p: { x: r.right + 24 * e, y: r.bottom }, pose: "apontando", lado: -1 };
      }
      if (l.tipo === "rodape") return { p: { x: r.left + r.width * l.frac, y: r.top }, pose: "acenando", lado: 1 };
      const x = Math.min(r.right - 26 * e, Math.max(r.left + 26 * e, r.left + r.width * (l.frac > 0.5 ? 0.88 : 0.12)));
      return { p: { x, y: r.top + 2 }, pose: "sentado", lado: 1 };
    };
    const lugarValido = (l: Lugar | null) => {
      if (!l || !l.el.isConnected || l.el.closest("[inert]")) return false;
      const r = l.el.getBoundingClientRect();
      const ref = l.tipo === "botao" || l.tipo === "titulo" ? r.bottom : r.top;
      return ref > NAV + 40 && ref < window.innerHeight - 30;
    };

    const pular = (novo: Lugar | null) => {
      lugar = novo;
      ultimaTroca = performance.now();
      pulo = { de: { ...pos }, t0: performance.now(), dur: 650 };
      if (novo) setTimeout(() => lugar === novo && falar(FRASES[novo.tipo], 0.35), 700);
    };

    // na capa, ele sai de dentro do logo </>
    const logoNaTela = () => {
      if (caminho.current !== "/") return null;
      const logo = document.querySelector(".logo-tchau");
      if (!logo || window.scrollY > 40) return null;
      const r = logo.getBoundingClientRect();
      return r.bottom > NAV && r.top < window.innerHeight ? r : null;
    };

    const aoRolar = () => {
      ultimaRolagem = performance.now();
      ultimoMovimento = ultimaRolagem;
    };
    const aoCobra = (e: Event) => (cobraAtiva = (e as CustomEvent<boolean>).detail);
    const aoRasgo = (e: Event) => {
      if (!(e as CustomEvent<{ comecou: boolean }>).detail.comecou || escondido) return;
      falar(FRASES.rasgo, 0.6);
      if (!pulo) pulo = { de: { ...pos }, t0: performance.now(), dur: 450 };
    };
    reiniciar.current = () => {
      lugar = null;
      escondido = true;
    };
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("cobra:estado", aoCobra);
    window.addEventListener("rasgo:mudou", aoRasgo);

    const loop = (agora: number) => {
      quadro = requestAnimationFrame(loop);
      const e = esc();
      const logo = logoNaTela();
      const sumir = cobraAtiva || !!document.querySelector("dialog[open]") || !!logo;

      if (sumir) {
        if (!escondido) {
          escondido = true;
          el.style.opacity = "0";
        }
        // fica "guardado" dentro do logo, de onde vai sair
        if (logo) pos = { x: logo.left + logo.width / 2, y: logo.top + logo.height * 0.8 };
        lugar = null;
        return;
      }
      if (escondido) {
        escondido = false;
        el.style.opacity = "1";
        pular(escolher());
      }

      // troca de lugar: o atual saiu da tela, ou de vez em quando enquanto a pessoa rola
      const rolando = agora - ultimaRolagem < 400;
      if (!pulo && (!lugarValido(lugar) || (rolando && agora - ultimaTroca > 3500 && Math.random() < 0.015))) {
        const novo = escolher();
        if (novo || lugar) pular(novo);
      }
      // parado há muito tempo: muda de pose ou de lugar
      if (!pulo && !rolando && agora - ultimaTroca > 11000) {
        if (Math.random() < 0.5) pular(escolher());
        else {
          ultimaTroca = agora;
          if (agora - ultimoMovimento > 20000) falar(FRASES.parado, 0.5);
        }
      }

      let destino: Ponto;
      let novaPose: Pose;
      const info = lugar ? pontoDe(lugar) : null;
      if (info) {
        destino = info.p;
        novaPose = info.pose;
        lado = info.lado;
      } else {
        // sem lugar bom: espia pela beirada direita da tela
        destino = { x: window.innerWidth - 14 * e, y: window.innerHeight * 0.58 };
        novaPose = "espiando";
        lado = -1;
      }

      if (pulo) {
        const t = Math.min(1, (agora - pulo.t0) / pulo.dur);
        const s = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const altura = Math.min(160, 60 + Math.hypot(destino.x - pulo.de.x, destino.y - pulo.de.y) * 0.25) * e;
        pos = {
          x: pulo.de.x + (destino.x - pulo.de.x) * s,
          y: pulo.de.y + (destino.y - pulo.de.y) * s - Math.sin(Math.PI * t) * altura,
        };
        definirPose(t < 0.92 ? "pulando" : novaPose);
        if (t >= 1) pulo = null;
      } else {
        pos = destino;
        definirPose(novaPose);
      }

      // o ponto de apoio da figura (pés em pé, quadril sentado) fica na origem da caixa;
      // a escala e o espelho giram em volta dele
      const apoioY = pose === "sentado" ? 60 : 86;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      el.style.setProperty("--topo-fala", `${(6 - apoioY) * e - 6}px`);
      svg.style.top = `${-apoioY}px`;
      svg.style.transformOrigin = `30px ${apoioY}px`;
      svg.style.transform = `scale(${lado * e}, ${e})${pose === "espiando" ? " rotate(-18deg)" : ""}`;
    };
    quadro = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("cobra:estado", aoCobra);
      window.removeEventListener("rasgo:mudou", aoRasgo);
    };
  }, []);

  return (
    <div
      ref={caixa}
      className="pointer-events-none fixed left-0 top-0 z-40 opacity-0 transition-opacity duration-300"
      data-nao-comer
      aria-hidden="true"
    >
      {fala && (
        <span className="absolute left-0 top-[var(--topo-fala)] -translate-x-1/2 -translate-y-full animate-[surgir_0.2s_ease-out] whitespace-nowrap rounded-lg border-[2.5px] border-tinta bg-white px-2 py-0.5 font-mao text-sm shadow-brutal-sm">
          {fala}
        </span>
      )}
      <svg
        ref={figura}
        viewBox="0 0 60 90"
        width="60"
        height="90"
        className="mascote pose-em-pe"
        style={{ position: "absolute", left: -30, top: -86 }}
        overflow="visible"
        onClick={() => {
          som.tchau();
          setFala(sortear(FRASES.oi));
          setTimeout(() => setFala(null), 1800);
        }}
      >
        <g className="m-perna m-perna-esq"><line x1="30" y1="58" x2="22" y2="85" /></g>
        <g className="m-perna m-perna-dir"><line x1="30" y1="58" x2="38" y2="85" /></g>
        <line className="m-tronco-contorno" x1="30" y1="31" x2="30" y2="58" />
        <line className="m-tronco" x1="30" y1="31" x2="30" y2="58" />
        <g className="m-braco m-braco-esq"><line x1="30" y1="37" x2="17" y2="51" /></g>
        <g className="m-braco m-braco-dir"><line x1="30" y1="37" x2="43" y2="51" /></g>
        <g className="m-cabeca">
          <circle className="m-rosto" cx="30" cy="18" r="10" />
          <g className="m-olhos">
            <circle cx="26.6" cy="17" r="1.7" />
            <circle cx="33.4" cy="17" r="1.7" />
          </g>
          <path className="m-boca" d="M26.5 21.5 Q30 24.5 33.5 21.5" />
        </g>
      </svg>
    </div>
  );
}
