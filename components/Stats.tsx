import Titulo from "./Titulo";

const U = "WeudenReis";

// mesmos badges e cards do README, na versão clara
const badges = [
  { src: `https://komarev.com/ghpvc/?username=${U}&color=C2410C&style=for-the-badge&base=0&label=VISITAS`, alt: "Visitas" },
  { src: `https://img.shields.io/github/stars/${U}?color=C2410C&labelColor=555&style=for-the-badge&label=STARS`, alt: "Stars" },
  { src: `https://img.shields.io/github/followers/${U}?color=C2410C&labelColor=555&style=for-the-badge&label=SEGUIDORES`, alt: "Seguidores" },
];

const streak =
  `https://streak-stats.demolab.com?user=${U}&locale=pt_BR&background=FFFFFF&border=FFFFFF&stroke=1e1e1e` +
  `&ring=C2410C&fire=C2410C&currStreakNum=1e1e1e&sideNums=1e1e1e&currStreakLabel=C2410C&sideLabels=59636e&dates=59636e&border_radius=0`;

export default function Stats() {
  return (
    <section id="stats" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Titulo>GitHub Stats</Titulo>
      <div className="flex flex-wrap justify-center gap-4">
        {badges.map((b) => (
          <img key={b.alt} src={b.src} alt={b.alt} loading="lazy" className="h-7 border-2 border-tinta shadow-brutal-sm" />
        ))}
      </div>
      <div className="mt-10 grid gap-8">
        <a
          href="https://git.io/streak-stats"
          target="_blank"
          rel="noreferrer"
          className="caixa mx-auto block w-full max-w-xl overflow-hidden p-2"
        >
          <img src={streak} alt="Sequência de contribuições no GitHub" loading="lazy" className="w-full" />
        </a>
        <div className="caixa overflow-x-auto p-4">
          <img
            src={`https://raw.githubusercontent.com/${U}/${U}/output/snake-light.svg`}
            alt="Cobrinha comendo o gráfico de contribuições"
            loading="lazy"
            className="mx-auto min-w-[640px]"
          />
        </div>
      </div>
    </section>
  );
}
