"use client";

// Sons do site, todos gerados na hora com Web Audio (nenhum arquivo de áudio).
// O navegador só libera áudio depois do primeiro clique ou tecla, então o contexto nasce aí.
// A preferência de som fica no localStorage ("sons" = "off" desliga).

let ctx: AudioContext | null = null;
let ruido: AudioBuffer | null = null;
let ligado = true;
let saida: GainNode | null = null;

try {
  ligado = typeof localStorage !== "undefined" && localStorage.getItem("sons") !== "off";
} catch {}

const ouvintes = new Set<(l: boolean) => void>();
export const somLigado = () => ligado;
export const aoMudarSom = (f: (l: boolean) => void) => {
  ouvintes.add(f);
  return () => {
    ouvintes.delete(f);
  };
};
export function alternarSom() {
  ligado = !ligado;
  try {
    localStorage.setItem("sons", ligado ? "on" : "off");
  } catch {}
  ouvintes.forEach((f) => f(ligado));
  if (ligado) som.clique();
}

export function iniciarAudio() {
  if (ctx || typeof window === "undefined") return;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  saida = ctx.createGain();
  saida.gain.value = 0.55;
  saida.connect(ctx.destination);
  ruido = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
  const d = ruido.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
}

const pronto = () => {
  if (!ligado || !ctx || !saida || document.hidden) return null;
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
};

function tom(freq: number, dur: number, tipo: OscillatorType = "sine", vol = 0.2, ate?: number, atraso = 0) {
  const c = pronto();
  if (!c) return;
  const t = c.currentTime + atraso;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = tipo;
  o.frequency.setValueAtTime(freq, t);
  if (ate) o.frequency.exponentialRampToValueAtTime(ate, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(saida!);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function chiado(dur: number, filtro: BiquadFilterType, de: number, ate: number, vol = 0.3, q = 1, atraso = 0) {
  const c = pronto();
  if (!c || !ruido) return null;
  const t = c.currentTime + atraso;
  const s = c.createBufferSource();
  s.buffer = ruido;
  const f = c.createBiquadFilter();
  f.type = filtro;
  f.Q.value = q;
  f.frequency.setValueAtTime(de, t);
  f.frequency.exponentialRampToValueAtTime(ate, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f).connect(g).connect(saida!);
  s.start(t, Math.random() * 0.5);
  s.stop(t + dur + 0.02);
  return { g, t };
}

let ultimaMordida = 0;

export const som = {
  // papel rasgando: ruído com estalos irregulares subindo de frequência
  rasgo(forca = 1) {
    const c = pronto();
    if (!c) return;
    const dur = 0.55 + Math.random() * 0.2;
    const r = chiado(dur, "bandpass", 700, 3200, 0.5 * forca, 0.9);
    if (!r) return;
    let t = r.t + 0.02;
    while (t < r.t + dur - 0.02) {
      const v = 0.08 + Math.random() * 0.5 * forca;
      r.g.gain.setValueAtTime(v, t);
      t += 0.008 + Math.random() * 0.03;
      r.g.gain.setValueAtTime(v * 0.25, t);
    }
    r.g.gain.exponentialRampToValueAtTime(0.0001, r.t + dur);
    chiado(0.12, "lowpass", 900, 300, 0.25 * forca, 1, dur * 0.85); // o "tum" do papel soltando
  },
  // o papel voltando a se juntar, mais baixinho
  colar() {
    chiado(0.25, "bandpass", 2400, 600, 0.12, 1.2);
  },
  mordida() {
    const agora = performance.now();
    if (agora - ultimaMordida < 45) return;
    ultimaMordida = agora;
    tom(520 + Math.random() * 160, 0.07, "sine", 0.18, 180);
    chiado(0.04, "highpass", 3000, 2000, 0.08);
  },
  clique() {
    chiado(0.025, "highpass", 2500, 1800, 0.12);
  },
  certo() {
    tom(660, 0.09, "triangle", 0.22);
    tom(990, 0.12, "triangle", 0.22, undefined, 0.07);
  },
  errado() {
    tom(200, 0.22, "square", 0.08, 110);
  },
  palavra() {
    [523, 659, 784, 1047].forEach((f, i) => tom(f, 0.16, "triangle", 0.2, undefined, i * 0.08));
  },
  fim() {
    [392, 330, 262, 196].forEach((f, i) => tom(f, 0.22, "triangle", 0.18, undefined, i * 0.12));
  },
  abrir() {
    chiado(0.22, "lowpass", 400, 2400, 0.16, 0.7);
  },
  fechar() {
    chiado(0.18, "lowpass", 2200, 400, 0.12, 0.7);
  },
  embaralhar() {
    chiado(0.18, "bandpass", 1600, 3800, 0.18, 1.5);
    chiado(0.1, "bandpass", 2000, 1200, 0.12, 1.5, 0.12);
  },
  pagina() {
    tom(300, 0.25, "sine", 0.12, 900);
    chiado(0.3, "bandpass", 600, 3000, 0.1, 0.8);
  },
  risco() {
    chiado(0.35, "bandpass", 3000, 4200, 0.06, 4);
  },
  tchau() {
    tom(880, 0.08, "sine", 0.1, 1200);
    tom(1200, 0.1, "sine", 0.1, 900, 0.1);
  },
};
