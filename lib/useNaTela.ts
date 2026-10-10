"use client";

import { useEffect, useRef, useState } from "react";

// true a partir da primeira vez que o elemento aparece na tela
export function useNaTela<T extends Element>(margem = "0px 0px -15% 0px") {
  const ref = useRef<T>(null);
  const [visto, setVisto] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visto) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisto(true);
          obs.disconnect();
        }
      },
      { rootMargin: margem },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visto, margem]);

  return [ref, visto] as const;
}
