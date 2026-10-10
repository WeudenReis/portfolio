"use client";

// Sons do site. Os efeitos de verdade vêm do Pixabay (licença livre, origem de cada um em
// public/sons/CREDITOS.txt) e ficam em public/sons. O navegador só libera áudio num clique ou tecla
// de verdade, então o contexto nasce aí e os arquivos são baixados logo em seguida. Enquanto um arquivo
// não carregou (ou se falhar), toca uma versão sintetizada com Web Audio. Com o áudio ainda travado,
// nenhum som fica na fila: ele simplesmente não toca.
// A preferência fica no localStorage ("sons" = "off" desliga).

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

// ---------- arquivos ----------
const ARQUIVOS = [
  "rasgo-1", "rasgo-2", "rasgo-3", "colar-1", "mordida-1", "mordida-2", "clique-1", "whoosh-1", "whoosh-2",
  "certo-1", "errado-1", "palavra-1", "fim-1", "embaralhar-1", "risco-1", "pop-1",
];
const buffers = new Map<string, AudioBuffer>();
let carregando = false;

function inverter(b: AudioBuffer) {
  const r = ctx!.createBuffer(b.numberOfChannels, b.length, b.sampleRate);
  for (let c = 0; c < b.numberOfChannels; c++) {
    const de = b.getChannelData(c);
    const para = r.getChannelData(c);
    for (let i = 0; i < de.length; i++) para[i] = de[de.length - 1 - i];
  }
  return r;
}

async function carregarArquivos() {
  if (carregando || !ctx) return;
  carregando = true;
  const c = ctx;
  await Promise.all(
    ARQUIVOS.map(async (n) => {
      try {
        const r = await fetch(`/sons/${n}.mp3`);
        if (r.ok) buffers.set(n, await c.decodeAudioData(await r.arrayBuffer()));
      } catch {}
    }),
  );
  // fechar o modal = o whoosh de abrir tocado ao contrário
  const w = buffers.get("whoosh-1");
  if (w) buffers.set("whoosh-1-reverso", inverter(w));
}

// chamar só dentro de um clique ou tecla de verdade
export function iniciarAudio() {
  if (typeof window === "undefined") return;
  if (ctx) {
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    return;
  }
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  saida = ctx.createGain();
  saida.gain.value = 0.6;
  saida.connect(ctx.destination);
  ruido = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
  const d = ruido.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  void carregarArquivos();
}

// só devolve o contexto se ele já estiver tocando; nunca agenda som num áudio travado
const pronto = () => {
  if (!ligado || !ctx || !saida || document.hidden) return null;
  if (ctx.state !== "running") return null;
  return ctx;
};

// intervalo mínimo entre duas vezes do mesmo som, para não virar metralhadora
const ultimaVez = new Map<string, number>();
function podeTocar(nome: string, minimo: number) {
  const agora = performance.now();
  if (agora - (ultimaVez.get(nome) ?? -1e9) < minimo) return false;
  ultimaVez.set(nome, agora);
  return true;
}

// toca um dos arquivos da lista; devolve false se nenhum está pronto (aí entra o sintetizado)
function tocar(nomes: string[], vol: number, variacao = 0) {
  const c = pronto();
  if (!c) return true; // áudio desligado ou travado: não toca nada, nem o sintetizado
  const prontos = nomes.filter((n) => buffers.has(n));
  if (!prontos.length) return false;
  const s = c.createBufferSource();
  s.buffer = buffers.get(prontos[Math.floor(Math.random() * prontos.length)])!;
  if (variacao) s.playbackRate.value = 1 + (Math.random() * 2 - 1) * variacao;
  const g = c.createGain();
  g.gain.value = vol;
  s.connect(g).connect(saida!);
  s.start();
  return true;
}

// ---------- sintetizados (reserva) ----------
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
  if (!c || !ruido) return;
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
}

export const som = {
  // papel rasgando (3 rasgos diferentes, com variação de tom)
  rasgo(forca = 1) {
    if (!podeTocar("rasgo", 250)) return;
    if (!tocar(["rasgo-1", "rasgo-2", "rasgo-3"], 0.9 * forca, 0.06)) chiado(0.6, "bandpass", 700, 3200, 0.45 * forca, 0.9);
  },
  // o papel voltando a se juntar, mais baixinho
  colar() {
    if (!podeTocar("colar", 250)) return;
    if (!tocar(["colar-1"], 0.45)) chiado(0.25, "bandpass", 2400, 600, 0.12, 1.2);
  },
  mordida() {
    if (!podeTocar("mordida", 45)) return;
    if (!tocar(["mordida-1", "mordida-2"], 0.32, 0.12)) tom(520 + Math.random() * 160, 0.07, "sine", 0.18, 180);
  },
  clique() {
    if (!podeTocar("clique", 40)) return;
    if (!tocar(["clique-1"], 0.2, 0.05)) chiado(0.025, "highpass", 2500, 1800, 0.12);
  },
  certo() {
    if (!tocar(["certo-1"], 0.5)) {
      tom(660, 0.09, "triangle", 0.22);
      tom(990, 0.12, "triangle", 0.22, undefined, 0.07);
    }
  },
  errado() {
    if (!tocar(["errado-1"], 0.45)) tom(200, 0.22, "square", 0.08, 110);
  },
  palavra() {
    if (!tocar(["palavra-1"], 0.55)) [523, 659, 784, 1047].forEach((f, i) => tom(f, 0.16, "triangle", 0.2, undefined, i * 0.08));
  },
  fim() {
    if (!tocar(["fim-1"], 0.55)) [392, 330, 262, 196].forEach((f, i) => tom(f, 0.22, "triangle", 0.18, undefined, i * 0.12));
  },
  abrir() {
    if (!podeTocar("abrir", 200)) return;
    if (!tocar(["whoosh-1"], 0.4)) chiado(0.22, "lowpass", 400, 2400, 0.16, 0.7);
  },
  fechar() {
    if (!podeTocar("fechar", 200)) return;
    if (!tocar(["whoosh-1-reverso"], 0.3)) chiado(0.18, "lowpass", 2200, 400, 0.12, 0.7);
  },
  embaralhar() {
    if (!podeTocar("embaralhar", 150)) return;
    if (!tocar(["embaralhar-1"], 0.5, 0.05)) chiado(0.18, "bandpass", 1600, 3800, 0.18, 1.5);
  },
  pagina() {
    if (!podeTocar("pagina", 400)) return;
    if (!tocar(["whoosh-2"], 0.5)) chiado(0.3, "bandpass", 600, 3000, 0.1, 0.8);
  },
  risco() {
    if (!podeTocar("risco", 300)) return;
    if (!tocar(["risco-1"], 0.3, 0.05)) chiado(0.35, "bandpass", 3000, 4200, 0.06, 4);
  },
  tchau() {
    if (!podeTocar("tchau", 300)) return;
    if (!tocar(["pop-1"], 0.45, 0.08)) tom(880, 0.08, "sine", 0.1, 1200);
  },
  // baque de algo caindo (bonequinho no chão, letra deitando)
  tombo(forca = 0.6) {
    if (!podeTocar("tombo", 120)) return;
    tom(140, 0.14, "sine", 0.3 * forca, 55);
    chiado(0.09, "lowpass", 900, 220, 0.25 * forca);
  },
  // toquinho seco, uma letra batendo na outra no dominó
  toc() {
    if (!tocar(["clique-1"], 0.25, 0.25)) tom(1300 + Math.random() * 300, 0.035, "triangle", 0.07);
  },
};
