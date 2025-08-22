/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'airplane-fly': {
          '0%': { transform: 'translate(-20vw, 20vh) rotate(-30deg)' },
          '100%': { transform: 'translate(120vw, -30vh) rotate(-30deg)' },
        },
        'cloud-drift': {
          '0%': { transform: 'translate(-100%, -50%)' },
          '100%': { transform: 'translate(100%, 50%)' },
        },
        'pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.7' },
        }
      },
      animation: {
        'airplane-fly': 'airplane-fly 20s linear infinite',
        'cloud-drift': 'cloud-drift 40s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
