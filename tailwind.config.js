/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        mao: ["var(--font-virgil)", "Comic Sans MS", "cursive"],
      },
      colors: {
        // mesma paleta dos desenhos do README do perfil
        tinta: "#1e1e1e",
        laranja: {
          DEFAULT: "#FF7A33",
          texto: "#C2410C",
          claro: "#FFF7ED",
        },
        cinza: "#59636e",
      },
      boxShadow: {
        brutal: "6px 6px 0 0 #1e1e1e",
        "brutal-sm": "3px 3px 0 0 #1e1e1e",
        "brutal-lg": "10px 10px 0 0 #1e1e1e",
      },
    },
  },
  plugins: [],
};
