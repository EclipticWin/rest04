export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#e8eef7',
          100: '#c5d0e8',
          200: '#9eb1d8',
          300: '#7492c8',
          400: '#507ab9',
          500: '#3562aa',
          600: '#2B4F8E',
          700: '#1E3A8A',
          800: '#152A6E',
          900: '#0F1B2D',
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
