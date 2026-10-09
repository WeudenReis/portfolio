// Título de seção no traço dos desenhos do README: letra Virgil com sublinhado laranja à mão.
export default function Titulo({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="mb-10 flex justify-center">
      <span className="relative inline-block px-2 font-mao text-4xl text-tinta sm:text-5xl">
        {children}
        <svg
          className="absolute -bottom-3 left-0 h-3 w-full overflow-visible"
          viewBox="0 0 100 10"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M1 6 C 20 8, 38 9, 52 5 S 82 4, 99 7"
            fill="none"
            stroke="#FF7A33"
            strokeWidth="3.2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M3 7.5 C 25 9, 45 7, 60 6.5 S 85 6, 97 8"
            fill="none"
            stroke="#FF7A33"
            strokeWidth="1.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </span>
    </h2>
  );
}
