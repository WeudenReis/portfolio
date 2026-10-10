"use client";

import { useNaTela } from "@/lib/useNaTela";

// Marca-texto que pinta só a metade de baixo das letras, passando da esquerda para a direita
// quando o texto aparece na tela.
export default function MarcaTexto({
  children,
  cor = "laranja",
  atraso = 0,
}: {
  children: React.ReactNode;
  cor?: "laranja" | "creme" | "branco";
  atraso?: number;
}) {
  const [ref, visto] = useNaTela<HTMLSpanElement>();
  return (
    <span
      ref={ref}
      className={`marca marca-${cor} ${visto ? "marca-visivel" : ""}`}
      style={{ transitionDelay: `${atraso}ms` }}
    >
      {children}
    </span>
  );
}
