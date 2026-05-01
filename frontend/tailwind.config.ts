import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        secondary: '#22d3ee',
        accent: '#f97316',
        background: '#0b0b12',
        foreground: '#f8fafc',
        muted: '#1e1e2a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
