import { stacks } from "@/lib/dados";
import Titulo from "./Titulo";

export default function Stacks() {
  return (
    <section id="stacks" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Titulo>Tech Stacks</Titulo>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {stacks.map((s) => (
          <li
            key={s.id}
            className="caixa flex flex-col items-center gap-2 p-4 transition-all duration-150 hover:-translate-y-1 hover:bg-laranja-claro"
          >
            <img
              src={`https://skillicons.dev/icons?i=${s.id}&theme=light`}
              alt=""
              width={48}
              height={48}
              loading="lazy"
              className="h-12 w-12"
            />
            <span className="text-center text-xs font-bold">{s.nome}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
