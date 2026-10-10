// Todo o conteúdo do site, espelhando o README do perfil (github.com/WeudenReis).
// Para mudar um texto, mude aqui. Regra da casa: nada de travessão em texto que aparece na tela.

export const contato = {
  email: "weudenfilho@gmail.com",
  github: "https://github.com/WeudenReis",
  linkedin: "https://www.linkedin.com/in/weuden-dos-reis-b25945320/",
  instagram: "https://instagram.com/weudenx",
  vortexi: "https://vortexi.com.br",
};

// frases que ficam digitando e apagando
export const oQueEuCrio = [
  "extensões de navegador",
  "automações de envio",
  "agentes de IA",
  "sites sob medida",
  "sistemas com Next.js",
];

export const alemDoCodigo = [
  "Games são meu descanso, principalmente The Last of Us",
  "Empreender: toco a Vortexi em paralelo ao trabalho",
  "Curioso por IA, agentes e tudo que automatiza trabalho repetitivo",
  "Aprendo construindo: quase todo projeto aqui começou como teste",
  "Sempre atrás da próxima coisa pra aprender e colocar em prática",
];

// ids do skillicons.dev, na mesma ordem do README
export const stacks = [
  { id: "ts", nome: "TypeScript" },
  { id: "js", nome: "JavaScript" },
  { id: "react", nome: "React" },
  { id: "nextjs", nome: "Next.js" },
  { id: "tailwind", nome: "Tailwind" },
  { id: "nodejs", nome: "Node.js" },
  { id: "python", nome: "Python" },
  { id: "supabase", nome: "Supabase" },
  { id: "docker", nome: "Docker" },
  { id: "vercel", nome: "Vercel" },
  { id: "androidstudio", nome: "Android Studio" },
  { id: "git", nome: "Git" },
  { id: "github", nome: "GitHub" },
  { id: "vscode", nome: "VS Code" },
  { id: "html", nome: "HTML" },
  { id: "css", nome: "CSS" },
];

export type Categoria = "chatPro" | "Vortexi" | "Produtos" | "Faculdade";

export const categorias: { id: Categoria; nome: string; descricao: string }[] = [
  { id: "chatPro", nome: "Automação na chatPro", descricao: "Ferramentas que deixam o suporte e as vendas mais rápidos." },
  { id: "Vortexi", nome: "Vortexi", descricao: "Sites e sistemas sob medida para empresas." },
  { id: "Produtos", nome: "Produtos próprios", descricao: "Ideias que viraram sistema." },
  { id: "Faculdade", nome: "Faculdade", descricao: "Segurança da informação e mobile." },
];

export type Mock =
  | "alerta" | "disparos" | "transcricao" | "tour" | "sdr" | "kanban"
  | "notion" | "vitrine" | "vendas" | "codigo" | "imc";

export interface Projeto {
  slug: string;
  nome: string;
  categoria: Categoria;
  quando: string; // "Mai 2026"
  resumo: string;
  problema: string;
  solucao: string;
  destaques: string[];
  // como foi fazer, contado por mim
  bastidores: string;
  stack: string[];
  repo?: string; // só repositórios públicos
  site?: string; // só endereços públicos
  privado: boolean;
  // o que aparece no preview: print do site no ar ou uma ilustração da tela
  preview: { print: string; endereco: string } | { mock: Mock; endereco: string };
  emDestaque?: boolean;
}

export const projetos: Projeto[] = [
  {
    slug: "chatpro-alert",
    nome: "chatpro-alert",
    categoria: "chatPro",
    quando: "Mai 2026",
    resumo: "Extensão Chrome que destaca as conversas sem resposta há mais de 5 minutos.",
    problema: "No meio do movimento, uma conversa parada some na lista e o cliente fica esperando sem ninguém perceber.",
    solucao: "Uma extensão que olha a lista de conversas do chatPro e pinta as que estão sem resposta há mais de 5 minutos, para o time bater o olho e atender.",
    destaques: ["Minha primeira extensão para a chatPro", "Funciona por cima do app, sem mexer no produto", "Código aberto no GitHub"],
    bastidores:
      "Foi a minha primeira extensão para a chatPro. O mais difícil foi entender como o app desenha a lista de conversas: não existe um identificador fácil, então cada conversa é reconhecida pelo próprio link e o status é lido fora das etiquetas. Errei feio numa versão: eu achava que o nome do canal mostrava que a conversa tinha sido respondida, e não mostrava. Depois dessa correção ela ficou confiável para o time usar no dia a dia.",
    stack: ["JavaScript", "Chrome Extension"],
    repo: "https://github.com/WeudenReis/chatpro-alert",
    privado: false,
    preview: { mock: "alerta", endereco: "chatPro · extensão chatpro-alert" },
    emDestaque: true,
  },
  {
    slug: "extensao-de-disparos",
    nome: "Extensão de disparos",
    categoria: "chatPro",
    quando: "Set 2026",
    resumo: "Envio em massa de imagem, PDF e texto direto de dentro do chatPro.",
    problema: "Mandar a mesma mensagem com arquivo para uma lista de contatos era trabalho manual, um por um.",
    solucao: "Uma aba de disparos dentro do próprio chatPro: escolhe a lista, monta a mensagem com imagem, PDF ou texto e a extensão envia com ritmo controlado entre uma mensagem e outra.",
    destaques: ["Imagem, PDF e texto na mesma campanha", "Ritmo controlado para não travar o número", "Roda inteira no navegador, sem servidor"],
    bastidores:
      "A regra desde o começo foi não ter servidor: tudo roda no navegador de quem usa. Antes de desenhar a tela, testei a API do chatPro chamada por chamada, porque a documentação não cobria o envio que eu precisava. Descobri que a API bloqueia quem manda rápido demais, então o ritmo ficou fixo em 10 segundos entre mensagens. Outra pegadinha: no Chrome, a parte de fundo da extensão adormece em poucos segundos, então o envio teve que rodar na própria página.",
    stack: ["JavaScript", "Chrome Extension", "API do chatPro"],
    privado: true,
    preview: { mock: "disparos", endereco: "chatPro · aba Disparos" },
    emDestaque: true,
  },
  {
    slug: "extensao-de-transcricao",
    nome: "Extensão de transcrição",
    categoria: "chatPro",
    quando: "Ago 2026",
    resumo: "Transcreve as ligações do Google Meet com o cliente.",
    problema: "O que o cliente falava na reunião se perdia: ninguém consegue anotar tudo e atender ao mesmo tempo.",
    solucao: "Uma extensão que transcreve a ligação do Google Meet. O próximo passo, em desenvolvimento, é criar o link da reunião, mandar para o cliente e gravar tudo pelo próprio chatPro.",
    destaques: ["Transcrição da reunião inteira", "Em desenvolvimento: reunião criada e gravada pelo chatPro", "Código aberto no GitHub"],
    bastidores:
      "Comecei lendo a legenda do próprio Meet e não deu certo: vinha texto repetido, fala atribuída à pessoa errada, e bastava desligar a legenda para quebrar tudo. Mudei de caminho e passei a usar um bot que entra na reunião e já separa a fala de cada participante. Também tive que achar outro jeito de criar o link da reunião, porque a API do Meet que eu queria só funciona em conta empresarial do Google.",
    stack: ["TypeScript", "Chrome Extension", "Google Meet"],
    repo: "https://github.com/WeudenReis/extensao_transcricao",
    privado: false,
    preview: { mock: "transcricao", endereco: "meet.google.com · extensão de transcrição" },
    emDestaque: true,
  },
  {
    slug: "tour-do-teste-gratis",
    nome: "Tour do teste grátis",
    categoria: "chatPro",
    quando: "Set 2026",
    resumo: "Onboarding guiado dentro do chatPro para quem acabou de criar a conta.",
    problema: "Quem entrava no teste grátis caía na ferramenta sem saber por onde começar.",
    solucao: "Um tour dentro do próprio chatPro que leva o novo usuário pelos primeiros passos, tela por tela.",
    destaques: ["Passo a passo em cima do app real", "Pensado para quem nunca usou a ferramenta"],
    bastidores:
      "O tour roda por cima do chatPro de verdade, então precisei entender como o app monta cada tela sem acesso ao código dele: fui lendo o pacote publicado do site até achar cada peça. A parte mais trabalhosa foi a fluidez. Medi as transições quadro a quadro, com o computador propositalmente mais lento, até tudo andar suave.",
    stack: ["JavaScript", "Chrome Extension"],
    privado: true,
    preview: { mock: "tour", endereco: "chatPro · teste grátis" },
  },
  {
    slug: "ia-sdr",
    nome: "IA SDR",
    categoria: "chatPro",
    quando: "Set 2026",
    resumo: "MVP de um agente de pré-venda que qualifica leads pelo WhatsApp.",
    problema: "Lead chega a qualquer hora e esfria rápido quando ninguém responde.",
    solucao: "Um agente de IA que conversa com o lead pelo WhatsApp, faz as perguntas de qualificação e entrega para o time de vendas quem está pronto.",
    destaques: ["Conversa pelo WhatsApp", "Qualifica antes de passar para o vendedor", "Ainda em MVP"],
    bastidores:
      "Testei tudo numa conta de teste, nunca com clientes. O primeiro agendamento de reunião feito sozinho pela IA foi um dia bom. O maior aprendizado veio de um bug: depois de chamar uma função, a plataforma devolvia a resposta sem o histórico da conversa e a IA se perdia. A saída foi redesenhar o fluxo para uma função por mensagem do cliente.",
    stack: ["IA", "WhatsApp", "API do chatPro"],
    privado: true,
    preview: { mock: "sdr", endereco: "WhatsApp" },
    emDestaque: true,
  },
  {
    slug: "quadro-de-suporte",
    nome: "Quadro de suporte interno",
    categoria: "chatPro",
    quando: "Mar 2026",
    resumo: "Um Kanban no estilo Trello feito sob medida para o time.",
    problema: "As demandas do suporte ficavam espalhadas e era difícil saber quem estava com o quê.",
    solucao: "Um quadro Kanban no estilo Trello, feito do jeito que o time trabalha, para organizar as demandas do suporte.",
    destaques: ["Colunas e cartões do jeito do time", "Feito sob medida, para uso interno"],
    bastidores:
      "Nasceu da bagunça de demandas espalhadas em vários lugares. Fiz o quadro do jeito que o time já trabalhava, em vez de forçar o time a mudar. De quebra, ele virou o primeiro case real no site da Vortexi.",
    stack: ["TypeScript", "Next.js", "Supabase"],
    privado: true,
    preview: { mock: "kanban", endereco: "quadro do suporte" },
  },
  {
    slug: "site-vortexi",
    nome: "Site da Vortexi",
    categoria: "Vortexi",
    quando: "Jun 2026",
    resumo: "Site institucional da Vortexi, com animações e cases reais.",
    problema: "A Vortexi precisava de uma vitrine à altura do que entrega para os clientes.",
    solucao: "Um site institucional com animações, cases reais e a cara da marca, no ar em vortexi.com.br.",
    destaques: ["No ar em vortexi.com.br", "Animações e cases reais"],
    bastidores:
      "Eu queria um site fora do padrão, com cara de experiência e não de folder. O personagem da capa é um computador retrô feito em 3D, com olhos que seguem o cursor. Juntei Three.js, GSAP e rolagem suave em Next.js e coloquei no ar no domínio próprio.",
    stack: ["Next.js", "Three.js", "GSAP"],
    site: "https://vortexi.com.br",
    privado: true,
    preview: { print: "/img/projetos/site-vortexi.webp", endereco: "vortexi.com.br" },
    emDestaque: true,
  },
  {
    slug: "notion-da-vortexi",
    nome: "Notion via API",
    categoria: "Vortexi",
    quando: "Jun 2026",
    resumo: "Integração com o Notion para organizar a operação da Vortexi.",
    problema: "A operação da Vortexi estava em vários lugares ao mesmo tempo.",
    solucao: "Uma integração com a API do Notion para centralizar e organizar a operação.",
    destaques: ["Automação em cima da API do Notion"],
    bastidores:
      "Um script em Python que conversa com a API do Notion para deixar a operação da Vortexi num lugar só, sem copiar e colar entre ferramentas. Pequeno, mas tira trabalho repetido toda semana.",
    stack: ["Python", "API do Notion"],
    privado: true,
    preview: { mock: "notion", endereco: "notion.so · operação Vortexi" },
  },
  {
    slug: "sistema-vitrine",
    nome: "Sistema Vitrine",
    categoria: "Produtos",
    quando: "Jul 2026",
    resumo: "Cria landing pages, acompanha o tráfego pago e centraliza os leads num só lugar.",
    problema: "Quem anuncia precisa de página, de controle do tráfego pago e de um lugar para os leads, e isso costuma estar em três ferramentas.",
    solucao: "Um sistema que cria as landing pages, acompanha o tráfego pago e junta os leads num só lugar.",
    destaques: ["Landing pages, tráfego e leads no mesmo sistema", "Produto feito em sociedade"],
    bastidores:
      "É o projeto mais ambicioso: landing pages para vários clientes, editor visual, publicação em domínio próprio, leads e planos de assinatura. Faço junto com o meu sócio na Vortexi. Uma das armadilhas foi o armazenamento dos arquivos, que forçava uma regra de segurança e fazia a página abrir como texto cru. Resolvemos isso na borda, antes da página chegar ao visitante.",
    stack: ["React", "TypeScript", "Supabase", "Cloudflare"],
    privado: true,
    preview: { mock: "vitrine", endereco: "Sistema Vitrine · painel" },
    emDestaque: true,
  },
  {
    slug: "controle-financeiro",
    nome: "Controle financeiro",
    categoria: "Produtos",
    quando: "Jan 2026",
    resumo: "Controle financeiro pessoal com gráficos, relatórios em PDF e login.",
    problema: "Planilha de gastos não mostra para onde o dinheiro está indo.",
    solucao: "Um painel com login, gráficos e relatórios em PDF para acompanhar entradas e saídas.",
    destaques: ["Gráficos e relatório em PDF", "Login com Supabase", "Código aberto no GitHub"],
    bastidores:
      "Comecei com login e banco de dados na nuvem e depois mudei tudo para rodar no próprio navegador. Liguei o Open Finance para puxar as transações do banco sozinho e redesenhei a interface inteira, com tema escuro e claro.",
    stack: ["Next.js", "TypeScript", "Open Finance"],
    repo: "https://github.com/WeudenReis/controle-financeiro",
    site: "https://controle-financeiro-iota-navy.vercel.app",
    privado: false,
    preview: { print: "/img/projetos/controle-financeiro.webp", endereco: "controle-financeiro-iota-navy.vercel.app" },
  },
  {
    slug: "controle-de-vendas",
    nome: "Controle de vendas",
    categoria: "Produtos",
    quando: "Fev 2026",
    resumo: "Painel de vendas com gráficos, relatórios em PDF e login.",
    problema: "Acompanhar as vendas no caderno ou na planilha não dá visão do mês.",
    solucao: "Um sistema de controle de vendas com gráficos, relatórios em PDF e login.",
    destaques: ["Relatórios em PDF", "Gráficos do período"],
    bastidores:
      "Fiz para tirar as vendas do caderno: cada venda entra no sistema e o painel mostra o mês em gráficos, com um relatório em PDF para fechar o período.",
    stack: ["TypeScript", "Next.js"],
    privado: true,
    preview: { mock: "vendas", endereco: "controle de vendas · painel" },
  },
  {
    slug: "seguranca-da-informacao",
    nome: "Segurança da informação",
    categoria: "Faculdade",
    quando: "Ago 2026",
    resumo: "Atividades de segurança da informação em Python.",
    problema: "Atividades práticas da disciplina de segurança da informação.",
    solucao: "Scripts em Python feitos para as atividades da faculdade.",
    destaques: ["Python", "Código aberto no GitHub"],
    bastidores:
      "Atividades da disciplina, feitas em Python para ver na prática o que a teoria explicava.",
    stack: ["Python"],
    repo: "https://github.com/WeudenReis/atividadeSeguran-aDaInfo",
    privado: false,
    preview: { mock: "codigo", endereco: "atividade.py" },
  },
  {
    slug: "app-imc",
    nome: "App de IMC",
    categoria: "Faculdade",
    quando: "Set 2026",
    resumo: "App Android de cálculo de IMC, feito no Android Studio.",
    problema: "Primeiro contato com desenvolvimento mobile na faculdade.",
    solucao: "Um app Android que calcula o IMC, feito no Android Studio.",
    destaques: ["Android nativo", "Feito no Android Studio"],
    bastidores:
      "Meu primeiro app Android. Simples de propósito, para aprender o caminho completo de tela, entrada de dados e resultado no Android Studio.",
    stack: ["Android Studio"],
    privado: true,
    preview: { mock: "imc", endereco: "Android" },
  },
];

// tudo aconteceu em 2026: o ano aparece uma vez só, cada parada mostra só o mês
export const anoDaLinha = 2026;
export const linhaDoTempo: { mes: string; curto: string; oQue: string; slug?: string }[] = [
  { mes: "Janeiro", curto: "Jan", oQue: "Controle financeiro pessoal em Next.js e Supabase", slug: "controle-financeiro" },
  { mes: "Fevereiro", curto: "Fev", oQue: "Sistema de controle de vendas", slug: "controle-de-vendas" },
  { mes: "Março", curto: "Mar", oQue: "Quadro de suporte interno do time", slug: "quadro-de-suporte" },
  { mes: "Maio", curto: "Mai", oQue: "chatpro-alert, minha primeira extensão para a chatPro", slug: "chatpro-alert" },
  { mes: "Junho", curto: "Jun", oQue: "Site e integração com Notion da Vortexi", slug: "site-vortexi" },
  { mes: "Julho", curto: "Jul", oQue: "Sistema Vitrine: landing pages, tráfego pago e leads", slug: "sistema-vitrine" },
  { mes: "Agosto", curto: "Ago", oQue: "Extensão de transcrição de reuniões do Meet", slug: "extensao-de-transcricao" },
  { mes: "Setembro", curto: "Set", oQue: "Extensão de disparos, tour do teste grátis e o MVP da IA SDR", slug: "extensao-de-disparos" },
];

// palavras do jogo da cobrinha, sem acento para caber uma letra por casa
export const palavrasDoJogo = [
  "WEUDEN", "CHATPRO", "VORTEXI", "REACT", "NEXTJS", "SUPABASE",
  "PYTHON", "VERCEL", "DOCKER", "GOIANIA", "TYPESCRIPT", "EXTENSAO",
];
