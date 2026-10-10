"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Pause, Play } from "@phosphor-icons/react/dist/ssr";
import { palavrasDoJogo } from "@/lib/dados";
import { desenharCobra, COR, type Ponto } from "@/lib/desenharCobra";
import { som } from "@/lib/sons";

// Cobrinha das letras: coma as letras na ordem certa para formar a palavra.
// Letra certa: cresce e pontua. Letra errada: perde uma vida e encolhe.
// Parede ou o próprio corpo: fim de jogo.

const COLS = 20;
const LINHAS = 14;
const VIDAS = 3;
const CHAVE_RECORDE = "cobra-jogo-recorde";
const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type Casa = { x: number; y: number };
type LetraNoTabuleiro = Casa & { ch: string; nasceu: number };
type Estado = "inicio" | "jogando" | "pausado" | "fim";

const embaralhar = <T,>(a: T[]) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

export default function JogoCobra() {
  const moldura = useRef<HTMLDivElement>(null);
  const tela = useRef<HTMLCanvasElement>(null);
  const [estado, setEstado] = useState<Estado>("inicio");
  const [hud, setHud] = useState({ pontos: 0, nivel: 1, vidas: VIDAS, palavra: "", progresso: 0, recorde: 0 });
  const [feitas, setFeitas] = useState<string[]>([]);
  const [aviso, setAviso] = useState<string | null>(null);
  const [novoRecorde, setNovoRecorde] = useState(false);

  // tudo que muda a cada passo fica em ref, para o laço não depender de render
  const jogo = useRef({
    cobra: [] as Casa[],
    anterior: [] as Casa[],
    dir: { x: 1, y: 0 },
    fila: [] as Casa[],
    crescer: 0,
    letras: [] as LetraNoTabuleiro[],
    fila_palavras: [] as string[],
    palavra: "",
    progresso: 0,
    pontos: 0,
    nivel: 1,
    vidas: VIDAS,
    acumulado: 0,
    tremor: 0,
    farelos: [] as { x: number; y: number; vx: number; vy: number; vida: number; cor: string }[],
    estado: "inicio" as Estado,
    cel: 24,
  });

  const intervalo = () => Math.max(62, 150 - (jogo.current.nivel - 1) * 11);

  const atualizarHud = useCallback(() => {
    const j = jogo.current;
    setHud((h) => ({ ...h, pontos: j.pontos, nivel: j.nivel, vidas: j.vidas, palavra: j.palavra, progresso: j.progresso }));
  }, []);

  const mudarEstado = (e: Estado) => {
    jogo.current.estado = e;
    setEstado(e);
  };

  const casaLivre = (proibidas: Casa[]): Casa => {
    const j = jogo.current;
    const cabeca = j.cobra[0];
    for (let tentativa = 0; tentativa < 400; tentativa++) {
      const c = { x: 1 + Math.floor(Math.random() * (COLS - 2)), y: 1 + Math.floor(Math.random() * (LINHAS - 2)) };
      if (j.cobra.some((s) => s.x === c.x && s.y === c.y)) continue;
      if (proibidas.some((s) => s.x === c.x && s.y === c.y)) continue;
      if (cabeca && Math.abs(cabeca.x - c.x) + Math.abs(cabeca.y - c.y) < 3) continue;
      return c;
    }
    return { x: 0, y: 0 };
  };

  // coloca a próxima letra certa e algumas iscas
  const espalharLetras = () => {
    const j = jogo.current;
    const certa = j.palavra[j.progresso];
    const iscas = Math.min(5, 1 + j.nivel);
    const letras: LetraNoTabuleiro[] = [];
    const agora = performance.now();
    letras.push({ ...casaLivre(letras), ch: certa, nasceu: agora });
    const outras = embaralhar(ALFABETO.replace(certa, "").split("")).slice(0, iscas);
    for (const ch of outras) letras.push({ ...casaLivre(letras), ch, nasceu: agora + Math.random() * 200 });
    j.letras = letras;
  };

  const proximaPalavra = () => {
    const j = jogo.current;
    if (j.fila_palavras.length === 0) j.fila_palavras = embaralhar(palavrasDoJogo);
    j.palavra = j.fila_palavras.shift()!;
    j.progresso = 0;
    espalharLetras();
  };

  const comecar = useCallback(() => {
    const j = jogo.current;
    j.cobra = [{ x: 6, y: 7 }, { x: 5, y: 7 }, { x: 4, y: 7 }];
    j.anterior = j.cobra.map((c) => ({ ...c }));
    j.dir = { x: 1, y: 0 };
    j.fila = [];
    j.crescer = 0;
    j.pontos = 0;
    j.nivel = 1;
    j.vidas = VIDAS;
    j.acumulado = 0;
    j.farelos = [];
    j.fila_palavras = embaralhar(palavrasDoJogo);
    proximaPalavra();
    setFeitas([]);
    setNovoRecorde(false);
    atualizarHud();
    mudarEstado("jogando");
    moldura.current?.focus({ preventScroll: true });
  }, [atualizarHud]);

  const virar = useCallback((d: Casa) => {
    const j = jogo.current;
    if (j.estado !== "jogando") return;
    const ultima = j.fila[j.fila.length - 1] ?? j.dir;
    if (d.x === -ultima.x && d.y === -ultima.y) return; // não dá meia-volta
    if (d.x === ultima.x && d.y === ultima.y) return;
    if (j.fila.length < 3) j.fila.push(d);
  }, []);

  const pausar = useCallback(() => {
    const e = jogo.current.estado;
    if (e === "jogando") mudarEstado("pausado");
    else if (e === "pausado") mudarEstado("jogando");
  }, []);

  const farelos = (c: Casa, cor: string, qtd = 10) => {
    const j = jogo.current;
    for (let k = 0; k < qtd; k++)
      j.farelos.push({
        x: (c.x + 0.5) * j.cel,
        y: (c.y + 0.5) * j.cel,
        vx: (Math.random() - 0.5) * 260,
        vy: (Math.random() - 0.8) * 240,
        vida: 1,
        cor,
      });
  };

  const fimDeJogo = () => {
    const j = jogo.current;
    let recorde = 0;
    try {
      recorde = Number(localStorage.getItem(CHAVE_RECORDE) || 0);
      if (j.pontos > recorde) {
        localStorage.setItem(CHAVE_RECORDE, String(j.pontos));
        setNovoRecorde(true);
        recorde = j.pontos;
      }
    } catch {}
    setHud((h) => ({ ...h, recorde }));
    mudarEstado("fim");
  };

  // um passo do jogo
  const passo = () => {
    const j = jogo.current;
    if (j.fila.length) j.dir = j.fila.shift()!;
    j.anterior = j.cobra.map((c) => ({ ...c }));
    const cabeca = { x: j.cobra[0].x + j.dir.x, y: j.cobra[0].y + j.dir.y };

    const bateuParede = cabeca.x < 0 || cabeca.y < 0 || cabeca.x >= COLS || cabeca.y >= LINHAS;
    const corpo = j.crescer > 0 ? j.cobra : j.cobra.slice(0, -1);
    const bateuEmSi = corpo.some((s) => s.x === cabeca.x && s.y === cabeca.y);
    if (bateuParede || bateuEmSi) {
      j.tremor = 1;
      farelos(j.cobra[0], COR.tinta, 16);
      som.fim();
      return fimDeJogo();
    }

    j.cobra.unshift(cabeca);
    if (j.crescer > 0) j.crescer--;
    else j.cobra.pop();

    const achou = j.letras.findIndex((l) => l.x === cabeca.x && l.y === cabeca.y);
    if (achou < 0) return;
    const letra = j.letras[achou];

    if (letra.ch === j.palavra[j.progresso]) {
      j.progresso++;
      j.crescer += 1;
      j.pontos += 10 * j.nivel;
      farelos(cabeca, COR.laranja);
      if (j.progresso === j.palavra.length) {
        som.palavra();
        j.pontos += 50 * j.nivel;
        const feita = j.palavra;
        setFeitas((f) => [feita, ...f]);
        setAviso(feita);
        setTimeout(() => setAviso(null), 1400);
        j.nivel++;
        proximaPalavra();
      } else {
        som.certo();
        espalharLetras();
      }
    } else {
      j.vidas--;
      j.tremor = 1;
      farelos(cabeca, "#e11d48", 12);
      som.errado();
      // encolhe duas partes, mas nunca abaixo de 3
      for (let k = 0; k < 2 && j.cobra.length > 3; k++) j.cobra.pop();
      j.anterior = j.anterior.slice(0, j.cobra.length);
      j.letras.splice(achou, 1);
      const nova = casaLivre(j.letras);
      const usadas = new Set(j.letras.map((l) => l.ch));
      const ch = ALFABETO.split("").find((c) => !usadas.has(c) && c !== j.palavra[j.progresso]) ?? "X";
      j.letras.push({ ...nova, ch, nasceu: performance.now() });
      if (j.vidas <= 0) {
        som.fim();
        atualizarHud();
        return fimDeJogo();
      }
    }
    atualizarHud();
  };

  // recorde salvo
  useEffect(() => {
    try {
      setHud((h) => ({ ...h, recorde: Number(localStorage.getItem(CHAVE_RECORDE) || 0) }));
    } catch {}
  }, []);

  // teclado
  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement;
      if (alvo.closest("input, textarea")) return;
      const dirs: Record<string, Casa> = {
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 },
      };
      const est = jogo.current.estado;
      if (dirs[e.key] && est === "jogando") {
        e.preventDefault();
        virar(dirs[e.key]);
      } else if (e.key === " " || e.key === "p" || e.key === "P") {
        if (est === "jogando" || est === "pausado") {
          e.preventDefault();
          pausar();
        }
      } else if (e.key === "Enter" && (est === "inicio" || est === "fim")) {
        e.preventDefault();
        comecar();
      }
    };
    // captura: o jogo ouve as teclas antes da rolagem lenta do site
    window.addEventListener("keydown", aoTeclar, true);
    return () => window.removeEventListener("keydown", aoTeclar, true);
  }, [virar, pausar, comecar]);

  // pausa sozinho quando a aba some
  useEffect(() => {
    const aoSumir = () => document.hidden && jogo.current.estado === "jogando" && mudarEstado("pausado");
    document.addEventListener("visibilitychange", aoSumir);
    return () => document.removeEventListener("visibilitychange", aoSumir);
  }, []);

  // tamanho do tabuleiro e laço de desenho
  useEffect(() => {
    const cv = tela.current!;
    const ctx = cv.getContext("2d")!;
    const j = jogo.current;
    let fonte = "cursive";

    const dimensionar = () => {
      const largura = moldura.current!.clientWidth;
      j.cel = Math.max(14, Math.floor(largura / COLS));
      const dpr = window.devicePixelRatio || 1;
      cv.width = j.cel * COLS * dpr;
      cv.height = j.cel * LINHAS * dpr;
      cv.style.width = `${j.cel * COLS}px`;
      cv.style.height = `${j.cel * LINHAS}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fonte = getComputedStyle(document.body).getPropertyValue("--font-virgil") || "cursive";
    };
    const ro = new ResizeObserver(dimensionar);
    ro.observe(moldura.current!);
    dimensionar();

    // cobra de enfeite na tela de início
    if (j.cobra.length === 0) {
      j.cobra = [{ x: 9, y: 7 }, { x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }];
      j.anterior = j.cobra;
    }

    let anterior = performance.now();
    let quadro = 0;
    const loop = (agora: number) => {
      quadro = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (agora - anterior) / 1000);
      anterior = agora;
      const cel = j.cel;

      if (j.estado === "jogando") {
        j.acumulado += dt * 1000;
        while (j.acumulado >= intervalo() && j.estado === "jogando") {
          j.acumulado -= intervalo();
          passo();
        }
      }
      const alfa = j.estado === "jogando" ? Math.min(1, j.acumulado / intervalo()) : 1;

      ctx.save();
      if (j.tremor > 0) {
        j.tremor = Math.max(0, j.tremor - dt * 4);
        ctx.translate((Math.random() - 0.5) * 8 * j.tremor, (Math.random() - 0.5) * 8 * j.tremor);
      }

      // tabuleiro xadrez bem clarinho
      for (let y = 0; y < LINHAS; y++)
        for (let x = 0; x < COLS; x++) {
          ctx.fillStyle = (x + y) % 2 ? "#FFF7ED" : "#ffffff";
          ctx.fillRect(x * cel, y * cel, cel, cel);
        }

      // letras em plaquinhas neobrutalistas
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const l of j.letras) {
        const idade = Math.min(1, Math.max(0, (agora - l.nasceu) / 260));
        const esc = idade < 1 ? 0.3 + 0.7 * (1 - Math.pow(1 - idade, 3)) * 1.08 : 1;
        const tam = cel * 0.84 * esc;
        const cx = (l.x + 0.5) * cel, cy = (l.y + 0.5) * cel;
        ctx.fillStyle = COR.tinta;
        quadrado(ctx, cx - tam / 2 + 3, cy - tam / 2 + 3, tam, tam, 5);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = COR.tinta;
        ctx.lineWidth = 2.5;
        quadrado(ctx, cx - tam / 2, cy - tam / 2, tam, tam, 5);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = COR.tinta;
        ctx.font = `${Math.round(cel * 0.62 * esc)}px ${fonte}`;
        ctx.fillText(l.ch, cx, cy + cel * 0.04);
      }

      // cobra, com o movimento suavizado entre um passo e outro
      const pts: Ponto[] = j.cobra.map((c, i) => {
        const a = j.anterior[i] ?? j.anterior[j.anterior.length - 1] ?? c;
        return { x: (a.x + (c.x - a.x) * alfa + 0.5) * cel, y: (a.y + (c.y - a.y) * alfa + 0.5) * cel };
      });
      if (pts.length === 1) pts.push({ x: pts[0].x - j.dir.x, y: pts[0].y - j.dir.y });
      desenharCobra(ctx, pts, cel * 0.36, agora);

      for (let k = j.farelos.length - 1; k >= 0; k--) {
        const f = j.farelos[k];
        f.vida -= dt * 1.8;
        if (f.vida <= 0) {
          j.farelos.splice(k, 1);
          continue;
        }
        f.vy += 600 * dt;
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        ctx.globalAlpha = f.vida;
        ctx.fillStyle = f.cor;
        ctx.fillRect(f.x - 3, f.y - 3, 6, 6);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    };
    quadro = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(quadro);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // deslizar o dedo no tabuleiro
  const toque = useRef<{ x: number; y: number } | null>(null);
  const aoTocar = (e: React.PointerEvent) => (toque.current = { x: e.clientX, y: e.clientY });
  const aoSoltar = (e: React.PointerEvent) => {
    if (!toque.current) return;
    const dx = e.clientX - toque.current.x, dy = e.clientY - toque.current.y;
    toque.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    virar(Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_17rem]">
      <div>
        {/* placar */}
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-cinza">Forme a palavra</p>
            <p className="mt-1 flex flex-wrap gap-1" aria-label={`Palavra: ${hud.palavra || "aguardando"}`}>
              {(hud.palavra || "??????").split("").map((ch, i) => (
                <span
                  key={i}
                  className={`flex h-9 w-8 items-center justify-center rounded-md border-[2.5px] border-tinta font-mao text-xl sm:h-10 sm:w-9 sm:text-2xl ${
                    i < hud.progresso ? "bg-laranja" : i === hud.progresso && estado === "jogando" ? "bg-laranja-claro" : "bg-white"
                  }`}
                >
                  {hud.palavra ? ch : "?"}
                </span>
              ))}
            </p>
          </div>
          <dl className="flex gap-5 text-right">
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-cinza">Pontos</dt>
              <dd className="font-mao text-3xl">{hud.pontos}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-cinza">Nível</dt>
              <dd className="font-mao text-3xl">{hud.nivel}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-cinza">Vidas</dt>
              <dd className="mt-2 flex gap-1" aria-label={`${hud.vidas} vidas`}>
                {Array.from({ length: VIDAS }, (_, i) => (
                  <span key={i} className={`h-4 w-4 rotate-45 border-[2.5px] border-tinta ${i < hud.vidas ? "bg-laranja" : "bg-white"}`} />
                ))}
              </dd>
            </div>
          </dl>
        </div>

        {/* tabuleiro */}
        <div
          ref={moldura}
          tabIndex={0}
          role="application"
          aria-label="Tabuleiro do jogo da cobrinha. Use as setas para mover, espaço para pausar."
          className="relative touch-none select-none overflow-hidden rounded-xl border-[3px] border-tinta bg-white shadow-brutal-lg outline-none focus-visible:ring-4 focus-visible:ring-laranja"
          onPointerDown={aoTocar}
          onPointerUp={aoSoltar}
        >
          <canvas ref={tela} className="block" />

          {estado !== "jogando" && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 p-4">
              <div className="caixa max-w-md p-6 text-center">
                {estado === "inicio" && (
                  <>
                    <p className="font-mao text-4xl">Cobrinha das letras</p>
                    <p className="mt-3 text-cinza">
                      Coma as letras <strong className="text-tinta">na ordem</strong> para formar a palavra. Letra errada custa uma vida.
                      Parede ou o próprio corpo, fim de jogo.
                    </p>
                    <button onClick={comecar} className="botao-laranja mt-5">
                      <Play className="h-5 w-5" weight="bold" /> Jogar
                    </button>
                    <p className="mt-3 text-xs text-cinza">Enter para começar · setas ou WASD · espaço pausa</p>
                  </>
                )}
                {estado === "pausado" && (
                  <>
                    <p className="font-mao text-4xl">Pausado</p>
                    <button onClick={pausar} className="botao-laranja mt-5">
                      <Play className="h-5 w-5" weight="bold" /> Continuar
                    </button>
                  </>
                )}
                {estado === "fim" && (
                  <>
                    <p className="font-mao text-4xl">{novoRecorde ? "Recorde novo!" : "Fim de jogo"}</p>
                    <p className="mt-3 text-lg">
                      <strong>{hud.pontos}</strong> pontos, {feitas.length} {feitas.length === 1 ? "palavra" : "palavras"}
                    </p>
                    <p className="text-sm text-cinza">Seu recorde: {hud.recorde}</p>
                    <button onClick={comecar} className="botao-laranja mt-5">
                      <Play className="h-5 w-5" weight="bold" /> Jogar de novo
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {aviso && (
            <div className="pointer-events-none absolute inset-x-0 top-1/3 text-center" role="status">
              <span className="marca marca-visivel font-mao text-5xl sm:text-6xl">{aviso}!</span>
            </div>
          )}
        </div>

        {/* controles na tela, para celular */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="grid grid-cols-3 gap-2 lg:hidden" aria-label="Controles">
            <span />
            <BotaoSeta rotulo="Cima" onClick={() => virar({ x: 0, y: -1 })}><ArrowUp className="h-6 w-6" weight="bold" /></BotaoSeta>
            <span />
            <BotaoSeta rotulo="Esquerda" onClick={() => virar({ x: -1, y: 0 })}><ArrowLeft className="h-6 w-6" weight="bold" /></BotaoSeta>
            <BotaoSeta rotulo="Baixo" onClick={() => virar({ x: 0, y: 1 })}><ArrowDown className="h-6 w-6" weight="bold" /></BotaoSeta>
            <BotaoSeta rotulo="Direita" onClick={() => virar({ x: 1, y: 0 })}><ArrowRight className="h-6 w-6" weight="bold" /></BotaoSeta>
          </div>
          {(estado === "jogando" || estado === "pausado") && (
            <button onClick={pausar} className="botao ml-auto">
              {estado === "pausado" ? <Play className="h-5 w-5" weight="bold" /> : <Pause className="h-5 w-5" weight="bold" />}
              {estado === "pausado" ? "Continuar" : "Pausar"}
            </button>
          )}
        </div>
      </div>

      <aside className="space-y-6">
        <div className="caixa p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-cinza">Recorde neste aparelho</p>
          <p className="font-mao text-4xl text-laranja-texto">{hud.recorde}</p>
        </div>
        <div className="caixa p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-cinza">Palavras formadas</p>
          {feitas.length === 0 ? (
            <p className="mt-2 text-sm text-cinza">Nenhuma ainda. A primeira vale 50 pontos de bônus.</p>
          ) : (
            <ul className="mt-2 space-y-1 font-mao text-xl">
              {feitas.map((f, i) => (
                <li key={`${f}-${i}`}>
                  <span className="marca marca-visivel">{f}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-xl border-[3px] border-dashed border-tinta p-5 text-sm">
          <p className="font-bold">Como pontua</p>
          <ul className="mt-2 space-y-1 text-cinza">
            <li>Letra certa: 10 × nível</li>
            <li>Palavra completa: 50 × nível</li>
            <li>A cada palavra, o nível sobe e a cobra acelera</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

function BotaoSeta({ children, rotulo, onClick }: { children: React.ReactNode; rotulo: string; onClick: () => void }) {
  return (
    <button
      aria-label={rotulo}
      onPointerDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="botao h-14 w-14 justify-center p-0 active:bg-laranja"
    >
      {children}
    </button>
  );
}

function quadrado(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
