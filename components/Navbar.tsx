const itens = [
  { label: "Sobre", href: "#sobre" },
  { label: "Stacks", href: "#stacks" },
  { label: "Projetos", href: "#projetos" },
  { label: "Trajetória", href: "#trajetoria" },
  { label: "Stats", href: "#stats" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-tinta bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#inicio" className="shrink-0 font-mao text-2xl">
          weuden<span className="text-laranja">.</span>
        </a>
        <ul className="flex items-center gap-1 overflow-x-auto text-sm font-bold sm:gap-2">
          {itens.map((item) => (
            <li key={item.href} className="hidden md:block">
              <a
                href={item.href}
                className="rounded-md border-2 border-transparent px-3 py-1.5 hover:border-tinta hover:bg-laranja-claro"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#contato" className="botao-laranja ml-2 px-3 py-1.5 text-sm">
              Contato
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
