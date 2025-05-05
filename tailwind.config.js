/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pixel-black': '#1a1a1a',
        'pixel-red': '#ff0000',
        'pixel-blue': '#0000ff',
        'pixel-white': '#ffffff',
        'pixel-grey': '#333333',
      },
      fontFamily: {
        'pixel': ['Sixtyfour', 'cursive'],
      },
      animation: {
        'bounce': 'bounce 1s infinite',
        'title': 'title 2s ease-in-out infinite',
        'win': 'win 0.5s ease-in-out',
        'pulse-strong': 'pulse-strong 1s infinite',
        'shake': 'shake 0.5s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        title: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        win: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-strong': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.5)' },
        }
      },
    },
  },
  plugins: [],
}