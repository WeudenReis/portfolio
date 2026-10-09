// Todo o conteúdo do site, espelhando o README do perfil (github.com/WeudenReis).
// Para mudar um texto, mude aqui.

export const contato = {
  email: "weudenfilho@gmail.com",
  github: "https://github.com/WeudenReis",
  linkedin: "https://www.linkedin.com/in/weuden-dos-reis-b25945320/",
  instagram: "https://instagram.com/weudenreis",
  vortexi: "https://vortexi.com.br",
};

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

export interface Projeto {
  nome: string;
  descricao: string;
  linguagem: "TypeScript" | "JavaScript";
  repo: string;
  demo?: string;
}

export const projetos: Projeto[] = [
  {
    nome: "chatpro-alert",
    descricao: "Extensão Chrome que destaca as conversas do chatPro sem resposta há mais de 5 minutos, para nenhum cliente ficar esperando.",
    linguagem: "JavaScript",
    repo: "https://github.com/WeudenReis/chatpro-alert",
  },
  {
    nome: "extensao_transcricao",
    descricao: "Extensão que transcreve as ligações do Google Meet com o cliente.",
    linguagem: "TypeScript",
    repo: "https://github.com/WeudenReis/extensao_transcricao",
    demo: "https://extensao-transcricao.vercel.app",
  },
  {
    nome: "controle-financeiro",
    descricao: "Controle financeiro pessoal com gráficos, relatórios em PDF e login (Next.js + Supabase).",
    linguagem: "TypeScript",
    repo: "https://github.com/WeudenReis/controle-financeiro",
    demo: "https://controle-financeiro-iota-navy.vercel.app",
  },
  {
    nome: "portfolio",
    descricao: "Este site: portfólio pessoal em Next.js, no mesmo traço do meu perfil do GitHub.",
    linguagem: "TypeScript",
    repo: "https://github.com/WeudenReis/portfolio",
    demo: "https://portfolio-pi-lemon-45.vercel.app",
  },
];

export const coresLinguagem: Record<Projeto["linguagem"], string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
};

export const oQueEuFaco = [
  {
    titulo: "Automação de atendimento na chatPro",
    itens: [
      ["chatpro-alert", "extensão Chrome que destaca as conversas sem resposta há mais de 5 minutos, para nenhum cliente ficar esperando."],
      ["Extensão de disparos", "envio em massa de imagem, PDF e texto direto de dentro do chatPro, com ritmo controlado entre mensagens."],
      ["Extensão de transcrição", "transcreve as ligações do Google Meet com o cliente. Em desenvolvimento: criar o link da reunião, mandar para o cliente e gravar tudo pelo próprio chatPro."],
      ["Tour do teste grátis", "onboarding guiado dentro do chatPro, que leva o novo usuário pelos primeiros passos da ferramenta."],
      ["IA SDR", "MVP de um agente de pré-venda que qualifica leads pelo WhatsApp."],
      ["Quadro de suporte interno", "um Kanban no estilo Trello feito sob medida para o time."],
    ],
  },
  {
    titulo: "Sites e sistemas pela Vortexi",
    itens: [
      ["Site da Vortexi", "institucional, com animações e cases reais."],
      ["Notion via API", "integração para organizar a operação."],
    ],
  },
  {
    titulo: "Produtos próprios",
    itens: [
      ["Sistema Vitrine", "cria landing pages, acompanha o tráfego pago e centraliza os leads num só lugar."],
      ["Controle financeiro e de vendas", "painéis com gráficos, relatórios em PDF e login."],
      ["MVPs de aplicativos", "para apresentar ideias a clientes e sócios."],
    ],
  },
  {
    titulo: "Faculdade",
    itens: [
      ["Segurança da informação", "atividades em Python."],
      ["App Android", "cálculo de IMC, no Android Studio."],
    ],
  },
] as const;

export const linhaDoTempo = [
  ["Mar 2025", "Criei a conta no GitHub"],
  ["Jan 2026", "Controle financeiro pessoal em Next.js e Supabase"],
  ["Fev 2026", "Sistema de controle de vendas"],
  ["Mar 2026", "Quadro de suporte interno e meu portfólio"],
  ["Mai 2026", "chatpro-alert, minha primeira extensão para a chatPro"],
  ["Jun 2026", "Site e integração com Notion da Vortexi"],
  ["Jul 2026", "Sistema Vitrine: landing pages, tráfego pago e leads"],
  ["Ago 2026", "Extensão de transcrição de reuniões do Meet"],
  ["Set 2026", "Extensão de disparos, tour do teste grátis e o MVP da IA SDR"],
] as const;
