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
        'kawaii-yellow': '#FFF9C4',
        // 千恋万花风格颜色
        'senren-sakura': '#FFB7C5',      // 樱花粉
        'senren-purple': '#C8A2C8',      // 优雅紫
        'senren-gold': '#F4D03F',        // 温暖金
        'senren-cream': '#FFF8DC',       // 奶油色
        'senren-lavender': '#E6E6FA',    // 薰衣草紫
        'senren-rose': '#FFE4E1',        // 玫瑰色
        'senren-amber': '#FFBF00',       // 琥珀色
        'senren-mist': '#F5F5F5'         // 雾色
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