/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kawaii-pink': '#FFF0F5',
        'kawaii-blue': '#F0FFFF',
        'kawaii-mint': '#F0FFF0',
        'kawaii-orange': '#FFB74D',
        'kawaii-red': '#FFCDD2',
        'kawaii-purple': '#E1BEE7',
        'kawaii-yellow': '#FFF9C4'
      },
      fontFamily: {
        'kawaii': ['Comic Sans MS', 'cursive'],
        'pixel': ['monospace']
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}