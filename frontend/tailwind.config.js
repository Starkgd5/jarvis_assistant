/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'jarvis-blue': '#007AFF',
        'jarvis-dark': '#1E1E1E',
      },
    },
  },
  plugins: [],
}