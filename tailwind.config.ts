import type { Config } from 'tailwindcss';
const colors = require('tailwindcss/colors');

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          light: colors.indigo[50],
          DEFAULT: colors.blue[700],
        },
        error: {
          DEFAULT: colors.red[800],
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
