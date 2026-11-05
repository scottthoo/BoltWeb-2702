/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm editorial palette. Text pairings are checked for WCAG AA:
        // ink-muted and clay both clear 4.5:1 on sand-100 and paper.
        paper: "#FAF6EE",
        sand: {
          50: "#FCF9F3",
          100: "#F4EDE0",
          200: "#EBE1CF",
          300: "#DDCFB7",
          400: "#C9B798",
          500: "#A99472",
        },
        ink: {
          DEFAULT: "#1F1A14",
          soft: "#4A4136",
          muted: "#6B6052",
        },
        clay: {
          DEFAULT: "#A6481F",
          dark: "#8A3A17",
          light: "#E08A5E",
        },
        espresso: "#211B15",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
