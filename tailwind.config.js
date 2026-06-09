// CSS 변수 기반 색상 - 팔레트 전환 시 전체 테마 색상 자동 변경
const rgb = (v) => ({ opacityValue }) =>
  opacityValue !== undefined ? `rgba(var(${v}), ${opacityValue})` : `rgb(var(${v}))`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50:  rgb('--p-50'),
          100: rgb('--p-100'),
          200: rgb('--p-200'),
          300: rgb('--p-300'),
          400: rgb('--p-400'),
          500: rgb('--p-500'),
          600: rgb('--p-600'),
          700: rgb('--p-700'),
          800: rgb('--p-800'),
          900: rgb('--p-900'),
          950: rgb('--p-950'),
        },
        sky: {
          DEFAULT: rgb('--ac'),
          light:   rgb('--ac-l'),
          dark:    rgb('--ac-d'),
        },
        teal: {
          DEFAULT: rgb('--ac2'),
          light:   rgb('--ac2-l'),
          dark:    rgb('--ac2-d'),
        },
        amber: {
          DEFAULT: rgb('--hl'),
          light:   rgb('--hl-l'),
          dark:    rgb('--hl-d'),
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        container: '1400px',
      },
    },
  },
  plugins: [],
}
