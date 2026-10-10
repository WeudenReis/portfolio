"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react/dist/ssr";
import { contato } from "@/lib/dados";

export default function CopiarEmail() {
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(contato.email);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {}
  };
  return (
    <button onClick={copiar} className="botao" aria-live="polite">
      {copiado ? <Check className="h-5 w-5" weight="bold" /> : <Copy className="h-5 w-5" weight="bold" />}
      {copiado ? "Copiado!" : "Copiar e-mail"}
    </button>
  );
}
