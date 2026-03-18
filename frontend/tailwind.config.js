/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'coffee-green': '#10B981',
        'coffee-dark': '#1a1a1a',
      }
    },
  },
  plugins: [],
}