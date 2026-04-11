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
    title: "Trelado",
    description:
      "Gerenciador de tarefas estilo Kanban com drag-and-drop e colunas customizáveis para organização de fluxos de trabalho.",
    link: "#",
    repo: "https://github.com/weudenreis/trelado",
    image: "/projects/trelado.jpg",
    tags: ["JavaScript", "HTML5", "CSS3"],
    color: "#f59e0b",
  },
  {
    title: "Portfólio Pessoal",
    description:
      "Site construído do zero para apresentar projetos e habilidades profissionais de forma moderna e responsiva.",
    link: "#",
    repo: "https://github.com/weudenreis/portfolio",
    image: "/projects/portfolio.jpg",
    tags: ["HTML5", "CSS3", "JavaScript"],
    color: "#8b5cf6",
  },
  {
    title: "Controle de Pratas",
    description:
      "Sistema CRUD para cadastro e controle de estoque de peças de prata com gerenciamento completo de inventário.",
    link: "#",
    repo: "https://github.com/weudenreis/controle-pratas",
    image: "/projects/pratas.jpg",
    tags: ["Python", "Banco de Dados", "CRUD"],
    color: "#3b82f6",
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
