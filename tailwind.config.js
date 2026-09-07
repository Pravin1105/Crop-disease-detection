/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./frontend/index.html", "./frontend/src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        agri: {
          bg: "var(--bg)",
          surface: "var(--surface)",
          "surface-2": "var(--surface-2)",
          border: "var(--border)",
          green: "var(--green)",
          "green-dark": "var(--green-dark)",
          text: "var(--text)",
          muted: "var(--text-muted)",
          danger: "var(--danger)",
          warning: "var(--warning)"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
