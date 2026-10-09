import { linhaDoTempo, oQueEuFaco } from "@/lib/dados";
import Titulo from "./Titulo";

export default function Trajetoria() {
  return (
    <section id="trajetoria" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Titulo>O que eu faço</Titulo>
      <div className="gap-8 md:columns-2">
        {oQueEuFaco.map((grupo, i) => (
          <div key={grupo.titulo} className="caixa mb-8 break-inside-avoid overflow-hidden">
            <h3
              className={`border-b-[3px] border-tinta px-6 py-3 text-lg font-bold ${
                i === 0 ? "bg-laranja" : "bg-laranja-claro"
              }`}
            >
              {grupo.titulo}
            </h3>
            <ul className="space-y-3 p-6">
              {grupo.itens.map(([nome, texto]) => (
                <li key={nome} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rotate-45 border-2 border-tinta bg-laranja" />
                  <p>
                    <strong>{nome}</strong>: {texto}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-cinza">
        Boa parte desses projetos é privada, por ser de empresa ou de cliente.
      </p>

      <div className="mt-24">
        <Titulo>Linha do tempo</Titulo>
        <ol className="relative mx-auto max-w-3xl border-l-[3px] border-tinta pl-8">
          {linhaDoTempo.map(([quando, oQue], i) => (
            <li key={quando} className="relative pb-6 last:pb-0">
              <span
                className={`absolute -left-[2.85rem] top-3 h-6 w-6 rounded-full border-[3px] border-tinta ${
                  i === linhaDoTempo.length - 1 ? "bg-laranja" : "bg-white"
                }`}
              />
              <div className="caixa flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:gap-5">
                <span className="w-28 shrink-0 whitespace-nowrap font-mao text-xl text-laranja-texto">{quando}</span>
                <span>{oQue}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
