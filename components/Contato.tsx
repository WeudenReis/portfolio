import { Mail } from "lucide-react";
import { contato } from "@/lib/dados";
import { IconeGithub, IconeInstagram, IconeLinkedin, IconeVortexi } from "./Icones";

const redes = [
  { label: "GitHub", href: contato.github, Icone: IconeGithub },
  { label: "LinkedIn", href: contato.linkedin, Icone: IconeLinkedin },
  { label: "Instagram", href: contato.instagram, Icone: IconeInstagram },
  { label: "Vortexi", href: contato.vortexi, Icone: IconeVortexi },
];

export default function Contato() {
  return (
    <footer id="contato" className="mx-auto max-w-6xl px-4 pb-10 pt-16 sm:px-6">
      <div className="caixa bg-laranja-claro px-6 py-12 text-center shadow-brutal-lg sm:px-12">
        <p className="font-mao text-4xl sm:text-5xl">Bora conversar?</p>
        <p className="mx-auto mt-4 max-w-xl text-lg text-cinza">
          Tem um problema na operação que dá pra automatizar, ou um site/sistema pra tirar do papel? Me chama.
        </p>
        <a href={`mailto:${contato.email}`} className="botao-laranja mt-8 text-lg">
          <Mail className="h-5 w-5" strokeWidth={2.5} /> {contato.email}
        </a>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {redes.map(({ label, href, Icone }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              title={label}
              className="botao h-12 w-12 justify-center p-0"
            >
              <Icone />
            </a>
          ))}
        </div>
      </div>

      <img src="/img/rodape.svg" alt="" aria-hidden="true" className="mt-12 w-full" />
      <p className="mt-2 text-center font-mao text-lg text-cinza">
        feito à mão por Weuden · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
