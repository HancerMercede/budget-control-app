import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Aquí es donde TS busca las clases
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0f172a",
      },
    },
  },
  plugins: [],
} satisfies Config;
