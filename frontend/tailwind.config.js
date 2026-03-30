/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        surface: "var(--surface)",
        background: "var(--background)",
        textMain: "var(--text-main)",
        textMuted: "var(--text-muted)",
        border: "var(--border)"
      }
    },
  },
  plugins: [],
}
