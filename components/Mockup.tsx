import type { Mock, Projeto } from "@/lib/dados";

// Moldura de navegador (ou celular) com o preview do projeto: print do site no ar,
// ou uma ilustração da tela quando o projeto é privado. Os tamanhos usam cqw, então
// tudo escala junto com a largura da moldura.

export default function Mockup({ projeto, className = "" }: { projeto: Projeto; className?: string }) {
  const pv = projeto.preview;
  const celular = "mock" in pv && (pv.mock === "sdr" || pv.mock === "imc");
  return (
    <figure className={`overflow-hidden rounded-xl border-[3px] border-tinta bg-white shadow-brutal [container-type:inline-size] ${className}`}>
      <div className="flex items-center gap-[1.2cqw] border-b-[3px] border-tinta bg-laranja-claro px-[1.6cqw] py-[1.1cqw]">
        {["bg-laranja", "bg-white", "bg-white"].map((c, i) => (
          <span key={i} className={`h-[1.5cqw] w-[1.5cqw] rounded-full border-2 border-tinta ${c}`} />
        ))}
        <span className="ml-[1cqw] flex-1 truncate rounded-md border-2 border-tinta bg-white px-[1.2cqw] py-[0.3cqw] font-mono text-[1.5cqw]">
          {pv.endereco}
        </span>
        {"mock" in pv && (
          <span className="hidden shrink-0 rounded-md border-2 border-tinta bg-white px-[1cqw] py-[0.2cqw] font-mao text-[1.5cqw] sm:inline">
            ilustração · código privado
          </span>
        )}
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        {"print" in pv ? (
          <img src={pv.print} alt={`Tela de ${projeto.nome}`} className="h-full w-full object-cover object-top" />
        ) : celular ? (
          <div className="flex h-full items-center justify-center bg-laranja-claro">
            <div className="h-[92%] aspect-[9/18] overflow-hidden rounded-[3cqw] border-[3px] border-tinta bg-white shadow-brutal-sm [container-type:inline-size]">
              <Tela mock={pv.mock} />
            </div>
          </div>
        ) : (
          <Tela mock={pv.mock} />
        )}
      </div>
      <figcaption className="sr-only">Preview de {projeto.nome}</figcaption>
    </figure>
  );
}

const Linha = ({ w = "100%", className = "" }: { w?: string; className?: string }) => (
  <span className={`block h-[1.1cqw] rounded-full bg-tinta/15 ${className}`} style={{ width: w }} />
);

const conversas = ["Mariana S.", "Loja Bela Flor", "Carlos (orçamento)", "Ana Paula", "Clínica Vida", "João P."];

function Tela({ mock }: { mock: Mock }) {
  const base = "h-full w-full text-[1.6cqw]";
  switch (mock) {
    case "alerta":
      return (
        <div className={`${base} grid grid-cols-[34%_1fr]`}>
          <ul className="border-r-[3px] border-tinta bg-white">
            {conversas.map((n, i) => {
              const parada = i === 1 || i === 4;
              return (
                <li key={n} className={`flex items-center gap-[1cqw] border-b-2 border-tinta/15 px-[1.4cqw] py-[1.2cqw] ${parada ? "bg-laranja/90" : ""}`}>
                  <span className="h-[3.6cqw] w-[3.6cqw] shrink-0 rounded-full border-2 border-tinta bg-laranja-claro" />
                  <span className="min-w-0 flex-1">
                    <b className="block truncate">{n}</b>
                    <span className="block truncate text-[1.3cqw] opacity-70">{parada ? "sem resposta há 7 min" : "ok, obrigado!"}</span>
                  </span>
                  {parada && <span className="rounded border-2 border-tinta bg-white px-[0.6cqw] font-bold text-[1.2cqw]">7 min</span>}
                </li>
              );
            })}
          </ul>
          <div className="flex flex-col gap-[1.2cqw] bg-laranja-claro/60 p-[2cqw]">
            <span className="self-center rounded-full border-2 border-tinta bg-laranja px-[1.6cqw] py-[0.5cqw] font-bold">chatpro-alert: responda esta conversa</span>
            <span className="mt-auto max-w-[70%] self-start rounded-lg border-2 border-tinta bg-white px-[1.4cqw] py-[0.8cqw]">Oi, alguém pode me ajudar?</span>
            <span className="max-w-[70%] self-start rounded-lg border-2 border-tinta bg-white px-[1.4cqw] py-[0.8cqw]">Ainda estou esperando...</span>
          </div>
        </div>
      );
    case "disparos":
      return (
        <div className={`${base} flex flex-col gap-[1.6cqw] bg-laranja-claro/50 p-[2.4cqw]`}>
          <div className="flex gap-[1cqw] font-bold">
            {["Conversas", "Contatos", "Disparos"].map((a) => (
              <span key={a} className={`rounded-md border-2 border-tinta px-[1.4cqw] py-[0.4cqw] ${a === "Disparos" ? "bg-laranja" : "bg-white"}`}>{a}</span>
            ))}
          </div>
          <div className="grid flex-1 grid-cols-2 gap-[1.6cqw]">
            <div className="rounded-lg border-[3px] border-tinta bg-white p-[1.6cqw]">
              <b>Mensagem</b>
              <div className="mt-[1cqw] space-y-[0.8cqw]"><Linha /><Linha w="85%" /><Linha w="60%" /></div>
              <div className="mt-[1.6cqw] flex gap-[1cqw]">
                <span className="rounded border-2 border-tinta bg-laranja-claro px-[1cqw]">imagem.jpg</span>
                <span className="rounded border-2 border-tinta bg-laranja-claro px-[1cqw]">tabela.pdf</span>
              </div>
            </div>
            <div className="rounded-lg border-[3px] border-tinta bg-white p-[1.6cqw]">
              <b>Lista: clientes de setembro</b>
              <p className="mt-[1cqw] opacity-70">40 contatos</p>
              <div className="mt-[2cqw] h-[2.4cqw] overflow-hidden rounded-full border-2 border-tinta bg-white">
                <div className="h-full w-[30%] bg-laranja" />
              </div>
              <p className="mt-[1cqw] font-bold">Enviando 12 de 40</p>
              <p className="opacity-70">próxima mensagem em 10 s</p>
            </div>
          </div>
        </div>
      );
    case "transcricao":
      return (
        <div className={`${base} grid grid-cols-[1fr_36%] bg-tinta`}>
          <div className="grid grid-cols-2 gap-[1.2cqw] p-[1.6cqw]">
            {["Você", "Cliente"].map((n) => (
              <div key={n} className="flex flex-col items-center justify-center gap-[1cqw] rounded-lg border-2 border-white/40 bg-white/10 text-white">
                <span className="h-[8cqw] w-[8cqw] rounded-full border-2 border-white/60 bg-laranja/80" />
                <span className="text-[1.4cqw]">{n}</span>
              </div>
            ))}
          </div>
          <div className="space-y-[1.2cqw] overflow-hidden border-l-[3px] border-tinta bg-white p-[1.6cqw]">
            <b className="flex items-center gap-[0.8cqw]"><span className="h-[1.4cqw] w-[1.4cqw] rounded-full bg-laranja" /> Transcrevendo</b>
            {[["Cliente", "Hoje a gente responde tudo na mão..."], ["Você", "Dá pra automatizar o primeiro contato."], ["Cliente", "E quanto tempo leva pra configurar?"]].map(([q, f], i) => (
              <p key={i}><b className="text-laranja-texto">{q}:</b> {f}</p>
            ))}
          </div>
        </div>
      );
    case "tour":
      return (
        <div className={`${base} relative bg-laranja-claro/40 p-[2cqw]`}>
          <div className="grid h-full grid-cols-[22%_1fr] gap-[1.6cqw] opacity-50">
            <div className="space-y-[1.2cqw] rounded-lg border-2 border-tinta bg-white p-[1.4cqw]"><Linha /><Linha w="70%" /><Linha w="80%" /><Linha w="60%" /></div>
            <div className="space-y-[1.4cqw] rounded-lg border-2 border-tinta bg-white p-[1.6cqw]"><Linha w="40%" /><Linha /><Linha w="90%" /></div>
          </div>
          <div className="absolute left-[3cqw] top-[8cqw] h-[5cqw] w-[20cqw] rounded-lg border-[3px] border-tinta bg-white shadow-[0_0_0_200cqw_rgba(30,30,30,0.35)]" />
          <div className="absolute left-[26cqw] top-[6cqw] w-[34cqw] rounded-lg border-[3px] border-tinta bg-white p-[1.6cqw] shadow-brutal-sm">
            <p className="font-bold text-laranja-texto">Passo 2 de 5</p>
            <p className="mt-[0.6cqw] font-bold">Conecte o seu WhatsApp</p>
            <p className="mt-[0.4cqw] opacity-70">É por aqui que as conversas chegam.</p>
            <div className="mt-[1.2cqw] flex justify-end gap-[1cqw]">
              <span className="rounded border-2 border-tinta px-[1cqw]">Voltar</span>
              <span className="rounded border-2 border-tinta bg-laranja px-[1cqw] font-bold">Próximo</span>
            </div>
          </div>
        </div>
      );
    case "sdr":
      return (
        <div className="flex h-full flex-col bg-laranja-claro text-[6cqw] leading-snug">
          <div className="flex items-center gap-[3cqw] border-b-2 border-tinta bg-white px-[5cqw] py-[4cqw] font-bold">
            <span className="h-[9cqw] w-[9cqw] rounded-full border-2 border-tinta bg-laranja" /> Assistente de vendas
          </div>
          <div className="flex flex-1 flex-col justify-end gap-[3cqw] p-[4cqw]">
            {[
              ["eu", "Oi, vi o anúncio de vocês"],
              ["ia", "Oi! Quantas pessoas atendem no WhatsApp hoje?"],
              ["eu", "Umas 4"],
              ["ia", "Perfeito. Vou te passar para um especialista agora."],
            ].map(([quem, t], i) => (
              <span key={i} className={`max-w-[82%] rounded-lg border-2 border-tinta px-[3.5cqw] py-[2cqw] ${quem === "eu" ? "self-end bg-white" : "self-start bg-laranja"}`}>{t}</span>
            ))}
          </div>
          <div className="m-[4cqw] mt-0 rounded-full border-2 border-tinta bg-white px-[4cqw] py-[2.5cqw] opacity-60">Mensagem</div>
        </div>
      );
    case "kanban":
      return (
        <div className={`${base} grid grid-cols-3 gap-[1.6cqw] bg-laranja-claro/50 p-[2cqw]`}>
          {[["A fazer", ["Cliente sem QR Code", "Dúvida sobre API", "Trocar número"]], ["Fazendo", ["Webhook não chega", "Migração de conta"]], ["Feito", ["Instância reconectada", "Treinamento novo cliente"]]].map(([col, cards]) => (
            <div key={col as string} className="rounded-lg border-[3px] border-tinta bg-white/70 p-[1.2cqw]">
              <b className="mb-[1cqw] block">{col as string}</b>
              <div className="space-y-[1cqw]">
                {(cards as string[]).map((c, i) => (
                  <div key={c} className="rounded-md border-2 border-tinta bg-white p-[1cqw] shadow-[2px_2px_0_#1e1e1e]">
                    {c}
                    <span className={`mt-[0.6cqw] block h-[0.8cqw] w-[30%] rounded-full ${i % 2 ? "bg-laranja-claro" : "bg-laranja"}`} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    case "notion":
      return (
        <div className={`${base} p-[3cqw]`}>
          <p className="text-[3cqw] font-bold">Operação Vortexi</p>
          <p className="opacity-60">sincronizado pela API</p>
          <table className="mt-[2cqw] w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-tinta text-left">{["Cliente", "Etapa", "Entrega"].map((h) => <th key={h} className="py-[0.8cqw]">{h}</th>)}</tr>
            </thead>
            <tbody>
              {[["Studio A", "Design", "12/10"], ["Clínica B", "Desenvolvimento", "20/10"], ["Loja C", "No ar", "02/10"], ["Escola D", "Briefing", "30/10"]].map((r) => (
                <tr key={r[0]} className="border-b border-tinta/20">
                  <td className="py-[0.9cqw]">{r[0]}</td>
                  <td><span className={`rounded border-2 border-tinta px-[0.8cqw] ${r[1] === "No ar" ? "bg-laranja" : "bg-laranja-claro"}`}>{r[1]}</span></td>
                  <td>{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "vitrine":
      return (
        <div className={`${base} grid grid-cols-[1fr_1fr] gap-[1.6cqw] bg-laranja-claro/50 p-[2cqw]`}>
          <div className="rounded-lg border-[3px] border-tinta bg-white p-[1.6cqw]">
            <b>Landing page</b>
            <div className="mt-[1.2cqw] rounded-md border-2 border-tinta bg-laranja p-[1.6cqw] text-center font-bold">Sua oferta aqui</div>
            <div className="mt-[1.2cqw] space-y-[0.8cqw]"><Linha /><Linha w="80%" /></div>
            <div className="mt-[1.4cqw] rounded border-2 border-tinta bg-tinta py-[0.6cqw] text-center font-bold text-white">Quero saber mais</div>
          </div>
          <div className="flex flex-col gap-[1.6cqw]">
            <div className="grid grid-cols-2 gap-[1.2cqw]">
              {[["Cliques", "1.284"], ["Leads", "96"]].map(([k, v]) => (
                <div key={k} className="rounded-lg border-[3px] border-tinta bg-white p-[1.2cqw]"><span className="opacity-60">{k}</span><b className="block text-[3cqw]">{v}</b></div>
              ))}
            </div>
            <div className="flex-1 rounded-lg border-[3px] border-tinta bg-white p-[1.2cqw]">
              <b>Leads de hoje</b>
              {["Rafaela", "Bruno", "Camila"].map((n) => (
                <p key={n} className="mt-[0.8cqw] flex justify-between border-b border-tinta/20 pb-[0.4cqw]"><span>{n}</span><span className="opacity-60">anúncio 3</span></p>
              ))}
            </div>
          </div>
        </div>
      );
    case "vendas":
      return (
        <div className={`${base} flex flex-col gap-[1.6cqw] p-[2.4cqw]`}>
          <div className="grid grid-cols-3 gap-[1.4cqw]">
            {[["Vendas no mês", "R$ 18.420"], ["Pedidos", "137"], ["Ticket médio", "R$ 134"]].map(([k, v]) => (
              <div key={k} className="rounded-lg border-[3px] border-tinta bg-laranja-claro p-[1.2cqw]"><span className="opacity-60">{k}</span><b className="block text-[2.6cqw]">{v}</b></div>
            ))}
          </div>
          <div className="flex flex-1 items-end gap-[1.4cqw] rounded-lg border-[3px] border-tinta p-[1.6cqw]">
            {[40, 65, 50, 80, 55, 92, 70].map((h, i) => (
              <span key={i} className={`flex-1 rounded-t-md border-2 border-tinta ${i === 5 ? "bg-laranja" : "bg-laranja-claro"}`} style={{ height: `${h}%` }} />
            ))}
          </div>
          <span className="self-end rounded border-2 border-tinta px-[1cqw] font-bold">Baixar relatório em PDF</span>
        </div>
      );
    case "codigo":
      return (
        <div className={`${base} bg-[#fffdf8] p-[2.4cqw] font-mono text-[1.7cqw] leading-[1.7]`}>
          {[
            ["# verifica a força de uma senha", "opacity-50"],
            ["def forca(senha):", ""],
            ["    pontos = 0", ""],
            ["    if len(senha) >= 12: pontos += 1", ""],
            ["    if any(c.isdigit() for c in senha): pontos += 1", ""],
            ["    if any(not c.isalnum() for c in senha): pontos += 1", ""],
            ["    return [\"fraca\", \"média\", \"boa\", \"forte\"][pontos]", ""],
            ["", ""],
            ["print(forca(\"cobrinha123!\"))  # boa", "text-laranja-texto"],
          ].map(([l, c], i) => (
            <div key={i} className="flex gap-[2cqw]">
              <span className="w-[2.4cqw] text-right opacity-40">{i + 1}</span>
              <span className={`whitespace-pre ${c}`}>{l}</span>
            </div>
          ))}
        </div>
      );
    case "imc":
      return (
        <div className="flex h-full flex-col gap-[5cqw] p-[7cqw] text-[6.5cqw]">
          <b className="text-[9cqw] leading-tight">Calculadora de IMC</b>
          {[["Peso (kg)", "72"], ["Altura (m)", "1,78"]].map(([k, v]) => (
            <span key={k} className="block">
              <span className="opacity-60">{k}</span>
              <span className="mt-[1.5cqw] block rounded-md border-2 border-tinta px-[4cqw] py-[2cqw] font-bold">{v}</span>
            </span>
          ))}
          <span className="rounded-md border-2 border-tinta bg-laranja py-[3cqw] text-center font-bold">Calcular</span>
          <div className="mt-auto rounded-lg border-[3px] border-tinta bg-laranja-claro p-[4cqw] text-center">
            <b className="block text-[14cqw] leading-none">22,7</b>
            peso normal
          </div>
        </div>
      );
  }
}
