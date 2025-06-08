/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'KottaOne': ['Kotta One', 'serif'],
      },
      screens:{
        'xs': '410px',
        'small': '518px',
        'sm': '640px',
        'md': '768px',
        'ms': '860px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1476px',
      },
    },
  },
  plugins: [],
}

