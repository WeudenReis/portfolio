// Ícones do site: todos do Phosphor (phosphoricons.com), no peso "bold" para combinar com o traço grosso.
// A exceção é o "V" da Vortexi, que é o logo da empresa e não existe como ícone.
import { GithubLogo, InstagramLogo, LinkedinLogo, ScribbleLoop } from "@phosphor-icons/react/dist/ssr";

type Props = { className?: string };

export const IconeGithub = ({ className = "h-5 w-5" }: Props) => <GithubLogo className={className} weight="bold" aria-hidden />;
export const IconeLinkedin = ({ className = "h-5 w-5" }: Props) => <LinkedinLogo className={className} weight="bold" aria-hidden />;
export const IconeInstagram = ({ className = "h-5 w-5" }: Props) => <InstagramLogo className={className} weight="bold" aria-hidden />;
// o Phosphor não tem cobra; o rabisco em laço faz o papel dela
export const IconeCobra = ({ className = "h-5 w-5" }: Props) => <ScribbleLoop className={className} weight="bold" aria-hidden />;

// o "V" do logo da Vortexi, igual ao do badge no README
export function IconeVortexi({ className = "h-5 w-5" }: Props) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M8 9.5 L16 22.5 L24 9.5" stroke="currentColor" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
