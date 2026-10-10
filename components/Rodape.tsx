import Link from "next/link";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { contato } from "@/lib/dados";
import { IconeGithub, IconeInstagram, IconeLinkedin, IconeVortexi } from "./Icones";

const redes = [
  { label: "GitHub", href: contato.github, Icone: IconeGithub },
  { label: "LinkedIn", href: contato.linkedin, Icone: IconeLinkedin },
  { label: "Instagram", href: contato.instagram, Icone: IconeInstagram },
  { label: "Vortexi", href: contato.vortexi, Icone: IconeVortexi },
];

export default function Rodape() {
  return (
    <footer className="border-t-[3px] border-tinta bg-white">
      <img src="/img/rodape.svg" alt="" aria-hidden="true" className="mx-auto -mt-6 w-full max-w-6xl px-4" />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-24 pt-4 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-mao text-3xl">
            weuden<span className="text-laranja">.</span>
          </p>
          <p className="mt-2 text-sm text-cinza">Software Engineer na chatPro, em Goiânia, GO. Feito à mão, com a cobrinha à solta.</p>
        </div>
        <nav aria-label="Rodapé">
          <ul className="grid grid-cols-2 gap-2 text-sm font-bold">
            {[
              ["Início", "/"],
              ["Projetos", "/projetos"],
              ["Sobre", "/sobre"],
              ["Jogo", "/jogo"],
              ["Contato", "/contato"],
            ].map(([nome, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-laranja-texto hover:underline">
                  {nome}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <a href={`mailto:${contato.email}`} className="inline-flex items-center gap-2 text-sm font-bold hover:underline">
            <EnvelopeSimple className="h-4 w-4" weight="bold" /> {contato.email}
          </a>
          <div className="mt-4 flex gap-2">
            {redes.map(({ label, href, Icone }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label} className="botao h-10 w-10 justify-center p-0">
                <Icone className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
