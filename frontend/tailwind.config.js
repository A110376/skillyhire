// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
         slideDown: {
        '0%': { transform: 'translateY(-10%)', opacity: 0 },
        '100%': { transform: 'translateY(0)', opacity: 1 },
      },
      bgMove: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
         'slide-down': 'slideDown 0.3s ease-out',
        fadeInUp: 'fadeInUp 0.5s ease forwards',
        backgroundTransition: 'bgMove 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
