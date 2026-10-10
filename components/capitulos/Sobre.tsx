import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import MarcaTexto from "../MarcaTexto";
import Riscado from "../Riscado";

// destaque no meio do texto: negrito com marca-texto só na metade de baixo, igual aos títulos
const G = ({ children }: { children: React.ReactNode }) => <strong className="grifo">{children}</strong>;

// capítulo 2: um cartão-postal neobrutalista
export default function Sobre() {
  return (
    <div className="mx-auto flex h-full max-w-6xl items-center px-4 pr-10 sm:px-8 sm:pr-14">
      <article className="relative grid w-full -rotate-1 gap-6 rounded-xl border-[3px] border-tinta bg-white p-5 shadow-brutal-lg sm:p-8 md:grid-cols-[5fr_6fr] md:gap-10">
        <figure className="relative hidden md:block">
          <span className="absolute -top-3 left-8 z-10 h-7 w-28 -rotate-6 border-2 border-tinta/30 bg-laranja/70" aria-hidden="true" />
          <img
            src="/img/tlou-girafa.webp"
            alt="Ellie fazendo carinho na girafa enquanto o Joel olha, The Last of Us Part I"
            className="aspect-[4/3] w-full rotate-1 rounded-lg border-[3px] border-tinta object-cover"
          />
          <figcaption className="mt-3 font-mao text-lg text-cinza">o meu descanso: The Last of Us Part I</figcaption>
        </figure>

        <div className="relative md:border-l-2 md:border-dashed md:border-tinta/30 md:pl-10">
          <img
            src="/profile.jpg"
            alt=""
            aria-hidden="true"
            className="absolute -right-2 -top-2 h-16 w-14 rotate-3 border-[3px] border-dashed border-tinta bg-white object-cover p-1 sm:h-20 sm:w-16"
          />
          <p className="font-mao text-sm uppercase tracking-widest text-laranja-texto">cartão-postal de Goiânia</p>
          <h2 className="mt-1 font-mao text-4xl sm:text-5xl">
            <MarcaTexto>Sobre mim</MarcaTexto>
          </h2>
          <p className="mt-5 text-base leading-relaxed sm:text-lg">
            Estudo Engenharia de Software e trabalho no <G>chatPro</G>, uma plataforma de atendimento e vendas pelo WhatsApp.
            Lá eu não fico só <Riscado>apagando incêndio</Riscado> no suporte: crio as ferramentas que deixam o time mais rápido.
          </p>
          <p className="mt-3 text-base leading-relaxed sm:text-lg">
            Fora dali, toco a <G>Vortexi</G> com o meu sócio e tiro ideias do papel com Next.js e Supabase.
          </p>
          <div className="mt-6 flex items-center justify-between gap-4 border-t-2 border-dashed border-tinta/30 pt-4">
            <span className="font-mao text-xl">Weuden</span>
            <Link href="/sobre" className="botao px-3 py-1.5 text-sm">
              Ler tudo sobre mim <ArrowRight className="h-4 w-4" weight="bold" />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
