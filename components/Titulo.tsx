import MarcaTexto from "./MarcaTexto";

// Título de seção no traço do README: letra Virgil com marca-texto laranja na metade de baixo.
export default function Titulo({
  children,
  id,
  alinhar = "centro",
  cor = "laranja",
}: {
  children: React.ReactNode;
  id?: string;
  alinhar?: "centro" | "esquerda";
  cor?: "laranja" | "creme" | "branco";
}) {
  return (
    <h2
      id={id}
      className={`mb-8 font-mao text-4xl leading-tight text-tinta sm:text-5xl ${
        alinhar === "centro" ? "text-center" : ""
      }`}
    >
      <MarcaTexto cor={cor}>{children}</MarcaTexto>
    </h2>
  );
}
