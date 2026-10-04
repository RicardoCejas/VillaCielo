/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#173b32',
          light: '#245447',
          dark: '#0e2620',
          deep: '#0a1a15',
        },
        moss: {
          DEFAULT: '#68a691',
          light: '#88bea9',
          dark: '#4e8573',
        },
        mint: {
          DEFAULT: '#d9eee4',
          light: '#eef8f3',
          dark: '#bfe2d3',
        },
        cream: {
          DEFAULT: '#f7f3e8',
          light: '#fbf8f2',
          dark: '#eae4d2',
        },
        paper: '#fffdf8',
        ink: '#18302a',
        muted: '#6c7b75',
        line: '#dfe5df',
        coral: {
          DEFAULT: '#e76f51',
          light: '#f8cabb',
          dark: '#c75135',
        },
        sun: {
          DEFAULT: '#f4c95d',
          light: '#fae9b1',
          dark: '#e0b240',
        },
        sky: {
          DEFAULT: '#a8d8e8',
          light: '#dceff5',
        },
        lilac: {
          DEFAULT: '#d8c7e8',
          light: '#e9def1',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        serif: ['Fraunces', 'serif'],
      },
      boxShadow: {
        'soft': '0 8px 24px rgba(23, 59, 50, 0.08)',
        'card': '0 12px 30px rgba(23, 59, 50, 0.12)',
        'phone': '0 30px 80px rgba(18, 36, 31, 0.4), 0 8px 24px rgba(18, 36, 31, 0.25)',
      }
    },
  },
  plugins: [],
}
