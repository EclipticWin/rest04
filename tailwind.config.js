export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 5-color palette
        navy: {
          50:  '#e8eef7',
          100: '#c6d4ec',
          200: '#9fb7de',
          300: '#7299d0',
          400: '#4f82c5',
          500: '#3569ba',
          600: '#2B52A3',
          700: '#1E3A8A', // Royal Blue (main brand)
          800: '#152C6E',
          900: '#0F1B2D', // Deep Navy (darkest)
          950: '#070e1a',
        },
        sky: {
          DEFAULT: '#3B82F6',
          light:   '#60A5FA',
          dark:    '#2563EB',
        },
        teal: {
          DEFAULT: '#0D9488',
          light:   '#14B8A6',
          dark:    '#0F766E',
        },
        amber: {
          DEFAULT: '#F59E0B',
          light:   '#FCD34D',
          dark:    '#D97706',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        container: '1400px',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #0F1B2D 0%, #1E3A8A 50%, #3B82F6 100%)',
        'gradient-hero':  'linear-gradient(160deg, #0F1B2D 0%, #1E3A8A 60%, #0D9488 100%)',
      },
    },
  },
  plugins: [],
}
