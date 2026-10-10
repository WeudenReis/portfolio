"use client";

import { useEffect } from "react";

// Rolagem mais lenta e suave no site inteiro. A roda do mouse, o touchpad, o toque e as teclas de página
// não rolam direto: elas movem um "alvo", e a página anda até ele com velocidade máxima limitada.
// Mesmo rolando rápido, a página nunca passa de VEL_MAX, e o alvo não foge mais de uma tela na frente,
// então ela para logo depois que a pessoa para. Rolagens feitas por fora (link, barra de rolagem,
// cobrinha, troca de página) são respeitadas: o alvo se ajusta à posição real.

const VEL_MAX = 1000; // px por segundo
const ACEL = 5200; // px/s²: arranca e freia suave, sem tranco
const GANHO = 7; // velocidade desejada = distância que falta × GANHO (chega devagarinho no fim)
const PASSO_RODA = 0.5; // quanto vale cada movimento da roda
const FOLGA = 0.85; // o alvo fica no máximo a 85% de uma tela da posição atual

// para o código do site pedir uma rolagem lenta até um ponto
export const rolarPara = (y: number) => window.dispatchEvent(new CustomEvent("rolagem:para", { detail: y }));

export default function RolagemLenta() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let atual = window.scrollY;
    let alvo = atual;
    let meu = atual; // última posição que eu mesmo coloquei
    let quadro = 0;
    let anterior = -1;
    let vel = 0;

    const maximo = () => document.documentElement.scrollHeight - window.innerHeight;
    const limitar = (y: number) => Math.max(0, Math.min(maximo(), y));
    const perto = (y: number) => Math.max(atual - window.innerHeight * FOLGA, Math.min(atual + window.innerHeight * FOLGA, y));

    const animar = (t: number) => {
      // o horário do quadro pode vir antes do momento em que a rolagem começou: nunca deixa o
      // intervalo ficar negativo (isso dava um tranquinho para trás no começo de cada rolagem)
      const dt = anterior < 0 ? 1 / 60 : Math.min(0.05, Math.max(1 / 240, (t - anterior) / 1000));
      anterior = t;
      alvo = limitar(alvo);
      const dif = alvo - atual;
      if (Math.abs(dif) < 0.5 && Math.abs(vel) < 20) {
        atual = alvo;
        vel = 0;
        window.scrollTo(0, atual);
        meu = window.scrollY;
        quadro = 0;
        return;
      }
      const desejada = Math.max(-VEL_MAX, Math.min(VEL_MAX, dif * GANHO));
      const maxDv = ACEL * dt;
      vel += Math.max(-maxDv, Math.min(maxDv, desejada - vel));
      atual += vel * dt;
      if ((dif > 0 && atual > alvo) || (dif < 0 && atual < alvo)) {
        atual = alvo; // não passa do ponto
        vel = 0;
      }
      window.scrollTo(0, atual);
      meu = window.scrollY;
      quadro = requestAnimationFrame(animar);
    };
    const andar = () => {
      if (!quadro) {
        anterior = -1;
        quadro = requestAnimationFrame(animar);
      }
    };
    const parar = () => {
      if (quadro) cancelAnimationFrame(quadro);
      quadro = 0;
      vel = 0;
    };

    // alguém rolou por fora de mim: sigo a posição real
    const aoRolar = () => {
      if (Math.abs(window.scrollY - meu) > 2) {
        parar();
        atual = alvo = meu = window.scrollY;
      }
    };

    // elementos que rolam sozinhos (modal, área com barra própria) continuam nativos
    const rolaPorDentro = (el: Element | null, dy: number) => {
      for (; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
        if (!(el instanceof HTMLElement)) continue;
        const s = getComputedStyle(el);
        if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 1) {
          if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
        }
      }
      return false;
    };
    const bloqueado = () => !!document.querySelector("dialog[open]");

    const aoRodar = (e: WheelEvent) => {
      if (e.ctrlKey || e.defaultPrevented || bloqueado()) return; // ctrl + roda é zoom
      let dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
      if (Math.abs(e.deltaX) > Math.abs(dy)) return; // rolagem de lado fica nativa
      if (rolaPorDentro(e.target as Element, dy)) return;
      e.preventDefault();
      dy = Math.max(-120, Math.min(120, dy)) * PASSO_RODA;
      alvo = limitar(perto(alvo + dy));
      andar();
    };

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || bloqueado()) return;
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select, [contenteditable], [role='application']")) return;
      const tela = window.innerHeight * 0.8;
      const passos: Record<string, number> = {
        PageDown: tela,
        PageUp: -tela,
        ArrowDown: 90,
        ArrowUp: -90,
        " ": e.shiftKey ? -tela : tela,
      };
      if (e.key === " " && el.closest("button, a, summary")) return;
      if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        alvo = e.key === "Home" ? 0 : maximo();
        andar();
        return;
      }
      if (!(e.key in passos)) return;
      e.preventDefault();
      alvo = limitar(perto(alvo + passos[e.key]));
      andar();
    };

    // toque: o dedo arrasta a página (um pouco mais devagar) e o "arremesso" no fim tem velocidade limitada
    let toque: { x: number; y: number; alvo0: number; decidido: boolean; vertical: boolean; ultY: number; ultT: number; vel: number } | null = null;
    const aoTocar = (e: TouchEvent) => {
      toque = null;
      if (e.touches.length !== 1 || bloqueado()) return;
      if ((e.target as Element).closest("input, textarea, select, canvas, .mascote, [data-rolagem-nativa], [role='application']")) return;
      const p = e.touches[0];
      parar();
      atual = alvo = meu = window.scrollY;
      toque = { x: p.clientX, y: p.clientY, alvo0: atual, decidido: false, vertical: false, ultY: p.clientY, ultT: performance.now(), vel: 0 };
    };
    const aoMover = (e: TouchEvent) => {
      if (!toque || e.touches.length !== 1) return;
      const p = e.touches[0];
      const dx = p.clientX - toque.x;
      const dy = p.clientY - toque.y;
      if (!toque.decidido) {
        if (Math.hypot(dx, dy) < 6) return;
        toque.decidido = true;
        toque.vertical = Math.abs(dy) > Math.abs(dx) && !rolaPorDentro(e.target as Element, -dy);
        if (!toque.vertical) {
          toque = null;
          return;
        }
      }
      e.preventDefault();
      const agora = performance.now();
      const dtt = Math.max(1, agora - toque.ultT);
      toque.vel = 0.7 * toque.vel + 0.3 * ((-(p.clientY - toque.ultY) / dtt) * 1000);
      toque.ultY = p.clientY;
      toque.ultT = agora;
      atual = alvo = limitar(toque.alvo0 - dy * 0.85);
      window.scrollTo(0, atual);
      meu = window.scrollY;
    };
    const aoSoltar = () => {
      if (!toque?.vertical) {
        toque = null;
        return;
      }
      const vel = Math.max(-VEL_MAX, Math.min(VEL_MAX, toque.vel));
      toque = null;
      alvo = limitar(perto(atual + vel * 0.35));
      andar();
    };

    const aoPedir = (e: Event) => {
      alvo = limitar((e as CustomEvent<number>).detail);
      andar();
    };

    window.addEventListener("wheel", aoRodar, { passive: false });
    window.addEventListener("keydown", aoTeclar);
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("touchstart", aoTocar, { passive: true });
    window.addEventListener("touchmove", aoMover, { passive: false });
    window.addEventListener("touchend", aoSoltar);
    window.addEventListener("touchcancel", aoSoltar);
    window.addEventListener("rolagem:para", aoPedir);
    return () => {
      parar();
      window.removeEventListener("wheel", aoRodar);
      window.removeEventListener("keydown", aoTeclar);
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("touchstart", aoTocar);
      window.removeEventListener("touchmove", aoMover);
      window.removeEventListener("touchend", aoSoltar);
      window.removeEventListener("touchcancel", aoSoltar);
      window.removeEventListener("rolagem:para", aoPedir);
    };
  }, []);

  return null;
}
