import Rasgo from "@/components/Rasgo";
import Capa from "@/components/capitulos/Capa";
import Sobre from "@/components/capitulos/Sobre";
import ProjetosDestaque from "@/components/capitulos/ProjetosDestaque";
import Rota from "@/components/capitulos/Rota";
import Recado from "@/components/capitulos/Recado";

export default function Inicio() {
  return (
    <Rasgo
      capitulos={[
        { id: "capa", nome: "Capa", fundo: "bg-white", conteudo: <Capa /> },
        { id: "sobre", nome: "Sobre mim", fundo: "bg-laranja-claro", conteudo: <Sobre /> },
        { id: "projetos", nome: "Projetos em destaque", fundo: "bg-laranja", conteudo: <ProjetosDestaque /> },
        { id: "rota", nome: "A rota até aqui", fundo: "bg-white", conteudo: <Rota /> },
        { id: "recado", nome: "Bora conversar", fundo: "bg-laranja-claro", conteudo: <Recado /> },
      ]}
    />
  );
}
