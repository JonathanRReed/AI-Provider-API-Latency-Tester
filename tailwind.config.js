/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        oled: '#000000',
        text: '#FAFAFA',
        cyan: '#22d3ee',
        magenta: '#e879f9',
        yellow: '#facc15',
        card: '#111111'
      },
    },
  },
  plugins: [],
}
