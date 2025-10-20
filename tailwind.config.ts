// tailwind.config.ts
import type { Config } from 'tailwindcss';
import { colors } from './src/styles/theme'; // <-- Import your theme

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // <-- Tell Tailwind where your files are
  ],
  theme: {
    extend: {
      // This is where the magic happens
      colors: {
        primary: colors.primary,
        neutral: colors.neutral,
        success: colors.success,
        warning: colors.warning,
        error: colors.error,
      },
    },
  },
  plugins: [],
};

export default config;