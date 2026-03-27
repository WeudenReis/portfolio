export interface Project {
  title: string;
  description: string;
  link: string;
  repo: string;
  image: string;
  tags: string[];
  color: string;
}

/**
 * Array de projetos do portfólio.
 *
 * Para adicionar um novo projeto, basta inserir um novo objeto neste array:
 *
 * {
 *   title: "Nome do Projeto",
 *   description: "Breve descrição do projeto...",
 *   link: "https://meu-projeto.vercel.app",
 *   repo: "https://github.com/weudenreis/meu-projeto",
 *   image: "/projects/meu-projeto.jpg",   // coloque a imagem em /public/projects/
 *   tags: ["Next.js", "TypeScript"],
 *   color: "#f59e0b",                      // cor accent do card
 * }
 */
export const projects: Project[] = [
  {
    title: "Controle Financeiro Iota",
    description:
      "Dashboard de gestão financeira pessoal com visualização de dados em tempo real, utilizando Open Finance API para automação completa de gastos e receitas.",
    link: "https://controle-financeiro-iota-navy.vercel.app",
    repo: "https://github.com/weudenreis/controle-financeiro",
    image: "/projects/finance.jpg",
    tags: ["Next.js", "TypeScript", "Tailwind", "Open Finance"],
    color: "#f59e0b",
  },
  {
    title: "Controle de Vendas WC",
    description:
      "Plataforma de gestão comercial para controle de estoque, fluxo de caixa e relatórios de vendas com UX intuitiva para alta produtividade operacional.",
    link: "https://controledevendaswc.vercel.app",
    repo: "https://github.com/weudenreis/controle-vendas",
    image: "/projects/vendas.jpg",
    tags: ["React", "Node.js", "Dashboard", "UX"],
    color: "#3b82f6",
  },
  {
    title: "Gestão de Desempenho Sinta",
    description:
      "Solução de gerenciamento de performance com dashboard acionável e kit de automações para times de produto atingirem metas consistentes.",
    link: "#",
    repo: "https://github.com/weudenreis/gestao-sinta",
    image: "/projects/sinta.jpg",
    tags: ["React", "Automação", "Analytics", "Charts"],
    color: "#10b981",
  },
  {
    title: "Portfolio Pessoal",
    description:
      "Este portfólio — construído com Next.js, GSAP e scroll híbrido horizontal/vertical. Performance first com animações a 60fps.",
    link: "#",
    repo: "https://github.com/weudenreis/portfolio",
    image: "/projects/portfolio.jpg",
    tags: ["Next.js", "GSAP", "Tailwind", "ScrollTrigger"],
    color: "#8b5cf6",
  },
];

/**
 * Placeholder para fetch de projetos via API do GitHub/Vercel.
 * Substitua pela integração real quando necessário.
 */
export async function fetchProjects(): Promise<Project[]> {
  // Simula latência de rede
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Em produção, substitua por:
  // const res = await fetch('https://api.github.com/users/weudenreis/repos');
  // const repos = await res.json();
  // return repos.map(mapRepoToProject);

  return projects;
}
