import { alemDoCodigo } from "@/lib/dados";
import Titulo from "./Titulo";

// destaque no meio do texto: negrito com marca-texto só na metade de baixo, igual aos títulos
const G = ({ children }: { children: React.ReactNode }) => <strong className="grifo">{children}</strong>;

export default function SobreMim() {
  return (
    <section id="sobre" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <figure className="caixa -rotate-2 overflow-hidden p-0">
          <img
            src="/img/tlou-girafa.webp"
            alt="Ellie fazendo carinho na girafa enquanto o Joel olha, The Last of Us Part I"
            className="aspect-[16/10] w-full object-cover"
          />
        </figure>
        <div>
          <Titulo>Sobre mim</Titulo>
          <div className="caixa space-y-4 p-6 text-lg leading-relaxed sm:p-8">
            <p>
              Estudo Engenharia de Software e trabalho no <G>chatPro</G>, aqui em Goiânia, uma plataforma de atendimento e
              vendas pelo WhatsApp. Crio as ferramentas que deixam o time de suporte e de vendas mais rápido: extensões de
              navegador, automações de envio, transcrição de reuniões e, agora, <G>agentes de IA</G> que conversam com o lead.
            </p>
            <p>
              Fora do chatPro, toco a <G>Vortexi</G> com o meu sócio, fazendo sites e sistemas sob medida para empresas, e
              desenvolvo produtos próprios com Next.js, React, TypeScript e Supabase.
            </p>
            <p>
              Gosto de pegar um problema real da operação, entender o fluxo de quem usa e entregar a solução inteira:
              interface, integração, testes e deploy. Em paralelo, sigo na faculdade, estudando segurança da informação
              e desenvolvimento mobile.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-24 grid items-center gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="order-2 lg:order-1">
          <Titulo>Além do código</Titulo>
          <ul className="space-y-3">
            {alemDoCodigo.map((item, i) => (
              <li key={item} className="caixa flex items-start gap-4 p-4 text-lg">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-2 border-tinta bg-laranja font-mao text-lg">
                  {i + 1}
                </span>
                <span className="pt-0.5">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <figure className="caixa order-1 rotate-2 overflow-hidden p-0 lg:order-2">
          <img
            src="/img/tlou-joel-rindo.webp"
            alt="Joel rindo das piadas da Ellie no carro, The Last of Us Part I"
            className="aspect-[16/10] w-full object-cover"
          />
        </figure>
      </div>
    </section>
  );
}
