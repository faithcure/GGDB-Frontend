/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mont: ['Montserrat', 'sans-serif'],
      },
      dropShadow: {
        lg: '0 0 10px rgba(255, 255, 0, 0.8)',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-6deg)' },
          '50%': { transform: 'rotate(6deg)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        sheen: {
          '0%':   { left: '-60%' },
          '100%': { left: '110%' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        wiggle: 'wiggle 2s infinite',
        'bounce-slow': 'bounce-slow 2.5s infinite',
        sheen: 'sheen 2.8s cubic-bezier(.4,.1,.6,1) infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
        'slide-in': 'slide-in 0.5s ease-out',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    //require('@tailwindcss/line-clamp'),
  ],
}
