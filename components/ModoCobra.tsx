"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { desenharCobra, COR, type Ponto } from "@/lib/desenharCobra";
import { IconeCobra } from "./Icones";
import { som } from "@/lib/sons";

// Modo cobrinha: solta uma cobra por cima de qualquer página do site, que sai comendo as letras
// de verdade do texto. No automático ela caça a letra mais perto; com as setas (ou WASD) você guia.
// Guiando, encostar em cima ou embaixo rola o site; no fim da página, continuar empurrando
// leva para a próxima página (ou a anterior), e a cobra vai junto.
// Nada no HTML é alterado: a letra comida é só coberta com a cor do fundo dela, e volta ao guardar.

export const soltarCobra = () => window.dispatchEvent(new Event("cobra:soltar"));

type Letra = { no: Text; i: number; x: number; y: number; w: number; h: number; sx: number; sy: number; chave: string };
type Comida = { no: Text; i: number; cor: string; visivel: boolean; checado: number };
type Farelo = { x: number; y: number; vx: number; vy: number; vida: number };

const IGNORAR = "[data-nao-comer], [aria-hidden='true'], script, style, noscript, textarea, input, select, [data-cobra-hud]";
const CHAVE_RECORDE = "cobra-site-recorde";
const PAGINAS = [
  { nome: "Início", href: "/" },
  { nome: "Projetos", href: "/projetos" },
  { nome: "Sobre", href: "/sobre" },
  { nome: "Jogo", href: "/jogo" },
  { nome: "Contato", href: "/contato" },
];
const EMPURRAO = 0.9; // segundos empurrando no fim da página para trocar de página
const indiceDaPagina = (caminho: string) =>
  PAGINAS.reduce((melhor, p, i) => (caminho === p.href || (p.href !== "/" && caminho.startsWith(p.href)) ? i : melhor), 0);

export default function ModoCobra() {
  const [ativo, setAtivo] = useState(false);
  const [placar, setPlacar] = useState({ comidas: 0, naTela: 0, indo: "", forca: 0 });
  const [recado, setRecado] = useState<string | null>(null);
  const tela = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const navegar = useRef(router.push);
  navegar.current = router.push;
  const motor = useRef<{ trocouPagina: () => void } | null>(null);

  useEffect(() => {
    const soltar = () => setAtivo((a) => !a);
    window.addEventListener("cobra:soltar", soltar);
    return () => window.removeEventListener("cobra:soltar", soltar);
  }, []);

  useEffect(() => {
    motor.current?.trocouPagina();
  }, [pathname]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("cobra:estado", { detail: ativo }));
  }, [ativo]);

  useEffect(() => {
    if (!ativo) return;
    const cv = tela.current!;
    const ctx = cv.getContext("2d")!;
    let W = 0, H = 0;
    const dimensionar = () => {
      const dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    dimensionar();

    const ids = new WeakMap<Text, number>();
    let proximoId = 1;
    const idDe = (no: Text) => ids.get(no) ?? (ids.set(no, proximoId++), proximoId - 1);

    let letras: Letra[] = [];
    let comidas = new Map<string, Comida>();
    const farelos: Farelo[] = [];
    const raio = W < 640 ? 8 : 10;

    // cor do fundo atrás da letra; null quando há imagem ou gradiente (marca-texto, grifo):
    // cobrir com uma cor só abriria um buraco no destaque, então essas letras ficam de fora
    const corDeFundo = (el: Element | null): string | null => {
      while (el) {
        const st = getComputedStyle(el);
        if (st.backgroundImage && st.backgroundImage !== "none") return null;
        const c = st.backgroundColor;
        if (c && c !== "transparent" && !c.endsWith(", 0)")) return c;
        el = el.parentElement;
      }
      return "#ffffff";
    };
    const coresDoPai = new WeakMap<Element, string | null>();
    const corDoPai = (el: Element) => {
      if (!coresDoPai.has(el)) coresDoPai.set(el, corDeFundo(el));
      return coresDoPai.get(el)!;
    };

    const escanear = () => {
      const raiz = document.querySelector("main") ?? document.body;
      const andador = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
      const range = document.createRange();
      const novas: Letra[] = [];
      const sx = window.scrollX, sy = window.scrollY;
      for (let no = andador.nextNode() as Text | null; no; no = andador.nextNode() as Text | null) {
        const pai = no.parentElement;
        if (!pai || !no.data.trim() || pai.closest(IGNORAR) || corDoPai(pai) === null) continue;
        const caixa = pai.getBoundingClientRect();
        if (caixa.bottom < 0 || caixa.top > H || caixa.right < 0 || caixa.left > W || caixa.width === 0) continue;
        for (let i = 0; i < no.data.length; i++) {
          if (/\s/.test(no.data[i])) continue;
          const chave = `${idDe(no)}:${i}`;
          if (comidas.has(chave)) continue;
          range.setStart(no, i);
          range.setEnd(no, i + 1);
          const r = range.getBoundingClientRect();
          if (r.width < 2 || r.bottom < 0 || r.top > H || r.right < 0 || r.left > W) continue;
          const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          const topo = document.elementFromPoint(cx, cy);
          if (!topo || !(topo === pai || pai.contains(topo))) continue; // escondida atrás de algo
          novas.push({ no, i, x: cx, y: cy, w: r.width, h: r.height, sx, sy, chave });
        }
      }
      letras = novas;
    };

    // a cobra
    let cabeca: Ponto = { x: Math.min(120, W * 0.2), y: H - 80 };
    let ang = -Math.PI / 4;
    let rastro: Ponto[] = [{ ...cabeca }];
    let manual: { x: number; y: number } = { x: 0, y: 0 };
    let manualAte = 0;
    const teclas = new Set<string>();
    let empurrando = 0;
    let chegandoPor: 1 | -1 | 0 = 0;
    let indo = "";
    let total = 0; // letras comidas desde que foi solta (não zera ao trocar de página)
    let navegando = 0; // momento em que pediu para trocar de página (0 = parado)
    let destinoChegada = "";
    const timers: number[] = [];
    // piloto automático: letra que está caçando e as que desistiu por um tempo
    let alvoChave = "";
    let alvoMelhor = Infinity;
    let alvoDesde = 0;
    const desistiu = new Map<string, number>();

    const corpo = (n: number): Ponto[] => {
      const pts: Ponto[] = [rastro[0]];
      const passo = raio * 1.25;
      let falta = passo;
      for (let k = 1; k < rastro.length && pts.length < n; k++) {
        const a = rastro[k - 1], b = rastro[k];
        let seg = Math.hypot(b.x - a.x, b.y - a.y);
        let ox = a.x, oy = a.y;
        while (seg >= falta && pts.length < n) {
          const t = falta / seg;
          ox = ox + (b.x - ox) * t;
          oy = oy + (b.y - oy) * t;
          pts.push({ x: ox, y: oy });
          seg -= falta;
          falta = passo;
        }
        falta -= seg;
      }
      return pts;
    };

    const posAtual = (l: Letra) => ({ x: l.x - (window.scrollX - l.sx), y: l.y - (window.scrollY - l.sy) });

    const comer = (l: Letra) => {
      comidas.set(l.chave, { no: l.no, i: l.i, cor: corDoPai(l.no.parentElement!) ?? "#ffffff", visivel: true, checado: performance.now() });
      total++;
      som.mordida();
      letras = letras.filter((x) => x !== l);
      const p = posAtual(l);
      for (let k = 0; k < 5; k++)
        farelos.push({ x: p.x, y: p.y, vx: (Math.random() - 0.5) * 160, vy: -Math.random() * 140, vida: 1 });
    };

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      // com o jogo da cobrinha rodando, as setas são do jogo
      if (document.documentElement.dataset.jogo === "rodando") return;
      if (e.key === "Escape") {
        if (document.querySelector("dialog[open]")) return; // o Esc fecha o modal, não guarda a cobra
        return setAtivo(false);
      }
      const mapa: Record<string, string> = {
        ArrowUp: "c", ArrowDown: "b", ArrowLeft: "e", ArrowRight: "d", w: "c", s: "b", a: "e", d: "d", W: "c", S: "b", A: "e", D: "d",
      };
      const alvo = e.target as HTMLElement;
      if (alvo.closest("input, textarea, [contenteditable]")) return;
      if (!mapa[e.key]) return;
      e.preventDefault();
      if (e.type === "keydown") teclas.add(mapa[e.key]);
      else teclas.delete(mapa[e.key]);
      manual = {
        x: (teclas.has("d") ? 1 : 0) - (teclas.has("e") ? 1 : 0),
        y: (teclas.has("b") ? 1 : 0) - (teclas.has("c") ? 1 : 0),
      };
      manualAte = performance.now() + 4000;
    };

    let reescanear = 0;
    const agendarEscaneio = (ms = 140) => {
      clearTimeout(reescanear);
      reescanear = window.setTimeout(escanear, ms);
    };
    const aoRolar = () => agendarEscaneio();
    // janela perdeu o foco: solta as teclas (senão uma seta presa sai navegando sozinha)
    const soltarTeclas = () => {
      teclas.clear();
      manual = { x: 0, y: 0 };
      manualAte = 0;
    };
    const aoEsconder = () => document.hidden && soltarTeclas();
    const aoRedimensionar = () => {
      dimensionar();
      agendarEscaneio();
    };
    // captura: a cobrinha ouve as setas antes da rolagem lenta do site
    window.addEventListener("keydown", aoTeclar, true);
    window.addEventListener("keyup", aoTeclar, true);
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRedimensionar);
    window.addEventListener("blur", soltarTeclas);
    document.addEventListener("visibilitychange", aoEsconder);
    const periodico = window.setInterval(escanear, 1500);
    escanear();

    motor.current = {
      trocouPagina: () => {
        comidas = new Map();
        letras = [];
        alvoChave = "";
        desistiu.clear();
        if (chegandoPor === 1) cabeca = { x: cabeca.x, y: 64 + raio * 3 };
        if (chegandoPor === -1) {
          cabeca = { x: cabeca.x, y: H - raio * 3 };
          // chegou subindo: começa no fim da página anterior (só se ainda estiver nela)
          const chegada = destinoChegada;
          for (const ms of [120, 450])
            timers.push(
              window.setTimeout(() => {
                if (window.location.pathname === chegada) window.scrollTo(0, document.documentElement.scrollHeight);
              }, ms),
            );
        }
        rastro = [{ ...cabeca }];
        chegandoPor = 0;
        navegando = 0;
        empurrando = 0;
        indo = "";
        agendarEscaneio(500);
      },
    };

    const trocarDePagina = (dir: 1 | -1) => {
      const i = indiceDaPagina(window.location.pathname);
      const destino = PAGINAS[(i + dir + PAGINAS.length) % PAGINAS.length];
      chegandoPor = dir;
      destinoChegada = destino.href;
      navegando = performance.now();
      som.pagina();
      navegar.current(destino.href);
    };

    let anterior = performance.now();
    let quadro = 0;
    let ultimoPlacar = 0;
    const range = document.createRange();

    const loop = (agora: number) => {
      quadro = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (agora - anterior) / 1000);
      anterior = agora;
      if (document.hidden) return;

      // tecla segurada mantém o modo guiado
      if (teclas.size) manualAte = agora + 4000;

      // direção desejada
      let desejado = ang;
      let virada = 5;
      if (agora < manualAte && (manual.x || manual.y)) {
        desejado = Math.atan2(manual.y, manual.x);
        virada = 10;
      } else {
        // escolhe a letra pelo custo: distância, mais um peso para as que ficam atrás da cabeça
        // (letra colada do lado fica dentro da curva e a cobra rodaria em volta para sempre)
        let melhor: Ponto | null = null;
        let melhorChave = "";
        let menor = Infinity;
        let distMelhor = Infinity;
        for (const l of letras) {
          if ((desistiu.get(l.chave) ?? 0) > agora) continue;
          const p = posAtual(l);
          if (p.y < 0 || p.y > H) continue;
          const d = Math.hypot(p.x - cabeca.x, p.y - cabeca.y);
          let giro = Math.atan2(p.y - cabeca.y, p.x - cabeca.x) - ang;
          giro = Math.abs(Math.atan2(Math.sin(giro), Math.cos(giro)));
          const custo = d + giro * 70 + (l.chave === alvoChave ? -30 : 0);
          if (custo < menor) {
            menor = custo;
            melhor = p;
            melhorChave = l.chave;
            distMelhor = d;
          }
        }
        if (melhor) {
          // não chegou mais perto em 1,2 s: desiste dessa letra por um tempo
          if (melhorChave !== alvoChave) {
            alvoChave = melhorChave;
            alvoMelhor = distMelhor;
            alvoDesde = agora;
          } else if (distMelhor < alvoMelhor - 8) {
            alvoMelhor = distMelhor;
            alvoDesde = agora;
          } else if (agora - alvoDesde > 1200) {
            desistiu.set(alvoChave, agora + 6000);
            alvoChave = "";
          }
          desejado = Math.atan2(melhor.y - cabeca.y, melhor.x - cabeca.x);
          // perto do alvo, fecha a curva
          if (distMelhor < 90) virada = 9;
        } else desejado = ang + Math.sin(agora / 700) * 0.9; // passeando
        // foge das beiradas
        const m = 50;
        if (cabeca.x < m || cabeca.x > W - m || cabeca.y < m + 64 || cabeca.y > H - m)
          desejado = Math.atan2(H / 2 - cabeca.y, W / 2 - cabeca.x);
      }
      let dif = desejado - ang;
      dif = Math.atan2(Math.sin(dif), Math.cos(dif));
      ang += Math.max(-virada * dt, Math.min(virada * dt, dif));

      // perto da letra caçada ela desacelera um pouco: a curva fica mais fechada
      const pertoDoAlvo = !(agora < manualAte) && alvoChave && alvoMelhor < 70;
      const vel = (190 + Math.min(140, total * 0.6)) * (pertoDoAlvo ? 0.6 : 1);
      cabeca = { x: cabeca.x + Math.cos(ang) * vel * dt, y: cabeca.y + Math.sin(ang) * vel * dt };
      const guiando = agora < manualAte && (manual.x !== 0 || manual.y !== 0);
      if (cabeca.x < raio || cabeca.x > W - raio) {
        if (!guiando) ang = Math.PI - ang;
        cabeca.x = Math.max(raio, Math.min(W - raio, cabeca.x));
      }
      if (cabeca.y < raio || cabeca.y > H - raio) {
        if (!guiando) ang = -ang;
        cabeca.y = Math.max(raio, Math.min(H - raio, cabeca.y));
      }

      // encostou em cima ou embaixo guiando: rola o site; no fim, troca de página
      const noTopo = guiando && manual.y < 0 && cabeca.y <= raio + 2;
      const noFundo = guiando && manual.y > 0 && cabeca.y >= H - raio - 2;
      indo = "";
      if (navegando && agora - navegando > 5000) navegando = 0; // segurança se a navegação travar
      if ((noTopo || noFundo) && !navegando) {
        const dir = noFundo ? 1 : -1;
        const fim = document.documentElement.scrollHeight - H;
        const podeRolar = dir === 1 ? window.scrollY < fim - 1 : window.scrollY > 0;
        if (podeRolar) {
          window.scrollBy(0, dir * vel * 1.8 * dt);
          empurrando = 0;
        } else {
          empurrando += dt;
          const i = indiceDaPagina(window.location.pathname);
          indo = PAGINAS[(i + dir + PAGINAS.length) % PAGINAS.length].nome;
          if (empurrando >= EMPURRAO) {
            empurrando = 0;
            trocarDePagina(dir);
          }
        }
      } else empurrando = 0;
      rastro.unshift({ ...cabeca });
      const tamanho = Math.min(160, 12 + Math.floor(total * 0.5));
      if (rastro.length > tamanho * 4) rastro.length = tamanho * 4;

      // comer
      for (const l of [...letras]) {
        const p = posAtual(l);
        if (Math.hypot(p.x - cabeca.x, p.y - cabeca.y) < raio * 1.2 + Math.max(l.w, l.h) * 0.4) comer(l);
      }

      // desenhar: primeiro as letras comidas (cobertas com a cor do fundo), depois farelos e cobra
      ctx.clearRect(0, 0, W, H);
      for (const c of comidas.values()) {
        if (!c.no.isConnected || c.i >= c.no.data.length) continue;
        range.setStart(c.no, c.i);
        range.setEnd(c.no, c.i + 1);
        const r = range.getBoundingClientRect();
        if (r.bottom < 0 || r.top > H || r.width === 0) continue;
        // a letra pode ter ficado escondida atrás de outra coisa (capítulo de cima, metade do rasgo...):
        // só cobre se ela ainda estiver de fato na frente
        if (agora - c.checado > 150) {
          c.checado = agora + Math.random() * 60;
          const topo = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          const pai = c.no.parentElement;
          c.visivel = !!topo && !!pai && (topo === pai || pai.contains(topo));
        }
        if (!c.visivel) continue;
        ctx.fillStyle = c.cor;
        ctx.fillRect(r.left - 0.5, r.top + r.height * 0.08, r.width + 1, r.height * 0.86);
      }
      ctx.fillStyle = COR.tinta;
      for (let k = farelos.length - 1; k >= 0; k--) {
        const f = farelos[k];
        f.vida -= dt * 2;
        if (f.vida <= 0) {
          farelos.splice(k, 1);
          continue;
        }
        f.vy += 500 * dt;
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        ctx.globalAlpha = f.vida;
        ctx.fillRect(f.x - 2, f.y - 2, 4, 4);
      }
      ctx.globalAlpha = 1;
      desenharCobra(ctx, corpo(tamanho), raio, agora);

      if (agora - ultimoPlacar > 200) {
        ultimoPlacar = agora;
        setPlacar({ comidas: total, naTela: letras.length, indo, forca: Math.min(1, empurrando / EMPURRAO) });
      }
    };
    quadro = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(quadro);
      clearTimeout(reescanear);
      clearInterval(periodico);
      window.removeEventListener("keydown", aoTeclar, true);
      window.removeEventListener("keyup", aoTeclar, true);
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRedimensionar);
      window.removeEventListener("blur", soltarTeclas);
      document.removeEventListener("visibilitychange", aoEsconder);
      timers.forEach((id) => clearTimeout(id));
      motor.current = null;
      ctx.clearRect(0, 0, W, H);

      let recorde = 0;
      try {
        recorde = Number(localStorage.getItem(CHAVE_RECORDE) || 0);
        if (total > recorde) localStorage.setItem(CHAVE_RECORDE, String(total));
      } catch {}
      if (total > 0)
        setRecado(
          total > recorde
            ? `Recorde! A cobrinha comeu ${total} ${total === 1 ? "letra" : "letras"}. Já nasceram de novo.`
            : `A cobrinha comeu ${total} ${total === 1 ? "letra" : "letras"}. Já nasceram de novo.`,
        );
    };
  }, [ativo]);

  useEffect(() => {
    if (!recado) return;
    const t = setTimeout(() => setRecado(null), 4500);
    return () => clearTimeout(t);
  }, [recado]);

  return (
    <>
      <canvas
        ref={tela}
        className="pointer-events-none fixed inset-0 z-[70] h-screen w-screen"
        hidden={!ativo}
        aria-hidden="true"
      />

      <div
        data-cobra-hud
        className="fixed bottom-4 left-1/2 z-[80] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2"
        aria-live="polite"
      >
        {ativo ? (
          <div className="caixa flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div className="font-mao text-lg leading-tight">
              <span className="text-laranja-texto">{placar.comidas}</span> {placar.comidas === 1 ? "letra comida" : "letras comidas"}
              {placar.indo ? (
                <span className="mt-1 block font-sans text-xs font-bold">
                  Continue empurrando para ir para {placar.indo}
                  <span className="mt-1 block h-2 w-40 overflow-hidden rounded-full border-2 border-tinta">
                    <span className="block h-full bg-laranja" style={{ width: `${placar.forca * 100}%` }} />
                  </span>
                </span>
              ) : (
                <span className="block font-sans text-xs text-cinza">
                  {placar.naTela === 0
                    ? "Tela limpa! Guie até a borda de baixo para rolar o site."
                    : "Setas ou WASD guiam. Encoste em cima ou embaixo para navegar. Esc guarda."}
                </span>
              )}
            </div>
            <button onClick={() => setAtivo(false)} className="botao-tinta px-3 py-1.5 text-sm">
              Guardar a cobrinha
            </button>
          </div>
        ) : (
          recado && (
            <div className="caixa bg-laranja-claro px-4 py-3 text-center font-mao text-lg" role="status">
              {recado}
            </div>
          )
        )}
      </div>

      {!ativo && (
        <button
          data-cobra-hud
          onClick={soltarCobra}
          className="botao-laranja fixed bottom-4 right-4 z-[80] px-3 py-2 text-sm"
          aria-label="Soltar a cobrinha para comer as letras desta página"
          title="Soltar a cobrinha"
        >
          <IconeCobra className="h-5 w-5" />
          <span className="hidden sm:inline">Soltar a cobrinha</span>
        </button>
      )}
    </>
  );
}
