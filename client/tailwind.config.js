/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        metallic: '3px 6px 6px 3px rgba(192,192,192,0.4), 0 2px 4px -2px rgba(192,192,192,0.4)',
        deep: '0 4px 8px rgba(42, 52, 57, 0.6)',
      },
      textShadow: {
    sm: '1px 1px 2px rgba(192, 192, 192, 0.2)',           // soft silver highlight
    DEFAULT: '2px 2px 4px rgba(192, 192, 192, 0.35)',      // more prominent silver glow
    lg: '3px 3px 6px rgba(192, 192, 192, 0.5)',               // deep iron-toned shadow
  },
      colors: {
        metallic: {
          white: '#f5f5f5',// Clean, soft white
          black: '#1c1c1c',// Rich matte black
          navy: '#1a2a40',// Deep navy with subtle blue steel tint
          forest: '#234e3b',// Forest green with a mineral tone
          silver: '#c0c0c0',// Light metallic accent
          iron: '#2a3439',// Dark, steely grey (hover/secondary)
        },
      },
      fontFamily: {
        modern: ['"Inter"', 'sans-serif'],
        elegant: ['"Playfair Display"', 'serif'],
        tech: ['"Roboto Mono"', 'monospace'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-sm': {
          textShadow: '1px 1px 2px rgba(192, 192, 192, 0.2)',
        },
        '.text-shadow': {
          textShadow: '2px 2px 4px rgba(192, 192, 192, 0.35)',
        },
        '.text-shadow-lg': {
          textShadow: '3px 3px 6px rgba(192, 192, 192, 0.5)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        }
      }
      addUtilities(newUtilities, ['responsive'])
    }
  ],
}

