import { Mail } from "lucide-react";
import { contato } from "@/lib/dados";
import { IconeGithub, IconeLinkedin, IconeVortexi } from "./Icones";

export default function Hero() {
  return (
    <section id="inicio" className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16">
      {/* o banner laranja do README, agora em versão neobrutalista */}
      <div className="relative rounded-[1.75rem] border-[3px] border-tinta bg-laranja px-6 py-12 text-center shadow-brutal-lg sm:px-12 sm:py-16">
        <img
          src="/profile.jpg"
          alt="Foto do Weuden"
          width={112}
          height={112}
          className="absolute -top-8 right-4 h-20 w-20 rotate-6 rounded-xl border-[3px] border-tinta object-cover shadow-brutal-sm sm:-top-10 sm:right-10 sm:h-28 sm:w-28"
        />
        <h1 className="font-mao text-4xl leading-tight text-tinta sm:text-5xl lg:text-6xl">
          <span className="aceno mr-3" role="img" aria-label="mão acenando">
            👋
          </span>
          Olá, mundo! Eu sou o Weuden
        </h1>
        <p className="mt-5 font-mao text-xl text-tinta sm:text-3xl">
          Software Engineer · chatPro · Goiânia, GO
        </p>
      </div>

      <p className="mx-auto mt-12 max-w-3xl text-center font-mao text-2xl leading-snug text-laranja-texto sm:text-3xl">
        Extensões, automações e produtos web que resolvem problema de verdade.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <a href={`mailto:${contato.email}`} className="botao-laranja">
          <Mail className="h-5 w-5" strokeWidth={2.5} /> Gmail
        </a>
        <a href={contato.github} target="_blank" rel="noreferrer" className="botao">
          <IconeGithub /> GitHub
        </a>
        <a href={contato.linkedin} target="_blank" rel="noreferrer" className="botao">
          <IconeLinkedin /> LinkedIn
        </a>
        <a href={contato.vortexi} target="_blank" rel="noreferrer" className="botao">
          <IconeVortexi /> Vortexi
        </a>
      </div>
    </section>
  );
}
