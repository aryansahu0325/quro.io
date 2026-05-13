/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#06b6d4",
        secondary: "#8b5cf6",
        accent: "#ec4899",
        background: "#000000",
        surface: "#0a0a0a",
        "surface-muted": "#171717",
        text: "#ffffff",
        "text-muted": "#a3a3a3",
      },
    },
  },
  plugins: [],
}
