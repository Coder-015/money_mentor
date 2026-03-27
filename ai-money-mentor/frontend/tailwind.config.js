/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f0e17',
        secondary: '#1a1a2e',
        accent: '#e94560',
        card: '#1a1a2e',
        text: '#fffffe',
        muted: '#a7a9be'
      }
    },
  },
  plugins: [],
}
