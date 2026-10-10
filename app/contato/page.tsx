import type { Metadata } from "next";
import { contato } from "@/lib/dados";
import MarcaTexto from "@/components/MarcaTexto";
import Riscado from "@/components/Riscado";
import CopiarEmail from "@/components/CopiarEmail";
import Postal from "@/components/Postal";
import { IconeGithub, IconeInstagram, IconeLinkedin, IconeVortexi } from "@/components/Icones";

export const metadata: Metadata = {
  title: "Contato",
  description: "Manda um recado para o Weuden: e-mail, LinkedIn, GitHub e Instagram.",
};

const redes = [
  { label: "GitHub", href: contato.github, Icone: IconeGithub, user: "WeudenReis" },
  { label: "LinkedIn", href: contato.linkedin, Icone: IconeLinkedin, user: "Weuden dos Reis" },
  { label: "Instagram", href: contato.instagram, Icone: IconeInstagram, user: "@weudenx" },
  { label: "Vortexi", href: contato.vortexi, Icone: IconeVortexi, user: "vortexi.com.br" },
];

export default function PaginaContato() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="font-mao text-lg text-laranja-texto">caixa de correio</p>
      <h1 className="mt-1 font-mao text-5xl leading-tight sm:text-7xl">
        <MarcaTexto>Me manda um postal</MarcaTexto>
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed sm:text-xl">
        Escreva o recado no cartão aqui embaixo. Quando você mandar, o seu e-mail abre com tudo preenchido, é só conferir e
        enviar. Eu respondo <Riscado>quando der</Riscado> rapidinho.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[3fr_2fr]">
        <Postal />

        <aside className="space-y-6">
          <div className="caixa p-6">
            <p className="font-mao text-xl text-cinza">ou direto no e-mail</p>
            <a href={`mailto:${contato.email}`} className="mt-1 block break-all font-mao text-2xl hover:text-laranja-texto">
              {contato.email}
            </a>
            <div className="mt-4">
              <CopiarEmail />
            </div>
          </div>
          <ul className="grid gap-3">
            {redes.map(({ label, href, Icone, user }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer" className="caixa flex items-center gap-4 p-4 hover:bg-laranja-claro">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-tinta bg-laranja">
                    <Icone />
                  </span>
                  <span>
                    <span className="block font-bold">{label}</span>
                    <span className="text-sm text-cinza">{user}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
