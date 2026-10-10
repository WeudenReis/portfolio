"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { som } from "@/lib/sons";

// O bonequinho do logo </> que acompanha a leitura.
// - Fica num lugar perto do que a pessoa está lendo (senta em cartões, aponta títulos e botões, acena no
//   rodapé) e só muda quando esse lugar sai da tela, para não poluir.
// - Dá para pegar com o mouse ou o dedo: ele fica pendurado pela mão no cursor e balança; ao soltar, é
//   arremessado, cai com gravidade, quica no chão da tela e pode pousar sentado em cima de um cartão.
// - De vez em quando, parado, ele apronta: empurra uma letra de um título e ela deita, ou derruba uma
//   palavra inteira como dominó; depois as letras se levantam sozinhas.
// - Os olhos seguem o cursor. Fala pouco e não repete as frases recentes.
// Na capa ele mora dentro do logo </> e sai quando a pessoa rola. Some com a cobrinha solta,
// com modal aberto e para quem pediu menos movimento.

type Pose =
  | "em-pe" | "sentado" | "acenando" | "apontando" | "pulando" | "espiando"
  | "andando" | "empurrando" | "segurado" | "voando" | "tonto";
type Tipo = "titulo" | "cartao" | "botao" | "rodape";
type P = { x: number; y: number };
// "fixo": preso a um ponto do elemento (depois de pousar nele ou de aprontar ali)
type Lugar = { el: Element; tipo: Tipo; frac: number; fixo?: { dx: number; dy: number; pose: Pose; lado: number } };
type Modo = "parado" | "pulando" | "arrastando" | "voando" | "caido" | "travessura";
type Travessura = {
  fase: "indo" | "empurrando" | "caidas" | "voltando";
  h: Element;
  no: Text; // nó de texto original (o que o React conhece): tudo volta para ele no fim
  ini: number;
  fim: number;
  alvo: number; // letra (dentro da palavra) onde ele encosta
  jeito: "deitar" | "domino";
  criados: Set<Text>;
  spans: HTMLSpanElement[];
  t: number;
  topo0: number;
  caiu: boolean;
};

const NAV = 64;
// pontos do desenho (viewBox 0 0 60 90)
const PES: P = { x: 30, y: 86 };
const QUADRIL: P = { x: 30, y: 60 };
const CENTRO: P = { x: 30, y: 50 };
const MAO: P = { x: 41.5, y: 21.8 }; // mão direita levantada, na pose "segurado"
const GRAVIDADE = 2300;

const FRASES = {
  titulo: [
    "Esse título ficou bonito", "Lê comigo essa parte", "Olha que capricho", "Gostei dessa letra",
    "Psiu, lê isso aqui", "Esse marca-texto é meu", "Título bom é título curto", "Essa parte eu ajudei",
  ],
  cartao: [
    "Vou sentar aqui um pouco", "Lugar confortável", "Esse projeto eu acompanhei", "Dá um preview, vai",
    "Daqui eu vejo tudo", "Cheguei!", "Que vista boa daqui", "Esse aqui deu trabalho",
  ],
  botao: ["Clica aqui!", "Esse botão leva longe", "Pode clicar, não morde", "Aperta, aperta!", "Tô de olho nesse botão"],
  rodape: ["Chegamos no fim", "Tchau! Volta sempre", "Fim da linha, pessoal", "Gostou? Manda um oi"],
  rasgo: ["Opa, rasgou!", "Ih, rasgou a página", "Rasga mais!", "Alguém traz a fita?", "Isso não fui eu"],
  parado: ["Ainda tá aí?", "Rola mais um pouco", "Tô esperando...", "Quer jogar a cobrinha?", "Me pega e me joga, vai"],
  oi: ["Oi!", "Oi, tudo bem?", "Ei, você!", "Olá, humano", "Bem-vindo!", "Cócegas não!"],
  segurado: ["Ei, me solta!", "Uaaau!", "Mais alto!", "Isso é sequestro?", "Cuidado comigo!", "Tô voando!"],
  pouso: ["Ai!", "Tô bem, tô bem", "De novo!", "Pouso perfeito", "Essa doeu um pouco", "Que tombo"],
  travessura: ["Ops", "Foi sem querer", "Essa letra tava torta", "Ninguém viu nada", "Quem colocou isso aqui?", "Dominó!"],
  levantar: ["Pronto, arrumei", "Tá novinho", "Como se nada tivesse acontecido"],
};
type Chave = keyof typeof FRASES;

const sortear = <T,>(l: T[]) => l[Math.floor(Math.random() * l.length)];
// não repete as frases mais recentes de cada lista
const recentes: Partial<Record<Chave, string[]>> = {};
function frase(c: Chave) {
  const lista = FRASES[c];
  const usadas = (recentes[c] ??= []);
  const livres = lista.filter((f) => !usadas.includes(f));
  const f = sortear(livres.length ? livres : lista);
  usadas.push(f);
  if (usadas.length > Math.ceil(lista.length / 2)) usadas.shift();
  return f;
}
const chaveDe: Record<Tipo, Chave> = { titulo: "titulo", cartao: "cartao", botao: "botao", rodape: "rodape" };

export default function Mascote() {
  const caixa = useRef<HTMLDivElement>(null);
  const figura = useRef<SVGSVGElement>(null);
  const balao = useRef<HTMLSpanElement>(null);
  const [fala, setFala] = useState<string | null>(null);
  const pathname = usePathname();
  const caminho = useRef(pathname);
  caminho.current = pathname;
  const aoTrocarPagina = useRef<() => void>(() => {});

  useEffect(() => aoTrocarPagina.current(), [pathname]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = caixa.current!;
    const svg = figura.current!;
    const olhar = svg.querySelector<SVGGElement>(".m-olhar")!;
    const esc = () => (window.innerWidth < 640 ? 0.62 : 0.85);

    let modo: Modo = "parado";
    let lugar: Lugar | null = null;
    let pose: Pose = "em-pe";
    let lado = 1;
    let pos: P = { x: -300, y: -300 }; // ponto de apoio da pose atual, na tela
    let escondido = true;
    let cobraAtiva = false;
    let pulo: { de: P; t0: number; dur: number; destino?: () => P | null; depois: Modo } | null = null;
    let corpo = { x: 0, y: 0, vx: 0, vy: 0, giro: 0 }; // centro do corpo, em voo
    let balanco = { a: 0, v: 0 }; // pendurado no cursor
    let rastro: { x: number; y: number; t: number }[] = [];
    let inicioArrasto = { x: 0, y: 0, t: 0 };
    let arrastou = 0;
    let falouSegurado = false;
    let lugarAntes: Lugar | null = null;
    let caidoAte = 0;
    let acenoAte = 0;
    let trav: Travessura | null = null;
    let proximaTravessura = performance.now() + 18000 + Math.random() * 14000;
    let ultimaFala = 0;
    let ultimaRolagem = 0;
    let ultimaInteracao = performance.now();
    let falouParado = false;
    let falaNaTela = false;
    let mouse: P | null = null;
    let superficies: { el: Element; r: DOMRect }[] = [];
    let superficiesEm = 0;
    let ultimoTombo = 0;
    let timerFala = 0;
    let falaInteracao = false;
    let apoioAtual: P = PES;
    let ultimoAjuste = 0;
    let quadro = 0;
    let ultimo = performance.now();

    // ---------- fala ----------
    const falar = (c: Chave, chance = 1, interacao = false) => {
      const agora = performance.now();
      if (Math.random() > chance) return;
      if (interacao ? agora - ultimaFala < 1200 : agora - ultimaFala < 16000) return;
      ultimaFala = agora;
      falaNaTela = true;
      falaInteracao = interacao;
      ultimoAjuste = 0;
      setFala(frase(c));
      clearTimeout(timerFala);
      timerFala = window.setTimeout(() => {
        falaNaTela = false;
        setFala(null);
      }, 2600);
    };

    const definirPose = (p: Pose) => {
      if (p === pose) return;
      pose = p;
      svg.setAttribute("class", `mascote pose-${p}`);
    };

    // ---------- desenho ----------
    const desenhar = (p: P, a: P, rot = 0) => {
      const e = esc();
      apoioAtual = a;
      el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      svg.style.left = `${-a.x}px`;
      svg.style.top = `${-a.y}px`;
      svg.style.transformOrigin = `${a.x}px ${a.y}px`;
      svg.style.transform = `scale(${lado * e}, ${e}) rotate(${rot}deg)`;
    };
    // ---------- balão de fala que não tampa texto ----------
    // testa algumas posições em volta dele e fica com a que cobre menos texto, botão ou imagem
    const textoEm = (x: number, y: number) => {
      const alvo = document.elementFromPoint(x, y);
      if (!alvo || alvo.closest("[data-mascote]")) return false;
      const tag = alvo.tagName.toUpperCase();
      if (["HTML", "BODY", "MAIN", "SECTION", "HEADER"].includes(tag)) return false;
      if (["IMG", "SVG", "CANVAS", "INPUT", "TEXTAREA", "SELECT", "BUTTON", "VIDEO", "IFRAME"].includes(tag)) return true;
      for (const n of alvo.childNodes) if (n.nodeType === Node.TEXT_NODE && n.textContent?.trim()) return true;
      return !!alvo.closest("a, button, h1, h2, h3, p, li, label, figcaption, code, strong, blockquote, dd, dt");
    };
    const ajustarBalao = (agora: number) => {
      const b = balao.current;
      if (!b || !falaNaTela || agora - ultimoAjuste < 120) return;
      ultimoAjuste = agora;
      const e = esc();
      const w = b.offsetWidth;
      const h = b.offsetHeight;
      const cabeca = (8 - apoioAtual.y) * e; // topo da cabeça em relação ao ponto de apoio
      const opcoes = [
        { x: -w / 2, y: cabeca - h - 8 },
        { x: -w - 6, y: cabeca - h + 4 },
        { x: 6, y: cabeca - h + 4 },
        { x: -w - 28 * e, y: cabeca + 6 },
        { x: 28 * e, y: cabeca + 6 },
      ];
      let melhor = { x: opcoes[0].x, y: opcoes[0].y, nota: Infinity };
      for (const o of opcoes) {
        // mantém dentro da tela
        const sx = Math.min(window.innerWidth - w - 6, Math.max(6, pos.x + o.x));
        const sy = Math.min(window.innerHeight - h - 6, Math.max(NAV + 6, pos.y + o.y));
        let nota = Math.hypot(sx - (pos.x + o.x), sy - (pos.y + o.y)) > 80 ? 1 : 0;
        for (const [fx, fy] of [[0.08, 0.2], [0.5, 0.2], [0.92, 0.2], [0.08, 0.8], [0.5, 0.8], [0.92, 0.8]])
          if (textoEm(sx + w * fx, sy + h * fy)) nota++;
        if (nota < melhor.nota) melhor = { x: sx - pos.x, y: sy - pos.y, nota };
        if (nota === 0) break;
      }
      // fala espontânea que só caberia em cima de texto: melhor ficar quieto
      if (!falaInteracao && melhor.nota >= 2) {
        falaNaTela = false;
        clearTimeout(timerFala);
        setFala(null);
        return;
      }
      b.style.left = `${melhor.x}px`;
      b.style.top = `${melhor.y}px`;
      b.style.visibility = "visible";
    };

    // os olhos seguem o cursor
    const olharPara = () => {
      if (!mouse) return;
      const r = svg.getBoundingClientRect();
      const dx = mouse.x - (r.left + r.width / 2);
      const dy = mouse.y - (r.top + r.height * 0.2);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 120) * 1.4;
      olhar.style.transform = `translate(${(dx / d) * k * lado}px, ${(dy / d) * k}px)`;
    };

    // ---------- lugares ----------
    const visivelDeVerdade = (alvo: Element, x: number, y: number) => {
      if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) return false;
      const topo = document.elementFromPoint(x, y);
      return !!topo && (topo === alvo || alvo.contains(topo) || topo.contains(alvo));
    };
    const fora = (e: Element) => !!e.closest("[inert], [aria-hidden='true'], dialog, header, [data-cobra-hud], [data-sem-mascote]");
    const candidatos = (): Lugar[] => {
      const lista: Lugar[] = [];
      const add = (sel: string, tipo: Tipo) =>
        document.querySelectorAll(sel).forEach((e) => {
          if (fora(e)) return;
          // botão dentro de cartão não: ele ficaria em cima do conteúdo; no cartão ele senta na beirada
          if (tipo === "botao" && e.closest(".caixa, article, figure, form")) return;
          const r = e.getBoundingClientRect();
          if (r.width < 60 || r.height < 16) return;
          const ref = tipo === "botao" || tipo === "titulo" ? r.bottom : r.top;
          if (ref < NAV + 70 || ref > window.innerHeight * 0.85) return;
          if (!visivelDeVerdade(e, r.left + r.width / 2, r.top + Math.min(r.height / 2, 20))) return;
          lista.push({ el: e, tipo, frac: 0.15 + Math.random() * 0.7 });
        });
      add("main h1, main h2", "titulo");
      add("main .caixa, main figure", "cartao");
      add("main .botao, main .botao-laranja, main .botao-tinta", "botao");
      add("footer", "rodape");
      return lista;
    };
    // prefere um lugar perto de onde ele já está, para não cruzar a tela à toa
    const escolher = (perto: P): Lugar | null => {
      const lista = candidatos().filter((c) => c.el !== lugar?.el);
      if (!lista.length) return null;
      const diag = Math.hypot(window.innerWidth, window.innerHeight);
      const pesos = lista.map((c) => {
        const r = c.el.getBoundingClientRect();
        const d = Math.hypot((r.left + r.right) / 2 - perto.x, (r.top + r.bottom) / 2 - perto.y) / diag;
        return Math.pow(Math.max(0.03, 1 - d), 3) * (c.tipo === "botao" ? 0.6 : 1);
      });
      let s = Math.random() * pesos.reduce((a, b) => a + b, 0);
      for (let i = 0; i < lista.length; i++) if ((s -= pesos[i]) <= 0) return lista[i];
      return lista[lista.length - 1];
    };
    const pontoDe = (l: Lugar): { p: P; pose: Pose; lado: number; apoio: P } | null => {
      if (!l.el.isConnected || l.el.closest("[inert]")) return null;
      const r = l.el.getBoundingClientRect();
      if (r.width === 0) return null;
      const e = esc();
      if (l.fixo) {
        const f = l.fixo;
        return { p: { x: r.left + f.dx, y: r.top + f.dy }, pose: f.pose, lado: f.lado, apoio: f.pose === "sentado" ? QUADRIL : PES };
      }
      if (l.tipo === "titulo") {
        // de pé logo depois do fim da última linha do título, apontando para ele
        const range = document.createRange();
        range.selectNodeContents(l.el);
        const linhas = range.getClientRects();
        const ult = linhas[linhas.length - 1] ?? r;
        const x = ult.right + 26 * e;
        if (x + 30 * e < window.innerWidth - 8) return { p: { x, y: ult.bottom - 6 * e }, pose: "apontando", lado: -1, apoio: PES };
        return { p: { x: r.left + 30 * e, y: r.top }, pose: "sentado", lado: 1, apoio: QUADRIL };
      }
      if (l.tipo === "botao") {
        if (r.left > 60 * e) return { p: { x: r.left - 24 * e, y: r.bottom }, pose: "apontando", lado: 1, apoio: PES };
        return { p: { x: r.right + 24 * e, y: r.bottom }, pose: "apontando", lado: -1, apoio: PES };
      }
      if (l.tipo === "rodape") return { p: { x: r.left + r.width * l.frac, y: r.top }, pose: "acenando", lado: 1, apoio: PES };
      const x = Math.min(r.right - 26 * e, Math.max(r.left + 26 * e, r.left + r.width * (l.frac > 0.5 ? 0.88 : 0.12)));
      return { p: { x, y: r.top + 2 }, pose: "sentado", lado: 1, apoio: QUADRIL };
    };
    const dentroDaTela = (p: P) => p.y > NAV + 8 && p.y < window.innerHeight - 4 && p.x > 0 && p.x < window.innerWidth;

    const pularPara = (novo: Lugar | null, de: P) => {
      lugar = novo;
      modo = "pulando";
      pulo = { de: { ...de }, t0: performance.now(), dur: 650, depois: "parado" };
      if (novo) {
        const alvo = novo;
        setTimeout(() => lugar === alvo && modo === "parado" && falar(chaveDe[alvo.tipo], 0.22), 800);
      }
    };

    // na capa, ele mora dentro do logo </>
    const logoNaTela = () => {
      if (caminho.current !== "/" || window.scrollY > 40) return null;
      const logo = document.querySelector(".logo-tchau");
      if (!logo) return null;
      const r = logo.getBoundingClientRect();
      return r.bottom > NAV && r.top < window.innerHeight ? r : null;
    };

    // ---------- travessura: empurrar letras ----------
    // onde os pés ficam para as mãos encostarem na letra
    const pontoDaLetra = (): P | null => {
      if (!trav) return null;
      const e = esc();
      let r: DOMRect;
      if (trav.spans.length) r = trav.spans[0].getBoundingClientRect();
      else {
        if (!trav.no.isConnected || trav.no.data.length < trav.fim) return null;
        const range = document.createRange();
        range.setStart(trav.no, trav.ini + trav.alvo);
        range.setEnd(trav.no, trav.ini + trav.alvo + 1);
        r = range.getBoundingClientRect();
      }
      if (r.width === 0 || r.left - 40 * e < 0) return null;
      return { x: r.left - 15 * e, y: r.top + r.height * 0.84 };
    };
    const iniciarTravessura = (): boolean => {
      const titulos = [...document.querySelectorAll("main h1, main h2")].filter((h) => {
        if (fora(h) || h.closest("[data-nao-comer]") || h.querySelector("[data-nao-comer], .riscado, .digitando")) return false;
        const r = h.getBoundingClientRect();
        return r.top > NAV + 50 && r.bottom < window.innerHeight - 50 && r.width > 80 && visivelDeVerdade(h, r.left + 8, r.top + r.height / 2);
      });
      if (!titulos.length) return false;
      const h = lugar?.tipo === "titulo" && titulos.includes(lugar.el) ? lugar.el : sortear(titulos);
      const palavras: { no: Text; ini: number; fim: number }[] = [];
      const andador = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
      for (let n = andador.nextNode() as Text | null; n; n = andador.nextNode() as Text | null) {
        if (n.parentElement?.closest(".sr-only, [aria-hidden='true']")) continue;
        for (const m of n.data.matchAll(/\p{L}{3,}/gu)) palavras.push({ no: n, ini: m.index!, fim: m.index! + m[0].length });
      }
      if (!palavras.length) return false;
      const w = sortear(palavras);
      const jeito = Math.random() < 0.55 ? "deitar" : "domino";
      const alvo = jeito === "domino" ? 0 : 1 + Math.floor(Math.random() * (w.fim - w.ini - 1));
      trav = {
        fase: "indo", h, no: w.no, ini: w.ini, fim: w.fim, alvo, jeito,
        criados: new Set(), spans: [], t: performance.now(), topo0: h.getBoundingClientRect().top, caiu: false,
      };
      if (!pontoDaLetra()) {
        trav = null;
        return false;
      }
      modo = "travessura";
      return true;
    };
    // separa a palavra em letras e embrulha as que vão cair (sem deixar o nó original vazio)
    const embrulhar = (t: Travessura) => {
      const { no, ini, fim } = t;
      const tam = fim - ini;
      let atual: Text = ini > 0 ? no.splitText(ini) : no;
      if (atual !== no) t.criados.add(atual);
      if (atual.data.length > tam) t.criados.add(atual.splitText(tam));
      const letras: Text[] = [];
      for (let k = 0; k < tam; k++) {
        letras.push(atual);
        if (k < tam - 1) {
          atual = atual.splitText(1);
          t.criados.add(atual);
        }
      }
      const alvos = t.jeito === "domino" ? letras : [letras[t.alvo]];
      for (const l of alvos) {
        const s = document.createElement("span");
        s.style.display = "inline-block";
        s.style.transformOrigin = "100% 88%";
        s.style.transition = "transform 0.42s cubic-bezier(0.55, 0, 0.9, 0.45)";
        l.parentNode!.insertBefore(s, l);
        s.appendChild(l);
        t.spans.push(s);
      }
    };
    // desfaz tudo: tira os embrulhos e junta os pedaços de volta no nó original
    const desfazer = (t: Travessura) => {
      for (const s of t.spans) {
        if (s.firstChild && s.parentNode) s.parentNode.insertBefore(s.firstChild, s);
        s.remove();
      }
      t.spans = [];
      const no = t.no;
      let prox = no.nextSibling;
      while (prox && prox.nodeType === Node.TEXT_NODE && t.criados.has(prox as Text)) {
        no.data += (prox as Text).data;
        const depois: ChildNode | null = prox.nextSibling;
        prox.remove();
        prox = depois;
      }
    };
    const pararTravessura = (agora: number) => {
      if (trav) desfazer(trav);
      trav = null;
      proximaTravessura = agora + 30000 + Math.random() * 25000;
    };
    const passoTravessura = (agora: number, dt: number) => {
      const t = trav!;
      const e = esc();
      // rolou a página ou o título sumiu: arruma tudo na hora
      if (!t.h.isConnected || Math.abs(t.h.getBoundingClientRect().top - t.topo0) > 24) {
        pararTravessura(agora);
        modo = "parado";
        return;
      }
      const alvo = pontoDaLetra();
      if (!alvo) {
        pararTravessura(agora);
        modo = "parado";
        return;
      }
      if (t.fase === "indo") {
        const dx = alvo.x - pos.x;
        const dy = alvo.y - pos.y;
        if (Math.hypot(dx, dy) > 220) {
          // longe: vai pulando
          modo = "pulando";
          pulo = { de: { ...pos }, t0: agora, dur: 600, destino: pontoDaLetra, depois: "travessura" };
          return;
        }
        if (Math.abs(dx) < 2.5 && Math.abs(dy) < 2.5) {
          pos = alvo;
          lado = 1;
          embrulhar(t);
          t.fase = "empurrando";
          t.t = agora;
        } else {
          lado = dx >= 0 ? 1 : -1;
          const passo = Math.min(Math.abs(dx), 160 * dt);
          pos = { x: pos.x + Math.sign(dx) * passo, y: pos.y + dy * Math.min(1, dt * 10) };
          definirPose("andando");
          desenhar(pos, PES);
          return;
        }
      }
      if (t.fase === "empurrando") {
        definirPose("empurrando");
        const decorrido = agora - t.t;
        // um empurrãozinho para frente
        desenhar({ x: pos.x + Math.min(1, decorrido / 260) * 5 * e, y: pos.y }, PES, 10);
        if (decorrido > 260 && !t.caiu) {
          t.caiu = true;
          t.spans.forEach((s, k) => {
            s.style.transitionDelay = `${k * 95}ms`;
            s.style.transform = `rotate(${t.jeito === "domino" && k < t.spans.length - 1 ? 74 : 90}deg)`;
          });
          if (t.jeito === "domino") t.spans.forEach((_, k) => setTimeout(() => som.toc(), k * 95 + 200));
          else setTimeout(() => som.tombo(0.5), 300);
          falar("travessura", 0.45, true);
        }
        if (decorrido > 260 + t.spans.length * 95 + 500) {
          t.fase = "caidas";
          t.t = agora;
        }
        return;
      }
      if (t.fase === "caidas") {
        definirPose(agora - t.t > 900 ? "acenando" : "em-pe");
        desenhar(pos, PES);
        if (agora - t.t > 2600) {
          const n = t.spans.length;
          t.spans.forEach((s, k) => {
            s.style.transition = "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)";
            s.style.transitionDelay = `${(n - 1 - k) * 70}ms`;
            s.style.transform = "";
          });
          falar("levantar", 0.35, true);
          t.fase = "voltando";
          t.t = agora;
        }
        return;
      }
      if (t.fase === "voltando") {
        definirPose("em-pe");
        desenhar(pos, PES);
        if (agora - t.t > 650 + t.spans.length * 70) {
          const r = t.h.getBoundingClientRect();
          lugar = { el: t.h, tipo: "titulo", frac: 0, fixo: { dx: pos.x - r.left, dy: pos.y - r.top, pose: "em-pe", lado: 1 } };
          pararTravessura(agora);
          modo = "parado";
        }
      }
    };

    // ---------- pegar e arremessar ----------
    const aoApertar = (ev: PointerEvent) => {
      if (escondido) return;
      ev.preventDefault();
      svg.setPointerCapture(ev.pointerId);
      const agora = performance.now();
      if (trav) pararTravessura(agora);
      lugarAntes = modo === "parado" ? lugar : null;
      modo = "arrastando";
      pulo = null;
      lado = 1;
      pos = { x: ev.clientX, y: ev.clientY };
      mouse = { ...pos };
      rastro = [{ ...pos, t: agora }];
      inicioArrasto = { ...pos, t: agora };
      arrastou = 0;
      falouSegurado = false;
      balanco = { a: 0, v: 0 };
      ultimaInteracao = agora;
      falouParado = false;
      document.documentElement.style.cursor = "grabbing";
    };
    const aoMoverPonteiro = (ev: PointerEvent) => {
      mouse = { x: ev.clientX, y: ev.clientY };
      if (modo !== "arrastando") return;
      const agora = performance.now();
      arrastou = Math.max(arrastou, Math.hypot(ev.clientX - inicioArrasto.x, ev.clientY - inicioArrasto.y));
      if (arrastou > 14 && !falouSegurado) {
        falouSegurado = true;
        falar("segurado", 0.7, true);
      }
      pos = { x: ev.clientX, y: ev.clientY };
      rastro.push({ ...pos, t: agora });
      while (rastro.length > 2 && agora - rastro[0].t > 100) rastro.shift();
    };
    const aoSoltarPonteiro = () => {
      if (modo !== "arrastando") return;
      document.documentElement.style.cursor = "";
      const agora = performance.now();
      if (arrastou < 6 && agora - inicioArrasto.t < 400) {
        // foi só um clique: acena e fica onde estava
        som.tchau();
        falar("oi", 1, true);
        acenoAte = agora + 1600;
        lugar = lugarAntes;
        modo = "parado";
        return;
      }
      const a = rastro[0];
      const b = rastro[rastro.length - 1];
      const dtv = Math.max(16, b.t - a.t) / 1000;
      let vx = (b.x - a.x) / dtv;
      let vy = (b.y - a.y) / dtv;
      if (agora - b.t > 120) vx = vy = 0; // segurou parado antes de soltar: só cai
      const v = Math.hypot(vx, vy);
      if (v > 2600) {
        vx *= 2600 / v;
        vy *= 2600 / v;
      }
      // a mão está no cursor; o voo usa o centro do corpo
      const e = esc();
      const giro = -22 + balanco.a;
      const ang = (giro * Math.PI) / 180;
      const ox = (CENTRO.x - MAO.x) * e;
      const oy = (CENTRO.y - MAO.y) * e;
      corpo = {
        x: pos.x + ox * Math.cos(ang) - oy * Math.sin(ang),
        y: pos.y + ox * Math.sin(ang) + oy * Math.cos(ang),
        vx,
        vy,
        giro,
      };
      superficiesEm = 0;
      modo = "voando";
    };
    const aoCancelar = () => {
      if (modo === "arrastando") aoSoltarPonteiro();
    };

    const atualizarSuperficies = (agora: number) => {
      if (agora - superficiesEm < 200) return;
      superficiesEm = agora;
      superficies = [];
      document.querySelectorAll("main .caixa, main figure, footer").forEach((s) => {
        if (fora(s)) return;
        const r = s.getBoundingClientRect();
        if (r.width > 60 && r.bottom > NAV && r.top < window.innerHeight) superficies.push({ el: s, r });
      });
    };
    const tombo = (agora: number, forca: number) => {
      if (agora - ultimoTombo < 150) return;
      ultimoTombo = agora;
      som.tombo(forca);
    };

    // ---------- eventos ----------
    const aoRolar = () => (ultimaRolagem = performance.now());
    const aoCobra = (e: Event) => (cobraAtiva = (e as CustomEvent<boolean>).detail);
    // para testar: window.dispatchEvent(new Event("mascote:aprontar")) faz ele aprontar logo
    const aoAprontar = () => {
      proximaTravessura = 0;
      ultimaRolagem = 0;
    };
    const aoRasgo = (e: Event) => {
      if (!(e as CustomEvent<{ comecou: boolean }>).detail.comecou || escondido || modo !== "parado") return;
      falar("rasgo", 0.35);
    };
    aoTrocarPagina.current = () => {
      if (trav) pararTravessura(performance.now());
      lugar = null;
      if (modo !== "arrastando" && modo !== "voando") modo = "parado";
    };
    svg.addEventListener("pointerdown", aoApertar);
    window.addEventListener("pointermove", aoMoverPonteiro, { passive: true });
    window.addEventListener("pointerup", aoSoltarPonteiro);
    window.addEventListener("pointercancel", aoCancelar);
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("cobra:estado", aoCobra);
    window.addEventListener("rasgo:mudou", aoRasgo);
    window.addEventListener("mascote:aprontar", aoAprontar);

    // ---------- laço ----------
    const loop = (agora: number) => {
      quadro = requestAnimationFrame(loop);
      const dt = Math.min(0.04, (agora - ultimo) / 1000);
      ultimo = agora;
      const e = esc();
      const logo = logoNaTela();
      const ocupado = modo === "arrastando" || modo === "voando";
      const sumir = cobraAtiva || !!document.querySelector("dialog[open]") || (!!logo && !ocupado);

      if (sumir) {
        if (trav) pararTravessura(agora);
        if (!escondido) {
          escondido = true;
          el.style.opacity = "0";
        }
        if (modo === "arrastando") document.documentElement.style.cursor = "";
        modo = "parado";
        pulo = null;
        lugar = null;
        if (logo) pos = { x: logo.left + logo.width / 2, y: logo.top + logo.height * 0.8 };
        return;
      }
      if (escondido) {
        escondido = false;
        el.style.opacity = "1";
        pularPara(escolher(pos), pos);
      }

      if (modo === "arrastando") {
        // pendurado pela mão no cursor, balançando com o movimento
        const a = rastro[0];
        const b = rastro[rastro.length - 1];
        const vx = b && a && b.t > a.t ? (b.x - a.x) / ((b.t - a.t) / 1000) : 0;
        const alvo = Math.max(-45, Math.min(45, -vx * 0.035));
        balanco.v += ((alvo - balanco.a) * 60 - balanco.v * 7) * dt;
        balanco.a += balanco.v * dt;
        lado = 1;
        definirPose("segurado");
        desenhar(pos, MAO, -22 + balanco.a);
      } else if (modo === "voando") {
        corpo.vy += GRAVIDADE * dt;
        corpo.vx *= 1 - 0.5 * dt;
        const pesAntes = corpo.y + 36 * e;
        corpo.x += corpo.vx * dt;
        corpo.y += corpo.vy * dt;
        corpo.giro += corpo.vx * 0.3 * dt;
        const pes = corpo.y + 36 * e;
        if (corpo.x < 22) {
          corpo.x = 22;
          corpo.vx = Math.abs(corpo.vx) * 0.5;
        }
        if (corpo.x > window.innerWidth - 22) {
          corpo.x = window.innerWidth - 22;
          corpo.vx = -Math.abs(corpo.vx) * 0.5;
        }
        if (corpo.y < NAV + 30) {
          corpo.y = NAV + 30;
          corpo.vy = Math.abs(corpo.vy) * 0.3;
        }
        // pousa em cima de um cartão se cair bem na beirada dele
        let pousou = false;
        if (corpo.vy > 0) {
          atualizarSuperficies(agora);
          for (const s of superficies) {
            if (pesAntes <= s.r.top && pes >= s.r.top && corpo.x > s.r.left + 12 && corpo.x < s.r.right - 12) {
              lado = corpo.vx >= 0 ? 1 : -1;
              lugar = {
                el: s.el,
                tipo: s.el.tagName === "FOOTER" ? "rodape" : "cartao",
                frac: 0,
                fixo: { dx: corpo.x - s.r.left, dy: 2, pose: "sentado", lado },
              };
              modo = "parado";
              pousou = true;
              tombo(agora, 0.4);
              falar("pouso", 0.6, true);
              break;
            }
          }
        }
        if (!pousou) {
          const chao = window.innerHeight - 4;
          if (pes >= chao) {
            corpo.y = chao - 36 * e;
            if (corpo.vy > 420) {
              corpo.vy = -corpo.vy * 0.38;
              corpo.vx *= 0.7;
              tombo(agora, 0.5);
            } else {
              modo = "caido";
              pos = { x: corpo.x, y: chao };
              caidoAte = agora + 1400;
              tombo(agora, 0.6);
              falar("pouso", 0.7, true);
            }
          }
          if (modo === "voando") {
            definirPose("voando");
            desenhar({ x: corpo.x, y: corpo.y }, CENTRO, corpo.giro);
          }
        }
      } else if (modo === "caido") {
        definirPose("tonto");
        desenhar(pos, { x: 30, y: 63 });
        if (agora > caidoAte) pularPara(escolher(pos), pos);
      } else if (modo === "pulando" && pulo) {
        const destino = pulo.destino ? pulo.destino() : lugar ? (pontoDe(lugar)?.p ?? null) : null;
        const fim = destino ?? { x: window.innerWidth - 14 * e, y: window.innerHeight * 0.58 };
        const t = Math.min(1, (agora - pulo.t0) / pulo.dur);
        const s = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const altura = Math.min(160, 60 + Math.hypot(fim.x - pulo.de.x, fim.y - pulo.de.y) * 0.25) * e;
        pos = { x: pulo.de.x + (fim.x - pulo.de.x) * s, y: pulo.de.y + (fim.y - pulo.de.y) * s - Math.sin(Math.PI * t) * altura };
        lado = fim.x >= pulo.de.x ? 1 : -1;
        definirPose("pulando");
        desenhar(pos, PES);
        if (t >= 1) {
          modo = pulo.depois;
          pulo = null;
        }
      } else if (modo === "travessura" && trav) {
        passoTravessura(agora, dt);
      } else {
        modo = "parado";
        const info = lugar ? pontoDe(lugar) : null;
        if (!info || !dentroDaTela(info.p)) {
          // o lugar dele saiu da tela: procura outro perto
          const novo = escolher(pos);
          if (novo) pularPara(novo, pos);
          else {
            lugar = null;
            lado = -1;
            pos = { x: window.innerWidth - 14 * e, y: window.innerHeight * 0.58 };
            definirPose("espiando");
            desenhar(pos, PES, -18);
          }
        } else {
          pos = info.p;
          lado = info.lado;
          definirPose(agora < acenoAte ? "acenando" : info.pose);
          desenhar(pos, info.apoio);
          const quieto = agora - ultimaRolagem > 6000;
          if (quieto && agora > proximaTravessura && !falaNaTela) {
            if (!iniciarTravessura()) proximaTravessura = agora + 15000;
          }
          if (agora - ultimaInteracao > 45000 && agora - ultimaRolagem > 45000 && !falouParado) {
            falouParado = true;
            falar("parado", 1);
          }
        }
      }
      olharPara();
      ajustarBalao(agora);
    };
    quadro = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(quadro);
      if (trav) desfazer(trav);
      clearTimeout(timerFala);
      document.documentElement.style.cursor = "";
      svg.removeEventListener("pointerdown", aoApertar);
      window.removeEventListener("pointermove", aoMoverPonteiro);
      window.removeEventListener("pointerup", aoSoltarPonteiro);
      window.removeEventListener("pointercancel", aoCancelar);
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("cobra:estado", aoCobra);
      window.removeEventListener("rasgo:mudou", aoRasgo);
      window.removeEventListener("mascote:aprontar", aoAprontar);
    };
  }, []);

  return (
    <div
      ref={caixa}
      className="pointer-events-none fixed left-0 top-0 z-40 opacity-0 transition-opacity duration-300"
      data-nao-comer
      data-mascote
      aria-hidden="true"
    >
      {fala && (
        <span
          ref={balao}
          className="absolute animate-[surgir_0.2s_ease-out] whitespace-nowrap rounded-lg border-[2.5px] border-tinta bg-white px-2 py-0.5 font-mao text-sm shadow-brutal-sm"
          style={{ left: 0, top: 0, visibility: "hidden" }}
        >
          {fala}
        </span>
      )}
      <svg
        ref={figura}
        viewBox="0 0 60 90"
        width="60"
        height="90"
        className="mascote pose-em-pe"
        style={{ position: "absolute", left: -30, top: -86, touchAction: "none" }}
        overflow="visible"
      >
        {/* área de pegar, maior que os tracinhos */}
        <ellipse className="m-alvo" cx="30" cy="48" rx="21" ry="44" fill="transparent" />
        <g className="m-perna m-perna-esq"><line x1="30" y1="58" x2="22" y2="85" /></g>
        <g className="m-perna m-perna-dir"><line x1="30" y1="58" x2="38" y2="85" /></g>
        <line className="m-tronco-contorno" x1="30" y1="31" x2="30" y2="58" />
        <line className="m-tronco" x1="30" y1="31" x2="30" y2="58" />
        <g className="m-braco m-braco-esq"><line x1="30" y1="37" x2="17" y2="51" /></g>
        <g className="m-braco m-braco-dir"><line x1="30" y1="37" x2="43" y2="51" /></g>
        <g className="m-cabeca">
          <circle className="m-rosto" cx="30" cy="18" r="10" />
          <g className="m-olhar">
            <g className="m-olhos">
              <circle cx="26.6" cy="17" r="1.7" />
              <circle cx="33.4" cy="17" r="1.7" />
            </g>
          </g>
          <path className="m-boca" d="M26.5 21.5 Q30 24.5 33.5 21.5" />
          <ellipse className="m-boca-o" cx="30" cy="23" rx="2.2" ry="2.6" />
        </g>
      </svg>
    </div>
  );
}
