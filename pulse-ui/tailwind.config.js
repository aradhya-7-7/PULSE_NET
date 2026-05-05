/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        retro: {
          blue: '#00E5FF',
          pink: '#FF00FF',
          yellow: '#FFEA00',
          green: '#39FF14',
          bg: '#E5E5F7', // Classic light grayish-purple background
        }
      },
      boxShadow: {
        // This creates the harsh, solid black drop shadow typical of Web 1.0 / Neo-brutalism
        'neo': '6px 6px 0px 0px rgba(0,0,0,1)',
        'neo-sm': '3px 3px 0px 0px rgba(0,0,0,1)',
        'neo-hover': '2px 2px 0px 0px rgba(0,0,0,1)', // For button press effects
      },
      fontFamily: {
        // A mix of classic monospace and modern sans
        mono: ['"Courier New"', 'Courier', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}