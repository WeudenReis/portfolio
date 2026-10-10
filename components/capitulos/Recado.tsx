import Link from "next/link";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { contato } from "@/lib/dados";
import MarcaTexto from "../MarcaTexto";
import Riscado from "../Riscado";
import CopiarEmail from "../CopiarEmail";
import { IconeCobra } from "../Icones";

// capítulo 5: o último, que não rasga
export default function Recado() {
  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col justify-center px-4 pr-10 sm:px-8 sm:pr-14">
      <h2 className="font-mao text-5xl sm:text-7xl">
        <MarcaTexto>Bora conversar?</MarcaTexto>
      </h2>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl">
        Tem um problema na operação que dá pra automatizar, ou um sistema pra tirar do papel? Me chama, sem{" "}
        <Riscado>formulário de 20 campos</Riscado> enrolação.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-[3fr_2fr]">
        <div className="rounded-xl border-[3px] border-tinta bg-white p-5 shadow-brutal-lg sm:p-7">
          <p className="font-mao text-lg text-cinza">Para: Weuden, Goiânia GO</p>
          <a href={`mailto:${contato.email}`} className="mt-2 block break-all font-mao text-2xl hover:text-laranja-texto sm:text-4xl">
            {contato.email}
          </a>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={`mailto:${contato.email}`} className="botao-laranja">
              <EnvelopeSimple className="h-5 w-5" weight="bold" /> Mandar e-mail
            </a>
            <CopiarEmail />
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 rounded-xl border-[3px] border-dashed border-tinta p-5">
          <p className="font-mao text-2xl leading-snug">Ou desafie a cobrinha e me mande o seu recorde.</p>
          <Link href="/jogo" className="botao-tinta self-start">
            <IconeCobra className="h-5 w-5" /> Jogar agora
          </Link>
        </div>
      </div>
    </div>
  );
}
