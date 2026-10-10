import Link from "next/link";
import { ArrowDown } from "@phosphor-icons/react/dist/ssr";
import { oQueEuCrio } from "@/lib/dados";
import CobraTitulo from "../CobraTitulo";
import LogoTchau from "../LogoTchau";
import Digitando from "../Digitando";
import Riscado from "../Riscado";
import { IconeCobra } from "../Icones";

export default function Capa() {
  return (
    <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-4 pb-16 pr-10 sm:px-8 sm:pr-14">
      <p className="etiqueta mb-10 self-start sm:mb-12">
        <span className="h-2 w-2 rounded-full bg-laranja" /> Goiânia, GO · Software Engineer na chatPro
      </p>

      <div className="relative rounded-[1.75rem] border-[3px] border-tinta bg-laranja px-5 py-7 shadow-brutal-lg sm:px-10 sm:py-10">
        <LogoTchau className="absolute -left-4 -top-9 h-16 w-16 -rotate-6 sm:-left-7 sm:-top-11 sm:h-20 sm:w-20" />
        <img
          src="/profile.jpg"
          alt="Foto do Weuden"
          width={112}
          height={112}
          className="absolute -top-8 right-4 h-16 w-16 rotate-6 rounded-xl border-[3px] border-tinta object-cover shadow-brutal-sm sm:-top-10 sm:right-8 sm:h-24 sm:w-24"
        />
        <CobraTitulo linhas={["Olá, mundo!", "Eu sou o Weuden"]} className="text-5xl text-tinta sm:text-7xl lg:text-8xl" />
      </div>

      <p className="mt-8 min-h-[2.75em] font-mao text-2xl leading-snug sm:text-4xl md:min-h-0">
        Eu crio <Digitando frases={oQueEuCrio} className="text-laranja-texto" />
      </p>
      <p className="mt-3 max-w-2xl text-lg text-cinza sm:text-xl">
        Faço <Riscado>landing page</Riscado> site e sistema de verdade, do problema real ao deploy.
      </p>

      <div className="mt-7 flex flex-wrap gap-3">
        <Link href="/projetos" className="botao-laranja">
          Ver projetos
        </Link>
        <Link href="/jogo" className="botao">
          <IconeCobra className="h-5 w-5" /> Jogar a cobrinha
        </Link>
      </div>

      <p className="absolute bottom-5 left-4 flex items-center gap-2 font-mao text-base text-cinza sm:left-8">
        <ArrowDown className="h-4 w-4 animate-bounce" weight="bold" />
        continue rolando, a página rasga
      </p>
    </div>
  );
}
