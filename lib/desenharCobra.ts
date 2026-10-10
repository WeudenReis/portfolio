// Desenho da cobrinha no traço do site: corpo laranja, contorno grosso e olhinhos.
// Usado pela capa, pelo modo cobrinha do site e pelo jogo.
export type Ponto = { x: number; y: number };

export const COR = {
  laranja: "#FF7A33",
  laranjaEscuro: "#C2410C",
  tinta: "#1e1e1e",
  creme: "#FFF7ED",
};

export function desenharCobra(ctx: CanvasRenderingContext2D, corpo: Ponto[], raio: number, agora = 0) {
  if (corpo.length < 2) return;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // contorno: uma linha grossa preta por baixo, depois o laranja por cima
  ctx.beginPath();
  ctx.moveTo(corpo[corpo.length - 1].x, corpo[corpo.length - 1].y);
  for (let i = corpo.length - 2; i >= 0; i--) ctx.lineTo(corpo[i].x, corpo[i].y);
  ctx.strokeStyle = COR.tinta;
  ctx.lineWidth = raio * 2 + 5;
  ctx.stroke();
  ctx.strokeStyle = COR.laranja;
  ctx.lineWidth = raio * 2;
  ctx.stroke();

  // listras de leve no corpo
  ctx.fillStyle = COR.laranjaEscuro;
  for (let i = 2; i < corpo.length - 1; i += 3) {
    ctx.beginPath();
    ctx.arc(corpo[i].x, corpo[i].y, raio * 0.28, 0, Math.PI * 2);
    ctx.fill();
  }

  // cabeça
  const c = corpo[0];
  const atras = corpo[1];
  const ang = Math.atan2(c.y - atras.y, c.x - atras.x);
  ctx.translate(c.x, c.y);
  ctx.rotate(ang);

  // língua, piscando de vez em quando
  if (Math.sin(agora / 140) > 0.3) {
    ctx.strokeStyle = "#e11d48";
    ctx.lineWidth = Math.max(1.5, raio * 0.16);
    ctx.beginPath();
    ctx.moveTo(raio * 1.1, 0);
    ctx.lineTo(raio * 1.8, 0);
    ctx.lineTo(raio * 2.1, -raio * 0.3);
    ctx.moveTo(raio * 1.8, 0);
    ctx.lineTo(raio * 2.1, raio * 0.3);
    ctx.stroke();
  }

  ctx.fillStyle = COR.laranja;
  ctx.strokeStyle = COR.tinta;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(raio * 0.25, 0, raio * 1.35, raio * 1.15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  for (const lado of [-1, 1]) {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(raio * 0.55, lado * raio * 0.5, raio * 0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = COR.tinta;
    ctx.beginPath();
    ctx.arc(raio * 0.68, lado * raio * 0.5, raio * 0.18, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
