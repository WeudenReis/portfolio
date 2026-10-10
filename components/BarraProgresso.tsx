"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Barrinha laranja logo abaixo do menu que enche conforme a página rola (no lugar da barra lateral).
// Na capa não aparece: lá o trilho dos pontinhos já faz esse papel.
export default function BarraProgresso() {
  const barra = useRef<HTMLDivElement>(null);
  const caminho = usePathname();

  useEffect(() => {
    if (caminho === "/") return;
    let quadro = 0;
    const atualizar = () => {
      quadro = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (barra.current) barra.current.style.transform = `scaleX(${p})`;
    };
    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    };
    atualizar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, [caminho]);

  if (caminho === "/") return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-[var(--nav)] z-40 h-[5px]" aria-hidden="true">
      <div ref={barra} className="h-full w-full origin-left scale-x-0 border-b-2 border-tinta bg-laranja" />
    </div>
  );
}
