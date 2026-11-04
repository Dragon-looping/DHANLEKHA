/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Indian Fintech Palette
        'warm-ivory': '#F7F3EA',
        'champagne-cream': '#EDE2CC',
        'pale-champagne': '#E5D2A9',
        'metallic-gold': '#C6A568',
        'antique-gold': '#A9874F',
        'muted-bronze': '#80613F',
        'deep-espresso': '#251D16',
        'obsidian-black': '#111111',
        obsidian: '#111111',
        espresso: '#251D16',
        background: {
          primary: '#111111',
          secondary: '#1C1611',
          ivory: '#F7F3EA',
          cream: '#EDE2CC',
        },
        surface: {
          DEFAULT: '#191713',       // warm charcoal
          elevated: '#251D16',      // deep espresso
          subtle: '#14120E',
          card: '#1C1611',
        },
        bronze: {
          DEFAULT: '#80613F',       // muted bronze
          dark: '#251D16',          // deep espresso
          light: '#A9874F',         // brushed antique gold
          border: 'rgba(198, 165, 104, 0.18)',
        },
        champagne: {
          DEFAULT: '#C6A568',       // soft metallic gold
          light: '#E5D2A9',         // pale champagne
          cream: '#EDE2CC',         // champagne cream
          dark: '#A9874F',          // brushed antique gold
          dim: 'rgba(198, 165, 104, 0.15)',
        },
        amber: {
          DEFAULT: '#A9874F',       // brushed antique gold
          light: '#C6A568',
          glow: 'rgba(198, 165, 104, 0.18)',
        },
        ivory: {
          DEFAULT: '#F7F3EA',       // warm ivory
          muted: '#EDE2CC',         // champagne cream
        },
        typography: {
          primary: '#F4EFE5',       // soft ivory
          secondary: '#A69A87',     // muted typography
          muted: '#6E6455',
        },
        accent: {
          emerald: '#00C99A',       // emerald accent
          primary: '#D6B77A',       // champagne gold primary
        },
        danger: {
          DEFAULT: '#E76D61',       // error
          muted: 'rgba(231, 109, 97, 0.15)',
        }
      },
      fontFamily: {
        editorial: ['"Cormorant Garamond"', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['Inter', 'monospace'],
        devanagari: ['"Noto Serif Devanagari"', '"Rozha One"', 'serif'],
        display: ['Cinzel', '"Cormorant Garamond"', 'serif'],
      },
      boxShadow: {
        'golden-glow': '0 0 50px -10px rgba(229, 169, 75, 0.28), 0 0 1px 1px rgba(214, 183, 122, 0.25)',
        'champagne-glow': '0 0 35px rgba(214, 183, 122, 0.18)',
        'amber-radiance': '0 20px 60px -15px rgba(229, 169, 75, 0.25)',
        'cinematic': '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 1px 1px rgba(214, 183, 122, 0.12)',
      },
      backgroundImage: {
        'radial-amber': 'radial-gradient(circle at 50% 40%, rgba(229, 169, 75, 0.14) 0%, rgba(214, 183, 122, 0.04) 40%, transparent 70%)',
        'golden-gradient': 'linear-gradient(135deg, #F4EFE5 0%, #D6B77A 50%, #B89758 100%)',
      }
    },
  },
  plugins: [],
}
